'use client'
import Image from 'next/image';
import { useView } from '@/context/ViewProvider';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown, Monitor, Box, Image as ImageIcon } from 'lucide-react';

// Flaga DEV - ustaw na true tylko dla deweloperów
const DEV_MODE = true;

export const Navbar = () => {
    const { currentView, setView } = useView();
    const [isOpen, setIsOpen] = useState(false);
    const [isDevOpen, setIsDevOpen] = useState(false);
    const pathname = usePathname();

    const handleMapClick = () => {
        if (pathname === '/') {
            setView('MAP');
            window.history.pushState({}, '', '?view=map');
        } else {
            window.location.href = '/?view=map';
        }
        setIsOpen(false);
    };

    return (
        <nav className="fixed top-0 w-full z-50 px-6 py-4 transition-all duration-300 bg-gradient-to-b from-black/80 to-transparent">
            <div className="max-w-7xl mx-auto flex justify-between items-center relative">

                {/* Placeholder dla zachowania layoutu */}
                <div className="w-[120px]" />

                {/* Desktop Menu */}
                <div className="hidden md:flex gap-8 text-sm font-medium text-white/70 items-center">
                    <a href="/presentation.html" target="_blank" className="hover:text-white transition-colors">Technologia</a>
                    <button onClick={handleMapClick} className={`hover:text-white transition-colors ${currentView === 'MAP' ? 'text-white' : ''}`}>Mapa 3D</button>
                    <a href="https://flow-assist.vercel.app/dev/v3/index.html" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors text-emerald-400">🌍 Cesium Maps</a>
                    <a href="/dev/v5" className="hover:text-white transition-colors">Kontakt</a>

                    {/* Desktop Dev Panel Dropdown - tylko w trybie DEV */}
                    {DEV_MODE && (
                        <div className="relative group">
                            <button className="hover:text-white transition-colors text-blue-400 flex items-center gap-1 py-2">
                                Dev Panel <span className="text-[10px]">▼</span>
                            </button>
                            <div className="absolute left-0 top-full pt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                                <div className="bg-zinc-900/90 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl overflow-hidden p-1">
                                    <a href="/dev/" className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-lg text-sm text-gray-300 hover:text-white transition-colors">
                                        <Monitor size={16} /> <span>V1: Studio</span>
                                    </a>
                                    <a href="/dev/v2/" className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-lg text-sm text-gray-300 hover:text-white transition-colors">
                                        <Box size={16} /> <span>V2: Living Room</span>
                                    </a>
                                    <a href="/dev/v3/" className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-lg text-sm text-gray-300 hover:text-white transition-colors">
                                        <ImageIcon size={16} /> <span>V3: HDRI Preview</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-white z-50 p-2"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <div className={`fixed inset-0 bg-black/95 backdrop-blur-xl z-40 transition-transform duration-300 flex flex-col justify-center items-center md:hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex flex-col gap-8 text-xl font-medium text-white/80 items-center w-full max-w-xs">
                    <a
                        href="/presentation.html"
                        target="_blank"
                        onClick={() => setIsOpen(false)}
                        className="hover:text-white transition-colors"
                    >
                        Technologia
                    </a>
                    <button
                        onClick={handleMapClick}
                        className={`hover:text-white transition-colors ${currentView === 'MAP' ? 'text-white font-bold' : ''}`}
                    >
                        Mapa 3D
                    </button>
                    <a
                        href="https://flow-assist.vercel.app/dev/v3/index.html"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setIsOpen(false)}
                        className="hover:text-white transition-colors text-emerald-400"
                    >
                        🌍 Cesium Maps
                    </a>
                    <a href="/dev/v5" onClick={() => setIsOpen(false)} className="hover:text-white transition-colors">Kontakt</a>

                    {/* Mobile Dev Panel - tylko w trybie DEV */}
                    {DEV_MODE && (
                        <>
                            <div className="w-full flex flex-col items-center">
                                <button
                                    onClick={() => setIsDevOpen(!isDevOpen)}
                                    className="flex items-center gap-2 hover:text-blue-400 transition-colors text-blue-300 mb-2"
                                >
                                    Dev Panel <ChevronDown size={16} className={`transition-transform ${isDevOpen ? 'rotate-180' : ''}`} />
                                </button>

                                <div className={`flex flex-col gap-3 items-center w-full overflow-hidden transition-all duration-300 ${isDevOpen ? 'max-h-40 opacity-100 mt-2' : 'max-h-0 opacity-0'}`} >
                                    <a href="/dev/" className="text-base text-gray-400 hover:text-white flex items-center gap-2">
                                        <Monitor size={14} /> V1: Studio
                                    </a>
                                    <a href="/dev/v2/" className="text-base text-gray-400 hover:text-white flex items-center gap-2">
                                        <Box size={14} /> V2: Living Room
                                    </a>
                                    <a href="/dev/v3/" className="text-base text-gray-400 hover:text-white flex items-center gap-2">
                                        <ImageIcon size={14} /> V3: HDRI Preview
                                    </a>
                                </div>
                            </div>

                            <a
                                href="/test.html"
                                className="text-green-400 border border-green-400/50 px-6 py-2 rounded-full hover:bg-green-400/10 mt-4"
                            >
                                Test 3D
                            </a>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};
