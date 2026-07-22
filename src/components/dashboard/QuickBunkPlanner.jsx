import { motion } from 'framer-motion';
import { Target, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function QuickBunkPlanner({ subjectStats = [] }) {
  if (subjectStats.length === 0) return null;

  const totalSafeBunks = subjectStats.reduce((acc, s) => acc + (s.bunksLeft || 0), 0);
  
  const criticalSubjects = subjectStats.filter(s => s.percent < 75 && s.total > 0);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#18181b] border border-[#27272a] rounded-2xl p-6 shadow-sm mb-6 flex flex-col md:flex-row gap-6 items-center"
    >
      <div className="flex-shrink-0 flex flex-col items-center justify-center p-4 bg-[#111111] rounded-xl border border-[#27272a] w-full md:w-auto min-w-[140px]">
        <Target className="text-[var(--accent-green)] mb-2" size={24} />
        <span className="text-3xl font-bold text-[var(--accent-green)] drop-shadow-[0_0_10px_rgba(52,211,153,0.3)]">{totalSafeBunks}</span>
        <span className="text-[10px] text-[#a1a1aa] uppercase tracking-wider font-mono mt-1">Safe Bunks</span>
      </div>

      <div className="flex-1 w-full">
        <h3 className="text-[15px] font-medium text-[#f4f4f5] mb-2 flex items-center gap-2">
          Weekly Bunk Planner Simulation
        </h3>
        
        {criticalSubjects.length > 0 ? (
          <div className="space-y-2 mt-3">
            {criticalSubjects.map(s => (
              <div key={s.id} className="flex justify-between items-center bg-[#ef4444]/10 border border-[#ef4444]/20 p-2.5 rounded-lg">
                <span className="text-[13px] text-[#f4f4f5] flex items-center gap-1.5">
                  <AlertTriangle size={14} className="text-[#ef4444]" />
                  {s.name}
                </span>
                <span className="text-[13px] font-medium text-[#ef4444]">
                  Attend next {s.classesNeeded} classes
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[13px] text-[#a1a1aa]">
            All clear! You are safely above 75% in all subjects. You can afford to miss up to {totalSafeBunks} total classes without dropping into the danger zone.
          </p>
        )}

        <div className="mt-4 flex justify-end">
          <Link to="/bunk-planner" className="text-[12px] text-[var(--accent-cyan)] hover:underline font-medium">
            Open Advanced Planner →
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
