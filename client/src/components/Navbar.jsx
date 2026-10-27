import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  Compass,
  Info,
  PenSquare,
  LayoutDashboard,
  User,
  LogOut,
  Sun,
  Moon,
  Search,
  X,
  Menu,
  Sparkles,
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import { getAvatarUrl } from '../utils/formatters';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { showToast } = useToast();

  const location = useLocation();
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Explore', path: '/posts', icon: Compass },
    { name: 'About', path: '/about', icon: Info },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleSearch = (event) => {
    event.preventDefault();

    if (searchQuery.trim()) {
      navigate(`/posts?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileOpen(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      showToast('Signed out successfully');
      setMobileOpen(false);
      navigate('/');
    } catch (error) {
      showToast(error?.message || 'Unable to sign out');
    }
  };

  const closeMobileMenu = () => setMobileOpen(false);

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          className="vv-sidebar-backdrop"
          onClick={closeMobileMenu}
          aria-label="Close navigation"
        />
      )}

      <aside className={`vv-global-sidebar ${mobileOpen ? 'is-open' : ''}`}>
        {/* VibeVlog Logo */}
        <div className="vv-sidebar-brand-row">

          <Link
            to="/"
            className="vv-global-brand"
            onClick={closeMobileMenu}
            aria-label="VibeVlog Home"
          >
            <img
              src={
                theme === 'dark'
                ? '/VibeVlogdark.png'
                : '/VibeVloglight.png'
              }
              alt="VibeVlog"
              className="vv-global-brand-image"
            />
          </Link>

          <button
            type="button"
            className="vv-sidebar-close"
            onClick={closeMobileMenu}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search */}
        <form className="vv-sidebar-search" onSubmit={handleSearch}>
          <Search size={17} />

          <input
            type="search"
            placeholder="Search..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            aria-label="Search stories"
          />
        </form>

        {/* Navigation */}
        <nav className="vv-global-nav" aria-label="Main navigation">
          <p className="vv-global-nav-heading">Discover</p>

          {navLinks.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={closeMobileMenu}
                className={`vv-global-nav-link ${
                  isActive(item.path) ? 'active' : ''
                }`}
              >
                <Icon size={19} />
                <span>{item.name}</span>
              </Link>
            );
          })}

          <p className="vv-global-nav-heading vv-global-nav-spaced">
            Your Space
          </p>

          {isAuthenticated ? (
            <>
              <Link
                to="/create-post"
                onClick={closeMobileMenu}
                className={`vv-global-nav-link ${
                  location.pathname === '/create-post' ? 'active' : ''
                }`}
              >
                <PenSquare size={19} />
                <span>Create Story</span>
              </Link>

              <Link
                to="/dashboard"
                onClick={closeMobileMenu}
                className={`vv-global-nav-link ${
                  location.pathname.startsWith('/dashboard') ? 'active' : ''
                }`}
              >
                <LayoutDashboard size={19} />
                <span>Dashboard</span>
              </Link>

              <Link
                to="/profile"
                onClick={closeMobileMenu}
                className={`vv-global-nav-link ${
                  location.pathname.startsWith('/profile') ? 'active' : ''
                }`}
              >
                <User size={19} />
                <span>My Profile</span>
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={closeMobileMenu}
                className="vv-global-nav-link"
              >
                <User size={19} />
                <span>Sign In</span>
              </Link>

              <Link
                to="/register"
                onClick={closeMobileMenu}
                className="vv-global-nav-link"
              >
                <Sparkles size={19} />
                <span>Get Started</span>
              </Link>
            </>
          )}
        </nav>

        {/* Sidebar Bottom */}
        <div className="vv-global-sidebar-bottom">
          {isAuthenticated && user && (
            <div className="vv-sidebar-user">
              <img
                src={getAvatarUrl(user)}
                alt={user.name || 'User'}
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.style.visibility = 'hidden';
                }}
              />

              <div className="vv-sidebar-user-info">
                <span>{user.name || user.username || 'VibeVlog User'}</span>
                <small>Member</small>
              </div>
            </div>
          )}

          <button
            type="button"
            className="vv-global-nav-link vv-theme-button"
            onClick={toggleTheme}
          >
            {theme === 'dark' ? (
              <Sun size={19} />
            ) : (
              <Moon size={19} />
            )}

            <span>
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </span>
          </button>

          {isAuthenticated && (
            <button
              type="button"
              className="vv-global-nav-link vv-logout-button"
              onClick={handleLogout}
            >
              <LogOut size={19} />
              <span>Sign Out</span>
            </button>
          )}
        </div>
      </aside>

      {/* Mobile Menu Button */}
      <button
        type="button"
        className="vv-mobile-menu-button"
        onClick={() => setMobileOpen(true)}
        aria-label="Open navigation"
      >
        <Menu size={22} />
      </button>
    </>
  );
};

export default Navbar;
