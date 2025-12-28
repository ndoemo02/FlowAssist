'use client';

import { Canvas } from '@react-three/fiber';
import { PearlSphere } from './PearlSphere';

export default function Scene({ active }: { active: boolean }) {
    return (
        <div className="absolute inset-0 z-0 pointer-events-none">
            <Canvas
                camera={{ position: [0, 0, 8], fov: 35 }}
                gl={{ antialias: true, alpha: true }}
                dpr={[1, 2]}
            >
                <PearlSphere active={active} />
            </Canvas>

            {/* Vignette Overlay for depth */}
            <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-midnight/80 pointer-events-none" />
        </div>
    );
}
