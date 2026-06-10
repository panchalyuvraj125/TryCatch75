/**
 * TryCatch75 — Attendance Calculation Engine
 * All pure functions. No side effects. No dependencies.
 *
 * The 75% rule: Indian engineering students must maintain ≥75% attendance
 * in each subject to avoid being detained from exams.
 */

/**
 * Calculate current attendance percentage
 * @param {number} present - Number of classes attended
 * @param {number} total - Total number of classes held
 * @returns {number} Percentage (0-100), or 0 if no classes
 */
export function currentPercent(present, total) {
  if (total <= 0) return 0;
  return (present / total) * 100;
}

/**
 * Calculate how many more classes you CAN safely bunk
 * and still stay at or above the threshold.
 *
 * Logic: You're safe if present / total >= threshold/100
 * Max absences allowed = floor(total * (1 - threshold/100))
 * Current absences = total - present
 * Safe bunks remaining = max_absences - current_absences
 *
 * @param {number} present - Classes attended
 * @param {number} total - Total classes held
 * @param {number} threshold - Required percentage (default 75)
 * @returns {number} Number of classes you can still skip (≥ 0)
 */
export function safeBunks(present, total, threshold = 75) {
  if (total <= 0) return 0;
  const maxAbsences = Math.floor(total * (1 - threshold / 100));
  const currentAbsences = total - present;
  return Math.max(0, maxAbsences - currentAbsences);
}

/**
 * Calculate how many consecutive classes you MUST attend
 * to reach the threshold percentage.
 *
 * Solve: (present + x) / (total + x) >= threshold/100
 * x >= (threshold * total / 100 - present) / (1 - threshold / 100)
 *
 * @param {number} present - Classes attended
 * @param {number} total - Total classes held
 * @param {number} threshold - Required percentage (default 75)
 * @returns {number} Classes needed (0 if already at or above threshold)
 */
export function classesNeeded(present, total, threshold = 75) {
  if (total <= 0) return 0;
  const currentPct = currentPercent(present, total);
  if (currentPct >= threshold) return 0;

  const needed = Math.ceil(
    (threshold * total / 100 - present) / (1 - threshold / 100)
  );
  return Math.max(0, needed);
}

/**
 * What-If: What % will you have if you bunk N more classes?
 * (Assumes those N classes are added to total but NOT to present)
 *
 * @param {number} present - Current classes attended
 * @param {number} total - Current total classes
 * @param {number} bunkMore - Additional classes you plan to skip
 * @returns {number} Projected percentage
 */
export function whatIfBunk(present, total, bunkMore) {
  const newTotal = total + bunkMore;
  if (newTotal <= 0) return 0;
  return (present / newTotal) * 100;
}

/**
 * What-If: What % will you have if you attend N more classes?
 * (Adds N to both present and total)
 *
 * @param {number} present - Current classes attended
 * @param {number} total - Current total classes
 * @param {number} attendMore - Additional classes you plan to attend
 * @returns {number} Projected percentage
 */
export function whatIfAttend(present, total, attendMore) {
  const newPresent = present + attendMore;
  const newTotal = total + attendMore;
  if (newTotal <= 0) return 0;
  return (newPresent / newTotal) * 100;
}

/**
 * Calculate weekly bunk budget for remaining semester.
 * How many classes per week can you safely skip?
 *
 * @param {number} present - Current classes attended
 * @param {number} total - Current total classes
 * @param {number} daysLeft - Working days remaining in semester
 * @param {number} subjectsPerDay - Average subjects per day
 * @param {number} threshold - Required percentage (default 75)
 * @returns {number} Safe bunks per week
 */
export function weeklyBunkBudget(present, total, daysLeft, subjectsPerDay, threshold = 75) {
  if (daysLeft <= 0 || subjectsPerDay <= 0) return 0;

  const totalClassesLeft = daysLeft * subjectsPerDay;
  const totalFinal = total + totalClassesLeft;
  const mustAttendTotal = Math.ceil(totalFinal * threshold / 100);
  const canSkip = (present + totalClassesLeft) - mustAttendTotal;
  const weeksLeft = daysLeft / 7;

  if (weeksLeft <= 0) return 0;
  return Math.max(0, Math.floor(canSkip / weeksLeft));
}

