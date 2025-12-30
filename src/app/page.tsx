'use client'
import dynamic from 'next/dynamic'
import { Stethoscope, Utensils, Building2 } from 'lucide-react';

const TubesBackground = dynamic(() => import('@/components/TubesBackground'), { ssr: false })

export default function Home() {
    return (
        <main className="relative min-h-screen flex flex-col items-center justify-center pt-20 px-4 overflow-hidden">
            <TubesBackground />

            {/* Iteration 2: Hero Section */}
            <div className="z-10 text-center max-w-4xl">
                <h1 className="text-5xl md:text-7xl font-semibold text-white mb-6 drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] leading-tight">
                    Twoja marka już istnieje, <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200">
                        razem pokażmy ją światu.
                    </span>
                </h1>
                <p className="text-lg md:text-xl text-white/60 mb-10 max-w-2xl mx-auto">
                    Inteligentni asystenci 3D i automatyzacja procesów.
                    Skrojone pod Twoje potrzeby, niezależnie od branży.
                </p>

                {/* Iteration 3: Action Button with Glow */}
                <div className="flex flex-col items-center gap-3">
                    <button className="px-8 py-4 bg-gradient-to-br from-white via-slate-100 to-blue-50 text-black font-bold rounded-full 
                             hover:scale-105 transition-all hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] active:scale-95">
                        Launch Console
                    </button>
                    <span className="text-[10px] uppercase tracking-widest text-white/40 font-light">
                        Kliknij, aby wejść do środowiska zarządzania FlowAssist 3D
                    </span>
                </div>
            </div>

            {/* Iteration 4: Industries Section */}
            <div className="z-10 mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
                {[
                    { icon: <Stethoscope size={32} key="med" />, title: "Medycyna", desc: "Dla gabinetów i klinik" },
                    { icon: <Utensils size={32} key="food" />, title: "Gastronomia", desc: "Dla restauracji i kawiarni" },
                    { icon: <Building2 size={32} key="biz" />, title: "Biznes", desc: "Dla nowoczesnych firm SaaS" },
                ].map((item, idx) => (
                    <div key={idx} className="group flex flex-col items-center p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-white/20 transition-all">
                        <div className="text-blue-400 group-hover:text-blue-300 transition-colors mb-4 italic">
                            {item.icon}
                        </div>
                        <h3 className="text-white font-medium mb-1">{item.title}</h3>
                        <p className="text-white/40 text-sm text-center">{item.desc}</p>
                    </div>
                ))}
            </div>
        </main>
    )
}
