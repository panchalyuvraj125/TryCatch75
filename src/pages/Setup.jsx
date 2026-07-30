import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { v4 as uuid } from 'uuid';
import { BookOpen, Trash2, Edit3, Download, Upload, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { exportData, importData } from '../utils/storage';
import { showToast } from '../components/ui/Toast';
import { requestNotificationPermission } from '../utils/notifications';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function Setup() {
  const { state, globalState, update, updateGlobal, refreshData } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const fileRef = useRef(null);
  const [fileName, setFileName] = useState('No file chosen');

  // Step 1 - Personal Info
  const [personalInfo, setPersonalInfo] = useState(state.personalInfo);

  // Step 2 - Course
  const [courseCode, setCourseCode] = useState('');
  const [courseName, setCourseName] = useState('');
  const [courseMin, setCourseMin] = useState(75);
  const [courseGoal, setCourseGoal] = useState(85);
  const [courseColor, setCourseColor] = useState('#0070f3');
  const [courses, setCourses] = useState(state.courses);
  const [editingId, setEditingId] = useState(null);

  // Step 3 - Timetable
  const [timetable, setTimetable] = useState(state.timetable);
  const [periodTimes, setPeriodTimes] = useState(state.periodTimes);
  const [showPalette, setShowPalette] = useState(false);
  const [selectedCell, setSelectedCell] = useState(null);

  // Step 4 - Semester & Holidays
  const activeSemesterId = globalState.activeSemesterId || 'default';
  const [semesterLabel, setSemesterLabel] = useState(globalState.semesters?.[activeSemesterId]?.label || 'Semester 1');
  const [semester, setSemester] = useState(state.semester);
  const [holidays, setHolidays] = useState(state.holidays || []);
  const [holidayDate, setHolidayDate] = useState('');
  const [holidayLabel, setHolidayLabel] = useState('');

  const totalSteps = 4;

  const saveCurrentStep = () => {
    update({
      personalInfo,
      courses,
      timetable,
      periodTimes,
      semester,
      holidays,
    });
    
    if (globalState.activeSemesterId) {
      updateGlobal(prev => ({
        ...prev,
        semesters: {
          ...prev.semesters,
          [prev.activeSemesterId]: {
            ...prev.semesters[prev.activeSemesterId],
            label: semesterLabel
          }
        }
      }));
    }
  };

  const goNext = () => {
    saveCurrentStep();
    if (step < totalSteps - 1) {
      setDirection(1);
      setStep(step + 1);
    }
  };

  const goBack = () => {
    saveCurrentStep();
    if (step > 0) {
      setDirection(-1);
      setStep(step - 1);
    }
  };

  const finishSetup = () => {
    update({
      personalInfo,
      courses,
      timetable,
      periodTimes,
      semester,
      holidays,
      setupComplete: true,
    });
    showToast('Setup complete! Redirecting to Dashboard...', 'success');
    setTimeout(() => navigate('/dashboard'), 800);
  };

  // Course helpers
  const addCourse = () => {
    if (!courseCode.trim() || !courseName.trim()) {
      showToast('Please enter both course code and name', 'warning');
      return;
    }
    if (editingId) {
      setCourses(courses.map((c) =>
        c.id === editingId
          ? { ...c, code: courseCode.trim(), name: courseName.trim(), minAttendance: courseMin, goalAttendance: courseGoal, color: courseColor }
          : c
      ));
      setEditingId(null);
    } else {
      setCourses([
        ...courses,
        { id: uuid(), code: courseCode.trim(), name: courseName.trim(), minAttendance: courseMin, goalAttendance: courseGoal, color: courseColor },
      ]);
    }
    setCourseCode('');
    setCourseName('');
    setCourseMin(75);
    setCourseGoal(85);
    setCourseColor('#0070f3');
    showToast(editingId ? 'Course updated' : 'Course added', 'success');
  };

  const removeCourse = (id) => {
    setCourses(courses.filter((c) => c.id !== id));
    // also remove from timetable
    const newTT = { ...timetable };
    for (const day of DAYS) {
      const daySlots = { ...newTT[day] };
      for (const p in daySlots) {
        if (daySlots[p] === id) delete daySlots[p];
      }
      newTT[day] = daySlots;
    }
    setTimetable(newTT);
    showToast('Course removed', 'info');
  };

  const editCourse = (course) => {
    setEditingId(course.id);
    setCourseCode(course.code);
    setCourseName(course.name);
    setCourseMin(course.minAttendance);
    setCourseGoal(course.goalAttendance || 85);
    setCourseColor(course.color);
  };

  // Timetable helpers
  const handleCellClick = (day, period) => {
    setSelectedCell({ day, period });
    setShowPalette(true);
  };

  const assignCourse = (courseId) => {
    if (selectedCell) {
      setTimetable((prev) => ({
        ...prev,
        [selectedCell.day]: {
          ...prev[selectedCell.day],
          [selectedCell.period]: courseId,
        },
      }));
    }
    setShowPalette(false);
    setSelectedCell(null);
  };

  const removeCellCourse = () => {
    if (selectedCell) {
      setTimetable((prev) => {
        const daySlots = { ...prev[selectedCell.day] };
        delete daySlots[selectedCell.period];
        return { ...prev, [selectedCell.day]: daySlots };
      });
    }
    setShowPalette(false);
    setSelectedCell(null);
  };

  const updatePeriodTime = (index, field, value) => {
    setPeriodTimes((prev) => prev.map((p, i) => (i === index ? { ...p, [field]: value } : p)));
  };

  const addHoliday = () => {
    if (!holidayDate) return showToast('Select a date', 'warning');
    if (!holidayLabel.trim()) return showToast('Enter a label', 'warning');
    if (holidays.some(h => h.date === holidayDate)) return showToast('Holiday already exists on this date', 'warning');
    setHolidays([...holidays, { id: uuid(), date: holidayDate, label: holidayLabel.trim() }]);
    setHolidayDate('');
    setHolidayLabel('');
    showToast('Holiday added', 'success');
  };

  const removeHoliday = (id) => {
    setHolidays(holidays.filter(h => h.id !== id));
    showToast('Holiday removed', 'info');
  };

  // Import handler
  const handleImport = async () => {
    const file = fileRef.current?.files?.[0];
    if (!file) {
      showToast('Please select a file first', 'warning');
      return;
    }
    try {
      const data = await importData(file);
      refreshData();
      setPersonalInfo(data.personalInfo || state.personalInfo);
      setCourses(data.courses || []);
      setTimetable(data.timetable || state.timetable);
      setPeriodTimes(data.periodTimes || state.periodTimes);
      setSemester(data.semester || state.semester);
      setHolidays(data.holidays || []);
      showToast('Data imported successfully!', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const stepVariants = {
    enter: (dir) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg sm:text-xl font-semibold tracking-tight">Settings</h2>
          <span className="text-xs font-mono text-text-muted">
            {step + 1} / {totalSteps}
          </span>
        </div>
        <div className="progress-bar">
          <motion.div
            className="progress-fill bg-accent"
            initial={false}
            animate={{ width: `${((step + 1) / totalSteps) * 100}%` }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          />
        </div>
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={step}
          custom={direction}
          variants={stepVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          {/* ═══ STEP 0: Personal Info ═══ */}
          {step === 0 && (
            <div>
              <div className="card p-4 sm:p-6 mb-6">
                <h3 className="text-sm font-semibold text-text-secondary mb-1">
                  Personal Information
                </h3>
                <p className="text-xs text-text-muted mb-4">
                  Tell us a bit about yourself. This information is optional and will be stored
                  locally on your device.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-text-muted mb-1.5">
                      Full Name (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. John Doe"
                      value={personalInfo.name}
                      onChange={(e) =>
                        setPersonalInfo({ ...personalInfo, name: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-text-muted mb-1.5">
                      Roll Number (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 2023001"
                      value={personalInfo.rollNumber}
                      onChange={(e) =>
                        setPersonalInfo({ ...personalInfo, rollNumber: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-text-muted mb-1.5">
                      Branch (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Computer Science"
                      value={personalInfo.branch}
                      onChange={(e) =>
                        setPersonalInfo({ ...personalInfo, branch: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-text-muted mb-1.5">
                      Year (Optional)
                    </label>
                    <select
                      value={personalInfo.year}
                      onChange={(e) =>
                        setPersonalInfo({ ...personalInfo, year: e.target.value })
                      }
                    >
                      <option value="">Select Year</option>
                      <option value="1">1st Year</option>
                      <option value="2">2nd Year</option>
                      <option value="3">3rd Year</option>
                      <option value="4">4th Year</option>
                      <option value="5">5th Year</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-text-muted mb-1.5">
                      Semester (Optional)
                    </label>
                    <select
                      value={personalInfo.semester}
                      onChange={(e) =>
                        setPersonalInfo({ ...personalInfo, semester: e.target.value })
                      }
                    >
                      <option value="">Select Semester</option>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                        <option key={s} value={s}>
                          Semester {s}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-text-muted mb-1.5">
                      Section (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. A, B, C"
                      value={personalInfo.section}
                      onChange={(e) =>
                        setPersonalInfo({ ...personalInfo, section: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="card p-4 sm:p-6">
                <h3 className="text-sm font-semibold text-text-secondary mb-1">Privacy Note</h3>
                <p className="text-xs text-text-muted">
                  All your information is stored locally in your browser. No data is sent to any
                  server. You can update or remove this information anytime from the settings.
                </p>
              </div>
            </div>
          )}

          {/* ═══ STEP 1: Courses ═══ */}
          {step === 1 && (
            <div>
              <div className="card p-4 sm:p-6 mb-6">
                <h3 className="text-sm font-semibold text-text-secondary mb-1">Add a Course</h3>
                <p className="text-xs text-text-muted mb-4">
                  Enter your course code and name. You can add as many courses as you need.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-[1fr_2fr_auto] gap-3 items-end">
                  <div>
                    <label className="block text-xs font-medium text-text-muted mb-1.5">
                      Course Code
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. CS301"
                      value={courseCode}
                      onChange={(e) => setCourseCode(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-text-muted mb-1.5">
                      Course Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Data Structures"
                      value={courseName}
                      onChange={(e) => setCourseName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addCourse()}
                    />
                  </div>
                  <button
                    onClick={addCourse}
                    className="h-10 px-5 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg transition-all duration-200 active:scale-95 cursor-pointer whitespace-nowrap"
                  >
                    {editingId ? '✓ Update' : '+ Add'}
                  </button>
                </div>

                {/* Advanced Options */}
                <details className="mt-3">
                  <summary className="text-xs text-text-muted cursor-pointer hover:text-text-secondary transition-colors">
                    Advanced options
                  </summary>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                    <div>
                      <label className="block text-xs font-medium text-text-muted mb-1.5">
                        Min Attendance %
                      </label>
                      <input
                        type="number"
                        value={courseMin}
                        min="0"
                        max="100"
                        onChange={(e) => setCourseMin(parseInt(e.target.value) || 75)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-text-muted mb-1.5">
                        Goal %
                      </label>
                      <input
                        type="number"
                        value={courseGoal}
                        min={courseMin}
                        max="100"
                        onChange={(e) => setCourseGoal(parseInt(e.target.value) || 85)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-text-muted mb-1.5">
                        Color
                      </label>
                      <input
                        type="color"
                        value={courseColor}
                        onChange={(e) => setCourseColor(e.target.value)}
                      />
                    </div>
                  </div>
                </details>
              </div>

              {/* Course List */}
              {courses.length > 0 ? (
                <div className="space-y-2 mb-6">
                  {courses.map((course) => (
                    <motion.div
                      key={course.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="card p-3 sm:p-4 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: course.color }}
                        />
                        <div className="min-w-0">
                          <span className="text-xs font-mono text-text-muted">{course.code}</span>
                          <p className="text-sm font-medium truncate">{course.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="flex flex-col items-end mr-2">
                          <span className="text-[10px] font-mono text-text-muted">
                            Min: {course.minAttendance}%
                          </span>
                          <span className="text-[10px] font-mono text-text-muted">
                            Goal: {course.goalAttendance || 85}%
                          </span>
                        </div>
                        <button
                          onClick={() => editCourse(course)}
                          className="p-1.5 rounded-md hover:bg-bg-tertiary text-text-muted hover:text-text-primary transition-all cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => removeCourse(course.id)}
                          className="p-1.5 rounded-md hover:bg-danger-soft text-text-muted hover:text-danger transition-all cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="card p-8 sm:p-12 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-7 h-7 text-accent" />
                  </div>
                  <h3 className="text-base font-semibold mb-1">No courses added yet</h3>
                  <p className="text-sm text-text-muted">
                    Add your first course above to get started.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ═══ STEP 2: Timetable ═══ */}
          {step === 2 && (
            <div>
              <div className="card p-4 sm:p-6 mb-4">
                <h3 className="text-sm font-semibold text-text-secondary mb-1">
                  Build Your Timetable
                </h3>
                <p className="text-xs text-text-muted mb-4">
                  Click on a cell to assign a course. Click again to remove it.
                </p>

                {/* Period Times Config */}
                <details className="mb-4">
                  <summary className="text-xs text-text-muted cursor-pointer hover:text-text-secondary transition-colors">
                    Configure period times
                  </summary>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                    {periodTimes.map((pt, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        <span className="text-text-muted font-mono w-14">P{i + 1}:</span>
                        <input
                          type="text"
                          className="!h-8 !text-xs !w-20"
                          value={pt.start}
                          onChange={(e) => updatePeriodTime(i, 'start', e.target.value)}
                        />
                        <span className="text-text-muted">–</span>
                        <input
                          type="text"
                          className="!h-8 !text-xs !w-20"
                          value={pt.end}
                          onChange={(e) => updatePeriodTime(i, 'end', e.target.value)}
                        />
                      </div>
                    ))}
                  </div>
                </details>
              </div>

              {/* Timetable Grid */}
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <div className="min-w-[640px] px-4 sm:px-0">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="text-[11px] font-mono text-text-muted uppercase tracking-wider p-2 text-left w-16">
                          Day
                        </th>
                        {periodTimes.map((_, i) => (
                          <th
                            key={i}
                            className="text-[11px] font-mono text-text-muted uppercase tracking-wider p-2 text-center"
                          >
                            P{i + 1}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {DAYS.map((day) => (
                        <tr key={day}>
                          <td className="text-xs font-medium text-text-secondary p-2">{day}</td>
                          {periodTimes.map((_, pIdx) => {
                            const courseId = timetable[day]?.[pIdx];
                            const course = courses.find((c) => c.id === courseId);
                            return (
                              <td
                                key={pIdx}
                                className="timetable-cell"
                                style={
                                  course
                                    ? {
                                        backgroundColor: course.color + '20',
                                        borderColor: course.color + '40',
                                        color: course.color,
                                      }
                                    : {}
                                }
                                onClick={() => handleCellClick(day, pIdx)}
                              >
                                {course ? (
                                  <span className="font-medium">{course.code}</span>
                                ) : (
                                  <span className="text-text-muted opacity-30">+</span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Course Palette Modal */}
              {showPalette && (
                <div
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                  onClick={() => setShowPalette(false)}
                >
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="card p-4 w-[90%] max-w-sm"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h4 className="text-sm font-semibold mb-3">Select Course</h4>
                    <div className="space-y-1.5 max-h-60 overflow-y-auto">
                      {courses.length > 0 ? (
                        courses.map((c) => (
                          <button
                            key={c.id}
                            onClick={() => assignCourse(c.id)}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-bg-tertiary transition-all cursor-pointer text-left"
                          >
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: c.color }}
                            />
                            <span className="font-mono text-xs text-text-muted">{c.code}</span>
                            <span>{c.name}</span>
                          </button>
                        ))
                      ) : (
                        <p className="text-xs text-text-muted text-center py-4">
                          No courses added. Go back to Step 2 to add courses.
                        </p>
                      )}
                    </div>
                    <div className="mt-3 pt-3 border-t border-border flex gap-2">
                      <button
                        onClick={removeCellCourse}
                        className="flex-1 h-9 text-xs font-medium text-danger bg-danger-soft rounded-lg hover:bg-danger/20 transition-all cursor-pointer"
                      >
                        Remove
                      </button>
                      <button
                        onClick={() => setShowPalette(false)}
                        className="flex-1 h-9 text-xs font-medium text-text-secondary bg-bg-tertiary rounded-lg hover:bg-bg-elevated transition-all cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}
            </div>
          )}

          {/* ═══ STEP 3: Semester Details ═══ */}
          {step === 3 && (
            <div>
              <div className="card p-4 sm:p-6 mb-6">
                <h3 className="text-sm font-semibold text-text-secondary mb-1">
                  Semester Details
                </h3>
                <p className="text-xs text-text-muted mb-4">
                  Set your semester start and end dates for accurate predictions.
                </p>
                <div className="grid grid-cols-1 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-medium text-text-muted mb-1.5">
                      Semester Name
                    </label>
                    <input
                      type="text"
                      value={semesterLabel}
                      onChange={(e) => setSemesterLabel(e.target.value)}
                      placeholder="e.g. Fall 2023"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-text-muted mb-1.5">
                      Semester Start
                    </label>
                    <input
                      type="date"
                      value={semester.start}
                      onChange={(e) => setSemester({ ...semester, start: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-text-muted mb-1.5">
                      Semester End
                    </label>
                    <input
                      type="date"
                      value={semester.end}
                      onChange={(e) => setSemester({ ...semester, end: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Holidays & Leaves */}
              <div className="card p-4 sm:p-6 mb-6">
                <h3 className="text-sm font-semibold text-text-secondary mb-1">
                  Holidays & Leaves
                </h3>
                <p className="text-xs text-text-muted mb-4">
                  Add dates for holidays or exams. These will be excluded from attendance calculations.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-[1fr_2fr_auto] gap-3 items-end mb-4">
                  <div>
                    <label className="block text-xs font-medium text-text-muted mb-1.5">
                      Date
                    </label>
                    <input
                      type="date"
                      value={holidayDate}
                      onChange={(e) => setHolidayDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-text-muted mb-1.5">
                      Description
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Diwali, Mid-sems"
                      value={holidayLabel}
                      onChange={(e) => setHolidayLabel(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addHoliday()}
                    />
                  </div>
                  <button
                    onClick={addHoliday}
                    className="h-10 px-5 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg transition-all duration-200 active:scale-95 cursor-pointer whitespace-nowrap"
                  >
                    + Add
                  </button>
                </div>

                {holidays.length > 0 ? (
                  <div className="space-y-2">
                    {holidays.sort((a, b) => a.date.localeCompare(b.date)).map(h => (
                      <div key={h.id} className="flex items-center justify-between p-2.5 rounded-lg bg-bg-tertiary">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{h.label}</span>
                          <span className="text-[10px] text-text-muted font-mono">{new Date(h.date).toLocaleDateString()}</span>
                        </div>
                        <button
                          onClick={() => removeHoliday(h.id)}
                          className="p-1.5 text-text-muted hover:text-danger rounded-md hover:bg-danger-soft transition-all cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 rounded-lg border border-dashed border-border text-center">
                    <p className="text-xs text-text-muted">No holidays added yet.</p>
                  </div>
                )}
              </div>

              {/* Summary */}
              <div className="card p-4 sm:p-6 mb-6">
                <h3 className="text-sm font-semibold text-text-secondary mb-3">Setup Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-text-muted">Name</span>
                    <span className="font-medium">{personalInfo.name || '—'}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-text-muted">Roll Number</span>
                    <span className="font-medium">{personalInfo.rollNumber || '—'}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-text-muted">Branch</span>
                    <span className="font-medium">{personalInfo.branch || '—'}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-text-muted">Year / Semester</span>
                    <span className="font-medium">
                      {personalInfo.year ? `Year ${personalInfo.year}` : '—'} /{' '}
                      {personalInfo.semester ? `Sem ${personalInfo.semester}` : '—'}
                    </span>
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between text-xs">
                    <span className="text-text-muted">Courses Added</span>
                    <span className="font-medium">{courses.length}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-text-muted">Timetable Slots Filled</span>
                    <span className="font-medium">
                      {Object.values(timetable).reduce(
                        (acc, day) => acc + Object.keys(day).length,
                        0
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-text-muted">Semester Period</span>
                    <span className="font-medium">
                      {semester.start && semester.end
                        ? `${semester.start} → ${semester.end}`
                        : '—'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Notifications */}
              <div className="card p-4 sm:p-6 mb-6">
                <h3 className="text-sm font-semibold text-text-secondary mb-1">Notifications</h3>
                <p className="text-xs text-text-muted mb-4">
                  Get reminded 10 minutes before your next class starts.
                </p>
                <button
                  onClick={async () => {
                    const granted = await requestNotificationPermission();
                    if (granted) showToast('Notifications enabled!', 'success');
                    else showToast('Notifications blocked by browser.', 'error');
                  }}
                  className="h-10 px-5 bg-bg-tertiary hover:bg-bg-elevated text-text-secondary text-sm font-medium rounded-lg transition-all duration-200 active:scale-95 cursor-pointer border border-border"
                >
                  Enable Smart Notifications
                </button>
              </div>

              {/* Data Management */}
              <div className="card p-4 sm:p-6">
                <h3 className="text-sm font-semibold text-text-secondary mb-1">Data Management</h3>
                <p className="text-xs text-text-muted mb-4">
                  Export your data to create a backup, or import a previously saved backup to
                  restore your data.
                </p>
                <div className="space-y-3">
                  {/* Export */}
                  <div>
                    <button
                      onClick={() => {
                        saveCurrentStep();
                        exportData();
                        showToast('Data exported!', 'success');
                      }}
                      className="w-full h-10 px-4 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg transition-all duration-200 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Export Data
                    </button>
                    <p className="text-[10px] text-text-muted mt-1.5">
                      Downloads a JSON file with all your attendance data, courses, timetable, and
                      settings.
                    </p>
                  </div>

                  {/* Import */}
                  <div className="pt-3 border-t border-border">
                    <label className="block text-xs font-medium text-text-muted mb-1.5">
                      Import Data
                    </label>
                    <div className="flex gap-2 items-center">
                      <div className="flex-1">
                        <label
                          htmlFor="import-file"
                          className="h-10 flex items-center justify-start px-2 gap-3 bg-bg-tertiary border border-border rounded-lg cursor-pointer text-sm text-text-primary hover:bg-bg-elevated transition-all"
                        >
                          <span className="px-3 py-1 rounded-md bg-accent text-white text-xs font-medium">
                            Choose File
                          </span>
                          <span className="truncate text-xs text-text-muted">{fileName}</span>
                        </label>
                        <input
                          type="file"
                          id="import-file"
                          ref={fileRef}
                          accept=".json"
                          className="hidden"
                          onChange={(e) =>
                            setFileName(e.target.files?.[0]?.name || 'No file chosen')
                          }
                        />
                      </div>
                      <button
                        onClick={handleImport}
                        className="h-10 px-4 bg-bg-tertiary hover:bg-bg-elevated text-text-secondary text-sm font-medium rounded-lg transition-all duration-200 active:scale-95 cursor-pointer border border-border whitespace-nowrap"
                      >
                        Import
                      </button>
                    </div>
                    <p className="text-[10px] text-text-muted mt-1.5">
                      Select a previously exported JSON file to restore your data. This will replace
                      all existing data.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between mt-8">
        {step > 0 ? (
          <button
            onClick={goBack}
            className="h-10 px-5 text-sm font-medium text-text-secondary bg-bg-tertiary hover:bg-bg-elevated rounded-lg transition-all duration-200 cursor-pointer"
          >
            ← Back
          </button>
        ) : (
          <div />
        )}
        <div className="flex-1" />
        {step < totalSteps - 1 ? (
          <button
            onClick={goNext}
            className="h-10 px-6 text-sm font-medium text-white bg-accent hover:bg-accent-hover rounded-lg transition-all duration-200 active:scale-95 cursor-pointer"
          >
            Next →
          </button>
        ) : (
          <button
            onClick={finishSetup}
            className="h-10 px-6 text-sm font-medium text-white bg-accent hover:bg-accent-hover rounded-lg transition-all duration-200 active:scale-95 cursor-pointer"
          >
            Finish Setup ✓
          </button>
        )}
      </div>
    </div>
  );
}
