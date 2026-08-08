import React, { useState } from 'react';
import {
  User,
  ShieldCheck,
  FileText,
  Download,
  Moon,
  Sun,
  Plus,
  Trash2,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { UserProfile } from '../../types';

interface ProfileViewProps {
  userProfile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  userProfile,
  onUpdateProfile,
  isDarkMode,
  onToggleDarkMode,
}) => {
  const [name, setName] = useState(userProfile.name);
  const [age, setAge] = useState(userProfile.age);
  const [bloodType, setBloodType] = useState(userProfile.bloodType);
  const [newCondition, setNewCondition] = useState('');
  const [newAllergy, setNewAllergy] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      ...userProfile,
      name,
      age,
      bloodType,
    });
    alert('Electronic Health Profile saved successfully.');
  };

  const handleAddCondition = () => {
    if (!newCondition.trim()) return;
    onUpdateProfile({
      ...userProfile,
      chronicConditions: [...userProfile.chronicConditions, newCondition],
    });
    setNewCondition('');
  };

  const handleAddAllergy = () => {
    if (!newAllergy.trim()) return;
    onUpdateProfile({
      ...userProfile,
      allergies: [...userProfile.allergies, newAllergy],
    });
    setNewAllergy('');
  };

  const handleExportData = () => {
    const jsonStr = JSON.stringify(userProfile, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CODECURE_EHR_${userProfile.name.replace(/\s+/g, '_')}.json`;
    a.click();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white border border-slate-700 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-700 text-slate-200 text-xs font-semibold">
            <Lock className="w-3.5 h-3.5 text-teal-400" /> HIPAA & GDPR Encrypted EHR
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            Electronic Health Record (EHR) & Preferences
          </h1>
          <p className="text-xs text-slate-300 leading-relaxed">
            Manage personal medical demographics, blood markers, chronic diagnoses, emergency contacts, and export portable clinical records.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onToggleDarkMode}
            className="p-3 rounded-2xl bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-700 transition-colors"
            title="Toggle Light / Dark Atmosphere"
          >
            {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-400" />}
          </button>

          <button
            onClick={handleExportData}
            className="px-4 py-2.5 rounded-2xl bg-teal-500 text-white font-bold text-xs hover:bg-teal-600 flex items-center gap-2 shadow-lg shadow-teal-500/20"
          >
            <Download className="w-4 h-4" /> Export EHR JSON
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personal Details Form */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6">
          <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
            Demographic & Biometric Metrics
          </h3>

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Full Legal Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Age (Years)
                </label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Blood Group Type
                </label>
                <input
                  type="text"
                  value={bloodType}
                  onChange={(e) => setBloodType(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Primary Physician
                </label>
                <input
                  type="text"
                  value={userProfile.primaryDoctor}
                  disabled
                  className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/50 text-slate-500 border border-slate-200 dark:border-slate-700"
                />
              </div>
            </div>

            <button
              type="submit"
              className="py-2.5 px-6 rounded-2xl bg-teal-500 text-white font-bold hover:bg-teal-600 transition-colors"
            >
              Update Demographics
            </button>
          </form>

          {/* Chronic Conditions & Allergies Manager */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-4">
            <div>
              <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200 uppercase mb-2">
                Chronic Medical Conditions
              </h4>
              <div className="flex flex-wrap gap-2 mb-2">
                {(userProfile.chronicConditions || []).map((cond, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-xl bg-white/10 text-slate-200 text-xs font-semibold border border-white/10"
                  >
                    {cond}
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add diagnosis e.g. Hypertension"
                  value={newCondition}
                  onChange={(e) => setNewCondition(e.target.value)}
                  className="flex-1 p-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs border border-slate-200 dark:border-slate-700"
                />
                <button
                  type="button"
                  onClick={handleAddCondition}
                  className="px-3 py-2 rounded-xl bg-teal-500 text-white font-bold text-xs"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200 uppercase mb-2">
                Severe Allergies
              </h4>
              <div className="flex flex-wrap gap-2 mb-2">
                {(userProfile.allergies || []).map((all, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-xl bg-rose-500/20 text-rose-300 text-xs font-semibold border border-rose-500/30"
                  >
                    {all}
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add allergy e.g. Penicillin"
                  value={newAllergy}
                  onChange={(e) => setNewAllergy(e.target.value)}
                  className="flex-1 p-2 rounded-xl bg-white/5 text-xs border border-white/10 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50"
                />
                <button
                  type="button"
                  onClick={handleAddAllergy}
                  className="px-3 py-2 rounded-xl bg-rose-500 text-white font-bold text-xs"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Contacts Summary Card */}
        <div className="p-6 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 space-y-4">
          <h3 className="font-bold text-sm text-slate-100">
            Designated Emergency Contacts
          </h3>

          <div className="space-y-3">
            {((userProfile as any).emergencyContacts || (userProfile.emergencyContact ? [userProfile.emergencyContact] : [])).map((contact: any, idx: number) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1 text-xs"
              >
                <div className="font-bold text-slate-100">{contact.name}</div>
                <div className="text-slate-400">{contact.relationship}</div>
                <div className="font-mono font-bold text-blue-400">{contact.phone}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
