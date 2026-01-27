'use client';

import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export interface DevConfig {
    x?: number;
    z: number;
    y: number;
    fov: number;
    targetY: number;
}

export default function DevCameraConfig({ config }: { config?: DevConfig }) {
    const { camera } = useThree();

    useFrame(() => {
        if (!config) return;

        // Apply X if present, default to 0
        camera.position.x = config.x ?? 0;
        camera.position.z = config.z;
        camera.position.y = config.y;

        if (camera instanceof THREE.PerspectiveCamera) {
            camera.fov = config.fov;
            camera.updateProjectionMatrix();
        }

        camera.lookAt(0, config.targetY, 0);
    });

    return null;
}
