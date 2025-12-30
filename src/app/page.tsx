import TubesBackground from '@/components/TubesBackground'

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24 relative overflow-hidden">
            <TubesBackground />

            {/* Content */}
            <div className="z-10 text-center space-y-8 max-w-4xl">
                <div className="inline-block px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-sm font-light text-indigo-200 tracking-wider mb-4">
                    FLOW ASSISTANT V1.0
                </div>

                <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-white drop-shadow-2xl">
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-indigo-200">
                        Voice Engineering
                    </span>
                    <span className="block mt-2 font-light text-4xl md:text-6xl text-slate-400">
                        Redefined.
                    </span>
                </h1>

                <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                    Next-generation AI architecture for seamless voice interactions.
                </p>

                <div className="flex gap-6 justify-center mt-12">
                    <button className="group relative px-8 py-4 bg-white text-slate-950 font-semibold rounded-full overflow-hidden transition-all hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]">
                        <span className="relative z-10">Launch Console</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                    <button className="px-8 py-4 glass text-white font-medium rounded-full hover:bg-white/10 transition-colors">
                        Documentation
                    </button>
                </div>
            </div>

            {/* Footer / Decorative */}
            <div className="absolute bottom-8 text-xs text-slate-600 tracking-widest uppercase">
                System Status: Online
            </div>
        </main>
    )
}
