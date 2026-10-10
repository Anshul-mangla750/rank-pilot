import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="rp-layout">
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="rp-backdrop d-lg-none"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <Sidebar
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      {/* Main Wrapper */}
      <div className="rp-main-wrapper">
        <Topbar onToggleMobile={() => setMobileOpen((prev) => !prev)} />
        <main className="rp-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
