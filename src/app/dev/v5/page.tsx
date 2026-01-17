'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html, useGLTF, Environment, OrbitControls, useVideoTexture } from '@react-three/drei';
import { Suspense, useCallback, useEffect, useMemo, useRef, useState, type MutableRefObject } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

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

function StudioModel({ config, onBounds }: { config: any; onBounds: (box: THREE.Box3) => void }) {
    const { scene } = useGLTF('/virtual_studio_ver_02.glb');
    const videoTex = useVideoTexture('/assets/video/drzewo video.mp4');

    useEffect(() => {
        const box = new THREE.Box3().setFromObject(scene);
        onBounds(box);
    }, [scene, config.rotY, config.scale, onBounds]);

    useEffect(() => {
        scene.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;

                const name = child.name.toLowerCase();

                if (config.hideShell) {
                    // 1. ZACZNIJ OD PUSTKI (Ukryj wszystko)
                    child.visible = false;

                    // Oblicz rozmiar i POZYCJĘ
                    const tempBox = new THREE.Box3().setFromObject(child);
                    const size = tempBox.getSize(new THREE.Vector3());
                    const center = tempBox.getCenter(new THREE.Vector3());
                    const distFromCenter = center.distanceTo(new THREE.Vector3(0, 0, 0));
                    const maxDim = Math.max(size.x, size.y, size.z);

                    // 2. PRIORYTET: EKRAN GŁÓWNY + RAMKA (Immunitet absolutny)
                    const isScreenName = name.includes('object003_photostudio_1003') || name.includes('rectangle002') ||
                        name.includes('screen') || name.includes('monitor') || name.includes('tv') ||
                        name.includes('rectangle003');

                    if (isScreenName) {
                        child.visible = true;

                        // Aplikuj video do WSZYSTKIEGO co jest ekranem (bo nazwy są mylące)
                        const mesh = child as THREE.Mesh;
                        mesh.material = new THREE.MeshBasicMaterial({
                            map: videoTex,
                            toneMapped: false
                        });
                        videoTex.flipY = true;

                        return; // Ekran jest święty, kończymy.
                    }

                    // 3. PRIORYTET: PODŁOGA (CAŁA = CZARNE LUSTRO)
                    if (name.includes('floor') || name.includes('ground') || name.includes('plane') || name.includes('circle')) {
                        if (distFromCenter < 100.0) {
                            child.visible = true;

                            // NADPISANIE MATERIAŁU: COSMIC DARK GLASS (BEZWYJĄTKOWO)
                            (child as THREE.Mesh).material = new THREE.MeshStandardMaterial({
                                color: '#050505',  // Głęboka czerń
                                roughness: 0.05,   // Bardzo gładkie (lustro)
                                metalness: 0.8,    // Metaliczny polysk
                                envMapIntensity: 1.0
                            });

                            return;
                        }
                    }

                    // 4. CZARNA LISTA (Veto absolutne dla reszty)
                    const isBanned = name.includes('box') || name.includes('wall') || name.includes('plant') ||
                        name.includes('leaf') || name.includes('rock') || name.includes('stone') || name.includes('temp') || name.includes('1002') ||
                        name.includes('decoration') || name.includes('ivy') || name.includes('vine') || name.includes('grass') ||
                        name.includes('bush') || name.includes('flower') || name.includes('geo') || name.includes('shape');

                    if (isBanned) return;

                    // 4. FILTR POZYCYJNY (Dla śmieci dalekich)
                    if (distFromCenter > 10.0) return;

                    // 5. OBSŁUGA SPRZĘTU (Kamery) - STREFA BEZPIECZEŃSTWA (SAFE ZONE)
                    const isInsideSafeZone = Math.abs(center.x) < 2.5 && (center.y > -0.5 && center.y < 2.5) && Math.abs(center.z) < 3.0;

                    if (isInsideSafeZone && maxDim < 1.2) {
                        if (name.startsWith('cam') || name.startsWith('flap') || name.startsWith('body')) {
                            // Wyklucz duże 'body'
                            if (name.startsWith('body') && maxDim > 0.5) {
                                // hide
                            } else {
                                child.visible = true;
                            }
                        }
                    }

                } else {
                    // Tryb normalny
                    if (name.includes('floor') || name.includes('plane') || name.includes('ground') || name.includes('circle')) {
                        child.visible = false;
                    } else {
                        child.visible = true;
                    }
                }
            }
        });
    }, [scene, config.hideShell]);

    return (
        <group>
            <primitive
                object={scene}
                position={[0, 0, 0]}
                rotation={[0, config.rotY, 0]}
                scale={[config.scale, config.scale, config.scale]}
            />
        </group>
    );
}

// === GALAXY THEME: STAR FIELD ===
function StarField({ count = 12000 }) {
    const points = useRef<THREE.Points>(null);

    const positions = useMemo(() => {
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const radius = 30 + Math.random() * 80; // Szerszy rozrzut
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
            pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            pos[i * 3 + 2] = radius * Math.cos(phi);
        }
        return pos;
    }, [count]);

    useFrame((state) => {
        if (points.current) {
            points.current.rotation.y = state.clock.getElapsedTime() * 0.02; // Szybszy obrót dla dynamiki
        }
    });

    return (
        <points ref={points}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" array={positions} count={count} itemSize={3} />
            </bufferGeometry>
            <pointsMaterial
                size={0.03}          // Drobne pixele
                color="#ffffff"
                transparent
                opacity={0.9}        // Wyraźne kropki
                sizeAttenuation={true}
                blending={THREE.AdditiveBlending}
                depthWrite={false}   // Nie zasłaniają się nawzajem (lepszy glow)
            />
        </points>
    );
}

