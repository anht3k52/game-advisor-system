import React, { useState } from 'react';
import { apiClient } from '../services/api.js';

const INITIAL_QUERY = {
  keyword: '',
  genre: '',
  platform: '',
  minRating: 4,
  maxPrice: 60,
  releaseYear: '',
  tag: ''
};

function AdvancedSearch() {
  const [query, setQuery] = useState(INITIAL_QUERY);
  const [results, setResults] = useState([]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setQuery((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = async (event) => {
    event.preventDefault();
    const data = await apiClient.searchGames(query);
    setResults(data);
  };

  return (
    <article className="card">
      <div>
        <h2>🔍 Tìm kiếm nâng cao</h2>
        <p className="description">
          Lọc theo từ khóa, thể loại, rating, giá và tag để tìm game phù hợp nhất.
        </p>
      </div>

      <form onSubmit={handleSearch}>
        <label>
          Từ khóa
          <input name="keyword" value={query.keyword} onChange={handleChange} placeholder="Nhập tên game" />
        </label>
        <label>
          Thể loại
          <input name="genre" value={query.genre} onChange={handleChange} />
        </label>
        <label>
          Nền tảng
          <input name="platform" value={query.platform} onChange={handleChange} />
        </label>
        <label>
          Rating tối thiểu
          <input name="minRating" type="number" step="0.1" min="0" max="5" value={query.minRating} onChange={handleChange} />
        </label>
        <label>
          Giá tối đa
          <input name="maxPrice" type="number" min="0" value={query.maxPrice} onChange={handleChange} />
        </label>
        <label>
          Năm phát hành
          <input name="releaseYear" type="number" value={query.releaseYear} onChange={handleChange} />
        </label>
        <label>
          Tag
          <input name="tag" value={query.tag} onChange={handleChange} />
        </label>
        <button type="submit">Lọc kết quả</button>
      </form>

      <div className="results">
        {results.length === 0 ? (
          <span>Chưa có kết quả. Hãy thử bộ lọc khác nhé!</span>
        ) : (
          results.map((game) => (
            <div key={game.id} className="flex-column">
              <strong>{game.title}</strong>
              <small>
                {game.genre} • {game.platform.join(', ')} • ⭐ {game.rating}
              </small>
              <span>${game.price}</span>
            </div>
          ))
        )}
      </div>
    </article>
  );
}

export default AdvancedSearch;
