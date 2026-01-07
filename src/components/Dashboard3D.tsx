'use client'

import React, { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Text, OrbitControls, Html } from '@react-three/drei'
import * as THREE from 'three'
import { useView } from '@/context/ViewProvider'

interface PanelProps {
    position: [number, number, number]
    rotation: [number, number, number]
    title: string
    color: string
}

const Panel = ({ position, rotation, title, color }: PanelProps) => {
    const { setView } = useView()
    const [hovered, setHovered] = useState(false)
    const width = 6
    const height = 4

    return (
        <group
            position={position}
            rotation={rotation}
            onClick={() => setView('HOME')}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
        >
            {/* Main Panel with Glow */}
            <mesh>
                <planeGeometry args={[width, height]} />
                <meshStandardMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={hovered ? 0.8 : 0.5}
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

            {/* Interactive HTML Preview */}
            <Html
                transform
                occlude
                position={[0, 0, 0.05]}
                style={{
                    width: '600px',
                    height: '400px',
                    // Scale down to fit the panel resolution better
                    transform: 'scale(0.5)',
                    transformOrigin: 'top left',
                    pointerEvents: 'none' // Let the click pass through to the mesh for navigation, or use button inside
                }}
            >
                <div className="w-[1200px] h-[800px] bg-slate-900/80 backdrop-blur-md p-10 flex flex-col items-center justify-center text-center border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                    {/* Replica of Home Page Hero */}
                    <div className="z-10 text-center max-w-4xl">
                        <h1 className="text-6xl font-bold text-white mb-8 drop-shadow-xl leading-snug">
                            Obsługa klienta, zarządzanie i analiza<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-white to-blue-400">
                                – w jednym systemie.
                            </span>
                        </h1>
                        <p className="text-3xl text-slate-300/80 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
                            Kliknij, aby przejść do pełnego widoku {title}.
                        </p>
                        <div className="px-6 py-3 bg-blue-600 text-white rounded-full text-2xl font-semibold shadow-lg shadow-blue-500/30">
                            Zobacz Więcej
                        </div>
                    </div>
                </div>
            </Html>

            {/* Title Text (Above Panel) */}
            <Text
                position={[0, 2.3, 0.1]}
                fontSize={0.5}
                color="white"
                anchorX="center"
                anchorY="middle"
                outlineWidth={0.02}
                outlineColor="#000000"
            >
                {title}
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
                    // Limit vertical angle to avoid getting lost
                    minPolarAngle={Math.PI / 2 - 0.5}
                    maxPolarAngle={Math.PI / 2 + 0.5}
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
