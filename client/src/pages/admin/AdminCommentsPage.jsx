import { useState } from 'react';
import { fetchAdminComments, moderateAdminComment } from '../../services/adminApi.js';

export default function AdminCommentsPage() {
  const [targetType, setTargetType] = useState('game');
  const [targetId, setTargetId] = useState('');
  const [comments, setComments] = useState([]);
  const [error, setError] = useState('');

  async function handleSearch(event) {
    event.preventDefault();
    try {
      setError('');
      const data = await fetchAdminComments(targetType, targetId);
      setComments(data.comments || []);
    } catch (err) {
      console.error(err);
      setError('Unable to load comments');
    }
  }

  async function toggleVisibility(id, isHidden) {
    try {
      const { comment } = await moderateAdminComment(id, { isHidden });
      setComments((items) => items.map((item) => (item._id === id ? comment : item)));
    } catch (err) {
      console.error(err);
      alert('Unable to moderate comment');
    }
  }

  return (
    <div className="admin-page">
      <h1>Moderate comments</h1>
      <form className="admin-form" onSubmit={handleSearch}>
        <select value={targetType} onChange={(event) => setTargetType(event.target.value)}>
          <option value="game">Game</option>
          <option value="article">Article</option>
        </select>
        <input value={targetId} onChange={(event) => setTargetId(event.target.value)} placeholder="Target ID" required />
        <button type="submit" className="btn-primary">
          Load comments
        </button>
      </form>
      {error && <p className="error">{error}</p>}
      <ul className="comment-list admin">
        {comments.map((comment) => (
          <li key={comment._id} className={comment.isHidden ? 'is-hidden' : ''}>
            <header>
              <strong>{comment.user?.fullName}</strong>
              <span>{new Date(comment.createdAt).toLocaleString()}</span>
            </header>
            <p>{comment.content}</p>
            <button type="button" onClick={() => toggleVisibility(comment._id, !comment.isHidden)}>
              {comment.isHidden ? 'Unhide' : 'Hide'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
