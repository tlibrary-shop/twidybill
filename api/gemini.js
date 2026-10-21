// Aktifkan Edge Runtime (Proxy mode super cepat)
export const runtime = 'edge';

export default async function handler(req) {
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ message: 'Method Not Allowed' }), { status: 405 });
    }

    const API_KEY = process.env.GEMINI_API_KEY;
    // Di Edge runtime, req dibaca sebagai stream text mentah
    const body = await req.text(); 

    try {
        // Tetap pakai Gemini 3.1 Flash Lite!
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: body
        });

        if (!response.ok) {
            throw new Error(`Google API Error: ${response.status}`);
        }

        const data = await response.json();
        return new Response(JSON.stringify(data), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.toString() }), { status: 500 });
    }
}
