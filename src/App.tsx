/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, 
  Phone, 
  PhoneOff, 
  Send, 
  User, 
  Cpu, 
  Settings, 
  Trash2,
  Mic,
  MicOff,
  ChevronRight,
  Sparkles,
  Search
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useChat } from './hooks/useChat';
import { useLiveAPI } from './hooks/useLiveAPI';
import { cn } from './lib/utils';

export default function App() {
  const { messages, sendMessage, isLoading, clearChat } = useChat();
  const { isActive: isCalling, isConnecting, startCall, stopCall } = useLiveAPI();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = () => {
    if (inputText.trim()) {
      sendMessage(inputText);
      setInputText('');
    }
  };

  return (
    <div className="flex h-screen bg-[#0A0A0A] text-[#F5F5F5] font-sans selection:bg-[#F27D26] selection:text-white">
      {/* Sidebar - Technical Design */}
      <aside className="w-64 border-r border-[#1F1F1F] flex flex-col hidden md:flex">
        <div className="p-6 border-b border-[#1F1F1F]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#F27D26] flex items-center justify-center shadow-lg shadow-[#F27D26]/20">
              <Cpu className="w-5 h-5 text-black" />
            </div>
            <h1 className="font-sans font-bold text-lg tracking-tight">NEXUS AI</h1>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <div className="text-[10px] uppercase tracking-widest text-[#555] font-mono mb-4 px-2">Core Modules</div>
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-[#111] border border-[#222] text-sm hover:bg-[#1A1A1A] transition-colors group">
            <MessageSquare className="w-4 h-4 text-[#F27D26]" />
            <span>Neural Chat</span>
            <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
          <button 
            onClick={isCalling ? stopCall : startCall}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-lg border text-sm transition-all duration-300 group",
              isCalling 
                ? "bg-[#FF3B30]/10 border-[#FF3B30]/30 text-[#FF3B30] hover:bg-[#FF3B30]/20" 
                : "bg-transparent border-[#222] text-[#888] hover:bg-[#1A1A1A] hover:border-[#333]"
            )}
          >
            {isCalling ? <PhoneOff className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
            <span>{isCalling ? "End Voice Session" : "Real-time Voice"}</span>
          </button>
        </nav>

        <div className="p-4 border-t border-[#1F1F1F] space-y-4">
           <div className="flex items-center gap-3 px-4 py-3 bg-[#111] border border-[#222] rounded-xl">
             <div className="w-8 h-8 rounded-full bg-[#333] flex items-center justify-center text-xs">U</div>
             <div className="flex-1 overflow-hidden">
               <div className="text-xs font-medium truncate">User Core</div>
               <div className="text-[10px] text-[#555] font-mono">ID: 4291-ZX</div>
             </div>
             <Settings className="w-4 h-4 text-[#555] cursor-pointer hover:text-[#888]" />
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-[radial-gradient(circle_at_50%_0%,#151515_0%,#0A0A0A_100%)]">
        
        {/* Top Header */}
        <header className="h-16 border-b border-[#1F1F1F] flex items-center justify-between px-6 backdrop-blur-md bg-[#0A0A0A]/50 z-10">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#555]">System Online</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={clearChat}
              className="p-2 hover:bg-[#1A1A1A] rounded-lg transition-colors group"
              title="Clear Terminal"
            >
              <Trash2 className="w-4 h-4 text-[#555] group-hover:text-[#F27D26]" />
            </button>
          </div>
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 scrollbar-hide">
          <AnimatePresence mode="popLayout">
            {messages.length === 0 && !isLoading && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="h-full flex flex-col items-center justify-center text-center space-y-6 max-w-lg mx-auto"
              >
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#F27D26] to-[#FF9345] flex items-center justify-center shadow-2xl shadow-[#F27D26]/20 rotating-border">
                  <Cpu className="w-10 h-10 text-black" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tight">Nexus Intelligence Core</h2>
                  <p className="text-[#888] text-sm leading-relaxed">
                    Multimodal agent interface active. Initiate a neural link via text or direct voice uplink.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3 w-full">
                  <button onClick={() => sendMessage("Generate a summary of recent AI breakthroughs")} className="px-4 py-3 rounded-xl bg-[#111] border border-[#222] text-xs text-left hover:border-[#F27D26]/50 transition-all">
                    Summarize recent AI breakthroughs...
                  </button>
                  <button onClick={() => sendMessage("Help me write a React custom hook")} className="px-4 py-3 rounded-xl bg-[#111] border border-[#222] text-xs text-left hover:border-[#F27D26]/50 transition-all">
                    Help with React logic...
                  </button>
                </div>
              </motion.div>
            )}

            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, x: message.role === 'user' ? 10 : -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={cn(
                  "flex gap-4 max-w-4xl mx-auto",
                  message.role === 'user' ? "flex-row-reverse" : "flex-row"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center text-sm",
                  message.role === 'user' ? "bg-[#333]" : "bg-[#F27D26] text-black shadow-lg shadow-[#F27D26]/20"
                )}>
                  {message.role === 'user' ? <User className="w-5 h-5" /> : <Cpu className="w-5 h-5" />}
                </div>
                <div className={cn(
                  "flex flex-col space-y-1",
                  message.role === 'user' ? "items-end" : "items-start"
                )}>
                  <div className={cn(
                    "px-5 py-3 rounded-[2rem] text-sm leading-relaxed",
                    message.role === 'user' 
                      ? "bg-[#F27D26] text-black rounded-tr-none" 
                      : "bg-[#111] border border-[#222] text-[#DDD] rounded-tl-none markdown-body"
                  )}>
                    <ReactMarkdown>{message.text}</ReactMarkdown>
                  </div>
                  <span className="text-[9px] font-mono text-[#555] uppercase mt-1">
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>
              </motion.div>
            ))}

            {isLoading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-4 max-w-4xl mx-auto"
              >
                <div className="w-10 h-10 rounded-xl bg-[#111] border border-[#222] flex items-center justify-center">
                  <Cpu className="w-5 h-5 text-[#F27D26] animate-pulse" />
                </div>
                <div className="flex gap-1.5 items-center px-4 py-2 bg-[#111] border border-[#222] rounded-2xl rounded-tl-none">
                  <div className="w-1.5 h-1.5 bg-[#F27D26] rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-1.5 h-1.5 bg-[#F27D26] rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-1.5 h-1.5 bg-[#F27D26] rounded-full animate-bounce" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-6 relative bg-gradient-to-t from-[#0A0A0A] to-transparent">
          <div className="max-w-4xl mx-auto relative group">
            <div className="absolute inset-0 bg-[#F27D26]/5 blur-2xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity duration-700" />
            <div className="relative flex items-center bg-[#111] border border-[#222] rounded-2xl p-2 pr-4 focus-within:border-[#F27D26]/50 transition-all duration-300">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Transmitting neural query..."
                className="flex-1 bg-transparent border-none focus:outline-none text-sm px-4 py-2"
              />
              <div className="flex items-center gap-2">
                <button 
                  onClick={isCalling ? stopCall : startCall}
                  className={cn(
                    "p-2 rounded-xl transition-all duration-300",
                    isCalling 
                      ? "bg-[#FF3B30] text-white shadow-lg shadow-[#FF3B30]/20" 
                      : "text-[#555] hover:text-[#F27D26] hover:bg-[#1A1A1A]"
                  )}
                >
                  {isCalling ? <PhoneOff className="w-4 h-4" /> : <Mic className="w-5 h-5" />}
                </button>
                <button 
                  onClick={handleSend}
                  disabled={!inputText.trim() || isLoading}
                  className={cn(
                    "w-10 h-10 flex items-center justify-center rounded-xl transition-all",
                    !inputText.trim() || isLoading
                      ? "bg-[#222] text-[#444] cursor-not-allowed"
                      : "bg-[#F27D26] text-black shadow-lg shadow-[#F27D26]/20 hover:scale-105 active:scale-95"
                  )}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Voice Call Overlay */}
        <AnimatePresence>
          {(isCalling || isConnecting) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-xl flex flex-col items-center justify-center p-10 overflow-hidden"
            >
              {/* Animated Background Pulse */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-[#F27D26]/10 rounded-full animate-ping [animation-duration:4s]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-[#F27D26]/20 rounded-full animate-ping [animation-duration:3s]" />
              </div>

              <div className="relative flex flex-col items-center text-center space-y-12">
                <div className="relative">
                  <motion.div 
                    animate={{ scale: [1, 1.1, 1] }} 
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="w-40 h-40 rounded-full bg-[#F27D26] flex items-center justify-center shadow-[0_0_100px_rgba(242,125,38,0.3)]"
                  >
                    <Cpu className="w-20 h-20 text-black" />
                  </motion.div>
                  <div className="absolute -bottom-4 right-0 bg-green-500 w-8 h-8 rounded-full border-[6px] border-[#0A0A0A] shadow-xl" />
                </div>
                
                <div className="space-y-4">
                  <h2 className="text-4xl font-bold tracking-tight">Nexus Uplink Established</h2>
                  <div className="flex items-center justify-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#F27D26] animate-pulse" />
                    <span className="text-sm font-mono text-[#F27D26] uppercase tracking-[0.3em]">Encrypted Real-time Voice</span>
                  </div>
                </div>

                {/* Audio Waveform Visualization (Mock) */}
                <div className="flex items-center gap-1.5 h-12">
                  {[...Array(20)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ height: isConnecting ? [4, 12, 4] : [4, Math.random() * 40 + 8, 4] }}
                      transition={{ repeat: Infinity, duration: 0.5 + Math.random(), ease: "easeInOut" }}
                      className="w-1 bg-[#F27D26] rounded-full opacity-60"
                    />
                  ))}
                </div>

                <div className="flex gap-6 pt-10">
                  <button 
                    className="w-16 h-16 rounded-full border border-[#222] bg-[#111] flex items-center justify-center hover:bg-[#1A1A1A] transition-colors"
                    title="Mute (Placeholder)"
                  >
                    <MicOff className="w-6 h-6 text-[#555]" />
                  </button>
                  <button 
                    onClick={stopCall}
                    className="w-20 h-20 rounded-full bg-[#FF3B30] flex items-center justify-center text-white shadow-2xl shadow-[#FF3B30]/30 hover:scale-110 active:scale-95 transition-all"
                  >
                    <PhoneOff className="w-8 h-8" />
                  </button>
                  <button 
                    className="w-16 h-16 rounded-full border border-[#222] bg-[#111] flex items-center justify-center hover:bg-[#1A1A1A] transition-colors"
                    title="Audio Settings (Placeholder)"
                  >
                    <Settings className="w-6 h-6 text-[#555]" />
                  </button>
                </div>
              </div>

              {/* Status footer for call */}
              <div className="absolute bottom-10 left-10 right-10 flex justify-between items-center text-[10px] font-mono text-[#444] uppercase tracking-widest">
                <div>Latency: 24ms</div>
                <div>Protocol: Multimodal-Live-3.1</div>
                <div>Sampling: 16kHz IN / 24kHz OUT</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
}

