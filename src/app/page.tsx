'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html, useGLTF, Environment, OrbitControls, useVideoTexture, useTexture } from '@react-three/drei';
import { Suspense, useCallback, useEffect, useMemo, useRef, useState, type MutableRefObject } from 'react';
import * as THREE from 'three';
import { motion, useScroll, useTransform } from 'framer-motion';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

// --- CONFIG ---
// Używamy skalibrowanych wartości z V5 (Mobile First)
const CONFIG = {
    rotY: 1.64,
    hideShell: true,
    scale: 0.6,
    camOffsetLeft: 3.5,
    camOffsetDist: 3.0,
    camPosition: [0, 0.5, 5.0] as [number, number, number]
};

// --- TYPY ---
type CamSetupData = { position: THREE.Vector3, target: THREE.Vector3 };

// --- KOMPONENTY SCENY ---

function StudioModel({ onCamSetup }: { onCamSetup: (data: CamSetupData) => void }) {
    const { scene } = useGLTF('/virtual_studio_ver_02.glb');
    const videoTex = useVideoTexture('/assets/video/drzewo_video.mp4');

    useEffect(() => {
        scene.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                const name = child.name.toLowerCase();

                // Ukrywanie ścian (Shell)
                child.visible = false;

                const tempBox = new THREE.Box3().setFromObject(child);
                const size = tempBox.getSize(new THREE.Vector3());
                const center = tempBox.getCenter(new THREE.Vector3());
                const distFromCenter = center.distanceTo(new THREE.Vector3(0, 0, 0));
                const maxDim = Math.max(size.x, size.y, size.z);

                // EKRAN GŁÓWNY
                const isScreenName = name.includes('object003_photostudio_1003') || name.includes('rectangle002') ||
                    name.includes('screen') || name.includes('monitor') || name.includes('tv') ||
                    name.includes('rectangle003');

                if (isScreenName) {
                    child.visible = true;
                    const mesh = child as THREE.Mesh;

                    // Fix for artifacts:
                    // 1. Revert flipY to true (standard for this model)
                    // 2. Use ClampToEdgeWrapping to stop tiling
                    // 3. Slightly zoom in (repeat < 1) to crop edge pixels causing streaks
                    // 4. Use LinearFilter to smooth edges
                    videoTex.wrapS = THREE.ClampToEdgeWrapping;
                    videoTex.wrapT = THREE.ClampToEdgeWrapping;
                    videoTex.minFilter = THREE.LinearFilter;
                    videoTex.magFilter = THREE.LinearFilter;
                    videoTex.repeat.set(0.95, 0.95); // More aggressive crop to be safe
                    videoTex.offset.set(0.025, 0.025);
                    videoTex.flipY = true;

                    mesh.material = new THREE.MeshBasicMaterial({
                        map: videoTex,
                        toneMapped: false,
                        side: THREE.DoubleSide
                    });

                    // Logika Kamery
                    if (name.includes('object003')) {
                        child.updateWorldMatrix(true, false);
                        const bbox = new THREE.Box3().setFromObject(child);
                        const target = new THREE.Vector3();
                        bbox.getCenter(target);

                        const dir = new THREE.Vector3();
                        child.getWorldDirection(dir);

                        const dist = CONFIG.camOffsetDist;
                        const shiftLeft = CONFIG.camOffsetLeft;
                        const camPos = target.clone().add(dir.clone().multiplyScalar(dist));

                        const up = new THREE.Vector3(0, 1, 0);
                        const right = new THREE.Vector3().crossVectors(up, dir).normalize();
                        const shiftVec = right.clone().multiplyScalar(-shiftLeft);

                        camPos.add(shiftVec);
                        target.add(shiftVec);

                        onCamSetup({ position: camPos, target: target });
                    }
                    return;
                }

                // GŁADKA PODŁOGA
                if (name.includes('floor') || name.includes('ground') || name.includes('plane') || name.includes('circle')) {
                    if (distFromCenter < 100.0) {
                        child.visible = true;
                        (child as THREE.Mesh).material = new THREE.MeshStandardMaterial({
                            color: '#050505',
                            roughness: 0.05,
                            metalness: 0.8,
                            envMapIntensity: 1.0
                        });
                        return;
                    }
                }

                // SPRZĘT
                const isBanned = name.includes('box') || name.includes('wall') || name.includes('plant') ||
                    name.includes('leaf') || name.includes('rock') || name.includes('stone') || name.includes('temp') || name.includes('1002') ||
                    name.includes('decoration') || name.includes('ivy') || name.includes('vine') || name.includes('grass') ||
                    name.includes('bush') || name.includes('flower') || name.includes('geo') || name.includes('shape');

                if (isBanned) return;
                if (distFromCenter > 10.0) return;

                const isInsideSafeZone = Math.abs(center.x) < 2.5 && (center.y > -0.5 && center.y < 2.5) && Math.abs(center.z) < 3.0;
                if (isInsideSafeZone && maxDim < 1.2) {
                    if (name.startsWith('cam') || name.startsWith('flap') || name.startsWith('body')) {
                        if (!(name.startsWith('body') && maxDim > 0.5)) {
                            child.visible = true;
                        }
                    }
                }
            }
        });
    }, [scene, onCamSetup, videoTex]);

    return (
        <primitive
            object={scene}
            position={[0, 0, 0]}
            rotation={[0, CONFIG.rotY, 0]}
            scale={[CONFIG.scale, CONFIG.scale, CONFIG.scale]}
        />
    );
}

