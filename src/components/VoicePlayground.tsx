'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Terminal, CheckCircle2 } from 'lucide-react';
import clsx from 'clsx';

const MOCK_INTENTS = [
    "Order_Pizza_Margherita (98%)",
    "Book_Flight_NYC (97%)",
    "Support_Reset_Password (99%)",
    "Schedule_Meeting_Team (96%)",
    "Play_Music_Jazz (95%)"
];

interface PlaygroundProps {
    active: boolean;
    onToggle: () => void;
}

export default function VoicePlayground({ active, onToggle }: PlaygroundProps) {
    const [logs, setLogs] = useState<{ timestamp: string, message: string }[]>([]);

    useEffect(() => {
        let processTimeout: NodeJS.Timeout;
        let matchTimeout: NodeJS.Timeout;

        if (active) {
            setLogs(prev => [{ timestamp: new Date().toLocaleTimeString(), message: "Microphone active. Listening..." }, ...prev].slice(0, 6));

            // Artificial delay to simulate speaking time
            processTimeout = setTimeout(() => {
                setLogs(prev => [{ timestamp: new Date().toLocaleTimeString(), message: "Stream end. Processing intent..." }, ...prev].slice(0, 6));

                // Fast intent match simulation
                matchTimeout = setTimeout(() => {
                    const intent = MOCK_INTENTS[Math.floor(Math.random() * MOCK_INTENTS.length)];
                    setLogs(prev => [{ timestamp: new Date().toLocaleTimeString(), message: `Matched: ${intent} [Latency: 8ms]` }, ...prev].slice(0, 6));
                }, 400);
            }, 2000);
        }

        return () => {
            clearTimeout(processTimeout);
            clearTimeout(matchTimeout);
        };
    }, [active]);

    return (
        <div className="mt-20 w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center px-4 relative z-20 pb-20">
            {/* Control Side */}
            <div className="flex flex-col items-center justify-center space-y-8">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onToggle}
                    className={clsx(
                        "w-40 h-40 rounded-full flex items-center justify-center transition-all duration-300 relative cursor-pointer",
                        active ? "shadow-[0_0_60px_rgba(0,240,255,0.5)]" : "shadow-2xl shadow-cyan-900/10"
                    )}
                    style={{
                        background: 'radial-gradient(circle at 30% 30%, #ffffff, #dbeafe)',
                        boxShadow: active
                            ? 'inset -10px -10px 20px rgba(0,0,0,0.1), 0 0 40px rgba(0,240,255,0.4)'
                            : 'inset -10px -10px 20px rgba(0,0,0,0.15), 0 20px 40px rgba(0,0,0,0.3)'
                    }}
                >
                    <Mic className={clsx("w-12 h-12 transition-colors duration-300", active ? "text-neon-teal drop-shadow-[0_0_5px_rgba(0,240,255,0.8)]" : "text-gray-400")} />

                    {/* Ring animation when active */}
                    {active && (
                        <>
                            <div className="absolute inset-0 rounded-full animate-ping bg-white/40" style={{ animationDuration: '2s' }} />
                            <div className="absolute -inset-4 rounded-full border border-neon-teal/30 animate-pulse" />
                        </>
                    )}
                </motion.button>

                <div className="text-center space-y-2">
                    <h3 className="text-white font-medium text-2xl tracking-tight">
                        {active ? "Listening..." : "Push to Simulate"}
                    </h3>
                    <p className="text-gray-400 text-sm max-w-xs mx-auto">
                        Experience the Carbon Engine latency. Click the pearl to start a voice session.
                    </p>
                </div>

                {/* Visualizer */}
                <div className="h-12 flex items-end justify-center gap-1">
                    {active ? (
                        Array.from({ length: 16 }).map((_, i) => (
                            <motion.div
                                key={i}
                                className="w-1.5 bg-gradient-to-t from-neon-teal to-white rounded-full"
                                animate={{ height: [10, Math.random() * 40 + 10, 10] }}
                                transition={{ repeat: Infinity, duration: 0.4, delay: i * 0.05 }}
                            />
                        ))
                    ) : (
                        <div className="h-0.5 w-32 bg-gray-700 rounded-full" />
                    )}
                </div>
            </div>

            {/* Logs Side */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-premium rounded-xl p-0 overflow-hidden h-80 flex flex-col font-mono text-xs border border-white/10"
            >
                <div className="bg-black/60 p-4 border-b border-white/5 flex justify-between items-center backdrop-blur-md">
                    <span className="flex items-center gap-2 text-gray-300 font-bold tracking-wider text-[10px] uppercase">
                        <Terminal className="w-3 h-3 text-neon-teal" /> SYSTEM_LOGS :: MOCK_ENV
                    </span>
                    <div className="flex gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500/50" />
                        <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                        <div className="w-2 h-2 rounded-full bg-green-500/50" />
                    </div>
                </div>
                <div className="p-5 flex-1 overflow-hidden relative bg-black/20">
                    <div className="flex flex-col gap-3">
                        <AnimatePresence initial={false}>
                            {logs.map((log, i) => (
                                <motion.div
                                    key={log.timestamp + i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex gap-3 text-gray-300 items-start"
                                >
                                    <span className="text-gray-600 shrink-0">[{log.timestamp}]</span>
                                    <span className={clsx(
                                        "break-all",
                                        log.message.startsWith("Matched") ? "text-neon-teal font-bold" : "text-gray-300"
                                    )}>
                                        {log.message.startsWith("Matched") && <CheckCircle2 className="w-3 h-3 inline mr-2" />}
                                        {log.message}
                                    </span>
                                </motion.div>
                            ))}
                            {logs.length === 0 && (
                                <div className="text-gray-600 italic mt-20 text-center">system_idle: waiting_for_input...</div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
