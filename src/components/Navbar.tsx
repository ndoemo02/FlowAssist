import Image from 'next/image';

export const Navbar = () => {
    return (
        <nav className="fixed top-0 w-full z-50 bg-white/5 backdrop-blur-md border-b border-white/10 px-6 py-4">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                {/* Kontener Logo z delikatnym blurem pod spodem */}
                <div className="flex items-center gap-2 p-1">
                    <Image
                        src="/Flowassis.png"
                        alt="FlowAssist Logo"
                        width={120}
                        height={40}
                        className="object-contain"
                    />
                </div>

                <div className="hidden md:flex gap-8 text-sm font-medium text-white/70">
                    <a href="#tech" className="hover:text-white transition-colors">Technologia</a>
                    <a href="#industries" className="hover:text-white transition-colors">Branże</a>
                    <a href="#contact" className="hover:text-white transition-colors">Kontakt</a>
                </div>
            </div>
        </nav>
    );
};
