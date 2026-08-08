import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Bot,
  X,
  Sparkles,
  Send,
  Languages,
  Compass,
  Siren,
  Activity,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { ActiveTab, UserProfile, CompositeHealthScores } from '../types';

interface SaarthiVoiceAssistantProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  userProfile: UserProfile;
  healthScores?: CompositeHealthScores;
  pendingMedsCount?: number;
}

const SUPPORTED_LANGUAGES = [
  { code: 'en-US', label: 'English', native: 'English' },
  { code: 'hi-IN', label: 'Hindi', native: 'हिंदी' },
  { code: 'es-ES', label: 'Spanish', native: 'Español' },
  { code: 'fr-FR', label: 'French', native: 'Français' },
  { code: 'de-DE', label: 'German', native: 'Deutsch' },
  { code: 'zh-CN', label: 'Mandarin', native: '中文' },
  { code: 'ar-SA', label: 'Arabic', native: 'العربية' },
  { code: 'ja-JP', label: 'Japanese', native: '日本語' },
];

export const SaarthiVoiceAssistant: React.FC<SaarthiVoiceAssistantProps> = ({
  activeTab,
  setActiveTab,
  userProfile,
  healthScores,
  pendingMedsCount = 0,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedLang, setSelectedLang] = useState('en-US');
  const [inputQuery, setInputQuery] = useState('');
  const [transcript, setTranscript] = useState('');
  const [responseMessage, setResponseMessage] = useState(
    `Hello ${userProfile.name}! I am Saarthi, your AI Health Voice Assistant. How can I assist you today?`
  );
  const [chatHistory, setChatHistory] = useState<
    { sender: 'user' | 'saarthi'; text: string; time: string }[]
  >([
    {
      sender: 'saarthi',
      text: `Hello ${userProfile.name}! I am Saarthi, your AI Voice Assistant. You can speak or type to navigate features, check your health score, review pending medications, or ask clinical questions in your preferred language.`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const recognitionRef = useRef<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, responseMessage]);

  useEffect(() => {
    // Check Speech Recognition capability
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = selectedLang;

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
        if (event.results[0].isFinal) {
          handleUserUtterance(currentTranscript);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Saarthi Speech Recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [selectedLang]);

  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = selectedLang;
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        stopSpeaking();
        setTranscript('');
        try {
          recognitionRef.current.lang = selectedLang;
          recognitionRef.current.start();
          setIsListening(true);
        } catch (e) {
          console.warn('Recognition start issue:', e);
        }
      } else {
        alert('Voice recognition is not directly supported on this browser version, but you can type your questions to Saarthi below!');
      }
    }
  };

  const handleUserUtterance = async (text: string) => {
    const cleanText = text.trim();
    if (!cleanText) return;

    const userMsg = {
      sender: 'user' as const,
      text: cleanText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatHistory((prev) => [...prev, userMsg]);
    setInputQuery('');
    setTranscript('');

    // Check for quick intent commands
    const lower = cleanText.toLowerCase();

    let reply = '';

    if (lower.includes('emergency') || lower.includes('sos') || lower.includes('incident')) {
      setActiveTab('emergency-response');
      reply = 'Navigating to the Emergency Incident Response Center now. Critical workflows and incident checklists are available.';
    } else if (lower.includes('health score') || lower.includes('overall score')) {
      setActiveTab('dashboard');
      reply = `Your overall health score is currently ${healthScores?.overallHealthScore ?? 92} out of 100, which is in the optimal baseline percentile.`;
    } else if (lower.includes('medicine') || lower.includes('medication') || lower.includes('pill')) {
      setActiveTab('medicine-manager');
      reply = `Navigating to Medicine Manager. You currently have ${pendingMedsCount} pending dose reminders today.`;
    } else if (lower.includes('symptom') || lower.includes('check symptom')) {
      setActiveTab('symptom-checker');
      reply = 'Opening the AI Symptom Checker for clinical triage and risk analysis.';
    } else if (lower.includes('report') || lower.includes('scan') || lower.includes('ocr')) {
      setActiveTab('medical-scanner');
      reply = 'Opening the Medical Report OCR Scanner. You can upload lab results or medical images.';
    } else if (lower.includes('doctor') || lower.includes('appointment')) {
      setActiveTab('doctor-connect');
      reply = 'Navigating to Doctor Connect for telemedicine and appointments.';
    } else if (lower.includes('profile') || lower.includes('medical id')) {
      setActiveTab('profile');
      reply = `Opening medical profile for ${userProfile.name}. Emergency contacts and insurance info are displayed.`;
    } else if (lower.includes('risk') || lower.includes('disease')) {
      setActiveTab('risk-prediction');
      reply = 'Opening the AI Disease Risk Prediction Engine.';
    } else {
      // Process with Gemini AI or intelligent fallback
      try {
        const promptText = `You are Saarthi, an empathetic AI Voice Assistant for CodeCure AI app. User name: ${userProfile.name}. Health score: ${healthScores?.overallHealthScore ?? 92}. Query in ${selectedLang}: "${cleanText}". Give a concise, helpful 2-sentence response without formatting symbols.`;
        const res = await fetch('/api/gemini/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: promptText }),
        });
        if (res.ok) {
          const data = await res.json();
          reply = data.reply || 'I am here to guide you with your health telemetry and CodeCure AI navigation.';
        } else {
          reply = `As Saarthi, your AI assistant, I can help you monitor your biometrics, track medications, or navigate CodeCure AI tools. Let me know what you need!`;
        }
      } catch (err) {
        reply = `I am here to assist you, ${userProfile.name}. You can ask me to open any CodeCure module or query your biometrics.`;
      }
    }

    setResponseMessage(reply);
    setChatHistory((prev) => [
      ...prev,
      {
        sender: 'saarthi',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);

    speakText(reply);
  };

  return (
    <>
      {/* Floating Widget Toggle Trigger */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 text-white shadow-2xl shadow-blue-500/40 border border-blue-400/40 hover:scale-105 active:scale-95 transition-all group"
          aria-label="Open Saarthi AI Voice Assistant"
        >
          <div className="relative">
            <Bot className="w-6 h-6 text-white group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full" />
          </div>
          <div className="text-left font-bold text-xs tracking-wide pr-1">
            <div className="text-[10px] text-cyan-200 uppercase font-semibold">AI Assistant</div>
            <div className="text-xs font-black">Saarthi Voice</div>
          </div>
        </button>
      )}

      {/* Main Saarthi Voice Assistant Interface */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Saarthi AI Voice Assistant"
          className={`fixed z-50 transition-all duration-300 ${
            isMinimized
              ? 'bottom-6 right-6 w-80 bg-slate-900/95 backdrop-blur-2xl border border-blue-500/30 rounded-3xl p-4 shadow-2xl text-slate-100'
              : 'bottom-6 right-6 w-96 max-w-[calc(100vw-2rem)] h-[520px] bg-slate-900/95 backdrop-blur-2xl border border-blue-500/30 rounded-3xl p-5 shadow-2xl text-slate-100 flex flex-col'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 text-white shadow-md shadow-blue-500/30">
                <Bot className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-sm tracking-tight text-white">SAARTHI</span>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    Voice AI
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">Multilingual Health Companion</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                aria-label={isMinimized ? 'Expand' : 'Minimize'}
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => {
                  stopSpeaking();
                  setIsOpen(false);
                }}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close Assistant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Minimized View */}
          {isMinimized ? (
            <div className="pt-3 space-y-3">
              <div className="text-xs text-slate-300 line-clamp-2 italic font-medium">
                "{responseMessage}"
              </div>
              <div className="flex gap-2">
                <button
                  onClick={toggleListening}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    isListening
                      ? 'bg-rose-500 text-white animate-pulse'
                      : 'bg-blue-600 hover:bg-blue-500 text-white'
                  }`}
                >
                  <Mic className="w-4 h-4" /> {isListening ? 'Listening...' : 'Speak to Saarthi'}
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Language Selector Bar */}
              <div className="py-2.5 flex items-center justify-between gap-2 border-b border-white/5 shrink-0 text-xs">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Languages className="w-3.5 h-3.5 text-blue-400" />
                  <span className="text-[11px]">Language:</span>
                </div>
                <select
                  value={selectedLang}
                  onChange={(e) => setSelectedLang(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-xl px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-blue-500/50"
                  aria-label="Select Language for Saarthi Voice Assistant"
                >
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code} className="bg-slate-900 text-slate-100">
                      {lang.native} ({lang.label})
                    </option>
                  ))}
                </select>
              </div>

              {/* Chat Message Scroll Area */}
              <div className="flex-1 overflow-y-auto py-3 space-y-3 pr-1 custom-scrollbar">
                {chatHistory.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex flex-col ${
                      msg.sender === 'user' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div
                      className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-blue-600 text-white rounded-br-none'
                          : 'bg-white/10 text-slate-100 border border-white/10 rounded-bl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[9px] text-slate-500 mt-1 px-1">{msg.time}</span>
                  </div>
                ))}

                {isListening && transcript && (
                  <div className="p-2.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs italic">
                    Listening: "{transcript}..."
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Voice Orb & Controls */}
              <div className="pt-2 border-t border-white/10 space-y-2 shrink-0">
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleListening}
                    className={`p-3 rounded-2xl flex items-center justify-center transition-all ${
                      isListening
                        ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30 animate-pulse scale-105'
                        : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                    }`}
                    aria-label={isListening ? 'Stop Listening' : 'Start Listening'}
                    title="Voice Input"
                  >
                    {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </button>

                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Type query or command for Saarthi..."
                      value={inputQuery}
                      onChange={(e) => setInputQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleUserUtterance(inputQuery);
                      }}
                      className="w-full pl-3 pr-9 py-2.5 text-xs rounded-2xl bg-white/5 border border-white/10 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500/50"
                    />
                    <button
                      onClick={() => handleUserUtterance(inputQuery)}
                      disabled={!inputQuery.trim()}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-xl text-blue-400 hover:text-white disabled:opacity-30 transition-colors"
                      aria-label="Send Query"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {isSpeaking && (
                    <button
                      onClick={stopSpeaking}
                      className="p-2.5 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-300 hover:bg-amber-500/30 transition-colors"
                      aria-label="Stop Speaking"
                      title="Mute Speech"
                    >
                      <VolumeX className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Quick Voice Navigation Shortcuts */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[10px] text-slate-400 custom-scrollbar">
                  <span className="font-semibold text-slate-500 shrink-0">Try:</span>
                  <button
                    onClick={() => handleUserUtterance('Open Emergency Response')}
                    className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 hover:text-blue-300 shrink-0"
                  >
                    "Emergency Response"
                  </button>
                  <button
                    onClick={() => handleUserUtterance('What is my health score?')}
                    className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 hover:text-blue-300 shrink-0"
                  >
                    "Health Score?"
                  </button>
                  <button
                    onClick={() => handleUserUtterance('Check my medicines')}
                    className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 hover:text-blue-300 shrink-0"
                  >
                    "Pending Medicines"
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};
