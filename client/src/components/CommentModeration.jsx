import React, { useEffect, useState } from 'react';
import { apiClient } from '../services/api.js';

function CommentModeration() {
  const [comments, setComments] = useState([]);
  const [form, setForm] = useState({ gameId: 'g1', userId: 'u1', rating: 5, content: '' });

  const fetchComments = () => {
    apiClient.fetchComments().then(setComments);
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await apiClient.createComment({
      ...form,
      rating: Number(form.rating)
    });
    setForm((prev) => ({ ...prev, content: '' }));
    fetchComments();
  };

  const handleDelete = async (commentId) => {
    await apiClient.deleteComment(commentId);
    setComments((prev) => prev.filter((comment) => comment.id !== commentId));
  };

  return (
    <article className="card">
      <div>
        <h2>💬 Bình luận & đánh giá</h2>
        <p className="description">
          Quản lý phản hồi người chơi, thêm mới và kiểm duyệt bình luận tiêu cực.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <label>
          Game ID
          <input name="gameId" value={form.gameId} onChange={handleChange} />
        </label>
        <label>
          User ID
          <input name="userId" value={form.userId} onChange={handleChange} />
        </label>
        <label>
          Rating
          <input name="rating" type="number" min="1" max="5" value={form.rating} onChange={handleChange} />
        </label>
        <label>
          Nội dung
          <textarea name="content" rows="2" value={form.content} onChange={handleChange} />
        </label>
        <button type="submit">Đăng bình luận</button>
      </form>

      <div className="results">
        {comments.map((comment) => (
          <div key={comment.id} className="flex-column">
            <strong>
              {comment.userName} • {comment.rating ? `⭐ ${comment.rating}` : 'Chưa đánh giá'}
            </strong>
            <span>{comment.content}</span>
            <small>{new Date(comment.createdAt).toLocaleString()}</small>
            <button type="button" onClick={() => handleDelete(comment.id)}>
              Xóa
            </button>
          </div>
        ))}
      </div>
    </article>
  );
}

export default CommentModeration;
