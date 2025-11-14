import { useEffect, useState } from 'react';
import { fetchDashboard } from '../../services/adminApi.js';
import { useLanguage } from '../../context/LanguageContext.jsx';

export default function AdminDashboardPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      setLoading(true);
      setError('');
      const result = await fetchDashboard();
      setData(result);
    } catch (err) {
      console.error(err);
      setError(t('admin.dashboard.error'));
    } finally {
      setLoading(false);
    }
  }

  const stats = data?.stats ?? {};
  const topGames = stats.topGames?.favorites || [];
  const recentArticles = data?.recentArticles || [];
  const recentComments = data?.recentComments || [];

  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <div>
          <h1>{t('admin.dashboard.title')}</h1>
          <p>{t('admin.dashboard.subtitle')}</p>
        </div>
        <button type="button" className="btn-secondary" onClick={load} disabled={loading}>
          {t('admin.actions.refresh')}
        </button>
      </header>
      {error && <p className="error">{error}</p>}
      {loading ? (
        <section className="admin-card">
          <p>{t('common.loading')}</p>
        </section>
      ) : (
        <>
          <section className="admin-card stats-card">
            <div className="dashboard-cards">
              <div className="card">
                <h3>{t('admin.dashboard.stats.users')}</h3>
                <p>{stats.userCount}</p>
              </div>
              <div className="card">
                <h3>{t('admin.dashboard.stats.articles')}</h3>
                <p>{stats.articleCount}</p>
              </div>
              <div className="card">
                <h3>{t('admin.dashboard.stats.comments')}</h3>
                <p>{stats.commentCount}</p>
              </div>
            </div>
          </section>

          <section className="admin-card">
            <div className="admin-card-header">
              <h2>{t('admin.dashboard.topGamesTitle')}</h2>
            </div>
            {topGames.length === 0 ? (
              <p className="admin-empty">{t('admin.dashboard.topGamesEmpty')}</p>
            ) : (
              <ul className="admin-list">
                {topGames.map((item) => (
                  <li key={item._id}>
                    <span>{item._id}</span>
                    <span>{t('admin.dashboard.topGamesCount', { count: item.count })}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="admin-card">
            <div className="admin-card-header">
              <h2>{t('admin.dashboard.recentArticlesTitle')}</h2>
            </div>
            {recentArticles.length === 0 ? (
              <p className="admin-empty">{t('admin.dashboard.recentArticlesEmpty')}</p>
            ) : (
              <ul className="admin-list">
                {recentArticles.map((article) => (
                  <li key={article._id}>{article.title}</li>
                ))}
              </ul>
            )}
          </section>

          <section className="admin-card">
            <div className="admin-card-header">
              <h2>{t('admin.dashboard.recentCommentsTitle')}</h2>
            </div>
            {recentComments.length === 0 ? (
              <p className="admin-empty">{t('admin.dashboard.recentCommentsEmpty')}</p>
            ) : (
              <ul className="admin-list">
                {recentComments.map((comment) => (
                  <li key={comment._id}>
                    <strong>{comment.user?.fullName}</strong>
                    <span>{comment.content}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  );
}
