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
  const [externalKeyword, setExternalKeyword] = useState('');
  const [externalResults, setExternalResults] = useState([]);
  const [externalMetadata, setExternalMetadata] = useState(null);
  const [externalLoading, setExternalLoading] = useState(false);
  const [externalError, setExternalError] = useState('');
  const [selectedExternalGame, setSelectedExternalGame] = useState(null);
  const [detailLoadingId, setDetailLoadingId] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setQuery((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = async (event) => {
    event.preventDefault();
    const data = await apiClient.searchGames(query);
    setResults(data);
  };

  const handleExternalKeywordChange = (event) => {
    setExternalKeyword(event.target.value);
  };

  const handleExternalSearch = async (event) => {
    event.preventDefault();
    const keyword = externalKeyword.trim();
    if (!keyword) {
      setExternalError('Vui lòng nhập từ khóa trước khi tìm kiếm API RAWG.');
      setExternalResults([]);
      setExternalMetadata(null);
      setSelectedExternalGame(null);
      return;
    }

    setExternalLoading(true);
    setExternalError('');
    setSelectedExternalGame(null);

    try {
      const data = await apiClient.searchExternalGames({ query: keyword });
      const safeResults = data.results || [];
      const safeSource = data.source || 'rawg';
      const safeTotal = Number.isFinite(data.total) ? data.total : safeResults.length;

      setExternalResults(safeResults);
      setExternalMetadata({ source: safeSource, total: safeTotal });
      if (safeResults.length === 0) {
        setExternalError('Không tìm thấy game phù hợp. Hãy thử từ khóa khác.');
      }
    } catch (error) {
      const message =
        error.response?.data?.error ||
        error.message ||
        'Không thể kết nối tới API RAWG. Vui lòng kiểm tra cấu hình server.';
      setExternalError(message);
      setExternalResults([]);
      setExternalMetadata(null);
    } finally {
      setExternalLoading(false);
    }
  };

  const handleSelectExternalGame = async (gameId) => {
    setDetailLoadingId(gameId);
    setExternalError('');

    try {
      const detail = await apiClient.fetchExternalGameDetails(gameId);
      setSelectedExternalGame(detail);
    } catch (error) {
      const message =
        error.response?.data?.error ||
        error.message ||
        'Không thể tải chi tiết game từ API RAWG.';
      setExternalError(message);
    } finally {
      setDetailLoadingId(null);
    }
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

      <section className="external-section">
        <h3>🌐 Kết nối dữ liệu game từ RAWG</h3>
        <p className="description">
          Liên kết trực tiếp với API RAWG.io để tìm kiếm thông tin game thực tế, hình ảnh và điểm đánh giá mới nhất.
        </p>

        <form className="external-form" onSubmit={handleExternalSearch}>
          <label>
            Từ khóa (tiếng Anh)
            <input
              value={externalKeyword}
              onChange={handleExternalKeywordChange}
              placeholder="Ví dụ: The Witcher 3"
            />
          </label>
          <button type="submit" disabled={externalLoading || !externalKeyword.trim()}>
            {externalLoading ? 'Đang tìm...' : 'Gọi RAWG API'}
          </button>
        </form>

        <span className="external-hint">
          Cần cấu hình biến môi trường <code>RAWG_API_KEY</code> ở server (xem README) để sử dụng dữ liệu thật.
        </span>

        {externalError && <p className="status error">{externalError}</p>}
        {externalMetadata && !externalError && (
          <p className="status">
            Nguồn: {externalMetadata.source === 'rawg' ? 'RAWG.io' : 'Dữ liệu mô phỏng'} • Tổng {externalMetadata.total}{' '}
            kết quả
          </p>
        )}

        <div className="external-results">
          {externalLoading ? (
            <span>Đang tải dữ liệu từ RAWG...</span>
          ) : externalResults.length === 0 ? (
            <span>Nhập từ khóa tiếng Anh để bắt đầu đồng bộ dữ liệu game từ RAWG.</span>
          ) : (
            externalResults.map((game) => {
              const ratingLabel = Number.isFinite(game.rating) ? game.rating.toFixed(1) : 'Chưa có';
              return (
                <div key={game.id} className="external-card">
                  {game.thumbnail && (
                    <img src={game.thumbnail} alt={`Ảnh bìa ${game.title}`} loading="lazy" />
                  )}
                  <div className="external-card__content">
                    <strong>{game.title}</strong>
                    <small>Phát hành: {game.released || 'Đang cập nhật'}</small>
                    <small>
                      Nền tảng: {game.platforms && game.platforms.length > 0 ? game.platforms.join(', ') : 'Đang cập nhật'}
                    </small>
                    <small>
                      ⭐ {ratingLabel}
                      {Number.isFinite(game.metacritic) && ` • Metacritic ${game.metacritic}`}
                    </small>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSelectExternalGame(game.id)}
                    disabled={detailLoadingId === game.id}
                  >
                    {detailLoadingId === game.id ? 'Đang tải...' : 'Xem chi tiết'}
                  </button>
                </div>
              );
            })
          )}
        </div>

        {selectedExternalGame && (
          <div className="external-details">
            <h4>{selectedExternalGame.title}</h4>
            {selectedExternalGame.thumbnail && (
              <img src={selectedExternalGame.thumbnail} alt={`Ảnh chi tiết ${selectedExternalGame.title}`} />
            )}
            <p>{selectedExternalGame.description || 'Không có mô tả chi tiết.'}</p>
            <ul>
              {selectedExternalGame.released && (
                <li>
                  <strong>Phát hành:</strong> {selectedExternalGame.released}
                </li>
              )}
              {Number.isFinite(selectedExternalGame.rating) && (
                <li>
                  <strong>Điểm người chơi:</strong> ⭐ {selectedExternalGame.rating}
                  {Number.isFinite(selectedExternalGame.ratingsCount) && ` (${selectedExternalGame.ratingsCount} đánh giá)`}
                </li>
              )}
              {Number.isFinite(selectedExternalGame.metacritic) && (
                <li>
                  <strong>Metacritic:</strong> {selectedExternalGame.metacritic}
                </li>
              )}
              {selectedExternalGame.genres && selectedExternalGame.genres.length > 0 && (
                <li>
                  <strong>Thể loại:</strong> {selectedExternalGame.genres.join(', ')}
                </li>
              )}
              {selectedExternalGame.platforms && selectedExternalGame.platforms.length > 0 && (
                <li>
                  <strong>Nền tảng:</strong> {selectedExternalGame.platforms.join(', ')}
                </li>
              )}
              {selectedExternalGame.esrbRating && (
                <li>
                  <strong>ESRB:</strong> {selectedExternalGame.esrbRating}
                </li>
              )}
              {selectedExternalGame.publishers && selectedExternalGame.publishers.length > 0 && (
                <li>
                  <strong>Nhà phát hành:</strong> {selectedExternalGame.publishers.join(', ')}
                </li>
              )}
              {selectedExternalGame.developers && selectedExternalGame.developers.length > 0 && (
                <li>
                  <strong>Đơn vị phát triển:</strong> {selectedExternalGame.developers.join(', ')}
                </li>
              )}
              {selectedExternalGame.tags && selectedExternalGame.tags.length > 0 && (
                <li>
                  <strong>Tag nổi bật:</strong> {selectedExternalGame.tags.join(', ')}
                </li>
              )}
              {selectedExternalGame.website && (
                <li>
                  <strong>Website:</strong>{' '}
                  <a href={selectedExternalGame.website} target="_blank" rel="noreferrer">
                    {selectedExternalGame.website}
                  </a>
                </li>
              )}
            </ul>

            <div>
              <strong>Liên kết mua game:</strong>
              {selectedExternalGame.stores && selectedExternalGame.stores.length > 0 ? (
                <ul className="store-links">
                  {selectedExternalGame.stores.map((store) => (
                    <li key={store.id || store.name}>
                      {store.url ? (
                        <a href={store.url} target="_blank" rel="noreferrer">
                          🛒 {store.name}
                        </a>
                      ) : (
                        <span className="disabled-link">🛒 {store.name}</span>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <small>Chưa có thông tin cửa hàng khả dụng.</small>
              )}
            </div>
          </div>
        )}
      </section>
    </article>
  );
}

export default AdvancedSearch;
