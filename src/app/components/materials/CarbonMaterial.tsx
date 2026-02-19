'use client';

import * as THREE from 'three';
import { useMemo } from 'react';

/**
 * Creates a Matte Carbon Fiber MeshPhysicalMaterial
 * - Low gloss finish (roughness 0.7-0.8)
 * - Subtle clearcoat for depth
 * - Dark carbon color with metallic undertones
 */
export function useCarbonMaterial(options: { emissive?: boolean; emissiveColor?: string } = {}) {
    const material = useMemo(() => {
        return new THREE.MeshPhysicalMaterial({
            // Base carbon fiber appearance
            color: new THREE.Color('#0a0a0a'),
            metalness: 0.3,
            roughness: 0.75,

            // Subtle clearcoat for depth (like lacquered carbon)
            clearcoat: 0.15,
            clearcoatRoughness: 0.4,

            // Subtle reflectivity
            reflectivity: 0.5,

            // Emissive for error states
            emissive: options.emissive
                ? new THREE.Color(options.emissiveColor || '#8B0000')
                : new THREE.Color('#000000'),
            emissiveIntensity: options.emissive ? 0.8 : 0,

            // Enable environment map reflections
            envMapIntensity: 1.2,
        });
    }, [options.emissive, options.emissiveColor]);

    return material;
}

/**
 * Carbon Panel Mesh Component
 * Use for dashboard panels, backgrounds, and structural elements
 */
interface CarbonPanelProps {
    position?: [number, number, number];
    rotation?: [number, number, number];
    scale?: [number, number, number];
    size?: [number, number, number];
    emissive?: boolean;
    emissiveColor?: string;
}

export function CarbonPanel({
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = [1, 1, 1],
    size = [4, 2, 0.05],
    emissive = false,
    emissiveColor = '#8B0000'
}: CarbonPanelProps) {
    const material = useCarbonMaterial({ emissive, emissiveColor });

    return (
        <mesh
            position={position}
            rotation={rotation}
            scale={scale}
            castShadow
            receiveShadow
        >
            <boxGeometry args={size} />
            <primitive object={material} attach="material" />
        </mesh>
    );
}

/**
 * Carbon Ring Component
 * Use for status indicator rings (around StatusPearl)
 */
interface CarbonRingProps {
    position?: [number, number, number];
    innerRadius?: number;
    outerRadius?: number;
    emissive?: boolean;
    emissiveColor?: string;
}

export function CarbonRing({
    position = [0, 0, 0],
    innerRadius = 0.08,
    outerRadius = 0.12,
    emissive = false,
    emissiveColor = '#8B0000'
}: CarbonRingProps) {
    const material = useCarbonMaterial({ emissive, emissiveColor });

    return (
        <mesh position={position} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[innerRadius, outerRadius, 32]} />
            <primitive object={material} attach="material" />
        </mesh>
    );
}
