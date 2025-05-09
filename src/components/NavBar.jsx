import { useState, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './NavBar.css';

export default function NavBar() {
  const { user, logout, notifications, unreadMessages, setGlobalSearchTerm, globalSearchTerm } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const searchInputRef = useRef();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const unreadNotifications = notifications.filter(n => !n.read).length;

  // Navigation button active state
  const isActive = (path) => location.pathname === path;

  // Search logic: update global search term in context
  const handleSearchChange = (e) => {
    setGlobalSearchTerm(e.target.value);
  };

  // Notification dropdown toggle
  const handleNotificationClick = () => {
    setShowNotifications((prev) => !prev);
    setShowUserMenu(false);
  };

  // User menu dropdown toggle
  const handleUserClick = () => {
    setShowUserMenu((prev) => !prev);
    setShowNotifications(false);
  };

  // Close dropdowns on outside click
  const handleBlur = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setShowNotifications(false);
      setShowUserMenu(false);
    }
  };

  return (
    <nav className="navbar" tabIndex={-1} onBlur={handleBlur}>
      <div className="navbar-brand">
        <h1 className="navbar-logo">Bread Market</h1>
      </div>
      <div className="navbar-actions">
        <button
          className={`navbar-button ${isActive('/') ? 'navbar-button-active' : ''}`}
          onClick={() => navigate('/')}
        >
          <span className="material-symbols-outlined navbar-button-icon">home</span>
          Home
        </button>
        <button
          className={`navbar-button ${isActive('/posts/create') ? 'navbar-button-active' : ''}`}
          onClick={() => navigate('/posts/create')}
        >
          <span className="material-symbols-outlined navbar-button-icon">add_circle</span>
          Post Item
        </button>
      </div>
      <div className="navbar-actions-right">
        <div className="navbar-search">
          <span className="material-symbols-outlined navbar-search-icon">search</span>
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search marketplace..."
            value={globalSearchTerm || ''}
            onChange={handleSearchChange}
          />
        </div>
        <div className="navbar-dropdown-wrapper">
          <button className="navbar-icon-button navbar-icon-notification" onClick={handleNotificationClick} tabIndex={0}>
            <span className="material-symbols-outlined">notifications</span>
            {unreadNotifications > 0 && (
              <span className="navbar-badge">{unreadNotifications}</span>
            )}
          </button>
          {showNotifications && (
            <div className="navbar-dropdown navbar-dropdown-notifications">
              <div className="navbar-dropdown-header">Notifications</div>
              {notifications.length === 0 ? (
                <div className="navbar-dropdown-empty">No notifications</div>
              ) : (
                notifications.slice(0, 5).map((n) => (
                  <div key={n._id} className={`navbar-dropdown-item${n.read ? '' : ' navbar-dropdown-item-unread'}`}>{n.message}</div>
                ))
              )}
              <Link to="/notifications" className="navbar-dropdown-footer" onClick={()=>setShowNotifications(false)}>
                View all
              </Link>
            </div>
          )}
        </div>
        <div className="navbar-dropdown-wrapper">
          <button className="navbar-icon-button navbar-icon-profile" onClick={handleUserClick} tabIndex={0}>
            <span className="material-symbols-outlined">person</span>
          </button>
          {showUserMenu && (
            <div className="navbar-dropdown navbar-dropdown-user">
              <div className="navbar-dropdown-header">{user ? user.username : 'Guest'}</div>
              {user ? (
                <>
                  <Link to="/profile" className="navbar-dropdown-item" onClick={()=>setShowUserMenu(false)}>Profile</Link>
                  <button className="navbar-dropdown-item" onClick={handleLogout}>Logout</button>
                </>
              ) : (
                <Link to="/login" className="navbar-dropdown-item" onClick={()=>setShowUserMenu(false)}>Login</Link>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}