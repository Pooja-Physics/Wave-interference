import { useState, useEffect } from 'react';
import { Type, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { LESSON_CONFIG } from '../../lessonConfig';
import ObjectiveBanner from './ObjectiveBanner';

const WORDS = LESSON_CONFIG.wordScramble.words;

export default function WordScramble({ onComplete }: { onComplete: (score: number) => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scrambled, setScrambled] = useState('');
  const [guess, setGuess] = useState('');
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

  useEffect(() => {
    if (currentIndex < WORDS.length) {
      let word = WORDS[currentIndex].word;
      let shuffled = word.split('').sort(() => 0.5 - Math.random()).join('');
      while (shuffled === word) {
        shuffled = word.split('').sort(() => 0.5 - Math.random()).join('');
      }
      setScrambled(shuffled);
      setGuess('');
      setFeedback(null);
    }
  }, [currentIndex]);

  const handleGuess = () => {
    if (guess.toUpperCase() === WORDS[currentIndex].word) {
      setScore(s => s + 2); // 5 words * 2 = 10 points
      setFeedback('correct');
      setTimeout(() => setCurrentIndex(i => i + 1), 1000);
    } else {
      setFeedback('incorrect');
    }
  };

  if (currentIndex >= WORDS.length) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-10 rounded-3xl shadow-xl border border-zinc-100 text-center">
        <motion.div 
          initial={{ rotate: -180, scale: 0 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ type: "spring", bounce: 0.6 }}
          className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <Type className="w-10 h-10" />
        </motion.div>
        <h2 className="text-3xl font-extrabold text-zinc-900 mb-4">Game Over!</h2>
        <p className="text-xl text-zinc-600 mb-8">You scored <strong className="text-purple-600 text-2xl">{score}</strong> points in Word Scramble.</p>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => onComplete(score)} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-xl transition-all inline-flex items-center gap-3 shadow-lg text-lg">
          Next Activity <ArrowRight className="w-6 h-6" />
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 rounded-3xl shadow-xl border border-zinc-100">
      <ObjectiveBanner objectiveIndex={LESSON_CONFIG.wordScramble.objectiveIndex} />
      
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.5 }} className="p-4 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl shadow-inner">
            <Type className="w-8 h-8 text-purple-600" />
          </motion.div>
          <h2 className="text-3xl font-extrabold text-zinc-900 tracking-tight">Word Scramble</h2>
        </div>
        <div className="text-right bg-zinc-50 p-3 rounded-xl border border-zinc-100">
          <div className="text-sm font-bold text-zinc-500 uppercase mb-1">Score: <span className="text-purple-600 text-lg">{score}</span></div>
          <div className="text-sm font-bold text-zinc-500 uppercase">Word: <span className="text-blue-600 text-lg">{currentIndex + 1}/{WORDS.length}</span></div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-zinc-50 to-purple-50 p-8 rounded-2xl border border-purple-100 mb-8 text-center shadow-sm">
        <p className="text-sm font-bold text-purple-600 uppercase tracking-wider mb-4">Hint: {WORDS[currentIndex].hint}</p>
        <div className="text-5xl font-black text-zinc-800 tracking-widest mb-8 drop-shadow-sm">{scrambled}</div>
        
        <input 
          type="text" 
          value={guess}
          onChange={(e) => setGuess(e.target.value.toUpperCase())}
          onKeyDown={(e) => e.key === 'Enter' && handleGuess()}
          disabled={feedback === 'correct'}
          className="w-full max-w-md mx-auto block px-6 py-4 rounded-xl border-2 border-zinc-200 focus:ring-4 focus:ring-purple-100 focus:border-purple-500 outline-none transition-all text-center text-2xl font-bold uppercase shadow-inner"
          placeholder="TYPE YOUR GUESS"
        />

        {feedback === 'correct' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 text-emerald-600 font-bold text-xl">
            🎉 Correct!
          </motion.div>
        )}
        {feedback === 'incorrect' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 text-red-600 font-bold text-xl">
            ❌ Try again!
          </motion.div>
        )}
      </div>

      <div className="flex justify-end">
        <motion.button 
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={handleGuess}
          disabled={!guess || feedback === 'correct'}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg text-lg"
        >
          Submit Guess
        </motion.button>
      </div>
    </motion.div>
  );
}
