import { useEffect, useState } from 'react';
import { createAdminArticle, deleteAdminArticle, fetchAdminArticles } from '../../services/adminApi.js';
import { useLanguage } from '../../context/LanguageContext.jsx';

const initialForm = {
  title: '',
  titleVi: '',
  shortDescription: '',
  shortDescriptionVi: '',
  content: '',
  contentVi: '',
  thumbnailUrl: '',
  relatedGameId: '',
  tags: ''
};

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const { t, language } = useLanguage();
  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      setError('');
      setListLoading(true);
      const data = await fetchAdminArticles();
      setArticles(data.data || []);
    } catch (err) {
      console.error(err);
      setError(t('admin.articles.errors.load'));
    } finally {
      setListLoading(false);
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      setSaving(true);
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
      setError(err.response?.data?.error || t('admin.articles.errors.create'));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm(t('admin.articles.confirmDelete'))) return;
    try {
      await deleteAdminArticle(id);
      await load();
    } catch (err) {
      console.error(err);
      alert(t('admin.articles.errors.delete'));
    }
  }

  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <div>
          <h1>{t('admin.articles.title')}</h1>
          <p>{t('admin.articles.subtitle')}</p>
        </div>
        <button type="button" className="btn-secondary" onClick={load} disabled={listLoading || saving}>
          {t('admin.actions.refresh')}
        </button>
      </header>
      {error && <p className="error">{error}</p>}
      <section className="admin-card">
        <div className="admin-card-header">
          <h2>{t('admin.articles.formTitle')}</h2>
          <p className="admin-card-subtitle">{t('admin.articles.formSubtitle')}</p>
        </div>
        <form className="admin-form" onSubmit={handleSubmit}>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder={t('admin.articles.form.title')}
            required
          />
          <input
            name="titleVi"
            value={form.titleVi}
            onChange={handleChange}
            placeholder={t('admin.articles.form.titleVi')}
          />
          <input
            name="shortDescription"
            value={form.shortDescription}
            onChange={handleChange}
            placeholder={t('admin.articles.form.shortDescription')}
            required
          />
          <input
            name="shortDescriptionVi"
            value={form.shortDescriptionVi}
            onChange={handleChange}
            placeholder={t('admin.articles.form.shortDescriptionVi')}
          />

          
          <textarea
            name="contentVi"
            value={form.contentVi}
            onChange={handleChange}
            placeholder={t('admin.articles.form.contentVi')}
            rows={6}
          />
          <input
            name="thumbnailUrl"
            value={form.thumbnailUrl}
            onChange={handleChange}
            placeholder={t('admin.articles.form.thumbnailUrl')}
          />
          <input
            name="relatedGameId"
            value={form.relatedGameId}
            onChange={handleChange}
            placeholder={t('admin.articles.form.relatedGameId')}
          />
          <input
            name="tags"
            value={form.tags}
            onChange={handleChange}
            placeholder={t('admin.articles.form.tags')}
          />
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? t('admin.articles.form.submitting') : t('admin.articles.form.submit')}
          </button>
        </form>
      </section>

      <section className="admin-card">
        <div className="admin-card-header">
          <h2>{t('admin.articles.listTitle')}</h2>
        </div>
        {listLoading ? (
          <p>{t('common.loading')}</p>
        ) : articles.length === 0 ? (
          <p className="admin-empty">{t('admin.articles.empty')}</p>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>{t('admin.articles.table.title')}</th>
                  <th>{t('admin.articles.table.tags')}</th>
                  <th>{t('admin.articles.table.published')}</th>
                  <th>{t('admin.articles.table.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((article) => {
                  const displayTitle =
                    language === 'vi'
                      ? article.titleVi || article.title
                      : article.title || article.titleVi;
                  return (
                    <tr key={article._id}>
                      <td>{displayTitle}</td>
                      <td>{(article.tags || []).join(', ')}</td>
                      <td>{article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : '—'}</td>
                      <td>
                        <button type="button" onClick={() => handleDelete(article._id)} className="btn-link">
                          {t('admin.articles.table.delete')}
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {articles.map((article) => (
                  <tr key={article._id}>
                    <td>{article.title}</td>
                    <td>{(article.tags || []).join(', ')}</td>
                    <td>{article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : '—'}</td>
                    <td>
                      <button type="button" onClick={() => handleDelete(article._id)} className="btn-link">
                        {t('admin.articles.table.delete')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
