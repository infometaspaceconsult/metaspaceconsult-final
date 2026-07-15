import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, Sparkles, X, Send, Bot, User, Loader2, ArrowRight } from "lucide-react";
import { ChatMessage } from "../types";
import { apiSendChatMsg } from "../lib/apiFallback";

export default function GeminiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "model",
      parts: [
        {
          text: "Hello! I'm Companion, your official Metaspace Digital Assistant. I can answer questions about our ventures, offerings, and ecosystem based strictly on our site profiles. If you need any special help or custom inquiries, I can guide you directly to our WhatsApp helpdesk. How can I assist you today?",
        },
      ],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Floating button Drag & Move states
  const [coords, setCoords] = useState<{ x: number; y: number } | null>(null);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const buttonStart = useRef({ x: 0, y: 0 });

  const samplePrompts = [
    "Tell me about Ugbekun",
    "What is the Oghowa Accelerator?",
    "Do you do custom software development?",
    "How can I partner with Metaspace?",
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      role: "user",
      parts: [{ text: textToSend }],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const historyPayload = messages.map((m) => ({
        role: m.role,
        parts: m.parts,
      }));

      const reply = await apiSendChatMsg(textToSend, historyPayload);

      const aiMsg: ChatMessage = {
        role: "model",
        parts: [{ text: reply || "I apologize, but I couldn't formulate a response. Please try again." }],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error("Chat Error:", error);
      const errMsg: ChatMessage = {
        role: "model",
        parts: [
          {
            text: "I'm having a brief connection interruption. Don't worry, our systems are online! Please try asking that again in a second.",
          },
        ],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Clamping function to keep button inside viewport
  const setClampedCoords = (x: number, y: number) => {
    const minX = 10;
    const minY = 10;
    const maxX = window.innerWidth - 65; // Button width is 56px (14rem)
    const maxY = window.innerHeight - 65; // Button height is 56px (14rem)
    setCoords({
      x: Math.max(minX, Math.min(x, maxX)),
      y: Math.max(minY, Math.min(y, maxY)),
    });
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (e.button !== 0) return; // Only left click drags

    const rect = e.currentTarget.getBoundingClientRect();
    buttonStart.current = { x: rect.left, y: rect.top };
    dragStart.current = { x: e.clientX, y: e.clientY };
    isDragging.current = false;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - dragStart.current.x;
      const dy = moveEvent.clientY - dragStart.current.y;

      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
        isDragging.current = true;
      }

      if (isDragging.current) {
        setClampedCoords(buttonStart.current.x + dx, buttonStart.current.y + dy);
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLButtonElement>) => {
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    buttonStart.current = { x: rect.left, y: rect.top };
    dragStart.current = { x: touch.clientX, y: touch.clientY };
    isDragging.current = false;

    const handleTouchMove = (moveEvent: TouchEvent) => {
      const touchMove = moveEvent.touches[0];
      const dx = touchMove.clientX - dragStart.current.x;
      const dy = touchMove.clientY - dragStart.current.y;

      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
        isDragging.current = true;
      }

      if (isDragging.current) {
        setClampedCoords(buttonStart.current.x + dx, buttonStart.current.y + dy);
      }
    };

    const handleTouchEnd = () => {
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };

    document.addEventListener("touchmove", handleTouchMove, { passive: true });
    document.addEventListener("touchend", handleTouchEnd);
  };

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!isDragging.current) {
      setIsOpen(!isOpen);
    }
  };

  // Renders markdown links and standalone urls inside chat response smoothly
  const renderMessageText = (text: string) => {
    const regex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
    const elements: React.ReactNode[] = [];
    let lastKey = 0;

    const arrayParts = text.split(regex);
    for (let i = 0; i < arrayParts.length; i += 3) {
      const plain = arrayParts[i];
      if (plain) {
        const subParts = plain.split(/(https?:\/\/[^\s]+)/g);
        subParts.forEach((sp) => {
          if (sp.startsWith("http://") || sp.startsWith("https://")) {
            elements.push(
              <a
                key={`link-${lastKey++}`}
                href={sp}
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-500 underline hover:text-red-600 font-bold"
              >
                {sp}
              </a>
            );
          } else {
            elements.push(<span key={`text-${lastKey++}`}>{sp}</span>);
          }
        });
      }

      if (i + 1 < arrayParts.length) {
        const label = arrayParts[i + 1];
        const url = arrayParts[i + 2];
        elements.push(
          <a
            key={`link-md-${lastKey++}`}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-red-500 underline hover:text-red-600 font-bold inline-flex items-center gap-1 bg-red-50 px-2 py-0.5 rounded border border-red-100 transition"
          >
            {label}
          </a>
        );
      }
    }

    return <p className="whitespace-pre-wrap">{elements.length > 0 ? elements : text}</p>;
  };

  const style: React.CSSProperties = coords
    ? { left: `${coords.x}px`, top: `${coords.y}px`, bottom: "auto", right: "auto", position: "fixed" }
    : { position: "fixed", bottom: "1.5rem", right: "1.5rem" };

  const isTopHalf = coords ? coords.y < 350 : false;

  return (
    <div
      style={style}
      className={`z-50 flex ${isTopHalf ? "flex-col-reverse" : "flex-col"} items-end`}
    >
      {/* Active Chat Window */}
      {isOpen && (
        <div className={`${isTopHalf ? "mt-4" : "mb-4"} w-96 max-w-[calc(100vw-2rem)] h-[550px] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in fade-in duration-200`}>
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-blue-900 via-blue-950 to-red-950 p-4 text-white flex items-center justify-between shadow-md select-none">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-tr from-red-600 to-blue-600 p-1.5 rounded-xl">
                <Sparkles size={18} className="text-white animate-pulse" />
              </div>
              <div>
                <h4 className="font-semibold text-sm tracking-wide">Companion</h4>
                <div className="flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-ping"></span>
                  <p className="text-[10px] text-gray-300">Official Assistant</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-300 hover:text-white p-1 rounded-full hover:bg-white/10 transition"
            >
              <X size={18} />
            </button>
          </div>

          {/* Message List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div className="flex items-start gap-2.5 max-w-[85%]">
                  {msg.role === "model" && (
                    <div className="w-7 h-7 rounded-lg bg-blue-900 flex items-center justify-center text-white shrink-0 mt-0.5 shadow">
                      <Bot size={14} />
                    </div>
                  )}
                  <div
                    className={`p-3 rounded-2xl text-xs leading-relaxed shadow-sm ${
                      msg.role === "user"
                        ? "bg-blue-900 text-white rounded-tr-none"
                        : "bg-white text-gray-800 border border-gray-100 rounded-tl-none"
                    }`}
                  >
                    {renderMessageText(msg.parts[0].text)}
                    <div
                      className={`text-[9px] mt-1 text-right ${
                        msg.role === "user" ? "text-blue-200" : "text-gray-400"
                      }`}
                    >
                      {msg.timestamp}
                    </div>
                  </div>
                  {msg.role === "user" && (
                    <div className="w-7 h-7 rounded-lg bg-red-600 flex items-center justify-center text-white shrink-0 mt-0.5 shadow">
                      <User size={14} />
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-900 flex items-center justify-center text-white shrink-0 shadow">
                    <Bot size={14} />
                  </div>
                  <div className="p-3 bg-white border border-gray-100 rounded-2xl rounded-tl-none flex items-center space-x-2 text-xs text-gray-500 shadow-sm">
                    <Loader2 size={14} className="animate-spin text-blue-900" />
                    <span>Analyzing ecosystem...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick suggestions if few messages */}
          {messages.length < 3 && !isLoading && (
            <div className="px-4 py-2 bg-white border-t border-gray-50 flex flex-wrap gap-1.5 select-none">
              {samplePrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(p)}
                  className="text-[10px] text-blue-900 bg-blue-50/50 hover:bg-blue-50 px-2.5 py-1.5 rounded-full border border-blue-100/50 transition font-medium flex items-center gap-1 shrink-0"
                >
                  {p} <ArrowRight size={10} />
                </button>
              ))}
            </div>
          )}

          {/* Message Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(input);
            }}
            className="p-3 bg-white border-t border-gray-100 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about Metaspace..."
              className="flex-1 px-3.5 py-2 text-xs bg-gray-50 hover:bg-gray-100/50 focus:bg-white border border-gray-200 focus:border-blue-900 rounded-xl focus:outline-none transition duration-150"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="w-8 h-8 rounded-xl bg-blue-900 hover:bg-blue-950 text-white flex items-center justify-center shrink-0 transition shadow disabled:opacity-50 disabled:hover:bg-blue-900"
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      )}

      {/* Floating Sparkle Toggle Button */}
      <button
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onClick={handleButtonClick}
        className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-900 via-blue-950 to-red-950 hover:from-blue-950 hover:to-red-900 text-white flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 border-2 border-white/25 group relative cursor-move select-none"
        aria-label="Companion Assistant"
      >
        {isOpen ? (
          <X size={22} className="pointer-events-none" />
        ) : (
          <div className="relative pointer-events-none">
            <MessageSquare size={22} className="group-hover:rotate-12 transition-transform duration-200" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          </div>
        )}
      </button>
    </div>
  );
}
