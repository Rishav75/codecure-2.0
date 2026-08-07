import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Layout from "../components/Layout";
import { Mic, Square, Loader2, Volume2, Settings2 } from "lucide-react";
import toast from "react-hot-toast";

export default function VoiceAssistant() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [messages, setMessages] = useState<{role: string, content: string}[]>([]);
  const [status, setStatus] = useState<"idle" | "listening" | "processing" | "speaking">("idle");
  const recognitionRef = useRef<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, transcript]);

  useEffect(() => {
    // Initialize Web Speech API
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = true;

        recognitionRef.current.onresult = (event: any) => {
          let interimTranscript = "";
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              setTranscript(prev => prev + event.results[i][0].transcript);
              handleProcessAudio(event.results[i][0].transcript);
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }
          if (interimTranscript) {
            setTranscript(interimTranscript);
          }
        };

        recognitionRef.current.onstart = () => {
          setStatus("listening");
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          if (event.error === 'not-allowed') {
            alert("Microphone access was denied. Please grant permission in your browser settings or click the microphone icon in the URL bar.");
          } else if (event.error === 'no-speech') {
            toast.error("No speech detected. Please try again.");
          }
          setStatus("idle");
          setIsListening(false);
        };
        
        recognitionRef.current.onend = () => {
          setIsListening(false);
          setStatus(prev => prev === "listening" ? "idle" : prev);
        };
      }
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      window.speechSynthesis.cancel();
    };
  }, []);

  const handleProcessAudio = async (text: string) => {
    setStatus("processing");
    
    // Add user message to UI immediately
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setTranscript("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: text, 
          history: [
            {role: 'model', content: "You are a concise voice AI health assistant. Keep answers brief (1-2 sentences) so they can be spoken clearly."},
            ...messages
          ] 
        })
      });
      
      const data = await res.json();
      if (data.response) {
        setMessages(prev => [...prev, { role: 'model', content: data.response }]);
        speakText(data.response);
      }
    } catch (err) {
      console.error(err);
      setStatus("idle");
    }
  };

  const speakText = (text: string) => {
    setStatus("speaking");
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Try to find a good English voice
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.lang.includes("en") && v.name.includes("Female")) || voices[0];
    if (voice) utterance.voice = voice;
    
    utterance.onend = () => {
      setStatus("idle");
    };
    
    window.speechSynthesis.speak(utterance);
  };

  const toggleListen = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setTranscript("");
      window.speechSynthesis.cancel();
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col items-center justify-between p-6 bg-gradient-to-b from-blue-900/40 to-black/60 border border-blue-500/30 rounded-[2rem] relative overflow-hidden">
        
        {/* Background ambient animations */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <AnimatePresence>
            {(status === "listening" || status === "speaking") && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="w-96 h-96 bg-blue-600/20 rounded-full blur-[60px] filter mix-blend-screen"
              />
            )}
          </AnimatePresence>
        </div>

        <div className="z-10 w-full flex-1 overflow-y-auto mb-6 flex flex-col space-y-4 px-4 custom-scrollbar">
          {messages.length === 0 && status === "idle" && (
            <div className="m-auto text-center">
              <p className="text-2xl text-gray-400 font-medium tracking-tight">Tap the microphone to speak with CodeCure Voice</p>
            </div>
          )}
          {messages.map((m, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={i} 
              className={`max-w-[80%] p-4 rounded-3xl ${m.role === 'user' ? 'bg-blue-600 text-white self-end rounded-br-sm' : 'bg-white/10 text-gray-200 self-start rounded-bl-sm border border-white/5'}`}
            >
              <p className="text-lg">{m.content}</p>
            </motion.div>
          ))}
          {status === "listening" && transcript && (
             <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }}
               className="max-w-[80%] p-4 rounded-3xl bg-blue-600/50 text-white self-end rounded-br-sm border border-blue-500/50"
             >
               <p className="text-lg animate-pulse">{transcript}...</p>
             </motion.div>
          )}
          {status === "processing" && (
             <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }}
               className="max-w-[80%] p-4 rounded-3xl bg-white/5 text-blue-400 self-start rounded-bl-sm border border-white/5 flex items-center gap-3"
             >
               <Loader2 className="w-5 h-5 animate-spin" />
               <span className="text-lg">Processing...</span>
             </motion.div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="z-10 flex flex-col items-center w-full pb-4 shrink-0">
          {/* Visualization / Button */}
          <div className="relative">
             {status === "speaking" && (
               <div className="absolute inset-0 -m-8 flex items-center justify-center gap-2">
                 {[1,2,3,4,5].map(i => (
                   <motion.div
                     key={i}
                     animate={{ height: ["20%", "100%", "40%", "80%", "20%"] }}
                     transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.1 }}
                     className="w-3 bg-blue-500/50 rounded-full"
                   />
                 ))}
               </div>
             )}

             <button
               onClick={toggleListen}
               className={`w-24 h-24 rounded-full flex items-center justify-center transition-all z-20 relative ${
                 isListening 
                   ? 'bg-red-500/20 text-red-400 border-2 border-red-500 shadow-[0_0_40px_rgba(239,68,68,0.3)]' 
                   : status === 'speaking' 
                     ? 'bg-blue-600/20 text-blue-400 border-2 border-blue-600 shadow-[0_0_40px_rgba(37,99,235,0.3)]'
                     : 'bg-white/10 text-white hover:bg-white/20 hover:scale-105 border border-white/20'
               }`}
             >
               {isListening ? (
                 <Square className="w-8 h-8 fill-current" />
               ) : status === "speaking" ? (
                 <Volume2 className="w-8 h-8" />
               ) : (
                 <Mic className="w-8 h-8" />
               )}
             </button>
          </div>

          <div className="mt-16 flex items-center gap-8 border-t border-white/10 pt-8 w-full justify-center">
            <button 
              onClick={() => toast.success("Voice settings opened")}
              className="flex flex-col items-center gap-2 text-gray-500 hover:text-gray-300 transition-colors"
            >
               <div className="p-3 rounded-full bg-white/5 border border-white/10"><Settings2 className="w-5 h-5" /></div>
               <span className="text-xs font-bold uppercase tracking-widest">Settings</span>
            </button>
            <button 
              onClick={() => {
                 window.speechSynthesis.cancel();
                 setMessages([]);
                 setTranscript("");
                 setStatus("idle");
              }}
              className="flex flex-col items-center gap-2 text-gray-500 hover:text-gray-300 transition-colors"
            >
               <div className="p-3 rounded-full bg-white/5 border border-white/10"><Square className="w-5 h-5" /></div>
               <span className="text-xs font-bold uppercase tracking-widest">Stop</span>
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
