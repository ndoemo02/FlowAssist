'use client'
import { Phone, Globe, BarChart3 } from 'lucide-react'

export default function Features() {
    const features = [
        {
            icon: Phone,
            title: "Automatyzacja Połączeń Głosowych",
            desc: "Automatyzacja połączeń głosowych: umawianie spotkań, obsługa zamówień, ankiety satysfakcji. Odbieranie i wykonywanie setek połączeń jednocześnie."
        },
        {
            icon: Globe,
            title: "Budowa Stron WWW i SEO",
            desc: "Budowa Stron WWW i SEO: nowoczesne, szybkie i responsywne strony internetowe. Optymalizacja pod wyszukiwarki (SEO) dla lepszej widoczności."
        },
        {
            icon: BarChart3,
            title: "Analiza Danych i Raportowanie",
            desc: "Analiza danych i Raportowanie: porządkowanie informacji, przejrzyste dashboardy. Precyzyjne monitorowanie obsługi klienta i wnioskowanie biznesowe."
        }
    ]

    return (
        <section className="w-full py-20 px-6 max-w-7xl mx-auto z-10 relative">
            <h2 className="text-3xl md:text-5xl font-bold text-center text-white mb-16 drop-shadow-lg">
                Asystenci Głosowi AI i Nowoczesne<br />
                Strony WWW dla Twojej Firmy
            </h2>

            <div className="flex justify-center gap-6 mb-20">
                <button className="px-8 py-3 rounded-full bg-green-500 hover:bg-green-600 text-black font-bold text-lg transition-transform hover:scale-105 shadow-[0_0_20px_rgba(34,197,94,0.4)]">
                    Umów Konsultację
                </button>
                <button className="px-8 py-3 rounded-full border border-zinc-700 bg-zinc-900/50 hover:bg-zinc-800 text-white font-medium text-lg backdrop-blur-sm transition-colors">
                    Zobacz Demo
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-slate-300">
                {features.map((f, i) => (
                    <div key={i} className="flex flex-col items-start gap-4 p-6 rounded-2xl bg-gradient-to-br from-zinc-900/80 to-black/50 border border-white/5 hover:border-green-500/30 transition-all group">
                        <div className="p-3 rounded-lg bg-green-500/10 text-green-400 group-hover:text-green-300 group-hover:shadow-[0_0_15px_rgba(74,222,128,0.3)] transition-all">
                            <f.icon size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-white mt-2">{f.title}</h3>
                        <p className="text-sm leading-relaxed opacity-80">{f.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    )
}
