import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { PostContext } from '../context/PostContext';
import CommentSection from './CommentSection';

export default function DrummerCard({ post, showEditControls = false, isOwner = false }) {
  const { user } = useContext(AuthContext);
  const { toggleLike, toggleDislike, updatePost, deletePost } = useContext(PostContext);
  const [isVoting, setIsVoting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form state for editing
  const [formData, setFormData] = useState({
    drummerName: post.drummerName || '',
    album: post.album || '',
    drumKit: {
      kickDrum: post.drumKit?.kickDrum || '',
      snare: post.drumKit?.snare || '',
      rackTom1: post.drumKit?.rackTom1 || '',
      rackTom2: post.drumKit?.rackTom2 || '',
      floorTom: post.drumKit?.floorTom || '',
    },
    addOns: {
      hiHats: post.addOns?.hiHats || '',
      rideCymbal: post.addOns?.rideCymbal || '',
      crashCymbal: post.addOns?.crashCymbal || '',
      hardware: post.addOns?.hardware || '',
      effects: post.addOns?.effects || '',
    },
  });

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

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle drum kit input changes
  const handleKitChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      drumKit: {
        ...prev.drumKit,
        [name]: value,
      },
    }));
  };

  // Handle add-ons input changes
  const handleAddOnChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      addOns: {
        ...prev.addOns,
        [name]: value,
      },
    }));
  };

  // Enter edit mode
  const handleEdit = () => {
    setIsEditing(true);
  };

  // Cancel editing and revert changes
  const handleCancel = () => {
    setFormData({
      drummerName: post.drummerName || '',
      album: post.album || '',
      drumKit: {
        kickDrum: post.drumKit?.kickDrum || '',
        snare: post.drumKit?.snare || '',
        rackTom1: post.drumKit?.rackTom1 || '',
        rackTom2: post.drumKit?.rackTom2 || '',
        floorTom: post.drumKit?.floorTom || '',
      },
      addOns: {
        hiHats: post.addOns?.hiHats || '',
        rideCymbal: post.addOns?.rideCymbal || '',
        crashCymbal: post.addOns?.crashCymbal || '',
        hardware: post.addOns?.hardware || '',
        effects: post.addOns?.effects || '',
      },
    });
    setIsEditing(false);
  };

  // Save changes
  const handleSave = async () => {
    if (!formData.drummerName.trim() || !formData.album.trim()) {
      alert('Drummer name and album are required!');
      return;
    }

    setIsSaving(true);
    const success = await updatePost(post._id, formData);
    setIsSaving(false);

    if (success) {
      setIsEditing(false);
    }
  };

  // Delete post with confirmation
  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete the post for ${post.drummerName} - ${post.album}? This action cannot be undone.`
    );

    if (confirmed) {
      await deletePost(post._id);
    }
  };

  return (
    <article className="drummer-card">
      {/* Header Section - Drummer Name */}
      <header className="card-header">
        {isEditing ? (
          <input
            type="text"
            name="drummerName"
            value={formData.drummerName}
            onChange={handleInputChange}
            className="edit-input edit-drummer-name"
            placeholder="Drummer Name"
            required
          />
        ) : (
          <h3 className="drummer-name">{post.drummerName}</h3>
        )}

        {/* Edit Controls (shown only on My Posts page) */}
        {showEditControls && (
          <div className="edit-controls">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="btn-primary btn-sm"
                >
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="btn-secondary btn-sm"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button onClick={handleEdit} className="btn-secondary btn-sm">
                  ✏️ Edit
                </button>
                <button onClick={handleDelete} className="btn-danger btn-sm">
                  🗑️ Delete
                </button>
              </>
            )}
          </div>
        )}
      </header>

      {/* Album Section - Prominently Displayed */}
      <div className="album-section">
        <span className="album-label">Album:</span>
        {isEditing ? (
          <input
            type="text"
            name="album"
            value={formData.album}
            onChange={handleInputChange}
            className="edit-input edit-album"
            placeholder="Album Name"
            required
          />
        ) : (
          <h4 className="album-title">{post.album}</h4>
        )}
      </div>

      {/* Drum Kit Section */}
      {(isEditing || hasKitInfo) && (
        <section className="kit-section">
          <h5 className="section-title">5-Piece Kit</h5>
          <div className="kit-grid">
            {/* Kick Drum */}
            <div className="kit-item">
              <span className="kit-label">Kick Drum:</span>
              {isEditing ? (
                <input
                  type="text"
                  name="kickDrum"
                  value={formData.drumKit.kickDrum}
                  onChange={handleKitChange}
                  className="edit-input kit-input"
                  placeholder="e.g., DW 22x18"
                />
              ) : post.drumKit.kickDrum ? (
                <span className="kit-value">{post.drumKit.kickDrum}</span>
              ) : null}
            </div>

            {/* Snare */}
            {(isEditing || post.drumKit.snare) && (
              <div className="kit-item">
                <span className="kit-label">Snare:</span>
                {isEditing ? (
                  <input
                    type="text"
                    name="snare"
                    value={formData.drumKit.snare}
                    onChange={handleKitChange}
                    className="edit-input kit-input"
                    placeholder="e.g., Ludwig 14x6.5"
                  />
                ) : (
                  <span className="kit-value">{post.drumKit.snare}</span>
                )}
              </div>
            )}

            {/* Rack Tom 1 */}
            {(isEditing || post.drumKit.rackTom1) && (
              <div className="kit-item">
                <span className="kit-label">Rack Tom 1:</span>
                {isEditing ? (
                  <input
                    type="text"
                    name="rackTom1"
                    value={formData.drumKit.rackTom1}
                    onChange={handleKitChange}
                    className="edit-input kit-input"
                    placeholder="e.g., Tama 10x8"
                  />
                ) : (
                  <span className="kit-value">{post.drumKit.rackTom1}</span>
                )}
              </div>
            )}

            {/* Rack Tom 2 */}
            {(isEditing || post.drumKit.rackTom2) && (
              <div className="kit-item">
                <span className="kit-label">Rack Tom 2:</span>
                {isEditing ? (
                  <input
                    type="text"
                    name="rackTom2"
                    value={formData.drumKit.rackTom2}
                    onChange={handleKitChange}
                    className="edit-input kit-input"
                    placeholder="e.g., Tama 12x9"
                  />
                ) : (
                  <span className="kit-value">{post.drumKit.rackTom2}</span>
                )}
              </div>
            )}

            {/* Floor Tom */}
            {(isEditing || post.drumKit.floorTom) && (
              <div className="kit-item">
                <span className="kit-label">Floor Tom:</span>
                {isEditing ? (
                  <input
                    type="text"
                    name="floorTom"
                    value={formData.drumKit.floorTom}
                    onChange={handleKitChange}
                    className="edit-input kit-input"
                    placeholder="e.g., Yamaha 16x16"
                  />
                ) : (
                  <span className="kit-value">{post.drumKit.floorTom}</span>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Add-ons Section */}
      {(isEditing || hasAddOns) && (
        <section className="addons-section">
          <h5 className="section-title">Add-ons</h5>
          <div className="addons-grid">
            {/* Hi-Hats */}
            {(isEditing || post.addOns.hiHats) && (
              <div className="addon-item">
                <span className="addon-label">Hi-Hats:</span>
                {isEditing ? (
                  <input
                    type="text"
                    name="hiHats"
                    value={formData.addOns.hiHats}
                    onChange={handleAddOnChange}
                    className="edit-input addon-input"
                    placeholder='e.g., Zildjian 14"'
                  />
                ) : (
                  <span className="addon-value">{post.addOns.hiHats}</span>
                )}
              </div>
            )}

            {/* Ride Cymbal */}
            {(isEditing || post.addOns.rideCymbal) && (
              <div className="addon-item">
                <span className="addon-label">Ride:</span>
                {isEditing ? (
                  <input
                    type="text"
                    name="rideCymbal"
                    value={formData.addOns.rideCymbal}
                    onChange={handleAddOnChange}
                    className="edit-input addon-input"
                    placeholder='e.g., Sabian 20"'
                  />
                ) : (
                  <span className="addon-value">{post.addOns.rideCymbal}</span>
                )}
              </div>
            )}

            {/* Crash Cymbal */}
            {(isEditing || post.addOns.crashCymbal) && (
              <div className="addon-item">
                <span className="addon-label">Crash:</span>
                {isEditing ? (
                  <input
                    type="text"
                    name="crashCymbal"
                    value={formData.addOns.crashCymbal}
                    onChange={handleAddOnChange}
                    className="edit-input addon-input"
                    placeholder='e.g., Paiste 18"'
                  />
                ) : (
                  <span className="addon-value">{post.addOns.crashCymbal}</span>
                )}
              </div>
            )}

            {/* Hardware */}
            {(isEditing || post.addOns.hardware) && (
              <div className="addon-item">
                <span className="addon-label">Hardware:</span>
                {isEditing ? (
                  <input
                    type="text"
                    name="hardware"
                    value={formData.addOns.hardware}
                    onChange={handleAddOnChange}
                    className="edit-input addon-input"
                    placeholder="e.g., DW 9000 Series"
                  />
                ) : (
                  <span className="addon-value">{post.addOns.hardware}</span>
                )}
              </div>
            )}

            {/* Effects */}
            {(isEditing || post.addOns.effects) && (
              <div className="addon-item">
                <span className="addon-label">Effects:</span>
                {isEditing ? (
                  <input
                    type="text"
                    name="effects"
                    value={formData.addOns.effects}
                    onChange={handleAddOnChange}
                    className="edit-input addon-input"
                    placeholder="e.g., China, Splash"
                  />
                ) : (
                  <span className="addon-value">{post.addOns.effects}</span>
                )}
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
