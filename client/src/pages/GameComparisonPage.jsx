import { useState } from 'react';
import { compareGames } from '../services/comparisonApi.js';
import GameComparisonTable from '../components/GameComparisonTable.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

export default function GameComparisonPage() {
  const [ids, setIds] = useState(['', '', '']);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { t } = useLanguage();

  function handleChange(index, value) {
    setIds((prev) => prev.map((id, idx) => (idx === index ? value : id)));
    if (error) {
      setError('');
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const selected = ids.map((value) => value.trim()).filter(Boolean);
    if (!selected.length) {
      setError(t('comparison.errors.noId'));
      return;
    }
    try {
      setLoading(true);
      setError('');
      const data = await compareGames(selected);
      setGames(data.comparison || []);
    } catch (err) {
      console.error(err);
      setError(t('comparison.errors.failed'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page comparison-page">
      <h1>{t('comparison.title')}</h1>
      <p className="page-subtitle">{t('comparison.description')}</p>
      <section className="comparison-card">
        <p className="comparison-hint">{t('comparison.hint')}</p>
        <form className="comparison-form" onSubmit={handleSubmit}>
          {ids.map((value, index) => (
            <input
              key={index}
              value={value}
              onChange={(event) => handleChange(index, event.target.value)}
              placeholder={t('comparison.form.placeholder', { index: index + 1 })}
            />
          ))}
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? t('comparison.form.submitting') : t('comparison.form.submit')}
          </button>
        </form>
        {error && <p className="error">{error}</p>}
        {loading && <p>{t('comparison.loading')}</p>}
      </section>
      {games.length > 0 && (
        <div className="comparison-results">
          <GameComparisonTable games={games} />
        </div>
      )}
    </div>
  );
}
