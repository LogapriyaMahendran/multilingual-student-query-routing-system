import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import {
  BarChart3,
  TrendingUp,
  Cpu,
  Globe,
  Building,
  CheckCircle2,
  PieChart as PieIcon,
  ArrowRight
} from 'lucide-react';
import { Bar, Doughnut } from 'react-chartjs-2';

const AnalyticsPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      const res = await adminAPI.getAnalytics();
      setAnalytics(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading || !analytics) {
    return (
      <div className="page-wrapper" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading advanced analytics...
      </div>
    );
  }

  const intentLabels = analytics.intent_stats?.map(i => i.name) || [];
  const intentValues = analytics.intent_stats?.map(i => i.count) || [];

  const langLabels = analytics.language_stats?.map(l => l.name) || [];
  const langValues = analytics.language_stats?.map(l => l.count) || [];

  return (
    <div className="page-wrapper">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
          Multilingual NLP & Routing Analytics
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Detailed intelligence on language usage, intent classification accuracy, and resolution performance
        </p>
      </div>

      {/* Top High-Level Metrics */}
      <div className="grid-cols-2" style={{ marginBottom: '2rem' }}>
        <div className="card stat-card">
          <div className="stat-icon" style={{ background: '#ecfdf5', color: '#10b981' }}>
            <TrendingUp size={28} />
          </div>
          <div className="stat-details">
            <h4>Overall Resolution Rate</h4>
            <div className="stat-number">{analytics.resolution_rate}%</div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Percentage of submitted queries fully resolved
            </p>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon" style={{ background: '#eff6ff', color: '#2563eb' }}>
            <Cpu size={28} />
          </div>
          <div className="stat-details">
            <h4>Mean NLP Confidence Score</h4>
            <div className="stat-number">{Math.round((analytics.avg_confidence_score || 0) * 100)}%</div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Average Naive Bayes / baseline confidence across all languages
            </p>
          </div>
        </div>
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid-cols-2" style={{ marginBottom: '2rem' }}>
        {/* Intent Distribution */}
        <div className="card">
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BarChart3 size={18} color="var(--primary)" />
            Top Query Categories & Intents
          </h3>
          <div style={{ maxHeight: '280px', display: 'flex', justifyContent: 'center' }}>
            <Bar
              data={{
                labels: intentLabels,
                datasets: [
                  {
                    label: 'Count',
                    data: intentValues,
                    backgroundColor: '#3b82f6',
                    borderRadius: 6
                  }
                ]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
              }}
            />
          </div>
        </div>

        {/* Regional Language Breakdown */}
        <div className="card">
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Globe size={18} color="var(--primary)" />
            Regional Language Adoption
          </h3>
          <div style={{ maxHeight: '280px', display: 'flex', justifyContent: 'center' }}>
            <Doughnut
              data={{
                labels: langLabels,
                datasets: [
                  {
                    data: langValues,
                    backgroundColor: ['#2563eb', '#16a34a', '#ea580c', '#9333ea', '#0891b2', '#e11d48']
                  }
                ]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'right' } }
              }}
            />
          </div>
        </div>
      </div>

      {/* Detailed Tables */}
      <div className="card">
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1rem' }}>
          Departmental Workload & Distribution
        </h3>
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Department Name</th>
                <th>Total Assigned Queries</th>
                <th>Routing Share</th>
              </tr>
            </thead>
            <tbody>
              {analytics.department_stats?.map((dept) => {
                const totalQueries = analytics.department_stats.reduce((acc, curr) => acc + curr.count, 0);
                const pct = totalQueries > 0 ? Math.round((dept.count / totalQueries) * 100) : 0;
                return (
                  <tr key={dept.name}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                        <Building size={16} color="var(--primary)" />
                        {dept.name}
                      </div>
                    </td>
                    <td><strong>{dept.count}</strong></td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ flex: 1, height: '8px', background: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden', maxWidth: '160px' }}>
                          <div style={{ width: `${pct}%`, height: '100%', background: 'var(--accent)' }} />
                        </div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{pct}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
