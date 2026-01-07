import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [isLoading, setIsLoading] = useState(true);

  // On mount, check if user has a saved token
  useEffect(() => {
    if (token) {
      // Token exists, set user from token payload (decode JWT)
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({ _id: payload._id, username: payload.username });
      } catch (error) {
        console.error('Invalid token:', error);
        logout();
      }
    }
    setIsLoading(false);
  }, []);

  // Signup function
  async function signup(username, password) {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      // Store token and user
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data.user);

      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  // Login function
  async function login(username, password) {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store token and user
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data.user);

      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  // Logout function
  function logout() {
    localStorage.removeItem('token');
    setToken('');
    setUser(null);
  }

  const value = {
    user,
    token,
    isLoading,
    signup,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
