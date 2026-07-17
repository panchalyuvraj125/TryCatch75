import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase';
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
  Sparkles,
  Key
} from 'lucide-react';
import toast from 'react-hot-toast';



export default function Settings() {
  const { user } = useAuth();
  const { subjects } = useSubjects();
  const { getSubjectStats } = useAttendance();
  const { subjectStats } = useCalculator(subjects, getSubjectStats);

  const [profile, setProfile] = useState({
    name: '',
    rollNo: '',
    branch: '',
    year: '',
    university: 'custom',
    semester: 1,
    threshold: 75,
    geminiKey: '',
  });
  const [saving, setSaving] = useState(false);

  // Load profile
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;

      // Try localStorage first
      const cached = localStorage.getItem(`tc75_profile_${user.uid}`);
      if (cached) {
        try {
          setProfile(JSON.parse(cached));
        } catch {}
      }

      // Then try Firestore
      if (isFirebaseConfigured) {
        try {
          const profileRef = doc(db, 'users', user.uid);
          const snap = await getDoc(profileRef);
          if (snap.exists()) {
            const data = snap.data();
            const merged = { ...profile, ...data };
            setProfile(merged);
            localStorage.setItem(`tc75_profile_${user.uid}`, JSON.stringify(merged));
          }
        } catch (err) {
          console.error('Failed to load profile:', err);
        }
      }
    };
    loadProfile();
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (user) {
        localStorage.setItem(`tc75_profile_${user.uid}`, JSON.stringify(profile));
      }

      if (isFirebaseConfigured && user) {
        const profileRef = doc(db, 'users', user.uid);
        await setDoc(profileRef, { ...profile, updatedAt: serverTimestamp() }, { merge: true });
      }

      toast.success('Profile saved! ✓');
    } catch (error) {
      toast.error('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handleUniversityChange = (uniId) => {
    const preset = UNIVERSITY_PRESETS[uniId];
    if (preset) {
      setProfile({
        ...profile,
        university: uniId,
        threshold: preset.threshold,
      });
    }
  };

  // Export data with subject stats
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
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              placeholder="Your name"
              className="cyber-input"
            />
          </div>
          <div>
            <label className="block text-xs text-[var(--text-muted)] mb-1">Roll No</label>
            <input
              type="text"
              value={profile.rollNo}
              onChange={(e) => setProfile({ ...profile, rollNo: e.target.value })}
              placeholder="e.g., 21CS102"
              className="cyber-input"
            />
          </div>
          <div>
            <label className="block text-xs text-[var(--text-muted)] mb-1">Branch</label>
            <select
              value={profile.branch}
              onChange={(e) => setProfile({ ...profile, branch: e.target.value })}
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
              value={profile.year}
              onChange={(e) => setProfile({ ...profile, year: e.target.value })}
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
              value={profile.semester}
              onChange={(e) => setProfile({ ...profile, semester: parseInt(e.target.value) })}
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
              value={profile.threshold}
              onChange={(e) =>
                setProfile({ ...profile, threshold: parseInt(e.target.value) || 75 })
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
                  profile.university === uni.id
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

      {/* AI Settings */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={18} className="text-yellow-400" />
          <h3 className="font-heading font-semibold text-[var(--text-primary)]">
            AI Assistant Settings
          </h3>
        </div>

        <div>
          <label className="block text-xs text-[var(--text-muted)] mb-1">
            Google Gemini API Key
          </label>
          <div className="relative">
            <Key size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="password"
              value={profile.geminiKey || ''}
              onChange={(e) => setProfile({ ...profile, geminiKey: e.target.value })}
              placeholder="AIzaSy..."
              className="cyber-input pl-8 font-mono"
            />
          </div>
          <p className="text-[10px] text-[var(--text-muted)] mt-1.5 leading-relaxed">
            Required for the Free AI Advisor and Smart Timetable OCR. <br />
            Get a free key from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-[var(--accent-cyan)] hover:underline">Google AI Studio</a>.
          </p>
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
            onClick={() => exportCSV(exportData, profile.name)}
            disabled={exportData.length === 0}
          >
            Download CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            icon={Printer}
            onClick={() => printReport(exportData, profile)}
            disabled={exportData.length === 0}
          >
            Print Report
          </Button>
          <Button
            variant="outline"
            size="sm"
            icon={Share2}
            onClick={() => shareWhatsApp(exportData, profile.name)}
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
