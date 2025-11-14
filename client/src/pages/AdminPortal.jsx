import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PostManagement from '../components/PostManagement.jsx';
import UserManagement from '../components/UserManagement.jsx';
import GameManagement from '../components/GameManagement.jsx';
import CommentModeration from '../components/CommentModeration.jsx';
import AdminPanel from '../components/AdminPanel.jsx';
import { apiClient } from '../services/api.js';

const INITIAL_LOGIN = {
  email: '',
  password: ''
};

function AdminPortal({ session, onLogin, onLogout, isAdmin }) {
  const [authForm, setAuthForm] = useState(INITIAL_LOGIN);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setAuthForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const result = await apiClient.login(authForm);
      if (result.user.role !== 'admin') {
        setError('Tài khoản này không có quyền quản trị.');
        return;
      }
      onLogin(result);
      setAuthForm(INITIAL_LOGIN);
    } catch (requestError) {
      setError(requestError.response?.data?.error || requestError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell admin-portal">
      <header className="page-header">
        <div>
          <p className="eyebrow">Bảng điều khiển quản trị</p>
          <h1>Điều phối nội dung và người dùng hệ thống tư vấn game</h1>
          <p className="lead">
            Quản trị viên có thể quản lý bài viết, người dùng, bình luận và theo dõi số liệu tổng quan của nền tảng.
          </p>
        </div>
        <nav className="page-links">
          <Link to="/" className="link-button secondary">
            Quay lại trang người dùng
          </Link>
        </nav>
      </header>

      {!isAdmin ? (
        <section className="panel-grid">
          <article className="card auth-card">
            <div className="card-header">
              <h2>Đăng nhập quản trị viên</h2>
              <p className="description">Chỉ tài khoản có vai trò quản trị mới truy cập được khu vực này.</p>
            </div>
            <form onSubmit={handleSubmit} className="stack">
              <label>
                Email
                <input
                  name="email"
                  type="email"
                  value={authForm.email}
                  onChange={handleChange}
                  placeholder="admin@example.com"
                  required
                />
              </label>
              <label>
                Mật khẩu
                <input
                  name="password"
                  type="password"
                  value={authForm.password}
                  onChange={handleChange}
                  placeholder="Nhập mật khẩu"
                  required
                />
              </label>
              {error && <p className="error-text">{error}</p>}
              <button type="submit" disabled={loading}>
                {loading ? 'Đang kiểm tra...' : 'Đăng nhập'}
              </button>
            </form>
            {session?.user && session.user.role !== 'admin' && (
              <p className="hint">Bạn đã đăng nhập bằng tài khoản người dùng. Hãy đăng xuất và thử lại với tài khoản admin.</p>
            )}
          </article>
        </section>
      ) : (
        <>
          <section className="panel-grid">
            <article className="card auth-card">
              <div className="card-header">
                <h2>Tài khoản quản trị</h2>
              </div>
              <div className="account-box">
                <div>
                  <strong>{session.user.name}</strong>
                  <p>{session.user.email}</p>
                  <span className="badge accent">Quản trị viên</span>
                </div>
                <button type="button" className="link-button" onClick={onLogout}>
                  Đăng xuất
                </button>
              </div>
            </article>
            <AdminPanel />
          </section>

          <section className="panel-grid">
            <PostManagement />
            <UserManagement />
          </section>

          <section className="panel-grid">
            <GameManagement />
            <CommentModeration />
          </section>
        </>
      )}
    </div>
  );
}

export default AdminPortal;
