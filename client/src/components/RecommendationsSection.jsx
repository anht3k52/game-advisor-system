import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { fetchRecommendations } from '../services/recommendationApi.js';
import { useLanguage } from '../context/LanguageContext.jsx';

export default function RecommendationsSection() {
  const { user } = useAuth();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { t } = useLanguage();

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError('');
        const data = await fetchRecommendations(user?._id);
        setGames(data.results || []);
      } catch (err) {
        console.error(err);
        setError(t('recommendations.error'));
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [user?._id, t]);

  if (loading) {
    return (
      <section className="recommendations">
        <h3>{t('recommendations.title')}</h3>
        <p>{t('recommendations.loading')}</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="recommendations">
        <h3>{t('recommendations.title')}</h3>
        <p>{error}</p>
      </section>
    );
  }

  return (
    <section className="recommendations">
      <h3>{t('recommendations.title')}</h3>
      {games.length === 0 && <p>{t('recommendations.empty')}</p>}
      <ul>
        {games.slice(0, 6).map((game) => (
          <li key={game.id}>
            <Link to={`/games/${game.id}`}>{game.name}</Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
