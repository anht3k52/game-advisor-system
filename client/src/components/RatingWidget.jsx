import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { submitRating, fetchGameRating } from '../services/ratingApi.js';

export default function RatingWidget({ gameId }) {
  const { user } = useAuth();
  const [score, setScore] = useState('');
  const [average, setAverage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      if (!gameId) return;
      try {
        const data = await fetchGameRating(gameId);
        setAverage(data || { avgScore: 0, ratings: 0 });
      } catch (error) {
        console.error(error);
      }
    }
    load();
  }, [gameId]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!score) return;
    try {
      setLoading(true);
      await submitRating({ rawgGameId: gameId, score: Number(score) });
      const data = await fetchGameRating(gameId);
      setAverage(data || { avgScore: 0, ratings: 0 });
      setScore('');
      alert('Thanks for rating!');
    } catch (error) {
      console.error(error);
      alert('Unable to submit rating');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rating-widget">
      <h3>Community rating</h3>
      {average && (
        <p>
          Average score: <strong>{average.avgScore?.toFixed ? average.avgScore.toFixed(1) : 0}</strong> ({average.ratings}{' '}
          ratings)
        </p>
      )}
      {user ? (
        <form onSubmit={handleSubmit}>
          <label>
            Your score:
            <select value={score} onChange={(event) => setScore(event.target.value)}>
              <option value="">Select…</option>
              {[1, 2, 3, 4, 5].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>
          <button type="submit" className="btn-primary" disabled={loading || !score}>
            Submit rating
          </button>
        </form>
      ) : (
        <p>Log in to rate this game.</p>
      )}
    </section>
  );
}
