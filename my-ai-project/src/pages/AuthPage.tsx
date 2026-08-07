import { useState } from "react";
import { motion } from "motion/react";
import { Activity, Mail, Lock, AlertCircle } from "lucide-react";
import { auth, googleProvider } from "../lib/firebase";
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useStore();

  const handleGoogle = async () => {
    try {
      setLoading(true);
      const res = await signInWithPopup(auth, googleProvider);
      setUser(res.user);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      let res;
      if (isLogin) {
        res = await signInWithEmailAndPassword(auth, email, password);
      } else {
        res = await createUserWithEmailAndPassword(auth, email, password);
      }
      setUser(res.user);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] px-4 relative overflow-hidden font-sans">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md p-10 rounded-[2.5rem] bg-black/40 border border-white/10 backdrop-blur-2xl shadow-2xl relative z-10"
      >
        <div className="flex justify-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-blue-600/20 border border-blue-600/30 flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.2)]">
            <Activity className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        
        <h2 className="text-3xl font-bold text-center text-white mb-2 tracking-tight">
          {isLogin ? "Welcome back" : "Create account"}
        </h2>
        <p className="text-gray-400 text-center text-sm mb-10">
          Enter your details to access CodeCure AI
        </p>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        <button 
          onClick={handleGoogle}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-full bg-white text-black font-bold hover:bg-gray-200 transition-colors mb-6 disabled:opacity-50 shadow-lg"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">OR</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        <form onSubmit={handleEmail} className="space-y-4">
          <div>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input 
                type="email"
                placeholder="Email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full bg-black/40 border border-white/10 rounded-full px-12 py-3.5 text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all text-sm"
              />
            </div>
          </div>
          <div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input 
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full bg-black/40 border border-white/10 rounded-full px-12 py-3.5 text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all text-sm"
              />
            </div>
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3.5 rounded-full bg-blue-600 text-white font-bold tracking-wide hover:bg-blue-700 transition-colors disabled:opacity-50 mt-4 shadow-[0_0_20px_rgba(37,99,235,0.4)]"
          >
            {isLogin ? "Sign in" : "Sign up"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-400">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => setIsLogin(!isLogin)} className="text-blue-400 hover:text-blue-300 font-bold transition-colors">
            {isLogin ? "Sign up" : "Sign in"}
          </button>
        </p>
      </motion.div>
    </div>
  );
}
