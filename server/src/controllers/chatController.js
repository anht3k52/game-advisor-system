import { generateGameAdvice } from '../services/chatService.js';

export async function chatWithAdvisor(req, res, next) {
  try {
    const { messages, language } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'messages must be a non-empty array' });
    }

    const safeLanguage = language === 'vi' ? 'vi' : 'en';
    const reply = await generateGameAdvice({ messages, language: safeLanguage });

    res.json({ reply });
  } catch (error) {
    next(error);
  }
}
