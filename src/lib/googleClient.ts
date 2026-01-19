import { google } from 'googleapis';

const SCOPES = [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/calendar',
];

let authInstance: InstanceType<typeof google.auth.GoogleAuth> | null = null;

const getAuth = () => {
    if (authInstance) return authInstance;

    if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
        throw new Error('Missing Google credentials in environment variables');
    }

    authInstance = new google.auth.GoogleAuth({
        credentials: {
            client_email: process.env.GOOGLE_CLIENT_EMAIL,
            private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        },
        scopes: SCOPES,
    });

    return authInstance;
};

export const getSheetsClient = async () => {
    const auth = getAuth();
    const client = await auth.getClient();
    return google.sheets({ version: 'v4', auth: client as any });
};

export const getCalendarClient = async () => {
    const auth = getAuth();
    const client = await auth.getClient();
    return google.calendar({ version: 'v3', auth: client as any });
};

export const appendToSheet = async (spreadsheetId: string, range: string, values: string[][]) => {
    const sheets = await getSheetsClient();
    try {
        const response = await sheets.spreadsheets.values.append({
            spreadsheetId,
            range,
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error appending safely to sheet:', error);
        throw error;
    }
};
