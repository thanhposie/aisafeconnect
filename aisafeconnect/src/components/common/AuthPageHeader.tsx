import { Shield } from 'lucide-react';

interface AuthPageHeaderProps {
  title: string;
  subtitle: string;
}

/**
 * AuthPageHeader — Shield logo + title + subtitle used on Login and Register pages.
 */
export default function AuthPageHeader({ title, subtitle }: AuthPageHeaderProps) {
  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-xl shadow-violet-600/25 mb-6">
        <Shield className="w-8 h-8 text-white" />
      </div>
      <h1 className="text-3xl font-black text-white tracking-tight">{title}</h1>
      <p className="text-slate-400 mt-2 text-sm">{subtitle}</p>
    </div>
  );
}
