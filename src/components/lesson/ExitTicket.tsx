import { useState } from 'react';
import { LogOut, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { LESSON_CONFIG } from '../../lessonConfig';
import ObjectiveBanner from './ObjectiveBanner';

export default function ExitTicket({ onComplete }: { onComplete: (score: number, responses: { learned: string, question: string }) => void }) {
  const [learned, setLearned] = useState('');
  const [question, setQuestion] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { exitTicket } = LESSON_CONFIG;

  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 rounded-3xl shadow-xl border border-zinc-100">
      <ObjectiveBanner objectiveIndex={exitTicket.objectiveIndex} />
      
      <div className="flex items-center gap-4 mb-8">
        <motion.div whileHover={{ rotate: 15, scale: 1.1 }} className="p-4 bg-gradient-to-br from-teal-100 to-emerald-100 rounded-2xl shadow-inner">
          <LogOut className="w-8 h-8 text-teal-600" />
        </motion.div>
        <h2 className="text-3xl font-extrabold text-zinc-900 tracking-tight">Exit Ticket</h2>
      </div>

      <div className="space-y-6 mb-10">
        <div>
          <label className="block text-lg font-bold text-zinc-700 mb-3">{exitTicket.questions[0]}</label>
          <motion.textarea
            whileFocus={{ scale: 1.01 }}
            value={learned}
            onChange={(e) => setLearned(e.target.value)}
            disabled={isSubmitted}
            className="w-full h-32 px-5 py-4 rounded-2xl border-2 border-zinc-200 focus:ring-4 focus:ring-teal-100 focus:border-teal-500 outline-none transition-all disabled:bg-zinc-50 disabled:text-zinc-500 text-lg resize-none shadow-inner"
          />
        </div>
        <div>
          <label className="block text-lg font-bold text-zinc-700 mb-3">{exitTicket.questions[1]}</label>
          <motion.textarea
            whileFocus={{ scale: 1.01 }}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            disabled={isSubmitted}
            className="w-full h-32 px-5 py-4 rounded-2xl border-2 border-zinc-200 focus:ring-4 focus:ring-teal-100 focus:border-teal-500 outline-none transition-all disabled:bg-zinc-50 disabled:text-zinc-500 text-lg resize-none shadow-inner"
          />
        </div>
      </div>

      <div className="flex justify-between items-center border-t-2 border-zinc-100 pt-8">
        {isSubmitted ? (
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-2xl font-extrabold text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100">
            🎉 Thank you! (10/10 pts)
          </motion.div>
        ) : (
          <div className="text-sm font-bold text-zinc-500 uppercase bg-zinc-50 px-3 py-1.5 rounded-lg border border-zinc-200">Score: 10 pts for completion</div>
        )}
        
        {!isSubmitted ? (
          <motion.button 
            whileHover={{ scale: (learned.trim() && question.trim()) ? 1.02 : 1 }} 
            whileTap={{ scale: (learned.trim() && question.trim()) ? 0.98 : 1 }}
            onClick={handleSubmit}
            disabled={!learned.trim() || !question.trim()}
            className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 disabled:from-zinc-300 disabled:to-zinc-300 disabled:text-zinc-500 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg disabled:shadow-none text-lg"
          >
            Submit Exit Ticket
          </motion.button>
        ) : (
          <motion.button 
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => onComplete(10, { learned, question })}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-xl transition-all flex items-center gap-3 shadow-lg text-lg"
          >
            Finish Lesson <ArrowRight className="w-6 h-6" />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
