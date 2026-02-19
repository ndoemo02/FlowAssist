'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { usePearlMaterial, PearlSphere } from '../materials/PearlMaterial';
import { CarbonRing, useCarbonMaterial } from '../materials/CarbonMaterial';

/**
 * Status type for Safe Layer visualization
 */
export type SafeLayerStatus = 'online' | 'processing' | 'error' | 'offline';

/**
 * StatusPearl Component
 * Pulsating pearl surrounded by carbon ring for Safe Layer status
 */
interface StatusPearlProps {
    position?: [number, number, number];
    scale?: number;
    status?: SafeLayerStatus;
    pulseSpeed?: number;
}

export function StatusPearl({
    position = [0, 0, 0],
    scale = 1,
    status = 'online',
    pulseSpeed = 1.5
}: StatusPearlProps) {
    const groupRef = useRef<THREE.Group>(null);
    const pearlRef = useRef<THREE.Mesh>(null);
    const ringRef = useRef<THREE.Mesh>(null);

    // Status-based colors
    const statusColors: Record<SafeLayerStatus, string> = {
        online: '#f8f8f8',      // Pearl white
        processing: '#e8e8ff',   // Soft blue pearl
        error: '#8B0000',        // Deep red
        offline: '#404040'       // Gray
    };

    const pearlMaterial = usePearlMaterial({ color: statusColors[status] });
    const carbonMaterial = useCarbonMaterial({
        emissive: status === 'error',
        emissiveColor: '#8B0000'
    });

    useFrame((state) => {
        if (!pearlRef.current || !ringRef.current) return;

        const t = state.clock.elapsedTime;

        // Pulse animation based on status
        if (status === 'online') {
            // Calm, slow pulse
            const s = 1 + Math.sin(t * pulseSpeed) * 0.08;
            pearlRef.current.scale.setScalar(s);
        } else if (status === 'processing') {
            // Faster pulse
            const s = 1 + Math.sin(t * 3) * 0.1;
            pearlRef.current.scale.setScalar(s);
        } else if (status === 'error') {
            // Rapid, urgent pulse
            const s = 1 + Math.sin(t * 8) * 0.15;
            pearlRef.current.scale.setScalar(s);

            // Carbon ring glows red
            (carbonMaterial as THREE.MeshPhysicalMaterial).emissiveIntensity =
                0.5 + Math.sin(t * 4) * 0.5;
        }

        // Ring rotation
        ringRef.current.rotation.z = t * 0.3;
    });

    return (
        <group ref={groupRef} position={position} scale={scale}>
            {/* Pearl sphere */}
            <mesh ref={pearlRef} castShadow>
                <sphereGeometry args={[0.06, 32, 32]} />
                <primitive object={pearlMaterial} attach="material" />
            </mesh>

            {/* Carbon ring around pearl */}
            <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.08, 0.11, 32]} />
                <primitive object={carbonMaterial} attach="material" />
            </mesh>

            {/* Outer glow ring (for online status) */}
            {status === 'online' && (
                <mesh rotation={[-Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[0.12, 0.14, 32]} />
                    <meshBasicMaterial
                        color="#ffffff"
                        transparent
                        opacity={0.2}
                        blending={THREE.AdditiveBlending}
                    />
                </mesh>
            )}
        </group>
    );
}

/**
 * Multiple StatusPearl indicators for dashboard overview
 */
interface StatusPearlArrayProps {
    position?: [number, number, number];
    statuses: SafeLayerStatus[];
    spacing?: number;
}

export function StatusPearlArray({
    position = [0, 0, 0],
    statuses,
    spacing = 0.25
}: StatusPearlArrayProps) {
    return (
        <group position={position}>
            {statuses.map((status, i) => (
                <StatusPearl
                    key={i}
                    position={[(i - (statuses.length - 1) / 2) * spacing, 0, 0]}
                    status={status}
                    scale={0.8}
                />
            ))}
        </group>
    );
}
