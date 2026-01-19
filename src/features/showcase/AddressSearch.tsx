'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Navigation } from 'lucide-react';
import { searchAddresses, isValidAddress } from '@/utils/flyToAddress';
import { useShowcaseStore } from './store';

interface AddressSearchProps {
    onAddressSelect: (address: string) => void;
    placeholder?: string;
    className?: string;
}

export default function AddressSearch({
    onAddressSelect,
    placeholder = 'Wpisz rozkaz (np. Biznesowa B-132)...',
    className = ''
}: AddressSearchProps) {

    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [shake, setShake] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const addressMapping = useShowcaseStore((state) => state.addressMapping);


    useEffect(() => {
        if (query.length > 0) {
            const results = searchAddresses(query, 8, addressMapping);
            setSuggestions(results);
            setShowSuggestions(results.length > 0);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
        setSelectedIndex(-1);
    }, [query, addressMapping]);

    const handleSubmit = (address?: string) => {
        const targetAddress = address || query;

        if (!targetAddress.trim()) return;

        if (isValidAddress(targetAddress, addressMapping)) {
            onAddressSelect(targetAddress);
            setQuery('');
            setSuggestions([]);
            setShowSuggestions(false);
            inputRef.current?.blur();
        } else {
            // Animacja shake dla błędnego adresu
            setShake(true);
            setTimeout(() => setShake(false), 500);
            console.warn('❌ Nieprawidłowy adres:', targetAddress);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (selectedIndex >= 0 && suggestions[selectedIndex]) {
                handleSubmit(suggestions[selectedIndex]);
            } else {
                handleSubmit();
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev =>
                prev < suggestions.length - 1 ? prev + 1 : prev
            );
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        } else if (e.key === 'Escape') {
            setShowSuggestions(false);
            inputRef.current?.blur();
        }
    };

    return (
        <div className={`relative ${className} bg-slate-900/95 backdrop-blur-md p-4 rounded-xl border-2 border-cyan-500/70 shadow-2xl`}>
            <motion.div
                animate={shake ? {
                    x: [0, -10, 10, -10, 10, 0],
                    transition: { duration: 0.5 }
                } : {}}
                className="relative"
            >
                <div className="relative flex items-center">
                    <Search className="absolute left-4 text-cyan-400" size={20} />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onFocus={() => query && setShowSuggestions(suggestions.length > 0)}
                        placeholder={placeholder}
                        className={`
              w-full pl-12 pr-24 py-3 
              bg-slate-950/95 backdrop-blur-md
              border-2 transition-all duration-200
              ${shake
                                ? 'border-red-500 animate-pulse'
                                : 'border-cyan-400/50 focus:border-cyan-400'
                            }
              rounded-lg
              text-white placeholder-slate-400
              font-mono text-base
              focus:outline-none focus:ring-2 focus:ring-cyan-400/50
              shadow-2xl hover:shadow-cyan-400/30
            `}
                    />
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleSubmit()}
                        className="absolute right-2 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded font-mono text-xs transition-colors flex items-center gap-1"
                    >
                        <Navigation size={14} />
                        <span className="hidden sm:inline">Leć</span>
                    </motion.button>
                </div>

                {shake && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="absolute top-full left-0 mt-2 px-3 py-1 bg-red-500/90 text-white text-xs font-mono rounded backdrop-blur-sm"
                    >
                        ❌ Adres nie istnieje w bazie
                    </motion.div>
                )}
            </motion.div>

            {/* Autocomplete Suggestions */}
            <AnimatePresence>
                {showSuggestions && suggestions.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 right-0 mt-2 max-h-64 overflow-y-auto bg-slate-900/95 backdrop-blur-md border border-cyan-500/30 rounded-lg shadow-2xl z-50"
                    >
                        {suggestions.map((address, index) => (
                            <motion.button
                                key={address}
                                onClick={() => handleSubmit(address)}
                                onMouseEnter={() => setSelectedIndex(index)}
                                whileHover={{ x: 4 }}
                                className={`
                  w-full px-4 py-3 text-left
                  transition-colors duration-150
                  flex items-center gap-3
                  border-b border-slate-800/50 last:border-b-0
                  ${selectedIndex === index
                                        ? 'bg-cyan-500/20 text-cyan-300'
                                        : 'text-slate-300 hover:bg-cyan-500/10'
                                    }
                `}
                            >
                                <MapPin size={16} className="text-cyan-400 flex-shrink-0" />
                                <div className="flex-1">
                                    <div className="font-mono text-sm">{address}</div>
                                </div>
                                {selectedIndex === index && (
                                    <Navigation size={14} className="text-cyan-400 animate-pulse" />
                                )}
                            </motion.button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Keyboard Shortcuts Hint */}
            {showSuggestions && (
                <div className="absolute top-full left-0 right-0 mt-1 px-3 py-1 text-[10px] text-slate-500 font-mono text-right pointer-events-none">
                    ↑↓ Nawiguj • Enter Wybierz • Esc Zamknij
                </div>
            )}
        </div>
    );
}
