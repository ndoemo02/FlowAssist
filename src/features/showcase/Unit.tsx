import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { motion } from 'framer-motion-3d';
import * as THREE from 'three';

interface UnitProps {
    position: [number, number, number];
    type: 'fleet' | 'squadron'; // Flota (Woda) lub Eskadra (Powietrze)
    label: string;
    isSelected?: boolean;
}

export default function Unit({ position, type, label, isSelected = false }: UnitProps) {
    const meshRef = useRef<THREE.Group>(null);

    // Kolor w zależności od typu
    const color = type === 'fleet' ? '#0ea5e9' : '#f59e0b'; // Sky Blue vs Amber

    // Animacja unoszenia się
    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 2;
            meshRef.current.rotation.y += 0.01;
        }
    });

    return (
        <group ref={meshRef} position={new THREE.Vector3(...position)}>
            {/* Znacznik wizualny jednostki */}
            <mesh>
                {type === 'fleet' ? (
                    <dodecahedronGeometry args={[10, 0]} />
                ) : (
                    <octahedronGeometry args={[10, 0]} />
                )}
                <meshStandardMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={isSelected ? 2 : 0.5}
                    wireframe
                />
            </mesh>

            {/* Pierścień zaznaczenia */}
            {isSelected && (
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -15, 0]}>
                    <ringGeometry args={[15, 16, 32]} />
                    <meshBasicMaterial color={color} side={THREE.DoubleSide} transparent opacity={0.5} />
                </mesh>
            )}

            {/* Etykieta HTML */}
            <Html position={[0, 20, 0]} center distanceFactor={800}>
                <div className={`
                    pointer-events-none select-none whitespace-nowrap
                    flex flex-col items-center
                `}>
                    <div className={`
                        px-2 py-1 bg-black/80 border border-${type === 'fleet' ? 'sky' : 'amber'}-500/50 
                        backdrop-blur-md text-white text-xs font-mono rounded
                        ${isSelected ? 'scale-110 border-white' : 'opacity-80'}
                        transition-all duration-300
                    `}>
                        {label} <span className="text-[10px] text-gray-400">[{type.toUpperCase()}]</span>
                    </div>
                </div>
            </Html>
        </group>
    );
}
