'use client'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

export default function Contact3D() {
    const containerRef = useRef<HTMLDivElement>(null)
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
    const penRef = useRef<THREE.Group | null>(null)
    const paperRef = useRef<THREE.Group | null>(null)
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const textureRef = useRef<THREE.CanvasTexture | null>(null)

    useEffect(() => {
        if (!containerRef.current) return

        // === 1. SETUP SCENE ===
        const scene = new THREE.Scene()
        scene.background = new THREE.Color(0x000000) // Black background to match theme

        const camera = new THREE.PerspectiveCamera(45, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 100)
        camera.position.set(0, 15, 15)
        camera.lookAt(0, 0, 0)

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
        renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        renderer.shadowMap.enabled = true
        containerRef.current.appendChild(renderer.domElement)
        rendererRef.current = renderer

        // === 2. LIGHTING ===
        const ambLight = new THREE.AmbientLight(0xffffff, 0.5)
        scene.add(ambLight)

        const dirLight = new THREE.DirectionalLight(0xffeebb, 1.5)
        dirLight.position.set(5, 10, 5)
        dirLight.castShadow = true
        scene.add(dirLight)

        // === 3. CANVAS TEXTURE SETUP ===
        const canvas = document.createElement('canvas')
        canvas.width = 1024
        canvas.height = 1024
        const ctx = canvas.getContext('2d')
        if (ctx) {
            ctx.fillStyle = '#f4e4bc' // Paper color base
            ctx.fillRect(0, 0, 1024, 1024)
            ctx.font = '60px "Brush Script MT", cursive' // Handwriting font
            ctx.fillStyle = '#301010' // Ink color
            ctx.textAlign = 'left'
            ctx.textBaseline = 'top'
        }
        canvasRef.current = canvas

        const texture = new THREE.CanvasTexture(canvas)
        textureRef.current = texture
        texture.flipY = false // Adjust based on UVs

        // === 4. LOAD MODELS ===
        const loader = new GLTFLoader()

        // Load Paper
        loader.load('/Flowassist3d/old_paper.glb', (gltf: any) => {
            const model = gltf.scene as THREE.Group
            model.traverse((child: any) => {
                if (child.isMesh) {
                    const mesh = child as THREE.Mesh
                    mesh.receiveShadow = true
                    // Apply canvas texture to the paper mesh
                    // Assuming the paper model has a material we can override or map to
                    if (mesh.material) {
                        const mat = mesh.material as THREE.MeshStandardMaterial;
                        mat.map = texture
                        mat.needsUpdate = true
                    }
                }
            })
            model.scale.set(5, 5, 5)
            model.position.set(0, 0, 0)
            scene.add(model)
            paperRef.current = model
        }, undefined, (err: any) => console.error('Error loading old_paper.glb', err))

        // Load Quill Pen
        loader.load('/Flowassist3d/quill_pen.glb', (gltf: any) => {
            const model = gltf.scene as THREE.Group
            model.traverse((child: any) => {
                if (child.isMesh) {
                    (child as THREE.Mesh).castShadow = true
                }
            })
            model.scale.set(5, 5, 5) // Adjust scale
            // Initial position (floating above)
            model.position.set(5, 5, 5)
            scene.add(model)
            penRef.current = model
        }, undefined, (err: any) => {
            console.warn('Error loading quill_pen.glb (using placeholder)', err)
            // Placeholder Pen
            const geom = new THREE.ConeGeometry(0.2, 2, 8)
            const mat = new THREE.MeshStandardMaterial({ color: 0x888888 })
            const cone = new THREE.Mesh(geom, mat)
            cone.rotation.x = Math.PI / 2
            const group = new THREE.Group()
            group.add(cone)
            group.position.set(5, 2, 5)
            scene.add(group)
            penRef.current = group
        })

        // === 5. ANIMATION LOOP ===
        const animate = () => {
            requestAnimationFrame(animate)
            renderer.render(scene, camera)
        }
        animate()

        // === 6. WRITE FUNCTION ===
        // Expose function globally or handle internally
        // We'll define coordinate mapping logic here

        // Define margins and line height for text on canvas
        const marginLeft = 100
        const marginTop = 100
        const lineHeight = 80
        let cursorX = marginLeft
        let cursorY = marginTop

        const writeToParchment = (text: string) => {
            if (!ctx || !textureRef.current) return

            let i = 0

            const writeChar = () => {
                if (i >= text.length) return

                const char = text[i]

                // Draw char
                ctx.fillText(char, cursorX, cursorY)
                const textWidth = ctx.measureText(char).width

                // Update cursor
                cursorX += textWidth
                if (cursorX > 900) { // Wrap line
                    cursorX = marginLeft
                    cursorY += lineHeight
                }

                // Update texture
                textureRef.current!.needsUpdate = true

                // Move Pen to 3D position corresponding to cursor
                // We need to map 2D Canvas UV (0..1) to 3D World Coordinates on the plane
                // Assuming Plane is at y=0, centered, size roughly matching scale
                // Map logical [0, 1024] -> World [-W/2, W/2]

                // Adjusted for model scale 5 roughly:
                // Let's guess the paper size in world units. If scale 5, maybe 10x14?
                // This usually requires raycasting or precise knowing of UVs.
                // approximating roughly planar projection:

                if (penRef.current) {
                    // Normalize cursor (-0.5 to 0.5)
                    const u = (cursorX / 1024) - 0.5
                    const v = (cursorY / 1024) - 0.5

                    // Remap to world: Y in 3D is usually up, so Texture V corresponds to Z (flipped often)
                    // Let's assume Paper is roughly 10x14 width/height in world units
                    // x3d = u * width
                    // z3d = v * height

                    const worldWidth = 8 // Adjust based on model
                    const worldHeight = 10 // Adjust based on model

                    const targetX = u * worldWidth
                    const targetZ = v * worldHeight

                    // Simple linear interpolation (lerp) for smooth movement could be added in animate loop
                    // For now, instant teleport or simple assignment
                    penRef.current.position.set(targetX, 1, targetZ)

                    // Pen tilt effect
                    penRef.current.rotation.z = -0.5 // Tilt
                    penRef.current.rotation.y = Math.PI // Orient
                }

                i++
                setTimeout(writeChar, 100) // Speed of typing
            }

            writeChar()
        }

        // Expose verify logic (for testing)
        (window as any).writeToParchment = writeToParchment

        // Initial text
        setTimeout(() => writeToParchment("Witaj w FlowAssistant\nNapisz do nas..."), 2000)


        // Cleanup
        const handleResize = () => {
            if (containerRef.current) {
                camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight
                camera.updateProjectionMatrix()
                renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
            }
        }
        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
            if (containerRef.current && renderer.domElement) {
                containerRef.current.removeChild(renderer.domElement)
            }
            renderer.dispose()
        }

    }, [])

    return (
        <div
            id="contact-container"
            ref={containerRef}
            className="w-full h-full relative"
            style={{ minHeight: '600px' }}
        >
            {/* Overlay UI if needed */}
        </div>
    )
}