function TreeLogoModel() {
    const { scene } = useGLTF('/assets/models/sample_model.glb');

    useEffect(() => {
        scene.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                // Opcjonalnie: Dodaj materiał emisyjny lub metaliczny jeśli to logo
                /*
               (child as THREE.Mesh).material = new THREE.MeshStandardMaterial({
                   color: '#00ff99',
                   metalness: 0.9,
                   roughness: 0.1
               });
               */
            }
        });
    }, [scene]);

    // Pozycja dobrana tak, aby była widoczna w kadrze (zależy od kamery)
    // Mobile Cam jest blisko (Dist 3.0), więc model musi być blisko celu
    return (
        <primitive
            object={scene}
            position={[1.5, 0.8, -0.5]}
            rotation={[0, -Math.PI / 3, 0]}
            scale={[0.8, 0.8, 0.8]}
        />
    );
}


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

    useFrame((state) => {
        if (points.current) {
            // points.current.rotation.y = state.clock.getElapsedTime() * 0.01;
        }
    });

    return (
        <points ref={points}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" array={positions} count={count} itemSize={3} />
            </bufferGeometry>
            <pointsMaterial size={0.03} color="#ffffff" transparent opacity={0.8} blending={THREE.AdditiveBlending} depthWrite={false} />
        </points>
    );
}

function CosmicSnow({ count = 300 }) {
    const mesh = useRef<THREE.Group>(null);
    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            temp.push({
                t: Math.random() * 100,
                factor: 20 + Math.random() * 100,
                speed: 0.01 + Math.random() / 200,
                xFactor: -15 + Math.random() * 30,
                yFactor: -5 + Math.random() * 15,
                zFactor: -20 + Math.random() * 40
            });
        }
        return temp;
    }, [count]);

    /*
    useFrame(() => {
        if (!mesh.current) return;
        particles.forEach((particle, i) => {
            let { t, factor, speed, xFactor, yFactor, zFactor } = particle;
            t = particle.t += speed / 2;
            const a = Math.cos(t) + Math.sin(t * 1) / 10;
            const b = Math.sin(t) + Math.cos(t * 2) / 10;
            const child = mesh.current!.children[i] as THREE.Mesh;
            child.position.set(
                a + xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
                b + yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
                b + zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10
            );
        });
    });
    */

    return (
        <group ref={mesh}>
            {particles.map((_, i) => (
                <mesh key={i}>
                    <sphereGeometry args={[0.04, 6, 6]} />
                    <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={2} transparent opacity={0.4} />
                </mesh>
            ))}
        </group>
    );
}

