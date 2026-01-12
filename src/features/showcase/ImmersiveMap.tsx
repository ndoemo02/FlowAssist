'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, Stats, Html, useProgress, Center, Box } from '@react-three/drei';
import { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Unit from './Unit';
import { useShowcaseStore } from './store';
import CommandConsole from './CommandConsole';

function Loader() {
    const { progress } = useProgress();
    return (
        <Html center>
            <div className="text-white text-center font-mono">
                <div className="text-2xl mb-2 tracking-widest uppercase">Ładowanie Systemu</div>
                <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden border border-gray-600">
                    <motion.div
                        className="h-full bg-cyan-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                    />
                </div>
                <div className="mt-2 text-cyan-400">{progress.toFixed(0)}%</div>
            </div>
        </Html>
    );
}

// Fallback mesh usunięty
// function DebugBox() ...

function MapModel() {
    // Ścieżka zaktualizowana po przeniesieniu plików
    const { scene } = useGLTF('/models/map_lviv_ukraine.glb');
    const units = useShowcaseStore((state) => state.units);

    return (
        <group>
            <Center top>
                <primitive
                    object={scene}
                    scale={1000}
                />
            </Center>

            {/* Renderowanie jednostek ze store */}
            <AnimatePresence>
                {units.map((unit) => (
                    <Unit
                        key={unit.id}
                        type={unit.type}
                        label={unit.label}
                        position={unit.position}
                    />
                ))}
            </AnimatePresence>
        </group>
    );
}

function SystemLogs() {
    const logs = useShowcaseStore((state) => state.logs);

    return (
        <div className="absolute top-24 right-6 w-80 font-mono text-xs pointer-events-none z-10 flex flex-col items-end gap-1">
            {logs.map((log, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-black/60 backdrop-blur-md border-r-2 border-cyan-500 px-3 py-1 text-cyan-100"
                >
                    {log}
                </motion.div>
            ))}
        </div>
    );
}

export default function ImmersiveMap() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return <div className="w-full h-screen bg-slate-950 flex items-center justify-center text-cyan-500 font-mono">INICJALIZACJA SYSTEMU...</div>;

    return (
        <div className="w-full h-screen bg-slate-950 relative">
            <div className="fixed top-0 left-1/2 -translate-x-1/2 bg-red-600 text-white px-4 py-2 z-[999999] font-bold border-2 border-white shadow-xl">
                DEBUG: UI LAYER ACTIVE
            </div>
            <SystemLogs />

            {/* HUD Overlay */}
            <div className="absolute top-0 left-0 w-full p-6 pt-28 md:pt-6 pointer-events-none z-10 flex flex-col md:flex-row justify-between items-start gap-4">
                <div>
                    <div className="text-cyan-500 font-mono text-xs tracking-[0.2em] uppercase mb-1">Aktywna Strefa</div>
                    <h1 className="text-white text-3xl md:text-4xl font-bold tracking-tighter">LWÓW <span className="text-cyan-900">/</span> CENTRUM</h1>
                </div>
                <div className="text-left md:text-right">
                    <div className="text-cyan-500 font-mono text-xs tracking-[0.2em] uppercase">Status Systemu</div>
                    <div className="flex items-center gap-2 justify-start md:justify-end">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-white font-mono text-sm">ONLINE</span>
                    </div>
                </div>
            </div>

            <Canvas
                shadows
                camera={{ position: [500, 800, 500], fov: 45, far: 20000 }}
                className="w-full h-full"
            >
                <fog attach="fog" args={['#020617', 2000, 20000]} />
                <ambientLight intensity={0.4} color="#a5f3fc" />
                <directionalLight
                    position={[10, 20, 10]}
                    intensity={1.2}
                    castShadow
                    shadow-mapSize={[2048, 2048]}
                />

                <Suspense fallback={<Loader />}>
                    <group position={[0, 0, 0]}>
                        <MapModel />
                    </group>

                    <Environment preset="night" blur={0.8} />
                    <gridHelper args={[10000, 200, 0x1e293b, 0x0f172a]} position={[0, -0.1, 0]} />
                </Suspense>

                <OrbitControls
                    maxPolarAngle={Math.PI / 2.2}
                    minDistance={50}
                    maxDistance={8000}
                    enableDamping
                    dampingFactor={0.05}
                    target={[0, 0, 0]}
                />

                <Stats className="!left-auto !right-0 !top-auto !bottom-0" />
            </Canvas>

            {/* Bottom Interface */}
            <div className="absolute bottom-0 left-0 w-full p-6 pointer-events-none z-10">
                <div className="border-t border-cyan-900/30 pt-4 flex justify-between text-cyan-700 font-mono text-xs">
                    <div>XYZ: 49.8397° N, 24.0297° E</div>
                    <div>SEKTOR: ALFA-1</div>
                </div>
            </div>

            <CommandConsole />
        </div>
    );
}

// Preload modelu dla lepszej wydajności
useGLTF.preload('/models/map_lviv_ukraine.glb');
