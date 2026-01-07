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
    const width = 6
    const height = 4

    return (
        <group position={position} rotation={rotation}>
            {/* Main Panel with Glow */}
            <mesh>
                <planeGeometry args={[width, height]} />
                <meshStandardMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={0.5}
                    transparent
                    opacity={0.3}
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* Border/Frame */}
            <mesh position={[0, 0, 0.02]}>
                <lineSegments>
                    <edgesGeometry args={[new THREE.PlaneGeometry(width, height)]} />
                    <lineBasicMaterial color={color} linewidth={2} />
                </lineSegments>
            </mesh>

            {/* Title Text */}
            <Text
                position={[0, 1.5, 0.1]}
                fontSize={0.5}
                color="white"
                anchorX="center"
                anchorY="middle"
                outlineWidth={0.02}
                outlineColor="#000000"
            >
                {title}
            </Text>

            {/* Mock Content Text */}
            <Text
                position={[0, 0, 0.1]}
                fontSize={0.25}
                color="#eeeeee"
                anchorX="center"
                anchorY="middle"
                maxWidth={5}
                textAlign="center"
            >
                Analiza danych dla {title}
                {'\n'}
                Zasięg: +24% | Zaangażowanie: 12%
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

    const radius = 7.5

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

                <ambientLight intensity={0.2} />
                <pointLight position={[0, 5, 0]} intensity={1} />
                <pointLight position={[10, 10, 10]} intensity={0.5} />

                {panels.map((panel, index) => {
                    const x = -Math.sin(panel.angle) * radius
                    const z = -Math.cos(panel.angle) * radius

                    // Calculate rotation to face center (0,0,0)
                    // We use atan2(x, z) to get the angle of position relative to origin
                    // Adding PI rotates it 180 degrees to face the origin instead of away from it
                    const rotY = Math.atan2(x, z) + Math.PI

                    return (
                        <Panel
                            key={index}
                            position={[x, 0, z]}
                            rotation={[0, rotY, 0]}
                            title={panel.title}
                            color={panel.color}
                        />
                    )
                })}

                {/* Floor grid for reference */}
                <gridHelper args={[30, 30, 0x333333, 0x111111]} position={[0, -4, 0]} />

                {/* Stars or particles for atmosphere */}
                <mesh position={[0, 0, 0]}>
                    <sphereGeometry args={[20, 32, 32]} />
                    <meshBasicMaterial color="#050505" side={THREE.BackSide} />
                </mesh>

            </Canvas>
        </div>
    )
}
