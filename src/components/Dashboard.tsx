'use client';

import { motion } from 'framer-motion';
import { Activity, Server, Zap, AlertTriangle, TrendingUp } from 'lucide-react';
import clsx from 'clsx';
import { useEffect, useState } from 'react';

const stats = [
    { label: 'Total Requests', value: '103,935', trend: '+12.5%', icon: Activity, color: 'text-neon-teal' },
    { label: 'AI Efficiency', value: '96.7%', trend: 'Stable', icon: Zap, color: 'text-purple-400' },
    { label: 'Global Latency', value: '196ms', trend: 'p95', icon: Server, color: 'text-green-400' },
    { label: 'Error Rate', value: '0.8%', trend: '-0.2%', icon: AlertTriangle, color: 'text-neon-orange' },
];

function LiveTrafficBar() {
    const [bars, setBars] = useState<number[]>(Array(40).fill(10));

    useEffect(() => {
        const interval = setInterval(() => {
            setBars(prev => prev.map(() => Math.random() * 80 + 20));
        }, 100);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex items-end justify-between h-16 w-full gap-1 mt-4 px-2">
            {bars.map((height, i) => (
                <motion.div
                    key={i}
                    className="w-1 bg-neon-teal/60 rounded-t-sm"
                    animate={{ height: `${height}%` }}
                    transition={{ type: 'spring', bounce: 0, duration: 0.2 }}
                />
            ))}
        </div>
    );
}

export default function Dashboard() {
    return (
        <div className="w-full max-w-7xl mx-auto mt-16 px-4 z-10 relative">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-6 flex items-center space-x-2 text-sm text-gray-400 tracking-widest uppercase font-mono"
            >
                <Activity className="w-4 h-4 text-neon-teal animate-pulse" />
                <span>Carbon Engine v2.4 // System Online</span>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                        className="glass-premium rounded-xl p-6 flex flex-col justify-between group h-32 relative overflow-hidden"
                    >
                        {/* Carbon texture overlay within card */}
                        <div className="absolute inset-0 opacity-20 bg-carbon pointer-events-none" />

                        <div className="flex justify-between w-full relative z-10">
                            <stat.icon className={clsx("w-5 h-5", "text-white opacity-80")} />
                            <span className={clsx("text-xs font-mono border border-white/10 rounded px-1.5 py-0.5", stat.color)}>{stat.trend}</span>
                        </div>

                        <div className="relative z-10">
                            <div className="text-3xl font-bold tracking-tight text-white group-hover:text-glow transition-all font-sans">{stat.value}</div>
                            <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">{stat.label}</div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="mt-6 glass-premium rounded-xl p-6 relative overflow-hidden"
            >
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm uppercase tracking-widest text-gray-400">Live Traffic Volume</h3>
                    <div className="flex space-x-2">
                        <span className="w-2 h-2 rounded-full bg-neon-teal animate-pulse" />
                        <span className="text-xs text-neon-teal">Real-time</span>
                    </div>
                </div>
                <LiveTrafficBar />
            </motion.div>
        </div>
    );
}
