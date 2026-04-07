import { useState, useEffect } from 'react';
import { auth, db, loginAnonymously, handleFirestoreError, OperationType } from '../firebase';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import Starter from '../components/lesson/Starter';
import Objectives from '../components/lesson/Objectives';
import WordScramble from '../components/lesson/WordScramble';
import DragDrop from '../components/lesson/DragDrop';
import SpotDifference from '../components/lesson/SpotDifference';
import ConceptCheck from '../components/lesson/ConceptCheck';
import Assessment from '../components/lesson/Assessment';
import ExitTicket from '../components/lesson/ExitTicket';
import MisconceptionGame from '../components/lesson/MisconceptionGame';
import WaveLab from '../components/lesson/WaveLab';
import SelfAssessment from '../components/lesson/SelfAssessment';
import SchoolVision from '../components/lesson/SchoolVision';
import Report from '../components/lesson/Report';
import { ArrowRight, User } from 'lucide-react';
import { LessonScores, SelfAssessmentData } from '../types';
import { LESSON_CONFIG } from '../lessonConfig';

export default function StudentLesson() {
  const [step, setStep] = useState(-1);
  const [studentName, setStudentName] = useState('');
  const [uid, setUid] = useState<string | null>(null);
  const [scores, setScores] = useState<LessonScores>({
    wordScramble: 0,
    dragDrop: 0,
    misconception: 0,
    spotDifference: 0,
    waveLab: 0,
    conceptCheck: 0,
    assessment: 0,
    exitTicket: 0
  });
  const [selfAssessment, setSelfAssessment] = useState<SelfAssessmentData | undefined>(undefined);

  const [isStarting, setIsStarting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const stepNames = [
    "School Vision",
    "Learning Objectives",
    "Starter Activity",
    "Word Scramble",
    "Diagram Labeling",
    "Clear Misconceptions",
    "Spot the Mistake",
    "Interactive Wave Lab",
    "Concept Check",
    "Adaptive Assessment",
    "Exit Ticket",
    "Self-Assessment & Feedback",
    "Lesson Report"
  ];

  useEffect(() => {
    // Check if already logged in anonymously
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user && user.isAnonymous) {
        setUid(user.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  // Update current step and activity in Firestore
  useEffect(() => {
    if (uid && step >= 0) {
      const updateActivity = async () => {
        try {
          const studentRef = doc(db, 'students', uid);
          await updateDoc(studentRef, {
            currentStep: step,
            currentActivity: stepNames[step] || 'Unknown',
            lastActiveAt: new Date().toISOString()
          });
        } catch (error) {
          // Silently fail for activity updates to not disrupt student
          console.error("Failed to update activity:", error);
        }
      };
      updateActivity();
    }
  }, [step, uid]);

  // Heartbeat to show student is still active
  useEffect(() => {
    if (!uid || step < 0) return;
    
    const interval = setInterval(async () => {
      try {
        const studentRef = doc(db, 'students', uid);
        await updateDoc(studentRef, {
          lastActiveAt: new Date().toISOString()
        });
      } catch (error) {
        console.error("Heartbeat failed:", error);
      }
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [uid, step]);

  const handleStart = async () => {
    if (!studentName.trim() || isStarting) return;
    setIsStarting(true);
    setErrorMsg(null);
    
    try {
      // Always sign out first to ensure a fresh anonymous session for a new student
      // This prevents overwriting if multiple students use the same device
      await auth.signOut();
      setUid(null);
      
      // Reset scores for new student
      const initialScores: LessonScores = {
        wordScramble: 0,
        dragDrop: 0,
        misconception: 0,
        spotDifference: 0,
        waveLab: 0,
        conceptCheck: 0,
        assessment: 0,
        exitTicket: 0
      };
      setScores(initialScores);

      const user = await loginAnonymously();
      const currentUid = user.uid;
      setUid(currentUid);
      
      // Add a small delay to ensure Firebase Auth token propagates to Firestore
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Initialize student record
      const studentRef = doc(db, 'students', currentUid);
      
      // Retry logic in case of propagation delay
      let retries = 3;
      while (retries > 0) {
        try {
          await setDoc(studentRef, {
            uid: currentUid,
            name: studentName,
            level: 'pending',
            startedAt: new Date().toISOString(),
            lastActiveAt: new Date().toISOString(),
            currentStep: 0,
            currentActivity: stepNames[0],
            scores: initialScores,
            totalScore: 0
          });
          break; // Success
        } catch (err: any) {
          retries--;
          if (retries === 0) throw err;
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      setStep(0);
    } catch (error: any) {
      const errorString = error instanceof Error ? error.message : String(error);
      
      if (errorString.includes('auth/admin-restricted-operation')) {
        setErrorMsg("Anonymous Authentication is not enabled in the Firebase Console. Please ask your teacher to enable 'Anonymous' sign-in in the Firebase Authentication settings.");
      } else {
        handleFirestoreError(error, OperationType.WRITE, `students/${uid || 'new'}`);
        setErrorMsg("Failed to start the lesson. Please try again.");
      }
    } finally {
      setIsStarting(false);
    }
  };

  const updateScore = async (activity: keyof LessonScores, score: number, additionalData?: any) => {
    const newScores = { ...scores, [activity]: score };
    setScores(newScores);
    
    if (uid) {
      try {
        const totalScore = Math.round(
          (newScores.wordScramble) +
          (newScores.dragDrop) +
          (newScores.misconception) +
          (newScores.spotDifference) +
          (newScores.waveLab * 0.1) +
          (newScores.conceptCheck) +
          (newScores.assessment * 0.75) +
          (newScores.exitTicket)
        );
        const studentRef = doc(db, 'students', uid);
        await updateDoc(studentRef, {
          scores: newScores,
          totalScore: totalScore,
          ...additionalData
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `students/${uid}`);
      }
    }
  };

  const finishLesson = async (finalScores?: LessonScores, finalData?: any) => {
    const currentScores = finalScores || scores;
    if (uid) {
      try {
        const totalScore = Math.round(
          (currentScores.wordScramble) +
          (currentScores.dragDrop) +
          (currentScores.misconception) +
          (currentScores.spotDifference) +
          (currentScores.waveLab * 0.1) +
          (currentScores.conceptCheck) +
          (currentScores.assessment * 0.75) +
          (currentScores.exitTicket)
        );
        let calculatedLevel = 'beginner';
        if (totalScore >= 84) calculatedLevel = 'advanced';
        else if (totalScore >= 60) calculatedLevel = 'intermediate';

        const studentRef = doc(db, 'students', uid);
        await updateDoc(studentRef, {
          completedAt: new Date().toISOString(),
          level: calculatedLevel,
          totalScore: totalScore,
          ...finalData
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `students/${uid}`);
      }
    }
    
    // Trigger confetti!
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    setStep(12);
  };

  const nextStep = () => setStep(s => s + 1);

  const restartLesson = () => {
    setStep(-1);
    setStudentName('');
    setUid(null);
  };

  if (step === -1) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="flex-1 flex items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50"
      >
        <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full border border-zinc-100">
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="flex justify-center items-center mb-6"
          >
            <img 
              src={LESSON_CONFIG.logoUrl} 
              alt="Ministry of Education UAE" 
              className="h-20 object-contain drop-shadow-sm"
              crossOrigin="anonymous"
            />
          </motion.div>
          
          <div className="text-center mb-6">
            <p className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-1">{LESSON_CONFIG.schoolName}</p>
            <p className="text-sm font-medium text-zinc-500">Teacher: {LESSON_CONFIG.teacherName}</p>
          </div>

          <motion.div 
            whileHover={{ rotate: 10, scale: 1.1 }}
            className="w-16 h-16 bg-gradient-to-tr from-blue-100 to-indigo-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-inner"
          >
            <User className="w-8 h-8" />
          </motion.div>
          <h2 className="text-3xl font-extrabold text-center text-zinc-900 mb-2 tracking-tight">Welcome to {LESSON_CONFIG.title}!</h2>
          <p className="text-center text-zinc-600 mb-8 leading-relaxed">Enter your name to start the interactive lesson on {LESSON_CONFIG.subtitle}.</p>
          
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-2">Your Name</label>
              <input 
                type="text" 
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-zinc-200 focus:ring-0 focus:border-blue-500 outline-none transition-all text-lg"
                placeholder="e.g. Jane Doe"
              />
            </div>

            {errorMsg && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium"
              >
                {errorMsg}
              </motion.div>
            )}

            <motion.button 
              whileHover={{ scale: studentName.trim() && !isStarting ? 1.02 : 1 }}
              whileTap={{ scale: studentName.trim() && !isStarting ? 0.98 : 1 }}
              onClick={handleStart}
              disabled={!studentName.trim() || isStarting}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-zinc-300 disabled:to-zinc-300 disabled:text-zinc-500 text-white font-bold py-4 px-4 rounded-xl transition-all flex items-center justify-center gap-2 mt-6 shadow-lg disabled:shadow-none text-lg"
            >
              {isStarting ? 'Starting...' : (
                <>
                  Start Lesson <ArrowRight className="w-6 h-6" />
                </>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="flex-1 bg-zinc-50 min-h-screen flex flex-col">
      {/* Header with Logo */}
      <header className="bg-white border-b border-zinc-200 px-6 py-4 shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img 
              src={LESSON_CONFIG.logoUrl} 
              alt="Ministry of Education UAE" 
              className="h-12 object-contain"
              crossOrigin="anonymous"
            />
            <div className="hidden sm:block">
              <h1 className="text-lg font-extrabold text-zinc-900 leading-tight">{LESSON_CONFIG.title}</h1>
              <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">{LESSON_CONFIG.subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-zinc-50 px-4 py-2 rounded-xl border border-zinc-100">
            <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shadow-inner">
              <User className="w-4 h-4" />
            </div>
            <span className="text-sm font-bold text-zinc-700">{studentName}</span>
          </div>
        </div>
      </header>

      <div className="flex-1 p-6 overflow-x-hidden">
        <div className="max-w-4xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8 bg-white p-4 rounded-2xl shadow-sm border border-zinc-100">
            <div className="flex justify-between text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">
              <span>Progress</span>
              <span className="text-blue-600">{Math.round((step / 12) * 100)}%</span>
            </div>
            <div className="h-3 bg-zinc-100 rounded-full overflow-hidden shadow-inner">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(step / 12) * 100}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
              />
            </div>
          </div>

          {/* Lesson Steps with AnimatePresence */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {step === 0 && <SchoolVision onComplete={nextStep} />}
              {step === 1 && <Objectives onComplete={nextStep} />}
              {step === 2 && <Starter onComplete={nextStep} />}
              {step === 3 && <WordScramble onComplete={(score) => { updateScore('wordScramble', score); nextStep(); }} />}
              {step === 4 && <DragDrop onComplete={(score) => { updateScore('dragDrop', score); nextStep(); }} />}
              {step === 5 && <MisconceptionGame onComplete={(score) => { updateScore('misconception', score); nextStep(); }} />}
              {step === 6 && <SpotDifference onComplete={(score) => { updateScore('spotDifference', score); nextStep(); }} />}
              {step === 7 && <WaveLab onComplete={(score) => { updateScore('waveLab', score); nextStep(); }} />}
              {step === 8 && <ConceptCheck onComplete={(score, answer) => { updateScore('conceptCheck', score, { conceptCheckAnswer: answer }); nextStep(); }} />}
              {step === 9 && <Assessment onComplete={(score) => { updateScore('assessment', score); nextStep(); }} />}
              {step === 10 && <ExitTicket onComplete={(score, responses) => { 
                const finalScores = { ...scores, exitTicket: score };
                const finalData = { exitTicketResponses: responses };
                updateScore('exitTicket', score, finalData); 
                nextStep();
              }} />}
              {step === 11 && <SelfAssessment onComplete={(data) => {
                setSelfAssessment(data);
                finishLesson(scores, { selfAssessment: data });
              }} />}
              {step === 12 && <Report studentName={studentName} scores={scores} selfAssessment={selfAssessment} onRestart={restartLesson} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
