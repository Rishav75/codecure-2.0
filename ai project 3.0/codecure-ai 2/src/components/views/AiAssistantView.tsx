import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Mic,
  Image as ImageIcon,
  Volume2,
  Sparkles,
  Search,
  RefreshCw,
  User,
  Paperclip,
  X,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { ChatMessage } from '../../types';

export const AiAssistantView: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      role: 'assistant',
      content: `Hello! I am **CODECURE AI**, your clinical AI Health Companion. 
      
How can I assist your health and wellbeing today?
- **Medical Query**: Ask about symptoms, lab values, or medications.
- **Image Analysis**: Upload lab results, prescriptions, or skin conditions.
- **Lifestyle & Education**: Ask about nutrition, sleep architecture, or workout recovery.

*Disclaimer: Information provided is for educational reference, not clinical diagnosis.*`,
      timestamp: 'Just now',
    },
  ]);

  const [input, setInput] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [useSearch, setUseSearch] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isPlayingAudioId, setIsPlayingAudioId] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || input;
    if (!textToSend.trim() && !imagePreview) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      imageUrl: imagePreview || undefined,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setImagePreview(null);
    setLoading(true);

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          image: imagePreview,
          useSearch,
          history: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await res.json();

      const assistantMsg: ChatMessage = {
        id: `ast-${Date.now()}`,
        role: 'assistant',
        content: data.reply || 'I processed your query. Please consult a medical provider for official advice.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: data.sources || [],
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Error sending message:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: 'Unable to connect to CODECURE AI Server. Please ensure your connection is active.',
          timestamp: 'Just now',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleTextToSpeech = async (msgId: string, text: string) => {
    if (isPlayingAudioId === msgId) {
      setIsPlayingAudioId(null);
      return;
    }

    try {
      setIsPlayingAudioId(msgId);
      const res = await fetch('/api/speech/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.slice(0, 300) }),
      });
      const data = await res.json();
      if (data.audio) {
        const audio = new Audio(`data:audio/mp3;base64,${data.audio}`);
        audio.play();
        audio.onended = () => setIsPlayingAudioId(null);
      } else {
        // Fallback to Web Speech API
        const utterance = new SpeechSynthesisUtterance(text.slice(0, 200));
        window.speechSynthesis.speak(utterance);
        utterance.onend = () => setIsPlayingAudioId(null);
      }
    } catch {
      const utterance = new SpeechSynthesisUtterance(text.slice(0, 200));
      window.speechSynthesis.speak(utterance);
      utterance.onend = () => setIsPlayingAudioId(null);
    }
  };

  const toggleMic = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser mode.');
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      return;
    }

    setIsRecording(true);
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsRecording(false);
    };

    recognition.onerror = () => setIsRecording(false);
    recognition.onend = () => setIsRecording(false);
    recognition.start();
  };

  const suggestions = [
    'Explain my blood test HDL vs LDL cholesterol ratio',
    'What are side effects and interactions of Atorvastatin?',
    'Provide a 7-day anti-inflammatory nutrition plan',
    'How do I calculate and reduce my sleep debt?',
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-6.5rem)] rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl overflow-hidden animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-2xl bg-gradient-to-tr from-teal-500 to-cyan-500 text-white shadow-md">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                CODECURE AI Clinical Health Assistant
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300">
                Gemini 3.6 Flash
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Conversational Medical AI & Web Grounding Engine
            </p>
          </div>
        </div>

        {/* Toggle Google Search Grounding */}
        <button
          onClick={() => setUseSearch(!useSearch)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
            useSearch
              ? 'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
          }`}
        >
          <Search className="w-3.5 h-3.5" />
          <span>Web Grounding {useSearch ? 'ON' : 'OFF'}</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 custom-scrollbar">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 max-w-3xl ${
              msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-white font-bold text-xs ${
                msg.role === 'user'
                  ? 'bg-slate-800 dark:bg-slate-700'
                  : 'bg-gradient-to-tr from-teal-500 to-emerald-500'
              }`}
            >
              {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            {/* Bubble */}
            <div className="space-y-2 max-w-[85%]">
              <div
                className={`p-4 rounded-3xl text-xs leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-tr-none'
                    : 'bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 border border-slate-200/60 dark:border-slate-700/60 rounded-tl-none'
                }`}
              >
                {msg.imageUrl && (
                  <img
                    src={msg.imageUrl}
                    alt="User Attachment"
                    className="max-h-48 rounded-xl mb-3 border border-white/20 object-cover"
                  />
                )}
                <div className="whitespace-pre-wrap">{msg.content}</div>
              </div>

              {/* Grounding Sources */}
              {msg.sources && msg.sources.length > 0 && (
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 space-y-1.5">
                  <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                    <Search className="w-3 h-3 text-teal-500" /> Web Grounding Sources
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {msg.sources.map((src, idx) => (
                      <a
                        key={idx}
                        href={src.uri}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-600 dark:text-teal-400 hover:underline bg-white dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700"
                      >
                        {src.title} <ExternalLink className="w-3 h-3" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Message Controls */}
              {msg.role === 'assistant' && (
                <div className="flex items-center gap-3 text-[11px] text-slate-400 px-1">
                  <span>{msg.timestamp}</span>
                  <button
                    onClick={() => handleTextToSpeech(msg.id, msg.content)}
                    className="hover:text-teal-500 flex items-center gap-1 font-semibold transition-colors"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    {isPlayingAudioId === msg.id ? 'Speaking...' : 'Listen Audio'}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-3 max-w-md">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-500 text-white flex items-center justify-center">
              <Bot className="w-4 h-4 animate-bounce" />
            </div>
            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-500 flex items-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-teal-500" />
              <span>Analyzing clinical literature and user history...</span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Suggested Follow-Ups */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/30 dark:bg-slate-900/30 flex gap-2 overflow-x-auto custom-scrollbar shrink-0">
        {suggestions.map((sug, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(sug)}
            className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs whitespace-nowrap hover:border-teal-500/50 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
          >
            {sug}
          </button>
        ))}
      </div>

      {/* Input Dock */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
        {imagePreview && (
          <div className="relative inline-block">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-16 h-16 rounded-xl object-cover border border-teal-500"
            />
            <button
              onClick={() => setImagePreview(null)}
              className="absolute -top-2 -right-2 p-1 rounded-full bg-rose-500 text-white hover:bg-rose-600"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageSelect}
            accept="image/*"
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            title="Attach Medical Image or Document"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          <button
            onClick={toggleMic}
            className={`p-2.5 rounded-2xl transition-colors ${
              isRecording
                ? 'bg-rose-500 text-white animate-pulse'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
            title="Voice Input"
          >
            <Mic className="w-4 h-4" />
          </button>

          <input
            type="text"
            placeholder="Ask CODECURE AI about your health, symptoms, lab values..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
          />

          <button
            onClick={() => handleSendMessage()}
            disabled={loading || (!input.trim() && !imagePreview)}
            className="p-2.5 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 text-white disabled:opacity-50 hover:brightness-110 transition-all shadow-md shadow-emerald-500/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
