import { useState } from 'react';
import { fetchArticles } from '../services/articleApi.js';
import { searchGames } from '../services/gameApi.js';
import ArticleCard from '../components/ArticleCard.jsx';
import GameCard from '../components/GameCard.jsx';
import { useLanguage } from '../context/LanguageContext';

export default function AdvancedSearchPage() {
  const { t } = useLanguage();

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
      setError(t("advancedSearch.error"));
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
      <h1>{t("advancedSearch.title")}</h1>

      <form className="search-form" onSubmit={handleSearch}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("advancedSearch.keyword")}
        />

        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="all">{t("advancedSearch.all")}</option>
          <option value="game">{t("advancedSearch.games")}</option>
          <option value="article">{t("advancedSearch.articles")}</option>
        </select>

        <input
          name="tags"
          value={filters.tags || ''}
          onChange={handleFilterChange}
          placeholder={t("advancedSearch.articleTags")}
        />

        <input
          name="genres"
          value={filters.genres || ''}
          onChange={handleFilterChange}
          placeholder={t("advancedSearch.gameGenres")}
        />

        <input
          name="platforms"
          value={filters.platforms || ''}
          onChange={handleFilterChange}
          placeholder={t("advancedSearch.platforms")}
        />

        <input
          name="dates"
          value={filters.dates || ''}
          onChange={handleFilterChange}
          placeholder={t("advancedSearch.year")}
        />

        <select name="ordering" value={filters.ordering || ''} onChange={handleFilterChange}>
          <option value="">{t("advancedSearch.sort")}</option>
          <option value="-rating">{t("advancedSearch.sortRating")}</option>
          <option value="released">{t("advancedSearch.sortRelease")}</option>
        </select>

        <button type="submit" className="btn-primary">
          {t("advancedSearch.searchBtn")}
        </button>
      </form>

      {loading && <p>{t("advancedSearch.searching")}</p>}
      {error && <p className="error">{error}</p>}

      {articles.length > 0 && (
        <section>
          <h2>{t("advancedSearch.articlesHeader")}</h2>
          <div className="article-grid">
            {articles.map((article) => (
              <ArticleCard key={article._id} article={article} />
            ))}
          </div>
        </section>
      )}

      {games.length > 0 && (
        <section>
          <h2>{t("advancedSearch.gamesHeader")}</h2>
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
