import { useState } from 'react';
import { compareGames } from '../services/comparisonApi.js';
import GameComparisonTable from '../components/GameComparisonTable.jsx';

export default function GameComparisonPage() {
  const [ids, setIds] = useState(['', '', '']);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function handleChange(index, value) {
    setIds((prev) => prev.map((id, idx) => (idx === index ? value : id)));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const selected = ids.map((value) => value.trim()).filter(Boolean);
    if (!selected.length) {
      setError('Enter at least one RAWG game ID');
      return;
    }
    try {
      setLoading(true);
      setError('');
      const data = await compareGames(selected);
      setGames(data.comparison || []);
    } catch (err) {
      console.error(err);
      setError('Unable to compare games');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <h1>Game comparison</h1>
      <form className="comparison-form" onSubmit={handleSubmit}>
        {ids.map((value, index) => (
          <input
            key={index}
            value={value}
            onChange={(event) => handleChange(index, event.target.value)}
            placeholder={`RAWG ID ${index + 1}`}
          />
        ))}
        <button type="submit" className="btn-primary" disabled={loading}>
          Compare
        </button>
      </form>
      {error && <p className="error">{error}</p>}
      {loading && <p>Loading comparison…</p>}
      <GameComparisonTable games={games} />
    </div>
  );
}