// --- GALAXY THEME: COSMIC SNOW ---
function CosmicSnow({ count = 400 }) {
    const mesh = useRef<THREE.Group>(null);
    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            const t = Math.random() * 100;
            const factor = 20 + Math.random() * 100;
            const speed = 0.01 + Math.random() / 200;
            const xFactor = -15 + Math.random() * 30;
            const yFactor = -5 + Math.random() * 15;
            const zFactor = -20 + Math.random() * 40;
            temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
        }
        return temp;
    }, [count]);

    useFrame((state) => {
        if (!mesh.current) return;
        particles.forEach((particle, i) => {
            let { t, factor, speed, xFactor, yFactor, zFactor } = particle;
            t = particle.t += speed / 2;
            const a = Math.cos(t) + Math.sin(t * 1) / 10;
            const b = Math.sin(t) + Math.cos(t * 2) / 10;
            const s = Math.cos(t);

            const child = mesh.current!.children[i] as THREE.Mesh;
            child.position.set(
                a + xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
                b + yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
                b + zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10
            );
            child.scale.set(s * 0.5, s * 0.5, s * 0.5);
        });
    });

    return (
        <group ref={mesh}>
            {particles.map((_, i) => (
                <mesh key={i}>
                    <sphereGeometry args={[0.04, 6, 6]} />
                    <meshStandardMaterial
                        color="#8b5cf6"
                        emissive="#8b5cf6"
                        emissiveIntensity={4}
                        transparent
                        opacity={0.4}
                    />
                </mesh>
            ))}
        </group>
    );
}

// === GALAXY THEME: NEBULA GLOW (DISABLED) ===
function NebulaGlow() {
    return null;
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
            <ambientLight ref={ambientRef} intensity={0} color="#1a0a2e" />
            <spotLight
                ref={spotRef}
                position={[0, 10, -5]}
                angle={0.8}
                penumbra={0.5}
                intensity={0}
                color="#8b5cf6"
                castShadow
            />
            <spotLight
                ref={floorSpotRef}
                position={[0, 15, 0]}
                target-position={[0, 0, 0]}
                angle={0.6}
                penumbra={1.0}
                intensity={0}
                color="#06b6d4"
                distance={40}
                decay={1.5}
            />
            <pointLight position={[5, 3, 2]} intensity={2.0} color="#ec4899" distance={15} />
            <pointLight position={[-5, 3, 2]} intensity={2.0} color="#8b5cf6" distance={15} />
            <pointLight position={[0, 5, -5]} intensity={1.5} color="#06b6d4" distance={20} />
        </>
    );
}

function CameraSetup({ bounds, controlsRef }: { bounds: THREE.Box3 | null; controlsRef: MutableRefObject<OrbitControlsImpl | null> }) {
    const { camera } = useThree();

    useEffect(() => {
        // Sztywne ustawienie kamery "Złoty Kadr" - ZBLIŻENIE
        camera.position.set(0, 1.1, 3.5); // Dużo bliżej (było 12.0)
        camera.near = 0.01;
        camera.far = 250;

        if (camera instanceof THREE.PerspectiveCamera) {
            camera.fov = 60; // Węższy kąt dla lepszego kinowego looku
        }
        camera.updateProjectionMatrix();

        if (controlsRef.current) {
            controlsRef.current.target.set(0, 1.0, 0); // Patrz na środek ekranu (mniej więcej)
            controlsRef.current.update();
        }
    }, [camera, controlsRef]); // Wykonaj raz (lub gdy zmieni się ref)

    return null;
}

export default function V5Page() {
    const [config, setConfig] = useState({
        rotY: DEFAULT_ROT_Y,
        hideShell: HIDE_SHELL_DEFAULT,
        scale: MODEL_SCALE
    });

    const [camPos, setCamPos] = useState({ x: 0, y: 0, z: 0 });
    const [modelBounds, setModelBounds] = useState<THREE.Box3 | null>(null);
    const controlsRef = useRef<OrbitControlsImpl | null>(null);

    const handleBounds = useCallback((box: THREE.Box3) => {
        setModelBounds(box);
    }, []);

    const controlsTarget = useMemo<[number, number, number]>(() => {
        if (!modelBounds) return [0, 0.5, 0];
        const center = modelBounds.getCenter(new THREE.Vector3());
        return [center.x, center.y, center.z];
    }, [modelBounds]);

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
            <DevPanelOverlay config={config} setConfig={setConfig} camPos={camPos} />
            <Canvas shadows camera={{ position: [0, 0.5, 1.0], fov: 70, near: 0.01, far: 250 }}>
                <color attach="background" args={['#050208']} />
                <StarField count={8000} />
                <CosmicSnow count={300} />
                <NebulaGlow />
                <LightingReveal />
                <Suspense fallback={<Html><div className="text-white opacity-20 text-xs tracking-widest">LOADING...</div></Html>}>
                    <StudioModel config={config} onBounds={handleBounds} />
                    <Environment preset="night" blur={0.8} background={false} />
                </Suspense>
                <CameraTracker setCamPos={setCamPos} />
                <CameraSetup bounds={modelBounds} controlsRef={controlsRef} />
                <OrbitControls
                    ref={controlsRef}
                    target={controlsTarget}
                    enablePan={true}
                    panSpeed={1.0}
                    enableDamping
                    dampingFactor={0.05}
                    minDistance={0.1}
                    maxDistance={80}
                />
            </Canvas>
        </div>
    );
}
