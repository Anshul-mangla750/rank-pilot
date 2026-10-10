import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
  Printer,
  ExternalLink,
  Calendar,
  Search,
  Plus,
  HelpCircle,
  Wrench,
  Code2,
  FileText,
  CheckCircle2,
  X,
  Download,
} from 'lucide-react';

const fallbackReports = [
  {
    _id: '661000000000000000000201',
    url: 'https://indiamart.com',
    targetKeyword: 'b2b marketplace india',
    score: 84,
    statusCode: 200,
    categories: {
      onPage: { score: 86, passed: 10, failed: 1, warnings: 2 },
      technical: { score: 90, passed: 7, failed: 0, warnings: 1 },
      content: { score: 80, passed: 5, failed: 1, warnings: 1 },
      performance: { score: 78, passed: 4, failed: 1, warnings: 1 },
    },
    checks: [
      {
        id: 'title_presence',
        name: 'Title Tag Presence',
        status: 'pass',
        value: 'IndiaMART - Indian Manufacturers Suppliers Exporters Directory, India Exporter Manufacturer',
        impact: 'High',
        reason: 'The <title> tag is one of the highest-weight on-page signals for Google search algorithms.',
        explainability: 'Present and optimized: 88 characters. Contains primary keyword "Indian Manufacturers Suppliers Exporters Directory".',
        correctionMethod: 'Title meets optimal standards. Keep primary keywords within the first 60 characters for mobile SERP truncation.',
      },
      {
        id: 'meta_description',
        name: 'Meta Description',
        status: 'pass',
        value: "IndiaMART.com is India's largest online B2B marketplace, connecting buyers with suppliers. Find Indian manufacturers, exporters and wholesale suppliers.",
        impact: 'High',
        reason: 'Directly influences Click-Through Rate (CTR) in search results, driving organic clicks.',
        explainability: 'Present and descriptive: 154 characters. Within Google optimal display length (120-160 chars).',
        correctionMethod: 'Retain current meta description and test promotional call-to-actions periodically.',
      },
      {
        id: 'h1_structure',
        name: 'H1 Heading Tag',
        status: 'pass',
        value: 'Single <h1>: "Connect with Verified Indian Suppliers & Manufacturers"',
        impact: 'High',
        reason: 'Search engines use H1 to understand the primary topic hierarchy of the document.',
        explainability: 'Exactly one <h1> found on page. Well-structured and contextual.',
        correctionMethod: 'Properly configured. Maintain a single H1 per page across all catalog templates.',
      },
      {
        id: 'images_alt',
        name: 'Image Alt Attributes',
        status: 'warning',
        value: '14 of 78 product images missing alt text',
        impact: 'Medium',
        reason: 'Image alt attributes provide search engines with contextual descriptions and enhance Google Image search traffic.',
        explainability: 'Found 14 product thumbnail images without an "alt" attribute on category grid.',
        affectedItems: [
          'https://indiamart.com/assets/img/supplier-verified-badge.svg',
          'https://indiamart.com/media/category-banner-industrial-valves.jpg',
          'https://indiamart.com/assets/images/trust-seal-gold.png',
          'https://indiamart.com/media/catalog/heavy-machinery-thumb-01.webp',
          'https://indiamart.com/images/delhi-hub-warehouse-preview.jpg',
        ],
        correctionMethod: 'Add concise, descriptive alt attributes with target product keywords.',
        codeSnippet: '<img src="/catalog/brass-valves.jpg" alt="Industrial Brass Gate Valves Manufacturer in Rajkot" loading="lazy" />',
      },
      {
        id: 'canonical_tag',
        name: 'Canonical Tag',
        status: 'pass',
        value: 'https://www.indiamart.com/',
        impact: 'High',
        reason: 'Prevents duplicate content penalties by declaring the authoritative master URL to crawlers.',
        explainability: 'Self-referential rel="canonical" tag present and valid.',
        correctionMethod: 'Maintain self-referencing canonical URLs across filtered catalog pagination.',
      },
      {
        id: 'schema_markup',
        name: 'Structured Data (Schema.org)',
        status: 'pass',
        value: 'Detected Schema types: Organization, WebSite, SearchAction',
        impact: 'High',
        reason: 'Enables rich snippets like sitelinks search boxes, ratings, and knowledge graph panels.',
        explainability: 'Valid JSON-LD schema found for Organization and WebSite.',
        correctionMethod: 'Expand schema coverage to include BreadcrumbList on category pages.',
      },
      {
        id: 'server_response_time',
        name: 'Server Response Time (TTFB)',
        status: 'pass',
        value: '290ms',
        impact: 'High',
        reason: 'Fast TTFB ensures search bots can crawl more pages within their allotted crawl budget.',
        explainability: 'Response latency was 290ms (well under Google 600ms threshold).',
        correctionMethod: 'TTFB is in healthy state. Maintain Redis caching on popular categories.',
      },
    ],
    aiRecommendations: [
      {
        issue: 'Missing Alt Tags on Product Thumbnails',
        fix: 'Add descriptive image alt attributes for supplier catalog listings.',
        codeSnippet: '<img src="/catalog/industrial-valves.jpg" alt="Forged Steel Industrial Gate Valves - Delhi Supplier" loading="lazy" />',
      },
      {
        issue: 'Breadcrumb Schema Missing on Category Pages',
        fix: 'Implement BreadcrumbList JSON-LD to render navigable SERP breadcrumbs in mobile search.',
        codeSnippet: `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://indiamart.com" },
    { "@type": "ListItem", "position": 2, "name": "Industrial Supplies", "item": "https://indiamart.com/industrial" }
  ]
}
</script>`,
      },
    ],
    performanceMetrics: {
      responseTimeMs: 290,
      fcp: '1.2s',
      lcp: '2.3s',
      cls: '0.02',
      fid: '28ms',
    },
    createdAt: new Date(Date.now() - 3600000 * 4),
  },
  {
    _id: '661000000000000000000202',
    url: 'https://nykaa.com',
    targetKeyword: 'buy cosmetics online india',
    score: 88,
    statusCode: 200,
    categories: {
      onPage: { score: 90, passed: 11, failed: 0, warnings: 2 },
      technical: { score: 92, passed: 8, failed: 0, warnings: 1 },
      content: { score: 85, passed: 6, failed: 0, warnings: 1 },
      performance: { score: 82, passed: 5, failed: 0, warnings: 2 },
    },
    checks: [
      {
        id: 'title_presence',
        name: 'Title Tag Presence',
        status: 'pass',
        value: 'Buy Cosmetics & Beauty Products Online in India | Nykaa',
        impact: 'High',
        reason: 'Essential search ranking anchor that sets expectations for SERP clickers.',
        explainability: 'Present, 56 characters, optimized with primary keywords.',
        correctionMethod: 'Title is within optimal character range (50-60 characters).',
      },
      {
        id: 'meta_description',
        name: 'Meta Description',
        status: 'pass',
        value: 'Shop cosmetics, makeup, skincare & haircare products online from top brands at Nykaa. Free delivery, COD, and authentic beauty products guaranteed.',
        impact: 'High',
        reason: 'Drives CTR by detailing product benefits like COD and free delivery.',
        explainability: 'Optimal length of 147 characters with high commercial intent.',
        correctionMethod: 'Well structured. Continue A/B testing seasonal campaign hooks.',
      },
    ],
    aiRecommendations: [
      {
        issue: 'Product Variant Structured Data',
        fix: 'Add AggregateRating and Offer schema to highlight stock availability directly in Google snippet.',
        codeSnippet: `<script type="application/ld+json">
{
  "@context": "https://schema.org/",
  "@type": "Product",
  "name": "Matte Liquid Lipstick",
  "offers": {
    "@type": "Offer",
    "priceCurrency": "INR",
    "price": "499",
    "availability": "https://schema.org/InStock"
  }
}
</script>`,
      },
    ],
    performanceMetrics: {
      responseTimeMs: 315,
      fcp: '1.4s',
      lcp: '2.5s',
      cls: '0.04',
      fid: '32ms',
    },
    createdAt: new Date(Date.now() - 3600000 * 12),
  },
  {
    _id: '661000000000000000000203',
    url: 'https://carwale.com',
    targetKeyword: 'new cars in india',
    score: 81,
    statusCode: 200,
    categories: {
      onPage: { score: 82, passed: 9, failed: 1, warnings: 3 },
      technical: { score: 88, passed: 7, failed: 0, warnings: 2 },
      content: { score: 79, passed: 5, failed: 1, warnings: 2 },
      performance: { score: 75, passed: 4, failed: 1, warnings: 2 },
    },
    checks: [
      {
        id: 'title_presence',
        name: 'Title Tag Presence',
        status: 'pass',
        value: 'New Cars, Used Cars, Car Prices, Reviews & News in India - CarWale',
        impact: 'High',
        reason: 'Anchor ranking signal for nationwide automotive search intent.',
        explainability: 'Present and informative: 65 characters.',
        correctionMethod: 'Optimal title length and brand attribution.',
      },
    ],
    aiRecommendations: [],
    performanceMetrics: {
      responseTimeMs: 720,
      fcp: '1.8s',
      lcp: '3.1s',
      cls: '0.06',
      fid: '45ms',
    },
    createdAt: new Date(Date.now() - 3600000 * 24),
  },
  {
    _id: '661000000000000000000204',
    url: 'https://practo.com',
    targetKeyword: 'book doctor appointment bangalore',
    score: 86,
    statusCode: 200,
    categories: {
      onPage: { score: 88, passed: 10, failed: 0, warnings: 2 },
      technical: { score: 91, passed: 8, failed: 0, warnings: 1 },
      content: { score: 84, passed: 6, failed: 0, warnings: 2 },
      performance: { score: 80, passed: 5, failed: 0, warnings: 2 },
    },
    checks: [
      {
        id: 'title_presence',
        name: 'Title Tag Presence',
        status: 'pass',
        value: 'Practo | Book Doctor Appointments Online & Consult Specialists',
        impact: 'High',
        reason: 'Primary page classification hook for local healthcare queries.',
        explainability: '62 characters, includes key action words ("Book Doctor Appointments").',
        correctionMethod: 'Well-aligned with user booking intent.',
      },
    ],
    aiRecommendations: [],
    performanceMetrics: {
      responseTimeMs: 340,
      fcp: '1.3s',
      lcp: '2.4s',
      cls: '0.03',
      fid: '30ms',
    },
    createdAt: new Date(Date.now() - 3600000 * 48),
  },
  {
    _id: '661000000000000000000205',
    url: 'https://zerodha.com',
    targetKeyword: 'demat account opening india',
    score: 92,
    statusCode: 200,
    categories: {
      onPage: { score: 94, passed: 12, failed: 0, warnings: 1 },
      technical: { score: 96, passed: 9, failed: 0, warnings: 0 },
      content: { score: 90, passed: 7, failed: 0, warnings: 1 },
      performance: { score: 88, passed: 6, failed: 0, warnings: 1 },
    },
    checks: [
      {
        id: 'title_presence',
        name: 'Title Tag Presence',
        status: 'pass',
        value: 'Zerodha - Online stock trading at lowest brokerage in India',
        impact: 'High',
        reason: 'Dominant trust and brokerage proposition tag for financial queries.',
        explainability: 'Present, 59 characters. Outstanding brevity and keyword density.',
        correctionMethod: 'Perfect length and branding. No adjustments needed.',
      },
    ],
    aiRecommendations: [],
    performanceMetrics: {
      responseTimeMs: 180,
      fcp: '0.9s',
      lcp: '1.7s',
      cls: '0.01',
      fid: '18ms',
    },
    createdAt: new Date(Date.now() - 3600000 * 72),
  },
];

