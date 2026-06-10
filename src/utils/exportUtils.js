/**
 * TryCatch75 — Export Utilities
 * CSV download, printable report, WhatsApp share
 * All client-side — no server required
 */
import { formatDisplay } from './dateHelpers';

/**
 * Export attendance data as CSV file
 * @param {Array} subjects - Array of subject objects with attendance stats
 * @param {string} studentName - Student name for the report header
 */
export function exportCSV(subjects, studentName = 'Student') {
  const headers = [
    'Subject',
    'Type',
    'Total Classes',
    'Present',
    'Absent',
    'Medical Leave',
    'Holiday',
    'Attendance %',
    'Status',
  ];

  const rows = subjects.map((sub) => {
    const total = sub.total || 0;
    const present = sub.present || 0;
    const percent = total > 0 ? ((present / total) * 100).toFixed(2) : '0.00';
    const status = parseFloat(percent) >= 75 ? 'Safe' : parseFloat(percent) >= 65 ? 'Danger' : 'Critical';

    return [
      sub.name,
      sub.type || 'theory',
      total,
      present,
      sub.absent || 0,
      sub.medical || 0,
      sub.holiday || 0,
      percent + '%',
      status,
    ];
  });

  const csvContent = [
    `TryCatch75 Attendance Report - ${studentName}`,
    `Generated on: ${formatDisplay(new Date(), 'dd MMM yyyy, hh:mm a')}`,
    '',
    headers.join(','),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    '',
    `Total Subjects: ${subjects.length}`,
  ].join('\n');

  downloadFile(csvContent, `trycatch75_attendance_${Date.now()}.csv`, 'text/csv');
}

/**
 * Generate and trigger print of attendance report
 * @param {Array} subjects - Subject data
 * @param {object} profile - Student profile
 */
export function printReport(subjects, profile = {}) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow pop-ups to print the report.');
    return;
  }

  const totalPresent = subjects.reduce((sum, s) => sum + (s.present || 0), 0);
  const totalClasses = subjects.reduce((sum, s) => sum + (s.total || 0), 0);
  const overallPercent = totalClasses > 0 ? ((totalPresent / totalClasses) * 100).toFixed(2) : '0.00';

  const subjectRows = subjects
    .map(
      (sub) => `
      <tr>
        <td>${sub.name}</td>
        <td>${sub.type || 'Theory'}</td>
        <td>${sub.total || 0}</td>
        <td>${sub.present || 0}</td>
        <td>${(sub.total || 0) - (sub.present || 0)}</td>
        <td>${sub.total > 0 ? ((sub.present / sub.total) * 100).toFixed(2) : '0.00'}%</td>
      </tr>`
    )
    .join('');

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>TryCatch75 — Attendance Report</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; color: #222; }
        h1 { font-size: 24px; margin-bottom: 8px; color: #0a0a0f; }
        .subtitle { color: #666; margin-bottom: 24px; font-size: 14px; }
        .info { margin-bottom: 20px; }
        .info span { display: inline-block; margin-right: 24px; font-size: 14px; }
        .info strong { color: #333; }
        table { width: 100%; border-collapse: collapse; margin-top: 16px; }
        th, td { padding: 10px 12px; text-align: left; border-bottom: 1px solid #ddd; font-size: 13px; }
        th { background: #f5f5f5; font-weight: 600; }
        .overall { margin-top: 24px; padding: 16px; background: #f0f9ff; border-radius: 8px; }
        .overall h3 { margin-bottom: 4px; }
        .footer { margin-top: 32px; font-size: 12px; color: #999; text-align: center; }
        @media print { body { padding: 20px; } }
      </style>
    </head>
    <body>
      <h1>📊 TryCatch75 — Attendance Report</h1>
      <p class="subtitle">Generated on ${formatDisplay(new Date(), 'dd MMMM yyyy, hh:mm a')}</p>
      <div class="info">
        <span><strong>Name:</strong> ${profile.name || 'N/A'}</span>
        <span><strong>Roll No:</strong> ${profile.rollNo || 'N/A'}</span>
        <span><strong>Branch:</strong> ${profile.branch || 'N/A'}</span>
        <span><strong>Year:</strong> ${profile.year || 'N/A'}</span>
        <span><strong>University:</strong> ${profile.university || 'N/A'}</span>
      </div>
      <table>
        <thead>
          <tr><th>Subject</th><th>Type</th><th>Total</th><th>Present</th><th>Absent</th><th>%</th></tr>
        </thead>
        <tbody>${subjectRows}</tbody>
      </table>
      <div class="overall">
        <h3>Overall Attendance: ${overallPercent}%</h3>
        <p>Total Classes: ${totalClasses} | Present: ${totalPresent} | Absent: ${totalClasses - totalPresent}</p>
      </div>
      <p class="footer">TryCatch75 — Smart Attendance Tracker for Engineering Students</p>
    </body>
    </html>
  `);

  printWindow.document.close();
  setTimeout(() => printWindow.print(), 500);
}

/**
 * Share attendance summary via WhatsApp
 * @param {Array} subjects - Subject data
 * @param {string} studentName
 */
export function shareWhatsApp(subjects, studentName = '') {
  const totalPresent = subjects.reduce((sum, s) => sum + (s.present || 0), 0);
  const totalClasses = subjects.reduce((sum, s) => sum + (s.total || 0), 0);
  const overallPercent = totalClasses > 0 ? ((totalPresent / totalClasses) * 100).toFixed(1) : '0.0';

  const subjectLines = subjects
    .map((sub) => {
      const pct = sub.total > 0 ? ((sub.present / sub.total) * 100).toFixed(1) : '0.0';
      const emoji = pct >= 75 ? '✅' : pct >= 65 ? '⚠️' : '🚨';
      return `${emoji} ${sub.name}: ${pct}% (${sub.present}/${sub.total})`;
    })
    .join('\n');

  const message = [
    `📊 *TryCatch75 — Attendance Report*`,
    studentName ? `👤 ${studentName}` : '',
    `📅 ${formatDisplay(new Date())}`,
    '',
    `*Overall: ${overallPercent}%* (${totalPresent}/${totalClasses})`,
    '',
    subjectLines,
    '',
    `_Tracked with TryCatch75 — Never Miss 75%_`,
  ]
    .filter(Boolean)
    .join('\n');

  const encodedMessage = encodeURIComponent(message);
  window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
}

/**
 * Helper: trigger file download
 */
function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
