import { useState } from "react";
import { motion } from "motion/react";
import Layout from "../components/Layout";
import { Users, FileText, CheckCircle2, Clock, Search, ScanLine, X } from "lucide-react";
import { QRScanner } from "../components/QRScanner";
import toast from "react-hot-toast";

export default function DoctorDashboard() {
  const [activeTab, setActiveTab] = useState<'patients' | 'triage' | 'scan'>('patients');
  const [scannedData, setScannedData] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const patients = [
    { id: "P-1029", name: "Alex Johnson", age: 34, lastVisit: "2 days ago", status: "Stable", condition: "Routine checkup" },
    { id: "P-1030", name: "Sarah Miller", age: 28, lastVisit: "1 week ago", status: "Review Needed", condition: "Abnormal lab results" },
    { id: "P-1031", name: "Michael Chang", age: 45, lastVisit: "Today", status: "Critical", condition: "Severe chest pain" },
    { id: "P-1032", name: "Emily Davis", age: 62, lastVisit: "3 days ago", status: "High Risk", condition: "Hypertension crisis" },
  ];

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const triagePatients = [...patients].sort((a, b) => {
    const riskScore = (status: string) => {
      if (status === 'Critical') return 3;
      if (status === 'High Risk') return 2;
      if (status === 'Review Needed') return 1;
      return 0;
    };
    return riskScore(b.status) - riskScore(a.status);
  }).filter(p => p.status !== 'Stable');

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold mb-2">Doctor Portal</h2>
            <p className="text-gray-400">Manage patients and scan emergency QR profiles.</p>
          </div>
          <div className="flex bg-black/40 p-1 rounded-2xl border border-white/10 w-fit">
            <button 
              onClick={() => setActiveTab('patients')}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'patients' ? 'bg-white/10 text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
            >
              Patient List
            </button>
            <button 
              onClick={() => setActiveTab('triage')}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'triage' ? 'bg-red-500/20 text-red-400 shadow-sm border border-red-500/30' : 'text-gray-400 hover:text-red-400'}`}
            >
              Triage View
            </button>
            <button 
              onClick={() => setActiveTab('scan')}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'scan' ? 'bg-white/10 text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
            >
              Scan QR Code
            </button>
          </div>
        </div>

        {activeTab === 'patients' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: "Total Patients", value: "1,248", icon: Users, color: "text-blue-400" },
                { label: "Reports to Review", value: "12", icon: FileText, color: "text-amber-400" },
                { label: "Appointments Today", value: "8", icon: Clock, color: "text-emerald-400" },
              ].map((stat, i) => (
                <div key={i} className="p-6 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl bg-black/40 flex items-center justify-center border border-white/5 ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden">
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <h3 className="font-semibold">Recent Patients</h3>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input 
                    type="text" 
                    placeholder="Search patients..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-black/40 border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-blue-500/50 text-white" 
                  />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-black/20 text-gray-400 text-xs uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4 font-medium">Patient ID</th>
                      <th className="px-6 py-4 font-medium">Name</th>
                      <th className="px-6 py-4 font-medium">Age</th>
                      <th className="px-6 py-4 font-medium">Last Visit</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                      <th className="px-6 py-4 font-medium text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredPatients.map(p => (
                      <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4 font-mono text-gray-400">{p.id}</td>
                        <td className="px-6 py-4 font-medium">{p.name}</td>
                        <td className="px-6 py-4 text-gray-400">{p.age}</td>
                        <td className="px-6 py-4 text-gray-400">{p.lastVisit}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            p.status === 'Stable' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                            p.status === 'Critical' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 
                            'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => {
                              // Mock loading profile data
                              setScannedData({
                                name: p.name,
                                bloodGroup: "O+",
                                emergencyContact: "+1 (555) 123-4567",
                                conditions: ["Asthma", "Hypertension"],
                                allergies: ["Penicillin", "Peanuts"],
                                medicines: ["Albuterol", "Lisinopril"]
                              });
                              setActiveTab('scan');
                            }}
                            className="text-blue-400 hover:text-blue-300 font-bold text-xs uppercase tracking-wide"
                          >
                            View Profile
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'triage' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white">Emergency Triage</h3>
              <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-bold border border-red-500/30">
                {triagePatients.length} Patients in Queue
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {triagePatients.map(p => (
                <div key={p.id} className="p-6 rounded-[2rem] bg-white/5 border border-white/10 relative overflow-hidden group hover:border-white/20 transition-all">
                  <div className={`absolute top-0 left-0 w-1 h-full ${
                    p.status === 'Critical' ? 'bg-red-500' : 
                    p.status === 'High Risk' ? 'bg-orange-500' : 'bg-amber-500'
                  }`} />
                  
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-bold text-lg">{p.name}</h4>
                      <p className="text-xs text-gray-400 font-mono">{p.id} • {p.age} yrs</p>
                    </div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      p.status === 'Critical' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 
                      p.status === 'High Risk' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' : 
                      'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {p.status}
                    </span>
                  </div>
                  
                  <div className="p-4 rounded-xl bg-black/40 border border-white/5 mb-6">
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Primary Condition</p>
                    <p className="font-medium text-white">{p.condition}</p>
                  </div>
                  
                  <div className="flex gap-3">
                    <button 
                      onClick={() => {
                        setScannedData({
                          name: p.name,
                          bloodGroup: "O+",
                          emergencyContact: "+1 (555) 123-4567",
                          conditions: [p.condition],
                          allergies: ["None"],
                          medicines: []
                        });
                        setActiveTab('scan');
                      }}
                      className="flex-1 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-bold transition-all text-center"
                    >
                      View Profile
                    </button>
                    <button 
                      onClick={() => toast.success(`Calling code team for ${p.name}`)}
                      className="flex-1 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-xl text-sm font-bold transition-all text-center"
                    >
                      Emergency
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'scan' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-10">
            {!scannedData ? (
              <div className="w-full max-w-md">
                <h3 className="mb-8 text-xl font-medium text-center">Scan Patient QR</h3>
                <QRScanner onScan={(data) => {
                  try {
                    const parsed = JSON.parse(data);
                    setScannedData(parsed);
                  } catch(e) {
                    console.error("Invalid QR code data");
                  }
                }} />
                <p className="text-gray-400 mt-8 text-center text-sm">Hold the patient's Emergency QR code within the frame to instantly load their medical profile.</p>
              </div>
            ) : (
              <div className="w-full max-w-2xl bg-white/5 border border-white/10 rounded-[2rem] p-8 relative">
                <button onClick={() => setScannedData(null)} className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
                  <X className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 rounded-full bg-blue-600/20 flex items-center justify-center border border-blue-600/30 text-blue-400 text-2xl font-bold">
                    {scannedData.name?.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold">{scannedData.name}</h3>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Emergency Profile</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Blood Group</p>
                    <p className="font-bold text-lg text-red-400">{scannedData.bloodGroup || 'N/A'}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Emergency Contact</p>
                    <p className="font-bold text-lg">{scannedData.emergencyContact || 'N/A'}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-black/40 border border-white/5 md:col-span-2">
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">Conditions</p>
                    <div className="flex flex-wrap gap-2">
                      {scannedData.conditions?.map((c: string) => <span key={c} className="px-3 py-1 bg-white/10 rounded-full text-xs font-medium">{c}</span>) || 'None'}
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-black/40 border border-white/5 md:col-span-2">
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">Allergies</p>
                    <div className="flex flex-wrap gap-2">
                      {scannedData.allergies?.map((c: string) => <span key={c} className="px-3 py-1 bg-amber-500/10 text-amber-400 rounded-full text-xs font-medium">{c}</span>) || 'None'}
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-black/40 border border-white/5 md:col-span-2">
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">Current Medications</p>
                    <div className="flex flex-wrap gap-2">
                      {scannedData.medicines?.map((c: string) => <span key={c} className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-xs font-medium">{c}</span>) || 'None'}
                    </div>
                  </div>
                  
                  <div className="md:col-span-2 mt-4 pt-6 border-t border-white/10 flex gap-4">
                    <button 
                      onClick={() => toast.success("Prescription interface opened")}
                      className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-all shadow-lg flex items-center justify-center gap-2"
                    >
                      <FileText className="w-4 h-4" /> Prescribe Medicine
                    </button>
                    <button 
                      onClick={() => toast.success("Added new medical note")}
                      className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-bold transition-all shadow-lg flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Add Clinical Note
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </Layout>
  );
}
