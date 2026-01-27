'use client'
import Contact3D from '@/components/Contact3D'

export default function ContactPage() {
    return (
        <main className="w-full h-screen bg-black relative overflow-hidden flex flex-col">
            <div className="absolute top-4 left-4 z-10">
                <h1 className="text-2xl text-white/50 font-bold pointer-events-none">Koncept: Voice-to-Ink</h1>
            </div>

            {/* 3D Scene takes full space */}
            <div className="flex-1 w-full h-full relative">
                <Contact3D />
            </div>

            {/* Background Hint */}
            <div className="absolute inset-0 z-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900 via-black to-black"></div>
        </main>
    )
}
