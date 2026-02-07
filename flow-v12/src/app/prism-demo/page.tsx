'use client';

import dynamic from 'next/dynamic';

const PrismScene = dynamic(() => import('@/features/hero-3d/components/PrismScene'), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-black flex items-center justify-center text-cyan-500">Loading Visualization...</div>
});

export default function PrismDemoPage() {
  return (
    <main className="relative w-full h-screen overflow-hidden bg-[#050510]">
      {/* 3D Scene Layer */}
      <div className="absolute inset-0 z-0">
        <PrismScene />
      </div>

      {/* UI Overlay */}
      <div className="relative z-10 w-full h-full pointer-events-none flex flex-col justify-between p-12">
        <header className="pointer-events-auto">
          <h1 className="text-4xl font-bold text-white tracking-widest">
            FLOW<span className="text-cyan-400">.PRISM</span>
          </h1>
          <p className="text-gray-400 text-sm mt-2">Deterministic Chaos Control</p>
        </header>

        <div className="pointer-events-auto max-w-lg">
          <div className="bg-black/50 backdrop-blur-md p-6 border-l-2 border-cyan-400">
            <h2 className="text-xl text-white font-bold mb-2">Jak to działa?</h2>
            <p className="text-gray-300 text-sm mb-4">
              Widzisz surowe dane (chaos) wchodzące w <strong>Deterministic Gate</strong>. 
              Pryzmat porządkuje je w ustrukturyzowane, przewidywalne strumienie.
            </p>
            <div className="flex gap-4 text-xs text-gray-400 font-mono">
              <span>[LPM] Obrót</span>
              <span>[Scroll] Zoom/Fokus</span>
              <span>[PPM] Przesunięcie</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
