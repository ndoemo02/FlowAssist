'use client';

import { useState } from 'react';
import { Download, Search, MapPin, Database } from 'lucide-react';

interface MapAnalysisToolsProps {
    onDownload?: () => void;
    onSearch?: (pattern: string) => void;
    onFilter?: (minX: number, maxX: number, minZ: number, maxZ: number) => void;
}

export default function MapAnalysisTools({
    onDownload,
    onSearch,
    onFilter
}: MapAnalysisToolsProps) {
    const [searchPattern, setSearchPattern] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [showAreaFilter, setShowAreaFilter] = useState(false);
    const [area, setArea] = useState({ minX: 0, maxX: 0, minZ: 0, maxZ: 0 });

    return (
        <div className="fixed bottom-24 right-6 z-20 flex flex-col gap-2">
            {/* Download Button */}
            <button
                onClick={() => {
                    if (typeof window !== 'undefined' && (window as any).downloadMapData) {
                        (window as any).downloadMapData();
                    }
                }}
                className="group relative px-4 py-3 bg-cyan-600/90 hover:bg-cyan-500 text-white rounded-lg backdrop-blur-sm border border-cyan-400/30 transition-all shadow-lg hover:shadow-cyan-500/50 flex items-center gap-2 font-mono text-sm"
                title="Pobierz dane jako JSON"
            >
                <Download size={18} />
                <span className="hidden md:inline">Pobierz Dane</span>
                <div className="absolute -top-2 -right-2 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            </button>

            {/* Search Toggle */}
            <button
                onClick={() => setShowSearch(!showSearch)}
                className="px-4 py-3 bg-purple-600/90 hover:bg-purple-500 text-white rounded-lg backdrop-blur-sm border border-purple-400/30 transition-all shadow-lg hover:shadow-purple-500/50 flex items-center gap-2 font-mono text-sm"
                title="Wyszukaj obiekty"
            >
                <Search size={18} />
                <span className="hidden md:inline">Szukaj</span>
            </button>

            {/* Search Panel */}
            {showSearch && (
                <div className="absolute bottom-full right-0 mb-2 w-80 bg-slate-900/95 backdrop-blur-md border border-purple-400/30 rounded-lg p-4 shadow-2xl">
                    <div className="text-purple-300 font-mono text-xs mb-2 uppercase tracking-wider">
                        Wyszukaj po nazwie
                    </div>
                    <input
                        type="text"
                        value={searchPattern}
                        onChange={(e) => setSearchPattern(e.target.value)}
                        placeholder="np. building, road..."
                        className="w-full px-3 py-2 bg-slate-800 text-white border border-purple-400/30 rounded font-mono text-sm focus:outline-none focus:border-purple-400 mb-2"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && searchPattern) {
                                if (typeof window !== 'undefined' && (window as any).filterByName) {
                                    (window as any).filterByName(searchPattern);
                                }
                            }
                        }}
                    />
                    <button
                        onClick={() => {
                            if (searchPattern && typeof window !== 'undefined' && (window as any).filterByName) {
                                (window as any).filterByName(searchPattern);
                            }
                        }}
                        className="w-full px-3 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded font-mono text-sm transition-colors"
                    >
                        Szukaj
                    </button>
                </div>
            )}

            {/* Area Filter Toggle */}
            <button
                onClick={() => setShowAreaFilter(!showAreaFilter)}
                className="px-4 py-3 bg-emerald-600/90 hover:bg-emerald-500 text-white rounded-lg backdrop-blur-sm border border-emerald-400/30 transition-all shadow-lg hover:shadow-emerald-500/50 flex items-center gap-2 font-mono text-sm"
                title="Filtruj po obszarze"
            >
                <MapPin size={18} />
                <span className="hidden md:inline">Obszar</span>
            </button>

            {/* Area Filter Panel */}
            {showAreaFilter && (
                <div className="absolute bottom-full right-0 mb-2 w-80 bg-slate-900/95 backdrop-blur-md border border-emerald-400/30 rounded-lg p-4 shadow-2xl">
                    <div className="text-emerald-300 font-mono text-xs mb-3 uppercase tracking-wider">
                        Filtruj po obszarze XZ
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-2">
                        <div>
                            <label className="text-emerald-200 text-xs font-mono block mb-1">Min X</label>
                            <input
                                type="number"
                                value={area.minX}
                                onChange={(e) => setArea({ ...area, minX: parseFloat(e.target.value) })}
                                className="w-full px-2 py-1 bg-slate-800 text-white border border-emerald-400/30 rounded font-mono text-sm focus:outline-none focus:border-emerald-400"
                            />
                        </div>
                        <div>
                            <label className="text-emerald-200 text-xs font-mono block mb-1">Max X</label>
                            <input
                                type="number"
                                value={area.maxX}
                                onChange={(e) => setArea({ ...area, maxX: parseFloat(e.target.value) })}
                                className="w-full px-2 py-1 bg-slate-800 text-white border border-emerald-400/30 rounded font-mono text-sm focus:outline-none focus:border-emerald-400"
                            />
                        </div>
                        <div>
                            <label className="text-emerald-200 text-xs font-mono block mb-1">Min Z</label>
                            <input
                                type="number"
                                value={area.minZ}
                                onChange={(e) => setArea({ ...area, minZ: parseFloat(e.target.value) })}
                                className="w-full px-2 py-1 bg-slate-800 text-white border border-emerald-400/30 rounded font-mono text-sm focus:outline-none focus:border-emerald-400"
                            />
                        </div>
                        <div>
                            <label className="text-emerald-200 text-xs font-mono block mb-1">Max Z</label>
                            <input
                                type="number"
                                value={area.maxZ}
                                onChange={(e) => setArea({ ...area, maxZ: parseFloat(e.target.value) })}
                                className="w-full px-2 py-1 bg-slate-800 text-white border border-emerald-400/30 rounded font-mono text-sm focus:outline-none focus:border-emerald-400"
                            />
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            if (typeof window !== 'undefined' && (window as any).filterByArea) {
                                (window as any).filterByArea(area.minX, area.maxX, area.minZ, area.maxZ);
                            }
                        }}
                        className="w-full px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-mono text-sm transition-colors"
                    >
                        Filtruj
                    </button>
                </div>
            )}

            {/* Info Badge */}
            <div className="mt-2 px-3 py-2 bg-slate-800/90 border border-cyan-400/20 rounded-lg backdrop-blur-sm">
                <div className="flex items-center gap-2 text-cyan-300 font-mono text-xs">
                    <Database size={14} />
                    <span>Analiza aktywna</span>
                </div>
                <div className="text-slate-400 text-[10px] font-mono mt-1">
                    Sprawdź konsolę F12
                </div>
            </div>
        </div>
    );
}
