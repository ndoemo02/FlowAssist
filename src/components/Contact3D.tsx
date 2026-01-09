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


    // State for streaming logic
    const lastResultIndexRef = useRef(0)
    const localBufferRef = useRef('')

    // Voice Integration
    const [isListening, setIsListening] = useState(false)
    const recognitionRef = useRef<any>(null)

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
            if (SpeechRecognition) {
                const recognition = new SpeechRecognition()
                recognition.continuous = true
                recognition.interimResults = true // Enable streaming
                recognition.lang = 'pl-PL' // Polish

                recognition.onresult = (event: any) => {
                    const resultIndex = event.resultIndex
                    const result = event.results[resultIndex]

                    if (!result) return

                    const transcript = result[0].transcript
                    const isFinal = result.isFinal

                    // Logic to extract ONLY the new part of the transcript
                    // Since interim results keep updating the whole sentence, 
                    // we compare with our local buffer for this sentence.

                    // If index changed, it means we have a new sentence starting
                    if (resultIndex !== lastResultIndexRef.current) {
                        localBufferRef.current = ''
                        lastResultIndexRef.current = resultIndex
                    }

                    // Get new content by slicing what we already processed
                    let newContent = ''
                    if (transcript.length > localBufferRef.current.length) {
                        newContent = transcript.slice(localBufferRef.current.length)
                    }

                    if (newContent) {
                        updateWriting(newContent)
                        localBufferRef.current = transcript
                    }

                    // If final, clear buffer for next sentence (though index change handles it mostly)
                    if (isFinal) {
                        // localBufferRef.current = '' // Optional: Let index change handle it
                    }
                }

                recognition.onerror = (event: any) => {
                    console.error('Speech recognition error', event.error)
                    // Don't auto-stop on no-speech
                    if (event.error === 'no-speech') return;
                    setIsListening(false)
                }

                recognition.onend = () => {
                    // Auto restart to keep "live" feel
                    // But verify component is still mounted/user wants it
                    // We rely on isListening state, but inside callback state might be stale
                    // Use ref or just let button handle restart if truly stopped.
                    // The requirement is "stream", so let's try to keep it alive.
                    // IMPORTANT: Infinite loop risk if error occurs.
                }

                recognitionRef.current = recognition
            }
        }
    }, [])

    // Logic: Update Writing and Move Pen (Updated for character streaming)
    const updateWriting = (textFragment: string) => {
        if (!ctxRef.current || !textureRef.current) return

        const ctx = ctxRef.current

        // Split by characters to support smooth streaming of partial words
        const chars = textFragment.split('')

        chars.forEach(char => {
            let measure = ctx.measureText(char)

            // Wrap line if needed
            if (cursorRef.current.x + measure.width > CANVAS_SIZE - 100) {
                cursorRef.current.x = 100
                cursorRef.current.y += 80 // Line height
            }

            // Draw Text
            ctx.fillText(char, cursorRef.current.x, cursorRef.current.y)

            // Update Cursor
            cursorRef.current.x += measure.width
        })

        // Update Texture
        textureRef.current.needsUpdate = true

        // Map Cursor to 3D World (Same logic as before)
        const u = cursorRef.current.x / CANVAS_SIZE
        const v = 1.0 - (cursorRef.current.y / CANVAS_SIZE)

        const x3D = (u - 0.5) * PLANE_WIDTH
        const z3D = -(v - 0.5) * PLANE_HEIGHT

        const HOVER_HEIGHT = 0.5
        targetPosRef.current.set(x3D, HOVER_HEIGHT, z3D)

        // Trigger pen shake/write effect
        if (penPivotRef.current) {
            // Quick dip or shake
            // We can animate this in the generic loop, but here we can add "impulse"
        }
    }

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
