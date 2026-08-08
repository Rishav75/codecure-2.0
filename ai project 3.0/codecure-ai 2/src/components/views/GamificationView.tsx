import React from 'react';
import {
  Trophy,
  Flame,
  Award,
  Zap,
  Sparkles,
  CheckCircle2,
  Lock,
  Gift,
  Coins,
} from 'lucide-react';
import { GamificationStats } from '../../types';

interface GamificationViewProps {
  stats: GamificationStats;
}

export const GamificationView: React.FC<GamificationViewProps> = ({ stats }) => {
  const tokenCount = stats.healthTokens ?? stats.coins ?? 480;
  const levelTitle = stats.levelTitle || 'Bio-Optimizer';
  const displayBadges = stats.badges || stats.achievements || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-950 via-slate-900 to-orange-950 text-white border border-amber-500/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold">
            <Trophy className="w-3.5 h-3.5 text-amber-400" /> Behavioral Nudge Engine
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            Health Gamification & Loyalty Rewards
          </h1>
          <p className="text-xs text-slate-300 leading-relaxed">
            Earn Health Tokens for logging daily biometric metrics, maintaining sleep streaks, and achieving weekly workout goals. Redeem tokens for medical discounts or wearable accessories.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center shrink-0">
            <div className="text-[10px] uppercase font-bold text-amber-200">Health Token Balance</div>
            <div className="text-2xl font-black text-amber-400 mt-0.5 flex items-center justify-center gap-1">
              <Coins className="w-5 h-5 text-amber-400" /> {tokenCount}
            </div>
          </div>
        </div>
      </div>

      {/* Level & Streak Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="text-[10px] uppercase font-bold text-slate-400">Current Health Level</div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
            Level {stats.level} <span className="text-xs font-bold text-teal-600 dark:text-teal-400">({levelTitle})</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden mt-2">
            <div
              className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full"
              style={{ width: `${(stats.xp % 1000) / 10}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-400 font-semibold">{1000 - (stats.xp % 1000)} XP until Level {stats.level + 1}</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="text-[10px] uppercase font-bold text-slate-400">Current Daily Streak</div>
          <div className="text-2xl font-black text-amber-500 flex items-center gap-2">
            <Flame className="w-6 h-6 fill-amber-500 animate-pulse" /> {stats.streakDays} Days
          </div>
          <p className="text-xs text-slate-500 font-medium">Keep logging daily to protect your streak!</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="text-[10px] uppercase font-bold text-slate-400">Badges Unlocked</div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100">
            {displayBadges.filter((a) => a.unlocked).length} / {displayBadges.length}
          </div>
          <p className="text-xs text-slate-500 font-medium">Top 5% of active community members</p>
        </div>
      </div>

      {/* Badges & Achievements Grid */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
          Achievements & Milestones
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {displayBadges.map((ach: any) => (
            <div
              key={ach.id}
              className={`p-4 rounded-2xl border transition-all flex items-start gap-3 ${
                ach.unlocked
                  ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-300/60 dark:border-amber-800/60'
                  : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-60'
              }`}
            >
              <div className="text-3xl shrink-0 p-2 rounded-xl bg-white dark:bg-slate-800 shadow-sm">
                🏆
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100">{ach.title}</h4>
                  {ach.unlocked ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  )}
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">{ach.description}</p>
                <span className="inline-block text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400 mt-1">
                  +{ach.xpReward || 100} XP
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
