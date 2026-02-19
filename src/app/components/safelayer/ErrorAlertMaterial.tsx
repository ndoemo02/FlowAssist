'use client';

import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * ErrorAlertMaterial Hook
 * Animated material that transitions from pearl white to deep red
 * with carbon glow effect for AI error states
 */
interface ErrorAlertMaterialOptions {
    isError: boolean;
    transitionSpeed?: number;
}

export function useErrorAlertMaterial({ isError, transitionSpeed = 2 }: ErrorAlertMaterialOptions) {
    const materialRef = useRef<THREE.MeshPhysicalMaterial>(null);
    const [progress, setProgress] = useState(0);

    // Create material
    const material = useRef(new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#f8f8f8'),
        metalness: 0.1,
        roughness: 0.15,
        iridescence: 1.0,
        iridescenceIOR: 1.5,
        clearcoat: 1.0,
        sheen: 1.0,
        sheenColor: new THREE.Color('#ffffff'),
    })).current;

    useFrame((state, delta) => {
        const target = isError ? 1 : 0;
        const newProgress = THREE.MathUtils.lerp(progress, target, delta * transitionSpeed);
        setProgress(newProgress);

        // Interpolate colors
        const baseColor = new THREE.Color('#f8f8f8');
        const errorColor = new THREE.Color('#8B0000');
        material.color.lerpColors(baseColor, errorColor, newProgress);

        // Update iridescence (fade out during error)
        material.iridescence = 1 - newProgress * 0.8;

        // Add emissive glow during error
        material.emissive = new THREE.Color('#ff0000');
        material.emissiveIntensity = newProgress * 0.5;
    });

    return material;
}

/**
 * CarbonGlowMaterial Hook
 * Carbon material with animated red glow for error states
 */
export function useCarbonGlowMaterial({ isError, glowIntensity = 1 }: { isError: boolean; glowIntensity?: number }) {
    const [intensity, setIntensity] = useState(0);

    const material = useRef(new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#0a0a0a'),
        metalness: 0.3,
        roughness: 0.75,
        clearcoat: 0.15,
        emissive: new THREE.Color('#8B0000'),
        emissiveIntensity: 0,
    })).current;

    useFrame((state, delta) => {
        if (isError) {
            // Pulsating glow
            const pulse = Math.sin(state.clock.elapsedTime * 4) * 0.5 + 0.5;
            const targetIntensity = pulse * glowIntensity;
            setIntensity(THREE.MathUtils.lerp(intensity, targetIntensity, delta * 10));
        } else {
            setIntensity(THREE.MathUtils.lerp(intensity, 0, delta * 3));
        }

        material.emissiveIntensity = intensity;
    });

    return material;
}

/**
 * ErrorAlertDevice Component
 * A device (iPad) that visually responds to error states
 * Pearl shell transitions to red, carbon base glows
 */
interface ErrorAlertDeviceProps {
    position?: [number, number, number];
    rotation?: [number, number, number];
    scale?: number;
    isError?: boolean;
    onErrorStart?: () => void;
    onErrorEnd?: () => void;
}

export function ErrorAlertDevice({
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = 1,
    isError = false,
    onErrorStart,
    onErrorEnd
}: ErrorAlertDeviceProps) {
    const groupRef = useRef<THREE.Group>(null);
    const pearlMaterial = useErrorAlertMaterial({ isError });
    const carbonMaterial = useCarbonGlowMaterial({ isError });

    // Trigger callbacks
    useEffect(() => {
        if (isError && onErrorStart) onErrorStart();
        if (!isError && onErrorEnd) onErrorEnd();
    }, [isError, onErrorStart, onErrorEnd]);

    // Shake animation during error
    useFrame((state) => {
        if (groupRef.current && isError) {
            const shake = Math.sin(state.clock.elapsedTime * 30) * 0.005;
            groupRef.current.position.x = position[0] + shake;
        } else if (groupRef.current) {
            groupRef.current.position.x = position[0];
        }
    });

    return (
        <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
            {/* Pearl device shell (will turn red on error) */}
            <mesh castShadow>
                <boxGeometry args={[0.5, 0.7, 0.02]} />
                <primitive object={pearlMaterial} attach="material" />
            </mesh>

            {/* Carbon base/stand (will glow red on error) */}
            <mesh position={[0, -0.45, 0]} receiveShadow>
                <boxGeometry args={[0.6, 0.1, 0.15]} />
                <primitive object={carbonMaterial} attach="material" />
            </mesh>
        </group>
    );
}

/**
 * ErrorFlash Component
 * Full-screen flash effect for critical errors
 */
export function ErrorFlash({ active }: { active: boolean }) {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (meshRef.current && active) {
            const flash = Math.sin(state.clock.elapsedTime * 10) * 0.5 + 0.5;
            (meshRef.current.material as THREE.MeshBasicMaterial).opacity = flash * 0.3;
        }
    });

    if (!active) return null;

    return (
        <mesh ref={meshRef} position={[0, 0, 5]}>
            <planeGeometry args={[100, 100]} />
            <meshBasicMaterial
                color="#ff0000"
                transparent
                opacity={0.2}
                blending={THREE.AdditiveBlending}
            />
        </mesh>
    );
}
