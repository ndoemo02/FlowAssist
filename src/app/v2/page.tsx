'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, Stars, Center, Html, useProgress } from '@react-three/drei';
import { Suspense } from 'react';

function Loader() {
    const { progress } = useProgress();
    return <Html center className="text-white">{progress.toFixed(0)}% loaded</Html>;
}

function CityModel() {
    const { scene } = useGLTF('/models/map_lviv_ukraine.glb');
    return (
        <Center>
            <primitive object={scene} scale={[1, 1, 1]} />
        </Center>
    );
}

export default function V2Page() {
    return (
        <main className="w-full h-screen bg-black relative">
            <div className="absolute top-6 left-6 z-10 text-white">
                <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                    3D City Preview (V2)
                </h1>
                <p className="text-gray-400 text-sm">Loaded: map_lviv_ukraine.glb</p>
                <div className="mt-2 text-xs text-gray-500">
                    <p>Controls: Left Click to Rotate, Right Click to Pan, Wheel to Zoom</p>
                    <p className="text-red-400">Fix Applied: Scale x1, Clipping Planes Adjusted</p>
                </div>
            </div>

            <Canvas camera={{ position: [0, 500, 1000], fov: 45, near: 0.1, far: 200000 }}>
                <Suspense fallback={<Loader />}>
                    <color attach="background" args={['#050505']} />

                    {/* Lighting setup for "Cosmic" look */}
                    <ambientLight intensity={0.2} />
                    <pointLight position={[10, 10, 10]} intensity={1} color="#00ffff" />
                    <pointLight position={[-10, 5, -10]} intensity={0.5} color="#8b5cf6" />

                    {/* The City Model */}
                    <CityModel />

                    {/* Environment */}
                    <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                    <Environment preset="city" />

                    <OrbitControls makeDefault />
                </Suspense>
            </Canvas>
        </main>
    );
}
