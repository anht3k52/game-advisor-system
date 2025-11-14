import { useState } from 'react'

function AdvancedSearch ({ filters, onSearch }) {
  const [form, setForm] = useState({ query: '', genre: '', platform: '', minPrice: '', maxPrice: '' })
  const [results, setResults] = useState([])
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
      const response = await onSearch({
        query: form.query,
        genre: form.genre,
        platform: form.platform,
        minPrice: form.minPrice || undefined,
        maxPrice: form.maxPrice || undefined
      })
      setResults(response.results)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2>Tìm kiếm nâng cao</h2>
      <form onSubmit={handleSubmit}>
        <input name="query" placeholder="Từ khóa" value={form.query} onChange={handleChange} />
        <select name="genre" value={form.genre} onChange={handleChange}>
          <option value="">Tất cả thể loại</option>
          {filters.genres.map((genre) => (
            <option key={genre} value={genre}>{genre}</option>
          ))}
        </select>
        <select name="platform" value={form.platform} onChange={handleChange}>
          <option value="">Tất cả nền tảng</option>
          {filters.platforms.map((platform) => (
            <option key={platform} value={platform}>{platform}</option>
          ))}
        </select>
        <input name="minPrice" placeholder="Giá tối thiểu" value={form.minPrice} onChange={handleChange} />
        <input name="maxPrice" placeholder="Giá tối đa" value={form.maxPrice} onChange={handleChange} />
        <button type="submit" disabled={loading}>{loading ? 'Đang tìm...' : 'Tìm game'}</button>
      </form>

      {error && <p className="empty-state">{error}</p>}
      <div className="list">
        {loading && <div className="empty-state">Đang tìm kiếm...</div>}
        {!loading && results.length === 0 && <div className="empty-state">Không tìm thấy kết quả</div>}
        {results.map((game) => (
          <div key={game.id} className="list-item">
            <strong>{game.title}</strong>
            <div>{game.description}</div>
            <div>Giá: ${game.price} · Đánh giá: {game.rating}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdvancedSearch
