import { useState } from 'react'

function RecommendationCenter ({ users, onFetchForUser, onFetchAnonymous, onFetchSimilar }) {
  const [selectedUser, setSelectedUser] = useState('')
  const [selectedGame, setSelectedGame] = useState('')
  const [anonymousPrefs, setAnonymousPrefs] = useState({ genres: '', platforms: '', budget: '' })
  const [recommendations, setRecommendations] = useState([])
  const [similarGames, setSimilarGames] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleFetchForUser = async () => {
    if (!selectedUser) return
    setLoading(true)
    setError(null)
    try {
      const { recommendations: recs } = await onFetchForUser(selectedUser)
      setRecommendations(recs)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAnonymous = async () => {
    setLoading(true)
    setError(null)
    try {
      const payload = {
        genres: anonymousPrefs.genres.split(',').map((item) => item.trim()).filter(Boolean),
        platforms: anonymousPrefs.platforms.split(',').map((item) => item.trim()).filter(Boolean),
        budget: anonymousPrefs.budget ? Number(anonymousPrefs.budget) : null
      }
      const { recommendations: recs } = await onFetchAnonymous(payload)
      setRecommendations(recs)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSimilarGames = async () => {
    if (!selectedGame) return
    setLoading(true)
    setError(null)
    try {
      const { similar } = await onFetchSimilar(selectedGame)
      setSimilarGames(similar)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2>Tư vấn game thông minh</h2>
      <div className="section-divider">Gợi ý theo người dùng</div>
      <select value={selectedUser} onChange={(event) => setSelectedUser(event.target.value)}>
        <option value="">Chọn người dùng</option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>{user.name}</option>
        ))}
      </select>
      <button onClick={handleFetchForUser} disabled={!selectedUser || loading}>Gợi ý cho người dùng</button>

      <div className="section-divider">Gợi ý nhanh</div>
      <input
        placeholder="Thể loại ưa thích"
        value={anonymousPrefs.genres}
        onChange={(event) => setAnonymousPrefs((prev) => ({ ...prev, genres: event.target.value }))}
      />
      <input
        placeholder="Nền tảng yêu thích"
        value={anonymousPrefs.platforms}
        onChange={(event) => setAnonymousPrefs((prev) => ({ ...prev, platforms: event.target.value }))}
      />
      <input
        placeholder="Ngân sách tối đa"
        value={anonymousPrefs.budget}
        onChange={(event) => setAnonymousPrefs((prev) => ({ ...prev, budget: event.target.value }))}
      />
      <button onClick={handleAnonymous} disabled={loading}>Gợi ý cho khách</button>

      <div className="section-divider">Game tương tự</div>
      <input
        placeholder="ID game để tìm tương tự"
        value={selectedGame}
        onChange={(event) => setSelectedGame(event.target.value)}
      />
      <button onClick={handleSimilarGames} disabled={!selectedGame || loading}>Tìm game tương tự</button>

      {error && <p className="empty-state">{error}</p>}
      {loading && <p className="empty-state">Đang tải dữ liệu...</p>}

      <div className="section-divider">Kết quả gợi ý</div>
      <div className="list">
        {recommendations.length === 0 && <div className="empty-state">Chưa có dữ liệu gợi ý</div>}
        {recommendations.map((game) => (
          <div key={game.id} className="list-item">
            <strong>{game.title}</strong>
            {game.score && <span className="badge">Điểm {game.score}</span>}
            <div>Thể loại: {game.genre}</div>
            <div>Giá: ${game.price}</div>
            <div>Đánh giá: {game.rating}</div>
          </div>
        ))}
      </div>

      <div className="section-divider">Game tương tự</div>
      <div className="list">
        {similarGames.length === 0 && <div className="empty-state">Chưa có dữ liệu</div>}
        {similarGames.map((game) => (
          <div key={game.id} className="list-item">
            <strong>{game.title}</strong>
            <span className="badge">Similarity {game.similarityScore?.toFixed(2)}</span>
            <div>Thể loại: {game.genre}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RecommendationCenter
