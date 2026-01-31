'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, Stars, Html, useProgress, Stage, PerspectiveCamera } from '@react-three/drei';
import { Suspense } from 'react';
import * as THREE from 'three';

function Loader() {
    const { progress } = useProgress();
    return <Html center className="text-white bg-black/80 p-6 rounded-2xl border border-white/10 backdrop-blur-md shadow-2xl">
        <div className="flex flex-col items-center gap-4 min-w-[200px]">
            <div className="relative w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <div
                    className="absolute inset-y-0 left-0 bg-white transition-all duration-300"
                    style={{ width: `${progress}%` }}
                />
            </div>
            <div className="flex justify-between w-full text-[10px] font-mono">
                <span className="text-gray-400 uppercase tracking-widest text-[8px]">Loading City Data</span>
                <span className="text-white text-[8px]">{progress.toFixed(0)}%</span>
            </div>
        </div>
    </Html>;
}

function CityModel() {
    const { scene } = useGLTF('/models/map_lviv_ukraine.glb');
    return <primitive object={scene} />;
}

export default function V2Page() {
    return (
        <main className="w-full h-screen bg-[#111] relative overflow-hidden">
            <Canvas shadows gl={{ antialias: true, logarithmicDepthBuffer: true }}>
                <Suspense fallback={<Loader />}>
                    <color attach="background" args={['#111']} />

                    <Stage
                        adjustCamera={1}
                        intensity={0.6}
                        environment="city"
                        preset="rembrandt"
                        shadows={true}
                        center
                    >
                        <CityModel />
                    </Stage>

                    <Stars radius={300} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

                    <PerspectiveCamera makeDefault position={[50, 50, 50]} fov={50} />

                    <OrbitControls
                        makeDefault
                        minDistance={1}
                        maxDistance={500}
                        enableDamping={true}
                    />
                </Suspense>
            </Canvas>
        </main>
    );
}
