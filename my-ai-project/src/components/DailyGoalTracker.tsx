import { useState, useEffect } from "react";
import { CheckCircle2, Circle, Target } from "lucide-react";
import { motion } from "motion/react";
import { useStore } from "../store";
import toast from "react-hot-toast";

const defaultGoals = [
  { id: 'water', label: 'Drink 2L Water', max: 2, unit: 'L' },
  { id: 'steps', label: '10,000 Steps', max: 10000, unit: 'steps' },
  { id: 'sleep', label: '8 Hours Sleep', max: 8, unit: 'hrs' },
  { id: 'meditation', label: '10 Min Meditation', max: 10, unit: 'min' }
];

export function DailyGoalTracker() {
  const { waterAmount } = useStore();
  const [goals, setGoals] = useState([
    { id: 'water', current: 0 },
    { id: 'steps', current: 4500 },
    { id: 'sleep', current: 6.5 },
    { id: 'meditation', current: 0 }
  ]);

  useEffect(() => {
    setGoals(prev => prev.map(g => g.id === 'water' ? { ...g, current: waterAmount } : g));
  }, [waterAmount]);

  const toggleMeditation = () => {
    setGoals(prev => prev.map(g => {
      if (g.id === 'meditation') {
        const newCurrent = g.current === 0 ? 10 : 0;
        if (newCurrent === 10) toast.success("Meditation goal reached!");
        return { ...g, current: newCurrent };
      }
      return g;
    }));
  };

  const addSteps = () => {
    setGoals(prev => prev.map(g => {
      if (g.id === 'steps') {
        const newCurrent = Math.min(g.current + 1000, 10000);
        if (newCurrent === 10000 && g.current < 10000) toast.success("Step goal reached!");
        return { ...g, current: newCurrent };
      }
      return g;
    }));
  };

  const totalProgress = goals.reduce((acc, goal) => {
    const def = defaultGoals.find(d => d.id === goal.id);
    if (!def) return acc;
    return acc + (Math.min(goal.current, def.max) / def.max);
  }, 0) / goals.length * 100;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-3xl bg-black/40 border border-white/10 backdrop-blur-xl"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-500/20 text-purple-400 rounded-2xl">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white">Daily Goals</h3>
            <p className="text-sm text-gray-400">Track your healthy habits</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-white">{Math.round(totalProgress)}%</span>
          <p className="text-xs text-gray-400 uppercase tracking-wider">Completed</p>
        </div>
      </div>

      <div className="w-full bg-white/5 rounded-full h-2 mb-8 overflow-hidden">
        <motion.div 
          className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${totalProgress}%` }}
          transition={{ duration: 1 }}
        />
      </div>

      <div className="space-y-4">
        {defaultGoals.map(def => {
          const state = goals.find(g => g.id === def.id);
          const current = state?.current || 0;
          const isComplete = current >= def.max;
          
          return (
            <div key={def.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                 onClick={() => {
                   if (def.id === 'meditation') toggleMeditation();
                   if (def.id === 'steps') addSteps();
                 }}
            >
              <div className="flex items-center gap-3">
                {isComplete ? (
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-500" />
                )}
                <span className={`font-medium ${isComplete ? 'text-gray-300 line-through' : 'text-white'}`}>
                  {def.label}
                </span>
              </div>
              <span className="text-sm font-mono text-gray-400">
                {current} / {def.max} {def.unit}
              </span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
