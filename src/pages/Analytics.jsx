import { useSubjects } from '../hooks/useSubjects';
import { useAttendance } from '../hooks/useAttendance';
import { useCalculator } from '../hooks/useCalculator';
import WeeklyBarChart from '../components/charts/WeeklyBarChart';
import MonthlyTrendChart from '../components/charts/MonthlyTrendChart';
import SubjectPieChart from '../components/charts/SubjectPieChart';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { Trophy, TrendingDown, Flame, Award } from 'lucide-react';

export default function Analytics() {
  const { subjects } = useSubjects();
  const { records, getCurrentStreak, getLongestStreak, getSubjectStats } = useAttendance();
  const { subjectStats, bestWorst, milestone } = useCalculator(subjects, getSubjectStats);

  const currentStreak = getCurrentStreak();
  const longestStreak = getLongestStreak();
  const totalBunks = subjectStats.reduce((sum, s) => sum + (s.total - s.present), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-[var(--text-primary)]">
          Analytics
        </h1>
        <p className="text-sm text-[var(--text-secondary)]">
          Insights, charts, and streaks
        </p>
      </div>

      {/* Streak & Highlights */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="text-center">
          <Flame size={24} className="text-[var(--accent-yellow)] mx-auto mb-1" />
          <p className="font-mono text-2xl font-bold text-[var(--text-primary)]">
            {currentStreak}
          </p>
          <p className="text-xs text-[var(--text-muted)]">Current Streak</p>
        </Card>
        <Card className="text-center">
          <Award size={24} className="text-[var(--accent-purple)] mx-auto mb-1" />
          <p className="font-mono text-2xl font-bold text-[var(--text-primary)]">
            {longestStreak}
          </p>
          <p className="text-xs text-[var(--text-muted)]">Longest Streak</p>
        </Card>
        <Card className="text-center">
          {bestWorst.best ? (
            <>
              <Trophy size={24} className="text-[var(--accent-green)] mx-auto mb-1" />
              <p className="font-mono text-lg font-bold text-[var(--accent-green)]">
                {bestWorst.best.percent.toFixed(1)}%
              </p>
              <p className="text-xs text-[var(--text-muted)] truncate">
                Best: {bestWorst.best.name}
              </p>
            </>
          ) : (
            <>
              <Trophy size={24} className="text-[var(--text-muted)] mx-auto mb-1" />
              <p className="text-sm text-[var(--text-muted)]">No data</p>
            </>
          )}
        </Card>
        <Card className="text-center">
          {bestWorst.worst ? (
            <>
              <TrendingDown size={24} className="text-[var(--accent-red)] mx-auto mb-1" />
              <p className="font-mono text-lg font-bold text-[var(--accent-red)]">
                {bestWorst.worst.percent.toFixed(1)}%
              </p>
              <p className="text-xs text-[var(--text-muted)] truncate">
                Worst: {bestWorst.worst.name}
              </p>
            </>
          ) : (
            <>
              <TrendingDown size={24} className="text-[var(--text-muted)] mx-auto mb-1" />
              <p className="text-sm text-[var(--text-muted)]">No data</p>
            </>
          )}
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <WeeklyBarChart records={records} />
        <MonthlyTrendChart records={records} />
      </div>

      <SubjectPieChart subjectStats={subjectStats} />

      {/* Bunk Leaderboard */}
      <Card>
        <h4 className="font-heading text-sm font-semibold text-[var(--text-primary)] mb-3">
          🏆 Bunk Leaderboard
        </h4>
        <div className="flex items-center gap-4 mb-4">
          <span className="text-3xl">{milestone?.emoji}</span>
          <div>
            <p className="font-heading font-semibold text-[var(--text-primary)]">
              {milestone?.label}
            </p>
            <p className="text-sm text-[var(--text-muted)]">
              You've safely bunked {totalBunks} classes this semester!
            </p>
          </div>
        </div>
        <div className="flex gap-4 text-center">
          {[
            { emoji: '🎯', count: 5, label: 'Strategic Skipper' },
            { emoji: '🦅', count: 10, label: 'Free Bird' },
            { emoji: '👑', count: 20, label: 'Bunk King' },
          ].map((m) => (
            <div
              key={m.count}
              className={`flex-1 py-2 rounded-lg ${
                totalBunks >= m.count
                  ? 'bg-[var(--accent-cyan)]/10 border border-[var(--accent-cyan)]/20'
                  : 'bg-[var(--bg-secondary)] opacity-40'
              }`}
            >
              <span className="text-xl">{m.emoji}</span>
              <p className="text-[10px] text-[var(--text-muted)] mt-0.5">{m.label}</p>
              <p className="text-[10px] text-[var(--text-muted)]">{m.count}+ bunks</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
