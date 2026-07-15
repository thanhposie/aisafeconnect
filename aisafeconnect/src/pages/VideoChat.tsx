import { useState } from 'react';
import { Video, VideoOff, Mic, MicOff, PhoneOff, Users, Shield, SkipForward, MessageSquare } from 'lucide-react';

export default function VideoChat() {
  const [isConnected, setIsConnected] = useState(false);
  const [videoOn, setVideoOn] = useState(true);
  const [micOn, setMicOn] = useState(true);

  return (
    <div className="min-h-[calc(100vh-4.5rem)] flex flex-col">
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Video Chat</h1>
            <p className="text-sm text-slate-400 mt-1">Anonymous peer-to-peer video conversation</p>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`} />
            <span className="text-xs font-medium text-slate-400">{isConnected ? 'Connected' : 'Not Connected'}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Area */}
          <div className="lg:col-span-2 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Remote Video */}
              <div className="relative aspect-video rounded-2xl overflow-hidden glass-card">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-800/80 to-slate-900/80 flex items-center justify-center">
                  {isConnected ? (
                    <div className="text-center">
                      <Users className="w-12 h-12 text-violet-400 mx-auto mb-2" />
                      <p className="text-sm text-slate-300 font-medium">Stranger</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Users className="w-12 h-12 text-slate-600 mx-auto mb-2" />
                      <p className="text-sm text-slate-500">Waiting for match...</p>
                    </div>
                  )}
                </div>
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-sm text-xs font-medium text-slate-300 border border-slate-700/40">
                  Remote
                </div>
              </div>

              {/* Local Video */}
              <div className="relative aspect-video rounded-2xl overflow-hidden glass-card">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/30 to-violet-900/30 flex items-center justify-center">
                  <div className="text-center">
                    <Video className="w-10 h-10 text-indigo-400 mx-auto mb-2" />
                    <p className="text-sm text-slate-400">Your Camera</p>
                  </div>
                </div>
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-sm text-xs font-medium text-violet-300 border border-violet-500/20">
                  You
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-3 sm:gap-4 py-4">
              <button onClick={() => setMicOn(!micOn)} className={`p-3.5 sm:p-4 rounded-2xl transition-all ${micOn ? 'bg-slate-800/60 border border-slate-700/40 text-white hover:bg-slate-700/60' : 'bg-rose-600/20 border border-rose-500/30 text-rose-400'}`} aria-label="Toggle microphone">
                {micOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </button>
              <button onClick={() => setVideoOn(!videoOn)} className={`p-3.5 sm:p-4 rounded-2xl transition-all ${videoOn ? 'bg-slate-800/60 border border-slate-700/40 text-white hover:bg-slate-700/60' : 'bg-rose-600/20 border border-rose-500/30 text-rose-400'}`} aria-label="Toggle camera">
                {videoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              </button>
              {isConnected ? (
                <>
                  <button onClick={() => setIsConnected(false)} className="p-3.5 sm:p-4 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/25 transition-all" aria-label="End call">
                    <PhoneOff className="w-5 h-5" />
                  </button>
                  <button className="p-3.5 sm:p-4 rounded-2xl bg-slate-800/60 border border-slate-700/40 text-amber-400 hover:bg-slate-700/60 transition-all" aria-label="Skip">
                    <SkipForward className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <button onClick={() => setIsConnected(true)} className="px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-violet-600/25 transition-all hover:-translate-y-0.5" id="start-matching-btn">
                  Find Match
                </button>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="glass-card rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-sm text-white">Safety Status</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">AI Moderation</span>
                  <span className="text-emerald-400 font-medium">Active</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Encryption</span>
                  <span className="text-emerald-400 font-medium">E2E</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Content Filter</span>
                  <span className="text-emerald-400 font-medium">On</span>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="w-5 h-5 text-violet-400" />
                <h3 className="font-bold text-sm text-white">Chat Guidelines</h3>
              </div>
              <ul className="space-y-2 text-xs text-slate-400">
                <li className="flex items-start gap-2"><span className="text-violet-400 mt-0.5">•</span> Be respectful and kind</li>
                <li className="flex items-start gap-2"><span className="text-violet-400 mt-0.5">•</span> No harassment or hate speech</li>
                <li className="flex items-start gap-2"><span className="text-violet-400 mt-0.5">•</span> No explicit content allowed</li>
                <li className="flex items-start gap-2"><span className="text-violet-400 mt-0.5">•</span> Report any violations</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
