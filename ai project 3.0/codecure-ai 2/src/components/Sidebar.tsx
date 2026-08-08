import React from 'react';
import {
  LayoutDashboard,
  Bot,
  Stethoscope,
  FileText,
  Pill,
  Smartphone,
  Moon,
  HeartPulse,
  Utensils,
  Dumbbell,
  Watch,
  UserCheck,
  ShieldAlert,
  TrendingUp,
  Users,
  Trophy,
  User,
  ShieldCheck,
  Sparkles,
  Zap,
  Siren,
} from 'lucide-react';
import { ActiveTab, GamificationState } from '../types';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  gamification?: GamificationState;
  streakDays?: number;
  healthTokens?: number;
  isOpen?: boolean;
  setIsOpen?: (val: boolean) => void;
  mobileMenuOpen?: boolean;
  setMobileMenuOpen?: (val: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  gamification = { level: 4, xp: 3450, coins: 480, streakDays: 14, badges: [], dailyMissions: [] },
  streakDays,
  healthTokens,
  isOpen,
  setIsOpen,
  mobileMenuOpen,
  setMobileMenuOpen,
}) => {
  const isMobileOpen = mobileMenuOpen ?? isOpen ?? false;
  const closeMobile = () => {
    if (setMobileMenuOpen) setMobileMenuOpen(false);
    if (setIsOpen) setIsOpen(false);
  };
  const navSections: {
    title: string;
    items: { tab: ActiveTab; label: string; icon: React.FC<{ className?: string }>; badge?: string }[];
  }[] = [
    {
      title: 'CORE INTELLIGENCE',
      items: [
        { tab: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
        { tab: 'ai-assistant', label: 'AI Health Assistant', icon: Bot, badge: 'Voice/Vision' },
        { tab: 'symptom-checker', label: 'AI Symptom Checker', icon: Stethoscope },
        { tab: 'medical-scanner', label: 'Medical Report Scanner', icon: FileText, badge: 'OCR' },
      ],
    },
    {
      title: 'WELLBEING & PREVENTION',
      items: [
        { tab: 'medicine-manager', label: 'Medicine Manager', icon: Pill },
        { tab: 'digital-wellbeing', label: 'Digital Wellbeing', icon: Smartphone },
        { tab: 'sleep-coach', label: 'Sleep Coach & Alarm', icon: Moon },
        { tab: 'mental-wellness', label: 'Mental Balance', icon: HeartPulse },
        { tab: 'nutrition-ai', label: 'Nutrition AI', icon: Utensils },
        { tab: 'fitness', label: 'Fitness & Hydration', icon: Dumbbell },
        { tab: 'wearables', label: 'Wearable Sync', icon: Watch },
      ],
    },
    {
      title: 'CLINICAL & NETWORK',
      items: [
        { tab: 'emergency-response', label: 'Emergency Response', icon: Siren, badge: 'Live Ops' },
        { tab: 'doctor-connect', label: 'Doctor Connect', icon: UserCheck },
        { tab: 'emergency', label: 'Emergency SOS & Map', icon: ShieldAlert, badge: 'GPS' },
        { tab: 'risk-prediction', label: 'AI Risk Prediction', icon: TrendingUp },
        { tab: 'community', label: 'Community Support', icon: Users },
        { tab: 'gamification', label: 'Quests & Badges', icon: Trophy, badge: `Lvl ${gamification.level}` },
      ],
    },
    {
      title: 'SYSTEM & PROFILE',
      items: [
        { tab: 'profile', label: 'Medical Profile & ID', icon: User },
        { tab: 'admin-dashboard', label: 'Enterprise Admin', icon: ShieldCheck },
      ],
    },
  ];

  const handleSelectTab = (tab: ActiveTab) => {
    setActiveTab(tab);
    closeMobile();
  };

  const navContent = (
    <div className="flex flex-col h-full py-4 px-3 space-y-6">
      {/* Gamification Level Banner */}
      <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-slate-100 backdrop-blur-md">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-600 text-white font-bold text-xs shadow-md shadow-blue-500/20">
              Lvl {gamification.level || 4}
            </div>
            <span className="text-xs font-semibold text-slate-200">Health Pioneer</span>
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-amber-400">
            <Sparkles className="w-3.5 h-3.5 fill-amber-400" />
            {healthTokens ?? gamification.coins ?? 480} Tokens
          </div>
        </div>
        <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400 h-full rounded-full transition-all duration-500"
            style={{ width: `${((gamification.xp || 3450) % 1000) / 10}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 mt-1">
          <span>{gamification.xp || 3450} XP total</span>
          <span>{streakDays ?? gamification.streakDays ?? 14}d streak 🔥</span>
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto space-y-5 pr-1 custom-scrollbar">
        {navSections.map((section) => (
          <div key={section.title} className="space-y-1">
            <div className="text-[10px] font-bold tracking-widest text-slate-400 px-3 uppercase mb-1">
              {section.title}
            </div>
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.tab;
              return (
                <button
                  key={item.tab}
                  onClick={() => handleSelectTab(item.tab)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 group ${
                    isActive
                      ? 'bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20 font-semibold shadow-lg shadow-blue-500/5'
                      : 'text-slate-400 hover:text-white hover:bg-white/5 transition-colors'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 transition-transform duration-200 ${isActive ? 'scale-110 text-blue-400' : 'group-hover:scale-110'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                        isActive
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          : 'bg-white/5 text-slate-400 border border-white/5'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 border-r border-white/10 bg-black/40 backdrop-blur-2xl h-[calc(100vh-4rem)] sticky top-16 overflow-hidden z-20">
        {navContent}
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
            onClick={closeMobile}
          />
          <div className="relative w-72 max-w-full bg-slate-900/95 backdrop-blur-2xl border-r border-white/10 h-full shadow-2xl z-10">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
};
