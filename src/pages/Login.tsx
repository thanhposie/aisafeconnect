import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Shield, ArrowRight } from 'lucide-react';

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
      {/* Background effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/8 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/8 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md space-y-8 animate-fade-in-up">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-xl shadow-violet-600/25 mb-6">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Welcome back</h1>
          <p className="text-slate-400 mt-2 text-sm">Sign in to continue to SafeConnect</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 sm:p-8 space-y-6" id="login-form">
          {/* Email */}
          <div className="space-y-2">
            <label htmlFor="login-email" className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-500 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500/50 transition-all"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label htmlFor="login-password" className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-12 pr-12 py-3.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-500 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500/50 transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

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

          {/* Submit */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-violet-600/20 hover:shadow-violet-500/30 transition-all hover:-translate-y-0.5 duration-200"
            id="login-submit-btn"
          >
            Sign In
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Register Link */}
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
