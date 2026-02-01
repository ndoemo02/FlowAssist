'use client';

import { useState, useMemo } from 'react';
import Map, { Source, Layer } from 'react-map-gl';
import maplibreGl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

// TACTICAL CONFIGURATION
const INITIAL_VIEW_STATE = {
    latitude: 52.2297,
    longitude: 21.0122,
    zoom: 13,
    pitch: 55,
    bearing: -15
};

// Colors - High Contrast Neon Palette
const NEON_GOLD = '#ffcc33';
const PURE_BLACK = '#000000';

export default function TacticalMapVector() {
    const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
    const MAPTILER_KEY = 'VpXyLVyDrWaLJLtFuhWo';

    // CUSTOM TACTICAL STYLE: "The Void"
    // We use MapTiler vector tiles but override everything with our own layers for extreme contrast
    const mapStyle = useMemo(() => ({
        version: 8,
        name: 'Tactical Void',
        sources: {
            'maptiler-vector': {
                type: 'vector',
                url: `https://api.maptiler.com/tiles/v3/tiles.json?key=${MAPTILER_KEY}`
            }
        },
        layers: [
            {
                id: 'background',
                type: 'background',
                paint: { 'background-color': PURE_BLACK }
            },
            // ROAD NETWORK (Subtle blueprints)
            {
                id: 'roads-tactical',
                type: 'line',
                source: 'maptiler-vector',
                'source-layer': 'transportation',
                paint: {
                    'line-color': NEON_GOLD,
                    'line-opacity': 0.1,
                    'line-width': 0.5
                }
            },
            // WATER (Dark indigo/void)
            {
                id: 'water-tactical',
                type: 'fill',
                source: 'maptiler-vector',
                'source-layer': 'water',
                paint: { 'fill-color': '#050a14', 'fill-opacity': 0.8 }
            },
            // 3D BUILDINGS - The "Wow" Layer
            {
                id: 'buildings-3d',
                type: 'fill-extrusion',
                source: 'maptiler-vector',
                'source-layer': 'building',
                paint: {
                    'fill-extrusion-color': "#1e293b",
                    'fill-extrusion-height': ["coalesce", ["get", "render_height"], 0],
                    'fill-extrusion-base': ["coalesce", ["get", "render_min_height"], 0],
                    'fill-extrusion-opacity': 0.9,
                    'fill-extrusion-vertical-gradient': true
                }
            },
            // BUILDING OUTLINES (Wireframe feel)
            {
                id: 'buildings-outlines',
                type: 'line',
                source: 'maptiler-vector',
                'source-layer': 'building',
                paint: {
                    'line-color': NEON_GOLD,
                    'line-opacity': 0.3,
                    'line-width': 0.8
                }
            }
        ]
    }), [MAPTILER_KEY]);

    return (
        <div className="relative w-full h-full bg-black overflow-hidden font-sans">
            <Map
                {...viewState}
                onMove={evt => setViewState(evt.viewState)}
                mapLib={maplibreGl as any}
                style={{ width: '100%', height: '100%' }}
                mapStyle={mapStyle as any}
                maxPitch={85}
                minZoom={12} // Lock to city level (no country view)
                maxZoom={18} // Allow close inspection
            />

            {/* HIGH-END TACTICAL HUD */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {/* Top Left Status */}
                <div className="absolute top-10 left-10 space-y-6">
                    <div className="flex items-center gap-5">
                        <div className="relative">
                            <div className="w-6 h-6 rounded-full border border-yellow-500/20 animate-ping absolute inset-0" />
                            <div className="w-6 h-6 rounded-full bg-yellow-500 shadow-[0_0_30px_#ffcc33] border-[6px] border-black relative z-10" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none drop-shadow-2xl">
                                WARSAW <span className="text-yellow-500">TACTICAL</span>
                            </h1>
                            <div className="flex items-center gap-3 mt-1.5">
                                <div className="h-px w-12 bg-yellow-500/40" />
                                <span className="text-[10px] text-yellow-500/50 font-mono tracking-[0.5em] uppercase">
                                    Vector Grid 4.0 // Immersive Mode
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-black/80 border-l-[3px] border-yellow-500 p-5 backdrop-blur-2xl rounded-r-xl max-w-sm shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-t border-r border-b border-white/5">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-[10px] text-yellow-500 uppercase font-black tracking-widest bg-yellow-500/10 px-2 py-0.5 rounded">System Diagnostic</span>
                            <span className="text-[9px] text-gray-500 font-mono">52.22N // 21.01E</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 font-mono text-[10px]">
                            <div className="space-y-1">
                                <div className="text-gray-500 uppercase text-[8px] font-bold">Latency</div>
                                <div className="text-white">0.02ms <span className="text-yellow-500/50">OK</span></div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-gray-500 uppercase text-[8px] font-bold">GPU Load</div>
                                <div className="text-white">12% <span className="text-yellow-500/50">IDLE</span></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Right Control Overlay */}
                <div className="absolute bottom-10 right-10 flex flex-col items-end gap-3 scale-90 translate-x-2 translate-y-2 origin-bottom-right">
                    <div className="text-[9px] text-yellow-500/40 uppercase tracking-[0.6em] font-black mr-2">
                        Tactical View Parameters
                    </div>
                    <div className="flex gap-6 items-center bg-black/40 p-5 rounded-2xl border border-white/10 backdrop-blur-xl shadow-2xl">
                        <div className="text-center group">
                            <div className="text-[8px] text-gray-500 uppercase font-bold group-hover:text-yellow-500 transition-colors">Pitch</div>
                            <div className="text-lg font-black text-white">{viewState.pitch.toFixed(0)}°</div>
                        </div>
                        <div className="w-px h-10 bg-white/10" />
                        <div className="text-center group">
                            <div className="text-[8px] text-gray-500 uppercase font-bold group-hover:text-yellow-500 transition-colors">Zoom</div>
                            <div className="text-lg font-black text-white">{viewState.zoom.toFixed(1)}</div>
                        </div>
                        <div className="w-px h-10 bg-white/10" />
                        <div className="text-center group">
                            <div className="text-[8px] text-gray-500 uppercase font-bold group-hover:text-yellow-500 transition-colors">Engine</div>
                            <div className="text-lg font-black text-yellow-500">M-LIBRE</div>
                        </div>
                    </div>
                </div>

                {/* Atmosphere & Cinematic FX */}
                {/* Vignette */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.9)_100%)]" />
                {/* Top/Bottom Horizontal Gradients */}
                <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black to-transparent opacity-80" />
                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black to-transparent opacity-80" />

                {/* Subtle Digital Scanlines */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(255,255,255,0.02)_50%)] bg-[length:100%_4px] opacity-30 mix-blend-overlay" />

                {/* Chromatic Aberration Edge (Simulated with a purple/cyan gradient) */}
                <div className="absolute inset-0 border-[20px] border-black/0 shadow-[inset_0_0_100px_rgba(0,0,0,0.8)] pointer-events-none" />
            </div>
        </div>
    );
}
