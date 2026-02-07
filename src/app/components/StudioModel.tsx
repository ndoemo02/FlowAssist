'use client';

import { useVideoTexture, useGLTF } from '@react-three/drei';
import { useEffect, useState } from 'react';
import * as THREE from 'three';

// --- CONFIG ---
const VIDEO_PATH = '/assets/video/drzewo_video.mp4';
const STUDIO_PATH = '/virtual_studio_ver_02.glb';

type CamSetupData = { position: THREE.Vector3, target: THREE.Vector3 };

export function StudioModel({ onCamSetup }: { onCamSetup?: (data: CamSetupData) => void }) {
    const gltf = useGLTF(STUDIO_PATH); // Load generic
    const scene = gltf.scene; // Extract scene
    const videoTex = useVideoTexture(VIDEO_PATH);
    const [screenFound, setScreenFound] = useState(false);

    useEffect(() => {
        console.log("StudioModel: [START] Logic v4...");
        let foundScreenObj: THREE.Object3D | null = null;

        // 0. Update World Matrix to ensure accurate bounding boxes
        scene.updateMatrixWorld(true);

        // 1. TRAVERSE & SETUP
        scene.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
                const mesh = child as THREE.Mesh;
                const name = mesh.name.toLowerCase();

                // Defaults
                mesh.visible = true;
                mesh.castShadow = true;
                mesh.receiveShadow = true;

                // A. Hide known structural junk
                if (name.includes('wall') || name.includes('roof') || name.includes('box0')) {
                    mesh.visible = false;
                }

                // B. Detect Floor
                const box = new THREE.Box3().setFromObject(mesh);
                const size = box.getSize(new THREE.Vector3());
                const center = box.getCenter(new THREE.Vector3());

                if (name.includes('floor') || (size.x > 10 && Math.abs(center.y) < 0.5)) {
                    // It's likely the floor
                    mesh.material = new THREE.MeshStandardMaterial({
                        color: '#000000',
                        roughness: 0.0,
                        metalness: 1.0,
                        envMapIntensity: 2.5
                    });
                }

                // C. Detect Screen
                // In ver_02, the screen might be named differently or just be a large object.
                // We'll look for specific names OR large vertical surfaces.
                const isScreenName = name.includes('object003') || name.includes('screen');
                if (isScreenName && size.x > 2.0) {
                    console.log("StudioModel: Screen Found:", name);
                    foundScreenObj = mesh;

                    videoTex.wrapS = videoTex.wrapT = THREE.RepeatWrapping;
                    videoTex.flipY = false;

                    mesh.material = new THREE.MeshBasicMaterial({
                        map: videoTex,
                        toneMapped: false,
                        side: THREE.DoubleSide
                    });
                }
            }
        });

        if (foundScreenObj) {
            setScreenFound(true);
            const target = new THREE.Vector3();
            new THREE.Box3().setFromObject(foundScreenObj).getCenter(target);

            const dir = new THREE.Vector3();
            foundScreenObj.getWorldDirection(dir);

            // Adjust camera relative to screen
            // Back 3.5, Left 4.0, Up 1.0
            const up = new THREE.Vector3(0, 1, 0);
            const right = new THREE.Vector3().crossVectors(up, dir).normalize();

            const camPos = target.clone()
                .add(dir.clone().multiplyScalar(3.5))
                .add(right.clone().multiplyScalar(-4.0))
                .add(new THREE.Vector3(0, 1.0, 0));

            if (onCamSetup) onCamSetup({ position: camPos, target });
        } else {
            setScreenFound(false);
            if (onCamSetup) {
                // Fallback Camera if no screen found
                onCamSetup({
                    position: new THREE.Vector3(0, 1, 5),
                    target: new THREE.Vector3(0, 1, 0)
                });
            }
        }
    }, [scene, videoTex, onCamSetup]);

    return (
        <group>
            {/* 1. The Actual GLB Scene */}
            <primitive object={scene} rotation={[0, 1.64, 0]} scale={0.6} />

            {/* 2. FAILSAFE: If GLB screen is missing/broken, render a Backup Screen */}
            {!screenFound && (
                <mesh position={[0, 1.5, 0]}>
                    <planeGeometry args={[4, 2.25]} />
                    <meshBasicMaterial map={videoTex} toneMapped={false} side={THREE.DoubleSide} />
                </mesh>
            )}
        </group>
    );
}
