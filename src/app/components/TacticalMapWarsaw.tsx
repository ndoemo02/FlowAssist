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
        <div className="relative w-full h-full bg-[#02040a] overflow-hidden group">

            {/* 1. MAP LAYER (3D Cesium Digital Twin) */}
            <div className="absolute inset-0 z-0">
                <iframe
                    src="/tactical_warsaw.html"
                    className="w-full h-full border-none opacity-80"
                    title="Warsaw Tactical 3D"
                />
            </div>

            {/* 2. ATMOSPHERE OVERLAYS */}
            <div className="absolute inset-0 pointer-events-none z-10">
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
                                Warszawa <span className="text-cyan-400">Taktyczna</span>
                            </h1>
                        </div>
                        <p className="text-[10px] text-cyan-400/60 uppercase tracking-[0.4em] font-mono mt-1">
                            Wersja Systemu 3.0.4 | Protokół: aktywny
                        </p>
                    </div>
                </div>

                <div className="bg-black/60 border-l-4 border-cyan-500 p-5 backdrop-blur-xl rounded-r-xl shadow-2xl max-w-sm">
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-[9px] text-cyan-400 uppercase tracking-widest font-black">Dane Środowiskowe</span>
                        <span className="text-[9px] text-gray-500 font-mono">52.2297N / 21.0122E</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-[11px] font-mono">
                        <div className="text-gray-400">
                            STATUS_AGENTA: <span className="text-cyan-400">STABILNY</span><br />
                            WALIDACJA_ICM: <span className="text-cyan-400">POZYTYWNA</span>
                        </div>
                        <div className="text-gray-400">
                            VOICE_PROXY: <span className="text-purple-400">OCZEKIWANIE</span><br />
                            OPÓŹNIENIE: <span className="text-cyan-400">12ms</span>
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
                        <div className="text-[8px] text-gray-500 uppercase tracking-widest font-black">Łącze Satelitarne</div>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="w-1.5 h-3 bg-cyan-500/30 rounded-sm" />)}
                            <div className="text-[10px] text-cyan-400 ml-2 font-mono">AKTUALIZACJA...</div>
                        </div>
                    </div>
                    <div className="h-8 w-px bg-white/10" />
                    <div className="space-y-1">
                        <div className="text-[8px] text-gray-500 uppercase tracking-widest font-black">Obciążenie Systemu</div>
                        <div className="text-[11px] text-white font-mono">CPU: 14% | MEM: 2.1GB</div>
                    </div>
                </div>

                <div className="pointer-events-auto">
                    <button className="group relative px-10 py-4 overflow-hidden rounded-full bg-cyan-500/10 border border-cyan-500/50 shadow-[0_0_30px_rgba(34,211,238,0.1)] hover:border-cyan-400 transition-all">
                        <div className="absolute inset-0 bg-cyan-500/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        <span className="relative text-cyan-400 text-[10px] font-black uppercase tracking-[0.3em]">
                            Inicjuj Sterowanie Głosem
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}
