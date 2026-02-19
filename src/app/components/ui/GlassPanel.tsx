'use client';

import React from 'react';

/**
 * GlassPanel Component (HTML/CSS)
 * Glassmorphism panel for HUD overlays with backdrop blur
 */
interface GlassPanelProps {
    children: React.ReactNode;
    className?: string;
    variant?: 'default' | 'dark' | 'accent';
    blur?: 'sm' | 'md' | 'lg' | 'xl';
}

export function GlassPanel({
    children,
    className = '',
    variant = 'default',
    blur = 'lg'
}: GlassPanelProps) {
    const blurMap = {
        sm: 'backdrop-blur-sm',
        md: 'backdrop-blur-md',
        lg: 'backdrop-blur-lg',
        xl: 'backdrop-blur-xl'
    };

    const variantStyles = {
        default: 'bg-white/5 border-white/10',
        dark: 'bg-black/40 border-white/5',
        accent: 'bg-white/10 border-white/20'
    };

    return (
        <div className={`
            ${blurMap[blur]}
            ${variantStyles[variant]}
            border rounded-xl
            shadow-[0_8px_32px_rgba(0,0,0,0.3)]
            ${className}
        `}>
            {children}
        </div>
    );
}

/**
 * StatDisplay Component
 * Large typography for key metrics (Latency, GPU, etc.)
 */
interface StatDisplayProps {
    label: string;
    value: string | number;
    unit?: string;
    status?: 'ok' | 'warning' | 'error';
}

export function StatDisplay({ label, value, unit, status = 'ok' }: StatDisplayProps) {
    const statusColors = {
        ok: 'text-emerald-400',
        warning: 'text-amber-400',
        error: 'text-red-500'
    };

    return (
        <div className="space-y-1">
            <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">
                {label}
            </div>
            <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-white font-mono tracking-tight">
                    {value}
                </span>
                {unit && (
                    <span className="text-sm text-gray-400">{unit}</span>
                )}
                <span className={`text-xs ml-1 ${statusColors[status]}`}>●</span>
            </div>
        </div>
    );
}

/**
 * ValidationPanel Component
 * Glassmorphism panel for DuckDB validation displays
 */
interface ValidationPanelProps {
    title: string;
    items: Array<{ label: string; value: string; valid: boolean }>;
    className?: string;
}

export function ValidationPanel({ title, items, className = '' }: ValidationPanelProps) {
    return (
        <GlassPanel variant="dark" className={`p-4 ${className}`}>
            <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-[10px] text-blue-400 uppercase font-bold tracking-widest">
                    {title}
                </span>
            </div>
            <div className="space-y-2 font-mono text-xs">
                {items.map((item, i) => (
                    <div key={i} className="flex justify-between items-center">
                        <span className="text-gray-500">{item.label}</span>
                        <span className={item.valid ? 'text-emerald-400' : 'text-red-400'}>
                            {item.value} {item.valid ? '✓' : '✗'}
                        </span>
                    </div>
                ))}
            </div>
        </GlassPanel>
    );
}

/**
 * HUDOverlay Component
 * Full HUD overlay with glassmorphism panels
 */
interface HUDOverlayProps {
    stats?: { latency: number; gpu: number; safety: 'online' | 'error' };
    validation?: Array<{ label: string; value: string; valid: boolean }>;
}

export function HUDOverlay({
    stats = { latency: 136, gpu: 12, safety: 'online' },
    validation = []
}: HUDOverlayProps) {
    return (
        <div className="absolute inset-0 pointer-events-none p-8 font-sans">
            {/* Top Left - System Status */}
            <div className="absolute top-8 left-8 space-y-4">
                <GlassPanel variant="dark" className="p-5 min-w-[240px]">
                    <div className="flex items-center gap-3 mb-4">
                        <div className={`w-3 h-3 rounded-full ${stats.safety === 'online'
                                ? 'bg-emerald-400 shadow-[0_0_10px_#34d399]'
                                : 'bg-red-500 shadow-[0_0_10px_#ef4444] animate-pulse'
                            }`} />
                        <span className="text-xs text-white font-bold uppercase tracking-wider">
                            Safe Layer {stats.safety === 'online' ? 'Active' : 'Alert'}
                        </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <StatDisplay
                            label="Latency"
                            value={stats.latency}
                            unit="ms"
                            status={stats.latency < 200 ? 'ok' : 'warning'}
                        />
                        <StatDisplay
                            label="GPU Load"
                            value={stats.gpu}
                            unit="%"
                            status={stats.gpu < 80 ? 'ok' : 'warning'}
                        />
                    </div>
                </GlassPanel>
            </div>

            {/* Bottom Right - Validation */}
            {validation.length > 0 && (
                <div className="absolute bottom-8 right-8">
                    <ValidationPanel
                        title="DuckDB Validation"
                        items={validation}
                        className="min-w-[200px]"
                    />
                </div>
            )}

            {/* Vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.7)_100%)]" />
        </div>
    );
}
