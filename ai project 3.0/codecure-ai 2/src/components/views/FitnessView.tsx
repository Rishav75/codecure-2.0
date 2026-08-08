import React, { useState } from 'react';
import {
  Dumbbell,
  Droplets,
  Plus,
  CheckCircle2,
  Clock,
  Sparkles,
  Zap,
} from 'lucide-react';
import { FitnessSession } from '../../types';

interface FitnessViewProps {
  fitnessSessions: FitnessSession[];
  onToggleFitness: (id: string) => void;
  onAddFitness: (session: FitnessSession) => void;
}

export const FitnessView: React.FC<FitnessViewProps> = ({
  fitnessSessions,
  onToggleFitness,
  onAddFitness,
}) => {
  const [waterMl, setWaterMl] = useState(1800);
  const targetWaterMl = 2500;

  const [title, setTitle] = useState('');
  const [type, setType] = useState<'Cardio' | 'Strength' | 'Yoga' | 'HIIT' | 'Walking' | 'Stretch'>('Cardio');
  const [duration, setDuration] = useState(30);

  const handleAddWorkout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newSession: FitnessSession = {
      id: `fit-${Date.now()}`,
      title,
      type,
      durationMinutes: duration,
      caloriesBurned: Math.round(duration * 8.5),
      date: 'Today',
      completed: true,
    };

    onAddFitness(newSession);
    setTitle('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white border border-emerald-500/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
            <Dumbbell className="w-3.5 h-3.5 text-emerald-400" /> Biomechanical Performance
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            Fitness Planner & Hydration Tracker
          </h1>
          <p className="text-xs text-slate-300 leading-relaxed">
            Schedule personalized Zone 2 cardio sessions, posture stretch breaks, strength workouts, and track daily hydration targets.
          </p>
        </div>

        {/* Hydration Tracker Pill */}
        <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center shrink-0">
          <div className="text-[10px] uppercase font-bold text-emerald-200">Hydration Progress</div>
          <div className="text-2xl font-black text-white mt-0.5">{waterMl} / {targetWaterMl} <span className="text-xs font-normal">ml</span></div>
          <div className="flex gap-2 justify-center mt-2">
            <button
              onClick={() => setWaterMl((prev) => Math.min(targetWaterMl, prev + 250))}
              className="px-2.5 py-1 rounded-lg bg-teal-500 text-white font-bold text-xs hover:bg-teal-600"
            >
              +250ml
            </button>
            <button
              onClick={() => setWaterMl((prev) => Math.min(targetWaterMl, prev + 500))}
              className="px-2.5 py-1 rounded-lg bg-emerald-500 text-white font-bold text-xs hover:bg-emerald-600"
            >
              +500ml
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Workout Scheduler Form */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
            Log New Fitness Session
          </h3>

          <form onSubmit={handleAddWorkout} className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Workout Title
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Zone 2 Endurance Jog"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Training Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700"
              >
                <option value="Cardio">Zone 2 Aerobic Cardio</option>
                <option value="Strength">Strength & Resistance</option>
                <option value="Yoga">Yoga & Mobility</option>
                <option value="HIIT">High Intensity Interval (HIIT)</option>
                <option value="Walking">Brisk Walk</option>
                <option value="Stretch">Posture & Decompression Stretch</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Duration (Minutes)
              </label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold hover:brightness-110 transition-all shadow-md shadow-emerald-500/20"
            >
              Log Workout Session
            </button>
          </form>
        </div>

        {/* Workout List */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
            Scheduled & Completed Workouts
          </h3>

          <div className="space-y-3">
            {fitnessSessions.map((session) => (
              <div
                key={session.id}
                className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                  session.completed
                    ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200/60 dark:border-emerald-800/60'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                      {session.type}
                    </span>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                      {session.title}
                    </h4>
                  </div>
                  <div className="text-xs text-slate-500 flex items-center gap-3">
                    <span>{session.durationMinutes} mins</span>
                    <span>~{session.caloriesBurned} kcal burned</span>
                    <span>{session.date}</span>
                  </div>
                </div>

                <button
                  onClick={() => onToggleFitness(session.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    session.completed
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {session.completed ? 'Completed' : 'Mark Done'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
