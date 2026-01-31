'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, Stars, Html, useProgress, Stage, PerspectiveCamera } from '@react-three/drei';
import { Suspense, useLayoutEffect, useMemo } from 'react';
import * as THREE from 'three';

function Loader() {
    const { progress } = useProgress();
    return <Html center className="text-white bg-black/80 p-6 rounded-2xl border border-cyan-500/20 backdrop-blur-md shadow-[0_0_50px_rgba(6,182,212,0.1)]">
        <div className="flex flex-col items-center gap-4 min-w-[200px]">
            <div className="relative w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                />
            </div>
            <div className="flex justify-between w-full text-[10px] font-mono">
                <span className="text-cyan-400 uppercase tracking-widest">Initializing Tactical Grid</span>
                <span className="text-white">{progress.toFixed(0)}%</span>
            </div>
        </div>
    </Html>;
}

function CityModel() {
    const { scene } = useGLTF('/models/map_lviv_ukraine.glb');

    // Multi-pass material for "Tactical Tech" look
    const tacticalMaterial = useMemo(() => new THREE.MeshStandardMaterial({
        color: '#0a0f1a',
        metalness: 0.8,
        roughness: 0.2,
        emissive: '#112244',
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.9,
    }), []);

    const wireframeMaterial = useMemo(() => new THREE.MeshBasicMaterial({
        color: '#22d3ee',
        wireframe: true,
        transparent: true,
        opacity: 0.1,
    }), []);

    useLayoutEffect(() => {
        scene.traverse((node) => {
            if ((node as THREE.Mesh).isMesh) {
                const mesh = node as THREE.Mesh;
                mesh.castShadow = true;
                mesh.receiveShadow = true;

                // Original material for structure
                mesh.material = tacticalMaterial;

                // Add wireframe clone for the "grid" effect
                const wire = mesh.clone();
                wire.material = wireframeMaterial;
                mesh.add(wire);
            }
        });
    }, [scene, tacticalMaterial, wireframeMaterial]);

    return <primitive object={scene} />;
}

export default function V2Page() {
    return (
        <main className="w-full h-screen bg-[#02040a] relative overflow-hidden">
            {/* Tactical HUD */}
            <div className="absolute top-8 left-8 z-10 space-y-4 pointer-events-none">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <div className="w-3 h-3 rounded-full bg-cyan-500 animate-ping absolute inset-0 opacity-20" />
                        <div className="w-3 h-3 rounded-full bg-cyan-400 relative border border-white/20" />
                    </div>
                    <div className="h-px w-12 bg-gradient-to-r from-cyan-500 to-transparent" />
                    <h1 className="text-2xl font-black text-white tracking-widest uppercase italic">
                        Sector <span className="text-cyan-400">Flow-01</span>
                    </h1>
                </div>
                <div className="bg-black/40 border-l-2 border-cyan-500/50 p-4 backdrop-blur-sm">
                    <div className="text-[10px] text-cyan-400/80 uppercase tracking-[0.2em] font-bold mb-1">
                        Active Intelligence Layer
                    </div>
                    <div className="text-xs text-gray-400 font-mono">
                        Grid: 52.2297N / 21.0122E<br />
                        Validation: Deterministic Gate Active<br />
                        Agents: [Alpha, Bravo, Charlie]
                    </div>
                </div>
            </div>

            <Canvas shadows={false} gl={{ antialias: true }}>
                <Suspense fallback={<Loader />}>
                    <color attach="background" args={['#02040a']} />

                    {/* Darker, more contrasty stage */}
                    <Stage
                        adjustCamera={1}
                        intensity={0.2}
                        environment="night"
                        preset="portrait"
                        shadows={false}
                        center
                    >
                        <CityModel />
                    </Stage>

                    <Stars radius={300} depth={50} count={10000} factor={4} saturation={0} fade speed={0.5} />

                    {/* Fixed Camera for Tactical Feel */}
                    <PerspectiveCamera makeDefault position={[50, 40, 50]} fov={35} />

                    <OrbitControls
                        makeDefault
                        minDistance={10}
                        maxDistance={500}
                        maxPolarAngle={Math.PI / 2.1}
                        minPolarAngle={0}
                        enableDamping={true}
                    />
                </Suspense>
            </Canvas>

            {/* Tactical Overlay */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(2,4,10,0.8)_100%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(0,255,255,0.03),rgba(0,0,0,0),rgba(255,0,255,0.03))] z-20 bg-[length:100%_4px,3px_100%] opacity-30" />
            </div>
        </main>
    );
}
