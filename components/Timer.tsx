
import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RefreshCw, Clock } from 'lucide-react';

const Timer: React.FC = () => {
  const [seconds, setSeconds] = useState(60);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds(s => s - 1);
      }, 1000);
    } else if (seconds === 0) {
      setIsActive(false);
      // Optional: Play a sound
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const toggle = () => setIsActive(!isActive);
  const reset = (val: number = 60) => {
    setIsActive(false);
    setSeconds(val);
  };

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-slate-900 border border-slate-700 p-4 rounded-2xl">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-slate-400">
          <Clock size={16} />
          <span className="text-xs font-bold uppercase tracking-wider">Timeout</span>
        </div>
        <div className={`text-2xl font-black font-mono ${seconds < 10 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
          {formatTime(seconds)}
        </div>
      </div>

      <div className="flex gap-2">
        <button 
          onClick={toggle}
          className={`flex-1 py-2 rounded-lg font-bold flex items-center justify-center gap-1 transition-colors ${
            isActive ? 'bg-amber-600 text-white' : 'bg-emerald-600 text-white'
          }`}
        >
          {isActive ? <Pause size={16}/> : <Play size={16}/>}
          {isActive ? 'Pause' : 'Start'}
        </button>
        <button 
          onClick={() => reset(60)}
          className="px-3 bg-slate-700 rounded-lg hover:bg-slate-600"
        >
          60s
        </button>
        <button 
          onClick={() => reset(30)}
          className="px-3 bg-slate-700 rounded-lg hover:bg-slate-600"
        >
          30s
        </button>
        <button 
          onClick={() => reset(60)}
          className="p-2 bg-slate-800 rounded-lg"
        >
          <RefreshCw size={16} />
        </button>
      </div>
    </div>
  );
};

export default Timer;
