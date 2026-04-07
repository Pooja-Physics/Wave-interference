import { useState, useEffect } from 'react';
import { ArrowRight, Lightbulb, Zap } from 'lucide-react';
import { motion, useAnimation } from 'framer-motion';
import { LESSON_CONFIG } from '../../lessonConfig';
import ObjectiveBanner from './ObjectiveBanner';

export default function Starter({ onComplete }: { onComplete: () => void }) {
  const [pulses, setPulses] = useState<number[]>([]);
  const { starter } = LESSON_CONFIG;
  
  const triggerPulse = () => {
    setPulses(prev => [...prev, Date.now()]);
    // Remove pulse after it finishes its animation (approx 2s)
    setTimeout(() => {
      setPulses(prev => prev.slice(1));
    }, 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white p-8 rounded-3xl shadow-xl border border-zinc-100"
    >
      <ObjectiveBanner objectiveIndex={starter.objectiveIndex} />
      
      <div className="flex items-center gap-4 mb-8">
        <motion.div 
          whileHover={{ rotate: 15, scale: 1.1 }}
          className="p-4 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-2xl shadow-inner"
        >
          <Lightbulb className="w-8 h-8 text-yellow-600" />
        </motion.div>
        <h2 className="text-3xl font-extrabold text-zinc-900 tracking-tight">Starter: {starter.title}</h2>
      </div>
      
      <p className="text-xl text-zinc-700 mb-8 leading-relaxed">
        {starter.description}
      </p>

      <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 p-8 rounded-3xl border border-zinc-700 mb-10 flex flex-col items-center shadow-2xl overflow-hidden relative">
        <div className="w-full text-center mb-8 relative z-10">
          <h3 className="text-xl font-bold text-white mb-3 tracking-tight">Visualize Wavefronts</h3>
          <p className="text-zinc-400 text-lg">Click the source to emit light! Watch how the wavefronts spread out and overlap, creating areas of high and low intensity.</p>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-10 w-full relative z-10">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9, rotate: [0, -10, 10, -10, 10, 0] }}
            onClick={triggerPulse}
            className="relative p-8 bg-zinc-800 rounded-full shadow-lg border-4 border-yellow-500/30 text-yellow-500 hover:text-yellow-400 transition-colors z-20"
          >
            <Zap className="w-12 h-12" />
            <div className="absolute -inset-2 bg-yellow-400/10 rounded-full animate-ping pointer-events-none" />
          </motion.button>

          <div className="relative flex-1 h-48 bg-black/40 rounded-2xl border-2 border-zinc-700 overflow-hidden shadow-inner w-full">
            {/* Wavefronts */}
            <div className="absolute inset-0 flex items-center justify-start px-4">
              {[...Array(20)].map((_, i) => (
                <Wavefront key={i} index={i} pulses={pulses} />
              ))}
            </div>
            
            {/* Labels */}
            <div className="absolute bottom-2 left-0 right-0 flex justify-around text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-4">
              <span>Light Source</span>
              <span>Propagating Wavefronts</span>
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-6 text-sm font-bold relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-sm" />
            <span className="text-zinc-400">Constructive (Bright)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-zinc-700 shadow-sm" />
            <span className="text-zinc-400">Destructive (Dark)</span>
          </div>
        </div>
        
        {/* Background glow */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-yellow-500/10 blur-[100px] pointer-events-none" />
      </div>

      <motion.button 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onComplete}
        className="ml-auto bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white font-bold py-4 px-8 rounded-xl transition-all flex items-center gap-3 shadow-lg text-lg"
      >
        Continue to Activities <ArrowRight className="w-6 h-6" />
      </motion.button>
    </motion.div>
  );
}

function Wavefront({ index, pulses }: { index: number; pulses: number[] }) {
  const controls = useAnimation();

  useEffect(() => {
    if (pulses.length > 0) {
      const delay = index * 0.1;
      
      controls.start({
        opacity: [0, 0.8, 0],
        scaleY: [0.2, 1, 0.2],
        x: [0, 20, 40],
        transition: {
          duration: 1.5,
          delay: delay,
          ease: "easeOut"
        }
      });
    }
  }, [pulses, index, controls]);

  return (
    <motion.div
      animate={controls}
      initial={{ opacity: 0 }}
      className="w-1 h-32 bg-yellow-400 rounded-full mx-1"
      style={{ boxShadow: '0 0 15px rgba(250, 204, 21, 0.5)' }}
    />
  );
}
