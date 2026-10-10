import { useState } from 'react';
import api from '../services/api';
import {
  ArrowLeftRight,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Trophy,
  ExternalLink,
  Clock,
  Layers,
} from 'lucide-react';

const mockCompareDefault = {
  site1: {
    url: 'https://nykaa.com',
    score: 88,
    categories: {
      onPage: { score: 90 },
      technical: { score: 92 },
      content: { score: 85 },
      performance: { score: 82 },
    },
    performanceMetrics: {
      responseTimeMs: 315,
      fcp: '1.4s',
      lcp: '2.5s',
      cls: '0.04',
    },
  },
  site2: {
    url: 'https://purplle.com',
    score: 81,
    categories: {
      onPage: { score: 82 },
      technical: { score: 86 },
      content: { score: 88 },
      performance: { score: 74 },
    },
    performanceMetrics: {
      responseTimeMs: 640,
      fcp: '2.1s',
      lcp: '3.4s',
      cls: '0.08',
    },
  },
  deltaScore: 7,
  winner: 'site1',
  gaps: {
    url1Missing: [
      {
        id: 'faq_schema',
        name: 'FAQPage Structured Data',
        reason: 'FAQ schema helps claim expanded accordion real-estate in mobile SERP snippets.',
        url2Value: 'Detected 4 FAQ schema questions on category listings',
        impact: 'Medium',
      },
      {
        id: 'content_depth',
        name: 'Buyer Guide Word Count',
        reason: 'Long-form buying guides fulfill high-intent comparison queries.',
        url2Value: '1,420 words comprehensive guide',
        impact: 'Low',
      },
    ],
    url2Missing: [
      {
        id: 'canonical_tag',
        name: 'Self-Referential Canonical Tag',
        reason: 'Missing canonical tags cause duplicate content penalties on e-commerce filtering parameters.',
        url1Value: 'Valid rel="canonical" on all catalog pages',
        impact: 'High',
      },
      {
        id: 'product_schema',
        name: 'Schema.org Product & AggregateRating',
        reason: 'Unlocks golden star ratings and pricing directly in Google search cards.',
        url1Value: 'Product, AggregateRating, Offer inStock present',
        impact: 'High',
      },
      {
        id: 'server_ttfb',
        name: 'Fast Server Response (TTFB < 400ms)',
        reason: 'Reduces user bounce rate on budget Indian 4G mobile devices.',
        url1Value: '315ms (Fast edge CDN delivery)',
        impact: 'High',
      },
    ],
  },
};

