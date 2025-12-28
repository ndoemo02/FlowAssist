'use client';

import { useState } from 'react';
import Scene from '@/components/Scene';
import Dashboard from '@/components/Dashboard';
import VoicePlayground from '@/components/VoicePlayground';
import { motion } from 'framer-motion';

export default function Home() {
  const [active, setActive] = useState(false);

  return (
    <main className="relative min-h-screen w-full bg-carbon text-white overflow-hidden selection:bg-cyan-500 selection:text-black">
      {/* 3D Background Layer */}
      <div className="fixed inset-0 z-0">
        <Scene active={active} />
      </div>

      {/* Main Content Layer */}
      <div className="relative z-10 flex flex-col items-center w-full">

        {/* Header */}
        <header className="fixed top-0 w-full p-6 flex justify-between items-center max-w-7xl mx-auto z-50 mix-blend-difference pointer-events-none">
          <div className="text-xl font-bold tracking-tighter flex items-center gap-2 pointer-events-auto text-white">
            <span className="w-2 h-2 bg-white rounded-full inline-block shadow-[0_0_10px_white] animate-pulse"></span>
            FLOW ASSIST
          </div>
          <nav className="hidden md:flex gap-8 text-xs font-semibold tracking-widest text-gray-300 pointer-events-auto uppercase">
            <a href="#" className="hover:text-neon-teal transition-colors">Platform</a>
            <a href="#" className="hover:text-neon-teal transition-colors">Solutions</a>
            <a href="#" className="hover:text-neon-teal transition-colors">Developers</a>
          </nav>
        </header>

        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center min-h-screen text-center px-4 max-w-5xl mx-auto space-y-8 pt-20">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-5xl md:text-8xl font-bold tracking-tighter leading-none bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-gray-500"
          >
            Twój biznes <br />
            <span className="text-neon-teal drop-shadow-[0_0_20px_rgba(0,240,255,0.3)]">nigdy nie milczy.</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-xl md:text-2xl text-gray-300 font-light mb-2">Poznaj Flow Assist.</h2>
            <p className="text-sm md:text-base text-gray-500 font-mono tracking-wide">
              Inżynieria systemów głosowych: Obsługa menu 60+ pozycji z latencją p95 &lt; 200ms.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex gap-4 mt-8"
          >
            <button onClick={() => window.scrollTo({ top: 800, behavior: 'smooth' })} className="px-8 py-3 bg-white text-black rounded-full font-bold hover:bg-gray-200 transition-all hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
              Zobacz Demo
            </button>
          </motion.div>
        </section>

        {/* Dashboard Section */}
        <section className="w-full py-24 bg-gradient-to-b from-transparent via-black/20 to-black/40 backdrop-blur-sm border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6 mb-12 flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-bold text-white">Carbon Engine</h2>
              <p className="text-gray-400 mt-2">Live Performance Metrics</p>
            </div>
            <div className="text-right hidden md:block">
              <div className="text-xs font-mono text-neon-teal">STATUS: OPERATIONAL</div>
              <div className="text-xs font-mono text-gray-500">UPTIME: 99.99%</div>
            </div>
          </div>
          <Dashboard />
        </section>

        {/* Playground Section */}
        <section className="w-full py-32 min-h-screen flex flex-col items-center justify-center relative overflown-hidden">
          {/* Background glow for this section */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-neon-teal/5 rounded-full blur-[120px] pointer-events-none" />

          <div className="text-center mb-10 z-10 relative">
            <span className="text-neon-teal font-mono text-xs tracking-[0.2em] uppercase mb-4 block">Simulation Environment</span>
            <h2 className="text-4xl md:text-5xl font-bold">Interactive Voice Playground</h2>
          </div>

          <VoicePlayground active={active} onToggle={() => setActive(!active)} />
        </section>

        <footer className="w-full py-12 border-t border-white/10 bg-black text-center text-gray-600 text-sm relative z-20">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-gray-600 rounded-full" />
              <span>FLOW ASSIST &copy; 2024</span>
            </div>
            <div className="flex gap-6 font-mono text-xs">
              <a href="#" className="hover:text-neon-teal transition-colors">PRIVACY</a>
              <a href="#" className="hover:text-neon-teal transition-colors">TERMS</a>
              <a href="#" className="hover:text-neon-teal transition-colors">CONTACT</a>
            </div>
          </div>
        </footer>

      </div>
    </main>
  );
}
