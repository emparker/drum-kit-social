import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { PostContext } from '../context/PostContext';
import CommentSection from './CommentSection';

export default function DrummerCard({ post }) {
  const { user } = useContext(AuthContext);
  const { toggleLike, toggleDislike } = useContext(PostContext);
  const [isVoting, setIsVoting] = useState(false);

  // Check if any drum kit fields are filled
  const hasKitInfo = post.drumKit && Object.values(post.drumKit).some(value => value);

  // Check if any add-ons are filled
  const hasAddOns = post.addOns && Object.values(post.addOns).some(value => value);

  // Check if current user has liked or disliked this post
  const hasLiked = post.likes?.includes(user?._id);
  const hasDisliked = post.dislikes?.includes(user?._id);

  // Handle like button click
  const handleLike = async () => {
    setIsVoting(true);
    await toggleLike(post._id);
    setIsVoting(false);
  };

  // Handle dislike button click
  const handleDislike = async () => {
    setIsVoting(true);
    await toggleDislike(post._id);
    setIsVoting(false);
  };

  return (
    <article className="drummer-card">
      {/* Header Section - Drummer Name */}
      <header className="card-header">
        <h3 className="drummer-name">{post.drummerName}</h3>
      </header>

      {/* Album Section - Prominently Displayed */}
      <div className="album-section">
        <span className="album-label">Album:</span>
        <h4 className="album-title">{post.album}</h4>
      </div>

      {/* Drum Kit Section */}
      {hasKitInfo && (
        <section className="kit-section">
          <h5 className="section-title">5-Piece Kit</h5>
          <div className="kit-grid">
            {post.drumKit.kickDrum && (
              <div className="kit-item">
                <span className="kit-label">Kick Drum:</span>
                <span className="kit-value">{post.drumKit.kickDrum}</span>
              </div>
            )}
            {post.drumKit.snare && (
              <div className="kit-item">
                <span className="kit-label">Snare:</span>
                <span className="kit-value">{post.drumKit.snare}</span>
              </div>
            )}
            {post.drumKit.rackTom1 && (
              <div className="kit-item">
                <span className="kit-label">Rack Tom 1:</span>
                <span className="kit-value">{post.drumKit.rackTom1}</span>
              </div>
            )}
            {post.drumKit.rackTom2 && (
              <div className="kit-item">
                <span className="kit-label">Rack Tom 2:</span>
                <span className="kit-value">{post.drumKit.rackTom2}</span>
              </div>
            )}
            {post.drumKit.floorTom && (
              <div className="kit-item">
                <span className="kit-label">Floor Tom:</span>
                <span className="kit-value">{post.drumKit.floorTom}</span>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Add-ons Section */}
      {hasAddOns && (
        <section className="addons-section">
          <h5 className="section-title">Add-ons</h5>
          <div className="addons-grid">
            {post.addOns.hiHats && (
              <div className="addon-item">
                <span className="addon-label">Hi-Hats:</span>
                <span className="addon-value">{post.addOns.hiHats}</span>
              </div>
            )}
            {post.addOns.rideCymbal && (
              <div className="addon-item">
                <span className="addon-label">Ride:</span>
                <span className="addon-value">{post.addOns.rideCymbal}</span>
              </div>
            )}
            {post.addOns.crashCymbal && (
              <div className="addon-item">
                <span className="addon-label">Crash:</span>
                <span className="addon-value">{post.addOns.crashCymbal}</span>
              </div>
            )}
            {post.addOns.hardware && (
              <div className="addon-item">
                <span className="addon-label">Hardware:</span>
                <span className="addon-value">{post.addOns.hardware}</span>
              </div>
            )}
            {post.addOns.effects && (
              <div className="addon-item">
                <span className="addon-label">Effects:</span>
                <span className="addon-value">{post.addOns.effects}</span>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Voting Section */}
      <section className="voting-section">
        <div className="vote-buttons">
          <button
            onClick={handleLike}
            disabled={isVoting}
            className={`vote-btn like-btn ${hasLiked ? 'active' : ''}`}
            aria-label="Like this post"
          >
            <span className="vote-icon">👍</span>
            <span className="vote-count">{post.likes?.length || 0}</span>
          </button>
          <button
            onClick={handleDislike}
            disabled={isVoting}
            className={`vote-btn dislike-btn ${hasDisliked ? 'active' : ''}`}
            aria-label="Dislike this post"
          >
            <span className="vote-icon">👎</span>
            <span className="vote-count">{post.dislikes?.length || 0}</span>
          </button>
        </div>
      </section>

      {/* Card Footer - Posted by */}
      <footer className="card-footer">
        <span className="posted-by">
          Posted by: <strong>{post.user?.username || 'Unknown'}</strong>
        </span>
      </footer>

      {/* Comments Section */}
      <CommentSection postId={post._id} />
    </article>
  );
}
