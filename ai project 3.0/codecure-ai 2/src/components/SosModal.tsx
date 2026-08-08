import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Phone,
  MapPin,
  X,
  AlertTriangle,
  CheckCircle,
  Siren,
  Hospital,
} from 'lucide-react';
import { UserProfile } from '../types';

interface SosModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
}

export const SosModal: React.FC<SosModalProps> = ({ isOpen, onClose, userProfile }) => {
  const [countdown, setCountdown] = useState(5);
  const [isDispatched, setIsDispatched] = useState(false);
  const [isArmed, setIsArmed] = useState(true);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsArmed(false);
        setCountdown(5);
        setIsDispatched(false);
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOpen && isArmed && countdown > 0 && !isDispatched) {
      timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (isOpen && countdown === 0 && !isDispatched) {
      setIsDispatched(true);
    }
    return () => clearTimeout(timer);
  }, [isOpen, isArmed, countdown, isDispatched]);

  if (!isOpen) return null;

  const handleCancel = () => {
    setIsArmed(false);
    setCountdown(5);
    setIsDispatched(false);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Emergency SOS Operational Alert"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-lg bg-slate-900 border border-rose-500/40 rounded-3xl p-6 shadow-2xl text-white overflow-hidden">
        {/* Ambient Red Glow */}
        <div className="absolute -top-24 -left-24 w-60 h-60 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />

        <button
          onClick={handleCancel}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!isDispatched ? (
          <div className="text-center space-y-6">
            <div className="inline-flex p-4 rounded-3xl bg-rose-500/10 border border-rose-500/30 text-rose-500 mb-2">
              <Siren className="w-12 h-12 animate-pulse text-rose-500" />
            </div>

            <div>
              <h2 className="text-2xl font-black text-white tracking-tight">EMERGENCY SOS ARMED</h2>
              <p className="text-xs text-slate-400 mt-1">
                Transmitting emergency GPS coordinates & Medical ID to 911 dispatch and emergency contact.
              </p>
            </div>

            {/* Countdown Ring */}
            <div className="relative flex items-center justify-center my-4">
              <div className="w-28 h-28 rounded-full border-4 border-rose-500/20 flex items-center justify-center">
                <span className="text-5xl font-black text-rose-500">{countdown}</span>
              </div>
            </div>

            {/* Emergency Contact Quick Preview */}
            <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60 text-left space-y-1">
              <div className="text-[10px] uppercase tracking-wider font-semibold text-rose-400">
                Primary Emergency Contact
              </div>
              <div className="flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-slate-200">{userProfile.emergencyContact.name}</span>{' '}
                  <span className="text-slate-400">({userProfile.emergencyContact.relationship})</span>
                </div>
                <span className="font-mono text-teal-400 font-semibold">{userProfile.emergencyContact.phone}</span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleCancel}
                className="flex-1 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors"
              >
                FALSE ALARM - CANCEL
              </button>
              <button
                onClick={() => setIsDispatched(true)}
                className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 hover:brightness-110 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition-all"
              >
                DISPATCH IMMEDIATELY
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-6 py-2">
            <div className="inline-flex p-4 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <CheckCircle className="w-12 h-12 animate-bounce" />
            </div>

            <div>
              <h2 className="text-2xl font-black text-emerald-400 tracking-tight">SOS DISPATCH ACTIVE</h2>
              <p className="text-xs text-slate-300 mt-1">
                First responders and <span className="font-semibold text-white">{userProfile.emergencyContact.name}</span> have been notified with live telemetry.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/90 border border-slate-700 space-y-2 text-left text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-teal-400" /> GPS Lat/Lng:</span>
                <span className="font-mono text-teal-300">37.7749° N, 122.4194° W</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-1.5"><Hospital className="w-3.5 h-3.5 text-emerald-400" /> Nearest Trauma Center:</span>
                <span className="font-semibold text-slate-100">UCSF Emergency ER (1.2 miles)</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-rose-400" /> Medical ID Transmitted:</span>
                <span className="font-semibold text-rose-300">Blood {userProfile.bloodType} | {userProfile.allergies.join(', ')}</span>
              </div>
            </div>

            <button
              onClick={handleCancel}
              className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors"
            >
              CLOSE DISPATCH WINDOW
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
