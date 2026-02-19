'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X, ChevronDown, Monitor, Box, Image as ImageIcon } from 'lucide-react';
import { useView } from '@/context/ViewProvider';

const DEV_MODE = true;

const NAV_ITEMS = [
    { label: "Technologia", href: "/tech" },
    { label: "AI Security", href: "/security" },
    { label: "Studio", href: "/studio" },
    { label: "Case Studies", href: "/cases" },
    { label: "Kontakt", href: "/contact" }
];

export const Navbar = () => {
    const { setView } = useView();
    const [isOpen, setIsOpen] = useState(false);
    const [isDevOpen, setIsDevOpen] = useState(false);
    const pathname = usePathname();

    return (
        <nav className="fixed top-0 w-full z-50 px-6 py-4 transition-all duration-300 bg-gradient-to-b from-black/80 to-transparent">
            <div className="max-w-7xl mx-auto flex justify-between items-center relative">

                {/* Logo Area (Hidden or just spacing) */}
                <Link href="/" className="font-bold text-xl tracking-tighter text-white hover:text-cyan-400 transition-colors">
                    FlowAssist
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex gap-8 text-sm font-medium text-white/70 items-center">
                    {NAV_ITEMS.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`hover:text-white transition-colors ${pathname === item.href ? 'text-cyan-400' : ''}`}
                        >
                            {item.label}
                        </Link>
                    ))}

                    {/* Developer Panel */}
                    {DEV_MODE && (
                        <div className="relative group ml-4 pl-4 border-l border-white/10">
                            <button className="hover:text-white transition-colors text-blue-400 flex items-center gap-1 py-2">
                                Dev <span className="text-[10px]">▼</span>
                            </button>
                            <div className="absolute right-0 top-full pt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                                <div className="bg-zinc-900/90 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl overflow-hidden p-1">
                                    <div className="px-4 py-2 text-xs text-white/40 uppercase font-bold tracking-wider">Admin Tools</div>
                                    <Link href="/dev/" className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-lg text-sm text-gray-300 hover:text-white transition-colors">
                                        <Monitor size={16} /> <span>V1: Studio</span>
                                    </Link>
                                    <Link href="/dev/v2/" className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-lg text-sm text-gray-300 hover:text-white transition-colors">
                                        <Box size={16} /> <span>V2: Living Room</span>
                                    </Link>
                                    <Link href="/dev/v3/" className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-lg text-sm text-gray-300 hover:text-white transition-colors">
                                        <ImageIcon size={16} /> <span>V3: HDRI Preview</span>
                                    </Link>
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
                <div className="flex flex-col gap-6 text-xl font-medium text-white/80 items-center w-full max-w-xs">
                    {NAV_ITEMS.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className={`hover:text-white transition-colors ${pathname === item.href ? 'text-cyan-400' : ''}`}
                        >
                            {item.label}
                        </Link>
                    ))}

                    {/* Mobile Dev Panel */}
                    {DEV_MODE && (
                        <div className="w-full border-t border-white/10 pt-6 mt-2 flex flex-col items-center">
                            <button
                                onClick={() => setIsDevOpen(!isDevOpen)}
                                className="flex items-center gap-2 hover:text-blue-400 transition-colors text-blue-300 mb-4"
                            >
                                Dev Tools <ChevronDown size={16} className={`transition-transform ${isDevOpen ? 'rotate-180' : ''}`} />
                            </button>

                            <div className={`flex flex-col gap-4 items-center w-full overflow-hidden transition-all duration-300 ${isDevOpen ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'}`} >
                                <Link href="/dev/" className="text-base text-gray-400 hover:text-white flex items-center gap-2">
                                    <Monitor size={14} /> Studio V1
                                </Link>
                                <Link href="/dev/v2/" className="text-base text-gray-400 hover:text-white flex items-center gap-2">
                                    <Box size={14} /> Living Room V2
                                </Link>
                                <Link href="/dev/v3/" className="text-base text-gray-400 hover:text-white flex items-center gap-2">
                                    <ImageIcon size={14} /> HDRI Preview V3
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};
