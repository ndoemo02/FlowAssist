'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

export default function Contact3D() {
    const containerRef = useRef<HTMLDivElement>(null)
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
    const sceneRef = useRef<THREE.Scene | null>(null)
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)

    // Objects
    const penPivotRef = useRef<THREE.Group | null>(null)
    const textureRef = useRef<THREE.CanvasTexture | null>(null)
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null)

    // State for writing logic
    const cursorRef = useRef({ x: 100, y: 100 })
    const targetPosRef = useRef(new THREE.Vector3(0, 0, 0))

    // Streaming & Animation Queue
    const lastResultIndexRef = useRef(0)
    const localBufferRef = useRef('')
    const queueRef = useRef<string[]>([])
    const isProcessingQueueRef = useRef(false)

    // Constants
    const CANVAS_SIZE = 1024
    const PLANE_WIDTH = 10
    const PLANE_HEIGHT = 14

    useEffect(() => {
        if (!containerRef.current) return

        // === 1. SETUP SCENE ===
        const scene = new THREE.Scene()
        sceneRef.current = scene

        // Video Background (Earth/Space)
        const video = document.createElement('video');
        video.src = '/dev/Assets/TV/light_projector_free_download/Light Projector (Free Download)/Pixabay Files/Earth - 29760.mp4';
        video.crossOrigin = 'anonymous';
        video.loop = true;
        video.muted = true;
        video.play().catch(e => console.warn("Video autoplay blocked", e));

        const videoTexture = new THREE.VideoTexture(video);
        videoTexture.colorSpace = THREE.SRGBColorSpace;
        scene.background = videoTexture;
        scene.environment = videoTexture; // Reflections

        const camera = new THREE.PerspectiveCamera(45, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 100)
        camera.position.set(0, 15, 10)
        camera.lookAt(0, 0, 0)
        cameraRef.current = camera

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
        renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        renderer.shadowMap.enabled = true
        containerRef.current.appendChild(renderer.domElement)
        rendererRef.current = renderer

        // === 2. LIGHTING ===
        const ambLight = new THREE.AmbientLight(0xffffff, 0.4)
        scene.add(ambLight)

        const dirLight = new THREE.DirectionalLight(0xfffaed, 2.0)
        dirLight.position.set(5, 10, 5)
        dirLight.castShadow = true
        dirLight.shadow.mapSize.width = 2048
        dirLight.shadow.mapSize.height = 2048
        scene.add(dirLight)

        // === 3. PAPER (CANVAS) ===
        const canvas = document.createElement('canvas')
        canvas.width = CANVAS_SIZE
        canvas.height = CANVAS_SIZE
        const ctx = canvas.getContext('2d')
        ctxRef.current = ctx

        if (ctx) {
            ctx.fillStyle = '#f4e4bc'
            ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)
            // Liniature
            ctx.strokeStyle = 'rgba(0,0,0,0.1)'
            ctx.lineWidth = 2
            for (let y = 100; y < CANVAS_SIZE; y += 80) {
                ctx.beginPath(); ctx.moveTo(100, y); ctx.lineTo(CANVAS_SIZE - 100, y); ctx.stroke();
            }
            ctx.font = '60px "Brush Script MT", cursive'
            ctx.fillStyle = '#1a0b00'
            ctx.textBaseline = 'bottom'
        }

        const texture = new THREE.CanvasTexture(canvas)
        textureRef.current = texture

        // FIX ORIENTATION: Rotate texture 180 deg to match user view
        texture.center.set(0.5, 0.5)
        texture.rotation = Math.PI
        // Note: When texture is rotated 180, Top-Left of canvas becomes Bottom-Right of mesh UV?
        // Standard Plane UV: (0,0) BotLeft, (1,1) TopRight.
        // Canvas (0,0) TopLeft -> UV (0,1).
        // If we rotate texture 180, UV (0,1) moves to (1,0).
        // Effectively, writing at 0,0 (Top Left) will appear at Bottom Right?
        // We might need to invert our mapping logic or valid via trial.
        // Let's stick to standard logic and rely on rotation for visual correctness.

        const planeGeo = new THREE.PlaneGeometry(PLANE_WIDTH, PLANE_HEIGHT)
        const planeMat = new THREE.MeshStandardMaterial({
            map: texture,
            roughness: 0.2,
            metalness: 0.1,
            side: THREE.DoubleSide
        })
        const paperPlane = new THREE.Mesh(planeGeo, planeMat)
        paperPlane.rotation.x = -Math.PI / 2 // Flat on floor
        paperPlane.receiveShadow = true
        scene.add(paperPlane)

        // === 4. PEN ===
        const loader = new GLTFLoader()
        const pivotGroup = new THREE.Group()
        penPivotRef.current = pivotGroup
        scene.add(pivotGroup)
        pivotGroup.position.set(5, 1, 5) // Resting pos

        loader.load('/Flowassist3d/free_quill-pen__lowpoly.glb', (gltf: any) => {
            const model = gltf.scene as THREE.Group
            model.traverse((child: any) => {
                if (child.isMesh) {
                    child.castShadow = true
                    child.receiveShadow = true
                }
            })
            model.scale.set(50, 50, 50)

            // Pivot Adjustment
            const box = new THREE.Box3().setFromObject(model)
            const center = new THREE.Vector3()
            box.getCenter(center)
            // Align Tip to (0,0,0) of pivot group
            model.position.sub(new THREE.Vector3(center.x, box.min.y, center.z))

            // Initial Rotation for writing
            model.rotation.x = Math.PI / 4
            model.rotation.y = Math.PI // Orient to hand??

            pivotGroup.add(model)
        }, undefined, (e) => console.error(e))

        // === 5. ANIMATION LOOP ===
        const animate = () => {
            requestAnimationFrame(animate)

            if (penPivotRef.current) {
                // Smooth movement
                penPivotRef.current.position.lerp(targetPosRef.current, 0.15)

                // Idle breathing if not writing (optional)
            }

            // video texture update usually auto
            renderer.render(scene, camera)
        }
        animate()

        const handleResize = () => {
            if (containerRef.current && cameraRef.current && rendererRef.current) {
                cameraRef.current.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight
                cameraRef.current.updateProjectionMatrix()
                rendererRef.current.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
            }
        }
        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
            video.pause()
            if (containerRef.current && rendererRef.current) containerRef.current.removeChild(rendererRef.current.domElement)
            renderer.dispose()
        }

    }, [])


    // === WRITING LOGIC ===
    const [isListening, setIsListening] = useState(false)
    const recognitionRef = useRef<any>(null)

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
            if (SpeechRecognition) {
                const recognition = new SpeechRecognition()
                recognition.continuous = true
                recognition.interimResults = true
                recognition.lang = 'pl-PL'

                recognition.onresult = (event: any) => {
                    const resultIndex = event.resultIndex
                    const result = event.results[resultIndex]
                    if (!result) return

                    const transcript = result[0].transcript

                    if (resultIndex !== lastResultIndexRef.current) {
                        localBufferRef.current = ''
                        lastResultIndexRef.current = resultIndex
                    }

                    let newContent = ''
                    if (transcript.length > localBufferRef.current.length) {
                        newContent = transcript.slice(localBufferRef.current.length)
                    }

                    if (newContent) {
                        // Queue characters
                        newContent.split('').forEach(char => queueRef.current.push(char))
                        processQueue()
                        localBufferRef.current = transcript
                    }
                }

                recognition.onerror = (e: any) => {
                    if (e.error !== 'no-speech') setIsListening(false)
                }
                recognitionRef.current = recognition
            }
        }
    }, [])

    const processQueue = () => {
        if (isProcessingQueueRef.current || queueRef.current.length === 0) return
        isProcessingQueueRef.current = true

        const char = queueRef.current.shift()
        if (char) {
            animateWritingStep(char, () => {
                isProcessingQueueRef.current = false
                if (queueRef.current.length > 0) processQueue()
            })
        } else {
            isProcessingQueueRef.current = false
        }
    }

    const animateWritingStep = (char: string, onComplete: () => void) => {
        if (!ctxRef.current || !textureRef.current) { onComplete(); return }

        // 1. Measure & Calculate Position
        const ctx = ctxRef.current
        const measure = ctx.measureText(char)

        if (cursorRef.current.x + measure.width > CANVAS_SIZE - 100) {
            cursorRef.current.x = 100
            cursorRef.current.y += 80
        }

        // 2. Move Pen Target first
        // We want pen to be AT the writing point.
        // Current X/Y is Top-Left of char. 
        // We want pen tip at Center of char? Or start? Let's say center.
        const centerX = cursorRef.current.x + measure.width / 2
        const centerY = cursorRef.current.y

        const target3D = mapCanvasToWorld(centerX, centerY)
        targetPosRef.current.copy(target3D)

        // 3. Wait for "Move" then "Write"
        // Simplified: 50ms movement time
        setTimeout(() => {
            // Draw
            ctx.fillText(char, cursorRef.current.x, cursorRef.current.y)
            textureRef.current!.needsUpdate = true
            cursorRef.current.x += measure.width

            // Pen Wiggle (Scratch effect)
            if (penPivotRef.current) {
                // Quick rotation z bump
                penPivotRef.current.rotation.z += 0.05
                setTimeout(() => { if (penPivotRef.current) penPivotRef.current.rotation.z -= 0.05 }, 50)
            }

            // Next Char Delay
            // Space is faster (no scratch), letters take time
            const delay = char === ' ' ? 20 : 50
            setTimeout(onComplete, delay)

        }, 50)
    }

    const mapCanvasToWorld = (cx: number, cy: number) => {
        // Texture is Rotated 180 (Math.PI)
        // Center (0.5, 0.5)
        // UV (0,0) -> Rotated -> (1,1) ?

        // Standard Mapping:
        // u = x / W
        // v = 1 - y / H

        // If texture is rotated 180:
        // Visual (u, v) matches Canvas (1-u, 1-v)?
        // So simply: if we write at Top-Left (0,0), it appears at Bottom-Right if pure 180?
        // To fix this, we need to know WHERE on the 3D plane correct visual appears.

        // Let's assume we want visual to be correct for user looking at plane.
        // If we rotate texture 180, the IMAGE is flipped.
        // If we want Pen to match Visual, we must map coordinate to the FLIPPED location.

        // Let's assume Standard Plane (No Rotation except -90 X).
        // +X is Right. -X is Left.
        // -Z is Top. +Z is Bottom.

        // Texture Rotation = PI means:
        // Pixel at (0,0) [TopLeft] is rendered at UV(0,0) rotated around center -> UV(1,1) [TopRight of Mesh?]

        // Let's simplify:
        // Calculate standard UV.
        // Rotate that UV by 180 around 0.5,0.5.
        // Then map to World.

        let u = cx / CANVAS_SIZE
        let v = 1.0 - (cy / CANVAS_SIZE)

        // Rotate UV 180 (Inverse)
        // u' = 1 - u
        // v' = 1 - v
        const uRot = 1.0 - u
        const vRot = 1.0 - v

        // Map to Plane (-W/2 to W/2)
        // Left is 0 -> -Width/2
        const x3D = (uRot - 0.5) * PLANE_WIDTH
        const z3D = -(vRot - 0.5) * PLANE_HEIGHT // Standard mapping V->Y

        return new THREE.Vector3(x3D, 0.5, z3D)
    }

    const toggleListening = () => {
        if (!recognitionRef.current) {
            alert("Brak Web Speech API.")
            return
        }
        if (isListening) {
            recognitionRef.current.stop()
            setIsListening(false)
        } else {
            recognitionRef.current.start()
            setIsListening(true)
        }
    }

    return (
        <div className="w-full h-full relative" ref={containerRef}>
            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-4 z-10">
                <div className="bg-black/80 backdrop-blur-md px-6 py-3 rounded-2xl text-white text-sm mb-2 border border-white/10 shadow-xl">
                    {recognitionRef.current ? "Mówię, piszę, tworzę... (Nasłuchiwanie aktywne)" : "Twoja przeglądarka nie słyszy."}
                </div>
                <button
                    onClick={toggleListening}
                    className={`px-8 py-4 rounded-full font-bold transition-all shadow-[0_0_30px_rgba(0,0,0,0.5)] transform hover:scale-105 active:scale-95 flex items-center gap-3 border border-white/10 ${isListening
                        ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                        : 'bg-zinc-900 hover:bg-zinc-800 text-white'
                        }`}
                >
                    {isListening ? (
                        <>
                            <span className="w-3 h-3 bg-white rounded-full animate-bounce"></span>
                            Zatrzymaj
                        </>
                    ) : (
                        <>
                            <span>🎤</span> Rozpocznij Pisanie
                        </>
                    )}
                </button>
            </div>
            {/* Overlay Vignette for cinematic look */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)] opacity-50"></div>
        </div>
    )
}
