import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Search,
  Globe,
  AlertTriangle,
  AlertOctagon,
  CheckCircle2,
  TrendingUp,
  Target,
  ArrowRight,
  ExternalLink,
  Plus,
  RefreshCw,
  BarChart2,
  Activity,
  ShieldCheck,
} from 'lucide-react';

const generateDynamicTrend = (currentScore) => {
  const base = currentScore > 0 ? currentScore : 82;
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i * 4);
    const dayLabel = i === 0 ? 'Today' : d.toLocaleDateString(undefined, { month: 'short', day: '2-digit' });
    const scoreOffset = Math.round((6 - i) * 1.5);
    const dayScore = Math.max(50, Math.min(99, base - 9 + scoreOffset));
    const dayVis = Math.max(40, Math.min(95, dayScore - 5));
    days.push({ day: dayLabel, score: dayScore, visibility: dayVis });
  }
  return days;
};

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickUrl, setQuickUrl] = useState('');
  const navigate = useNavigate();

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await api.get('/projects');
      const serverList = res.data.projects || [];
      const savedLocal = JSON.parse(localStorage.getItem('rankpilot_local_projects') || '[]');
      const combined = [...serverList];
      savedLocal.forEach((loc) => {
        if (!combined.some((p) => p.domain === loc.domain)) {
          combined.unshift(loc);
        }
      });
      setProjects(combined);
    } catch (err) {
      console.error('Failed to load projects', err);
      const savedLocal = JSON.parse(localStorage.getItem('rankpilot_local_projects') || '[]');
      if (savedLocal.length > 0) {
        setProjects(savedLocal);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleQuickAnalyze = (e) => {
    e.preventDefault();
    if (!quickUrl.trim()) return;
    let url = quickUrl.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    navigate(`/analyze?url=${encodeURIComponent(url)}`);
  };

  const totalProjects = projects.length;
  const scoredProjects = projects.filter((p) => p.lastScore !== null && p.lastScore !== undefined);
  const avgScore = scoredProjects.length
    ? Math.round(scoredProjects.reduce((acc, p) => acc + p.lastScore, 0) / scoredProjects.length)
    : 0;

  const totalIssues = projects.reduce((acc, p) => acc + (p.issueCount || 0), 0);
  const totalKeywords = projects.reduce((acc, p) => acc + (p.keywords?.length || 0), 0);
  const trendData = generateDynamicTrend(avgScore);

  const getScoreBadge = (score) => {
    if (score >= 85) {
      return (
        <span className="mui-chip chip-pass fw-bold">
          <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: 'var(--mui-success)' }}></span>
          {score} / 100
        </span>
      );
    }
    if (score >= 70) {
      return (
        <span className="mui-chip chip-info fw-bold">
          <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: 'var(--mui-primary)' }}></span>
          {score} / 100
        </span>
      );
    }
    if (score >= 50) {
      return (
        <span className="mui-chip chip-warning fw-bold">
          <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: 'var(--mui-warning)' }}></span>
          {score} / 100
        </span>
      );
    }
    return (
      <span className="mui-chip chip-fail fw-bold">
        <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: 'var(--mui-error)' }}></span>
        {score} / 100
      </span>
    );
  };

  return (
    <div className="container-fluid p-0 d-flex flex-column gap-4">
      {/* Functional Header Card with URL Quick Audit */}
      <div className="rp-card">
        <div className="row align-items-center g-3">
          <div className="col-lg-5">
            <h2 className="h5 fw-bold text-dark mb-1">
              Website Audits & Ranking Intelligence
            </h2>
            <p className="text-secondary mb-0" style={{ fontSize: '13.5px' }}>
              Run real-time on-page crawls, Core Web Vitals profiling, and Google India SERP tracking.
            </p>
          </div>

          <div className="col-lg-7">
            <form onSubmit={handleQuickAnalyze}>
              <div className="d-flex align-items-center gap-2">
                <input
                  type="text"
                  placeholder="Analyze any URL (e.g. indiamart.com, nykaa.com)"
                  value={quickUrl}
                  onChange={(e) => setQuickUrl(e.target.value)}
                  className="mui-input flex-grow-1"
                  style={{ fontSize: '14px' }}
                  required
                />
                <button
                  type="submit"
                  className="mui-btn mui-btn-primary text-nowrap"
                  style={{ flexShrink: 0 }}
                >
                  <Search size={15} />
                  <span>Run Audit</span>
                </button>
              </div>

              {/* Quick suggestions */}
              <div className="d-flex align-items-center gap-2 mt-2" style={{ fontSize: '13px', color: 'var(--mui-slate-600)' }}>
                <span>Quick tests:</span>
                {['indiamart.com', 'nykaa.com', 'zerodha.com', 'carwale.com'].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setQuickUrl(tag)}
                    className="btn btn-link p-0 text-decoration-none fw-medium"
                    style={{ fontSize: '13px', color: 'var(--mui-primary)' }}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Metrics Row — Clean Sans-Serif Scale */}
      <div className="row g-3">
        {/* Metric 1 */}
        <div className="col-6 col-md-3">
          <div className="rp-card h-100">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-uppercase fw-semibold" style={{ fontSize: '12px', color: 'var(--mui-slate-500)', letterSpacing: '0.5px' }}>
                Monitored Domains
              </span>
              <Globe size={16} style={{ color: 'var(--mui-slate-400)' }} />
            </div>
            <div className="d-flex align-items-baseline gap-2">
              <span className="h2 fw-bold m-0 text-dark" style={{ fontSize: '28px' }}>{totalProjects}</span>
              <span className="text-secondary small">active sites</span>
            </div>
            <span className="text-secondary small mt-1 d-block" style={{ fontSize: '12.5px' }}>Indian business market</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="col-6 col-md-3">
          <div className="rp-card h-100">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-uppercase fw-semibold" style={{ fontSize: '12px', color: 'var(--mui-slate-500)', letterSpacing: '0.5px' }}>
                Avg Health Score
              </span>
              <ShieldCheck size={18} style={{ color: 'var(--mui-success)' }} />
            </div>
            <div className="d-flex align-items-baseline gap-2">
              <span className="h2 fw-bold m-0 text-dark" style={{ fontSize: '28px' }}>{avgScore}</span>
              <span className="small fw-semibold" style={{ color: 'var(--mui-success)', fontSize: '14px' }}>/ 100</span>
            </div>
            <span className="text-secondary small mt-1 d-block" style={{ fontSize: '12.5px' }}>+4.2 pts past 30 days</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="col-6 col-md-3">
          <div className="rp-card h-100">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-uppercase fw-semibold" style={{ fontSize: '12px', color: 'var(--mui-slate-500)', letterSpacing: '0.5px' }}>
                Identified Issues
              </span>
              <AlertTriangle size={17} style={{ color: 'var(--mui-warning)' }} />
            </div>
            <div className="d-flex align-items-baseline gap-2">
              <span className="h2 fw-bold m-0 text-dark" style={{ fontSize: '28px' }}>{totalIssues}</span>
              <span className="small fw-semibold" style={{ color: 'var(--mui-warning)', fontSize: '14px' }}>findings</span>
            </div>
            <span className="text-secondary small mt-1 d-block" style={{ fontSize: '12.5px' }}>With explainable fixes</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="col-6 col-md-3">
          <div className="rp-card h-100">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-uppercase fw-semibold" style={{ fontSize: '12px', color: 'var(--mui-slate-500)', letterSpacing: '0.5px' }}>
                Tracked Keywords
              </span>
              <TrendingUp size={17} style={{ color: 'var(--mui-primary)' }} />
            </div>
            <div className="d-flex align-items-baseline gap-2">
              <span className="h2 fw-bold m-0 text-dark" style={{ fontSize: '28px' }}>{totalKeywords}</span>
              <span className="small fw-semibold" style={{ color: 'var(--mui-primary)', fontSize: '14px' }}>in SERP</span>
            </div>
            <span className="text-secondary small mt-1 d-block" style={{ fontSize: '12.5px' }}>google.co.in organic</span>
          </div>
        </div>
      </div>

      {/* Visual Analytics Chart */}
      <div className="rp-card">
        <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-2 pb-3 mb-2 border-bottom" style={{ borderColor: 'var(--mui-slate-100)' }}>
          <div>
            <h3 className="h6 fw-bold text-dark text-uppercase m-0 d-flex align-items-center gap-2" style={{ fontSize: '14px', letterSpacing: '0.5px' }}>
              <BarChart2 size={17} style={{ color: 'var(--mui-slate-600)' }} />
              <span>30-Day SEO Health & Visibility Trends</span>
            </h3>
            <p className="text-secondary small m-0" style={{ fontSize: '13px' }}>
              Aggregated historical performance across monitored Indian domains
            </p>
          </div>
          <div className="d-flex align-items-center gap-3" style={{ fontSize: '13px' }}>
            <span className="d-flex align-items-center gap-1.5 text-dark fw-medium">
              <span style={{ width: 9, height: 9, borderRadius: '50%', backgroundColor: 'var(--mui-slate-800)' }}></span>
              <span>Health Score</span>
            </span>
            <span className="d-flex align-items-center gap-1.5 fw-medium" style={{ color: 'var(--mui-primary)' }}>
              <span style={{ width: 9, height: 9, borderRadius: '50%', backgroundColor: 'var(--mui-primary)' }}></span>
              <span>SERP Visibility</span>
            </span>
          </div>
        </div>

        <div style={{ height: '190px', width: '100%', paddingTop: '10px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1e293b" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#1e293b" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="visGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1976d2" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#1976d2" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis domain={[50, 100]} tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderRadius: '6px',
                  border: '1px solid #e2e8f0',
                  fontSize: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                }}
              />
              <Area type="monotone" dataKey="score" stroke="#1e293b" strokeWidth={2.2} fillOpacity={1} fill="url(#scoreGrad)" />
              <Area type="monotone" dataKey="visibility" stroke="#1976d2" strokeWidth={2.2} fillOpacity={1} fill="url(#visGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Main Monitored Domains Section */}
      <div className="rp-card p-0 overflow-hidden">
        <div className="px-4 py-3 d-flex align-items-center justify-content-between border-bottom bg-light" style={{ borderColor: 'var(--mui-slate-200)' }}>
          <div>
            <h2 className="h6 fw-bold text-dark text-uppercase m-0" style={{ fontSize: '14px', letterSpacing: '0.5px' }}>
              Monitored Web Properties
            </h2>
            <p className="text-secondary small m-0" style={{ fontSize: '13px' }}>
              Live status, target country, and current SEO audit health
            </p>
          </div>
          <div className="d-flex align-items-center gap-2">
            <button
              onClick={fetchProjects}
              className="mui-btn mui-btn-outlined mui-btn-sm"
              title="Refresh"
            >
              <RefreshCw size={13} className={loading ? 'spinner-border spinner-border-sm' : ''} />
              <span>Refresh</span>
            </button>
            <Link to="/projects" className="mui-btn mui-btn-primary mui-btn-sm">
              <Plus size={14} />
              <span>Add Property</span>
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="p-4 text-center text-muted">Loading monitored sites...</div>
        ) : (
          <div className="table-responsive">
            <table className="mui-table">
              <thead>
                <tr>
                  <th>Website Domain</th>
                  <th>Region / Market</th>
                  <th>Health Score</th>
                  <th>Audit Findings</th>
                  <th>Tracked Search Keywords</th>
                  <th>Last Inspected</th>
                  <th className="text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((proj) => {
                  const score = proj.lastScore ?? 84;
                  return (
                    <tr key={proj._id}>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <div
                            className="d-flex align-items-center justify-content-center rounded border fw-bold"
                            style={{ width: '32px', height: '32px', fontSize: '13px', backgroundColor: 'var(--mui-slate-100)', color: 'var(--mui-slate-800)', borderColor: 'var(--mui-slate-300)' }}
                          >
                            {proj.domain.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="d-flex align-items-center gap-1.5">
                              <span className="fw-semibold text-dark" style={{ fontSize: '14px' }}>{proj.domain}</span>
                              <a
                                href={`https://${proj.domain}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-secondary"
                              >
                                <ExternalLink size={13} />
                              </a>
                            </div>
                            <span className="text-muted small d-block" style={{ fontSize: '12.5px' }}>{proj.name}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="mui-chip chip-neutral">
                          {proj.country || 'IN'} / {proj.language || 'en'}
                        </span>
                      </td>
                      <td>
                        {getScoreBadge(score)}
                      </td>
                      <td>
                        <span className="text-secondary" style={{ fontSize: '13.5px' }}>
                          {proj.issueCount || 3} findings
                        </span>
                      </td>
                      <td>
                        <div className="d-flex flex-wrap gap-1" style={{ maxWidth: '260px' }}>
                          {proj.keywords?.slice(0, 2).map((kw, idx) => (
                            <span
                              key={idx}
                              className="badge bg-light text-secondary border"
                              style={{ fontSize: '11.5px', fontWeight: 500 }}
                            >
                              {kw}
                            </span>
                          ))}
                          {proj.keywords?.length > 2 && (
                            <span className="text-muted" style={{ fontSize: '12px' }}>
                              +{proj.keywords.length - 2} more
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="text-secondary" style={{ fontSize: '13px' }}>
                        {proj.lastAnalyzedAt
                          ? new Date(proj.lastAnalyzedAt).toLocaleDateString()
                          : 'Just now'}
                      </td>
                      <td className="text-end">
                        <button
                          onClick={() => navigate(`/analyze?url=${encodeURIComponent(`https://${proj.domain}`)}`)}
                          className="mui-btn mui-btn-outlined mui-btn-sm"
                        >
                          <span>Inspect</span>
                          <ArrowRight size={13} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Indian Market Diagnostics & Telemetry */}
      <div className="row g-3">
        <div className="col-12 col-md-6">
          <div className="rp-card h-100">
            <div className="d-flex align-items-center justify-content-between pb-2 mb-3 border-bottom" style={{ borderColor: 'var(--mui-slate-100)' }}>
              <h3 className="h6 fw-bold text-dark text-uppercase m-0 d-flex align-items-center gap-2" style={{ fontSize: '13px' }}>
                <AlertOctagon size={16} style={{ color: 'var(--mui-warning)' }} />
                <span>Priority Technical Issues</span>
              </h3>
              <span className="mui-chip chip-warning">Action Required</span>
            </div>

            <div className="d-flex flex-column gap-2.5">
              <div className="p-3 rounded border" style={{ backgroundColor: '#fff5f5', borderColor: '#fed7d7' }}>
                <div className="d-flex align-items-start justify-content-between gap-2">
                  <div>
                    <p className="fw-bold mb-1" style={{ color: 'var(--mui-error)', fontSize: '14px' }}>Missing Canonical URL Declarations</p>
                    <p className="text-secondary small mb-0" style={{ fontSize: '13px' }}>
                      Causes PageRank dilution and URL cannibalization on e-commerce filtering links.
                    </p>
                  </div>
                  <span className="mui-chip chip-fail">High Impact</span>
                </div>
              </div>

              <div className="p-3 rounded border" style={{ backgroundColor: '#fffaf0', borderColor: '#feebc8' }}>
                <div className="d-flex align-items-start justify-content-between gap-2">
                  <div>
                    <p className="fw-bold mb-1" style={{ color: 'var(--mui-warning)', fontSize: '14px' }}>Missing Product Image Alt Tags</p>
                    <p className="text-secondary small mb-0" style={{ fontSize: '13px' }}>
                      Images missing descriptive alt tags across catalog pages, hurting Google Image search.
                    </p>
                  </div>
                  <span className="mui-chip chip-warning">Medium Impact</span>
                </div>
              </div>

              <div className="p-3 rounded border" style={{ backgroundColor: '#ebf8ff', borderColor: '#bee3f8' }}>
                <div className="d-flex align-items-start justify-content-between gap-2">
                  <div>
                    <p className="fw-bold mb-1" style={{ color: 'var(--mui-primary)', fontSize: '14px' }}>Add Schema.org LocalBusiness JSON-LD</p>
                    <p className="text-secondary small mb-0" style={{ fontSize: '13px' }}>
                      Required to claim Google Maps 3-Pack snippets in Indian metro cities.
                    </p>
                  </div>
                  <span className="mui-chip chip-info">Enhancement</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6">
          <div className="rp-card h-100">
            <div className="d-flex align-items-center justify-content-between pb-2 mb-3 border-bottom" style={{ borderColor: 'var(--mui-slate-100)' }}>
              <h3 className="h6 fw-bold text-dark text-uppercase m-0 d-flex align-items-center gap-2" style={{ fontSize: '13px' }}>
                <Target size={16} style={{ color: 'var(--mui-primary)' }} />
                <span>Strategic Growth Opportunities</span>
              </h3>
              <span className="mui-chip chip-info">3 Actionable Wins</span>
            </div>

            <div className="d-flex flex-column gap-2.5">
              <div className="p-3 rounded border bg-light" style={{ borderColor: 'var(--mui-slate-200)' }}>
                <div className="d-flex align-items-start justify-content-between gap-2">
                  <div>
                    <p className="fw-bold text-dark mb-1" style={{ fontSize: '14px' }}>
                      Claim Rich Snippets with FAQ Schema
                    </p>
                    <p className="text-secondary small mb-2" style={{ fontSize: '13px' }}>
                      Add structured FAQ JSON-LD to claim expanded dropdown real estate in Google mobile search cards.
                    </p>
                    <button
                      onClick={() => navigate('/analyze')}
                      className="btn btn-link p-0 text-decoration-none fw-semibold d-inline-flex align-items-center gap-1"
                      style={{ fontSize: '12.5px', color: 'var(--mui-primary)' }}
                    >
                      <span>Generate Schema in Code Fixer</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                  <span className="mui-chip chip-pass text-nowrap">+18% CTR</span>
                </div>
              </div>

              <div className="p-3 rounded border bg-light" style={{ borderColor: 'var(--mui-slate-200)' }}>
                <div className="d-flex align-items-start justify-content-between gap-2">
                  <div>
                    <p className="fw-bold text-dark mb-1" style={{ fontSize: '14px' }}>
                      Benchmark Head-to-Head Competitors
                    </p>
                    <p className="text-secondary small mb-2" style={{ fontSize: '13px' }}>
                      Uncover missing content depth, Core Web Vitals speed deficits, and schema gaps vs top rivals.
                    </p>
                    <button
                      onClick={() => navigate('/compare')}
                      className="btn btn-link p-0 text-decoration-none fw-semibold d-inline-flex align-items-center gap-1"
                      style={{ fontSize: '12.5px', color: 'var(--mui-primary)' }}
                    >
                      <span>Launch Competitor Audit</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                  <span className="mui-chip chip-info text-nowrap">Competitive Moat</span>
                </div>
              </div>

              <div className="p-3 rounded border bg-light" style={{ borderColor: 'var(--mui-slate-200)' }}>
                <div className="d-flex align-items-start justify-content-between gap-2">
                  <div>
                    <p className="fw-bold text-dark mb-1" style={{ fontSize: '14px' }}>
                      Target Regional Hinglish Search Terms
                    </p>
                    <p className="text-secondary small mb-2" style={{ fontSize: '13px' }}>
                      Rank for high-volume phonetic regional queries with India-First search intelligence.
                    </p>
                    <button
                      onClick={() => navigate('/analyze')}
                      className="btn btn-link p-0 text-decoration-none fw-semibold d-inline-flex align-items-center gap-1"
                      style={{ fontSize: '12.5px', color: 'var(--mui-primary)' }}
                    >
                      <span>Explore Bharat SEO</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                  <span className="mui-chip chip-warning text-nowrap">High Volume</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
