
import React from 'react';
import { GameState, TeamType } from '../types';

interface Props {
  gameState: GameState;
  onSwapPlayers: (team: TeamType) => void;
}

const PickleballCourt: React.FC<Props> = ({ gameState, onSwapPlayers }) => {
  const { teamA, teamB, servingTeam } = gameState;

  const isServerA = servingTeam === TeamType.A;
  
  const getPlayerDisplay = (teamType: TeamType) => {
    const team = teamType === TeamType.A ? teamA : teamB;
    const isEven = team.score % 2 === 0;
    
    // Team A (Left side of screen): 
    // Even (Right Court) = Visual Bottom
    // Odd (Left Court) = Visual Top
    if (teamType === TeamType.A) {
      return {
        top: team.players[1], // Left Court
        bottom: team.players[0], // Right Court
        currentServerId: isEven ? team.players[0].id : team.players[1].id
      };
    } 
    
    // Team B (Right side of screen): 
    // Even (Right Court from player perspective) = Visual Top
    // Odd (Left Court from player perspective) = Visual Bottom
    else {
      return {
        top: team.players[0], // Right Court
        bottom: team.players[1], // Left Court
        currentServerId: isEven ? team.players[0].id : team.players[1].id
      };
    }
  };

  const posA = getPlayerDisplay(TeamType.A);
  const posB = getPlayerDisplay(TeamType.B);

  return (
    <div className="relative w-full aspect-[2/1] bg-blue-600 border-4 border-white rounded-xl shadow-2xl overflow-hidden max-w-[800px]">
      {/* Kitchens */}
      <div className="absolute left-[35%] right-[35%] top-0 bottom-0 bg-emerald-500/80 border-x-2 border-white flex items-center justify-center">
         {/* Kitchen text removed */}
      </div>

      {/* Net Line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-white/40 z-10"></div>

      {/* Service Lines (Horizontal court has center lines on the left and right halves) */}
      <div className="absolute left-0 right-[65%] top-1/2 h-0.5 bg-white"></div>
      <div className="absolute left-[65%] right-0 top-1/2 h-0.5 bg-white"></div>

      {/* Players - Team A (Left Side) */}
      <div className="absolute left-0 w-[35%] top-0 bottom-0 flex flex-col justify-around items-center py-4">
        <PlayerBadge 
          player={posA.top} 
          isServing={isServerA && posA.currentServerId === posA.top.id} 
          color="bg-emerald-500" 
          onClick={() => onSwapPlayers(TeamType.A)}
        />
        <PlayerBadge 
          player={posA.bottom} 
          isServing={isServerA && posA.currentServerId === posA.bottom.id} 
          color="bg-emerald-500" 
          onClick={() => onSwapPlayers(TeamType.A)}
        />
      </div>

      {/* Players - Team B (Right Side) */}
      <div className="absolute right-0 w-[35%] top-0 bottom-0 flex flex-col justify-around items-center py-4">
        <PlayerBadge 
          player={posB.top} 
          isServing={!isServerA && posB.currentServerId === posB.top.id} 
          color="bg-red-500" 
          onClick={() => onSwapPlayers(TeamType.B)}
        />
        <PlayerBadge 
          player={posB.bottom} 
          isServing={!isServerA && posB.currentServerId === posB.bottom.id} 
          color="bg-red-500" 
          onClick={() => onSwapPlayers(TeamType.B)}
        />
      </div>

      {/* Side Labels */}
      <div className="absolute left-4 bottom-4 text-[10px] font-black text-white/30 uppercase tracking-tighter">Team A</div>
      <div className="absolute right-4 bottom-4 text-[10px] font-black text-white/30 uppercase tracking-tighter">Team B</div>
    </div>
  );
};

const PlayerBadge: React.FC<{ player: any, isServing: boolean, color: string, onClick: () => void }> = ({ player, isServing, color, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 transition-all duration-300 ${isServing ? 'scale-110' : 'opacity-80 scale-95'} hover:scale-105 active:scale-90`}
  >
    <div className={`w-14 h-14 rounded-full border-4 ${isServing ? 'border-yellow-400 animate-pulse shadow-[0_0_20px_rgba(250,204,21,0.5)]' : 'border-white'} flex items-center justify-center ${color} text-white font-black text-xl relative`}>
      {player.name.charAt(0)}
      {isServing && (
        <div className="absolute -top-2 -right-2 bg-yellow-400 w-6 h-6 rounded-full border-2 border-slate-900 flex items-center justify-center">
            <span className="text-[10px] text-slate-900 font-bold">S</span>
        </div>
      )}
    </div>
    <span className="text-[10px] bg-slate-900/80 px-2 rounded-full text-white font-bold whitespace-nowrap">
      {player.name}
    </span>
  </button>
);

export default PickleballCourt;
