'use client'
import { useEffect, useRef } from 'react'
// @ts-ignore
import TubesCursor from '@/lib/TubesCursor'

export default function TubesBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        if (!canvasRef.current) return

        let app: any = null

        try {
            app = TubesCursor(canvasRef.current, {
                tubes: {
                    colors: ["#f967fb", "#53bc28", "#6958d5"],
                    lights: {
                        intensity: 200,
                        colors: ["#83f36e", "#fe8a2e", "#ff008a", "#60aed5"]
                    }
                }
            })
        } catch (err) {
            console.error("Failed to init TubesCursor", err)
        }

        const handleClick = () => {
            if (!app) return
            const colors = randomColors(3)
            const lightsColors = randomColors(4)
            app.tubes.setColors(colors)
            app.tubes.setLightsColors(lightsColors)
        }

        const handleTouchMove = (e: TouchEvent) => {
            if (e.touches.length > 0 && canvasRef.current) {
                const touch = e.touches[0]
                const mouseEvent = new MouseEvent('mousemove', {
                    clientX: touch.clientX,
                    clientY: touch.clientY,
                    bubbles: true,
                    cancelable: true,
                    view: window
                })
                canvasRef.current.dispatchEvent(mouseEvent)
            }
        }

        document.addEventListener('click', handleClick)
        window.addEventListener('touchmove', handleTouchMove, { passive: true })

        return () => {
            document.removeEventListener('click', handleClick)
            window.removeEventListener('touchmove', handleTouchMove)
        }
    }, [])

    function randomColors(count: number) {
        return new Array(count)
            .fill(0)
            .map(() => "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'))
    }

    return (
        <canvas
            ref={canvasRef}
            className="fixed top-0 left-0 w-full h-full -z-50"
            style={{ opacity: 1 }}
        />
    )
}
