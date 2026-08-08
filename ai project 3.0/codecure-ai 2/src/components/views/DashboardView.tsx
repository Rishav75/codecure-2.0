import React from 'react';
import {
  Activity,
  Sparkles,
  Heart,
  Moon,
  Smartphone,
  Dumbbell,
  Utensils,
  TrendingUp,
  ShieldAlert,
  ArrowUpRight,
  Zap,
  CheckCircle2,
  AlertCircle,
  Stethoscope,
  FileText,
  Pill,
} from 'lucide-react';
import {
  CompositeHealthScores,
  UserProfile,
  Medication,
  DiseaseRiskPrediction,
  ActiveTab,
} from '../../types';

interface DashboardViewProps {
  scores?: CompositeHealthScores;
  userProfile: UserProfile;
  medications: Medication[];
  diseaseRisks?: DiseaseRiskPrediction[];
  setActiveTab?: (tab: ActiveTab) => void;
  onNavigate?: (tab: ActiveTab) => void;
  onToggleMedication?: (id: string) => void;
  healthTokens?: number;
  streakDays?: number;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  scores = { overallHealthScore: 92, stressScore: 28, fitnessScore: 88, sleepScore: 84, digitalWellbeingScore: 90, nutritionScore: 85, heartHealth: 91, mentalWellbeing: 89, sleepQuality: 84, physicalActivity: 92, riskIndex: 12 },
  userProfile,
  medications,
  diseaseRisks = [
    { condition: 'Cardiovascular Risk', riskPercentage: 12, riskLevel: 'Low', riskFactors: ['Slightly high sodium intake'], preventivePlan: ['Limit daily sodium to 2000mg', 'Daily 30min walk'] },
    { condition: 'Type 2 Diabetes Risk', riskPercentage: 8, riskLevel: 'Low', riskFactors: ['Normal HbA1c'], preventivePlan: ['Balanced glycemic diet'] },
    { condition: 'Burnout & Fatigue Risk', riskPercentage: 18, riskLevel: 'Mild', riskFactors: ['Late screen activity'], preventivePlan: ['Enable blue light filter', 'Box breathing before sleep'] },
  ],
  setActiveTab,
  onNavigate,
}) => {
  const handleTab = onNavigate ?? setActiveTab ?? (() => {});
  const pendingMeds = medications.filter((m) => !m.takenToday);

  const scoreCards = [
    {
      title: 'Stress Score',
      score: scores.stressScore,
      max: 100,
      unit: 'pts',
      status: scores.stressScore < 40 ? 'Optimal' : 'Elevated',
      color: 'from-amber-500 to-orange-600',
      icon: Heart,
      tab: 'mental-wellness' as ActiveTab,
    },
    {
      title: 'Fitness Score',
      score: scores.fitnessScore,
      max: 100,
      unit: 'pts',
      status: 'Excellent',
      color: 'from-emerald-500 to-teal-600',
      icon: Dumbbell,
      tab: 'fitness' as ActiveTab,
    },
    {
      title: 'Sleep Score',
      score: scores.sleepScore,
      max: 100,
      unit: 'pts',
      status: 'High Quality',
      color: 'from-indigo-500 to-blue-600',
      icon: Moon,
      tab: 'sleep-coach' as ActiveTab,
    },
    {
      title: 'Digital Wellbeing',
      score: scores.digitalWellbeingScore,
      max: 100,
      unit: 'pts',
      status: 'Balanced',
      color: 'from-cyan-500 to-teal-500',
      icon: Smartphone,
      tab: 'digital-wellbeing' as ActiveTab,
    },
    {
      title: 'Nutrition AI',
      score: scores.nutritionScore,
      max: 100,
      unit: 'pts',
      status: 'Optimal Macros',
      color: 'from-purple-500 to-pink-600',
      icon: Utensils,
      tab: 'nutrition-ai' as ActiveTab,
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome & High Level Composite Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 sm:p-8 text-slate-100 shadow-2xl">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -bottom-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" /> CODECURE AI Health Intelligence Active
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Welcome back, {userProfile.name}.
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Your health score is currently <span className="font-bold text-emerald-400">Optimal</span>. Biometrics reflect stable heart rate variability and balanced sleep cycles.
            </p>
          </div>

          {/* Overall Health Score Circular Gauge */}
          <div className="flex items-center gap-5 bg-black/20 p-5 rounded-2xl border border-white/10 backdrop-blur-md">
            <div className="relative inline-block">
              <svg width="120" height="120" className="rotate-[-90deg]">
                <circle cx="60" cy="60" r="50" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-slate-800" />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  stroke="currentColor"
                  strokeWidth="10"
                  fill="transparent"
                  strokeDasharray="314"
                  strokeDashoffset={314 - (314 * scores.overallHealthScore) / 100}
                  className="text-blue-500 transition-all duration-1000 ease-out"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black tracking-tighter text-white">{scores.overallHealthScore}</span>
                <span className="text-[9px] uppercase text-slate-400 font-bold">Elite</span>
              </div>
            </div>
            <div>
              <div className="text-xs font-bold text-slate-200">Optimal Range</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Weekly Trend: <span className="text-emerald-400 font-semibold">+2%</span></div>
              <button
                onClick={() => handleTab('risk-prediction')}
                className="mt-2.5 text-[11px] font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 group"
              >
                View Risk Model <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Action Needed Reminders Alert */}
      {pendingMeds.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 flex items-center justify-between gap-4 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500 text-slate-950 font-bold">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold">Medication Schedule Action Needed</div>
              <div className="text-[11px] text-amber-300">
                You have {pendingMeds.length} pending medication doses today ({pendingMeds.map((m) => m.name).join(', ')}).
              </div>
            </div>
          </div>
          <button
            onClick={() => handleTab('medicine-manager')}
            className="px-3.5 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-colors shrink-0 shadow-md shadow-amber-500/20"
          >
            Mark Taken
          </button>
        </div>
      )}

      {/* Sub-Score Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {scoreCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              onClick={() => handleTab(card.tab)}
              className="p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 cursor-pointer transition-all duration-200 group space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300 group-hover:text-blue-400 transition-colors">
                  {card.title}
                </span>
                <div className={`p-1.5 rounded-xl bg-gradient-to-tr ${card.color} text-white shadow-sm`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-white">{card.score}</span>
                  <span className="text-xs text-slate-400">/ {card.max}</span>
                </div>
                <div className="text-[10px] font-semibold text-emerald-400 mt-0.5">
                  {card.status}
                </div>
              </div>

              <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`bg-gradient-to-r ${card.color} h-full rounded-full transition-all duration-500`}
                  style={{ width: `${card.score}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Launch Suite */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">
          AI Health Suite Shortcuts
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => handleTab('ai-assistant')}
            className="p-5 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 text-left hover:bg-white/10 transition-all group space-y-3"
          >
            <div className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-slate-100 group-hover:text-blue-400 transition-colors">
                AI Health Assistant
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Natural voice & text clinical chat with medical grounding.
              </p>
            </div>
          </button>

          <button
            onClick={() => handleTab('symptom-checker')}
            className="p-5 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 text-left hover:bg-white/10 transition-all group space-y-3"
          >
            <div className="w-10 h-10 rounded-2xl bg-orange-500/20 border border-orange-500/30 text-orange-400 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-slate-100 group-hover:text-orange-400 transition-colors">
                AI Symptom Triage
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Clinical symptom analysis with probability & specialist advice.
              </p>
            </div>
          </button>

          <button
            onClick={() => handleTab('medical-scanner')}
            className="p-5 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 text-left hover:bg-white/10 transition-all group space-y-3"
          >
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-slate-100 group-hover:text-cyan-400 transition-colors">
                Medical OCR Scanner
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Upload lab reports, MRI, CT, or prescriptions for AI parser.
              </p>
            </div>
          </button>

          <button
            onClick={() => handleTab('digital-wellbeing')}
            className="p-5 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 text-left hover:bg-white/10 transition-all group space-y-3"
          >
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-slate-100 group-hover:text-emerald-400 transition-colors">
                Digital Detox & Focus
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Track screen time, Pomodoro timer, focus soundscapes.
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Preventive Risk Radar Summary & Biometrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Preventive AI Risk Factors */}
        <div className="p-6 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              <h3 className="font-bold text-sm text-slate-100">
                AI Preventive Risk Factor Analysis
              </h3>
            </div>
            <button
              onClick={() => handleTab('risk-prediction')}
              className="text-xs font-semibold text-blue-400 hover:underline"
            >
              Full Clinical Breakdown →
            </button>
          </div>

          <div className="space-y-3">
            {diseaseRisks.map((risk) => (
              <div key={risk.condition} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-300">
                    {risk.condition}
                  </span>
                  <span className="font-bold text-slate-100">
                    {risk.riskPercentage}% ({risk.riskLevel})
                  </span>
                </div>
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      risk.riskPercentage > 20
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${risk.riskPercentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Biometric Telemetry Live Sync */}
        <div className="p-6 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-sm text-slate-100">
                Live Wearables Telemetry
              </h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Synced Apple Health
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5">
              <div className="text-[10px] uppercase font-semibold text-slate-400">Daily Steps</div>
              <div className="text-xl font-black text-white mt-1">8,420</div>
              <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">84% of 10k target</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5">
              <div className="text-[10px] uppercase font-semibold text-slate-400">Resting Heart Rate</div>
              <div className="text-xl font-black text-white mt-1">56 <span className="text-xs font-normal text-slate-400">BPM</span></div>
              <div className="text-[10px] text-blue-400 font-semibold mt-0.5">Athlete Baseline</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5">
              <div className="text-[10px] uppercase font-semibold text-slate-400">Blood Oxygen (SpO2)</div>
              <div className="text-xl font-black text-white mt-1">99%</div>
              <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">Optimal saturation</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5">
              <div className="text-[10px] uppercase font-semibold text-slate-400">Deep Sleep Duration</div>
              <div className="text-xl font-black text-white mt-1">1.8 <span className="text-xs font-normal text-slate-400">hrs</span></div>
              <div className="text-[10px] text-indigo-400 font-semibold mt-0.5">24% sleep stage</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
