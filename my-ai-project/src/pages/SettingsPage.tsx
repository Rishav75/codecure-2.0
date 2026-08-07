import { motion } from "motion/react";
import Layout from "../components/Layout";
import { User, Bell, Shield, Moon, Trash2 } from "lucide-react";
import { useStore } from "../store";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const { user } = useStore();

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Settings</h2>
          <p className="text-gray-400">Manage your account preferences and application settings.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-2">
            {[
              { id: 'profile', label: 'Profile', icon: User },
              { id: 'notifications', label: 'Notifications', icon: Bell },
              { id: 'privacy', label: 'Privacy & Security', icon: Shield },
              { id: 'appearance', label: 'Appearance', icon: Moon },
            ].map((tab, i) => (
              <button key={tab.id} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${i === 0 ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
                <tab.icon className="w-5 h-5" />
                <span className="font-medium text-sm">{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="md:col-span-2 space-y-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 rounded-[2rem] bg-white/5 border border-white/10 space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 -mt-16 -mr-16 w-48 h-48 bg-blue-600/20 blur-[60px] rounded-full pointer-events-none mix-blend-screen" />
              
              <h3 className="text-lg font-semibold relative z-10">Profile Information</h3>
              
              <div className="flex items-center gap-6 relative z-10">
                <div className="w-20 h-20 rounded-2xl bg-blue-600/20 flex items-center justify-center border border-blue-600/30">
                   <span className="text-2xl text-blue-400 font-bold">{user?.email?.charAt(0).toUpperCase() || 'U'}</span>
                </div>
                <div>
                  <button 
                    onClick={() => toast.success("Avatar selection opened")}
                    className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full text-xs font-bold uppercase tracking-wider transition-colors border border-white/10"
                  >
                    Change Avatar
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 relative z-10">
                <div className="space-y-2">
                  <label className="text-[10px] text-gray-500 uppercase tracking-widest">First Name</label>
                  <input type="text" defaultValue="Alex" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-gray-500 uppercase tracking-widest">Last Name</label>
                  <input type="text" defaultValue="Johnson" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50" />
                </div>
                <div className="col-span-2 space-y-2">
                  <label className="text-[10px] text-gray-500 uppercase tracking-widest">Email Address</label>
                  <input type="email" disabled value={user?.email || "user@example.com"} className="w-full bg-black/20 border border-white/5 rounded-xl px-4 py-3 text-gray-500 cursor-not-allowed" />
                </div>
              </div>

              <div className="pt-4 flex justify-end relative z-10">
                <button 
                  onClick={() => toast.success("Settings saved successfully")}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-xs font-bold transition-all shadow-lg uppercase tracking-wider"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="p-8 rounded-[2rem] bg-gradient-to-br from-red-900/10 to-transparent border border-red-500/10 space-y-4">
               <h3 className="text-lg font-semibold text-red-400">Danger Zone</h3>
               <p className="text-sm text-gray-400">Permanently delete your account and all associated medical data. This action cannot be undone.</p>
               <button 
                 onClick={() => toast.error("Account scheduled for deletion")}
                 className="flex items-center gap-2 px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-full text-xs font-bold uppercase tracking-wider transition-colors"
               >
                 <Trash2 className="w-4 h-4" /> Delete Account
               </button>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
