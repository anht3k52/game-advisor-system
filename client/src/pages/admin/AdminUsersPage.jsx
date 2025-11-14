import { useEffect, useState } from 'react';
import { fetchAdminUsers, updateAdminUser } from '../../services/adminApi.js';
import { useLanguage } from '../../context/LanguageContext.jsx';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      setError('');
      setLoading(true);
      const data = await fetchAdminUsers();
      setUsers(data.data || []);
    } catch (err) {
      console.error(err);
      setError(t('admin.users.errors.load'));
    } finally {
      setLoading(false);
    }
  }

  async function handleRoleChange(id, role) {
    try {
      const { user } = await updateAdminUser(id, { role });
      setUsers((items) => items.map((item) => (item._id === id ? user : item)));
    } catch (err) {
      console.error(err);
      alert(t('admin.users.errors.update'));
    }
  }

  async function toggleActive(id, isActive) {
    try {
      const { user } = await updateAdminUser(id, { isActive });
      setUsers((items) => items.map((item) => (item._id === id ? user : item)));
    } catch (err) {
      console.error(err);
      alert(t('admin.users.errors.update'));
    }
  }

  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <div>
          <h1>{t('admin.users.title')}</h1>
          <p>{t('admin.users.subtitle')}</p>
        </div>
        <button type="button" className="btn-secondary" onClick={load} disabled={loading}>
          {t('admin.actions.refresh')}
        </button>
      </header>
      {error && <p className="error">{error}</p>}
      <section className="admin-card">
        {loading ? (
          <p>{t('common.loading')}</p>
        ) : users.length === 0 ? (
          <p className="admin-empty">{t('admin.users.empty')}</p>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>{t('admin.users.table.name')}</th>
                  <th>{t('admin.users.table.email')}</th>
                  <th>{t('admin.users.table.role')}</th>
                  <th>{t('admin.users.table.status')}</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.fullName}</td>
                    <td>{user.email}</td>
                    <td>
                      <select value={user.role} onChange={(event) => handleRoleChange(user._id, event.target.value)}>
                        <option value="user">{t('admin.users.roles.user')}</option>
                        <option value="editor">{t('admin.users.roles.editor')}</option>
                        <option value="admin">{t('admin.users.roles.admin')}</option>
                      </select>
                    </td>
                    <td>
                      <label className="admin-status-toggle">
                        <input
                          type="checkbox"
                          checked={user.isActive !== false}
                          onChange={(event) => toggleActive(user._id, event.target.checked)}
                        />
                        <span>
                          {user.isActive !== false
                            ? t('admin.users.status.active')
                            : t('admin.users.status.suspended')}
                        </span>
                      </label>
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
