import { useState } from 'react';
import { ShieldCheck, ShieldAlert, ArrowRight, Brain } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LESSON_CONFIG } from '../../lessonConfig';
import ObjectiveBanner from './ObjectiveBanner';

const MISCONCEPTIONS = LESSON_CONFIG.misconceptions.items;

export default function MisconceptionGame({ onComplete }: { onComplete: (score: number) => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const handleAnswer = (answer: boolean) => {
    const correct = answer === MISCONCEPTIONS[currentIndex].isFact;
    setIsCorrect(correct);
    if (correct) setScore(s => s + 2);
    setShowFeedback(true);
  };

  const nextQuestion = () => {
    if (currentIndex + 1 < MISCONCEPTIONS.length) {
      setCurrentIndex(currentIndex + 1);
      setShowFeedback(false);
    } else {
      setIsFinished(true);
    }
  };

  if (isFinished) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-10 rounded-3xl shadow-xl border border-zinc-100 text-center"
      >
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldCheck className="w-12 h-12" />
        </div>
        <h2 className="text-3xl font-extrabold text-zinc-900 mb-4">Misconceptions Cleared!</h2>
        <p className="text-xl text-zinc-600 mb-8">
          You earned <strong className="text-emerald-600 text-2xl">{score}</strong> points for identifying the truth!
        </p>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onComplete(score)}
          className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-4 px-8 rounded-xl transition-all inline-flex items-center gap-3 shadow-lg text-lg"
        >
          Next Activity <ArrowRight className="w-6 h-6" />
        </motion.button>
      </motion.div>
    );
  }

  const current = MISCONCEPTIONS[currentIndex];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-8 rounded-3xl shadow-xl border border-zinc-100"
    >
      <ObjectiveBanner objectiveIndex={LESSON_CONFIG.misconceptions.objectiveIndex} />
      
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <motion.div 
            whileHover={{ rotate: 15, scale: 1.1 }}
            className="p-4 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl shadow-inner"
          >
            <Brain className="w-8 h-8 text-purple-600" />
          </motion.div>
          <h2 className="text-3xl font-extrabold text-zinc-900 tracking-tight">Clear the Misconception</h2>
        </div>
        <div className="bg-zinc-50 px-4 py-2 rounded-xl border border-zinc-200 font-bold text-zinc-500">
          {currentIndex + 1} / {MISCONCEPTIONS.length}
        </div>
      </div>

      <p className="text-xl text-zinc-600 mb-8 font-medium">
        Is the following statement a <span className="text-emerald-600 font-bold">Fact</span> or a <span className="text-red-500 font-bold">Misconception</span>?
      </p>

      <AnimatePresence mode="wait">
        <motion.div 
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-zinc-50 p-10 rounded-2xl border-2 border-zinc-100 shadow-inner mb-10 min-h-[160px] flex items-center justify-center text-center"
        >
          <h3 className="text-2xl font-bold text-zinc-800 leading-relaxed">
            "{current.statement}"
          </h3>
        </motion.div>
      </AnimatePresence>

      {!showFeedback ? (
        <div className="grid grid-cols-2 gap-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleAnswer(true)}
            className="bg-white border-4 border-emerald-500 text-emerald-600 hover:bg-emerald-50 font-black py-6 rounded-2xl text-2xl shadow-lg transition-all flex flex-col items-center gap-2"
          >
            <ShieldCheck className="w-10 h-10" />
            FACT
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleAnswer(false)}
            className="bg-white border-4 border-red-500 text-red-500 hover:bg-red-50 font-black py-6 rounded-2xl text-2xl shadow-lg transition-all flex flex-col items-center gap-2"
          >
            <ShieldAlert className="w-10 h-10" />
            MISCONCEPTION
          </motion.button>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-8 rounded-2xl border-2 mb-8 ${isCorrect ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-red-50 border-red-200 text-red-900'}`}
        >
          <div className="flex items-center gap-3 mb-3">
            {isCorrect ? <ShieldCheck className="w-8 h-8 text-emerald-600" /> : <ShieldAlert className="w-8 h-8 text-red-600" />}
            <h4 className="text-2xl font-black">{isCorrect ? 'CORRECT!' : 'NOT QUITE...'}</h4>
          </div>
          <p className="text-lg font-medium leading-relaxed">
            {current.explanation}
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={nextQuestion}
            className="mt-6 bg-zinc-900 text-white font-bold py-3 px-8 rounded-xl flex items-center gap-2 ml-auto"
          >
            {currentIndex + 1 < MISCONCEPTIONS.length ? 'Next Statement' : 'See Results'} <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
}
