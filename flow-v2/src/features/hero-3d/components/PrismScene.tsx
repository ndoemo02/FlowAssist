'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Suspense } from 'react';
import PrismContent from './PrismContent';

export default function PrismScene() {
    return (
        <Canvas
            shadows
            dpr={[1, 2]}
            gl={{
                antialias: true,
                alpha: false, // Solid background
                toneMappingExposure: 1.2
            }}
            className="w-full h-full"
        >
            <color attach="background" args={['#050510']} />

            <PerspectiveCamera
                makeDefault
                position={[0, 2, 12]}
                fov={40}
            />

            <OrbitControls
                enableZoom={true}
                enablePan={true}
                autoRotate={false}
                dampingFactor={0.05}
            />

            <Suspense fallback={null}>
                <PrismContent />
            </Suspense>
        </Canvas>
    );
}
