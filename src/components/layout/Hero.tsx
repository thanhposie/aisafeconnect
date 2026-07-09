import { Link } from 'react-router-dom';
import { Video, ChevronRight, Sparkles } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative overflow-hidden" id="hero">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-violet-950/30 via-slate-950 to-slate-950" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-violet-600/15 via-indigo-600/10 to-transparent rounded-full blur-3xl" />
      <div className="absolute top-20 -left-20 w-72 h-72 bg-violet-600/10 rounded-full blur-3xl" />
      <div className="absolute top-40 -right-20 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl" />

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-20 sm:pb-32">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs sm:text-sm font-semibold animate-fade-in-up">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Powered Safety • End-to-End Encrypted</span>
          </div>

          {/* Title */}
          <h1
            className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight leading-[1.1] animate-fade-in-up"
            style={{ animationDelay: '0.1s' }}
          >
            <span className="text-white">Safe</span>
            <span className="bg-gradient-to-r from-violet-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">Connect</span>
          </h1>

          {/* Subtitle */}
          <p
            className="text-base sm:text-lg md:text-xl text-slate-300 font-medium max-w-2xl mx-auto leading-relaxed animate-fade-in-up"
            style={{ animationDelay: '0.2s' }}
          >
            Anonymous Video Chat powered by AI moderation.
            <br className="hidden sm:block" />
            Connect with people worldwide in a{' '}
            <span className="text-violet-400 font-semibold">safe</span>,{' '}
            <span className="text-indigo-400 font-semibold">secure</span>, and{' '}
            <span className="text-cyan-400 font-semibold">private</span> environment.
          </p>

          {/* CTA Buttons */}
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-fade-in-up"
            style={{ animationDelay: '0.3s' }}
          >
            <Link
              to="/chat"
              className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white px-8 py-4 rounded-2xl font-bold text-base sm:text-lg shadow-xl shadow-violet-600/25 hover:shadow-violet-500/40 transition-all hover:-translate-y-1 duration-300"
              id="hero-start-chat-btn"
            >
              <Video className="w-5 h-5" />
              Start Chat
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-violet-400/0 via-white/10 to-violet-400/0 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
            <a
              href="#features"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 text-slate-300 hover:text-white px-8 py-4 rounded-2xl font-semibold text-base border border-slate-700/50 hover:border-violet-500/30 bg-slate-900/30 hover:bg-slate-800/40 backdrop-blur-sm transition-all duration-300"
              id="hero-learn-more-btn"
            >
              Learn More
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          {/* Stats */}
          <div
            className="grid grid-cols-3 gap-4 sm:gap-8 max-w-lg mx-auto pt-10 animate-fade-in-up"
            style={{ animationDelay: '0.4s' }}
          >
            {[
              { value: '10K+', label: 'Users Online' },
              { value: '99.9%', label: 'Safe Chats' },
              { value: '<1s', label: 'Match Time' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-xl sm:text-2xl font-black text-white">{stat.value}</div>
                <div className="text-[11px] sm:text-xs text-slate-500 font-medium mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-950 to-transparent" />
    </section>
  );
}
