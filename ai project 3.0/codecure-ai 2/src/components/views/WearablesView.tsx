import React, { useState } from 'react';
import {
  Watch,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Zap,
  Activity,
  Heart,
  Thermometer,
} from 'lucide-react';
import { WearableDevice } from '../../types';

interface WearablesViewProps {
  wearables: WearableDevice[];
  onToggleConnect: (id: string) => void;
}

export const WearablesView: React.FC<WearablesViewProps> = ({ wearables = [], onToggleConnect }) => {
  const [syncingId, setSyncingId] = useState<string | null>(null);

  const safeWearables = Array.isArray(wearables) ? wearables : [];

  const handleSyncNow = (id: string) => {
    setSyncingId(id);
    setTimeout(() => {
      setSyncingId(null);
    }, 1200);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Banner */}
      <div className="p-6 rounded-3xl bg-white/5 backdrop-blur-xl text-slate-100 border border-white/10 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold">
            <Watch className="w-3.5 h-3.5 text-blue-400" /> Multi-Device Health Telemetry Pipeline
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            Wearable Device & Biometric Telemetry Sync
          </h1>
          <p className="text-xs text-slate-300 leading-relaxed">
            Unified OAuth pipeline aggregating real-time heart rate, resting HR, blood oxygen (SpO2), body temperature, and step cadence from Apple Health, Garmin, Fitbit, and Google Health Connect.
          </p>
        </div>
      </div>

      {/* Connected Devices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {safeWearables.map((device) => (
          <div
            key={device.id}
            className={`p-6 rounded-3xl border transition-all space-y-4 ${
              device.connected
                ? 'bg-white dark:bg-slate-900 border-teal-500/40 shadow-lg shadow-teal-500/5'
                : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-80'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                  {device.brand}
                </span>
                <h3 className="font-black text-base text-slate-900 dark:text-slate-100">
                  {device.name}
                </h3>
                <p className="text-[11px] text-slate-400">Last sync: {device.lastSync}</p>
              </div>

              <span
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                  device.connected
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                }`}
              >
                {device.connected ? 'Connected' : 'Disconnected'}
              </span>
            </div>

            {device.connected && (
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                  <div className="text-[9px] uppercase text-slate-400">Heart Rate</div>
                  <div className="font-mono font-bold text-slate-900 dark:text-slate-100 text-sm">
                    {device.syncMetrics.heartRateBpm} BPM
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                  <div className="text-[9px] uppercase text-slate-400">SpO2 Oxygen</div>
                  <div className="font-mono font-bold text-slate-900 dark:text-slate-100 text-sm">
                    {device.syncMetrics.bloodOxygenSpO2}%
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                  <div className="text-[9px] uppercase text-slate-400">Resting HR</div>
                  <div className="font-mono font-bold text-slate-900 dark:text-slate-100 text-sm">
                    {device.syncMetrics.restingHeartRate} BPM
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                  <div className="text-[9px] uppercase text-slate-400">Body Temp</div>
                  <div className="font-mono font-bold text-slate-900 dark:text-slate-100 text-sm">
                    {device.syncMetrics.bodyTempC}°C
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => onToggleConnect(device.id)}
                className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-colors ${
                  device.connected
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                    : 'bg-teal-500 text-white hover:bg-teal-600'
                }`}
              >
                {device.connected ? 'Disconnect' : 'Connect Account'}
              </button>

              {device.connected && (
                <button
                  onClick={() => handleSyncNow(device.id)}
                  disabled={syncingId === device.id}
                  className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors"
                  title="Force Telemetry Sync"
                >
                  <RefreshCw
                    className={`w-4 h-4 ${syncingId === device.id ? 'animate-spin text-teal-500' : ''}`}
                  />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
