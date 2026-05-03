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
  ShieldCheck, 
  Settings, 
  Trash2,
  Mic,
  MicOff,
  ChevronRight,
  Headset,
  Search,
  FileText,
  LifeBuoy,
  History,
  Clock,
  HelpCircle,
  ChevronDown
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useChat } from './hooks/useChat';
import { useLiveAPI } from './hooks/useLiveAPI';
import { useVoiceTranscription } from './hooks/useVoiceTranscription';
import { cn } from './lib/utils';
import { FAQS } from './constants';

export default function App() {
  const { messages, sendMessage, isLoading, clearChat } = useChat();
  const { isActive: isCalling, isConnecting, startCall, stopCall, callHistory, clearCallHistory } = useLiveAPI();
  const { isRecording, isTranscribing, startRecording, stopRecording } = useVoiceTranscription();
  const [inputText, setInputText] = useState('');
  const [activeTab, setActiveTab] = useState<'chat' | 'history' | 'faq'>('chat');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (activeTab === 'chat') {
      scrollToBottom();
    }
  }, [messages, isLoading, activeTab]);

  const handleSend = () => {
    if (inputText.trim()) {
      sendMessage(inputText);
      setInputText('');
    }
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-[#1E293B] font-sans selection:bg-[#2563EB] selection:text-white">
      {/* Sidebar - Professional Blue/Slate */}
      <aside className="w-72 border-r border-[#E2E8F0] flex flex-col hidden lg:flex bg-white">
        <div className="p-6 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-[#2563EB] flex items-center justify-center shadow-lg shadow-[#2563EB]/20">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight text-[#0F172A]">SecureShield</h1>
              <p className="text-[10px] text-[#64748B] font-medium uppercase tracking-wider">Insurance Group</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <div className="text-[11px] uppercase tracking-widest text-[#94A3B8] font-semibold mb-4 px-3">Service Channels</div>
          <button 
            onClick={() => setActiveTab('chat')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium transition-colors group",
              activeTab === 'chat' 
                ? "bg-[#F1F5F9] border-[#E2E8F0] text-[#0F172A]" 
                : "bg-transparent border-transparent text-[#64748B] hover:bg-[#F8FAFC]"
            )}
          >
            <MessageSquare className="w-4 h-4 text-[#2563EB]" />
            <span>Support Chat</span>
            <ChevronRight className="w-4 h-4 ml-auto opacity-40 group-hover:opacity-100 transition-opacity" />
          </button>

          <button 
            onClick={() => setActiveTab('faq')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium transition-colors group",
              activeTab === 'faq' 
                ? "bg-[#F1F5F9] border-[#E2E8F0] text-[#0F172A]" 
                : "bg-transparent border-transparent text-[#64748B] hover:bg-[#F8FAFC]"
            )}
          >
            <HelpCircle className="w-4 h-4 text-[#2563EB]" />
            <span>Support FAQ</span>
            <ChevronRight className="w-4 h-4 ml-auto opacity-40 group-hover:opacity-100 transition-opacity" />
          </button>
          
          <button 
            onClick={() => setActiveTab('history')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium transition-colors group",
              activeTab === 'history' 
                ? "bg-[#F1F5F9] border-[#E2E8F0] text-[#0F172A]" 
                : "bg-transparent border-transparent text-[#64748B] hover:bg-[#F8FAFC]"
            )}
          >
            <History className="w-4 h-4 text-[#2563EB]" />
            <span>Call History</span>
            <ChevronRight className="w-4 h-4 ml-auto opacity-40 group-hover:opacity-100 transition-opacity" />
          </button>

          <button 
            onClick={isCalling ? stopCall : startCall}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-300 group",
              isCalling 
                ? "bg-[#EF4444]/10 border-[#EF4444]/30 text-[#EF4444] hover:bg-[#EF4444]/20" 
                : "bg-white border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC] hover:border-[#CBD5E1]"
            )}
          >
            {isCalling ? <PhoneOff className="w-4 h-4" /> : <Headset className="w-4 h-4" />}
            <span>{isCalling ? "End Call Session" : "Voice Hotlink"}</span>
          </button>

          <div className="pt-6 px-3">
            <div className="text-[11px] uppercase tracking-widest text-[#94A3B8] font-semibold mb-4">Quick Access</div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-[#475569] hover:text-[#2563EB] cursor-pointer transition-colors px-1 text-left">
                <FileText className="w-4 h-4" />
                <span>Policy Documents</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-[#475569] hover:text-[#2563EB] cursor-pointer transition-colors px-1 text-left">
                <LifeBuoy className="w-4 h-4" />
                <span>Emergency Claims</span>
              </div>
            </div>
          </div>
        </nav>

        <div className="p-4 border-t border-[#E2E8F0]">
           <div className="flex items-center gap-3 px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl">
             <div className="w-9 h-9 rounded-full bg-[#E2E8F0] flex items-center justify-center text-xs font-bold text-[#475569]">JD</div>
             <div className="flex-1 overflow-hidden text-left">
               <div className="text-xs font-semibold text-[#0F172A] truncate">John Doe</div>
               <div className="text-[10px] text-[#64748B]">Member ID: SS-88219</div>
             </div>
             <Settings className="w-4 h-4 text-[#94A3B8] cursor-pointer hover:text-[#475569]" />
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-white lg:bg-[#F8FAFC]">
        
        {/* Top Header */}
        <header className="h-16 lg:h-20 border-b border-[#E2E8F0] flex items-center justify-between px-6 lg:px-10 bg-white z-10">
          <div className="flex items-center gap-4">
            <div className="lg:hidden flex items-center gap-2">
               <ShieldCheck className="w-6 h-6 text-[#2563EB]" />
               <h1 className="font-bold text-base text-[#0F172A]">SecureShield</h1>
            </div>
            <div className="hidden lg:flex items-center gap-3 text-[#64748B]">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
              <span className="text-xs font-semibold uppercase tracking-widest">Support Core Active</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={activeTab === 'chat' ? clearChat : clearCallHistory}
              className="p-2.5 hover:bg-[#F1F5F9] rounded-xl transition-colors group text-[#94A3B8]"
              title={activeTab === 'chat' ? "Reset Conversation" : "Clear History"}
            >
              <Trash2 className="w-4 h-4 group-hover:text-[#EF4444]" />
            </button>
          </div>
        </header>

        {/* View Switcher based on activeTab */}
        {activeTab === 'chat' ? (
          <>
            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-6 lg:p-10 space-y-8 scrollbar-hide text-left">
              <AnimatePresence mode="popLayout">
                {messages.length === 0 && !isLoading && (
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="h-full flex flex-col items-center justify-center text-center space-y-8 max-w-2xl mx-auto"
                  >
                    <div className="relative">
                      <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#2563EB] to-[#3B82F6] flex items-center justify-center shadow-2xl shadow-[#2563EB]/25 relative z-10">
                        <Headset className="w-12 h-12 text-white" />
                      </div>
                      <div className="absolute -inset-4 bg-[#2563EB]/10 rounded-[3rem] blur-2xl animate-pulse" />
                    </div>
                    
                    <div className="space-y-3">
                      <h2 className="text-3xl font-extrabold tracking-tight text-[#0F172A]">SecureShield AI Concierge</h2>
                      <p className="text-[#64748B] text-base leading-relaxed max-w-md mx-auto">
                        Welcome back. I am your specialized insurance assistant. How can I protect your interests today?
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                      {[
                        "What does my current auto policy cover?",
                        "How do I start a new home insurance claim?",
                        "Compare premium plans for life insurance",
                        "Update my contact information"
                      ].map((query, index) => (
                        <button 
                          key={index}
                          onClick={() => sendMessage(query)} 
                          className="px-5 py-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm text-sm text-[#475569] text-left font-medium hover:border-[#2563EB] hover:text-[#2563EB] hover:shadow-md transition-all group flex items-center gap-3"
                        >
                          <span className="flex-1">{query}</span>
                          <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "flex gap-4 max-w-4xl mx-auto",
                      message.role === 'user' ? "flex-row-reverse" : "flex-row"
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 lg:w-12 lg:h-12 rounded-2xl flex-shrink-0 flex items-center justify-center text-sm shadow-sm",
                      message.role === 'user' ? "bg-slate-100 text-slate-600" : "bg-[#2563EB] text-white"
                    )}>
                      {message.role === 'user' ? <User className="w-5 h-5 lg:w-6 lg:h-6" /> : <ShieldCheck className="w-5 h-5 lg:w-6 lg:h-6" />}
                    </div>
                    <div className={cn(
                      "flex flex-col space-y-1.5",
                      message.role === 'user' ? "items-end" : "items-start"
                    )}>
                      <div className={cn(
                        "px-6 py-4 rounded-3xl text-sm leading-relaxed shadow-sm",
                        message.role === 'user' 
                          ? "bg-[#2563EB] text-white rounded-tr-none" 
                          : "bg-[#F1F5F9] text-[#334155] rounded-tl-none border border-[#E2E8F0] markdown-body"
                      )}>
                        <ReactMarkdown>{message.text}</ReactMarkdown>
                      </div>
                      <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-tighter">
                        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
                    <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-2xl bg-[#F1F5F9] border border-[#E2E8F0] flex items-center justify-center">
                      <ShieldCheck className="w-5 h-5 lg:w-6 lg:h-6 text-[#2563EB] animate-pulse" />
                    </div>
                    <div className="flex gap-1.5 items-center px-5 py-3 bg-[#F1F5F9] border border-[#E2E8F0] rounded-3xl rounded-tl-none">
                      <div className="w-1.5 h-1.5 bg-[#2563EB] rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <div className="w-1.5 h-1.5 bg-[#2563EB] rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <div className="w-1.5 h-1.5 bg-[#2563EB] rounded-full animate-bounce" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {/* Improved Input Bar (Light Theme) */}
            <div className="p-6 lg:p-10 relative bg-white border-t border-[#E2E8F0]">
              <div className="max-w-4xl mx-auto relative">
                <div className="relative flex items-center bg-[#F8FAFC] border border-[#E2E8F0] rounded-[2rem] p-2 pr-5 focus-within:border-[#2563EB] focus-within:ring-4 focus-within:ring-[#2563EB]/5 transition-all duration-300">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder={isTranscribing ? "Voice processing..." : "Ask a support question..."}
                    className="flex-1 bg-transparent border-none focus:outline-none text-sm px-6 py-3 text-[#1E293B] placeholder-[#94A3B8]"
                    disabled={isTranscribing}
                  />
                  <div className="flex items-center gap-3">
                    <button 
                      onMouseDown={startRecording}
                      onMouseUp={async () => {
                        const text = await stopRecording();
                        if (text) setInputText(prev => prev + (prev ? ' ' : '') + text);
                      }}
                      onMouseLeave={() => isRecording && stopRecording()}
                      title="Hold to dictate"
                      className={cn(
                        "p-2.5 rounded-full transition-all duration-300",
                        isRecording 
                          ? "bg-[#2563EB] text-white shadow-lg shadow-[#2563EB]/40 scale-125" 
                          : isTranscribing
                            ? "text-[#2563EB] animate-pulse"
                            : "text-[#94A3B8] hover:text-[#2563EB] hover:bg-[#F1F5F9]"
                      )}
                    >
                      <Mic className="w-5 h-5" />
                    </button>

                    <button 
                      onClick={isCalling ? stopCall : startCall}
                      title="Instant Voice Connect"
                      className={cn(
                        "p-2.5 rounded-full transition-all duration-300",
                        isCalling 
                          ? "bg-[#EF4444] text-white shadow-lg shadow-[#EF4444]/20" 
                          : "text-[#94A3B8] hover:text-[#2563EB] hover:bg-[#F1F5F9]"
                      )}
                    >
                      {isCalling ? <PhoneOff className="w-4 h-4" /> : <Phone className="w-5 h-5" />}
                    </button>

                    <button 
                      onClick={handleSend}
                      disabled={!inputText.trim() || isLoading || isTranscribing}
                      className={cn(
                        "w-12 h-12 flex items-center justify-center rounded-full transition-all",
                        !inputText.trim() || isLoading || isTranscribing
                          ? "bg-[#E2E8F0] text-[#94A3B8] cursor-not-allowed"
                          : "bg-[#2563EB] text-white shadow-xl shadow-[#2563EB]/25 hover:scale-110 active:scale-95"
                      )}
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : activeTab === 'history' ? (
          /* History Area */
          <div className="flex-1 overflow-y-auto p-6 lg:p-10 space-y-6 scrollbar-hide text-left">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-[#0F172A] mb-8 flex items-center gap-3">
                <History className="w-7 h-7 text-[#2563EB]" />
                Recent Call Sessions
              </h2>

              {callHistory.length === 0 ? (
                <div className="bg-white border border-[#E2E8F0] rounded-3xl p-12 text-center space-y-4">
                  <div className="w-16 h-16 bg-[#F1F5F9] rounded-full flex items-center justify-center mx-auto">
                    <Clock className="w-8 h-8 text-[#94A3B8]" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-[#0F172A]">No call logs found</h3>
                    <p className="text-sm text-[#64748B]">Recent voice support sessions will appear here.</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {callHistory.map((call) => (
                    <motion.div
                      key={call.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-white border border-[#E2E8F0] rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm hover:shadow-md transition-all group"
                    >
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 bg-[#F1F5F9] rounded-2xl flex items-center justify-center text-[#2563EB] group-hover:bg-[#2563EB] group-hover:text-white transition-colors">
                          <Headset className="w-6 h-6" />
                        </div>
                        <div className="space-y-1">
                          <div className="font-bold text-[#0F172A]">SecureShield Voice Uplink</div>
                          <div className="text-xs text-[#64748B] flex items-center gap-3">
                            <span className="flex items-center gap-1">
                              <Search className="w-3 h-3 text-[#94A3B8]" />
                              {new Date(call.timestamp).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-[#94A3B8]" />
                              {new Date(call.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between md:justify-end gap-6 bg-[#F8FAFC] md:bg-transparent p-4 md:p-0 rounded-2xl">
                        <div className="text-right">
                          <div className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-0.5">Duration</div>
                          <div className="text-sm font-mono font-bold text-[#2563EB]">{formatDuration(call.duration)}</div>
                        </div>
                        <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-bold">COMPLETED</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* FAQ Area */
          <div className="flex-1 overflow-y-auto p-6 lg:p-10 space-y-6 scrollbar-hide text-left">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-[#0F172A] mb-8 flex items-center gap-3">
                <HelpCircle className="w-7 h-7 text-[#2563EB]" />
                Frequently Asked Questions
              </h2>

              <div className="space-y-4">
                {FAQS.map((faq, index) => (
                  <div 
                    key={index}
                    className="bg-white border border-[#E2E8F0] rounded-3xl overflow-hidden shadow-sm hover:border-[#2563EB]/30 transition-all"
                  >
                    <button 
                      onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                      className="w-full flex items-center justify-between p-6 text-left"
                    >
                      <span className="font-bold text-[#1E293B] flex-1 pr-4">{faq.question}</span>
                      <ChevronDown className={cn(
                        "w-5 h-5 text-[#94A3B8] transition-transform duration-300",
                        expandedFaq === index && "rotate-180"
                      )} />
                    </button>
                    <AnimatePresence>
                      {expandedFaq === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-6 pt-0 text-sm text-[#64748B] leading-relaxed border-t border-[#F1F5F9]">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>

              <div className="mt-12 p-8 bg-[#F8FAFC] border border-[#E2E8F0] rounded-3xl text-center space-y-4">
                <p className="text-sm text-[#64748B]">Can't find what you're looking for?</p>
                <button 
                  onClick={() => setActiveTab('chat')}
                  className="px-6 py-3 bg-[#2563EB] text-white rounded-xl font-bold text-sm shadow-lg shadow-[#2563EB]/25 hover:scale-105 transition-all"
                >
                  Speak to our AI Assistant
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Voice Call Overlay (Professional Theme) */}
        <AnimatePresence>
          {(isCalling || isConnecting) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 bg-white/95 backdrop-blur-2xl flex flex-col items-center justify-center p-10 overflow-hidden"
            >
              {/* Background Accents */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-50">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-[#2563EB]/5 rounded-full blur-[120px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#2563EB]/10 rounded-full blur-[80px]" />
              </div>

              <div className="relative flex flex-col items-center text-center space-y-16">
                <div className="relative">
                  <motion.div 
                    animate={{ scale: [1, 1.05, 1], rotate: [0, 5, -5, 0] }} 
                    transition={{ repeat: Infinity, duration: 4 }}
                    className="w-48 h-48 rounded-[3rem] bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] flex items-center justify-center shadow-[0_40px_80px_-20px_rgba(37,99,235,0.4)]"
                  >
                    <Headset className="w-24 h-24 text-white" />
                  </motion.div>
                  <div className="absolute -bottom-4 -right-4 bg-green-500 w-12 h-12 rounded-full border-[8px] border-white shadow-xl flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full animate-ping" />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h2 className="text-4xl font-extrabold tracking-tight text-[#0F172A]">SecureShield Support</h2>
                  <div className="flex items-center justify-center gap-3">
                    <div className="flex gap-1">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="w-1.5 h-1.5 bg-[#2563EB] rounded-full animate-bounce" style={{ animationDelay: `${i * 0.2}s` }} />
                      ))}
                    </div>
                    <span className="text-sm font-bold text-[#64748B] uppercase tracking-[0.2em]">Voice Concierge Link</span>
                  </div>
                </div>

                {/* Professional Audio Waveform */}
                <div className="flex items-center gap-2 h-16">
                  {[...Array(30)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ height: isConnecting ? [6, 16, 6] : [6, Math.random() * 50 + 10, 6] }}
                      transition={{ repeat: Infinity, duration: 0.6 + Math.random(), ease: "easeInOut" }}
                      className="w-1.5 bg-[#2563EB] rounded-full opacity-70"
                    />
                  ))}
                </div>

                <div className="flex gap-8 pt-6">
                  <button 
                    className="w-20 h-20 rounded-full border border-[#E2E8F0] bg-white flex items-center justify-center hover:bg-[#F1F5F9] transition-all shadow-sm active:scale-95"
                    title="Toggle Mute"
                  >
                    <Mic className="w-7 h-7 text-[#64748B]" />
                  </button>
                  <button 
                    onClick={stopCall}
                    className="w-24 h-24 rounded-full bg-[#EF4444] flex items-center justify-center text-white shadow-2xl shadow-[#EF4444]/40 hover:scale-110 active:scale-90 transition-all"
                  >
                    <PhoneOff className="w-10 h-10" />
                  </button>
                </div>
              </div>

              <div className="absolute bottom-12 flex items-center gap-6 text-[11px] font-bold text-[#94A3B8] uppercase tracking-[0.2em]">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  HD AUDIO
                </div>
                <div className="w-px h-3 bg-[#E2E8F0]" />
                <div>SECURE CONNECTION UNLOCKED</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
}

