import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  Globe,
  BrainCircuit,
  ArrowRight,
  ShieldCheck,
  Clock,
  Sparkles,
  CheckCircle2,
  Building,
  HelpCircle,
  Zap,
  Mic,
  Cpu,
  Layers,
  TrendingUp,
  Activity,
  Check
} from 'lucide-react';

const LIVE_TICKER_ITEMS = [
  { lang: "Tamil", text: "எனக்கு தேர்வு ஹால் டிக்கெட் வேண்டும்", dept: "Examination Cell", conf: "99%" },
  { lang: "English", text: "Semester tuition fee payment deadline", dept: "Accounts Department", conf: "98%" },
  { lang: "Hindi", text: "मुझे परीक्षा का हॉल टिकट चाहिए", dept: "Examination Cell", conf: "99%" },
  { lang: "Malayalam", text: "ഹോസ്റ്റൽ മുറി അലോട്ട്മെന്റ് സംശയം", dept: "Hostel Administration", conf: "99%" },
  { lang: "Telugu", text: "కాలేజీ ఫీజు చెల్లింపు గడువు ఏమిటి", dept: "Accounts Department", conf: "97%" },
  { lang: "Kannada", text: "ವೈಫೈ ಕನೆಕ್ಟಿವಿಟಿ ಸಮಸ್ಯೆ ಇದೆ", dept: "IT Support", conf: "99%" }
];

const DEMO_QUERIES = [
  {
    lang: "Tamil (தமிழ்)",
    script: "Tamil (தமிழ்)",
    query: "எனக்கு தேர்வு ஹால் டிக்கெட் வேண்டும்.",
    intent: "Examination and Hall Ticket",
    dept: "Examination Cell",
    conf: 99.4,
    tags: ["ஹால் டிக்கெட்", "தேர்வு", "மதிப்பெண்"]
  },
  {
    lang: "Hindi (हिन्दी)",
    script: "Devanagari (हिन्दी)",
    query: "मुझे परीक्षा का हॉल टिकट चाहिए।",
    intent: "Examination and Hall Ticket",
    dept: "Examination Cell",
    conf: 99.2,
    tags: ["हॉल टिकट", "परीक्षा", "एडमिट कार्ड"]
  },
  {
    lang: "English",
    script: "Latin (English)",
    query: "When is the deadline for semester tuition fee payment?",
    intent: "Fees and Scholarships",
    dept: "Accounts Department",
    conf: 98.7,
    tags: ["tuition fee", "deadline", "receipt"]
  },
  {
    lang: "Malayalam (മലയാളം)",
    script: "Malayalam (മലയാളം)",
    query: "ഹോസ്റ്റൽ മുറി ലഭിക്കാൻ എങ്ങനെ അപേക്ഷിക്കണം?",
    intent: "Hostel and Transport",
    dept: "Hostel Administration",
    conf: 99.1,
    tags: ["ഹോസ്റ്റൽ", "മുറി", "അപേക്ഷ"]
  },
  {
    lang: "Telugu (తెలుగు)",
    script: "Telugu (తెలుగు)",
    query: "కాలేజీ ఫీజు చెల్లించడానికి చివరి తేదీ ఏమిటి?",
    intent: "Fees and Scholarships",
    dept: "Accounts Department",
    conf: 98.2,
    tags: ["ఫీజు", "స్కాలర్‌షిప్", "చెల్లింపు"]
  },
  {
    lang: "Kannada (ಕನ್ನಡ)",
    script: "Kannada (ಕನ್ನಡ)",
    query: "ವೈಫೈ ನೆಟ್‌ವರ್ಕ್ ಸಮಸ್ಯೆ ಇದೆ ಮತ್ತು ಲಾಗಿನ್ ಆಗುತ್ತಿಲ್ಲ",
    intent: "Technical Support",
    dept: "IT Support",
    conf: 99.0,
    tags: ["ವೈಫೈ", "ನೆಟ್‌ವರ್ಕ್", "ಲಾಗಿನ್"]
  }
];

const LandingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [isVoiceActive, setIsVoiceActive] = useState(false);

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'student') return '/student/dashboard';
    if (user.role === 'staff') return '/staff/dashboard';
    if (user.role === 'admin') return '/admin/dashboard';
    return '/';
  };

  const activeDemo = DEMO_QUERIES[activeTab];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-main)' }}>
      {/* 1. Creative Live Animated Ticker Bar */}
      <div className="ticker-wrapper">
        <div style={{ padding: '0 1rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#38bdf8', fontWeight: 700, zIndex: 10, background: '#0f172a' }}>
          <Zap size={14} /> LIVE AI ROUTING
        </div>
        <div className="ticker-content">
          {[...LIVE_TICKER_ITEMS, ...LIVE_TICKER_ITEMS].map((item, idx) => (
            <span key={idx} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="lang-tag" style={{ fontSize: '0.675rem', padding: '0.1rem 0.4rem' }}>{item.lang}</span>
              <span style={{ color: '#f8fafc', fontWeight: 600 }}>"{item.text}"</span>
              <span style={{ color: '#4ade80' }}>&rarr; {item.dept}</span>
              <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>({item.conf})</span>
              <span style={{ color: 'rgba(255, 255, 255, 0.2)' }}>•</span>
            </span>
          ))}
        </div>
      </div>

      {/* 2. Hero Section with Futuristic Gradient & Glass Elements */}
      <section
        style={{
          background: 'linear-gradient(135deg, #090e1a 0%, #0f1f4b 45%, #1d4ed8 100%)',
          color: '#ffffff',
          padding: '5rem 2rem 4rem',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ maxWidth: '980px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(12px)',
              padding: '0.45rem 1.1rem',
              borderRadius: '9999px',
              fontSize: '0.85rem',
              fontWeight: 600,
              marginBottom: '1.5rem',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
            }}
          >
            <Sparkles size={16} color="#60a5fa" />
            AI-Powered Multilingual Query Management & Automated Department Routing
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.1rem, 4.2vw, 3.5rem)',
              fontWeight: 800,
              lineHeight: 1.18,
              marginBottom: '1.35rem',
              letterSpacing: '-0.025em',
              textShadow: '0 2px 20px rgba(0,0,0,0.3)'
            }}
          >
            Multilingual Student Query Intent & <br />
            <span style={{ background: 'linear-gradient(90deg, #60a5fa, #a78bfa, #38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Response Routing System
            </span>
          </h1>

          <p
            style={{
              fontSize: '1.15rem',
              color: '#cbd5e1',
              maxWidth: '780px',
              margin: '0 auto 2.5rem',
              lineHeight: 1.6
            }}
          >
            Allow college students to submit questions in their native language—<strong>English, Tamil (தமிழ்), Hindi (हिन्दी), Malayalam (മലയാളം), Telugu (తెలుగు), or Kannada (ಕನ್ನಡ)</strong>. The AI instantly identifies intent and routes queries to Examination, Accounts, Scholarships, or IT Support.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
            <Link
              to={getDashboardLink()}
              className="btn btn-primary"
              style={{
                padding: '0.9rem 2rem',
                fontSize: '1.05rem',
                background: '#ffffff',
                color: '#1e3a8a',
                fontWeight: 800,
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.25)',
                borderRadius: '8px'
              }}
            >
              Go to Your Dashboard <ArrowRight size={18} />
            </Link>

            <Link
              to="/student/submit"
              className="btn btn-secondary"
              style={{
                padding: '0.9rem 1.75rem',
                fontSize: '1.05rem',
                background: 'rgba(255, 255, 255, 0.12)',
                color: '#fff',
                borderColor: 'rgba(255, 255, 255, 0.25)',
                backdropFilter: 'blur(10px)',
                borderRadius: '8px'
              }}
            >
              <Zap size={18} color="#60a5fa" /> Submit Instant Query
            </Link>
          </div>

          {/* Quick interactive Voice / Speech Simulator Bar */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.85rem',
              padding: '0.5rem 1.25rem',
              borderRadius: '9999px',
              background: 'rgba(0, 0, 0, 0.35)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              fontSize: '0.825rem'
            }}
          >
            <button
              onClick={() => setIsVoiceActive(!isVoiceActive)}
              style={{
                background: isVoiceActive ? '#ef4444' : 'rgba(255, 255, 255, 0.15)',
                border: 'none',
                color: '#fff',
                borderRadius: '50%',
                width: '30px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              title="Voice Query Simulation"
            >
              <Mic size={15} />
            </button>

            <span>
              {isVoiceActive ? 'Voice Query Listening (தமிழ் / हिन्दी / English)...' : 'Multilingual Speech & Script Processing Engine'}
            </span>

            {isVoiceActive && (
              <div className="waveform-container">
                <div className="wave-bar"></div>
                <div className="wave-bar"></div>
                <div className="wave-bar"></div>
                <div className="wave-bar"></div>
                <div className="wave-bar"></div>
                <div className="wave-bar"></div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3. Interactive Neural Intent Pipeline Visualizer */}
      <section style={{ maxWidth: '1100px', margin: '-2rem auto 2.5rem', padding: '0 1.5rem', position: 'relative', zIndex: 20 }}>
        <div className="glass-card-glow" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
                <Cpu size={20} color="var(--accent)" />
                AI Neural Intent & Routing Pipeline
              </h3>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                End-to-end telemetry from raw multilingual text to automated departmental ticket creation
              </p>
            </div>
            <span className="badge badge-assigned" style={{ fontSize: '0.75rem', fontWeight: 700 }}>
              <span className="pulse-dot" style={{ marginRight: '4px' }}></span> Live Inference 100%
            </span>
          </div>

          {/* Pipeline 4-Stage Track */}
          <div className="pipeline-track">
            <div className="pipeline-step active">
              <div className="step-icon">1</div>
              <h5>Student Input</h5>
              <p>Raw Indic Unicode text or voice submission</p>
            </div>

            <div className="pipeline-connector">&rarr;</div>

            <div className="pipeline-step active">
              <div className="step-icon">2</div>
              <h5>Script Detection</h5>
              <p>Deterministic Unicode range analyzer</p>
            </div>

            <div className="pipeline-connector">&rarr;</div>

            <div className="pipeline-step active">
              <div className="step-icon">3</div>
              <h5>Naive Bayes NLP</h5>
              <p>Trained TF-IDF n-gram classifier (99% conf)</p>
            </div>

            <div className="pipeline-connector">&rarr;</div>

            <div className="pipeline-step active">
              <div className="step-icon" style={{ background: '#10b981', color: '#fff' }}>4</div>
              <h5>Department Dispatch</h5>
              <p>Routes to Exam, Accounts, IT, or Hostels</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Interactive Multilingual Demonstration Sandbox */}
      <section style={{ maxWidth: '1100px', margin: '0 auto 3rem', padding: '0 1.5rem' }}>
        <div className="card" style={{ boxShadow: 'var(--shadow-md)', border: '1px solid var(--border-color)', padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Globe size={20} color="var(--accent)" />
                Interactive Multilingual Language Switcher
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Click any regional language to test how our AI understands queries in authentic Indian scripts:
              </p>
            </div>
            <span className="lang-tag" style={{ background: '#dcfce7', color: '#15803d', fontWeight: 700 }}>
              6 Regional Languages Supported
            </span>
          </div>

          {/* Language Tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            {DEMO_QUERIES.map((item, idx) => (
              <button
                key={item.lang}
                onClick={() => setActiveTab(idx)}
                className={`btn btn-sm ${activeTab === idx ? 'btn-primary' : 'btn-secondary'}`}
                style={{ borderRadius: '6px', fontWeight: activeTab === idx ? 700 : 500 }}
              >
                {item.lang}
              </button>
            ))}
          </div>

          {/* Active Query Showcase */}
          <div
            style={{
              padding: '1.5rem',
              background: 'var(--primary-light)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--primary-border)',
              position: 'relative'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                INPUT TEXT & SCRIPT ({activeDemo.script})
              </div>
              <div style={{ display: 'flex', gap: '0.35rem' }}>
                {activeDemo.tags.map((t, idx) => (
                  <span key={idx} style={{ fontSize: '0.7rem', padding: '0.15rem 0.45rem', borderRadius: '4px', background: 'rgba(37, 99, 235, 0.1)', color: 'var(--primary)', fontWeight: 600 }}>
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '1.25rem' }}>
              "{activeDemo.query}"
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
                gap: '1rem',
                paddingTop: '1rem',
                borderTop: '1px solid var(--border-color)',
                background: 'var(--bg-card)',
                padding: '1rem',
                borderRadius: '8px'
              }}
            >
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Classified Intent:</span>
                <div style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '0.95rem' }}>
                  {activeDemo.intent}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Routed College Department:</span>
                <div style={{ fontWeight: 800, color: '#15803d', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Building size={16} />
                  {activeDemo.dept}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>AI Confidence Meter:</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
                  <div style={{ flex: 1, height: '8px', background: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${activeDemo.conf}%`, height: '100%', background: '#2563eb' }}></div>
                  </div>
                  <strong style={{ fontSize: '0.85rem', color: 'var(--accent)' }}>{activeDemo.conf}%</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Live Campus Department Availability Radar */}
      <section style={{ maxWidth: '1100px', margin: '0 auto 4rem', padding: '0 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
            Campus Automated Department Matrix
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Dedicated queues connected to the multilingual triage engine
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
          <div className="card stat-card-new" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <strong style={{ fontSize: '0.95rem' }}>Examination Cell</strong>
              <span className="badge badge-resolved" style={{ fontSize: '0.7rem' }}>● Online</span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
              Admit cards, hall tickets, revaluation & marksheets.
            </p>
            <span style={{ fontSize: '0.72rem', color: 'var(--accent)', fontWeight: 600 }}>Avg SLA: 1.5 hrs</span>
          </div>

          <div className="card stat-card-new success" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <strong style={{ fontSize: '0.95rem' }}>Accounts Department</strong>
              <span className="badge badge-resolved" style={{ fontSize: '0.7rem' }}>● Online</span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
              Tuition fee receipts, installment plans & dues.
            </p>
            <span style={{ fontSize: '0.72rem', color: 'var(--success)', fontWeight: 600 }}>Avg SLA: 2.0 hrs</span>
          </div>

          <div className="card stat-card-new warning" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <strong style={{ fontSize: '0.95rem' }}>Scholarship Office</strong>
              <span className="badge badge-resolved" style={{ fontSize: '0.7rem' }}>● Online</span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
              State & national merit aid, fee waiver counseling.
            </p>
            <span style={{ fontSize: '0.72rem', color: 'var(--warning)', fontWeight: 600 }}>Avg SLA: 3.2 hrs</span>
          </div>

          <div className="card stat-card-new info" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <strong style={{ fontSize: '0.95rem' }}>IT Support Desk</strong>
              <span className="badge badge-resolved" style={{ fontSize: '0.7rem' }}>● 24/7 Active</span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
              Campus Wi-Fi, LMS password resets & network issues.
            </p>
            <span style={{ fontSize: '0.72rem', color: 'var(--info)', fontWeight: 600 }}>Avg SLA: 0.8 hrs</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
