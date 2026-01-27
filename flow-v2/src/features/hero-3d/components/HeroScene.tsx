'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls, PerspectiveCamera } from '@react-three/drei';
import GalaxyStudioModel, { SampleObject } from './GalaxyStudioModel';
import { StarField, CosmicSnow } from './GalaxyEffects';
import GalaxyLighting from './GalaxyLighting';
import DevCameraConfig from './DevCameraConfig';

export default function HeroScene({ config }: { config?: any }) {
    return (
        <Canvas
            shadows
            dpr={[1, 2]}
            gl={{
                antialias: true,
                alpha: true,
                powerPreference: "high-performance"
            }}
            className="w-full h-full"
        >
            <color attach="background" args={['#050208']} />

            <DevCameraConfig config={config} />

            <OrbitControls
                enableZoom={true}
                enablePan={false}
                maxPolarAngle={Math.PI / 1.8}
                minPolarAngle={Math.PI / 2.2}
                minDistance={2}
                maxDistance={50}
                dampingFactor={0.05}
            />

            <Suspense fallback={null}>
                <Environment preset="night" blur={0.8} background={false} />

                <GalaxyLighting />
                <StarField count={8000} />
                <CosmicSnow count={200} />

                <GalaxyStudioModel config={{ rotY: 1.64, scale: 0.6 }} />
                <SampleObject />
            </Suspense>
        </Canvas>
    );
}

// Keep the logic for future use, but commented out or separate
/*
function ResponsiveCameraRig() {
    // ... logic ...
}
*/
