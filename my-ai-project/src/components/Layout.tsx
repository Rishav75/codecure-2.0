import { ReactNode, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Activity, LayoutDashboard, MessageSquare, QrCode, Stethoscope, Settings, LogOut, Menu } from "lucide-react";
import { useStore } from "../store";
import { auth } from "../lib/firebase";
import { signOut } from "firebase/auth";
import toast from "react-hot-toast";
import { NotificationsPanel } from "./NotificationsPanel";

export default function Layout({ children }: { children: ReactNode }) {
  const { user, setUser } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState("");

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
      setUser(null);
      navigate("/");
    }
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && search.trim()) {
      toast("Searching...", { icon: '🔍' });
      setSearch("");
    }
  };

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Family", path: "/family", icon: Activity },
    { name: "AI Assistant", path: "/ai-assistant", icon: MessageSquare },
    { name: "Voice AI", path: "/voice-assistant", icon: MessageSquare },
    { name: "QR Profile", path: "/qr-profile", icon: QrCode },
    { name: "Doctor", path: "/doctor", icon: Stethoscope },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen w-full bg-[#050505] text-white font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-black/40 border-r border-white/10 flex flex-col p-6 z-20">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)]">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">CodeCure<span className="text-blue-500">AI</span></h1>
        </div>

        <nav className="space-y-1 flex-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                  isActive ? "bg-white/10 text-blue-400" : "hover:bg-white/5 text-gray-400"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-4 border-t border-white/5">
           <div className="mb-4 p-4 bg-gradient-to-br from-red-900/40 to-transparent border border-red-500/20 rounded-2xl">
             <div className="flex items-center justify-between mb-2">
               <span className="text-xs font-bold text-red-400 uppercase tracking-widest">Emergency SOS</span>
               <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
             </div>
             <button 
               onClick={() => toast.error("EMERGENCY PROTOCOL ACTIVATED. Alerting contacts...")}
               className="w-full py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-bold transition-all shadow-lg text-white"
             >
               ACTIVATE PROTOCOL
             </button>
           </div>

          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-gray-400 hover:text-red-400 transition-colors rounded-xl hover:bg-white/5"
          >
            <LogOut className="w-5 h-5 mr-3" />
            <span className="text-sm font-medium">Log out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="h-20 border-b border-white/10 flex items-center justify-between px-8 bg-black/20 backdrop-blur-md z-10">
          <div className="flex items-center bg-white/5 border border-white/10 px-4 py-2 rounded-full w-96">
            <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            <input 
              type="text" 
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={handleSearch}
              placeholder="Ask CodeCure anything..." 
              className="bg-transparent border-none text-sm focus:outline-none w-full text-white placeholder:text-gray-500" 
            />
          </div>
          <div className="flex items-center gap-4">
            <NotificationsPanel />
            <div className="flex items-center gap-3 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center font-bold text-xs">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span className="text-sm font-medium text-gray-200">{user?.email?.split('@')[0] || 'User'}</span>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeWidth="2"/></svg>
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-8 relative">
           {children}
        </div>
      </main>
    </div>
  );
}
