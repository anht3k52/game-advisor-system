import React, { useEffect, useState } from 'react';
import { apiClient } from '../services/api.js';

const INITIAL_FORM = {
  name: '',
  email: '',
  favoriteGenres: '',
  preferredPlatforms: '',
  budget: 50,
  playStyles: ''
};

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    apiClient.fetchUsers().then(setUsers);
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const payload = {
        name: form.name,
        email: form.email,
        preferences: {
          favoriteGenres: form.favoriteGenres.split(',').map((item) => item.trim()).filter(Boolean),
          preferredPlatforms: form.preferredPlatforms.split(',').map((item) => item.trim()).filter(Boolean),
          budget: Number(form.budget),
          playStyles: form.playStyles.split(',').map((item) => item.trim()).filter(Boolean)
        }
      };

      const created = await apiClient.createUser(payload);
      setUsers((prev) => [...prev, created]);
      setForm(INITIAL_FORM);
    } finally {
      setLoading(false);
    }
  };

  return (
    <article className="card">
      <div>
        <h2>👤 Quản lý người dùng</h2>
        <p className="description">
          Tạo mới và theo dõi người dùng cùng cấu hình sở thích để cá nhân hóa tư vấn.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <label>
          Họ tên
          <input name="name" value={form.name} onChange={handleChange} required />
        </label>
        <label>
          Email
          <input name="email" type="email" value={form.email} onChange={handleChange} required />
        </label>
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
        <button type="submit" disabled={loading}>
          {loading ? 'Đang lưu...' : 'Thêm người dùng'}
        </button>
      </form>

      <div className="results">
        {users.map((user) => (
          <div key={user.id} className="flex-column">
            <strong>{user.name}</strong>
            <span className="badge">{user.email}</span>
            <small>Sở thích: {user.preferences?.favoriteGenres?.join(', ') || 'Chưa thiết lập'}</small>
          </div>
        ))}
      </div>
    </article>
  );
}

export default UserManagement;
