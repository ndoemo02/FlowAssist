'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Html, useGLTF, Environment, OrbitControls } from '@react-three/drei';
import { Suspense, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';

// --- CONFIG ZŁOTY KADR ---
const DEFAULT_ROT_Y = 1.64; // Skalibrowane
const HIDE_SHELL_DEFAULT = true;
const MODEL_SCALE = 0.6;

// --- DEV PANEL (POZA CANVAS - stały HTML) ---
function DevPanelOverlay({ config, setConfig, camPos }: { config: any, setConfig: any, camPos: { x: number, y: number, z: number } }) {
    if (process.env.NODE_ENV === 'production') return null;

    const handleChange = (key: string, value: any) => {
        setConfig((prev: any) => ({ ...prev, [key]: value }));
    };

    return (
        <div className="fixed top-4 left-4 p-4 bg-black/90 text-green-400 font-mono text-xs rounded border border-green-800 w-64 backdrop-blur-sm select-none shadow-xl z-50">
            <h3 className="mb-2 font-bold border-b border-green-900 pb-1 text-center text-green-300">STUDIO V5</h3>

            <div className="mb-4 p-2 bg-green-900/40 rounded border border-green-800">
                <div className="font-bold text-white mb-1 border-b border-green-800 pb-1">CAMERA</div>
                <div className="grid grid-cols-3 gap-1 text-[10px]">
                    <div>X: <span className="text-white">{camPos.x.toFixed(2)}</span></div>
                    <div>Y: <span className="text-white">{camPos.y.toFixed(2)}</span></div>
                    <div>Z: <span className="text-white">{camPos.z.toFixed(2)}</span></div>
                </div>
                <div className="mt-2 text-[9px] text-gray-400 italic">
                    PPM = Przesuń | Scroll = Zoom
                </div>
            </div>

            <div className="space-y-3">
                <div>
                    <label className="flex justify-between"><span>Rot Y</span> <span>{config.rotY.toFixed(2)}</span></label>
                    <input type="range" min="0" max="6.28" step="0.01" value={config.rotY}
                        onChange={(e) => handleChange('rotY', parseFloat(e.target.value))} className="w-full accent-green-500" />
                </div>

                <div>
                    <label className="flex justify-between"><span>Scale</span> <span>{config.scale.toFixed(2)}</span></label>
                    <input type="range" min="0.1" max="2.0" step="0.05" value={config.scale}
                        onChange={(e) => handleChange('scale', parseFloat(e.target.value))} className="w-full accent-green-500" />
                </div>

                <div className="pt-2">
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" checked={config.hideShell}
                            onChange={(e) => handleChange('hideShell', e.target.checked)} className="accent-green-500" />
                        <span>Hide Walls</span>
                    </label>
                </div>
            </div>
        </div>
    );
}

// --- CAMERA TRACKER (wewnątrz Canvas, wysyła dane do Overlay) ---
function CameraTracker({ setCamPos }: { setCamPos: (pos: { x: number, y: number, z: number }) => void }) {
    useFrame((state) => {
        const { x, y, z } = state.camera.position;
        setCamPos({ x, y, z });
    });
    return null;
}

// --- KOMPONENTY SCENY ---

function StudioModel({ config }: { config: any }) {
    const { scene } = useGLTF('/virtual_studio_ver_02.glb');

    useEffect(() => {
        scene.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;

                const name = child.name.toLowerCase();

                if (name.includes('floor') || name.includes('plane') || name.includes('ground')) {
                    child.visible = false;
                }

                if (config.hideShell) {
                    if (name.includes('photostudio') || name.includes('temp') || name.includes('box')) {
                        child.visible = false;
                    }
                    if (name.startsWith('object') && !name.includes('cam')) {
                        child.visible = false;
                    }
                } else {
                    if (!name.includes('floor')) child.visible = true;
                }
            }
        });
    }, [scene, config.hideShell]);

    return (
        <group>
            <primitive
                object={scene}
                position={[0, 0.15, 0]}
                rotation={[0, config.rotY, 0]}
                scale={[config.scale, config.scale, config.scale]}
            />

            {/* Nowa podłoga */}
            <mesh
                rotation={[-Math.PI / 2, 0, 0]}
                position={[0, 0, 0]}
                receiveShadow
            >
                <planeGeometry args={[200, 200]} />
                <meshStandardMaterial
                    color="#1A1D21"
                    roughness={0.75}
                    metalness={0.0}
                    envMapIntensity={0.2}
                />
            </mesh>
        </group>
    );
}

