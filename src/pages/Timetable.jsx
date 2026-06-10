import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Plus, X } from 'lucide-react';
import { useSubjects } from '../hooks/useSubjects';
import { useTimetable } from '../hooks/useTimetable';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { DAYS_OF_WEEK, DAY_FULL_LABELS, MAX_PERIODS } from '../utils/constants';
import toast from 'react-hot-toast';

const TIME_SLOTS = [
  '09:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '01:00 PM',
  '02:00 PM',
  '03:00 PM',
  '04:00 PM',
];

export default function Timetable() {
  const { subjects } = useSubjects();
  const { timetable, setDaySchedule, getDaySchedule } = useTimetable();
  const [activeDay, setActiveDay] = useState('monday');
  const [editMode, setEditMode] = useState(false);
  const [periods, setPeriods] = useState([]);

  const currentPeriods = getDaySchedule(activeDay);

  const startEditing = () => {
    setPeriods(
      currentPeriods.length > 0
        ? [...currentPeriods]
        : TIME_SLOTS.map((time) => ({ time, subjectId: '', room: '' }))
    );
    setEditMode(true);
  };

  const handleSave = async () => {
    try {
      const filtered = periods.filter((p) => p.subjectId);
      await setDaySchedule(activeDay, filtered);
      setEditMode(false);
      toast.success(`${DAY_FULL_LABELS[activeDay]} timetable saved!`);
    } catch (error) {
      toast.error('Failed to save timetable');
    }
  };

  const updatePeriod = (index, field, value) => {
    const updated = [...periods];
    updated[index] = { ...updated[index], [field]: value };
    setPeriods(updated);
  };

  const addPeriod = () => {
    if (periods.length < MAX_PERIODS) {
      setPeriods([...periods, { time: '', subjectId: '', room: '' }]);
    }
  };

  const removePeriod = (index) => {
    setPeriods(periods.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex flex-col">
        <p className="text-[10px] tracking-widest text-[#71717a] font-mono uppercase mb-2">
          04 · SCHEDULE
        </p>
        <h1 className="font-heading text-4xl font-bold text-[#f4f4f5] tracking-tight mb-6">
          Timetable <span className="text-[var(--accent-orange)] italic font-medium">setup</span>
        </h1>
        <p className="text-[14px] text-[#a1a1aa] mb-8">
          Build your weekly schedule. Click any day to edit its slots. Data is local to this device.
        </p>
      </div>

      {/* Day Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {DAYS_OF_WEEK.map((day) => {
          const isActive = activeDay === day;
          return (
            <button
              key={day}
              onClick={() => {
                setActiveDay(day);
                setEditMode(false);
              }}
              className={`px-5 py-2.5 rounded-lg text-[13px] font-medium whitespace-nowrap transition-all border
                ${isActive
                  ? 'bg-[var(--accent-orange)] text-white border-[var(--accent-orange)]'
                  : 'bg-[#18181b] text-[#a1a1aa] border-[#27272a] hover:bg-[#1f1f24] hover:text-[#f4f4f5]'
                }`}
            >
              {DAY_FULL_LABELS[day]}
            </button>
          );
        })}
      </div>

      {/* Timetable Editor Card */}
      <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-5 shadow-lg">
        {/* Add New Slot Row */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <select 
            className="flex-1 min-w-[140px] bg-[#111111] border border-[#27272a] rounded-lg px-4 py-2.5 text-[#f4f4f5] text-[13px] focus:outline-none focus:border-[var(--accent-orange)]"
            onChange={(e) => {
              if(e.target.value) {
                // If we want to add right away, we could handle it here, but let's stick to state or a button
                addPeriod();
                updatePeriod(periods.length, 'subjectId', e.target.value);
              }
            }}
            value=""
          >
            <option value="" disabled>Subject (e.g. PPS)</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Time (e.g. 09:00)"
            className="w-32 bg-[#111111] border border-[#27272a] rounded-lg px-4 py-2.5 text-[#f4f4f5] text-[13px] focus:outline-none focus:border-[var(--accent-orange)]"
          />

          <select className="bg-[#111111] border border-[#27272a] rounded-lg px-4 py-2.5 text-[#f4f4f5] text-[13px] focus:outline-none focus:border-[var(--accent-orange)]">
            <option>Theory</option>
            <option>Practical</option>
          </select>

          <select className="w-20 bg-[#111111] border border-[#27272a] rounded-lg px-4 py-2.5 text-[#f4f4f5] text-[13px] focus:outline-none focus:border-[var(--accent-orange)]">
            <option>1 hr</option>
            <option>2 hr</option>
          </select>

          <button 
            onClick={() => {
              if(!editMode) startEditing();
              addPeriod();
            }}
            className="bg-[var(--accent-orange)] text-white px-4 py-2.5 rounded-lg text-[13px] font-medium hover:bg-[#e05b29] transition-colors whitespace-nowrap"
          >
            + Add slot
          </button>
        </div>

        {/* Existing Slots List */}
        <div className="space-y-3">
          {(editMode ? periods : currentPeriods).length > 0 ? (
            (editMode ? periods : currentPeriods).map((period, i) => {
              const subject = subjects.find((s) => s.id === period.subjectId);
              return (
                <div
                  key={i}
                  className="flex items-center justify-between py-3 px-4 rounded-lg bg-[#111111] border border-[#27272a] group hover:border-[#3f3f46] transition-colors"
                >
                  <div className="flex items-center gap-6">
                    <span className="font-mono text-[12px] text-[#71717a] w-28">
                      {period.time || `08:00 - 09:00`}
                    </span>
                    <span className="font-bold text-[14px] text-[#f4f4f5]">
                      {subject?.name || 'Free Period'}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    {subject?.type === 'theory' ? (
                      <span className="text-[10px] font-mono tracking-widest text-[#f59e0b] bg-[#f59e0b]/10 px-2 py-1 rounded">THEORY</span>
                    ) : subject?.type === 'practical' ? (
                      <span className="text-[10px] font-mono tracking-widest text-[#34d399] bg-[#34d399]/10 px-2 py-1 rounded">PRACTICAL</span>
                    ) : null}
                    
                    <span className="text-[12px] text-[#71717a] font-mono w-8 text-right">1hr</span>
                    
                    <button
                      onClick={() => {
                        if(!editMode) startEditing();
                        removePeriod(i);
                      }}
                      className="p-1.5 text-[#71717a] border border-[#27272a] rounded hover:text-[#ef4444] hover:border-[#ef4444] transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8">
              <p className="text-[13px] text-[#71717a]">No slots configured for this day.</p>
            </div>
          )}
        </div>
        
        {editMode && (
          <div className="mt-6 flex justify-end gap-3 pt-6 border-t border-[#27272a]">
            <button 
              onClick={() => setEditMode(false)}
              className="px-4 py-2 text-[13px] font-medium text-[#a1a1aa] hover:text-[#f4f4f5]"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="px-4 py-2 bg-white text-black text-[13px] font-medium rounded-lg hover:bg-gray-200"
            >
              Save Schedule
            </button>
          </div>
        )}
      </div>

      {subjects.length === 0 && (
        <p className="text-[12px] text-[#71717a] text-center mt-6">
          Add subjects first before setting up your timetable.
        </p>
      )}
    </div>
  );
}
