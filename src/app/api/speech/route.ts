import { NextResponse } from 'next/server';
import { SpeechClient } from '@google-cloud/speech';

// Inicjalizacja klienta. Biblioteka automatycznie poszuka credentials
// w zmiennej GOOGLE_APPLICATION_CREDENTIALS lub w domyślnej konfiguracji gcloud.
const client = new SpeechClient();

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const audioFile = formData.get('audio') as Blob;

        if (!audioFile) {
            return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
        }

        // Konwersja Bloba na Buffer
        const arrayBuffer = await audioFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Konfiguracja rozpoznawania
        // Uwaga: 'WEBM_OPUS' jest wspierany przez Google Cloud STT i pasuje do domyślnego nagrywania w Chrome.
        const audio = {
            content: buffer.toString('base64'),
        };

        const config = {
            encoding: 'WEBM_OPUS' as const,
            sampleRateHertz: 48000, // Standard dla WebM/Opus, ale API potrafi to wykryć
            languageCode: 'pl-PL',
            enableAutomaticPunctuation: true,
            model: 'default',
        };

        const request = {
            audio: audio,
            config: config,
        };

        // Wywołanie API Google
        const [response] = await client.recognize(request);

        const transcription = response.results
            ?.map(result => result.alternatives?.[0]?.transcript)
            .join('\n');

        if (!transcription) {
            return NextResponse.json({ text: '' });
        }

        return NextResponse.json({ text: transcription });

    } catch (error: any) {
        console.error('Google STT Error:', error);

        // Obsługa błędu autoryzacji
        if (error.message?.includes('creds')) {
            return NextResponse.json({
                error: 'Błąd autoryzacji Google Cloud. Upewnij się, że masz ustawione GOOGLE_APPLICATION_CREDENTIALS lub zrób "gcloud auth application-default login".',
                details: error.message
            }, { status: 500 });
        }

        return NextResponse.json({ error: 'Failed to process audio', details: error.message }, { status: 500 });
    }
}
