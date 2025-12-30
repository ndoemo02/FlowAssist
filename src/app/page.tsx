'use client'
import dynamic from 'next/dynamic'


const TubesBackground = dynamic(() => import('@/components/TubesBackground'), { ssr: false })

export default function Home() {
    return (
        <main className="relative min-h-screen flex flex-col items-center justify-center pt-20 px-4 overflow-hidden">
            <TubesBackground />

            {/* Iteration 2: Hero Section */}
            {/* Iteration 2: Hero Section */}
            <div className="z-10 text-center max-w-4xl">
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-xl leading-snug">
                    Obsługa klienta, zarządzanie i analiza<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-white to-blue-200">
                        – w jednym systemie.
                    </span>
                </h1>
                <p className="text-lg text-slate-300/80 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
                    System, który odbiera rozmowy, porządkuje działania<br className="hidden md:block" />
                    i pokazuje realne dane.
                </p>

                {/* Iteration 3: Action Buttons */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                    <button className="px-8 py-3.5 bg-white text-black font-semibold rounded-full 
                             hover:scale-105 transition-all hover:shadow-[0_0_25px_rgba(255,255,255,0.3)] active:scale-95">
                        Launch Console
                    </button>

                    <button className="px-8 py-3.5 flex items-center gap-2 bg-white/5 border border-white/10 text-white font-medium rounded-full 
                             hover:bg-white/10 transition-all active:scale-95 backdrop-blur-sm">
                        <span>Zobacz live demo</span>
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    </button>
                </div>
            </div>

            {/* Iteration 4: Industries Section */}
            {/* Iteration 4: Industries Section (Removed) */}
        </main>
    )
}
