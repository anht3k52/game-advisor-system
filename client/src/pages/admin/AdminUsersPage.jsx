import { useEffect, useState } from 'react';
import { fetchAdminUsers, updateAdminUser } from '../../services/adminApi.js';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      setError('');
      const data = await fetchAdminUsers();
      setUsers(data.data || []);
    } catch (err) {
      console.error(err);
      setError('Unable to load users');
    }
  }

  async function handleRoleChange(id, role) {
    try {
      const { user } = await updateAdminUser(id, { role });
      setUsers((items) => items.map((item) => (item._id === id ? user : item)));
    } catch (err) {
      console.error(err);
      alert('Unable to update user');
    }
  }

  async function toggleActive(id, isActive) {
    try {
      const { user } = await updateAdminUser(id, { isActive });
      setUsers((items) => items.map((item) => (item._id === id ? user : item)));
    } catch (err) {
      console.error(err);
      alert('Unable to update user');
    }
  }

  return (
    <div className="admin-page">
      <h1>Manage users</h1>
      {error && <p className="error">{error}</p>}
      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.fullName}</td>
              <td>{user.email}</td>
              <td>
                <select value={user.role} onChange={(event) => handleRoleChange(user._id, event.target.value)}>
                  <option value="user">User</option>
                  <option value="editor">Editor</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td>
                <label>
                  <input
                    type="checkbox"
                    checked={user.isActive !== false}
                    onChange={(event) => toggleActive(user._id, event.target.checked)}
                  />{' '}
                  {user.isActive !== false ? 'Active' : 'Suspended'}
                </label>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
