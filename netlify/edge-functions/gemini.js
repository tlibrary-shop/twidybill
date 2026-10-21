export default async (request, context) => {
    // Hanya izinkan POST request
    if (request.method !== 'POST') {
        return new Response('Method Not Allowed', { status: 405 });
    }

    // Ambil API Key dari ENV Netlify
    const API_KEY = Netlify.env.get("GEMINI_API_KEY");
    const body = await request.text();

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: body
        });

        const data = await response.json();
        return new Response(JSON.stringify(data), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.toString() }), { status: 500 });
    }
};

// Config ini berfungsi mencegat URL lama supaya lu nggak perlu ngedit file index.html lagi
export const config = { path: "/.netlify/functions/gemini" };
