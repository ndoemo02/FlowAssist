'use client';

import { useThree, useFrame } from '@react-three/fiber';
import { useEffect } from 'react';
import * as THREE from 'three';

export default function ResponsiveCameraRig() {
    const { camera, size } = useThree();

    // Static Lock: apply position once or when size changes
    useEffect(() => {
        const aspect = size.width / size.height;
        const isMobile = aspect < 1.0;

        const targetPos = isMobile
            ? new THREE.Vector3(3.1, 0.8, 27.0)
            : new THREE.Vector3(0, 0.5, 5.0);

        const lookAtTarget = isMobile
            ? new THREE.Vector3(0, 0, 0)
            : new THREE.Vector3(0, 0.5, 0);

        camera.position.copy(targetPos);
        camera.lookAt(lookAtTarget);
        camera.updateProjectionMatrix();
    }, [camera, size]);

    /*
    useFrame(() => {
        const aspect = size.width / size.height;
        const isMobile = aspect < 1.0;

        let targetPos = new THREE.Vector3(0, 0.5, 5.0); // Desktop default
        let lookAtTarget = new THREE.Vector3(0, 0.5, 0);

        if (isMobile) {
            targetPos.set(3.1, 0.8, 27.0);
            lookAtTarget.set(0, 0, 0);
        }

        // Smooth interpolation
        camera.position.lerp(targetPos, 0.1);

        // direct lookAt every frame
        camera.lookAt(lookAtTarget);
    });
    */

    return null;
}
