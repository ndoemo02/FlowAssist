'use client';

import * as THREE from 'three';
import { useMemo, useRef, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';

const SEGMENTS = 20; // Number of segments
const LENGTH = 5.0;  // Increased from 2.0 to 5.0 so it hangs lower
const SEGMENT_LENGTH = LENGTH / SEGMENTS;
const SIMULATION_STEPS = 10; // More steps = stiffer rope
const GRAVITY = new THREE.Vector3(0, -9.81, 0);
const DAMPING = 0.99; // Air resistance

class Point {
    pos: THREE.Vector3;
    oldPos: THREE.Vector3;
    isPinned: boolean;

    constructor(x: number, y: number, z: number, pinned = false) {
        this.pos = new THREE.Vector3(x, y, z);
        this.oldPos = new THREE.Vector3(x, y, z);
        this.isPinned = pinned;
    }

    update(dt: number) {
        if (this.isPinned) return;
        const velocity = this.pos.clone().sub(this.oldPos).multiplyScalar(DAMPING);
        this.oldPos.copy(this.pos);
        this.pos.add(velocity);
        this.pos.add(GRAVITY.clone().multiplyScalar(dt * dt));
    }
}

export default function Lanyard({ position = [0, 6, 0] }: { position?: [number, number, number] }) {
    const { raycaster, pointer, camera } = useThree();
    const lineRef = useRef<any>(null);
    const cardRef = useRef<THREE.Group>(null);
    const [hovered, setHovered] = useState(false);

    // Physics Points
    const points = useMemo(() => {
        const arr: Point[] = [];
        const startPos = new THREE.Vector3(...position);
        for (let i = 0; i < SEGMENTS; i++) {
            arr.push(new Point(startPos.x, startPos.y - i * SEGMENT_LENGTH, startPos.z, i === 0));
        }
        return arr;
    }, [position]);

    const dragPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), []);
    const mousePos = useMemo(() => new THREE.Vector3(), []);

    useFrame((state, delta) => {
        const dt = Math.min(delta, 0.05);

        // 1. Mouse Drag Visualization
        raycaster.setFromCamera(pointer, camera);
        raycaster.ray.intersectPlane(dragPlane, mousePos);

        if (hovered) {
            const lastPoint = points[SEGMENTS - 1];
            // Soft pull
            const pull = mousePos.clone().sub(lastPoint.pos).multiplyScalar(0.2);
            lastPoint.pos.add(pull);
        }

        // 2. Verlet Physics
        const subSteps = SIMULATION_STEPS;
        const subDt = dt / subSteps;

        for (let step = 0; step < subSteps; step++) {
            points.forEach(p => p.update(subDt));

            for (let i = 0; i < SEGMENTS - 1; i++) {
                const p1 = points[i];
                const p2 = points[i + 1];
                const dist = p1.pos.distanceTo(p2.pos);
                const error = dist - SEGMENT_LENGTH;

                if (dist > 0.0001) {
                    const correction = p2.pos.clone().sub(p1.pos).multiplyScalar(error / dist * 0.5);
                    if (!p1.isPinned) p1.pos.add(correction);
                    if (!p2.isPinned) p2.pos.sub(correction);
                    if (p1.isPinned) p2.pos.sub(correction);
                }
            }
            points[0].pos.set(...position);
        }

        // 3. Update Geometry
        const curve = new THREE.CatmullRomCurve3(points.map(p => p.pos));
        const curvePoints = curve.getPoints(SEGMENTS * 5);
        if (lineRef.current) lineRef.current.geometry.setFromPoints(curvePoints);

        // 4. Update Card
        if (cardRef.current) {
            const endPoint = points[SEGMENTS - 1];
            const prevPoint = points[SEGMENTS - 2];

            cardRef.current.position.copy(endPoint.pos);

            const dx = endPoint.pos.x - prevPoint.pos.x;
            const dy = endPoint.pos.y - prevPoint.pos.y;
            const angleZ = Math.atan2(dy, dx) + Math.PI / 2;

            cardRef.current.rotation.z = THREE.MathUtils.lerp(cardRef.current.rotation.z, angleZ, 0.15);

            const velX = (endPoint.pos.x - endPoint.oldPos.x) / dt;
            cardRef.current.rotation.y = THREE.MathUtils.lerp(cardRef.current.rotation.y, velX * -2.0, 0.1);

            const velY = (endPoint.pos.y - endPoint.oldPos.y) / dt;
            cardRef.current.rotation.x = THREE.MathUtils.lerp(cardRef.current.rotation.x, velY * 2.0, 0.1);
        }
    });

    return (
        <group>
            {/* Thread */}
            <line ref={lineRef}>
                <bufferGeometry />
                <lineBasicMaterial color="#aaaaaa" transparent opacity={0.5} linewidth={1} />
            </line>

            {/* Card Group */}
            <group
                ref={cardRef}
                onPointerOver={() => { document.body.style.cursor = 'grab'; setHovered(true); }}
                onPointerOut={() => { document.body.style.cursor = 'auto'; setHovered(false); }}
                onPointerDown={() => { document.body.style.cursor = 'grabbing'; }}
                onPointerUp={() => { document.body.style.cursor = 'grab'; }}
            >
                {/* Visual Card */}
                <group position={[0, -0.75, 0]}>
                    {/* Metal Clip */}
                    <mesh position={[0, 0.9, 0]}>
                        <cylinderGeometry args={[0.08, 0.08, 0.3, 16]} rotation={[0, 0, Math.PI / 2]} />
                        <meshStandardMaterial color="#888" metalness={1} roughness={0.2} />
                    </mesh>

                    {/* Card Body - Glass */}
                    <mesh>
                        <boxGeometry args={[1.8, 2.8, 0.05]} />
                        <meshPhysicalMaterial
                            color="#101010"
                            roughness={0.1}
                            metalness={0.1}
                            transmission={0.8}
                            thickness={1.5}
                            clearcoat={1.0}
                        />
                    </mesh>

                    {/* Inner Content */}
                    <group position={[0, 0, 0.04]}>
                        <Text
                            color="white"
                            fontSize={0.3}
                            position={[0, 0.6, 0]}
                            anchorX="center"
                            anchorY="middle"
                        >
                            SECURE
                        </Text>
                        <Text
                            color="#00ffcc"
                            fontSize={0.18}
                            position={[0, 0.3, 0]}
                            anchorX="center"
                            anchorY="middle"
                        >
                            ACCESS GRANTED
                        </Text>

                        <mesh position={[0, -0.8, 0]}>
                            <planeGeometry args={[1.4, 0.3]} />
                            <meshBasicMaterial color="#222" />
                        </mesh>
                        <mesh position={[0.5, -0.8, 0.01]}>
                            <planeGeometry args={[0.3, 0.2]} />
                            <meshBasicMaterial color="#d4af37" />
                        </mesh>
                    </group>
                </group>
            </group>
        </group>
    );
}
