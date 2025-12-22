
import React, { useState } from 'react';
import { RotateCcw } from 'lucide-react';

const CoinFlip: React.FC = () => {
  const [flipping, setFlipping] = useState(false);
  const [result, setResult] = useState<'H' | 'T' | null>(null);
  const [rotation, setRotation] = useState(0);

  const flipCoin = () => {
    if (flipping) return;
    setFlipping(true);
    setResult(null);

    const isHeads = Math.random() > 0.5;
    const newResult = isHeads ? 'H' : 'T';
    
    const currentFullCircles = Math.floor(rotation / 360);
    const extraCircles = 5;
    const baseTarget = (currentFullCircles + extraCircles) * 360;
    const finalRotation = baseTarget + (isHeads ? 0 : 180);
    
    setRotation(finalRotation);

    setTimeout(() => {
      setFlipping(false);
      setResult(newResult);
    }, 2000);
  };

  return (
    <div className="w-full bg-slate-900 border border-slate-700 p-3 md:p-4 rounded-2xl flex items-center justify-between shadow-lg">
      <div className="flex items-center gap-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-slate-400">
            <RotateCcw size={14} className="text-indigo-400" />
            <span className="text-[10px] md:text-xs font-black uppercase tracking-widest">Pick H or T</span>
          </div>
          {result && !flipping ? (
            <div className="text-sm md:text-lg font-black text-emerald-400 animate-pulse mt-1">
              {result === 'H' ? 'HEADS (H)' : 'TAILS (T)'}
            </div>
          ) : (
            <div className="text-xs text-slate-500 mt-1">Flip to decide serve</div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-8">
        <div 
          className="w-14 h-14 md:w-16 md:h-16 relative transition-transform duration-[2000ms] cursor-pointer"
          style={{ 
            transformStyle: 'preserve-3d',
            transform: `rotateY(${rotation}deg)`,
            transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
          }}
          onClick={flipCoin}
        >
          {/* Heads side (Front) */}
          <div className="absolute inset-0 bg-yellow-500 border-2 border-yellow-300 rounded-full flex items-center justify-center shadow-lg"
               style={{ backfaceVisibility: 'hidden' }}>
            <span className="text-yellow-100 font-black text-xl md:text-2xl">H</span>
          </div>

          {/* Tails side (Back) */}
          <div className="absolute inset-0 bg-blue-500 border-2 border-blue-300 rounded-full flex items-center justify-center shadow-lg"
               style={{ 
                 backfaceVisibility: 'hidden', 
                 transform: 'rotateY(180deg)' 
               }}>
            <span className="text-blue-100 font-black text-xl md:text-2xl">T</span>
          </div>
        </div>

        <button 
          onClick={flipCoin}
          disabled={flipping}
          className={`px-4 md:px-8 py-2 md:py-3 rounded-xl font-black text-[10px] md:text-xs text-white shadow-lg active:scale-95 transition-all uppercase tracking-widest ${
            flipping ? 'bg-slate-700 opacity-50' : 'bg-indigo-600 hover:bg-indigo-500'
          }`}
        >
          {flipping ? 'Spinning...' : 'Flip'}
        </button>
      </div>

      <style>{`
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
      `}</style>
    </div>
  );
};

export default CoinFlip;
