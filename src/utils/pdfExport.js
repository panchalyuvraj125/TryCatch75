import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { getAttendanceForCourse, getOverallAttendance } from './storage';

export function exportAttendancePDF(state) {
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(18);
  doc.setTextColor(40);
  doc.text('TryCatch75 - Attendance Report', 14, 22);

  // Personal Info
  doc.setFontSize(10);
  doc.setTextColor(100);
  const info = state.personalInfo || {};
  let y = 32;
  if (info.name) { doc.text(`Name: ${info.name}`, 14, y); y += 6; }
  if (info.rollNumber) { doc.text(`Roll Number: ${info.rollNumber}`, 14, y); y += 6; }
  if (info.branch) { doc.text(`Branch: ${info.branch}`, 14, y); y += 6; }
  if (info.semester) { doc.text(`Semester: ${info.semester}`, 14, y); y += 6; }
  
  // Overall Stats
  const overall = getOverallAttendance(state);
  y += 6;
  doc.setFontSize(12);
  doc.setTextColor(40);
  doc.text('Overall Attendance', 14, y);
  y += 6;
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Total Classes: ${overall.total} | Attended: ${overall.attended} | Missed: ${overall.missed} | Percentage: ${overall.percentage}%`, 14, y);
  
  y += 10;
  
  // Subject Table
  const tableData = state.courses.map(course => {
    const stats = getAttendanceForCourse(state, course.id);
    return [
      course.code,
      course.name,
      stats.total.toString(),
      stats.attended.toString(),
      stats.missed.toString(),
      `${stats.percentage}%`
    ];
  });

  doc.autoTable({
    startY: y,
    head: [['Code', 'Course Name', 'Total', 'Attended', 'Missed', 'Percentage']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [0, 112, 243] },
    styles: { fontSize: 10 }
  });

  doc.save(`Attendance_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
}
