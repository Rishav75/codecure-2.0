import React from 'react';
import {
  ShieldAlert,
  Users,
  Activity,
  Server,
  Cpu,
  Database,
  CheckCircle2,
  RefreshCw,
  Terminal,
} from 'lucide-react';

export const AdminDashboardView: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white border border-slate-700 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
            <Server className="w-3.5 h-3.5 text-emerald-400" /> Platform Infrastructure Operations
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            Enterprise Admin & AI Operations Dashboard
          </h1>
          <p className="text-xs text-slate-300 leading-relaxed">
            Monitor real-time system performance, Gemini 3.6 API token latency, emergency SOS dispatches, active telehealth video sessions, and database node health.
          </p>
        </div>

        <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span>All Cluster Nodes Operational</span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="text-[10px] font-bold uppercase text-slate-400">Total Active Users</div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">128,490</div>
          <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">+14% this week</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="text-[10px] font-bold uppercase text-slate-400">Gemini API Inferences</div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">1.42M</div>
          <div className="text-[10px] text-teal-600 font-semibold mt-0.5">Avg Latency: 320ms</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="text-[10px] font-bold uppercase text-slate-400">SOS Emergency Calls</div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">3</div>
          <div className="text-[10px] text-slate-400 font-semibold mt-0.5">Resolved by EMS</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="text-[10px] font-bold uppercase text-slate-400">Server Uptime</div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">99.99%</div>
          <div className="text-[10px] text-slate-400 font-semibold mt-0.5">Cloud Run Cluster</div>
        </div>
      </div>

      {/* Operations Console Logs */}
      <div className="p-6 rounded-3xl bg-slate-950 text-slate-200 border border-slate-800 space-y-4 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 font-bold text-teal-400">
            <Terminal className="w-4 h-4" /> Live System Telemetry Stream
          </div>
          <span className="text-[10px] text-slate-500">Auto-refreshing every 1s</span>
        </div>

        <div className="space-y-2 text-[11px] text-slate-300 max-h-60 overflow-y-auto custom-scrollbar">
          <div><span className="text-slate-500">[22:34:01]</span> <span className="text-teal-400">POST /api/gemini/symptom-check</span> - 200 OK (312ms) - Gemini 3.6 Flash structured parse</div>
          <div><span className="text-slate-500">[22:33:48]</span> <span className="text-emerald-400">POST /api/speech/tts</span> - 200 OK (180ms) - Web Audio audio/mp3 buffer generated</div>
          <div><span className="text-slate-500">[22:32:10]</span> <span className="text-teal-400">POST /api/gemini/analyze-report</span> - 200 OK (540ms) - Vision OCR extraction</div>
          <div><span className="text-slate-500">[22:30:05]</span> <span className="text-purple-400">WEBSOCKET</span> - Telehealth WebRTC room initialization doc-01</div>
          <div><span className="text-slate-500">[22:28:12]</span> <span className="text-slate-400">HEALTH_CHECK</span> - Cloud Run container port 3000 ingress healthy</div>
        </div>
      </div>
    </div>
  );
};
