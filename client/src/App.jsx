import { Link, NavLink, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import ArticleDetailPage from './pages/ArticleDetailPage.jsx';
import GameListPage from './pages/GameListPage.jsx';
import GameDetailPage from './pages/GameDetailPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import AdvancedSearchPage from './pages/AdvancedSearchPage.jsx';
import GameComparisonPage from './pages/GameComparisonPage.jsx';
import ChatAdvisorPage from './pages/ChatAdvisorPage.jsx';
import AdminDashboardPage from './pages/admin/AdminDashboardPage.jsx';
import AdminUsersPage from './pages/admin/AdminUsersPage.jsx';
import AdminArticlesPage from './pages/admin/AdminArticlesPage.jsx';
import AdminCommentsPage from './pages/admin/AdminCommentsPage.jsx';
import { useAuth } from './context/AuthContext.jsx';
import RecommendationsSection from './components/RecommendationsSection.jsx';
import { useLanguage } from './context/LanguageContext.jsx';

function Layout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const { t, language, setLanguage, availableLanguages } = useLanguage();

  return (
    <div className="app-shell">
      <header className="app-header">
        <nav className="nav">
          <Link to="/" className="brand">
            Game Advisor
          </Link>
          <div className="nav-links">
            <Link to="/games">{t('nav.games')}</Link>
            <Link to="/search">{t('nav.search')}</Link>
            <Link to="/compare">{t('nav.compare')}</Link>
            <Link to="/advisor">{t('nav.chatbot')}</Link>
            {user && user.role === 'admin' && (
              <Link to="/admin" className="nav-admin-link">
                {t('nav.admin')}
              </Link>
            )}
          </div>
          <div className="nav-language">
            <label htmlFor="language-select" className="sr-only">
              {t('nav.language')}
            </label>
            <select
              id="language-select"
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
            >
              {availableLanguages.map((option) => (
                <option key={option.code} value={option.code}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="nav-auth">
            {user ? (
              <>
                <Link to="/profile" className="avatar">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.fullName || user.username || user.email} />
                  ) : (
                    user.fullName?.[0] || user.username?.[0] || user.email?.[0] || 'U'
                  )}
                </Link>
                <button type="button" onClick={logout} className="btn-link">
                  {t('nav.logout')}
                </button>
              </>
            ) : (
              <>
                <Link to="/login">{t('nav.login')}</Link>
                <Link to="/register" className="btn-primary">
                  {t('nav.register')}
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
  const { t } = useLanguage();

  if (loading) {
    return <div className="page-loader">{t('common.loading')}</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  const { t } = useLanguage();

  if (loading) {
    return <div className="page-loader">{t('common.loading')}</div>;
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
        <Route path="advisor" element={<ChatAdvisorPage />} />
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
  const { t } = useLanguage();

  function navClass({ isActive }) {
    return `admin-nav-link${isActive ? ' active' : ''}`;
  }

  return (
    <div className="admin-shell">
      <nav className="admin-nav">
        <div className="admin-nav-header">
          <h2>{t('admin.layout.title')}</h2>
          <p>{t('admin.layout.subtitle')}</p>
        </div>
        <NavLink to="/admin" end className={navClass}>
          {t('admin.navigation.dashboard')}
        </NavLink>
        <NavLink to="/admin/users" className={navClass}>
          {t('admin.navigation.users')}
        </NavLink>
        <NavLink to="/admin/articles" className={navClass}>
          {t('admin.navigation.articles')}
        </NavLink>
        <NavLink to="/admin/comments" className={navClass}>
          {t('admin.navigation.comments')}
        </NavLink>
      </nav>
      <section className="admin-content">
        <Outlet />
      </section>
    </div>
  );
}

function NotFoundPage() {
  const { t } = useLanguage();

  return (
    <div className="page">
      <h1>{t('notFound.title')}</h1>
      <p>{t('notFound.description')}</p>
      <Link to="/" className="btn-primary">
        {t('notFound.cta')}
      </Link>
    </div>
  );
}
