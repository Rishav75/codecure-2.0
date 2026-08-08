import React from 'react';
import {
  Bell,
  X,
  CheckCircle2,
  Pill,
  Droplets,
  Moon,
  AlertTriangle,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { ActiveTab, Medication, DoctorAppointment } from '../types';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  medications: Medication[];
  doctors: DoctorAppointment[];
  setActiveTab: (tab: ActiveTab) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  medications,
  doctors,
  setActiveTab,
}) => {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const pendingMeds = medications.filter((m) => !m.takenToday);
  const upcomingDoctor = doctors.find((d) => d.status === 'Upcoming');

  const notifications = [
    ...(pendingMeds.length > 0
      ? [
          {
            id: 'n-meds',
            type: 'medication',
            title: `${pendingMeds.length} Medication Reminders Pending`,
            desc: `Take ${pendingMeds.map((m) => m.name).join(', ')} scheduled today.`,
            icon: Pill,
            color: 'text-amber-500 bg-amber-500/10 border-amber-500/30',
            tab: 'medicine-manager' as ActiveTab,
          },
        ]
      : []),
    ...(upcomingDoctor
      ? [
          {
            id: 'n-doc',
            type: 'doctor',
            title: `Upcoming Appointment with ${upcomingDoctor.doctorName}`,
            desc: `${upcomingDoctor.specialty} on ${upcomingDoctor.date} at ${upcomingDoctor.time}`,
            icon: Calendar,
            color: 'text-teal-500 bg-teal-500/10 border-teal-500/30',
            tab: 'doctor-connect' as ActiveTab,
          },
        ]
      : []),
    {
      id: 'n-water',
      type: 'hydration',
      title: 'Hydration Target Reminder',
      desc: 'You logged 1,800ml today. Drink 300ml water to reach 2,500ml daily target.',
      icon: Droplets,
      color: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/30',
      tab: 'fitness' as ActiveTab,
    },
    {
      id: 'n-sleep',
      type: 'sleep',
      title: 'Optimal Sleep Window Advisory',
      desc: 'Recommended bedtime tonight: 10:45 PM for 8.0h complete recovery.',
      icon: Moon,
      color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/30',
      tab: 'sleep-coach' as ActiveTab,
    },
    {
      id: 'n-risk',
      type: 'ai-alert',
      title: 'AI Preventive Health Advisory',
      desc: 'Workplace stress score spiked 12%. Take a 5-minute Box Breathing break.',
      icon: Sparkles,
      color: 'text-purple-500 bg-purple-500/10 border-purple-500/30',
      tab: 'mental-wellness' as ActiveTab,
    },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="AI Health Notifications Drawer"
      className="fixed inset-0 z-50 flex justify-end"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-sm bg-slate-900/95 backdrop-blur-2xl h-full shadow-2xl border-l border-white/10 z-10 flex flex-col p-5 text-slate-100">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-sm text-slate-100">
              AI Health Notifications
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3 custom-scrollbar">
          {notifications.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                onClick={() => {
                  setActiveTab(item.tab);
                  onClose();
                }}
                className="p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 cursor-pointer transition-colors space-y-1.5 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg border ${item.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-xs text-slate-100 group-hover:text-blue-400 transition-colors">
                      {item.title}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed pl-8">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

        <div className="pt-3 border-t border-white/10 text-center">
          <button
            onClick={onClose}
            className="text-xs font-semibold text-blue-400 hover:underline"
          >
            Mark all as reviewed
          </button>
        </div>
      </div>
    </div>
  );
};
