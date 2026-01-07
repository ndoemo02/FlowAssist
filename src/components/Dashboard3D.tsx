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
    url: string
}

const Panel = ({ position, rotation, title, color, url }: PanelProps) => {
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
                    transform: 'scale(0.5)',
                    transformOrigin: 'top left',
                    pointerEvents: 'none' // Base interactions passed to mesh
                }}
            >
                {/* 
                   Stop propagation on container to allow iframe interaction without navigating home 
                */}
                <div
                    className="w-[1200px] h-[800px] bg-black overflow-hidden shadow-2xl rounded-xl border border-white/10"
                    style={{ pointerEvents: 'auto' }}
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="w-full h-full flex flex-col bg-black relative">
                        <div className="bg-black/80 text-white p-2 flex justify-between items-center absolute top-0 w-full z-10 backdrop-blur-sm">
                            <span className="font-bold px-4">{title} Live Preview</span>
                            <div className="flex gap-2 px-2">
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            </div>
                        </div>
                        <iframe
                            src={url}
                            className="w-full h-full border-none pt-10 bg-white"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                            title={`${title} Preview`}
                        />
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
        {
            title: 'YouTube',
            color: '#ff0000',
            angle: 0,
            url: "https://www.youtube.com/embed/LXb3EKWsInQ?autoplay=1&mute=0" // Example video
        },
        {
            title: 'Facebook',
            color: '#1877f2',
            angle: (2 * Math.PI) / 3,
            // Facebook Page Plugin Embed
            url: "https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FMeta&tabs=timeline&width=500&height=800&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId"
        },
        {
            title: 'TikTok',
            color: '#00f2ea',
            angle: (4 * Math.PI) / 3,
            // TikTok Embed - utilizing a generic embed endpoint or explicit video might be required.
            // Using a sample video embed for demo purposes.
            url: "https://www.tiktok.com/embed/v2/7418335390845095173"
        },
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
                            url={panel.url}
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
