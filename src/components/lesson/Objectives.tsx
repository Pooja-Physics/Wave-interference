import { motion } from 'framer-motion';
import { Target, ArrowRight } from 'lucide-react';
import { LESSON_CONFIG } from '../../lessonConfig';

export default function Objectives({ onComplete }: { onComplete: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-8 rounded-3xl shadow-xl border border-zinc-100"
    >
      <div className="flex items-center gap-4 mb-8">
        <motion.div 
          whileHover={{ rotate: 15, scale: 1.1 }}
          className="p-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl shadow-inner"
        >
          <Target className="w-8 h-8 text-blue-600" />
        </motion.div>
        <h2 className="text-3xl font-extrabold text-zinc-900 tracking-tight">Learning Objectives</h2>
      </div>

      <div className="space-y-4 mb-10">
        {LESSON_CONFIG.learningObjectives.map((objective, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start gap-4 p-5 bg-zinc-50 rounded-2xl border border-zinc-100 hover:border-blue-200 transition-all group"
          >
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-blue-600 font-bold shadow-sm border border-zinc-100 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              {index + 1}
            </div>
            <p className="text-lg text-zinc-700 font-medium leading-relaxed flex-1">
              {objective}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-end pt-4 border-t-2 border-zinc-100">
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onComplete}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-xl transition-all flex items-center gap-3 shadow-lg text-lg"
        >
          Start Lesson <ArrowRight className="w-6 h-6" />
        </motion.button>
      </div>
    </motion.div>
  );
}
