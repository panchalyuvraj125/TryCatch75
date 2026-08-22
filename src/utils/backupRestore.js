import { getData, setData } from './storage';

/**
 * Creates a full backup of TryCatch75 attendance data.
 * Downloads as JSON file with timestamp.
 */
export function createBackup() {
  const data = getData();
  const timestamp = new Date().toISOString().slice(0, 19).replace(/[T:]/g, '-');
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `TryCatch75_Attendance_Backup_${timestamp}.json`;
  a.click();
  URL.revokeObjectURL(url);
  return true;
}

/**
 * Validates backup data structure before import.
 * Returns { valid, errors, summary }
 */
export function validateBackup(data) {
  const errors = [];

  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ['Invalid data: not a JSON object'], summary: null };
  }

  // Check if it's old flat format or new multi-semester format
  const isFlat = data.courses && !data.semesters;
  const isMultiSem = data.semesters && typeof data.semesters === 'object';

  if (!isFlat && !isMultiSem) {
    errors.push('Data does not contain courses or semesters');
  }

  const summary = getBackupSummary(data);

  return {
    valid: errors.length === 0,
    errors,
    summary,
  };
}

/**
 * Returns a human-readable summary of backup contents.
 */
export function getBackupSummary(data) {
  if (!data) return null;

  const isFlat = data.courses && !data.semesters;

  if (isFlat) {
    return {
      format: 'Legacy (single semester)',
      semesters: 1,
      totalCourses: data.courses?.length || 0,
      totalLogs: data.attendanceLog?.length || 0,
      personalName: data.personalInfo?.name || 'Not set',
      dateRange: getDateRange(data.attendanceLog),
    };
  }

  const semesters = Object.values(data.semesters || {});
  let totalCourses = 0;
  let totalLogs = 0;
  const allLogs = [];

  semesters.forEach((sem) => {
    totalCourses += sem.courses?.length || 0;
    totalLogs += sem.attendanceLog?.length || 0;
    if (sem.attendanceLog) allLogs.push(...sem.attendanceLog);
  });

  return {
    format: 'Multi-semester',
    semesters: semesters.length,
    activeSemester: data.activeSemesterId,
    totalCourses,
    totalLogs,
    personalName: semesters[0]?.personalInfo?.name || 'Not set',
    dateRange: getDateRange(allLogs),
  };
}

function getDateRange(logs) {
  if (!logs || logs.length === 0) return { start: null, end: null };
  const dates = logs.map((l) => l.date).filter(Boolean).sort();
  return { start: dates[0], end: dates[dates.length - 1] };
}

/**
 * Imports backup data with safety checks.
 * Does NOT silently overwrite — caller must confirm.
 * Returns { success, data, error }
 */
export function importBackupFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        const validation = validateBackup(data);

        if (!validation.valid) {
          reject(new Error(`Invalid backup: ${validation.errors.join(', ')}`));
          return;
        }

        resolve({ data, summary: validation.summary });
      } catch {
        reject(new Error('Failed to parse JSON file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

/**
 * Applies validated backup data to localStorage.
 * Only call after user confirmation.
 */
export function applyBackup(data) {
  // Normalize flat format to multi-semester
  if (data.courses && !data.semesters) {
    const semData = { ...data };
    delete semData.theme;
    const normalized = {
      activeSemesterId: 'default',
      semesters: {
        default: { id: 'default', label: 'Imported Semester', ...semData },
      },
      theme: data.theme || 'dark',
    };
    setData(normalized);
    return normalized;
  }

  setData(data);
  return data;
}