export default function Compare() {
  const [url1, setUrl1] = useState('https://nykaa.com');
  const [url2, setUrl2] = useState('https://purplle.com');
  const [keyword, setKeyword] = useState('buy cosmetics online india');
  const [loading, setLoading] = useState(false);
  const [comparison, setComparison] = useState(mockCompareDefault);
  const [error, setError] = useState('');

  const handleCompare = async (e) => {
    if (e) e.preventDefault();
    if (!url1.trim() || !url2.trim()) return;

    setError('');
    setLoading(true);
    try {
      const res = await api.post('/audit/compare', {
        url1: url1.trim(),
        url2: url2.trim(),
        keyword: keyword.trim(),
      });
      if (res.data?.data) {
        setComparison(res.data.data);
      }
    } catch (err) {
      console.error('Comparison error:', err);
      setError(err.response?.data?.error || err.message || 'Failed to compare URLs. Please verify the URLs and network connectivity.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPair = (pair1, pair2, kw) => {
    setUrl1(pair1);
    setUrl2(pair2);
    setKeyword(kw);
  };

  const { site1, site2, deltaScore, winner, gaps } = comparison || mockCompareDefault;

  return (
    <div className="container-fluid p-0 d-flex flex-column gap-4">
      {/* Header Form */}
      <div className="rp-card">
        <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3 mb-3">
          <div>
            <h2 className="h4 fw-bold text-dark mb-1 d-flex align-items-center gap-2">
              <ArrowLeftRight size={20} style={{ color: 'var(--mui-primary)' }} />
              <span>Head-to-Head Competitor SEO Audit</span>
            </h2>
            <p className="text-secondary mb-0" style={{ fontSize: '13.5px' }}>
              Compare two competing domains side-by-side to discover structural content gaps, schema deficits, and Core Web Vitals advantages.
            </p>
          </div>
        </div>

        <form onSubmit={handleCompare} className="row g-2">
          <div className="col-12 col-md-5">
            <label className="form-label text-dark fw-semibold mb-1" style={{ fontSize: '13px' }}>Your Website (Domain 1)</label>
            <input
              type="text"
              placeholder="https://yourbrand.com"
              value={url1}
              onChange={(e) => setUrl1(e.target.value)}
              className="mui-input"
              required
            />
          </div>
          <div className="col-12 col-md-5">
            <label className="form-label text-dark fw-semibold mb-1" style={{ fontSize: '13px' }}>Competitor Website (Domain 2)</label>
            <input
              type="text"
              placeholder="https://competitor.com"
              value={url2}
              onChange={(e) => setUrl2(e.target.value)}
              className="mui-input"
              required
            />
          </div>
          <div className="col-12 col-md-2 d-flex align-items-end">
            <button
              type="submit"
              disabled={loading}
              className="mui-btn mui-btn-primary w-100 py-2"
            >
              {loading ? (
                <>
                  <Clock size={15} className="spinner-border spinner-border-sm" />
                  <span>Auditing...</span>
                </>
              ) : (
                <>
                  <Search size={15} />
                  <span>Compare</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Quick Test Pairs */}
        <div className="d-flex align-items-center flex-wrap gap-2 mt-3 pt-2 border-top" style={{ borderColor: 'var(--mui-slate-100)', fontSize: '13px' }}>
          <span className="text-muted">Preset Matchups:</span>
          <button
            type="button"
            onClick={() => handleQuickPair('https://nykaa.com', 'https://purplle.com', 'buy cosmetics online india')}
            className="btn btn-link p-0 text-decoration-none fw-medium"
            style={{ fontSize: '13px', color: 'var(--mui-primary)' }}
          >
            Nykaa vs Purplle
          </button>
          <span className="text-muted">·</span>
          <button
            type="button"
            onClick={() => handleQuickPair('https://indiamart.com', 'https://tradeindia.com', 'b2b marketplace india')}
            className="btn btn-link p-0 text-decoration-none fw-medium"
            style={{ fontSize: '13px', color: 'var(--mui-primary)' }}
          >
            IndiaMART vs TradeIndia
          </button>
          <span className="text-muted">·</span>
          <button
            type="button"
            onClick={() => handleQuickPair('https://carwale.com', 'https://cardekho.com', 'new cars india')}
            className="btn btn-link p-0 text-decoration-none fw-medium"
            style={{ fontSize: '13px', color: 'var(--mui-primary)' }}
          >
            CarWale vs CarDekho
          </button>
        </div>

        {error && (
          <div className="mt-3 p-2.5 rounded border bg-light d-flex align-items-center gap-2" style={{ borderColor: 'var(--mui-error)', color: 'var(--mui-error)', fontSize: '13px' }}>
            <XCircle size={16} />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Comparison Overview Cards */}
      <div className="row g-3">
        {/* Site 1 Card */}
        <div className="col-12 col-md-6">
          <div className="rp-card h-100 position-relative" style={{ borderTop: winner === 'site1' ? '4px solid var(--mui-success)' : '1px solid var(--mui-slate-200)' }}>
            {winner === 'site1' && (
              <span className="position-absolute top-0 end-0 m-3 mui-chip chip-pass fw-bold d-flex align-items-center gap-1">
                <Trophy size={13} />
                <span>Overall Winner (+{Math.abs(deltaScore)} pts)</span>
              </span>
            )}
            <div className="d-flex align-items-center gap-3 mb-3">
              <div
                className={`mui-score-ring ${site1.score >= 80 ? 'pass' : 'warning'}`}
                style={{ width: '56px', height: '56px', fontSize: '20px' }}
              >
                {site1.score}
              </div>
              <div className="overflow-hidden">
                <span className="text-muted text-uppercase fw-semibold d-block" style={{ fontSize: '11px' }}>Domain 1 (Your Site)</span>
                <h3 className="h6 fw-bold text-dark text-truncate mb-0" style={{ fontSize: '16px' }}>{site1.url}</h3>
              </div>
            </div>

            <div className="row g-2 text-center pt-2 border-top" style={{ borderColor: 'var(--mui-slate-100)' }}>
              <div className="col-3">
                <span className="text-muted text-uppercase d-block" style={{ fontSize: '10px' }}>On-Page</span>
                <span className="fw-bold text-dark" style={{ fontSize: '15px' }}>{site1.categories?.onPage?.score}%</span>
              </div>
              <div className="col-3">
                <span className="text-muted text-uppercase d-block" style={{ fontSize: '10px' }}>Technical</span>
                <span className="fw-bold text-dark" style={{ fontSize: '15px' }}>{site1.categories?.technical?.score}%</span>
              </div>
              <div className="col-3">
                <span className="text-muted text-uppercase d-block" style={{ fontSize: '10px' }}>Content</span>
                <span className="fw-bold text-dark" style={{ fontSize: '15px' }}>{site1.categories?.content?.score}%</span>
              </div>
              <div className="col-3">
                <span className="text-muted text-uppercase d-block" style={{ fontSize: '10px' }}>Speed</span>
                <span className="fw-bold text-dark" style={{ fontSize: '15px' }}>{site1.categories?.performance?.score}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Site 2 Card */}
        <div className="col-12 col-md-6">
          <div className="rp-card h-100 position-relative" style={{ borderTop: winner === 'site2' ? '4px solid var(--mui-success)' : '1px solid var(--mui-slate-200)' }}>
            {winner === 'site2' && (
              <span className="position-absolute top-0 end-0 m-3 mui-chip chip-pass fw-bold d-flex align-items-center gap-1">
                <Trophy size={13} />
                <span>Overall Winner (+{Math.abs(deltaScore)} pts)</span>
              </span>
            )}
            <div className="d-flex align-items-center gap-3 mb-3">
              <div
                className={`mui-score-ring ${site2.score >= 80 ? 'pass' : 'warning'}`}
                style={{ width: '56px', height: '56px', fontSize: '20px' }}
              >
                {site2.score}
              </div>
              <div className="overflow-hidden">
                <span className="text-muted text-uppercase fw-semibold d-block" style={{ fontSize: '11px' }}>Domain 2 (Competitor)</span>
                <h3 className="h6 fw-bold text-dark text-truncate mb-0" style={{ fontSize: '16px' }}>{site2.url}</h3>
              </div>
            </div>

            <div className="row g-2 text-center pt-2 border-top" style={{ borderColor: 'var(--mui-slate-100)' }}>
              <div className="col-3">
                <span className="text-muted text-uppercase d-block" style={{ fontSize: '10px' }}>On-Page</span>
                <span className="fw-bold text-dark" style={{ fontSize: '15px' }}>{site2.categories?.onPage?.score}%</span>
              </div>
              <div className="col-3">
                <span className="text-muted text-uppercase d-block" style={{ fontSize: '10px' }}>Technical</span>
                <span className="fw-bold text-dark" style={{ fontSize: '15px' }}>{site2.categories?.technical?.score}%</span>
              </div>
              <div className="col-3">
                <span className="text-muted text-uppercase d-block" style={{ fontSize: '10px' }}>Content</span>
                <span className="fw-bold text-dark" style={{ fontSize: '15px' }}>{site2.categories?.content?.score}%</span>
              </div>
              <div className="col-3">
                <span className="text-muted text-uppercase d-block" style={{ fontSize: '10px' }}>Speed</span>
                <span className="fw-bold text-dark" style={{ fontSize: '15px' }}>{site2.categories?.performance?.score}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Side-by-Side Core Web Vitals Benchmark */}
      <div className="rp-card">
        <h3 className="h6 fw-bold text-dark text-uppercase mb-3" style={{ fontSize: '13px', letterSpacing: '0.5px' }}>
          Core Web Vitals & Server Latency Benchmark
        </h3>
        <div className="table-responsive">
          <table className="mui-table">
            <thead>
              <tr>
                <th>Performance Metric</th>
                <th>Google Target</th>
                <th>{site1.url.replace(/^https?:\/\//, '')}</th>
                <th>{site2.url.replace(/^https?:\/\//, '')}</th>
                <th className="text-end">Speed Advantage</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="fw-semibold text-dark">Server TTFB (Time to First Byte)</td>
                <td className="text-muted">&lt; 400ms</td>
                <td className="fw-bold" style={{ color: site1.performanceMetrics?.responseTimeMs <= 400 ? 'var(--mui-success)' : 'var(--mui-warning)' }}>
                  {site1.performanceMetrics?.responseTimeMs}ms
                </td>
                <td className="fw-bold" style={{ color: site2.performanceMetrics?.responseTimeMs <= 400 ? 'var(--mui-success)' : 'var(--mui-warning)' }}>
                  {site2.performanceMetrics?.responseTimeMs}ms
                </td>
                <td className="text-end">
                  <span className="mui-chip chip-pass">
                    {site1.performanceMetrics?.responseTimeMs < site2.performanceMetrics?.responseTimeMs
                      ? `Domain 1 (+${site2.performanceMetrics.responseTimeMs - site1.performanceMetrics.responseTimeMs}ms faster)`
                      : `Domain 2 (+${site1.performanceMetrics.responseTimeMs - site2.performanceMetrics.responseTimeMs}ms faster)`}
                  </span>
                </td>
              </tr>
              <tr>
                <td className="fw-semibold text-dark">FCP (First Contentful Paint)</td>
                <td className="text-muted">&lt; 1.8s</td>
                <td>{site1.performanceMetrics?.fcp || '1.4s'}</td>
                <td>{site2.performanceMetrics?.fcp || '2.1s'}</td>
                <td className="text-end">
                  <span className="mui-chip chip-info">Mobile Paint Advantage</span>
                </td>
              </tr>
              <tr>
                <td className="fw-semibold text-dark">LCP (Largest Contentful Paint)</td>
                <td className="text-muted">&lt; 2.5s</td>
                <td>{site1.performanceMetrics?.lcp || '2.5s'}</td>
                <td>{site2.performanceMetrics?.lcp || '3.4s'}</td>
                <td className="text-end">
                  <span className="mui-chip chip-pass">Better CTR Retention</span>
                </td>
              </tr>
              <tr>
                <td className="fw-semibold text-dark">CLS (Cumulative Layout Shift)</td>
                <td className="text-muted">&lt; 0.10</td>
                <td>{site1.performanceMetrics?.cls || '0.04'}</td>
                <td>{site2.performanceMetrics?.cls || '0.08'}</td>
                <td className="text-end">
                  <span className="mui-chip chip-neutral">Visual Stability</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Content & Schema Gaps Analysis */}
      <div className="row g-3">
        {/* What You're Missing (Competitor has it) */}
        <div className="col-12 col-md-6">
          <div className="rp-card h-100">
            <div className="d-flex align-items-center justify-content-between pb-2 mb-3 border-bottom" style={{ borderColor: 'var(--mui-slate-100)' }}>
              <div>
                <h3 className="h6 fw-bold text-dark mb-0" style={{ fontSize: '14px' }}>Opportunities You Are Missing</h3>
                <p className="text-secondary small mb-0" style={{ fontSize: '12px' }}>Competitor has these signals optimized</p>
              </div>
              <span className="mui-chip chip-warning">{gaps.url1Missing.length} Gaps</span>
            </div>

            <div className="d-flex flex-column gap-2">
              {gaps.url1Missing.map((item, idx) => (
                <div key={idx} className="p-3 rounded border bg-light" style={{ borderColor: 'var(--mui-slate-200)', fontSize: '13px' }}>
                  <div className="d-flex align-items-start justify-content-between gap-2 mb-1">
                    <span className="fw-bold text-dark">{item.name}</span>
                    <span className="mui-chip chip-warning">{item.impact} Impact</span>
                  </div>
                  <p className="text-secondary small mb-1" style={{ fontSize: '12.5px' }}>{item.reason}</p>
                  <div className="p-2 bg-white rounded border text-muted" style={{ fontSize: '12px' }}>
                    <span className="fw-semibold text-dark">Competitor's Setup: </span>
                    {item.url2Value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* What Competitor is Missing (Your Advantage) */}
        <div className="col-12 col-md-6">
          <div className="rp-card h-100">
            <div className="d-flex align-items-center justify-content-between pb-2 mb-3 border-bottom" style={{ borderColor: 'var(--mui-slate-100)' }}>
              <div>
                <h3 className="h6 fw-bold text-dark mb-0" style={{ fontSize: '14px' }}>Your Ranking Moat & Advantages</h3>
                <p className="text-secondary small mb-0" style={{ fontSize: '12px' }}>Signals where your site beats the competitor</p>
              </div>
              <span className="mui-chip chip-pass">{gaps.url2Missing.length} Moats</span>
            </div>

            <div className="d-flex flex-column gap-2">
              {gaps.url2Missing.map((item, idx) => (
                <div key={idx} className="p-3 rounded border" style={{ backgroundColor: '#f0fdf4', borderColor: '#bbf7d0', fontSize: '13px' }}>
                  <div className="d-flex align-items-start justify-content-between gap-2 mb-1">
                    <span className="fw-bold text-dark">{item.name}</span>
                    <span className="mui-chip chip-pass">Your Advantage</span>
                  </div>
                  <p className="text-secondary small mb-1" style={{ fontSize: '12.5px' }}>{item.reason}</p>
                  <div className="p-2 bg-white rounded border text-muted" style={{ fontSize: '12px' }}>
                    <span className="fw-semibold text-dark">Your Setup: </span>
                    {item.url1Value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
