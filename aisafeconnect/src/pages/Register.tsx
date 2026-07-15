import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Check } from 'lucide-react';
import { PageBackground, FormInput, AuthPageHeader } from '../components/common';

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

  const confirmBorderColor =
    confirmPassword && confirmPassword !== password
      ? 'border-rose-500/50'
      : confirmPassword && confirmPassword === password
        ? 'border-emerald-500/50'
        : 'border-slate-700/50';

  return (
    <div className="min-h-[calc(100vh-4.5rem)] flex items-center justify-center px-4 py-12 sm:py-20">
      <PageBackground
        orb1="top-1/3 right-1/4 bg-violet-600/8"
        orb2="bottom-1/3 left-1/4 bg-indigo-600/8"
      />

      <div className="w-full max-w-md space-y-8 animate-fade-in-up">
        <AuthPageHeader title="Create Account" subtitle="Join SafeConnect and start chatting safely" />

        <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 sm:p-8 space-y-5" id="register-form">
          <FormInput
            id="reg-user"
            label="Username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Choose a username"
            icon={<User className="w-4 h-4" />}
            required
          />

          <FormInput
            id="reg-email"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            icon={<Mail className="w-4 h-4" />}
            required
          />

          {/* Password with strength indicator */}
          <div className="space-y-1">
            <FormInput
              id="reg-pass"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              icon={<Lock className="w-4 h-4" />}
              rightSlot={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-500 hover:text-slate-300 transition-colors"
                  aria-label="Toggle password"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
              required
            />
            {password.length > 0 && (
              <div className="flex items-center gap-2 pt-1">
                <div className="flex gap-1 flex-1">
                  {[1, 2, 3].map((l) => (
                    <div key={l} className={`h-1 flex-1 rounded-full transition-all ${l <= strength.level ? strength.color : 'bg-slate-700'}`} />
                  ))}
                </div>
                <span className="text-[11px] text-slate-500 font-medium">{strength.label}</span>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <FormInput
            id="reg-confirm"
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm password"
            icon={<Lock className="w-4 h-4" />}
            className={confirmBorderColor}
            rightSlot={
              confirmPassword && confirmPassword === password
                ? <Check className="w-4 h-4 text-emerald-500" />
                : undefined
            }
            required
          />

          <label className="flex items-start gap-3 cursor-pointer" htmlFor="reg-terms">
            <input
              id="reg-terms"
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded bg-slate-800 border-slate-600 text-violet-600 focus:ring-violet-500/30"
              required
            />
            <span className="text-xs text-slate-400">
              I agree to the{' '}
              <a href="#" className="text-violet-400 hover:text-violet-300">Terms</a>
              {' '}and{' '}
              <a href="#" className="text-violet-400 hover:text-violet-300">Privacy Policy</a>
            </span>
          </label>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-violet-600/20 transition-all hover:-translate-y-0.5 duration-200"
            id="register-submit-btn"
          >
            Create Account <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-sm text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="text-violet-400 hover:text-violet-300 font-semibold transition-colors">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
