'use client'
import { Phone, Mail } from 'lucide-react'

export default function ContactFooter() {
    return (
        <footer className="w-full py-20 px-6 max-w-7xl mx-auto z-10 relative flex flex-col md:flex-row justify-between items-start gap-12 border-t border-white/5 mt-20">
            <div>
                <h2 className="text-4xl font-bold text-white mb-8">Kontakt</h2>
                <div className="flex flex-col gap-4 text-slate-300">
                    <p className="text-sm text-zinc-500 mb-2">Menu Bartocel/Promce</p>

                    <a href="tel:+489203347770" className="flex items-center gap-3 hover:text-green-400 transition-colors">
                        <Phone size={18} className="text-green-500" />
                        +48 920 334 7770
                    </a>

                    <a href="mailto:f@flowassist.vercel.app" className="flex items-center gap-3 hover:text-green-400 transition-colors">
                        <Mail size={18} className="text-green-500" />
                        f@flowassist.vercel.app
                    </a>
                </div>
            </div>

            {/* Glowing Orb / Assistant Button (Integrated in layout or separate floating) */}
            {/* The image shows a floating button on bottom right, so we'll handle that separately. */}
        </footer>
    )
}
