import { useState } from "react";
import { motion } from "motion/react";
import Layout from "../components/Layout";
import { QRCodeSVG } from "qrcode.react";
import { Heart, Activity, AlertTriangle, Pill } from "lucide-react";
import { useStore } from "../store";

export default function QRProfile() {
  const { user } = useStore();
  const [profile] = useState({
    name: "Alex Johnson",
    bloodGroup: "O+",
    allergies: ["Penicillin", "Peanuts"],
    medicines: ["Lisinopril 10mg"],
    conditions: ["Hypertension"],
    emergencyContact: "+1 (555) 123-4567"
  });

  const profileDataString = JSON.stringify(profile);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Emergency QR Profile</h2>
          <p className="text-gray-400">Scannable medical profile for first responders and doctors.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* QR Code Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 rounded-[2rem] bg-white/5 border border-white/10 flex flex-col items-center justify-center relative overflow-hidden text-center"
          >
            <div className="absolute top-0 right-0 -mt-16 -mr-16 w-48 h-48 bg-blue-600/20 blur-[60px] rounded-full pointer-events-none mix-blend-screen" />
            
            <div className="bg-white p-4 rounded-3xl shadow-2xl mb-6">
              <QRCodeSVG 
                value={profileDataString}
                size={200}
                bgColor={"#ffffff"}
                fgColor={"#000000"}
                level={"H"}
              />
            </div>
            
            <h3 className="text-xl font-bold text-white uppercase tracking-wider">{profile.name}</h3>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Patient ID: {user?.uid?.substring(0,8).toUpperCase() || 'SCAN-123'}</p>
            
            <button 
              onClick={() => window.print()}
              className="mt-8 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-xs font-bold transition-all shadow-lg uppercase tracking-wider"
            >
              Print Card
            </button>
          </motion.div>

          {/* Profile Details */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0 border border-red-500/20">
                <Heart className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h4 className="text-[10px] text-gray-500 uppercase tracking-widest">Blood Group</h4>
                <p className="text-lg font-bold text-white">{profile.bloodGroup}</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0 border border-amber-500/20">
                <AlertTriangle className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h4 className="text-[10px] text-gray-500 uppercase tracking-widest">Allergies</h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  {profile.allergies.map(a => (
                    <span key={a} className="px-3 py-1 rounded-full bg-white/10 text-xs font-medium">{a}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-600/20 flex items-center justify-center shrink-0 border border-blue-600/30">
                <Pill className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h4 className="text-[10px] text-gray-500 uppercase tracking-widest">Current Medications</h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  {profile.medicines.map(a => (
                    <span key={a} className="px-3 py-1 rounded-full bg-white/10 text-xs font-medium">{a}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0 border border-green-500/20">
                <Activity className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h4 className="text-[10px] text-gray-500 uppercase tracking-widest">Medical Conditions</h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  {profile.conditions.map(a => (
                    <span key={a} className="px-3 py-1 rounded-full bg-white/10 text-xs font-medium">{a}</span>
                  ))}
                </div>
              </div>
            </div>
            
             <div className="p-6 rounded-2xl bg-gradient-to-br from-red-900/40 to-transparent border border-red-500/20 flex flex-col gap-1 relative overflow-hidden">
               <h4 className="text-[10px] font-bold text-red-400 uppercase tracking-widest">Emergency Contact</h4>
               <p className="text-2xl font-bold text-white">{profile.emergencyContact}</p>
             </div>

          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
