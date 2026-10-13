exports.handler = async function(event, context) {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }
    
    // Tunachukua link ya website yako (Mfano: https://yako.netlify.app)
    const hostUrl = "https://" + event.headers.host;

    try {
        const ablinerUrl = "https://abliner.net/api/v1/checkout";
        const response = await fetch(ablinerUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // Hii API key itatoka Netlify baadae, isiandike hapa!
                "Authorization": `Bearer ${process.env.ABLINER_API_KEY}`
            },
            body: JSON.stringify({
                amount: 4000, // Hapa ndio tumeweka Tsh 4,000
                currency: "TZS",
                redirect_url: `${hostUrl}/success.html`, 
                callback_url: `${hostUrl}/.netlify/functions/webhook`, 
                reference: "ORDER_" + Date.now() // Inatengeneza namba ya kipekee ya oda
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Abliner Error:", data);
            return { statusCode: response.status, body: JSON.stringify(data) };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ checkout_url: data.checkout_url })
        };
    } catch (error) {
        console.error("Server Error:", error);
        return { statusCode: 500, body: JSON.stringify({ error: "Hitilafu kwenye server" }) };
    }
}
