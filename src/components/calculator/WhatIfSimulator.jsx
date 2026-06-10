import { useState } from 'react';
import { motion } from 'framer-motion';
import Card from '../ui/Card';
import { whatIfBunk, whatIfAttend, getStatus, getStatusMessage } from '../../utils/attendanceCalc';

export default function WhatIfSimulator({ subjectStats = [], threshold = 75 }) {
  const [selectedSubject, setSelectedSubject] = useState('');
  const [bunkCount, setBunkCount] = useState(0);
  const [attendCount, setAttendCount] = useState(0);

  const subject = subjectStats.find((s) => s.id === selectedSubject);
  const subjectsWithData = subjectStats.filter((s) => s.total > 0);

  const afterBunk = subject
    ? whatIfBunk(subject.present, subject.total, bunkCount)
    : 0;
  const afterAttend = subject
    ? whatIfAttend(subject.present, subject.total, attendCount)
    : 0;

  const bunkStatus = getStatus(afterBunk, threshold);
  const attendStatus = getStatus(afterAttend, threshold);

  const statusColors = {
    safe: 'var(--accent-green)',
    danger: 'var(--accent-yellow)',
    critical: 'var(--accent-red)',
  };

  return (
    <div className="space-y-3">
      <h3 className="font-heading text-lg font-semibold text-[var(--text-primary)]">
        🔮 What-If Simulator
      </h3>
      <p className="text-sm text-[var(--text-secondary)]">
        See how future attendance choices affect your percentage
      </p>

      {/* Subject Selector */}
      <select
        value={selectedSubject}
        onChange={(e) => {
          setSelectedSubject(e.target.value);
          setBunkCount(0);
          setAttendCount(0);
        }}
        className="cyber-select w-full"
      >
        <option value="">Select a subject...</option>
        {subjectsWithData.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name} — {s.percent.toFixed(1)}%
          </option>
        ))}
      </select>

      {subject && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {/* Bunk Scenario */}
          <Card className="border-[var(--accent-red)]/20">
            <h4 className="text-sm font-semibold text-[var(--accent-red)] mb-3">
              😴 If I bunk more classes...
            </h4>

            <div className="flex items-center gap-3 mb-4">
              <input
                type="range"
                min="0"
                max="30"
                value={bunkCount}
                onChange={(e) => setBunkCount(parseInt(e.target.value))}
                className="flex-1 accent-[var(--accent-red)]"
              />
              <span className="font-mono text-lg font-bold text-[var(--text-primary)] w-8 text-center">
                {bunkCount}
              </span>
            </div>

            <div className="text-center py-3 rounded-lg bg-[var(--bg-secondary)]">
              <p className="text-xs text-[var(--text-muted)] mb-1">Projected Attendance</p>
              <motion.p
                key={afterBunk}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="font-mono text-3xl font-bold"
                style={{ color: statusColors[bunkStatus] }}
              >
                {afterBunk.toFixed(1)}%
              </motion.p>
              <p className="text-xs mt-1" style={{ color: statusColors[bunkStatus] }}>
                {getStatusMessage(afterBunk, threshold)}
              </p>
            </div>
          </Card>

          {/* Attend Scenario */}
          <Card className="border-[var(--accent-green)]/20">
            <h4 className="text-sm font-semibold text-[var(--accent-green)] mb-3">
              📚 If I attend more classes...
            </h4>

            <div className="flex items-center gap-3 mb-4">
              <input
                type="range"
                min="0"
                max="30"
                value={attendCount}
                onChange={(e) => setAttendCount(parseInt(e.target.value))}
                className="flex-1 accent-[var(--accent-green)]"
              />
              <span className="font-mono text-lg font-bold text-[var(--text-primary)] w-8 text-center">
                {attendCount}
              </span>
            </div>

            <div className="text-center py-3 rounded-lg bg-[var(--bg-secondary)]">
              <p className="text-xs text-[var(--text-muted)] mb-1">Projected Attendance</p>
              <motion.p
                key={afterAttend}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="font-mono text-3xl font-bold"
                style={{ color: statusColors[attendStatus] }}
              >
                {afterAttend.toFixed(1)}%
              </motion.p>
              <p className="text-xs mt-1" style={{ color: statusColors[attendStatus] }}>
                {getStatusMessage(afterAttend, threshold)}
              </p>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
