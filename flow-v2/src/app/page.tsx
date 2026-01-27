'use client';

import { Suspense, useState } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

// Dynamically import 3D Scene to avoid SSR issues with Canvas
const HeroScene = dynamic(() => import('@/features/hero-3d/components/HeroScene'), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-void" />
});

export default function Home() {
  // Mobile Camera Calibration State
  const [camConfig, setCamConfig] = useState({
    x: 0,
    z: 10.0,
    y: 0.5,
    targetY: 0.5,
    fov: 60
  });

  const [showDev, setShowDev] = useState(true);

  return (
    <main className="relative w-full h-screen overflow-hidden bg-void">

      {/* DEV PANEL (ALWAYS VISIBLE) */}
      {showDev && (
        <div className="fixed bottom-0 left-0 w-full z-50 bg-black/90 p-4 border-t border-green-500 text-green-400 font-mono text-xs">
          <div className="flex justify-between mb-2">
            <h3 className="font-bold">MOBILE CALIBRATION V3 (POS X)</h3>
            <button onClick={() => setShowDev(false)} className="text-red-500">[CLOSE]</button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400">Pos X: {camConfig.x.toFixed(1)}</label>
              <input type="range" min="-10" max="10" step="0.5" value={camConfig.x}
                onChange={e => setCamConfig(c => ({ ...c, x: parseFloat(e.target.value) }))} className="w-full accent-green-500" />
            </div>
            <div>
              <label className="block text-gray-400">Dist (Z): {camConfig.z.toFixed(1)}</label>
              <input type="range" min="2" max="30" step="0.5" value={camConfig.z}
                onChange={e => setCamConfig(c => ({ ...c, z: parseFloat(e.target.value) }))} className="w-full accent-green-500" />
            </div>
            <div>
              <label className="block text-gray-400">Height (Y): {camConfig.y.toFixed(1)}</label>
              <input type="range" min="-2" max="5" step="0.1" value={camConfig.y}
                onChange={e => setCamConfig(c => ({ ...c, y: parseFloat(e.target.value) }))} className="w-full accent-green-500" />
            </div>
            <div>
              <label className="block text-gray-400">LookAt Y: {camConfig.targetY.toFixed(1)}</label>
              <input type="range" min="-2" max="5" step="0.1" value={camConfig.targetY}
                onChange={e => setCamConfig(c => ({ ...c, targetY: parseFloat(e.target.value) }))} className="w-full accent-green-500" />
            </div>
            <div>
              <label className="block text-gray-400">FOV: {camConfig.fov}</label>
              <input type="range" min="30" max="100" step="1" value={camConfig.fov}
                onChange={e => setCamConfig(c => ({ ...c, fov: parseFloat(e.target.value) }))} className="w-full accent-green-500" />
            </div>
          </div>
          <div className="mt-2 text-[10px] text-gray-500 select-all">
            {`x:${camConfig.x}, z:${camConfig.z}, y:${camConfig.y}, ty:${camConfig.targetY}, fov:${camConfig.fov}`}
          </div>
        </div>
      )}

      {/* LAYER 1: 3D WORLD (Background) */}
      <div className="absolute inset-0 z-0">
        <HeroScene config={camConfig} />
      </div>

      {/* LAYER 2: UI OVERLAY (Foreground) */}
      <div className={`relative z-10 w-full h-full pointer-events-none ${showDev ? 'opacity-50' : 'opacity-100'}`}>
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
