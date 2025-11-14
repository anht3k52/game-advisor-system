import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AdminPanel() {
  const [metrics, setMetrics] = useState({});
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  const fetchMetrics = async () => {
    const { data } = await axios.get('/api/admin/metrics');
    setMetrics(data);
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  const handleBroadcast = async (event) => {
    event.preventDefault();
    if (!message) return;
    const { data } = await axios.post('/api/admin/broadcast', { message });
    setStatus(`Đã gửi: "${data.message}"`);
    setMessage('');
  };

  return (
    <article className="card">
      <div>
        <h2>🛠️ Quản trị hệ thống</h2>
        <p className="description">
          Theo dõi số liệu tổng quan và gửi thông báo đến cộng đồng game thủ.
        </p>
      </div>

      <div className="results">
        <div className="flex-column">
          <strong>Người dùng</strong>
          <span>{metrics.totalUsers ?? '-'} người</span>
        </div>
        <div className="flex-column">
          <strong>Kho game</strong>
          <span>{metrics.totalGames ?? '-'} game</span>
        </div>
        <div className="flex-column">
          <strong>Bình luận</strong>
          <span>{metrics.totalComments ?? '-'} lượt</span>
        </div>
        <div className="flex-column">
          <strong>Điểm trung bình</strong>
          <span>{metrics.averageRating ?? '-'} ⭐</span>
        </div>
      </div>

      <form onSubmit={handleBroadcast}>
        <label>
          Gửi thông báo
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows="2" />
        </label>
        <button type="submit">Phát thông điệp</button>
      </form>

      {status && <span className="badge">{status}</span>}
    </article>
  );
}

export default AdminPanel;
