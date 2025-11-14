import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext.jsx';

export default function GameCard({ game }) {
  const { t } = useLanguage();
  const ratingValue =
    game.rating == null ? null : game.rating?.toFixed ? game.rating.toFixed(1) : game.rating;

  return (
    <article className="game-card">
      <Link to={`/games/${game.id}`} className="game-thumb">
        <img src={game.background_image} alt={game.name} loading="lazy" />
      </Link>
      <div className="game-body">
        <h3>
          <Link to={`/games/${game.id}`}>{game.name}</Link>
        </h3>
        <p className="game-meta">
          <span className="game-id">{t('games.rawgId', { id: game.id })}</span>
          {ratingValue != null && <span>{t('games.rating', { rating: ratingValue })}</span>}
          {game.released && <span>{t('games.release', { date: game.released })}</span>}
=======
          <span className="game-id">RAWG ID: {game.id}</span>
          <span>Rating: {game.rating?.toFixed ? game.rating.toFixed(1) : game.rating}</span>
          {game.released && <span>Released: {game.released}</span>}
        </p>
        {game.genres && (
          <div className="tag-list">
            {game.genres.map((genre) => (
              <span key={genre.id || genre.slug} className="tag">
                {genre.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
