import { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';

export default function AppHeader() {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  return (
    <header className="app-header">
      <h1>🥁 Drum Kit Social</h1>

      <nav className="app-nav">
        <Link
          to="/feed"
          className={location.pathname === '/feed' ? 'nav-link active' : 'nav-link'}
        >
          Feed
        </Link>
        <Link
          to="/my-posts"
          className={location.pathname === '/my-posts' ? 'nav-link active' : 'nav-link'}
        >
          My Posts
        </Link>
      </nav>

      <div className="user-info">
        <span>Welcome, {user?.username}!</span>
        <ThemeToggle />
        <button onClick={logout} className="btn-secondary">
          Logout
        </button>
      </div>
    </header>
  );
}
