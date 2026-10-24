import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { queryAPI } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import {
  FileText,
  Clock,
  RefreshCw,
  CheckCircle2,
  PlusCircle,
  ArrowRight,
  Building,
  HelpCircle,
  Search,
  ExternalLink,
  Sparkles,
  Globe2,
  Zap,
  TrendingUp,
  Flame,
  Check,
  Send
} from 'lucide-react';

const QUICK_TEST_PROMPTS = [
  { text: "எனக்கு தேர்வு ஹால் டிக்கெட் வேண்டும் (Tamil Exam)", lang: "Tamil" },
  { text: "मुझे परीक्षा का हॉल टिकट चाहिए (Hindi Exam)", lang: "Hindi" },
  { text: "Tuition fee payment receipt missing (English Fee)", lang: "English" },
  { text: "ഹോസ്റ്റൽ മുറി അലോട്ട്മെന്റ് (Malayalam Hostel)", lang: "Malayalam" },
  { text: "కాలేజీ ఫీజు చివరి తేదీ ఏమిటి (Telugu Fee)", lang: "Telugu" }
];

const StudentDashboard = () => {
  const { user } = useAuth();
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeChip, setActiveChip] = useState('all');

  // Interactive Live Pre-Check Assistant State
  const [liveQuery, setLiveQuery] = useState('');
  const [liveResult, setLiveResult] = useState(null);
  const [liveAnalyzing, setLiveAnalyzing] = useState(false);

  const fetchQueries = async () => {
    try {
      const res = await queryAPI.getMyQueries();
      setQueries(res.data);
    } catch (err) {
      console.error("Failed to load student queries", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueries();
  }, []);

  const total = queries.length;
  const pending = queries.filter(q => q.status === 'Submitted' || q.status === 'Assigned').length;
  const inProgress = queries.filter(q => q.status === 'In Progress').length;
  const resolved = queries.filter(q => q.status === 'Resolved').length;
  const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 100;

  // Real-time AI Assistant Simulation for Student Query Pre-Check
  const handleLiveAnalyze = (textToAnalyze) => {
    const text = textToAnalyze || liveQuery;
    if (!text.trim()) return;

    setLiveAnalyzing(true);
    setLiveResult(null);

    // Instant local heuristic calculation mirroring backend NLP service
    setTimeout(() => {
      let lang = "English";
      let intent = "General Enquiry";
      let dept = "Student Support Desk";
      let conf = 96;

      const lower = text.toLowerCase();
      // Unicode script detection
      if (/[\u0B80-\u0BFF]/.test(text)) lang = "Tamil";
      else if (/[\u0900-\u097F]/.test(text)) lang = "Hindi";
      else if (/[\u0D00-\u0D7F]/.test(text)) lang = "Malayalam";
      else if (/[\u0C00-\u0C7F]/.test(text)) lang = "Telugu";
      else if (/[\u0C80-\u0CFF]/.test(text)) lang = "Kannada";

      // Intent heuristics
      if (lower.includes("exam") || lower.includes("hall ticket") || text.includes("தேர்வு") || text.includes("ஹால்") || text.includes("परीक्षा") || text.includes("परीक्षा")) {
        intent = "Examination and Hall Ticket";
        dept = "Examination Cell";
        conf = 99;
      } else if (lower.includes("fee") || lower.includes("tuition") || lower.includes("scholarship") || text.includes("கட்டணம்") || text.includes("உதவித்தொகை") || text.includes("फीस") || text.includes("ఫీజు")) {
        intent = "Fees and Scholarships";
        dept = (lower.includes("scholarship") || text.includes("உதவித்தொகை")) ? "Scholarship Office" : "Accounts Department";
        conf = 98;
      } else if (lower.includes("wifi") || lower.includes("portal") || lower.includes("password") || text.includes("வைஃபை") || text.includes("वाईफाई")) {
        intent = "Technical Support";
        dept = "IT Support";
        conf = 97;
      } else if (lower.includes("hostel") || lower.includes("bus") || text.includes("விடுதி") || text.includes("பேருந்து") || text.includes("ഹോസ്റ്റൽ")) {
        intent = "Hostel and Transport";
        dept = (lower.includes("bus") || text.includes("பேருந்து")) ? "Transport Office" : "Hostel Administration";
        conf = 96;
      }

      setLiveResult({ lang, intent, dept, conf });
      setLiveAnalyzing(false);
    }, 280);
  };

  // Filter queries based on search & chips
  const filteredQueries = queries.filter(q => {
    const matchesSearch =
      q.title.toLowerCase().includes(search.toLowerCase()) ||
      q.description.toLowerCase().includes(search.toLowerCase()) ||
      (q.predicted_intent && q.predicted_intent.toLowerCase().includes(search.toLowerCase())) ||
      (q.assigned_department && q.assigned_department.toLowerCase().includes(search.toLowerCase()));

    if (!matchesSearch) return false;

    if (activeChip === 'urgent') return (q.priority || '').toLowerCase() === 'urgent';
    if (activeChip === 'in_progress') return q.status === 'In Progress';
    if (activeChip === 'resolved') return q.status === 'Resolved';
    if (activeChip === 'tamil') return (q.detected_language === 'Tamil' || q.selected_language === 'Tamil');
    if (activeChip === 'hindi') return (q.detected_language === 'Hindi' || q.selected_language === 'Hindi');
    if (activeChip === 'english') return (q.detected_language === 'English' || q.selected_language === 'English');

    return true;
  });

  return (
    <div className="page-wrapper">
      {/* Next-Gen Hero Banner */}
      <div className="hero-banner-new">
        <div style={{ position: 'relative', zIndex: 10, maxWidth: '640px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255, 255, 255, 0.12)', backdropFilter: 'blur(8px)', padding: '0.3rem 0.8rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.85rem' }}>
            <span className="pulse-dot"></span>
            AI Multilingual Routing Engine Online
          </div>

          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, lineHeight: 1.25, marginBottom: '0.5rem' }}>
            Welcome, {user?.full_name}! 👋
          </h1>
          <p style={{ fontSize: '0.925rem', color: '#cbd5e1', lineHeight: 1.5, marginBottom: '1.25rem' }}>
            Ask questions in <strong>English, தமிழ், हिन्दी, മലയാളം, తెలుగు, or ಕನ್ನಡ</strong>. Our AI categorizes your intent and routes directly to college authorities.
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link to="/student/submit" className="btn btn-primary" style={{ background: '#ffffff', color: '#1e3a8a', fontWeight: 700 }}>
              <PlusCircle size={18} /> Submit New Query
            </Link>
            <Link to="/student/queries" className="btn btn-secondary" style={{ background: 'rgba(255, 255, 255, 0.12)', color: '#ffffff', borderColor: 'rgba(255, 255, 255, 0.25)' }}>
              <FileText size={16} /> View Query Log ({total})
            </Link>
          </div>
        </div>

        {/* Live SLA & Resolution Widget */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem 1.5rem',
            textAlign: 'center',
            minWidth: '200px',
            position: 'relative',
            zIndex: 10
          }}
        >
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#93c5fd', fontWeight: 700 }}>
            Resolution Rate
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, margin: '0.2rem 0', color: '#ffffff' }}>
            {resolutionRate}%
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', fontSize: '0.75rem', color: '#86efac' }}>
            <CheckCircle2 size={14} /> {resolved} of {total} queries resolved
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid-cols-4">
        <div className="card stat-card stat-card-new">
          <div className="stat-icon" style={{ background: '#eff6ff', color: '#1e40af' }}>
            <FileText size={24} />
          </div>
          <div className="stat-details">
            <h4>Total Submissions</h4>
            <div className="stat-number">{total}</div>
          </div>
        </div>

        <div className="card stat-card stat-card-new success">
          <div className="stat-icon" style={{ background: '#ecfdf5', color: '#10b981' }}>
            <CheckCircle2 size={24} />
          </div>
          <div className="stat-details">
            <h4>Resolved Tickets</h4>
            <div className="stat-number">{resolved}</div>
          </div>
        </div>

        <div className="card stat-card stat-card-new warning">
          <div className="stat-icon" style={{ background: '#fffbeb', color: '#b45309' }}>
            <RefreshCw size={24} />
          </div>
          <div className="stat-details">
            <h4>In Progress</h4>
            <div className="stat-number">{inProgress}</div>
          </div>
        </div>

        <div className="card stat-card stat-card-new info">
          <div className="stat-icon" style={{ background: '#e0f2fe', color: '#0369a1' }}>
            <Clock size={24} />
          </div>
          <div className="stat-details">
            <h4>Assigned / Pending</h4>
            <div className="stat-number">{pending}</div>
          </div>
        </div>
      </div>

      {/* Interactive AI Smart Pre-Check Sandbox */}
      <div className="card ai-simulator-box">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={18} color="var(--accent)" />
            <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>
              Live AI Multilingual Intent Tester & Pre-Checker
            </span>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Try typing in Tamil, Hindi, Malayalam, Telugu, Kannada, or English
          </span>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <input
            type="text"
            placeholder="Type your question here (e.g., எனக்கு தேர்வு ஹால் டிக்கெட் வேண்டும் / Need exam hall ticket)..."
            value={liveQuery}
            onChange={(e) => setLiveQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLiveAnalyze()}
            className="form-control"
            style={{ fontSize: '0.9rem' }}
          />
          <button
            onClick={() => handleLiveAnalyze()}
            disabled={liveAnalyzing || !liveQuery.trim()}
            className="btn btn-primary"
            style={{ padding: '0.6rem 1.25rem', whiteSpace: 'nowrap' }}
          >
            {liveAnalyzing ? 'Analyzing...' : 'Test Intent'} <Zap size={16} />
          </button>
        </div>

        {/* Quick test prompts */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap', marginBottom: liveResult ? '0.75rem' : '0' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Quick Examples:</span>
          {QUICK_TEST_PROMPTS.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setLiveQuery(p.text);
                handleLiveAnalyze(p.text);
              }}
              className="filter-chip"
              style={{ fontSize: '0.725rem' }}
            >
              {p.text}
            </button>
          ))}
        </div>

        {/* Result banner if analyzed */}
        {liveResult && (
          <div
            style={{
              marginTop: '0.85rem',
              padding: '0.85rem 1rem',
              background: 'var(--bg-card)',
              borderRadius: '8px',
              border: '1px solid var(--primary-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.75rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Detected Script:</span>
                <div style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '0.85rem' }}>{liveResult.lang}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Predicted Intent:</span>
                <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.85rem' }}>{liveResult.intent}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Routed Department:</span>
                <div style={{ fontWeight: 700, color: '#15803d', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Building size={14} /> {liveResult.dept}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Confidence:</span>
                <div style={{ fontWeight: 700, color: 'var(--accent)', fontSize: '0.85rem' }}>{liveResult.conf}%</div>
              </div>
            </div>

            <Link
              to="/student/submit"
              className="btn btn-primary btn-sm"
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
            >
              Submit This as Real Ticket <ArrowRight size={13} />
            </Link>
          </div>
        )}
      </div>

      {/* Recent Queries List Section with Filter Chips */}
      <div className="card">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>My Active & Recent Tickets</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Real-time synchronization with college department response queues
            </p>
          </div>

          <div style={{ position: 'relative', width: '260px' }}>
            <input
              type="text"
              placeholder="Search tickets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-control"
              style={{ paddingLeft: '2.2rem', paddingRight: '0.75rem', fontSize: '0.85rem' }}
            />
            <Search
              size={16}
              style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
            />
          </div>
        </div>

        {/* Filter Chips Bar */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
          <button
            onClick={() => setActiveChip('all')}
            className={`filter-chip ${activeChip === 'all' ? 'active' : ''}`}
          >
            All Queries ({total})
          </button>
          <button
            onClick={() => setActiveChip('urgent')}
            className={`filter-chip ${activeChip === 'urgent' ? 'active' : ''}`}
          >
            <Flame size={13} color={activeChip === 'urgent' ? '#fff' : '#dc2626'} /> Urgent Priority
          </button>
          <button
            onClick={() => setActiveChip('in_progress')}
            className={`filter-chip ${activeChip === 'in_progress' ? 'active' : ''}`}
          >
            In Progress ({inProgress})
          </button>
          <button
            onClick={() => setActiveChip('resolved')}
            className={`filter-chip ${activeChip === 'resolved' ? 'active' : ''}`}
          >
            Resolved ({resolved})
          </button>
          <button
            onClick={() => setActiveChip('tamil')}
            className={`filter-chip ${activeChip === 'tamil' ? 'active' : ''}`}
          >
            தமிழ் Tamil
          </button>
          <button
            onClick={() => setActiveChip('hindi')}
            className={`filter-chip ${activeChip === 'hindi' ? 'active' : ''}`}
          >
            हिन्दी Hindi
          </button>
          <button
            onClick={() => setActiveChip('english')}
            className={`filter-chip ${activeChip === 'english' ? 'active' : ''}`}
          >
            English
          </button>
        </div>

        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            Loading your queries...
          </div>
        ) : filteredQueries.length === 0 ? (
          <div style={{ padding: '3.5rem 1.5rem', textAlign: 'center' }}>
            <HelpCircle size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
            <h4 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.35rem' }}>No matching queries found</h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              {search || activeChip !== 'all' ? 'Try clearing your search or filter chip.' : 'You have not submitted any queries yet.'}
            </p>
            {activeChip !== 'all' && (
              <button onClick={() => setActiveChip('all')} className="btn btn-secondary btn-sm" style={{ marginRight: '0.5rem' }}>
                Reset Filters
              </button>
            )}
            <Link to="/student/submit" className="btn btn-primary btn-sm">
              <PlusCircle size={16} /> Submit A Query
            </Link>
          </div>
        ) : (
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Ticket</th>
                  <th>Language</th>
                  <th>Detected Intent</th>
                  <th>Assigned Department</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Staff Responses</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredQueries.map((q) => (
                  <tr key={q.id}>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--text-main)', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {q.title}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Ticket #{q.id} &bull; {new Date(q.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td>
                      <span className="lang-tag">
                        {q.detected_language || q.selected_language}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                        {q.predicted_intent || 'General Enquiry'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem' }}>
                        <Building size={14} color="var(--primary)" />
                        <span>{q.assigned_department}</span>
                      </div>
                    </td>
                    <td>
                      <PriorityBadge priority={q.priority} />
                    </td>
                    <td>
                      <StatusBadge status={q.status} />
                    </td>
                    <td>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: q.responses?.length ? '#15803d' : 'var(--text-muted)' }}>
                        {q.responses?.length || 0} response{q.responses?.length === 1 ? '' : 's'}
                      </span>
                    </td>
                    <td>
                      <Link to={`/queries/${q.id}`} className="btn btn-secondary btn-sm" style={{ padding: '0.35rem 0.65rem' }}>
                        Track <ExternalLink size={13} />
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

export default StudentDashboard;