/**
 * Get status category based on attendance percentage
 * @param {number} percent - Current attendance percentage
 * @param {number} threshold - Required percentage (default 75)
 * @returns {'safe' | 'danger' | 'critical'} Status category
 */
export function getStatus(percent, threshold = 75) {
  if (percent >= threshold) return 'safe';
  if (percent >= threshold - 10) return 'danger';
  return 'critical';
}

/**
 * Get status message based on percentage
 * @param {number} percent - Current attendance percentage
 * @param {number} threshold - Required percentage (default 75)
 * @returns {string} Human-readable status
 */
export function getStatusMessage(percent, threshold = 75) {
  if (percent >= threshold) return "You're SAFE ✓";
  if (percent >= threshold - 10) return 'DANGER ZONE ⚠️';
  return 'DETAINED RISK 🚨';
}

/**
 * Calculate end-of-semester projection.
 * If the student continues at their current attendance rate,
 * where will each subject end up?
 *
 * @param {number} present - Current classes attended
 * @param {number} total - Current total classes
 * @param {number} classesRemaining - Estimated remaining classes
 * @returns {{ projectedPresent: number, projectedTotal: number, projectedPercent: number }}
 */
export function semesterProjection(present, total, classesRemaining) {
  if (total <= 0 || classesRemaining <= 0) {
    return { projectedPresent: present, projectedTotal: total, projectedPercent: currentPercent(present, total) };
  }

  const currentRate = present / total;
  const projectedPresent = present + Math.round(classesRemaining * currentRate);
  const projectedTotal = total + classesRemaining;
  const projectedPercent = currentPercent(projectedPresent, projectedTotal);

  return { projectedPresent, projectedTotal, projectedPercent };
}

/**
 * Calculate detention risk level (0-100 scale)
 * Based on the lowest-attending subject
 * @param {Array<{present: number, total: number}>} subjects - Array of subject stats
 * @param {number} threshold - Required percentage (default 75)
 * @returns {{ riskLevel: number, riskLabel: string, worstSubject: number }}
 */
export function detentionRisk(subjects, threshold = 75) {
  if (!subjects || subjects.length === 0) {
    return { riskLevel: 0, riskLabel: 'NO DATA', worstSubjectIndex: -1 };
  }

  let lowestPercent = 100;
  let worstIndex = 0;

  subjects.forEach((sub, i) => {
    const pct = currentPercent(sub.present, sub.total);
    if (pct < lowestPercent) {
      lowestPercent = pct;
      worstIndex = i;
    }
  });

  // Risk is 0 when above threshold, scales to 100 as it approaches 0%
  let riskLevel;
  if (lowestPercent >= threshold) {
    riskLevel = Math.max(0, 100 - ((lowestPercent - threshold) * 4));
    riskLevel = Math.min(riskLevel, 30); // Max 30% risk when above threshold
  } else {
    riskLevel = 30 + ((threshold - lowestPercent) / threshold) * 70;
  }

  riskLevel = Math.min(100, Math.max(0, Math.round(riskLevel)));

  let riskLabel;
  if (riskLevel <= 20) riskLabel = 'SAFE';
  else if (riskLevel <= 40) riskLabel = 'CAUTION';
  else if (riskLevel <= 70) riskLabel = 'WARNING';
  else riskLabel = 'DETAINED RISK';

  return { riskLevel, riskLabel, worstSubjectIndex: worstIndex };
}

/**
 * Get bunk milestone emoji and label
 * @param {number} totalBunks - Total safe bunks used
 * @returns {{ emoji: string, label: string }}
 */
export function bunkMilestone(totalBunks) {
  if (totalBunks >= 20) return { emoji: '👑', label: 'Bunk King' };
  if (totalBunks >= 10) return { emoji: '🦅', label: 'Free Bird' };
  if (totalBunks >= 5) return { emoji: '🎯', label: 'Strategic Skipper' };
  if (totalBunks >= 1) return { emoji: '🌱', label: 'Beginner Bunker' };
  return { emoji: '📚', label: 'Perfect Attendance' };
}
