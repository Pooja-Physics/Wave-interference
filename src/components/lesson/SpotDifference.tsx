import { useState } from 'react';
import { Search, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { LESSON_CONFIG } from '../../lessonConfig';
import ObjectiveBanner from './ObjectiveBanner';

export default function SpotDifference({ onComplete }: { onComplete: (score: number) => void }) {
  const [found, setFound] = useState(false);
  const [score, setScore] = useState(0);
  const { spotDifference } = LESSON_CONFIG;

  const handleSpot = (isCorrect: boolean) => {
    if (found) return;
    if (isCorrect) {
      setScore(10);
      setFound(true);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-8 rounded-3xl shadow-xl border border-zinc-100"
    >
      <ObjectiveBanner objectiveIndex={spotDifference.objectiveIndex} />
      
      <div className="flex items-center gap-4 mb-8">
        <motion.div 
          whileHover={{ rotate: 15, scale: 1.1 }}
          className="p-4 bg-gradient-to-br from-pink-100 to-rose-100 rounded-2xl shadow-inner"
        >
          <Search className="w-8 h-8 text-pink-600" />
        </motion.div>
        <h2 className="text-3xl font-extrabold text-zinc-900 tracking-tight">{spotDifference.title}</h2>
      </div>

      <p className="text-xl text-zinc-700 mb-8 leading-relaxed">
        {spotDifference.question}
      </p>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Correct Diagram (Destructive Interference) */}
        <motion.div 
          whileHover={!found ? { scale: 1.02, y: -5 } : {}}
          whileTap={!found ? { scale: 0.98 } : {}}
          onClick={() => handleSpot(false)}
          className={`relative cursor-pointer rounded-2xl border-4 transition-all overflow-hidden shadow-md h-64
            ${found ? 'border-zinc-200 opacity-50 grayscale' : 'border-transparent hover:border-blue-200 hover:shadow-lg'}`}
        >
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-sm font-bold shadow-sm z-10 text-zinc-700">Diagram A</div>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50" />
          <svg width="100%" height="100%" viewBox="0 0 400 200" className="absolute top-0 left-0 pointer-events-none">
            {/* Wave 1 */}
            <path d="M 0 60 Q 50 10 100 60 T 200 60 T 300 60 T 400 60" fill="none" stroke="#3b82f6" strokeWidth="3" />
            {/* Wave 2 (Out of phase) */}
            <path d="M 0 140 Q 50 190 100 140 T 200 140 T 300 140 T 400 140" fill="none" stroke="#ef4444" strokeWidth="3" />
            <text x="10" y="190" className="text-[10px] font-bold fill-zinc-400 uppercase">Out of Phase (Destructive)</text>
          </svg>
        </motion.div>

        {/* Incorrect Diagram (In phase but labeled destructive) */}
        <motion.div 
          whileHover={!found ? { scale: 1.02, y: -5 } : {}}
          whileTap={!found ? { scale: 0.98 } : {}}
          onClick={() => handleSpot(true)}
          className={`relative cursor-pointer rounded-2xl border-4 transition-all overflow-hidden shadow-md h-64
            ${found ? 'border-emerald-500 shadow-xl shadow-emerald-200 ring-4 ring-emerald-100' : 'border-transparent hover:border-blue-200 hover:shadow-lg'}`}
        >
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-sm font-bold shadow-sm z-10 text-zinc-700">Diagram B</div>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50" />
          <svg width="100%" height="100%" viewBox="0 0 400 200" className="absolute top-0 left-0 pointer-events-none">
            {/* Wave 1 */}
            <path d="M 0 60 Q 50 10 100 60 T 200 60 T 300 60 T 400 60" fill="none" stroke="#3b82f6" strokeWidth="3" />
            {/* Wave 2 (In phase - WRONG for destructive) */}
            <path d="M 0 140 Q 50 90 100 140 T 200 140 T 300 140 T 400 140" fill="none" stroke="#ef4444" strokeWidth="3" />
            <text x="10" y="190" className="text-[10px] font-bold fill-zinc-400 uppercase">In Phase (Labeled Destructive)</text>
          </svg>
          
          {found && (
            <motion.div 
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", bounce: 0.5 }}
              className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center backdrop-blur-[2px]"
            >
              <motion.div 
                animate={{ rotate: [-10, 10, -10] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="bg-white text-emerald-600 font-extrabold px-6 py-3 rounded-2xl shadow-2xl text-2xl border-4 border-emerald-100"
              >
                FOUND IT!
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </div>

      {found && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl mb-8 font-bold text-lg bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-sm leading-relaxed"
        >
          🎉 {spotDifference.correction}
        </motion.div>
      )}

      <div className="flex justify-end pt-4 border-t-2 border-zinc-100">
        {found && (
          <motion.button 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onComplete(score)}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-4 px-8 rounded-xl transition-all flex items-center gap-3 shadow-lg text-lg"
          >
            Next Activity <ArrowRight className="w-6 h-6" />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
