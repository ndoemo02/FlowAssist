'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Text, MeshTransmissionMaterial, Trail } from '@react-three/drei';
import * as THREE from 'three';

// --- CONFIGURATION ---
const CHAOS_COUNT = 150;
const ORDER_COUNT = 100;

// 1. CHAOS PARTICLES (Red/Orange, Jittery motion, Left Side)
function ChaosSystem() {
    const pointsRef = useRef<THREE.Points>(null);

    // Generate initial random positions
    const [positions, randomness] = useMemo(() => {
        const pos = new Float32Array(CHAOS_COUNT * 3);
        const rand = new Float32Array(CHAOS_COUNT * 3);
        for (let i = 0; i < CHAOS_COUNT; i++) {
            // Start area: Left side (-15 to -2)
            pos[i * 3] = -5 - Math.random() * 10;     // x
            pos[i * 3 + 1] = (Math.random() - 0.5) * 8; // y
            pos[i * 3 + 2] = (Math.random() - 0.5) * 8; // z

            rand[i * 3] = Math.random();
            rand[i * 3 + 1] = Math.random();
            rand[i * 3 + 2] = Math.random();
        }
        return [pos, rand];
    }, []);

    useFrame((state) => {
        if (!pointsRef.current) return;
        const positionsAttr = pointsRef.current.geometry.attributes.position;
        const t = state.clock.elapsedTime;

        for (let i = 0; i < CHAOS_COUNT; i++) {
            const idx = i * 3;
            // Jitter movement
            const speed = 0.05 + randomness[idx] * 0.05;

            // Move generally towards center (X=0), but chaotic
            positionsAttr.array[idx] += speed;

            // Add noise to Y/Z
            positionsAttr.array[idx + 1] += Math.sin(t * 2 + randomness[idx + 1] * 10) * 0.05;
            positionsAttr.array[idx + 2] += Math.cos(t * 3 + randomness[idx + 2] * 10) * 0.05;

            // Reset if it hits the "Prism" (x > -1.5) or goes too far
            if (positionsAttr.array[idx] > -1.5) {
                positionsAttr.array[idx] = -15; // Reset to far left
            }
        }
        positionsAttr.needsUpdate = true;
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={CHAOS_COUNT}
                    array={positions}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.15}
                color="#ff4400"
                transparent
                opacity={0.8}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
}

// 2. ORDER PARTICLES (Cyan, Straight Lines, Right Side)
function OrderSystem() {
    const groupRef = useRef<THREE.Group>(null);
    const particles = useMemo(() => {
        return new Array(ORDER_COUNT).fill(0).map(() => ({
            y: (Math.random() - 0.5) * 4, // Tighter vertical spread
            z: (Math.random() - 0.5) * 4, // Tighter depth spread
            speed: 0.1 + Math.random() * 0.1,
            offset: Math.random() * 10
        }));
    }, []);

    useFrame((state) => {
        if (!groupRef.current) return;
        groupRef.current.children.forEach((mesh, i) => {
            const p = particles[i];
            // Move straight right (+X)
            mesh.position.x += p.speed;

            // Slight pulse or "wave" effect to show flow, but perfectly ordered
            // mesh.position.y = p.y + Math.sin(state.clock.elapsedTime + mesh.position.x) * 0.1;

            // Reset loop
            if (mesh.position.x > 15) {
                mesh.position.x = 1.5; // Reset to right side of Prism
            }
        });
    });

    return (
        <group ref={groupRef}>
            {particles.map((p, i) => (
                <mesh key={i} position={[1.5 + p.offset, p.y, p.z]}>
                    <boxGeometry args={[0.8, 0.05, 0.05]} /> {/* Long streaks */}
                    <meshBasicMaterial color="#00ffff" transparent opacity={0.6} />
                </mesh>
            ))}
        </group>
    );
}

// 3. THE PRISM (Center, Refractive)
function PrismCore() {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.2;
            meshRef.current.rotation.y += 0.005;
            meshRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.2) * 0.1;
        }
    });

    return (
        <group>
            {/* Inner Core */}
            <Float speed={4} rotationIntensity={1} floatIntensity={1}>
                <mesh ref={meshRef}>
                    <octahedronGeometry args={[1.5, 0]} />
                    <MeshTransmissionMaterial
                        backside
                        samples={4}
                        thickness={2}
                        chromaticAberration={0.5} // High aberration for "Prism" effect
                        anisotropy={0.3}
                        distortion={0.4}
                        distortionScale={0.5}
                        temporalDistortion={0.2}
                        iridescence={1}
                        iridescenceIOR={1}
                        iridescenceThicknessRange={[0, 1400]}
                        roughness={0}
                        clearcoat={1}
                        color="#ffffff"
                    />
                </mesh>
            </Float>

            {/* Wireframe outline for structure */}
            <mesh scale={[1.6, 1.6, 1.6]} rotation={[0.5, 0.5, 0]}>
                <icosahedronGeometry args={[1, 1]} />
                <meshBasicMaterial wireframe color="#333" transparent opacity={0.1} />
            </mesh>
        </group>
    );
}

// 4. LIGHTING & ENVIRONMENT
function SceneEnvironment() {
    return (
        <>
            <ambientLight intensity={0.2} />
            {/* Warm light for Chaos side */}
            <pointLight position={[-10, 2, 2]} color="#ff4400" intensity={2} distance={15} />

            {/* Cool light for Order side */}
            <pointLight position={[10, 2, 2]} color="#00ffff" intensity={2} distance={15} />

            {/* Top light */}
            <spotLight position={[0, 10, 0]} intensity={1} angle={0.5} penumbra={1} color="white" />
        </>
    );
}

export default function PrismContent() {
    return (
        <>
            <SceneEnvironment />

            <ChaosSystem />
            <PrismCore />
            <OrderSystem />

            {/* Optional Labels in 3D Space using @react-three/drei Text */}
            <Text position={[-6, 4, 0]} fontSize={0.5} color="#ff4400" anchorX="center" anchorY="middle">
                RAW INPUT
            </Text>
            <Text position={[6, 4, 0]} fontSize={0.5} color="#00ffff" anchorX="center" anchorY="middle">
                STRUCTURED OUTPUT
            </Text>
        </>
    );
}
