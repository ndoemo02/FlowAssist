'use client';

import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function ResponsiveCameraRig() {
    const { camera, size } = useThree();

    useFrame(() => {
        const aspect = size.width / size.height;
        const isMobile = aspect < 1.0;

        let targetPos = new THREE.Vector3(0, 0.5, 5.0); // Desktop default
        let lookAtTarget = new THREE.Vector3(0, 0.5, 0);

        if (isMobile) {
            // CALIBRATED VALUES for Mobile (Portrait)
            // Based on user screenshot: X ~3.1, Y ~0.8, Z ~27.0
            // This frames the studio well from a distance.
            targetPos.set(3.1, 0.8, 27.0);

            // Adjust lookAt slightly if needed, but 0,0,0 usually works for "center".
            // User view seems to be looking at the screen/tree.
            lookAtTarget.set(0, 0, 0);
        }

        // Smooth interpolation
        camera.position.lerp(targetPos, 0.1);

        // Use a dummy object or simple vector logic for smooth lookAt 
        // (direct lookAt every frame can be jittery if not carefully handled, but usually fine)
        camera.lookAt(lookAtTarget);
    });

    return null;
}