export default function Reports() {
  const [audits, setAudits] = useState(fallbackReports);
  const [selectedAudit, setSelectedAudit] = useState(fallbackReports[0]);
  const [filterText, setFilterText] = useState('');
  const [expandedReportCheck, setExpandedReportCheck] = useState(null);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [clientName, setClientName] = useState('Dreamshi Tech / Client Board');
  const [auditorName, setAuditorName] = useState('Anshul Mangla — Lead SEO Architect');
  const [execNotes, setExecNotes] = useState('Comprehensive technical and on-page audit conducted using RankPilot XAI diagnostic engine. High-priority remediation items highlighted below.');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/audit/history?limit=20')
      .then((res) => {
        const fetched = res.data.audits || [];
        if (fetched.length > 0) {
          setAudits(fetched);
          loadAuditDetail(fetched[0]._id);
        }
      })
      .catch(() => {
        // Fallback reports are preloaded
      });
  }, []);

  const loadAuditDetail = async (id) => {
    try {
      const res = await api.get(`/audit/${id}`);
      if (res.data.audit) {
        setSelectedAudit(res.data.audit);
        return;
      }
    } catch {
      // Use fallback
    }
    const local = fallbackReports.find((a) => String(a._id) === String(id));
    if (local) setSelectedAudit(local);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    if (!selectedAudit || !selectedAudit.checks) return;
    const cleanDomain = selectedAudit.url.replace(/^https?:\/\//, '').replace(/[^\w.-]/g, '_');
    const header = ['Category', 'Check ID', 'Check Name', 'Status', 'Impact', 'Observed Value', 'Recommendation'];
    const rows = selectedAudit.checks.map((c) => [
      c.category || '',
      c.id || '',
      `"${(c.name || '').replace(/"/g, '""')}"`,
      c.status || '',
      c.impact || '',
      `"${(c.value || '').replace(/"/g, '""')}"`,
      `"${(c.recommendation || '').replace(/"/g, '""')}"`
    ]);
    const csvContent = [header.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `rankpilot-audit-${cleanDomain}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportJSON = () => {
    if (!selectedAudit) return;
    const cleanDomain = selectedAudit.url.replace(/^https?:\/\//, '').replace(/[^\w.-]/g, '_');
    const blob = new Blob([JSON.stringify(selectedAudit, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `rankpilot-audit-${cleanDomain}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredAudits = audits.filter((a) =>
    a.url.toLowerCase().includes(filterText.toLowerCase()) ||
    (a.targetKeyword && a.targetKeyword.toLowerCase().includes(filterText.toLowerCase()))
  );

  return (
    <div className="container-fluid p-0 d-flex flex-column gap-4">
      {/* Page Header */}
      <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3 no-print">
        <div>
          <h2 className="h4 fw-bold text-dark mb-1">SEO Audit Reports</h2>
          <p className="text-secondary mb-0" style={{ fontSize: '13.5px' }}>
            Historical audit logs, exportable executive summaries, and technical compliance sheets
          </p>
        </div>
        <div className="d-flex flex-wrap align-items-center gap-2">
          <button
            onClick={handleExportCSV}
            disabled={!selectedAudit}
            className="mui-btn mui-btn-outlined mui-btn-sm"
            title="Export all checks as CSV spreadsheet"
          >
            <Download size={14} />
            <span>CSV</span>
          </button>
          <button
            onClick={handleExportJSON}
            disabled={!selectedAudit}
            className="mui-btn mui-btn-outlined mui-btn-sm"
            title="Export full raw audit JSON payload"
          >
            <Download size={14} />
            <span>JSON</span>
          </button>
          <button
            onClick={() => setShowPdfModal(true)}
            className="mui-btn mui-btn-outlined mui-btn-sm"
          >
            <Printer size={14} />
            <span>PDF</span>
          </button>
          <button
            onClick={() => navigate('/analyze')}
            className="mui-btn mui-btn-primary mui-btn-sm"
          >
            <Plus size={14} />
            <span>New Audit</span>
          </button>
        </div>
      </div>

      <div className="row g-3">
        {/* Left column: Audit history list */}
        <div className="col-12 col-lg-4">
          <div className="rp-card p-0 overflow-hidden">
            <div className="p-3 border-bottom bg-light d-flex flex-column gap-2" style={{ borderColor: 'var(--mui-slate-200)' }}>
              <div className="d-flex align-items-center justify-content-between">
                <h3 className="h6 fw-bold text-dark mb-0" style={{ fontSize: '14px' }}>Audit Logs</h3>
                <span className="mui-chip chip-neutral">
                  {filteredAudits.length} reports
                </span>
              </div>
              <div className="position-relative">
                <input
                  type="text"
                  placeholder="Filter audits..."
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                  className="mui-input pe-4 py-1.5"
                  style={{ fontSize: '13px' }}
                />
                <Search size={14} className="position-absolute text-muted" style={{ right: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            <div className="d-flex flex-column" style={{ maxHeight: '620px', overflowY: 'auto' }}>
              {filteredAudits.map((a) => {
                const isSelected = selectedAudit?._id === a._id;
                return (
                  <button
                    key={a._id}
                    onClick={() => loadAuditDetail(a._id)}
                    className="p-3 text-start border-0 border-bottom d-flex align-items-center justify-content-between transition-all"
                    style={{
                      backgroundColor: isSelected ? 'var(--mui-primary-bg)' : '#ffffff',
                      borderLeft: isSelected ? '4px solid var(--mui-primary)' : '4px solid transparent',
                      borderColor: 'var(--mui-slate-200)',
                      cursor: 'pointer',
                    }}
                  >
                    <div className="overflow-hidden pe-2" style={{ minWidth: 0 }}>
                      <p className="fw-semibold text-dark text-truncate mb-1" style={{ fontSize: '13.5px' }}>
                        {a.url}
                      </p>
                      <div className="d-flex align-items-center gap-2 text-muted" style={{ fontSize: '12px' }}>
                        <Calendar size={12} />
                        <span>{new Date(a.createdAt).toLocaleDateString()}</span>
                        {a.targetKeyword && (
                          <span className="text-truncate">· "{a.targetKeyword}"</span>
                        )}
                      </div>
                    </div>
                    <span
                      className={`mui-score-ring ${a.score >= 80 ? 'pass' : a.score >= 50 ? 'warning' : 'fail'}`}
                      style={{ width: '40px', height: '40px', fontSize: '14px', borderWidth: '2px', flexShrink: 0 }}
                    >
                      {a.score}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right column: Audit Report Document */}
        <div className="col-12 col-lg-8">
          <div className="rp-card p-4">
            {selectedAudit ? (
              <div className="d-flex flex-column gap-4">
                {/* Executive Client-Ready Branded Cover Banner */}
                <div className="p-3.5 rounded border bg-light-subtle" style={{ borderColor: 'var(--mui-slate-300)', backgroundColor: '#f8fafc' }}>
                  <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start gap-2">
                    <div>
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <span className="badge text-bg-primary text-uppercase px-2 py-1" style={{ fontSize: '10.5px', letterSpacing: '0.5px' }}>
                          Client-Ready Executive Audit
                        </span>
                        <span className="text-muted small" style={{ fontSize: '12px' }}>
                          Verified RankPilot v1.0
                        </span>
                      </div>
                      <h3 className="h6 fw-bold text-dark mb-0" style={{ fontSize: '15px' }}>
                        Client: {clientName}
                      </h3>
                      <p className="text-secondary small mb-0 mt-0.5" style={{ fontSize: '12.5px' }}>
                        Lead Auditor: <strong className="text-dark">{auditorName}</strong> · Timestamp: {new Date(selectedAudit.createdAt).toLocaleDateString('en-IN', { dateStyle: 'full' })}
                      </p>
                    </div>
                    <div className="text-sm-end">
                      <span className="badge bg-secondary-subtle text-secondary-emphasis border px-2 py-1" style={{ fontSize: '11px' }}>
                        CONFIDENTIAL AUDIT
                      </span>
                    </div>
                  </div>
                  {execNotes && (
                    <div className="mt-2 pt-2 border-top text-secondary small" style={{ fontSize: '12px', borderColor: 'var(--mui-slate-200)' }}>
                      <strong className="text-dark">Executive Brief:</strong> {execNotes}
                    </div>
                  )}
                </div>

                <div className="d-flex align-items-start justify-content-between pb-3 border-bottom" style={{ borderColor: 'var(--mui-slate-200)' }}>
                  <div>
                    <span className="mui-chip chip-info mb-1">
                      Target Audit Domain
                    </span>
                    <div className="d-flex align-items-center gap-2 mt-1">
                      <h3 className="h5 fw-bold text-dark mb-0 text-break" style={{ fontSize: '18px' }}>
                        {selectedAudit.url}
                      </h3>
                      <a
                        href={selectedAudit.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-secondary"
                      >
                        <ExternalLink size={15} />
                      </a>
                    </div>
                    <p className="text-muted small mt-1 mb-0" style={{ fontSize: '12.5px' }}>
                      Generated: {new Date(selectedAudit.createdAt).toLocaleString()} · RankPilot Engine v1.0
                    </p>
                  </div>
                  <div className="text-center" style={{ flexShrink: 0 }}>
                    <div className={`mui-score-ring ${selectedAudit.score >= 80 ? 'pass' : selectedAudit.score >= 50 ? 'warning' : 'fail'}`} style={{ width: '56px', height: '56px' }}>
                      <span style={{ fontSize: '20px' }}>{selectedAudit.score}</span>
                    </div>
                    <span className="text-muted text-uppercase fw-semibold d-block mt-1" style={{ fontSize: '11px' }}>Health Score</span>
                  </div>
                </div>

                {/* High-level category grades */}
                <div className="row g-2">
                  <div className="col-6 col-sm-3">
                    <div className="p-2.5 px-3 rounded border bg-light" style={{ borderColor: 'var(--mui-slate-200)' }}>
                      <span className="text-muted text-uppercase fw-semibold d-block" style={{ fontSize: '11px', letterSpacing: '0.4px' }}>On-Page</span>
                      <span className="fw-bold text-dark" style={{ fontSize: '18px' }}>
                        {selectedAudit.categories?.onPage?.score ?? 85}%
                      </span>
                    </div>
                  </div>
                  <div className="col-6 col-sm-3">
                    <div className="p-2.5 px-3 rounded border bg-light" style={{ borderColor: 'var(--mui-slate-200)' }}>
                      <span className="text-muted text-uppercase fw-semibold d-block" style={{ fontSize: '11px', letterSpacing: '0.4px' }}>Technical</span>
                      <span className="fw-bold text-dark" style={{ fontSize: '18px' }}>
                        {selectedAudit.categories?.technical?.score ?? 90}%
                      </span>
                    </div>
                  </div>
                  <div className="col-6 col-sm-3">
                    <div className="p-2.5 px-3 rounded border bg-light" style={{ borderColor: 'var(--mui-slate-200)' }}>
                      <span className="text-muted text-uppercase fw-semibold d-block" style={{ fontSize: '11px', letterSpacing: '0.4px' }}>Content</span>
                      <span className="fw-bold text-dark" style={{ fontSize: '18px' }}>
                        {selectedAudit.categories?.content?.score ?? 80}%
                      </span>
                    </div>
                  </div>
                  <div className="col-6 col-sm-3">
                    <div className="p-2.5 px-3 rounded border bg-light" style={{ borderColor: 'var(--mui-slate-200)' }}>
                      <span className="text-muted text-uppercase fw-semibold d-block" style={{ fontSize: '11px', letterSpacing: '0.4px' }}>Performance</span>
                      <span className="fw-bold text-dark" style={{ fontSize: '18px' }}>
                        {selectedAudit.categories?.performance?.score ?? 85}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actionable checks summary */}
                <div>
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <h4 className="h6 fw-bold text-dark text-uppercase mb-0" style={{ fontSize: '13px', letterSpacing: '0.5px' }}>
                      Summary of Audit Findings & Diagnostics
                    </h4>
                    <span className="text-muted small" style={{ fontSize: '12px' }}>Click any item for Reason & Fix</span>
                  </div>

                  <div className="d-flex flex-column gap-2">
                    {selectedAudit.checks?.map((chk, i) => {
                      const isExpanded = expandedReportCheck === (chk.id || i);
                      const reason = chk.reason || 'This ranking signal informs search engine crawlers about the technical structure and relevance of the page.';
                      const explainability = chk.explainability || `Current detected state: "${chk.value}". Evaluated against standard Google search engine guidelines.`;
                      const correctionMethod = chk.correctionMethod || chk.recommendation || 'Review your HTML tags and align them with technical SEO best practices.';

                      return (
                        <div
                          key={chk.id || i}
                          className="rounded border transition-all"
                          style={{
                            backgroundColor: isExpanded ? 'var(--mui-primary-bg)' : '#ffffff',
                            borderColor: isExpanded ? 'var(--mui-primary-light)' : 'var(--mui-slate-200)',
                            cursor: 'pointer',
                          }}
                          onClick={() => setExpandedReportCheck(isExpanded ? null : (chk.id || i))}
                        >
                          <div className="p-3 d-flex align-items-start justify-content-between gap-3">
                            <div className="overflow-hidden" style={{ minWidth: 0 }}>
                              <span className="fw-bold text-dark d-block" style={{ fontSize: '14px' }}>{chk.name}</span>
                              <p className="text-muted small mb-0 text-truncate" style={{ fontSize: '13px' }}>{chk.value}</p>
                            </div>
                            <div className="d-flex align-items-center gap-2" style={{ flexShrink: 0 }}>
                              <span
                                className={`mui-chip ${
                                  chk.status === 'pass'
                                    ? 'chip-pass'
                                    : chk.status === 'warning'
                                    ? 'chip-warning'
                                    : 'chip-fail'
                                }`}
                              >
                                {chk.status}
                              </span>
                              <span className="fw-bold" style={{ color: 'var(--mui-primary)', fontSize: '12px' }}>
                                {isExpanded ? '▲' : '▼'}
                              </span>
                            </div>
                          </div>

                          {/* Detailed Explainability & Correction Card */}
                          {isExpanded && (
                            <div className="px-3 pb-3 pt-2 border-top bg-white d-flex flex-column gap-2.5" style={{ borderColor: 'var(--mui-slate-200)', fontSize: '13.5px' }}>
                              <div>
                                <span className="fw-bold d-flex align-items-center gap-1.5" style={{ color: 'var(--mui-primary)', fontSize: '13.5px' }}>
                                  <HelpCircle size={15} />
                                  <span>Why It Matters (SEO Ranking Reason):</span>
                                </span>
                                <p className="text-secondary mb-0 ps-3.5 lh-base" style={{ fontSize: '13px' }}>
                                  {reason}
                                </p>
                              </div>

                              <div>
                                <span className="fw-bold text-dark d-flex align-items-center gap-1.5" style={{ fontSize: '13.5px' }}>
                                  <Search size={14} style={{ color: 'var(--mui-slate-700)' }} />
                                  <span>Diagnostic Observations & Findings:</span>
                                </span>
                                <p className="text-secondary mb-0 ps-3.5 lh-base" style={{ fontSize: '13px' }}>
                                  {explainability}
                                </p>
                                {chk.affectedItems && chk.affectedItems.length > 0 && (
                                  <div className="mt-2 ms-3.5 p-2.5 rounded bg-light border" style={{ borderColor: 'var(--mui-slate-200)' }}>
                                    <span className="fw-semibold text-danger d-block mb-1.5" style={{ fontSize: '11.5px' }}>
                                      Specific Elements / URLs Missing ({chk.affectedItems.length} listed):
                                    </span>
                                    <div className="d-flex flex-column gap-1 overflow-y-auto" style={{ maxHeight: '140px' }}>
                                      {chk.affectedItems.map((item, idx) => (
                                        <div key={idx} className="small font-monospace text-dark text-break" style={{ fontSize: '11px' }}>
                                          <span className="text-muted me-1.5">#{idx + 1}</span>{item}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>

                              <div className="pt-2 border-top" style={{ borderColor: 'var(--mui-slate-100)' }}>
                                <span className="fw-bold d-flex align-items-center gap-1.5" style={{ color: 'var(--mui-success)', fontSize: '13.5px' }}>
                                  <Wrench size={14} />
                                  <span>Recommended Correction Method:</span>
                                </span>
                                <p className="text-dark fw-medium mb-1 ps-3.5" style={{ fontSize: '13px' }}>
                                  {correctionMethod}
                                </p>
                                {chk.codeSnippet && (
                                  <pre className="mui-code-block m-0 mt-2">
                                    <code>{chk.codeSnippet}</code>
                                  </pre>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* AI Gemini Recommendations block */}
                {selectedAudit.aiRecommendations?.length > 0 && (
                  <div className="pt-3 border-top d-flex flex-column gap-2" style={{ borderColor: 'var(--mui-slate-200)' }}>
                    <h4 className="h6 fw-bold text-dark text-uppercase d-flex align-items-center gap-2 mb-1" style={{ fontSize: '13px' }}>
                      <Code2 size={15} style={{ color: 'var(--mui-primary)' }} />
                      <span>Priority Technical Code Fixes</span>
                    </h4>
                    {selectedAudit.aiRecommendations.map((r, i) => (
                      <div key={i} className="p-3 bg-light rounded border" style={{ borderColor: 'var(--mui-slate-200)' }}>
                        <p className="fw-bold text-dark mb-1" style={{ fontSize: '14px' }}>{r.issue}</p>
                        <p className="text-secondary mb-2" style={{ fontSize: '13px' }}>{r.fix}</p>
                        {r.codeSnippet && (
                          <pre className="mui-code-block m-0">
                            <code>{r.codeSnippet}</code>
                          </pre>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-5 text-center text-muted" style={{ fontSize: '13.5px' }}>
                Select an audit from the list to preview the report.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Client-Ready Branded PDF Configuration Modal */}
      {showPdfModal && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3 no-print"
          style={{ backgroundColor: 'rgba(15, 23, 42, 0.65)', zIndex: 1050, backdropFilter: 'blur(3px)' }}
        >
          <div className="bg-white rounded-3 shadow-lg border p-4 w-100" style={{ maxWidth: '540px', borderColor: 'var(--mui-slate-200)' }}>
            <div className="d-flex align-items-center justify-content-between pb-3 border-bottom mb-3" style={{ borderColor: 'var(--mui-slate-200)' }}>
              <div className="d-flex align-items-center gap-2">
                <Printer size={18} style={{ color: 'var(--mui-primary)' }} />
                <h4 className="h6 fw-bold text-dark mb-0" style={{ fontSize: '15px' }}>
                  Branded PDF Export Configuration
                </h4>
              </div>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowPdfModal(false)}
                aria-label="Close"
              />
            </div>

            <p className="text-secondary mb-3" style={{ fontSize: '13px' }}>
              Customize the client agency cover page and auditor credentials before exporting to PDF via your browser's print dialog.
            </p>

            <div className="d-flex flex-column gap-3 mb-3">
              <div>
                <label className="form-label text-dark fw-bold mb-1" style={{ fontSize: '12.5px' }}>
                  Client / Company Name
                </label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g. Dreamshi Tech / Acme Corp"
                  style={{ fontSize: '13px' }}
                />
              </div>

              <div>
                <label className="form-label text-dark fw-bold mb-1" style={{ fontSize: '12.5px' }}>
                  Lead Auditor / SEO Architect
                </label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={auditorName}
                  onChange={(e) => setAuditorName(e.target.value)}
                  placeholder="e.g. Lead Technical SEO Consultant"
                  style={{ fontSize: '13px' }}
                />
              </div>

              <div>
                <label className="form-label text-dark fw-bold mb-1" style={{ fontSize: '12.5px' }}>
                  Executive Brief / Auditor Notes
                </label>
                <textarea
                  className="form-control form-control-sm"
                  rows={3}
                  value={execNotes}
                  onChange={(e) => setExecNotes(e.target.value)}
                  placeholder="Summary for leadership or development team..."
                  style={{ fontSize: '13px' }}
                />
              </div>

              <div className="p-2.5 rounded bg-light border" style={{ borderColor: 'var(--mui-slate-200)', fontSize: '12px' }}>
                <strong className="text-dark d-block mb-1">Included in Document:</strong>
                <ul className="list-unstyled mb-0 d-flex flex-column gap-1 text-secondary">
                  <li className="d-flex align-items-center gap-1.5">
                    <CheckCircle2 size={13} style={{ color: 'var(--mui-success)' }} />
                    <span>Executive Scorecard & CWV Benchmarks</span>
                  </li>
                  <li className="d-flex align-items-center gap-1.5">
                    <CheckCircle2 size={13} style={{ color: 'var(--mui-success)' }} />
                    <span>Explainable AI (RankBrain, Helpful Content, PageRank) Root Causes</span>
                  </li>
                  <li className="d-flex align-items-center gap-1.5">
                    <CheckCircle2 size={13} style={{ color: 'var(--mui-success)' }} />
                    <span>Actionable code correction snippets & framework guides</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="d-flex justify-content-end gap-2 pt-2 border-top" style={{ borderColor: 'var(--mui-slate-200)' }}>
              <button
                type="button"
                className="mui-btn mui-btn-outlined mui-btn-sm"
                onClick={() => setShowPdfModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="mui-btn mui-btn-primary mui-btn-sm"
                onClick={() => {
                  setShowPdfModal(false);
                  setTimeout(() => {
                    handlePrint();
                  }, 250);
                }}
              >
                <Printer size={14} />
                <span>Print & Save PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
