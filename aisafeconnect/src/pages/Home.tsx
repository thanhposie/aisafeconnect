import { Users, Video, ShieldCheck, Flag, Zap, Lock, Globe, Cpu } from 'lucide-react';
import Hero from '../components/home/Hero';
import FeatureCard from '../components/home/FeatureCard';

export default function Home() {
  const features = [
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Anonymous Matching',
      description: 'Get paired with random users worldwide. No personal data shared — your identity stays completely private.',
      gradient: 'from-violet-600 to-purple-600',
    },
    {
      icon: <Video className="w-6 h-6" />,
      title: 'Real-time Video',
      description: 'Crystal-clear peer-to-peer video and audio powered by WebRTC. Low-latency, high-quality connections.',
      gradient: 'from-indigo-600 to-blue-600',
    },
    {
      icon: <ShieldCheck className="w-6 h-6" />,
      title: 'AI Moderation',
      description: 'Cutting-edge AI continuously monitors chat sessions to detect and prevent harmful content in real time.',
      gradient: 'from-emerald-600 to-teal-600',
    },
    {
      icon: <Flag className="w-6 h-6" />,
      title: 'Report Users',
      description: 'Built-in reporting system lets you flag inappropriate behavior. Our team reviews reports within 24 hours.',
      gradient: 'from-rose-600 to-pink-600',
    },
  ];

  const advancedFeatures = [
    {
      icon: <Zap className="w-5 h-5 text-amber-400" />,
      title: 'Instant Connections',
      description: 'Get matched in under a second with our optimized matchmaking engine',
    },
    {
      icon: <Lock className="w-5 h-5 text-cyan-400" />,
      title: 'End-to-End Encrypted',
      description: 'All video and audio streams are fully encrypted for maximum privacy',
    },
    {
      icon: <Globe className="w-5 h-5 text-violet-400" />,
      title: 'Global Network',
      description: 'Connect with users from 190+ countries on our distributed infrastructure',
    },
    {
      icon: <Cpu className="w-5 h-5 text-emerald-400" />,
      title: 'Smart AI Engine',
      description: 'Powered by advanced ML models trained on millions of data points',
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <Hero />

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <div className="text-center mb-14 sm:mb-20">
          <span className="inline-block text-xs font-bold text-violet-400 uppercase tracking-widest mb-4 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20">
            Core Features
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            Everything you need for{' '}
            <span className="gradient-text">safe video chat</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-400 mt-4 max-w-2xl mx-auto">
            SafeConnect combines powerful technology with thoughtful design to create the safest anonymous video chat experience.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              gradient={feature.gradient}
              delay={index * 0.1}
            />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-950/50 via-indigo-950/50 to-slate-950" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-600/5 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Side */}
            <div className="space-y-8">
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Built with{' '}
                <span className="gradient-text">advanced technology</span>
              </h2>
              <p className="text-slate-400 text-base leading-relaxed">
                SafeConnect uses state-of-the-art AI models and distributed infrastructure to deliver a seamless, secure video chat experience.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {advancedFeatures.map((feat) => (
                  <div
                    key={feat.title}
                    className="flex gap-4 p-4 rounded-xl bg-slate-900/40 border border-slate-800/50 hover:border-slate-700/60 transition-all"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-slate-800/60 border border-slate-700/30 flex items-center justify-center">
                      {feat.icon}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{feat.title}</h4>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">{feat.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side — Visual */}
            <div className="relative flex items-center justify-center">
              <div className="relative w-full max-w-md aspect-square">
                {/* Outer ring */}
                <div className="absolute inset-0 rounded-full border border-slate-800/40" />
                <div className="absolute inset-4 rounded-full border border-slate-700/30" />
                <div className="absolute inset-8 rounded-full border border-violet-500/10" />

                {/* Center orb */}
                <div className="absolute inset-16 rounded-full bg-gradient-to-br from-violet-600/20 via-indigo-600/20 to-cyan-600/20 backdrop-blur-sm border border-violet-500/20 flex items-center justify-center animate-float">
                  <div className="text-center">
                    <ShieldCheck className="w-12 h-12 sm:w-16 sm:h-16 text-violet-400 mx-auto mb-3" />
                    <div className="text-sm font-bold text-white">AI Protected</div>
                    <div className="text-xs text-slate-500 mt-1">24/7 Moderation</div>
                  </div>
                </div>

                {/* Floating orbs */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-violet-500 rounded-full shadow-lg shadow-violet-500/50 animate-pulse" />
                <div className="absolute bottom-10 left-0 w-2 h-2 bg-cyan-500 rounded-full shadow-lg shadow-cyan-500/50 animate-pulse" style={{ animationDelay: '0.5s' }} />
                <div className="absolute top-1/3 right-0 w-2.5 h-2.5 bg-indigo-500 rounded-full shadow-lg shadow-indigo-500/50 animate-pulse" style={{ animationDelay: '1s' }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <div className="relative rounded-3xl overflow-hidden glass-card p-8 sm:p-12 md:p-16 text-center">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600/5 via-indigo-600/10 to-cyan-600/5" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-violet-600/10 rounded-full blur-3xl" />

          <div className="relative space-y-6">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
              Ready to connect <span className="gradient-text">safely</span>?
            </h2>
            <p className="text-base sm:text-lg text-slate-400 max-w-xl mx-auto">
              Join thousands of users who trust SafeConnect for secure, anonymous video conversations.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <a
                href="/chat"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white px-8 py-4 rounded-2xl font-bold text-base shadow-xl shadow-violet-600/25 transition-all hover:-translate-y-1 duration-300"
              >
                <Video className="w-5 h-5" />
                Start Chatting Now
              </a>
              <a
                href="/register"
                className="inline-flex items-center gap-2 text-slate-300 hover:text-white px-8 py-4 rounded-2xl font-semibold text-base border border-slate-700/50 hover:border-violet-500/30 transition-all"
              >
                Create Free Account
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
