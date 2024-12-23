import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config(); // Cargar variables de entorno

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed. Use POST." });
    }

    const { userMessage } = req.body;

    try {
        const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: "Eres un asistente útil especializado en educación." },
                    { role: "user", content: userMessage },
                ],
                max_tokens: 100,
                temperature: 0.7,
            }),
        });

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        console.error("Error al conectarse con OpenAI:", error);
        res.status(500).json({ error: "Hubo un error al procesar tu consulta." });
    }
}
