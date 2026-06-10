import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Calculator() {
  const [entries, setEntries] = useState([]);
  const [subject, setSubject] = useState('');
  const [conducted, setConducted] = useState('');
  const [attended, setAttended] = useState('');

  const handleAdd = () => {
    if (!subject || !conducted || !attended) return;
    setEntries([
      ...entries,
      {
        id: Date.now().toString(),
        subject,
        conducted: parseInt(conducted),
        attended: parseInt(attended),
      },
    ]);
    setSubject('');
    setConducted('');
    setAttended('');
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs tracking-widest text-[var(--text-secondary)] font-mono uppercase mb-2">
          05 · WHAT-IF
        </p>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[var(--text-primary)] tracking-tight">
          % <span className="text-[var(--accent-orange)] italic font-medium">calculator</span>
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mt-4">
          Plug in conducted & attended counts to see where you stand for any subject.
        </p>
      </div>

      <div className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-xl p-4 lg:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-xs font-mono font-bold tracking-widest text-[var(--text-secondary)] mb-2 uppercase">
              Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. PPS (TH)"
              className="w-full bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-lg px-4 py-3 text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-orange)] transition-colors"
            />
          </div>
          <div className="flex-1 w-full">
            <label className="block text-xs font-mono font-bold tracking-widest text-[var(--text-secondary)] mb-2 uppercase">
              Conducted
            </label>
            <input
              type="number"
              value={conducted}
              onChange={(e) => setConducted(e.target.value)}
              placeholder="Total"
              className="w-full bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-lg px-4 py-3 text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-orange)] transition-colors"
            />
          </div>
          <div className="flex-1 w-full">
            <label className="block text-xs font-mono font-bold tracking-widest text-[var(--text-secondary)] mb-2 uppercase">
              Attended
            </label>
            <input
              type="number"
              value={attended}
              onChange={(e) => setAttended(e.target.value)}
              placeholder="Attended"
              className="w-full bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-lg px-4 py-3 text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-orange)] transition-colors"
            />
          </div>
          <button
            onClick={handleAdd}
            className="w-full md:w-auto px-6 py-3 bg-[var(--accent-orange)] text-white font-medium rounded-lg hover:bg-[#e05b29] transition-colors whitespace-nowrap"
          >
            + Add
          </button>
        </div>
      </div>

      {entries.length > 0 ? (
        <div className="space-y-3 mt-8">
          {entries.map((entry) => {
            const percent = entry.conducted > 0 ? (entry.attended / entry.conducted) * 100 : 0;
            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-xl p-4 flex items-center justify-between"
              >
                <div>
                  <h3 className="font-heading font-bold text-lg text-[var(--text-primary)]">
                    {entry.subject}
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)]">
                    {entry.attended} / {entry.conducted} classes
                  </p>
                </div>
                <div className={`font-mono text-2xl font-bold ${percent >= 75 ? 'text-[var(--accent-green)]' : 'text-[var(--accent-red)]'}`}>
                  {percent.toFixed(1)}%
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 mt-10">
          <div className="text-5xl mb-4">🧮</div>
          <h3 className="font-heading text-2xl font-bold text-[var(--text-primary)] mb-2 italic">
            Empty calculator.
          </h3>
          <p className="text-[var(--text-secondary)]">
            Add a subject above to see the math.
          </p>
        </div>
      )}
    </div>
  );
}
