'use client';

import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

export default function GalaxyLighting() {
    const ambientRef = useRef<THREE.AmbientLight>(null);
    const spotRef = useRef<THREE.SpotLight>(null);
    const floorSpotRef = useRef<THREE.SpotLight>(null);

    // Disabled animation for calibration - static "lights on" state
    /*
    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (t > 0.5) {
            if (ambientRef.current) ambientRef.current.intensity = THREE.MathUtils.lerp(ambientRef.current.intensity, 0.6, 0.01);
            if (spotRef.current) spotRef.current.intensity = THREE.MathUtils.lerp(spotRef.current.intensity, 3.0, 0.02);
            if (floorSpotRef.current) floorSpotRef.current.intensity = THREE.MathUtils.lerp(floorSpotRef.current.intensity, 15.0, 0.01);
        }
    });
    */

    return (
        <>
            <ambientLight ref={ambientRef} intensity={0.6} color="#1a0a2e" />

            <spotLight
                ref={spotRef}
                position={[0, 10, -5]}
                angle={0.8}
                penumbra={0.5}
                intensity={3.0}
                color="#8b5cf6"
                castShadow
            />

            <spotLight
                ref={floorSpotRef}
                position={[0, 15, 0]}
                target-position={[0, 0, 0]}
                angle={0.6}
                penumbra={1.0}
                intensity={15.0} // High intensity for floor reflection
                color="#06b6d4"
                distance={40}
                decay={1.5}
            />

            <pointLight position={[5, 3, 2]} intensity={2.0} color="#ec4899" distance={15} />
            <pointLight position={[-5, 3, 2]} intensity={2.0} color="#8b5cf6" distance={15} />
        </>
    );
}
