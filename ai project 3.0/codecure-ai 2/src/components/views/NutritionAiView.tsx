import React, { useState, useRef } from 'react';
import {
  Utensils,
  Upload,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  Plus,
  Flame,
} from 'lucide-react';
import { MealLog } from '../../types';

interface NutritionAiViewProps {
  mealLogs: MealLog[];
  onAddMealLog: (meal: MealLog) => void;
}

export const NutritionAiView: React.FC<NutritionAiViewProps> = ({
  mealLogs,
  onAddMealLog,
}) => {
  const [mealPhoto, setMealPhoto] = useState<string | null>(null);
  const [textPrompt, setTextPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalCalories = mealLogs.reduce((acc, m) => acc + m.calories, 0);
  const totalProtein = mealLogs.reduce((acc, m) => acc + m.proteinGrams, 0);
  const totalCarbs = mealLogs.reduce((acc, m) => acc + m.carbsGrams, 0);
  const totalFats = mealLogs.reduce((acc, m) => acc + m.fatsGrams, 0);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMealPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyzeMeal = async () => {
    if (!mealPhoto && !textPrompt.trim()) return;
    setLoading(true);

    try {
      const res = await fetch('/api/gemini/nutrition', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: mealPhoto,
          textPrompt,
        }),
      });

      const data = await res.json();

      const newMeal: MealLog = {
        id: `meal-${Date.now()}`,
        name: data.mealName || textPrompt || 'Parsed Meal Photo',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        calories: data.estimatedCalories || 450,
        proteinGrams: data.proteinGrams || 25,
        carbsGrams: data.carbsGrams || 40,
        fatsGrams: data.fatsGrams || 15,
        healthScore: data.healthScore || 88,
        healthierAlternatives: data.healthierAlternatives || [],
        imageUrl: mealPhoto || undefined,
      };

      onAddMealLog(newMeal);
      setMealPhoto(null);
      setTextPrompt('');
    } catch (err) {
      console.error('Nutrition AI error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950 via-slate-900 to-pink-950 text-white border border-purple-500/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-semibold">
            <Utensils className="w-3.5 h-3.5 text-purple-400" /> Precision Metabolic AI
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            Nutrition AI & Food Recognition Engine
          </h1>
          <p className="text-xs text-slate-300 leading-relaxed">
            Snap meal photos for instant computer vision estimation of calories, macronutrients (protein, carbs, fats), micronutrient profile, and healthy swaps.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center shrink-0">
          <div className="text-[10px] uppercase font-bold text-purple-200">Logged Today</div>
          <div className="text-2xl font-black text-white mt-0.5">{totalCalories} <span className="text-xs font-normal">kcal</span></div>
          <div className="text-[10px] text-emerald-300 font-semibold mt-0.5">Target: 2,200 kcal</div>
        </div>
      </div>

      {/* Daily Macro Bar Breakdown */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
          <div className="text-[10px] font-bold uppercase text-slate-400">Protein Intake</div>
          <div className="text-xl font-black text-purple-600 dark:text-purple-400 mt-1">{totalProtein}g</div>
          <div className="text-[10px] text-slate-400">Target: 140g</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
          <div className="text-[10px] font-bold uppercase text-slate-400">Carbohydrates</div>
          <div className="text-xl font-black text-amber-600 dark:text-amber-400 mt-1">{totalCarbs}g</div>
          <div className="text-[10px] text-slate-400">Target: 220g</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
          <div className="text-[10px] font-bold uppercase text-slate-400">Healthy Fats</div>
          <div className="text-xl font-black text-pink-600 dark:text-pink-400 mt-1">{totalFats}g</div>
          <div className="text-[10px] text-slate-400">Target: 65g</div>
        </div>
      </div>

      {/* Snap Food / Input Section */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
          Snap Meal Photo or Describe Food
        </h3>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageSelect}
          accept="image/*"
          className="hidden"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="p-6 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-purple-500 bg-slate-50 dark:bg-slate-800/40 text-center cursor-pointer transition-all space-y-2 group"
          >
            {mealPhoto ? (
              <img src={mealPhoto} alt="Meal Preview" className="h-28 mx-auto rounded-xl object-cover" />
            ) : (
              <>
                <Upload className="w-8 h-8 mx-auto text-purple-500 group-hover:scale-110 transition-transform" />
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Click to Upload Meal Photo
                </div>
              </>
            )}
          </div>

          <div className="space-y-3 flex flex-col justify-between">
            <textarea
              rows={3}
              placeholder="Or describe meal ingredients e.g., Grilled salmon with 1 cup quinoa, steamed broccoli, olive oil drizzle..."
              value={textPrompt}
              onChange={(e) => setTextPrompt(e.target.value)}
              className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs border border-slate-200 dark:border-slate-700"
            />

            <button
              onClick={handleAnalyzeMeal}
              disabled={loading || (!mealPhoto && !textPrompt.trim())}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xs hover:brightness-110 flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Analyzing Nutrient Macros...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Analyze Meal Nutrition
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Logged Meals List */}
      <div className="space-y-3">
        <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">
          Today's Meal Log
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mealLogs.map((meal) => (
            <div
              key={meal.id}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">{meal.name}</h4>
                  <span className="text-[10px] text-slate-400">{meal.time}</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                  Score {meal.healthScore}/100
                </span>
              </div>

              <div className="grid grid-cols-4 gap-1 text-center bg-slate-50 dark:bg-slate-800/60 p-2 rounded-xl text-[11px]">
                <div>
                  <div className="text-[9px] text-slate-400">Cals</div>
                  <div className="font-bold text-slate-800 dark:text-slate-200">{meal.calories}</div>
                </div>
                <div>
                  <div className="text-[9px] text-slate-400">Protein</div>
                  <div className="font-bold text-purple-600">{meal.proteinGrams}g</div>
                </div>
                <div>
                  <div className="text-[9px] text-slate-400">Carbs</div>
                  <div className="font-bold text-amber-600">{meal.carbsGrams}g</div>
                </div>
                <div>
                  <div className="text-[9px] text-slate-400">Fats</div>
                  <div className="font-bold text-pink-600">{meal.fatsGrams}g</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
