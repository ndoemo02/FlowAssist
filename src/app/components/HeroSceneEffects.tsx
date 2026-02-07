'use client';

import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

export function StarField({ count = 8000 }) {
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

export function CosmicSnow({ count = 300 }) {
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

export function LightingReveal() {
    return (
        <>
            <ambientLight intensity={0.5} color="#1a0a2e" />
            <spotLight position={[0, 10, -5]} angle={0.8} penumbra={0.5} intensity={2.0} color="#8b5cf6" castShadow />
            <pointLight position={[5, 3, 2]} intensity={1.5} color="#ec4899" distance={15} />
            <pointLight position={[-5, 3, 2]} intensity={1.5} color="#8b5cf6" distance={15} />
        </>
    );
}
