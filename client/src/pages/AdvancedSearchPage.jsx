import { useState } from 'react';
import { fetchArticles } from '../services/articleApi.js';
import { searchGames } from '../services/gameApi.js';
import ArticleCard from '../components/ArticleCard.jsx';
import GameCard from '../components/GameCard.jsx';

export default function AdvancedSearchPage() {
  const [query, setQuery] = useState('');
  const [type, setType] = useState('all');
  const [filters, setFilters] = useState({});
  const [articles, setArticles] = useState([]);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSearch(event) {
    event.preventDefault();
    try {
      setLoading(true);
      setError('');
      if (type === 'article' || type === 'all') {
        const articleData = await fetchArticles({ q: query, tags: filters.tags });
        setArticles(articleData.data || []);
      } else {
        setArticles([]);
      }

      if (type === 'game' || type === 'all') {
        const gameData = await searchGames({ search: query, ...filters, page_size: 24 });
        setGames(gameData.results || []);
      } else {
        setGames([]);
      }
    } catch (err) {
      console.error(err);
      setError('Unable to perform search');
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
      <h1>Advanced search</h1>
      <form className="search-form" onSubmit={handleSearch}>
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Keyword" />
        <select value={type} onChange={(event) => setType(event.target.value)}>
          <option value="all">All</option>
          <option value="game">Games</option>
          <option value="article">Articles</option>
        </select>
        <input name="tags" value={filters.tags || ''} onChange={handleFilterChange} placeholder="Article tags" />
        <input name="genres" value={filters.genres || ''} onChange={handleFilterChange} placeholder="Game genres" />
        <input name="platforms" value={filters.platforms || ''} onChange={handleFilterChange} placeholder="Platforms" />
        <input name="dates" value={filters.dates || ''} onChange={handleFilterChange} placeholder="Year or range" />
        <select name="ordering" value={filters.ordering || ''} onChange={handleFilterChange}>
          <option value="">Sort (games)</option>
          <option value="-rating">Rating</option>
          <option value="released">Release date</option>
        </select>
        <button type="submit" className="btn-primary">
          Search
        </button>
      </form>
      {loading && <p>Searching…</p>}
      {error && <p className="error">{error}</p>}
      {articles.length > 0 && (
        <section>
          <h2>Articles</h2>
          <div className="article-grid">
            {articles.map((article) => (
              <ArticleCard key={article._id} article={article} />
            ))}
          </div>
        </section>
      )}
      {games.length > 0 && (
        <section>
          <h2>Games</h2>
          <div className="game-grid">
            {games.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
