import { useState } from 'react'

function UserManagement ({ users, onCreateUser }) {
  const [form, setForm] = useState({ name: '', email: '', genres: '', platforms: '', budget: '' })
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
      await onCreateUser({
        name: form.name,
        email: form.email,
        preferences: {
          genres: form.genres.split(',').map((item) => item.trim()).filter(Boolean),
          platforms: form.platforms.split(',').map((item) => item.trim()).filter(Boolean),
          budget: form.budget ? Number(form.budget) : null
        }
      })
      setForm({ name: '', email: '', genres: '', platforms: '', budget: '' })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2>Quản lý người dùng</h2>
      <p className="section-divider">Thêm người dùng</p>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Họ tên" value={form.name} onChange={handleChange} required />
        <input name="email" placeholder="Email" type="email" value={form.email} onChange={handleChange} required />
        <input name="genres" placeholder="Sở thích thể loại (cách nhau bởi dấu phẩy)" value={form.genres} onChange={handleChange} />
        <input name="platforms" placeholder="Nền tảng ưa thích" value={form.platforms} onChange={handleChange} />
        <input name="budget" placeholder="Ngân sách tối đa" value={form.budget} onChange={handleChange} />
        <button type="submit" disabled={loading}>{loading ? 'Đang lưu...' : 'Thêm người dùng'}</button>
        {error && <p className="empty-state">{error}</p>}
      </form>

      <p className="section-divider">Danh sách người dùng</p>
      <div className="list">
        {users.length === 0 && <div className="empty-state">Chưa có người dùng</div>}
        {users.map((user) => (
          <div key={user.id} className="list-item">
            <strong>{user.name}</strong>
            <div>{user.email}</div>
            <div>
              Sở thích: {user.preferences?.genres?.join(', ') || 'Chưa cập nhật'}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default UserManagement
