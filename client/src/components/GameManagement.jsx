import React, { useEffect, useState } from 'react';
import { apiClient } from '../services/api.js';

const DEFAULT_FORM = {
  title: '',
  genre: 'RPG',
  platform: 'PC',
  price: 0,
  tags: '',
  description: ''
};

function GameManagement() {
  const [games, setGames] = useState([]);
  const [form, setForm] = useState(DEFAULT_FORM);

  useEffect(() => {
    apiClient.fetchGames().then(setGames);
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      title: form.title,
      genre: form.genre,
      price: Number(form.price),
      description: form.description,
      tags: form.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
      platform: form.platform.split(',').map((platform) => platform.trim()).filter(Boolean)
    };

    const created = await apiClient.createGame(payload);
    setGames((prev) => [...prev, created]);
    setForm(DEFAULT_FORM);
  };

  return (
    <article className="card">
      <div>
        <h2>🗂️ Quản lý game</h2>
        <p className="description">
          Cập nhật kho game với thông tin chi tiết về thể loại, nền tảng và mô tả nổi bật.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <label>
          Tên game
          <input name="title" value={form.title} onChange={handleChange} required />
        </label>
        <label>
          Thể loại
          <input name="genre" value={form.genre} onChange={handleChange} required />
        </label>
        <label>
          Nền tảng (phân cách dấu phẩy)
          <input name="platform" value={form.platform} onChange={handleChange} required />
        </label>
        <label>
          Giá bán (USD)
          <input name="price" type="number" min="0" value={form.price} onChange={handleChange} />
        </label>
        <label>
          Thẻ mô tả (story-rich, co-op...)
          <input name="tags" value={form.tags} onChange={handleChange} />
        </label>
        <label>
          Mô tả
          <textarea name="description" rows="3" value={form.description} onChange={handleChange} />
        </label>
        <button type="submit">Thêm game</button>
      </form>

      <ul className="results">
        {games.map((game) => (
          <li key={game.id}>
            <strong>{game.title}</strong> – {game.genre} ({game.platform.join(', ')})
          </li>
        ))}
      </ul>
    </article>
  );
}

export default GameManagement;
