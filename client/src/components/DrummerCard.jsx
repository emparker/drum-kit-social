import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { PostContext } from '../context/PostContext';
import CommentSection from './CommentSection';

// Extra Drums dropdown options
const EXTRA_DRUM_CATEGORIES = [
  { value: 'bass', label: 'Bass Drum' },
  { value: 'tom', label: 'Tom' },
  { value: 'snare', label: 'Snare' },
];

// Extra Cymbals dropdown options
const EXTRA_CYMBAL_CATEGORIES = [
  { value: 'crash', label: 'Crash Cymbal' },
  { value: 'ride', label: 'Ride Cymbal' },
  { value: 'splash', label: 'Splash' },
  { value: 'china', label: 'China' },
  { value: 'hi-hat', label: 'Hi-Hat' },
];

// Other Extras dropdown options (hardware, pedals, effects)
const OTHER_EXTRAS_CATEGORIES = [
  { value: 'hardware', label: 'Hardware' },
  { value: 'kick-pedal', label: 'Kick Pedal' },
  { value: 'effects', label: 'Effects' },
];

export default function DrummerCard({ post, showEditControls = false, isOwner = false }) {
  const { user } = useContext(AuthContext);
  const { toggleLike, toggleDislike, updatePost, deletePost } = useContext(PostContext);
  const [isVoting, setIsVoting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Flat form state for editing (no nested objects)
  const [formData, setFormData] = useState({
    drummerName: post.drummerName || '',
    band: post.band || '',
    album: post.album || '',
    // Kit Metadata
    drumKitModel: post.drumKitModel || '',
    material: post.material || '',
    color: post.color || '',
    kitPieceCount: post.kitPieceCount || '',
    // Drums
    bass: post.bass || '',
    tom1: post.tom1 || '',
    tom2: post.tom2 || '',
    tom3: post.tom3 || '',
    snare: post.snare || '',
    // Cymbals
    crash: post.crash || '',
    ride: post.ride || '',
    splash: post.splash || '',
    china: post.china || '',
    hiHat: post.hiHat || '',
  });

  // Separate state for extras arrays
  const [extraDrums, setExtraDrums] = useState(post.extraDrums || []);
  const [extraCymbals, setExtraCymbals] = useState(post.extraCymbals || []);
  const [extras, setExtras] = useState(post.extras || []);

  // Check if any kit metadata fields are filled
  const hasKitMetadata = post.drumKitModel || post.material || post.color || post.kitPieceCount;

  // Check if any drum fields are filled
  const hasDrums = post.bass || post.tom1 || post.tom2 || post.tom3 || post.snare;

  // Check if any cymbal fields are filled
  const hasCymbals = post.crash || post.ride || post.splash || post.china || post.hiHat;

  // Check if there are extras for each category
  const hasExtraDrums = post.extraDrums && post.extraDrums.length > 0;
  const hasExtraCymbals = post.extraCymbals && post.extraCymbals.length > 0;
  const hasExtras = post.extras && post.extras.length > 0;

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

  // Single handler for all flat field input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Extra Drums handlers
  const handleExtraDrumCategoryChange = (index, value) => {
    setExtraDrums(prev =>
      prev.map((extra, i) =>
        i === index ? { ...extra, category: value } : extra
      )
    );
  };

  const handleExtraDrumValueChange = (index, value) => {
    setExtraDrums(prev =>
      prev.map((extra, i) =>
        i === index ? { ...extra, value: value } : extra
      )
    );
  };

  const handleAddExtraDrum = () => {
    setExtraDrums(prev => [...prev, { category: '', value: '' }]);
  };

  const handleRemoveExtraDrum = (index) => {
    setExtraDrums(prev => prev.filter((_, i) => i !== index));
  };

  // Extra Cymbals handlers
  const handleExtraCymbalCategoryChange = (index, value) => {
    setExtraCymbals(prev =>
      prev.map((extra, i) =>
        i === index ? { ...extra, category: value } : extra
      )
    );
  };

  const handleExtraCymbalValueChange = (index, value) => {
    setExtraCymbals(prev =>
      prev.map((extra, i) =>
        i === index ? { ...extra, value: value } : extra
      )
    );
  };

  const handleAddExtraCymbal = () => {
    setExtraCymbals(prev => [...prev, { category: '', value: '' }]);
  };

  const handleRemoveExtraCymbal = (index) => {
    setExtraCymbals(prev => prev.filter((_, i) => i !== index));
  };

  // Other Extras handlers (hardware, kick-pedal, effects)
  const handleExtrasCategoryChange = (index, value) => {
    setExtras(prev =>
      prev.map((extra, i) =>
        i === index ? { ...extra, category: value } : extra
      )
    );
  };

  const handleExtrasValueChange = (index, value) => {
    setExtras(prev =>
      prev.map((extra, i) =>
        i === index ? { ...extra, value: value } : extra
      )
    );
  };

  const handleAddExtra = () => {
    setExtras(prev => [...prev, { category: '', value: '' }]);
  };

  const handleRemoveExtra = (index) => {
    setExtras(prev => prev.filter((_, i) => i !== index));
  };

  // Enter edit mode
  const handleEdit = () => {
    setIsEditing(true);
  };

  // Cancel editing and revert changes
  const handleCancel = () => {
    setFormData({
      drummerName: post.drummerName || '',
      band: post.band || '',
      album: post.album || '',
      drumKitModel: post.drumKitModel || '',
      material: post.material || '',
      color: post.color || '',
      kitPieceCount: post.kitPieceCount || '',
      bass: post.bass || '',
      tom1: post.tom1 || '',
      tom2: post.tom2 || '',
      tom3: post.tom3 || '',
      snare: post.snare || '',
      crash: post.crash || '',
      ride: post.ride || '',
      splash: post.splash || '',
      china: post.china || '',
      hiHat: post.hiHat || '',
    });
    setExtraDrums(post.extraDrums || []);
    setExtraCymbals(post.extraCymbals || []);
    setExtras(post.extras || []);
    setIsEditing(false);
  };

  // Save changes
  const handleSave = async () => {
    if (!formData.drummerName.trim() || !formData.band.trim() || !formData.album.trim()) {
      alert('Drummer name, band, and album are required!');
      return;
    }

    setIsSaving(true);

    // Build update data
    const updateData = {
      ...formData,
      kitPieceCount: formData.kitPieceCount ? parseInt(formData.kitPieceCount, 10) : undefined,
      extraDrums: extraDrums.filter(extra => extra.category && extra.value.trim()),
      extraCymbals: extraCymbals.filter(extra => extra.category && extra.value.trim()),
      extras: extras.filter(extra => extra.category && extra.value.trim()),
    };

    const success = await updatePost(post._id, updateData);
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

      {/* Band & Album Row - Inline Display */}
      <div className="band-album-row">
        <div className="band-item">
          <span className="band-label">Band:</span>
          {isEditing ? (
            <input
              type="text"
              name="band"
              value={formData.band}
              onChange={handleInputChange}
              className="edit-input edit-band"
              placeholder="Band Name"
              required
            />
          ) : (
            <span className="band-name">{post.band}</span>
          )}
        </div>
        <div className="album-item">
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
            <span className="album-title">{post.album}</span>
          )}
        </div>
      </div>

      {/* Kit Metadata Section */}
      {(isEditing || hasKitMetadata) && (
        <section className="kit-metadata-section">
          <h5 className="section-title">Kit Information</h5>
          <div className="metadata-grid">
            {(isEditing || post.drumKitModel) && (
              <div className="metadata-item">
                <span className="metadata-label">Model:</span>
                {isEditing ? (
                  <input
                    type="text"
                    name="drumKitModel"
                    value={formData.drumKitModel}
                    onChange={handleInputChange}
                    className="edit-input metadata-input"
                    placeholder="e.g., Tama Starclassic"
                  />
                ) : (
                  <span className="metadata-value">{post.drumKitModel}</span>
                )}
              </div>
            )}
            {(isEditing || post.material) && (
              <div className="metadata-item">
                <span className="metadata-label">Material:</span>
                {isEditing ? (
                  <input
                    type="text"
                    name="material"
                    value={formData.material}
                    onChange={handleInputChange}
                    className="edit-input metadata-input"
                    placeholder="e.g., Birch/Maple"
                  />
                ) : (
                  <span className="metadata-value">{post.material}</span>
                )}
              </div>
            )}
            {(isEditing || post.color) && (
              <div className="metadata-item">
                <span className="metadata-label">Color:</span>
                {isEditing ? (
                  <input
                    type="text"
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    className="edit-input metadata-input"
                    placeholder="e.g., Starburst Fade"
                  />
                ) : (
                  <span className="metadata-value">{post.color}</span>
                )}
              </div>
            )}
            {(isEditing || post.kitPieceCount) && (
              <div className="metadata-item">
                <span className="metadata-label">Pieces:</span>
                {isEditing ? (
                  <input
                    type="number"
                    name="kitPieceCount"
                    value={formData.kitPieceCount}
                    onChange={handleInputChange}
                    className="edit-input metadata-input"
                    placeholder="e.g., 5"
                    min="1"
                  />
                ) : (
                  <span className="metadata-value">{post.kitPieceCount}</span>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Drums Section */}
      {(isEditing || hasDrums || hasExtraDrums) && (
        <section className="drums-section">
          <h5 className="section-title">Drums</h5>
          <div className="kit-grid">
            {(isEditing || post.bass) && (
              <div className="kit-item">
                <span className="kit-label">Bass:</span>
                {isEditing ? (
                  <input
                    type="text"
                    name="bass"
                    value={formData.bass}
                    onChange={handleInputChange}
                    className="edit-input kit-input"
                    placeholder="e.g., DW 22x18"
                  />
                ) : (
                  <span className="kit-value">{post.bass}</span>
                )}
              </div>
            )}
            {(isEditing || post.tom1) && (
              <div className="kit-item">
                <span className="kit-label">Tom 1:</span>
                {isEditing ? (
                  <input
                    type="text"
                    name="tom1"
                    value={formData.tom1}
                    onChange={handleInputChange}
                    className="edit-input kit-input"
                    placeholder="e.g., DW 10x8"
                  />
                ) : (
                  <span className="kit-value">{post.tom1}</span>
                )}
              </div>
            )}
            {(isEditing || post.tom2) && (
              <div className="kit-item">
                <span className="kit-label">Tom 2:</span>
                {isEditing ? (
                  <input
                    type="text"
                    name="tom2"
                    value={formData.tom2}
                    onChange={handleInputChange}
                    className="edit-input kit-input"
                    placeholder="e.g., DW 12x9"
                  />
                ) : (
                  <span className="kit-value">{post.tom2}</span>
                )}
              </div>
            )}
            {(isEditing || post.tom3) && (
              <div className="kit-item">
                <span className="kit-label">Tom 3:</span>
                {isEditing ? (
                  <input
                    type="text"
                    name="tom3"
                    value={formData.tom3}
                    onChange={handleInputChange}
                    className="edit-input kit-input"
                    placeholder="e.g., DW 14x12"
                  />
                ) : (
                  <span className="kit-value">{post.tom3}</span>
                )}
              </div>
            )}
            {(isEditing || post.snare) && (
              <div className="kit-item">
                <span className="kit-label">Snare:</span>
                {isEditing ? (
                  <input
                    type="text"
                    name="snare"
                    value={formData.snare}
                    onChange={handleInputChange}
                    className="edit-input kit-input"
                    placeholder="e.g., Ludwig 14x6.5"
                  />
                ) : (
                  <span className="kit-value">{post.snare}</span>
                )}
              </div>
            )}
          </div>

          {/* Extra Drums Subsection */}
          {(isEditing || hasExtraDrums) && (
            <div className="extra-subsection">
              <span className="subsection-label">Additional Drums</span>
              {isEditing ? (
                <div className="extras-edit">
                  {extraDrums.map((extra, index) => (
                    <div key={index} className="extra-item-edit">
                      <span className="extra-label-display">{extra.label || 'New'}:</span>
                      <select
                        value={extra.category}
                        onChange={(e) => handleExtraDrumCategoryChange(index, e.target.value)}
                        className="extra-category-select"
                      >
                        <option value="">Select type...</option>
                        {EXTRA_DRUM_CATEGORIES.map((cat) => (
                          <option key={cat.value} value={cat.value}>
                            {cat.label}
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        placeholder="Enter details..."
                        value={extra.value}
                        onChange={(e) => handleExtraDrumValueChange(index, e.target.value)}
                        className="extra-value-input"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveExtraDrum(index)}
                        className="btn-remove-extra"
                        title="Remove this drum"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddExtraDrum}
                    className="btn-add-extra"
                  >
                    + Add Extra Drum
                  </button>
                </div>
              ) : (
                <div className="extras-display">
                  {post.extraDrums.map((extra, index) => (
                    <div key={index} className="extra-item">
                      <span className="extra-label">{extra.label}:</span>
                      <span className="extra-value">{extra.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>
      )}

      {/* Cymbals Section */}
      {(isEditing || hasCymbals || hasExtraCymbals) && (
        <section className="cymbals-section">
          <h5 className="section-title">Cymbals</h5>
          <div className="cymbals-grid">
            {(isEditing || post.crash) && (
              <div className="cymbal-item">
                <span className="cymbal-label">Crash:</span>
                {isEditing ? (
                  <input
                    type="text"
                    name="crash"
                    value={formData.crash}
                    onChange={handleInputChange}
                    className="edit-input cymbal-input"
                    placeholder='e.g., Zildjian 18"'
                  />
                ) : (
                  <span className="cymbal-value">{post.crash}</span>
                )}
              </div>
            )}
            {(isEditing || post.ride) && (
              <div className="cymbal-item">
                <span className="cymbal-label">Ride:</span>
                {isEditing ? (
                  <input
                    type="text"
                    name="ride"
                    value={formData.ride}
                    onChange={handleInputChange}
                    className="edit-input cymbal-input"
                    placeholder='e.g., Paiste 22"'
                  />
                ) : (
                  <span className="cymbal-value">{post.ride}</span>
                )}
              </div>
            )}
            {(isEditing || post.hiHat) && (
              <div className="cymbal-item">
                <span className="cymbal-label">Hi-Hat:</span>
                {isEditing ? (
                  <input
                    type="text"
                    name="hiHat"
                    value={formData.hiHat}
                    onChange={handleInputChange}
                    className="edit-input cymbal-input"
                    placeholder='e.g., Zildjian 14"'
                  />
                ) : (
                  <span className="cymbal-value">{post.hiHat}</span>
                )}
              </div>
            )}
            {(isEditing || post.splash) && (
              <div className="cymbal-item">
                <span className="cymbal-label">Splash:</span>
                {isEditing ? (
                  <input
                    type="text"
                    name="splash"
                    value={formData.splash}
                    onChange={handleInputChange}
                    className="edit-input cymbal-input"
                    placeholder='e.g., Sabian 10"'
                  />
                ) : (
                  <span className="cymbal-value">{post.splash}</span>
                )}
              </div>
            )}
            {(isEditing || post.china) && (
              <div className="cymbal-item">
                <span className="cymbal-label">China:</span>
                {isEditing ? (
                  <input
                    type="text"
                    name="china"
                    value={formData.china}
                    onChange={handleInputChange}
                    className="edit-input cymbal-input"
                    placeholder='e.g., Wuhan 18"'
                  />
                ) : (
                  <span className="cymbal-value">{post.china}</span>
                )}
              </div>
            )}
          </div>

          {/* Extra Cymbals Subsection */}
          {(isEditing || hasExtraCymbals) && (
            <div className="extra-subsection">
              <span className="subsection-label">Additional Cymbals</span>
              {isEditing ? (
                <div className="extras-edit">
                  {extraCymbals.map((extra, index) => (
                    <div key={index} className="extra-item-edit">
                      <span className="extra-label-display">{extra.label || 'New'}:</span>
                      <select
                        value={extra.category}
                        onChange={(e) => handleExtraCymbalCategoryChange(index, e.target.value)}
                        className="extra-category-select"
                      >
                        <option value="">Select type...</option>
                        {EXTRA_CYMBAL_CATEGORIES.map((cat) => (
                          <option key={cat.value} value={cat.value}>
                            {cat.label}
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        placeholder="Enter details..."
                        value={extra.value}
                        onChange={(e) => handleExtraCymbalValueChange(index, e.target.value)}
                        className="extra-value-input"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveExtraCymbal(index)}
                        className="btn-remove-extra"
                        title="Remove this cymbal"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddExtraCymbal}
                    className="btn-add-extra"
                  >
                    + Add Extra Cymbal
                  </button>
                </div>
              ) : (
                <div className="extras-display">
                  {post.extraCymbals.map((extra, index) => (
                    <div key={index} className="extra-item">
                      <span className="extra-label">{extra.label}:</span>
                      <span className="extra-value">{extra.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>
      )}

      {/* Other Gear Section */}
      {(isEditing || hasExtras) && (
        <section className="extras-section">
          <h5 className="section-title">Other Gear</h5>
          {isEditing ? (
            <div className="extras-edit">
              {extras.map((extra, index) => (
                <div key={index} className="extra-item-edit">
                  <span className="extra-label-display">{extra.label || 'New'}:</span>
                  <select
                    value={extra.category}
                    onChange={(e) => handleExtrasCategoryChange(index, e.target.value)}
                    className="extra-category-select"
                  >
                    <option value="">Select type...</option>
                    {OTHER_EXTRAS_CATEGORIES.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Enter details..."
                    value={extra.value}
                    onChange={(e) => handleExtrasValueChange(index, e.target.value)}
                    className="extra-value-input"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveExtra(index)}
                    className="btn-remove-extra"
                    title="Remove this item"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddExtra}
                className="btn-add-extra"
              >
                + Add Other Gear
              </button>
            </div>
          ) : (
            <div className="extras-display">
              {post.extras.map((extra, index) => (
                <div key={index} className="extra-item">
                  <span className="extra-label">{extra.label}:</span>
                  <span className="extra-value">{extra.value}</span>
                </div>
              ))}
            </div>
          )}
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
