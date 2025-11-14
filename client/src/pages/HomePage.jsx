import { useEffect, useState } from 'react';
import ArticleCard from '../components/ArticleCard.jsx';
import Pagination from '../components/Pagination.jsx';
import { fetchArticles } from '../services/articleApi.js';
import { useLanguage } from '../context/LanguageContext.jsx';

export default function HomePage() {
  const [articles, setArticles] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { t } = useLanguage();

  async function load(page = 1) {
    try {
      setLoading(true);
      setError('');
      const data = await fetchArticles({ page, limit: 6 });
      setArticles(data.data);
      setPagination(data.pagination);
    } catch (err) {
      console.error(err);
      setError(t('home.error'));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load(1);
  }, []);

  return (
    <div className="page">
      <h1>{t('home.title')}</h1>
      {loading && <p>{t('home.loading')}</p>}
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
