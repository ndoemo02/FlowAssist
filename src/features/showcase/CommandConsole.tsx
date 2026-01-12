'use client';

import { useState, useEffect, useRef } from 'react';
import { useShowcaseStore } from './store';
import { sfx } from '../../utils/soundEffects';

// Definicja typów dla Web Speech API
interface IWindow extends Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
}

// Prosta 'baza wiedzy' o lokalizacjach
const LOCATIONS: Record<string, [number, number, number]> = {
    'centrum': [0, 50, 0],
    'baza': [400, 50, 400],
    'sektor a': [200, 50, -200],
    'sektor b': [-300, 150, 200],
    'lotnisko': [-500, 100, -500],
    'północy': [0, 100, -800],
    'północ': [0, 100, -800],
};

export default function CommandConsole() {
    const [input, setInput] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const { moveUnit, addLog } = useShowcaseStore();
    const recognitionRef = useRef<any>(null);

    // Inicjalizacja Web Speech API
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const { webkitSpeechRecognition, SpeechRecognition } = window as unknown as IWindow;
            const SpeechRecognitionConstructor = SpeechRecognition || webkitSpeechRecognition;

            if (SpeechRecognitionConstructor) {
                const recognition = new SpeechRecognitionConstructor();
                recognition.continuous = false; // Pojedyncza komenda
                recognition.lang = 'pl-PL';
                recognition.interimResults = false;

                recognition.onstart = () => {
                    setIsListening(true);
                    setIsProcessing(false);
                    sfx.micOn(); // SFX: Mikrofon włączony
                    addLog('Mikrofon aktywny... Czekam na rozkaz.');
                };

                recognition.onresult = (event: any) => {
                    const transcript = event.results[0][0].transcript;
                    setInput(transcript);
                    addLog(`Rozpoznano: "${transcript}"`);
                    executeCommand(transcript);
                };

                recognition.onerror = (event: any) => {
                    console.error('Speech error', event.error);
                    sfx.error(); // SFX: Błąd
                    setIsListening(false);
                    setIsProcessing(false);

                    if (event.error === 'not-allowed') {
                        addLog('BŁĄD: Brak dostępu do mikrofonu.');
                    } else if (event.error === 'no-speech') {
                        addLog('Nie wykryto mowy.');
                    } else {
                        addLog(`Błąd sterowania głosem: ${event.error}`);
                    }
                };

                recognition.onend = () => {
                    setIsListening(false);
                    setIsProcessing(false);
                };

                recognitionRef.current = recognition;
            } else {
                addLog('Twoja przeglądarka nie obsługuje sterowania głosem.');
            }
        }
    }, [addLog]); // Dodano zależność addLog

    const toggleVoice = () => {
        if (!recognitionRef.current) return;

        if (isListening) {
            recognitionRef.current.stop();
            sfx.micOff(); // SFX: Mikrofon wyłączony (ręcznie)
        } else {
            try {
                recognitionRef.current.start();
            } catch (e) {
                console.error(e);
            }
        }
    };

    const executeCommand = (cmdInput: string) => {
        if (!cmdInput.trim()) return;

        const cmd = cmdInput.toLowerCase();
        let targetUnitId = null;
        let targetLocation: [number, number, number] | null = null;
        let locationName = '';

        if (cmd.includes('alfa')) targetUnitId = 'alfa';
        else if (cmd.includes('bravo')) targetUnitId = 'bravo';
        else if (cmd.includes('charlie')) targetUnitId = 'charlie';
        else if (cmd.includes('delta')) targetUnitId = 'delta';

        for (const [name, coords] of Object.entries(LOCATIONS)) {
            if (cmd.includes(name)) {
                targetLocation = coords;
                locationName = name;
                break;
            }
        }

        addLog(`> ${cmdInput}`);

        if (targetUnitId && targetLocation) {
            sfx.success(); // SFX: Rozkaz przyjęty
            moveUnit(targetUnitId, targetLocation);
            setTimeout(() => sfx.move(), 150); // SFX: Dźwięk przesuwania po chwili
            addLog(`Rozkaz: [${targetUnitId.toUpperCase()}] -> [${locationName.toUpperCase()}]`);
        } else if (!targetUnitId && !targetLocation) {
            sfx.error();
            addLog('Nie zrozumiano. Użyj: "Alfa do Centrum"');
        } else if (!targetUnitId) {
            sfx.error();
            addLog('Błąd: Która jednostka? (Alfa, Bravo...)');
        } else if (!targetLocation) {
            sfx.error();
            addLog('Błąd: Gdzie? (Centrum, Baza, Sektor A...)');
        }
    };

    const handleCommand = (e: React.FormEvent) => {
        e.preventDefault();
        sfx.click(); // SFX: Kliknięcie
        executeCommand(input);
        setInput('');
    };

    return (
        <div
            style={{
                position: 'fixed',
                bottom: '30px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 9999999,
                width: '95%',
                maxWidth: '42rem'
            }}
        >
            <form
                onSubmit={handleCommand}
                className={`flex items-center bg-white border-2 md:border-4 p-1 md:p-2 transition-colors rounded-lg shadow-2xl ${isListening ? 'border-red-500 shadow-red-500/50' : 'border-cyan-500 shadow-cyan-500/50'}`}
            >
                <button
                    type="button"
                    onClick={() => {
                        sfx.click();
                        toggleVoice();
                    }}
                    className={`mr-2 p-2 md:p-3 rounded font-bold text-lg md:text-xl transition-all ${isListening ? 'bg-red-600 text-white animate-pulse' : (isProcessing ? 'bg-gray-400' : 'bg-gray-200 text-gray-700 hover:bg-gray-300')}`}
                    title="Naciśnij, aby mówić"
                >
                    {isProcessing ? '⏳' : '🎤'}
                </button>

                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={isListening ? "Mów teraz..." : "Wpisz rozkaz..."}
                    className="flex-1 bg-transparent text-black text-base md:text-lg font-bold font-mono focus:outline-none placeholder-gray-400 min-w-0"
                    readOnly={isListening || isProcessing}
                />

                <button
                    type="submit"
                    className="ml-2 px-3 md:px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded font-mono uppercase tracking-wider transition-colors text-xs md:text-base"
                >
                    Wykonaj
                </button>
            </form>
        </div>
    );
}
