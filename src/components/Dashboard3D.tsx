'use client'

import React, { useState, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { Text, OrbitControls, Html } from '@react-three/drei'
import * as THREE from 'three'
import { useView } from '@/context/ViewProvider'

const BrowserScreen = ({ position, rotation }: { position: [number, number, number], rotation: [number, number, number] }) => {
    const { setView } = useView()
    const [url, setUrl] = useState('https://www.google.com/webhp?igu=1')
    const [inputUrl, setInputUrl] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [hovered, setHovered] = useState(false)

    const width = 10
    const height = 6

    const handleNavigate = (e: React.FormEvent) => {
        e.preventDefault()
        if (!inputUrl.trim()) return

        setIsLoading(true)
        let target = inputUrl

        // Simple heuristic: if it doesn't look like a URL, treat as search
        if (!target.includes('.') || target.includes(' ')) {
            target = `https://www.google.com/search?igu=1&q=${encodeURIComponent(target)}`
        } else if (!target.startsWith('http')) {
            target = `https://${target}`
        }

        // Add igu=1 to Google URLs to attempt to bypass x-frame-options (works indiscriminately)
        if (target.includes('google.com') && !target.includes('igu=1')) {
            target += (target.includes('?') ? '&' : '?') + 'igu=1'
        }

        setUrl(target)
        setTimeout(() => setIsLoading(false), 1000) // Fake loading state
    }

    return (
        <group
            position={position}
            rotation={rotation}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
        >
            {/* Screen Bezel/Frame */}
            <mesh position={[0, 0, 0]}>
                <boxGeometry args={[width + 0.2, height + 0.2, 0.1]} />
                <meshStandardMaterial color="#111" metalness={0.8} roughness={0.2} />
            </mesh>

            {/* Screen Content Area (Mesh behind HTML) */}
            <mesh position={[0, 0, 0.06]}>
                <planeGeometry args={[width, height]} />
                <meshStandardMaterial
                    color="black"
                    emissive="#ffffff"
                    emissiveIntensity={hovered ? 0.1 : 0}
                />
            </mesh>

            {/* Interactive Browser UI */}
            <Html
                transform
                occlude
                position={[0, 0, 0.07]}
                style={{
                    width: '1000px',
                    height: '600px',
                    transform: 'scale(0.1)', // Scale down to fit the 3D width units roughly (10 units width ~= 1000px content if scale is 0.01 but here we use transform prop which handles pixel->3d conversion differently, often 1 unit = 100px. Let's adjust scale manually or rely on 'transform' prop doing heavy lifting.)
                    // Actually with 'transform' prop, 1 pixel is 1 unit usually unless scaled. 
                    // If HTML is 1000px, and we want it to be 10 units wide, scale should be 0.01.
                    // But <Html transform> computes a scale relative to distance. 
                    // Let's stick to the previous working scale factor logic.
                }}
                scale={0.1}
            >
                <div
                    className="w-[1000px] h-[600px] bg-white flex flex-col overflow-hidden rounded-lg shadow-2xl"
                    onPointerDown={(e) => e.stopPropagation()} // Enable interaction
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Browser Toolbar */}
                    <div className="h-12 bg-gray-100 border-b border-gray-300 flex items-center px-4 gap-2">
                        <div className="flex gap-1.5 mr-2">
                            <div className="w-3 h-3 rounded-full bg-red-400"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                            <div className="w-3 h-3 rounded-full bg-green-400"></div>
                        </div>

                        {/* Back/Forward Mock */}
                        <div className="flex gap-2 text-gray-400 mr-2">
                            <span>←</span>
                            <span>→</span>
                            <span onClick={() => setUrl('https://www.google.com/webhp?igu=1')} className="cursor-pointer hover:text-black">🏠</span>
                        </div>

                        {/* Address Bar */}
                        <form onSubmit={handleNavigate} className="flex-1">
                            <input
                                type="text"
                                value={inputUrl}
                                onChange={(e) => setInputUrl(e.target.value)}
                                placeholder="Search Google or type a URL"
                                className="w-full bg-white border border-gray-300 rounded-full px-4 py-1 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                            />
                        </form>
                    </div>

                    {/* Webview Content */}
                    <div className="flex-1 relative bg-white">
                        {isLoading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
                                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        )}
                        <iframe
                            src={url}
                            title="Browser View"
                            className="w-full h-full border-none"
                            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        />
                    </div>
                </div>
            </Html>

            {/* "Back to App" Button (Floating below screen) */}
            <group position={[0, -3.5, 0]} onClick={() => setView('HOME')}>
                <mesh>
                    <boxGeometry args={[3, 0.8, 0.2]} />
                    <meshStandardMaterial color="#333" />
                </mesh>
                <Text position={[0, 0, 0.11]} fontSize={0.3} color="white">
                    EXIT DASHBOARD
                </Text>
            </group>
        </group>
    )
}

export default function Dashboard3D() {
    return (
        <div className="w-full h-full bg-black">
            <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
                <color attach="background" args={['#050505']} />

                {/* Controls */}
                <OrbitControls
                    enablePan={false}
                    minPolarAngle={Math.PI / 2 - 0.5}
                    maxPolarAngle={Math.PI / 2 + 0.5}
                    minAzimuthAngle={-0.5}
                    maxAzimuthAngle={0.5}
                    maxDistance={12}
                    minDistance={4}
                />

                <ambientLight intensity={0.5} />
                <pointLight position={[0, 10, 5]} intensity={1.0} />

                {/* Single Central Screen */}
                <BrowserScreen position={[0, 0, 0]} rotation={[0, 0, 0]} />

                {/* Environment Decor */}
                <gridHelper args={[40, 40, 0x222222, 0x111111]} position={[0, -4, 0]} />
                <mesh position={[0, 0, -10]}>
                    <sphereGeometry args={[30, 32, 32]} />
                    <meshBasicMaterial color="#000" side={THREE.BackSide} />
                </mesh>
            </Canvas>
        </div>
    )
}
