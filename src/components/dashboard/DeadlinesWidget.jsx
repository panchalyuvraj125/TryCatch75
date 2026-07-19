import { useState } from 'react';
import { useDeadlines } from '../../hooks/useDeadlines';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import { Calendar, Plus, Trash2, BookOpen, PenTool, LayoutTemplate } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

const typeIcons = {
  exam: BookOpen,
  assignment: PenTool,
  project: LayoutTemplate,
};

const typeColors = {
  exam: 'text-[var(--accent-red)] bg-[var(--accent-red)]/10',
  assignment: 'text-[var(--accent-cyan)] bg-[var(--accent-cyan)]/10',
  project: 'text-[var(--accent-purple)] bg-[var(--accent-purple)]/10',
};

export default function DeadlinesWidget() {
  const { deadlines, addDeadline, deleteDeadline } = useDeadlines();
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ title: '', date: '', type: 'exam' });

  const handleSave = () => {
    if (!form.title || !form.date) return;
    addDeadline({
      title: form.title,
      date: new Date(form.date).toISOString(),
      type: form.type,
    });
    setModalOpen(false);
    setForm({ title: '', date: '', type: 'exam' });
  };

  return (
    <Card className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar size={18} className="text-[var(--accent-orange)]" />
          <h3 className="font-heading font-semibold text-[var(--text-primary)]">
            Deadlines & Exams
          </h3>
        </div>
        <button 
          onClick={() => setModalOpen(true)}
          className="w-6 h-6 rounded-md flex items-center justify-center bg-[var(--bg-secondary)] hover:bg-[var(--accent-orange)]/20 text-[#a1a1aa] hover:text-[var(--accent-orange)] transition-colors"
        >
          <Plus size={14} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto min-h-[150px] pr-1">
        {deadlines.length > 0 ? (
          <div className="space-y-3">
            <AnimatePresence>
              {deadlines.map((dl) => {
                const TypeIcon = typeIcons[dl.type] || Calendar;
                const daysLeft = differenceInDays(new Date(dl.date), new Date());
                let urgencyClass = 'text-[var(--text-secondary)]';
                if (daysLeft < 3) urgencyClass = 'text-[var(--accent-red)] font-semibold';
                else if (daysLeft < 7) urgencyClass = 'text-[var(--accent-orange)] font-medium';

                return (
                  <motion.div
                    key={dl.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-default)] group"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${typeColors[dl.type] || typeColors.exam}`}>
                        <TypeIcon size={14} />
                      </div>
                      <div>
                        <p className="text-[13px] font-medium text-[var(--text-primary)]">{dl.title}</p>
                        <p className="text-[11px] text-[var(--text-muted)]">{format(new Date(dl.date), 'MMM d, yyyy')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-[11px] ${urgencyClass}`}>
                        {daysLeft === 0 ? 'Today!' : daysLeft < 0 ? 'Past' : `${daysLeft}d left`}
                      </span>
                      <button 
                        onClick={() => deleteDeadline(dl.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-[#71717a] hover:text-[var(--accent-red)] transition-all"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-70 mt-4">
            <Calendar size={32} className="text-[#3f3f46] mb-3" />
            <p className="text-sm text-[var(--text-secondary)] font-medium">No upcoming deadlines.</p>
            <p className="text-[11px] text-[var(--text-muted)] mt-1 max-w-[200px]">Click the + button to track an exam or assignment.</p>
          </div>
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add Deadline" size="sm">
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-[var(--text-muted)] mb-1">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={e => setForm({...form, title: e.target.value})}
              placeholder="e.g. OS Midsem"
              className="cyber-input"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-xs text-[var(--text-muted)] mb-1">Date</label>
            <input
              type="date"
              value={form.date}
              onChange={e => setForm({...form, date: e.target.value})}
              className="cyber-input"
            />
          </div>
          <div>
            <label className="block text-xs text-[var(--text-muted)] mb-1">Type</label>
            <select
              value={form.type}
              onChange={e => setForm({...form, type: e.target.value})}
              className="cyber-select"
            >
              <option value="exam">Exam / Test</option>
              <option value="assignment">Assignment / Submission</option>
              <option value="project">Project Deadline</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={!form.title || !form.date}>Save</Button>
          </div>
        </div>
      </Modal>
    </Card>
  );
}
