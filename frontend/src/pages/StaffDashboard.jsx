import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { staffAPI } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import {
  Building2,
  Clock,
  RefreshCw,
  CheckCircle2,
  Search,
  Filter,
  ExternalLink,
  MessageSquare,
  AlertCircle
} from 'lucide-react';

const StaffDashboard = () => {
  const { user } = useAuth();
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const fetchDepartmentQueries = async () => {
    try {
      const res = await staffAPI.getDepartmentQueries();
      setQueries(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartmentQueries();
  }, []);

  const total = queries.length;
  const assigned = queries.filter(q => q.status === 'Assigned' || q.status === 'Submitted').length;
  const inProgress = queries.filter(q => q.status === 'In Progress').length;
  const resolved = queries.filter(q => q.status === 'Resolved').length;

  const filteredQueries = queries.filter(q => {
    const matchesSearch =
      q.title.toLowerCase().includes(search.toLowerCase()) ||
      q.description.toLowerCase().includes(search.toLowerCase()) ||
      (q.student?.full_name && q.student.full_name.toLowerCase().includes(search.toLowerCase())) ||
      (q.predicted_intent && q.predicted_intent.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || q.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesPriority = priorityFilter === 'all' || q.priority.toLowerCase() === priorityFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="page-wrapper">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.25rem' }}>
            <Building2 size={16} /> {user?.department || 'Department'} Queue
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            Department Staff Dashboard
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Manage student inquiries routed automatically to your department
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid-cols-4">
        <div className="card stat-card">
          <div className="stat-icon" style={{ background: '#eff6ff', color: '#1e40af' }}>
            <Building2 size={26} />
          </div>
          <div className="stat-details">
            <h4>Department Total</h4>
            <div className="stat-number">{total}</div>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon" style={{ background: '#e0f2fe', color: '#0369a1' }}>
            <Clock size={26} />
          </div>
          <div className="stat-details">
            <h4>Assigned (Action Req)</h4>
            <div className="stat-number">{assigned}</div>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon" style={{ background: '#fffbeb', color: '#b45309' }}>
            <RefreshCw size={26} />
          </div>
          <div className="stat-details">
            <h4>In Progress</h4>
            <div className="stat-number">{inProgress}</div>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon" style={{ background: '#f0fdf4', color: '#15803d' }}>
            <CheckCircle2 size={26} />
          </div>
          <div className="stat-details">
            <h4>Resolved</h4>
            <div className="stat-number">{resolved}</div>
          </div>
        </div>
      </div>

      {/* Department Queries Table */}
      <div className="card">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <div style={{ position: 'relative', width: '300px' }}>
            <input
              type="text"
              placeholder="Search by student, title, keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-control"
              style={{ paddingLeft: '2.4rem', fontSize: '0.85rem' }}
            />
            <Search
              size={16}
              style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="form-select"
              style={{ width: '150px', fontSize: '0.85rem' }}
            >
              <option value="all">All Statuses</option>
              <option value="assigned">Assigned</option>
              <option value="in progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="reopened">Reopened</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="form-select"
              style={{ width: '150px', fontSize: '0.85rem' }}
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            Loading department queue...
          </div>
        ) : filteredQueries.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No queries match the selected filters for your department.
          </div>
        ) : (
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>#ID</th>
                  <th>Student</th>
                  <th>Query Title & Snippet</th>
                  <th>Language</th>
                  <th>Intent</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Submitted</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredQueries.map((q) => (
                  <tr key={q.id}>
                    <td>
                      <span style={{ fontWeight: 700, color: 'var(--text-muted)' }}>#{q.id}</span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.875rem' }}>
                        {q.student?.full_name || 'Student'}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {q.student?.department || 'N/A'}
                      </div>
                    </td>
                    <td style={{ maxWidth: '300px' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.2rem' }}>
                        {q.title}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {q.description}
                      </div>
                    </td>
                    <td>
                      <span className="lang-tag">
                        {q.detected_language || q.selected_language}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>
                      {q.predicted_intent}
                    </td>
                    <td>
                      <PriorityBadge priority={q.priority} />
                    </td>
                    <td>
                      <StatusBadge status={q.status} />
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {new Date(q.created_at).toLocaleDateString()}
                    </td>
                    <td>
                      <Link to={`/queries/${q.id}`} className="btn btn-primary btn-sm" style={{ padding: '0.35rem 0.7rem' }}>
                        <MessageSquare size={13} /> Respond
                      </Link>
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
};

export default StaffDashboard;
