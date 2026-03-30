const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async (event) => {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        
        // This is the specific model name the v1beta endpoint is looking for
        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.5-flash", 
            systemInstruction: "You are the AI assistant for Wali, a Full Stack Web Developer and CS student at University of Gujrat. Answer questions about his skills (React, Node.js, Next.js), and experience (Horizon Preps, Aufis.pk). Keep answers friendly and under 80 words."
        });

        const { prompt } = JSON.parse(event.body);
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text })
        };

    } catch (error) {
        console.error("Netlify Function Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Server error. Check Netlify logs." })
        };
    }
};