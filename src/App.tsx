import { useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import StudentLesson from './pages/StudentLesson';
import TeacherDashboard from './pages/TeacherDashboard';
import { BookOpen, Presentation } from 'lucide-react';
import { testConnection } from './firebase';

export default function App() {
  useEffect(() => {
    testConnection();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans selection:bg-blue-200 flex flex-col">
      <header className="bg-white border-b border-zinc-200 sticky top-0 z-10 shrink-0">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg shadow-sm">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-zinc-900">Physics Interactive</h1>
              <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Wave Interference</p>
            </div>
          </div>
          <nav className="flex gap-4">
            <Link to="/" className="text-sm font-medium text-zinc-600 hover:text-blue-600 transition-colors">Student Lesson</Link>
            <Link to="/teacher" className="text-sm font-medium text-zinc-600 hover:text-blue-600 transition-colors flex items-center gap-1">
              <Presentation className="w-4 h-4" /> Teacher Dashboard
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        <Routes>
          <Route path="/" element={<StudentLesson />} />
          <Route path="/teacher" element={<TeacherDashboard />} />
        </Routes>
      </main>
    </div>
  );
}
