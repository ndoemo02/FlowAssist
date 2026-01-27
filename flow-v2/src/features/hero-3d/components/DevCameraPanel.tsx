'use client';

import { useThree, useFrame } from '@react-three/fiber';
import { useState, useEffect } from 'react';
import { Html } from '@react-three/drei';

export default function DevCameraPanel() {
    const { camera } = useThree();
    const [params, setParams] = useState({
        z: 10.0,
        y: 0.5,
        targetY: 0.5,
        fov: 60
    });
    const [isVisible, setIsVisible] = useState(true);

    useFrame(() => {
        // Apply values every frame to override everything else
        camera.position.z = params.z;
        camera.position.y = params.y;

        if (camera instanceof THREE.PerspectiveCamera) {
            camera.fov = params.fov;
            camera.updateProjectionMatrix();
        }

        camera.lookAt(0, params.targetY, 0);
    });

    if (!isVisible) return (
        <Html position={[0, 0, 0]} style={{ pointerEvents: 'none' }}>
            <button
                onClick={() => setIsVisible(true)}
                className="fixed bottom-4 right-4 pointer-events-auto bg-red-500 text-white p-2 rounded z-50"
            >
                SHOW DEV
            </button>
        </Html>
    );

    return (
        <Html position={[0, 0, 0]} style={{ pointerEvents: 'none', width: '100%', height: '100%' }} zIndexRange={[100, 0]}>
            <div className="fixed bottom-0 left-0 w-full bg-black/80 text-green-400 p-4 font-mono text-xs pointer-events-auto border-t border-green-500 pb-12">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold">CAMERA CALIBRATION</h3>
                    <button onClick={() => setIsVisible(false)} className="text-red-400">[X]</button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    <div>
                        <div className="flex justify-between">
                            <label>Distance (Z)</label>
                            <span>{params.z.toFixed(2)}</span>
                        </div>
                        <input
                            type="range" min="1" max="25" step="0.1"
                            value={params.z}
                            onChange={e => setParams(p => ({ ...p, z: parseFloat(e.target.value) }))}
                            className="w-full accent-green-500"
                        />
                    </div>

                    <div>
                        <div className="flex justify-between">
                            <label>Height (Y)</label>
                            <span>{params.y.toFixed(2)}</span>
                        </div>
                        <input
                            type="range" min="-5" max="10" step="0.1"
                            value={params.y}
                            onChange={e => setParams(p => ({ ...p, y: parseFloat(e.target.value) }))}
                            className="w-full accent-green-500"
                        />
                    </div>

                    <div>
                        <div className="flex justify-between">
                            <label>LookAt Target Y</label>
                            <span>{params.targetY.toFixed(2)}</span>
                        </div>
                        <input
                            type="range" min="-2" max="5" step="0.1"
                            value={params.targetY}
                            onChange={e => setParams(p => ({ ...p, targetY: parseFloat(e.target.value) }))}
                            className="w-full accent-blue-500"
                        />
                    </div>

                    <div>
                        <div className="flex justify-between">
                            <label>FOV</label>
                            <span>{params.fov}</span>
                        </div>
                        <input
                            type="range" min="20" max="120" step="1"
                            value={params.fov}
                            onChange={e => setParams(p => ({ ...p, fov: parseFloat(e.target.value) }))}
                            className="w-full accent-yellow-500"
                        />
                    </div>
                </div>

                <div className="mt-4 p-2 bg-black border border-green-800 break-all select-all">
                    {`pos:[0,${params.y.toFixed(2)},${params.z.toFixed(2)}] fov:${params.fov} lookAt:[0,${params.targetY.toFixed(2)},0]`}
                </div>
            </div>
        </Html>
    );
}

import * as THREE from 'three';
