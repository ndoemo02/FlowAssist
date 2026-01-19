'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useShowcaseStore } from './store';
import AddressSearch from './AddressSearch';
import MetropoliaSidebar from './MetropoliaSidebar';
import MapAnalysisTools from './MapAnalysisTools';

export default function ImmersiveMap() {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const { addLog, setAddressMapping, addressMapping } = useShowcaseStore();
    const [iframeLoaded, setIframeLoaded] = useState(false);

    // 1. Ładowanie danych adresowych (React)
    useEffect(() => {
        const fetchMapping = async () => {
            try {
                const response = await fetch('/addressMapping.json', { cache: 'no-store' });
                const data = await response.json();
                setAddressMapping(data);

                // Expose globally for utilities
                if (typeof window !== 'undefined') {
                    (window as any).addressMapping = data;
                }
                console.log('✅ [React] Address Data Loaded:', Object.keys(data).length, 'entries');
            } catch (error) {
                console.error('❌ [React] Failed to load addressMapping.json:', error);
            }
        };
        fetchMapping();
    }, [setAddressMapping]);

    // 2. Obsługa wyboru adresu (Control Logic)
    const handleAddressSelect = (addressName: string) => {
        const data = addressMapping[addressName];

        if (!data) {
            console.warn(`[React] Unknown address: ${addressName}`);
            return;
        }

        console.log(`🚁 [React] Sending FlyTo command: ${addressName}`);
        addLog(`>> COMMAND: NAVIGATE TO ${addressName.toUpperCase()}`);

        if (iframeRef.current && iframeRef.current.contentWindow) {
            iframeRef.current.contentWindow.postMessage({
                type: 'FLY_TO',
                payload: {
                    target: {
                        lat: data.lat,
                        lon: data.lon,
                        height: data.height || 0
                    }
                }
            }, '*');
        } else {
            console.warn('[React] Iframe not ready');
        }
    };

    // 3. Expose Global API for Voice Commands
    useEffect(() => {
        if (typeof window !== 'undefined') {
            (window as any).flyToAddress = handleAddressSelect;
        }
    }, [addressMapping]); // Rebind when mapping updates

    return (
        <div className="relative w-full h-screen bg-slate-950 overflow-hidden">

            {/* --- CORE: IFRAME BRIDGE TO V3 ENGINE --- */}
            <iframe
                ref={iframeRef}
                src="/dev/v3/index.html"
                className={`absolute inset-0 w-full h-full border-none transition-opacity duration-1000 ${iframeLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => {
                    console.log('✅ [React] V3 Engine Bridge Connected');
                    // Give it a moment to initialize internal Cesium
                    setTimeout(() => setIframeLoaded(true), 1000);
                }}
            />

            {/* Loading Overlay (React Side) */}
            {!iframeLoaded && (
                <div className="absolute inset-0 z-10 bg-black flex flex-col items-center justify-center text-cyan-500 font-mono pointer-events-none">
                    <div className="animate-pulse mb-4 text-4xl">💠</div>
                    <div className="tracking-widest">CONNECTING TO NEURAL CITY...</div>
                </div>
            )}

            {/* --- UI LAYER (React) --- */}

            {/* Search Bar */}
            <div className="absolute top-4 left-4 right-4 z-[100] pointer-events-none">
                <div className="pointer-events-auto drop-shadow-2xl max-w-2xl mx-auto">
                    <AddressSearch onAddressSelect={handleAddressSelect} />
                </div>
            </div>

            {/* Sidebar Navigation */}
            <MetropoliaSidebar onAddressSelect={handleAddressSelect} />

            {/* System Status Indicators */}
            <div className="absolute top-0 right-0 p-6 pt-24 pointer-events-none z-[100]">
                <div className="text-right">
                    <div className="text-cyan-500 font-mono text-xs tracking-[0.2em] uppercase">System</div>
                    <div className="flex items-center gap-2 justify-end">
                        <div className={`w-2 h-2 rounded-full ${iframeLoaded ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                        <span className="text-white font-mono text-sm">CESIUM BRIDGE ACTIVE</span>
                    </div>
                </div>
            </div>

            {/* Analysis Tools Overlay */}
            <MapAnalysisTools />

        </div>
    );
}
