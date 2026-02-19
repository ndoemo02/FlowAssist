'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html, useGLTF, Environment, OrbitControls, useVideoTexture, useTexture } from '@react-three/drei';
import { Suspense, useCallback, useEffect, useMemo, useRef, useState, type MutableRefObject } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

// --- CONFIG ---
const CONFIG = {
    rotY: 1.64,
    hideShell: true,
    scale: 0.6,
    camOffsetLeft: 3.5,
    camOffsetDist: 3.0,
    camPosition: [0, 0.5, 5.0] as [number, number, number]
};

type CamSetupData = { position: THREE.Vector3, target: THREE.Vector3 };

// --- SANDBOX COMPONENTS (Isolated here) ---

function StarField({ count = 8000 }) {
    const points = useRef<THREE.Points>(null);
    const positions = useMemo(() => {
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const radius = 30 + Math.random() * 80;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
            pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            pos[i * 3 + 2] = radius * Math.cos(phi);
        }
        return pos;
    }, [count]);

    return (
        <points ref={points}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" array={positions} count={count} itemSize={3} />
            </bufferGeometry>
            <pointsMaterial size={0.03} color="#ffffff" transparent opacity={0.8} blending={THREE.AdditiveBlending} depthWrite={false} />
        </points>
    );
}

function SwarmLogo() {
    const tex = useTexture('/assets/textures/logo_flowassist.png');
    const points = useRef<THREE.Points>(null);
    const uniforms = useMemo(() => ({
        uTex: { value: tex },
        uTime: { value: 0 },
        uProgress: { value: 0 }
    }), [tex]);

    useFrame((state) => {
        if (points.current) {
            const material = points.current.material as THREE.ShaderMaterial;
            material.uniforms.uTime.value = state.clock.elapsedTime;
            material.uniforms.uProgress.value = THREE.MathUtils.lerp(material.uniforms.uProgress.value, 1, 0.015);
        }
    });

    const vertexShader = `
        uniform float uTime;
        uniform float uProgress;
        varying vec2 vUv;
        void main() {
            vUv = uv;
            vec3 pos = position;
            float r = fract(sin(dot(uv.xy, vec2(12.9898,78.233))) * 43758.5453) * 2.0 * 3.14159;
            float dist = fract(sin(dot(uv.xy, vec2(93.9898,67.233))) * 43758.5453) * 10.0;
            vec3 scatteredPos = pos + vec3(cos(r) * dist, sin(r) * dist, dist * 0.5);
            vec3 finalPos = mix(scatteredPos, pos, smoothstep(0.0, 1.0, uProgress));
            vec4 mvPosition = modelViewMatrix * vec4(finalPos, 1.0);
            gl_PointSize = 3.0 * (2.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
        }
    `;

    const fragmentShader = `
        uniform sampler2D uTex;
        varying vec2 vUv;
        void main() {
            vec4 texColor = texture2D(uTex, vUv);
            if (texColor.a < 0.1) discard; 
            gl_FragColor = texColor;
        }
    `;

    return (
        <points ref={points} position={[0, 0.4, 3.2]} scale={[4, 2, 1]}>
            <planeGeometry args={[1, 1, 128, 64]} />
            <shaderMaterial
                uniforms={uniforms}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                transparent={true}
                depthWrite={false}
            />
        </points>
    );
}

function StudioModel({ onCamSetup }: { onCamSetup: (data: CamSetupData) => void }) {
    const { scene } = useGLTF('/virtual_studio_ver_02.glb');
    const videoTex = useVideoTexture('/assets/video/drzewo_video.mp4');

    useEffect(() => {
        scene.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
                child.visible = false;
                const name = child.name.toLowerCase();
                const isScreen = name.includes('object003') || name.includes('screen') || name.includes('monitor');

                if (isScreen) {
                    child.visible = true;
                    videoTex.wrapS = videoTex.wrapT = THREE.ClampToEdgeWrapping;
                    videoTex.flipY = true;
                    (child as THREE.Mesh).material = new THREE.MeshBasicMaterial({ map: videoTex });

                    if (name.includes('object003')) {
                        const target = new THREE.Vector3();
                        new THREE.Box3().setFromObject(child).getCenter(target);
                        const dir = new THREE.Vector3();
                        child.getWorldDirection(dir);
                        const camPos = target.clone().add(dir.multiplyScalar(3.0)).add(new THREE.Vector3(3.5, 0, 0));
                        onCamSetup({ position: camPos, target });
                    }
                }
                if (name.includes('floor')) {
                    child.visible = true;
                }
            }
        });
    }, [scene, onCamSetup, videoTex]);

    return <primitive object={scene} scale={0.6} rotation={[0, 1.64, 0]} />;
}

function CameraSetup({ setupData, controlsRef }: { setupData: CamSetupData | null; controlsRef: MutableRefObject<OrbitControlsImpl | null> }) {
    const { camera } = useThree();
    useEffect(() => {
        if (!setupData || !controlsRef.current) return;
        camera.position.copy(setupData.position);
        controlsRef.current.target.copy(setupData.target);
        camera.updateProjectionMatrix();
        controlsRef.current.update();
    }, [camera, setupData, controlsRef]);
    return null;
}

export default function SandboxPage() {
    const [camSetup, setCamSetup] = useState<CamSetupData | null>(null);
    const controlsRef = useRef<OrbitControlsImpl | null>(null);

    return (
        <main className="w-full h-screen bg-black overflow-hidden relative">
            <div className="absolute top-10 left-10 z-10 text-white/50 font-mono text-xs tracking-widest uppercase">
                Sandbox // Legacy Environment
            </div>

            <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
                <color attach="background" args={['#050208']} />
                <StarField />
                <Suspense fallback={null}>
                    <StudioModel onCamSetup={setCamSetup} />
                    <SwarmLogo />
                    <Environment preset="night" />
                </Suspense>
                <CameraSetup setupData={camSetup} controlsRef={controlsRef} />
                <OrbitControls ref={controlsRef} />
            </Canvas>

            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />
        </main>
    );
}
