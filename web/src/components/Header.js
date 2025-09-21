import React from 'react';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      logout();
    }
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'Admin':
        return 'role-badge admin';
      case 'Editor':
        return 'role-badge editor';
      case 'Viewer':
        return 'role-badge viewer';
      default:
        return 'role-badge';
    }
  };

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-left">
          <h1>🏐 Volleyball Team Creator</h1>
          <p>Assemble your volleyball teams and manage player assignments</p>
        </div>
        
        {user && (
          <div className="header-right">
            <div className="user-info">
              <div className="user-details">
                <span className="user-name">
                  {user.firstName} {user.lastName}
                </span>
                <span className="user-username">@{user.username}</span>
              </div>
              <span className={getRoleBadgeClass(user.role)}>
                {user.role}
              </span>
            </div>
            <button 
              onClick={handleLogout}
              className="logout-button"
              title="Logout"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;