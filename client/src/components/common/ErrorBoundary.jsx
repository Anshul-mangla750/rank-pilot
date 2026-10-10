import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('RankPilot Caught Exception:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center p-4 bg-light">
          <div
            className="rp-card p-4 p-md-5 text-center shadow-sm"
            style={{ maxWidth: '520px', width: '100%', borderRadius: '12px', border: '1px solid var(--mui-slate-200)' }}
          >
            <div
              className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
              style={{
                width: '64px',
                height: '64px',
                backgroundColor: 'var(--mui-warning-bg)',
                color: 'var(--mui-warning)',
              }}
            >
              <AlertTriangle size={32} />
            </div>

            <h2 className="h5 fw-bold text-dark mb-2">Something went wrong</h2>
            <p className="text-secondary small mb-4">
              An unexpected error occurred in this view. Your saved data is safe. You can reload this page or return to the main dashboard.
            </p>

            {this.state.error?.message && (
              <div
                className="text-start p-3 mb-4 rounded bg-white border text-danger small font-monospace overflow-auto"
                style={{ maxHeight: '120px', fontSize: '12px' }}
              >
                {this.state.error.message}
              </div>
            )}

            <div className="d-flex flex-column flex-sm-row gap-2 justify-content-center">
              <button
                type="button"
                className="mui-btn mui-btn-primary d-flex align-items-center justify-content-center gap-2"
                onClick={this.handleReset}
              >
                <RefreshCw size={15} />
                <span>Reload Application</span>
              </button>
              <a
                href="/dashboard"
                className="mui-btn mui-btn-outlined d-flex align-items-center justify-content-center gap-2 text-decoration-none"
              >
                <Home size={15} />
                <span>Back to Dashboard</span>
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
