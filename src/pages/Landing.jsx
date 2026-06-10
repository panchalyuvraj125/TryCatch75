import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import AnimatedCounter from '../components/ui/AnimatedCounter';
import Button from '../components/ui/Button';
import {
  Calculator,
  BarChart3,
  Calendar,
  Shield,
  Smartphone,
  Download,
  LogIn,
  ChevronRight,
  GraduationCap,
  CheckCircle2,
  Github,
} from 'lucide-react';
import toast from 'react-hot-toast';

const features = [
  {
    icon: Calculator,
    title: '75% Calculator',
    desc: 'Know exactly how many classes you can bunk and still stay safe.',
  },
  {
    icon: BarChart3,
    title: 'Analytics & Charts',
    desc: 'Visual attendance trends, streaks, and subject-wise insights.',
  },
  {
    icon: Calendar,
    title: 'Smart Timetable',
    desc: 'Auto-detect today\'s classes and mark attendance in one tap.',
  },
  {
    icon: Shield,
    title: 'Detention Alerts',
    desc: 'Get warned before any subject drops below the danger zone.',
  },
  {
    icon: Smartphone,
    title: 'Install as App',
    desc: 'Works offline on your phone. No app store needed — it\'s a PWA!',
  },
  {
    icon: Download,
    title: 'Export Data',
    desc: 'CSV export, printable reports, and WhatsApp sharing built in.',
  },
];

const steps = [
  { num: '01', title: 'Add Subjects', desc: 'Enter your semester subjects with credits and type.' },
  { num: '02', title: 'Mark Attendance', desc: 'Tap Present or Absent each day — takes 10 seconds.' },
  { num: '03', title: 'See Your Budget', desc: 'Instantly know how many classes you can safely skip.' },
];

export default function Landing() {
  const { signInWithGoogle, user } = useAuth();
  const navigate = useNavigate();

  const handleSignIn = () => {
    navigate('/login');
  };

  // If user is already signed in, redirect
  if (user) {
    navigate('/dashboard');
    return null;
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Background Motion Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.3, 0.15],
            x: [0, 50, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] bg-[var(--accent-cyan)]/20 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.1, 0.25, 0.1],
            x: [0, -60, 0],
            y: [0, 60, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute top-[40%] -right-[10%] w-[60vw] h-[60vw] bg-[var(--accent-purple)]/20 rounded-full blur-[120px]"
        />
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-[var(--border-default)] bg-[var(--bg-secondary)]/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo.svg" alt="TryCatch75 Logo" className="w-8 h-8 drop-shadow-[0_0_8px_rgba(0,245,255,0.4)]" />
            <span className="font-heading font-bold text-lg text-[var(--text-primary)]">
              TryCatch<span className="text-[var(--accent-cyan)]">75</span>
            </span>
          </div>
          <Button onClick={handleSignIn} size="sm" icon={LogIn}>
            Sign In
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--accent-cyan)]/20 bg-[var(--accent-cyan)]/5 mb-6">
              <GraduationCap size={14} className="text-[var(--accent-cyan)]" />
              <span className="text-xs text-[var(--accent-cyan)] font-medium">
                Built for Indian Engineering Students
              </span>
            </div>

            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-[var(--text-primary)] mb-4 leading-tight">
              Never Miss{' '}
              <span className="text-gradient">75%</span>.{' '}
              <br className="hidden sm:block" />
              Never Miss College.
            </h1>

            <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto mb-8">
              The smartest attendance tracker built for Indian engineering students.
              Know exactly how many classes you can skip — and still stay safe.
            </p>

            {/* Animated Counter */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mb-8"
            >
              <div className="inline-flex items-center justify-center w-40 h-40 rounded-full border-2 border-[var(--accent-cyan)]/30 bg-[var(--bg-card)]">
                <AnimatedCounter
                  value={75}
                  duration={2000}
                  decimals={0}
                  suffix="%"
                  className="text-5xl text-[var(--accent-cyan)] glow-text"
                />
              </div>
              <p className="text-sm text-[var(--text-muted)] mt-2">The magic number</p>
            </motion.div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button onClick={handleSignIn} size="lg" icon={LogIn}>
                Sign In
              </Button>
              <p className="text-xs text-[var(--text-muted)]">
                Secure authentication. 100% free.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-[var(--bg-secondary)]/50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-heading text-3xl font-bold text-[var(--text-primary)] mb-3">
              Everything you need to beat the system
            </h2>
            <p className="text-[var(--text-secondary)]">
              Built with engineering students in mind. Every feature is free.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="cyber-card group hover:border-[var(--accent-cyan)]/30"
                >
                  <div className="w-10 h-10 rounded-lg bg-[var(--accent-cyan)]/10 flex items-center justify-center mb-3">
                    <Icon size={20} className="text-[var(--accent-cyan)]" />
                  </div>
                  <h3 className="font-heading font-semibold text-[var(--text-primary)] mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)]">{feature.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-3xl font-bold text-[var(--text-primary)] text-center mb-12">
            Three steps. That's it.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--accent-cyan)] to-[var(--accent-purple)] flex items-center justify-center mx-auto mb-3">
                  <span className="font-mono font-bold text-[#0a0a0f]">{step.num}</span>
                </div>
                <h3 className="font-heading font-semibold text-[var(--text-primary)] mb-1">
                  {step.title}
                </h3>
                <p className="text-sm text-[var(--text-secondary)]">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-[var(--bg-secondary)]/50">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <p className="font-mono text-4xl font-bold text-[var(--accent-cyan)]">75%</p>
              <p className="text-sm text-[var(--text-secondary)] mt-1">is the magic number</p>
            </div>
            <div>
              <p className="font-mono text-4xl font-bold text-[var(--accent-green)]">∞</p>
              <p className="text-sm text-[var(--text-secondary)] mt-1">bunks calculated</p>
            </div>
            <div>
              <p className="font-mono text-4xl font-bold text-[var(--accent-purple)]">6+</p>
              <p className="text-sm text-[var(--text-secondary)] mt-1">
                universities supported
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-[var(--border-default)]">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-[var(--text-secondary)]">
            Built for engineering students, by engineering students.
          </p>
          <p className="text-xs text-[var(--text-muted)] mt-2">
            TryCatch75 — DBATU, Mumbai Uni, Pune Uni, VTU, GTU, RTU and more.
          </p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            >
              <Github size={18} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
