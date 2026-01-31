'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, Stars, Html, useProgress, Stage } from '@react-three/drei';
import { Suspense } from 'react';

function Loader() {
    const { progress } = useProgress();
    return <Html center className="text-white bg-black/50 p-4 rounded-xl border border-white/10 backdrop-blur-sm shadow-2xl">
        <div className="flex flex-col items-center gap-2">
            <div className="text-2xl font-bold tracking-tighter text-cyan-400">{progress.toFixed(0)}%</div>
            <div className="text-[10px] uppercase tracking-widest text-gray-500">Decrypting City Data</div>
        </div>
    </Html>;
}

function CityModel() {
    const { scene } = useGLTF('/models/map_lviv_ukraine.glb');
    return <primitive object={scene} />;
}

export default function V2Page() {
    return (
        <main className="w-full h-screen bg-[#050505] relative overflow-hidden">
            {/* Minimal HUD */}
            <div className="absolute top-8 left-8 z-10 space-y-2 pointer-events-none">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                    <h1 className="text-xl font-bold text-white tracking-tight uppercase">Kyiv/Lviv Tactical View</h1>
                </div>
                <div className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-medium pl-5">
                    Sector: UKR | Status: Simulation Active
                </div>
            </div>

            <Canvas shadows={false} camera={{ position: [0, 0, 150], fov: 40, near: 0.1, far: 500000 }}>
                <Suspense fallback={<Loader />}>
                    <color attach="background" args={['#050505']} />

                    <Stage
                        adjustCamera={1.2}
                        intensity={0.5}
                        environment="city"
                        shadows={false}
                        center
                    >
                        <CityModel />
                    </Stage>

                    <Stars radius={300} depth={60} count={20000} factor={7} saturation={0} fade speed={1} />
                    <OrbitControls makeDefault minDistance={0.1} maxDistance={10000} />
                </Suspense>
            </Canvas>

            {/* Scanline Effect */}
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-20 bg-[length:100%_4px,3px_100%] opacity-20" />
        </main>
    );
}
