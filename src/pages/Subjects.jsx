import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, BookOpen, FlaskConical, Presentation } from 'lucide-react';
import { useSubjects } from '../hooks/useSubjects';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';
import {
  SUBJECT_TYPES,
  SUBJECT_TYPE_LABELS,
  SEMESTERS,
} from '../utils/constants';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import SmartTimetableUpload from '../components/setup/SmartTimetableUpload';

const typeIcons = {
  theory: BookOpen,
  lab: FlaskConical,
  tutorial: Presentation,
};

export default function Subjects() {
  const { user } = useAuth();
  const { subjects, addSubject, updateSubject, deleteSubject } = useSubjects();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [form, setForm] = useState({
    name: '',
    credits: 3,
    type: 'theory',
    teacherName: '',
    contactNote: '',
    semester: 1,
  });

  const openAdd = () => {
    setEditingSubject(null);
    setForm({ name: '', credits: 3, type: 'theory', teacherName: '', contactNote: '', semester: 1 });
    setModalOpen(true);
  };

  const openEdit = (subject) => {
    setEditingSubject(subject);
    setForm({
      name: subject.name || '',
      credits: subject.credits || 3,
      type: subject.type || 'theory',
      teacherName: subject.teacherName || '',
      contactNote: subject.contactNote || '',
      semester: subject.semester || 1,
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error('Subject name is required');
      return;
    }

    try {
      if (editingSubject) {
        await updateSubject(editingSubject.id, form);
        toast.success('Subject updated');
      } else {
        await addSubject(form);
        toast.success('Subject added! 📚');
      }
      setModalOpen(false);
    } catch (error) {
      toast.error('Failed to save subject');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteSubject(id);
      toast.success('Subject deleted');
      setConfirmDelete(null);
    } catch (error) {
      toast.error('Failed to delete subject');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-[var(--text-primary)]">
            Subjects
          </h1>
          <p className="text-sm text-[var(--text-secondary)]">
            Manage your semester subjects
          </p>
        </div>
        <Button onClick={openAdd} icon={Plus}>
          Add Subject
        </Button>
      </div>

      {/* Smart Timetable Upload */}
      <SmartTimetableUpload 
        geminiKey={(() => {
          try {
            const p = JSON.parse(localStorage.getItem(`tc75_profile_${user?.uid}`));
            return p?.geminiKey || '';
          } catch { return ''; }
        })()} 
        semester={1}
        onComplete={() => {}}
      />

      {/* Subject List */}
      {subjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {subjects.map((subject, i) => {
              const TypeIcon = typeIcons[subject.type] || BookOpen;
              return (
                <motion.div
                  key={subject.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card hoverable>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-[var(--accent-cyan)]/10 flex items-center justify-center">
                          <TypeIcon size={16} className="text-[var(--accent-cyan)]" />
                        </div>
                        <div>
                          <h3 className="font-heading font-semibold text-sm text-[var(--text-primary)]">
                            {subject.name}
                          </h3>
                          <div className="flex items-center gap-2">
                            <Badge variant="info" size="xs">
                              {SUBJECT_TYPE_LABELS[subject.type] || 'Theory'}
                            </Badge>
                            <span className="text-xs text-[var(--text-muted)]">
                              {subject.credits} credits
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEdit(subject)}
                          className="p-1.5 rounded-md text-[var(--text-muted)] hover:text-[var(--accent-cyan)] hover:bg-[var(--bg-secondary)] transition-colors"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => setConfirmDelete(subject.id)}
                          className="p-1.5 rounded-md text-[var(--text-muted)] hover:text-[var(--accent-red)] hover:bg-[var(--accent-red)]/10 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    {subject.teacherName && (
                      <p className="text-xs text-[var(--text-muted)]">
                        👤 {subject.teacherName}
                        {subject.contactNote && ` · ${subject.contactNote}`}
                      </p>
                    )}
                    <p className="text-xs text-[var(--text-muted)] mt-1">
                      Semester {subject.semester}
                    </p>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      ) : (
        <Card className="text-center py-12">
          <BookOpen size={40} className="text-[var(--text-muted)] mx-auto mb-3" />
          <h3 className="font-heading text-lg font-semibold text-[var(--text-primary)] mb-2">
            No subjects yet
          </h3>
          <p className="text-sm text-[var(--text-secondary)] mb-4">
            Add your first subject to get started tracking attendance.
          </p>
          <Button onClick={openAdd} icon={Plus}>
            Add Subject
          </Button>
        </Card>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingSubject ? 'Edit Subject' : 'Add Subject'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-[var(--text-muted)] mb-1">
              Subject Name *
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g., Data Structures & Algorithms"
              className="cyber-input"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-[var(--text-muted)] mb-1">
                Type
              </label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="cyber-select"
              >
                <option value="theory">Theory</option>
                <option value="lab">Lab / Practical</option>
                <option value="tutorial">Tutorial</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-[var(--text-muted)] mb-1">
                Credits
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={form.credits}
                onChange={(e) =>
                  setForm({ ...form, credits: parseInt(e.target.value) || 1 })
                }
                className="cyber-input"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-[var(--text-muted)] mb-1">
              Semester
            </label>
            <select
              value={form.semester}
              onChange={(e) =>
                setForm({ ...form, semester: parseInt(e.target.value) })
              }
              className="cyber-select"
            >
              {SEMESTERS.map((sem) => (
                <option key={sem.value} value={sem.value}>
                  {sem.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-[var(--text-muted)] mb-1">
              Teacher Name (optional)
            </label>
            <input
              type="text"
              value={form.teacherName}
              onChange={(e) =>
                setForm({ ...form, teacherName: e.target.value })
              }
              placeholder="e.g., Prof. Sharma"
              className="cyber-input"
            />
          </div>

          <div>
            <label className="block text-xs text-[var(--text-muted)] mb-1">
              Contact Note (optional)
            </label>
            <input
              type="text"
              value={form.contactNote}
              onChange={(e) =>
                setForm({ ...form, contactNote: e.target.value })
              }
              placeholder="e.g., Room 204, ext. 3456"
              className="cyber-input"
            />
          </div>

          {form.type === 'lab' && (
            <p className="text-xs text-[var(--accent-cyan)] bg-[var(--accent-cyan)]/5 px-3 py-2 rounded-lg">
              💡 Lab sessions count as 2 slots per session in attendance calculations.
            </p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editingSubject ? 'Update' : 'Add Subject'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <Modal
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        title="Delete Subject?"
        size="sm"
      >
        <p className="text-sm text-[var(--text-secondary)] mb-4">
          This will permanently delete this subject. Attendance records for this subject will remain.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setConfirmDelete(null)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={() => handleDelete(confirmDelete)}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}
