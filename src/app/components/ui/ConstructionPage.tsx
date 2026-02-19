'use client';

import React from 'react';
import Link from 'next/link';

interface ConstructionPageProps {
    title: string;
    description: string;
}

export default function ConstructionPage({ title, description }: ConstructionPageProps) {
    return (
        <main className="min-h-screen w-full bg-[#020617] text-white flex flex-col items-center justify-center relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#020617] to-[#020617] pointer-events-none" />
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-50" />
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent opacity-50" />

            <div className="relative z-10 flex flex-col items-center text-center p-8 max-w-2xl">
                {/* Animated Icon/Graphic placeholder */}
                <div className="w-24 h-24 mb-8 relative">
                    <div className="absolute inset-0 border-2 border-cyan-500/30 rounded-full animate-ping opacity-20" />
                    <div className="absolute inset-2 border border-purple-500/50 rounded-full animate-spin-slow" />
                    <div className="absolute inset-0 flex items-center justify-center text-3xl">
                        ✨
                    </div>
                </div>

                <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 mb-6 tracking-tight">
                    {title}
                </h1>

                <p className="text-lg text-blue-200/60 mb-10 leading-relaxed">
                    {description}
                </p>

                <div className="flex gap-4">
                    <Link
                        href="/"
                        className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-sm font-medium transition-all hover:scale-105 backdrop-blur-md"
                    >
                        Return Home
                    </Link>
                    <button
                        disabled
                        className="px-8 py-3 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-full text-sm font-medium cursor-not-allowed opacity-50"
                    >
                        Notify Me
                    </button>
                </div>
            </div>
        </main>
    );
}
