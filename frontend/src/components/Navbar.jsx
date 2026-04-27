import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, ShieldAlert, LogOut, User as UserIcon } from 'lucide-react';

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <header className="w-full max-w-7xl flex justify-between items-center mb-12 px-4 md:px-8">
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
        <div className="bg-accent-primary/20 p-2 rounded-lg">
          <Brain className="text-secondary" size={32} />
        </div>
        <h1 className="text-2xl font-black title-gradient tracking-tighter">
          STRESS.AI
        </h1>
      </div>
      
      {user && (
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-2 bg-red-900/20 px-4 py-2 rounded-full border border-red-500/30">
            <ShieldAlert className="text-accent-error" size={18} />
            <span className="text-[10px] text-red-400 font-black tracking-widest uppercase">Panic Detection Active</span>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                <UserIcon size={16} className="text-accent-secondary" />
                <span className="text-sm font-bold">{user}</span>
             </div>
             <button 
                onClick={handleLogoutClick} 
                className="text-muted hover:text-accent-error transition-colors p-2 hover:bg-white/5 rounded-lg"
                title="Logout"
             >
                <LogOut size={20} />
             </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
