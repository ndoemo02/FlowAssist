'use client'
import Contact3D from '@/components/Contact3D'
import { useState } from 'react'

export default function ContactPage() {
    const [inputText, setInputText] = useState('')

    const handleSend = () => {
        if ((window as any).writeToParchment) {
            (window as any).writeToParchment(inputText);
            setInputText('');
        }
    }

    return (
        <main className="w-full min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden">
            <h1 className="text-4xl text-white font-bold mb-4 z-10 mt-20">Kontakt (3D Experience)</h1>

            <div className="w-[80vw] h-[60vh] border border-white/20 rounded-xl overflow-hidden shadow-2xl relative bg-zinc-900/50 backdrop-blur-sm z-10">
                <Contact3D />
            </div>

            <div className="z-20 mt-8 flex flex-col items-center gap-4">
                <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Wpisz wiadomość..."
                    className="px-4 py-2 rounded bg-white/10 text-white border border-white/30 focus:outline-none focus:border-blue-400 w-64"
                />
                <button
                    onClick={handleSend}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded font-medium transition-colors"
                >
                    Napisz (Symulacja 3D)
                </button>
            </div>

            {/* Background Hint */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none bg-gradient-to-b from-blue-900/20 to-black"></div>
        </main>
    )
}
