import { useState } from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { LESSON_CONFIG } from '../../lessonConfig';
import ObjectiveBanner from './ObjectiveBanner';

const POOL = LESSON_CONFIG.assessment;

export default function Assessment({ onComplete }: { onComplete: (score: number) => void }) {
  const [qCount, setQCount] = useState(0);
  const [currentDiff, setCurrentDiff] = useState<'easy'|'medium'|'hard'>('medium');
  const [used, setUsed] = useState<Record<string, number[]>>({ easy: [], medium: [], hard: [] });
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  // Get current question
  const getAvailableQuestionIndex = (diff: 'easy'|'medium'|'hard') => {
    const available = POOL[diff].map((_, i) => i).filter(i => !used[diff].includes(i));
    if (available.length === 0) return 0; // Fallback
    return available[Math.floor(Math.random() * available.length)];
  };

  const [currentQIndex, setCurrentQIndex] = useState(getAvailableQuestionIndex('medium'));
  const currentQ = POOL[currentDiff][currentQIndex];

  const handleSelect = (optIndex: number) => {
    if (isAnswered) return;
    setSelectedOpt(optIndex);
  };

  const handleSubmit = () => {
    setIsAnswered(true);
    const isCorrect = selectedOpt === currentQ.correct;
    
    let points = 0;
    if (isCorrect) {
      points = 8;
    }
    setScore(s => s + points);
  };

  const handleNext = () => {
    const isCorrect = selectedOpt === currentQ.correct;
    
    // Mark as used
    const newUsed = { ...used };
    newUsed[currentDiff].push(currentQIndex);
    setUsed(newUsed);

    // Adjust difficulty
    let nextDiff = currentDiff;
    if (isCorrect) {
      if (currentDiff === 'easy') nextDiff = 'medium';
      else if (currentDiff === 'medium') nextDiff = 'hard';
    } else {
      if (currentDiff === 'hard') nextDiff = 'medium';
      else if (currentDiff === 'medium') nextDiff = 'easy';
    }

    if (qCount + 1 >= 5) {
      setIsGameOver(true);
    } else {
      setCurrentDiff(nextDiff);
      setQCount(c => c + 1);
      setIsAnswered(false);
      setSelectedOpt(null);
      
      // Set next question index
      const nextIndex = getAvailableQuestionIndex(nextDiff);
      setCurrentQIndex(nextIndex);
    }
  };

  if (isGameOver) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-10 rounded-3xl shadow-xl border border-zinc-100 text-center">
        <h2 className="text-3xl font-extrabold text-zinc-900 mb-4">Assessment Complete!</h2>
        <p className="text-xl text-zinc-600 mb-8">You scored <strong className="text-blue-600 text-2xl">{score}</strong> points.</p>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => onComplete(score)} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-xl transition-all inline-flex items-center gap-3 shadow-lg text-lg">
          Next Activity <ArrowRight className="w-6 h-6" />
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div key={qCount} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white p-8 rounded-3xl shadow-xl border border-zinc-100">
      <ObjectiveBanner objectiveIndex={LESSON_CONFIG.assessment.objectiveIndex} />
      
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <motion.div className="p-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl shadow-inner">
            <CheckCircle2 className="w-8 h-8 text-blue-600" />
          </motion.div>
          <h2 className="text-3xl font-extrabold text-zinc-900 tracking-tight">Adaptive Assessment</h2>
        </div>
        <div className="text-right bg-zinc-50 p-3 rounded-xl border border-zinc-100">
          <div className="text-sm font-bold text-zinc-500 uppercase mb-1">Question: <span className="text-blue-600 text-lg">{qCount + 1}/5</span></div>
          <div className="text-sm font-bold text-zinc-500 uppercase">Level: <span className={`text-lg ${currentDiff === 'hard' ? 'text-red-600' : currentDiff === 'medium' ? 'text-amber-600' : 'text-emerald-600'}`}>{currentDiff}</span></div>
        </div>
      </div>

      <div className="bg-zinc-50 p-8 rounded-2xl border-2 border-zinc-100 shadow-sm mb-8">
        <h3 className="font-extrabold text-zinc-900 mb-6 text-xl">{currentQ.question}</h3>
        
        <div className="space-y-3">
          {currentQ.options.map((opt: string, j: number) => {
            const isSelected = selectedOpt === j;
            let btnClass = "w-full text-left p-4 rounded-xl border-2 transition-all font-bold text-lg shadow-sm ";
            
            if (!isAnswered) {
              btnClass += isSelected ? "border-blue-600 bg-blue-50 text-blue-900 ring-4 ring-blue-100" : "border-zinc-200 hover:border-zinc-300 text-zinc-700 bg-white hover:bg-zinc-50";
            } else {
              if (j === currentQ.correct) {
                btnClass += "border-emerald-500 bg-emerald-50 text-emerald-900 ring-4 ring-emerald-100";
              } else if (isSelected && j !== currentQ.correct) {
                btnClass += "border-red-500 bg-red-50 text-red-900 ring-4 ring-red-100";
              } else {
                btnClass += "border-zinc-200 bg-white text-zinc-400 opacity-50";
              }
            }

            return (
              <motion.button 
                whileHover={!isAnswered ? { scale: 1.01 } : {}}
                whileTap={!isAnswered ? { scale: 0.99 } : {}}
                key={j} 
                onClick={() => handleSelect(j)}
                className={btnClass}
              >
                {opt}
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t-2 border-zinc-100">
        {!isAnswered ? (
          <motion.button 
            whileHover={{ scale: selectedOpt === null ? 1 : 1.02 }}
            whileTap={{ scale: selectedOpt === null ? 1 : 0.98 }}
            onClick={handleSubmit}
            disabled={selectedOpt === null}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-zinc-300 disabled:to-zinc-300 disabled:text-zinc-500 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg disabled:shadow-none text-lg"
          >
            Submit Answer
          </motion.button>
        ) : (
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleNext}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-4 px-8 rounded-xl transition-all flex items-center gap-3 shadow-lg text-lg"
          >
            {qCount + 1 >= 5 ? 'Finish Assessment' : 'Next Question'} <ArrowRight className="w-6 h-6" />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
