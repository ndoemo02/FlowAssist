'use client';

import { useShowcaseStore } from './store';
import { motion } from 'framer-motion';
import { MapPin, Navigation } from 'lucide-react';

interface MetropoliaSidebarProps {
    onAddressSelect: (address: string) => void;
}

export default function MetropoliaSidebar({ onAddressSelect }: MetropoliaSidebarProps) {
    const addressMapping = useShowcaseStore((state) => state.addressMapping);

    // Generujemy listę stref dynamicznie z kluczy mapowania
    const zones = Array.from(new Set(Object.values(addressMapping).map((a: any) => a.zone))).sort();

    return (
        <div className="fixed left-6 top-32 bottom-24 w-72 bg-slate-900/40 backdrop-blur-md border border-cyan-500/20 rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)] flex flex-col z-30 transition-all duration-500 hover:border-cyan-500/40">
            <div className="p-5 border-b border-cyan-500/10 bg-gradient-to-br from-slate-950/80 to-slate-900/80">
                <div className="flex items-center gap-2 text-cyan-400 font-mono text-[10px] uppercase tracking-[0.3em] mb-1.5 opacity-70">
                    <Navigation size={12} className="animate-pulse" />
                    <span>Nawigacja Sektorowa</span>
                </div>
                <div className="text-white font-bold text-xl tracking-tight">METROPOLIA <span className="text-cyan-500 text-xs align-top ml-1">v2.0</span></div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-5 scrollbar-thin scrollbar-thumb-cyan-500/20 scrollbar-track-transparent">
                {zones.map((zone) => {
                    const zoneAddresses = Object.keys(addressMapping)
                        .filter(addr => addressMapping[addr].zone === zone)
                        .sort();

                    if (zoneAddresses.length === 0) return null;

                    return (
                        <div key={zone} className="space-y-2">
                            <div className="px-2 py-1 text-[10px] font-black text-white/40 uppercase tracking-[0.2em] flex items-center gap-2">
                                <div className="w-1 h-1 rounded-full bg-cyan-500 shadow-[0_0_5px_rgba(6,182,212,0.8)]" />
                                {zone}
                            </div>
                            <div className="grid grid-cols-1 gap-1.5">
                                {zoneAddresses.map((addr) => (
                                    <button
                                        key={addr}
                                        onClick={() => onAddressSelect(addr)}
                                        className="group w-full px-4 py-2.5 text-left bg-white/[0.02] hover:bg-cyan-500/10 border border-white/[0.05] hover:border-cyan-500/20 rounded-xl transition-all duration-300 flex items-center gap-3 active:scale-[0.98]"
                                    >
                                        <MapPin size={14} className="text-slate-600 group-hover:text-cyan-400 transition-colors" />
                                        <div className="flex-1">
                                            <div className="text-slate-400 group-hover:text-white font-mono text-xs transition-colors tracking-wide">
                                                {addr}
                                            </div>
                                        </div>
                                        <Navigation size={10} className="text-cyan-500 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="p-4 bg-slate-950/40 border-t border-cyan-500/10">
                <div className="flex items-center justify-between text-[8px] font-mono uppercase tracking-widest text-slate-500">
                    <span>Status: Dynamicznie</span>
                    <span className="flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                        Live Sync
                    </span>
                </div>
            </div>
        </div>
    );
}
