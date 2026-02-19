'use client';

import { useVideoTexture, useGLTF } from '@react-three/drei';
import { useEffect, useState } from 'react';
import * as THREE from 'three';
import { usePearlMaterial } from './materials/PearlMaterial';
import { StatusPearl } from './safelayer/StatusPearl';

// --- CONFIG ---
const VIDEO_PATH = '/assets/video/drzewo_video.mp4';
const STUDIO_PATH = '/virtual_studio_ver_02.glb';

type CamSetupData = { position: THREE.Vector3, target: THREE.Vector3 };

export function StudioModel({ onCamSetup }: { onCamSetup?: (data: CamSetupData) => void }) {
    const gltf = useGLTF(STUDIO_PATH); // Load generic
    const scene = gltf.scene; // Extract scene
    const videoTex = useVideoTexture(VIDEO_PATH);
    const pearlMaterial = usePearlMaterial();
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

                    // --- CURVED SCREEN TEXTURE SETUP ---
                    // 1. Clamp edges so pixels don't bleed/tile
                    videoTex.wrapS = THREE.ClampToEdgeWrapping;
                    videoTex.wrapT = THREE.ClampToEdgeWrapping;

                    // 2. Smooth filtering (critical for video on curved surfaces)
                    videoTex.minFilter = THREE.LinearFilter;
                    videoTex.magFilter = THREE.LinearFilter;

                    // 3. Orientation & Scale
                    // GLB UVs usually expect flipY = false.
                    // If image is upside down, set this to true.
                    videoTex.flipY = false;

                    // Optional: Crop edges if the curve has bad UVs at the border
                    // videoTex.repeat.set(0.98, 0.98);
                    // videoTex.offset.set(0.01, 0.01);

                    mesh.material = new THREE.MeshBasicMaterial({
                        map: videoTex,
                        toneMapped: false,
                        side: THREE.DoubleSide
                    });

                    // --- ADD FRAME (Pearl) - CLONE STRATEGY ---
                    // Re-adding this to ensure the frame has a constant material
                    const existingFrame = mesh.children.find(c => c.name === 'PearlFrame');
                    if (!existingFrame) {
                        const frameGeo = mesh.geometry.clone();
                        frameGeo.computeBoundingBox();
                        const center = new THREE.Vector3();
                        if (frameGeo.boundingBox) frameGeo.boundingBox.getCenter(center);

                        // Scale slightly to create a border
                        frameGeo.translate(-center.x, -center.y, -center.z);
                        frameGeo.scale(1.05, 1.05, 1.0);
                        frameGeo.translate(center.x, center.y, center.z);

                        const frameMesh = new THREE.Mesh(frameGeo, pearlMaterial);
                        frameMesh.name = 'PearlFrame';
                        frameMesh.position.z -= 0.01; // Behind screen slightly

                        mesh.add(frameMesh);
                    }
                }
            }
        });

        if (foundScreenObj) {
            setScreenFound(true);
            const screen = foundScreenObj as THREE.Object3D; // Cast to fix TS 'never' inference

            const target = new THREE.Vector3();
            new THREE.Box3().setFromObject(screen).getCenter(target);

            const dir = new THREE.Vector3();
            screen.getWorldDirection(dir);

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
