import React, { useState, useEffect } from 'react';
import {
  HeartPulse,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  Smile,
  Meh,
  Frown,
  Zap,
  Check,
  BookOpen,
} from 'lucide-react';
import { MentalWellnessLog } from '../../types';

interface MentalWellnessViewProps {
  mentalLogs: MentalWellnessLog[];
  onAddMentalLog: (log: MentalWellnessLog) => void;
}

export const MentalWellnessView: React.FC<MentalWellnessViewProps> = ({
  mentalLogs,
  onAddMentalLog,
}) => {
  const [selectedMood, setSelectedMood] = useState<'Ecstatic' | 'Calm' | 'Neutral' | 'Anxious' | 'Stressed' | 'Exhausted'>('Calm');
  const [stressLevel, setStressLevel] = useState(3);
  const [journalText, setJournalText] = useState('');
  const [gratitudeText, setGratitudeText] = useState('');

  // Box Breathing Exercise State
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Rest'>('Inhale');
  const [phaseTimer, setPhaseTimer] = useState(4);

  useEffect(() => {
    let timer: any = null;
    if (breathingActive) {
      timer = setInterval(() => {
        setPhaseTimer((prev) => {
          if (prev > 1) return prev - 1;

          // Transition phase
          if (breathPhase === 'Inhale') {
            setBreathPhase('Hold');
            return 4;
          } else if (breathPhase === 'Hold') {
            setBreathPhase('Exhale');
            return 4;
          } else if (breathPhase === 'Exhale') {
            setBreathPhase('Rest');
            return 4;
          } else {
            setBreathPhase('Inhale');
            return 4;
          }
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [breathingActive, breathPhase]);

  const handleSaveJournal = (e: React.FormEvent) => {
    e.preventDefault();
    const newLog: MentalWellnessLog = {
      id: `mw-${Date.now()}`,
      date: 'Today',
      mood: selectedMood,
      moodRating: stressLevel < 4 ? 8 : 5,
      stressLevel,
      burnoutRisk: stressLevel > 7 ? 'High' : stressLevel > 4 ? 'Moderate' : 'Low',
      journalEntry: journalText,
      gratitudeText,
    };
    onAddMentalLog(newLog);
    setJournalText('');
    setGratitudeText('');
    alert('Journal entry saved to your encrypted medical record.');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-teal-950 via-slate-900 to-emerald-950 text-white border border-teal-500/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-500/30 text-teal-300 text-xs font-semibold">
            <HeartPulse className="w-3.5 h-3.5 text-teal-400" /> Neuro-Emotional Equilibrium
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            Mental Balance & Guided Box Breathing
          </h1>
          <p className="text-xs text-slate-300 leading-relaxed">
            Monitor autonomic nervous system stress response, log encrypted reflections, prevent burnout, and activate parasympathetic relaxation with guided 4-4-4-4 diaphragmatic breathing.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Box Breathing Visualizer */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6 flex flex-col items-center text-center">
          <div className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
            4-4-4-4 Diaphragmatic Box Breathing
          </div>

          <div className="relative flex items-center justify-center w-56 h-56 my-2">
            {/* Animated Pulsing Ring */}
            <div
              className={`absolute inset-0 rounded-full bg-gradient-to-tr from-teal-500/20 to-emerald-500/20 transition-all duration-1000 ease-in-out ${
                breathingActive && (breathPhase === 'Inhale' || breathPhase === 'Hold')
                  ? 'scale-110 border-4 border-teal-500'
                  : 'scale-90 border-2 border-teal-300/40'
              }`}
            />
            <div className="relative z-10 flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-slate-900 dark:text-slate-100">
                {breathingActive ? breathPhase : 'Ready'}
              </span>
              <span className="text-5xl font-mono font-black text-teal-600 dark:text-teal-400 mt-1">
                {breathingActive ? phaseTimer : '4s'}
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setBreathingActive(!breathingActive)}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-bold text-xs hover:brightness-110 flex items-center gap-2 shadow-lg shadow-emerald-500/20"
            >
              {breathingActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {breathingActive ? 'Pause Exercise' : 'Start Box Breathing'}
            </button>
            <button
              onClick={() => {
                setBreathingActive(false);
                setBreathPhase('Inhale');
                setPhaseTimer(4);
              }}
              className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Daily Mood & Gratitude Journal */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
            Daily Emotion & Stress Journal
          </h3>

          <form onSubmit={handleSaveJournal} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-500 font-bold mb-2">How are you feeling right now?</label>
              <div className="grid grid-cols-3 gap-2">
                {(['Ecstatic', 'Calm', 'Neutral', 'Anxious', 'Stressed', 'Exhausted'] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setSelectedMood(m)}
                    className={`p-2.5 rounded-xl font-semibold border transition-all text-xs ${
                      selectedMood === m
                        ? 'bg-teal-500 text-white border-teal-500 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300 mb-1">
                <span>Self-Reported Stress Gauge (1-10)</span>
                <span className="text-teal-600 dark:text-teal-400 font-mono">{stressLevel} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={stressLevel}
                onChange={(e) => setStressLevel(Number(e.target.value))}
                className="w-full accent-teal-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Reflections & Journal Entry
              </label>
              <textarea
                rows={2}
                placeholder="Log thoughts or reflections from today..."
                value={journalText}
                onChange={(e) => setJournalText(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Daily Gratitude
              </label>
              <input
                type="text"
                placeholder="One thing you are grateful for today..."
                value={gratitudeText}
                onChange={(e) => setGratitudeText(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-2xl bg-teal-500 text-white font-bold hover:bg-teal-600 transition-colors shadow-md shadow-teal-500/20"
            >
              Save Encrypted Journal Entry
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
