import { useEffect, useState } from 'react'
import {
  fetchUsers,
  createUser,
  fetchGames,
  createGame,
  fetchAnonymousRecommendations,
  fetchRecommendationsForUser,
  fetchSimilarGames,
  searchGames,
  fetchSearchFilters,
  compareGames,
  fetchReviews,
  createReview,
  fetchAdminStats,
  fetchAdminActivity
} from './api/client.js'
import UserManagement from './components/UserManagement.jsx'
import GameManagement from './components/GameManagement.jsx'
import RecommendationCenter from './components/RecommendationCenter.jsx'
import AdvancedSearch from './components/AdvancedSearch.jsx'
import GameComparison from './components/GameComparison.jsx'
import ReviewBoard from './components/ReviewBoard.jsx'
import AdminPanel from './components/AdminPanel.jsx'

function App () {
  const [users, setUsers] = useState([])
  const [games, setGames] = useState([])
  const [filters, setFilters] = useState({ genres: [], platforms: [] })
  const [adminStats, setAdminStats] = useState(null)
  const [adminActivity, setAdminActivity] = useState([])

  useEffect(() => {
    async function bootstrap () {
      const [usersData, gamesData, filterData, statsData, activityData] = await Promise.all([
        fetchUsers(),
        fetchGames(),
        fetchSearchFilters(),
        fetchAdminStats(),
        fetchAdminActivity()
      ])
      setUsers(usersData)
      setGames(gamesData)
      setFilters(filterData)
      setAdminStats(statsData)
      setAdminActivity(activityData.recentReviews)
    }
    bootstrap()
  }, [])

  const handleCreateUser = async (payload) => {
    const newUser = await createUser(payload)
    setUsers((prev) => [...prev, newUser])
  }

  const handleCreateGame = async (payload) => {
    const newGame = await createGame(payload)
    setGames((prev) => [...prev, newGame])
  }

  return (
    <div className="app-container">
      <header>
        <h1>Hệ thống tư vấn game</h1>
        <p>Quản lý game, người chơi và gợi ý thông minh trong một nền tảng duy nhất.</p>
      </header>

      <div className="modules-grid">
        <div className="module-card">
          <UserManagement users={users} onCreateUser={handleCreateUser} />
        </div>
        <div className="module-card">
          <GameManagement games={games} onCreateGame={handleCreateGame} filters={filters} />
        </div>
        <div className="module-card">
          <RecommendationCenter
            users={users}
            onFetchForUser={fetchRecommendationsForUser}
            onFetchAnonymous={fetchAnonymousRecommendations}
            onFetchSimilar={fetchSimilarGames}
          />
        </div>
        <div className="module-card">
          <AdvancedSearch filters={filters} onSearch={searchGames} />
        </div>
        <div className="module-card">
          <GameComparison games={games} onCompare={compareGames} />
        </div>
        <div className="module-card">
          <ReviewBoard games={games} onFetchReviews={fetchReviews} onCreateReview={createReview} />
        </div>
        <div className="module-card">
          <AdminPanel stats={adminStats} activity={adminActivity} />
        </div>
      </div>
    </div>
  )
}

export default App
