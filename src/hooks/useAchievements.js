import { useMemo } from 'react';
import { useAttendance } from './useAttendance';
import { useCalculator } from './useCalculator';
import { useSubjects } from './useSubjects';

export const ACHIEVEMENTS = [
  { id: 'first_class', title: 'First Class', description: 'Mark your very first attendance', icon: '🎯', color: 'text-blue-400 bg-blue-400/10 border-blue-400/30' },
  { id: 'streak_3', title: 'On Fire', description: 'Maintain a 3-day attendance streak', icon: '🔥', color: 'text-orange-400 bg-orange-400/10 border-orange-400/30' },
  { id: 'streak_7', title: 'Unstoppable', description: 'Maintain a 7-day attendance streak', icon: '⭐', color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30' },
  { id: 'safe_zone', title: 'Safe Zone', description: 'Get all subjects above 75%', icon: '🛡️', color: 'text-green-400 bg-green-400/10 border-green-400/30' },
  { id: 'bunk_master', title: 'Bunk Master', description: 'Bunk 10 classes in total', icon: '🥷', color: 'text-purple-400 bg-purple-400/10 border-purple-400/30' },
];

export function useAchievements() {
  const { records, getCurrentStreak, getSubjectStats } = useAttendance();
  const { subjects } = useSubjects();
  const { subjectStats, overallStats } = useCalculator(subjects, getSubjectStats);

  const unlockedIds = useMemo(() => {
    const unlocked = new Set();
    
    // First Class
    if (records.length > 0) unlocked.add('first_class');
    
    // Streaks
    const streak = getCurrentStreak();
    if (streak >= 3) unlocked.add('streak_3');
    if (streak >= 7) unlocked.add('streak_7');
    
    // Safe Zone (All subjects >= 75%)
    if (subjects.length > 0 && subjectStats.every(s => s.percent >= 75)) {
      unlocked.add('safe_zone');
    }
    
    // Bunk Master
    if (overallStats.totalAbsent >= 10) {
      unlocked.add('bunk_master');
    }

    return Array.from(unlocked);
  }, [records, subjects, subjectStats, overallStats]);

  const achievements = ACHIEVEMENTS.map(ach => ({
    ...ach,
    unlocked: unlockedIds.includes(ach.id)
  }));

  return { achievements, unlockedCount: unlockedIds.length, totalCount: ACHIEVEMENTS.length };
}
