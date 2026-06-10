import { useMemo } from 'react';
import {
  currentPercent,
  safeBunks,
  classesNeeded,
  whatIfBunk,
  whatIfAttend,
  weeklyBunkBudget,
  getStatus,
  getStatusMessage,
  semesterProjection,
  detentionRisk,
  bunkMilestone,
} from '../utils/attendanceCalc';

/**
 * Hook that wraps pure attendance math functions with subject/attendance data
 * Provides computed properties for dashboard and calculator pages
 */
export function useCalculator(subjects, getSubjectStats, threshold = 75) {
  /**
   * Calculate stats for each subject
   */
  const subjectStats = useMemo(() => {
    return subjects.map((subject) => {
      const stats = getSubjectStats(subject.id);
      const percent = currentPercent(stats.present, stats.total);
      const status = getStatus(percent, threshold);
      const statusMessage = getStatusMessage(percent, threshold);
      const bunksLeft = safeBunks(stats.present, stats.total, threshold);
      const needed = classesNeeded(stats.present, stats.total, threshold);

      return {
        ...subject,
        ...stats,
        percent,
        status,
        statusMessage,
        bunksLeft,
        classesNeeded: needed,
      };
    });
  }, [subjects, getSubjectStats, threshold]);

  /**
   * Overall cumulative stats
   */
  const overallStats = useMemo(() => {
    const totalPresent = subjectStats.reduce((sum, s) => sum + s.present, 0);
    const totalClasses = subjectStats.reduce((sum, s) => sum + s.total, 0);
    const overallPercent = currentPercent(totalPresent, totalClasses);
    const overallStatus = getStatus(overallPercent, threshold);
    const overallMessage = getStatusMessage(overallPercent, threshold);

    return {
      totalPresent,
      totalClasses,
      totalAbsent: totalClasses - totalPresent,
      overallPercent,
      overallStatus,
      overallMessage,
      subjectCount: subjectStats.length,
    };
  }, [subjectStats, threshold]);

  /**
   * Detention risk calculation
   */
  const risk = useMemo(() => {
    const subjectData = subjectStats.map((s) => ({
      present: s.present,
      total: s.total,
    }));
    return detentionRisk(subjectData, threshold);
  }, [subjectStats, threshold]);

  /**
   * Bunk milestone
   */
  const milestone = useMemo(() => {
    const totalBunks = subjectStats.reduce((sum, s) => sum + (s.total - s.present), 0);
    return bunkMilestone(totalBunks);
  }, [subjectStats]);

  /**
   * Best and worst attended subjects
   */
  const bestWorst = useMemo(() => {
    if (subjectStats.length === 0) return { best: null, worst: null };

    const withClasses = subjectStats.filter((s) => s.total > 0);
    if (withClasses.length === 0) return { best: null, worst: null };

    const sorted = [...withClasses].sort((a, b) => b.percent - a.percent);
    return {
      best: sorted[0],
      worst: sorted[sorted.length - 1],
    };
  }, [subjectStats]);

  /**
   * What-if calculator for a specific subject
   */
  const calculateWhatIf = (subjectId, bunkMore = 0, attendMore = 0) => {
    const subject = subjectStats.find((s) => s.id === subjectId);
    if (!subject) return null;

    return {
      currentPercent: subject.percent,
      afterBunk: whatIfBunk(subject.present, subject.total, bunkMore),
      afterAttend: whatIfAttend(subject.present, subject.total, attendMore),
      statusAfterBunk: getStatus(
        whatIfBunk(subject.present, subject.total, bunkMore),
        threshold
      ),
      statusAfterAttend: getStatus(
        whatIfAttend(subject.present, subject.total, attendMore),
        threshold
      ),
    };
  };

  /**
   * Weekly bunk budget for a subject
   */
  const calculateBunkBudget = (subjectId, daysLeft, subjectsPerDay) => {
    const subject = subjectStats.find((s) => s.id === subjectId);
    if (!subject) return 0;
    return weeklyBunkBudget(subject.present, subject.total, daysLeft, subjectsPerDay, threshold);
  };

  /**
   * Semester projection for a subject
   */
  const calculateProjection = (subjectId, classesRemaining) => {
    const subject = subjectStats.find((s) => s.id === subjectId);
    if (!subject) return null;
    return semesterProjection(subject.present, subject.total, classesRemaining);
  };

  return {
    subjectStats,
    overallStats,
    risk,
    milestone,
    bestWorst,
    calculateWhatIf,
    calculateBunkBudget,
    calculateProjection,
  };
}
