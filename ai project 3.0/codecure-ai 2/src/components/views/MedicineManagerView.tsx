import React, { useState } from 'react';
import {
  Pill,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Clock,
  RotateCcw,
  Sparkles,
  ShieldAlert,
  RefreshCw,
  Trash2,
} from 'lucide-react';
import { Medication } from '../../types';

interface MedicineManagerViewProps {
  medications: Medication[];
  onToggleTaken: (id: string) => void;
  onAddMedication: (med: Medication) => void;
  onDeleteMedication: (id: string) => void;
}

export const MedicineManagerView: React.FC<MedicineManagerViewProps> = ({
  medications,
  onToggleTaken,
  onAddMedication,
  onDeleteMedication,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('Once Daily');
  const [time, setTime] = useState('08:00');
  const [totalPills, setTotalPills] = useState(30);

  const [checkingInteractions, setCheckingInteractions] = useState(false);
  const [interactionResult, setInteractionResult] = useState<any | null>(null);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newMed: Medication = {
      id: `med-${Date.now()}`,
      name,
      dosage,
      frequency,
      times: [time],
      pillsRemaining: totalPills,
      totalPills,
      category: 'Prescription',
      refillThreshold: 7,
      takenToday: false,
    };

    onAddMedication(newMed);
    setName('');
    setDosage('');
    setShowAddModal(false);
  };

  const handleCheckInteractions = async () => {
    setCheckingInteractions(true);
    try {
      const medList = medications.map((m) => `${m.name} (${m.dosage})`);
      const res = await fetch('/api/gemini/interaction-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ medicines: medList }),
      });
      const data = await res.json();
      setInteractionResult(data);
    } catch (err) {
      console.error('Error checking interactions:', err);
    } finally {
      setCheckingInteractions(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-950 via-slate-900 to-orange-950 text-white border border-amber-500/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold">
            <Pill className="w-3.5 h-3.5 text-amber-400" /> Precision Pharmacotherapy Engine
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            Medication Schedule & Interaction Checker
          </h1>
          <p className="text-xs text-slate-300 leading-relaxed">
            Manage daily pill dosages, track remaining refill thresholds, and execute AI pharmacology safety checks for potential drug-drug interactions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCheckInteractions}
            disabled={checkingInteractions}
            className="px-4 py-2.5 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-xs hover:bg-amber-500/30 transition-colors flex items-center gap-2"
          >
            {checkingInteractions ? (
              <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
            ) : (
              <Sparkles className="w-4 h-4 text-amber-400" />
            )}
            AI Interaction Check
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-2xl bg-amber-500 text-white font-bold text-xs hover:bg-amber-600 transition-colors shadow-lg shadow-amber-500/20 flex items-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" /> Add Medication
          </button>
        </div>
      </div>

      {/* AI Drug Interaction Result Card */}
      {interactionResult && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-500" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                AI Pharmacology Interaction Report
              </h3>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                interactionResult.hasInteractions
                  ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                  : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
              }`}
            >
              Risk Level: {interactionResult.overallRiskLevel || 'None'}
            </span>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {interactionResult.generalAdvice}
          </p>

          {interactionResult.interactions?.map((item: any, idx: number) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/40 text-xs space-y-1"
            >
              <div className="font-bold text-amber-900 dark:text-amber-200">{item.drugs} ({item.severity})</div>
              <p className="text-slate-700 dark:text-slate-300">{item.description}</p>
              <div className="text-amber-800 dark:text-amber-300 font-semibold">{item.clinicalAdvice}</div>
            </div>
          ))}
        </div>
      )}

      {/* Medication List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {medications.map((med) => (
          <div
            key={med.id}
            className={`p-5 rounded-3xl border transition-all space-y-4 ${
              med.takenToday
                ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300/60 dark:border-emerald-800/60'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {med.category}
                </span>
                <h3 className="font-black text-base text-slate-900 dark:text-slate-100">
                  {med.name}
                </h3>
                <p className="text-xs font-semibold text-slate-500">{med.dosage}</p>
              </div>

              <button
                onClick={() => onDeleteMedication(med.id)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors"
                title="Delete Medication"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                <span>{med.frequency} ({med.times.join(', ')})</span>
              </div>

              <div className="flex items-center justify-between text-slate-500 text-[11px]">
                <span>Pills Remaining:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {med.pillsRemaining} / {med.totalPills}
                </span>
              </div>

              {/* Refill warning */}
              {med.pillsRemaining <= med.refillThreshold && (
                <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-[10px] font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" /> Refill Recommended Soon
                </div>
              )}
            </div>

            <button
              onClick={() => onToggleTaken(med.id)}
              className={`w-full py-2.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                med.takenToday
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              {med.takenToday ? 'Dose Logged Today' : 'Mark as Taken'}
            </button>
          </div>
        ))}
      </div>

      {/* Add Medication Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="font-black text-lg text-slate-900 dark:text-slate-100">
              Add New Prescription
            </h3>

            <form onSubmit={handleAdd} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Medication Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Metformin"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Dosage
                </label>
                <input
                  type="text"
                  placeholder="e.g. 500 mg"
                  value={dosage}
                  onChange={(e) => setDosage(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Frequency
                  </label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs border border-slate-200 dark:border-slate-700"
                  >
                    <option value="Once Daily">Once Daily</option>
                    <option value="Twice Daily">Twice Daily</option>
                    <option value="As Needed">As Needed (PRN)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Scheduled Time
                  </label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Total Pills / Quantity
                </label>
                <input
                  type="number"
                  value={totalPills}
                  onChange={(e) => setTotalPills(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 text-white font-bold text-xs hover:bg-amber-600"
                >
                  Save Medication
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
