'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type IntroPhase =
    | "black"
    | "revealFlow"
    | "revealAssist"
    | "goldFinish"
    | "fadeToStage"
    | "done";

interface Particle {
    tx: number;
    ty: number;
    sx: number;
    sy: number;
    cx: number;
    cy: number;
    vx: number;
    vy: number;
    isFlow: boolean;
    r: number;
    g: number;
    b: number;
}

export default function IntroOverlay({ onComplete }: { onComplete: () => void }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [phase, setPhase] = useState<IntroPhase>('black');
    const [isFadingOut, setIsFadingOut] = useState(false);
    const isFadingOutRef = useRef(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return;

        let particles: Particle[] = [];
        let animationFrameId: number;
        let startTime: number | null = null;
        let width = window.innerWidth;
        let height = window.innerHeight;
        let drawW = 0;
        let drawH = 0;
        let particleSize = 2; // Domyślna wielkość cząsteczki dla optymalizacji wydajności

        canvas.width = width;
        canvas.height = height;

        const img = new Image();
        img.src = '/images/napis FlowAssist.png';
        img.onload = () => {
            // Skala dopasowana do ekranu, max 70% szerokości
            const maxW = width * 0.7;
            const scale = Math.min(1.2, maxW / img.width);
            drawW = img.width * scale;
            drawH = img.height * scale;

            const offCanvas = document.createElement('canvas');
            offCanvas.width = drawW;
            offCanvas.height = drawH;
            const offCtx = offCanvas.getContext('2d');
            if (!offCtx) return;

            offCtx.drawImage(img, 0, 0, drawW, drawH);
            const imgData = offCtx.getImageData(0, 0, drawW, drawH);
            const data = imgData.data;

            const offsetX = (width - drawW) / 2;
            const offsetY = (height - drawH) / 2;

            // Tworzenie cząsteczek - rozdzielczość zależna od urządzenia i optymalizacja
            particleSize = width > 1200 ? 3 : (width > 768 ? 2 : 1);
            const step = particleSize;

            // Podział napisu (ponad połowa to zwykle "Flow")
            const splitX = drawW * 0.47;

            for (let y = 0; y < drawH; y += step) {
                for (let x = 0; x < drawW; x += step) {
                    const index = (y * drawW + x) * 4;
                    const a = data[index + 3];
                    if (a > 50) {
                        const r = data[index];
                        const g = data[index + 1];
                        const b = data[index + 2];

                        // Ekstremalny rozrzut "z wszechstron" jak w starym projekcie
                        const sx = (Math.random() - 0.5) * width * 4;
                        const sy = (Math.random() - 0.5) * height * 4;

                        // Losowe prędkości dla efektu 'dissolve' później
                        const vx = (Math.random() - 0.5) * 20;
                        const vy = (Math.random() - 0.5) * 20;

                        particles.push({
                            tx: offsetX + x,
                            ty: offsetY + y,
                            sx,
                            sy,
                            cx: sx,
                            cy: sy,
                            vx,
                            vy,
                            isFlow: x < splitX,
                            r,
                            g,
                            b
                        });
                    }
                }
            }

            // Szybsze tasowanie (Fisher-Yates) zapobiegające dropom klatek przy starcie
            for (let i = particles.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [particles[i], particles[j]] = [particles[j], particles[i]];
            }

            requestAnimationFrame(render);
        };

        const easeOutQuart = (x: number): number => {
            return 1 - Math.pow(1 - x, 4);
        };

        const render = (time: number) => {
            if (!startTime) startTime = time;
            const elapsed = (time - startTime) / 1000;

            ctx.clearRect(0, 0, width, height);

            if (elapsed > 5.2 && !isFadingOutRef.current) {
                isFadingOutRef.current = true;
                setIsFadingOut(true);
            }

            if (elapsed > 7.2) {
                onComplete();
                return;
            }

            const imgData = ctx.createImageData(width, height);
            const buf32 = new Uint32Array(imgData.data.buffer);

            // TIMING (Zwolniony x2):
            // 0.8 - 3.0s: Flow
            // 3.0 - 4.0s: Assist
            // 4.0 - 4.7s: Gold Polish
            // 4.6 - 6.6s: Dissolve

            // --- OPTIMIZATION: Precalculate loop-invariant variables ---
            const isAssembly = elapsed < 4.6;
            let progressFlow = 0;
            let progressAssist = 0;
            let easeFlow = 0;
            let easeAssist = 0;

            if (isAssembly) {
                if (elapsed >= 0.8) progressFlow = Math.min((elapsed - 0.8) / 2.2, 1);
                if (elapsed >= 3.0) progressAssist = Math.min((elapsed - 3.0) / 1.0, 1);
                easeFlow = easeOutQuart(progressFlow);
                easeAssist = easeOutQuart(progressAssist);
            }

            const isGoldPolish = elapsed >= 4.0 && elapsed < 5.0;
            let shimmerProgress = 0;
            let sweepOffset = 0;
            let sweepDiv = 1;
            if (isGoldPolish) {
                shimmerProgress = (elapsed - 4.0) / 0.7;
                sweepOffset = (width - drawW) / 2;
                sweepDiv = drawW;
            }

            const isDissolve = elapsed >= 4.6;
            let dissolveScatter = 0;
            let dissolveAlpha = 0;
            if (isDissolve) {
                const dissolveProgress = Math.min((elapsed - 4.6) / 2.0, 1);
                dissolveScatter = easeOutQuart(dissolveProgress) * 4;
                const dissolveFade = Math.max(0, 1 - (elapsed - 4.6) / 1.6);
                dissolveAlpha = dissolveFade * 255;
            }

            // Centralna pętla po cząsteczkach (Hot Path)
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                let r = p.r;
                let g = p.g;
                let b = p.b;
                let a = 0;

                // Formowanie (Assembly)
                if (isAssembly) {
                    const ease = p.isFlow ? easeFlow : easeAssist;
                    const progress = p.isFlow ? progressFlow : progressAssist;

                    p.cx = p.sx + (p.tx - p.sx) * ease;
                    p.cy = p.sy + (p.ty - p.sy) * ease;
                    a = ease * 255;

                    // Poświata podczas lotu
                    if (progress > 0 && progress < 1) {
                        const glow = 1 - ease;
                        r = Math.min(255, r + glow * 30);
                        g = Math.min(255, g + glow * 60);
                        b = Math.min(255, b + glow * 100);
                    }
                }

                // Gold Polish (4.0 - 5.0s)
                if (isGoldPolish) {
                    const sweepX = (p.tx - sweepOffset) / sweepDiv;
                    const dist = sweepX > shimmerProgress ? sweepX - shimmerProgress : shimmerProgress - sweepX;

                    if (dist < 0.2) {
                        const intensity = 1 - (dist * 5); // 5 to 1/0.2
                        const intensity09 = intensity * 0.9;
                        r = Math.min(255, r + (255 - r) * intensity09);
                        g = Math.min(255, g + (215 - g) * intensity09);
                        b = Math.min(255, b * (1 - intensity));
                    }
                }

                // Rozpuszczanie (Dissolve) - od 4.6s
                if (isDissolve) {
                    p.cx = p.tx + p.vx * dissolveScatter;
                    p.cy = p.ty + p.vy * dissolveScatter;
                    a = dissolveAlpha;
                }

                // Renderowanie
                if (a > 1) {
                    // Szybkie zaokrąglanie w dół (bitwise OR 0) - duża oszczędność na Math.floor
                    const px = p.cx | 0;
                    const py = p.cy | 0;
                    const color = ((a | 0) << 24) | (b << 16) | (g << 8) | r;

                    if (particleSize === 1) {
                        if (px >= 0 && px < width && py >= 0 && py < height) {
                            buf32[py * width + px] = color;
                        }
                    } else {
                        // Rysowanie 2x2 lub 3x3 dla zmniejszenia ilości wszystkich cząsteczek przy zachowaniu gęstości loga
                        for (let dy = 0; dy < particleSize; dy++) {
                            const cy = py + dy;
                            if (cy >= 0 && cy < height) {
                                const row = cy * width;
                                for (let dx = 0; dx < particleSize; dx++) {
                                    const cx = px + dx;
                                    if (cx >= 0 && cx < width) {
                                        buf32[row + cx] = color;
                                    }
                                }
                            }
                        }
                    }
                }
            }

            ctx.putImageData(imgData, 0, 0);
            animationFrameId = requestAnimationFrame(render);
        };

        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [onComplete]);

    return (
        <AnimatePresence>
            {!isFadingOut && (
                <motion.div
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }} // Corresponds to 2.6 - 3.4s fade
                    className="fixed inset-0 z-[100] bg-black grid place-items-center"
                >
                    {/* This canvas does not fade itself, the background fades. The particles dissolve via JS. */}
                    <canvas
                        ref={canvasRef}
                        className="absolute inset-0 w-full h-full pointer-events-none"
                        style={{ imageRendering: 'pixelated' }}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
