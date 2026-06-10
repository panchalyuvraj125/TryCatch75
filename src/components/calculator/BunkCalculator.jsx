import Card from '../ui/Card';
import Badge from '../ui/Badge';

export default function BunkCalculator({ subjectStats = [], threshold = 75 }) {
  const subjectsWithClasses = subjectStats.filter((s) => s.total > 0);

  if (subjectsWithClasses.length === 0) {
    return (
      <Card className="text-center py-8">
        <p className="text-[var(--text-muted)]">
          No attendance data yet. Start marking attendance to see your bunk budget!
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="font-heading text-lg font-semibold text-[var(--text-primary)]">
        🎯 Safe Bunk Calculator
      </h3>
      <p className="text-sm text-[var(--text-secondary)] mb-4">
        How many more classes can you skip and still stay at {threshold}%?
      </p>

      {subjectsWithClasses.map((subject) => {
        const maxBunks = subject.bunksLeft || 0;
        const barPercent = Math.min(100, (maxBunks / Math.max(1, subject.total * 0.25)) * 100);

        return (
          <Card key={subject.id} variant={subject.status}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-[var(--text-primary)] text-sm">
                {subject.name}
              </span>
              <Badge variant={subject.status} size="xs">
                {subject.percent.toFixed(1)}%
              </Badge>
            </div>

            {/* Bunk Budget Bar */}
            <div className="relative w-full h-6 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out flex items-center justify-end pr-2"
                style={{
                  width: `${Math.max(barPercent, 5)}%`,
                  background:
                    subject.status === 'safe'
                      ? 'linear-gradient(90deg, rgba(0,255,136,0.3), rgba(0,255,136,0.6))'
                      : subject.status === 'danger'
                      ? 'linear-gradient(90deg, rgba(255,215,0,0.3), rgba(255,215,0,0.6))'
                      : 'linear-gradient(90deg, rgba(255,68,68,0.3), rgba(255,68,68,0.6))',
                }}
              />
              <span className="absolute inset-0 flex items-center justify-center text-xs font-mono font-bold text-[var(--text-primary)]">
                {maxBunks > 0
                  ? `${maxBunks} class${maxBunks !== 1 ? 'es' : ''} you can bunk`
                  : subject.status === 'safe'
                  ? 'No bunks left — attend all!'
                  : `Attend ${subject.classesNeeded} to recover`}
              </span>
            </div>

            {/* Detail stats */}
            <div className="flex items-center gap-4 mt-2 text-xs text-[var(--text-muted)]">
              <span>
                Present: <strong className="text-[var(--text-secondary)]">{subject.present}</strong>
              </span>
              <span>
                Total: <strong className="text-[var(--text-secondary)]">{subject.total}</strong>
              </span>
              <span>
                Absent: <strong className="text-[var(--text-secondary)]">{subject.absent}</strong>
              </span>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
