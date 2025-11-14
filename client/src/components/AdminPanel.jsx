function AdminPanel ({ stats, activity }) {
  return (
    <div>
      <h2>Quản trị hệ thống</h2>
      {!stats && <div className="empty-state">Đang tải thông tin thống kê...</div>}
      {stats && (
        <div className="list">
          <div className="list-item">
            <div><strong>Người dùng</strong>: {stats.totalUsers}</div>
            <div><strong>Game</strong>: {stats.totalGames}</div>
            <div><strong>Đánh giá</strong>: {stats.totalReviews}</div>
            <div><strong>Điểm trung bình</strong>: {stats.averageRating}</div>
          </div>
        </div>
      )}

      <div className="section-divider">Hoạt động gần đây</div>
      <div className="list">
        {activity.length === 0 && <div className="empty-state">Chưa có dữ liệu</div>}
        {activity.map((review) => (
          <div key={review.id} className="list-item">
            <strong>{review.userName}</strong>
            <div>Điểm: {review.rating}</div>
            <div>{review.comment}</div>
            <div className="badge">{new Date(review.createdAt).toLocaleString('vi-VN')}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdminPanel
