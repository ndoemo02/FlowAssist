'use client';

import { useState } from 'react';

export default function DebugPointerTest() {
    const [clickCount, setClickCount] = useState(0);
    const [inputValue, setInputValue] = useState('');

    return (
        <div className="fixed top-20 right-6 bg-yellow-500/90 p-4 rounded-lg z-[200] pointer-events-auto">
            <div className="text-black font-mono text-xs mb-2">
                🧪 DEBUG POINTER TEST
            </div>
            <button
                onClick={() => setClickCount(prev => prev + 1)}
                className="bg-black text-yellow-500 px-3 py-2 rounded mb-2 w-full"
            >
                Kliknij mnie: {clickCount}
            </button>
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Test input..."
                className="w-full px-2 py-1 rounded text-black"
            />
            <div className="text-black text-[10px] mt-2">
                Wpisano: "{inputValue}"
            </div>
        </div>
    );
}
