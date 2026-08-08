import React, { useState, useEffect } from 'react';
import {
  MOCK_USER_PROFILE,
  MOCK_MEDICATIONS,
  MOCK_COMMUNITY_POSTS,
  MOCK_DOCTORS,
  MOCK_SCANS,
  MOCK_FITNESS_SESSIONS,
  MOCK_MEAL_LOGS,
  MOCK_SLEEP_LOGS,
  MOCK_DIGITAL_WELLBEING,
  MOCK_GAMIFICATION,
  MOCK_MENTAL_LOGS,
  MOCK_WEARABLES,
  MOCK_NOTIFICATIONS,
} from './data/mockData';
import {
  ActiveTab,
  UserProfile,
  Medication,
  CommunityPost,
  Doctor,
  MedicalScanReport,
  FitnessSession,
  MealLog,
  MentalWellnessLog,
  WearableDevice,
  AppNotification,
} from './types';
import { getStorageData, saveStorageData } from './utils/storage';

import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { SosModal } from './components/SosModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import { AuthModal } from './components/AuthModal';
import { SaarthiVoiceAssistant } from './components/SaarthiVoiceAssistant';

import { DashboardView } from './components/views/DashboardView';
import { AiAssistantView } from './components/views/AiAssistantView';
import { SymptomCheckerView } from './components/views/SymptomCheckerView';
import { MedicalReportScannerView } from './components/views/MedicalReportScannerView';
import { MedicineManagerView } from './components/views/MedicineManagerView';
import { DigitalWellbeingView } from './components/views/DigitalWellbeingView';
import { SleepCoachView } from './components/views/SleepCoachView';
import { MentalWellnessView } from './components/views/MentalWellnessView';
import { NutritionAiView } from './components/views/NutritionAiView';
import { FitnessView } from './components/views/FitnessView';
import { WearablesView } from './components/views/WearablesView';
import { DoctorConnectView } from './components/views/DoctorConnectView';
import { CommunityView } from './components/views/CommunityView';
import { GamificationView } from './components/views/GamificationView';
import { ProfileView } from './components/views/ProfileView';
import { AdminDashboardView } from './components/views/AdminDashboardView';
import { EmergencyResponseView } from './components/views/EmergencyResponseView';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sosOpen, setSosOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Persistence State
  const [userProfile, setUserProfile] = useState<UserProfile>(() =>
    getStorageData('userProfile', MOCK_USER_PROFILE)
  );
  const [medications, setMedications] = useState<Medication[]>(() =>
    getStorageData('medications', MOCK_MEDICATIONS)
  );
  const [scans, setScans] = useState<MedicalScanReport[]>(() =>
    getStorageData('scans', MOCK_SCANS)
  );
  const [fitnessSessions, setFitnessSessions] = useState<FitnessSession[]>(() =>
    getStorageData('fitnessSessions', MOCK_FITNESS_SESSIONS)
  );
  const [mealLogs, setMealLogs] = useState<MealLog[]>(() =>
    getStorageData('mealLogs', MOCK_MEAL_LOGS)
  );
  const [mentalLogs, setMentalLogs] = useState<MentalWellnessLog[]>(() =>
    getStorageData('mentalLogs', MOCK_MENTAL_LOGS)
  );
  const [posts, setPosts] = useState<CommunityPost[]>(() =>
    getStorageData('posts', MOCK_COMMUNITY_POSTS)
  );
  const [notifications, setNotifications] = useState<AppNotification[]>(() =>
    getStorageData('notifications', MOCK_NOTIFICATIONS)
  );
  const [wearables, setWearables] = useState<WearableDevice[]>(() =>
    getStorageData('wearables', MOCK_WEARABLES)
  );
  const [gamification, setGamification] = useState(() =>
    getStorageData('gamification', MOCK_GAMIFICATION)
  );
  const [digitalWellbeing, setDigitalWellbeing] = useState(() =>
    getStorageData('digitalWellbeing', MOCK_DIGITAL_WELLBEING)
  );
  const [isDarkMode, setIsDarkMode] = useState(() =>
    getStorageData('isDarkMode', false)
  );

  // Sync state to LocalStorage
  useEffect(() => {
    saveStorageData('userProfile', userProfile);
  }, [userProfile]);

  useEffect(() => {
    saveStorageData('medications', medications);
  }, [medications]);

  useEffect(() => {
    saveStorageData('scans', scans);
  }, [scans]);

  useEffect(() => {
    saveStorageData('fitnessSessions', fitnessSessions);
  }, [fitnessSessions]);

  useEffect(() => {
    saveStorageData('mealLogs', mealLogs);
  }, [mealLogs]);

  useEffect(() => {
    saveStorageData('mentalLogs', mentalLogs);
  }, [mentalLogs]);

  useEffect(() => {
    saveStorageData('posts', posts);
  }, [posts]);

  useEffect(() => {
    saveStorageData('notifications', notifications);
  }, [notifications]);

  useEffect(() => {
    saveStorageData('wearables', wearables);
  }, [wearables]);

  useEffect(() => {
    saveStorageData('gamification', gamification);
  }, [gamification]);

  useEffect(() => {
    saveStorageData('digitalWellbeing', digitalWellbeing);
  }, [digitalWellbeing]);

  useEffect(() => {
    saveStorageData('isDarkMode', isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Handlers
  const handleToggleMedication = (id: string) => {
    setMedications((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              takenToday: !m.takenToday,
              pillsRemaining: !m.takenToday ? m.pillsRemaining - 1 : m.pillsRemaining + 1,
            }
          : m
      )
    );
  };

  const handleAddMedication = (newMed: Medication) => {
    setMedications((prev) => [newMed, ...prev]);
  };

  const handleDeleteMedication = (id: string) => {
    setMedications((prev) => prev.filter((m) => m.id !== id));
  };

  const handleAddScan = (report: MedicalScanReport) => {
    setScans((prev) => [report, ...prev]);
  };

  const handleToggleFitness = (id: string) => {
    setFitnessSessions((prev) =>
      prev.map((f) => (f.id === id ? { ...f, completed: !f.completed } : f))
    );
  };

  const handleAddFitness = (session: FitnessSession) => {
    setFitnessSessions((prev) => [session, ...prev]);
  };

  const handleAddMealLog = (meal: MealLog) => {
    setMealLogs((prev) => [meal, ...prev]);
  };

  const handleAddMentalLog = (log: MentalWellnessLog) => {
    setMentalLogs((prev) => [log, ...prev]);
  };

  const handleAddPost = (post: CommunityPost) => {
    setPosts((prev) => [post, ...prev]);
  };

  const handleUpvotePost = (id: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, upvotes: p.upvotes + 1 } : p))
    );
  };

  const handleToggleWearableConnect = (id: string) => {
    setWearables((prev) =>
      prev.map((w) => (w.id === id ? { ...w, connected: !w.connected } : w))
    );
  };

  const handleToggleBlocker = () => {
    setDigitalWellbeing((prev) => ({
      ...prev,
      activeBlocker: !prev.activeBlocker,
    }));
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-50 flex flex-col font-sans relative overflow-hidden transition-colors">
      {/* Frosted Glass Ambient Blur Background Orbs */}
      <div className="fixed top-[-200px] left-[-200px] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="fixed bottom-[-100px] right-[-100px] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none z-0"></div>
      <div className="fixed top-[10%] right-[10%] w-[300px] h-[300px] bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none z-0"></div>

      {/* Top Header */}
      <div className="relative z-10">
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          notifications={notifications}
          onOpenNotifications={() => setNotificationOpen(true)}
          onOpenSos={() => setSosOpen(true)}
          onOpenAuth={() => setAuthModalOpen(true)}
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
          userProfile={userProfile}
          setSidebarOpen={setSidebarOpen}
        />
      </div>

      <div className="flex flex-1 overflow-hidden relative z-10">
        {/* Sidebar Navigation */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
          streakDays={gamification.streakDays}
          healthTokens={gamification.healthTokens}
        />

        {/* Main Workspace Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar">
          {activeTab === 'dashboard' && (
            <DashboardView
              userProfile={userProfile}
              medications={medications}
              onNavigate={setActiveTab}
              onToggleMedication={handleToggleMedication}
              healthTokens={gamification.healthTokens}
              streakDays={gamification.streakDays}
            />
          )}

          {activeTab === 'ai-assistant' && <AiAssistantView />}

          {activeTab === 'symptom-checker' && (
            <SymptomCheckerView userProfile={userProfile} />
          )}

          {activeTab === 'report-scanner' && (
            <MedicalReportScannerView scans={scans} onAddScan={handleAddScan} />
          )}

          {activeTab === 'medicine-manager' && (
            <MedicineManagerView
              medications={medications}
              onToggleTaken={handleToggleMedication}
              onAddMedication={handleAddMedication}
              onDeleteMedication={handleDeleteMedication}
            />
          )}

          {activeTab === 'digital-wellbeing' && (
            <DigitalWellbeingView
              stats={digitalWellbeing}
              onToggleBlocker={handleToggleBlocker}
            />
          )}

          {activeTab === 'sleep-coach' && (
            <SleepCoachView sleepLogs={MOCK_SLEEP_LOGS} />
          )}

          {activeTab === 'mental-wellness' && (
            <MentalWellnessView
              mentalLogs={mentalLogs}
              onAddMentalLog={handleAddMentalLog}
            />
          )}

          {activeTab === 'nutrition-ai' && (
            <NutritionAiView mealLogs={mealLogs} onAddMealLog={handleAddMealLog} />
          )}

          {activeTab === 'fitness' && (
            <FitnessView
              fitnessSessions={fitnessSessions}
              onToggleFitness={handleToggleFitness}
              onAddFitness={handleAddFitness}
            />
          )}

          {activeTab === 'wearables' && (
            <WearablesView
              wearables={wearables}
              onToggleConnect={handleToggleWearableConnect}
            />
          )}

          {activeTab === 'doctor-connect' && (
            <DoctorConnectView
              doctors={MOCK_DOCTORS}
              onBookAppointment={(docId, date, time) => {
                console.log('Booked doctor', docId, date, time);
              }}
            />
          )}

          {activeTab === 'community' && (
            <CommunityView
              posts={posts}
              onAddPost={handleAddPost}
              onUpvotePost={handleUpvotePost}
            />
          )}

          {activeTab === 'gamification' && (
            <GamificationView stats={gamification} />
          )}

          {activeTab === 'profile' && (
            <ProfileView
              userProfile={userProfile}
              onUpdateProfile={setUserProfile}
              isDarkMode={isDarkMode}
              onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
            />
          )}

          {(activeTab === 'emergency-response' || activeTab === 'emergency') && (
            <EmergencyResponseView userProfile={userProfile} />
          )}

          {activeTab === 'admin' && <AdminDashboardView />}
        </main>
      </div>

      {/* Saarthi AI Voice Assistant (Accessible throughout all tabs) */}
      <SaarthiVoiceAssistant
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userProfile={userProfile}
        pendingMedsCount={medications.filter((m) => !m.takenToday).length}
      />

      {/* Authentication Passport with Country Selection */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={(data) => {
          setUserProfile((prev) => ({
            ...prev,
            name: data.name,
            email: data.email,
          }));
        }}
      />

      {/* Emergency SOS Modal */}
      <SosModal
        isOpen={sosOpen}
        onClose={() => setSosOpen(false)}
        userProfile={userProfile}
      />

      {/* Notification Drawer */}
      <NotificationDrawer
        isOpen={notificationOpen}
        onClose={() => setNotificationOpen(false)}
        notifications={notifications}
        onMarkAllRead={handleMarkAllNotificationsRead}
      />
    </div>
  );
}
