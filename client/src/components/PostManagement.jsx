import React, { useEffect, useMemo, useState } from 'react';
import { apiClient } from '../services/api.js';

const INITIAL_POST = {
  id: null,
  title: '',
  summary: '',
  content: '',
  tags: '',
  coverUrl: ''
};

function PostManagement() {
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState(INITIAL_POST);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isEditing = useMemo(() => Boolean(form.id), [form.id]);

  const loadPosts = async () => {
    setError(null);
    try {
      const data = await apiClient.fetchPosts();
      setPosts(data);
    } catch (requestError) {
      setError(requestError.response?.data?.error || requestError.message);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm(INITIAL_POST);
  };

  const buildPayload = () => ({
    title: form.title,
    summary: form.summary,
    content: form.content,
    tags: form.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean),
    coverUrl: form.coverUrl || null
  });

  const startEdit = (post) => {
    setForm({
      id: post.id,
      title: post.title,
      summary: post.summary,
      content: post.content,
      tags: post.tags?.join(', ') || '',
      coverUrl: post.coverUrl || ''
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isEditing) {
        await apiClient.updatePost(form.id, buildPayload());
      } else {
        await apiClient.createPost(buildPayload());
      }
      await loadPosts();
      resetForm();
    } catch (requestError) {
      setError(requestError.response?.data?.error || requestError.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId) => {
    setLoading(true);
    setError(null);
    try {
      await apiClient.deletePost(postId);
      await loadPosts();
      if (form.id === postId) {
        resetForm();
      }
    } catch (requestError) {
      setError(requestError.response?.data?.error || requestError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <article className="card">
      <div className="card-header">
        <h2>📝 Quản lý bài viết</h2>
        <p className="description">Tạo mới, cập nhật và quản lý nội dung hiển thị ở giao diện người dùng.</p>
      </div>

      <form onSubmit={handleSubmit} className="stack">
        <label>
          Tiêu đề
          <input name="title" value={form.title} onChange={handleChange} required />
        </label>
        <label>
          Tóm tắt
          <input name="summary" value={form.summary} onChange={handleChange} required />
        </label>
        <label>
          Nội dung
          <textarea name="content" rows={4} value={form.content} onChange={handleChange} required />
        </label>
        <label>
          Thẻ nội dung (phân cách dấu phẩy)
          <input name="tags" value={form.tags} onChange={handleChange} />
        </label>
        <label>
          Ảnh bìa (URL)
          <input name="coverUrl" value={form.coverUrl} onChange={handleChange} />
        </label>

        {error && <p className="error-text">{error}</p>}

        <div className="actions">
          <button type="submit" disabled={loading}>
            {loading ? 'Đang lưu...' : isEditing ? 'Cập nhật bài viết' : 'Đăng bài mới'}
          </button>
          {isEditing && (
            <button type="button" className="secondary" onClick={resetForm} disabled={loading}>
              Hủy chỉnh sửa
            </button>
          )}
        </div>
      </form>

      <div className="results post-table">
        <table>
          <thead>
            <tr>
              <th>Tiêu đề</th>
              <th>Ngày cập nhật</th>
              <th>Thẻ</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id}>
                <td>{post.title}</td>
                <td>{post.updatedAt ? new Date(post.updatedAt).toLocaleString('vi-VN') : '—'}</td>
                <td>{post.tags?.join(', ') || '—'}</td>
                <td className="row-actions">
                  <button type="button" onClick={() => startEdit(post)} disabled={loading}>
                    Sửa
                  </button>
                  <button type="button" className="danger" onClick={() => handleDelete(post.id)} disabled={loading}>
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr>
                <td colSpan={4} className="empty-state">
                  Chưa có bài viết nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </article>
  );
}

export default PostManagement;
