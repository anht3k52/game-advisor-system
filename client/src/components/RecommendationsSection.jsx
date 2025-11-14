import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { fetchRecommendations } from '../services/recommendationApi.js';

export default function RecommendationsSection() {
  const { user } = useAuth();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError('');
        const data = await fetchRecommendations(user?._id);
        setGames(data.results || []);
      } catch (err) {
        console.error(err);
        setError('Unable to load recommendations');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [user?._id]);

  if (loading) {
    return (
      <section className="recommendations">
        <h3>Recommendations</h3>
        <p>Loading suggestions…</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="recommendations">
        <h3>Recommendations</h3>
        <p>{error}</p>
      </section>
    );
  }

  return (
    <section className="recommendations">
      <h3>Recommendations</h3>
      {games.length === 0 && <p>No suggestions yet. Add games to your favourites!</p>}
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
