import React, { useState } from "react";
import { Menu, X, Home, Users, Briefcase, FileText, Mail, ShieldAlert } from "lucide-react";
import { TabType } from "../types";
import MetaspaceLogo from "./MetaspaceLogo";

interface HeaderProps {
  currentTab: TabType;
  setCurrentTab: (tab: TabType) => void;
  onBookClick: () => void;
  logoUrl?: string;
}

export default function Header({ currentTab, setCurrentTab, onBookClick, logoUrl }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Logo component to render in headers/footers
  const Logo = () => (
    <div className="flex items-center space-x-2.5 cursor-pointer" onClick={() => { setCurrentTab("home"); setMobileMenuOpen(false); }}>
      <div className="relative flex items-center justify-center">
        <MetaspaceLogo size={32} className="h-8 w-8" logoUrl={logoUrl} />
      </div>
      <div className="flex flex-col">
        <span className="font-display font-extrabold text-[15px] tracking-[0.06em] text-brand-blue leading-none">
          METASPACE
        </span>
        <span className="font-sans font-bold text-[7px] tracking-[0.16em] text-brand-red uppercase leading-none mt-1">
          CONSULTING LIMITED
        </span>
      </div>
    </div>
  );

  const navItems: { id: TabType; label: string }[] = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "what-we-do", label: "What We Do" },
    { id: "ventures", label: "Ventures" },
    { id: "insights", label: "Insights" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <>
      {/* Desktop & Top Mobile Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Logo />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-7">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`relative py-2 text-xs font-medium uppercase tracking-wider transition-colors duration-200 ${
                  currentTab === item.id
                    ? "text-brand-red"
                    : "text-gray-600 hover:text-brand-blue"
                }`}
              >
                {item.label}
                {currentTab === item.id && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-brand-red rounded-full" />
                )}
              </button>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-3">
            <button
              onClick={() => setCurrentTab("admin")}
              className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition ${
                currentTab === "admin"
                  ? "bg-gray-100 border-gray-300 text-gray-800"
                  : "border-gray-200 text-gray-500 hover:text-brand-blue hover:bg-gray-50"
              }`}
              title="Admin Dashboard"
            >
              <ShieldAlert size={14} />
              <span>Admin Login</span>
            </button>
            <a
              href="https://worksuite.metaspaceconsult.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-500 hover:text-brand-blue hover:bg-gray-50 flex items-center gap-1.5 transition"
              title="Staff Login Workspace"
            >
              <Users size={14} />
              <span>Staff Login</span>
            </a>
            <button
              onClick={onBookClick}
              className="px-5 py-2.5 bg-brand-red hover:bg-brand-crimson text-white text-[11px] font-bold uppercase tracking-wider rounded-lg transition duration-200 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
            >
              Partner With Us
            </button>
          </div>

          {/* Mobile Hamburguer Toggle */}
          <div className="flex md:hidden items-center space-x-3">
            <button
              onClick={() => setCurrentTab("admin")}
              className={`p-1.5 rounded-lg border text-xs transition ${
                currentTab === "admin" ? "bg-gray-100 border-gray-300 text-gray-800" : "border-gray-200 text-gray-500"
              }`}
              title="Admin Login"
            >
              <ShieldAlert size={15} />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-600 hover:text-brand-blue rounded-lg hover:bg-gray-50 transition"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer (Slide down/overlay) */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-30 bg-black/50 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}>
          <div 
            className="absolute top-20 left-0 w-full bg-white border-b border-gray-100 shadow-2xl p-6 flex flex-col space-y-4 animate-in slide-in-from-top duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`text-left py-3 px-4 rounded-xl text-sm font-semibold transition ${
                  currentTab === item.id
                    ? "bg-brand-red/5 text-brand-red"
                    : "text-gray-700 hover:bg-gray-50 hover:text-brand-blue"
                }`}
              >
                {item.label}
              </button>
            ))}
            <div className="pt-4 border-t border-gray-100 flex flex-col space-y-3">
              <button
                onClick={() => {
                  setCurrentTab("admin");
                  setMobileMenuOpen(false);
                }}
                className="w-full py-3 border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-semibold rounded-xl text-center transition flex items-center justify-center gap-2"
              >
                <ShieldAlert size={14} className="text-gray-500" />
                <span>Admin Login</span>
              </button>
              <a
                href="https://worksuite.metaspaceconsult.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-semibold rounded-xl text-center transition flex items-center justify-center gap-2"
              >
                <Users size={14} className="text-gray-500" />
                <span>Staff Login</span>
              </a>
              <button
                onClick={() => {
                  onBookClick();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-3.5 bg-brand-red hover:bg-brand-crimson text-white text-xs font-bold uppercase tracking-wider rounded-xl text-center shadow transition"
              >
                Partner With Us
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Tab Bar (as shown in image 1) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 shadow-[0_-4px_10px_rgba(0,0,0,0.03)] px-4 py-2.5 flex items-center justify-around">
        <button
          onClick={() => setCurrentTab("home")}
          className={`flex flex-col items-center space-y-1 transition ${
            currentTab === "home" ? "text-brand-red" : "text-gray-400 hover:text-gray-600"
          }`}
        >
          <Home size={18} />
          <span className="text-[10px] font-semibold">Home</span>
        </button>
        
        <button
          onClick={() => setCurrentTab("about")}
          className={`flex flex-col items-center space-y-1 transition ${
            currentTab === "about" ? "text-brand-red" : "text-gray-400 hover:text-gray-600"
          }`}
        >
          <Users size={18} />
          <span className="text-[10px] font-semibold">About</span>
        </button>

        <button
          onClick={() => setCurrentTab("ventures")}
          className={`flex flex-col items-center space-y-1 transition ${
            currentTab === "ventures" ? "text-brand-red" : "text-gray-400 hover:text-gray-600"
          }`}
        >
          <Briefcase size={18} />
          <span className="text-[10px] font-semibold">Ventures</span>
        </button>

        <button
          onClick={() => setCurrentTab("insights")}
          className={`flex flex-col items-center space-y-1 transition ${
            currentTab === "insights" ? "text-brand-red" : "text-gray-400 hover:text-gray-600"
          }`}
        >
          <FileText size={18} />
          <span className="text-[10px] font-semibold">Insights</span>
        </button>

        <button
          onClick={() => setCurrentTab("contact")}
          className={`flex flex-col items-center space-y-1 transition ${
            currentTab === "contact" ? "text-brand-red" : "text-gray-400 hover:text-gray-600"
          }`}
        >
          <Mail size={18} />
          <span className="text-[10px] font-semibold">Contact</span>
        </button>
      </div>
    </>
  );
}
