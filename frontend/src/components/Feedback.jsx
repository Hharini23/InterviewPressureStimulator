import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, CheckCircle2, AlertCircle, BarChart3, TrendingUp, RotateCcw, LayoutDashboard, Zap, Target } from 'lucide-react';

const Feedback = ({ results }) => {
  const navigate = useNavigate();

  if (!results || !results.feedback) {
    return (
      <div className="feedback-page" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ width: '40px', height: '40px', borderWidth: '3px', margin: '0 auto 16px' }} />
          <p style={{ color: 'rgba(255,255,255,0.3)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '12px' }}>Processing Results...</p>
        </div>
      </div>
    );
  }

  const { scores, behavioralInsights, improvementSuggestions, stressHandlingScore } = results.feedback;

  const scoreItems = [
    { label: 'Accuracy', value: scores.accuracy, color: '#818cf8', bg: 'rgba(129,140,248,0.1)' },
    { label: 'Clarity', value: scores.clarity, color: '#60a5fa', bg: 'rgba(96,165,250,0.1)' },
    { label: 'Confidence', value: scores.confidence, color: '#34d399', bg: 'rgba(52,211,153,0.1)' },
    { label: 'Speed', value: scores.speed, color: '#fbbf24', bg: 'rgba(251,191,36,0.1)' },
  ];

  const overallColor = scores.overall >= 80 ? '#34d399' : scores.overall >= 60 ? '#fbbf24' : '#f87171';
  const dashOffset = 427 - (427 * scores.overall / 100);

  return (
    <div className="feedback-page">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: '#4f46e5', padding: '8px', borderRadius: '12px' }}>
            <Brain size={24} color="white" />
          </div>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: '800', color: 'white', letterSpacing: '-0.5px' }}>
              Interview Analysis
            </h1>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', fontWeight: '500' }}>
              {results.role} · {results.difficulty} Mode
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              padding: '10px 20px', background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px',
              color: 'rgba(255,255,255,0.7)', fontSize: '13px', fontWeight: '600',
              fontFamily: 'Inter, sans-serif', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '8px'
            }}
          >
            <LayoutDashboard size={16} /> Dashboard
          </button>
          <button
            onClick={() => navigate('/setup')}
            style={{
              padding: '10px 20px',
              background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
              border: 'none', borderRadius: '10px',
              color: 'white', fontSize: '13px', fontWeight: '700',
              fontFamily: 'Inter, sans-serif', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '8px',
              boxShadow: '0 4px 15px rgba(99,102,241,0.25)'
            }}
          >
            <RotateCcw size={16} /> Try Again
          </button>
        </div>
      </div>

      {/* Top Row: Overall Score + Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '20px' }}>
        {/* Score Ring */}
        <div style={{ background: '#141528', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '18px', padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <svg width="180" height="180" viewBox="0 0 180 180">
            <circle cx="90" cy="90" r="78" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="14" />
            <circle
              cx="90" cy="90" r="78"
              fill="none" stroke={overallColor} strokeWidth="14"
              strokeDasharray="490" strokeDashoffset={490 - (490 * scores.overall / 100)}
              strokeLinecap="round"
              transform="rotate(-90 90 90)"
              style={{ transition: 'stroke-dashoffset 1s ease' }}
            />
            <text x="90" y="82" textAnchor="middle" fill="white" fontSize="36" fontWeight="800" fontFamily="Inter">{scores.overall}%</text>
            <text x="90" y="104" textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="12" fontFamily="Inter" fontWeight="600">Overall Score</text>
          </svg>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '12px', fontWeight: '700', color: overallColor, background: `${overallColor}15`, padding: '4px 14px', borderRadius: '20px', border: `1px solid ${overallColor}30` }}>
              {scores.overall >= 80 ? '🏆 Excellent' : scores.overall >= 60 ? '📈 Good' : '⚡ Needs Work'}
            </div>
          </div>
        </div>

        {/* Score Breakdown Grid */}
        <div style={{ background: '#141528', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '18px', padding: '28px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'white', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart3 size={16} color="#818cf8" /> Score Breakdown
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '20px' }}>
            {scoreItems.map((item, i) => (
              <div key={i} style={{ background: item.bg, border: `1px solid ${item.color}20`, borderRadius: '14px', padding: '18px' }}>
                <div style={{ fontSize: '11px', fontWeight: '700', color: item.color, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }}>{item.label}</div>
                <div style={{ fontSize: '30px', fontWeight: '800', color: 'white', letterSpacing: '-1px' }}>{item.value}%</div>
                <div style={{ marginTop: '8px', height: '3px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${item.value}%`, background: item.color, borderRadius: '3px' }} />
                </div>
              </div>
            ))}
          </div>

          {/* Stress Score */}
          <div style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)', borderRadius: '14px', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: '700', color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '4px' }}>Stress Handling Score</div>
              <div style={{ fontSize: '24px', fontWeight: '800', color: 'white' }}>{stressHandlingScore}% Resilience</div>
            </div>
            <Zap size={36} color="#fbbf24" fill="rgba(251,191,36,0.2)" />
          </div>
        </div>
      </div>

      {/* Bottom Row: Insights + Suggestions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Behavioral Insights */}
        <div style={{ background: '#141528', border: '1px solid rgba(255,255,255,0.06)', borderLeft: '4px solid #60a5fa', borderRadius: '18px', padding: '28px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'white', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={16} color="#60a5fa" /> Behavioral Insights
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {(behavioralInsights || []).map((insight, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px', padding: '14px', background: 'rgba(96,165,250,0.05)', borderRadius: '12px', border: '1px solid rgba(96,165,250,0.1)' }}>
                <CheckCircle2 size={18} color="#34d399" style={{ flexShrink: 0, marginTop: '1px' }} />
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', lineHeight: '1.5', margin: 0 }}>{insight}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Improvement Suggestions */}
        <div style={{ background: '#141528', border: '1px solid rgba(255,255,255,0.06)', borderLeft: '4px solid #818cf8', borderRadius: '18px', padding: '28px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'white', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Target size={16} color="#818cf8" /> Path to Improvement
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {(improvementSuggestions || []).map((tip, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px', padding: '14px', background: 'rgba(129,140,248,0.05)', borderRadius: '12px', border: '1px solid rgba(129,140,248,0.1)' }}>
                <div style={{ width: '22px', height: '22px', background: '#4f46e5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '700', flexShrink: 0 }}>{i + 1}</div>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', lineHeight: '1.5', margin: 0 }}>{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
