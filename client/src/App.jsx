import React from 'react';
import UserManagement from './components/UserManagement.jsx';
import GameManagement from './components/GameManagement.jsx';
import RecommendationCenter from './components/RecommendationCenter.jsx';
import AdvancedSearch from './components/AdvancedSearch.jsx';
import GameComparison from './components/GameComparison.jsx';
import CommentModeration from './components/CommentModeration.jsx';
import AdminPanel from './components/AdminPanel.jsx';

function App() {
  return (
    <div className="app-shell">
      <header>
        <h1>🎮 Hệ thống tư vấn game</h1>
        <p>
          Kiến trúc React + Node.js với các module quản trị, gợi ý thông minh và trải nghiệm người dùng toàn diện.
        </p>
      </header>

      <section className="grid modules-grid">
        <UserManagement />
        <GameManagement />
        <RecommendationCenter />
        <AdvancedSearch />
        <GameComparison />
        <CommentModeration />
        <AdminPanel />
      </section>
    </div>
  );
}

export default App;
