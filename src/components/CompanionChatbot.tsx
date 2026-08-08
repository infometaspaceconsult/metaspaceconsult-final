import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, SiteConfig } from '../types';
import { MessageSquare, X, Send, Bot, User, PhoneCall, Sparkles, CheckCircle } from 'lucide-react';

interface CompanionChatbotProps {
  config: SiteConfig;
  isOpen: boolean;
  onToggle: () => void;
  onOpenConsultation: () => void;
}

export const CompanionChatbot: React.FC<CompanionChatbotProps> = ({
  config,
  isOpen,
  onToggle,
  onOpenConsultation,
}) => {
  const { content } = config;

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_init',
      sender: 'companion',
      text: 'Hello! I am "Companion", the AI assistant for Metaspace Consulting Limited. How can I assist you with our venture design studio, Metagen AI, or booking a consultation today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [leadCaptured, setLeadCaptured] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputText;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: 'usr_' + Date.now(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInputText('');
    setLoading(true);

    try {
      const res = await fetch('/api/companion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history: messages,
        }),
      });

      const data = await res.json();

      const companionReply: ChatMessage = {
        id: 'comp_' + Date.now(),
        sender: 'companion',
        text: data.reply || 'I am here to assist you with Metaspace ventures. How can I help further?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, companionReply]);

      if (data.leadCaptured) {
        setLeadCaptured(true);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: 'err_' + Date.now(),
          sender: 'companion',
          text: 'I am experiencing a momentary connection glitch. Feel free to reach out directly to our WhatsApp Support Agent!',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const whatsappUrl = `https://wa.me/${content.whatsappNumber}?text=${encodeURIComponent(
    'Hello, I was chatting with Companion on Metaspace website and would like human assistance.'
  )}`;

  const quickPills = [
    'What does Metaspace do?',
    'Tell me about Metagen AI',
    'List of Flagship Ventures',
    'Book a Consultation',
  ];

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={onToggle}
          className="flex items-center gap-3 px-5 py-3.5 bg-[#141B77] text-white rounded-full shadow-2xl hover:bg-blue-900 transition-all transform hover:scale-105 border-2 border-white/30 group"
        >
          <div className="relative">
            <Bot className="w-6 h-6 text-white" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#141B77] animate-pulse" />
          </div>
          <div className="text-left hidden sm:block">
            <span className="text-xs font-bold block leading-tight">Companion AI</span>
            <span className="text-[10px] text-slate-300 font-medium">Instant Support & Leads</span>
          </div>
        </button>
      )}

      {/* Expanded Chatbot Drawer */}
      {isOpen && (
        <div className="w-[92vw] sm:w-[390px] h-[520px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="bg-[#141B77] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-xl relative">
                <Bot className="w-5 h-5 text-white" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border border-[#141B77]" />
              </div>
              <div>
                <h3 className="font-bold text-sm leading-tight">Companion Support</h3>
                <span className="text-[10px] text-slate-300 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-300" /> Metaspace AI Concierge
                </span>
              </div>
            </div>

            <button
              onClick={onToggle}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-full transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-[#f5faff]">
            {leadCaptured && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Your contact details have been registered for a Metaspace callback!</span>
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'companion' && (
                  <div className="w-7 h-7 rounded-full bg-[#141B77] text-white flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                    C
                  </div>
                )}

                <div
                  className={`max-w-[82%] p-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#141B77] text-white rounded-br-none shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-xs'
                  }`}
                >
                  <p>{msg.text}</p>
                  <span
                    className={`text-[9px] block mt-1.5 ${
                      msg.sender === 'user' ? 'text-white/70 text-right' : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-slate-300 text-slate-700 flex items-center justify-center shrink-0 mt-0.5 text-xs">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                <Bot className="w-4 h-4 text-[#141B77] animate-spin" />
                <span>Companion is thinking...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="px-3 py-2 bg-white border-t border-slate-100 flex gap-1.5 overflow-x-auto no-scrollbar">
            {quickPills.map((pill) => (
              <button
                key={pill}
                onClick={() => {
                  if (pill === 'Book a Consultation') {
                    onOpenConsultation();
                  } else {
                    handleSendMessage(pill);
                  }
                }}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-semibold rounded-full shrink-0 transition"
              >
                {pill}
              </button>
            ))}
          </div>

          {/* Input Bar & Escalation */}
          <div className="p-3 bg-white border-t border-slate-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2 mb-2"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask Companion or leave contact details..."
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#141B77]"
              />
              <button
                type="submit"
                disabled={loading || !inputText.trim()}
                className="p-2 bg-[#141B77] text-white rounded-lg hover:bg-blue-900 transition disabled:opacity-40"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            {/* In-Person or Difficult Issue Referral to WhatsApp Agent */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-slate-500">Need human or in-person support?</span>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-bold text-emerald-600 hover:underline"
              >
                <PhoneCall className="w-3 h-3" />
                <span>WhatsApp Agent</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
