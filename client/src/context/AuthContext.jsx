import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Initialize and verify user on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const response = await authAPI.getMe();
        if (response.data?.success) {
          setUser(response.data.data);
        }
      } catch (err) {
        console.warn('Session expired or invalid, logging out:', err.message);
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Register function
  const register = async (userData) => {
    setLoading(true);
    setAuthError(null);
    try {
      const response = await authAPI.register(userData);
      const { token: receivedToken, ...userDataPayload } = response.data.data;
      localStorage.setItem('token', receivedToken);
      setToken(receivedToken);
      setUser(userDataPayload);
      return { success: true, user: userDataPayload };
    } catch (err) {
      setAuthError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (loginIdentifier, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      const response = await authAPI.login({ loginIdentifier, password });
      const { token: receivedToken, ...userDataPayload } = response.data.data;
      localStorage.setItem('token', receivedToken);
      setToken(receivedToken);
      setUser(userDataPayload);
      return { success: true, user: userDataPayload };
    } catch (err) {
      setAuthError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = useCallback(async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      // Ignore network errors on logout
    } finally {
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
    }
  }, []);

  // Update local user state
  const updateUser = (updatedFields) => {
    setUser((prev) => (prev ? { ...prev, ...updatedFields } : prev));
  };

  // Refresh user data from server
  const refreshUser = async () => {
    try {
      const response = await authAPI.getMe();
      if (response.data?.success) {
        setUser(response.data.data);
      }
    } catch (err) {
      console.error('Failed to refresh user:', err.message);
    }
  };

  const value = {
    user,
    token,
    loading,
    authError,
    isAuthenticated: !!user,
    register,
    login,
    logout,
    updateUser,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
