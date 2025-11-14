import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { fetchFavorites, removeFavorite, updateProfile } from '../services/userApi.js';
import GameCard from '../components/GameCard.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ fullName: user?.fullName || '', avatar: user?.avatar || '' });
  const [favorites, setFavorites] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const { t, language } = useLanguage();
  const fileInputRef = useRef(null);

  useEffect(() => {
    setForm({ fullName: user?.fullName || '', avatar: user?.avatar || '' });
  }, [user]);

  useEffect(() => {
    async function loadFavorites() {
      try {
        const data = await fetchFavorites();
        setFavorites(data.favorites || []);
      } catch (err) {
        console.error(err);
      }
    }

    loadFavorites();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleAvatarFileChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setError(t('profile.avatarTooLarge'));
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({ ...prev, avatar: reader.result?.toString() || '' }));
      setError('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };
    reader.onerror = () => {
      setError(t('profile.error'));
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      setSaving(true);
      setError('');
      const { user: updated } = await updateProfile(form);
      setUser(updated);
    } catch (err) {
      console.error(err);
      setError(t('profile.error'));
    } finally {
      setSaving(false);
    }
  }

  async function handleRemoveFavorite(id) {
    try {
      await removeFavorite(id);
      setFavorites((items) => items.filter((game) => String(game.id) !== String(id)));
      setUser((prev) =>
        prev
          ? {
              ...prev,
              favoriteGames: (prev.favoriteGames || []).filter((gameId) => String(gameId) !== String(id))
            }
          : prev
      );
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="page profile-page">
      <section className="profile-card">
        <h1>{t('profile.title')}</h1>
        <form onSubmit={handleSubmit}>
          <label>
            {t('profile.fullName')}
            <input name="fullName" value={form.fullName} onChange={handleChange} />
          </label>
          <label>
            {t('profile.avatar')}
            <input name="avatar" value={form.avatar} onChange={handleChange} placeholder="https://" />
          </label>
          <div className="avatar-upload">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => fileInputRef.current?.click()}
            >
              {t('profile.uploadLabel')}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handleAvatarFileChange}
            />
          </div>
          {form.avatar && (
            <div className="avatar-preview">
              <img src={form.avatar} alt={form.fullName || user?.username || user?.email} />
            </div>
          )}
          {error && <p className="error">{error}</p>}
          <button type="submit" className="btn-primary" disabled={saving}>
            {t('profile.save')}
          </button>
        </form>
      </section>

      <section>
        <h2>{t('profile.favorites')}</h2>
        {favorites.length === 0 && <p>{t('profile.noFavorites')}</p>}
        <div className="game-grid">
          {favorites.map((game) => (
            <div key={game.id} className="favorite-card">
              <GameCard game={game} />
              <button type="button" onClick={() => handleRemoveFavorite(game.id)} className="btn-link">
                {t('profile.remove')}
              </button>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2>{t('profile.recentArticles')}</h2>
        <ul className="history-list">
          {(user?.readArticlesHistory || []).map((entry) => (
            <li key={entry.article?._id || entry.article}>
              <Link to={entry.article?.slug ? `/articles/${entry.article.slug}` : '#'}>
                {language === 'vi'
                  ? entry.article?.titleVi || entry.article?.title || t('articles.generic')
                  : entry.article?.title || entry.article?.titleVi || t('articles.generic')}
              </Link>
              <span>{new Date(entry.readAt).toLocaleString()}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
