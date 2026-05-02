import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Mic, MicOff, ChevronRight, AlertCircle, Activity, Brain, Timer } from 'lucide-react';
import axios from 'axios';

const InterviewRoom = ({ data, onFinish }) => {
  const navigate = useNavigate();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(data.questions[0]?.timeLimit || 60);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [interruption, setInterruption] = useState(null);

  const timerRef = useRef(null);
  const startTimeRef = useRef(Date.now());
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  const currentQuestion = data.questions[currentIdx];

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { handleNext(); return 0; }
        return prev - 1;
      });
    }, 1000);

    const interTime = Math.random() * 15000 + 10000;
    const interTimeout = setTimeout(() => {
      const msgs = [
        "We're running short on time, can you summarize?",
        "How exactly would you implement that?",
        "What if the budget was cut by 50%?",
        "Why choose that over alternatives?"
      ];
      const msg = msgs[Math.floor(Math.random() * msgs.length)];
      setInterruption(msg);
      speak(msg);
      setTimeout(() => setInterruption(null), 4000);
    }, interTime);

    return () => { clearInterval(timerRef.current); clearTimeout(interTimeout); };
  }, [currentIdx]);

  const handleNext = async () => {
    clearInterval(timerRef.current);
    const duration = Math.floor((Date.now() - startTimeRef.current) / 1000);
    const newResponse = { questionIndex: currentIdx, answer: transcript || 'No response recorded', duration };
    const updatedResponses = [...responses, newResponse];
    setResponses(updatedResponses);

    try {
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/interview/answer`, { interviewId: data._id, ...newResponse });
    } catch (e) { console.error('Sync failed'); }

    if (currentIdx < data.questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
      const baseTime = data.questions[currentIdx + 1]?.timeLimit || 60;
      setTimeLeft(duration < 20 ? Math.max(15, baseTime - 10) : baseTime);
      startTimeRef.current = Date.now();
      resetTranscript();
    } else {
      finalizeSession(updatedResponses);
    }
  };

  const finalizeSession = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/interview/feedback/${data._id}`);
      onFinish(response.data);
      navigate('/feedback');
    } catch (error) {
      alert('Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="interview-page" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: '#141528', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '48px', textAlign: 'center', maxWidth: '420px' }}>
          <AlertCircle size={48} color="#f87171" style={{ marginBottom: '16px' }} />
          <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>Browser Not Supported</h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>Please use Chrome or Edge for speech recognition.</p>
        </div>
      </div>
    );
  }

  const progress = ((currentIdx) / data.questions.length) * 100;
  const isUrgent = timeLeft <= 10;

  return (
    <div className="interview-page">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: '#4f46e5', padding: '8px', borderRadius: '12px' }}>
            <Brain size={22} color="white" />
          </div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: '700', color: '#818cf8', textTransform: 'uppercase', letterSpacing: '1px' }}>Live Session</div>
            <div style={{ fontSize: '16px', fontWeight: '700' }}>Question {currentIdx + 1} of {data.questions.length}</div>
          </div>
        </div>

        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '10px 20px', borderRadius: '12px', border: '1px solid',
          borderColor: isUrgent ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.08)',
          background: isUrgent ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.03)',
          color: isUrgent ? '#f87171' : 'white',
          animation: isUrgent ? 'pulse 1s infinite' : 'none'
        }}>
          <Timer size={18} />
          <span style={{ fontFamily: 'monospace', fontSize: '22px', fontWeight: '800' }}>{timeLeft}s</span>
        </div>
      </div>

      {/* Progress */}
      <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg, #4f46e5, #a855f7)', borderRadius: '4px', transition: 'width 0.5s ease' }} />
      </div>

      {/* Main area */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', flex: 1 }}>
        {/* Question Panel */}
        <div style={{
          background: '#141528', border: '1px solid',
          borderColor: interruption ? 'rgba(239,68,68,0.5)' : 'rgba(129,140,248,0.2)',
          borderLeft: '4px solid #818cf8',
          borderRadius: '18px', padding: '36px',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          position: 'relative', overflow: 'hidden'
        }}>
          <div style={{ fontSize: '10px', fontWeight: '700', color: '#818cf8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Activity size={12} /> Phase 0{currentIdx + 1} // {currentQuestion?.category || 'Technical'}
          </div>
          <p style={{ fontSize: '24px', fontWeight: '700', lineHeight: '1.4', color: 'white' }}>
            {currentQuestion?.text}
          </p>
          {currentQuestion?.stressFactor && (
            <div style={{ marginTop: '20px', padding: '10px 16px', background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)', borderRadius: '10px', fontSize: '12px', color: '#fbbf24', fontWeight: '600' }}>
              ⚡ Stress Factor: {currentQuestion.stressFactor}
            </div>
          )}

          {interruption && (
            <div style={{
              position: 'absolute', inset: 0,
              background: '#dc2626', display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', padding: '32px', textAlign: 'center',
              borderRadius: '14px'
            }}>
              <AlertCircle size={48} style={{ marginBottom: '16px' }} />
              <p style={{ fontSize: '20px', fontWeight: '800', lineHeight: '1.3' }}>{interruption}</p>
            </div>
          )}
        </div>

        {/* Response Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{
            flex: 1, background: '#141528', border: '1px solid rgba(255,255,255,0.06)',
            borderStyle: 'dashed', borderRadius: '18px', padding: '28px',
            display: 'flex', flexDirection: 'column'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '11px', fontWeight: '700', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '1px' }}>Your Response</span>
              <span style={{
                padding: '4px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: '700',
                background: listening ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.05)',
                color: listening ? '#f87171' : 'rgba(255,255,255,0.3)',
                border: `1px solid ${listening ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.08)'}`,
                animation: listening ? 'pulse 1.5s infinite' : 'none'
              }}>
                {listening ? '● RECORDING' : 'READY'}
              </span>
            </div>
            <p style={{ fontSize: '16px', color: transcript ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.2)', fontStyle: transcript ? 'normal' : 'italic', lineHeight: '1.6', flex: 1 }}>
              {transcript || (listening ? 'Listening... start speaking' : 'Click the mic to start recording your answer')}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={listening ? SpeechRecognition.stopListening : () => SpeechRecognition.startListening({ continuous: true })}
              style={{
                width: '72px', height: '72px', borderRadius: '18px', border: 'none',
                background: listening ? '#dc2626' : 'rgba(255,255,255,0.05)',
                color: listening ? 'white' : 'rgba(255,255,255,0.4)',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: listening ? '0 4px 20px rgba(220,38,38,0.3)' : 'none',
                transition: 'all 0.2s',
                flexShrink: 0
              }}
            >
              {listening ? <MicOff size={28} /> : <Mic size={28} />}
            </button>

            <button
              onClick={handleNext}
              disabled={loading}
              style={{
                flex: 1, height: '72px', border: 'none', borderRadius: '18px',
                background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                color: 'white', fontSize: '15px', fontWeight: '700', fontFamily: 'inherit',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                boxShadow: '0 4px 20px rgba(99,102,241,0.3)',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? (
                <><div className="spinner" /> Generating Report...</>
              ) : (
                <>{currentIdx === data.questions.length - 1 ? 'Finish & Analyze' : 'Next Question'} <ChevronRight size={22} /></>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* HUD Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: '600', color: 'rgba(255,255,255,0.2)', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <span>Role: {data.role}</span>
        <span>Difficulty: {data.difficulty}</span>
        <span>AI: Gemini 1.5 Flash</span>
      </div>

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
    </div>
  );
};

export default InterviewRoom;
