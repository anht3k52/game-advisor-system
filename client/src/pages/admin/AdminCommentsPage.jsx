import { useState } from 'react';
import { fetchAdminComments, moderateAdminComment } from '../../services/adminApi.js';
import { useLanguage } from '../../context/LanguageContext.jsx';

export default function AdminCommentsPage() {
  const [targetType, setTargetType] = useState('game');
  const [targetId, setTargetId] = useState('');
  const [comments, setComments] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();

  async function handleSearch(event) {
    event.preventDefault();
    try {
      setError('');
      setLoading(true);
      const data = await fetchAdminComments(targetType, targetId);
      setComments(data.comments || []);
    } catch (err) {
      console.error(err);
      setError(t('admin.comments.errors.load'));
    } finally {
      setLoading(false);
    }
  }

  async function toggleVisibility(id, isHidden) {
    try {
      const { comment } = await moderateAdminComment(id, { isHidden });
      setComments((items) => items.map((item) => (item._id === id ? comment : item)));
    } catch (err) {
      console.error(err);
      alert(t('admin.comments.errors.moderate'));
    }
  }

  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <div>
          <h1>{t('admin.comments.title')}</h1>
          <p>{t('admin.comments.subtitle')}</p>
        </div>
      </header>
      <section className="admin-card">
        <form className="admin-form" onSubmit={handleSearch}>
          <select value={targetType} onChange={(event) => setTargetType(event.target.value)}>
            <option value="game">{t('admin.comments.filters.game')}</option>
            <option value="article">{t('admin.comments.filters.article')}</option>
          </select>
          <input
            value={targetId}
            onChange={(event) => setTargetId(event.target.value)}
            placeholder={t('admin.comments.form.targetPlaceholder')}
            required
          />
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? t('admin.comments.form.loading') : t('admin.comments.form.submit')}
          </button>
        </form>
        {error && <p className="error">{error}</p>}
        {loading ? (
          <p>{t('common.loading')}</p>
        ) : comments.length === 0 ? (
          <p className="admin-empty">{t('admin.comments.empty')}</p>
        ) : (
          <ul className="comment-list admin">
            {comments.map((comment) => (
              <li key={comment._id} className={comment.isHidden ? 'is-hidden' : ''}>
                <header>
                  <strong>{comment.user?.fullName}</strong>
                  <span>{new Date(comment.createdAt).toLocaleString()}</span>
                </header>
                <p>{comment.content}</p>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => toggleVisibility(comment._id, !comment.isHidden)}
                >
                  {comment.isHidden ? t('admin.comments.actions.unhide') : t('admin.comments.actions.hide')}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
