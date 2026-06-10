import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) return toast.error('Please enter username and password');
    
    setIsLoading(true);
    const email = `${username}@trycatch75.app`;
    
    try {
      await login(username, password);
      toast.success(`Welcome, ${username}!`);
      navigate('/dashboard');
    } catch (error) {
      toast.error(error?.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111111] flex flex-col justify-center items-center px-4 relative overflow-hidden">
      <div className="w-full max-w-[360px] mx-auto relative z-10">
        <form onSubmit={handleSubmit} className="bg-[#18181b] border border-[#27272a] rounded-2xl p-7 shadow-2xl">
          <div className="flex items-center gap-2.5 mb-1.5">
            <div className="w-2 h-2 rounded-full bg-[var(--accent-orange)]" />
            <span className="font-heading font-bold text-[28px] text-[#f4f4f5] tracking-tight">
              TryCatch<sup className="text-sm font-medium text-[var(--text-muted)] ml-[2px]">75</sup>
            </span>
          </div>
          <p className="text-[13px] text-[#a1a1aa] italic font-serif mb-8 tracking-wide">
            An attendance notebook for the chronically late.
          </p>

          <div className="space-y-4 mb-5">
            <div>
              <label className="block text-[9px] tracking-[0.2em] text-[#71717a] font-mono uppercase mb-2">Your Name</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[#111111] border border-[#27272a] rounded-lg px-4 py-2.5 text-[#f4f4f5] placeholder-[#52525b] focus:outline-none focus:border-[var(--accent-orange)] transition-colors text-sm"
                placeholder="e.g. Yuvraj"
                required
              />
            </div>
            <div>
              <label className="block text-[9px] tracking-[0.2em] text-[#71717a] font-mono uppercase mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#111111] border border-[#27272a] rounded-lg px-4 py-2.5 text-[#f4f4f5] placeholder-[#52525b] focus:outline-none focus:border-[var(--accent-orange)] transition-colors text-sm"
                placeholder="Enter password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-all bg-[var(--accent-orange)] text-white hover:bg-[#e05b29] disabled:opacity-70 mt-5 text-[14px]"
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : 'Begin tracking →'}
          </button>

          <p className="text-center text-[9px] font-mono tracking-widest text-[#52525b] mt-6">
            Your data lives on this device - nothing leaves.
          </p>
        </form>
      </div>
    </div>
  );
}
