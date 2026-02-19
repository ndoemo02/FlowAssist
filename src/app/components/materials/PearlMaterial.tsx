'use client';

import * as THREE from 'three';
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';

/**
 * Creates a Pearl MeshPhysicalMaterial with Iridescence
 * - White base with rainbow iridescent shimmer
 * - High clearcoat for luxury finish
 * - Sheen for soft glow
 */
export function usePearlMaterial(options: {
    color?: string;
    intensity?: number;
    animated?: boolean;
} = {}) {
    const material = useMemo(() => {
        return new THREE.MeshPhysicalMaterial({
            // Pearl white base
            color: new THREE.Color(options.color || '#f8f8f8'),
            metalness: 0.1,
            roughness: 0.15,

            // Iridescence - the rainbow shimmer effect
            iridescence: 1.0,
            iridescenceIOR: 1.5, // Index of refraction for iridescence
            iridescenceThicknessRange: [100, 400], // Film thickness range (nm)

            // Clearcoat for glossy finish
            clearcoat: 1.0,
            clearcoatRoughness: 0.1,

            // Sheen for soft pearlescent glow
            sheen: 1.0,
            sheenColor: new THREE.Color('#ffffff'),
            sheenRoughness: 0.2,

            // High reflectivity
            reflectivity: 1.0,
            envMapIntensity: 2.0,
        });
    }, [options.color]);

    return material;
}

/**
 * Pearl Sphere Component
 * Use for status indicators and interactive elements
 */
interface PearlSphereProps {
    position?: [number, number, number];
    radius?: number;
    pulsate?: boolean;
    pulseSpeed?: number;
    pulseScale?: number;
    color?: string;
}

export function PearlSphere({
    position = [0, 0, 0],
    radius = 0.1,
    pulsate = false,
    pulseSpeed = 1.5,
    pulseScale = 0.1,
    color = '#f8f8f8'
}: PearlSphereProps) {
    const material = usePearlMaterial({ color });
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (pulsate && meshRef.current) {
            const scale = 1 + Math.sin(state.clock.elapsedTime * pulseSpeed) * pulseScale;
            meshRef.current.scale.setScalar(scale);
        }
    });

    return (
        <mesh
            ref={meshRef}
            position={position}
            castShadow
        >
            <sphereGeometry args={[radius, 32, 32]} />
            <primitive object={material} attach="material" />
        </mesh>
    );
}

/**
 * Pearl Button Component
 * Use for interactive UI elements in 3D space
 */
interface PearlButtonProps {
    position?: [number, number, number];
    size?: [number, number, number];
    onClick?: () => void;
}

export function PearlButton({
    position = [0, 0, 0],
    size = [0.5, 0.15, 0.05],
    onClick
}: PearlButtonProps) {
    const material = usePearlMaterial();
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (meshRef.current) {
            // Subtle breathing animation
            const scale = 1 + Math.sin(state.clock.elapsedTime * 0.8) * 0.02;
            meshRef.current.scale.setScalar(scale);
        }
    });

    return (
        <mesh
            ref={meshRef}
            position={position}
            onClick={onClick}
            castShadow
        >
            <boxGeometry args={size} />
            <primitive object={material} attach="material" />
        </mesh>
    );
}

/**
 * iPad Pearl Overlay Material
 * Apply to iPad frame for iridescent effect
 */
export function useIPadPearlMaterial() {
    return usePearlMaterial({
        color: '#e8e8e8',
        intensity: 0.8
    });
}
