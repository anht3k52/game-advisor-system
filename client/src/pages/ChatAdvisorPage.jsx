import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { requestGameAdvice } from '../services/chatService.js';

function sanitizeMessages(messages = []) {
  return messages
    .filter((message) => message.meta !== 'welcome')
    .map(({ role, content }) => ({ role, content }));
}

export default function ChatAdvisorPage() {
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    setMessages((prev) => {
      const welcomeMessage = {
        role: 'assistant',
        content: t('chatbot.welcome'),
        meta: 'welcome'
      };

      if (!prev.length) {
        return [welcomeMessage];
      }

      const [first, ...rest] = prev;
      if (first.meta === 'welcome') {
        return [{ ...first, content: t('chatbot.welcome') }, ...rest];
      }

      return [welcomeMessage, ...prev];
    });
  }, [language, t]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  async function handleSubmit(event) {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || loading) {
      return;
    }

    const userMessage = { role: 'user', content: trimmed };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput('');
    setError('');
    setLoading(true);

    try {
      const payload = sanitizeMessages(nextMessages);
      const { reply } = await requestGameAdvice({ messages: payload, language });
      if (!reply) {
        throw new Error('No reply from advisor');
      }
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch (err) {
      console.error(err);
      setError(t('chatbot.error'));
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      void handleSubmit(event);
    }
  }

  return (
    <div className="page chatbot-page">
      <h1>{t('chatbot.title')}</h1>
      <p className="page-subtitle">{t('chatbot.description')}</p>
      <section className="chatbot-card">
        <div className="chatbot-messages" aria-live="polite">
          {messages.map((message, index) => (
            <article key={index} className={`chatbot-message ${message.role}`}>
              <div className="chatbot-avatar" aria-hidden="true">
                {message.role === 'assistant'
                  ? t('chatbot.labels.ai')
                  : t('chatbot.labels.you')}
              </div>
              <div className="chatbot-bubble">
                <p className="chatbot-text">{message.content}</p>
              </div>
            </article>
          ))}
          {loading && (
            <div className="chatbot-typing">{t('chatbot.typing')}</div>
          )}
          <div ref={messagesEndRef} />
        </div>
        {error && <p className="error">{error}</p>}
        <form className="chatbot-form" onSubmit={handleSubmit}>
          <label htmlFor="chatbot-input">{t('chatbot.promptLabel')}</label>
          <textarea
            id="chatbot-input"
            rows="3"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t('chatbot.inputPlaceholder')}
            disabled={loading}
          />
          <div className="chatbot-actions">
            <button type="submit" className="btn-primary" disabled={loading || !input.trim()}>
              {loading ? t('chatbot.sending') : t('chatbot.send')}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
