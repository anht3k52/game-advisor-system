import React, { useEffect, useMemo, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import UserPortal from './pages/UserPortal.jsx';
import AdminPortal from './pages/AdminPortal.jsx';
import { apiClient } from './services/api.js';

const SESSION_KEY = 'game-advisor-session';

const loadSession = () => {
  if (typeof window === 'undefined') {
    return null;
  }
  const raw = window.localStorage.getItem(SESSION_KEY);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw);
  } catch (error) {
    console.warn('Không thể đọc phiên đăng nhập đã lưu.', error);
    return null;
  }
};

function App() {
  const [session, setSession] = useState(loadSession);

  useEffect(() => {
    apiClient.setAuthToken(session?.token ?? null);
    if (typeof window === 'undefined') {
      return;
    }
    if (session) {
      window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } else {
      window.localStorage.removeItem(SESSION_KEY);
    }
  }, [session]);

  const handleLogin = (value) => {
    if (!value) {
      return;
    }
    setSession({ token: value.token, user: value.user });
  };

  const handleLogout = async () => {
    try {
      await apiClient.logout();
    } catch (error) {
      console.warn('Không thể đăng xuất khỏi API, sẽ xóa phiên cục bộ.', error);
    } finally {
      setSession(null);
    }
  };

  const isAdmin = useMemo(() => session?.user?.role === 'admin', [session]);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<UserPortal session={session} onLogin={handleLogin} onLogout={handleLogout} isAdmin={isAdmin} />}
        />
        <Route
          path="/admin"
          element={<AdminPortal session={session} onLogin={handleLogin} onLogout={handleLogout} isAdmin={isAdmin} />}
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
