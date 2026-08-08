import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  Play,
  Pause,
  RotateCcw,
  Shield,
  Volume2,
  VolumeX,
  Sparkles,
  Zap,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { DigitalWellbeingStats } from '../../types';

interface DigitalWellbeingViewProps {
  stats: DigitalWellbeingStats;
  onToggleBlocker: () => void;
}

export const DigitalWellbeingView: React.FC<DigitalWellbeingViewProps> = ({
  stats,
  onToggleBlocker,
}) => {
  // Pomodoro State
  const [pomoMinutes, setPomoMinutes] = useState(25);
  const [pomoSeconds, setPomoSeconds] = useState(0);
  const [isPomoActive, setIsPomoActive] = useState(false);
  const [pomoMode, setPomoMode] = useState<'focus' | 'shortBreak' | 'longBreak'>('focus');

  // Ambient Soundscape Synth State
  const [soundscapeActive, setSoundscapeActive] = useState(false);
  const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);

  useEffect(() => {
    let interval: any = null;
    if (isPomoActive) {
      interval = setInterval(() => {
        if (pomoSeconds > 0) {
          setPomoSeconds((prev) => prev - 1);
        } else if (pomoMinutes > 0) {
          setPomoMinutes((prev) => prev - 1);
          setPomoSeconds(59);
        } else {
          setIsPomoActive(false);
          alert('Pomodoro Session Complete! Great focus session.');
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPomoActive, pomoMinutes, pomoSeconds]);

  const togglePomodoro = () => {
    setIsPomoActive(!isPomoActive);
  };

  const resetPomodoro = () => {
    setIsPomoActive(false);
    if (pomoMode === 'focus') setPomoMinutes(25);
    else if (pomoMode === 'shortBreak') setPomoMinutes(5);
    else setPomoMinutes(15);
    setPomoSeconds(0);
  };

  const setTimerMode = (mode: 'focus' | 'shortBreak' | 'longBreak') => {
    setPomoMode(mode);
    setIsPomoActive(false);
    if (mode === 'focus') setPomoMinutes(25);
    else if (mode === 'shortBreak') setPomoMinutes(5);
    else setPomoMinutes(15);
    setPomoSeconds(0);
  };

  // Ambient Pink Noise Synth Generator for Focus
  const toggleSoundscape = () => {
    if (soundscapeActive) {
      audioCtx?.close();
      setAudioCtx(null);
      setSoundscapeActive(false);
    } else {
      try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
          output[i] *= 0.03; // Gentle ambient volume
          b6 = white * 0.115926;
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;
        whiteNoise.connect(ctx.destination);
        whiteNoise.start();

        setAudioCtx(ctx);
        setSoundscapeActive(true);
      } catch (e) {
        console.error('Audio synth error:', e);
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-white border border-purple-500/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-semibold">
            <Smartphone className="w-3.5 h-3.5 text-purple-400" /> Digital Detox & Neuro-Focus
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            Digital Wellbeing & Focus Engine
          </h1>
          <p className="text-xs text-slate-300 leading-relaxed">
            Monitor screen pickup frequency, block dopamine-trap applications, generate pink-noise ambient focus soundscapes, and boost deep work productivity.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleSoundscape}
            className={`px-4 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 border transition-all ${
              soundscapeActive
                ? 'bg-purple-500 text-white border-purple-400 shadow-lg shadow-purple-500/30'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            {soundscapeActive ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            {soundscapeActive ? 'Stop Ambient Soundscape' : 'Play Pink Noise Soundscape'}
          </button>

          <button
            onClick={onToggleBlocker}
            className={`px-4 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all ${
              stats.activeBlocker
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                : 'bg-purple-500 text-white shadow-lg shadow-purple-500/30'
            }`}
          >
            <Lock className="w-4 h-4" />
            {stats.activeBlocker ? 'Focus Blocker ACTIVE' : 'Enable Focus Blocker'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Pomodoro Timer */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6 flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold">
            <button
              onClick={() => setTimerMode('focus')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                pomoMode === 'focus' ? 'bg-purple-500 text-white shadow-sm' : 'text-slate-500'
              }`}
            >
              Focus (25m)
            </button>
            <button
              onClick={() => setTimerMode('shortBreak')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                pomoMode === 'shortBreak' ? 'bg-purple-500 text-white shadow-sm' : 'text-slate-500'
              }`}
            >
              Short Break (5m)
            </button>
            <button
              onClick={() => setTimerMode('longBreak')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                pomoMode === 'longBreak' ? 'bg-purple-500 text-white shadow-sm' : 'text-slate-500'
              }`}
            >
              Long Break (15m)
            </button>
          </div>

          <div className="relative flex items-center justify-center my-4">
            <div className="w-48 h-48 rounded-full border-8 border-purple-500/20 flex flex-col items-center justify-center">
              <span className="text-5xl font-black font-mono text-slate-900 dark:text-slate-100">
                {String(pomoMinutes).padStart(2, '0')}:{String(pomoSeconds).padStart(2, '0')}
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 mt-1">
                {pomoMode} Session
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={togglePomodoro}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs hover:brightness-110 flex items-center gap-2 shadow-lg shadow-purple-500/20"
            >
              {isPomoActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isPomoActive ? 'Pause Session' : 'Start Focus Session'}
            </button>
            <button
              onClick={resetPomodoro}
              className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Screen Time & App Usage Breakdown */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
              <div className="text-[10px] uppercase font-semibold text-slate-400">Total Screen Time</div>
              <div className="text-xl font-black text-slate-900 dark:text-slate-100 mt-1">3h 35m</div>
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">-22% vs yesterday</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
              <div className="text-[10px] uppercase font-semibold text-slate-400">Phone Pickups</div>
              <div className="text-xl font-black text-slate-900 dark:text-slate-100 mt-1">{stats.pickups}</div>
              <div className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold mt-0.5">Optimal range</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
              <div className="text-[10px] uppercase font-semibold text-slate-400">Focus Score</div>
              <div className="text-xl font-black text-slate-900 dark:text-slate-100 mt-1">{stats.focusScore} <span className="text-xs font-normal">/100</span></div>
              <div className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold mt-0.5">Deep Flow Zone</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
              <div className="text-[10px] uppercase font-semibold text-slate-400">Addiction Risk</div>
              <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{stats.addictionRisk}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Protected</div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">
              Application Category Usage
            </h3>
            <div className="space-y-2.5">
              {stats.appBreakdown.map((app) => (
                <div key={app.appName} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-800 dark:text-slate-200">{app.appName} ({app.category})</span>
                    <span className="text-slate-500">{app.timeMinutes} mins</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(app.timeMinutes / 215) * 100}%`,
                        backgroundColor: app.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
