import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSubjects } from '../hooks/useSubjects';
import { useAttendance } from '../hooks/useAttendance';
import { useCalculator } from '../hooks/useCalculator';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { UNIVERSITY_PRESETS, BRANCHES, YEARS, SEMESTERS } from '../utils/constants';
import { exportCSV, printReport, shareWhatsApp } from '../utils/exportUtils';
import {
  User,
  Download,
  Printer,
  Share2,
  School,
  Save,
  LogOut,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Settings() {
  const { user, profile, updateProfile, signOut } = useAuth();
  const { subjects } = useSubjects();
  const { getSubjectStats } = useAttendance();
  const { subjectStats } = useCalculator(subjects, getSubjectStats);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    roll_no: '',
    branch: '',
    year: '',
    university: 'custom',
    semester: 1,
    threshold: 75,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        roll_no: profile.roll_no || '',
        branch: profile.branch || '',
        year: profile.year || '',
        university: profile.university || 'custom',
        semester: profile.semester || 1,
        threshold: profile.threshold || 75,
      });
    }
  }, [profile]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile({
        name: formData.name,
        roll_no: formData.roll_no,
        branch: formData.branch,
        year: formData.year,
        university: formData.university,
        semester: formData.semester,
        threshold: formData.threshold,
      });
      toast.success('Profile saved!');
    } catch (error) {
      toast.error('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handleUniversityChange = (uniId) => {
    const preset = UNIVERSITY_PRESETS[uniId];
    if (preset) {
      setFormData({
        ...formData,
        university: uniId,
        threshold: preset.threshold,
      });
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  const exportData = subjectStats.map((s) => ({
    name: s.name,
    type: s.type,
    total: s.total,
    present: s.present,
    absent: s.absent,
    medical: s.medical || 0,
    holiday: s.holiday || 0,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-[var(--text-primary)]">
          Settings
        </h1>
        <p className="text-sm text-[var(--text-secondary)]">
          Profile, university, and data export
        </p>
      </div>

      {/* Account Info */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <User size={18} className="text-[var(--accent-cyan)]" />
          <h3 className="font-heading font-semibold text-[var(--text-primary)]">
            Account
          </h3>
        </div>

        <div className="bg-[var(--bg-secondary)] rounded-lg p-4 mb-4">
          <p className="text-sm text-[var(--text-secondary)]">
            Signed in as <strong className="text-[var(--text-primary)]">{user?.email}</strong>
          </p>
        </div>

        <Button variant="ghost" icon={LogOut} onClick={handleSignOut} size="sm">
          Sign Out
        </Button>
      </Card>

      {/* Profile */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <User size={18} className="text-[var(--accent-cyan)]" />
          <h3 className="font-heading font-semibold text-[var(--text-primary)]">
            Profile
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-[var(--text-muted)] mb-1">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Your name"
              className="cyber-input"
            />
          </div>
          <div>
            <label className="block text-xs text-[var(--text-muted)] mb-1">Roll No</label>
            <input
              type="text"
              value={formData.roll_no}
              onChange={(e) => setFormData({ ...formData, roll_no: e.target.value })}
              placeholder="e.g., 21CS102"
              className="cyber-input"
            />
          </div>
          <div>
            <label className="block text-xs text-[var(--text-muted)] mb-1">Branch</label>
            <select
              value={formData.branch}
              onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
              className="cyber-select"
            >
              <option value="">Select branch</option>
              {BRANCHES.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-[var(--text-muted)] mb-1">Year</label>
            <select
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              className="cyber-select"
            >
              <option value="">Select year</option>
              {YEARS.map((y) => (
                <option key={y.value} value={y.value}>{y.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-[var(--text-muted)] mb-1">Semester</label>
            <select
              value={formData.semester}
              onChange={(e) => setFormData({ ...formData, semester: parseInt(e.target.value) })}
              className="cyber-select"
            >
              {SEMESTERS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-[var(--text-muted)] mb-1">
              Attendance Threshold (%)
            </label>
            <input
              type="number"
              min="50"
              max="100"
              value={formData.threshold}
              onChange={(e) =>
                setFormData({ ...formData, threshold: parseInt(e.target.value) || 75 })
              }
              className="cyber-input font-mono"
            />
          </div>
        </div>

        <div className="mt-4">
          <Button icon={Save} onClick={handleSave} loading={saving} size="sm">
            Save Profile
          </Button>
        </div>
      </Card>

      {/* University Mode */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <School size={18} className="text-[var(--accent-purple)]" />
          <h3 className="font-heading font-semibold text-[var(--text-primary)]">
            University
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {Object.values(UNIVERSITY_PRESETS).map((uni) => (
            <button
              key={uni.id}
              onClick={() => handleUniversityChange(uni.id)}
              className={`px-3 py-3 rounded-lg border text-left transition-all text-xs
                ${
                  formData.university === uni.id
                    ? 'border-[var(--accent-cyan)] bg-[var(--accent-cyan)]/10 text-[var(--accent-cyan)]'
                    : 'border-[var(--border-default)] text-[var(--text-secondary)] hover:border-[var(--border-hover)]'
                }`}
            >
              <p className="font-medium">{uni.shortName}</p>
              {uni.location && (
                <p className="text-[10px] text-[var(--text-muted)] mt-0.5">
                  {uni.location}
                </p>
              )}
            </button>
          ))}
        </div>
      </Card>

      {/* Export */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Download size={18} className="text-[var(--accent-green)]" />
          <h3 className="font-heading font-semibold text-[var(--text-primary)]">
            Export Data
          </h3>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            size="sm"
            icon={Download}
            onClick={() => exportCSV(exportData, formData.name)}
            disabled={exportData.length === 0}
          >
            Download CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            icon={Printer}
            onClick={() => printReport(exportData, { ...formData, rollNo: formData.roll_no })}
            disabled={exportData.length === 0}
          >
            Print Report
          </Button>
          <Button
            variant="outline"
            size="sm"
            icon={Share2}
            onClick={() => shareWhatsApp(exportData, formData.name)}
            disabled={exportData.length === 0}
          >
            Share via WhatsApp
          </Button>
        </div>

        {exportData.length === 0 && (
          <p className="text-xs text-[var(--text-muted)] mt-2">
            Add subjects and mark attendance to enable export.
          </p>
        )}
      </Card>
    </div>
  );
}
