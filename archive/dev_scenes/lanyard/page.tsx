'use client';

import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import Lanyard from '@/app/components/safelayer/Lanyard';
import { Suspense } from 'react';

export default function LanyardDemo() {
    return (
        <div className="w-full h-screen bg-black">
            <Canvas camera={{ position: [0, 0, 15], fov: 20 }}>
                <color attach="background" args={['#050505']} />

                <Suspense fallback={null}>
                    <Environment preset="city" />

                    {/* The Lanyard Component */}
                    <Lanyard position={[0, 5, 0]} />

                    {/* Lighting for the card material */}
                    <directionalLight position={[5, 10, 5]} intensity={2} />
                    <ambientLight intensity={0.5} />
                </Suspense>

                <OrbitControls enableZoom={true} enablePan={true} />
            </Canvas>

            <div className="fixed bottom-10 left-1/2 -translate-x-1/2 text-white/50 text-sm pointer-events-none">
                Drag the card to swing • AI Save Layer Prototype
            </div>
        </div>
    );
}
