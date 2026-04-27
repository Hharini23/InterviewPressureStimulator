import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Brain, LayoutDashboard, ClipboardList, Calendar,
  BarChart3, Settings, HelpCircle, LogOut,
  Search, Bell, Target, TrendingUp, Clock, Zap, Play, Users
} from 'lucide-react';
import Setup from './Setup';

// Helper: compute stats from history array
const computeStats = (history) => {
  if (!history.length) return { total: 0, avgScore: 0, topScore: 0, hours: '0h' };
  const total = history.length;
  const scores = history.map(h => h.scores?.overall || 0);
  const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  const topScore = Math.max(...scores);
  // Rough estimate: ~15 min per interview
  const totalMins = total * 15;
  const hours = totalMins >= 60 ? `${(totalMins / 60).toFixed(1)}h` : `${totalMins}m`;
  return { total, avgScore, topScore, hours };
};

const Dashboard = ({ user, onLogout, onStartInterview }) => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [history, setHistory] = useState([]);

  // Load history from localStorage on mount + re-read on focus
  const loadHistory = () => {
    const raw = localStorage.getItem(`smartqa_history_${user}`);
    setHistory(raw ? JSON.parse(raw) : []);
  };

  useEffect(() => {
    loadHistory();
    window.addEventListener('focus', loadHistory);
    return () => window.removeEventListener('focus', loadHistory);
  }, [user]);

  const { total, avgScore, topScore, hours } = computeStats(history);
  const recentHistory = history.slice(0, 5);

  // Score-based readiness
  const readiness = avgScore > 0 ? Math.min(100, avgScore + 5) : 0;

  const menuItems = [
    { id: 'dashboard', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
    { id: 'tasks',     icon: <ClipboardList size={18} />, label: 'Tasks', badge: total > 0 ? String(total) : null },
    { id: 'calendar',  icon: <Calendar size={18} />, label: 'Calendar' },
    { id: 'analytics', icon: <BarChart3 size={18} />, label: 'Analytics' },
    { id: 'teams',     icon: <Users size={18} />, label: 'Teams' },
  ];
  const generalItems = [
    { id: 'settings', icon: <Settings size={18} />, label: 'Settings' },
    { id: 'help',     icon: <HelpCircle size={18} />, label: 'Help' },
  ];

  const stats = [
    { label: 'Total Sessions',  value: String(total), trend: total > 0 ? `${total} completed` : 'No sessions yet', icon: <Target size={20} />, iconBg: 'rgba(129,140,248,0.15)', iconColor: '#818cf8' },
    { label: 'Avg Score',       value: avgScore > 0 ? `${avgScore}%` : '—',    trend: avgScore > 0 ? (avgScore >= 75 ? 'Great performance' : 'Keep practicing') : 'Complete an interview', icon: <TrendingUp size={20} />, iconBg: 'rgba(52,211,153,0.15)', iconColor: '#34d399' },
    { label: 'Top Score',       value: topScore > 0 ? `${topScore}%` : '—',    trend: topScore > 0 ? 'Personal best' : 'Start to track', icon: <BarChart3 size={20} />, iconBg: 'rgba(251,191,36,0.15)', iconColor: '#fbbf24' },
    { label: 'Time Practiced',  value: hours,  trend: total > 0 ? `${total} sessions` : 'No data yet', icon: <Clock size={20} />, iconBg: 'rgba(167,139,250,0.15)', iconColor: '#a78bfa' },
  ];

  const handleStart = (data) => {
    onStartInterview(data);
    navigate('/interview');
  };

  const firstLetter = user ? user[0].toUpperCase() : 'U';
  const ringOffset = 427 - (427 * readiness / 100);

  const scoreColor = (s) => s >= 80 ? '#34d399' : s >= 60 ? '#fbbf24' : '#f87171';
  const diffBadge = (d) => {
    const map = { Normal: { bg: 'rgba(52,211,153,0.1)', color: '#34d399' }, Hard: { bg: 'rgba(251,191,36,0.1)', color: '#fbbf24' }, Brutal: { bg: 'rgba(239,68,68,0.1)', color: '#f87171' } };
    return map[d] || map.Normal;
  };
  const formatDate = (iso) => new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' });

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', backgroundColor: '#0d0e1c', color: 'white', fontFamily: 'Inter, sans-serif' }}>

      {/* ─── Sidebar ─── */}
      <aside style={{ width: '240px', backgroundColor: '#111224', borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', padding: '24px 16px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px 28px', fontSize: '18px', fontWeight: 700, color: '#818cf8' }}>
          <Brain size={24} color="#818cf8" /> SmartQA
        </div>

        <p style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.2px', color: 'rgba(255,255,255,0.25)', padding: '0 12px 8px' }}>Menu</p>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginBottom: '24px' }}>
          {menuItems.map(item => (
            <button key={item.id} onClick={() => setActiveSection(item.id)} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '10px', fontSize: '14px', fontWeight: 500, border: 'none', cursor: 'pointer', fontFamily: 'inherit', width: '100%', textAlign: 'left', background: activeSection === item.id ? 'rgba(129,140,248,0.12)' : 'transparent', color: activeSection === item.id ? '#818cf8' : 'rgba(255,255,255,0.45)', transition: 'all 0.15s' }}>
              {item.icon}
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge && <span style={{ background: '#34d399', color: '#022c22', fontSize: '10px', fontWeight: 800, padding: '2px 6px', borderRadius: '6px' }}>{item.badge}</span>}
            </button>
          ))}
        </nav>

        <p style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.2px', color: 'rgba(255,255,255,0.25)', padding: '0 12px 8px' }}>General</p>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {generalItems.map(item => (
            <button key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '10px', fontSize: '14px', fontWeight: 500, border: 'none', cursor: 'pointer', fontFamily: 'inherit', width: '100%', background: 'transparent', color: 'rgba(255,255,255,0.45)' }}>
              {item.icon} {item.label}
            </button>
          ))}
          <button onClick={onLogout}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '10px', fontSize: '14px', fontWeight: 500, border: 'none', cursor: 'pointer', fontFamily: 'inherit', width: '100%', background: 'transparent', color: 'rgba(255,255,255,0.45)', transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#f87171'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; }}
          >
            <LogOut size={18} /> Logout
          </button>
        </nav>

        <div style={{ marginTop: 'auto', background: 'linear-gradient(135deg, #312e81, #5b21b6)', borderRadius: '16px', padding: '20px' }}>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.65)', marginBottom: '4px' }}>Upgrade to</p>
          <h4 style={{ fontSize: '15px', fontWeight: 800, color: 'white', marginBottom: '14px' }}>Pro Version</h4>
          <button style={{ background: 'white', color: '#4f46e5', border: 'none', borderRadius: '8px', padding: '8px 18px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Unlock All</button>
        </div>
      </aside>

      {/* ─── Main ─── */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Topbar */}
        <header style={{ height: '64px', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={15} color="rgba(255,255,255,0.25)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input type="text" placeholder="Search sessions..." style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', color: 'rgba(255,255,255,0.8)', fontSize: '13px', fontFamily: 'inherit', padding: '9px 14px 9px 36px', outline: 'none' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button style={{ width: '36px', height: '36px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'rgba(255,255,255,0.45)' }}>
              <Bell size={18} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '100px', padding: '5px 16px 5px 5px' }}>
              <div style={{ width: '30px', height: '30px', background: 'linear-gradient(135deg, #7c3aed, #a855f7)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '12px' }}>{firstLetter}</div>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.75)' }}>{user}</span>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>
          {/* Page header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '28px' }}>
            <div>
              <h1 style={{ fontSize: '26px', fontWeight: 800, color: 'white', letterSpacing: '-0.5px', marginBottom: '4px' }}>
                Welcome back, <span style={{ color: '#818cf8' }}>{user}</span> 👋
              </h1>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)' }}>
                {total > 0 ? `You've completed ${total} interview session${total > 1 ? 's' : ''}. Keep it up!` : 'Start your first interview simulation to track your progress.'}
              </p>
            </div>
            <button style={{ padding: '9px 20px', background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', border: 'none', borderRadius: '10px', color: 'white', fontSize: '13px', fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 15px rgba(99,102,241,0.25)' }}>
              <Play size={14} fill="white" /> New Session
            </button>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
            {stats.map((stat, i) => (
              <div key={i} style={{ background: '#141528', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '20px 24px', transition: 'border-color 0.2s, transform 0.2s, cursor 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(129,140,248,0.3)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: stat.iconBg, color: stat.iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>{stat.icon}</div>
                <div style={{ fontSize: '28px', fontWeight: 800, color: 'white', letterSpacing: '-1px', lineHeight: 1, marginBottom: '4px' }}>{stat.value}</div>
                <div style={{ fontSize: '12px', fontWeight: 500, color: 'rgba(255,255,255,0.4)', marginBottom: '6px' }}>{stat.label}</div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.22)' }}>{stat.trend}</div>
              </div>
            ))}
          </div>

          {/* Bottom 2 cols */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '20px' }}>
            {/* Setup card */}
            <div style={{ background: '#141528', border: '1px solid rgba(255,255,255,0.06)', borderLeft: '4px solid #818cf8', borderRadius: '18px', padding: '28px' }}>
              <div style={{ fontSize: '15px', fontWeight: 700, color: 'white', marginBottom: '22px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Play size={16} color="#818cf8" /> Start Interview Simulation
              </div>
              <Setup onStart={handleStart} />
            </div>

            {/* Readiness ring */}
            <div style={{ background: '#141528', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '18px', padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ fontSize: '15px', fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Zap size={16} color="#818cf8" /> Readiness Score
              </div>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <svg width="160" height="160" viewBox="0 0 160 160">
                  <circle cx="80" cy="80" r="68" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="14" />
                  <circle cx="80" cy="80" r="68" fill="none" stroke="url(#rg)" strokeWidth="14" strokeDasharray="427" strokeDashoffset={ringOffset} strokeLinecap="round" transform="rotate(-90 80 80)" style={{ transition: 'stroke-dashoffset 1s ease' }} />
                  <defs>
                    <linearGradient id="rg" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#4f46e5" /><stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                  </defs>
                  <text x="80" y="74" textAnchor="middle" fill="white" fontSize="26" fontWeight="800" fontFamily="Inter">{readiness > 0 ? `${readiness}%` : '—'}</text>
                  <text x="80" y="94" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="11" fontFamily="Inter">{readiness > 0 ? 'Overall' : 'No data'}</text>
                </svg>
              </div>
              {total === 0 && (
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)', textAlign: 'center', lineHeight: 1.5 }}>Complete an interview to see your readiness score</p>
              )}
            </div>
          </div>

          {/* Recent History Table */}
          <div style={{ background: '#141528', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '18px', overflow: 'hidden' }}>
            <div style={{ padding: '20px 28px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '15px', fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BarChart3 size={16} color="#818cf8" /> Recent Interview Sessions
              </span>
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', fontWeight: 500 }}>{total} total</span>
            </div>

            {recentHistory.length === 0 ? (
              <div style={{ padding: '48px', textAlign: 'center' }}>
                <Play size={36} color="rgba(255,255,255,0.1)" style={{ margin: '0 auto 16px', display: 'block' }} />
                <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '14px', fontWeight: 500 }}>No sessions yet. Start an interview above!</p>
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    {['Role', 'Date', 'Difficulty', 'Accuracy', 'Clarity', 'Confidence', 'Overall'].map(h => (
                      <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentHistory.map((session, i) => {
                    const bd = diffBadge(session.difficulty);
                    const sc = session.scores;
                    return (
                      <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <td style={{ padding: '16px 20px', fontSize: '13px', fontWeight: 600, color: 'white' }}>{session.role}</td>
                        <td style={{ padding: '16px 20px', fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>{formatDate(session.date)}</td>
                        <td style={{ padding: '16px 20px' }}>
                          <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, background: bd.bg, color: bd.color }}>{session.difficulty}</span>
                        </td>
                        <td style={{ padding: '16px 20px', fontSize: '13px', fontWeight: 700, color: scoreColor(sc.accuracy) }}>{sc.accuracy}%</td>
                        <td style={{ padding: '16px 20px', fontSize: '13px', fontWeight: 700, color: scoreColor(sc.clarity) }}>{sc.clarity}%</td>
                        <td style={{ padding: '16px 20px', fontSize: '13px', fontWeight: 700, color: scoreColor(sc.confidence) }}>{sc.confidence}%</td>
                        <td style={{ padding: '16px 20px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                              <div style={{ height: '100%', width: `${sc.overall}%`, background: scoreColor(sc.overall), borderRadius: '4px' }} />
                            </div>
                            <span style={{ fontSize: '13px', fontWeight: 800, color: scoreColor(sc.overall), minWidth: '36px', textAlign: 'right' }}>{sc.overall}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
