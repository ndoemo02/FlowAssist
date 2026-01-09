'use client'
import dynamic from 'next/dynamic'
import { useView } from '@/context/ViewProvider'
import Dashboard3D from '@/components/Dashboard3D'
import HeroVisual from '@/components/landing/HeroVisual'
import Features from '@/components/landing/Features'
import Testimonials from '@/components/landing/Testimonials'
import ContactFooter from '@/components/landing/ContactFooter'
import FloatingAssistant from '@/components/landing/FloatingAssistant'

const TubesBackground = dynamic(() => import('@/components/TubesBackground'), { ssr: false })

export default function Home() {
    const { currentView } = useView()

    if (currentView === 'DEV_PANEL') {
        return (
            <main className="relative w-full h-screen bg-black overflow-hidden">
                <Dashboard3D />
            </main>
        )
    }

    return (
        <main className="relative min-h-screen bg-black overflow-x-hidden">
            <TubesBackground />

            {/* --- HERO SECTION --- */}
            <section className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen flex flex-col md:flex-row items-center justify-between gap-12 z-10">

                {/* Text Content */}
                <div className="flex-1 text-center md:text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs font-medium text-white/70 mb-6 backdrop-blur">
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                        Nowa generacja AI
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-2xl">
                        Obsługa klienta, <br />
                        zarządzanie i analiza <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                            – w jednym systemie.
                        </span>
                    </h1>

                    <p className="text-lg text-slate-300/80 mb-10 max-w-xl leading-relaxed font-light mx-auto md:mx-0">
                        System, który odbiera rozmowy, porządkuje działania i pokazuje realne dane. Zwiększ efektywność swojej firmy dzięki AI.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                        <button className="px-8 py-4 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold text-lg shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all transform hover:scale-105">
                            Umów Konsultację
                        </button>
                        <button className="px-8 py-4 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-white font-medium text-lg backdrop-blur-sm transition-colors">
                            Zobacz Demo
                        </button>
                    </div>
                </div>

                {/* Visual Content */}
                <div className="flex-1 flex justify-center md:justify-end relative">
                    <HeroVisual />
                </div>
            </section>

            {/* --- SECTIONS --- */}
            <Features />
            <Testimonials />
            <ContactFooter />
            <FloatingAssistant />

            {/* Global Gradient Overlay */}
            <div className="absolute top-0 left-0 w-full h-[1000px] bg-gradient-to-b from-purple-900/20 via-black to-black pointer-events-none -z-10"></div>
        </main>
    )
}
