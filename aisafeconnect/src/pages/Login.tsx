import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { PageBackground, FormInput, AuthPageHeader } from '../components/common';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement login API call
    console.log('Login:', { email, password });
  };

  return (
    <div className="min-h-[calc(100vh-4.5rem)] flex items-center justify-center px-4 py-12 sm:py-20">
      <PageBackground />

      <div className="w-full max-w-md space-y-8 animate-fade-in-up">
        <AuthPageHeader title="Welcome back" subtitle="Sign in to continue to SafeConnect" />

        <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 sm:p-8 space-y-6" id="login-form">
          <FormInput
            id="login-email"
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            icon={<Mail className="w-4 h-4" />}
            required
          />

          <FormInput
            id="login-password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            icon={<Lock className="w-4 h-4" />}
            rightSlot={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-500 hover:text-slate-300 transition-colors"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
            required
          />

          {/* Remember / Forgot */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer" htmlFor="login-remember">
              <input id="login-remember" type="checkbox" className="w-4 h-4 rounded bg-slate-800 border-slate-600 text-violet-600 focus:ring-violet-500/30" />
              <span className="text-slate-400">Remember me</span>
            </label>
            <a href="#" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-violet-600/20 hover:shadow-violet-500/30 transition-all hover:-translate-y-0.5 duration-200"
            id="login-submit-btn"
          >
            Sign In
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-sm text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-violet-400 hover:text-violet-300 font-semibold transition-colors">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
