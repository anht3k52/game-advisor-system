import { useState } from 'react'

function GameComparison ({ games, onCompare }) {
  const [selected, setSelected] = useState([])
  const [comparison, setComparison] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const toggleGame = (gameId) => {
    setSelected((prev) =>
      prev.includes(gameId)
        ? prev.filter((id) => id !== gameId)
        : [...prev, gameId]
    )
  }

  const handleCompare = async () => {
    if (selected.length === 0) return
    setLoading(true)
    setError(null)
    try {
      const { comparison: result } = await onCompare({ gameIds: selected })
      setComparison(result)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2>So sánh game</h2>
      <div className="list">
        {games.map((game) => (
          <label key={game.id} className="list-item" style={{ display: 'block', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={selected.includes(game.id)}
              onChange={() => toggleGame(game.id)}
            />{' '}
            {game.title}
          </label>
        ))}
      </div>
      <button onClick={handleCompare} disabled={selected.length === 0 || loading}>So sánh</button>
      {error && <p className="empty-state">{error}</p>}

      <div className="section-divider">Kết quả so sánh</div>
      {comparison.length === 0 && <div className="empty-state">Chọn game để so sánh</div>}
      {comparison.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Tiêu chí</th>
              {comparison.map((game) => (
                <th key={game.id}>{game.title}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Thể loại</td>
              {comparison.map((game) => <td key={`${game.id}-genre`}>{game.genre}</td>)}
            </tr>
            <tr>
              <td>Điểm số</td>
              {comparison.map((game) => <td key={`${game.id}-rating`}>{game.rating}</td>)}
            </tr>
            <tr>
              <td>Giá</td>
              {comparison.map((game) => <td key={`${game.id}-price`}>${game.price}</td>)}
            </tr>
            <tr>
              <td>Nền tảng</td>
              {comparison.map((game) => <td key={`${game.id}-platforms`}>{game.platforms.join(', ')}</td>)}
            </tr>
            <tr>
              <td>Tags</td>
              {comparison.map((game) => <td key={`${game.id}-tags`}>{game.tags.join(', ')}</td>)}
            </tr>
          </tbody>
        </table>
      )}
    </div>
  )
}

export default GameComparison
