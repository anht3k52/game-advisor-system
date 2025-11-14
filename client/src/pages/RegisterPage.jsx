import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

export default function RegisterPage() {
  const { register } = useAuth();
  const [form, setForm] = useState({ fullName: '', email: '', username: '', password: '', avatar: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      setLoading(true);
      setError('');
      const payload = { ...form };
      if (!payload.username) delete payload.username;
      if (!payload.avatar) delete payload.avatar;
      await register(payload);
      navigate('/', { replace: true });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || t('auth.registerFailed'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page auth-page">
      <h1>{t('auth.registerTitle')}</h1>
      <form onSubmit={handleSubmit} className="auth-form">
        <label>
          {t('auth.fullName')}
          <input name="fullName" value={form.fullName} onChange={handleChange} required />
        </label>
        <label>
          {t('auth.email')}
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </label>
        <label>
          {t('auth.usernameOptional')}
          <input name="username" value={form.username} onChange={handleChange} />
        </label>
        <label>
          {t('auth.passwordField')}
          <input type="password" name="password" value={form.password} onChange={handleChange} required />
        </label>
        <label>
          {t('auth.avatarUrl')}
          <input name="avatar" value={form.avatar} onChange={handleChange} />
        </label>
        {error && <p className="error">{error}</p>}
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? t('auth.registering') : t('auth.register')}
        </button>
      </form>
    </div>
  );
}
