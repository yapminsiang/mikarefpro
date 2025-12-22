
import React, { useState } from 'react';
import { Team, TeamType, Side, MatchSettings, SavedTeam } from '../types';
import CoinFlip from './CoinFlip';
import DataManagementModal from './DataManagementModal';
import { ChevronDown, Database } from 'lucide-react';

interface Props {
  onClose: () => void;
  onStart: (teamA: Team, teamB: Team, settings: MatchSettings, starter: TeamType) => void;
  savedTeams: SavedTeam[];
  onUpdateSavedTeams: (teams: SavedTeam[]) => void;
}

const SetupModal: React.FC<Props> = ({ onClose, onStart, savedTeams, onUpdateSavedTeams }) => {
  const [teamA, setTeamA] = useState({ name: 'Team A', p1: 'P1', p2: 'P2' });
  const [teamB, setTeamB] = useState({ name: 'Team B', p1: 'P3', p2: 'P4' });
  const [starter, setStarter] = useState<TeamType>(TeamType.A);
  const [showDataMgmt, setShowDataMgmt] = useState(false);
  
  const [winAt, setWinAt] = useState(21);
  const [winByTwo, setWinByTwo] = useState(true);
  const [bestOf, setBestOf] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const settings: MatchSettings = { winAt, winByTwo, bestOf };
    const tA: Team = {
      name: teamA.name,
      players: [
        { id: 'a1', name: teamA.p1, initialSide: Side.RIGHT },
        { id: 'a2', name: teamA.p2, initialSide: Side.LEFT },
      ],
      score: 0,
      gamesWon: 0
    };
    const tB: Team = {
      name: teamB.name,
      players: [
        { id: 'b1', name: teamB.p1, initialSide: Side.RIGHT },
        { id: 'b2', name: teamB.p2, initialSide: Side.LEFT },
      ],
      score: 0,
      gamesWon: 0
    };
    onStart(tA, tB, settings, starter);
  };

  const handleSelectTeam = (side: 'A' | 'B', teamId: string) => {
    if (!teamId) return;
    const selected = savedTeams.find(t => t.id === teamId);
    if (selected) {
      if (side === 'A') {
        setTeamA({ name: selected.name, p1: selected.p1, p2: selected.p2 });
      } else {
        setTeamB({ name: selected.name, p1: selected.p1, p2: selected.p2 });
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-3xl p-6 lg:p-10 shadow-2xl my-auto relative">
        <div className="absolute top-6 right-6">
           <button 
             type="button"
             onClick={() => setShowDataMgmt(true)}
             className="flex items-center gap-2 px-3 py-1.5 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all"
           >
             <Database size={12} /> Manage Presets
           </button>
        </div>

        <h2 className="text-3xl font-black mb-6 text-center text-emerald-400">Match Settings</h2>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Team A */}
            <div className="space-y-3 bg-slate-800/30 p-4 rounded-2xl border border-slate-700">
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Team A</label>
                {savedTeams.length > 0 && (
                  <div className="relative group">
                    <select 
                      onChange={(e) => handleSelectTeam('A', e.target.value)}
                      className="bg-slate-800 text-[10px] border border-slate-700 rounded px-2 py-1 outline-none appearance-none pr-6 font-bold text-slate-400 hover:text-white transition-colors"
                      value=""
                    >
                      <option value="" disabled>Load Preset...</option>
                      {savedTeams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                    <ChevronDown size={10} className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500" />
                  </div>
                )}
              </div>
              <input value={teamA.name} onChange={e => setTeamA({...teamA, name: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white" placeholder="Team Name"/>
              <input value={teamA.p1} onChange={e => setTeamA({...teamA, p1: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm" placeholder="Player 1 (Right)"/>
              <input value={teamA.p2} onChange={e => setTeamA({...teamA, p2: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm" placeholder="Player 2 (Left)"/>
            </div>

            {/* Team B */}
            <div className="space-y-3 bg-slate-800/30 p-4 rounded-2xl border border-slate-700">
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-red-400 uppercase tracking-widest">Team B</label>
                {savedTeams.length > 0 && (
                  <div className="relative group">
                    <select 
                      onChange={(e) => handleSelectTeam('B', e.target.value)}
                      className="bg-slate-800 text-[10px] border border-slate-700 rounded px-2 py-1 outline-none appearance-none pr-6 font-bold text-slate-400 hover:text-white transition-colors"
                      value=""
                    >
                      <option value="" disabled>Load Preset...</option>
                      {savedTeams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                    <ChevronDown size={10} className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500" />
                  </div>
                )}
              </div>
              <input value={teamB.name} onChange={e => setTeamB({...teamB, name: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white" placeholder="Team Name"/>
              <input value={teamB.p1} onChange={e => setTeamB({...teamB, p1: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm" placeholder="Player 1 (Right)"/>
              <input value={teamB.p2} onChange={e => setTeamB({...teamB, p2: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm" placeholder="Player 2 (Left)"/>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Win At</label>
              <select value={winAt} onChange={e => setWinAt(Number(e.target.value))} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 font-bold">
                <option value={11}>11 Points</option>
                <option value={15}>15 Points</option>
                <option value={21}>21 Points</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Ending Rule</label>
              <div className="flex bg-slate-800 rounded-xl p-1">
                <button type="button" onClick={() => setWinByTwo(true)} className={`flex-1 py-2 text-xs font-bold rounded-lg ${winByTwo ? 'bg-slate-600 text-white' : 'text-slate-400'}`}>By 2</button>
                <button type="button" onClick={() => setWinByTwo(false)} className={`flex-1 py-2 text-xs font-bold rounded-lg ${!winByTwo ? 'bg-slate-600 text-white' : 'text-slate-400'}`}>Sudden</button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Best Of</label>
              <select value={bestOf} onChange={e => setBestOf(Number(e.target.value))} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 font-bold">
                <option value={1}>1 Game</option>
                <option value={3}>3 Games</option>
                <option value={5}>5 Games</option>
              </select>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-800">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block text-center">Decide Serve / Sides</label>
            <CoinFlip />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Starting Serve</label>
            <div className="flex gap-4">
              <button type="button" onClick={() => setStarter(TeamType.A)} className={`flex-1 py-3 rounded-xl font-bold border-2 transition-all ${starter === TeamType.A ? 'border-emerald-500 bg-emerald-500/20 text-white' : 'border-slate-700 bg-slate-800 text-slate-500'}`}>{teamA.name}</button>
              <button type="button" onClick={() => setStarter(TeamType.B)} className={`flex-1 py-3 rounded-xl font-bold border-2 transition-all ${starter === TeamType.B ? 'border-red-500 bg-red-500/20 text-white' : 'border-slate-700 bg-slate-800 text-slate-500'}`}>{teamB.name}</button>
            </div>
          </div>

          <button type="submit" className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black text-xl shadow-2xl hover:bg-emerald-500 transition-colors tracking-widest uppercase">Start Match</button>
        </form>

        {showDataMgmt && (
          <DataManagementModal 
            savedTeams={savedTeams}
            onUpdate={onUpdateSavedTeams}
            onClose={() => setShowDataMgmt(false)}
          />
        )}
      </div>
    </div>
  );
};

export default SetupModal;
