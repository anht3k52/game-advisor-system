import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import RecommendationCenter from '../components/RecommendationCenter.jsx';
import AdvancedSearch from '../components/AdvancedSearch.jsx';
import GameComparison from '../components/GameComparison.jsx';
import { apiClient } from '../services/api.js';

const INITIAL_AUTH = {
  name: '',
  email: '',
  password: ''
};

function UserPortal({ session, onLogin, onLogout, isAdmin }) {
  const isAuthenticated = Boolean(session?.user);
  const [authMode, setAuthMode] = useState('login');
  const [authForm, setAuthForm] = useState(INITIAL_AUTH);
  const [authError, setAuthError] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);

  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [postError, setPostError] = useState(null);
  const [selectedPostId, setSelectedPostId] = useState(null);

  const [commentDraft, setCommentDraft] = useState('');
  const [commentError, setCommentError] = useState(null);
  const [commentLoading, setCommentLoading] = useState(false);
  const [postComments, setPostComments] = useState([]);

  const selectedPost = useMemo(() => {
    if (!selectedPostId && posts.length > 0) {
      return posts[0];
    }
    return posts.find((post) => post.id === selectedPostId) || null;
  }, [posts, selectedPostId]);

  const loadPosts = async () => {
    setPostsLoading(true);
    setPostError(null);
    try {
      const data = await apiClient.fetchPosts();
      setPosts(data);
      if (data.length > 0 && !selectedPostId) {
        setSelectedPostId(data[0].id);
      }
    } catch (error) {
      setPostError(error.response?.data?.error || error.message);
    } finally {
      setPostsLoading(false);
    }
  };

  const loadComments = async (postId) => {
    if (!postId) {
      setPostComments([]);
      return;
    }
    setCommentError(null);
    try {
      const data = await apiClient.fetchPostComments(postId);
      setPostComments(data);
    } catch (error) {
      setCommentError(error.response?.data?.error || error.message);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  useEffect(() => {
    if (selectedPost) {
      loadComments(selectedPost.id);
    }
  }, [selectedPost?.id, session?.token]);

  const handleAuthChange = (event) => {
    const { name, value } = event.target;
    setAuthForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAuthSubmit = async (event) => {
    event.preventDefault();
    setAuthLoading(true);
    setAuthError(null);

    try {
      if (authMode === 'register') {
        const result = await apiClient.register(authForm);
        onLogin(result);
      } else {
        const result = await apiClient.login(authForm);
        onLogin(result);
      }
      setAuthForm(INITIAL_AUTH);
    } catch (error) {
      setAuthError(error.response?.data?.error || error.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleCommentSubmit = async (event) => {
    event.preventDefault();
    if (!selectedPost) {
      return;
    }
    setCommentLoading(true);
    setCommentError(null);
    try {
      await apiClient.createPostComment(selectedPost.id, { content: commentDraft });
      setCommentDraft('');
      await loadComments(selectedPost.id);
    } catch (error) {
      setCommentError(error.response?.data?.error || error.message);
    } finally {
      setCommentLoading(false);
    }
  };

  return (
    <div className="page-shell user-portal">
      <header className="page-header">
        <div>
          <p className="eyebrow">Hệ thống tư vấn game</p>
          <h1>Trải nghiệm người chơi với tư vấn cá nhân hóa</h1>
          <p className="lead">
            Đăng ký tài khoản, khám phá bài viết chuyên sâu, nhận gợi ý game phù hợp và thảo luận cùng cộng đồng.
          </p>
        </div>
        <nav className="page-links">
          {isAdmin && (
            <Link to="/admin" className="link-button secondary">
              Đến trang quản trị
            </Link>
          )}
        </nav>
      </header>

      <section className="panel-grid">
        <article className="card auth-card">
          <div className="card-header">
            <h2>{isAuthenticated ? 'Tài khoản của bạn' : 'Đăng nhập / Đăng ký'}</h2>
            {!isAuthenticated && (
              <div className="tabs">
                <button
                  type="button"
                  className={authMode === 'login' ? 'active' : ''}
                  onClick={() => setAuthMode('login')}
                >
                  Đăng nhập
                </button>
                <button
                  type="button"
                  className={authMode === 'register' ? 'active' : ''}
                  onClick={() => setAuthMode('register')}
                >
                  Tạo tài khoản
                </button>
              </div>
            )}
          </div>

          {isAuthenticated ? (
            <div className="account-box">
              <div>
                <strong>{session.user.name}</strong>
                <p>{session.user.email}</p>
                <span className="badge">Vai trò: {session.user.role === 'admin' ? 'Quản trị' : 'Người dùng'}</span>
              </div>
              <button type="button" className="link-button" onClick={onLogout}>
                Đăng xuất
              </button>
            </div>
          ) : (
            <form onSubmit={handleAuthSubmit} className="stack">
              {authMode === 'register' && (
                <label>
                  Họ tên
                  <input
                    name="name"
                    value={authForm.name}
                    onChange={handleAuthChange}
                    placeholder="Ví dụ: Nguyễn Minh Anh"
                    required
                  />
                </label>
              )}
              <label>
                Email
                <input
                  name="email"
                  type="email"
                  value={authForm.email}
                  onChange={handleAuthChange}
                  placeholder="ban@example.com"
                  required
                />
              </label>
              <label>
                Mật khẩu
                <input
                  name="password"
                  type="password"
                  value={authForm.password}
                  onChange={handleAuthChange}
                  placeholder="Nhập mật khẩu"
                  required
                />
              </label>
              {authError && <p className="error-text">{authError}</p>}
              <button type="submit" disabled={authLoading}>
                {authLoading ? 'Đang xử lý...' : authMode === 'register' ? 'Tạo tài khoản' : 'Đăng nhập'}
              </button>
            </form>
          )}
        </article>

        <article className="card posts-card">
          <div className="card-header">
            <h2>Bài viết mới</h2>
            <p className="description">Theo dõi tin tức, hướng dẫn và đánh giá game từ đội ngũ biên tập.</p>
          </div>
          {postError && <p className="error-text">{postError}</p>}
          {postsLoading ? (
            <p>Đang tải bài viết...</p>
          ) : (
            <div className="posts-layout">
              <aside>
                <ul className="post-list">
                  {posts.map((post) => (
                    <li key={post.id}>
                      <button
                        type="button"
                        className={selectedPost?.id === post.id ? 'active' : ''}
                        onClick={() => setSelectedPostId(post.id)}
                      >
                        <strong>{post.title}</strong>
                        <span>{new Date(post.createdAt).toLocaleDateString('vi-VN')}</span>
                      </button>
                    </li>
                  ))}
                  {posts.length === 0 && <li>Chưa có bài viết.</li>}
                </ul>
              </aside>
              <div className="post-preview">
                {selectedPost ? (
                  <>
                    {selectedPost.coverUrl && <img src={selectedPost.coverUrl} alt={selectedPost.title} />}
                    <h3>{selectedPost.title}</h3>
                    <p className="summary">{selectedPost.summary}</p>
                    <p>{selectedPost.content}</p>
                    {selectedPost.tags?.length > 0 && (
                      <div className="tag-group">
                        {selectedPost.tags.map((tag) => (
                          <span key={tag} className="badge">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <p>Chọn một bài viết để xem chi tiết.</p>
                )}
              </div>
            </div>
          )}
        </article>

        <article className="card comments-card">
          <div className="card-header">
            <h2>Thảo luận</h2>
            <p className="description">Chia sẻ cảm nhận của bạn về bài viết hiện tại.</p>
          </div>
          {commentError && <p className="error-text">{commentError}</p>}
          {selectedPost ? (
            <>
              <form onSubmit={handleCommentSubmit} className="stack">
                <textarea
                  value={commentDraft}
                  onChange={(event) => setCommentDraft(event.target.value)}
                  placeholder={isAuthenticated ? 'Nhập bình luận của bạn...' : 'Đăng nhập để bình luận'}
                  disabled={!isAuthenticated}
                  rows={3}
                  required
                />
                <button type="submit" disabled={!isAuthenticated || commentLoading}>
                  {commentLoading ? 'Đang gửi...' : 'Gửi bình luận'}
                </button>
              </form>
              <div className="comment-list">
                {postComments.length === 0 && <p>Chưa có bình luận nào.</p>}
                {postComments.map((comment) => (
                  <div key={comment.id} className="comment-item">
                    <div>
                      <strong>{comment.userName}</strong>
                      <time>{new Date(comment.createdAt).toLocaleString('vi-VN')}</time>
                    </div>
                    <p>{comment.content}</p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p>Hãy chọn một bài viết để bắt đầu bình luận.</p>
          )}
        </article>
      </section>

      <section className="panel-grid">
        <RecommendationCenter />
        <AdvancedSearch />
        <GameComparison />
      </section>
    </div>
  );
}

export default UserPortal;
