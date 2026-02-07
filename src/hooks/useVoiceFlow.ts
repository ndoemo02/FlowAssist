'use client';

import { useState, useCallback } from 'react';

export type VoiceState = 'IDLE' | 'LISTENING' | 'PROCESSING' | 'SPEAKING' | 'ERROR';

export function useVoiceFlow() {
    const [state, setState] = useState<VoiceState>('IDLE');
    const [transcript, setTranscript] = useState('');

    const startListening = useCallback(() => {
        setState('LISTENING');
        console.log('VoiceFlow: Audio capture started');
        // Future: Integration with Web Speech API or OpenAI Realtime
    }, []);

    const stopListening = useCallback(() => {
        setState('PROCESSING');
        console.log('VoiceFlow: Analyzing intent...');
        // Mock processing
        setTimeout(() => {
            setState('IDLE');
        }, 1500);
    }, []);

    return {
        state,
        transcript,
        startListening,
        stopListening
    };
}
