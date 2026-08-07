import { motion } from "motion/react";
import Layout from "../components/Layout";
import { Users, Server, Activity, AlertTriangle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const mockData = [
  { name: 'Mon', users: 400 },
  { name: 'Tue', users: 300 },
  { name: 'Wed', users: 550 },
  { name: 'Thu', users: 450 },
  { name: 'Fri', users: 600 },
  { name: 'Sat', users: 700 },
  { name: 'Sun', users: 650 },
];

export default function AdminDashboard() {
  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Admin Dashboard</h2>
          <p className="text-gray-400">System overview and analytics.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: "Active Users", value: "24,592", icon: Users, trend: "+12%" },
            { label: "System Health", value: "99.9%", icon: Server, trend: "Stable" },
            { label: "AI Requests", value: "1.2M", icon: Activity, trend: "+5%" },
            { label: "Alerts", value: "3", icon: AlertTriangle, trend: "Requires attention" },
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-[2rem] bg-white/5 border border-white/10 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 -mt-8 -mr-8 w-24 h-24 bg-blue-600/10 blur-[30px] rounded-full pointer-events-none mix-blend-screen" />
              
              <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="w-12 h-12 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-blue-400" />
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border ${stat.trend.includes('+') ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-black/40 text-gray-400 border-white/10'}`}>
                  {stat.trend}
                </span>
              </div>
              <p className="text-4xl font-bold tracking-tighter relative z-10">{stat.value}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mt-2 relative z-10">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.4 }}
           className="p-8 rounded-[2rem] bg-white/5 border border-white/10 relative overflow-hidden"
        >
          <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-48 h-48 bg-blue-600/10 blur-[60px] rounded-full pointer-events-none mix-blend-screen" />
          
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-8 relative z-10">User Growth (Weekly)</h3>
          <div className="h-72 relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#6b7280" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#6b7280" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: '#ffffff', opacity: 0.05 }} contentStyle={{ backgroundColor: '#050505', borderColor: '#ffffff20', borderRadius: '16px', color: '#fff', fontSize: '12px' }} />
                <Bar dataKey="users" fill="#2563eb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
