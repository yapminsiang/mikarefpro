
import React, { useState } from 'react';
import { SavedTeam } from '../types.ts';
import { Trash2, Plus, Download, X, AlertCircle } from 'lucide-react';

interface Props {
  savedTeams: SavedTeam[];
  onUpdate: (teams: SavedTeam[]) => void;
  onClose: () => void;
}

const DataManagementModal: React.FC<Props> = ({ savedTeams, onUpdate, onClose }) => {
  const [importText, setImportText] = useState('');
  const [error, setError] = useState('');

  const handleBatchImport = () => {
    setError('');
    const lines = importText.split('\n').filter(line => line.trim() !== '');
    const newTeams: SavedTeam[] = [];

    for (const line of lines) {
      const parts = line.split(/[,,|,\t]/).map(p => p.trim());
      if (parts.length < 3) {
        setError('Format error. Use: Team, Player 1, Player 2');
        return;
      }
      newTeams.push({
        id: Math.random().toString(36).substr(2, 9),
        name: parts[0],
        p1: parts[1],
        p2: parts[2]
      });
    }

    onUpdate([...savedTeams, ...newTeams]);
    setImportText('');
  };

  const deleteTeam = (id: string) => {
    onUpdate(savedTeams.filter(t => t.id !== id));
  };

  const clearAll = () => {
    if (window.confirm('Delete all saved teams?')) {
      onUpdate([]);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-4 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-3xl p-6 lg:p-8 shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black text-blue-400 uppercase tracking-tighter">Team Database</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-500"><X /></button>
        </div>

        {/* Batch Import Section */}
        <div className="mb-8 p-4 bg-slate-800/30 rounded-2xl border border-slate-700">
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
            <Download size={14} /> Batch Import (One per line: Name, P1, P2)
          </label>
          <textarea
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            className="w-full h-24 bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm font-mono text-blue-100 placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Eagles, Mike, John&#10;Hawks, Sarah, Jane"
          />
          {error && (
            <div className="mt-2 text-red-400 text-xs flex items-center gap-1">
              <AlertCircle size={12} /> {error}
            </div>
          )}
          <button
            onClick={handleBatchImport}
            disabled={!importText.trim()}
            className="mt-3 w-full py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg font-bold text-sm transition-colors flex items-center justify-center gap-2"
          >
            <Plus size={16} /> Add to Database
          </button>
        </div>

        {/* List Section */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase">{savedTeams.length} Saved Teams</span>
            {savedTeams.length > 0 && (
              <button onClick={clearAll} className="text-xs text-red-400 hover:underline">Clear All</button>
            )}
          </div>
          
          {savedTeams.length === 0 ? (
            <div className="text-center py-12 text-slate-600 italic border-2 border-dashed border-slate-800 rounded-2xl">
              No teams saved. Add them above.
            </div>
          ) : (
            savedTeams.map((team) => (
              <div key={team.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl border border-slate-700 group">
                <div>
                  <div className="font-bold text-white">{team.name}</div>
                  <div className="text-xs text-slate-400">{team.p1} & {team.p2}</div>
                </div>
                <button 
                  onClick={() => deleteTeam(team.id)}
                  className="p-2 text-slate-500 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        <button 
          onClick={onClose}
          className="mt-6 w-full py-3 bg-slate-700 text-white rounded-xl font-bold uppercase tracking-widest text-xs"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default DataManagementModal;
