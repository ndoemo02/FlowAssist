'use client';

import { motion } from 'framer-motion';
import { useState, useMemo } from 'react';

export default function TacticalMapWarsaw() {
    const [units] = useState([
        { id: 'ALFA-1', name: 'Alfa Team', pos: { x: 45, y: 55 }, status: 'STATIONARY' },
        { id: 'BRAVO-2', name: 'Bravo Air', pos: { x: 65, y: 35 }, status: 'PATROLLING' }
    ]);

    // Same color palette as V2
    const theme = {
        bg: '#02040a',
        cyan: '#22d3ee',
        blue: '#0a0f1a',
        emissive: '#112244'
    };

    return (
        <div className="relative w-full h-[700px] bg-[#02040a] rounded-[2rem] overflow-hidden border border-cyan-500/20 shadow-[0_0_50px_rgba(0,0,0,0.5)] group">

            {/* 1. MAP LAYER (3D Perspective simulation) */}
            <div className="absolute inset-0 opacity-60 transition-transform duration-1000 group-hover:scale-105"
                style={{ perspective: '1000px' }}>
                <div className="absolute inset-0 origin-center"
                    style={{ transform: 'rotateX(20deg) scale(1.2)' }}>

                    {/* 3x3 Grid of OSM Tiles (Warsaw) with "Blueprint" filters */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1536px] h-[1536px] grid grid-cols-3 grid-rows-3 opacity-80">
                        {/* Row 1 */}
                        <img src="https://tile.openstreetmap.org/16/36575/21532.png" className="w-[512px] h-[512px] invert hue-rotate-[190deg] brightness-[0.7] contrast-[1.4] saturate-[0.3]" alt="" />
                        <img src="https://tile.openstreetmap.org/16/36576/21532.png" className="w-[512px] h-[512px] invert hue-rotate-[190deg] brightness-[0.7] contrast-[1.4] saturate-[0.3]" alt="" />
                        <img src="https://tile.openstreetmap.org/16/36577/21532.png" className="w-[512px] h-[512px] invert hue-rotate-[190deg] brightness-[0.7] contrast-[1.4] saturate-[0.3]" alt="" />
                        {/* Row 2 */}
                        <img src="https://tile.openstreetmap.org/16/36575/21533.png" className="w-[512px] h-[512px] invert hue-rotate-[190deg] brightness-[0.7] contrast-[1.4] saturate-[0.3]" alt="" />
                        <img src="https://tile.openstreetmap.org/16/36576/21533.png" className="w-[512px] h-[512px] invert hue-rotate-[190deg] brightness-[0.7] contrast-[1.4] saturate-[0.3]" alt="" />
                        <img src="https://tile.openstreetmap.org/16/36577/21533.png" className="w-[512px] h-[512px] invert hue-rotate-[190deg] brightness-[0.7] contrast-[1.4] saturate-[0.3]" alt="" />
                        {/* Row 3 */}
                        <img src="https://tile.openstreetmap.org/16/36575/21534.png" className="w-[512px] h-[512px] invert hue-rotate-[190deg] brightness-[0.7] contrast-[1.4] saturate-[0.3]" alt="" />
                        <img src="https://tile.openstreetmap.org/16/36576/21534.png" className="w-[512px] h-[512px] invert hue-rotate-[190deg] brightness-[0.7] contrast-[1.4] saturate-[0.3]" alt="" />
                        <img src="https://tile.openstreetmap.org/16/36577/21534.png" className="w-[512px] h-[512px] invert hue-rotate-[190deg] brightness-[0.7] contrast-[1.4] saturate-[0.3]" alt="" />
                    </div>

                    {/* Cyber Grid Overlay */}
                    <div className="absolute inset-0 opacity-30"
                        style={{ backgroundImage: 'linear-gradient(to right, #22d3ee 1px, transparent 1px), linear-gradient(to bottom, #22d3ee 1px, transparent 1px)', backgroundSize: '80px 80px' }} />
                </div>
            </div>

            {/* 2. ATMOSPHERE OVERLAYS */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Vignette */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(2,4,10,0.8)_100%)]" />
                {/* Top/Bottom Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#02040a] via-transparent to-[#02040a]" />
                {/* Scanlines (CRT Effect) */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(34,211,238,0.02),rgba(0,0,0,0),rgba(255,0,255,0.02))] z-40 bg-[length:100%_4px,3px_100%] opacity-40" />
            </div>

            {/* 3. TACTICAL HUD (Imported Style from V2) */}
            <div className="absolute top-10 left-10 z-50 space-y-6 pointer-events-none">
                <div className="flex items-center gap-5">
                    <div className="relative">
                        <div className="w-4 h-4 rounded-full bg-cyan-500 animate-ping absolute inset-0 opacity-20" />
                        <div className="w-4 h-4 rounded-full bg-cyan-400 relative border-2 border-white/40 shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
                    </div>
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="h-px w-8 bg-cyan-500/50" />
                            <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">
                                Warsaw <span className="text-cyan-400">Tactical</span>
                            </h1>
                        </div>
                        <p className="text-[10px] text-cyan-400/60 uppercase tracking-[0.4em] font-mono mt-1">
                            System Version 3.0.4 | Protocol: active
                        </p>
                    </div>
                </div>

                <div className="bg-black/60 border-l-4 border-cyan-500 p-5 backdrop-blur-xl rounded-r-xl shadow-2xl max-w-sm">
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-[9px] text-cyan-400 uppercase tracking-widest font-black">Environmental Data</span>
                        <span className="text-[9px] text-gray-500 font-mono">52.2297N / 21.0122E</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-[11px] font-mono">
                        <div className="text-gray-400">
                            AGENT_STATUS: <span className="text-cyan-400">STABLE</span><br />
                            ICM_VALIDATION: <span className="text-cyan-400">TRUE</span>
                        </div>
                        <div className="text-gray-400">
                            VOICE_PROXY: <span className="text-purple-400">PENDING</span><br />
                            LATENCY: <span className="text-cyan-400">12ms</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 4. UNITS (Enhanced with Glow) */}
            {units.map((unit) => (
                <motion.div
                    key={unit.id}
                    className="absolute z-30 cursor-pointer"
                    initial={false}
                    animate={{ left: `${unit.pos.x}%`, top: `${unit.pos.y}%` }}
                    transition={{ type: "spring", stiffness: 50 }}
                >
                    <div className="relative group">
                        {/* Unit Marker */}
                        <div className="w-5 h-5 bg-cyan-500 rotate-45 border-2 border-white shadow-[0_0_20px_rgba(34,211,238,1)] flex items-center justify-center overflow-hidden">
                            <div className="w-full h-full bg-black/40 -rotate-45 flex items-center justify-center text-[8px] font-black text-white">
                                {unit.id[0]}
                            </div>
                        </div>

                        {/* Floating Label */}
                        <div className="absolute top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all scale-95 group-hover:scale-100 whitespace-nowrap bg-black/90 border border-cyan-500/30 p-3 rounded-lg text-[10px] backdrop-blur-xl shadow-2xl">
                            <div className="flex items-center gap-2 mb-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                                <span className="font-black text-white uppercase tracking-wider">{unit.name}</span>
                            </div>
                            <div className="text-gray-500 font-mono">ID: {unit.id} | ALT: 250m</div>
                        </div>

                        {/* Pulsing selection ring */}
                        <div className="absolute -inset-4 border border-cyan-500/20 rounded-full animate-[ping_3s_linear_infinite]" />
                    </div>
                </motion.div>
            ))}

            {/* 5. FOOTER HUD */}
            <div className="absolute bottom-10 left-10 right-10 z-50 flex justify-between items-end pointer-events-none">
                <div className="flex gap-10 items-center bg-black/40 p-4 rounded-2xl backdrop-blur-lg border border-white/5">
                    <div className="space-y-1">
                        <div className="text-[8px] text-gray-500 uppercase tracking-widest font-black">Satellite Link</div>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="w-1.5 h-3 bg-cyan-500/30 rounded-sm" />)}
                            <div className="text-[10px] text-cyan-400 ml-2 font-mono">UPDATING...</div>
                        </div>
                    </div>
                    <div className="h-8 w-px bg-white/10" />
                    <div className="space-y-1">
                        <div className="text-[8px] text-gray-500 uppercase tracking-widest font-black">System Load</div>
                        <div className="text-[11px] text-white font-mono">CPU: 14% | MEM: 2.1GB</div>
                    </div>
                </div>

                <div className="pointer-events-auto">
                    <button className="group relative px-10 py-4 overflow-hidden rounded-full bg-cyan-500/10 border border-cyan-500/50 shadow-[0_0_30px_rgba(34,211,238,0.1)] hover:border-cyan-400 transition-all">
                        <div className="absolute inset-0 bg-cyan-500/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        <span className="relative text-cyan-400 text-[10px] font-black uppercase tracking-[0.3em]">
                            Initialize Voice Control
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}
