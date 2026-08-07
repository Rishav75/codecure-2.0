import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import Layout from "../components/Layout";
import { Send, Bot, User, Mic, Image as ImageIcon, Loader2 } from "lucide-react";
import Markdown from "react-markdown";
import toast from "react-hot-toast";

export default function AIHealthAssistant() {
  const [messages, setMessages] = useState<{role: 'user' | 'model', content: string}[]>([
    { role: 'model', content: "Hello! I'm your CodeCure AI Assistant. I can help you analyze symptoms, suggest wellness plans, or explain medical reports. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");
    const newMessages = [...messages, { role: 'user' as const, content: userMessage }];
    setMessages(newMessages);
    setLoading(true);

    try {
      // We will map 'model' to 'model' for Gemini history in the backend
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, history: messages })
      });
      
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setMessages([...newMessages, { role: 'model', content: data.response }]);
    } catch (err) {
      console.error(err);
      setMessages([...newMessages, { role: 'model', content: "I encountered an error connecting to my intelligence core. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden backdrop-blur-md shadow-2xl relative">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-blue-600/10 blur-[60px] rounded-full pointer-events-none mix-blend-screen" />
        
        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 z-10">
          {messages.map((msg, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border ${msg.role === 'user' ? 'bg-blue-600/20 text-blue-400 border-blue-600/30' : 'bg-black/40 text-gray-300 border-white/10'}`}>
                {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>
              <div className={`max-w-[80%] rounded-2xl p-5 ${msg.role === 'user' ? 'bg-blue-600 text-white shadow-lg' : 'bg-black/40 text-gray-200 border border-white/5'}`}>
                <div className="prose prose-invert prose-sm max-w-none">
                  <Markdown>{msg.content}</Markdown>
                </div>
              </div>
            </motion.div>
          ))}
          {loading && (
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="flex gap-4 flex-row"
             >
               <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 bg-black/40 text-gray-300 border border-white/10">
                 <Bot className="w-5 h-5" />
               </div>
               <div className="rounded-2xl p-5 bg-black/40 text-gray-200 border border-white/5 flex items-center gap-3">
                  <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
                  <span className="text-sm text-gray-400 uppercase tracking-widest font-bold">Analyzing...</span>
               </div>
             </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 bg-black/40 border-t border-white/10 backdrop-blur-xl z-10">
          <div className="relative flex items-center">
            <div className="absolute left-4 flex items-center gap-2">
              <button 
                onClick={() => toast.success("Image upload modal opened")}
                className="p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/10"
              >
                <ImageIcon className="w-5 h-5" />
              </button>
              <button 
                onClick={() => toast.success("Voice recording started")}
                className="p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/10"
              >
                <Mic className="w-5 h-5" />
              </button>
            </div>
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about symptoms, meal plans, or upload a report..."
              className="w-full bg-white/5 border border-white/10 rounded-full py-4 pl-28 pr-16 text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 shadow-inner"
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="absolute right-2 p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:bg-blue-600/50 shadow-lg"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <div className="mt-4 text-center">
             <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">AI can make mistakes. Always consult a real doctor for medical advice.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
