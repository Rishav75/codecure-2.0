import React from 'react';
import {
  CheckSquare,
  Square,
  CheckCircle2,
  Lock,
  UserCheck,
  Shield,
  Building2,
  Search,
  FileCheck,
} from 'lucide-react';
import { IncidentChecklistItem, UserRole } from '../types';

interface IncidentActionChecklistProps {
  items: IncidentChecklistItem[];
  currentRole: UserRole;
  onToggleItem: (itemId: string) => void;
  readOnly?: boolean;
}

const ROLE_BADGE_COLORS: Record<UserRole, string> = {
  USER: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
  ADMIN: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  HOSPITAL: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  AUTHORITY: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
  INVESTIGATOR: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  REVIEWER: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
};

const ROLE_ICONS: Record<UserRole, React.FC<{ className?: string }>> = {
  USER: UserCheck,
  ADMIN: Shield,
  HOSPITAL: Building2,
  AUTHORITY: Shield,
  INVESTIGATOR: Search,
  REVIEWER: FileCheck,
};

export const IncidentActionChecklist: React.FC<IncidentActionChecklistProps> = ({
  items,
  currentRole,
  onToggleItem,
  readOnly = false,
}) => {
  const completedCount = items.filter((i) => i.status === 'completed').length;
  const totalCount = items.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 space-y-5">
      {/* Header & Progress Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-blue-400" />
            <h3 className="font-extrabold text-base text-white">RESPONSE ACTION CHECKLIST</h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Role-owned operational verification protocols. Saved to persistent audit trail.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-black/20 px-4 py-2 rounded-2xl border border-white/10 shrink-0">
          <div className="text-right">
            <div className="text-xs font-black text-white">{progressPercent}%</div>
            <div className="text-[10px] text-slate-400">
              {completedCount} of {totalCount} Completed
            </div>
          </div>
          <div className="w-12 h-12 rounded-full border-2 border-white/10 flex items-center justify-center p-1 relative">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="18"
                cy="18"
                r="14"
                className="stroke-slate-800 fill-none"
                strokeWidth="3"
              />
              <circle
                cx="18"
                cy="18"
                r="14"
                className="stroke-blue-500 fill-none transition-all duration-500"
                strokeWidth="3"
                strokeDasharray="88"
                strokeDashoffset={88 - (88 * progressPercent) / 100}
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Progress Bar Visual */}
      <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
        <div
          className="bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Checklist List */}
      <div className="space-y-2.5">
        {items.map((item) => {
          const isCompleted = item.status === 'completed';
          const isAuthorized =
            currentRole === 'ADMIN' || currentRole === item.responsibleRole;
          const RoleIcon = ROLE_ICONS[item.responsibleRole] || UserCheck;

          return (
            <div
              key={item.id}
              onClick={() => {
                if (!readOnly && isAuthorized) {
                  onToggleItem(item.id);
                }
              }}
              className={`p-3.5 rounded-2xl border transition-all duration-200 flex items-start gap-3.5 ${
                isCompleted
                  ? 'bg-blue-500/10 border-blue-500/30 text-slate-200'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
              } ${
                !readOnly && isAuthorized
                  ? 'cursor-pointer'
                  : 'opacity-70 cursor-not-allowed'
              }`}
            >
              <button
                type="button"
                disabled={readOnly || !isAuthorized}
                className="mt-0.5 text-blue-400 focus:outline-none"
                aria-label={`Toggle checklist item: ${item.title}`}
              >
                {isCompleted ? (
                  <CheckSquare className="w-5 h-5 text-blue-400 fill-blue-500/20" />
                ) : (
                  <Square className="w-5 h-5 text-slate-500" />
                )}
              </button>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`font-bold text-xs ${
                      isCompleted ? 'line-through text-slate-400' : 'text-slate-100'
                    }`}
                  >
                    {item.title}
                  </span>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                        ROLE_BADGE_COLORS[item.responsibleRole]
                      }`}
                    >
                      <RoleIcon className="w-3 h-3" />
                      Owner: {item.responsibleRole}
                    </span>

                    {!isAuthorized && !readOnly && (
                      <span className="text-[9px] text-amber-400 font-semibold flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Locked
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {item.description}
                </p>

                {isCompleted && (
                  <div className="text-[9px] text-blue-300 font-mono mt-1">
                    ✓ Completed by {item.completedBy || currentRole} at{' '}
                    {item.completedAt || 'Just now'}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
