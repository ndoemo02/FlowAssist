'use client';

import { useVideoTexture, useGLTF } from '@react-three/drei';
import { useEffect } from 'react';
import * as THREE from 'three';

// --- CONFIG ---
const HIDE_SHELL = true;
const VIDEO_PATH = '/assets/video/drzewo_video.mp4';
const STUDIO_PATH = '/assets/models/virtual_studio_ver_02.glb';

export default function GalaxyStudioModel({ config = { rotY: 1.64, scale: 0.6 } }) {
    const { scene } = useGLTF(STUDIO_PATH);
    const videoTex = useVideoTexture(VIDEO_PATH);

    useEffect(() => {
        scene.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                const name = child.name.toLowerCase();

                if (HIDE_SHELL) {
                    child.visible = false;
                    const tempBox = new THREE.Box3().setFromObject(child);
                    const center = tempBox.getCenter(new THREE.Vector3());
                    const distFromCenter = center.distanceTo(new THREE.Vector3(0, 0, 0));
                    const size = tempBox.getSize(new THREE.Vector3());
                    const maxDim = Math.max(size.x, size.y, size.z);

                    // 1. SCREEN
                    if (name.includes('object003') || name.includes('screen') || name.includes('monitor')) {
                        child.visible = true;
                        (child as THREE.Mesh).material = new THREE.MeshBasicMaterial({
                            map: videoTex,
                            toneMapped: false
                        });
                        videoTex.flipY = true;
                        return;
                    }

                    // 2. FLOOR (Black Mirror)
                    if ((name.includes('floor') || name.includes('ground')) && distFromCenter < 100.0) {
                        child.visible = true;
                        (child as THREE.Mesh).material = new THREE.MeshStandardMaterial({
                            color: '#050505',
                            roughness: 0.05,
                            metalness: 0.8,
                            envMapIntensity: 1.0
                        });
                        return;
                    }

                    // 3. EQUIPMENT (Selective)
                    const isBanned = name.includes('wall') || name.includes('box') || name.includes('plant');
                    if (isBanned) return;

                    const isInsideSafeZone = Math.abs(center.x) < 2.5 && (center.y > -0.5 && center.y < 2.5) && Math.abs(center.z) < 3.0;

                    if (isInsideSafeZone && maxDim < 1.2) {
                        if (name.startsWith('cam') || name.startsWith('flap') || name.startsWith('body')) {
                            // Filter out large bodies sometimes
                            if (!(name.startsWith('body') && maxDim > 0.5)) {
                                child.visible = true;
                            }
                        }
                    }
                } else {
                    // Show everything except floor in default mode (if toggle changed)
                    child.visible = true;
                }
            }
        });
    }, [scene, videoTex]);

    return (
        <primitive
            object={scene}
            rotation={[0, config.rotY, 0]}
            scale={config.scale}
        />
    );
}

export function SampleObject() {
    const { scene } = useGLTF('/assets/models/sample_model.glb');
    return <primitive object={scene} position={[4, 1.5, -2.5]} rotation={[0, -Math.PI / 2, 0]} />;
}
