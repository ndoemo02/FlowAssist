'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Html } from '@react-three/drei';
import * as THREE from 'three';

// Materials
import { CarbonPanel } from './materials/CarbonMaterial';
import { usePearlMaterial, useIPadPearlMaterial } from './materials/PearlMaterial';
import { GlassPanel3D } from './materials/GlassMaterial';

// Lighting
import { StudioLighting } from './lighting/StudioLighting';

// Safe Layer
import { StatusPearl, SafeLayerStatus } from './safelayer/StatusPearl';
import { ErrorFlash } from './safelayer/ErrorAlertMaterial';

// UI
import { HUDOverlay } from './ui/GlassPanel';

// --- Error Boundaries ---

/**
 * Global Error Boundary (Outside Canvas)
 * Catches crashes that take down the entire UI tree
 */
class GlobalErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, error: any }> {
    constructor(props: { children: React.ReactNode }) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: any) {
        return { hasError: true, error };
    }

    componentDidCatch(error: any, errorInfo: any) {
        console.error("Critical Dashboard Error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center p-8 bg-red-950/90 text-red-200 h-full w-full absolute z-50">
                    <h2 className="text-xl font-bold mb-4">Dashboard Crisis</h2>
                    <pre className="text-xs bg-black/50 p-4 rounded overflow-auto max-w-lg border border-red-800">
                        {String(this.state.error)}
                    </pre>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-6 px-6 py-2 bg-red-600 hover:bg-red-500 text-white rounded font-medium transition-colors"
                    >
                        Reboot System
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}

/**
 * Scene Error Boundary (Inside Canvas)
 * Catches 3D-specific errors without killing the HUD/UI
 */
class SceneErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
    constructor(props: { children: React.ReactNode }) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: any) {
        return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
            return (
                <Html center>
                    <div className="text-red-500 font-mono text-xs bg-black/90 p-3 rounded border border-red-500/50 backdrop-blur-md">
                        ⚠️ 3D Module Error
                    </div>
                </Html>
            );
        }
        return this.props.children;
    }
}

// --- Components ---

function IPadPro({ isError, screenContent }: { isError?: boolean; screenContent?: React.ReactNode }) {
    // Determine if models are preloaded or use fallback
    const { scene } = useGLTF('/assets/models/ipad_pro_2024.glb');
    const pearlMaterial = useIPadPearlMaterial();

    // Scene cloning/setup memoization to prevent re-traversal every render
    const clonedScene = React.useMemo(() => {
        const clone = scene.clone();
        clone.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
                const mesh = child as THREE.Mesh;
                mesh.castShadow = true;
                mesh.receiveShadow = true;
                const name = mesh.name.toLowerCase();
                if (!name.includes('screen') && !name.includes('display')) {
                    mesh.material = pearlMaterial;
                }
            }
        });
        return clone;
    }, [scene, pearlMaterial]);

    return (
        <group position={[0, 0.5, 0]} rotation={[-0.2, 0, 0]}>
            <primitive object={clonedScene} scale={3} />
            {screenContent && (
                <Html
                    position={[0, 0.05, 0.1]}
                    transform
                    occlude
                    style={{
                        width: '400px',
                        height: '280px',
                        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
                        borderRadius: '8px',
                        padding: '16px',
                        color: 'white',
                        fontSize: '12px',
                        fontFamily: 'Inter, system-ui, sans-serif'
                    }}
                >
                    {screenContent}
                </Html>
            )}
        </group>
    );
}

function CarbonDashboardScene({ safeLayerStatus, onTestError }: { safeLayerStatus: SafeLayerStatus; onTestError: () => void; }) {
    const isError = safeLayerStatus === 'error';

    return (
        <>
            <StudioLighting intensity={1.2} contactShadows shadowOpacity={0.6} />

            <CarbonPanel position={[-3, 1, -2]} rotation={[0, 0.3, 0]} size={[2, 3, 0.05]} emissive={isError} />
            <CarbonPanel position={[3, 1, -2]} rotation={[0, -0.3, 0]} size={[2, 3, 0.05]} emissive={isError} />
            <CarbonPanel position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]} size={[8, 6, 0.02]} />

            <Suspense fallback={null}>
                <IPadPro
                    isError={isError}
                    screenContent={
                        <div className="space-y-2 select-none">
                            <div className="text-lg font-bold">FlowAssist Control</div>
                            <div className="text-xs text-gray-400">Safe Layer Active</div>
                        </div>
                    }
                />
            </Suspense>

            <StatusPearl position={[1.5, 0.8, 0.5]} status={safeLayerStatus} scale={1.5} />
            <GlassPanel3D position={[-1.8, 1.5, 0.5]} rotation={[0, 0.4, 0]} size={[1.2, 0.8]} />
            <ErrorFlash active={isError} />

            <OrbitControls enablePan={false} minDistance={2} maxDistance={8} minPolarAngle={Math.PI / 6} maxPolarAngle={Math.PI / 2} />
        </>
    );
}