function LightingReveal() {
    const ambientRef = useRef<THREE.AmbientLight>(null);
    const spotRef = useRef<THREE.SpotLight>(null);
    const floorSpotRef = useRef<THREE.SpotLight>(null);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (t > 1.0) {
            if (ambientRef.current) ambientRef.current.intensity = THREE.MathUtils.lerp(ambientRef.current.intensity, 0.6, 0.01);
            if (spotRef.current) spotRef.current.intensity = THREE.MathUtils.lerp(spotRef.current.intensity, 3.0, 0.02);
            if (floorSpotRef.current) floorSpotRef.current.intensity = THREE.MathUtils.lerp(floorSpotRef.current.intensity, 15.0, 0.01);
        }
    });

    return (
        <>
            <ambientLight ref={ambientRef} intensity={0} />

            <spotLight
                ref={spotRef}
                position={[0, 10, -5]}
                angle={0.8}
                penumbra={0.5}
                intensity={0}
                castShadow
            />

            <spotLight
                ref={floorSpotRef}
                position={[0, 15, 0]}
                target-position={[0, 0, 0]}
                angle={0.6}
                penumbra={1.0}
                intensity={0}
                color="#4a5d6f"
                distance={40}
                decay={1.5}
            />

            <pointLight position={[0, 3, 2]} intensity={2.0} color="#00aaff" distance={10} />
        </>
    );
}

function IntroText() {
    const [visible, setVisible] = useState(true);
    useEffect(() => { setTimeout(() => setVisible(false), 2500); }, []);

    return (
        <Html fullscreen style={{ pointerEvents: 'none' }}>
            <main className={`flex flex-col items-center justify-center w-full h-full bg-black transition-opacity duration-[2000ms] ease-out ${visible ? 'opacity-100' : 'opacity-0'}`}>
                <div className="text-center z-10">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.5, delay: 0.5 }}
                        className="text-4xl md:text-6xl font-light text-white tracking-[0.2em] mb-4 uppercase"
                    >
                        Stabilizacja
                    </motion.h1>
                </div>
            </main>
        </Html>
    );
}

// --- GŁÓWNY WIDOK ---

export default function V5Page() {
    const [config, setConfig] = useState({
        rotY: DEFAULT_ROT_Y,
        hideShell: HIDE_SHELL_DEFAULT,
        scale: MODEL_SCALE
    });

    const [camPos, setCamPos] = useState({ x: 0, y: 0, z: 0 });

    useEffect(() => {
        const style = document.createElement('style');
        style.innerHTML = `
      body > iframe[style*="z-index: 2147483647"] { display: none !important; }
      nextjs-portal { display: none !important; }
    `;
        document.head.appendChild(style);
        return () => { document.head.removeChild(style); };
    }, []);

    return (
        <div className="w-full h-screen bg-black relative overflow-hidden">

            {/* PANEL POZA CANVAS - NIE UCIEKA */}
            <DevPanelOverlay config={config} setConfig={setConfig} camPos={camPos} />

            {/* 
         Kamera startuje tuż przed ekranem.
         Target ustawiony na (0, 0.5, 0) - orbita wokół centrum modelu.
      */}
            <Canvas shadows camera={{ position: [0, 0.5, 1.0], fov: 70 }}>
                <color attach="background" args={['#020202']} />

                <LightingReveal />

                <Suspense fallback={<Html><div className="text-white opacity-20 text-xs tracking-widest">LOADING...</div></Html>}>
                    <StudioModel config={config} />
                    <Environment preset="night" blur={0.6} background={false} />
                </Suspense>

                <CameraTracker setCamPos={setCamPos} />

                <OrbitControls
                    target={[0, 0.5, 0]} /* Orbita wokół centrum modelu */
                    enablePan={true}
                    panSpeed={1.0}
                    enableDamping
                    dampingFactor={0.05}
                    minDistance={0.05} /* Prawie 0, można "wlecieć" w ekran */
                    maxDistance={50}
                />
            </Canvas>
        </div>
    );
}
