'use client';

import { useThree, useFrame } from '@react-three/fiber';
import { useEffect } from 'react';
import * as THREE from 'three';

export default function DevCameraConfig({ config }: { config?: { z: number; y: number; fov: number; targetY: number } }) {
    const { camera } = useThree();

    useFrame(() => {
        if (!config) return;

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
