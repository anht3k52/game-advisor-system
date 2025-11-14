import { useEffect, useState } from 'react'

function ReviewBoard ({ games, onFetchReviews, onCreateReview }) {
  const [selectedGame, setSelectedGame] = useState('')
  const [reviews, setReviews] = useState([])
  const [form, setForm] = useState({ userName: '', rating: '', comment: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!selectedGame) return
    async function loadReviews () {
      setLoading(true)
      setError(null)
      try {
        const data = await onFetchReviews({ gameId: selectedGame })
        setReviews(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    loadReviews()
  }, [selectedGame, onFetchReviews])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!selectedGame) return
    setLoading(true)
    setError(null)
    try {
      const review = await onCreateReview({
        gameId: selectedGame,
        userName: form.userName,
        rating: Number(form.rating),
        comment: form.comment
      })
      setReviews((prev) => [review, ...prev])
      setForm({ userName: '', rating: '', comment: '' })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2>Quản lý bình luận & đánh giá</h2>
      <select value={selectedGame} onChange={(event) => setSelectedGame(event.target.value)}>
        <option value="">Chọn game</option>
        {games.map((game) => (
          <option key={game.id} value={game.id}>{game.title}</option>
        ))}
      </select>

      <form onSubmit={handleSubmit}>
        <input name="userName" placeholder="Tên người dùng" value={form.userName} onChange={handleChange} required />
        <input name="rating" placeholder="Điểm (1-5)" value={form.rating} onChange={handleChange} required />
        <textarea name="comment" placeholder="Nhận xét" rows="3" value={form.comment} onChange={handleChange} />
        <button type="submit" disabled={!selectedGame || loading}>Gửi đánh giá</button>
      </form>

      {error && <p className="empty-state">{error}</p>}
      {loading && <p className="empty-state">Đang tải...</p>}

      <div className="list">
        {reviews.length === 0 && <div className="empty-state">Chưa có đánh giá</div>}
        {reviews.map((review) => (
          <div key={review.id} className="list-item">
            <strong>{review.userName}</strong>
            <div>Điểm: {review.rating}</div>
            <div>{review.comment}</div>
            <div className="badge">{new Date(review.createdAt).toLocaleString('vi-VN')}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ReviewBoard
