import { useEffect, useState } from 'react';
import { Bell, BellOff, AlertTriangle } from 'lucide-react';
import Card from '../ui/Card';
import { useTimetable } from '../../hooks/useTimetable';
import { useSubjects } from '../../hooks/useSubjects';
import { useAttendance } from '../../hooks/useAttendance';
import { useCalculator } from '../../hooks/useCalculator';

export default function DailyBriefing() {
  const { getTodaySchedule } = useTimetable();
  const { subjects } = useSubjects();
  const { getSubjectStats, isTodayMarked } = useAttendance();
  const { subjectStats } = useCalculator(subjects, getSubjectStats);
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [briefing, setBriefing] = useState(null);

  useEffect(() => {
    // Check notification permission on mount
    if ('Notification' in window) {
      setNotificationsEnabled(Notification.permission === 'granted');
    }

    // Generate daily briefing text
    const todayClasses = getTodaySchedule();
    if (todayClasses.length === 0) {
      setBriefing({ text: "No classes today. Enjoy your day off!", type: "info" });
      return;
    }

    if (isTodayMarked()) {
      setBriefing({ text: "You've already logged your attendance for today. Great job!", type: "success" });
      return;
    }

    // Find critical subjects
    const critical = [];
    todayClasses.forEach(period => {
      const stat = subjectStats.find(s => s.id === period.subjectId);
      if (stat && stat.percent < stat.targetAttendance) {
        critical.push(stat.name);
      }
    });

    const uniqueCritical = [...new Set(critical)];
    
    if (uniqueCritical.length > 0) {
      setBriefing({
        text: `You have ${todayClasses.length} classes today. Warning: Your attendance in ${uniqueCritical.join(', ')} is critically low. Do not skip!`,
        type: "danger"
      });
      
      // Trigger notification if enabled
      if (notificationsEnabled) {
        new Notification("TryCatch75 Alert", {
          body: `Critical low attendance in ${uniqueCritical[0]} today!`,
          icon: "/favicon.svg"
        });
      }
    } else {
      const firstClass = todayClasses[0];
      const firstSubject = subjects.find(s => s.id === firstClass.subjectId);
      setBriefing({
        text: `You have ${todayClasses.length} classes today. First class: ${firstSubject?.name || 'Unknown'} at ${firstClass.time}.`,
        type: "info"
      });
    }

  }, [getTodaySchedule, subjectStats, isTodayMarked, subjects, notificationsEnabled]);

  const requestPermission = async () => {
    if (!('Notification' in window)) return;
    const permission = await Notification.requestPermission();
    setNotificationsEnabled(permission === 'granted');
  };

  if (!briefing) return null;

  return (
    <Card className="mb-6 bg-gradient-to-r from-[#18181b] to-[#111111] border-[#27272a]">
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-full flex-shrink-0 ${briefing.type === 'danger' ? 'bg-red-500/10 text-red-500' : 'bg-[var(--accent-orange)]/10 text-[var(--accent-orange)]'}`}>
          {briefing.type === 'danger' ? <AlertTriangle size={20} /> : <Bell size={20} />}
        </div>
        <div className="flex-1">
          <h3 className="text-[14px] font-bold text-[#f4f4f5] mb-1">Daily Briefing</h3>
          <p className="text-[13px] text-[#a1a1aa] leading-relaxed">
            {briefing.text}
          </p>
          
          {'Notification' in window && !notificationsEnabled && (
            <button 
              onClick={requestPermission}
              className="mt-3 flex items-center gap-1.5 text-[11px] font-mono tracking-wider text-[var(--accent-orange)] hover:text-[#e05b29] transition-colors"
            >
              <BellOff size={12} />
              ENABLE SMART ALERTS
            </button>
          )}
        </div>
      </div>
    </Card>
  );
}
