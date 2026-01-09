'use client'
import { motion } from 'framer-motion'
import { Mic } from 'lucide-react'

export default function FloatingAssistant() {
    return (
        <div className="fixed bottom-8 right-8 z-50 flex items-center gap-4">
            {/* Side Label */}
            <div className="hidden md:flex bg-white text-black px-4 py-2 rounded-l-full shadow-lg items-center font-medium transform translate-x-4">
                <span className="-rotate-90 origin-center whitespace-nowrap text-xs text-zinc-500 hidden">Asystent głosowy - zapytaj o ofertę</span>
                {/* Simplifying label design based on image: Vertical text tab on side? Or just tooltip. 
                   The image shows vertical text tab on the very right edge of screen.
                   Let's stick to the button first.
                */}
            </div>

            {/* Vertical Tab on Right Edge */}
            <div className="fixed top-1/2 right-0 transform -translate-y-1/2 bg-white text-black py-4 px-1 rounded-l-lg shadow-[0_0_20px_rgba(255,255,255,0.2)] z-50 cursor-pointer hidden md:block">
                <div className="writing-vertical-rl text-xs font-bold tracking-wider uppercase rotate-180">
                    Asystent głosowy - zapytaj o ofertę
                </div>
            </div>

            {/* Main Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative group bg-zinc-900 border border-white/10 rounded-full px-6 py-3 flex items-center gap-3 shadow-2xl overflow-hidden"
            >
                {/* Gradient Border/Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-20 group-hover:opacity-40 transition-opacity blur-md"></div>

                <div className="relative z-10 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_#ef4444]"></div>
                    <div className="text-white font-medium text-sm flex flex-col items-start leading-tight">
                        <span className="font-bold">Porozmawiaj</span>
                        <span className="text-xs text-white/70">z asystentem</span>
                    </div>
                </div>

                {/* Ring Animation */}
                <div className="absolute -inset-4 border-2 border-white/5 rounded-full animate-[spin_4s_linear_infinite] opacity-30 pointer-events-none"></div>
                <div className="absolute -inset-1 border border-pink-500/30 rounded-full animate-pulse opacity-50 pointer-events-none"></div>
            </motion.button>

            {/* Arrow/Scroll Up Button could go here too */}
            <button className="bg-green-500 p-3 rounded-full text-black hover:bg-green-400 transition-colors shadow-[0_0_15px_rgba(34,197,94,0.5)]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12l7-7 7 7" />
                    <path d="M12 19V5" />
                </svg>
            </button>
        </div>
    )
}
