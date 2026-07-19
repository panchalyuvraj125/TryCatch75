import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Clock, Umbrella, CheckCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSubjects } from '../hooks/useSubjects';
import { useAttendance } from '../hooks/useAttendance';
import { useTimetable } from '../hooks/useTimetable';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { formatDateKey, formatDisplay, getDayName } from '../utils/dateHelpers';
import { ATTENDANCE_STATUS, SUBJECT_TYPE_LABELS } from '../utils/constants';
import { format, addDays, subDays } from 'date-fns';
import toast from 'react-hot-toast';

const statusOptions = [
  { value: 'present', label: 'Present', icon: Check, color: 'var(--accent-green)' },
  { value: 'absent', label: 'Absent', icon: X, color: 'var(--accent-red)' },
  { value: 'holiday', label: 'Holiday', icon: Umbrella, color: 'var(--accent-yellow)' },
  { value: 'medical', label: 'Medical', icon: Clock, color: 'var(--accent-purple)' },
];

export default function MarkAttendance() {
  const { subjects } = useSubjects();
  const { records, markAttendance, bulkMark, getRecordsByDate } = useAttendance();
  const { getTodaySubjectIds, getDaySchedule } = useTimetable();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [notes, setNotes] = useState({});
  const [showExtraClass, setShowExtraClass] = useState(false);
  const [extraSubjectId, setExtraSubjectId] = useState('');

  const dateStr = formatDateKey(selectedDate);
  const dayName = getDayName(selectedDate);
  const dayRecords = useMemo(() => getRecordsByDate(dateStr), [getRecordsByDate, dateStr]);

  // Get subjects for the selected day from timetable, or show all
  const daySchedule = getDaySchedule(dayName);
  const timetableSubjectIds = [...new Set(daySchedule.filter((p) => p.subjectId).map((p) => p.subjectId))];
  const displaySubjects = timetableSubjectIds.length > 0
    ? subjects.filter((s) => timetableSubjectIds.includes(s.id))
    : subjects;

  const getRecordStatus = (subjectId) => {
    const record = dayRecords.find((r) => (r.subjectId || r.subject_id) === subjectId);
    return record?.status || null;
  };

  // Extra subjects are those that have records today but aren't in timetable, 
  // OR the user explicitly wants to add them.
  const extraRecordsIds = dayRecords
    .filter(r => !timetableSubjectIds.includes((r.subjectId || r.subject_id)))
    .map(r => (r.subjectId || r.subject_id));
  const finalDisplaySubjects = subjects.filter(s => 
    timetableSubjectIds.includes(s.id) || extraRecordsIds.includes(s.id)
  );
  
  const availableExtraSubjects = subjects.filter(s => !finalDisplaySubjects.some(fs => fs.id === s.id));

  const handleMark = async (subjectId, status) => {
    try {
      await markAttendance(dateStr, subjectId, status, notes[subjectId] || '');
      const statusEmoji = { present: '✅', absent: '❌', holiday: '🏖️', medical: '🏥', official: '🏆' };
      toast.success(`${statusEmoji[status] || '✓'} Marked ${status}`);
    } catch (error) {
      toast.error('Failed to mark attendance');
    }
  };

  const handleBulkMark = async (status) => {
    const subjectIds = finalDisplaySubjects.map((s) => s.id);
    try {
      await bulkMark(dateStr, subjectIds, status);
      toast.success(
        status === 'present'
          ? '✅ All marked present!'
          : '🏖️ College holiday marked!'
      );
    } catch (error) {
      toast.error('Bulk marking failed');
    }
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto pb-10">
      {/* Header */}
      <div>
        <p className="text-[10px] tracking-widest text-[#71717a] font-mono uppercase mb-2">
          01 · TODAY
        </p>
        <h1 className="font-heading text-4xl font-bold text-[#f4f4f5] tracking-tight">
          Daily <span className="text-[var(--accent-orange)] italic font-medium">check-in</span>
        </h1>
      </div>

      {/* Date Navigation */}
      <div className="flex items-center justify-between border-b border-[#27272a] pb-6">
        <button
          onClick={() => setSelectedDate(subDays(selectedDate, 1))}
          className="text-[#a1a1aa] hover:text-white transition-colors"
        >
          <ChevronLeft size={24} />
        </button>

        <div className="text-center relative">
          <input
            type="date"
            value={dateStr}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
            className="absolute inset-0 opacity-0 cursor-pointer w-full"
          />
          <h2 className="text-[20px] font-semibold text-[#f4f4f5] pointer-events-none">
            {format(selectedDate, 'dd MMM yyyy')}
          </h2>
        </div>

        <button
          onClick={() => setSelectedDate(addDays(selectedDate, 1))}
          className="text-[#a1a1aa] hover:text-white transition-colors"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Quick Actions & Holiday Toggle */}
      <div className="space-y-4">
        <div className="flex items-center justify-between bg-[#111111] p-3 rounded-lg border border-[#27272a]">
          <span className="text-[14px] text-[#a1a1aa]">Mark this day as a holiday / leave</span>
          <button 
            onClick={() => handleBulkMark('holiday')}
            className="w-10 h-6 rounded-full bg-[#27272a] relative transition-colors duration-300"
          >
            <span className="absolute left-1 top-1 w-4 h-4 bg-[#71717a] rounded-full" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => handleBulkMark('present')}
            className="py-2.5 rounded-lg border border-[#27272a] text-[#34d399] text-[13px] font-medium hover:bg-[#34d399]/10 transition-colors"
          >
            All present
          </button>
          <button
            onClick={() => handleBulkMark('absent')}
            className="py-2.5 rounded-lg border border-[#27272a] text-[#ef4444] text-[13px] font-medium hover:bg-[#ef4444]/10 transition-colors"
          >
            All bunked
          </button>
          <button
            onClick={() => handleBulkMark('clear')}
            className="py-2.5 rounded-lg border border-[#27272a] text-[#a1a1aa] text-[13px] font-medium hover:bg-[#27272a] transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Subjects List */}
      <div>
        <h3 className="text-[15px] font-medium text-[#f4f4f5] mb-4">
          {format(selectedDate, 'EEEE')}'s Subjects
        </h3>

        {finalDisplaySubjects.length > 0 ? (
          <div className="space-y-3">
            {finalDisplaySubjects.map((subject, i) => {
              const currentStatus = getRecordStatus(subject.id);
              // Fallback to "holiday" or "medical" acting like cancelled for simplicity in UI matching
              
              return (
                <div
                  key={subject.id}
                  className="bg-[#18181b] border border-[#27272a] rounded-xl overflow-hidden shadow-sm"
                >
                  <div className="flex border-l-4" style={{ 
                    borderColor: currentStatus === 'present' ? '#34d399' : currentStatus === 'absent' ? '#ef4444' : 'transparent' 
                  }}>
                    <div className="p-4 flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      
                      {/* Subject Info */}
                      <div>
                        <h4 className="text-[15px] font-medium text-[#f4f4f5] leading-tight">
                          {subject.name}
                        </h4>
                        <div className="flex items-center gap-3 mt-1.5 text-[12px] text-[#71717a]">
                          <span>{SUBJECT_TYPE_LABELS[subject.type] || 'Theory'}</span>
                          <span className="w-1 h-1 rounded-full bg-[#3f3f46]"></span>
                          <span className="font-mono">1hr</span>
                        </div>
                      </div>

                      {/* Marking Buttons */}
                      <div className="flex bg-[#111111] p-1 rounded-lg border border-[#27272a] self-start sm:self-auto">
                        <button
                          onClick={() => handleMark(subject.id, 'present')}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-medium transition-all ${
                            currentStatus === 'present' 
                              ? 'bg-[#34d399]/10 text-[#34d399]' 
                              : 'text-[#71717a] hover:text-[#a1a1aa]'
                          }`}
                        >
                          <Check size={14} /> Present
                        </button>
                        <button
                          onClick={() => handleMark(subject.id, 'absent')}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-medium transition-all ${
                            currentStatus === 'absent' 
                              ? 'bg-[#ef4444]/10 text-[#ef4444]' 
                              : 'text-[#71717a] hover:text-[#a1a1aa]'
                          }`}
                        >
                          <X size={14} /> Bunked
                        </button>
                        <select
                          value={currentStatus && !['present', 'absent'].includes(currentStatus) ? currentStatus : ''}
                          onChange={(e) => {
                            if (e.target.value) handleMark(subject.id, e.target.value);
                          }}
                          className={`bg-transparent text-[12px] font-medium ml-2 outline-none cursor-pointer ${
                            currentStatus && !['present', 'absent'].includes(currentStatus) 
                              ? 'text-[#f4f4f5]' 
                              : 'text-[#71717a] hover:text-[#a1a1aa]'
                          }`}
                        >
                          <option value="" disabled>More...</option>
                          <option value="holiday">Class Cancelled</option>
                          <option value="medical">Medical Leave</option>
                          <option value="official">Official Leave</option>
                        </select>
                      </div>

                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-8 text-center">
            <p className="text-[13px] text-[#71717a]">
              No subjects scheduled for this day.
            </p>
          </div>
        )}
      </div>

      {/* Extra Class Button */}
      {availableExtraSubjects.length > 0 && (
        <div className="pt-4 border-t border-[#27272a]">
          <button
            onClick={() => setShowExtraClass(!showExtraClass)}
            className="text-[13px] text-[var(--accent-cyan)] font-medium hover:underline"
          >
            + Add Extra Class
          </button>
          
          {showExtraClass && (
            <div className="mt-4 flex gap-2">
              <select 
                className="bg-[#111111] border border-[#27272a] text-[#f4f4f5] px-3 py-2 rounded-lg text-[13px] flex-1"
                value={extraSubjectId}
                onChange={(e) => setExtraSubjectId(e.target.value)}
              >
                <option value="">Select subject...</option>
                {availableExtraSubjects.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
              <Button 
                size="sm" 
                disabled={!extraSubjectId}
                onClick={() => {
                  handleMark(extraSubjectId, 'present');
                  setShowExtraClass(false);
                  setExtraSubjectId('');
                }}
              >
                Add
              </Button>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
