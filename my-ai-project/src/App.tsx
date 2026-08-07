/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { initFirebase } from "./lib/firebase";
import { Toaster } from "react-hot-toast";

// Pages
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import AuthPage from "./pages/AuthPage";
import AIHealthAssistant from "./pages/AIHealthAssistant";
import QRProfile from "./pages/QRProfile";
import DoctorDashboard from "./pages/DoctorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import SettingsPage from "./pages/SettingsPage";
import FamilyDashboard from "./pages/FamilyDashboard";
import VoiceAssistant from "./pages/VoiceAssistant";

export default function App() {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    initFirebase().then(() => setInitialized(true));
  }, []);

  if (!initialized) return <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-zinc-200">Loading CodeCure AI...</div>;

  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{ style: { background: '#18181b', color: '#fff', border: '1px solid #3f3f46' } }} />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/family" element={<FamilyDashboard />} />
        <Route path="/ai-assistant" element={<AIHealthAssistant />} />
        <Route path="/voice-assistant" element={<VoiceAssistant />} />
        <Route path="/qr-profile" element={<QRProfile />} />
        <Route path="/doctor" element={<DoctorDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

