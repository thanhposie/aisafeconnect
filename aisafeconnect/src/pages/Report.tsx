import { useState } from 'react';
import { Flag, AlertTriangle, Send, CheckCircle2 } from 'lucide-react';

export default function Report() {
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const reasons = [
    'Harassment or bullying',
    'Inappropriate content',
    'Hate speech',
    'Spam or scam',
    'Impersonation',
    'Other',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Report:', { reason, description });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-[calc(100vh-4.5rem)] flex items-center justify-center px-4">
        <div className="text-center animate-fade-in-up">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-black text-white mb-2">Report Submitted</h2>
          <p className="text-slate-400 text-sm max-w-sm mx-auto">Thank you for helping keep SafeConnect safe. Our team will review your report within 24 hours.</p>
          <button onClick={() => { setSubmitted(false); setReason(''); setDescription(''); }} className="mt-6 px-6 py-3 rounded-xl bg-slate-800/60 border border-slate-700/40 text-sm font-medium text-slate-300 hover:text-white transition-colors">
            Submit Another Report
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4.5rem)] max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-1/3 left-1/3 w-72 h-72 bg-rose-600/5 rounded-full blur-3xl" />
      </div>

      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
          <Flag className="w-6 h-6 text-rose-400" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Report a User</h1>
          <p className="text-sm text-slate-400 mt-1">Help us maintain a safe community</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 sm:p-8 space-y-6" id="report-form">
        <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/5 border border-amber-500/15">
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-300/80 leading-relaxed">
            False reports may result in action against your account. Please only report genuine violations of our community guidelines.
          </p>
        </div>

        <div className="space-y-2">
          <label htmlFor="report-reason" className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Reason</label>
          <select id="report-reason" value={reason} onChange={(e) => setReason(e.target.value)} className="w-full py-3.5 px-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500/50 transition-all" required>
            <option value="">Select a reason</option>
            {reasons.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="report-desc" className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Description</label>
          <textarea id="report-desc" value={description} onChange={(e) => setDescription(e.target.value)} rows={5} placeholder="Please describe what happened..." className="w-full py-3.5 px-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-500 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500/50 transition-all resize-none" required />
        </div>

        <button type="submit" className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-rose-600/20 transition-all hover:-translate-y-0.5 duration-200" id="report-submit-btn">
          <Send className="w-4 h-4" />
          Submit Report
        </button>
      </form>
    </div>
  );
}
