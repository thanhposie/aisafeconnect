import { Link } from 'react-router-dom';
import { Home, SearchX } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-4.5rem)] flex items-center justify-center px-4">
      <div className="text-center animate-fade-in-up">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-violet-500/10 border border-violet-500/20 mb-6 animate-float">
          <SearchX className="w-10 h-10 text-violet-400" />
        </div>
        <h1 className="text-6xl sm:text-8xl font-black gradient-text mb-4">404</h1>
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Page Not Found</h2>
        <p className="text-slate-400 text-sm max-w-sm mx-auto mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-violet-600/20 transition-all hover:-translate-y-0.5 duration-200"
          id="notfound-home-btn"
        >
          <Home className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
