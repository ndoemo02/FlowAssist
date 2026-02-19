'use client';

import { useRef, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import {
    Environment,
    ContactShadows,
    Lightformer,
    AccumulativeShadows,
    RandomizedLight
} from '@react-three/drei';
import * as THREE from 'three';

/**
 * Studio Lighting Component
 * High-end HDR lighting with softbox-style reflections
 * Uses studio_small_08_4k.exr for realistic environment mapping
 */
interface StudioLightingProps {
    /** HDR environment intensity */
    intensity?: number;
    /** Enable contact shadows under objects */
    contactShadows?: boolean;
    /** Shadow opacity */
    shadowOpacity?: number;
    /** Use accumulative shadows for higher quality */
    highQualityShadows?: boolean;
}

export function StudioLighting({
    intensity = 1.0,
    contactShadows = true,
    shadowOpacity = 0.5,
    highQualityShadows = false
}: StudioLightingProps) {
    const { gl } = useThree();

    // Configure renderer for high quality
    useEffect(() => {
        gl.shadowMap.enabled = true;
        gl.shadowMap.type = THREE.PCFSoftShadowMap;
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.2;
    }, [gl]);

    return (
        <>
            {/* HDR Environment - using preset for stability */}
            <Environment
                preset="studio"
                background={false}
                environmentIntensity={intensity}
            />

            {/* Softbox-style Lightformers (outside Environment) */}
            <Lightformer
                position={[5, 5, -5]}
                scale={[10, 2, 1]}
                intensity={2}
                color="#ffffff"
            />
            <Lightformer
                position={[-5, 5, -5]}
                scale={[10, 2, 1]}
                intensity={1.5}
                color="#f0f0ff"
            />
            <Lightformer
                position={[0, 8, 3]}
                scale={[8, 3, 1]}
                intensity={1}
                color="#ffffff"
            />

            {/* Key Light - Main directional light */}
            <directionalLight
                position={[5, 8, 5]}
                intensity={0.8}
                color="#ffffff"
                castShadow
                shadow-mapSize={[2048, 2048]}
                shadow-camera-far={50}
                shadow-camera-left={-10}
                shadow-camera-right={10}
                shadow-camera-top={10}
                shadow-camera-bottom={-10}
                shadow-bias={-0.0001}
            />

            {/* Fill Light - Softer secondary light */}
            <directionalLight
                position={[-5, 5, 3]}
                intensity={0.3}
                color="#e8e8ff"
            />

            {/* Rim Light - Edge highlighting for depth */}
            <directionalLight
                position={[0, 3, -5]}
                intensity={0.4}
                color="#ffe8e8"
            />

            {/* Ambient for base illumination */}
            <ambientLight intensity={0.15} color="#1a1a2e" />

            {/* Contact Shadows - Soft shadows under objects */}
            {contactShadows && (
                <ContactShadows
                    position={[0, -0.01, 0]}
                    opacity={shadowOpacity}
                    scale={15}
                    blur={2.5}
                    far={4}
                    resolution={512}
                    color="#000000"
                />
            )}

            {/* High Quality Accumulative Shadows (optional, expensive) */}
            {highQualityShadows && (
                <AccumulativeShadows
                    position={[0, -0.01, 0]}
                    scale={20}
                    color="#000000"
                    opacity={0.8}
                    frames={100}
                    temporal
                >
                    <RandomizedLight
                        amount={8}
                        radius={5}
                        ambient={0.5}
                        intensity={1}
                        position={[5, 8, 5]}
                        bias={0.001}
                    />
                </AccumulativeShadows>
            )}
        </>
    );
}

/**
 * Simplified lighting for performance-critical scenes
 */
export function StudioLightingLite({ intensity = 0.8 }: { intensity?: number }) {
    return (
        <>
            <Environment
                preset="studio"
                background={false}
                environmentIntensity={intensity}
            />
            <directionalLight
                position={[5, 8, 5]}
                intensity={0.6}
                color="#ffffff"
                castShadow
                shadow-mapSize={[1024, 1024]}
            />
            <ambientLight intensity={0.2} />
        </>
    );
}
