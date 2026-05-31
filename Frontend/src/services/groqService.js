// Frontend/src/services/groqService.js

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

const MEDI_SYSTEM_PROMPT = `You are Medi, an AI medical symptom checker assistant built into MediHelp.
Your role is to analyze symptoms described by users and provide helpful, clear health information.

RESPONSE FORMAT: Always respond with a valid JSON object only — no markdown, no backticks, no preamble.
Use this exact structure:
{
  "category": "short category name (e.g., Respiratory, Allergies, Digestive, Neurological, Cardiovascular, General)",
  "aiResponse": "Detailed analysis in 2-3 paragraphs. Use bullet points (•) for listing symptoms. Separate paragraphs with double newlines (\\n\\n). Be thorough but not alarming.",
  "recommendations": [
    "Actionable recommendation 1",
    "Actionable recommendation 2",
    "Actionable recommendation 3"
  ],
  "articles": [
    { "title": "Relevant article title", "source": "MediHelp Library", "readTime": "5 min read" },
    { "title": "Relevant article title 2", "source": "Healthline", "readTime": "10 min read" }
  ]
}

FORMATTING RULES FOR aiResponse:
- Use double newlines (\\n\\n) between paragraphs
- Use single newline (\\n) before bullet points
- Start each bullet point with the • character followed by a space
- Example format:
  "The flu is a contagious respiratory illness caused by influenza viruses.\\n\\nCommon signs and symptoms include:\\n• Fever, chills, and body aches\\n• Cough, sore throat, and runny or stuffy nose\\n• Headache, fatigue, and diarrhea or nausea\\n\\nThe flu spreads through respiratory droplets when an infected person coughs, sneezes, or talks."

STRICT RULES:
- NEVER provide a definitive diagnosis. Use language like "may indicate", "could be related to", "common signs of"
- ALWAYS recommend consulting a licensed medical professional for serious or persistent symptoms
- Keep aiResponse informative, empathetic, and educational — never alarmist
- Provide exactly 3 recommendations (concise, actionable)
- Provide exactly 2 articles with accurate, descriptive titles matching real health topics
- Do NOT include URLs in articles — only title, source, and readTime
- If the input is not health-related, set category to "Off-Topic" and politely redirect the user to describe their symptoms
- If symptoms sound like a medical emergency (chest pain, difficulty breathing, loss of consciousness), set category to "Emergency" and strongly urge immediate medical attention
- Respond ONLY with the JSON object. No extra text before or after.`;

export const groqService = {
    analyzeSymptoms: async (userQuery, conversationHistory = []) => {
        if (!GROQ_API_KEY) {
            throw new Error(
                "Groq API key is missing. Please add VITE_GROQ_API_KEY to your .env file."
            );
        }

        const recentHistory = conversationHistory
            .filter(msg => msg.type === 'user' || msg.type === 'bot')
            .slice(-6)
            .map(msg => ({
                role: msg.type === 'user' ? 'user' : 'assistant',
                content: msg.type === 'user'
                    ? (msg.text || '')
                    : (msg.aiResponse || msg.text || '')
            }))
            .filter(msg => msg.content.trim().length > 0);

        const response = await fetch(GROQ_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                max_tokens: 1024,
                temperature: 0.6,
                messages: [
                    { role: "system", content: MEDI_SYSTEM_PROMPT },
                    ...recentHistory,
                    { role: "user", content: userQuery }
                ]
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const message = errorData?.error?.message || `Groq API error: ${response.status}`;
            throw new Error(message);
        }

        const data = await response.json();
        const rawText = data.choices?.[0]?.message?.content?.trim() || "";

        try {
            const cleaned = rawText.replace(/^```(?:json)?|```$/gm, "").trim();
            const parsed = JSON.parse(cleaned);

            return {
                category: parsed.category || "General",
                aiResponse: parsed.aiResponse || "I wasn't able to fully analyze those symptoms. Could you describe them in more detail?",
                recommendations: Array.isArray(parsed.recommendations) && parsed.recommendations.length > 0
                    ? parsed.recommendations
                    : ["Consult a licensed medical professional for a proper evaluation."],
                articles: Array.isArray(parsed.articles) ? parsed.articles.map(a => ({
                    title: a.title || "Health Article",
                    source: a.source || "MediHelp Library",
                    readTime: a.readTime || "5 min read"
                })) : []
            };

        } catch {
            console.warn("Groq returned non-JSON response, using fallback structure.");
            return {
                category: "General",
                aiResponse: rawText || "I'm having trouble processing that. Please try rephrasing your symptoms.",
                recommendations: [
                    "Try describing your symptoms in more detail.",
                    "Consult a licensed medical professional for proper diagnosis.",
                    "If symptoms are severe, seek emergency care immediately."
                ],
                articles: []
            };
        }
    }
};