exports.handler = async function(event, context) {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        const payload = JSON.parse(event.body);
        const secret = process.env.ABLINER_WEBHOOK_SECRET;

        // Angalia kama kweli malipo yamefanikiwa
        if (payload.event === "checkout.paid") {
            console.log("MALIPO YAMEFANIKIWA!");
            console.log("Kiasi:", payload.data.amount);
            console.log("Reference:", payload.data.reference);
            // Hapa baadae unaweza kuongeza code za kutuma email au kufungua huduma kwenye app yako
        }

        // Tunairudishia Abliner majibu ili ijue tumepokea taarifa
        return { 
            statusCode: 200, 
            body: JSON.stringify({ message: "Webhook imepokelewa kikamilifu" }) 
        };
    } catch (error) {
        console.error("Webhook Error:", error);
        return { statusCode: 400, body: "Webhook error" };
    }
}
