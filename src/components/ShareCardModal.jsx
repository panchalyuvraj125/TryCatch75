import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Share2, Award, ShieldCheck, Sparkles } from 'lucide-react';
import html2canvas from 'html2canvas';
import { useApp } from '../context/AppContext';
import { getOverallAttendance, calculateSafeBunks } from '../utils/storage';
import { showToast } from './ui/Toast';

export default function ShareCardModal({ isOpen, onClose }) {
  const { state } = useApp();
  const cardRef = useRef(null);
  const [downloading, setDownloading] = useState(false);

  const overall = getOverallAttendance(state);
  const info = state.personalInfo || {};
  const name = info.name?.trim() || 'Student';
  const roll = info.rollNumber || 'BA43';
  const branch = info.branch || 'CSE-AIML';
  const sec = info.section || 'AM2';

  const safeBunks = calculateSafeBunks(overall.attended, overall.total, 75);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    try {
      setDownloading(true);
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        backgroundColor: '#0f172a',
        useCORS: true,
      });
      const image = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = image;
      a.download = `TryCatch75_Attendance_${name.replace(/\s+/g, '_')}.png`;
      a.click();
      showToast('Attendance Card downloaded successfully!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to generate image card', 'error');
    } finally {
      setDownloading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-md bg-bg-secondary rounded-2xl border border-border shadow-2xl overflow-hidden my-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <Share2 className="w-5 h-5 text-accent" />
              <h3 className="text-base font-semibold text-text-primary">Attendance Stats Card</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-tertiary transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Graphic Card Preview (Captured by html2canvas) */}
          <div className="p-4 bg-bg-primary">
            <div
              ref={cardRef}
              className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 border border-indigo-500/30 text-white shadow-xl relative overflow-hidden"
            >
              {/* Decorative Glow background */}
              <div className="absolute -top-12 -right-12 w-40 h-40 bg-accent/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

              {/* Top Branding */}
              <div className="flex items-center justify-between mb-5 relative z-10">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-accent/20 border border-accent/40 flex items-center justify-center text-accent font-bold text-sm">
                    75
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold tracking-tight text-white leading-none">TryCatch75</h4>
                    <p className="text-[10px] text-indigo-300 font-medium mt-0.5">Attendance Report</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-accent/20 text-accent border border-accent/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Verified
                </span>
              </div>

              {/* Student Info */}
              <div className="mb-6 relative z-10">
                <p className="text-xs text-indigo-200 uppercase font-semibold tracking-wider">Student Profile</p>
                <h3 className="text-xl font-black text-white tracking-tight">{name}</h3>
                <p className="text-xs text-slate-300 font-mono mt-0.5">
                  Roll: <strong className="text-white">{roll}</strong> • {branch} ({sec})
                </p>
              </div>

              {/* Big Attendance Badge */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-700/60 mb-5 relative z-10 flex items-center justify-between">
                <div>
                  <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Overall Attendance</p>
                  <p className="text-4xl font-black text-emerald-400 tracking-tight mt-0.5">{overall.percentage}%</p>
                </div>
                <div className="text-right">
                  <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {overall.percentage >= 75 ? 'Safe Zone' : 'Alert Zone'}
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono mt-1">Target: 75%</p>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-2 text-center relative z-10">
                <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/50">
                  <p className="text-[10px] text-slate-400 uppercase font-medium">Present</p>
                  <p className="text-base font-bold text-white mt-0.5">{overall.attended}</p>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/50">
                  <p className="text-[10px] text-slate-400 uppercase font-medium">Total</p>
                  <p className="text-base font-bold text-white mt-0.5">{overall.total}</p>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/50">
                  <p className="text-[10px] text-slate-400 uppercase font-medium">Safe Bunks</p>
                  <p className="text-base font-bold text-indigo-300 mt-0.5">{safeBunks}</p>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400 relative z-10">
                <span>Semester III • 2026</span>
                <span className="font-mono text-slate-500">trycatch75.app</span>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="p-4 border-t border-border flex items-center justify-end gap-3 bg-bg-secondary">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-text-secondary hover:text-text-primary rounded-lg transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="px-4 py-2 text-xs font-semibold bg-accent hover:bg-accent-hover text-white rounded-lg transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              {downloading ? 'Generating PNG...' : 'Download Image Card'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
