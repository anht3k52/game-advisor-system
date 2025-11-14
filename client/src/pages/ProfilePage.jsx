import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { fetchFavorites, removeFavorite, updateProfile } from '../services/userApi.js';
import GameCard from '../components/GameCard.jsx';

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ fullName: user?.fullName || '', avatar: user?.avatar || '' });
  const [favorites, setFavorites] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

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

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      setSaving(true);
      setError('');
      const { user: updated } = await updateProfile(form);
      setUser(updated);
    } catch (err) {
      console.error(err);
      setError('Unable to update profile');
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
        <h1>Profile</h1>
        <form onSubmit={handleSubmit}>
          <label>
            Full name
            <input name="fullName" value={form.fullName} onChange={handleChange} />
          </label>
          <label>
            Avatar URL
            <input name="avatar" value={form.avatar} onChange={handleChange} />
          </label>
          {error && <p className="error">{error}</p>}
          <button type="submit" className="btn-primary" disabled={saving}>
            Save changes
          </button>
        </form>
      </section>

      <section>
        <h2>Favorite games</h2>
        {favorites.length === 0 && <p>No favourites yet. Add some from the game detail pages.</p>}
        <div className="game-grid">
          {favorites.map((game) => (
            <div key={game.id} className="favorite-card">
              <GameCard game={game} />
              <button type="button" onClick={() => handleRemoveFavorite(game.id)} className="btn-link">
                Remove
              </button>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2>Recently read articles</h2>
        <ul className="history-list">
          {(user?.readArticlesHistory || []).map((entry) => (
            <li key={entry.article?._id || entry.article}>
              <Link to={entry.article?.slug ? `/articles/${entry.article.slug}` : '#'}>{entry.article?.title || 'Article'}</Link>
              <span>{new Date(entry.readAt).toLocaleString()}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
