'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import GalaxyStudioModel, { SampleObject } from './GalaxyStudioModel';
import { StarField, CosmicSnow } from './GalaxyEffects';
import GalaxyLighting from './GalaxyLighting';
// import DevCameraConfig from './DevCameraConfig'; // Disabled
import ResponsiveCameraRig from './ResponsiveCameraRig';

export default function HeroScene() {
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

            {/* Camera Rig handles position for Mobile/Desktop */}
            <ResponsiveCameraRig />

            {/* Optional: OrbitControls for Desktop interactivity, but might fight Rig on Mobile.
                For now, let's keep them accessible but maybe restricted, 
                or rely on Rig to override if it runs every frame. 
                If Rig uses Lerp, OrbitControls might fight. 
                Safest for "Calibration" is to disable them to guarantee exact view.
             */}
            {/* OrbitControls REMOVED to stop auto-rotation/interaction */}

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
