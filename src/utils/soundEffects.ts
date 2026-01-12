// Web Audio API helper for synthetic futuristic sound effects
// No external assets required

let audioCtx: AudioContext | null = null;

const getCtx = () => {
    if (!audioCtx && typeof window !== 'undefined') {
        audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioCtx;
};

const playTone = (freq: number, type: OscillatorType, duration: number, vol = 0.1, delay = 0) => {
    const ctx = getCtx();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);

    gain.gain.setValueAtTime(vol, ctx.currentTime + delay);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + delay + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime + delay);
    osc.stop(ctx.currentTime + delay + duration);
};

export const sfx = {
    // Krótkie kliknięcie interfejsu (high-tech beep)
    click: () => playTone(1500, 'sine', 0.05, 0.1),

    // Aktywacja mikrofonu (dwudźwięk w górę)
    micOn: () => {
        playTone(600, 'sine', 0.1, 0.1);
        playTone(1200, 'sine', 0.2, 0.1, 0.1);
    },

    // Dezaktywacja mikrofonu (dwudźwięk w dół)
    micOff: () => {
        playTone(1200, 'sine', 0.1, 0.1);
        playTone(600, 'sine', 0.2, 0.1, 0.1);
    },

    // Potwierdzenie rozkazu (pozytywny trójdźwięk)
    success: () => {
        playTone(880, 'triangle', 0.1, 0.1); // A5
        playTone(1108, 'triangle', 0.1, 0.1, 0.1); // C#6
        playTone(1318, 'triangle', 0.3, 0.1, 0.2); // E6
    },

    // Błąd (niski, szorstki dźwięk)
    error: () => {
        playTone(150, 'sawtooth', 0.4, 0.15);
    },

    // Rozpoczęcie ruchu (efekt "turbiny")
    move: () => {
        const ctx = getCtx();
        if (!ctx) return;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.frequency.setValueAtTime(100, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1000, ctx.currentTime + 1.5); // Rozpędzanie

        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.2);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.5);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 1.5);
    }
};
