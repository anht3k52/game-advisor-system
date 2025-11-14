import React, { useState } from 'react';
import { apiClient } from '../services/api.js';

const DEFAULT_PREFS = {
  favoriteGenres: 'RPG, Strategy',
  preferredPlatforms: 'PC, PlayStation',
  budget: 60,
  playStyles: 'story-rich, tactical'
};

function RecommendationCenter() {
  const [preferences, setPreferences] = useState(DEFAULT_PREFS);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setPreferences((prev) => ({ ...prev, [name]: value }));
  };

  const buildPayload = () => ({
    preferences: {
      favoriteGenres: preferences.favoriteGenres.split(',').map((item) => item.trim()).filter(Boolean),
      preferredPlatforms: preferences.preferredPlatforms.split(',').map((item) => item.trim()).filter(Boolean),
      budget: Number(preferences.budget),
      playStyles: preferences.playStyles.split(',').map((item) => item.trim()).filter(Boolean)
    }
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const payload = buildPayload();
      const result = await apiClient.recommend(payload.preferences);
      setRecommendations(result);
    } finally {
      setLoading(false);
    }
  };

  return (
    <article className="card">
      <div>
        <h2>🤖 Tư vấn game thông minh</h2>
        <p className="description">
          Công cụ AI Recommendation giúp tìm game phù hợp dựa trên sở thích, ngân sách và nền tảng.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <label>
          Thể loại ưu tiên
          <input name="favoriteGenres" value={preferences.favoriteGenres} onChange={handleChange} />
        </label>
        <label>
          Nền tảng sử dụng
          <input name="preferredPlatforms" value={preferences.preferredPlatforms} onChange={handleChange} />
        </label>
        <label>
          Ngân sách tối đa
          <input name="budget" type="number" value={preferences.budget} onChange={handleChange} />
        </label>
        <label>
          Phong cách chơi
          <input name="playStyles" value={preferences.playStyles} onChange={handleChange} />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? 'Đang phân tích...' : 'Gợi ý ngay'}
        </button>
      </form>

      <div className="results">
        {recommendations.length === 0 && <span>Chưa có gợi ý. Điền thông tin để bắt đầu!</span>}
        {recommendations.map((game) => (
          <div key={game.id} className="flex-column">
            <strong>{game.title}</strong>
            <span>⭐ {game.rating} / 5</span>
            <div className="tag-group">
              {game.tags.map((tag) => (
                <span key={tag} className="badge">
                  #{tag}
                </span>
              ))}
            </div>
            <small>
              {game.genre} • {game.platform.join(', ')} • ${game.price}
            </small>
          </div>
        ))}
      </div>
    </article>
  );
}

export default RecommendationCenter;
