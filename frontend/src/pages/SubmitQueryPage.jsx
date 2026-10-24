import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { queryAPI } from '../services/api';
import {
  Send,
  Globe,
  Sparkles,
  Building,
  CheckCircle2,
  Paperclip,
  ArrowRight,
  ShieldAlert,
  Info
} from 'lucide-react';

const SUPPORTED_LANGUAGES = [
  { code: 'English', label: 'English', native: 'English' },
  { code: 'Tamil', label: 'Tamil', native: 'தமிழ்' },
  { code: 'Hindi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'Malayalam', label: 'Malayalam', native: 'മലയാളം' },
  { code: 'Telugu', label: 'Telugu', native: 'తెలుగు' },
  { code: 'Kannada', label: 'Kannada', native: 'ಕನ್ನಡ' }
];

const PRESETS = [
  {
    lang: 'English',
    title: 'Exam Hall Ticket download issue',
    desc: 'I need help with my exam hall ticket download before my semester examinations next week.'
  },
  {
    lang: 'Tamil',
    title: 'தேர்வு ஹால் டிக்கெட் உதவி',
    desc: 'எனக்கு தேர்வு ஹால் டிக்கெட் வேண்டும். இணைய போர்ட்டலில் இருந்து பதிவிறக்கம் செய்ய முடியவில்லை.'
  },
  {
    lang: 'Hindi',
    title: 'परीक्षा हॉल टिकट डाउनलोड समस्या',
    desc: 'मुझे परीक्षा का हॉल टिकट चाहिए। पोर्टल पर रोल नंबर डालने पर एरर आ रहा है।'
  },
  {
    lang: 'Malayalam',
    title: 'ഹോസ്റ്റൽ അലോട്ട്മെന്റ് സംശയം',
    desc: 'ഹോസ്റ്റൽ മുറി ലഭിക്കാൻ എങ്ങനെ അപേക്ഷിക്കണം? ഫീസ് അടയ്ക്കാനുള്ള അവസാന തീയതി എപ്പോഴാണ്?'
  },
  {
    lang: 'Telugu',
    title: 'కాలేజీ ఫీజు చెల్లింపు గడువు',
    desc: 'కాలేజీ ఫీజు చెల్లించడానికి చివరి తేదీ ఏమిటి? ఆన్‌లైన్ పేమెంట్ రసీదు ఎలా పొందాలి?'
  },
  {
    lang: 'Kannada',
    title: 'ವೈಫೈ ಕನೆಕ್ಟಿವಿಟಿ ಸಮಸ್ಯೆ',
    desc: 'ಲೈಬ್ರರಿಯಲ್ಲಿ ವೈಫೈ ನೆಟ್‌ವರ್ಕ್ ಸಮಸ್ಯೆ ಇದೆ ಮತ್ತು ಪಾಸ್‌ವರ್ಡ್ ಮರುಹೊಂದಿಸಲು ಸಹಾಯ ಬೇಕು.'
  }
];

const SubmitQueryPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    selected_language: 'English',
    category: 'General',
    department: user?.department || 'Computer Science'
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const applyPreset = (preset) => {
    setFormData({
      ...formData,
      selected_language: preset.lang,
      title: preset.title,
      description: preset.desc
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      setError('Please provide both query title and detailed description.');
      return;
    }

    setSubmitting(true);
    setError('');
    setResult(null);

    try {
      const res = await queryAPI.submitQuery({
        title: formData.title,
        description: formData.description,
        selected_language: formData.selected_language,
        category: formData.category,
        department: formData.department
      });

      setResult(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Failed to submit query. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-wrapper" style={{ maxWidth: '900px' }}>
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
          Submit Multilingual Query
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Ask in your preferred native language. Our AI detects intent and directs your question to the relevant team.
        </p>
      </div>

      {/* Preset helper bar */}
      <div
        className="card"
        style={{
          padding: '1rem 1.25rem',
          marginBottom: '1.5rem',
          background: 'var(--primary-light)',
          borderColor: 'var(--primary-border)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.65rem' }}>
          <Sparkles size={16} /> Quick Sample Presets (Click to Load)
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {PRESETS.map((p) => (
            <button
              key={p.lang}
              type="button"
              onClick={() => applyPreset(p)}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.75rem', borderRadius: '4px' }}
            >
              <Globe size={12} /> {p.lang} Preset
            </button>
          ))}
        </div>
      </div>

      {result ? (
        /* Instant AI Classification & Routing Result Card */
        <div className="card" style={{ padding: '2rem', border: '2px solid #22c55e', background: 'var(--bg-card)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', color: '#15803d' }}>
            <CheckCircle2 size={32} />
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
                Query Successfully Classified & Routed!
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                Query Reference #{result.id} &bull; Notifications dispatched
              </p>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1rem',
              padding: '1.25rem',
              background: 'var(--bg-main)',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '1.5rem',
              border: '1px solid var(--border-color)'
            }}
          >
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Detected Language:</span>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--primary)' }}>
                {result.detected_language}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Predicted Intent:</span>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)' }}>
                {result.predicted_intent}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Assigned Department:</span>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: '#15803d' }}>
                {result.assigned_department}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Confidence Score:</span>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--accent)' }}>
                {Math.round((result.confidence_score || 0) * 100)}%
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Assigned Priority:</span>
              <div style={{ fontWeight: 700, fontSize: '1rem' }}>
                {result.priority}
              </div>
            </div>
          </div>

          <div style={{ padding: '0.85rem 1rem', background: '#eff6ff', borderRadius: '6px', fontSize: '0.85rem', color: '#1e40af', marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
            <Info size={18} style={{ minWidth: '18px', marginTop: '2px' }} />
            <div>
              <strong>Routing Logic:</strong> {result.routing_reason}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate(`/queries/${result.id}`)}
              className="btn btn-primary"
            >
              Open Query Tracking & Discussion <ArrowRight size={16} />
            </button>
            <button
              onClick={() => {
                setResult(null);
                setFormData({
                  title: '',
                  description: '',
                  selected_language: 'English',
                  category: 'General',
                  department: user?.department || 'Computer Science'
                });
              }}
              className="btn btn-secondary"
            >
              Submit Another Query
            </button>
          </div>
        </div>
      ) : (
        /* Submission Form */
        <div className="card" style={{ padding: '2rem' }}>
          {error && (
            <div className="alert alert-danger">
              <ShieldAlert size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">
                  <Globe size={14} style={{ display: 'inline', marginRight: '4px' }} /> Language Selection
                </label>
                <select
                  name="selected_language"
                  value={formData.selected_language}
                  onChange={handleChange}
                  className="form-select"
                >
                  {SUPPORTED_LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.label} ({l.native})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Student Department</label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="e.g., Computer Science"
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Query Category (Optional)</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="General">General</option>
                  <option value="Academics">Academics</option>
                  <option value="Examinations">Examinations</option>
                  <option value="Finance & Fees">Finance & Fees</option>
                  <option value="Campus Facilities">Campus Facilities</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Query Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Brief summary of your question (e.g., எனக்கு தேர்வு ஹால் டிக்கெட் வேண்டும் / Need hall ticket)"
                className="form-control"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Detailed Query Description *</label>
              <textarea
                name="description"
                rows="5"
                value={formData.description}
                onChange={handleChange}
                placeholder="Write your complete query here in your preferred language. You can use English, தமிழ், हिन्दी, മലയാളം, తెలుగు, or ಕನ್ನಡ..."
                className="form-control"
                required
              />
            </div>

            {/* Optional attachment */}
            <div className="form-group">
              <label className="form-label">Optional Attachment (Receipt, Marksheet, Screenshot)</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer' }}>
                  <Paperclip size={14} /> Choose File
                  <input
                    type="file"
                    style={{ display: 'none' }}
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                  />
                </label>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {selectedFile ? selectedFile.name : 'No file chosen (PDF, PNG, JPG up to 5MB)'}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary"
                style={{ padding: '0.75rem 2rem' }}
              >
                {submitting ? 'Analyzing & Routing Query...' : 'Submit Query'} <Send size={16} />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default SubmitQueryPage;