function LightingReveal() {
    return (
        <>
            <ambientLight intensity={0.5} color="#1a0a2e" />
            <spotLight position={[0, 10, -5]} angle={0.8} penumbra={0.5} intensity={2.0} color="#8b5cf6" castShadow />
            <pointLight position={[5, 3, 2]} intensity={1.5} color="#ec4899" distance={15} />
            <pointLight position={[-5, 3, 2]} intensity={1.5} color="#8b5cf6" distance={15} />
        </>
    );
}

function CameraSetup({ setupData, controlsRef }: { setupData: CamSetupData | null; controlsRef: MutableRefObject<OrbitControlsImpl | null> }) {
    const { camera } = useThree();
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        if (!setupData || !controlsRef.current || initialized) return;
        camera.position.copy(setupData.position);
        controlsRef.current.target.copy(setupData.target);
        camera.updateProjectionMatrix();
        controlsRef.current.update();
        setInitialized(true);
    }, [camera, setupData, controlsRef, initialized]);

    return null;
}

// --- LANDING PAGE KOMPONENT ---
export default function HomePage() {
    const [camSetup, setCamSetup] = useState<CamSetupData | null>(null);
    const controlsRef = useRef<OrbitControlsImpl | null>(null);

    // Zapobiegamy kolizji z iframe reklamowymi jeśli by się pojawiały (z V5 kodu)
    useEffect(() => {
        const style = document.createElement('style');
        style.innerHTML = `body > iframe[style*="z-index: 2147483647"] { display: none !important; } nextjs-portal { display: none !important; }`;
        document.head.appendChild(style);
        return () => { document.head.removeChild(style); };
    }, []);

    return (
        <main className="relative w-full min-h-screen bg-[#020617] text-white overflow-x-hidden selection:bg-purple-500/30">

            {/* 1. SECTION: INTRO (3D SCENE) */}
            <section className="relative w-full h-screen z-0">
                <div className="absolute inset-0 z-0">
                    <Canvas shadows camera={{ position: CONFIG.camPosition, fov: 60 }}>
                        <color attach="background" args={['#050208']} />
                        <StarField count={4000} />
                        <CosmicSnow count={150} />
                        <LightingReveal />
                        <Suspense fallback={null}>
                            <StudioModel onCamSetup={setCamSetup} />
                            <SwarmLogo />
                            <Environment preset="night" blur={0.8} background={false} />
                        </Suspense>
                        <CameraSetup setupData={camSetup} controlsRef={controlsRef} />
                        <OrbitControls
                            ref={controlsRef}
                            enablePan={false}
                            enableZoom={false}
                            autoRotate={false}
                            minPolarAngle={Math.PI / 2.5}
                            maxPolarAngle={Math.PI / 1.8}
                        />
                    </Canvas>
                </div>

                {/* OVERLAY INTRO TEXT REMOVED (Replaced by 3D SwarmLogo) */}
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none p-6">
                    {/* Placeholder for layout spacing if needed, but text is now in 3D */}
                </div>

                <div className="absolute bottom-10 left-0 right-0 z-10 flex justify-center animate-bounce pointer-events-none">
                    <span className="text-xs tracking-widest text-white/30 uppercase">Scroll to Explore</span>
                </div>
            </section>

            {/* 2. SECTION: VALUE PROP */}
            <section className="relative z-10 bg-gradient-to-b from-[#050208] to-[#0a0a0a] py-24 px-6">
                <div className="max-w-4xl mx-auto text-center space-y-12">
                    <motion.h2
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-light leading-tight text-white/90"
                    >
                        You won&apos;t be ignored.<br />
                        <span className="text-purple-400 font-normal">If you can book — you will.</span><br />
                        <span className="text-gray-500 text-2xl md:text-4xl">If you can&apos;t — you&apos;ll know why.</span>
                    </motion.h2>

                    <div className="grid md:grid-cols-3 gap-8 pt-12">
                        {[
                            { title: "Peace of Mind", desc: "Silence the chaos of missed calls." },
                            { title: "Certainty", desc: "Immediate answers. No guessing." },
                            { title: "Control", desc: "You set the rules. We guard them." }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.2, duration: 0.8 }}
                                viewport={{ once: true }}
                                className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm"
                            >
                                <h3 className="text-xl font-medium text-purple-300 mb-2">{item.title}</h3>
                                <p className="text-gray-400 text-sm">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. SECTION: THE PROMISE (Using the Avatar Persona) */}
            <section className="relative z-10 bg-[#0a0a0a] py-24 px-6 border-t border-white/5">
                <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center gap-12">
                    <div className="flex-1 space-y-6">
                        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                            Your Digital Gatekeeper
                        </h2>
                        <p className="text-lg text-gray-300 leading-relaxed">
                            &quot;I am here to handle the chaos so you can focus on the craft. I don&apos;t just answer phones. I create order.&quot;
                        </p>
                        <p className="text-sm text-gray-500">
                            FlowAssist filters the noise, secures bookings, and politely explains availability. No marketing scripts. Just clear communication.
                        </p>
                    </div>
                    <div className="relative w-full max-w-xs aspect-square rounded-full bg-gradient-to-tr from-cyan-900/40 to-purple-900/40 blur-3xl" />
                </div>
            </section>

            {/* 4. SECTION: CTA */}
            <section className="relative z-10 py-32 bg-black text-center px-6">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="max-w-2xl mx-auto space-y-8"
                >
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">Start Control Space</h2>
                    <p className="text-gray-400 mb-10">Stop losing clients to silence.</p>

                    <a href="#" className="inline-block px-10 py-4 bg-white text-black font-bold rounded-full hover:bg-purple-50 transition-colors transform hover:scale-105 duration-200">
                        Get FlowAssist
                    </a>
                </motion.div>

                <footer className="mt-32 text-center text-gray-700 text-sm">
                    <p>FlowAssist &copy; {new Date().getFullYear()}. Smart Business.</p>
                </footer>
            </section>

        </main>
    );
}

