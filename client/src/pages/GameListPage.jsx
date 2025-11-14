import { useEffect, useState } from 'react';
import GameCard from '../components/GameCard.jsx';
import { fetchPopularGames, searchGames } from '../services/gameApi.js';

export default function GameListPage() {
  const [games, setGames] = useState([]);
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadPopular() {
    try {
      setLoading(true);
      setError('');
      const data = await fetchPopularGames({ pageSize: 24 });
      setGames(data.results || []);
    } catch (err) {
      console.error(err);
      setError('Unable to load games');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPopular();
  }, []);

  async function handleSearch(event) {
    event.preventDefault();
    try {
      setLoading(true);
      setError('');
      const data = await searchGames({ search: query, ...filters, page_size: 24 });
      setGames(data.results || []);
    } catch (err) {
      console.error(err);
      setError('Unable to search games');
    } finally {
      setLoading(false);
    }
  }

  function handleFilterChange(event) {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <div className="page">
      <h1>Game explorer</h1>
      <form className="search-form" onSubmit={handleSearch}>
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search games" />
        <input
          name="genres"
          value={filters.genres || ''}
          onChange={handleFilterChange}
          placeholder="Genres (comma separated slugs)"
        />
        <input name="platforms" value={filters.platforms || ''} onChange={handleFilterChange} placeholder="Platforms" />
        <input name="dates" value={filters.dates || ''} onChange={handleFilterChange} placeholder="Release dates" />
        <select name="ordering" value={filters.ordering || ''} onChange={handleFilterChange}>
          <option value="">Order by</option>
          <option value="-rating">Rating desc</option>
          <option value="released">Release date</option>
        </select>
        <button type="submit" className="btn-primary">
          Search
        </button>
      </form>
      {loading && <p>Loading games…</p>}
      {error && <p className="error">{error}</p>}
      <div className="game-grid">
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </div>
  );
}
