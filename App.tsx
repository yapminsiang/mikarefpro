
import React, { useState, useEffect, useCallback } from 'react';
import { TeamType, Side, GameState, Team, Player, MatchSettings, SavedTeam } from './types';
import PickleballCourt from './components/PickleballCourt';
import ScoreDisplay from './components/ScoreDisplay';
import Timer from './components/Timer';
import SetupModal from './components/SetupModal';
import { Undo2, HelpCircle, Settings, Trophy } from 'lucide-react';

const DEFAULT_SETTINGS: MatchSettings = {
  winAt: 21,
  winByTwo: true,
  bestOf: 1,
};

const INITIAL_TEAM_A: Team = {
  name: 'Team A',
  players: [
    { id: 'a1', name: 'P1', initialSide: Side.RIGHT },
    { id: 'a2', name: 'P2', initialSide: Side.LEFT },
  ],
  score: 0,
  gamesWon: 0,
};

const INITIAL_TEAM_B: Team = {
  name: 'Team B',
  players: [
    { id: 'b1', name: 'P3', initialSide: Side.RIGHT },
    { id: 'b2', name: 'P4', initialSide: Side.LEFT },
  ],
  score: 0,
  gamesWon: 0,
};

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    teamA: { ...INITIAL_TEAM_A },
    teamB: { ...INITIAL_TEAM_B },
    servingTeam: TeamType.A,
    settings: { ...DEFAULT_SETTINGS },
    isGameOver: false,
    isMatchOver: false,
    history: [],
  });

  const [showSetup, setShowSetup] = useState(true);
  const [showHelp, setShowHelp] = useState(false);
  const [savedTeams, setSavedTeams] = useState<SavedTeam[]>([]);

  // Load saved teams on mount
  useEffect(() => {
    const data = localStorage.getItem('pb_ref_teams');
    if (data) {
      try {
        setSavedTeams(JSON.parse(data));
      } catch (e) {
        console.error("Failed to load saved teams", e);
      }
    }
  }, []);

  const updateSavedTeams = (teams: SavedTeam[]) => {
    setSavedTeams(teams);
    localStorage.setItem('pb_ref_teams', JSON.stringify(teams));
  };

  const saveHistory = useCallback(() => {
    const { history, ...current } = gameState;
    setGameState(prev => ({
      ...prev,
      history: [...prev.history, JSON.parse(JSON.stringify(current))].slice(-10),
    }));
  }, [gameState]);

  const undo = () => {
    if (gameState.history.length === 0) return;
    const newHistory = [...gameState.history];
    const previous = newHistory.pop();
    if (previous) {
      setGameState({ ...previous, history: newHistory });
    }
  };

  const checkWin = (scoreA: number, scoreB: number, settings: MatchSettings) => {
    if (settings.winByTwo) {
      if (scoreA >= settings.winAt && scoreA - scoreB >= 2) return TeamType.A;
      if (scoreB >= settings.winAt && scoreB - scoreA >= 2) return TeamType.B;
    } else {
      if (scoreA >= settings.winAt) return TeamType.A;
      if (scoreB >= settings.winAt) return TeamType.B;
    }
    return null;
  };

  const addPoint = (teamType: TeamType) => {
    if (gameState.isGameOver || gameState.isMatchOver) return;
    saveHistory();

    setGameState(prev => {
      const newState = { ...prev };
      const scoringTeam = teamType === TeamType.A ? newState.teamA : newState.teamB;
      
      scoringTeam.score += 1;

      if (prev.servingTeam === teamType) {
        const [p1, p2] = scoringTeam.players;
        scoringTeam.players = [p2, p1];
      }

      if (prev.servingTeam !== teamType) {
        newState.servingTeam = teamType;
      }

      const winner = checkWin(newState.teamA.score, newState.teamB.score, newState.settings);
      if (winner) {
        if (winner === TeamType.A) newState.teamA.gamesWon += 1;
        else newState.teamB.gamesWon += 1;
        
        newState.isGameOver = true;
        
        const neededToWin = Math.ceil(newState.settings.bestOf / 2);
        if (newState.teamA.gamesWon >= neededToWin || newState.teamB.gamesWon >= neededToWin) {
          newState.isMatchOver = true;
        }
      }

      return newState;
    });
  };

  const nextGame = () => {
    setGameState(prev => ({
      ...prev,
      teamA: { ...prev.teamA, score: 0 },
      teamB: { ...prev.teamB, score: 0 },
      isGameOver: false,
      history: [],
    }));
  };

  const swapPlayers = (teamType: TeamType) => {
    saveHistory();
    setGameState(prev => {
      const newState = { ...prev };
      const team = teamType === TeamType.A ? newState.teamA : newState.teamB;
      const [p1, p2] = team.players;
      team.players = [p2, p1];
      return newState;
    });
  };

  const toggleServingTeam = () => {
    saveHistory();
    setGameState(prev => ({
      ...prev,
      servingTeam: prev.servingTeam === TeamType.A ? TeamType.B : TeamType.A
    }));
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 max-w-6xl mx-auto overflow-x-hidden">
      <header className="w-full flex justify-between items-center mb-4">
        <h1 className="text-xl font-extrabold text-emerald-400 tracking-tighter uppercase italic">
          Ref Pro <span className="text-white">Pickleball</span>
        </h1>
        <div className="flex gap-2">
           <button onClick={() => setShowHelp(true)} className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 transition-colors"><HelpCircle size={20} className="text-amber-400" /></button>
           <button onClick={() => setShowSetup(true)} className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 transition-colors"><Settings size={20} /></button>
        </div>
      </header>

      <main className="flex-1 w-full flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Controls Sidebar */}
          <div className="w-full lg:w-80 space-y-4">
            <ScoreDisplay 
              teamA={gameState.teamA} 
              teamB={gameState.teamB} 
              servingTeam={gameState.servingTeam}
              onAddPoint={addPoint}
              bestOf={gameState.settings.bestOf}
            />
            
            <div className="grid grid-cols-2 gap-2">
              <button onClick={undo} disabled={gameState.history.length === 0} className="py-3 bg-slate-800 rounded-xl font-bold disabled:opacity-50 border border-slate-700 active:scale-95 transition-transform flex items-center justify-center gap-2"><Undo2 size={18}/> Undo</button>
              <button onClick={toggleServingTeam} className="py-3 bg-indigo-600 rounded-xl font-bold active:scale-95 transition-transform">Flip Serve</button>
            </div>

            <Timer />
            
            {gameState.isGameOver && !gameState.isMatchOver && (
              <button onClick={nextGame} className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold animate-pulse shadow-lg shadow-emerald-500/20">Next Game</button>
            )}
            
            {gameState.isMatchOver && (
              <div className="p-4 bg-emerald-900/40 border border-emerald-500 rounded-xl text-center">
                <Trophy className="mx-auto mb-2 text-yellow-400" size={32} />
                <p className="font-black text-xl text-emerald-400">MATCH OVER!</p>
                <p className="text-sm text-white">{gameState.teamA.gamesWon > gameState.teamB.gamesWon ? gameState.teamA.name : gameState.teamB.name} Wins</p>
                <button onClick={() => setShowSetup(true)} className="mt-4 px-6 py-2 bg-emerald-600 rounded-lg text-sm font-bold">New Match</button>
              </div>
            )}
          </div>

          {/* Court Display */}
          <div className="flex-1 w-full min-h-[400px] flex items-center justify-center bg-slate-900/50 rounded-3xl p-4 border border-slate-800 overflow-hidden">
            <PickleballCourt 
              gameState={gameState} 
              onSwapPlayers={swapPlayers}
            />
          </div>
        </div>
      </main>

      <footer className="w-full mt-6 text-center text-slate-500 text-xs uppercase tracking-widest font-bold flex flex-wrap justify-center gap-x-8 gap-y-2">
        <span>Rally Point</span>
        <span>Win At: {gameState.settings.winAt}</span>
        <span>{gameState.settings.winByTwo ? 'Win By 2' : 'Sudden Death'}</span>
        <span>Best of {gameState.settings.bestOf}</span>
      </footer>

      {showSetup && (
        <SetupModal 
          savedTeams={savedTeams}
          onUpdateSavedTeams={updateSavedTeams}
          onClose={() => setShowSetup(false)} 
          onStart={(teamA, teamB, settings, starter) => {
            setGameState({
              teamA,
              teamB,
              servingTeam: starter,
              settings,
              isGameOver: false,
              isMatchOver: false,
              history: [],
            });
            setShowSetup(false);
          }}
        />
      )}

      {showHelp && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-6 overflow-y-auto backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 p-8 rounded-3xl w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold mb-4 text-emerald-400">Rally Point Rules</h2>
            <div className="space-y-4 text-slate-300">
              <p>• <strong>Scoring:</strong> A point is scored on every rally.</p>
              <p>• <strong>Server Position:</strong> Based on the team's score. Even = Right, Odd = Left.</p>
              <p>• <strong>Switching Positions:</strong> Players on the serving team switch sides only after winning a rally as the server.</p>
              <p>• <strong>Side-out:</strong> If the receiving team wins the rally, they gain the serve but do not switch positions.</p>
              <p>• <strong>Player Swap:</strong> Tap a player on the court to manually swap positions.</p>
              <p>• <strong>Tools:</strong> Use the Coin Flip (in Settings) and Timer for match management.</p>
            </div>
            <button onClick={() => setShowHelp(false)} className="mt-8 w-full py-3 bg-emerald-600 rounded-xl font-bold text-white uppercase tracking-wider">Got it</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
