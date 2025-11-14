import React, { useEffect, useState } from 'react';
import axios from 'axios';

function GameComparison() {
  const [games, setGames] = useState([]);
  const [selected, setSelected] = useState([]);
  const [comparison, setComparison] = useState([]);

  useEffect(() => {
    axios.get('/api/games').then((res) => setGames(res.data));
  }, []);

  const toggleGame = (gameId) => {
    setSelected((prev) =>
      prev.includes(gameId) ? prev.filter((id) => id !== gameId) : [...prev, gameId]
    );
  };

  const handleCompare = async () => {
    if (selected.length < 2) return;
    const { data } = await axios.post('/api/comparisons', { gameIds: selected });
    setComparison(data.comparison);
  };

  return (
    <article className="card">
      <div>
        <h2>⚔️ So sánh game</h2>
        <p className="description">
          Đánh giá nhanh các game theo thể loại, giá, rating và nền tảng hỗ trợ.
        </p>
      </div>

      <div className="results">
        {games.map((game) => (
          <label key={game.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="checkbox"
              checked={selected.includes(game.id)}
              onChange={() => toggleGame(game.id)}
            />
            <span>
              {game.title} ({game.genre})
            </span>
          </label>
        ))}
      </div>

      <button onClick={handleCompare} disabled={selected.length < 2}>
        So sánh {selected.length} game
      </button>

      {comparison.length > 0 && (
        <div className="results">
          {comparison.map((game) => (
            <div key={game.id} className="flex-column">
              <strong>{game.title}</strong>
              <small>
                {game.genre} • ⭐ {game.rating} • ${game.price}
              </small>
              <span>{game.platform.join(', ')}</span>
              <div className="tag-group">
                {game.tags.map((tag) => (
                  <span key={tag} className="badge">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}

export default GameComparison;
