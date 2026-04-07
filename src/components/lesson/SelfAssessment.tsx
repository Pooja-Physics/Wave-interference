import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, MessageSquare, Target, ArrowRight } from 'lucide-react';
import { LESSON_CONFIG } from '../../lessonConfig';
import { TrafficLightValue, SelfAssessmentData } from '../../types';

interface Props {
  onComplete: (data: SelfAssessmentData) => void;
}

export default function SelfAssessment({ onComplete }: Props) {
  const [objectiveStatus, setObjectiveStatus] = useState<Record<number, TrafficLightValue>>({});
  const [feedback, setFeedback] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const objectives = LESSON_CONFIG.learningObjectives;

  const handleStatusChange = (index: number, status: TrafficLightValue) => {
    setObjectiveStatus(prev => ({ ...prev, [index]: status }));
  };

  const handleSubmit = () => {
    const data: SelfAssessmentData = {
      objectives: objectives.map((obj, i) => ({
        objective: obj,
        status: objectiveStatus[i] || 'red'
      })),
      teacherFeedback: feedback
    };
    setIsSubmitted(true);
    onComplete(data);
  };

  const allRated = Object.keys(objectiveStatus).length === objectives.length;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-8 rounded-3xl shadow-xl border border-zinc-100"
    >
      <div className="flex items-center gap-4 mb-8">
        <motion.div 
          whileHover={{ rotate: 15, scale: 1.1 }}
          className="p-4 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-2xl shadow-inner"
        >
          <Target className="w-8 h-8 text-indigo-600" />
        </motion.div>
        <div>
          <h2 className="text-3xl font-extrabold text-zinc-900 tracking-tight">Self-Assessment</h2>
          <p className="text-zinc-500 font-medium">How confident do you feel about each objective?</p>
        </div>
      </div>

      <div className="space-y-6 mb-10">
        {objectives.map((objective, index) => (
          <div key={index} className="p-6 bg-zinc-50 rounded-2xl border border-zinc-100">
            <p className="text-lg font-bold text-zinc-800 mb-4 flex items-start gap-3">
              <span className="bg-white w-6 h-6 rounded-full flex items-center justify-center text-xs text-zinc-400 border border-zinc-200 shrink-0 mt-1">{index + 1}</span>
              {objective}
            </p>
            <div className="flex gap-4">
              <TrafficLightButton 
                status="red" 
                active={objectiveStatus[index] === 'red'} 
                onClick={() => handleStatusChange(index, 'red')}
                label="Still learning"
              />
              <TrafficLightButton 
                status="amber" 
                active={objectiveStatus[index] === 'amber'} 
                onClick={() => handleStatusChange(index, 'amber')}
                label="Getting there"
              />
              <TrafficLightButton 
                status="green" 
                active={objectiveStatus[index] === 'green'} 
                onClick={() => handleStatusChange(index, 'green')}
                label="I've got it!"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <MessageSquare className="w-6 h-6 text-zinc-400" />
          <h3 className="text-xl font-bold text-zinc-800">Feedback for Teacher</h3>
        </div>
        <p className="text-zinc-500 mb-4">Is there anything you'd like {LESSON_CONFIG.teacherName} to know? Any part of the lesson you really liked or found difficult?</p>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Write your comments here..."
          className="w-full h-32 px-5 py-4 rounded-2xl border-2 border-zinc-200 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all text-lg resize-none shadow-inner"
        />
      </div>

      <div className="flex justify-end pt-8 border-t-2 border-zinc-100">
        <motion.button 
          whileHover={{ scale: allRated ? 1.02 : 1 }} 
          whileTap={{ scale: allRated ? 0.98 : 1 }}
          onClick={handleSubmit}
          disabled={!allRated || isSubmitted}
          className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 disabled:from-zinc-300 disabled:to-zinc-300 disabled:text-zinc-500 text-white font-bold py-4 px-10 rounded-xl transition-all flex items-center gap-3 shadow-lg disabled:shadow-none text-lg"
        >
          {isSubmitted ? 'Submitted!' : (
            <>
              Submit Feedback <ArrowRight className="w-6 h-6" />
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}

function TrafficLightButton({ status, active, onClick, label }: { status: TrafficLightValue, active: boolean, onClick: () => void, label: string }) {
  const colors = {
    red: active ? 'bg-red-500 border-red-600 text-white shadow-red-200' : 'bg-white border-zinc-200 text-zinc-400 hover:border-red-300 hover:bg-red-50',
    amber: active ? 'bg-amber-500 border-amber-600 text-white shadow-amber-200' : 'bg-white border-zinc-200 text-zinc-400 hover:border-amber-300 hover:bg-amber-50',
    green: active ? 'bg-emerald-500 border-emerald-600 text-white shadow-emerald-200' : 'bg-white border-zinc-200 text-zinc-400 hover:border-emerald-300 hover:bg-emerald-50'
  };

  const dotColors = {
    red: active ? 'bg-white' : 'bg-red-500',
    amber: active ? 'bg-white' : 'bg-amber-500',
    green: active ? 'bg-white' : 'bg-emerald-500'
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 font-bold transition-all shadow-sm ${colors[status]}`}
    >
      <div className={`w-3 h-3 rounded-full ${dotColors[status]} shadow-inner`} />
      <span className="text-sm">{label}</span>
    </motion.button>
  );
}
