import type { ReactNode } from 'react';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  gradient: string;
  delay?: number;
}

export default function FeatureCard({ icon, title, description, gradient, delay = 0 }: FeatureCardProps) {
  return (
    <div
      className="group relative glass-card rounded-2xl p-6 sm:p-8 hover:border-violet-500/20 transition-all duration-500 hover:-translate-y-1 animate-fade-in-up"
      style={{ animationDelay: `${delay}s` }}
    >
      {/* Hover Glow */}
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

      {/* Icon */}
      <div className={`relative inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br ${gradient} shadow-lg mb-5`}>
        <div className="text-white">
          {icon}
        </div>
      </div>

      {/* Content */}
      <h3 className="text-lg sm:text-xl font-bold text-white mb-3 group-hover:text-violet-300 transition-colors">
        {title}
      </h3>
      <p className="text-sm text-slate-400 leading-relaxed">
        {description}
      </p>

      {/* Bottom accent line */}
      <div className={`absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-30 transition-opacity duration-500`} />
    </div>
  );
}
