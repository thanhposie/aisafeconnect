import { User, Mail, Shield, Clock, Settings, Camera } from 'lucide-react';

export default function Profile() {
  return (
    <div className="min-h-[calc(100vh-4.5rem)] max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-1/4 right-1/3 w-72 h-72 bg-violet-600/6 rounded-full blur-3xl" />
      </div>

      <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-8">My Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Avatar Card */}
        <div className="glass-card rounded-2xl p-6 text-center">
          <div className="relative inline-block mb-4">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-xl shadow-violet-600/20">
              <User className="w-10 h-10 text-white" />
            </div>
            <button className="absolute bottom-0 right-0 p-2 rounded-full bg-slate-800 border border-slate-700/50 text-slate-400 hover:text-white transition-colors" aria-label="Change avatar">
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>
          <h2 className="text-lg font-bold text-white">Anonymous User</h2>
          <p className="text-xs text-slate-500 mt-1">Member since July 2026</p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-xs text-emerald-400 font-medium">Online</span>
          </div>
        </div>

        {/* Stats & Info */}
        <div className="md:col-span-2 space-y-6">
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <Settings className="w-4 h-4 text-slate-400" /> Account Details
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/30 border border-slate-700/30">
                <Mail className="w-4 h-4 text-slate-500" />
                <div>
                  <div className="text-xs text-slate-500">Email</div>
                  <div className="text-sm text-white font-medium">user@safeconnect.app</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/30 border border-slate-700/30">
                <Shield className="w-4 h-4 text-slate-500" />
                <div>
                  <div className="text-xs text-slate-500">Trust Score</div>
                  <div className="text-sm text-emerald-400 font-medium">98% — Excellent</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/30 border border-slate-700/30">
                <Clock className="w-4 h-4 text-slate-500" />
                <div>
                  <div className="text-xs text-slate-500">Total Sessions</div>
                  <div className="text-sm text-white font-medium">47 chats</div>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-sm font-bold text-white mb-4">Chat Statistics</h3>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Total Chats', value: '47', color: 'text-violet-400' },
                { label: 'Avg Duration', value: '8m', color: 'text-indigo-400' },
                { label: 'Reports Filed', value: '2', color: 'text-rose-400' },
              ].map((stat) => (
                <div key={stat.label} className="text-center p-3 rounded-xl bg-slate-800/20 border border-slate-800/30">
                  <div className={`text-xl font-black ${stat.color}`}>{stat.value}</div>
                  <div className="text-[11px] text-slate-500 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
