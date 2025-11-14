import axios from "axios";

const GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

// Model mới nhất nên dùng
const DEFAULT_MODEL = process.env.GEMINI_MODEL || "gemini-2.0-flash";

const MAX_HISTORY = 10;

function normaliseMessages(messages = []) {
  return messages
    .filter((m) => m && typeof m.content === "string")
    .map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }]
    }))
    .slice(-MAX_HISTORY);
}

function buildInstruction(language = "en") {
  const respondLanguage = language === "vi" ? "Vietnamese" : "English";

  return `
You are Game Advisor, an expert video game curator who suggests titles based on player moods, genres, and platforms.
Keep answers concise, structured, and formatted with bullet points when suggesting multiple games.
Recommend only well-known or high-rated games unless the user explicitly requests niche options.
Respond entirely in ${respondLanguage}.
`.trim();
}

export async function generateGameAdvice({ messages = [], language = "en" }) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    const error = new Error("Gemini API key is not configured");
    error.status = 503;
    throw error;
  }

  // Add instruction as first message
  const contents = [
    {
      role: "user",
      parts: [{ text: buildInstruction(language) }]
    },
    ...normaliseMessages(messages)
  ];

  try {
    const { data } = await axios.post(
      `${GEMINI_API_BASE}/${DEFAULT_MODEL}:generateContent`,
      {
        contents,
        generationConfig: {
          temperature: 0.7,
          topK: 32,
          topP: 0.95,
          maxOutputTokens: 512
        }
      },
      {
        params: { key: apiKey }
      }
    );

    // Extract text safely
    const candidates = data?.candidates?.[0];
    const parts = candidates?.content?.parts;

    const text = parts
      ? parts.map((p) => p?.text || "").join("").trim()
      : "";

    if (!text) {
      const err = new Error("Gemini API returned an empty response");
      err.status = 502;
      throw err;
    }

    return text;
  } catch (err) {
    if (err.response) {
      const { status, data } = err.response;
      const apiErr = new Error(data?.error?.message || "Gemini API request failed");
      apiErr.status = status === 429 ? 429 : 502;
      throw apiErr;
    }

    throw err;
  }
}
