import React, { useState } from 'react';
import {
  Activity,
  Bell,
  Search,
  ShieldAlert,
  Sparkles,
  Sun,
  Moon,
  Menu,
  Heart,
  ChevronRight,
  Lock,
} from 'lucide-react';
import { ActiveTab, UserProfile, CompositeHealthScores } from '../types';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  userProfile: UserProfile;
  healthScores?: CompositeHealthScores;
  onOpenSos: () => void;
  onOpenNotifications: () => void;
  onOpenAuth?: () => void;
  notifications?: any[];
  unreadCount?: number;
  darkMode?: boolean;
  isDarkMode?: boolean;
  setDarkMode?: (val: boolean | ((prev: boolean) => boolean)) => void;
  onToggleDarkMode?: () => void;
  mobileMenuOpen?: boolean;
  setMobileMenuOpen?: (val: boolean) => void;
  setSidebarOpen?: (val: boolean | ((prev: boolean) => boolean)) => void;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  userProfile,
  healthScores = { overallHealthScore: 92, heartHealth: 90, mentalWellbeing: 88, sleepQuality: 86, physicalActivity: 94, riskIndex: 12 },
  onOpenSos,
  onOpenNotifications,
  onOpenAuth,
  notifications = [],
  unreadCount,
  darkMode,
  isDarkMode,
  setDarkMode,
  onToggleDarkMode,
  mobileMenuOpen,
  setMobileMenuOpen,
  setSidebarOpen,
  searchQuery = '',
  setSearchQuery,
}) => {
  const [internalSearchQuery, setInternalSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  const currentSearch = searchQuery ?? internalSearchQuery;
  const updateSearch = setSearchQuery ?? setInternalSearchQuery;
  const effectiveUnread = unreadCount ?? notifications.filter((n) => !n.read).length;
  const effectiveDark = isDarkMode ?? darkMode ?? false;
  const toggleDark = onToggleDarkMode ?? (() => setDarkMode && setDarkMode((prev) => !prev));
  const toggleMobile = () => {
    if (setMobileMenuOpen) setMobileMenuOpen(!mobileMenuOpen);
    if (setSidebarOpen) setSidebarOpen((prev: boolean) => !prev);
  };

  const searchCategories: { tab: ActiveTab; label: string; desc: string }[] = [
    { tab: 'ai-assistant', label: 'AI Health Assistant', desc: 'Ask symptoms, medicine questions, reports' },
    { tab: 'symptom-checker', label: 'AI Symptom Checker', desc: 'Clinical triage & likelihood assessment' },
    { tab: 'medical-scanner', label: 'Medical Report Scanner', desc: 'OCR lab reports, MRI, CT, X-ray' },
    { tab: 'medicine-manager', label: 'Medicine Manager', desc: 'Reminders, dosages, interaction checks' },
    { tab: 'digital-wellbeing', label: 'Digital Wellbeing', desc: 'Screen time, focus score, Pomodoro' },
    { tab: 'sleep-coach', label: 'Sleep Coach & Smart Alarm', desc: 'Sleep debt & recovery recommendations' },
    { tab: 'mental-wellness', label: 'Mental Wellness & Breathing', desc: 'Mood tracker & box breathing exercise' },
    { tab: 'nutrition-ai', label: 'Nutrition AI & Food Recognition', desc: 'Meal photo calorie & macro parser' },
    { tab: 'risk-prediction', label: 'AI Risk Prediction Engine', desc: 'Heart disease, diabetes, burnout risks' },
    { tab: 'emergency', label: 'Emergency SOS & Hospitals', desc: 'Hospital finder & live medical ID' },
  ];

  const filteredSearch = currentSearch.trim()
    ? searchCategories.filter(
        (item) =>
          item.label.toLowerCase().includes(currentSearch.toLowerCase()) ||
          item.desc.toLowerCase().includes(currentSearch.toLowerCase())
      )
    : [];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-2xl bg-slate-900/40 dark:bg-slate-950/60 border-b border-white/10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleMobile}
            className="lg:hidden p-2 rounded-xl text-slate-300 hover:bg-white/10 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2.5 group text-left"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-500 via-indigo-600 to-cyan-500 text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
              <Activity className="w-6 h-6 animate-pulse" />
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-cyan-400 border-2 border-slate-900" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">
                  CODECURE
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  AI
                </span>
              </div>
              <p className="hidden sm:block text-[10px] uppercase font-semibold text-slate-400 tracking-wider -mt-0.5">
                Health Intelligence
              </p>
            </div>
          </button>
        </div>

        {/* Center: Search Bar */}
        <div className="relative flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search AI tools, symptoms, medications, labs..."
              value={currentSearch}
              onChange={(e) => {
                updateSearch(e.target.value);
                setShowSearchDropdown(true);
              }}
              onFocus={() => setShowSearchDropdown(true)}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-white/5 text-slate-100 placeholder-slate-400 border border-white/10 focus:border-blue-500/50 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 backdrop-blur-md"
            />
          </div>

          {/* Search Dropdown */}
          {showSearchDropdown && filteredSearch.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 p-2 bg-slate-900/90 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/10 z-50 max-h-80 overflow-y-auto">
              <div className="text-[10px] uppercase font-semibold text-slate-400 px-3 py-1">
                Suggested Navigation
              </div>
              {filteredSearch.map((item) => (
                <button
                  key={item.tab}
                  onClick={() => {
                    setActiveTab(item.tab);
                    setShowSearchDropdown(false);
                    updateSearch('');
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-white/10 flex items-center justify-between group transition-colors"
                >
                  <div>
                    <div className="text-xs font-semibold text-slate-200 group-hover:text-blue-400">
                      {item.label}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {item.desc}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Health Score Pill */}
          <button
            onClick={() => setActiveTab('dashboard')}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-colors backdrop-blur-md"
          >
            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-bold">
              {healthScores.overallHealthScore}
            </div>
            <div className="text-xs font-semibold">Health Score</div>
          </button>

          {/* Emergency SOS Button */}
          <button
            onClick={onOpenSos}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 text-white font-semibold text-xs shadow-lg shadow-rose-500/20 hover:brightness-110 active:scale-95 transition-all border border-rose-400/30"
            title="Trigger Emergency SOS"
          >
            <ShieldAlert className="w-4 h-4 animate-bounce text-rose-200" />
            <span className="hidden sm:inline">SOS Emergency</span>
          </button>

          {/* Notification Bell */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded-xl text-slate-300 hover:bg-white/10 transition-colors border border-white/5"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {effectiveUnread > 0 && (
              <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-rose-500 rounded-full shadow-md">
                {effectiveUnread}
              </span>
            )}
          </button>

          {/* Dark / Light Toggle */}
          <button
            onClick={toggleDark}
            className="p-2 rounded-xl text-slate-300 hover:bg-white/10 transition-colors border border-white/5"
            aria-label="Toggle Theme"
          >
            {effectiveDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-300" />}
          </button>

          {/* Auth Mode / Country Selection Launcher */}
          {onOpenAuth && (
            <button
              onClick={onOpenAuth}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300 hover:bg-blue-500/20 transition-colors text-xs font-semibold"
              title="Secure Authentication & Country Selection"
            >
              <Lock className="w-3.5 h-3.5 text-blue-400" />
              <span>Auth Passport</span>
            </button>
          )}

          {/* User Avatar */}
          <button
            onClick={() => setActiveTab('profile')}
            className="flex items-center gap-2 p-1 rounded-xl hover:bg-white/10 transition-colors"
          >
            <img
              src={userProfile.avatarUrl}
              alt={userProfile.name}
              className="w-8 h-8 rounded-xl object-cover ring-2 ring-blue-500/40"
            />
          </button>
        </div>
      </div>
    </header>
  );
};
