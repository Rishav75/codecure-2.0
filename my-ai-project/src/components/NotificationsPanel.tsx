import { useState, useEffect } from "react";
import { Bell, X, Calendar, Syringe, Pill, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { db } from "../lib/firebase";
import { collection, query, orderBy, onSnapshot, doc, updateDoc, writeBatch } from "firebase/firestore";
import { useStore } from "../store";

export function NotificationsPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [alerts, setAlerts] = useState<any[]>([]);
  const { user } = useStore();

  useEffect(() => {
    if (!user?.uid) return;

    const q = query(
      collection(db, "users", user.uid, "alerts"),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedAlerts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAlerts(fetchedAlerts);
    });

    return () => unsubscribe();
  }, [user]);

  const unreadCount = alerts.filter(a => !a.read).length;

  const markAsRead = async (id: string) => {
    if (!user?.uid) return;
    await updateDoc(doc(db, "users", user.uid, "alerts", id), {
      read: true
    });
  };

  const markAllAsRead = async () => {
    if (!user?.uid) return;
    const batch = writeBatch(db);
    alerts.filter(a => !a.read).forEach(alert => {
      batch.update(doc(db, "users", user.uid, "alerts", alert.id), { read: true });
    });
    await batch.commit();
  };

  const getIcon = (type: string) => {
    switch(type) {
      case 'appointment': return <Calendar className="w-4 h-4 text-blue-400" />;
      case 'vaccination': return <Syringe className="w-4 h-4 text-purple-400" />;
      case 'medication': return <Pill className="w-4 h-4 text-red-400" />;
      default: return <Bell className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/5"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-2 w-80 bg-[#111] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[32rem]"
            >
              <div className="p-4 border-b border-white/5 flex items-center justify-between bg-black/20 backdrop-blur-md">
                <h3 className="font-bold text-white flex items-center gap-2">
                  Notifications
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 bg-blue-600 rounded-full text-xs">{unreadCount} new</span>
                  )}
                </h3>
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllAsRead}
                    className="text-xs text-blue-400 hover:text-blue-300 font-medium"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              
              <div className="overflow-y-auto flex-1 p-2 space-y-1">
                {alerts.length === 0 ? (
                  <div className="p-8 text-center text-gray-500 text-sm">
                    No notifications yet
                  </div>
                ) : (
                  alerts.map(alert => (
                    <div 
                      key={alert.id}
                      onClick={() => markAsRead(alert.id)}
                      className={`p-3 rounded-xl flex gap-3 cursor-pointer transition-colors ${alert.read ? 'opacity-60 hover:bg-white/5' : 'bg-white/5 hover:bg-white/10'}`}
                    >
                      <div className="mt-1">
                        <div className="p-2 rounded-full bg-black/40 border border-white/5">
                          {getIcon(alert.type)}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={`text-sm font-medium truncate ${alert.read ? 'text-gray-300' : 'text-white'}`}>
                            {alert.title}
                          </p>
                          {!alert.read && <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />}
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">
                          {alert.message}
                        </p>
                        <p className="text-[10px] text-gray-500 mt-2 uppercase tracking-wider">
                          {new Date(alert.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
