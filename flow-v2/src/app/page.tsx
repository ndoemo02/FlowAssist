'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

// Dynamically import 3D Scene to avoid SSR issues with Canvas
const HeroScene = dynamic(() => import('@/features/hero-3d/components/HeroScene'), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-void" />
});

export default function Home() {
  return (
    <main className="relative w-full h-screen overflow-hidden bg-void">

      {/* LAYER 1: 3D WORLD (Background) */}
      <div className="absolute inset-0 z-0">
        <HeroScene />
      </div>

      {/* LAYER 2: UI OVERLAY (Foreground) */}
      <div className="relative z-10 w-full h-full pointer-events-none">
        {/* Header / Nav */}
        <header className="absolute top-0 w-full p-8 flex justify-between items-center pointer-events-auto">
          <div className="text-2xl font-display font-bold text-white tracking-widest">
            FLOW<span className="text-signal-cyan">.ASSIST</span>
          </div>
          <nav className="hidden md:flex gap-8 text-sm text-gray-400">
            <a href="#" className="hover:text-white transition-colors">Technology</a>
            <a href="#" className="hover:text-white transition-colors">Solutions</a>
            <a href="#" className="hover:text-white transition-colors">Studio</a>
          </nav>
          <button className="px-6 py-2 border border-white/20 rounded-full text-sm hover:bg-white/10 transition-colors backdrop-blur-md">
            Control Space
          </button>
        </header>

        {/* Hero Content */}
        <div className="flex flex-col items-center justify-center h-full text-center space-y-8 px-4">
          <motion.div
            initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 className="text-6xl md:text-9xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-200 to-gray-600 tracking-tighter">
              SILENCE<br />THE CHAOS
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="max-w-md text-gray-400 font-light text-lg tracking-wide"
          >
            Advanced AI Gatekeeper for High-Volume Business.
            <br />
            <span className="text-signal-cyan">You don't miss calls. You filter them.</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="pointer-events-auto pt-8"
          >
            <div className="h-16 w-[1px] bg-gradient-to-b from-signal-cyan to-transparent mx-auto" />
          </motion.div>
        </div>
      </div>
    </main>
  );
}
