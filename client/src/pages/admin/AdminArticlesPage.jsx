import { useEffect, useState } from 'react';
import { createAdminArticle, deleteAdminArticle, fetchAdminArticles } from '../../services/adminApi.js';

const initialForm = {
  title: '',
  shortDescription: '',
  content: '',
  thumbnailUrl: '',
  relatedGameId: '',
  tags: ''
};

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      setError('');
      const data = await fetchAdminArticles();
      setArticles(data.data || []);
    } catch (err) {
      console.error(err);
      setError('Unable to load articles');
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      setLoading(true);
      const payload = {
        ...form,
        tags: form.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean)
      };
      await createAdminArticle(payload);
      setForm({ ...initialForm });
      await load();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Unable to create article');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this article?')) return;
    try {
      await deleteAdminArticle(id);
      await load();
    } catch (err) {
      console.error(err);
      alert('Unable to delete article');
    }
  }

  return (
    <div className="admin-page">
      <h1>Manage articles</h1>
      {error && <p className="error">{error}</p>}
      <form className="admin-form" onSubmit={handleSubmit}>
        <input name="title" value={form.title} onChange={handleChange} placeholder="Title" required />
        <input
          name="shortDescription"
          value={form.shortDescription}
          onChange={handleChange}
          placeholder="Short description"
          required
        />
        <textarea name="content" value={form.content} onChange={handleChange} placeholder="Content" rows={6} required />
        <input name="thumbnailUrl" value={form.thumbnailUrl} onChange={handleChange} placeholder="Thumbnail URL" />
        <input name="relatedGameId" value={form.relatedGameId} onChange={handleChange} placeholder="Related RAWG ID" />
        <input name="tags" value={form.tags} onChange={handleChange} placeholder="Tags (comma separated)" />
        <button type="submit" className="btn-primary" disabled={loading}>
          Create article
        </button>
      </form>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Tags</th>
            <th>Published</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {articles.map((article) => (
            <tr key={article._id}>
              <td>{article.title}</td>
              <td>{(article.tags || []).join(', ')}</td>
              <td>{article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : '—'}</td>
              <td>
                <button type="button" onClick={() => handleDelete(article._id)} className="btn-link">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
