import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './NavBar.css';

export default function NavBar() {
  const { user, logout, notifications, unreadMessages } = useApp();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1>MarketHub</h1>
        {/* Next: "Add logo image" */}
      </div>
      <div className="navbar-actions">
        <button className="navbar-button navbar-button-primary">
          <span className="material-symbols-outlined navbar-button-icon">home</span>
          Home
        </button>
        <button className="navbar-button navbar-button-secondary">
          <span className="material-symbols-outlined navbar-button-icon">explore</span>
          Explore
          {/* Next: "Add categories dropdown" */}
        </button>
        <button className="navbar-button navbar-button-secondary">
          <span className="material-symbols-outlined navbar-button-icon">add_circle</span>
          Post Item
        </button>
      </div>
      <div className="navbar-actions-right">
        <div className="navbar-search">
          <input
            type="text"
            placeholder="Search marketplace..."
          />
          <span className="material-symbols-outlined navbar-search-icon">search</span>
        </div>
        <button className="navbar-icon-button">
          <span className="material-symbols-outlined">notifications</span>
          {/* Next: "Add notification counter badge" */}
        </button>
        <button className="navbar-icon-button">
          <span className="material-symbols-outlined">person</span>
        </button>
      </div>
    </nav>
  );
}