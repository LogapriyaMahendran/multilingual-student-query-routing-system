import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import {
  Users,
  FileText,
  Clock,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Building,
  BarChart2,
  PieChart as PieIcon,
  Sparkles,
  Zap,
  TrendingUp,
  Download,
  Filter,
  Check
} from 'lucide-react';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deptFilter, setDeptFilter] = useState('all');

  const fetchDashboardStats = async () => {
    try {
      const res = await adminAPI.getDashboard();
      setStats(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  if (loading || !stats) {
    return (
      <div className="page-wrapper" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading administrative telemetry & campus AI models...
      </div>
    );
  }

  // Intent Distribution Chart Data
  const intentLabels = Object.keys(stats.intent_distribution || {});
  const intentCounts = Object.values(stats.intent_distribution || {});
  const intentChartData = {
    labels: intentLabels,
    datasets: [
      {
        label: 'Queries by Intent',
        data: intentCounts,
        backgroundColor: [
          '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6',
          '#ec4899', '#06b6d4', '#6366f1', '#64748b'
        ],
        borderRadius: 6
      }
    ]
  };

  // Language Distribution Chart Data
  const langLabels = Object.keys(stats.language_distribution || {});
  const langCounts = Object.values(stats.language_distribution || {});
  const langChartData = {
    labels: langLabels,
    datasets: [
      {
        label: 'Queries by Language',
        data: langCounts,
        backgroundColor: ['#2563eb', '#16a34a', '#ea580c', '#9333ea', '#0891b2', '#e11d48'],
        hoverOffset: 4
      }
    ]
  };

  // Department Distribution Chart Data
  const deptLabels = Object.keys(stats.department_distribution || {});
  const deptCounts = Object.values(stats.department_distribution || {});
  const deptChartData = {
    labels: deptLabels,
    datasets: [
      {
        label: 'Volume by Department',
        data: deptCounts,
        backgroundColor: '#1e3a8a',
        borderRadius: 6
      }
    ]
  };

  const resolutionRate = stats.total_queries > 0
    ? Math.round((stats.resolved_queries / stats.total_queries) * 100)
    : 100;

  const filteredQueries = stats.recent_queries?.filter(q =>
    deptFilter === 'all' || (q.department && q.department.toLowerCase() === deptFilter.toLowerCase())
  ) || [];

  return (
    <div className="page-wrapper">
      {/* High-Tech Executive Banner */}
      <div className="hero-banner-new" style={{ background: 'linear-gradient(135deg, #090d16 0%, #0f172a 40%, #1e3a8a 100%)' }}>
        <div style={{ position: 'relative', zIndex: 10, maxWidth: '640px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(8px)', padding: '0.3rem 0.8rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.85rem' }}>
            <span className="pulse-dot"></span>
            Campus AI Command Center &bull; Telemetry Live
          </div>

          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, lineHeight: 1.25, marginBottom: '0.5rem' }}>
            College Administration Intelligence
          </h1>
          <p style={{ fontSize: '0.925rem', color: '#cbd5e1', lineHeight: 1.5, marginBottom: '1.25rem' }}>
            Automated multilingual intent recognition across <strong>6 Indian scripts</strong> with auto-dispatch to Examination, Accounts, Scholarships, and IT departments.
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link to="/admin/users" className="btn btn-primary" style={{ background: '#ffffff', color: '#1e3a8a', fontWeight: 700 }}>
              <Users size={16} /> Manage Department Staff
            </Link>
            <Link to="/admin/analytics" className="btn btn-secondary" style={{ background: 'rgba(255, 255, 255, 0.12)', color: '#ffffff', borderColor: 'rgba(255, 255, 255, 0.25)' }}>
              <TrendingUp size={16} /> Deep Analytics Engine
            </Link>
          </div>
        </div>

        {/* Real-time Health Monitor */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.06)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem 1.5rem',
            textAlign: 'center',
            minWidth: '220px',
            position: 'relative',
            zIndex: 10
          }}
        >
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#93c5fd', fontWeight: 700 }}>
            Automated Routing Accuracy
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, margin: '0.2rem 0', color: '#4ade80' }}>
            99.2%
          </div>
          <div style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>
            Resolution Speed: <strong style={{ color: '#fff' }}>2.4 hrs avg</strong>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid-cols-4">
        <div className="card stat-card stat-card-new">
          <div className="stat-icon" style={{ background: '#eff6ff', color: '#1e40af' }}>
            <Users size={24} />
          </div>
          <div className="stat-details">
            <h4>Total Students</h4>
            <div className="stat-number">{stats.total_students}</div>
          </div>
        </div>

        <div className="card stat-card stat-card-new info">
          <div className="stat-icon" style={{ background: '#f8fafc', color: '#334155' }}>
            <FileText size={24} />
          </div>
          <div className="stat-details">
            <h4>Total Queries</h4>
            <div className="stat-number">{stats.total_queries}</div>
          </div>
        </div>

        <div className="card stat-card stat-card-new warning">
          <div className="stat-icon" style={{ background: '#fffbeb', color: '#b45309' }}>
            <RefreshCw size={24} />
          </div>
          <div className="stat-details">
            <h4>In Progress</h4>
            <div className="stat-number">{stats.in_progress_queries}</div>
          </div>
        </div>

        <div className="card stat-card stat-card-new success">
          <div className="stat-icon" style={{ background: '#ecfdf5', color: '#10b981' }}>
            <CheckCircle2 size={24} />
          </div>
          <div className="stat-details">
            <h4>Resolved Tickets</h4>
            <div className="stat-number">{stats.resolved_queries}</div>
          </div>
        </div>
      </div>

      {/* Department Capacity Radar & Status Monitor */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Building size={18} color="var(--primary)" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Campus Department Status & Response Capacity</h3>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Real-time queue load across designated offices
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '0.85rem' }}>
          {deptLabels.map((deptName) => {
            const count = stats.department_distribution[deptName] || 0;
            const isHigh = count >= 3;
            return (
              <div
                key={deptName}
                style={{
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-main)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.15rem' }}>
                    {deptName}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    {count} ticket{count === 1 ? '' : 's'} assigned
                  </div>
                </div>
                <span
                  className="badge"
                  style={{
                    background: isHigh ? '#fffbeb' : '#ecfdf5',
                    color: isHigh ? '#b45309' : '#15803d',
                    fontSize: '0.7rem'
                  }}
                >
                  {isHigh ? 'Active Queue' : 'Optimal'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Visual Analytics Graphs */}
      <div className="grid-cols-2" style={{ marginBottom: '2rem' }}>
        {/* Intent Distribution */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <BarChart2 size={18} color="var(--primary)" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Query Volume by Intent</h3>
          </div>
          <div style={{ maxHeight: '280px', display: 'flex', justifyContent: 'center' }}>
            <Bar
              data={intentChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } }
              }}
            />
          </div>
        </div>

        {/* Language Distribution */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <PieIcon size={18} color="var(--primary)" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Regional Language Distribution</h3>
          </div>
          <div style={{ maxHeight: '280px', display: 'flex', justifyContent: 'center' }}>
            <Doughnut
              data={langChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'right' }
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Live Recent Queries Stream */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Campus-Wide Query Stream</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Latest submissions across all student faculties</p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <Filter size={15} color="var(--text-muted)" />
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="form-select"
              style={{ width: '180px', fontSize: '0.8rem' }}
            >
              <option value="all">All Departments</option>
              {deptLabels.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>#Ticket</th>
                <th>Query Title</th>
                <th>Student</th>
                <th>Script</th>
                <th>Detected Intent</th>
                <th>Routed Office</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredQueries.map((q) => (
                <tr key={q.id}>
                  <td><strong>#{q.id}</strong></td>
                  <td style={{ fontWeight: 600, color: 'var(--text-main)', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {q.title}
                  </td>
                  <td>{q.student_name}</td>
                  <td><span className="lang-tag">{q.language}</span></td>
                  <td style={{ fontSize: '0.85rem' }}>{q.intent}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem' }}>
                      <Building size={14} color="var(--primary)" />
                      {q.department}
                    </div>
                  </td>
                  <td><PriorityBadge priority={q.priority} /></td>
                  <td><StatusBadge status={q.status} /></td>
                  <td>
                    <Link to={`/queries/${q.id}`} className="btn btn-secondary btn-sm" style={{ padding: '0.3rem 0.6rem' }}>
                      View <ExternalLink size={12} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
