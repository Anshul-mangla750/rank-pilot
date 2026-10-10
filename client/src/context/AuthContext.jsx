import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    localStorage.removeItem('rp_token');
    localStorage.removeItem('rp_user');
    setUser(null);
  };

  useEffect(() => {
    const token = localStorage.getItem('rp_token');
    const savedUser = localStorage.getItem('rp_user');
    
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        // Verify token is still valid
        api.get('/auth/me')
          .then(res => {
            setUser(res.data.user);
            localStorage.setItem('rp_user', JSON.stringify(res.data.user));
          })
          .catch(() => {
            logout();
          })
          .finally(() => setLoading(false));
      } catch {
        logout();
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { user: userData, token } = res.data;
    localStorage.setItem('rp_token', token);
    localStorage.setItem('rp_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const register = async (name, email, password) => {
    const res = await api.post('/auth/register', { name, email, password });
    const { user: userData, token } = res.data;
    localStorage.setItem('rp_token', token);
    localStorage.setItem('rp_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
