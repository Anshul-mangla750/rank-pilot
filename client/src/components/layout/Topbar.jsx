import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, Plus, Globe, Menu } from 'lucide-react';

const pageTitles = {
  '/dashboard': { title: 'SEO Executive Dashboard', subtitle: 'Overview of organic visibility & monitored websites' },
  '/projects': { title: 'Web Properties & Keywords', subtitle: 'Manage tracked domains and target keyword clusters' },
  '/analyze': { title: 'On-Page SEO Analyzer', subtitle: 'Deep diagnostic audit with AI explainability and code fixes' },
  '/compare': { title: 'Competitor Head-to-Head Comparison', subtitle: 'Side-by-side gap analysis of domain authority, schema, and performance' },
  '/rankings': { title: 'Google India Rank Tracker', subtitle: 'Live organic SERP positions across google.co.in' },
  '/reports': { title: 'Executive Audit Reports', subtitle: 'Downloadable compliance and diagnostic sheets' },
  '/settings': { title: 'Platform Settings & APIs', subtitle: 'Configure external connectors and market defaults' },
};

export default function Topbar({ onToggleMobile }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [globalSearch, setGlobalSearch] = useState('');
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const getPageInfo = () => {
    const base = '/' + location.pathname.split('/')[1];
    return pageTitles[base] || { title: 'RankPilot Workspace', subtitle: 'AI-Powered SEO Intelligence Platform' };
  };

  const { title, subtitle } = getPageInfo();

  const handleGlobalSearch = (e) => {
    e.preventDefault();
    const query = globalSearch.trim();
    if (!query) return;

    if (query.includes('.') || query.startsWith('http')) {
      let target = query;
      if (!target.startsWith('http://') && !target.startsWith('https://')) {
        target = 'https://' + target;
      }
      navigate(`/analyze?url=${encodeURIComponent(target)}`);
    } else {
      navigate(`/rankings?kw=${encodeURIComponent(query)}`);
    }
    setGlobalSearch('');
    setShowMobileSearch(false);
  };

  return (
    <header className="rp-topbar position-relative">
      {/* Mobile Menu & Page Title */}
      <div className="d-flex align-items-center gap-2 gap-sm-3 overflow-hidden me-2" style={{ minWidth: 0 }}>
        <button
          type="button"
          onClick={onToggleMobile}
          className="btn btn-light d-lg-none p-1.5 border text-secondary rounded-2 flex-shrink-0"
          aria-label="Toggle navigation drawer"
        >
          <Menu size={19} />
        </button>

        <div className="overflow-hidden" style={{ minWidth: 0 }}>
          <div className="d-flex align-items-center gap-1.5 gap-sm-2">
            <span className="text-muted text-uppercase fw-semibold d-none d-sm-inline" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>
              RankPilot
            </span>
            <span className="text-muted d-none d-sm-inline" style={{ fontSize: '11px' }}>/</span>
            <h1 className="m-0 fw-bold text-dark text-truncate" style={{ fontSize: '14.5px' }} title={title}>
              {title}
            </h1>
          </div>
          <p className="m-0 text-secondary d-none d-md-block text-truncate mt-0.5" style={{ fontSize: '12px' }}>{subtitle}</p>
        </div>
      </div>

      {/* Right Actions */}
      <div className="d-flex align-items-center gap-1.5 gap-sm-2 flex-shrink-0">
        {/* Mobile Search Toggle Button */}
        <button
          type="button"
          onClick={() => setShowMobileSearch(!showMobileSearch)}
          className="btn btn-sm btn-light d-lg-none p-1.5 border text-secondary rounded-2"
          aria-label="Search"
          title="Search domains or keywords"
        >
          <Search size={16} />
        </button>

        {/* Regional Market Pill */}
        <div
          className="d-none d-md-flex align-items-center gap-1.5 px-2.5 py-1 rounded-pill border bg-light text-secondary"
          style={{ fontSize: '12px', fontWeight: 500 }}
        >
          <Globe size={13} style={{ color: 'var(--mui-primary)' }} />
          <span>India (google.co.in)</span>
        </div>

        {/* Desktop Global Search Bar */}
        <form onSubmit={handleGlobalSearch} className="d-none d-lg-block position-relative" style={{ width: '220px' }}>
          <input
            type="text"
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            placeholder="Search domain or keyword ↵"
            className="mui-input pe-3 ps-4 py-1.5"
            style={{ fontSize: '12.5px', height: '35px' }}
          />
          <Search size={14} className="position-absolute text-muted" style={{ left: '11px', top: '50%', transform: 'translateY(-50%)' }} />
        </form>

        {/* Quick Action Button */}
        <button
          onClick={() => navigate('/analyze')}
          className="mui-btn mui-btn-primary mui-btn-sm text-nowrap d-flex align-items-center gap-1 py-1.5 px-2 px-sm-3"
          style={{ fontSize: '13px' }}
        >
          <Plus size={15} />
          <span className="d-none d-sm-inline">Run Audit</span>
          <span className="d-sm-none">Audit</span>
        </button>
      </div>

      {/* Expandable Mobile Search Bar */}
      {showMobileSearch && (
        <div
          className="position-absolute top-100 start-0 w-100 p-2.5 bg-white border-bottom shadow-sm d-lg-none"
          style={{ zIndex: 950, borderColor: 'var(--mui-slate-200)' }}
        >
          <form onSubmit={handleGlobalSearch} className="position-relative">
            <input
              type="text"
              autoFocus
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              placeholder="Search domain or keyword (e.g. indiamart.com) ↵"
              className="mui-input pe-3 ps-4 py-1.5"
              style={{ fontSize: '13px' }}
            />
            <Search size={14} className="position-absolute text-muted" style={{ left: '11px', top: '50%', transform: 'translateY(-50%)' }} />
          </form>
        </div>
      )}
    </header>
  );
}
