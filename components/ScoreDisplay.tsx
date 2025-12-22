
import React from 'react';
import { Team, TeamType } from '../types.ts';

interface Props {
  teamA: Team;
  teamB: Team;
  servingTeam: TeamType;
  onAddPoint: (team: TeamType) => void;
  bestOf: number;
}

const ScoreDisplay: React.FC<Props> = ({ teamA, teamB, servingTeam, onAddPoint, bestOf }) => {
  const showGames = bestOf > 1;

  return (
    <div className="w-full flex flex-col gap-3">
      {/* Team A Display */}
      <button 
        onClick={() => onAddPoint(TeamType.A)}
        className={`group relative w-full p-4 rounded-2xl flex items-center justify-between transition-all active:scale-[0.98] ${
          servingTeam === TeamType.A 
            ? 'bg-emerald-600/20 border-2 border-emerald-500' 
            : 'bg-slate-800/50 border-2 border-slate-700'
        }`}
      >
        <div className="flex flex-col items-start">
          <span className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${servingTeam === TeamType.A ? 'text-emerald-400' : 'text-slate-500'}`}>
            {servingTeam === TeamType.A ? '● SERVING' : 'RECEIVING'}
          </span>
          <span className="text-sm font-bold truncate max-w-[100px]">{teamA.name}</span>
          {showGames && (
            <div className="flex gap-1 mt-1">
              {Array.from({ length: Math.ceil(bestOf / 2) }).map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full ${i < teamA.gamesWon ? 'bg-emerald-400' : 'bg-slate-700'}`}></div>
              ))}
            </div>
          )}
        </div>
        <div className="text-5xl font-black font-mono tracking-tighter text-white">
          {teamA.score}
        </div>
      </button>

      {/* Team B Display */}
      <button 
        onClick={() => onAddPoint(TeamType.B)}
        className={`group relative w-full p-4 rounded-2xl flex items-center justify-between transition-all active:scale-[0.98] ${
          servingTeam === TeamType.B 
            ? 'bg-red-600/20 border-2 border-red-500' 
            : 'bg-slate-800/50 border-2 border-slate-700'
        }`}
      >
        <div className="flex flex-col items-start">
          <span className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${servingTeam === TeamType.B ? 'text-red-400' : 'text-slate-500'}`}>
            {servingTeam === TeamType.B ? '● SERVING' : 'RECEIVING'}
          </span>
          <span className="text-sm font-bold truncate max-w-[100px]">{teamB.name}</span>
          {showGames && (
            <div className="flex gap-1 mt-1">
              {Array.from({ length: Math.ceil(bestOf / 2) }).map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full ${i < teamB.gamesWon ? 'bg-red-400' : 'bg-slate-700'}`}></div>
              ))}
            </div>
          )}
        </div>
        <div className="text-5xl font-black font-mono tracking-tighter text-white">
          {teamB.score}
        </div>
      </button>
    </div>
  );
};

export default ScoreDisplay;
