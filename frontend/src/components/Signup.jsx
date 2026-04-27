import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Brain, Mail, Lock, User, UserPlus } from 'lucide-react';

const Signup = ({ onSignup }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      onSignup(name || email.split('@')[0]);
    }
  };

  return (
    <div className="page">
      {/* Navbar */}
      <header className="navbar">
        <div className="navbar-brand">
          <Brain size={28} color="#818cf8" />
          SmartQA
        </div>
        <div className="navbar-avatar">
          <div className="avatar-circle">H</div>
          <span>Hi, Harini</span>
        </div>
      </header>

      {/* Centered Form */}
      <main className="auth-page">
        <div className="auth-card">
          <h1 className="auth-title" style={{ color: '#34d399' }}>Create Account</h1>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div className="input-wrapper">
                <span className="input-icon"><User size={16} /></span>
                <input
                  type="text"
                  className="form-input"
                  placeholder="John Doe"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-wrapper">
                <span className="input-icon"><Mail size={16} /></span>
                <input
                  type="email"
                  className="form-input"
                  placeholder="john@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-wrapper">
                <span className="input-icon"><Lock size={16} /></span>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Create a password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-auth"
              style={{ background: 'linear-gradient(135deg, #059669, #10b981)' }}
            >
              <UserPlus size={18} /> Create Account
            </button>
          </form>

          <p className="auth-footer">
            Already have an account? <Link to="/login" style={{ color: '#34d399' }}>Sign in here</Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Signup;
