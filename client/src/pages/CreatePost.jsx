import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { PostContext } from '../context/PostContext';
import AppHeader from '../components/AppHeader';

// Extras category options for dropdown
const EXTRAS_CATEGORIES = [
  { value: 'bass', label: 'Bass Drum' },
  { value: 'tom', label: 'Tom' },
  { value: 'snare', label: 'Snare' },
  { value: 'crash', label: 'Crash Cymbal' },
  { value: 'ride', label: 'Ride Cymbal' },
  { value: 'splash', label: 'Splash' },
  { value: 'china', label: 'China' },
  { value: 'hi-hat', label: 'Hi-Hat' },
  { value: 'hardware', label: 'Hardware' },
  { value: 'kick-pedal', label: 'Kick Pedal' },
  { value: 'effects', label: 'Effects' },
];

export default function CreatePost() {
  const navigate = useNavigate();
  const { createPost } = useContext(PostContext);

  // Flat form state (no nested objects)
  const [formData, setFormData] = useState({
    drummerName: '',
    band: '',
    album: '',
    // Kit Metadata
    drumKitModel: '',
    material: '',
    color: '',
    kitPieceCount: '',
    // Drums
    bass: '',
    tom1: '',
    tom2: '',
    tom3: '',
    snare: '',
    // Cymbals
    crash: '',
    ride: '',
    splash: '',
    china: '',
    hiHat: '',
  });

  // Separate state for dynamic extras array
  const [extras, setExtras] = useState([]);

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle input changes for flat fields (no more dot notation needed!)
  function handleChange(e) {
    const { name, value } = e.target;
    setError('');
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  // Handle extras category change
  function handleExtrasCategoryChange(index, value) {
    setExtras((prev) =>
      prev.map((extra, i) =>
        i === index ? { ...extra, category: value } : extra
      )
    );
  }

  // Handle extras value change
  function handleExtrasValueChange(index, value) {
    setExtras((prev) =>
      prev.map((extra, i) =>
        i === index ? { ...extra, value: value } : extra
      )
    );
  }

  // Add new extra
  function handleAddExtra() {
    setExtras((prev) => [...prev, { category: '', value: '' }]);
  }

  // Remove extra
  function handleRemoveExtra(index) {
    setExtras((prev) => prev.filter((_, i) => i !== index));
  }

  // Handle form submission
  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    // Validate required fields (now includes band)
    if (!formData.drummerName.trim() || !formData.band.trim() || !formData.album.trim()) {
      setError('Please fill in drummer name, band, and album');
      return;
    }

    setIsSubmitting(true);

    try {
      // Build post data with flat structure
      const postData = {
        ...formData,
        // Convert kitPieceCount to number if provided
        kitPieceCount: formData.kitPieceCount ? parseInt(formData.kitPieceCount, 10) : undefined,
        // Filter out empty extras (both category and value must be present)
        extras: extras.filter((extra) => extra.category && extra.value.trim()),
      };

      const result = await createPost(postData);

      if (result.success) {
        navigate('/feed');
      } else {
        setError(result.message || 'Failed to create post');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  }

  // Handle cancel button
  function handleCancel() {
    navigate('/feed');
  }

  return (
    <div className="create-post-page">
      <AppHeader />

      <main className="create-post-container">
        <div className="page-header">
          <h2>Create Drummer Post</h2>
          <button
            onClick={handleCancel}
            className="btn-outline"
            disabled={isSubmitting}
          >
            ← Back to Feed
          </button>
        </div>

        <form onSubmit={handleSubmit} className="create-post-form">
          {/* SECTION 1: Required Fields - Drummer, Band, Album */}
          <section className="form-section">
            <h4>Drummer & Album Details</h4>
            <div className="form-group">
              <label htmlFor="drummerName">Drummer Name *</label>
              <input
                id="drummerName"
                name="drummerName"
                type="text"
                placeholder="e.g., Neil Peart"
                value={formData.drummerName}
                onChange={handleChange}
                disabled={isSubmitting}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="band">Band *</label>
              <input
                id="band"
                name="band"
                type="text"
                placeholder="e.g., Rush"
                value={formData.band}
                onChange={handleChange}
                disabled={isSubmitting}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="album">Album *</label>
              <input
                id="album"
                name="album"
                type="text"
                placeholder="e.g., Moving Pictures"
                value={formData.album}
                onChange={handleChange}
                disabled={isSubmitting}
                required
              />
            </div>
          </section>

          {/* SECTION 2: Kit Metadata (Optional) */}
          <section className="form-section">
            <h4>Kit Information (Optional)</h4>
            <p className="helper-text">
              Details about the drum kit brand and configuration
            </p>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="drumKitModel">Kit Model</label>
                <input
                  id="drumKitModel"
                  name="drumKitModel"
                  type="text"
                  placeholder="e.g., Tama Starclassic"
                  value={formData.drumKitModel}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
              <div className="form-group">
                <label htmlFor="material">Material</label>
                <input
                  id="material"
                  name="material"
                  type="text"
                  placeholder="e.g., Birch/Maple"
                  value={formData.material}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
              <div className="form-group">
                <label htmlFor="color">Color/Finish</label>
                <input
                  id="color"
                  name="color"
                  type="text"
                  placeholder="e.g., Starburst Fade"
                  value={formData.color}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
              <div className="form-group">
                <label htmlFor="kitPieceCount">Piece Count</label>
                <input
                  id="kitPieceCount"
                  name="kitPieceCount"
                  type="number"
                  min="1"
                  placeholder="e.g., 5"
                  value={formData.kitPieceCount}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </section>

          {/* SECTION 3: Drums (Optional) */}
          <section className="form-section">
            <h4>Drums (Optional)</h4>
            <p className="helper-text">
              Add specific drum models used on this album
            </p>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="bass">Bass Drum</label>
                <input
                  id="bass"
                  name="bass"
                  type="text"
                  placeholder='e.g., DW 22x18"'
                  value={formData.bass}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
              <div className="form-group">
                <label htmlFor="tom1">Tom 1</label>
                <input
                  id="tom1"
                  name="tom1"
                  type="text"
                  placeholder='e.g., DW 10x8"'
                  value={formData.tom1}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
              <div className="form-group">
                <label htmlFor="tom2">Tom 2</label>
                <input
                  id="tom2"
                  name="tom2"
                  type="text"
                  placeholder='e.g., DW 12x9"'
                  value={formData.tom2}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
              <div className="form-group">
                <label htmlFor="tom3">Tom 3</label>
                <input
                  id="tom3"
                  name="tom3"
                  type="text"
                  placeholder='e.g., DW 14x12"'
                  value={formData.tom3}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
              <div className="form-group">
                <label htmlFor="snare">Snare</label>
                <input
                  id="snare"
                  name="snare"
                  type="text"
                  placeholder='e.g., Ludwig Black Beauty 14x5"'
                  value={formData.snare}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </section>

          {/* SECTION 4: Cymbals (Optional) */}
          <section className="form-section">
            <h4>Cymbals (Optional)</h4>
            <p className="helper-text">Add cymbal models and sizes</p>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="crash">Crash</label>
                <input
                  id="crash"
                  name="crash"
                  type="text"
                  placeholder='e.g., Zildjian 18" A Custom'
                  value={formData.crash}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
              <div className="form-group">
                <label htmlFor="ride">Ride</label>
                <input
                  id="ride"
                  name="ride"
                  type="text"
                  placeholder='e.g., Paiste 22" Signature'
                  value={formData.ride}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
              <div className="form-group">
                <label htmlFor="hiHat">Hi-Hat</label>
                <input
                  id="hiHat"
                  name="hiHat"
                  type="text"
                  placeholder='e.g., Zildjian 14" New Beats'
                  value={formData.hiHat}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
              <div className="form-group">
                <label htmlFor="splash">Splash</label>
                <input
                  id="splash"
                  name="splash"
                  type="text"
                  placeholder='e.g., Sabian 10" AAX'
                  value={formData.splash}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
              <div className="form-group">
                <label htmlFor="china">China</label>
                <input
                  id="china"
                  name="china"
                  type="text"
                  placeholder='e.g., Wuhan 18" China'
                  value={formData.china}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </section>

          {/* SECTION 5: Extras (Dynamic Array) */}
          <section className="form-section">
            <h4>Extra Pieces (Optional)</h4>
            <p className="helper-text">
              Add additional drums, cymbals, hardware, or effects beyond the standard kit.
              Labels will be auto-generated (e.g., tom4, crash2, hardware1).
            </p>

            {/* Extras List */}
            <div className="extras-list">
              {extras.map((extra, index) => (
                <div key={index} className="extra-item-edit">
                  <select
                    value={extra.category}
                    onChange={(e) => handleExtrasCategoryChange(index, e.target.value)}
                    disabled={isSubmitting}
                    className="extra-category-select"
                  >
                    <option value="">Select type...</option>
                    {EXTRAS_CATEGORIES.map((cat) => (
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
                    disabled={isSubmitting}
                    className="extra-value-input"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveExtra(index)}
                    disabled={isSubmitting}
                    className="btn-remove-extra"
                    title="Remove this extra"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            {/* Add Extra Button */}
            <button
              type="button"
              onClick={handleAddExtra}
              disabled={isSubmitting}
              className="btn-add-extra"
            >
              + Add Extra Piece
            </button>
          </section>

          {/* Error Message */}
          {error && <div className="error-message">{error}</div>}

          {/* Submit Button */}
          <button
            type="submit"
            className="btn-primary btn-lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating Post...' : 'Create Post'}
          </button>
        </form>
      </main>
    </div>
  );
}
