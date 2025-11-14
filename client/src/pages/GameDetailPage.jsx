import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchGameDetails } from '../services/gameApi.js';
import CommentSection from '../components/CommentSection.jsx';
import RatingWidget from '../components/RatingWidget.jsx';

export default function GameDetailPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const response = await fetchGameDetails(id);
        setData(response);
      } catch (err) {
        console.error(err);
        setError('Unable to load game');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  if (loading) {
    return (
      <div className="page">
        <p>Loading game…</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="page">
        <p className="error">{error || 'Game not found'}</p>
      </div>
    );
  }

  const { game, comments, rating } = data;

  return (
    <div className="page game-detail">
      <header className="game-header">
        <h1>{game.name}</h1>
        <p>{game.released}</p>
        {rating && (
          <p className="game-rating">
            Community score: {rating.avgScore ? rating.avgScore.toFixed(1) : '0.0'} ({rating.ratings || 0} ratings)
          </p>
        )}
        {game.background_image && <img src={game.background_image} alt={game.name} />}
        <p>{game.description_raw || game.description}</p>
        <ul className="game-info">
          <li>
            <strong>Genres:</strong> {game.genres?.map((genre) => genre.name).join(', ')}
          </li>
          <li>
            <strong>Platforms:</strong>{' '}
            {game.platforms?.map((platform) => platform.platform?.name || platform.name).join(', ')}
          </li>
          <li>
            <strong>Website:</strong>{' '}
            {game.website ? (
              <a href={game.website} target="_blank" rel="noreferrer">
                {game.website}
              </a>
            ) : (
              'N/A'
            )}
          </li>
          {game.developers?.length > 0 && (
            <li>
              <strong>Developers:</strong> {game.developers.map((d) => d.name).join(', ')}
            </li>
          )}
          {game.publishers?.length > 0 && (
            <li>
              <strong>Publishers:</strong> {game.publishers.map((p) => p.name).join(', ')}
            </li>
          )}
        </ul>
      </header>

      <RatingWidget gameId={id} />
      <CommentSection targetType="game" targetId={id} initialComments={comments || []} />
    </div>
  );
}
