import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Feed() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="feed-page">
      <header className="app-header">
        <h1>🥁 Drum Kit Social</h1>
        <div className="user-info">
          <span>Welcome, {user?.username}!</span>
          <button onClick={logout} className="btn-secondary">
            Logout
          </button>
        </div>
      </header>

      <main className="feed-container">
        <h2>Drummer Feed</h2>
        <p>This is where all the drummer posts will appear!</p>
        <p className="placeholder-text">
          Phase 2 will add the ability to create and view drummer posts.
        </p>
      </main>
    </div>
  );
}
