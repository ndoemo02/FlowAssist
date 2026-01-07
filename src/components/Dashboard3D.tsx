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
                    transform: 'scale(0.5)',
                    transformOrigin: 'top left',
                    // Allow interaction only if it's the specific app panel, or globally?
                    // We want YouTube to be clickable.
                }}
            >
                {/* 
                   We stop propagation on the container to prevent the 3D 'onClick' (Go to Home) 
                   from triggering when interacting with the UI 
                */}
                <div
                    className="w-[1200px] h-[800px] bg-slate-900/90 backdrop-blur-md overflow-hidden shadow-2xl rounded-xl border border-white/10"
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                >
                    {title === 'YouTube' && (
                        <div className="w-full h-full flex flex-col bg-[#0f0f0f] text-white font-sans">
                            {/* Header / Brand */}
                            <div className="h-24 flex items-center px-10 border-b border-white/10 justify-between bg-[#0f0f0f] z-10">
                                <div className="flex items-center gap-6">
                                    {/* Mock Avatar */}
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-yellow-400 to-red-500 flex items-center justify-center text-2xl font-bold">
                                        CK
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-4xl font-bold tracking-tight">Przygody z Konradem</span>
                                        <span className="text-gray-400 text-lg">@PrzygodyzKonradem • 1.2M subskrypcji</span>
                                    </div>
                                </div>
                                <button className="bg-white text-black px-8 py-3 rounded-full font-bold text-xl hover:bg-gray-200 transition-colors">
                                    Subskrybuj
                                </button>
                            </div>

                            {/* Navigation Tabs */}
                            <div className="flex px-10 border-b border-white/10 text-xl font-medium text-gray-400 gap-10 h-16 items-center">
                                <div className="text-white border-b-4 border-white h-full flex items-center px-2 cursor-pointer">Wideo</div>
                                <div className="hover:text-white cursor-pointer h-full flex items-center px-2">Shorts</div>
                                <div className="hover:text-white cursor-pointer h-full flex items-center px-2">Na żywo</div>
                                <div className="hover:text-white cursor-pointer h-full flex items-center px-2">Playhisty</div>
                            </div>

                            {/* Video Grid */}
                            <div className="p-10 grid grid-cols-3 gap-10 overflow-y-auto custom-scrollbar">
                                {[
                                    { title: "Eksploracja Opuszczonej Fabryki", views: "120 tys.", time: "2 dni temu", duration: "14:20" },
                                    { title: "JAK PRZETRWAĆ W LESIE? - Poradnik", views: "85 tys.", time: "5 dni temu", duration: "22:15" },
                                    { title: "Nocleg na Dzikiej Plaży", views: "240 tys.", time: "1 tydzień temu", duration: "18:45" },
                                    { title: "Testujemy Sprzęt Survivalowy", views: "90 tys.", time: "2 tygodnie temu", duration: "10:30" },
                                    { title: "Q&A - Wasze Pytania", views: "50 tys.", time: "3 tygodnie temu", duration: "45:00" },
                                    { title: "Vlog z Podróży do Azji", views: "1.5 mln", time: "1 miesiąc temu", duration: "25:10" }
                                ].map((video, i) => (
                                    <div
                                        key={i}
                                        className="flex flex-col gap-4 group cursor-pointer"
                                        onClick={() => window.open(`https://www.youtube.com/@PrzygodyzKonradem/videos`, '_blank')}
                                    >
                                        <div className="w-full aspect-video bg-slate-800 rounded-xl relative overflow-hidden ring-2 ring-transparent group-hover:ring-white/50 transition-all">
                                            {/* Thumbnail Gradient Placeholder */}
                                            <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-800 group-hover:scale-105 transition-transform duration-500"></div>
                                            <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-sm font-medium">{video.duration}</div>
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                                                <svg className="w-16 h-16 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="flex flex-col gap-1">
                                                <div className="text-xl font-bold leading-tight group-hover:text-blue-400 transition-colors line-clamp-2">
                                                    {video.title}
                                                </div>
                                                <div className="text-gray-400 text-base">
                                                    {video.views} wyświetleń • {video.time}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {title === 'Facebook' && (
                        <div className="w-full h-full flex flex-col bg-[#18191a] text-white">
                            {/* Facebook Mock Header */}
                            <div className="h-20 bg-[#242526] flex items-center px-8 justify-between shadow-md border-b border-white/5">
                                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center font-bold text-2xl">f</div>
                                <div className="flex gap-16 text-slate-400 text-3xl">
                                    <div className="hover:text-blue-500 cursor-pointer text-blue-500">🏠</div>
                                    <div className="hover:text-blue-500 cursor-pointer">📺</div>
                                    <div className="hover:text-blue-500 cursor-pointer">🏪</div>
                                    <div className="hover:text-blue-500 cursor-pointer">👥</div>
                                </div>
                                <div className="w-12 h-12 bg-[#3a3b3c] rounded-full"></div>
                            </div>
                            {/* Mock Feed */}
                            <div className="flex-1 p-8 flex justify-center bg-[#18191a]">
                                <div className="w-[600px] flex flex-col gap-6">
                                    <div className="bg-[#242526] p-6 rounded-xl flex gap-4 items-center">
                                        <div className="w-12 h-12 bg-slate-700 rounded-full"></div>
                                        <div className="h-10 bg-[#3a3b3c] rounded-full flex-1 px-4 flex items-center text-slate-400 text-lg">What's on your mind?</div>
                                    </div>
                                    {[1, 2].map(i => (
                                        <div key={i} className="bg-[#242526] rounded-xl overflow-hidden shadow-sm">
                                            <div className="p-4 flex gap-4 items-center">
                                                <div className="w-12 h-12 bg-slate-700 rounded-full"></div>
                                                <div className="flex flex-col gap-1">
                                                    <div className="w-32 h-4 bg-slate-600 rounded"></div>
                                                    <div className="w-20 h-3 bg-slate-700 rounded"></div>
                                                </div>
                                            </div>
                                            <div className="w-full h-64 bg-slate-800"></div>
                                            <div className="p-4 h-16 border-t border-white/5 bg-[#242526]"></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {title === 'TikTok' && (
                        <div className="w-full h-full flex bg-[#000000] text-white relative">
                            {/* Sidebar */}
                            <div className="w-64 border-r border-white/10 p-6 flex flex-col gap-6">
                                <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#00f2ea] to-[#ff0050]">TikTok</span>
                                <div className="flex flex-col gap-4 text-xl font-semibold mt-4">
                                    <div className="text-red-500">For You</div>
                                    <div className="text-white/50">Following</div>
                                    <div className="text-white/50">LIVE</div>
                                </div>
                                <div className="mt-auto text-sm text-white/30 p-2 border-t border-white/10">
                                    © 2026 TikTok
                                </div>
                            </div>
                            {/* Content */}
                            <div className="flex-1 flex items-center justify-center p-8 bg-[#121212]">
                                <div className="w-[450px] h-full bg-slate-800 rounded-2xl relative overflow-hidden flex items-center justify-center border border-white/10">
                                    <div className="absolute right-4 bottom-32 flex flex-col gap-6 items-center z-20">
                                        <div className="w-12 h-12 rounded-full bg-white/20"></div>
                                        <div className="w-10 h-10 rounded-full bg-white/10"></div>
                                        <div className="w-10 h-10 rounded-full bg-white/10"></div>
                                    </div>
                                    <div className="text-6xl text-white/5">VIDEO</div>
                                    {/* Mock Description */}
                                    <div className="absolute bottom-4 left-4 z-20">
                                        <div className="w-32 h-4 bg-white/20 rounded mb-2"></div>
                                        <div className="w-64 h-3 bg-white/10 rounded"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {!['YouTube', 'Facebook', 'TikTok'].includes(title) && (
                        <div className="w-full h-full flex flex-col items-center justify-center text-white">
                            <h1 className="text-6xl">{title}</h1>
                            <p className="text-2xl mt-4 opacity-50">Preview not available</p>
                        </div>
                    )}
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
