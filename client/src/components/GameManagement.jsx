import { useState } from 'react'

function GameManagement ({ games, onCreateGame, filters }) {
  const [form, setForm] = useState({
    title: '',
    genre: '',
    platforms: '',
    rating: '',
    price: '',
    tags: '',
    description: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await onCreateGame({
        title: form.title,
        genre: form.genre,
        platforms: form.platforms.split(',').map((item) => item.trim()).filter(Boolean),
        rating: form.rating ? Number(form.rating) : 0,
        price: form.price ? Number(form.price) : 0,
        tags: form.tags.split(',').map((item) => item.trim()).filter(Boolean),
        description: form.description
      })
      setForm({ title: '', genre: '', platforms: '', rating: '', price: '', tags: '', description: '' })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2>Quản lý game</h2>
      <p className="section-divider">Thêm game mới</p>
      <form onSubmit={handleSubmit}>
        <input name="title" placeholder="Tên game" value={form.title} onChange={handleChange} required />
        <select name="genre" value={form.genre} onChange={handleChange} required>
          <option value="">Chọn thể loại</option>
          {filters.genres.map((genre) => (
            <option key={genre} value={genre}>{genre}</option>
          ))}
        </select>
        <input name="platforms" placeholder="Nền tảng (cách nhau bởi dấu phẩy)" value={form.platforms} onChange={handleChange} />
        <input name="rating" placeholder="Điểm số (0-5)" value={form.rating} onChange={handleChange} />
        <input name="price" placeholder="Giá" value={form.price} onChange={handleChange} />
        <input name="tags" placeholder="Tags nổi bật" value={form.tags} onChange={handleChange} />
        <textarea name="description" placeholder="Mô tả ngắn" rows="3" value={form.description} onChange={handleChange} />
        <button type="submit" disabled={loading}>{loading ? 'Đang lưu...' : 'Thêm game'}</button>
        {error && <p className="empty-state">{error}</p>}
      </form>

      <p className="section-divider">Danh sách game</p>
      <div className="list">
        {games.length === 0 && <div className="empty-state">Chưa có game nào</div>}
        {games.map((game) => (
          <div key={game.id} className="list-item">
            <strong>{game.title}</strong>
            <div>Thể loại: {game.genre}</div>
            <div>Nền tảng: {game.platforms.join(', ')}</div>
            <div>Giá: ${game.price}</div>
            <div>Đánh giá: {game.rating}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default GameManagement
