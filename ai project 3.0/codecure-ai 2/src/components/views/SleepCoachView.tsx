import React from 'react';
import {
  Moon,
  Clock,
  Sparkles,
  Zap,
  Bell,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';
import { SleepLog } from '../../types';

interface SleepCoachViewProps {
  sleepLogs: SleepLog[];
}

export const SleepCoachView: React.FC<SleepCoachViewProps> = ({ sleepLogs }) => {
  const latestLog = sleepLogs[0] || {
    date: 'Today',
    totalHours: 7.8,
    sleepScore: 91,
    deepSleepPercent: 24,
    remSleepPercent: 22,
    lightSleepPercent: 54,
    sleepDebtHours: 0.2,
    bedtime: '22:45',
    wakeTime: '06:33',
    efficiencyPercent: 94,
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-blue-950 text-white border border-indigo-500/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
            <Moon className="w-3.5 h-3.5 text-indigo-400" /> Circadian Architecture & Recovery
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            AI Sleep Coach & Smart Alarm Advisor
          </h1>
          <p className="text-xs text-slate-300 leading-relaxed">
            Analyze sleep cycles, track cumulative sleep debt, receive optimal bedtime schedules based on body temperature minimums, and wake up during light sleep phase.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center shrink-0">
          <div className="text-[10px] uppercase font-bold text-indigo-200">Optimal Bedtime Tonight</div>
          <div className="text-2xl font-black text-white mt-0.5">10:45 PM</div>
          <div className="text-[10px] text-emerald-300 font-semibold mt-0.5">Smart Alarm: 06:30 AM</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Latest Sleep Score Gauge */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6 flex flex-col items-center justify-center text-center">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Last Night's Sleep Quality
          </div>

          <div className="relative flex items-center justify-center">
            <div className="w-40 h-40 rounded-full border-8 border-indigo-500/20 flex flex-col items-center justify-center">
              <span className="text-4xl font-black text-slate-900 dark:text-slate-100">
                {latestLog.sleepScore}
              </span>
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase mt-0.5">
                Sleep Score
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              <div className="text-[10px] text-slate-400">Total Duration</div>
              <div className="font-bold text-sm text-slate-900 dark:text-slate-100">{latestLog.totalHours} hrs</div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              <div className="text-[10px] text-slate-400">Sleep Debt</div>
              <div className="font-bold text-sm text-emerald-600 dark:text-emerald-400">{latestLog.sleepDebtHours} hrs</div>
            </div>
          </div>
        </div>

        {/* Sleep Stage Architecture */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6">
          <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
            Sleep Cycle & Stage Architecture
          </h3>

          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-800/40 text-center">
              <div className="text-[10px] font-bold uppercase text-indigo-600 dark:text-indigo-400">Deep Sleep</div>
              <div className="text-2xl font-black text-indigo-900 dark:text-indigo-200 mt-1">{latestLog.deepSleepPercent}%</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Physical Repair</div>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-200/60 dark:border-purple-800/40 text-center">
              <div className="text-[10px] font-bold uppercase text-purple-600 dark:text-purple-400">REM Sleep</div>
              <div className="text-2xl font-black text-purple-900 dark:text-purple-200 mt-1">{latestLog.remSleepPercent}%</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Cognitive Memory</div>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-800/40 text-center">
              <div className="text-[10px] font-bold uppercase text-blue-600 dark:text-blue-400">Light Sleep</div>
              <div className="text-2xl font-black text-blue-900 dark:text-blue-200 mt-1">{latestLog.lightSleepPercent}%</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Transition Stage</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 space-y-2">
            <div className="text-xs font-bold text-indigo-800 dark:text-indigo-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> AI Circadian Optimization Recommendations
            </div>
            <ul className="space-y-1.5 text-xs text-indigo-950 dark:text-indigo-200">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                <span>Expose eyes to 10 minutes of direct morning sunlight within 30 minutes of waking.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                <span>Keep room temperature at 66°F (19°C) for optimal melatonin production.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                <span>Avoid caffeine consumption after 01:30 PM to maintain deep delta wave density.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
