'use client'
import Image from 'next/image';
import { useView } from '@/context/ViewProvider';
import { useState } from 'react';
import { Menu, X, ChevronDown, Monitor, Box, Image as ImageIcon } from 'lucide-react';

export const Navbar = () => {
    const { currentView, setView } = useView();
    const [isOpen, setIsOpen] = useState(false);
    const [isDevOpen, setIsDevOpen] = useState(false);

    return (
        <nav className="fixed top-0 w-full z-50 px-6 py-4 transition-all duration-300 bg-gradient-to-b from-black/80 to-transparent">
            <div className="max-w-7xl mx-auto flex justify-between items-center relative">

                {/* Logo */}
                <div className="flex items-center gap-2 cursor-pointer z-50" onClick={() => { setView('HOME'); setIsOpen(false); }}>
                    <Image
                        src="/logo flowassist1.png"
                        alt="FlowAssist Logo"
                        width={120}
                        height={40}
                        className="object-contain"
                    />
                </div>

                {/* Desktop Menu */}
                <div className="hidden md:flex gap-8 text-sm font-medium text-white/70 items-center">
                    <button onClick={() => setView('HOME')} className={`hover:text-white transition-colors ${currentView === 'HOME' ? 'text-white' : ''}`}>Technologia</button>
                    <a href="#industries" className="hover:text-white transition-colors">Branże</a>
                    <a href="/contact" className="hover:text-white transition-colors">Kontakt</a>

                    {/* Desktop Dev Panel Dropdown */}
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

                    <a href="/test.html" className="hover:text-white transition-colors text-green-400 border border-green-400/30 px-3 py-1 rounded-full hover:bg-green-400/10">
                        Test 3D
                    </a>
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
                    <button
                        onClick={() => { setView('HOME'); setIsOpen(false); }}
                        className={`hover:text-white transition-colors ${currentView === 'HOME' ? 'text-white font-bold' : ''}`}
                    >
                        Technologia
                    </button>
                    <a href="#industries" onClick={() => setIsOpen(false)} className="hover:text-white transition-colors">Branże</a>
                    <a href="/contact" onClick={() => setIsOpen(false)} className="hover:text-white transition-colors">Kontakt</a>

                    {/* Mobile Dev Panel Collapsible */}
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
                </div>
            </div>
        </nav>
    );
};
