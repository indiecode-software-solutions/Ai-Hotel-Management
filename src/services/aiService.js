const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const OPENROUTER_MODEL = import.meta.env.VITE_OPENROUTER_MODEL;

export const generateAiResponse = async (userPrompt, context = "") => {
  const models = [
    OPENROUTER_MODEL, // currently openai/gpt-oss-120b:free via .env
    "openai/gpt-oss-20b:free",
    "openrouter/free", // This is OpenRouter's guaranteed auto-fallback endpoint
    "google/gemma-4-26b-a4b-it:free"
  ];

  for (const model of models) {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:5173",
          "X-Title": "Oasis Hotel Management",
        },
        body: JSON.stringify({
          model: model,
          messages: [
            {
              role: "system",
              content: `You are the AI Concierge for Oasis Hotel. Be professional and concise. 
              Rooms: Royal Horizon ($540), Celestial Penthouse ($890), Azure Garden ($420).
              Context: ${context}`
            },
            {
              role: "user",
              content: userPrompt
            }
          ],
        })
      });

      if (!response.ok) {
        console.warn(`Model ${model} failed with status ${response.status}, trying next...`);
        continue; // Try next model
      }

      const data = await response.json();
      
      if (data.choices && data.choices.length > 0) {
        return data.choices[0].message.content;
      }
    } catch (error) {
      console.error(`Error with model ${model}:`, error);
    }
  }

  return "The Oasis network is currently experiencing high demand. Our staff has been notified and will assist you shortly.";
};
