import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader as Loader2, Mail, Lock, User, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      if (isSignUp) {
        await signUp(email, password, name || email.split('@')[0]);
        toast.success('Account created! Welcome aboard.');
      } else {
        await signIn(email, password);
        toast.success('Welcome back!');
      }
      navigate('/dashboard');
    } catch (error) {
      const message = error?.message?.toLowerCase() || 'authentication failed';

      if (message.includes('invalid credentials') || message.includes('invalid login')) {
        toast.error('Invalid email or password');
      } else if (message.includes('already registered') || message.includes('already exists')) {
        toast.error('An account with this email already exists');
        setIsSignUp(false);
      } else if (message.includes('weak password')) {
        toast.error('Password is too weak. Use at least 6 characters.');
      } else {
        toast.error(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111111] flex flex-col justify-center items-center px-4 relative overflow-hidden">
      <div className="w-full max-w-[400px] mx-auto relative z-10">
        <form onSubmit={handleSubmit} className="bg-[#18181b] border border-[#27272a] rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[var(--accent-orange)]" />
            <span className="font-heading font-bold text-[32px] text-[#f4f4f5] tracking-tight">
              TryCatch<sup className="text-base font-medium text-[var(--text-muted)] ml-1">75</sup>
            </span>
          </div>
          <p className="text-[14px] text-[#a1a1aa] italic font-serif mb-8 tracking-wide">
            {isSignUp ? 'Create your free account' : 'An attendance notebook for the chronically late.'}
          </p>

          <div className="space-y-4 mb-6">
            {isSignUp && (
              <div>
                <label className="block text-[10px] tracking-[0.15em] text-[#71717a] font-mono uppercase mb-2">
                  Your Name
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#52525b]" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#111111] border border-[#27272a] rounded-lg pl-10 pr-4 py-3 text-[#f4f4f5] placeholder-[#52525b] focus:outline-none focus:border-[var(--accent-orange)] transition-colors text-sm"
                    placeholder="e.g. Yuvraj Panchal"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[10px] tracking-[0.15em] text-[#71717a] font-mono uppercase mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#52525b]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#111111] border border-[#27272a] rounded-lg pl-10 pr-4 py-3 text-[#f4f4f5] placeholder-[#52525b] focus:outline-none focus:border-[var(--accent-orange)] transition-colors text-sm"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] tracking-[0.15em] text-[#71717a] font-mono uppercase mb-2">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#52525b]" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#111111] border border-[#27272a] rounded-lg pl-10 pr-4 py-3 text-[#f4f4f5] placeholder-[#52525b] focus:outline-none focus:border-[var(--accent-orange)] transition-colors text-sm"
                  placeholder="Min. 6 characters"
                  required
                  minLength={6}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all bg-[var(--accent-orange)] text-white hover:bg-[#e05b29] disabled:opacity-70 text-[15px]"
          >
            {isLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <>
                {isSignUp ? 'Create Account' : 'Sign In'}
                <ArrowRight size={16} />
              </>
            )}
          </button>

          <div className="mt-6 pt-6 border-t border-[#27272a] text-center">
            <p className="text-[13px] text-[#71717a]">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-[var(--accent-orange)] font-medium hover:underline"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>

          <p className="text-center text-[10px] font-mono tracking-widest text-[#52525b] mt-6">
            Your data is synced securely across devices.
          </p>
        </form>
      </div>
    </div>
  );
}
