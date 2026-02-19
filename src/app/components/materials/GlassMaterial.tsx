'use client';

import * as THREE from 'three';
import { useMemo } from 'react';

/**
 * Creates a Frosted Glass MeshPhysicalMaterial
 * - High transmission for glass-like transparency
 * - Roughness for frosted effect
 * - Thickness for realistic refraction
 */
export function useGlassMaterial(options: {
    opacity?: number;
    frosted?: boolean;
    tint?: string;
} = {}) {
    const material = useMemo(() => {
        return new THREE.MeshPhysicalMaterial({
            // Glass properties
            color: new THREE.Color(options.tint || '#ffffff'),
            metalness: 0.0,
            roughness: options.frosted ? 0.3 : 0.05,

            // Transmission for glass transparency
            transmission: 0.9,
            transparent: true,
            opacity: options.opacity ?? 0.95,

            // Thickness affects refraction
            thickness: 0.5,

            // Index of refraction (glass = 1.5)
            ior: 1.45,

            // Subtle reflections
            reflectivity: 0.3,
            envMapIntensity: 1.0,

            // Side rendering
            side: THREE.DoubleSide,
        });
    }, [options.opacity, options.frosted, options.tint]);

    return material;
}

/**
 * Glass Panel Component for 3D HUD elements
 * Creates floating frosted glass panels
 */
interface GlassPanelProps {
    position?: [number, number, number];
    rotation?: [number, number, number];
    size?: [number, number];
    frosted?: boolean;
    tint?: string;
}

export function GlassPanel3D({
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    size = [2, 1],
    frosted = true,
    tint = '#ffffff'
}: GlassPanelProps) {
    const material = useGlassMaterial({ frosted, tint });

    return (
        <mesh
            position={position}
            rotation={rotation}
            receiveShadow
        >
            <planeGeometry args={size} />
            <primitive object={material} attach="material" />
        </mesh>
    );
}

/**
 * Glass Container Component
 * 3D box with glass material for containing UI elements
 */
interface GlassContainerProps {
    position?: [number, number, number];
    size?: [number, number, number];
    frosted?: boolean;
}

export function GlassContainer({
    position = [0, 0, 0],
    size = [1, 0.5, 0.1],
    frosted = true
}: GlassContainerProps) {
    const material = useGlassMaterial({ frosted, opacity: 0.8 });

    return (
        <mesh position={position}>
            <boxGeometry args={size} />
            <primitive object={material} attach="material" />
        </mesh>
    );
}
