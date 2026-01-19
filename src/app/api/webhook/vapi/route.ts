import { NextRequest, NextResponse } from 'next/server';
import { appendToSheet } from '@/lib/googleClient';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // Verify it's an end-of-call report or relevant event
        // Vapi sends various events, we generally care about 'end-of-call-report' for logging final details
        // but the user just said "receives webhook... and appends row".
        // We'll log all for now, or filter if 'message.type' is present.

        const messageType = body.message?.type;
        const callData = body.message?.call;
        const analysis = body.message?.analysis;
        const transcript = body.message?.transcript;
        const recordingUrl = body.message?.recordingUrl || callData?.recordingUrl;

        if (messageType === 'end-of-call-report') {
            const rowData = [
                new Date().toISOString(),         // Timestamp
                callData?.id || 'N/A',            // Call ID
                analysis?.summary || 'N/A',       // Summary
                transcript || 'N/A',              // Transcript
                recordingUrl || 'N/A',            // Recording
                callData?.cost || 0               // Cost
            ];

            const sheetId = process.env.GOOGLE_SHEET_ID;
            if (!sheetId) {
                console.error("GOOGLE_SHEET_ID is not defined in environment variables.");
                return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
            }

            // Appending to 'Sheet1' - User must ensure this sheet exists or update the range
            await appendToSheet(sheetId, 'Sheet1!A:F', [rowData]);

            return NextResponse.json({ success: true, message: 'Row added' });
        }

        return NextResponse.json({ message: 'Ignored message type' }, { status: 200 });

    } catch (error) {
        console.error('Error processing Vapi webhook:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
