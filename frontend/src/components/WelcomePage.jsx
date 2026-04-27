import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Brain, Zap, ShieldCheck } from 'lucide-react';

const WelcomePage = ({ user }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#050810] text-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/10 blur-[150px] rounded-full"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-600/10 blur-[150px] rounded-full"></div>

      <div className="relative z-10 text-center animate-in fade-in zoom-in duration-1000">
        <div className="flex justify-center mb-8">
            <div className="bg-indigo-600/20 p-6 rounded-[32px] border border-indigo-500/20 shadow-2xl shadow-indigo-500/10">
                <Brain size={64} className="text-indigo-400" />
            </div>
        </div>

        <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter leading-none">
          WELCOME BACK,<br />
          <span className="title-gradient uppercase">{user}</span>
        </h1>

        <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-12 font-medium">
          The simulation environment is primed. Your neural links are steady. 
          Ready to push your cognitive limits today?
        </p>

        <div className="flex flex-col md:flex-row gap-6 justify-center">
            <button 
                onClick={() => navigate('/dashboard')}
                className="bg-white/5 border border-white/10 px-10 py-5 rounded-3xl flex items-center gap-3 text-lg font-bold hover:bg-white/10 transition-all group"
            >
                VIEW ANALYTICS <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
                onClick={() => navigate('/setup')}
                className="btn-primary px-10 py-5 rounded-3xl flex items-center gap-3 text-lg font-bold shadow-[0_20px_50px_rgba(99,102,241,0.3)] hover:scale-105 active:scale-95 transition-all"
            >
                STRESS TEST <Zap size={20} fill="currentColor" />
            </button>
        </div>

        <div className="mt-20 flex justify-center gap-12 text-gray-600 font-bold uppercase tracking-[0.3em] text-[10px]">
            <div className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-indigo-500" /> SECURE LINK
            </div>
            <div className="flex items-center gap-2">
                <Zap size={14} className="text-purple-500" /> LOW LATENCY
            </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
