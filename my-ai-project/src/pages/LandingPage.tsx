import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Activity, ArrowRight, ShieldCheck, HeartPulse, Brain, ChevronRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-blue-500/30 font-sans relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen translate-y-1/2 -translate-x-1/4" />
      
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-black/40 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)]">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold tracking-tight text-xl">CodeCure<span className="text-blue-500">AI</span></span>
          </div>
          <div className="hidden md:flex gap-8 text-sm font-bold uppercase tracking-widest text-gray-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
            <a href="#testimonials" className="hover:text-white transition-colors">Testimonials</a>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/auth" className="text-[10px] font-bold uppercase tracking-widest hover:text-gray-300 transition-colors">Log in</Link>
            <Link to="/auth" className="px-6 py-2.5 bg-white text-black text-xs font-bold uppercase tracking-wider rounded-full hover:bg-gray-200 transition-colors shadow-lg">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-48 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-600/10 border border-blue-600/20 text-blue-400 text-[10px] font-bold uppercase tracking-widest mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          Next Generation Health Intelligence
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          className="text-5xl md:text-7xl font-bold tracking-tighter text-balance max-w-4xl"
        >
          Your personal medical AI, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">reimagined.</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="mt-6 text-lg text-gray-400 max-w-2xl text-balance"
        >
          CodeCure AI integrates advanced Gemini intelligence, medical report OCR, and digital wellbeing tracking into a unified, secure platform for your family.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="mt-12 flex items-center gap-4"
        >
          <Link to="/auth" className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full transition-all shadow-[0_0_40px_rgba(37,99,235,0.4)] flex items-center gap-2 uppercase tracking-wider text-sm">
            Try for free <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>

        {/* Hero Visual */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          className="mt-24 w-full max-w-5xl rounded-[2rem] border border-white/10 bg-black/40 backdrop-blur-2xl overflow-hidden shadow-2xl relative"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 pointer-events-none" />
          <div className="h-12 border-b border-white/10 flex items-center px-6 gap-2 bg-black/60">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <div className="aspect-[16/9] relative bg-black/20 p-8 flex">
            {/* Abstract representation of dashboard */}
            <div className="w-64 border-r border-white/10 pr-8 space-y-4">
              <div className="h-8 rounded-lg bg-white/5 w-full" />
              <div className="h-4 rounded bg-white/5 w-3/4" />
              <div className="h-4 rounded bg-white/5 w-5/6" />
              <div className="h-4 rounded bg-white/5 w-1/2" />
            </div>
            <div className="flex-1 pl-8 space-y-6">
              <div className="flex gap-4">
                <div className="flex-1 h-32 rounded-2xl border border-white/10 bg-white/5 p-4 flex flex-col justify-between">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-600/30" />
                  <div className="h-6 rounded bg-white/10 w-1/2" />
                </div>
                <div className="flex-1 h-32 rounded-2xl border border-white/10 bg-white/5 p-4 flex flex-col justify-between">
                   <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30" />
                   <div className="h-6 rounded bg-white/10 w-1/3" />
                </div>
              </div>
              <div className="h-64 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-4" />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="py-32 px-6 max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-bold tracking-tight">Intelligence at your fingertips</h2>
          <p className="mt-4 text-gray-400">Everything you need to manage your health seamlessly.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: Brain, title: "Gemini Intelligence", desc: "Advanced reasoning for medical reports and lifestyle planning." },
            { icon: HeartPulse, title: "Vital Tracking", desc: "Monitor mood, sleep, and digital wellbeing in real-time." },
            { icon: ShieldCheck, title: "Secure Profiles", desc: "Encrypted QR codes for emergency medical access." },
          ].map((f, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -5 }}
              className="p-8 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-sm"
            >
              <div className="w-14 h-14 rounded-2xl bg-blue-600/20 border border-blue-600/30 flex items-center justify-center mb-8 shadow-[0_0_20px_rgba(37,99,235,0.2)]">
                <f.icon className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <footer className="border-t border-white/10 py-12 px-6 mt-20 relative z-10 bg-black/40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-sm">CodeCure<span className="text-blue-500">AI</span></span>
          </div>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">© 2026 CodeCure AI. Built for the Hackathon.</p>
        </div>
      </footer>
    </div>
  );
}
