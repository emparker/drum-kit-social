import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PostContext } from '../context/PostContext';
import AppHeader from '../components/AppHeader';
import DrummerCard from '../components/DrummerCard';

export default function MyPosts() {
  const navigate = useNavigate();
  const { userPosts, isLoading, error, fetchUserPosts } = useContext(PostContext);

  // Fetch user's posts on component mount
  useEffect(() => {
    fetchUserPosts();
  }, []);

  return (
    <div className="feed-page">
      <AppHeader />

      <main className="feed-container">
        <div className="feed-header">
          <h2>My Posts</h2>
          <button
            onClick={() => navigate('/create')}
            className="btn-primary create-btn-desktop"
          >
            + Create Post
          </button>
        </div>

        {/* Loading State */}
        {isLoading && <p className="placeholder-text">Loading your posts...</p>}

        {/* Error State */}
        {error && <div className="error-message">{error}</div>}

        {/* Empty State */}
        {!isLoading && !error && userPosts.length === 0 && (
          <p className="placeholder-text">
            Be a real drummer and make that first post!
          </p>
        )}

        {/* Posts List */}
        {!isLoading && !error && userPosts.length > 0 && (
          <div className="posts-list">
            {userPosts.map((post) => (
              <DrummerCard
                key={post._id}
                post={post}
                isOwner={true}
                showEditControls={true}
              />
            ))}
          </div>
        )}

        {/* Floating Action Button (Mobile) */}
        <button
          onClick={() => navigate('/create')}
          className="fab"
          aria-label="Create Post"
        >
          +
        </button>
      </main>
    </div>
  );
}