export default function CarbonPearlDashboard() {
    const [safeLayerStatus, setSafeLayerStatus] = useState<SafeLayerStatus>('online');
    const [stats] = useState({ latency: 136, gpu: 12, safety: 'online' as const });
    const [mounted, setMounted] = useState(false);
    const [safeMode, setSafeMode] = useState(false);

    // Prevent Hydration Mismatch & Check URL params
    useEffect(() => {
        setMounted(true);
        const params = new URLSearchParams(window.location.search);
        if (params.get('safe') === 'true') {
            console.log('CarbonPearl: Safe Mode Active');
            setSafeMode(true);
        }

        // Explicit Resource Disposal on Unmount
        return () => {
            try {
                // Dispose of complex materials if reachable
                // Note: React Three Fiber handles most disposal, but forcing context loss 
                // key in strict memory constrained environments can be done via:
                const canvas = document.querySelector('canvas');
                if (canvas) {
                    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
                    if (gl) {
                        const ext = gl.getExtension('WEBGL_lose_context');
                        if (ext) ext.loseContext();
                    }
                }
            } catch (e) {
                console.warn('Manual disposal failed:', e);
            }
        };
    }, []);

    const triggerError = () => {
        setSafeLayerStatus('error');
        setTimeout(() => setSafeLayerStatus('online'), 3000);
    };

    if (!mounted) return <div className="w-screen h-screen bg-black"></div>;

    return (
        <GlobalErrorBoundary>
            <div className="relative w-screen h-screen bg-black font-sans overflow-hidden">
                <Canvas
                    shadows={!safeMode} // Disable shadows in safe mode
                    camera={{ position: [0, 2, 5], fov: 45 }}
                    gl={{
                        antialias: true,
                        alpha: false,
                        powerPreference: safeMode ? 'low-power' : 'default'
                    }}
                    dpr={safeMode ? [1, 1] : [1, 1.5]}
                    onCreated={({ gl }) => {
                        gl.setClearColor('#050505');
                    }}
                >
                    <color attach="background" args={['#050505']} />
                    <fog attach="fog" args={['#050505', 8, 25]} />

                    <Suspense fallback={null}>
                        <SceneErrorBoundary>
                            {!safeMode && (
                                <CarbonDashboardScene
                                    safeLayerStatus={safeLayerStatus}
                                    onTestError={triggerError}
                                />
                            )}
                            {safeMode && (
                                <mesh rotation={[0, 0.5, 0]}>
                                    <boxGeometry args={[2, 2, 2]} />
                                    <meshStandardMaterial color="#444" wireframe />
                                </mesh>
                            )}
                        </SceneErrorBoundary>
                    </Suspense>
                </Canvas>

                {/* HUD Overlay */}
                <HUDOverlay
                    stats={{
                        ...stats,
                        safety: safeLayerStatus === 'error' ? 'error' : 'online'
                    }}
                    validation={[
                        { label: 'Schema', value: 'Valid', valid: true },
                        { label: 'Constraints', value: '12/12', valid: true },
                        { label: 'Indexes', value: 'Optimal', valid: true }
                    ]}
                />

                {/* Test Error Button */}
                <button
                    onClick={triggerError}
                    className="absolute bottom-8 left-8 px-4 py-2 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm font-mono hover:bg-red-500/30 transition-colors pointer-events-auto z-10"
                >
                    Test Error Alert
                </button>

                {/* Title */}
                <div className="absolute top-8 right-8 text-right pointer-events-none z-10">
                    <h1 className="text-3xl font-black text-white tracking-tight">
                        Carbon<span className="text-gray-400">Pearl</span>
                    </h1>
                    <p className="text-xs text-gray-500 uppercase tracking-[0.3em] mt-1">
                        Dashboard • Safe Layer
                    </p>
                </div>
            </div>
        </GlobalErrorBoundary>
    );
}

useGLTF.preload('/assets/models/ipad_pro_2024.glb');
