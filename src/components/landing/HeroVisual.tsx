'use client'
import { motion } from 'framer-motion'
import { MessageCircle, BarChart2, Plus } from 'lucide-react'

export default function HeroVisual() {
    return (
        <div className="relative w-[300px] h-[600px] md:w-[350px] md:h-[700px] bg-zinc-900 border-8 border-zinc-800 rounded-[3rem] shadow-2xl overflow-hidden">
            {/* Screen Content */}
            <div className="absolute inset-0 bg-black flex flex-col relative overflow-hidden">
                {/* Status Bar */}
                <div className="w-full h-8 flex justify-between px-6 items-center text-[10px] text-white/50">
                    <span>9:41</span>
                    <div className="flex gap-1">
                        <div className="w-3 h-3 bg-white/20 rounded-full"></div>
                        <div className="w-3 h-3 bg-white/20 rounded-full"></div>
                    </div>
                </div>

                {/* Waveform Visualization Background */}
                <div className="absolute inset-0 z-0 flex items-center justify-center opacity-30">
                    <div className="w-full h-32 bg-gradient-to-r from-blue-500 via-teal-400 to-purple-600 blur-2xl opacity-40 animate-pulse"></div>
                </div>

                {/* Fake App UI */}
                <div className="relative z-10 flex-1 p-4 flex flex-col justify-end pb-20">
                    <div className="flex justify-center mb-8">
                        <div className="w-48 h-24 bg-gradient-to-t from-blue-500/20 to-transparent rounded-t-full border-t border-blue-400/30"></div>
                    </div>
                </div>

                {/* Navigation */}
                <div className="absolute bottom-0 w-full h-20 bg-zinc-900/90 backdrop-blur flex justify-around items-center px-4 border-t border-white/5 z-20">
                    <div className="p-2 text-white/50"><BarChart2 size={24} /></div>
                    <div className="p-4 bg-blue-600 rounded-full -mt-8 shadow-[0_0_15px_rgba(37,99,235,0.5)] text-white">
                        <Plus size={24} />
                    </div>
                    <div className="p-2 text-white/50"><div className="w-6 h-6 rounded-full border border-current"></div></div>
                </div>

                {/* Dynamic Island / Notch */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-7 bg-black rounded-b-2xl z-30"></div>
            </div>

            {/* Floating Message Bubbles (Outside/Overlay) */}
            <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-40 -left-16 bg-green-400/90 backdrop-blur p-4 rounded-2xl rounded-tr-none shadow-[0_0_20px_rgba(74,222,128,0.3)] z-40 border border-green-300/50"
            >
                <div className="flex gap-2 items-center">
                    <div className="w-8 h-1 bg-white/80 rounded-full"></div>
                    <div className="w-4 h-1 bg-white/80 rounded-full"></div>
                </div>
                <div className="mt-2 w-12 h-1 bg-white/40 rounded-full"></div>
            </motion.div>

            <motion.div
                animate={{ y: [0, 15, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-40 -right-8 bg-purple-600/90 backdrop-blur p-4 rounded-2xl rounded-bl-none shadow-[0_0_20px_rgba(147,51,234,0.4)] z-40 border border-purple-400/50"
            >
                <MessageCircle size={24} className="text-white" />
            </motion.div>

            {/* Neon Glow behind phone */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-blue-600 to-pink-600 blur-[60px] -z-10 opacity-40"></div>
        </div>
    )
}
