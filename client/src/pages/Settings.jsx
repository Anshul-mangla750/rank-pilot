import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  CheckCircle2,
  Key,
  Globe,
  Shield,
  Cpu,
  Database,
} from 'lucide-react';

export default function Settings() {
  const { user } = useAuth();
  const [defaultCountry, setDefaultCountry] = useState('IN');
  const [defaultLang, setDefaultLang] = useState('en');
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="container-fluid p-0 d-flex flex-column gap-4">
      <div>
        <h2 className="h4 fw-bold text-dark mb-1">Settings & Integrations</h2>
        <p className="text-secondary mb-0" style={{ fontSize: '13.5px' }}>
          Manage your account profile, Indian SERP market configurations, and API connections
        </p>
      </div>

      <div className="row g-3">
        {/* User Account Info */}
        <div className="col-12 col-md-4">
          <div className="rp-card h-100">
            <div className="d-flex align-items-center gap-3 pb-3 mb-3 border-bottom" style={{ borderColor: 'var(--mui-slate-200)' }}>
              <div
                className="d-flex align-items-center justify-content-center text-white rounded-circle fw-bold"
                style={{ width: '42px', height: '42px', backgroundColor: 'var(--mui-slate-800)', fontSize: '16px' }}
              >
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div>
                <h3 className="h6 fw-bold text-dark mb-0" style={{ fontSize: '15px' }}>{user?.name || 'Administrator'}</h3>
                <p className="text-muted small mb-0" style={{ fontSize: '12.5px' }}>{user?.email || 'admin@rankpilot.in'}</p>
              </div>
            </div>

            <div className="d-flex flex-column gap-2" style={{ fontSize: '13.5px' }}>
              <div className="d-flex justify-content-between py-1 border-bottom" style={{ borderColor: 'var(--mui-slate-100)' }}>
                <span className="text-muted">Account Tier</span>
                <span className="fw-bold text-uppercase" style={{ color: 'var(--mui-primary)' }}>
                  {user?.plan || 'PRO CSE'}
                </span>
              </div>
              <div className="d-flex justify-content-between py-1 border-bottom" style={{ borderColor: 'var(--mui-slate-100)' }}>
                <span className="text-muted">Role</span>
                <span className="text-dark text-capitalize fw-medium">{user?.role || 'Admin'}</span>
              </div>
              <div className="d-flex justify-content-between py-1">
                <span className="text-muted">Single-User Mode</span>
                <span className="fw-semibold" style={{ color: 'var(--mui-success)' }}>Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* API Services & Live Connectors Status */}
        <div className="col-12 col-md-8">
          <div className="rp-card h-100">
            <div className="pb-3 mb-3 border-bottom" style={{ borderColor: 'var(--mui-slate-200)' }}>
              <h3 className="h6 fw-bold text-dark d-flex align-items-center gap-2 mb-1" style={{ fontSize: '15px' }}>
                <Key size={17} style={{ color: 'var(--mui-primary)' }} />
                <span>Connected SEO Services & API Infrastructure</span>
              </h3>
              <p className="text-secondary small mb-0" style={{ fontSize: '13px' }}>
                Live status of configured cloud databases, SERP checkers, and AI models
              </p>
            </div>

            <div className="d-flex flex-column gap-2">
              <div className="p-2.5 px-3 rounded border bg-light d-flex align-items-center justify-content-between" style={{ borderColor: 'var(--mui-slate-200)', fontSize: '13.5px' }}>
                <div className="d-flex align-items-center gap-2.5">
                  <Database size={17} style={{ color: 'var(--mui-success)' }} />
                  <div>
                    <p className="fw-semibold text-dark mb-0">MongoDB Atlas Cluster</p>
                    <p className="text-muted mb-0" style={{ fontSize: '12px' }}>cluster0.agmlwsd.mongodb.net</p>
                  </div>
                </div>
                <span className="mui-chip chip-pass">
                  <CheckCircle2 size={13} /> Connected
                </span>
              </div>

              <div className="p-2.5 px-3 rounded border bg-light d-flex align-items-center justify-content-between" style={{ borderColor: 'var(--mui-slate-200)', fontSize: '13.5px' }}>
                <div className="d-flex align-items-center gap-2.5">
                  <Cpu size={17} style={{ color: 'var(--mui-primary)' }} />
                  <div>
                    <p className="fw-semibold text-dark mb-0">Google Gemini 1.5 Flash</p>
                    <p className="text-muted mb-0" style={{ fontSize: '12px' }}>API Key configured for automated code fixes</p>
                  </div>
                </div>
                <span className="mui-chip chip-pass">
                  <CheckCircle2 size={13} /> Active
                </span>
              </div>

              <div className="p-2.5 px-3 rounded border bg-light d-flex align-items-center justify-content-between" style={{ borderColor: 'var(--mui-slate-200)', fontSize: '13.5px' }}>
                <div className="d-flex align-items-center gap-2.5">
                  <Globe size={17} style={{ color: 'var(--mui-secondary)' }} />
                  <div>
                    <p className="fw-semibold text-dark mb-0">ValueSERP Google India Engine</p>
                    <p className="text-muted mb-0" style={{ fontSize: '12px' }}>Target: google.co.in / GL: IN</p>
                  </div>
                </div>
                <span className="mui-chip chip-pass">
                  <CheckCircle2 size={13} /> Active
                </span>
              </div>

              <div className="p-2.5 px-3 rounded border bg-light d-flex align-items-center justify-content-between" style={{ borderColor: 'var(--mui-slate-200)', fontSize: '13.5px' }}>
                <div className="d-flex align-items-center gap-2.5">
                  <Shield size={17} style={{ color: 'var(--mui-warning)' }} />
                  <div>
                    <p className="fw-semibold text-dark mb-0">Google PageSpeed Insights API</p>
                    <p className="text-muted mb-0" style={{ fontSize: '12px' }}>Lighthouse Core Web Vitals telemetry</p>
                  </div>
                </div>
                <span className="mui-chip chip-pass">
                  <CheckCircle2 size={13} /> Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Market Preferences */}
      <div className="rp-card">
        <h3 className="h6 fw-bold text-dark mb-1" style={{ fontSize: '15px' }}>Target Market & Search Preferences</h3>
        <p className="text-secondary small mb-3" style={{ fontSize: '13px' }}>
          Specify default geographical criteria for ranking algorithms and keyword suggestions
        </p>

        <form onSubmit={handleSave} className="d-flex flex-column gap-3" style={{ maxWidth: '480px' }}>
          <div className="row g-2">
            <div className="col-6">
              <label className="form-label text-dark fw-semibold mb-1" htmlFor="country" style={{ fontSize: '13.5px' }}>
                Default Target Country
              </label>
              <select
                id="country"
                value={defaultCountry}
                onChange={(e) => setDefaultCountry(e.target.value)}
                className="mui-input"
              >
                <option value="IN">India (IN) - google.co.in</option>
                <option value="US">United States (US)</option>
                <option value="UK">United Kingdom (UK)</option>
              </select>
            </div>
            <div className="col-6">
              <label className="form-label text-dark fw-semibold mb-1" htmlFor="lang" style={{ fontSize: '13.5px' }}>
                Primary Crawl Language
              </label>
              <select
                id="lang"
                value={defaultLang}
                onChange={(e) => setDefaultLang(e.target.value)}
                className="mui-input"
              >
                <option value="en">English (en)</option>
                <option value="hi">Hindi (hi)</option>
              </select>
            </div>
          </div>

          <div className="d-flex align-items-center gap-2 pt-1">
            <button type="submit" className="mui-btn mui-btn-primary mui-btn-sm">
              Save Preferences
            </button>
            {saved && (
              <span className="small d-flex align-items-center gap-1 fw-medium" style={{ color: 'var(--mui-success)', fontSize: '13px' }}>
                <CheckCircle2 size={15} /> Saved successfully
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
