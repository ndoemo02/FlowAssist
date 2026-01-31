'use client';

import { motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';

export default function TacticalMapWarsaw() {
    const [status, setStatus] = useState('SYSTEM ONLINE');
    const [units, setUnits] = useState([
        { id: 'ALFA-1', name: 'Alfa Team', pos: { x: 45, y: 55 }, status: 'STATIONARY' },
        { id: 'BRAVO-2', name: 'Bravo Air', pos: { x: 65, y: 35 }, status: 'PATROLLING' }
    ]);

    return (
        <div className="relative w-full h-[600px] bg-[#050505] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
            {/* Background Map Simulation (Warsaw - OSM Inverted 'Dark Mode') */}
            <div className="absolute inset-0 opacity-50 bg-[#050505] overflow-hidden">
                {/* 3x3 Grid of OSM Tiles centered approx on Warsaw Palace of Culture */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1536px] h-[1536px] grid grid-cols-3 grid-rows-3 opacity-60">
                    {/* Row 1 (y=2719) */}
                    <img src="https://tile.openstreetmap.org/13/4572/2719.png" className="w-[512px] h-[512px] invert hue-rotate-180 brightness-75 contrast-125 saturate-50" alt="" />
                    <img src="https://tile.openstreetmap.org/13/4573/2719.png" className="w-[512px] h-[512px] invert hue-rotate-180 brightness-75 contrast-125 saturate-50" alt="" />
                    <img src="https://tile.openstreetmap.org/13/4574/2719.png" className="w-[512px] h-[512px] invert hue-rotate-180 brightness-75 contrast-125 saturate-50" alt="" />

                    {/* Row 2 (y=2720) - Center */}
                    <img src="https://tile.openstreetmap.org/13/4572/2720.png" className="w-[512px] h-[512px] invert hue-rotate-180 brightness-75 contrast-125 saturate-50" alt="" />
                    <img src="https://tile.openstreetmap.org/13/4573/2720.png" className="w-[512px] h-[512px] invert hue-rotate-180 brightness-75 contrast-125 saturate-50" alt="" />
                    <img src="https://tile.openstreetmap.org/13/4574/2720.png" className="w-[512px] h-[512px] invert hue-rotate-180 brightness-75 contrast-125 saturate-50" alt="" />

                    {/* Row 3 (y=2721) */}
                    <img src="https://tile.openstreetmap.org/13/4572/2721.png" className="w-[512px] h-[512px] invert hue-rotate-180 brightness-75 contrast-125 saturate-50" alt="" />
                    <img src="https://tile.openstreetmap.org/13/4573/2721.png" className="w-[512px] h-[512px] invert hue-rotate-180 brightness-75 contrast-125 saturate-50" alt="" />
                    <img src="https://tile.openstreetmap.org/13/4574/2721.png" className="w-[512px] h-[512px] invert hue-rotate-180 brightness-75 contrast-125 saturate-50" alt="" />
                </div>

                {/* Vignette & Scanlines */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505] pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-[#050505] pointer-events-none" />
            </div>

            {/* Neon Grid Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-20"
                style={{ backgroundImage: 'radial-gradient(#8b5cf6 0.5px, transparent 0.5px)', backgroundSize: '40px 40px' }} />

            {/* HUD Overlay */}
            <div className="absolute top-6 left-6 z-20 space-y-1">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] tracking-[0.2em] font-bold text-green-500">WARSAW SECTOR / ACTIVE</span>
                </div>
                <h3 className="text-2xl font-bold tracking-tighter text-white">TACTICAL INTELLIGENCE</h3>
            </div>

            {/* Units Rendering */}
            {units.map((unit) => (
                <motion.div
                    key={unit.id}
                    className="absolute z-30 cursor-pointer"
                    initial={false}
                    animate={{ left: `${unit.pos.x}%`, top: `${unit.pos.y}%` }}
                    transition={{ type: "spring", stiffness: 50 }}
                >
                    <div className="relative group">
                        {/* Unit Icon */}
                        <div className="w-4 h-4 rotate-45 border-2 border-cyan-400 bg-cyan-400/20 shadow-[0_0_15px_rgba(34,211,238,0.5)]" />

                        {/* Unit Details Label */}
                        <div className="absolute top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-black/80 border border-white/20 p-2 rounded text-[10px] backdrop-blur-md">
                            <p className="font-bold text-cyan-400">{unit.name} <span className="text-white/40">[{unit.id}]</span></p>
                            <p className="text-gray-400 uppercase tracking-widest">{unit.status}</p>
                        </div>

                        {/* Selection Ring */}
                        <div className="absolute -inset-2 border border-cyan-400/30 rounded-full animate-ping" />
                    </div>
                </motion.div>
            ))}

            {/* Voice Command HUD Placeholder */}
            <div className="absolute bottom-6 left-6 right-6 z-20 flex justify-between items-end">
                <div className="space-y-4">
                    <div className="bg-black/50 backdrop-blur-md border border-white/10 p-4 rounded-xl max-w-xs">
                        <p className="text-[10px] text-purple-400 uppercase font-bold mb-1">Last Voice Command</p>
                        <p className="text-sm italic text-gray-300">"Alfa Team, move to Palace of Culture..."</p>
                    </div>
                    <div className="flex gap-4 text-[10px] font-mono text-gray-500">
                        <span>LAT: 52.2297</span>
                        <span>LNG: 21.0122</span>
                        <span>ZOOM: 12.0</span>
                    </div>
                </div>

                <div className="text-right">
                    <button className="px-6 py-2 bg-cyan-500/10 border border-cyan-500/50 rounded-full text-cyan-400 text-xs font-bold hover:bg-cyan-500/20 transition-all uppercase tracking-widest">
                        Initialize Voice Proxy
                    </button>
                </div>
            </div>

            {/* Scanline Effect */}
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-40 bg-[length:100%_4px,3px_100%]" />
        </div>
    );
}
