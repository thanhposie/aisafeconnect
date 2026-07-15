import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, Shield, ArrowRight, Check } from 'lucide-react';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Register:', { username, email, password });
  };

  const strength = (() => {
    if (password.length === 0) return { level: 0, label: '', color: '' };
    if (password.length < 6) return { level: 1, label: 'Weak', color: 'bg-rose-500' };
    if (password.length < 10) return { level: 2, label: 'Medium', color: 'bg-amber-500' };
    return { level: 3, label: 'Strong', color: 'bg-emerald-500' };
  })();

  return (
    <div className="min-h-[calc(100vh-4.5rem)] flex items-center justify-center px-4 py-12 sm:py-20">
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-violet-600/8 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-indigo-600/8 rounded-full blur-3xl" />
      </div>
      <div className="w-full max-w-md space-y-8 animate-fade-in-up">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-xl shadow-violet-600/25 mb-6">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Create Account</h1>
          <p className="text-slate-400 mt-2 text-sm">Join SafeConnect and start chatting safely</p>
        </div>
        <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 sm:p-8 space-y-5" id="register-form">
          <div className="space-y-2">
            <label htmlFor="reg-user" className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Username</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input id="reg-user" type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Choose a username" className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-500 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500/50 transition-all" required />
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="reg-email" className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input id="reg-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-500 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500/50 transition-all" required />
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="reg-pass" className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input id="reg-pass" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a password" className="w-full pl-12 pr-12 py-3.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-500 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500/50 transition-all" required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors" aria-label="Toggle password">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {password.length > 0 && (
              <div className="flex items-center gap-2 pt-1">
                <div className="flex gap-1 flex-1">{[1,2,3].map(l => <div key={l} className={`h-1 flex-1 rounded-full transition-all ${l <= strength.level ? strength.color : 'bg-slate-700'}`} />)}</div>
                <span className="text-[11px] text-slate-500 font-medium">{strength.label}</span>
              </div>
            )}
          </div>
          <div className="space-y-2">
            <label htmlFor="reg-confirm" className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input id="reg-confirm" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm password" className={`w-full pl-12 pr-12 py-3.5 rounded-xl bg-slate-800/50 border text-white placeholder-slate-500 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-violet-500/30 transition-all ${confirmPassword && confirmPassword !== password ? 'border-rose-500/50' : confirmPassword && confirmPassword === password ? 'border-emerald-500/50' : 'border-slate-700/50'}`} required />
              {confirmPassword && confirmPassword === password && <Check className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />}
            </div>
          </div>
          <label className="flex items-start gap-3 cursor-pointer" htmlFor="reg-terms">
            <input id="reg-terms" type="checkbox" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} className="mt-0.5 w-4 h-4 rounded bg-slate-800 border-slate-600 text-violet-600 focus:ring-violet-500/30" required />
            <span className="text-xs text-slate-400">I agree to the <a href="#" className="text-violet-400 hover:text-violet-300">Terms</a> and <a href="#" className="text-violet-400 hover:text-violet-300">Privacy Policy</a></span>
          </label>
          <button type="submit" className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-violet-600/20 transition-all hover:-translate-y-0.5 duration-200" id="register-submit-btn">
            Create Account <ArrowRight className="w-4 h-4" />
          </button>
        </form>
        <p className="text-center text-sm text-slate-400">
          Already have an account? <Link to="/login" className="text-violet-400 hover:text-violet-300 font-semibold transition-colors">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
