import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Compass,
  Search,
  ArrowRight,
  CheckCircle2,
  Code2,
  MapPin,
  Eye,
  ArrowLeftRight,
  Printer,
  ChevronRight,
  HelpCircle,
  Menu,
  X,
} from 'lucide-react';

const currentYear = new Date().getFullYear();

export default function Landing() {
  const [urlInput, setUrlInput] = useState('');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAuditSubmit = (e) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    let target = urlInput.trim();
    if (!target.startsWith('http://') && !target.startsWith('https://')) {
      target = 'https://' + target;
    }
    navigate(`/analyze?url=${encodeURIComponent(target)}`);
  };

  const handleQuickTest = (domain) => {
    navigate(`/analyze?url=${encodeURIComponent(`https://${domain}`)}`);
  };

  return (
    <div className="min-vh-100 d-flex flex-column" style={{ backgroundColor: '#f8fafc', color: 'var(--mui-slate-800)', fontFamily: 'var(--font-sans)' }}>
      {/* Navigation Bar */}
      <header
        className="sticky-top bg-white border-bottom position-relative"
        style={{
          borderColor: 'var(--mui-slate-200)',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
          height: '64px',
          minHeight: '64px',
          zIndex: 1000,
        }}
      >
        <div className="container h-100 px-3 px-sm-4 d-flex align-items-center justify-content-between">
          <Link to="/" className="d-flex align-items-center gap-2 text-decoration-none">
            <div
              className="d-flex align-items-center justify-content-center text-white rounded"
              style={{
                width: '36px',
                height: '36px',
                minWidth: '36px',
                minHeight: '36px',
                backgroundColor: 'var(--mui-primary)',
                boxShadow: '0 2px 6px rgba(25, 118, 210, 0.3)',
                flexShrink: 0,
              }}
            >
              <Compass size={20} />
            </div>
            <div className="d-flex flex-column justify-content-center">
              <span className="fw-bold text-dark lh-1" style={{ fontSize: '18px', letterSpacing: '-0.3px' }}>
                Rank<span style={{ color: 'var(--mui-primary)' }}>Pilot</span>
              </span>
              <span className="text-muted fw-semibold text-uppercase mt-1" style={{ fontSize: '9.5px', letterSpacing: '0.8px', lineHeight: 1 }}>
                SEO INTELLIGENCE
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="d-none d-md-flex align-items-center gap-4" style={{ fontSize: '13.5px' }}>
            <a href="#features" className="text-secondary text-decoration-none fw-medium hover-primary">
              Capabilities
            </a>
            <a href="#bharat-seo" className="text-secondary text-decoration-none fw-medium hover-primary">
              Bharat SEO
            </a>
            <a href="#competitor-audit" className="text-secondary text-decoration-none fw-medium hover-primary">
              Head-to-Head Audit
            </a>
            <a href="#case-studies" className="text-secondary text-decoration-none fw-medium hover-primary">
              Case Studies
            </a>
          </nav>

          {/* Auth / Action CTA */}
          <div className="d-flex align-items-center gap-2">
            {user ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="mui-btn mui-btn-primary mui-btn-sm"
              >
                <span>Dashboard</span>
                <ArrowRight size={14} className="d-none d-sm-inline" />
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="mui-btn mui-btn-outlined mui-btn-sm text-decoration-none py-1.5 px-2.5"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="mui-btn mui-btn-primary mui-btn-sm text-decoration-none d-none d-sm-inline-flex"
                >
                  <span>Start Free</span>
                  <ArrowRight size={14} />
                </Link>
              </>
            )}

            {/* Mobile Hamburger Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="btn btn-sm btn-light border text-secondary d-md-none p-1.5 rounded-2 ms-1"
              aria-label="Toggle navigation menu"
            >
              {mobileNavOpen ? <X size={19} /> : <Menu size={19} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown Drawer */}
        {mobileNavOpen && (
          <div
            className="bg-white border-bottom shadow-sm d-md-none p-3 position-absolute top-100 start-0 w-100"
            style={{ zIndex: 1000, borderColor: 'var(--mui-slate-200)' }}
          >
            <nav className="d-flex flex-column gap-2 mb-3">
              <a
                href="#features"
                onClick={() => setMobileNavOpen(false)}
                className="text-dark text-decoration-none fw-medium py-1.5 px-2 rounded hover-bg-light"
              >
                Capabilities
              </a>
              <a
                href="#bharat-seo"
                onClick={() => setMobileNavOpen(false)}
                className="text-dark text-decoration-none fw-medium py-1.5 px-2 rounded hover-bg-light"
              >
                Bharat SEO
              </a>
              <a
                href="#competitor-audit"
                onClick={() => setMobileNavOpen(false)}
                className="text-dark text-decoration-none fw-medium py-1.5 px-2 rounded hover-bg-light"
              >
                Head-to-Head Audit
              </a>
              <a
                href="#case-studies"
                onClick={() => setMobileNavOpen(false)}
                className="text-dark text-decoration-none fw-medium py-1.5 px-2 rounded hover-bg-light"
              >
                Case Studies
              </a>
            </nav>
            <div className="d-flex align-items-center gap-2 pt-2 border-top">
              {user ? (
                <button
                  onClick={() => {
                    setMobileNavOpen(false);
                    navigate('/dashboard');
                  }}
                  className="mui-btn mui-btn-primary w-100 mui-btn-sm"
                >
                  <span>Go to Dashboard</span>
                  <ArrowRight size={14} />
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileNavOpen(false)}
                    className="mui-btn mui-btn-outlined w-50 mui-btn-sm text-center"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileNavOpen(false)}
                    className="mui-btn mui-btn-primary w-50 mui-btn-sm text-center"
                  >
                    Start Free
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="py-5 py-lg-6 border-bottom" style={{ backgroundColor: '#ffffff' }}>
        <div className="container px-3 px-sm-4">
          <div className="row align-items-center g-4 g-lg-5">
            <div className="col-12 col-lg-7">
              {/* Regional Pill Badge */}
              <div
                className="d-inline-flex align-items-center gap-2 px-3 py-1.5 rounded-pill mb-3 border"
                style={{
                  backgroundColor: 'rgba(25, 118, 210, 0.06)',
                  borderColor: 'rgba(25, 118, 210, 0.25)',
                  fontSize: '12.5px',
                  color: 'var(--mui-primary)',
                  fontWeight: 600,
                }}
              >
                <span>🇮🇳 India-First SEO Engine</span>
                <span className="text-muted">·</span>
                <span>Explainable Causal AI</span>
                <span className="text-muted">·</span>
                <span>Next.js & WordPress Code Fixes</span>
              </div>

              <h1 className="display-5 fw-bold text-dark lh-tight mb-3" style={{ letterSpacing: '-0.5px' }}>
                Outrank Rivals on Google with <span style={{ color: 'var(--mui-primary)' }}>Explainable SEO</span> & Transparent Causal AI.
              </h1>

              <p className="lead text-secondary mb-4" style={{ fontSize: '16.5px', lineHeight: '1.6' }}>
                Stop relying on arbitrary black-box scores. RankPilot combines deep Google search algorithm causality, budget mobile Core Web Vitals profiling, head-to-head competitor comparisons, and production-ready code fixes.
              </p>

              {/* Instant URL Audit Form */}
              <form onSubmit={handleAuditSubmit} className="mb-3">
                <div
                  className="p-1.5 rounded-3 border bg-white shadow-sm d-flex flex-column flex-sm-row align-items-stretch gap-2"
                  style={{ borderColor: 'var(--mui-slate-300)' }}
                >
                  <div className="d-flex align-items-center gap-2 flex-grow-1 px-2.5 py-1">
                    <Search size={18} style={{ color: 'var(--mui-slate-400)' }} />
                    <input
                      type="text"
                      className="form-control border-0 p-0 shadow-none text-dark"
                      style={{ fontSize: '14.5px', backgroundColor: 'transparent' }}
                      placeholder="Enter any domain to audit (e.g. nykaa.com, indiamart.com)"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="mui-btn mui-btn-primary px-4 py-2 text-nowrap"
                  >
                    <span>Run Instant Audit</span>
                    <ArrowRight size={15} />
                  </button>
                </div>
              </form>

              {/* Quick Preset Buttons */}
              <div className="d-flex flex-wrap align-items-center gap-2" style={{ fontSize: '13px' }}>
                <span className="text-muted fw-medium">Sample live audits:</span>
                {['nykaa.com', 'indiamart.com', 'carwale.com', 'zerodha.com'].map((domain) => (
                  <button
                    key={domain}
                    type="button"
                    onClick={() => handleQuickTest(domain)}
                    className="btn btn-sm btn-link p-0 text-decoration-none fw-semibold"
                    style={{ color: 'var(--mui-primary)', fontSize: '13px' }}
                  >
                    {domain}
                  </button>
                ))}
              </div>

              {/* Trust & Metric Highlights */}
              <div className="row g-3 mt-4 pt-3 border-top" style={{ borderColor: 'var(--mui-slate-200)' }}>
                <div className="col-4">
                  <span className="h5 fw-bold text-dark d-block mb-0">100%</span>
                  <span className="text-secondary small" style={{ fontSize: '12px' }}>Transparent Causal XAI</span>
                </div>
                <div className="col-4">
                  <span className="h5 fw-bold text-dark d-block mb-0">&lt; 1.5s</span>
                  <span className="text-secondary small" style={{ fontSize: '12px' }}>Audit Execution Speed</span>
                </div>
                <div className="col-4">
                  <span className="h5 fw-bold text-dark d-block mb-0">4+</span>
                  <span className="text-secondary small" style={{ fontSize: '12px' }}>Framework Code Exports</span>
                </div>
              </div>
            </div>

            {/* Right Visual: Interactive Showcase Card */}
            <div className="col-12 col-lg-5">
              <div
                className="rp-card p-4 shadow-sm border position-relative"
                style={{
                  borderColor: 'var(--mui-slate-200)',
                  backgroundColor: '#ffffff',
                }}
              >
                {/* Header preview badge */}
                <div className="d-flex align-items-center justify-content-between pb-3 border-bottom mb-3" style={{ borderColor: 'var(--mui-slate-200)' }}>
                  <div className="d-flex align-items-center gap-2">
                    <span className="mui-chip chip-pass fw-bold">Live Audit Preview</span>
                    <span className="text-muted small">google.co.in</span>
                  </div>
                  <span className="badge text-bg-light border text-secondary" style={{ fontSize: '11px' }}>
                    RankPilot XAI Engine
                  </span>
                </div>

                {/* Score gauge and Target */}
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div>
                    <h3 className="h6 fw-bold text-dark mb-0" style={{ fontSize: '16px' }}>
                      https://nykaa.com
                    </h3>
                    <p className="text-secondary small mb-0" style={{ fontSize: '12.5px' }}>
                      Beauty & Personal Care E-commerce · Mobile Strategy
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="mui-score-ring pass" style={{ width: '54px', height: '54px', fontSize: '18px' }}>
                      <span>88</span>
                    </div>
                    <span className="text-muted small d-block mt-0.5" style={{ fontSize: '10.5px' }}>HEALTH</span>
                  </div>
                </div>

                {/* Category scorecard pills */}
                <div className="row g-2 mb-3">
                  <div className="col-6">
                    <div className="p-2 rounded border bg-light" style={{ borderColor: 'var(--mui-slate-200)' }}>
                      <span className="text-muted small d-block" style={{ fontSize: '11px' }}>On-Page SEO</span>
                      <strong className="text-dark" style={{ fontSize: '14px' }}>90% Passed</strong>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="p-2 rounded border bg-light" style={{ borderColor: 'var(--mui-slate-200)' }}>
                      <span className="text-muted small d-block" style={{ fontSize: '11px' }}>Technical Schema</span>
                      <strong className="text-dark" style={{ fontSize: '14px' }}>92% Passed</strong>
                    </div>
                  </div>
                </div>

                {/* Simulated Causal Finding Item */}
                <div className="p-3 rounded border mb-3" style={{ backgroundColor: 'rgba(25, 118, 210, 0.04)', borderColor: 'rgba(25, 118, 210, 0.2)' }}>
                  <div className="d-flex align-items-center justify-content-between mb-1">
                    <span className="fw-bold text-dark" style={{ fontSize: '13px' }}>
                      Next.js Metadata Remediator
                    </span>
                    <span className="badge text-bg-primary" style={{ fontSize: '10.5px' }}>App Router</span>
                  </div>
                  <pre
                    className="p-2 rounded bg-dark text-light mb-0"
                    style={{
                      fontSize: '11.5px',
                      fontFamily: 'var(--font-mono)',
                      lineHeight: '1.45',
                      overflowX: 'auto',
                    }}
                  >
                    <code>{`export const metadata = {
  title: "Online Cosmetics & Beauty Shopping",
  alternates: { canonical: "https://nykaa.com" }
};`}</code>
                  </pre>
                </div>

                <div className="d-flex align-items-center justify-content-between pt-2 border-top text-secondary small" style={{ borderColor: 'var(--mui-slate-200)', fontSize: '12px' }}>
                  <span className="d-flex align-items-center gap-1 text-success fw-medium">
                    <CheckCircle2 size={14} /> Core Web Vitals Pass (FCP 1.4s)
                  </span>
                  <Link to="/compare" className="text-decoration-none fw-semibold" style={{ color: 'var(--mui-primary)' }}>
                    Compare Nykaa vs Purplle →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6 Core Feature Pillars */}
      <section id="features" className="py-5 border-bottom" style={{ backgroundColor: '#ffffff' }}>
        <div className="container px-3 px-sm-4">
          <div className="text-center max-w-700 mx-auto mb-5">
            <span className="mui-chip chip-info text-uppercase fw-bold mb-2">
              Enterprise SEO Architecture
            </span>
            <h2 className="h3 fw-bold text-dark mb-2">
              Everything Needed to Dominate Search Rankings
            </h2>
            <p className="text-secondary mb-0" style={{ fontSize: '15px' }}>
              Built specifically for modern development stacks and regional search dynamics.
            </p>
          </div>

          <div className="row g-4">
            {/* Feature 1 */}
            <div className="col-12 col-md-6 col-lg-4">
              <div className="rp-card h-100 p-4">
                <div
                  className="d-inline-flex p-2.5 rounded mb-3"
                  style={{ backgroundColor: 'rgba(25, 118, 210, 0.08)', color: 'var(--mui-primary)' }}
                >
                  <Code2 size={22} />
                </div>
                <h3 className="h6 fw-bold text-dark mb-2" style={{ fontSize: '16px' }}>
                  Framework-Specific Code Fixes
                </h3>
                <p className="text-secondary small mb-3" style={{ fontSize: '13.5px', lineHeight: '1.55' }}>
                  No more raw HTML guessing. Instantly toggle between Next.js App Router (<code>metadata</code> object), React Helmet, standard HTML5, and WordPress PHP snippets.
                </p>
                <span className="mui-chip chip-neutral" style={{ fontSize: '11.5px' }}>
                  Next.js · React · WordPress
                </span>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="col-12 col-md-6 col-lg-4">
              <div className="rp-card h-100 p-4">
                <div
                  className="d-inline-flex p-2.5 rounded mb-3"
                  style={{ backgroundColor: 'rgba(46, 125, 50, 0.08)', color: 'var(--mui-success)' }}
                >
                  <ArrowLeftRight size={22} />
                </div>
                <h3 className="h6 fw-bold text-dark mb-2" style={{ fontSize: '16px' }}>
                  Head-to-Head Competitor Audits
                </h3>
                <p className="text-secondary small mb-3" style={{ fontSize: '13.5px', lineHeight: '1.55' }}>
                  Input two competing URLs side-by-side. Calculate delta score differences (Δ score), missing schema gaps, content word count deficits, and Core Web Vitals speed margins.
                </p>
                <Link to="/compare" className="text-decoration-none fw-semibold small d-inline-flex align-items-center gap-1" style={{ color: 'var(--mui-primary)' }}>
                  <span>Try Competitor Comparison</span>
                  <ChevronRight size={13} />
                </Link>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="col-12 col-md-6 col-lg-4">
              <div className="rp-card h-100 p-4">
                <div
                  className="d-inline-flex p-2.5 rounded mb-3"
                  style={{ backgroundColor: 'rgba(237, 108, 2, 0.08)', color: 'var(--mui-warning)' }}
                >
                  <Eye size={22} />
                </div>
                <h3 className="h6 fw-bold text-dark mb-2" style={{ fontSize: '16px' }}>
                  Live SERP Snippet Simulator
                </h3>
                <p className="text-secondary small mb-3" style={{ fontSize: '13.5px', lineHeight: '1.55' }}>
                  Test Google Mobile and Desktop search results live. Includes interactive title character & ~600px pixel width truncation warnings and Schema.org rich star rating previews.
                </p>
                <span className="mui-chip chip-neutral" style={{ fontSize: '11.5px' }}>
                  Pixel Width · Mobile & Desktop
                </span>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="col-12 col-md-6 col-lg-4">
              <div className="rp-card h-100 p-4">
                <div
                  className="d-inline-flex p-2.5 rounded mb-3"
                  style={{ backgroundColor: 'rgba(15, 23, 42, 0.08)', color: 'var(--mui-slate-800)' }}
                >
                  <MapPin size={22} />
                </div>
                <h3 className="h6 fw-bold text-dark mb-2" style={{ fontSize: '16px' }}>
                  Bharat Search Intelligence
                </h3>
                <p className="text-secondary small mb-3" style={{ fontSize: '13.5px', lineHeight: '1.55' }}>
                  Phonetic Hinglish query intent analysis and automated Google Maps 3-Pack Schema generator configured with GSTIN, Indian PIN codes, and WhatsApp Business Click-to-Chat.
                </p>
                <span className="mui-chip chip-neutral" style={{ fontSize: '11.5px' }}>
                  Hinglish · GSTIN · WhatsApp
                </span>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="col-12 col-md-6 col-lg-4">
              <div className="rp-card h-100 p-4">
                <div
                  className="d-inline-flex p-2.5 rounded mb-3"
                  style={{ backgroundColor: 'rgba(2, 136, 209, 0.08)', color: 'var(--mui-primary)' }}
                >
                  <HelpCircle size={22} />
                </div>
                <h3 className="h6 fw-bold text-dark mb-2" style={{ fontSize: '16px' }}>
                  Explainable AI (XAI) Causal Models
                </h3>
                <p className="text-secondary small mb-3" style={{ fontSize: '13.5px', lineHeight: '1.55' }}>
                  Every check is transparently mapped to the exact Google algorithm system affected: PageRank, RankBrain, Helpful Content, or Mobile-First Indexing with empirical reasoning.
                </p>
                <span className="mui-chip chip-neutral" style={{ fontSize: '11.5px' }}>
                  Zero Black-Box Guesswork
                </span>
              </div>
            </div>

            {/* Feature 6 */}
            <div className="col-12 col-md-6 col-lg-4">
              <div className="rp-card h-100 p-4">
                <div
                  className="d-inline-flex p-2.5 rounded mb-3"
                  style={{ backgroundColor: 'rgba(100, 116, 139, 0.08)', color: 'var(--mui-slate-700)' }}
                >
                  <Printer size={22} />
                </div>
                <h3 className="h6 fw-bold text-dark mb-2" style={{ fontSize: '16px' }}>
                  Client-Ready Branded PDF Reports
                </h3>
                <p className="text-secondary small mb-3" style={{ fontSize: '13.5px', lineHeight: '1.55' }}>
                  Generate boardroom-ready executive PDF audits with custom agency cover pages, lead auditor sign-offs, category score matrices, and development checklists.
                </p>
                <Link to="/reports" className="text-decoration-none fw-semibold small d-inline-flex align-items-center gap-1" style={{ color: 'var(--mui-primary)' }}>
                  <span>View Sample Reports</span>
                  <ChevronRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Head-to-Head Showcase Section */}
      <section id="competitor-audit" className="py-5 border-bottom" style={{ backgroundColor: '#f8fafc' }}>
        <div className="container px-3 px-sm-4">
          <div className="row align-items-center g-4">
            <div className="col-12 col-lg-5">
              <span className="mui-chip chip-pass text-uppercase fw-bold mb-2">
                Competitive Benchmarking
              </span>
              <h2 className="h4 fw-bold text-dark mb-3">
                Uncover Exactly Why Competitors Rank Ahead of You
              </h2>
              <p className="text-secondary mb-4" style={{ fontSize: '14.5px', lineHeight: '1.6' }}>
                Compare your website directly against any top search rival. RankPilot computes the exact score delta (Δ score) and highlights gaps in Product Schema, FAQ Schema, Core Web Vitals, and content depth.
              </p>

              <div className="d-flex flex-column gap-2 mb-4">
                <div className="p-2.5 rounded border bg-white d-flex align-items-center justify-content-between" style={{ borderColor: 'var(--mui-slate-200)', fontSize: '13.5px' }}>
                  <span className="fw-medium text-dark">Nykaa vs Purplle (Beauty E-Commerce)</span>
                  <span className="mui-chip chip-pass fw-bold">+7 pt Delta</span>
                </div>
                <div className="p-2.5 rounded border bg-white d-flex align-items-center justify-content-between" style={{ borderColor: 'var(--mui-slate-200)', fontSize: '13.5px' }}>
                  <span className="fw-medium text-dark">IndiaMART vs TradeIndia (B2B Marketplace)</span>
                  <span className="mui-chip chip-pass fw-bold">+6 pt Delta</span>
                </div>
                <div className="p-2.5 rounded border bg-white d-flex align-items-center justify-content-between" style={{ borderColor: 'var(--mui-slate-200)', fontSize: '13.5px' }}>
                  <span className="fw-medium text-dark">CarWale vs CarDekho (Automotive Portal)</span>
                  <span className="mui-chip chip-info fw-bold">+2 pt Delta</span>
                </div>
              </div>

              <Link to="/compare" className="mui-btn mui-btn-primary text-decoration-none">
                <span>Launch Head-to-Head Comparison</span>
                <ArrowRight size={15} />
              </Link>
            </div>

            <div className="col-12 col-lg-7">
              <div className="rp-card p-4 shadow-sm">
                <div className="d-flex align-items-center justify-content-between pb-3 border-bottom mb-3" style={{ borderColor: 'var(--mui-slate-200)' }}>
                  <span className="fw-bold text-dark" style={{ fontSize: '14px' }}>Head-to-Head Audit Matrix</span>
                  <span className="badge text-bg-primary">Nykaa vs Purplle</span>
                </div>

                <div className="row g-3 text-center mb-3">
                  <div className="col-5">
                    <span className="small text-muted d-block mb-1">nykaa.com</span>
                    <span className="h4 fw-bold text-success mb-0 d-block">88 / 100</span>
                    <span className="badge bg-success-subtle text-success border">Leader</span>
                  </div>
                  <div className="col-2 d-flex flex-column align-items-center justify-content-center">
                    <span className="badge bg-secondary-subtle text-secondary-emphasis border px-2 py-1">VS</span>
                    <span className="fw-bold text-primary small mt-1">Δ +7</span>
                  </div>
                  <div className="col-5">
                    <span className="small text-muted d-block mb-1">purplle.com</span>
                    <span className="h4 fw-bold text-dark mb-0 d-block">81 / 100</span>
                    <span className="badge bg-light text-secondary border">Challenger</span>
                  </div>
                </div>

                <div className="table-responsive">
                  <table className="mui-table" style={{ fontSize: '13px' }}>
                    <thead>
                      <tr>
                        <th>Ranking Signal</th>
                        <th>Nykaa</th>
                        <th>Purplle</th>
                        <th>Advantage</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="fw-medium">LCP (Largest Contentful Paint)</td>
                        <td className="text-success fw-bold">2.5s</td>
                        <td className="text-warning">3.4s</td>
                        <td><span className="mui-chip chip-pass">Nykaa +0.9s faster</span></td>
                      </tr>
                      <tr>
                        <td className="fw-medium">Product & Rating Schema</td>
                        <td className="text-success">Present</td>
                        <td className="text-secondary">Missing AggregateRating</td>
                        <td><span className="mui-chip chip-pass">Rich Star Snippets</span></td>
                      </tr>
                      <tr>
                        <td className="fw-medium">FAQ Schema Accordion</td>
                        <td className="text-secondary">Missing</td>
                        <td className="text-success">Present (4 FAQs)</td>
                        <td><span className="mui-chip chip-warning">Purplle Gaps Moat</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies / Indian Market Ecosystem */}
      <section id="case-studies" className="py-5 border-bottom bg-white">
        <div className="container px-3 px-sm-4">
          <div className="text-center max-w-700 mx-auto mb-4">
            <span className="mui-chip chip-info text-uppercase fw-bold mb-2">
              Indian Market Benchmarks
            </span>
            <h2 className="h4 fw-bold text-dark mb-1">
              Tested on India's Leading Digital Platforms
            </h2>
            <p className="text-secondary small mb-0">
              Pre-calibrated against search behavior, regional devices, and Google India (google.co.in).
            </p>
          </div>

          <div className="row g-3">
            {[
              {
                name: 'IndiaMART',
                domain: 'indiamart.com',
                score: 84,
                niche: 'B2B Marketplace',
                tag: 'High Intent Wholesale Search',
                c: 'pass',
              },
              {
                name: 'Nykaa',
                domain: 'nykaa.com',
                score: 88,
                niche: 'Beauty & Lifestyle',
                tag: 'D2C Catalog & Product JSON-LD',
                c: 'pass',
              },
              {
                name: 'CarWale',
                domain: 'carwale.com',
                score: 81,
                niche: 'Automotive Portal',
                tag: 'Vehicle Specs & Price Schema',
                c: 'pass',
              },
              {
                name: 'Zerodha',
                domain: 'zerodha.com',
                score: 92,
                niche: 'Fintech & Brokerage',
                tag: 'Ultra-fast TTFB (< 200ms)',
                c: 'pass',
              },
            ].map((item, idx) => (
              <div key={idx} className="col-12 col-sm-6 col-lg-3">
                <div className="rp-card p-3.5 h-100 d-flex flex-column justify-content-between">
                  <div>
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <span className="fw-bold text-dark" style={{ fontSize: '15px' }}>{item.name}</span>
                      <span className={`mui-score-ring ${item.c}`} style={{ width: '38px', height: '38px', fontSize: '13.5px', borderWidth: '2px' }}>
                        {item.score}
                      </span>
                    </div>
                    <span className="text-muted small d-block mb-1" style={{ fontSize: '12px' }}>{item.domain}</span>
                    <span className="badge text-bg-light border text-secondary mb-2" style={{ fontSize: '11px' }}>
                      {item.niche}
                    </span>
                    <p className="text-secondary small mb-0" style={{ fontSize: '12.5px' }}>
                      {item.tag}
                    </p>
                  </div>
                  <div className="pt-3 border-top mt-3" style={{ borderColor: 'var(--mui-slate-200)' }}>
                    <button
                      onClick={() => handleQuickTest(item.domain)}
                      className="btn btn-sm btn-link p-0 text-decoration-none fw-semibold d-inline-flex align-items-center gap-1"
                      style={{ color: 'var(--mui-primary)', fontSize: '12.5px' }}
                    >
                      <span>Inspect Audit Results</span>
                      <ChevronRight size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-5" style={{ backgroundColor: '#ffffff' }}>
        <div className="container px-3 px-sm-4">
          <div
            className="p-4 p-sm-5 rounded-3 text-center text-white"
            style={{
              backgroundColor: 'var(--mui-slate-900)',
              backgroundImage: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
              border: '1px solid var(--mui-slate-700)',
            }}
          >
            <span
              className="badge text-bg-primary text-uppercase px-3 py-1.5 mb-3"
              style={{ fontSize: '11.5px', letterSpacing: '0.8px' }}
            >
              Start Optimizing Today
            </span>
            <h2 className="h3 fw-bold mb-3" style={{ maxWidth: '640px', margin: '0 auto', color: '#ffffff' }}>
              Transform Your Technical SEO into an Unfair Ranking Advantage
            </h2>
            <p className="mb-4 mx-auto" style={{ maxWidth: '560px', color: '#cbd5e1', fontSize: '15px' }}>
              Identify crawl blockers, Core Web Vitals bottlenecks, and competitor schema gaps in under 2 seconds.
            </p>
            <div className="d-flex flex-wrap align-items-center justify-content-center gap-3">
              <button
                onClick={() => navigate('/analyze')}
                className="mui-btn mui-btn-primary px-4 py-2"
              >
                <span>Launch Free Audit</span>
                <ArrowRight size={15} />
              </button>
              <button
                onClick={() => navigate('/compare')}
                className="mui-btn px-4 py-2"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.12)',
                  color: '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.4)',
                }}
              >
                <span>Compare Competitors</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-top py-4 bg-white" style={{ borderColor: 'var(--mui-slate-200)', fontSize: '13px' }}>
        <div className="container px-3 px-sm-4 d-flex flex-column flex-md-row align-items-center justify-content-between gap-3">
          <div className="d-flex align-items-center gap-2">
            <Compass size={18} style={{ color: 'var(--mui-primary)' }} />
            <span className="fw-bold text-dark">RankPilot</span>
            <span className="text-muted">· India-First Search Intelligence & Audit Engine</span>
          </div>
          <div className="d-flex align-items-center gap-3 text-secondary">
            <Link to="/analyze" className="text-decoration-none text-secondary hover-primary">
              Audit Tool
            </Link>
            <Link to="/compare" className="text-decoration-none text-secondary hover-primary">
              Competitor Analysis
            </Link>
            <Link to="/reports" className="text-decoration-none text-secondary hover-primary">
              Reports
            </Link>
            <Link to="/login" className="text-decoration-none text-secondary hover-primary">
              Sign In
            </Link>
          </div>
          <div className="text-muted small">
            © {currentYear} RankPilot. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
