import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    LayoutDashboard, 
    ClipboardList, 
    LogOut,
    ArrowLeft,
    MonitorPlay,
    Zap,
    ShieldAlert
} from 'lucide-react';
import Setup from './Setup';

const InterviewSetupPage = ({ user, onLogout, onStartInterview }) => {
    const navigate = useNavigate();

    const menuItems = [
        { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard' },
        { icon: <MonitorPlay size={20} />, label: 'Simulation', active: true },
    ];

    const handleStart = (data) => {
        onStartInterview(data);
        navigate('/interview');
    };

    return (
        <div className="flex h-screen bg-[#050810] text-white">
            {/* Sidebar */}
            <aside className="w-64 bg-[#0a0f1d] border-r border-white/5 flex flex-col p-6">
                <div className="flex items-center gap-3 mb-10 pl-2">
                    <div className="bg-indigo-600 p-2 rounded-xl text-white font-bold">SQ</div>
                    <span className="font-bold text-xl">SmartQA</span>
                </div>

                <div className="flex-grow">
                    <nav className="flex flex-col gap-2">
                        {menuItems.map((item, i) => (
                            <button 
                                key={i} 
                                onClick={() => navigate(item.path)}
                                className={`flex items-center gap-3 p-3 rounded-xl transition-all ${item.active ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:bg-white/5 hover:text-white'}`}
                            >
                                {item.icon}
                                <span className="font-semibold">{item.label}</span>
                            </button>
                        ))}
                        <button onClick={onLogout} className="flex items-center gap-3 p-3 rounded-xl text-gray-500 hover:bg-red-500/10 hover:text-red-500 transition-all">
                            <LogOut size={20} />
                            <span className="font-semibold">Logout</span>
                        </button>
                    </nav>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-grow flex flex-col overflow-hidden">
                <header className="h-20 border-b border-white/5 flex items-center px-10">
                    <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-gray-500 hover:text-white transition-all font-bold">
                        <ArrowLeft size={18} /> BACK TO DASHBOARD
                    </button>
                </header>

                <div className="flex-grow overflow-y-auto p-12">
                    <div className="max-w-4xl mx-auto space-y-12">
                        <div className="relative group p-10 bg-gradient-to-br from-indigo-900/40 to-transparent rounded-[40px] border border-white/5 overflow-hidden">
                            <div className="relative z-10">
                                <div className="inline-flex items-center gap-2 bg-indigo-500/10 text-indigo-400 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-indigo-500/20">
                                    <Zap size={14} fill="currentColor" /> Combat Ready
                                </div>
                                <h1 className="text-5xl font-black mb-4 tracking-tight">Interview Configuration</h1>
                                <p className="text-gray-400 text-lg font-medium leading-relaxed max-w-2xl">
                                    Prepare for a high-intensity session. The simulation will adapt questioning complexity based on the difficulty and role selected.
                                </p>
                            </div>
                            
                            <div className="absolute top-10 right-10 flex items-center gap-2 bg-red-900/20 px-4 py-2 rounded-full border border-red-500/30">
                                <ShieldAlert size={18} className="text-red-500" />
                                <span className="text-[10px] font-black text-red-400 uppercase tracking-widest">Pressure Mode Active</span>
                            </div>
                        </div>

                        <div className="bg-[#111827] p-12 rounded-[40px] border border-white/5 shadow-2xl">
                             <Setup onStart={handleStart} />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default InterviewSetupPage;
