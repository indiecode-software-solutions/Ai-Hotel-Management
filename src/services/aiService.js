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
          "X-Title": "Raj Heritage Hospitality",
        },
        body: JSON.stringify({
          model: model,
          messages: [
            {
              role: "system",
              content: `You are the AI Revenue Management Agent for Raj Heritage Hospitality. 
              Be data-driven, professional, and concise. 
              Focus on luxury heritage properties in India. 
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

  return "The Raj Heritage network is currently experiencing high demand. Our staff has been notified and will assist you shortly.";
};

export const generateWelcomeMessage = async (booking) => {
  const prompt = `Generate a personalized, luxury pre-trip welcome message for a guest staying at ${booking.rooms?.title || 'our heritage property'}. 
  Details:
  - Check-in: ${booking.check_in_date}
  - Room Type: ${booking.rooms?.type}
  - Vibe: ${booking.rooms?.vibe}
  The message should be elegant, welcoming, and highlight one specific amenity or feature of the property. Keep it under 100 words.`;

  return await generateAiResponse(prompt, "Guest Welcome System");
};

export const analyzePricing = async (occupancyData, marketTrends) => {
  const prompt = `Analyze the following hotel data and provide pricing suggestions:
  
  CURRENT OCCUPANCY:
  ${JSON.stringify(occupancyData, null, 2)}
  
  SIMULATED MARKET TRENDS:
  ${JSON.stringify(marketTrends, null, 2)}
  
  Please provide:
  1. A brief executive summary (2 sentences).
  2. Recommended price adjustments for each room type in percentage (e.g. +15% or -10%).
  3. A "Revenue Maximization" tip for the next 30 days.
  
  Format the response as a JSON-parsable object with keys: "summary", "adjustments" (array of {roomType, adjustment}), "tip".`;

  const response = await generateAiResponse(prompt, "Pricing Analysis Engine");
  
  try {
    // Attempt to extract JSON from the response if the model didn't return pure JSON
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    return jsonMatch ? JSON.parse(jsonMatch[0]) : { summary: response, adjustments: [], tip: "" };
  } catch (e) {
    return { summary: response, adjustments: [], tip: "" };
  }
};
