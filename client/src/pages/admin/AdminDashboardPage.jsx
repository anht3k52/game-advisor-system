import { useEffect, useState } from 'react';
import { fetchDashboard } from '../../services/adminApi.js';

export default function AdminDashboardPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const result = await fetchDashboard();
        setData(result);
      } catch (err) {
        console.error(err);
        setError('Unable to load dashboard data');
      }
    }

    load();
  }, []);

  if (error) {
    return (
      <div className="admin-page">
        <p className="error">{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="admin-page">
        <p>Loading dashboard…</p>
      </div>
    );
  }

  const { stats, recentArticles, recentComments } = data;

  return (
    <div className="admin-page">
      <section className="dashboard-cards">
        <div className="card">
          <h3>Users</h3>
          <p>{stats.userCount}</p>
        </div>
        <div className="card">
          <h3>Articles</h3>
          <p>{stats.articleCount}</p>
        </div>
        <div className="card">
          <h3>Comments</h3>
          <p>{stats.commentCount}</p>
        </div>
      </section>

      <section>
        <h2>Top games by favourites</h2>
        <ul>
          {(stats.topGames?.favorites || []).map((item) => (
            <li key={item._id}>{item._id} – {item.count} favourites</li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Recent articles</h2>
        <ul>
          {recentArticles.map((article) => (
            <li key={article._id}>{article.title}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Latest comments</h2>
        <ul>
          {recentComments.map((comment) => (
            <li key={comment._id}>
              <strong>{comment.user?.fullName}</strong>: {comment.content}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
