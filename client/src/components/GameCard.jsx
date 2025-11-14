import { Link } from 'react-router-dom';

export default function GameCard({ game }) {
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
