'use client';

import { useVideoTexture, Float } from '@react-three/drei';
import * as THREE from 'three';
import { Suspense, useState } from 'react';

export default function AvatarAssistant({ position = [-2.8, 0, 1.5], rotation = [0, 0.5, 0] }: { position?: [number, number, number], rotation?: [number, number, number] }) {
    // Load video texture
    // SUSPENSE handled in parent
    const texture = useVideoTexture('/images/avatarvid.mp4', {
        unsuspend: 'canplay',
        muted: true,
        loop: true,
        start: true,
        crossOrigin: 'Anonymous'
    });

    // Fix texture settings for clean look
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.encoding = THREE.sRGBEncoding;
    // texture.flipY = false; // Adjust if upside down

    const [hovered, setHover] = useState(false);

    return (
        <group position={position} rotation={rotation}>
            <Float speed={2} rotationIntensity={0.2} floatIntensity={0.2}>
                {/* Screen Frame */}
                <mesh position={[0, 0, -0.02]}>
                    <planeGeometry args={[1.7, 1.0]} /> {/* 16:9 like ratio approximately (1.7 : 1) */}
                    <meshBasicMaterial color="#000000" side={THREE.DoubleSide} />
                </mesh>

                {/* Glowing Border */}
                <mesh position={[0, 0, -0.03]}>
                    <planeGeometry args={[1.75, 1.05]} />
                    <meshBasicMaterial color="#8b5cf6" transparent opacity={0.3} side={THREE.DoubleSide} />
                </mesh>

                {/* Video Screen */}
                <mesh
                    onPointerOver={() => setHover(true)}
                    onPointerOut={() => setHover(false)}
                >
                    <planeGeometry args={[1.6, 0.9]} />
                    <meshBasicMaterial
                        map={texture}
                        toneMapped={false}
                        side={THREE.DoubleSide}
                        transparent
                        opacity={0.9} // Slight transparency for hologram feel
                    />
                </mesh>

                {/* Label */}
                {hovered && (
                    <group position={[0, -0.6, 0]}>
                        {/* Simple text mesh or sprite could go here, omitting for now to keep it clean */}
                    </group>
                )}
            </Float>
        </group>
    );
}

// Preload removed due to API change in drei
// useVideoTexture.preload('/images/avatarvid.mp4');
