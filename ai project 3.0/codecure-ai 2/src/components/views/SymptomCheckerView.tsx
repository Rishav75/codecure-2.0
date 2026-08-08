import React, { useState } from 'react';
import {
  Stethoscope,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  ShieldAlert,
  User,
  Clock,
  Sparkles,
  RefreshCw,
  HelpCircle,
  FileCheck,
} from 'lucide-react';
import { SymptomResult, UserProfile } from '../../types';

interface SymptomCheckerViewProps {
  userProfile: UserProfile;
}

export const SymptomCheckerView: React.FC<SymptomCheckerViewProps> = ({ userProfile }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [symptoms, setSymptoms] = useState('');
  const [duration, setDuration] = useState('1 to 3 days');
  const [age, setAge] = useState(userProfile.age);
  const [gender, setGender] = useState(userProfile.gender);
  const [history, setHistory] = useState(userProfile.chronicConditions.join(', '));
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SymptomResult | null>(null);

  const handleAnalyze = async () => {
    if (!symptoms.trim()) return;
    setLoading(true);

    try {
      const res = await fetch('/api/gemini/symptom-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symptoms,
          age,
          gender,
          medicalHistory: history,
          duration,
        }),
      });

      const data = await res.json();
      setResult(data);
      setStep(3);
    } catch (err) {
      console.error('Error in symptom checker:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSymptoms('');
    setResult(null);
    setStep(1);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-900 via-slate-900 to-teal-950 text-white border border-emerald-500/30 shadow-xl space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
          <Stethoscope className="w-3.5 h-3.5 text-emerald-400" /> Clinical AI Triage Engine
        </div>
        <h1 className="text-2xl font-black tracking-tight text-white">
          AI Symptom Checker & Differential Diagnosis
        </h1>
        <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
          Provide your observed symptoms, timeline, and health history. CODECURE AI analyzes potential causes, assigns probability scores, flags emergency red flags, and recommends relevant medical specialists.
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold">
        <div className={`flex items-center gap-2 ${step >= 1 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
          <span className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-[10px]">1</span>
          <span>Describe Symptoms</span>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-400" />
        <div className={`flex items-center gap-2 ${step >= 2 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
          <span className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-[10px]">2</span>
          <span>Biometrics & Context</span>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-400" />
        <div className={`flex items-center gap-2 ${step === 3 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
          <span className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-[10px]">3</span>
          <span>AI Differential Report</span>
        </div>
      </div>

      {/* Step 1: Describe Symptoms */}
      {step === 1 && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
              Primary Symptoms & Discomfort
            </label>
            <textarea
              rows={4}
              placeholder="e.g. Mild persistent pressure behind left eye, slight dizziness when standing up quickly, tightness in neck muscles..."
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500/30 focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
              Symptom Onset & Duration
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {['Less than 24h', '1 to 3 days', '1 week+', 'Chronic / Intermittent'].map((dur) => (
                <button
                  key={dur}
                  onClick={() => setDuration(dur)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all ${
                    duration === dur
                      ? 'bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-500/20'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {dur}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              disabled={!symptoms.trim()}
              onClick={() => setStep(2)}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-bold text-xs disabled:opacity-50 hover:brightness-110 transition-all flex items-center gap-2"
            >
              Continue to Context <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Biometrics & Context */}
      {step === 2 && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                Age (Years)
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs border border-slate-200 dark:border-slate-700"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                Biological Sex
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs border border-slate-200 dark:border-slate-700"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
              Relevant Prior Medical Conditions & Allergies
            </label>
            <input
              type="text"
              value={history}
              onChange={(e) => setHistory(e.target.value)}
              placeholder="e.g. Asthma, High blood pressure, Penicillin allergy"
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs border border-slate-200 dark:border-slate-700"
            />
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold text-xs"
            >
              Back
            </button>
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-xs hover:brightness-110 flex items-center gap-2 shadow-lg shadow-emerald-500/20"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Analyzing Clinical Data...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Generate Differential Triage
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Diagnostic Results */}
      {step === 3 && result && (
        <div className="space-y-6">
          {/* Emergency Alert Banner */}
          {result.isEmergency && (
            <div className="p-5 rounded-3xl bg-rose-500 text-white shadow-xl flex items-center gap-4">
              <ShieldAlert className="w-10 h-10 animate-bounce shrink-0 text-white" />
              <div>
                <h3 className="font-black text-lg">URGENT EMERGENCY CARE SUGGESTED</h3>
                <p className="text-xs text-rose-100 mt-0.5">{result.emergencyReasoning}</p>
              </div>
            </div>
          )}

          {/* Differential Results Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="font-black text-lg text-slate-900 dark:text-slate-100">
                  Likely Clinical Differential Causes
                </h3>
                <p className="text-xs text-slate-500">Overall Severity: <span className="font-bold text-teal-600 dark:text-teal-400">{result.overallSeverity}</span></p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold uppercase text-slate-400">Recommended Specialist</span>
                <div className="text-xs font-bold text-slate-900 dark:text-slate-100">{result.recommendedSpecialist}</div>
              </div>
            </div>

            <div className="space-y-4">
              {result.likelyCauses?.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-2"
                >
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                      {item.condition}
                    </span>
                    <span className="font-bold text-teal-600 dark:text-teal-400">
                      {item.confidence}% Match
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-teal-500 to-emerald-500 h-full rounded-full"
                      style={{ width: `${item.confidence}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Clinical Reasoning */}
            <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 space-y-1">
              <div className="text-xs font-bold text-teal-800 dark:text-teal-300 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> AI Clinical Reasoning
              </div>
              <p className="text-xs text-teal-900 dark:text-teal-200 leading-relaxed">
                {result.clinicalReasoning}
              </p>
            </div>

            {/* Recommended Actions */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase">Recommended Next Steps</h4>
              <ul className="space-y-1.5">
                {result.recommendedActions?.map((act, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{act}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Disclaimer */}
            <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
              <span className="font-bold">Medical Disclaimer:</span> {result.disclaimer || 'This AI differential triage report is for educational purposes only and should not replace an in-person physical clinical examination.'}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleReset}
                className="px-6 py-2.5 rounded-2xl bg-slate-800 text-white text-xs font-bold hover:bg-slate-700 transition-colors"
              >
                Check New Symptoms
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
