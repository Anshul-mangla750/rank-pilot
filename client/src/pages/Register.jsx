import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Compass, AlertCircle } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password) {
      setError('Please fill in all required fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setSubmitting(true);
      await register(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="min-vh-100 d-flex flex-column justify-content-center align-items-center p-3"
      style={{ backgroundColor: 'var(--mui-bg)' }}
    >
      <div style={{ maxWidth: '440px', width: '100%' }}>
        {/* Brand */}
        <div className="d-flex align-items-center justify-content-center gap-2 mb-4">
          <div
            className="d-flex align-items-center justify-content-center text-white rounded-2 shadow-sm"
            style={{ width: '38px', height: '38px', backgroundColor: 'var(--mui-slate-900)' }}
          >
            <Compass size={22} className="text-white" />
          </div>
          <span className="h4 fw-bold text-dark mb-0 lh-sm" style={{ letterSpacing: '-0.3px' }}>
            Rank<span style={{ color: 'var(--mui-primary)' }}>Pilot</span>
          </span>
        </div>

        {/* Card */}
        <div className="rp-card p-4 shadow-sm">
          <h1 className="h5 fw-bold text-dark mb-1">Create an account</h1>
          <p className="text-secondary small mb-4" style={{ fontSize: '13.5px' }}>
            Start auditing, predicting, and optimizing search rankings
          </p>

          {error && (
            <div className="mb-3 p-2.5 rounded border bg-light d-flex align-items-start gap-2" style={{ borderColor: 'var(--mui-error)', color: 'var(--mui-error)', fontSize: '13px' }}>
              <AlertCircle size={16} className="mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
            <div>
              <label className="form-label text-dark fw-semibold mb-1" htmlFor="name" style={{ fontSize: '13.5px' }}>
                Full name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Anshul Mangla"
                className="mui-input"
                required
              />
            </div>

            <div>
              <label className="form-label text-dark fw-semibold mb-1" htmlFor="email" style={{ fontSize: '13.5px' }}>
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="anshul@example.com"
                className="mui-input"
                autoComplete="email"
                required
              />
            </div>

            <div>
              <label className="form-label text-dark fw-semibold mb-1" htmlFor="password" style={{ fontSize: '13.5px' }}>
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="mui-input"
                autoComplete="new-password"
                required
              />
            </div>

            <div>
              <label className="form-label text-dark fw-semibold mb-1" htmlFor="confirmPassword" style={{ fontSize: '13.5px' }}>
                Confirm password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat your password"
                className="mui-input"
                autoComplete="new-password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mui-btn mui-btn-primary w-100 py-2 mt-2"
            >
              {submitting ? 'Creating account...' : 'Create account'}
            </button>
          </form>
        </div>

        {/* Bottom link */}
        <p className="text-center text-secondary small mt-4 mb-0" style={{ fontSize: '13.5px' }}>
          Already have an account?{' '}
          <Link to="/login" className="fw-semibold" style={{ color: 'var(--mui-primary)' }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
