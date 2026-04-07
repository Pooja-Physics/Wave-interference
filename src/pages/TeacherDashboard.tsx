import { useState, useEffect } from 'react';
import { auth, db, loginAsTeacher, logout, handleFirestoreError, OperationType } from '../firebase';
import { collection, onSnapshot, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { Users, LogOut, Award, Clock, Download, RefreshCw, Trash2, AlertTriangle, AlertCircle, LayoutGrid, Table, Play, Type, MousePointer2, PackageOpen, Search, Brain, CheckCircle2, FileText, Activity } from 'lucide-react';
import * as XLSX from 'xlsx';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ACTIVITY_ICONS: Record<string, any> = {
  "Starter Activity": Play,
  "Word Scramble": Type,
  "Diagram Labeling": MousePointer2,
  "Clear Misconceptions": Brain,
  "Spot the Mistake": Search,
  "Interactive Wave Lab": Activity,
  "Concept Check": Brain,
  "Adaptive Assessment": CheckCircle2,
  "Exit Ticket": LogOut,
  "Lesson Report": FileText
};

export default function TeacherDashboard() {
  const [isTeacher, setIsTeacher] = useState(false);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showClearModal, setShowClearModal] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  // Calculate stats
  const completedStudents = students.filter(s => s.completedAt);
  const advancedCount = completedStudents.filter(s => s.totalScore >= 84).length;
  const intermediateCount = completedStudents.filter(s => s.totalScore >= 60 && s.totalScore < 84).length;
  const beginnerCount = completedStudents.filter(s => s.totalScore < 60).length;
  
  const chartData = [
    { name: 'Advanced (>=84%)', value: advancedCount, color: '#10b981' }, // emerald-500
    { name: 'Intermediate (60-83%)', value: intermediateCount, color: '#f59e0b' }, // amber-500
    { name: 'Beginner (<60%)', value: beginnerCount, color: '#ef4444' } // red-500
  ].filter(d => d.value > 0);

  const needsSupport = completedStudents.filter(s => s.totalScore < 60);

  const isStudentActive = (lastActiveAt: string) => {
    if (!lastActiveAt) return false;
    const lastActive = new Date(lastActiveAt).getTime();
    const now = new Date().getTime();
    return (now - lastActive) < 60000; // Active if heartbeat in last 60 seconds
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      // Check if logged in with Google and matches the specific teacher email
      if (user && 
          user.providerData.some(p => p.providerId === 'google.com') && 
          user.email === "pooja.naik1109@gmail.com") {
        setIsTeacher(true);
      } else {
        setIsTeacher(false);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!isTeacher) return;

    const q = query(collection(db, 'students'), orderBy('startedAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const studentData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setStudents(studentData);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'students');
    });

    return () => unsubscribe();
  }, [isTeacher]);

  const handleLogin = async () => {
    setErrorMsg(null);
    try {
      await loginAsTeacher();
    } catch (error: any) {
      console.error("Login failed", error);
      if (error?.code === 'auth/popup-blocked') {
        setErrorMsg("Your browser blocked the login popup because this app is running inside a preview window. Please click the 'Open in New Tab' button (the square with an arrow) in the top right corner of the preview window, and try logging in again from there.");
      } else {
        setErrorMsg("Failed to log in. Please try again.");
      }
    }
  };

  const exportToExcel = () => {
    const exportData = students.map(student => ({
      'Student Name': student.name,
      'Level': student.level || 'N/A',
      'Status': student.completedAt ? 'Completed' : 'In Progress',
      'Current Activity': student.currentActivity || 'N/A',
      'Total Score': student.totalScore,
      'Word Scramble': student.scores?.wordScramble || 0,
      'Drag & Drop': student.scores?.dragDrop || 0,
      'Clear Misconceptions': student.scores?.misconception || 0,
      'Spot Diff': student.scores?.spotDifference || 0,
      'Wave Lab': student.scores?.waveLab || 0,
      'Concept Check': student.scores?.conceptCheck || 0,
      'Assessment': student.scores?.assessment || 0,
      'Exit Ticket': student.scores?.exitTicket || 0,
      'Started At': new Date(student.startedAt).toLocaleString(),
      'Completed At': student.completedAt ? new Date(student.completedAt).toLocaleString() : 'N/A'
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Students");
    XLSX.writeFile(wb, "Physics_Lesson_Scores.xlsx");
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const handleClearAll = async () => {
    setIsClearing(true);
    try {
      const deletePromises = students.map(student => deleteDoc(doc(db, 'students', student.id)));
      await Promise.all(deletePromises);
      setShowClearModal(false);
    } catch (error) {
      console.error("Error clearing data:", error);
    } finally {
      setIsClearing(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  if (!isTeacher) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-zinc-200 text-center">
          <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-zinc-900 mb-2">Teacher Access</h2>
          <p className="text-zinc-600 mb-6">Please sign in with your Google account to access the teacher dashboard.</p>
          
          {errorMsg && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm text-left">
              {errorMsg}
            </div>
          )}

          <button 
            onClick={handleLogin}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-colors"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-zinc-50 p-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg text-white">
                <Activity className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-bold text-zinc-900">Live Class Tracker</h2>
            </div>
            <p className="text-zinc-600 mt-1">Real-time student progress and activity monitoring.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="flex bg-white border border-zinc-200 rounded-lg p-1 shadow-sm">
              <button 
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-bold transition-all ${viewMode === 'grid' ? 'bg-blue-600 text-white shadow-md' : 'text-zinc-500 hover:bg-zinc-50'}`}
              >
                <LayoutGrid className="w-4 h-4" /> Grid
              </button>
              <button 
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-bold transition-all ${viewMode === 'table' ? 'bg-blue-600 text-white shadow-md' : 'text-zinc-500 hover:bg-zinc-50'}`}
              >
                <Table className="w-4 h-4" /> Table
              </button>
            </div>
            <button 
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-zinc-200 rounded-lg text-zinc-700 hover:bg-zinc-50 font-medium transition-colors shadow-sm"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} /> Refresh
            </button>
            <button 
              onClick={exportToExcel}
              disabled={students.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              <Download className="w-4 h-4" /> Export
            </button>
            <button 
              onClick={() => setShowClearModal(true)}
              disabled={students.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              <Trash2 className="w-4 h-4" /> Clear
            </button>
            <button 
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-zinc-200 rounded-lg text-zinc-700 hover:bg-zinc-50 font-medium transition-colors shadow-sm"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-zinc-900">Class Performance</h3>
              <div className="flex gap-4 text-xs font-bold uppercase tracking-wider">
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-emerald-500"></div> Advanced</div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-amber-500"></div> Intermediate</div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-red-500"></div> Beginner</div>
              </div>
            </div>
            {completedStudents.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-zinc-400 bg-zinc-50 rounded-xl border border-dashed border-zinc-200">
                <Activity className="w-12 h-12 mb-2 opacity-20" />
                <p>No completed lessons yet.</p>
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <h3 className="text-lg font-bold text-zinc-900">Needs Support</h3>
            </div>
            {needsSupport.length > 0 ? (
              <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                {needsSupport.map(student => (
                  <div key={student.id} className="flex justify-between items-center p-3 bg-red-50 rounded-xl border border-red-100">
                    <span className="font-bold text-red-900">{student.name}</span>
                    <span className="text-red-700 font-black text-lg">{student.totalScore}%</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-zinc-400 text-sm text-center py-12 bg-zinc-50 rounded-xl border border-dashed border-zinc-200">
                {completedStudents.length > 0 ? (
                  <div className="flex flex-col items-center">
                    <Award className="w-10 h-10 text-emerald-500 mb-2" />
                    <p className="font-bold text-emerald-700">Everyone is on track!</p>
                  </div>
                ) : "No data yet."}
              </div>
            )}
          </div>
        </div>

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {students.map(student => {
              const active = isStudentActive(student.lastActiveAt);
              const CurrentIcon = ACTIVITY_ICONS[student.currentActivity] || Activity;
              const progress = ((student.currentStep || 0) / 9) * 100;
              
              return (
                <div 
                  key={student.id} 
                  onClick={() => setSelectedStudent(student)}
                  className="bg-white rounded-2xl border border-zinc-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col cursor-pointer hover:border-blue-300"
                >
                  <div className="p-5 border-b border-zinc-100 flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-zinc-900 text-lg leading-tight">{student.name}</h4>
                      <div className="flex items-center gap-1.5 mt-1">
                        <div className={`w-2 h-2 rounded-full ${active ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-300'}`}></div>
                        <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">{active ? 'Live' : 'Idle'}</span>
                      </div>
                    </div>
                    {student.completedAt && (
                      <div className="bg-emerald-100 text-emerald-700 p-1.5 rounded-lg">
                        <Award className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                  
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-center gap-3 mb-4 p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                      <div className="p-2 bg-white rounded-lg shadow-sm text-blue-600">
                        <CurrentIcon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Current Activity</p>
                        <p className="font-bold text-zinc-700 truncate">{student.currentActivity || 'Just Started'}</p>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-xs font-bold text-zinc-500 uppercase">
                        <span>Progress</span>
                        <span>{Math.round(progress)}%</span>
                      </div>
                      <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 transition-all duration-500" 
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="mt-auto flex justify-between items-center pt-4 border-t border-zinc-50">
                      <div>
                        <p className="text-xs font-bold text-zinc-400 uppercase">Total Score</p>
                        <p className={`text-xl font-black ${
                          student.totalScore < 60 ? 'text-red-600' :
                          student.totalScore < 84 ? 'text-amber-500' :
                          'text-emerald-600'
                        }`}>{student.totalScore} pts</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-zinc-400 uppercase">Level</p>
                        <p className="font-bold text-zinc-700 capitalize">{student.level || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            {students.length === 0 && (
              <div className="col-span-full py-20 bg-white rounded-2xl border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center text-zinc-400">
                <Users className="w-16 h-16 mb-4 opacity-20" />
                <p className="text-xl font-bold">Waiting for students to join...</p>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-50 border-b border-zinc-200">
                    <th className="p-4 font-semibold text-zinc-900">Student Name</th>
                    <th className="p-4 font-semibold text-zinc-900">Status</th>
                    <th className="p-4 font-semibold text-zinc-900">Current Activity</th>
                    <th className="p-4 font-semibold text-zinc-900">Total Score</th>
                    <th className="p-4 font-semibold text-zinc-900 text-sm">Word Scramble</th>
                    <th className="p-4 font-semibold text-zinc-900 text-sm">Drag & Drop</th>
                    <th className="p-4 font-semibold text-zinc-900 text-sm">Clear Misconceptions</th>
                    <th className="p-4 font-semibold text-zinc-900 text-sm">Spot Diff</th>
                    <th className="p-4 font-semibold text-zinc-900 text-sm">Wave Lab</th>
                    <th className="p-4 font-semibold text-zinc-900 text-sm">Concept Check</th>
                    <th className="p-4 font-semibold text-zinc-900 text-sm">Assessment</th>
                    <th className="p-4 font-semibold text-zinc-900 text-sm">Exit Ticket</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {students.map(student => (
                    <tr 
                      key={student.id} 
                      onClick={() => setSelectedStudent(student)}
                      className="hover:bg-zinc-50 transition-colors cursor-pointer"
                    >
                      <td className="p-4 font-medium text-zinc-900">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${isStudentActive(student.lastActiveAt) ? 'bg-emerald-500' : 'bg-zinc-300'}`}></div>
                          {student.name}
                          {student.level && <span className="ml-2 text-xs text-zinc-500 capitalize">({student.level})</span>}
                        </div>
                      </td>
                      <td className="p-4">
                        {student.completedAt ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                            <Award className="w-3 h-3" /> Completed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                            <Clock className="w-3 h-3" /> In Progress
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-zinc-700 font-medium">
                          {student.currentActivity || 'N/A'}
                        </div>
                      </td>
                      <td className={`p-4 font-bold ${
                        student.totalScore < 60 ? 'text-red-600' :
                        student.totalScore < 84 ? 'text-amber-500' :
                        'text-emerald-600'
                      }`}>
                        {student.totalScore} pts
                      </td>
                      <td className="p-4 text-zinc-600">{student.scores?.wordScramble || 0}</td>
                      <td className="p-4 text-zinc-600">{student.scores?.dragDrop || 0}</td>
                      <td className="p-4 text-zinc-600">{student.scores?.misconception || 0}</td>
                      <td className="p-4 text-zinc-600">{student.scores?.spotDifference || 0}</td>
                      <td className="p-4 text-zinc-600">{student.scores?.waveLab || 0}</td>
                      <td className="p-4 text-zinc-600">{student.scores?.conceptCheck || 0}</td>
                      <td className="p-4 text-zinc-600">{student.scores?.assessment || 0}</td>
                      <td className="p-4 text-zinc-600">{student.scores?.exitTicket || 0}</td>
                    </tr>
                  ))}
                  {students.length === 0 && (
                    <tr>
                      <td colSpan={11} className="p-8 text-center text-zinc-500">
                        No students have started the lesson yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {showClearModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
            <div className="flex items-center gap-3 text-red-600 mb-4">
              <AlertTriangle className="w-8 h-8" />
              <h3 className="text-xl font-bold text-zinc-900">Clear All Data?</h3>
            </div>
            <p className="text-zinc-600 mb-6">
              Are you sure you want to delete all student records? This action cannot be undone and all progress will be lost.
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowClearModal(false)}
                disabled={isClearing}
                className="px-4 py-2 font-medium text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleClearAll}
                disabled={isClearing}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
              >
                {isClearing ? 'Clearing...' : 'Yes, Clear All'}
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl my-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-3xl font-black text-zinc-900">{selectedStudent.name}</h3>
                <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs mt-1">Student Details</p>
              </div>
              <button 
                onClick={() => setSelectedStudent(null)}
                className="p-2 hover:bg-zinc-100 rounded-full transition-colors"
              >
                <LogOut className="w-6 h-6 text-zinc-400 rotate-180" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-100">
                <p className="text-xs font-bold text-zinc-400 uppercase mb-1">Total Score</p>
                <p className="text-2xl font-black text-blue-600">{selectedStudent.totalScore} pts</p>
              </div>
              <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-100">
                <p className="text-xs font-bold text-zinc-400 uppercase mb-1">Level</p>
                <p className="text-2xl font-black text-zinc-700 capitalize">{selectedStudent.level || 'N/A'}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-bold text-zinc-900 mb-3 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-orange-500" /> Concept Check Response
                </h4>
                <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 text-zinc-700 italic">
                  {selectedStudent.conceptCheckAnswer ? `"${selectedStudent.conceptCheckAnswer}"` : "No response yet."}
                </div>
              </div>

              <div>
                <h4 className="text-lg font-bold text-zinc-900 mb-3 flex items-center gap-2">
                  <LogOut className="w-5 h-5 text-teal-500" /> Exit Ticket Responses
                </h4>
                <div className="space-y-3">
                  <div className="bg-teal-50 p-4 rounded-xl border border-teal-100">
                    <p className="text-xs font-bold text-teal-600 uppercase mb-1">What was learned:</p>
                    <p className="text-zinc-700">{selectedStudent.exitTicketResponses?.learned || "No response yet."}</p>
                  </div>
                  <div className="bg-teal-50 p-4 rounded-xl border border-teal-100">
                    <p className="text-xs font-bold text-teal-600 uppercase mb-1">Remaining question:</p>
                    <p className="text-zinc-700">{selectedStudent.exitTicketResponses?.question || "No response yet."}</p>
                  </div>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setSelectedStudent(null)}
              className="w-full mt-8 bg-zinc-900 text-white font-bold py-4 rounded-xl hover:bg-zinc-800 transition-colors"
            >
              Close Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
