'use client'

import React from 'react'
import { Canvas } from '@react-three/fiber'
import { Text, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

interface PanelProps {
    position: [number, number, number]
    rotation: [number, number, number]
    title: string
    color: string
}

const Panel = ({ position, rotation, title, color }: PanelProps) => {
    return (
        <group position={position} rotation={rotation}>
            {/* Semi-transparent panel */}
            <mesh>
                <planeGeometry args={[3, 2]} />
                <meshBasicMaterial
                    color={color}
                    transparent
                    opacity={0.2}
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* Border/Frame */}
            <mesh position={[0, 0, 0.01]}>
                <ringGeometry args={[0, 0, 0]} /> {/* Placeholder for simpler frame if needed, or stick to simple plane */}
                <lineSegments>
                    <edgesGeometry args={[new THREE.PlaneGeometry(3, 2)]} />
                    <lineBasicMaterial color={color} />
                </lineSegments>
            </mesh>

            {/* Title Text */}
            <Text
                position={[0, 0.5, 0.1]}
                fontSize={0.3}
                color="white"
                anchorX="center"
                anchorY="middle"
            >
                {title}
            </Text>

            {/* Mock Content Text */}
            <Text
                position={[0, 0, 0.1]}
                fontSize={0.15}
                color="#cccccc"
                anchorX="center"
                anchorY="middle"
                maxWidth={2.5}
                textAlign="center"
            >
                Analiza danych dla {title}
            </Text>
        </group>
    )
}

export default function Dashboard3D() {
    const panels = [
        { title: 'YouTube', color: '#ff0000', angle: 0 },
        { title: 'Facebook', color: '#1877f2', angle: (2 * Math.PI) / 3 },
        { title: 'TikTok', color: '#00f2ea', angle: (4 * Math.PI) / 3 },
    ]

    const radius = 4

    return (
        <div className="w-full h-full bg-black">
            <Canvas camera={{ position: [0, 0, 0.1], fov: 75 }}>
                <color attach="background" args={['black']} />

                {/* OrbitControls with reverse controls to simulate looking around from inside */}
                <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    rotateSpeed={-0.5}
                    target={[0, 0, 0]}
                />

                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />

                {panels.map((panel, index) => {
                    const x = -Math.sin(panel.angle) * radius
                    const z = -Math.cos(panel.angle) * radius
                    // Calculate rotation to face center (0,0,0)
                    // Normal plane setup faces +Z. We want it to face (0,0,0).
                    // At angle 0 (Negative Z axis), it should be at [0, 0, -radius]
                    // Rotation should be 0, so it faces +Z (towards origin).
                    // Let's rely on lookAt behavior or manual calc.

                    return (
                        <Panel
                            key={index}
                            position={[x, 0, z]}
                            // Rotate to face center. 
                            // At angle 0, x=0, z=-r. We want to face 0,0,0. That matches default if we consider "front" of plane.
                            // Actually simple calculation:
                            rotation={[0, -panel.angle, 0]}
                            title={panel.title}
                            color={panel.color}
                        />
                    )
                })}

                {/* Floor grid for reference */}
                <gridHelper args={[20, 20, 0x333333, 0x111111]} position={[0, -2, 0]} />

                {/* Stars or particles for atmosphere */}
                <mesh position={[0, 0, 0]}>
                    <sphereGeometry args={[10, 32, 32]} />
                    <meshBasicMaterial color="#000" side={THREE.BackSide} />
                </mesh>

            </Canvas>
        </div>
    )
}
