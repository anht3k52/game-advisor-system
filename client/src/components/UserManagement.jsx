import React, { useEffect, useMemo, useState } from 'react';
import { apiClient } from '../services/api.js';

const INITIAL_FORM = {
  id: null,
  name: '',
  email: '',
  role: 'user',
  password: '',
  favoriteGenres: '',
  preferredPlatforms: '',
  budget: '',
  playStyles: ''
};

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isEditing = useMemo(() => Boolean(form.id), [form.id]);

  const loadUsers = async () => {
    setError(null);
    try {
      const data = await apiClient.fetchUsers();
      setUsers(data);
    } catch (requestError) {
      setError(requestError.response?.data?.error || requestError.message);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm(INITIAL_FORM);
  };

  const buildPreferences = () => ({
    favoriteGenres: form.favoriteGenres
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean),
    preferredPlatforms: form.preferredPlatforms
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean),
    budget: form.budget === '' ? null : Number(form.budget),
    playStyles: form.playStyles
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
  });

  const startEdit = (user) => {
    setForm({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role || 'user',
      password: '',
      favoriteGenres: user.preferences?.favoriteGenres?.join(', ') || '',
      preferredPlatforms: user.preferences?.preferredPlatforms?.join(', ') || '',
      budget: user.preferences?.budget ?? '',
      playStyles: user.preferences?.playStyles?.join(', ') || ''
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        name: form.name,
        email: form.email,
        role: form.role,
        preferences: buildPreferences()
      };

      if (form.password) {
        payload.password = form.password;
      }

      if (isEditing) {
        const updated = await apiClient.updateUser(form.id, payload);
        setUsers((prev) => prev.map((user) => (user.id === updated.id ? updated : user)));
      } else {
        if (!form.password) {
          throw new Error('Vui lòng nhập mật khẩu cho người dùng mới.');
        }
        const created = await apiClient.createUser(payload);
        setUsers((prev) => [...prev, created]);
      }

      resetForm();
    } catch (requestError) {
      setError(requestError.response?.data?.error || requestError.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    setLoading(true);
    setError(null);
    try {
      await apiClient.deleteUser(userId);
      setUsers((prev) => prev.filter((user) => user.id !== userId));
      if (form.id === userId) {
        resetForm();
      }
    } catch (requestError) {
      setError(requestError.response?.data?.error || requestError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <article className="card">
      <div className="card-header">
        <h2>👤 Quản lý người dùng</h2>
        <p className="description">Thêm mới, chỉnh sửa và phân quyền người dùng trong hệ thống.</p>
      </div>

      <form onSubmit={handleSubmit} className="stack">
        <div className="grid two-cols">
          <label>
            Họ tên
            <input name="name" value={form.name} onChange={handleChange} required />
          </label>
          <label>
            Email
            <input name="email" type="email" value={form.email} onChange={handleChange} required />
          </label>
          <label>
            Vai trò
            <select name="role" value={form.role} onChange={handleChange}>
              <option value="user">Người dùng</option>
              <option value="admin">Quản trị</option>
            </select>
          </label>
          <label>
            Mật khẩu {isEditing && <span className="hint">(để trống nếu giữ nguyên)</span>}
            <input name="password" type="password" value={form.password} onChange={handleChange} />
          </label>
        </div>

        <label>
          Thể loại yêu thích (phân cách dấu phẩy)
          <input name="favoriteGenres" value={form.favoriteGenres} onChange={handleChange} />
        </label>
        <label>
          Nền tảng ưa thích (PC, PlayStation...)
          <input name="preferredPlatforms" value={form.preferredPlatforms} onChange={handleChange} />
        </label>
        <label>
          Ngân sách tối đa (USD)
          <input name="budget" type="number" min="0" value={form.budget} onChange={handleChange} />
        </label>
        <label>
          Phong cách chơi (story-rich, co-op...)
          <input name="playStyles" value={form.playStyles} onChange={handleChange} />
        </label>

        {error && <p className="error-text">{error}</p>}

        <div className="actions">
          <button type="submit" disabled={loading}>
            {loading ? 'Đang lưu...' : isEditing ? 'Cập nhật người dùng' : 'Thêm người dùng'}
          </button>
          {isEditing && (
            <button type="button" className="secondary" onClick={resetForm} disabled={loading}>
              Hủy chỉnh sửa
            </button>
          )}
        </div>
      </form>

      <div className="results user-table">
        <table>
          <thead>
            <tr>
              <th>Họ tên</th>
              <th>Email</th>
              <th>Vai trò</th>
              <th>Ngày tạo</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`badge ${user.role === 'admin' ? 'accent' : ''}`}>
                    {user.role === 'admin' ? 'Quản trị' : 'Người dùng'}
                  </span>
                </td>
                <td>{user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : '—'}</td>
                <td className="row-actions">
                  <button type="button" onClick={() => startEdit(user)} disabled={loading}>
                    Sửa
                  </button>
                  <button type="button" className="danger" onClick={() => handleDelete(user.id)} disabled={loading}>
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="empty-state">
                  Chưa có người dùng nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </article>
  );
}

export default UserManagement;
