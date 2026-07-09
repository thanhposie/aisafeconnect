import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Menu, X, Video, LogIn, UserPlus } from 'lucide-react';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/chat', label: 'Video Chat' },
    { to: '/report', label: 'Report' },
    { to: '/profile', label: 'Profile' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/60 backdrop-blur-xl bg-slate-950/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group" id="navbar-logo">
            <div className="relative bg-gradient-to-tr from-violet-600 to-indigo-500 p-2.5 rounded-xl shadow-lg shadow-violet-500/20 text-white transition-transform group-hover:scale-105">
              <Shield className="w-5 h-5 sm:w-6 sm:h-6" />
              <div className="absolute inset-0 rounded-xl bg-violet-400/20 blur-sm" />
            </div>
            <div>
              <span className="text-lg sm:text-xl font-extrabold tracking-tight bg-gradient-to-r from-violet-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                SafeConnect
              </span>
              <span className="hidden sm:block text-[10px] font-semibold text-slate-500 tracking-widest uppercase">
                Secure Video Chat
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1" id="navbar-desktop">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.to)
                    ? 'text-white bg-violet-600/15 border border-violet-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3" id="navbar-actions">
            <Link
              to="/login"
              className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-slate-800/50"
              id="navbar-login-btn"
            >
              <LogIn className="w-4 h-4" />
              Login
            </Link>
            <Link
              to="/register"
              className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-md shadow-violet-600/20 hover:shadow-violet-500/30 hover:-translate-y-0.5"
              id="navbar-register-btn"
            >
              <UserPlus className="w-4 h-4" />
              Sign Up
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors"
            id="navbar-mobile-toggle"
            aria-label="Toggle mobile menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-800/60 bg-slate-950/95 backdrop-blur-xl animate-fade-in-up">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive(link.to)
                    ? 'text-white bg-violet-600/15 border border-violet-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                {link.label === 'Video Chat' && <Video className="w-4 h-4" />}
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-slate-800/40 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 text-sm font-medium text-slate-300 hover:text-white transition-colors px-4 py-3 rounded-xl hover:bg-slate-800/50"
              >
                <LogIn className="w-4 h-4" />
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-5 py-3 rounded-xl font-semibold text-sm"
              >
                <UserPlus className="w-4 h-4" />
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
