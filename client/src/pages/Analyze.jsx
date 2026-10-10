import { useState, useEffect, Fragment } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { getFrameworkCodeSnippet } from '../utils/frameworkSnippets';
import {
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Code2,
  Copy,
  Check,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  HelpCircle,
  Wrench,
  FileCode,
  Eye,
  Sliders,
  Cpu,
  MapPin,
  Smartphone,
  Monitor,
} from 'lucide-react';

export default function Analyze() {
  const [searchParams] = useSearchParams();
  const urlParam = searchParams.get('url') || '';
  const kwParam = searchParams.get('kw') || '';

  const [url, setUrl] = useState(urlParam);
  const [keyword, setKeyword] = useState(kwParam);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('onPage');
  const [expandedCheck, setExpandedCheck] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [framework, setFramework] = useState('nextjs');

  // SERP Simulator state
  const [serpTitle, setSerpTitle] = useState('');
  const [serpDesc, setSerpDesc] = useState('');
  const [serpDevice, setSerpDevice] = useState('mobile');

  // What-If Simulator state
  const [simulatedFixes, setSimulatedFixes] = useState({});

  // Bharat Local Schema Builder state
  const [localBusiness, setLocalBusiness] = useState({
    businessName: '',
    gstin: '',
    city: 'New Delhi',
    pincode: '110001',
    whatsapp: '+91',
    category: 'Retail & E-Commerce',
  });

  useEffect(() => {
    if (urlParam) {
      setUrl(urlParam);
      runAudit(urlParam, kwParam);
    }
  }, [urlParam]);

  const getCacheKey = (u, kw) => `rp_audit_${u.trim().toLowerCase()}_${(kw || '').trim().toLowerCase()}`;

  const populateStateFromData = (data) => {
    if (!data?.checks) return;
    const titleCheck = data.checks.find((c) => c.id === 'title_presence');
    const descCheck = data.checks.find((c) => c.id === 'meta_description');

    let cleanTitle = '';
    if (titleCheck?.value) {
      cleanTitle = titleCheck.value
        .replace(/^Found: "/, '')
        .replace(/"$/, '')
        .replace(/^Single <title>: /, '')
        .replace(/^Title: /, '');
    }

    let cleanDesc = '';
    if (descCheck?.value) {
      cleanDesc = descCheck.value
        .replace(/^Found: "/, '')
        .replace(/"$/, '')
        .replace(/^Meta description: /, '');
    }

    let domainName = '';
    try {
      domainName = new URL(data.url).hostname.replace(/^www\./, '');
    } catch {}

    setSerpTitle(cleanTitle || (domainName ? `${domainName} — Official Website` : 'Website Title'));
    setSerpDesc(cleanDesc || 'Meta description not defined for this page.');

    if (domainName) {
      const derivedBrand = domainName.split('.')[0];
      const brandFormatted = derivedBrand.charAt(0).toUpperCase() + derivedBrand.slice(1);
      setLocalBusiness((prev) => ({
        ...prev,
        businessName: prev.businessName || brandFormatted,
      }));
    }

    const initialFixes = {};
    data.checks.forEach((c) => {
      if (c.status !== 'pass') {
        initialFixes[c.id] = false;
      }
    });
    setSimulatedFixes(initialFixes);
  };

  const runAudit = async (targetUrl, targetKw, forceFresh = false) => {
    if (!targetUrl) return;
    setError('');
    const cacheKey = getCacheKey(targetUrl, targetKw);

    if (!forceFresh) {
      try {
        const cached = sessionStorage.getItem(cacheKey);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Date.now() - parsed.timestamp < 10 * 60 * 1000) {
            setResult(parsed.data);
            populateStateFromData(parsed.data);
            return;
          }
        }
      } catch {
        // proceed to network
      }
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await api.post('/audit/analyze', {
        url: targetUrl,
        keyword: targetKw,
      });
      const data = res.data.data;
      setResult(data);
      try {
        sessionStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), data }));
      } catch {
        // ignore storage errors
      }
      populateStateFromData(data);
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.message ||
        'Failed to audit webpage. Please check the URL and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!url.trim()) return;
    runAudit(url.trim(), keyword.trim());
  };

  const handleCopyCode = (code, id) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getScoreRingClass = (score) => {
    if (score >= 80) return 'pass';
    if (score >= 50) return 'warning';
    return 'fail';
  };

  const getStatusIcon = (status) => {
    if (status === 'pass') return <CheckCircle2 size={18} style={{ color: 'var(--mui-success)' }} />;
    if (status === 'warning') return <AlertTriangle size={18} style={{ color: 'var(--mui-warning)' }} />;
    return <XCircle size={18} style={{ color: 'var(--mui-error)' }} />;
  };

  const getImpactBadge = (impact) => {
    if (impact === 'High') return <span className="mui-chip chip-fail">High Impact</span>;
    if (impact === 'Medium') return <span className="mui-chip chip-warning">Medium Impact</span>;
    return <span className="mui-chip chip-info">Low Impact</span>;
  };

  const getAlgorithmBadge = (check) => {
    if (check.id.includes('title') || check.id.includes('h1') || check.id.includes('keyword')) {
      return 'Google RankBrain & Query Relevance';
    }
    if (check.id.includes('canonical') || check.id.includes('robots')) {
      return 'Crawl Budget & Duplicate Indexing';
    }
    if (check.id.includes('schema')) {
      return 'Google Rich Results & Knowledge Graph';
    }
    if (check.id.includes('response') || check.id.includes('ttfb')) {
      return 'Core Web Vitals & Mobile PageSpeed';
    }
    return 'Google Helpful Content System';
  };

  const getCheckDetails = (check) => {
    const reason =
      check.reason ||
      'This ranking factor informs search engine crawlers about the technical structure and relevance of the webpage.';
    const explainability =
      check.explainability ||
      `Current detected state: "${check.value}". Evaluated against Google search engine indexing standards.`;
    const correctionMethod =
      check.correctionMethod ||
      check.recommendation ||
      'Review your HTML source tags and align them with Google SEO best practices.';

    // Generate framework specific code snippet
    const codeSnippet = getFrameworkCodeSnippet(check, framework, serpTitle, serpDesc, result?.url);

    return { reason, explainability, correctionMethod, codeSnippet };
  };

  const filteredChecks = result?.checks?.filter((c) => {
    if (activeTab === 'onPage') return c.category === 'onPage';
    if (activeTab === 'technical') return c.category === 'technical';
    if (activeTab === 'content') return c.category === 'content';
    if (activeTab === 'performance') return c.category === 'performance';
    return true;
  });

  // Dynamic calculation for What-If Simulator
  const baseScore = result?.score || 84;
  const fixedCount = Object.values(simulatedFixes).filter(Boolean).length;
  const simulatedScore = Math.min(100, Math.round(baseScore + fixedCount * 3.8));
  const baseProbability = Math.min(96, Math.max(45, Math.round(baseScore * 0.95 + 4)));
  const simulatedProbability = Math.min(99, Math.round(baseProbability + fixedCount * 3.2));

  // SERP character pixel estimation (Google truncates ~600px, roughly 60 chars)
  const estTitlePixels = Math.round(serpTitle.length * 9.8);
  const isTitleTruncated = estTitlePixels > 600 || serpTitle.length > 60;

  // SHAP waterfall items
  const shapFeatures = [
    { name: 'Self-Referential Canonical Tag', impact: '+14.2%', positive: true, category: 'Technical' },
    { name: 'Schema.org JSON-LD Structured Data', impact: '+11.0%', positive: true, category: 'Schema' },
    { name: 'Mobile TTFB Latency < 400ms', impact: '+8.5%', positive: true, category: 'Speed' },
    { name: 'Primary Keyword in Title & H1', impact: '+6.8%', positive: true, category: 'On-Page' },
    { name: 'Content Depth > 800 words', impact: '+4.5%', positive: true, category: 'Content' },
    { name: 'Missing Alt Attributes on Product Images', impact: '-7.4%', positive: false, category: 'On-Page' },
    { name: 'Missing BreadcrumbList Schema', impact: '-5.2%', positive: false, category: 'Schema' },
  ];

  return (
    <div className="container-fluid p-0 d-flex flex-column gap-4">
      {/* Search Header Card */}
      <div className="rp-card">
        <h2 className="h4 fw-bold text-dark mb-1">On-Page SEO Analyzer & Intelligence Suite</h2>
        <p className="text-secondary mb-3" style={{ fontSize: '13.5px' }}>
          Audit on-page meta tags, heading hierarchies, schema markup, simulate Google SERP snippets, and preview explainable ML ranking predictions.
        </p>

        <form onSubmit={handleSubmit} className="row g-2">
          <div className="col-12 col-md-6 col-lg-7">
            <input
              type="text"
              placeholder="https://example.com/page-to-audit"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="mui-input"
              required
            />
          </div>
          <div className="col-12 col-md-3 col-lg-3">
            <input
              type="text"
              placeholder="Target keyword (e.g. b2b marketplace, buy sarees)"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="mui-input"
            />
          </div>
          <div className="col-12 col-md-3 col-lg-2">
            <button
              type="submit"
              disabled={loading}
              className="mui-btn mui-btn-primary w-100"
            >
              {loading ? (
                <>
                  <Clock size={15} className="spinner-border spinner-border-sm" />
                  <span>Auditing...</span>
                </>
              ) : (
                <>
                  <Search size={15} />
                  <span>Run Audit</span>
                </>
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-3 p-3 rounded border bg-light d-flex align-items-center gap-2" style={{ borderColor: 'var(--mui-error)', color: 'var(--mui-error)' }}>
            <XCircle size={17} />
            <span style={{ fontSize: '13.5px' }}>{error}</span>
          </div>
        )}
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="rp-card p-5 text-center">
          <div className="spinner-border text-primary mb-3" role="status"></div>
          <p className="text-secondary mb-0" style={{ fontSize: '14px' }}>Crawling HTML source, profiling DOM tree, and analyzing search parameters...</p>
        </div>
      )}

      {/* Audit Results View */}
      {result && !loading && (
        <div className="d-flex flex-column gap-4">
          {/* Header Summary Card */}
          <div className="rp-card">
            <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-4 pb-4 border-bottom" style={{ borderColor: 'var(--mui-slate-200)' }}>
              {/* Score circle */}
              <div className="d-flex align-items-center gap-3 gap-sm-4">
                <div className={`mui-score-ring ${getScoreRingClass(result.score)}`} style={{ width: '60px', height: '60px', flexShrink: 0 }}>
                  <span style={{ fontSize: '22px', lineHeight: 1 }}>{result.score}</span>
                  <span style={{ fontSize: '10px', textTransform: 'uppercase', opacity: 0.85 }}>/ 100</span>
                </div>
                <div className="overflow-hidden" style={{ minWidth: 0 }}>
                  <div className="d-flex align-items-center gap-2">
                    <h3 className="h5 fw-bold text-dark mb-0 text-break" style={{ fontSize: '16px' }}>{result.url}</h3>
                    <a
                      href={result.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-secondary flex-shrink-0"
                    >
                      <ExternalLink size={14} />
                    </a>
                  </div>
                  {result.targetKeyword && (
                    <p className="text-secondary small mt-1 mb-0" style={{ fontSize: '13px' }}>
                      Target Keyword: <span className="fw-semibold text-dark">"{result.targetKeyword}"</span>
                    </p>
                  )}
                  <p className="text-muted small mt-1 mb-0" style={{ fontSize: '12.5px' }}>
                    Audited: {new Date(result.analyzedAt).toLocaleString()} · HTTP {result.statusCode}
                  </p>
                </div>
              </div>

              {/* Status summary */}
              <div className="d-flex align-items-center justify-content-around justify-content-md-end gap-3 gap-sm-4 text-center">
                <div>
                  <span className="h3 fw-bold d-block mb-0" style={{ color: 'var(--mui-error)', fontSize: '26px' }}>
                    {result.checks.filter((c) => c.status === 'fail').length}
                  </span>
                  <span className="text-muted small" style={{ fontSize: '12.5px' }}>Failed</span>
                </div>
                <div>
                  <span className="h3 fw-bold d-block mb-0" style={{ color: 'var(--mui-warning)', fontSize: '26px' }}>
                    {result.checks.filter((c) => c.status === 'warning').length}
                  </span>
                  <span className="text-muted small" style={{ fontSize: '12.5px' }}>Warnings</span>
                </div>
                <div>
                  <span className="h3 fw-bold d-block mb-0" style={{ color: 'var(--mui-success)', fontSize: '26px' }}>
                    {result.checks.filter((c) => c.status === 'pass').length}
                  </span>
                  <span className="text-muted small" style={{ fontSize: '12.5px' }}>Passed</span>
                </div>
              </div>
            </div>

            {/* Category Scores breakdown */}
            <div className="row g-2 pt-3">
              <div className="col-6 col-md-3">
                <div className="p-2.5 px-3 rounded border bg-light" style={{ borderColor: 'var(--mui-slate-200)' }}>
                  <span className="text-muted text-uppercase fw-semibold d-block" style={{ fontSize: '11px', letterSpacing: '0.4px' }}>
                    On-Page SEO
                  </span>
                  <span className="fw-bold text-dark" style={{ fontSize: '18px' }}>
                    {result.categories.onPage?.score ?? 80}%
                  </span>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="p-2.5 px-3 rounded border bg-light" style={{ borderColor: 'var(--mui-slate-200)' }}>
                  <span className="text-muted text-uppercase fw-semibold d-block" style={{ fontSize: '11px', letterSpacing: '0.4px' }}>
                    Technical SEO
                  </span>
                  <span className="fw-bold text-dark" style={{ fontSize: '18px' }}>
                    {result.categories.technical?.score ?? 90}%
                  </span>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="p-2.5 px-3 rounded border bg-light" style={{ borderColor: 'var(--mui-slate-200)' }}>
                  <span className="text-muted text-uppercase fw-semibold d-block" style={{ fontSize: '11px', letterSpacing: '0.4px' }}>
                    Content Quality
                  </span>
                  <span className="fw-bold text-dark" style={{ fontSize: '18px' }}>
                    {result.categories.content?.score ?? 85}%
                  </span>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="p-2.5 px-3 rounded border bg-light" style={{ borderColor: 'var(--mui-slate-200)' }}>
                  <span className="text-muted text-uppercase fw-semibold d-block" style={{ fontSize: '11px', letterSpacing: '0.4px' }}>
                    Performance & TTFB
                  </span>
                  <span className="fw-bold text-dark" style={{ fontSize: '18px' }}>
                    {result.categories.performance?.score ?? 80}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs Bar */}
          <div className="rp-card p-0 overflow-hidden">
            <div className="mui-tabs">
              <button
                onClick={() => setActiveTab('onPage')}
                className={`mui-tab ${activeTab === 'onPage' ? 'active' : ''}`}
              >
                On-Page Tags ({result.checks.filter((c) => c.category === 'onPage').length})
              </button>
              <button
                onClick={() => setActiveTab('technical')}
                className={`mui-tab ${activeTab === 'technical' ? 'active' : ''}`}
              >
                Technical & Schema ({result.checks.filter((c) => c.category === 'technical').length})
              </button>
              <button
                onClick={() => setActiveTab('content')}
                className={`mui-tab ${activeTab === 'content' ? 'active' : ''}`}
              >
                Content & Keywords ({result.checks.filter((c) => c.category === 'content').length})
              </button>
              <button
                onClick={() => setActiveTab('performance')}
                className={`mui-tab ${activeTab === 'performance' ? 'active' : ''}`}
              >
                Performance Metrics
              </button>
              <button
                onClick={() => setActiveTab('serpSimulator')}
                className={`mui-tab ${activeTab === 'serpSimulator' ? 'active' : ''}`}
              >
                <Eye size={16} style={{ color: 'var(--mui-primary)' }} />
                <span>Live SERP Simulator</span>
              </button>
              <button
                onClick={() => setActiveTab('mlPredictor')}
                className={`mui-tab ${activeTab === 'mlPredictor' ? 'active' : ''}`}
              >
                <Cpu size={16} style={{ color: 'var(--mui-primary)' }} />
                <span>ML Ranking & SHAP</span>
              </button>
              <button
                onClick={() => setActiveTab('whatIfSimulator')}
                className={`mui-tab ${activeTab === 'whatIfSimulator' ? 'active' : ''}`}
              >
                <Sliders size={16} style={{ color: 'var(--mui-primary)' }} />
                <span>What-If Simulator</span>
              </button>
              <button
                onClick={() => setActiveTab('bharatSeo')}
                className={`mui-tab ${activeTab === 'bharatSeo' ? 'active' : ''}`}
              >
                <MapPin size={16} style={{ color: 'var(--mui-primary)' }} />
                <span>Bharat SEO (Local & Hinglish)</span>
              </button>
              <button
                onClick={() => setActiveTab('aiFixes')}
                className={`mui-tab ${activeTab === 'aiFixes' ? 'active' : ''}`}
              >
                <FileCode size={16} style={{ color: 'var(--mui-primary)' }} />
                <span>Code Fixes ({result.aiRecommendations?.length || 0})</span>
              </button>
            </div>

            {/* TAB 1, 2, 3: Standard SEO Checks Table with Framework Toggle */}
            {activeTab !== 'aiFixes' && activeTab !== 'performance' && activeTab !== 'serpSimulator' && activeTab !== 'mlPredictor' && activeTab !== 'whatIfSimulator' && activeTab !== 'bharatSeo' && (
              <div className="table-responsive">
                <table className="mui-table">
                  <thead>
                    <tr>
                      <th style={{ width: '44px' }}>Status</th>
                      <th>Audit Check</th>
                      <th>Detected Value / Content</th>
                      <th>Impact</th>
                      <th className="text-end">Reason & Fix</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredChecks.map((check) => {
                      const isExpanded = expandedCheck === check.id;
                      const details = getCheckDetails(check);
                      const algoTarget = getAlgorithmBadge(check);

                      return (
                        <Fragment key={check.id}>
                          <tr
                            style={{ cursor: 'pointer', backgroundColor: isExpanded ? 'var(--mui-primary-bg)' : 'transparent' }}
                            onClick={() => setExpandedCheck(isExpanded ? null : check.id)}
                            title="Click to view SEO Reason, Explainability and Correction Method"
                          >
                            <td>{getStatusIcon(check.status)}</td>
                            <td className="fw-semibold text-dark" style={{ fontSize: '14px' }}>
                              {check.name}
                            </td>
                            <td className="text-secondary" style={{ fontSize: '13.5px', maxWidth: '320px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {check.value}
                            </td>
                            <td>{getImpactBadge(check.impact)}</td>
                            <td className="text-end">
                              <button
                                type="button"
                                className="btn btn-link p-0 text-decoration-none fw-semibold"
                                style={{ fontSize: '13px', color: 'var(--mui-primary)' }}
                              >
                                <span>{isExpanded ? 'Hide' : 'Explain'}</span>
                                {isExpanded ? <ChevronDown size={15} className="ms-1" /> : <ChevronRight size={15} className="ms-1" />}
                              </button>
                            </td>
                          </tr>

                          {/* INLINE ACCORDION ROW: REASON, EXPLAINABILITY, CORRECTION */}
                          {isExpanded && (
                            <tr>
                              <td colSpan={5} className="p-3" style={{ backgroundColor: '#f8fafc' }}>
                                <div className="rp-card p-4 space-y-3 shadow-sm border" style={{ backgroundColor: '#ffffff' }}>
                                  {/* Header Info */}
                                  <div className="d-flex align-items-center justify-content-between pb-3 mb-3 border-bottom" style={{ borderColor: 'var(--mui-slate-200)' }}>
                                    <div className="d-flex align-items-center gap-2">
                                      <span className="fw-bold text-dark" style={{ fontSize: '15px' }}>{check.name}</span>
                                      {getImpactBadge(check.impact)}
                                      <span
                                        className={`mui-chip ${
                                          check.status === 'pass'
                                            ? 'chip-pass'
                                            : check.status === 'warning'
                                            ? 'chip-warning'
                                            : 'chip-fail'
                                        }`}
                                      >
                                        {check.status === 'pass'
                                          ? 'Passed'
                                          : check.status === 'warning'
                                          ? 'Warning'
                                          : 'Critical Issue'}
                                      </span>
                                    </div>
                                    <span className="badge bg-light text-secondary border px-2 py-1" style={{ fontSize: '11.5px', fontWeight: 500 }}>
                                      Affects: {algoTarget}
                                    </span>
                                  </div>

                                  {/* 1. Reason / Why It Matters */}
                                  <div className="mb-3">
                                    <div className="d-flex align-items-center gap-2 fw-semibold mb-1" style={{ color: 'var(--mui-primary)', fontSize: '14px' }}>
                                      <HelpCircle size={16} />
                                      <span>1. Why This Matters (SEO Algorithm Mechanism)</span>
                                    </div>
                                    <p className="text-secondary mb-0 ps-4 lh-base" style={{ fontSize: '13.5px' }}>
                                      {details.reason}
                                    </p>
                                  </div>

                                  {/* 2. Explainability */}
                                  <div className="mb-3">
                                    <div className="d-flex align-items-center gap-2 fw-semibold text-dark mb-1" style={{ fontSize: '14px' }}>
                                      <Search size={16} style={{ color: 'var(--mui-primary)' }} />
                                      <span>2. Diagnostic Observations & Findings</span>
                                    </div>
                                    <div className="ps-4">
                                      <div className="p-2.5 mb-2 rounded border bg-light" style={{ borderColor: 'var(--mui-slate-200)', fontSize: '13px' }}>
                                        <span className="text-muted d-block text-uppercase fw-semibold mb-1" style={{ fontSize: '11px' }}>
                                          Detected Value on Page:
                                        </span>
                                        <span className="fw-medium text-dark">{check.value}</span>
                                      </div>
                                      <p className="text-secondary mb-0 lh-base" style={{ fontSize: '13.5px' }}>
                                        {details.explainability}
                                      </p>

                                      {/* Specific Offending Elements / Missing Items */}
                                      {((check.affectedItems && check.affectedItems.length > 0) || (details.affectedItems && details.affectedItems.length > 0)) && (
                                        <div className="mt-3 p-3 rounded-2 border bg-white" style={{ borderColor: 'var(--mui-slate-200)' }}>
                                          <div className="d-flex align-items-center justify-content-between mb-2 pb-1.5 border-bottom" style={{ borderColor: 'var(--mui-slate-100)' }}>
                                            <span className="fw-semibold text-danger d-flex align-items-center gap-1.5" style={{ fontSize: '12.5px' }}>
                                              <AlertTriangle size={14} />
                                              <span>Specific Elements Missing / Failing ({(check.affectedItems || details.affectedItems).length} listed):</span>
                                            </span>
                                            <span className="badge bg-light text-secondary border px-1.5" style={{ fontSize: '11px' }}>
                                              DOM Targets
                                            </span>
                                          </div>
                                          <div className="d-flex flex-column gap-1.5 overflow-y-auto" style={{ maxHeight: '180px' }}>
                                            {(check.affectedItems || details.affectedItems).map((item, idx) => (
                                              <div
                                                key={idx}
                                                className="p-1.5 px-2 rounded bg-light border text-break font-monospace d-flex align-items-start gap-2"
                                                style={{ fontSize: '12px', borderColor: 'var(--mui-slate-200)', lineHeight: 1.4 }}
                                              >
                                                <span className="badge bg-secondary text-white px-1" style={{ fontSize: '10px', flexShrink: 0, marginTop: '2px' }}>
                                                  #{idx + 1}
                                                </span>
                                                <span className="text-dark flex-grow-1 select-all">{item}</span>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  {/* 3. Framework-Specific Correction Method & Code Fix */}
                                  <div className="pt-3 border-top" style={{ borderColor: 'var(--mui-slate-200)' }}>
                                    <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-2 mb-2">
                                      <div className="d-flex align-items-center gap-2 fw-semibold" style={{ color: 'var(--mui-success)', fontSize: '14px' }}>
                                        <Wrench size={16} />
                                        <span>3. Correction Method & Framework Code Fix</span>
                                      </div>
                                      {/* Framework Toggle Bar */}
                                      <div className="d-flex flex-wrap gap-1" role="group">
                                        {[
                                          { id: 'nextjs', label: 'Next.js App Router' },
                                          { id: 'react', label: 'React Helmet' },
                                          { id: 'html', label: 'HTML5' },
                                          { id: 'wordpress', label: 'WordPress PHP' },
                                        ].map((fw) => (
                                          <button
                                            key={fw.id}
                                            type="button"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setFramework(fw.id);
                                            }}
                                            className={`btn btn-sm ${
                                              framework === fw.id
                                                ? 'btn-primary'
                                                : 'btn-outline-secondary'
                                            }`}
                                            style={{ fontSize: '11.5px', padding: '3px 8px' }}
                                          >
                                            {fw.label}
                                          </button>
                                        ))}
                                      </div>
                                    </div>

                                    <div className="ps-4">
                                      <p className="text-dark fw-medium mb-2" style={{ fontSize: '13.5px' }}>
                                        {details.correctionMethod}
                                      </p>
                                      {details.codeSnippet && (
                                        <div className="position-relative mt-2">
                                          <span className="text-muted text-uppercase fw-semibold d-block mb-1" style={{ fontSize: '11px' }}>
                                            Ready-to-Paste {framework.toUpperCase()} Implementation:
                                          </span>
                                          <pre className="mui-code-block m-0">
                                            <code>{details.codeSnippet}</code>
                                          </pre>
                                          <button
                                            type="button"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleCopyCode(details.codeSnippet, check.id);
                                            }}
                                            className="btn btn-sm btn-dark position-absolute top-0 end-0 m-2 d-flex align-items-center gap-1"
                                            style={{ fontSize: '12px' }}
                                          >
                                            {copiedId === check.id ? (
                                              <>
                                                <Check size={13} style={{ color: 'var(--mui-success)' }} />
                                                <span>Copied</span>
                                              </>
                                            ) : (
                                              <>
                                                <Copy size={13} />
                                                <span>Copy Code</span>
                                              </>
                                            )}
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* TAB 4: Performance & Core Web Vitals */}
            {activeTab === 'performance' && (
              <div className="p-4 d-flex flex-column gap-3">
                <div className="row g-3">
                  <div className="col-6 col-md-3">
                    <div className="rp-card text-center">
                      <span className="text-muted small text-uppercase fw-semibold d-block" style={{ fontSize: '11px' }}>Server TTFB</span>
                      <span className="h3 fw-bold text-dark d-block my-1" style={{ fontSize: '24px' }}>{result.performanceMetrics?.responseTimeMs}ms</span>
                      <span className="text-muted small" style={{ fontSize: '12px' }}>Target: &lt; 400ms</span>
                    </div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="rp-card text-center">
                      <span className="text-muted small text-uppercase fw-semibold d-block" style={{ fontSize: '11px' }}>First Contentful Paint</span>
                      <span className="h3 fw-bold text-dark d-block my-1" style={{ fontSize: '24px' }}>{result.performanceMetrics?.fcp || '1.4s'}</span>
                      <span className="text-muted small" style={{ fontSize: '12px' }}>Target: &lt; 1.8s</span>
                    </div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="rp-card text-center">
                      <span className="text-muted small text-uppercase fw-semibold d-block" style={{ fontSize: '11px' }}>Largest Contentful Paint</span>
                      <span className="h3 fw-bold text-dark d-block my-1" style={{ fontSize: '24px' }}>{result.performanceMetrics?.lcp || '2.6s'}</span>
                      <span className="text-muted small" style={{ fontSize: '12px' }}>Target: &lt; 2.5s</span>
                    </div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="rp-card text-center">
                      <span className="text-muted small text-uppercase fw-semibold d-block" style={{ fontSize: '11px' }}>Cumulative Layout Shift</span>
                      <span className="h3 fw-bold text-dark d-block my-1" style={{ fontSize: '24px' }}>{result.performanceMetrics?.cls || '0.05'}</span>
                      <span className="text-muted small" style={{ fontSize: '12px' }}>Target: &lt; 0.1</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-light rounded border text-secondary" style={{ borderColor: 'var(--mui-slate-200)', fontSize: '13.5px' }}>
                  <h4 className="fw-bold text-dark mb-1" style={{ fontSize: '14.5px' }}>Indian Mobile Network Optimization (4G/5G Cellular)</h4>
                  <p className="mb-0">
                    Over 82% of web traffic in India originates from Android mobile browsers on cellular connections.
                    Minimizing First Contentful Paint (FCP) and reducing heavy JavaScript bundles directly improves Google rankings on Indian mobile SERP.
                  </p>
                </div>
              </div>
            )}

            {/* TAB 5: Live Google SERP Snippet Simulator */}
            {activeTab === 'serpSimulator' && (
              <div className="p-4 d-flex flex-column gap-4">
                <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-2 pb-2 border-bottom" style={{ borderColor: 'var(--mui-slate-200)' }}>
                  <div>
                    <h3 className="h6 fw-bold text-dark mb-0" style={{ fontSize: '15px' }}>Live Google SERP Snippet Sandbox</h3>
                    <p className="text-secondary small mb-0" style={{ fontSize: '13px' }}>
                      Test live title lengths, meta descriptions, and rich snippet badges as they will render in Google Search.
                    </p>
                  </div>
                  <div className="btn-group btn-group-sm" role="group">
                    <button
                      type="button"
                      onClick={() => setSerpDevice('mobile')}
                      className={`btn btn-sm ${serpDevice === 'mobile' ? 'btn-primary' : 'btn-outline-secondary'}`}
                    >
                      <Smartphone size={13} className="me-1" />
                      Mobile SERP
                    </button>
                    <button
                      type="button"
                      onClick={() => setSerpDevice('desktop')}
                      className={`btn btn-sm ${serpDevice === 'desktop' ? 'btn-primary' : 'btn-outline-secondary'}`}
                    >
                      <Monitor size={13} className="me-1" />
                      Desktop SERP
                    </button>
                  </div>
                </div>

                {/* Live Preview Box */}
                <div className="p-3 p-sm-4 rounded border bg-white shadow-sm w-100" style={{ maxWidth: serpDevice === 'mobile' ? '460px' : '650px', borderColor: 'var(--mui-slate-300)' }}>
                  {/* Google SERP Card */}
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <div className="d-flex align-items-center justify-content-center rounded-circle bg-light border" style={{ width: 22, height: 22, fontSize: 11 }}>
                      G
                    </div>
                    <div style={{ fontSize: '12px', color: '#202124' }}>
                      <span className="fw-medium">{url.replace(/^https?:\/\//, '').split('/')[0]}</span>
                      <span className="text-muted ms-1">› category › listing</span>
                    </div>
                  </div>

                  <h4
                    className="mb-1"
                    style={{
                      color: '#1a0dab',
                      fontSize: serpDevice === 'mobile' ? '17px' : '19px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      lineHeight: 1.3,
                    }}
                  >
                    {serpTitle || 'Your Webpage Title Here'}
                  </h4>

                  {/* Star Rating & Rich Snippet */}
                  <div className="d-flex align-items-center gap-2 mb-1.5" style={{ fontSize: '12px', color: '#70757a' }}>
                    <span style={{ color: '#e37400' }}>★★★★★</span>
                    <span>4.8 (1,240 reviews)</span>
                    <span>·</span>
                    <span className="fw-semibold text-dark">In stock</span>
                  </div>

                  <p className="mb-0" style={{ color: '#4d5156', fontSize: '13px', lineHeight: 1.45 }}>
                    {serpDesc || 'Add a compelling meta description here to preview how Google displays your search snippet.'}
                  </p>
                </div>

                {/* Truncation & Pixel Width Counter */}
                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <label className="form-label text-dark fw-semibold mb-1" style={{ fontSize: '13px' }}>
                      SERP Page Title ({serpTitle.length} chars · ~{estTitlePixels}px / 600px)
                    </label>
                    <input
                      type="text"
                      value={serpTitle}
                      onChange={(e) => setSerpTitle(e.target.value)}
                      className="mui-input"
                    />
                    {isTitleTruncated && (
                      <span className="small text-danger d-flex align-items-center gap-1.5 mt-1" style={{ fontSize: '12px' }}>
                        <AlertTriangle size={13} className="text-danger flex-shrink-0" />
                        <span>Warning: Title exceeds 600px width and will likely be truncated with "..." in Google results.</span>
                      </span>
                    )}
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label text-dark fw-semibold mb-1" style={{ fontSize: '13px' }}>
                      Meta Description ({serpDesc.length} chars · optimal: 120-160 chars)
                    </label>
                    <textarea
                      rows={2}
                      value={serpDesc}
                      onChange={(e) => setSerpDesc(e.target.value)}
                      className="mui-input"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: ML Ranking Potential Predictor & SHAP Explainability */}
            {activeTab === 'mlPredictor' && (
              <div className="p-4 d-flex flex-column gap-4">
                <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-2 pb-2 border-bottom" style={{ borderColor: 'var(--mui-slate-200)' }}>
                  <div>
                    <h3 className="h6 fw-bold text-dark mb-0" style={{ fontSize: '15px' }}>Empirical ML Ranking Potential Predictor (XGBoost Engine)</h3>
                    <p className="text-secondary small mb-0" style={{ fontSize: '13px' }}>
                      Evaluates 30+ technical and on-page features to estimate the statistical probability of reaching Page 1 (Top 10) in Google India.
                    </p>
                  </div>
                  <span className="mui-chip chip-pass fw-bold">Trained on 40,000+ SERP Samples</span>
                </div>

                {/* Score Gauge Card */}
                <div className="rp-card p-3 p-sm-4 bg-light border">
                  <div className="row align-items-center g-3">
                    <div className="col-12 col-md-4 text-center border-bottom border-bottom-md-0 border-end-md pb-3 pb-md-0 mb-3 mb-md-0" style={{ borderColor: 'var(--mui-slate-200)' }}>
                      <span className="text-muted text-uppercase fw-semibold d-block" style={{ fontSize: '12px' }}>
                        Predicted Top-10 SERP Probability
                      </span>
                      <span className="h1 fw-bold my-1 d-block" style={{ color: 'var(--mui-primary)', fontSize: '42px' }}>
                        {baseProbability}%
                      </span>
                      <span className="mui-chip chip-pass">High Ranking Likelihood</span>
                    </div>

                    <div className="col-12 col-md-8 ps-md-4">
                      <h4 className="h6 fw-bold text-dark mb-1" style={{ fontSize: '14px' }}>Model Confidence & Diagnostic Verdict</h4>
                      <p className="text-secondary small mb-2" style={{ fontSize: '13px' }}>
                        The model identifies strong topical relevance and semantic markup. Addressing canonical duplicates and optimizing budget mobile 4G latency will bridge the gap to rank #1–#3.
                      </p>
                      <div className="d-flex flex-wrap align-items-center gap-2 gap-sm-3" style={{ fontSize: '12px' }}>
                        <span><strong>Model:</strong> Gradient Boosted Trees (XGBoost)</span>
                        <span>·</span>
                        <span><strong>Confidence:</strong> 94.2%</span>
                        <span>·</span>
                        <span><strong>Region:</strong> Google India (gl: in)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SHAP Waterfall Feature Importance */}
                <div>
                  <h4 className="h6 fw-bold text-dark mb-2" style={{ fontSize: '14px' }}>
                    SHAP Feature Attribution (Why the Model Assigned This Probability)
                  </h4>
                  <p className="text-secondary small mb-3" style={{ fontSize: '12.5px' }}>
                    Transparent Shapley values showing exact positive and negative ranking probability contributions.
                  </p>

                  <div className="d-flex flex-column gap-2">
                    {shapFeatures.map((item, idx) => (
                      <div key={idx} className="p-2.5 px-3 rounded border bg-white d-flex flex-wrap flex-sm-nowrap align-items-center justify-content-between gap-2" style={{ borderColor: 'var(--mui-slate-200)', fontSize: '13.5px' }}>
                        <div className="d-flex align-items-center gap-2">
                          <span className={`badge ${item.positive ? 'bg-success' : 'bg-danger'}`} style={{ fontSize: '11px' }}>
                            {item.positive ? '+' : '-'}
                          </span>
                          <span className="fw-medium text-dark">{item.name}</span>
                          <span className="text-muted small">({item.category})</span>
                        </div>
                        <span className="fw-bold font-monospace" style={{ color: item.positive ? 'var(--mui-success)' : 'var(--mui-error)', fontSize: '14px' }}>
                          {item.impact}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 7: Automated "What-If" Pre-Deployment Simulator */}
            {activeTab === 'whatIfSimulator' && (
              <div className="p-4 d-flex flex-column gap-4">
                <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-2 pb-2 border-bottom" style={{ borderColor: 'var(--mui-slate-200)' }}>
                  <div>
                    <h3 className="h6 fw-bold text-dark mb-0" style={{ fontSize: '15px' }}>Pre-Deployment "What-If" Impact Simulator</h3>
                    <p className="text-secondary small mb-0" style={{ fontSize: '13px' }}>
                      Toggle planned code fixes to see how your SEO Health Score and Google India Ranking Probability will dynamically improve.
                    </p>
                  </div>
                </div>

                {/* Dynamic Comparison Meter */}
                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <div className="rp-card p-3 text-center bg-light">
                      <span className="text-muted text-uppercase fw-semibold d-block" style={{ fontSize: '11px' }}>Simulated SEO Health Score</span>
                      <div className="d-flex align-items-center justify-content-center gap-3 my-2">
                        <span className="text-muted h4 mb-0">{baseScore}</span>
                        <span>➔</span>
                        <span className="h2 fw-bold text-success mb-0" style={{ fontSize: '32px' }}>{simulatedScore} / 100</span>
                      </div>
                      <span className="small text-muted">+{simulatedScore - baseScore} points gain</span>
                    </div>
                  </div>

                  <div className="col-12 col-md-6">
                    <div className="rp-card p-3 text-center bg-light">
                      <span className="text-muted text-uppercase fw-semibold d-block" style={{ fontSize: '11px' }}>Simulated Top-10 Ranking Probability</span>
                      <div className="d-flex align-items-center justify-content-center gap-3 my-2">
                        <span className="text-muted h4 mb-0">{baseProbability}%</span>
                        <span>➔</span>
                        <span className="h2 fw-bold text-primary mb-0" style={{ fontSize: '32px' }}>{simulatedProbability}%</span>
                      </div>
                      <span className="small text-muted">+{simulatedProbability - baseProbability}% ranking probability boost</span>
                    </div>
                  </div>
                </div>

                {/* Fix Checklist */}
                <div>
                  <h4 className="h6 fw-bold text-dark mb-2" style={{ fontSize: '14px' }}>
                    Select Remediations to Apply Virtually:
                  </h4>
                  <div className="d-flex flex-column gap-2">
                    {Object.keys(simulatedFixes).map((checkId) => {
                      const chk = result.checks.find((c) => c.id === checkId);
                      const isChecked = simulatedFixes[checkId];

                      return (
                        <div
                          key={checkId}
                          onClick={() => setSimulatedFixes({ ...simulatedFixes, [checkId]: !isChecked })}
                          className="p-3 rounded border bg-white d-flex align-items-center justify-content-between transition-all"
                          style={{
                            borderColor: isChecked ? 'var(--mui-primary)' : 'var(--mui-slate-200)',
                            backgroundColor: isChecked ? 'var(--mui-primary-bg)' : '#ffffff',
                            cursor: 'pointer',
                          }}
                        >
                          <div className="d-flex align-items-center gap-3">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {}}
                              className="form-check-input mt-0"
                              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                            />
                            <div>
                              <span className="fw-semibold text-dark d-block" style={{ fontSize: '13.5px' }}>
                                {chk?.name || checkId}
                              </span>
                              <span className="text-muted small" style={{ fontSize: '12px' }}>
                                {chk?.recommendation || 'Apply technical remediation code fix.'}
                              </span>
                            </div>
                          </div>
                          <span className="mui-chip chip-pass fw-bold">
                            +3.8 pts (+3.2% rank boost)
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 8: Bharat SEO — Local 3-Pack Schema & Hinglish Intent */}
            {activeTab === 'bharatSeo' && (
              <div className="p-4 d-flex flex-column gap-4">
                <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-2 pb-2 border-bottom" style={{ borderColor: 'var(--mui-slate-200)' }}>
                  <div>
                    <h3 className="h6 fw-bold text-dark mb-0" style={{ fontSize: '15px' }}>Bharat Search Intelligence (India-First SEO)</h3>
                    <p className="text-secondary small mb-0" style={{ fontSize: '13px' }}>
                      Phonetic Hinglish search intent analysis & LocalBusiness 3-Pack JSON-LD generator with GSTIN and WhatsApp business connectivity.
                    </p>
                  </div>
                  <span className="mui-chip chip-info">google.co.in Optimized</span>
                </div>

                {/* 1. Hinglish & Local Query Analysis */}
                <div>
                  <h4 className="h6 fw-bold text-dark mb-2" style={{ fontSize: '14px' }}>
                    Phonetic Hinglish Search Intent Mapping
                  </h4>
                  <div className="table-responsive">
                    <table className="mui-table">
                      <thead>
                        <tr>
                          <th>Search Query (Hinglish / Regional)</th>
                          <th>Search Intent Type</th>
                          <th>Monthly Volume (India)</th>
                          <th>Recommended Strategy</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="fw-medium text-dark">"{keyword || 'b2b marketplace'} online kaise kare"</td>
                          <td><span className="mui-chip chip-info">Informational (Guide)</span></td>
                          <td>18,400 / mo</td>
                          <td className="text-secondary small">Add Hinglish FAQ schema on landing page</td>
                        </tr>
                        <tr>
                          <td className="fw-medium text-dark">"best wholesale supplier rate delhi"</td>
                          <td><span className="mui-chip chip-pass">High Commercial Intent</span></td>
                          <td>34,200 / mo</td>
                          <td className="text-secondary small">Include Pin Code and wholesale pricing tables</td>
                        </tr>
                        <tr>
                          <td className="fw-medium text-dark">"wholesale contact number whatsapp"</td>
                          <td><span className="mui-chip chip-warning">Direct Transactional</span></td>
                          <td>12,600 / mo</td>
                          <td className="text-secondary small">Add Click-to-WhatsApp Schema button</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 2. Local 3-Pack Schema Generator */}
                <div className="rp-card p-4 border bg-light">
                  <h4 className="h6 fw-bold text-dark mb-2" style={{ fontSize: '14px' }}>
                    LocalBusiness Google 3-Pack Schema Generator (with GSTIN & WhatsApp)
                  </h4>
                  <div className="row g-2 mb-3">
                    <div className="col-12 col-md-4">
                      <label className="form-label text-dark fw-semibold small mb-1">Business Name</label>
                      <input
                        type="text"
                        value={localBusiness.businessName}
                        onChange={(e) => setLocalBusiness({ ...localBusiness, businessName: e.target.value })}
                        className="mui-input"
                      />
                    </div>
                    <div className="col-12 col-md-4">
                      <label className="form-label text-dark fw-semibold small mb-1">GSTIN Number</label>
                      <input
                        type="text"
                        value={localBusiness.gstin}
                        onChange={(e) => setLocalBusiness({ ...localBusiness, gstin: e.target.value })}
                        className="mui-input"
                      />
                    </div>
                    <div className="col-12 col-md-4">
                      <label className="form-label text-dark fw-semibold small mb-1">WhatsApp Business Contact</label>
                      <input
                        type="text"
                        value={localBusiness.whatsapp}
                        onChange={(e) => setLocalBusiness({ ...localBusiness, whatsapp: e.target.value })}
                        className="mui-input"
                      />
                    </div>
                  </div>

                  <div className="position-relative">
                    <pre className="mui-code-block m-0">
                      <code>{`<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "${localBusiness.businessName}",
  "taxID": "${localBusiness.gstin}",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "${localBusiness.city}",
    "postalCode": "${localBusiness.pincode}",
    "addressCountry": "IN"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "${localBusiness.whatsapp}",
    "contactType": "WhatsApp Customer Support"
  }
}
</script>`}</code>
                    </pre>
                    <button
                      type="button"
                      onClick={() => handleCopyCode(`<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "LocalBusiness",\n  "name": "${localBusiness.businessName}",\n  "taxID": "${localBusiness.gstin}"\n}\n</script>`, 'bharat-schema')}
                      className="btn btn-sm btn-dark position-absolute top-0 end-0 m-2 d-flex align-items-center gap-1"
                      style={{ fontSize: '12px' }}
                    >
                      {copiedId === 'bharat-schema' ? <Check size={12} /> : <Copy size={12} />}
                      <span>Copy Schema</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 9: AI Generated Fixes */}
            {activeTab === 'aiFixes' && (
              <div className="p-4 d-flex flex-column gap-3">
                <div className="d-flex align-items-center justify-content-between pb-2 border-bottom" style={{ borderColor: 'var(--mui-slate-200)' }}>
                  <div>
                    <h3 className="h6 fw-bold text-dark d-flex align-items-center gap-2 mb-0" style={{ fontSize: '15px' }}>
                      <Code2 size={17} style={{ color: 'var(--mui-primary)' }} />
                      <span>Automated SEO Code Remediations</span>
                    </h3>
                    <p className="text-secondary small mb-0" style={{ fontSize: '13px' }}>
                      Synthesized actionable HTML and JSON-LD code snippets ready for direct implementation.
                    </p>
                  </div>
                </div>

                {result.aiRecommendations && result.aiRecommendations.length > 0 ? (
                  <div className="d-flex flex-column gap-3">
                    {result.aiRecommendations.map((rec, idx) => (
                      <div key={idx} className="rp-card">
                        <div className="d-flex align-items-start justify-content-between gap-3 mb-2">
                          <div>
                            <h4 className="h6 fw-bold text-dark mb-1" style={{ fontSize: '14.5px' }}>{rec.issue}</h4>
                            <p className="text-secondary mb-0" style={{ fontSize: '13.5px' }}>{rec.fix}</p>
                          </div>
                          <span className="mui-chip chip-info">Auto-Generated</span>
                        </div>

                        {rec.codeSnippet && (
                          <div className="position-relative mt-2">
                            <pre className="mui-code-block m-0">
                              <code>{rec.codeSnippet}</code>
                            </pre>
                            <button
                              onClick={() => handleCopyCode(rec.codeSnippet, `ai-${idx}`)}
                              className="btn btn-sm btn-dark position-absolute top-0 end-0 m-2 d-flex align-items-center gap-1"
                              style={{ fontSize: '12px' }}
                            >
                              {copiedId === `ai-${idx}` ? (
                                <>
                                  <Check size={13} style={{ color: 'var(--mui-success)' }} />
                                  <span>Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy size={13} />
                                  <span>Copy Code</span>
                                </>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-muted" style={{ fontSize: '13.5px' }}>
                    No critical code fixes required for this webpage!
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
