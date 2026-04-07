import { useState, useEffect } from 'react';
import { Brain, ArrowRight, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { LESSON_CONFIG } from '../../lessonConfig';
import ObjectiveBanner from './ObjectiveBanner';

export default function ConceptCheck({ onComplete }: { onComplete: (score: number, answer: string) => void }) {
  const [notes, setNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);
  const { conceptCheck } = LESSON_CONFIG;

  useEffect(() => {
    if (timeLeft > 0 && !isSubmitted) {
      const timerId = setTimeout(() => setTimeLeft(t => t - 1), 1000);
      return () => clearTimeout(timerId);
    } else if (timeLeft === 0 && !isSubmitted) {
      setIsSubmitted(true);
      onComplete(10, notes);
    }
  }, [timeLeft, isSubmitted, notes, onComplete]);

  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 rounded-3xl shadow-xl border border-zinc-100">
      <ObjectiveBanner objectiveIndex={conceptCheck.objectiveIndex} />
      
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <motion.div whileHover={{ rotate: 15, scale: 1.1 }} className="p-4 bg-gradient-to-br from-orange-100 to-amber-100 rounded-2xl shadow-inner">
            <Brain className="w-8 h-8 text-orange-600" />
          </motion.div>
          <h2 className="text-3xl font-extrabold text-zinc-900 tracking-tight">{conceptCheck.title}</h2>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-lg border ${timeLeft < 30 ? 'bg-red-50 text-red-600 border-red-200 animate-pulse' : 'bg-orange-50 text-orange-600 border-orange-200'}`}>
          <Clock className="w-5 h-5" />
          {formatTime(timeLeft)}
        </div>
      </div>

      <motion.div whileHover={{ scale: 1.01 }} className="bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-100 rounded-2xl p-8 mb-8 shadow-sm">
        <p className="text-orange-800 mb-6 text-lg font-medium">
          Explain the following phenomenon in your own words:
        </p>
        <div className="text-xl font-bold text-zinc-800 italic bg-white p-6 rounded-xl border border-orange-200 shadow-md relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-orange-400" />
          "{conceptCheck.prompt}"
        </div>
      </motion.div>

      <div className="mb-10">
        <motion.textarea
          whileFocus={{ scale: 1.01 }}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          disabled={isSubmitted}
          placeholder="I think the straw looks bent because..."
          className="w-full h-40 px-5 py-4 rounded-2xl border-2 border-zinc-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all disabled:bg-zinc-50 disabled:text-zinc-500 text-lg resize-none shadow-inner"
        />
      </div>

      {isSubmitted && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-8">
          <h3 className="text-lg font-bold text-emerald-700 mb-2">Model Answer:</h3>
          <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-xl text-emerald-900 font-medium shadow-sm">
            As you move from a cold room to a hot room, the speed of sound increases. This is because air particles in a hot room have more kinetic energy and move faster, allowing them to collide more frequently and transmit the pressure oscillations (sound waves) more quickly.
          </div>
        </motion.div>
      )}

      <div className="flex justify-between items-center border-t-2 border-zinc-100 pt-8">
        {isSubmitted ? (
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-2xl font-extrabold text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100">
            🎉 Great effort! (10/10 pts)
          </motion.div>
        ) : (
          <div className="text-sm font-bold text-zinc-500 uppercase bg-zinc-50 px-3 py-1.5 rounded-lg border border-zinc-200">Score: 10 pts for participation</div>
        )}
        
        {!isSubmitted ? (
          <motion.button 
            whileHover={{ scale: notes.trim().length < 10 ? 1 : 1.02 }} whileTap={{ scale: notes.trim().length < 10 ? 1 : 0.98 }}
            onClick={handleSubmit}
            disabled={notes.trim().length < 10}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-zinc-300 disabled:to-zinc-300 disabled:text-zinc-500 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg disabled:shadow-none text-lg"
          >
            Submit Answer
          </motion.button>
        ) : (
          <motion.button 
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => onComplete(10, notes)}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-4 px-8 rounded-xl transition-all flex items-center gap-3 shadow-lg text-lg"
          >
            Next Activity <ArrowRight className="w-6 h-6" />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
