import { useAchievements } from '../../hooks/useAchievements';
import Card from '../ui/Card';
import { Trophy } from 'lucide-react';

export default function AchievementsList() {
  const { achievements, unlockedCount, totalCount } = useAchievements();

  return (
    <Card className="border-[#27272a]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Trophy size={18} className="text-yellow-400" />
          <h3 className="font-heading font-semibold text-[var(--text-primary)]">
            Achievements
          </h3>
        </div>
        <span className="text-[10px] font-mono text-[#71717a] bg-[#111111] px-2 py-1 rounded border border-[#27272a]">
          {unlockedCount} / {totalCount} UNLOCKED
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {achievements.map((ach) => (
          <div 
            key={ach.id} 
            className={`flex items-start gap-3 p-3 rounded-xl border ${ach.unlocked ? ach.color : 'bg-[#111111] border-[#27272a] opacity-50 grayscale'}`}
          >
            <div className="text-2xl mt-0.5">{ach.icon}</div>
            <div>
              <h4 className={`font-medium text-sm ${ach.unlocked ? 'text-[#f4f4f5]' : 'text-[#71717a]'}`}>{ach.title}</h4>
              <p className="text-[11px] text-[#a1a1aa] leading-tight mt-0.5">{ach.description}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
