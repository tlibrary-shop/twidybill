export const maxDuration = 60; // Timeout maksimal 60 detik di Vercel

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'GEMINI_API_KEY belum dipasang di Vercel Environment Variables!' });
    }

    const payload = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    const maxRetries = 3;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: payload
            });

            const data = await response.json();

            // Jika Google sibuk (503) atau kena rate limit (429), tunggu 1.5 detik lalu coba lagi otomatis
            if ((response.status === 503 || response.status === 429) && attempt < maxRetries) {
                await new Promise(resolve => setTimeout(resolve, 1500));
                continue;
            }

            return res.status(response.status).json(data);
        } catch (error) {
            if (attempt === maxRetries) {
                return res.status(500).json({ error: error.toString() });
            }
            await new Promise(resolve => setTimeout(resolve, 1500));
        }
    }
}
