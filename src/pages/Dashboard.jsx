import { motion } from 'framer-motion';
import { useSubjects } from '../hooks/useSubjects';
import { useAttendance } from '../hooks/useAttendance';
import { useCalculator } from '../hooks/useCalculator';
import SubjectCard from '../components/dashboard/SubjectCard';
import OverallStats from '../components/dashboard/OverallStats';
import AlertBanner from '../components/dashboard/AlertBanner';
import DailyBriefing from '../components/dashboard/DailyBriefing';
import AIAdvisor from '../components/ai/AIAdvisor';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Plus, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDateKey } from '../utils/dateHelpers';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { subjects } = useSubjects();
  const {
    records,
    markAttendance,
    getSubjectStats,
    isTodayMarked,
    getCurrentStreak,
    getLongestStreak,
  } = useAttendance();

  const { subjectStats, overallStats, risk, milestone } = useCalculator(
    subjects,
    getSubjectStats
  );

  const handleQuickMark = async (subjectId, status) => {
    try {
      await markAttendance(new Date(), subjectId, status);
      toast.success(
        status === 'present'
          ? '✅ Marked present!'
          : status === 'absent'
          ? '❌ Marked absent'
          : '🏥 Marked medical leave'
      );
    } catch (error) {
      toast.error('Failed to mark attendance');
    }
  };

  const todayStr = formatDateKey(new Date());
  const todayMarked = isTodayMarked();

  return (
    <div className="space-y-8 max-w-3xl mx-auto pb-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-[10px] tracking-widest text-[#71717a] font-mono uppercase mb-2">
            02 · NUMBERS
          </p>
          <h1 className="font-heading text-4xl font-bold text-[#f4f4f5] tracking-tight">
            My <span className="text-[var(--accent-orange)] italic font-medium">stats</span>
          </h1>
        </div>
        <div className="flex gap-2">
          <Link to="/subjects" className="bg-[var(--accent-cyan)]/10 text-[var(--accent-cyan)] border border-[var(--accent-cyan)]/30 px-4 py-2 rounded-lg text-[13px] hover:bg-[var(--accent-cyan)]/20 transition-colors flex items-center gap-2 font-medium" id="manage-subjects-btn">
            Manage Subjects
          </Link>
          {subjects.length > 0 && (
            <button className="bg-[#111111] border border-[#27272a] text-[#a1a1aa] px-4 py-2 rounded-lg text-[13px] hover:text-[#f4f4f5] hover:bg-[#18181b] transition-colors flex items-center gap-2">
              <span className="font-mono">↓</span> Export CSV
            </button>
          )}
        </div>
      </div>

      {/* Alerts */}
      <AlertBanner subjectStats={subjectStats} isTodayMarked={todayMarked} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DailyBriefing />
        <AIAdvisor subjectStats={subjectStats} overallStats={overallStats} />
      </div>

      {/* Overall Stats */}
      {subjects.length > 0 && (
        <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center gap-8 shadow-sm">
          <div className="relative w-40 h-40 flex-shrink-0">
            {/* Simple circular progress visualization */}
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#27272a" strokeWidth="8" />
              <circle 
                cx="50" cy="50" r="45" fill="none" 
                stroke={overallStats.overallPercent >= 75 ? "#34d399" : "#ef4444"} 
                strokeWidth="8" 
                strokeLinecap="round"
                strokeDasharray={`${(overallStats.overallPercent || 0) * 2.827} 282.7`}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-[#f4f4f5]">{overallStats.overallPercent.toFixed(0)}%</span>
              <span className="text-[10px] text-[#71717a] uppercase tracking-wider mt-1 font-mono">OVERALL</span>
            </div>
          </div>

          <div className="flex-1 w-full grid grid-cols-2 gap-4">
            <div className="bg-[#111111] p-4 rounded-xl border border-[#27272a]">
              <p className="text-[11px] text-[#71717a] uppercase tracking-wider mb-1 font-mono">Present</p>
              <p className="text-2xl font-semibold text-[#f4f4f5]">{overallStats.totalPresent}</p>
            </div>
            <div className="bg-[#111111] p-4 rounded-xl border border-[#27272a]">
              <p className="text-[11px] text-[#71717a] uppercase tracking-wider mb-1 font-mono">Bunked</p>
              <p className="text-2xl font-semibold text-[#f4f4f5]">{overallStats.totalAbsent}</p>
            </div>
            <div className="bg-[#111111] p-4 rounded-xl border border-[#27272a]">
              <p className="text-[11px] text-[#71717a] uppercase tracking-wider mb-1 font-mono">Current Streak</p>
              <p className="text-2xl font-semibold text-[#f4f4f5]">{getCurrentStreak()} 🔥</p>
            </div>
            <div className="bg-[#111111] p-4 rounded-xl border border-[#27272a]">
              <p className="text-[11px] text-[#71717a] uppercase tracking-wider mb-1 font-mono">Status</p>
              <p className={`text-sm font-medium mt-1.5 ${overallStats.overallPercent >= 75 ? 'text-[#34d399]' : 'text-[#ef4444]'}`}>
                {overallStats.overallPercent >= 75 ? 'Safe zone' : 'Critical danger'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Subject Cards */}
      {subjects.length > 0 ? (
        <div>
          <h2 className="text-[15px] font-medium text-[#f4f4f5] mb-4">
            Subject breakdown
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {subjectStats.map((subject, i) => {
              const absentCount = subject.total - subject.present;
              return (
                <div key={subject.id} className="bg-[#18181b] border border-[#27272a] rounded-xl p-5 hover:border-[#3f3f46] transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-[15px] font-medium text-[#f4f4f5]">{subject.name}</h3>
                      <p className="text-[12px] text-[#71717a] mt-1">{subject.present} attended · {absentCount} bunked</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-[20px] font-bold ${subject.percent >= 75 ? 'text-[#34d399]' : 'text-[#ef4444]'}`}>
                        {subject.percent.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                  
                  {/* Mini progress bar */}
                  <div className="w-full bg-[#27272a] h-1.5 rounded-full overflow-hidden mb-4">
                    <div 
                      className={`h-full rounded-full ${subject.percent >= 75 ? 'bg-[#34d399]' : 'bg-[#ef4444]'}`}
                      style={{ width: `${Math.min(subject.percent, 100)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-[#a1a1aa]">Target: 75%</span>
                    <span className="text-[#71717a]">
                      {subject.percent >= 75 
                        ? `Can bunk ${Math.floor((subject.present - 3 * absentCount) / 3)} more`
                        : `Need ${Math.ceil((3 * absentCount - subject.present))} more`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16">
          <div className="text-4xl mb-4">📒</div>
          <h3 className="font-heading text-xl font-bold text-[#f4f4f5] mb-2 italic">
            The notebook is blank.
          </h3>
          <p className="text-[13px] text-[#a1a1aa]">
            Log your first day to populate stats.
          </p>
        </div>
      )}
    </div>
  );
}
