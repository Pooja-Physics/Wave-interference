import { useRef } from 'react';
import { Download, Award, RefreshCw, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';
import { LessonScores, SelfAssessmentData } from '../../types';
import { motion } from 'framer-motion';
import { LESSON_CONFIG } from '../../lessonConfig';

export default function Report({ 
  studentName, 
  scores, 
  selfAssessment,
  onRestart 
}: { 
  studentName: string, 
  scores: LessonScores, 
  selfAssessment?: SelfAssessmentData,
  onRestart: () => void 
}) {
  const reportRef = useRef<HTMLDivElement>(null);
  
  const totalScore = Math.round(
    (scores.wordScramble) +
    (scores.dragDrop) +
    (scores.misconception) +
    (scores.spotDifference) +
    (scores.waveLab * 0.1) +
    (scores.conceptCheck) +
    (scores.assessment * 0.75) +
    (scores.exitTicket)
  );
  const maxScore = 100;

  let calculatedLevel = 'Beginner';
  if (totalScore >= 84) calculatedLevel = 'Advanced';
  else if (totalScore >= 60) calculatedLevel = 'Intermediate';

  let grade = 'F';
  if (totalScore >= 90) grade = 'A';
  else if (totalScore >= 80) grade = 'B';
  else if (totalScore >= 70) grade = 'C';
  else if (totalScore >= 60) grade = 'D';

  const handleDownload = async () => {
    if (!reportRef.current) return;
    
    try {
      const element = reportRef.current;
      
      // Temporarily remove constraints for capture to ensure full visibility
      const originalMaxWidth = element.style.maxWidth;
      const originalWidth = element.style.width;
      element.style.maxWidth = 'none';
      element.style.width = '800px';
      
      // Use html-to-image to avoid oklch errors in html2canvas
      const dataUrl = await toPng(element, {
        quality: 1.0,
        pixelRatio: 2,
        backgroundColor: '#ffffff',
        cacheBust: true,
        width: 800,
        height: element.scrollHeight,
      });
      
      // Restore original styles
      element.style.maxWidth = originalMaxWidth;
      element.style.width = originalWidth;
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // Get image dimensions to calculate height
      const img = new Image();
      img.src = dataUrl;
      await new Promise((resolve) => {
        img.onload = resolve;
      });
      
      const imgWidth = pdfWidth;
      const imgHeight = (img.height * pdfWidth) / img.width;
      
      let heightLeft = imgHeight;
      let position = 0;
      
      // Add first page
      pdf.addImage(dataUrl, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pdfHeight;
      
      // Add subsequent pages if needed
      while (heightLeft >= 1) { // Use 1mm threshold to avoid tiny slivers or blank pages
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(dataUrl, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pdfHeight;
      }
      
      pdf.save(`${studentName.replace(/\s+/g, '_')}_Physics_Report.pdf`);
    } catch (error) {
      console.error("Error generating PDF", error);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-zinc-100">
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onRestart}
          className="flex items-center gap-2 px-6 py-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold rounded-xl transition-all"
        >
          <RefreshCw className="w-5 h-5" /> Start New Lesson
        </motion.button>

        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleDownload}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-xl transition-all flex items-center gap-2 shadow-lg"
        >
          <Download className="w-5 h-5" /> Download PDF Report
        </motion.button>
      </div>

      {/* The Report Card (what gets printed) */}
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        ref={reportRef} 
        className="bg-white p-12 rounded-3xl shadow-2xl border border-zinc-100 max-w-2xl mx-auto relative"
      >
        <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
        
        <div className="text-center mb-10 border-b border-zinc-200 pb-8 pt-4">
          <div className="flex justify-center items-center gap-6 mb-6">
            <img 
              src={LESSON_CONFIG.logoUrl} 
              alt="Ministry of Education UAE" 
              className="h-24 object-contain"
              crossOrigin="anonymous"
            />
          </div>
          <h1 className="text-4xl font-extrabold text-zinc-900 mb-2 tracking-tight">{LESSON_CONFIG.title} Report</h1>
          <p className="text-xl text-zinc-600 mb-8 font-medium">{LESSON_CONFIG.subtitle}</p>
          
          <div className="bg-zinc-50 rounded-2xl p-6 inline-block text-left border border-zinc-200 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
              <div>
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">School</p>
                <p className="text-zinc-900 font-bold text-lg">{LESSON_CONFIG.schoolName}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Teacher</p>
                <p className="text-zinc-900 font-bold text-lg">{LESSON_CONFIG.teacherName}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-10 text-center">
          <h2 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-2">Student Name</h2>
          <p className="text-3xl font-extrabold text-blue-600 bg-blue-50 inline-block px-6 py-2 rounded-xl border border-blue-100 mb-4">{studentName}</p>
          
          <div className="flex justify-center gap-8">
            <div>
              <h2 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-2">Assessed Level</h2>
              <span className={`inline-block px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider border ${
                calculatedLevel === 'Advanced' ? 'bg-purple-100 text-purple-700 border-purple-200' :
                calculatedLevel === 'Intermediate' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                'bg-emerald-100 text-emerald-700 border-emerald-200'
              }`}>
                {calculatedLevel}
              </span>
            </div>
            <div>
              <h2 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-2">Grade</h2>
              <span className={`inline-block px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider border ${
                grade === 'A' || grade === 'B' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                grade === 'C' || grade === 'D' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                'bg-red-100 text-red-700 border-red-200'
              }`}>
                {grade}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4 mb-12">
          <h3 className="text-xl font-extrabold text-zinc-900 border-b-2 border-zinc-100 pb-3 mb-6 flex items-center gap-2">
            <Award className="w-6 h-6 text-purple-500" /> Activity Breakdown
          </h3>
          
          {[
            { label: "Word Scramble", score: scores.wordScramble, max: 10 },
            { label: "Diagram Labeling (Drag & Drop)", score: scores.dragDrop, max: 10 },
            { label: "Clear Misconceptions", score: scores.misconception, max: 10 },
            { label: "Spot the Mistake", score: scores.spotDifference, max: 10 },
            { label: "Interactive Wave Lab", score: Math.round(scores.waveLab * 0.1), max: 10 },
            { label: "Concept Check", score: scores.conceptCheck, max: 10 },
            { label: "Adaptive Assessment", score: Math.round(scores.assessment * 0.75), max: 30 },
            { label: "Exit Ticket", score: scores.exitTicket, max: 10 },
          ].map((item, idx) => (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + (idx * 0.1) }}
              key={idx} 
              className="flex justify-between items-center p-4 bg-zinc-50 rounded-xl border border-zinc-100 hover:bg-zinc-100 transition-colors"
            >
              <span className="font-bold text-zinc-700 text-lg">{item.label}</span>
              <span className="font-extrabold text-zinc-900 text-lg bg-white px-3 py-1 rounded-lg shadow-sm border border-zinc-200">
                {item.score} <span className="text-zinc-400 text-sm">/ {item.max}</span>
              </span>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1, type: "spring" }}
          className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl border-2 border-blue-200 text-center shadow-inner relative overflow-hidden mb-8"
        >
          <div className="absolute -right-10 -top-10 text-blue-100 opacity-50">
            <Award className="w-40 h-40" />
          </div>
          <h3 className="text-sm font-extrabold text-blue-600 uppercase tracking-widest mb-3 relative z-10">Total Score</h3>
          <div className="text-6xl font-black text-blue-900 relative z-10 drop-shadow-sm">
            {totalScore} <span className="text-3xl text-blue-700/70 font-bold">/ {maxScore}</span>
          </div>
        </motion.div>

        {selfAssessment && (
          <div className="mb-10">
            <h3 className="text-xl font-extrabold text-zinc-900 border-b-2 border-zinc-100 pb-3 mb-6 flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-emerald-500" /> Student Self-Assessment
            </h3>
            <div className="space-y-3">
              {selfAssessment.objectives.map((obj, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-zinc-50 rounded-xl border border-zinc-100">
                  <span className="text-zinc-700 font-medium">{obj.objective}</span>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      obj.status === 'green' ? 'bg-emerald-500' :
                      obj.status === 'amber' ? 'bg-amber-500' :
                      'bg-red-500'
                    }`} />
                    <span className={`text-xs font-bold uppercase tracking-wider ${
                      obj.status === 'green' ? 'text-emerald-600' :
                      obj.status === 'amber' ? 'text-amber-600' :
                      'text-red-600'
                    }`}>
                      {obj.status === 'green' ? "I've got it!" :
                       obj.status === 'amber' ? "Getting there" :
                       "Still learning"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selfAssessment?.teacherFeedback && (
          <div className="mb-10">
            <h3 className="text-xl font-extrabold text-zinc-900 border-b-2 border-zinc-100 pb-3 mb-6 flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-blue-500" /> Feedback for Teacher
            </h3>
            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 italic text-blue-900 font-medium shadow-inner">
              "{selfAssessment.teacherFeedback}"
            </div>
          </div>
        )}

        {totalScore < 60 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="bg-amber-50 p-6 rounded-2xl border border-amber-200 text-left shadow-sm"
          >
            <h3 className="text-lg font-bold text-amber-900 mb-3">Recommended Resources for Extra Support</h3>
            <p className="text-amber-800 mb-4 text-sm">It looks like you might need a little more practice with wave interference. Check out these helpful resources:</p>
            <ul className="list-disc list-inside space-y-2 text-amber-700 text-sm font-medium">
              <li><a href="https://www.physicsclassroom.com/class/light/u12l3a.cfm" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">Physics Classroom: Young's Experiment</a></li>
              <li><a href="https://phet.colorado.edu/en/simulations/wave-interference" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">PhET Interactive Simulations: Wave Interference</a></li>
              <li><a href="https://www.khanacademy.org/science/physics/light-waves/interference-of-light-waves/v/youngs-double-slit-experiment" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">Khan Academy: Young's Double Slit Experiment</a></li>
            </ul>
          </motion.div>
        )}
        
        <div className="mt-12 text-center text-sm font-medium text-zinc-400">
          Generated automatically on {new Date().toLocaleDateString()}
        </div>
      </motion.div>
    </motion.div>
  );
}
