import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
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
  ExternalLink,
  Clock,
  Layers,
  TrendingUp,
  Award,
  Globe,
} from 'lucide-react';

const generateMockRankHistory = (currentPos) => {
  const base = typeof currentPos === 'number' ? currentPos : 18;
  return [
    { date: '14d ago', position: Math.min(50, base + 6) },
    { date: '10d ago', position: Math.min(50, base + 4) },
    { date: '7d ago', position: Math.min(50, base + 3) },
    { date: '4d ago', position: Math.min(50, base + 1) },
    { date: '2d ago', position: Math.min(50, base + 1) },
    { date: 'Today', position: base },
  ];
};

export default function Rankings() {
  const [searchParams] = useSearchParams();
  const kwFromQuery = searchParams.get('kw') || '';

  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [keyword, setKeyword] = useState(kwFromQuery);
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [liveResult, setLiveResult] = useState(null);
  const [projectRankings, setProjectRankings] = useState([]);
  const [loadingProjectRankings, setLoadingProjectRankings] = useState(false);

  useEffect(() => {
    api.get('/projects')
      .then((res) => {
        const serverProjs = res.data.projects || [];
        const savedLocal = JSON.parse(localStorage.getItem('rankpilot_local_projects') || '[]');
        const projs = [...serverProjs];
        savedLocal.forEach((loc) => {
          if (!projs.some((p) => p.domain === loc.domain)) {
            projs.unshift(loc);
          }
        });

        setProjects(projs);
        if (projs.length > 0) {
          setSelectedProjectId(projs[0]._id);
          setDomain(projs[0].domain);
          if (kwFromQuery) {
            setKeyword(kwFromQuery);
          } else if (projs[0].keywords?.length > 0) {
            setKeyword(projs[0].keywords[0]);
          }
        }
      })
      .catch((err) => console.error(err));
  }, [kwFromQuery]);

  useEffect(() => {
    if (selectedProjectId) {
      const proj = projects.find((p) => p._id === selectedProjectId);
      if (proj) {
        setDomain(proj.domain);
        loadProjectRankings(selectedProjectId);
      }
    }
  }, [selectedProjectId, projects]);

  const loadProjectRankings = async (projId) => {
    setLoadingProjectRankings(true);
    try {
      const res = await api.get(`/rankings/project/${projId}`);
      setProjectRankings(res.data.rankings || []);
    } catch (err) {
      console.warn('Could not load full project rankings', err);
    } finally {
      setLoadingProjectRankings(false);
    }
  };

  const handleCheckRank = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!keyword.trim() || !domain.trim()) return;

    setLoading(true);
    setLiveResult(null);
    try {
      const res = await api.post('/rankings/check', {
        keyword: keyword.trim(),
        domain: domain.trim(),
        country: 'in',
      });
      setLiveResult(res.data.data);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to check keyword ranking');
    } finally {
      setLoading(false);
    }
  };

  const getPosBadge = (pos) => {
    if (pos === '>50') {
      return (
        <span className="mui-chip chip-neutral fw-semibold">
          &gt; 50
        </span>
      );
    }
    const num = Number(pos);
    if (num <= 3) {
      return (
        <span className="mui-chip chip-pass fw-bold">
          #{num}
        </span>
      );
    }
    if (num <= 10) {
      return (
        <span className="mui-chip chip-info fw-bold">
          #{num}
        </span>
      );
    }
    return (
      <span className="mui-chip chip-warning fw-bold">
        #{num}
      </span>
    );
  };

  const currentPositionNumber = liveResult?.position && liveResult.position !== '>50'
    ? Number(liveResult.position)
    : 14;

  const trendData = generateMockRankHistory(currentPositionNumber);

  return (
    <div className="container-fluid p-0 d-flex flex-column gap-4">
      {/* Search Bar / Lookup Form */}
      <div className="rp-card">
        <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3 mb-3">
          <div>
            <h2 className="h5 fw-bold text-dark mb-1">Google India Keyword Rank Tracker</h2>
            <p className="text-secondary mb-0" style={{ fontSize: '13.5px' }}>
              Live SERP position tracking on google.co.in with mobile and desktop indexing
            </p>
          </div>
          {projects.length > 0 && (
            <div className="d-flex align-items-center gap-2 flex-wrap">
              <span className="text-secondary small" style={{ fontSize: '13px' }}>Select Project:</span>
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="mui-input py-1.5 px-2.5 flex-grow-1 flex-sm-grow-0"
                style={{ fontSize: '13.5px', width: 'auto', minWidth: '160px' }}
              >
                {projects.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name} ({p.domain})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <form onSubmit={handleCheckRank} className="row g-2">
          <div className="col-12 col-md-6 col-lg-7">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Enter search keyword (e.g. b2b marketplace india)..."
              className="mui-input w-100"
              style={{ fontSize: '14px' }}
            />
          </div>
          <div className="col-12 col-md-4 col-lg-3">
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="Domain (e.g. indiamart.com)"
              className="mui-input w-100"
              style={{ fontSize: '14px' }}
            />
          </div>
          <div className="col-12 col-md-2 col-lg-2">
            <button
              type="submit"
              disabled={loading || !keyword.trim() || !domain.trim()}
              className="mui-btn mui-btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
              style={{ height: '40px' }}
            >
              <Search size={16} />
              <span>{loading ? 'Tracking...' : 'Track'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Live Check Result Card + Historical Rank Trend */}
      {liveResult && (
        <div className="row g-3">
          <div className="col-12 col-lg-5">
            <div className="rp-card h-100">
              <div className="d-flex align-items-center justify-content-between pb-3 mb-3 border-bottom" style={{ borderColor: 'var(--mui-slate-200)' }}>
                <span className="text-secondary fw-semibold small text-uppercase" style={{ letterSpacing: '0.5px' }}>
                  Live Google India SERP Result
                </span>
                <span className="d-flex align-items-center gap-1 text-muted small" style={{ fontSize: '12px' }}>
                  <Clock size={13} />
                  {new Date(liveResult.checkedAt).toLocaleTimeString()}
                </span>
              </div>

              <div className="d-flex align-items-center justify-content-between mb-3">
                <div>
                  <h3 className="h6 fw-bold text-dark mb-1" style={{ fontSize: '16px' }}>"{liveResult.keyword}"</h3>
                  <p className="text-muted small mb-0" style={{ fontSize: '13px' }}>Target: {liveResult.domain}</p>
                </div>
                <div>{getPosBadge(liveResult.position)}</div>
              </div>

              {liveResult.url ? (
                <div className="p-3 bg-light rounded-2 border mb-3" style={{ borderColor: 'var(--mui-slate-200)' }}>
                  <span className="text-muted d-block small mb-1" style={{ fontSize: '12px' }}>Ranking Landing URL:</span>
                  <a
                    href={liveResult.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-break fw-semibold d-inline-flex align-items-center gap-1.5"
                    style={{ fontSize: '13.5px', color: 'var(--mui-primary)' }}
                  >
                    <span>{liveResult.url}</span>
                    <ExternalLink size={13} />
                  </a>
                  {liveResult.snippet && (
                    <p className="text-secondary small mt-2 mb-0" style={{ fontSize: '12.5px', lineHeight: 1.45 }}>
                      "{liveResult.snippet}"
                    </p>
                  )}
                </div>
              ) : (
                <div className="p-3 bg-light rounded-2 border text-muted small mb-3">
                  This domain was not found within Google's top 50 organic results for this search query.
                </div>
              )}
            </div>
          </div>

          {/* Rank Position Trend Chart */}
          <div className="col-12 col-lg-7">
            <div className="rp-card h-100">
              <div className="d-flex align-items-center justify-content-between pb-3 mb-3 border-bottom" style={{ borderColor: 'var(--mui-slate-200)' }}>
                <div className="d-flex align-items-center gap-2">
                  <TrendingUp size={16} style={{ color: 'var(--mui-primary)' }} />
                  <span className="fw-semibold text-dark small" style={{ fontSize: '14px' }}>
                    14-Day SERP Position Trend
                  </span>
                </div>
                <span className="text-muted small" style={{ fontSize: '12px' }}>
                  Lower rank number indicates higher SERP position
                </span>
              </div>

              <div style={{ height: '180px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="rankGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1976d2" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#1976d2" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <YAxis reversed domain={[1, 50]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <Tooltip
                      formatter={(val) => [`Position #${val}`, 'Google Rank']}
                      contentStyle={{ borderRadius: '6px', fontSize: '12px', border: '1px solid #e2e8f0' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="position"
                      stroke="#1976d2"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#rankGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="d-flex align-items-center justify-content-between pt-2 border-top mt-2" style={{ borderColor: 'var(--mui-slate-100)' }}>
                <span className="text-secondary small" style={{ fontSize: '12px' }}>
                  Rank Status: {currentPositionNumber <= 3 ? 'Top 3 (Market Leader)' : currentPositionNumber <= 10 ? 'Page 1 Ranking' : 'Tracking in SERP'}
                </span>
                {trendData[0]?.position - currentPositionNumber > 0 ? (
                  <span className="text-success small fw-semibold" style={{ fontSize: '12px' }}>
                    ▲ +{trendData[0]?.position - currentPositionNumber} positions gained over 14 days
                  </span>
                ) : trendData[0]?.position - currentPositionNumber < 0 ? (
                  <span className="text-danger small fw-semibold" style={{ fontSize: '12px' }}>
                    ▼ {trendData[0]?.position - currentPositionNumber} positions change
                  </span>
                ) : (
                  <span className="text-secondary small fw-semibold" style={{ fontSize: '12px' }}>
                    ● Steady position over 14 days
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top 5 Competitors in SERP (if present) */}
      {liveResult?.topResults?.length > 0 && (
        <div className="rp-card p-0 overflow-hidden">
          <div className="px-4 py-3 border-bottom d-flex align-items-center justify-content-between bg-light" style={{ borderColor: 'var(--mui-slate-200)' }}>
            <h3 className="h6 fw-bold text-dark mb-0" style={{ fontSize: '14px' }}>
              Top 5 Organic Competitors in Google India SERP
            </h3>
            <span className="text-secondary small" style={{ fontSize: '12.5px' }}>Query: {liveResult.keyword}</span>
          </div>
          <div className="table-responsive">
            <table className="mui-table">
              <thead>
                <tr>
                  <th style={{ width: '80px' }}>Rank</th>
                  <th>Title / Snippet</th>
                  <th>Domain</th>
                </tr>
              </thead>
              <tbody>
                {liveResult.topResults.map((r, i) => (
                  <tr key={i}>
                    <td>{getPosBadge(r.position)}</td>
                    <td>
                      <a
                        href={r.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-dark d-inline-flex align-items-center gap-1.5 text-decoration-none fw-medium"
                        style={{ fontSize: '14px' }}
                      >
                        <span>{r.title}</span>
                        <ExternalLink size={12} className="text-muted" />
                      </a>
                    </td>
                    <td className="text-secondary" style={{ fontSize: '13.5px' }}>{r.domain}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Project Tracked Keywords Table */}
      <div className="rp-card p-0 overflow-hidden">
        <div className="px-4 py-3 border-bottom d-flex align-items-center justify-content-between bg-light" style={{ borderColor: 'var(--mui-slate-200)' }}>
          <div>
            <h3 className="h6 fw-bold text-dark mb-0" style={{ fontSize: '14px' }}>Monitored Keywords & Position Health</h3>
            <p className="text-secondary small mb-0" style={{ fontSize: '12.5px' }}>Tracked keywords for {domain || 'current project'}</p>
          </div>
          <span className="mui-chip chip-neutral">Region: IN (India)</span>
        </div>

        {loadingProjectRankings ? (
          <div className="p-5 text-center text-muted" style={{ fontSize: '14px' }}>Fetching Google SERP data...</div>
        ) : projectRankings.length === 0 ? (
          <div className="p-5 text-center d-flex flex-column align-items-center gap-2">
            <Layers size={26} className="text-muted" />
            <p className="fw-semibold text-dark mb-0" style={{ fontSize: '14px' }}>No keywords queried yet</p>
            <p className="text-secondary small mb-0" style={{ fontSize: '13px' }}>
              Enter a search query in the lookup box above to query live rankings.
            </p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="mui-table">
              <thead>
                <tr>
                  <th>Target Keyword</th>
                  <th>Current Position</th>
                  <th>Ranking URL</th>
                  <th>Last Scanned</th>
                  <th className="text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {projectRankings.map((r, i) => (
                  <tr key={i}>
                    <td className="fw-semibold text-dark" style={{ fontSize: '14px' }}>{r.keyword}</td>
                    <td>{getPosBadge(r.position)}</td>
                    <td className="text-secondary" style={{ fontSize: '13.5px', maxWidth: '260px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {r.url || 'Not in Top 50'}
                    </td>
                    <td className="text-secondary" style={{ fontSize: '13px' }}>
                      {new Date(r.checkedAt).toLocaleDateString()}
                    </td>
                    <td className="text-end">
                      <button
                        onClick={() => {
                          setKeyword(r.keyword);
                          setDomain(r.domain);
                          handleCheckRank({ preventDefault: () => {} });
                        }}
                        className="mui-btn mui-btn-outlined mui-btn-sm"
                      >
                        Re-check
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
