import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import InterviewRoom from './components/InterviewRoom';
import Feedback from './components/Feedback';
import Login from './components/Login';
import Signup from './components/Signup';

function App() {
  const [user, setUser] = useState(null);
  const [interviewData, setInterviewData] = useState(null);
  const [sessionResults, setSessionResults] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('smartqa_user');
    if (savedUser) setUser(savedUser);
  }, []);

  const handleAuth = (username) => {
    setUser(username);
    localStorage.setItem('smartqa_user', username);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('smartqa_user');
    setInterviewData(null);
    setSessionResults(null);
  };

  // Save completed interview to history in localStorage
  const handleFinish = (results) => {
    if (!results?.feedback?.scores) return;

    const historyKey = `smartqa_history_${user}`;
    const existing = JSON.parse(localStorage.getItem(historyKey) || '[]');
    const entry = {
      id: results._id || Date.now(),
      role: results.role || 'Interview',
      difficulty: results.difficulty || 'Normal',
      date: new Date().toISOString(),
      scores: results.feedback.scores,
      stressHandlingScore: results.feedback.stressHandlingScore
    };
    const updated = [entry, ...existing].slice(0, 20); // keep last 20
    localStorage.setItem(historyKey, JSON.stringify(updated));
    setSessionResults(results);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to={user ? '/dashboard' : '/login'} />} />

        <Route path="/login" element={
          user ? <Navigate to="/dashboard" /> : <Login onLogin={handleAuth} />
        } />

        <Route path="/signup" element={
          user ? <Navigate to="/dashboard" /> : <Signup onSignup={handleAuth} />
        } />

        <Route path="/dashboard" element={
          user
            ? <Dashboard user={user} onLogout={handleLogout} onStartInterview={setInterviewData} />
            : <Navigate to="/login" />
        } />

        <Route path="/interview" element={
          user && interviewData
            ? <InterviewRoom data={interviewData} onFinish={handleFinish} />
            : <Navigate to="/dashboard" />
        } />

        <Route path="/feedback" element={
          user && sessionResults
            ? <Feedback results={sessionResults} />
            : <Navigate to="/dashboard" />
        } />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
