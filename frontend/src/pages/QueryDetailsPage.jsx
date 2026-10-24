import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { queryAPI, staffAPI } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import {
  ArrowLeft,
  Building,
  User,
  Clock,
  Sparkles,
  Send,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  History,
  ShieldAlert,
  Globe
} from 'lucide-react';

const QueryDetailsPage = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [query, setQuery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Staff response form state
  const [responseText, setResponseText] = useState('');
  const [responseLanguage, setResponseLanguage] = useState('English');
  const [submittingReply, setSubmittingReply] = useState(false);

  // Status update state
  const [statusVal, setStatusVal] = useState('');
  const [statusRemarks, setStatusRemarks] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // AI Re-run states
  const [aiLoading, setAiLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');

  const fetchQuery = async () => {
    try {
      const res = await queryAPI.getQueryDetails(id);
      setQuery(res.data);
      setStatusVal(res.data.status);
      setResponseLanguage(res.data.detected_language || res.data.selected_language || 'English');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Failed to retrieve query details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuery();
  }, [id]);

  const handlePostResponse = async (e) => {
    e.preventDefault();
    if (!responseText.trim()) return;

    setSubmittingReply(true);
    setActionSuccess('');
    try {
      await staffAPI.addResponse(id, {
        response_text: responseText,
        response_language: responseLanguage
      });
      setResponseText('');
      setActionSuccess('Response posted successfully and notification sent to the student.');
      await fetchQuery();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Failed to submit response.');
    } finally {
      setSubmittingReply(false);
    }
  };

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    setUpdatingStatus(true);
    setActionSuccess('');
    try {
      await staffAPI.updateStatus(id, {
        status: statusVal,
        remarks: statusRemarks
      });
      setStatusRemarks('');
      setActionSuccess(`Query status successfully updated to '${statusVal}'.`);
      await fetchQuery();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Failed to update status.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleReclassify = async () => {
    setAiLoading(true);
    setActionSuccess('');
    try {
      const res = await queryAPI.reclassify(id);
      setActionSuccess(`AI Intent Re-classified: ${res.data.predicted_intent} (${Math.round(res.data.confidence_score * 100)}% confidence).`);
      await fetchQuery();
    } catch (err) {
      console.error(err);
      setError('Failed to reclassify query.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleReroute = async () => {
    setAiLoading(true);
    setActionSuccess('');
    try {
      const res = await queryAPI.reroute(id);
      setActionSuccess(`Query successfully routed to ${res.data.assigned_department}.`);
      await fetchQuery();
    } catch (err) {
      console.error(err);
      setError('Failed to reroute query.');
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-wrapper" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading query information...
      </div>
    );
  }

  if (error || !query) {
    return (
      <div className="page-wrapper" style={{ maxWidth: '800px' }}>
        <div className="alert alert-danger">
          <ShieldAlert size={20} />
          <span>{error || 'Query not found or you lack permission to view it.'}</span>
        </div>
        <Link to="/" className="btn btn-secondary btn-sm">
          <ArrowLeft size={16} /> Return to Portal
        </Link>
      </div>
    );
  }

  const isStaffOrAdmin = user?.role === 'staff' || user?.role === 'admin';

  return (
    <div className="page-wrapper" style={{ maxWidth: '1100px' }}>
      {/* Top Navigation */}
      <div style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link
          to={user?.role === 'student' ? '/student/queries' : user?.role === 'staff' ? '/staff/dashboard' : '/admin/dashboard'}
          className="btn btn-secondary btn-sm"
        >
          <ArrowLeft size={16} /> Back to Queries
        </Link>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Reference ID:</span>
          <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '0.95rem' }}>#{query.id}</span>
        </div>
      </div>

      {actionSuccess && (
        <div className="alert alert-success">
          <CheckCircle2 size={18} />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Main Grid: Details + AI Card on Left, Responses & Audit Trail on Right */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.25fr) minmax(0, 1fr)', gap: '1.5rem', alignItems: 'start' }}>
        {/* Left Column: Query Details & AI Intelligence */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Query Header Card */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span className="lang-tag">
                    {query.detected_language || query.selected_language}
                  </span>
                  <PriorityBadge priority={query.priority} />
                  <StatusBadge status={query.status} />
                </div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.3 }}>
                  {query.title}
                </h2>
              </div>
            </div>

            {/* Student metadata */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '0.75rem 1rem',
                background: 'var(--bg-main)',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '1.25rem',
                fontSize: '0.85rem',
                color: 'var(--text-muted)',
                flexWrap: 'wrap'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <User size={15} color="var(--primary)" />
                <strong style={{ color: 'var(--text-main)' }}>{query.student?.full_name || 'Student'}</strong>
              </div>
              <div>&bull;</div>
              <div>{query.student?.department || 'Department N/A'}</div>
              <div>&bull;</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Clock size={14} />
                {new Date(query.created_at).toLocaleString()}
              </div>
            </div>

            {/* Query Body */}
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                Student Query Description (Original Text)
              </div>
              <div
                style={{
                  fontSize: '1rem',
                  lineHeight: 1.6,
                  color: 'var(--text-main)',
                  whiteSpace: 'pre-wrap',
                  background: 'var(--primary-light)',
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--primary-border)'
                }}
              >
                {query.description}
              </div>
            </div>
          </div>

          {/* AI Intent & Routing Breakdown Card */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={20} color="var(--accent)" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>AI Intent & Department Routing</h3>
              </div>

              {isStaffOrAdmin && (
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <button
                    onClick={handleReclassify}
                    disabled={aiLoading}
                    className="btn btn-secondary btn-sm"
                    title="Re-run AI classifier"
                  >
                    <RefreshCw size={13} className={aiLoading ? 'spin-slow' : ''} /> Re-classify
                  </button>
                  <button
                    onClick={handleReroute}
                    disabled={aiLoading}
                    className="btn btn-secondary btn-sm"
                    title="Re-evaluate routing rules"
                  >
                    <Building size={13} /> Re-route
                  </button>
                </div>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ padding: '0.75rem', background: 'var(--bg-main)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Classified Intent:</span>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                  {query.predicted_intent || 'General Enquiry'}
                </div>
              </div>

              <div style={{ padding: '0.75rem', background: 'var(--bg-main)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Assigned Department:</span>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#15803d', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Building size={16} />
                  {query.assigned_department}
                </div>
              </div>

              <div style={{ padding: '0.75rem', background: 'var(--bg-main)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Detected Script / Language:</span>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--primary)' }}>
                  {query.detected_language}
                </div>
              </div>

              <div style={{ padding: '0.75rem', background: 'var(--bg-main)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Confidence Score:</span>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--accent)' }}>
                  {Math.round((query.confidence_score || 0) * 100)}%
                </div>
              </div>
            </div>

            <div style={{ padding: '0.75rem 1rem', background: '#eff6ff', borderRadius: '6px', fontSize: '0.85rem', color: '#1e40af' }}>
              <strong>Routing Decision:</strong> {query.routing_reason}
            </div>
          </div>

          {/* Lifecycle Audit Trail / History */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <History size={18} color="var(--primary)" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Status Audit Trail & Timeline</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {query.history?.map((h, idx) => (
                <div
                  key={h.id || idx}
                  style={{
                    display: 'flex',
                    gap: '0.85rem',
                    position: 'relative',
                    paddingBottom: idx === query.history.length - 1 ? 0 : '0.85rem',
                    borderLeft: idx === query.history.length - 1 ? '2px solid transparent' : '2px solid var(--border-color)',
                    marginLeft: '8px',
                    paddingLeft: '1rem'
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      left: '-5px',
                      top: '2px',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: 'var(--primary)'
                    }}
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.825rem' }}>
                      <strong style={{ color: 'var(--text-main)' }}>{h.old_status} &rarr; {h.new_status}</strong>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                        {new Date(h.created_at).toLocaleString()}
                      </span>
                    </div>
                    {h.remarks && (
                      <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                        {h.remarks}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Responses & Support Staff Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Staff Status Control Panel (Visible to Staff & Admin) */}
          {isStaffOrAdmin && (
            <div className="card" style={{ borderColor: 'var(--primary-border)', background: 'var(--bg-card)' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.85rem', color: 'var(--primary)' }}>
                Department Status Control
              </h3>
              <form onSubmit={handleStatusUpdate}>
                <div className="form-group">
                  <label className="form-label">Update Status</label>
                  <select
                    value={statusVal}
                    onChange={(e) => setStatusVal(e.target.value)}
                    className="form-select"
                  >
                    <option value="Assigned">Assigned</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Reopened">Reopened</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Internal Remarks (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g., Verified in records; hall ticket updated."
                    value={statusRemarks}
                    onChange={(e) => setStatusRemarks(e.target.value)}
                    className="form-control"
                  />
                </div>

                <button
                  type="submit"
                  disabled={updatingStatus}
                  className="btn btn-primary btn-sm"
                  style={{ width: '100%' }}
                >
                  {updatingStatus ? 'Updating Status...' : 'Apply Status Change'}
                </button>
              </form>
            </div>
          )}

          {/* Response Thread */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <MessageSquare size={18} color="var(--primary)" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>
                Support Responses ({query.responses?.length || 0})
              </h3>
            </div>

            {query.responses?.length === 0 ? (
              <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                No responses from support staff yet. You will receive an in-app notification once a reply is posted.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                {query.responses.map((resp) => (
                  <div
                    key={resp.id}
                    style={{
                      padding: '1rem 1.25rem',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--bg-main)',
                      border: '1px solid var(--border-color)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <strong style={{ fontSize: '0.875rem', color: 'var(--text-main)' }}>
                          {resp.responder?.full_name || 'Staff Responder'}
                        </strong>
                        <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                          ({resp.responder?.department || 'Department Staff'})
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span className="lang-tag" style={{ fontSize: '0.675rem' }}>
                          {resp.response_language}
                        </span>
                        <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                          {new Date(resp.created_at).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div style={{ fontSize: '0.925rem', lineHeight: 1.5, color: 'var(--text-main)', whiteSpace: 'pre-wrap' }}>
                      {resp.response_text}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Staff Reply Form */}
            {isStaffOrAdmin && (
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                  Add Official Response
                </h4>
                <form onSubmit={handlePostResponse}>
                  <div className="form-group">
                    <label className="form-label">
                      <Globe size={14} style={{ display: 'inline', marginRight: '4px' }} /> Response Language
                    </label>
                    <select
                      value={responseLanguage}
                      onChange={(e) => setResponseLanguage(e.target.value)}
                      className="form-select"
                      style={{ fontSize: '0.85rem' }}
                    >
                      <option value="English">English</option>
                      <option value="Tamil">Tamil (தமிழ்)</option>
                      <option value="Hindi">Hindi (हिन्दी)</option>
                      <option value="Malayalam">Malayalam (മലയാളം)</option>
                      <option value="Telugu">Telugu (తెలుగు)</option>
                      <option value="Kannada">Kannada (ಕನ್ನಡ)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Response Text (in student's selected language)</label>
                    <textarea
                      rows="4"
                      placeholder="Write your official response here..."
                      value={responseText}
                      onChange={(e) => setResponseText(e.target.value)}
                      className="form-control"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingReply || !responseText.trim()}
                    className="btn btn-primary btn-sm"
                    style={{ width: '100%', padding: '0.65rem' }}
                  >
                    {submittingReply ? 'Sending Response...' : 'Post Official Response'} <Send size={14} />
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QueryDetailsPage;
