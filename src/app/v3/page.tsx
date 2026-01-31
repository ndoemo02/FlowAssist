'use client';

import TacticalMapWarsaw from '../components/TacticalMapWarsaw';

export default function V3Page() {
    return (
        <main className="min-h-screen bg-[#02040a] text-white relative flex flex-col items-center justify-center p-8 overflow-hidden">

            {/* Background Atmosphere */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.05)_0%,transparent_50%)]" />
                <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_80%,rgba(139,92,246,0.05)_0%,transparent_50%)]" />
            </div>

            <div className="relative z-10 w-full max-w-7xl space-y-12">
                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="flex items-center gap-3 px-4 py-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-full">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                        <span className="text-[10px] uppercase tracking-[0.4em] font-black text-cyan-400">Tactical Protocol V3.0</span>
                    </div>

                    <h1 className="text-6xl font-black tracking-tighter text-white uppercase italic">
                        Warsaw <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Operations</span> Center
                    </h1>

                    <p className="text-gray-500 max-w-xl text-sm leading-relaxed font-medium">
                        Secure interface for multi-agent orchestration. Integrated Voice Proxy and Deterministic NLU layers enabled for Warsaw metropolitan sector.
                    </p>
                </div>

                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-[2.5rem] blur-xl opacity-50 group-hover:opacity-100 transition-opacity bg-[length:200%_200%] animate-pulse" />
                    <TacticalMapWarsaw />
                </div>

                <div className="flex justify-center gap-12 pt-8">
                    <div className="text-center space-y-1">
                        <div className="text-2xl font-black text-white">12</div>
                        <div className="text-[10px] text-gray-500 uppercase tracking-widest">Active Agents</div>
                    </div>
                    <div className="w-px h-10 bg-white/10" />
                    <div className="text-center space-y-1">
                        <div className="text-2xl font-black text-white">0.8s</div>
                        <div className="text-[10px] text-gray-500 uppercase tracking-widest">Decision Latency</div>
                    </div>
                    <div className="w-px h-10 bg-white/10" />
                    <div className="text-center space-y-1">
                        <div className="text-2xl font-black text-white">100%</div>
                        <div className="text-[10px] text-gray-500 uppercase tracking-widest">Deterministic</div>
                    </div>
                </div>
            </div>

            {/* Micro scanline for the whole page */}
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] z-50 bg-[length:100%_4px] opacity-10" />
        </main>
    );
}
