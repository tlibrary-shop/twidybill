exports.handler = async function(event, context) {
    // Hanya izinkan method POST
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    // Ambil API Key dari Environment Variable Netlify
    const API_KEY = process.env.GEMINI_API_KEY;

    try {
        // Teruskan data dari frontend (HTML) langsung ke server Google
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: event.body
        });

        const data = await response.json();
        
        // Kembalikan hasil dari Google ke frontend
        return { 
            statusCode: 200, 
            body: JSON.stringify(data) 
        };
    } catch (error) {
        return { 
            statusCode: 500, 
            body: JSON.stringify({ error: error.toString() }) 
        };
    }
}
