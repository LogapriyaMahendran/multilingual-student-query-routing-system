import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from './Navbar';
import {
  LayoutDashboard,
  PlusCircle,
  FileText,
  Users,
  BarChart3,
  ShieldCheck,
  Building2,
  UserCheck,
  ChevronRight,
  Globe2,
  LifeBuoy
} from 'lucide-react';

const DashboardLayout = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const getNavLinks = () => {
    if (!user) return [];

    if (user.role === 'student') {
      return [
        { to: '/student/dashboard', label: 'Student Dashboard', icon: LayoutDashboard },
        { to: '/student/submit', label: 'Submit Multilingual Query', icon: PlusCircle },
        { to: '/student/queries', label: 'My Queries & Tracking', icon: FileText },
        { to: '/profile', label: 'My Profile', icon: UserCheck },
      ];
    }

    if (user.role === 'staff') {
      return [
        { to: '/staff/dashboard', label: `${user.department || 'Department'} Queries`, icon: Building2 },
        { to: '/profile', label: 'Staff Profile', icon: UserCheck },
      ];
    }

    if (user.role === 'admin') {
      return [
        { to: '/admin/dashboard', label: 'Admin Command Center', icon: ShieldCheck },
        { to: '/admin/users', label: 'User Directory', icon: Users },
        { to: '/admin/analytics', label: 'Multilingual Analytics', icon: BarChart3 },
        { to: '/profile', label: 'Administrator Profile', icon: UserCheck },
      ];
    }

    return [];
  };

  const navLinks = getNavLinks();

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside
        style={{
          width: sidebarOpen ? '260px' : '72px',
          background: 'var(--bg-sidebar)',
          color: 'var(--sidebar-text)',
          transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 30,
          borderRight: '1px solid rgba(255, 255, 255, 0.08)'
        }}
      >
        <div
          style={{
            padding: '1.25rem 1rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}
        >
          <div
            style={{
              minWidth: '38px',
              height: '38px',
              borderRadius: '8px',
              background: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff'
            }}
          >
            <Globe2 size={20} />
          </div>
          {sidebarOpen && (
            <div style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc' }}>College HelpDesk</div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>AI Intent Router</div>
            </div>
          )}
        </div>

        {/* Navigation list */}
        <nav style={{ padding: '1rem 0.5rem', flex: 1 }}>
          <div
            style={{
              fontSize: '0.675rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: '#64748b',
              padding: '0 0.75rem 0.5rem',
              letterSpacing: '0.5px'
            }}
          >
            {sidebarOpen ? 'Portal Menu' : '•••'}
          </div>

          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    style={({ isActive }) => ({
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.7rem 0.85rem',
                      borderRadius: '8px',
                      color: isActive ? '#ffffff' : '#94a3b8',
                      background: isActive ? '#2563eb' : 'transparent',
                      fontWeight: isActive ? 600 : 500,
                      fontSize: '0.875rem',
                      transition: 'all 0.15s ease',
                      textDecoration: 'none'
                    })}
                  >
                    <Icon size={18} style={{ minWidth: '18px' }} />
                    {sidebarOpen && <span>{item.label}</span>}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Supported Languages Widget in Sidebar */}
        {sidebarOpen && (
          <div
            style={{
              padding: '1rem',
              margin: '0.75rem',
              background: 'rgba(255, 255, 255, 0.04)',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.06)'
            }}
          >
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.4rem' }}>
              Supported Languages
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', fontSize: '0.7rem' }}>
              <span className="lang-tag">English</span>
              <span className="lang-tag">தமிழ்</span>
              <span className="lang-tag">हिन्दी</span>
              <span className="lang-tag">മലയാളം</span>
              <span className="lang-tag">తెలుగు</span>
              <span className="lang-tag">ಕನ್ನಡ</span>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content Area */}
      <div className="main-content">
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main style={{ flex: 1 }}>
          <Outlet />
        </main>
        <footer
          style={{
            padding: '1rem 2rem',
            textAlign: 'center',
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
            borderTop: '1px solid var(--border-color)',
            background: 'var(--bg-card)'
          }}
        >
          Multilingual Student Query Intent & Response Routing System &bull; Intelligent Multi-Department Campus Automation
        </footer>
      </div>
    </div>
  );
};

export default DashboardLayout;
