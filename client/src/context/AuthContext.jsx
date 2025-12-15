import React, { createContext, useState, useEffect } from 'react';
import API from '../api';

const AuthContext = createContext();

export { AuthContext };
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is logged in on app start
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token and get user info
      API.get('/users/profile')
        .then(response => {
          setUser(response.data);
          setIsAuthenticated(true);
        })
        .catch(error => {
          // Only log as error if it's not a 401 (unauthorized) error
          if (error.response?.status !== 401) {
            console.error('Token verification failed:', error);
          } else {
            console.log('Token expired or invalid, clearing authentication');
          }
          localStorage.removeItem('token');
          setUser(null);
          setIsAuthenticated(false);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (userData, token) => {
    try {
      localStorage.setItem('token', token);
      // Fetch fresh user data
      const response = await API.get('/users/profile');
      setUser(response.data);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error setting up user session:', error);
      localStorage.removeItem('token');
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
  };

  const updateUser = (userData) => {
    setUser(userData);
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 