function SwarmLogo() {
    const tex = useTexture('/assets/textures/logo_flowassist.png');
    const points = useRef<THREE.Points>(null);

    // Shader Uniforms
    const uniforms = useMemo(() => ({
        uTex: { value: tex },
        uTime: { value: 0 },
        uProgress: { value: 0 }
    }), [tex]);

    useFrame((state) => {
        if (points.current) {
            const material = points.current.material as THREE.ShaderMaterial;
            material.uniforms.uTime.value = state.clock.elapsedTime;

            // Animate progress from 0 to 1 smoothly
            material.uniforms.uProgress.value = THREE.MathUtils.lerp(
                material.uniforms.uProgress.value,
                1,
                0.015 // Speed of formation
            );
        }
    });

    const vertexShader = `
        uniform float uTime;
        uniform float uProgress;
        varying vec2 vUv;
        varying float vAlpha;

        // Simple noise 
        float random(vec2 st) {
            return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
        }

        void main() {
            vUv = uv;
            vec3 pos = position;
            
            // Generate a random scatter direction based on UV
            float r = random(uv) * 2.0 * 3.14159;
            float dist = random(uv + 1.0) * 10.0;
            
            vec3 scatteredPos = pos + vec3(cos(r) * dist, sin(r) * dist, dist * 0.5);
            
            // Wavy floating effect when formed
            float wave = sin(pos.x * 2.0 + uTime) * 0.1;
            pos.y += wave;

            // Mix scatter and formed state
            vec3 finalPos = mix(scatteredPos, pos, smoothstep(0.0, 1.0, uProgress));

            vec4 mvPosition = modelViewMatrix * vec4(finalPos, 1.0);
            gl_PointSize = 3.0 * (2.0 / -mvPosition.z); // Size attenuation
            gl_Position = projectionMatrix * mvPosition;
        }
    `;

    const fragmentShader = `
        uniform sampler2D uTex;
        varying vec2 vUv;

        void main() {
            vec4 texColor = texture2D(uTex, vUv);
            if (texColor.a < 0.1) discard; 
            
            // Use original color mixed with electric blue based on alpha/intensity
            gl_FragColor = texColor;
        }
    `;

    return (
        <points ref={points} position={[0, 0.5, 3.5]} scale={[4, 2, 1]} rotation={[0, 0, 0]}>
            <planeGeometry args={[1, 1, 256, 128]} />
            <shaderMaterial
                uniforms={uniforms}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                transparent={true}
                depthWrite={false}
                blending={THREE.NormalBlending}
            />
        </points>
    );
}
