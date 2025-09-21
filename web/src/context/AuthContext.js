import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on app start
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const profile = await authService.getProfile();
          setUser({
            username: profile.username,
            email: profile.email,
            firstName: profile.first_name,
            lastName: profile.last_name,
            role: profile.role,
            id: profile.id
          });
        } catch (err) {
          console.error('Failed to get user profile:', err);
          localStorage.removeItem('authToken');
          localStorage.removeItem('userProfile');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (username, password) => {
    try {
      setError(null);
      setLoading(true);
      
      const response = await authService.login(username, password);
      
      if (response.access_token) {
        localStorage.setItem('authToken', response.access_token);
        
        // Get user profile after login
        const profile = await authService.getProfile();
        const userData = {
          username: profile.username,
          email: profile.email,
          firstName: profile.first_name,
          lastName: profile.last_name,
          role: profile.role,
          id: profile.id
        };
        
        setUser(userData);
        localStorage.setItem('userProfile', JSON.stringify(userData));
        return true;
      } else {
        throw new Error('Login failed');
      }
    } catch (err) {
      setError('Invalid username or password');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setError(null);
  };

  const hasRole = (requiredRole) => {
    if (!user) return false;
    
    const roleHierarchy = {
      'Admin': 3,
      'Editor': 2,
      'Viewer': 1
    };
    
    const userRoleLevel = roleHierarchy[user.role] || 0;
    const requiredRoleLevel = roleHierarchy[requiredRole] || 0;
    
    return userRoleLevel >= requiredRoleLevel;
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    hasRole,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};