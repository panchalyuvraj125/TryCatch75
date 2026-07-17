import { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Sparkles, Loader2, Bot } from 'lucide-react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { useAuth } from '../../contexts/AuthContext';

export default function AIAdvisor({ subjectStats, overallStats }) {
  const { user } = useAuth();
  const [advice, setAdvice] = useState('');
  const [loading, setLoading] = useState(false);

  const getAdvice = async () => {
    let geminiKey = '';
    try {
      const p = JSON.parse(localStorage.getItem(`tc75_profile_${user?.uid}`));
      geminiKey = p?.geminiKey || '';
    } catch {}

    if (!geminiKey) {
      setAdvice('Please add your free Gemini API Key in Settings to use the AI Advisor.');
      return;
    }

    setLoading(true);
    try {
      const genAI = new GoogleGenerativeAI(geminiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      const prompt = `You are an encouraging but realistic academic advisor for an engineering student. 
      Their college strictly requires 75% attendance.
      Overall Attendance: ${overallStats.overallPercent.toFixed(1)}%
      Subject Breakdown:
      ${subjectStats.map(s => `- ${s.name}: ${s.percent.toFixed(1)}% (${s.present}/${s.total} attended)`).join('\n')}
      
      Give a short (3 sentences max), punchy piece of advice. 
      Tell them exactly which class they are failing and MUST attend next, or congratulate them if they are entirely safe to bunk. 
      Use a casual, student-friendly tone (bro/dude/etc is fine). Keep it directly useful. Don't use markdown formatting.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      setAdvice(response.text());
    } catch (error) {
      setAdvice('Oops, something went wrong talking to the AI. Check your API key or internet connection.');
    } finally {
      setLoading(false);
    }
  };

  if (!subjectStats || subjectStats.length === 0) return null;

  return (
    <Card className="border-[var(--accent-purple)]/30 bg-gradient-to-br from-[#18181b] to-[rgba(168,85,247,0.05)]">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Bot size={18} className="text-[var(--accent-purple)]" />
          <h3 className="font-heading font-semibold text-[var(--text-primary)]">Smart AI Advisor</h3>
        </div>
        {!advice && !loading && (
          <Button size="xs" onClick={getAdvice} icon={Sparkles} className="bg-[var(--accent-purple)] hover:bg-[var(--accent-purple)]/90 text-white border-none">
            Ask AI
          </Button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-[var(--text-muted)] animate-pulse">
          <Loader2 size={14} className="animate-spin" /> Analyzing your attendance habits...
        </div>
      ) : advice ? (
        <div className="text-sm text-[var(--text-primary)] leading-relaxed">
          <p className="italic">"{advice}"</p>
          <div className="mt-3">
             <Button variant="ghost" size="xs" onClick={getAdvice} className="text-[var(--text-muted)] hover:text-[var(--accent-purple)]">
               Get another tip
             </Button>
          </div>
        </div>
      ) : (
        <p className="text-xs text-[var(--text-muted)]">
          Not sure what you can safely bunk tomorrow? Ask the AI to analyze your stats and figure out a strategy.
        </p>
      )}
    </Card>
  );
}
