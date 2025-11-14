import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { useAuth } from '../context/AuthContext.jsx';
import { createComment, deleteComment, fetchComments, updateComment } from '../services/commentApi.js';

export default function CommentSection({ targetType, targetId, initialComments = [] }) {
  const { user } = useAuth();
  const [comments, setComments] = useState(initialComments);
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setComments(initialComments);
  }, [initialComments]);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchComments(targetType, targetId);
        setComments(data.comments || []);
      } catch (error) {
        console.error(error);
      }
    }

    if (targetType && targetId) {
      load();
    }
  }, [targetType, targetId]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!content.trim()) return;

    try {
      setLoading(true);
      if (editingId) {
        const { comment } = await updateComment(editingId, content);
        setComments((items) => items.map((item) => (item._id === editingId ? comment : item)));
        setEditingId(null);
      } else {
        const { comment } = await createComment({ targetType, targetId, content });
        setComments((items) => [comment, ...items]);
      }
      setContent('');
    } catch (error) {
      console.error(error);
      alert('Unable to submit comment. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await deleteComment(id);
      setComments((items) => items.filter((item) => item._id !== id));
    } catch (error) {
      console.error(error);
      alert('Unable to delete comment.');
    }
  }

  function startEdit(comment) {
    setEditingId(comment._id);
    setContent(comment.content);
  }

  return (
    <section className="comments">
      <h3>Comments</h3>
      {user ? (
        <form onSubmit={handleSubmit} className="comment-form">
          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Share your thoughts"
            rows={4}
          />
          <div className="comment-actions">
            {editingId && (
              <button type="button" onClick={() => setEditingId(null)}>
                Cancel
              </button>
            )}
            <button type="submit" className="btn-primary" disabled={loading}>
              {editingId ? 'Update comment' : 'Post comment'}
            </button>
          </div>
        </form>
      ) : (
        <p>Please log in to leave a comment.</p>
      )}

      <ul className="comment-list">
        {comments.map((comment) => (
          <li key={comment._id}>
            <header>
              <strong>{comment.user?.fullName || 'User'}</strong>
              <span>{dayjs(comment.createdAt).format('DD/MM/YYYY HH:mm')}</span>
            </header>
            <p>{comment.content}</p>
            {user && comment.user && comment.user._id === user._id && (
              <div className="comment-controls">
                <button type="button" onClick={() => startEdit(comment)}>
                  Edit
                </button>
                <button type="button" onClick={() => handleDelete(comment._id)}>
                  Delete
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
