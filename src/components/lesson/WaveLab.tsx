import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Sun, Ruler, Layers, MoveHorizontal, CheckCircle2 } from 'lucide-react';
import { LESSON_CONFIG } from '../../lessonConfig';
import ObjectiveBanner from './ObjectiveBanner';

export default function WaveLab({ onComplete }: { onComplete: (score: number) => void }) {
  const [wavelength, setWavelength] = useState(600); // nm
  const [slitSeparation, setSlitSeparation] = useState(20); // micrometers
  const [distanceToScreen, setDistanceToScreen] = useState(1); // meters
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showQuestions, setShowQuestions] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const labConfig = LESSON_CONFIG.waveLab!;

  // Calculate fringe separation x = (lambda * L) / d
  const fringeSeparation = (wavelength * distanceToScreen) / slitSeparation;

  const getColor = (wl: number) => {
    if (wl >= 380 && wl < 450) return '#8b00ff'; // Violet
    if (wl >= 450 && wl < 495) return '#0000ff'; // Blue
    if (wl >= 495 && wl < 570) return '#00ff00'; // Green
    if (wl >= 570 && wl < 590) return '#ffff00'; // Yellow
    if (wl >= 590 && wl < 620) return '#ff8c00'; // Orange
    if (wl >= 620 && wl <= 750) return '#ff0000'; // Red
    return '#ffffff';
  };

  const handleFinish = () => {
    let correctCount = 0;
    labConfig.questions.forEach(q => {
      if (answers[q.id] === q.correct) correctCount++;
    });
    const score = Math.round((correctCount / labConfig.questions.length) * 10);
    onComplete(score);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-8 rounded-3xl shadow-xl border border-zinc-100 max-w-5xl mx-auto"
    >
      <ObjectiveBanner objectiveIndex={labConfig.objectiveIndex} />

      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-blue-100 rounded-xl">
          <Activity className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-zinc-900">Double-Slit Interference Lab</h2>
          <p className="text-zinc-500">Explore how wavelength, slit separation, and distance affect the interference pattern.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* Controls */}
        <div className="space-y-6">
          <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-100">
            <div className="flex justify-between items-center mb-4">
              <label className="font-bold text-zinc-700 flex items-center gap-2">
                <Sun className="w-4 h-4 text-orange-500" /> Wavelength (λ)
              </label>
              <span className="px-3 py-1 rounded-full text-sm font-bold" style={{ backgroundColor: getColor(wavelength) + '22', color: getColor(wavelength) }}>
                {wavelength} nm
              </span>
            </div>
            <input 
              type="range" min="400" max="700" step="10" value={wavelength}
              onChange={(e) => setWavelength(parseInt(e.target.value))}
              className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer"
              style={{ accentColor: getColor(wavelength) }}
            />
            <div className="flex justify-between text-[10px] font-bold text-zinc-400 mt-2 uppercase tracking-widest">
              <span>Violet</span>
              <span>Red</span>
            </div>
          </div>

          <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-100">
            <div className="flex justify-between items-center mb-4">
              <label className="font-bold text-zinc-700 flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-500" /> Slit Separation (d)
              </label>
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-bold">
                {slitSeparation} μm
              </span>
            </div>
            <input 
              type="range" min="10" max="50" step="1" value={slitSeparation}
              onChange={(e) => setSlitSeparation(parseInt(e.target.value))}
              className="w-full accent-blue-600"
            />
            <p className="text-xs text-zinc-500 mt-2 italic">Smaller d = Wider fringes</p>
          </div>

          <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-100">
            <div className="flex justify-between items-center mb-4">
              <label className="font-bold text-zinc-700 flex items-center gap-2">
                <Ruler className="w-4 h-4 text-indigo-500" /> Distance to Screen (L)
              </label>
              <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-bold">
                {distanceToScreen} m
              </span>
            </div>
            <input 
              type="range" min="0.5" max="2.0" step="0.1" value={distanceToScreen}
              onChange={(e) => setDistanceToScreen(parseFloat(e.target.value))}
              className="w-full accent-indigo-600"
            />
            <p className="text-xs text-zinc-500 mt-2 italic">Larger L = Wider fringes</p>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl">
            <h4 className="text-sm font-bold text-blue-800 mb-2 flex items-center gap-2">
              <MoveHorizontal className="w-4 h-4" /> Calculated Fringe Spacing (x)
            </h4>
            <p className="text-2xl font-black text-blue-600">{fringeSeparation.toFixed(2)} mm</p>
            <p className="text-xs text-blue-700 mt-1">Equation: x = (λL) / d</p>
          </div>
        </div>

        {/* Visualizer */}
        <div className="space-y-6">
          <div className="bg-zinc-950 rounded-3xl p-6 h-full min-h-[400px] relative overflow-hidden flex flex-col items-center justify-center border-4 border-zinc-800 shadow-inner">
            <div className="absolute top-4 left-6 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Observation Screen View</div>
            
            <div className="w-full flex justify-center items-center gap-0 overflow-hidden">
              {[...Array(21)].map((_, i) => {
                const index = i - 10;
                const opacity = Math.pow(Math.cos((index * Math.PI * 20) / (fringeSeparation * 2)), 2);
                return (
                  <div 
                    key={i}
                    className="h-64 w-4 shrink-0 transition-all duration-300"
                    style={{ 
                      backgroundColor: getColor(wavelength),
                      opacity: opacity,
                      boxShadow: opacity > 0.5 ? `0 0 20px ${getColor(wavelength)}44` : 'none'
                    }}
                  />
                );
              })}
            </div>

            <div className="mt-8 flex flex-col items-center">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-zinc-700"></div>
                <div className="w-12 h-0.5 bg-zinc-700"></div>
                <div className="w-2 h-2 rounded-full bg-zinc-700"></div>
              </div>
              <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Double Slit Source</p>
            </div>
          </div>
        </div>
      </div>

      {/* Questions Section */}
      <div className="mt-12 pt-8 border-t border-zinc-100">
        {!showQuestions ? (
          <div className="text-center">
            <p className="text-zinc-600 mb-6 font-medium">Have you finished exploring the variables? Test your observations!</p>
            <button
              onClick={() => setShowQuestions(true)}
              className="bg-zinc-900 text-white font-bold py-4 px-10 rounded-2xl hover:bg-zinc-800 transition-all shadow-lg"
            >
              Answer Lab Questions
            </button>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-8"
          >
            <h3 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-emerald-500" /> Lab Observations
            </h3>
            <div className="grid gap-6">
              {labConfig.questions.map((q, idx) => (
                <div key={q.id} className="bg-zinc-50 p-6 rounded-2xl border border-zinc-100">
                  <p className="font-bold text-zinc-800 mb-4">{idx + 1}. {q.text}</p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {q.options.map((opt, optIdx) => (
                      <button
                        key={optIdx}
                        onClick={() => setAnswers(prev => ({ ...prev, [q.id]: optIdx }))}
                        className={`p-4 rounded-xl text-left font-medium transition-all border-2 ${
                          answers[q.id] === optIdx 
                            ? 'bg-blue-600 border-blue-600 text-white shadow-md' 
                            : 'bg-white border-zinc-200 text-zinc-600 hover:border-blue-300'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleFinish}
                disabled={Object.keys(answers).length < labConfig.questions.length}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold py-4 px-12 rounded-2xl hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Answers & Finish
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

