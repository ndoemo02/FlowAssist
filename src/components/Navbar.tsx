'use client'
import Image from 'next/image';
import { useView } from '@/context/ViewProvider';

export const Navbar = () => {
    const { currentView, setView } = useView();

    return (
        <nav className="fixed top-0 w-full z-50 px-6 py-4">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                {/* Kontener Logo z delikatnym blurem pod spodem */}
                <div className="flex items-center gap-2 p-1 cursor-pointer" onClick={() => setView('HOME')}>
                    <Image
                        src="/logo flowassist1.png"
                        alt="FlowAssist Logo"
                        width={120}
                        height={40}
                        className="object-contain"
                    />
                </div>

                <div className="hidden md:flex gap-8 text-sm font-medium text-white/70">
                    <button onClick={() => setView('HOME')} className={`hover:text-white transition-colors ${currentView === 'HOME' ? 'text-white' : ''}`}>Technologia</button>
                    <a href="#industries" className="hover:text-white transition-colors">Branże</a>
                    <a href="#contact" className="hover:text-white transition-colors">Kontakt</a>
                    <button
                        onClick={() => setView('DEV_PANEL')}
                        className={`hover:text-white transition-colors ${currentView === 'DEV_PANEL' ? 'text-blue-400' : ''}`}
                    >
                        Dev Panel
                    </button>
                </div>
            </div>
        </nav>
    );
};
