import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { loginRequest, registerRequest, fetchCurrentUser } from '../services/authApi.js';

const AuthContext = createContext();

const TOKEN_KEY = 'game-advisor-token';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const data = await fetchCurrentUser(token);
        setUser(data.user);
      } catch (error) {
        console.error('Failed to load current user', error);
        setToken(null);
        setUser(null);
        localStorage.removeItem(TOKEN_KEY);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [token]);

  async function login(credentials) {
    const data = await loginRequest(credentials);
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem(TOKEN_KEY, data.token);
  }

  async function register(payload) {
    const data = await registerRequest(payload);
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem(TOKEN_KEY, data.token);
  }

  function logout() {
    setToken(null);
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
  }

  const value = useMemo(
    () => ({ user, token, loading, login, register, logout, setUser }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
