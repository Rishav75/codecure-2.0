import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Layout from "../components/Layout";
import { Users, Plus, HeartPulse, Activity, AlertCircle, FileText, Pill, ChevronLeft, Calendar } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import toast from "react-hot-toast";

const mockTrendData = [
  { name: 'Mon', score: 75 },
  { name: 'Tue', score: 78 },
  { name: 'Wed', score: 82 },
  { name: 'Thu', score: 85 },
  { name: 'Fri', score: 89 },
  { name: 'Sat', score: 92 },
  { name: 'Sun', score: 95 },
];

export default function FamilyDashboard() {
  const [activeMember, setActiveMember] = useState<any>(null);

  const [members] = useState([
    { id: 1, name: "Sarah Johnson", relation: "Spouse", age: 32, bloodType: "A+", status: "Healthy", score: 92, allergies: ["Penicillin"], medications: ["Vitamin D"], recentLog: "Feeling energetic today." },
    { id: 2, name: "Tommy Johnson", relation: "Child", age: 8, bloodType: "O+", status: "Checkup Due", score: 85, allergies: ["Peanuts", "Dust"], medications: ["Albuterol"], recentLog: "Slight cough in the morning." },
    { id: 3, name: "Martha Stewart", relation: "Parent", age: 68, bloodType: "B-", status: "Medication", score: 78, allergies: ["Sulfa drugs"], medications: ["Lisinopril", "Amlodipine"], recentLog: "Blood pressure normal." },
  ]);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-8">
        <AnimatePresence mode="wait">
          {!activeMember ? (
            <motion.div 
              key="list"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-semibold mb-2">Family Health</h2>
                  <p className="text-gray-400">Manage medical records and health scores for your family members.</p>
                </div>
                <button 
                  onClick={() => toast.success("Add member functionality coming soon!")}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm font-bold transition-all shadow-lg flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add Member
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {members.map((member, i) => (
                  <motion.div 
                    key={member.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-6 rounded-[2rem] bg-white/5 border border-white/10 relative overflow-hidden cursor-pointer hover:bg-white/10 transition-colors"
                    onClick={() => setActiveMember(member)}
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-blue-600/20 flex items-center justify-center border border-blue-600/30">
                          <span className="text-blue-400 font-bold text-lg">{member.name.charAt(0)}</span>
                        </div>
                        <div>
                          <h3 className="font-medium text-white text-sm">{member.name}</h3>
                          <div className="flex gap-2 mt-1">
                            <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-gray-400">{member.relation}</span>
                            <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-gray-400">{member.age} yrs</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="p-3 rounded-2xl bg-black/40 flex flex-col gap-1 text-center">
                        <span className="text-[10px] text-gray-500 uppercase tracking-widest flex items-center justify-center gap-1"><HeartPulse className="w-3 h-3" /> Score</span>
                        <span className="text-lg font-bold text-white">{member.score}</span>
                      </div>
                      <div className="p-3 rounded-2xl bg-black/40 flex flex-col gap-1 text-center">
                        <span className="text-[10px] text-gray-500 uppercase tracking-widest flex items-center justify-center gap-1"><Activity className="w-3 h-3" /> Type</span>
                        <span className="text-lg font-bold text-white">{member.bloodType}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="detail"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <button 
                onClick={() => setActiveMember(null)}
                className="mb-8 flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest"
              >
                <ChevronLeft className="w-4 h-4" /> Back to Family
              </button>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1 space-y-6">
                   <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 text-center relative overflow-hidden">
                     <div className="absolute top-0 right-0 -mt-16 -mr-16 w-48 h-48 bg-blue-600/10 blur-[60px] rounded-full pointer-events-none mix-blend-screen" />
                     <div className="w-24 h-24 rounded-full bg-blue-600/20 flex items-center justify-center border border-blue-600/30 mx-auto mb-4">
                        <span className="text-blue-400 font-bold text-4xl">{activeMember.name.charAt(0)}</span>
                     </div>
                     <h3 className="text-xl font-bold text-white">{activeMember.name}</h3>
                     <p className="text-sm text-gray-400 mt-1">{activeMember.relation} • {activeMember.age} yrs • {activeMember.bloodType}</p>
                     
                     <div className="mt-6 flex justify-center gap-2">
                       <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border ${activeMember.status === 'Healthy' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>{activeMember.status}</span>
                     </div>
                   </div>

                   <div className="p-6 rounded-[2rem] bg-white/5 border border-white/10 space-y-4">
                     <h4 className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Allergies</h4>
                     <div className="flex flex-wrap gap-2">
                       {activeMember.allergies.map((a: string) => <span key={a} className="px-3 py-1 bg-amber-500/10 text-amber-400 rounded-full text-xs font-medium">{a}</span>)}
                     </div>
                     <h4 className="text-[10px] text-gray-500 uppercase tracking-widest font-bold pt-4 border-t border-white/5">Current Medications</h4>
                     <div className="flex flex-wrap gap-2">
                       {activeMember.medications.map((m: string) => <span key={m} className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-xs font-medium">{m}</span>)}
                     </div>
                   </div>

                   <div className="flex flex-col gap-3">
                     <button 
                       onClick={() => toast.success(`Scheduling appointment for ${activeMember.name}...`)}
                       className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-all shadow-lg flex items-center justify-center gap-2"
                     >
                       <Calendar className="w-4 h-4" /> Book Appointment
                     </button>
                     <button 
                       onClick={() => toast.success(`Opened medical record uploader for ${activeMember.name}`)}
                       className="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-bold transition-all shadow-lg flex items-center justify-center gap-2"
                     >
                       <FileText className="w-4 h-4" /> Upload Record
                     </button>
                   </div>
                </div>

                <div className="md:col-span-2 space-y-6">
                  <div className="p-6 rounded-[2rem] bg-white/5 border border-white/10">
                    <h3 className="text-lg font-semibold mb-6">Health Trend</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={mockTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                  </div>

                  <div className="p-6 rounded-[2rem] bg-white/5 border border-white/10">
                    <h3 className="text-lg font-semibold mb-6">Recent Activity Logs</h3>
                    <div className="space-y-4">
                      <div className="p-4 rounded-2xl bg-black/40 border border-white/5 flex gap-4">
                         <div className="w-10 h-10 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0">
                           <Activity className="w-5 h-5" />
                         </div>
                         <div>
                           <h4 className="text-sm font-medium text-white">{activeMember.recentLog}</h4>
                           <p className="text-xs text-gray-500 mt-1 flex items-center gap-1"><Calendar className="w-3 h-3" /> Today, 10:30 AM</p>
                         </div>
                      </div>
                      <div className="p-4 rounded-2xl bg-black/40 border border-white/5 flex gap-4">
                         <div className="w-10 h-10 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                           <FileText className="w-5 h-5" />
                         </div>
                         <div>
                           <h4 className="text-sm font-medium text-white">Annual checkup results uploaded</h4>
                           <p className="text-xs text-gray-500 mt-1 flex items-center gap-1"><Calendar className="w-3 h-3" /> 2 days ago</p>
                         </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}
