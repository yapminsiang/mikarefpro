
import React from 'react';
import { Play, ShieldCheck, Trophy, Zap } from 'lucide-react';

interface Props {
  onLaunch: () => void;
}

const LandingPage: React.FC<Props> = ({ onLaunch }) => {
  return (
    <div className="fixed inset-0 z-[100] bg-[#0f172a] flex flex-col items-center justify-center p-6 text-center overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full"></div>
      
      {/* Animated Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>

      <div className="relative z-10 flex flex-col items-center max-w-2xl">
        {/* Abstract Icon */}
        <div className="mb-8 p-5 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-3xl shadow-[0_0_50px_rgba(16,185,129,0.3)]">
          <Zap size={48} className="text-white fill-white" />
        </div>

        <div className="space-y-2 mb-12">
          <p className="text-emerald-400 font-bold tracking-[0.3em] uppercase text-sm">
            Welcome to the
          </p>
          <h1 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter leading-tight">
            Pickleball Referee <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">Pro</span>
          </h1>
          <p className="pt-4 text-slate-500 font-medium tracking-widest text-xs uppercase">
            Created by <span className="text-slate-300 font-bold">Mika</span>
          </p>
        </div>

        {/* Features Row */}
        <div className="grid grid-cols-3 gap-8 mb-16 opacity-60 scale-90 md:scale-100">
          <div className="flex flex-col items-center gap-2">
            <ShieldCheck className="text-emerald-500" size={24} />
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">Rally Point</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Trophy className="text-emerald-500" size={24} />
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">Match Reports</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Zap className="text-emerald-500" size={24} />
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">Fast Undo</span>
          </div>
        </div>

        <button 
          onClick={onLaunch}
          className="group relative flex items-center gap-4 bg-white text-slate-950 px-10 py-5 rounded-2xl font-black text-xl uppercase tracking-widest transition-all hover:scale-105 active:scale-95 hover:shadow-[0_0_40px_rgba(255,255,255,0.2)]"
        >
          Launch Console
          <Play size={24} className="fill-slate-950" />
        </button>

        <p className="mt-12 text-slate-600 text-[10px] font-bold uppercase tracking-[0.2em]">
          Optimized for Mobile & Tablet Referees
        </p>
      </div>
    </div>
  );
};

export default LandingPage;
