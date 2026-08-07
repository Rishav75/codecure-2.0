import { motion } from "motion/react";
import Layout from "../components/Layout";
import { Activity, HeartPulse, Moon, Droplets, Smartphone, ArrowRight, Smile, Meh, Frown, Plus } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useStore } from "../store";
import toast from "react-hot-toast";
import { db, auth } from "../lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useEffect } from "react";
import { DailyGoalTracker } from "../components/DailyGoalTracker";

const mockData = [
  { name: 'Mon', score: 82 },
  { name: 'Tue', score: 85 },
  { name: 'Wed', score: 81 },
  { name: 'Thu', score: 88 },
  { name: 'Fri', score: 89 },
  { name: 'Sat', score: 92 },
  { name: 'Sun', score: 95 },
];

export default function Dashboard() {
  const { user, mood, setMood, waterAmount, setWaterAmount } = useStore();

  useEffect(() => {
    const fetchTodayMood = async () => {
      if (user?.uid) {
        try {
          const today = new Date();
          const dateStr = today.toISOString().split('T')[0];
          const moodDoc = await getDoc(doc(db, "users", user.uid, "moods", dateStr));
          if (moodDoc.exists()) {
            setMood(moodDoc.data().mood);
          }
        } catch (error) {
          console.error("Error fetching mood", error);
        }
      }
    };
    fetchTodayMood();
  }, [user, setMood]);

  const logWater = () => {
    setWaterAmount(+(waterAmount + 0.25).toFixed(2));
    toast.success("Logged 250ml of water!");
  };

  const logMood = async (m: string) => {
    setMood(m);
    
    if (user?.uid) {
      try {
        const today = new Date();
        const dateStr = today.toISOString().split('T')[0];
        
        await setDoc(doc(db, "users", user.uid, "moods", dateStr), {
          userId: user.uid,
          mood: m,
          timestamp: Date.now(),
          date: dateStr
        });
        toast.success(`Mood logged to cloud: ${m}`);
      } catch (error) {
        console.error("Error saving mood", error);
        toast.error("Failed to save mood to cloud");
      }
    } else {
      toast.success(`Mood logged locally: ${m}`);
    }
  };
  return (
    <Layout>
      <div className="space-y-6">
        
        {/* Header Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:col-span-2 rounded-[2rem] bg-white/5 border border-white/10 p-8 flex flex-col justify-between relative overflow-hidden"
          >
            <div className="absolute -right-10 -top-10 w-64 h-64 bg-blue-600/20 blur-[60px] rounded-full mix-blend-screen pointer-events-none" />
            <div className="z-10">
              <h2 className="text-2xl font-semibold mb-2">Good morning, Alex</h2>
              <p className="text-gray-400">Your overall health score is looking great today. Keep up the hydration!</p>
            </div>
            <div className="mt-8 flex items-end gap-4 z-10">
              <span className="text-6xl font-bold tracking-tighter text-white">84</span>
              <span className="text-lg text-blue-400 font-medium pb-2 uppercase tracking-wide">Excellent</span>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-[2rem] bg-white/5 border border-white/10 p-6 flex flex-col items-center justify-center text-center relative overflow-hidden"
          >
             <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/20 blur-[40px] rounded-full mix-blend-screen pointer-events-none" />
             <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4 border border-red-500/20">
               <Activity className="w-8 h-8 text-red-400" />
             </div>
             <h3 className="text-lg font-medium">Emergency Profile</h3>
             <p className="text-sm text-gray-400 mt-2 mb-4">View your scannable medical QR code.</p>
             <button className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full text-sm font-bold transition-colors w-full border border-white/10">
               View QR Code
             </button>
          </motion.div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: "Heart Rate", value: "72 bpm", icon: HeartPulse, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
            { label: "Sleep", value: "7h 45m", icon: Moon, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
            { label: "Water", value: `${waterAmount} L`, icon: Droplets, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
            { label: "Screen Time", value: "3h 12m", icon: Smartphone, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
          ].map((metric, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + (i * 0.1) }}
              className="p-5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4"
            >
              <div className={`w-12 h-12 rounded-xl ${metric.bg} flex items-center justify-center shrink-0`}>
                <metric.icon className={`w-6 h-6 ${metric.color}`} />
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest">{metric.label}</p>
                <p className="text-lg font-bold text-white">{metric.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Chart & Action */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="md:col-span-2 p-6 rounded-[2rem] bg-white/5 border border-white/10"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Weekly Health Trend</h3>
              <select className="bg-black/40 border border-white/10 rounded-lg px-3 py-1 text-sm text-gray-300 outline-none">
                <option>This Week</option>
                <option>Last Week</option>
              </select>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', backdropFilter: 'blur(8px)' }} />
                  <Area type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.7 }}
             className="p-6 rounded-[2rem] bg-white/5 border border-white/10 flex flex-col"
          >
            <h3 className="text-lg font-semibold mb-4">Today's AI Plan</h3>
            <div className="flex-1 space-y-3">
              {[
                { time: "08:00 AM", task: "Morning Hydration (500ml)", done: true },
                { time: "01:00 PM", task: "High Protein Lunch", done: false },
                { time: "05:30 PM", task: "30 Min Brisk Walk", done: false },
                { time: "10:00 PM", task: "Digital Detox Starts", done: false },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${item.done ? 'bg-blue-600 border-blue-600' : 'border-gray-500'}`}>
                    {item.done && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                  <div className="flex-1">
                    <h4 className={`text-sm font-medium ${item.done ? 'text-gray-500 line-through' : 'text-gray-200'}`}>{item.task}</h4>
                    <p className="text-xs text-gray-500">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <button 
              onClick={() => toast.success("New AI health plan generated!")}
              className="mt-6 w-full py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-all shadow-lg flex items-center justify-center gap-2"
            >
              Generate New Plan <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>

        {/* Quick Trackers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="p-6 rounded-[2rem] bg-white/5 border border-white/10"
          >
            <h3 className="text-lg font-semibold mb-4">How are you feeling?</h3>
            <div className="flex gap-4">
              <button 
                onClick={() => logMood('Happy')}
                className={`flex-1 p-4 rounded-2xl border flex flex-col items-center gap-2 transition-colors ${mood === 'Happy' ? 'bg-green-500/20 border-green-500/30 text-green-400' : 'bg-black/40 border-white/10 hover:bg-white/10 text-gray-400 hover:text-white'}`}
              >
                <Smile className="w-8 h-8" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Happy</span>
              </button>
              <button 
                onClick={() => logMood('Okay')}
                className={`flex-1 p-4 rounded-2xl border flex flex-col items-center gap-2 transition-colors ${mood === 'Okay' ? 'bg-amber-500/20 border-amber-500/30 text-amber-400' : 'bg-black/40 border-white/10 hover:bg-white/10 text-gray-400 hover:text-white'}`}
              >
                <Meh className="w-8 h-8" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Okay</span>
              </button>
              <button 
                onClick={() => logMood('Down')}
                className={`flex-1 p-4 rounded-2xl border flex flex-col items-center gap-2 transition-colors ${mood === 'Down' ? 'bg-red-500/20 border-red-500/30 text-red-400' : 'bg-black/40 border-white/10 hover:bg-white/10 text-gray-400 hover:text-white'}`}
              >
                <Frown className="w-8 h-8" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Down</span>
              </button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="p-6 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-between"
          >
            <div>
              <h3 className="text-lg font-semibold mb-1">Hydration Goal</h3>
              <p className="text-sm text-gray-400">Aim for 3.0 L today.</p>
              <div className="mt-4 flex items-end gap-2">
                <span className="text-3xl font-bold text-white">{waterAmount.toFixed(2)}</span>
                <span className="text-sm font-medium text-blue-400 pb-1">/ 3.0 L</span>
              </div>
            </div>
            <button 
              onClick={logWater}
              className="w-16 h-16 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-600/30 hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center shadow-lg"
            >
              <Plus className="w-8 h-8" />
            </button>
          </motion.div>
        </div>

        {/* Daily Goal Tracker */}
        <div className="mt-6">
          <DailyGoalTracker />
        </div>
      </div>
    </Layout>
  );
}
