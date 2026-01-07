'use client'
import dynamic from 'next/dynamic'
import { useView } from '@/context/ViewProvider'
import Dashboard3D from '@/components/Dashboard3D'

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
        <main className="relative min-h-screen flex flex-col items-center justify-center pt-20 px-4 overflow-hidden">
            <TubesBackground />

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
            </div>
        </main>
    )
}
