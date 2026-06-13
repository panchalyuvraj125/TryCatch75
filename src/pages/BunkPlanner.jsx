import { useState } from 'react';
import { useSubjects } from '../hooks/useSubjects';
import { useAttendance } from '../hooks/useAttendance';
import { useCalculator } from '../hooks/useCalculator';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

export default function BunkPlanner() {
  const { subjects } = useSubjects();
  const { getSubjectStats } = useAttendance();
  const { subjectStats, calculateWhatIf } = useCalculator(subjects, getSubjectStats);
  const [selectedSubject, setSelectedSubject] = useState(subjects[0]?.id || '');
  const [bunkCount, setBunkCount] = useState(1);
  const [attendCount, setAttendCount] = useState(1);

  const whatIf = selectedSubject ? calculateWhatIf(selectedSubject, bunkCount, attendCount) : null;
  const currentSubject = subjectStats.find(s => s.id === selectedSubject);

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-10">
      <div>
        <p className="text-[10px] tracking-widest text-[#71717a] font-mono uppercase mb-2">
          05 · PLANNER
        </p>
        <h1 className="font-heading text-4xl font-bold text-[#f4f4f5] tracking-tight">
          Bunk <span className="text-[var(--accent-orange)] italic font-medium">Planner</span>
        </h1>
        <p className="text-[14px] text-[#a1a1aa] mt-2">
          Know exactly how many classes you can afford to miss, or need to attend.
        </p>
      </div>

      {subjects.length > 0 ? (
        <div className="space-y-6">
          {/* Allowance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {subjectStats.map(subject => {
              const safeBunks = subject.bunksLeft;
              const needed = subject.classesNeeded;
              
              return (
                <Card key={subject.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-[#f4f4f5]">{subject.name}</h3>
                      <p className="text-[12px] text-[#71717a] mt-1">Current: {subject.percent.toFixed(0)}%</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-[#27272a]">
                    {subject.percent >= 75 ? (
                      <div>
                        <p className="text-[11px] text-[#71717a] uppercase tracking-wider mb-1 font-mono">Safe to Bunk</p>
                        <p className="text-2xl font-semibold text-[#34d399]">{safeBunks} classes</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-[11px] text-[#71717a] uppercase tracking-wider mb-1 font-mono">Must Attend</p>
                        <p className="text-2xl font-semibold text-[#ef4444]">{needed} consecutive</p>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>

          {/* What-If Calculator */}
          <Card>
            <h3 className="text-lg font-bold text-[#f4f4f5] mb-4">What-If Calculator</h3>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <label className="block text-[12px] text-[#a1a1aa] mb-2">Select Subject</label>
                <select 
                  className="w-full bg-[#111111] border border-[#27272a] rounded-lg px-4 py-2.5 text-[#f4f4f5] text-[13px] focus:outline-none focus:border-[var(--accent-orange)]"
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                >
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-[12px] text-[#a1a1aa] mb-2">If I Bunk...</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    min="0"
                    value={bunkCount}
                    onChange={(e) => setBunkCount(parseInt(e.target.value) || 0)}
                    className="w-full bg-[#111111] border border-[#27272a] rounded-lg px-4 py-2.5 text-[#f4f4f5] text-[13px] focus:outline-none focus:border-[var(--accent-orange)]"
                  />
                  <span className="text-[13px] text-[#71717a]">classes</span>
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-[12px] text-[#a1a1aa] mb-2">Or If I Attend...</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    min="0"
                    value={attendCount}
                    onChange={(e) => setAttendCount(parseInt(e.target.value) || 0)}
                    className="w-full bg-[#111111] border border-[#27272a] rounded-lg px-4 py-2.5 text-[#f4f4f5] text-[13px] focus:outline-none focus:border-[var(--accent-orange)]"
                  />
                  <span className="text-[13px] text-[#71717a]">classes</span>
                </div>
              </div>
            </div>

            {whatIf && currentSubject && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#111111] p-4 rounded-xl border border-[#27272a]">
                  <p className="text-[11px] text-[#71717a] uppercase tracking-wider mb-2 font-mono">After Bunking {bunkCount}</p>
                  <div className="flex items-end gap-3">
                    <span className={`text-3xl font-bold ${whatIf.afterBunk >= 75 ? 'text-[#34d399]' : 'text-[#ef4444]'}`}>
                      {whatIf.afterBunk.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="bg-[#111111] p-4 rounded-xl border border-[#27272a]">
                  <p className="text-[11px] text-[#71717a] uppercase tracking-wider mb-2 font-mono">After Attending {attendCount}</p>
                  <div className="flex items-end gap-3">
                    <span className={`text-3xl font-bold ${whatIf.afterAttend >= 75 ? 'text-[#34d399]' : 'text-[#ef4444]'}`}>
                      {whatIf.afterAttend.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-4xl mb-4">🧮</div>
          <h3 className="font-heading text-xl font-bold text-[#f4f4f5] mb-2 italic">
            No subjects yet
          </h3>
          <p className="text-[13px] text-[#a1a1aa]">
            Add subjects in the Dashboard to start planning your bunks.
          </p>
        </div>
      )}
    </div>
  );
}
