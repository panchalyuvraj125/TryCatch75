import { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { Smartphone, Download, Upload, Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DataSync() {
  const [syncData, setSyncData] = useState('');
  const [importData, setImportData] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Collect all important localStorage keys
    const data = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('subjects_') || key.startsWith('attendance_') || key.startsWith('timetables_') || key.startsWith('profiles') || key.startsWith('users')) {
        data[key] = localStorage.getItem(key);
      }
    }
    const compressed = btoa(encodeURIComponent(JSON.stringify(data)));
    setSyncData(compressed);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(syncData);
    setCopied(true);
    toast.success('Sync code copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleImport = () => {
    try {
      const decoded = JSON.parse(decodeURIComponent(atob(importData)));
      
      // Basic validation
      if (!decoded || typeof decoded !== 'object') throw new Error('Invalid format');
      
      Object.keys(decoded).forEach(key => {
        localStorage.setItem(key, decoded[key]);
      });
      
      toast.success('Data imported successfully! Reloading...');
      setTimeout(() => window.location.reload(), 1500);
    } catch (e) {
      toast.error('Invalid sync code. Please check and try again.');
    }
  };

  return (
    <Card className="border-[var(--accent-purple)] shadow-[0_0_15px_rgba(168,85,247,0.1)]">
      <div className="flex items-center gap-2 mb-4">
        <Smartphone size={18} className="text-[var(--accent-purple)]" />
        <h3 className="font-heading font-semibold text-[var(--text-primary)]">
          Offline Data Sync
        </h3>
      </div>
      <p className="text-[12px] text-[var(--text-secondary)] mb-6 leading-relaxed">
        Securely sync your attendance and subjects to another device without any cloud servers. 
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Export Side */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-[var(--text-primary)] flex items-center gap-2">
            <Upload size={14} className="text-[var(--text-muted)]" /> Export Data
          </h4>
          
          {syncData.length < 1500 ? (
            <div className="bg-white p-4 rounded-xl inline-block">
              <QRCode value={syncData} size={150} />
            </div>
          ) : (
            <div className="text-[11px] text-[var(--accent-yellow)] bg-[var(--accent-yellow)]/10 p-3 rounded-lg">
              Data is too large for a QR code. Please use the copy button below.
            </div>
          )}

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleCopy} className="flex-1" icon={copied ? Check : Copy}>
              {copied ? 'Copied!' : 'Copy Sync Code'}
            </Button>
          </div>
        </div>

        {/* Import Side */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-[var(--text-primary)] flex items-center gap-2">
            <Download size={14} className="text-[var(--text-muted)]" /> Import Data
          </h4>
          <textarea
            value={importData}
            onChange={(e) => setImportData(e.target.value)}
            placeholder="Paste your sync code here..."
            className="w-full h-32 bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-xl p-3 text-[12px] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-purple)] font-mono resize-none"
          />
          <Button 
            onClick={handleImport} 
            disabled={!importData.trim()} 
            className="w-full bg-[var(--accent-purple)] text-white hover:bg-[var(--accent-purple)]/90 border-none"
          >
            Import & Replace Local Data
          </Button>
        </div>
      </div>
    </Card>
  );
}
