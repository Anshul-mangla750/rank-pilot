import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Search,
  Globe,
  BarChart3,
  FileText,
  Settings,
  LogOut,
  ChevronLeft,
  Compass,
  ArrowLeftRight,
  X,
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/projects', label: 'Projects', icon: Globe },
  { to: '/analyze', label: 'Analyze', icon: Search },
  { to: '/compare', label: 'Compare', icon: ArrowLeftRight },
  { to: '/rankings', label: 'Rankings', icon: BarChart3 },
  { to: '/reports', label: 'Reports', icon: FileText },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ mobileOpen = false, onCloseMobile }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className={`rp-sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
      {/* Brand Header */}
      <div className="d-flex align-items-center justify-content-between px-3" style={{ height: 'var(--topbar-height)', borderBottom: '1px solid var(--mui-slate-200)' }}>
        <Link to="/" onClick={onCloseMobile} className="d-flex align-items-center gap-2 text-decoration-none" title="Visit Home Landing Page">
          <div
            className="d-flex align-items-center justify-content-center text-white rounded-2 shadow-sm"
            style={{ width: '34px', height: '34px', backgroundColor: 'var(--mui-slate-900)' }}
          >
            <Compass size={18} className="text-white" />
          </div>
          {(!collapsed || mobileOpen) && (
            <div className="d-flex flex-column">
              <span className="fw-bold text-dark lh-sm" style={{ fontSize: '16px', letterSpacing: '-0.3px' }}>
                Rank<span style={{ color: 'var(--mui-primary)' }}>Pilot</span>
              </span>
              <span className="text-muted text-uppercase" style={{ fontSize: '11px', letterSpacing: '0.6px', fontWeight: 600 }}>
                SEO Intelligence
              </span>
            </div>
          )}
        </Link>

        {/* Mobile close button */}
        <button
          type="button"
          onClick={onCloseMobile}
          className="btn btn-sm btn-light d-lg-none p-1 text-secondary"
          aria-label="Close sidebar"
        >
          <X size={18} />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-grow-1 py-3 px-2 overflow-y-auto">
        <ul className="list-unstyled m-0 p-0 d-flex flex-column gap-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `d-flex align-items-center gap-2 px-3 py-2 rounded-2 text-decoration-none transition-all ${
                    isActive
                      ? 'bg-light text-dark fw-bold border'
                      : 'text-secondary'
                  }`
                }
                style={({ isActive }) => ({
                  fontSize: '14px',
                  borderColor: isActive ? 'var(--mui-slate-200)' : 'transparent',
                  backgroundColor: isActive ? 'var(--mui-slate-100)' : 'transparent',
                  color: isActive ? 'var(--mui-slate-900)' : 'var(--mui-slate-600)',
                })}
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      size={18}
                      strokeWidth={isActive ? 2.2 : 1.8}
                      style={{ color: isActive ? 'var(--mui-primary)' : 'var(--mui-slate-500)', flexShrink: 0 }}
                    />
                    {(!collapsed || mobileOpen) && <span>{label}</span>}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer User Info */}
      <div className="p-2.5 border-top bg-light" style={{ borderColor: 'var(--mui-slate-200)' }}>
        <div
          className={`d-flex align-items-center gap-2 p-2 bg-white rounded-2 border shadow-sm ${
            collapsed && !mobileOpen ? 'justify-content-center' : ''
          }`}
          style={{ borderColor: 'var(--mui-slate-200)' }}
        >
          <div
            className="d-flex align-items-center justify-content-center text-white rounded-2 fw-bold"
            style={{ width: '32px', height: '32px', fontSize: '13px', backgroundColor: 'var(--mui-slate-800)' }}
          >
            {user?.name?.charAt(0)?.toUpperCase() || 'A'}
          </div>
          {(!collapsed || mobileOpen) && (
            <div className="flex-grow-1 overflow-hidden" style={{ minWidth: 0 }}>
              <div className="d-flex align-items-center justify-content-between">
                <p className="m-0 fw-semibold text-truncate text-dark" style={{ fontSize: '13px' }}>
                  {user?.name || 'Anshul Mangla'}
                </p>
                <span className="badge bg-light text-secondary border px-1.5" style={{ fontSize: '11px', fontWeight: 600 }}>
                  PRO
                </span>
              </div>
              <p className="m-0 text-muted text-truncate" style={{ fontSize: '12px' }}>
                {user?.email || 'demo@rankpilot.in'}
              </p>
            </div>
          )}
        </div>

        <div className="d-flex align-items-center gap-1 pt-2">
          <button
            onClick={handleLogout}
            title="Log out"
            className="btn btn-sm text-secondary flex-grow-1 d-flex align-items-center justify-content-center gap-1 p-1.5 border-0"
            style={{ fontSize: '13px' }}
          >
            <LogOut size={14} />
            {(!collapsed || mobileOpen) && <span>Sign out</span>}
          </button>
          <button
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="btn btn-sm text-secondary p-1.5 border-0 d-none d-lg-inline-flex align-items-center justify-content-center"
          >
            <ChevronLeft
              size={16}
              style={{
                transform: collapsed ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.2s',
              }}
            />
          </button>
        </div>
      </div>
    </aside>
  );
}
