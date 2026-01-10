import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import drumKitIcon from '../assets/dks-drum-kit.png';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, signup } = useContext(AuthContext);
  const navigate = useNavigate();

  function handleChange(e) {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  }


  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)
    
    const { username, password } = formData
    const result = isLogin ? await login(username, password) : await signup(username, password)
    if (result.success) {
      navigate('/feed')
    } else {
      setError(result.message || 'An error occurred. Please try again.')
    }
    
    setIsSubmitting(false)
  }

  function toggleMode() {
    setIsLogin(prev => !prev);
    setError('');
    setFormData({ username: '', password: '' });
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1>
          <img src={drumKitIcon} alt="Drum Kit" className="drum-icon" />
          Drum Kit Social
        </h1>
        <p className="tagline">Share and explore pro drummer kit configurations</p>

        <div className="auth-card">
          <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                autoComplete="username"
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                disabled={isSubmitting}
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Please wait...' : (isLogin ? 'Login' : 'Sign Up')}
            </button>
          </form>

          <p className="auth-toggle">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button type="button" onClick={toggleMode} className="link-button">
              {isLogin ? 'Sign Up' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
