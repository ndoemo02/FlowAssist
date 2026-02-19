'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

/**
 * Minimal WebGL Debug Route
 * Tests if the browser can render basic 3D content without crashing.
 * Access via: http://localhost:3000/carbon-debug
 */
export default function CarbonDebugPage() {
    return (
        <div className="w-screen h-screen bg-black flex flex-col items-center justify-center">
            <h1 className="text-white mb-4 z-10">WebGL Debug: Spinning Cube</h1>
            <div className="w-full h-full absolute top-0 left-0">
                <Canvas>
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} />
                    <mesh rotation={[0.5, 0.5, 0]}>
                        <boxGeometry args={[2, 2, 2]} />
                        <meshStandardMaterial color="orange" />
                    </mesh>
                    <OrbitControls />
                </Canvas>
            </div>
        </div>
    );
}
