import { useEffect, useState } from 'react';
import ArticleCard from '../components/ArticleCard.jsx';
import Pagination from '../components/Pagination.jsx';
import { fetchArticles } from '../services/articleApi.js';

export default function HomePage() {
  const [articles, setArticles] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load(page = 1) {
    try {
      setLoading(true);
      setError('');
      const data = await fetchArticles({ page, limit: 6 });
      setArticles(data.data);
      setPagination(data.pagination);
    } catch (err) {
      console.error(err);
      setError('Unable to load articles');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load(1);
  }, []);

  return (
    <div className="page">
      <h1>Featured articles</h1>
      {loading && <p>Loading articles…</p>}
      {error && <p className="error">{error}</p>}
      <div className="article-grid">
        {articles.map((article) => (
          <ArticleCard key={article._id} article={article} />
        ))}
      </div>
      <Pagination page={pagination.page} totalPages={pagination.totalPages} onChange={load} />
    </div>
  );
}
