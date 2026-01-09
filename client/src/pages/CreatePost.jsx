import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { PostContext } from '../context/PostContext';
import AppHeader from '../components/AppHeader';

export default function CreatePost() {
  const navigate = useNavigate();
  const { createPost } = useContext(PostContext);

  const [formData, setFormData] = useState({
    drummerName: '',
    album: '',
    drumKit: {
      kickDrum: '',
      snare: '',
      rackTom1: '',
      rackTom2: '',
      floorTom: '',
    },
    addOns: {
      hiHats: '',
      rideCymbal: '',
      crashCymbal: '',
      hardware: '',
      effects: '',
    },
  });

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle input changes for both flat and nested fields
  function handleChange(e) {
    const { name, value } = e.target;
    setError(''); // Clear error when user starts typing

    if (name.includes('.')) {
      // Handle nested fields (e.g., "drumKit.kickDrum")
      const [section, field] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value,
        },
      }));
    } else {
      // Handle flat fields (e.g., "drummerName")
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  }

  // Handle form submission
  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    // Validate required fields
    if (!formData.drummerName.trim() || !formData.album.trim()) {
      setError('Please fill in both drummer name and album');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createPost(formData);

      if (result.success) {
        // Navigate to feed on success
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
          {/* SECTION 1: Required Fields */}
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

          {/* SECTION 2: 5-Piece Kit (Optional) */}
          <section className="form-section">
            <h4>5-Piece Kit (Optional)</h4>
            <p className="helper-text">
              Add specific drum models used on this album
            </p>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="kickDrum">Kick Drum</label>
                <input
                  id="kickDrum"
                  name="drumKit.kickDrum"
                  type="text"
                  placeholder='e.g., DW 22x18"'
                  value={formData.drumKit.kickDrum}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
              <div className="form-group">
                <label htmlFor="snare">Snare</label>
                <input
                  id="snare"
                  name="drumKit.snare"
                  type="text"
                  placeholder='e.g., Ludwig Black Beauty 14x5"'
                  value={formData.drumKit.snare}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
              <div className="form-group">
                <label htmlFor="rackTom1">Rack Tom 1</label>
                <input
                  id="rackTom1"
                  name="drumKit.rackTom1"
                  type="text"
                  placeholder='e.g., Gretsch 10x8"'
                  value={formData.drumKit.rackTom1}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
              <div className="form-group">
                <label htmlFor="rackTom2">Rack Tom 2</label>
                <input
                  id="rackTom2"
                  name="drumKit.rackTom2"
                  type="text"
                  placeholder='e.g., Gretsch 12x9"'
                  value={formData.drumKit.rackTom2}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
              <div className="form-group">
                <label htmlFor="floorTom">Floor Tom</label>
                <input
                  id="floorTom"
                  name="drumKit.floorTom"
                  type="text"
                  placeholder='e.g., Gretsch 16x14"'
                  value={formData.drumKit.floorTom}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </section>

          {/* SECTION 3: Add-ons (Optional) */}
          <section className="form-section">
            <h4>Add-ons (Optional)</h4>
            <p className="helper-text">Add cymbals, hardware, and effects</p>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="hiHats">Hi-Hats</label>
                <input
                  id="hiHats"
                  name="addOns.hiHats"
                  type="text"
                  placeholder='e.g., Zildjian 14" A Custom'
                  value={formData.addOns.hiHats}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
              <div className="form-group">
                <label htmlFor="rideCymbal">Ride Cymbal</label>
                <input
                  id="rideCymbal"
                  name="addOns.rideCymbal"
                  type="text"
                  placeholder='e.g., Paiste 20" Signature'
                  value={formData.addOns.rideCymbal}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
              <div className="form-group">
                <label htmlFor="crashCymbal">Crash Cymbal</label>
                <input
                  id="crashCymbal"
                  name="addOns.crashCymbal"
                  type="text"
                  placeholder='e.g., Sabian 18" AAX'
                  value={formData.addOns.crashCymbal}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
              <div className="form-group">
                <label htmlFor="hardware">Hardware</label>
                <input
                  id="hardware"
                  name="addOns.hardware"
                  type="text"
                  placeholder="e.g., DW 9000 Series"
                  value={formData.addOns.hardware}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
              <div className="form-group">
                <label htmlFor="effects">Effects</label>
                <input
                  id="effects"
                  name="addOns.effects"
                  type="text"
                  placeholder="e.g., Splash, China, Cowbell"
                  value={formData.addOns.effects}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
            </div>
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
