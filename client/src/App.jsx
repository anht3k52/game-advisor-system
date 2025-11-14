import { Link, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import ArticleDetailPage from './pages/ArticleDetailPage.jsx';
import GameListPage from './pages/GameListPage.jsx';
import GameDetailPage from './pages/GameDetailPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import AdvancedSearchPage from './pages/AdvancedSearchPage.jsx';
import GameComparisonPage from './pages/GameComparisonPage.jsx';
import AdminDashboardPage from './pages/admin/AdminDashboardPage.jsx';
import AdminUsersPage from './pages/admin/AdminUsersPage.jsx';
import AdminArticlesPage from './pages/admin/AdminArticlesPage.jsx';
import AdminCommentsPage from './pages/admin/AdminCommentsPage.jsx';
import { useAuth } from './context/AuthContext.jsx';
import RecommendationsSection from './components/RecommendationsSection.jsx';

function Layout() {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="app-shell">
      <header className="app-header">
        <nav className="nav">
          <Link to="/" className="brand">
            Game Advisor
          </Link>
          <div className="nav-links">
            <Link to="/games">Games</Link>
            <Link to="/search">Advanced Search</Link>
            <Link to="/compare">Compare</Link>
            {user && user.role === 'admin' && <Link to="/admin">Admin</Link>}
          </div>
          <div className="nav-auth">
            {user ? (
              <>
                <Link to="/profile" className="avatar">
                  {user.avatar ? <img src={user.avatar} alt={user.fullName} /> : user.fullName?.[0] || user.email?.[0] || "U"}
                </Link>
                <button type="button" onClick={logout} className="btn-link">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login">Login</Link>
                <Link to="/register" className="btn-primary">
                  Register
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
      {!location.pathname.startsWith('/admin') && (
        <aside className="app-sidebar">
          <RecommendationsSection />
        </aside>
      )}
      <footer className="app-footer">© {new Date().getFullYear()} Game Advisor System</footer>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="page-loader">Loading…</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="page-loader">Loading…</div>;
  }

  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="articles/:slug" element={<ArticleDetailPage />} />
        <Route path="games" element={<GameListPage />} />
        <Route path="games/:id" element={<GameDetailPage />} />
        <Route path="search" element={<AdvancedSearchPage />} />
        <Route path="compare" element={<GameComparisonPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<AdminDashboardPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="articles" element={<AdminArticlesPage />} />
          <Route path="comments" element={<AdminCommentsPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

function AdminLayout() {
  return (
    <div className="admin-shell">
      <nav className="admin-nav">
        <Link to="/admin">Dashboard</Link>
        <Link to="/admin/users">Users</Link>
        <Link to="/admin/articles">Articles</Link>
        <Link to="/admin/comments">Comments</Link>
      </nav>
      <section className="admin-content">
        <Outlet />
      </section>
    </div>
  );
}

function NotFoundPage() {
  return (
    <div className="page">
      <h1>Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link to="/" className="btn-primary">
        Go Home
      </Link>
    </div>
  );
}
