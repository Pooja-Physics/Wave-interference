import { motion } from 'framer-motion';
import { ArrowRight, Eye } from 'lucide-react';
import { LESSON_CONFIG } from '../../lessonConfig';

export default function SchoolVision({ onComplete }: { onComplete: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white p-10 rounded-3xl shadow-xl border border-zinc-100 text-center"
    >
      <div className="flex justify-center mb-6">
        <div className="p-4 bg-blue-50 rounded-2xl">
          <Eye className="w-10 h-10 text-blue-600" />
        </div>
      </div>
      
      <h2 className="text-3xl font-black text-blue-600 mb-8 tracking-tight uppercase">
        School Vision
      </h2>
      
      <div className="bg-red-50 p-8 rounded-2xl border-2 border-red-100 mb-10 shadow-inner">
        <p className="text-2xl font-bold text-red-600 leading-relaxed italic">
          "{LESSON_CONFIG.schoolVision}"
        </p>
      </div>

      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onComplete}
        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-10 rounded-xl transition-all inline-flex items-center gap-3 shadow-lg text-lg"
      >
        Continue to Objectives <ArrowRight className="w-6 h-6" />
      </motion.button>
    </motion.div>
  );
}
