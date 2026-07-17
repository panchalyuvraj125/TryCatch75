import { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Loader2, Check, AlertTriangle, Sparkles } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useSubjects } from '../../hooks/useSubjects';
import Button from '../ui/Button';
import Card from '../ui/Card';
import toast from 'react-hot-toast';

export default function SmartTimetableUpload({ geminiKey, semester, onComplete }) {
  const { addSubject } = useSubjects();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.type.startsWith('image/')) {
      setFile(selected);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(selected);
      setResults(null);
    }
  };

  const fileToGenerativePart = async (file) => {
    const base64EncodedDataPromise = new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(',')[1]);
      reader.readAsDataURL(file);
    });
    return {
      inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
  };

  const processImage = async () => {
    if (!file) return;
    if (!geminiKey) {
      toast.error('Please add your Gemini API Key in Settings first.');
      return;
    }

    setIsProcessing(true);
    const toastId = toast.loading('AI is reading your timetable...');

    try {
      const genAI = new GoogleGenerativeAI(geminiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const imagePart = await fileToGenerativePart(file);
      
      const prompt = `You are a helpful assistant. Extract all unique subjects or courses from this timetable image.
      Return the output STRICTLY as a JSON array of objects. 
      Do NOT include any markdown formatting like \`\`\`json or \`\`\`. 
      Each object should have these keys:
      - "name": string (the full name of the subject)
      - "shortName": string (a short 2-4 letter abbreviation)
      - "type": string (either "lecture", "lab", or "tutorial")
      Example: [{"name": "Data Structures", "shortName": "DSA", "type": "lecture"}]`;

      const result = await model.generateContent([prompt, imagePart]);
      const response = await result.response;
      let text = response.text();
      
      // Cleanup markdown just in case
      text = text.replace(/```json/g, '').replace(/```/g, '').trim();
      
      const parsedSubjects = JSON.parse(text);
      
      if (!Array.isArray(parsedSubjects) || parsedSubjects.length === 0) {
        throw new Error("No subjects found in the image.");
      }

      setResults(parsedSubjects);
      toast.success('Timetable parsed successfully!', { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error('Failed to parse timetable. Try a clearer image.', { id: toastId });
    } finally {
      setIsProcessing(false);
    }
  };

  const saveSubjects = async () => {
    if (!results) return;
    
    setIsProcessing(true);
    let addedCount = 0;
    
    try {
      for (const sub of results) {
        await addSubject({
          name: sub.name || 'Unknown Subject',
          shortName: sub.shortName || sub.name?.substring(0, 3).toUpperCase() || 'UNK',
          type: sub.type?.toLowerCase() === 'lab' ? 'lab' : 'lecture',
          color: 'var(--accent-cyan)',
          semester: semester || 1,
        });
        addedCount++;
      }
      toast.success(`Saved ${addedCount} subjects to your account!`);
      if (onComplete) onComplete();
    } catch (err) {
      toast.error('Error saving subjects.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="border-[var(--accent-cyan)] shadow-[0_0_15px_rgba(0,245,255,0.1)]">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles size={20} className="text-[var(--accent-cyan)]" />
        <h3 className="font-heading font-semibold text-[var(--text-primary)]">
          Smart Timetable OCR
        </h3>
      </div>
      
      <p className="text-sm text-[var(--text-secondary)] mb-4 leading-relaxed">
        Upload a photo or screenshot of your college timetable. Our AI will automatically read it and extract all your subjects instantly.
      </p>

      {!preview ? (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-[var(--border-default)] rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-[var(--accent-cyan)] hover:bg-[var(--accent-cyan)]/5 transition-all"
        >
          <ImageIcon size={32} className="text-[var(--text-muted)] mb-3" />
          <p className="text-sm font-medium text-[var(--text-primary)] mb-1">Click to upload timetable image</p>
          <p className="text-xs text-[var(--text-muted)]">PNG, JPG, or WEBP up to 5MB</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative rounded-xl overflow-hidden border border-[var(--border-default)]">
            <img src={preview} alt="Timetable preview" className="w-full max-h-64 object-contain bg-black/40" />
            {!results && !isProcessing && (
              <button 
                onClick={() => { setFile(null); setPreview(null); }}
                className="absolute top-2 right-2 bg-black/60 p-1.5 rounded-lg text-white hover:bg-red-500/80 transition-colors"
              >
                Change Image
              </button>
            )}
          </div>

          {!results ? (
            <Button 
              onClick={processImage} 
              loading={isProcessing} 
              className="w-full"
              icon={Sparkles}
            >
              Analyze Timetable with AI
            </Button>
          ) : (
            <div className="bg-[var(--bg-secondary)] rounded-xl p-4 border border-[var(--accent-green)]/30">
              <div className="flex items-center gap-2 mb-3">
                <Check size={16} className="text-[var(--accent-green)]" />
                <h4 className="text-sm font-medium text-[var(--text-primary)]">Found {results.length} subjects:</h4>
              </div>
              <ul className="space-y-2 mb-4">
                {results.map((sub, idx) => (
                  <li key={idx} className="text-xs flex justify-between p-2 rounded bg-[var(--bg-primary)] border border-[var(--border-default)]">
                    <span className="font-medium text-[var(--text-primary)]">{sub.name}</span>
                    <div className="flex gap-2">
                      <span className="text-[var(--text-muted)]">{sub.shortName}</span>
                      <span className="text-[var(--accent-cyan)] uppercase text-[10px] bg-[var(--accent-cyan)]/10 px-1.5 py-0.5 rounded">{sub.type}</span>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="flex gap-2">
                <Button 
                  onClick={saveSubjects} 
                  loading={isProcessing}
                  className="flex-1 bg-[var(--accent-green)] text-black hover:bg-[var(--accent-green)]/90 border-none"
                >
                  Save to My Subjects
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => { setResults(null); setFile(null); setPreview(null); }}
                  disabled={isProcessing}
                >
                  Try Again
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/jpeg, image/png, image/webp" 
        className="hidden" 
      />

      {!geminiKey && (
        <div className="mt-4 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30 flex items-start gap-2">
          <AlertTriangle size={16} className="text-yellow-400 mt-0.5 shrink-0" />
          <p className="text-xs text-yellow-200/80">
            You need to add your free Gemini API Key in Settings to use this feature.
          </p>
        </div>
      )}
    </Card>
  );
}
