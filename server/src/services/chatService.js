import axios from 'axios';

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';
const DEFAULT_MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
const MAX_HISTORY = 10;

function normaliseMessages(messages = []) {
  return messages
    .filter((message) => message && typeof message.content === 'string')
    .map((message) => ({
      role: message.role === 'assistant' ? 'model' : 'user',
      parts: [
        {
          text: message.content
        }
      ]
    }))
    .slice(-MAX_HISTORY);
}

function buildInstruction(language = 'en') {
  const respondLanguage = language === 'vi' ? 'Vietnamese' : 'English';
  return [
    'You are Game Advisor, an expert video game curator who suggests titles based on player moods, genres, and platforms.',
    'Keep answers concise, structured, and easy to scan with bullet points when suggesting multiple games.',
    'Only recommend well-known or highly rated games unless the user explicitly asks for niche options.',
    `Respond fully in ${respondLanguage} unless the user asks for another language.`
  ].join(' ');
}

export async function generateGameAdvice({ messages = [], language = 'en' }) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    const error = new Error('Gemini API key is not configured');
    error.status = 503;
    throw error;
  }

  const contents = [
    {
      role: 'user',
      parts: [
        {
          text: buildInstruction(language)
        }
      ]
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

    const parts = data?.candidates?.[0]?.content?.parts;
    const text = parts ? parts.map((part) => part?.text || '').join('').trim() : '';

    if (!text) {
      const error = new Error('Gemini API returned an empty response');
      error.status = 502;
      throw error;
    }

    return text;
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response;
      const apiError = new Error(data?.error?.message || 'Gemini API request failed');
      apiError.status = status === 429 ? 429 : 502;
      throw apiError;
    }

    throw error;
  }
}
