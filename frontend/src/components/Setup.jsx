import React, { useState } from 'react';
import { Play, ShieldCheck, Zap, AlertCircle } from 'lucide-react';
import axios from 'axios';

const Setup = ({ onStart }) => {
  const [role, setRole] = useState('Frontend');
  const [difficulty, setDifficulty] = useState('Hard');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const roles = ['Frontend', 'Backend', 'HR', 'Product'];
  const difficulties = ['Normal', 'Hard', 'Brutal'];

  const handleStart = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/interview/start`,
        { role, difficulty },
        { timeout: 30000 } // 30s timeout for AI generation
      );
      
      if (!response.data || !response.data.questions || response.data.questions.length === 0) {
        throw new Error('No questions returned from server');
      }
      
      onStart(response.data);
    } catch (err) {
      console.error('Start Interview Error:', err);
      if (err.code === 'ECONNREFUSED' || err.message.includes('Network')) {
        setError('Cannot connect to server. Please check if the backend is running.');
      } else if (err.response?.data?.error) {
        setError(`Server error: ${err.response.data.error}`);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to start interview. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Role Selection */}
      <div>
        <div style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ShieldCheck size={12} color="#818cf8" /> Target Role
        </div>
        <div className="role-grid">
          {roles.map(r => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`select-btn ${role === r ? 'selected' : ''}`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Difficulty Selection */}
      <div>
        <div style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Zap size={12} color="#fbbf24" /> Stress Intensity
        </div>
        <div className="diff-grid">
          {difficulties.map(d => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              className={`select-btn ${difficulty === d ? 'selected' : ''}`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '12px 16px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '10px' }}>
          <AlertCircle size={16} color="#f87171" style={{ flexShrink: 0, marginTop: '1px' }} />
          <p style={{ fontSize: '13px', color: '#f87171', margin: 0, lineHeight: 1.4 }}>{error}</p>
        </div>
      )}

      {/* Launch Button */}
      <button
        onClick={handleStart}
        disabled={loading}
        className="btn-start"
        style={{ opacity: loading ? 0.75 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
      >
        {loading ? (
          <><div className="spinner" /> Generating questions with AI...</>
        ) : (
          <><Play size={18} fill="white" /> Start Interview</>
        )}
      </button>

      <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)', textAlign: 'center' }}>
        AI generates 5 adaptive questions · Takes ~5 seconds
      </p>
    </div>
  );
};

export default Setup;
