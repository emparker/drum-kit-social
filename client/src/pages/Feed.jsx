import { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { PostContext } from '../context/PostContext';
import ThemeToggle from '../components/ThemeToggle';
import DrummerCard from '../components/DrummerCard';

export default function Feed() {
  const { user, logout } = useContext(AuthContext);
  const { posts, isLoading, error, fetchAllPosts } = useContext(PostContext);

  // Fetch all posts on component mount
  useEffect(() => {
    fetchAllPosts();
  }, []);

  return (
    <div className="feed-page">
      <header className="app-header">
        <h1>🥁 Drum Kit Social</h1>
        <div className="user-info">
          <span>Welcome, {user?.username}!</span>
          <ThemeToggle />
          <button onClick={logout} className="btn-secondary">
            Logout
          </button>
        </div>
      </header>

      <main className="feed-container">
        <h2>Drummer Feed</h2>

        {/* Loading State */}
        {isLoading && <p className="placeholder-text">Loading posts...</p>}

        {/* Error State */}
        {error && <div className="error-message">{error}</div>}

        {/* Empty State */}
        {!isLoading && !error && posts.length === 0 && (
          <p className="placeholder-text">
            No posts yet! Be the first to share a drummer's kit configuration.
          </p>
        )}

        {/* Posts List */}
        {!isLoading && !error && posts.length > 0 && (
          <div className="posts-list">
            {posts.map((post) => (
              <DrummerCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
