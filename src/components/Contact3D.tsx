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
    const cursorRef = useRef({ x: 100, y: 100 }) // Margins
    const targetPosRef = useRef(new THREE.Vector3(0, 0, 0))
    const isWritingRef = useRef(false)

    // Constants
    const CANVAS_SIZE = 1024
    const PLANE_WIDTH = 10
    const PLANE_HEIGHT = 14 // A4 aspect roughly

    useEffect(() => {
        if (!containerRef.current) return

        // 1. Scene Setup
        const scene = new THREE.Scene()
        scene.background = new THREE.Color(0x111111) // Dark background
        sceneRef.current = scene

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

        // 2. Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
        scene.add(ambientLight)

        const dirLight = new THREE.DirectionalLight(0xfffaed, 1.5)
        dirLight.position.set(5, 10, 5)
        dirLight.castShadow = true
        dirLight.shadow.mapSize.width = 2048
        dirLight.shadow.mapSize.height = 2048
        scene.add(dirLight)

        // 3. Paper (Plane + CanvasTexture)
        const canvas = document.createElement('canvas')
        canvas.width = CANVAS_SIZE
        canvas.height = CANVAS_SIZE
        const ctx = canvas.getContext('2d')
        ctxRef.current = ctx

        if (ctx) {
            // Initialize Paper styling
            ctx.fillStyle = '#f4e4bc' // Parchment color
            ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)

            // Lines (Decoration)
            ctx.strokeStyle = 'rgba(0,0,0,0.1)'
            ctx.lineWidth = 2
            for (let y = 100; y < CANVAS_SIZE; y += 80) {
                ctx.beginPath()
                ctx.moveTo(100, y)
                ctx.lineTo(CANVAS_SIZE - 100, y)
                ctx.stroke()
            }

            // Text Styles
            ctx.font = '60px "Brush Script MT", cursive'
            ctx.fillStyle = '#2b1d0e' // Dark brown ink
            ctx.textBaseline = 'bottom' // Write on liniature
        }

        const texture = new THREE.CanvasTexture(canvas)
        textureRef.current = texture

        const planeGeo = new THREE.PlaneGeometry(PLANE_WIDTH, PLANE_HEIGHT)
        const planeMat = new THREE.MeshStandardMaterial({
            map: texture,
            roughness: 0.6,
            side: THREE.DoubleSide
        })
        const paperPlane = new THREE.Mesh(planeGeo, planeMat)
        paperPlane.rotation.x = -Math.PI / 2 // Lie flat
        paperPlane.receiveShadow = true
        scene.add(paperPlane)

        // 4. Pen Loading
        const loader = new GLTFLoader()
        const pivotGroup = new THREE.Group()
        penPivotRef.current = pivotGroup
        scene.add(pivotGroup)

        // Initial rest position
        pivotGroup.position.set(5, 1, 5)

        loader.load('/Flowassist3d/free_quill-pen__lowpoly.glb', (gltf: any) => {
            const model = gltf.scene
            model.traverse((child: any) => {
                if (child.isMesh) {
                    child.castShadow = true
                    child.receiveShadow = true
                }
            })

            // Adjust scaling
            const scale = 50.0
            model.scale.set(scale, scale, scale)

            // Calculate bounding box to find tip
            const box = new THREE.Box3().setFromObject(model)
            const height = box.max.y - box.min.y

            // Assume Nib is at the bottom (min.y) or top (max.y) depending on orientation.
            // Usually pens stand up or lie down. Let's assume standard upright or angled.
            // We want the Pivot (0,0,0 of PivotGroup) to be the Nib.
            // So we move the mesh opposite to where the nib is.

            // For this specific model, we might need trial and error, but generally:
            // Move mesh up by half height if origin is center, or align min.y to 0.
            // Let's align center of bottom:
            const center = new THREE.Vector3()
            box.getCenter(center)

            // Move mesh such that the Tip is at (0,0,0)
            // Assuming Tip is at (center.x, box.min.y, center.z) - typical for standing objects
            model.position.sub(new THREE.Vector3(center.x, box.min.y, center.z))

            // Rotate pen to writing angle
            model.rotation.x = Math.PI / 4 // Tilt 45 degrees

            pivotGroup.add(model)

        }, undefined, (err: any) => console.error(err))


        // 5. Animation Loop
        const animate = () => {
            requestAnimationFrame(animate)

            if (penPivotRef.current) {
                // Smooth Lerp to target position
                penPivotRef.current.position.lerp(targetPosRef.current, 0.1)

                // Optional: Bobbing effect when writing?
                // Or basic breathing when idle
            }

            renderer.render(scene, camera)
        }
        animate()

        // Handle Resize
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
            if (containerRef.current && rendererRef.current) {
                containerRef.current.removeChild(rendererRef.current.domElement)
            }
            renderer.dispose()
        }

    }, [])


    // Logic: Update Writing and Move Pen
    const updateWriting = (text: string) => {
        if (!ctxRef.current || !textureRef.current) return

        const ctx = ctxRef.current
        const words = text.split(' ')

        words.forEach(word => {
            const wordWithSpace = word + ' '
            let measure = ctx.measureText(wordWithSpace)

            // Wrap line if needed
            if (cursorRef.current.x + measure.width > CANVAS_SIZE - 100) {
                cursorRef.current.x = 100
                cursorRef.current.y += 80 // Line height
            }

            // Draw Text
            ctx.fillText(wordWithSpace, cursorRef.current.x, cursorRef.current.y)

            // Update Cursor
            cursorRef.current.x += measure.width
        })

        // Update Texture
        textureRef.current.needsUpdate = true

        // Map Cursor to 3D World
        // Canvas (0..1024) -> UV (0..1) -> World (-W/2 .. W/2)
        // Texture UV (0,0) is usually Bottom-Left for Plane... 
        // Wait, Canvas (0,0) is Top-Left. 
        // So Canvas Y=0 -> UV V=1. Canvas Y=1024 -> UV V=0.

        const u = cursorRef.current.x / CANVAS_SIZE
        const v = 1.0 - (cursorRef.current.y / CANVAS_SIZE)

        // Plane is Width=10, Height=14. Center at (0,0,0).
        // Left (-5) = U(0). Right (5) = U(1).
        const x3D = (u - 0.5) * PLANE_WIDTH
        // Top (-7 ?? No, Z axis). 
        // Plane rotation -PI/2 means:
        // Local X -> World X
        // Local Y -> World -Z (Top of texture is -Z in world)
        // Let's verify: PlaneGeometry(w, h).
        // Vertices: usually centered.
        // Y+ is Top. mapped to V=1.
        // After rotation X=-90deg:
        // World +Z is Local -Y (Base/Bottom). World -Z is Local +Y (Top).
        // So V=1 (Top of Canvas) -> Local Y+ -> World -Z.
        // V=0 (Bottom of Canvas) -> Local Y- -> World +Z.

        // y3D (actually Z coord) = (v - 0.5) * PLANE_HEIGHT
        // Check: v=1 -> 0.5 * H.   Map: +Z is Bottom(v0), -Z is Top(v1).
        // Actually: v=1 (Top) should be at -Z (Top edge of paper).
        // (1 - 0.5) * H = 0.5 H.  We want negative Z. 
        // So formula: z3D = - (v - 0.5) * PLANE_HEIGHT

        const z3D = -(v - 0.5) * PLANE_HEIGHT

        // Update target position (Lift pen slightly above paper)
        const HOVER_HEIGHT = 0.5
        targetPosRef.current.set(x3D, HOVER_HEIGHT, z3D)
    }

    // Voice Integration
    const [isListening, setIsListening] = useState(false)
    const recognitionRef = useRef<any>(null)

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
            if (SpeechRecognition) {
                const recognition = new SpeechRecognition()
                recognition.continuous = true
                recognition.interimResults = false // Only final words triggers writing
                recognition.lang = 'pl-PL' // Polish

                recognition.onresult = (event: any) => {
                    const lastResult = event.results[event.results.length - 1]
                    if (lastResult.isFinal) {
                        const transcript = lastResult[0].transcript
                        updateWriting(transcript)
                    }
                }

                recognition.onerror = (event: any) => {
                    console.error('Speech recognition error', event.error)
                    setIsListening(false)
                }

                recognition.onend = () => {
                    // Auto restart if intended? Or just stop.
                    if (isListening) recognition.start()
                }

                recognitionRef.current = recognition
            }
        }
    }, [])

    const toggleListening = () => {
        if (!recognitionRef.current) {
            alert("Twoja przeglądarka nie obsługuje Web Speech API (tylko Chrome/Edge).")
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
                <div className="bg-black/50 backdrop-blur px-4 py-2 rounded text-white text-sm mb-2">
                    {recognitionRef.current ? "Powiedz coś, a FlowAssistant to zapisze." : "Brak obsługi głosowej w tej przeglądarce."}
                </div>
                <button
                    onClick={toggleListening}
                    className={`px-8 py-3 rounded-full font-bold transition-all shadow-lg ${isListening
                            ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                            : 'bg-blue-600 hover:bg-blue-500'
                        } text-white`}
                >
                    {isListening ? '🛑 Zatrzymaj Nasłuch' : '🎤 Rozpocznij Pisanie Głosem'}
                </button>
            </div>
        </div>
    )
}
