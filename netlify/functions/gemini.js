exports.handler = async function(event, context) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const API_KEY = process.env.GEMINI_API_KEY;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: event.body
        });

        const data = await response.json();
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
