import { useState } from 'react';
import Card from '../ui/Card';
import { weeklyBunkBudget } from '../../utils/attendanceCalc';

export default function RecoveryPlanner({ subjectStats = [], threshold = 75 }) {
  const [daysLeft, setDaysLeft] = useState(60);
  const [subjectsPerDay, setSubjectsPerDay] = useState(5);

  const belowThreshold = subjectStats.filter(
    (s) => s.total > 0 && s.percent < threshold
  );

  const safeSubjects = subjectStats.filter(
    (s) => s.total > 0 && s.percent >= threshold
  );

  return (
    <div className="space-y-3">
      <h3 className="font-heading text-lg font-semibold text-[var(--text-primary)]">
        📅 Semester Planner
      </h3>
      <p className="text-sm text-[var(--text-secondary)]">
        Plan your attendance for the remaining semester
      </p>

      {/* Inputs */}
      <Card>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-[var(--text-muted)] mb-1">
              Working Days Left
            </label>
            <input
              type="number"
              min="1"
              max="180"
              value={daysLeft}
              onChange={(e) => setDaysLeft(parseInt(e.target.value) || 1)}
              className="cyber-input"
            />
          </div>
          <div>
            <label className="block text-xs text-[var(--text-muted)] mb-1">
              Avg. Subjects/Day
            </label>
            <input
              type="number"
              min="1"
              max="8"
              value={subjectsPerDay}
              onChange={(e) => setSubjectsPerDay(parseInt(e.target.value) || 1)}
              className="cyber-input"
            />
          </div>
        </div>
      </Card>

      {/* Recovery Section */}
      {belowThreshold.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-[var(--accent-red)] mb-2">
            🚨 Recovery Required ({belowThreshold.length} subjects)
          </h4>
          <div className="space-y-2">
            {belowThreshold.map((subject) => (
              <Card key={subject.id} variant="critical">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm text-[var(--text-primary)]">
                      {subject.name}
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">
                      Currently: {subject.percent.toFixed(1)}%
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-xl font-bold text-[var(--accent-red)]">
                      {subject.classesNeeded}
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">
                      classes to attend
                    </p>
                  </div>
                </div>
                {/* Visual timeline */}
                <div className="flex gap-0.5 mt-2">
                  {Array.from({ length: Math.min(subject.classesNeeded, 30) }).map((_, i) => (
                    <div
                      key={i}
                      className="h-2 flex-1 rounded-full bg-[var(--accent-green)]/40"
                      title={`Class ${i + 1}`}
                    />
                  ))}
                  {subject.classesNeeded > 30 && (
                    <span className="text-[10px] text-[var(--text-muted)] ml-1">
                      +{subject.classesNeeded - 30}
                    </span>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Weekly Bunk Budget */}
      {safeSubjects.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-[var(--accent-green)] mb-2">
            ✅ Weekly Bunk Budget
          </h4>
          <div className="space-y-2">
            {safeSubjects.map((subject) => {
              const budget = weeklyBunkBudget(
                subject.present,
                subject.total,
                daysLeft,
                subjectsPerDay,
                threshold
              );
              return (
                <Card key={subject.id} variant="safe">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm text-[var(--text-primary)]">
                        {subject.name}
                      </p>
                      <p className="text-xs text-[var(--text-muted)]">
                        {subject.percent.toFixed(1)}% · {subject.bunksLeft} immediate bunks left
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-xl font-bold text-[var(--accent-green)]">
                        {budget}
                      </p>
                      <p className="text-xs text-[var(--text-muted)]">
                        bunks/week
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
