'use client';

import { useGLTF, useVideoTexture, Float, Sparkles, useScroll, useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';

// --- ASSETS ---
// Assuming models are copied to public/assets/models/
const STUDIO_PATH = '/assets/models/virtual_studio_ver_02.glb';
const LOGO_PATH = '/assets/models/sample_model.glb';
const VIDEO_PATH = '/assets/video/drzewo_video.mp4';

function StudioModel() {
    const { scene } = useGLTF(STUDIO_PATH);
    const videoTex = useVideoTexture(VIDEO_PATH);

    useEffect(() => {
        // Material & Visibility Logic (Same as V1)
        scene.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                const name = child.name.toLowerCase();

                // 1. Hide unwanted shell/walls
                const unwanted = ['box', 'wall', 'plant', 'rock', 'stone', 'temp', 'decoration', 'ivy', 'vine'];
                if (unwanted.some(u => name.includes(u))) {
                    child.visible = false;
                }

                // 2. Identify Screen
                if (name.includes('object003') || name.includes('screen') || name.includes('monitor')) {
                    child.visible = true;
                    (child as THREE.Mesh).material = new THREE.MeshBasicMaterial({
                        map: videoTex,
                        toneMapped: false // Make it bright
                    });
                    videoTex.flipY = true;
                }

                // 3. Floor (Glossy Black)
                if (name.includes('floor') || name.includes('ground')) {
                    child.visible = true;
                    (child as THREE.Mesh).material = new THREE.MeshStandardMaterial({
                        color: '#020202',
                        roughness: 0.1,
                        metalness: 0.8
                    });
                }
            }
        });
    }, [scene, videoTex]);

    return (
        <primitive
            object={scene}
            rotation={[0, 1.64, 0]}
            scale={0.6} // Matches V1 calibration
        />
    );
}

// Removed duplicate import

function LogoModel() {
    const { scene } = useGLTF(LOGO_PATH);
    const scroll = useScroll();
    const logoRef = useRef<THREE.Group>(null);

    useFrame(() => {
        if (!logoRef.current || !scroll) return;

        // Full 360 rotation over scroll progress
        const r1 = scroll.range(0, 1);
        logoRef.current.rotation.y = -Math.PI / 2 + (r1 * Math.PI * 2);
    });

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <primitive
                ref={logoRef}
                object={scene}
                position={[0, -1.0, 0]}
                rotation={[0, -Math.PI / 2, 0]}
                scale={0.8}
            />
        </Float>
    );
}

function Lights() {
    return (
        <>
            <ambientLight intensity={0.2} color="#1a0a2e" />

            {/* Main Key Light */}
            <spotLight
                position={[5, 10, 5]}
                angle={0.5}
                penumbra={1}
                intensity={100}
                color="#06b6d4" // Cyan
                castShadow
                shadow-bias={-0.0001}
            />

            {/* Rim Light (Purple) */}
            <spotLight
                position={[-5, 5, -5]}
                angle={0.5}
                penumbra={1}
                intensity={80}
                color="#8b5cf6"
            />
        </>
    );
}

// Removed duplicate import

function ControlSpaceBackground() {
    // Using user's high-quality photography
    const texture = useTexture('/assets/images/image (8).webp');
    const scroll = useScroll();
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame(() => {
        if (!meshRef.current || !scroll) return;
        // Fade in when scrolling down
        const r1 = scroll.range(0, 1);
        const material = meshRef.current.material as THREE.MeshBasicMaterial;
        material.opacity = r1; // Starts invisible, fades in
    });

    return (
        <mesh ref={meshRef} rotation={[0, -Math.PI / 2, 0]}>
            <sphereGeometry args={[20, 60, 40]} />
            <meshBasicMaterial
                map={texture}
                side={THREE.BackSide}
                transparent
                opacity={0}
            />
        </mesh>
    );
}

export default function SceneContent() {
    return (
        <>
            <Lights />
            <StudioModel />
            <LogoModel />
            <ControlSpaceBackground />

            {/* Particles "Cosmic Dust" */}
            <Sparkles
                count={500}
                scale={12}
                size={2}
                speed={0.4}
                opacity={0.5}
                color="#06b6d4"
            />
        </>
    );
}
