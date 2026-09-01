/**
 * Formats and shares today's agenda & attendance status via WhatsApp or Telegram.
 */

import { getTodayClasses, getOverallAttendance } from './storage';

export function generateDailyDigestText(state, dateStr = new Date().toISOString().slice(0, 10)) {
  const info = state.personalInfo || {};
  const name = info.name ? info.name.trim() : 'Student';
  const roll = info.rollNumber ? `(${info.rollNumber})` : '';
  const section = info.section ? `[${info.section}]` : '';

  const classes = getTodayClasses(state);
  const overall = getOverallAttendance(state);

  const formattedDate = new Date(dateStr).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  let text = `*📌 TryCatch75 Daily Digest* - ${formattedDate}\n`;
  text += `👤 *${name}* ${roll} ${section}\n\n`;

  text += `*📖 Today's Classes (${classes.length}):*\n`;
  if (classes.length === 0) {
    text += `🎉 No classes scheduled today!\n`;
  } else {
    classes.forEach(({ period, course, time, location, teacher }) => {
      text += `• *P${period + 1} (${time.start}-${time.end})*: ${course.name}`;
      if (location) text += ` 📍 _${location}_`;
      if (teacher) text += ` 👨‍🏫 _${teacher}_`;
      text += `\n`;
    });
  }

  text += `\n*📊 Attendance Status:*\n`;
  text += `• Overall: *${overall.percentage}%* (${overall.attended}/${overall.total} attended)\n`;
  if (overall.odCount > 0 || overall.medicalCount > 0) {
    text += `• OD: ${overall.odCount} | Medical: ${overall.medicalCount}\n`;
  }

  text += `\n🚀 _Generated via TryCatch75 Attendance Tracker_`;
  return text;
}

export function openWhatsAppShare(text) {
  const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
}

export function copyDigestToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(text);
  }
  return Promise.reject(new Error('Clipboard API unavailable'));
}
