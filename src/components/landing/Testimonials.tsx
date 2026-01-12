'use client'

export default function Testimonials() {
    const testimonials = [
        {
            quote: "\"FlowAssist to cudowne usprawnienie działania w firmie. Mamy spersonalizowany model, który świetnie rozumie naszą branżę. Oszczędzamy mnóstwo czasu na powtarzalne pytania.\"",
            author: "Mirela Karnac",
            role: "FlowArtist"
        },
        {
            quote: "\"Nareszcie - terminowość i komunikacja na najwyższym poziomie. Skuteczna obsługa klienta to podstawa naszej wiarygodności w oczach kontrahentów.\"",
            author: "Anna Saliver",
            role: "Forester"
        },
        {
            quote: "\"FlowAssist działa! Raportowanie przejrzyste, analiza danych tak dokładna, że pozwala nam na optymalizację każdego procesu. To realne oszczędności.\"",
            author: "Robert Slony",
            role: "Communicators"
        }
    ]

    return (
        <section className="w-full py-20 px-6 max-w-7xl mx-auto z-10 relative">
            <h2 className="text-4xl font-bold text-center text-white mb-16">Opinie klientów</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
                {testimonials.map((t, i) => (
                    <div key={i} className="p-8 rounded-2xl bg-zinc-900/60 border border-white/5 backdrop-blur-sm relative">
                        <div className="text-zinc-500 mb-4 text-4xl font-serif">“</div>
                        <p className="text-slate-300 italic mb-6 leading-relaxed">
                            {t.quote}
                        </p>
                        <div>
                            <div className="font-bold text-white text-base">{t.author}</div>
                            <div className="text-zinc-500 text-xs uppercase tracking-wider">{t.role}</div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
