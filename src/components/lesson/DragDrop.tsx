import { useState } from 'react';
import { ArrowRight, MousePointer2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LESSON_CONFIG } from '../../lessonConfig';
import ObjectiveBanner from './ObjectiveBanner';

const LABELS = LESSON_CONFIG.dragDrop.labels;

export default function DragDrop({ onComplete }: { onComplete: (score: number) => void }) {
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [placements, setPlacements] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleDrop = (zoneId: string, itemId?: string) => {
    const itemToPlace = itemId || draggedItem;
    if (itemToPlace) {
      setPlacements(prev => ({ ...prev, [zoneId]: itemToPlace }));
      setDraggedItem(null);
    } else if (!draggedItem && placements[zoneId]) {
      // If clicking a filled zone with nothing selected, remove the item
      setPlacements(prev => {
        const newPlacements = { ...prev };
        delete newPlacements[zoneId];
        return newPlacements;
      });
    }
  };

  const checkAnswers = () => {
    let correct = 0;
    if (placements['zone-source'] === 'source') correct += 2;
    if (placements['zone-single-slit'] === 'single-slit') correct += 2;
    if (placements['zone-double-slit'] === 'double-slit') correct += 2;
    if (placements['zone-screen'] === 'screen') correct += 2;
    if (placements['zone-fringes'] === 'fringes') correct += 2;
    
    setScore(correct);
    setIsSubmitted(true);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-8 rounded-3xl shadow-xl border border-zinc-100"
    >
      <ObjectiveBanner objectiveIndex={LESSON_CONFIG.dragDrop.objectiveIndex} />
      
      <div className="flex items-center gap-4 mb-8">
        <motion.div 
          whileHover={{ rotate: -15, scale: 1.1 }}
          className="p-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl shadow-inner"
        >
          <MousePointer2 className="w-8 h-8 text-blue-600" />
        </motion.div>
        <h2 className="text-3xl font-extrabold text-zinc-900 tracking-tight">Drag & Drop: Double-Slit Setup</h2>
      </div>

      <p className="text-xl text-zinc-700 mb-8 leading-relaxed">Label the components of the double-slit interference experiment.</p>

      <div className="relative w-full max-w-2xl mx-auto h-96 bg-gradient-to-br from-zinc-900 to-zinc-800 border-2 border-zinc-700 rounded-3xl mb-10 overflow-hidden shadow-2xl">
        {/* Background drawing */}
        <svg viewBox="0 0 600 400" className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <defs>
            <linearGradient id="lightGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
            </linearGradient>
          </defs>
          
          {/* Light Source */}
          <circle cx="50" cy="200" r="20" fill="#ef4444" className="animate-pulse" />
          <path d="M 50 180 L 70 200 L 50 220 Z" fill="#ef4444" />
          
          {/* Single Slit Barrier */}
          <rect x="150" y="50" width="10" height="140" fill="#4b5563" />
          <rect x="150" y="210" width="10" height="140" fill="#4b5563" />
          
          {/* Double Slit Barrier */}
          <rect x="300" y="50" width="10" height="120" fill="#4b5563" />
          <rect x="300" y="185" width="10" height="30" fill="#4b5563" />
          <rect x="300" y="230" width="10" height="120" fill="#4b5563" />
          
          {/* Screen */}
          <rect x="550" y="50" width="15" height="300" fill="#1f2937" />
          
          {/* Fringes on screen */}
          {[...Array(9)].map((_, i) => (
            <rect 
              key={i} 
              x="550" 
              y={70 + i * 32} 
              width="15" 
              height="16" 
              fill="#ef4444" 
              opacity={1 - Math.abs(i - 4) * 0.2}
            />
          ))}

          {/* Light Rays / Wavefronts */}
          <path d="M 70 200 L 150 200" stroke="#ef4444" strokeWidth="2" strokeDasharray="4,4" />
          <path d="M 160 200 L 300 175" stroke="#ef4444" strokeWidth="1" opacity="0.5" />
          <path d="M 160 200 L 300 225" stroke="#ef4444" strokeWidth="1" opacity="0.5" />
          
          {/* Interference pattern visualization */}
          <path d="M 310 175 L 550 100" stroke="#ef4444" strokeWidth="1" opacity="0.3" />
          <path d="M 310 175 L 550 200" stroke="#ef4444" strokeWidth="1" opacity="0.3" />
          <path d="M 310 225 L 550 200" stroke="#ef4444" strokeWidth="1" opacity="0.3" />
          <path d="M 310 225 L 550 300" stroke="#ef4444" strokeWidth="1" opacity="0.3" />
        </svg>

        {/* Drop Zones */}
        <DropZone id="zone-source" top="35%" left="10%" label="Source" placements={placements} onDrop={handleDrop} />
        <DropZone id="zone-single-slit" top="15%" left="28%" label="1st Barrier" placements={placements} onDrop={handleDrop} />
        <DropZone id="zone-double-slit" top="15%" left="52%" label="2nd Barrier" placements={placements} onDrop={handleDrop} />
        <DropZone id="zone-screen" top="85%" left="85%" label="Back Wall" placements={placements} onDrop={handleDrop} />
        <DropZone id="zone-fringes" top="50%" left="80%" label="Pattern" placements={placements} onDrop={handleDrop} />
      </div>

      {/* Draggable Items */}
      <div className="flex flex-wrap gap-4 justify-center mb-10 min-h-[60px]">
        <AnimatePresence>
          {LABELS.map(label => {
            const isPlaced = Object.values(placements).includes(label.id);
            if (isPlaced) return null;
            return (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                key={label.id}
                draggable
                onClick={() => setDraggedItem(draggedItem === label.id ? null : label.id)}
                onDragStart={(e: any) => {
                  setDraggedItem(label.id);
                  e.dataTransfer.setData('text/plain', label.id);
                }}
                className={`px-5 py-3 bg-white border-2 rounded-xl shadow-md cursor-grab active:cursor-grabbing font-bold transition-colors text-base
                  ${draggedItem === label.id ? 'border-blue-500 ring-4 ring-blue-100 text-blue-700' : 'border-zinc-200 text-zinc-700 hover:border-blue-400 hover:text-blue-600'}`}
              >
                {label.text}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <div className="flex justify-between items-center border-t-2 border-zinc-100 pt-8">
        {isSubmitted ? (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-extrabold text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100"
          >
            Score: {score}/10
          </motion.div>
        ) : <div />}
        
        {!isSubmitted ? (
          <motion.button 
            whileHover={{ scale: Object.keys(placements).length < 5 ? 1 : 1.02 }}
            whileTap={{ scale: Object.keys(placements).length < 5 ? 1 : 0.98 }}
            onClick={checkAnswers}
            disabled={Object.keys(placements).length < 5}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-zinc-300 disabled:to-zinc-300 disabled:text-zinc-500 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg disabled:shadow-none text-lg"
          >
            Check Answers
          </motion.button>
        ) : (
          <motion.button 
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

function DropZone({ id, top, left, label, placements, onDrop }: any) {
  const placedId = placements[id];
  const placedText = LABELS.find(l => l.id === placedId)?.text;

  return (
    <motion.div 
      layout
      className={`absolute px-4 py-2 rounded-xl border-2 text-sm font-extrabold flex items-center justify-center transition-all cursor-pointer shadow-sm
        ${placedId ? 'bg-blue-100 border-blue-500 text-blue-800 scale-105' : 'bg-white/90 border-dashed border-zinc-400 text-zinc-500 hover:border-blue-400 hover:bg-blue-50'}`}
      style={{ top, left, minWidth: '120px', transform: 'translate(-50%, -50%)' }}
      onClick={() => onDrop(id)}
      onDragOver={(e: any) => e.preventDefault()}
      onDrop={(e: any) => {
        e.preventDefault();
        const itemId = e.dataTransfer.getData('text/plain');
        onDrop(id, itemId);
      }}
    >
      {placedText || label}
    </motion.div>
  );
}
