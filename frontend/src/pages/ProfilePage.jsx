import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Building, GraduationCap, Calendar, Shield, Moon, Sun, LogOut } from 'lucide-react';

const ProfilePage = () => {
  const { user, logout, theme, toggleTheme } = useAuth();

  if (!user) return null;

  return (
    <div className="page-wrapper" style={{ maxWidth: '800px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
          User Profile & Preferences
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Manage your account settings and college identification
        </p>
      </div>

      <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.75rem', flexWrap: 'wrap' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              fontWeight: 800
            }}
          >
            {user.full_name?.charAt(0) || 'U'}
          </div>

          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
              {user.full_name}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: '0.2rem 0 0' }}>
              {user.email} &bull; <span style={{ textTransform: 'capitalize', fontWeight: 600 }}>{user.role}</span>
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Building size={14} /> Department
            </span>
            <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-main)', marginTop: '0.2rem' }}>
              {user.department || 'Not specified'}
            </div>
          </div>

          {user.role === 'student' && (
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <GraduationCap size={14} /> Year of Study
              </span>
              <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-main)', marginTop: '0.2rem' }}>
                {user.year_of_study || 'N/A'}
              </div>
            </div>
          )}

          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Shield size={14} /> Account Role
            </span>
            <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--primary)', textTransform: 'capitalize', marginTop: '0.2rem' }}>
              {user.role}
            </div>
          </div>

          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Calendar size={14} /> Member Since
            </span>
            <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-main)', marginTop: '0.2rem' }}>
              {new Date(user.created_at).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>

      {/* Theme and Preferences */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1rem' }}>Interface Preferences</h3>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid var(--border-color)' }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Theme Mode</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Currently using {theme === 'dark' ? 'Dark theme' : 'Clean White & Deep Blue light theme'}
            </div>
          </div>
          <button
            onClick={toggleTheme}
            className="btn btn-secondary btn-sm"
          >
            {theme === 'dark' ? <Sun size={15} color="#f59e0b" /> : <Moon size={15} />}
            {theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem' }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--danger)' }}>Session Sign Out</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>End your session on this browser</div>
          </div>
          <button
            onClick={logout}
            className="btn btn-danger btn-sm"
          >
            <LogOut size={15} /> Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
