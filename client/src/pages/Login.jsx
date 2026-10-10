import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Compass, AlertCircle } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setSubmitting(true);
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid email or password');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('demo@rankpilot.in');
    setPassword('demo123456');
  };

  return (
    <div
      className="min-vh-100 d-flex flex-column justify-content-center align-items-center p-3"
      style={{ backgroundColor: 'var(--mui-bg)' }}
    >
      <div style={{ maxWidth: '420px', width: '100%' }}>
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
          <h1 className="h5 fw-bold text-dark mb-1">Sign in to your account</h1>
          <p className="text-secondary small mb-4" style={{ fontSize: '13.5px' }}>
            Enter your credentials to access your SEO workspace
          </p>

          {error && (
            <div className="mb-3 p-2.5 rounded border bg-light d-flex align-items-start gap-2" style={{ borderColor: 'var(--mui-error)', color: 'var(--mui-error)', fontSize: '13px' }}>
              <AlertCircle size={16} className="mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
            <div>
              <label className="form-label text-dark fw-semibold mb-1" htmlFor="email" style={{ fontSize: '13.5px' }}>
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="mui-input"
                autoComplete="email"
                required
              />
            </div>

            <div>
              <div className="d-flex align-items-center justify-content-between mb-1">
                <label className="form-label text-dark fw-semibold mb-0" htmlFor="password" style={{ fontSize: '13.5px' }}>
                  Password
                </label>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mui-input"
                autoComplete="current-password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mui-btn mui-btn-primary w-100 py-2 mt-2"
            >
              {submitting ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="mt-4 pt-3 border-top d-flex align-items-center justify-content-between" style={{ borderColor: 'var(--mui-slate-200)', fontSize: '13px' }}>
            <span className="text-muted">Need a demo account?</span>
            <button
              type="button"
              onClick={handleFillDemo}
              className="btn btn-link p-0 text-decoration-none fw-semibold"
              style={{ color: 'var(--mui-primary)', fontSize: '13px' }}
            >
              Autofill Demo Credentials
            </button>
          </div>
        </div>

        {/* Bottom link */}
        <p className="text-center text-secondary small mt-4 mb-0" style={{ fontSize: '13.5px' }}>
          Don't have an account?{' '}
          <Link to="/register" className="fw-semibold" style={{ color: 'var(--mui-primary)' }}>
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
