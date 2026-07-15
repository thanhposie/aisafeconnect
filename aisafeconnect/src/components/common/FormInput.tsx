import type { InputHTMLAttributes, ReactNode } from 'react';

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  icon: ReactNode;
  /** Optional element rendered on the right side (e.g. show/hide password toggle) */
  rightSlot?: ReactNode;
}

/**
 * FormInput — labelled text/email/password input with a left icon slot
 * and an optional right slot (e.g. eye-toggle button).
 */
export default function FormInput({ id, label, icon, rightSlot, className = '', ...rest }: FormInputProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none">
          {icon}
        </span>
        <input
          id={id}
          className={`w-full pl-12 ${rightSlot ? 'pr-12' : 'pr-4'} py-3.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-500 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500/50 transition-all ${className}`}
          {...rest}
        />
        {rightSlot && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2">
            {rightSlot}
          </span>
        )}
      </div>
    </div>
  );
}
