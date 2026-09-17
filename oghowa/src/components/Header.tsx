import React, { useState, useEffect, useRef } from 'react';
import { Logo } from './Logo';
import { NavigationTab, ProgramId } from '../types';
import { ChevronDown, Menu, X, ArrowRight, Sparkles, Building2, TrendingUp, Users, Calendar, ShieldCheck, HelpCircle, Mail, FileText, Lock } from 'lucide-react';

interface HeaderProps {
  activeTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  onSelectProgram: (programId: ProgramId) => void;
  onOpenJoinModal: (role?: string) => void;
  onOpenLoginModal: () => void;
  onRequestExecutiveAccess?: () => void;
  onDownloadProspectus?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  onSelectProgram,
  onOpenJoinModal,
  onOpenLoginModal,
  onRequestExecutiveAccess,
  onDownloadProspectus,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [programsDropdownOpen, setProgramsDropdownOpen] = useState(false);
  const [ecosystemDropdownOpen, setEcosystemDropdownOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);

  const programsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const ecosystemTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const moreTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const programsList: { id: ProgramId; title: string; tagline: string; icon: any }[] = [
    {
      id: 'business-week',
      title: 'Oghowa Business Week',
      tagline: 'Institutional Leadership & Economic Summit',
      icon: Building2,
    },
    {
      id: 'innovation-weekend',
      title: 'Oghowa Innovation Weekend',
      tagline: 'Validate. Build. Pitch. Launch.',
      icon: Sparkles,
    },
    {
      id: 'incubation-program',
      title: 'Oghowa Incubation Program',
      tagline: 'Build. Validate. Grow.',
      icon: TrendingUp,
    },
    {
      id: 'venture-studio',
      title: 'Oghowa Venture Studio',
      tagline: 'We build ventures, together.',
      icon: Building2,
    },
    {
      id: 'capital-network',
      title: 'Oghowa Capital Network',
      tagline: 'Connect. Access. Raise.',
      icon: Users,
    },
  ];

  const ecosystemSections: { id: NavigationTab; title: string; desc: string }[] = [
    { id: 'home', title: 'Summit Overview', desc: 'Mandate & Economic Autonomy' },
    { id: 'governance', title: 'Advisory Council & Governance', desc: 'Steering Committee & EIN Alignment' },
    { id: 'pillars', title: 'Core Strategic Pillars', desc: 'Capital, Industry, Creative Economy, Energy' },
    { id: 'deal-room', title: 'Deal-Room & Investment', desc: 'Private Bilateral Sessions & Syndication' },
    { id: 'masterclasses', title: 'Executive Masterclasses', desc: 'Governance, AfCFTA, & Automation' },
    { id: 'pavilion', title: 'Innovation & Venture Pavilion', desc: 'Startup Alley & Technology Showcase' },
    { id: 'impact', title: 'Impact Commitments', desc: '≥ $50M Capital Mobilization & Policy White Paper' },
  ];

  const handleNavClick = (tab: NavigationTab) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
    setProgramsDropdownOpen(false);
    setEcosystemDropdownOpen(false);
    setMoreDropdownOpen(false);
  };

  const handleProgramClick = (programId: ProgramId) => {
    onSelectProgram(programId);
    setMobileMenuOpen(false);
    setProgramsDropdownOpen(false);
    setEcosystemDropdownOpen(false);
    setMoreDropdownOpen(false);
  };

  return (
    <header
      id="main-header"
      className={`sticky top-0 z-50 transition-all duration-200 bg-white ${
        isScrolled
          ? 'shadow-sm border-b border-slate-200/90 py-2.5'
          : 'border-b border-slate-100 py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left: Brand Logo (ÒGHOWA Our own) */}
        <div className="flex items-center gap-3">
          <Logo onClick={() => handleNavClick('home')} />
        </div>

        {/* Center: Desktop Navigation Bar with dropdowns matching the reference image */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {/* 1. Programs Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => {
              if (programsTimeoutRef.current) clearTimeout(programsTimeoutRef.current);
              setProgramsDropdownOpen(true);
            }}
            onMouseLeave={() => {
              programsTimeoutRef.current = setTimeout(() => setProgramsDropdownOpen(false), 150);
            }}
          >
            <button
              id="nav-programs-dropdown-btn"
              onClick={() => handleProgramClick('business-week')}
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-slate-700 hover:text-[#0022D6] rounded-md transition-colors cursor-pointer"
            >
              <span>Programs</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${programsDropdownOpen ? 'rotate-180 text-[#0022D6]' : ''}`} />
            </button>

            {programsDropdownOpen && (
              <div className="absolute top-full left-0 w-80 pt-2 z-50 animate-in fade-in duration-150">
                <div className="bg-white rounded-xl shadow-xl border border-slate-200 p-2.5 space-y-1">
                  <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1">
                    Oghowa Flagship Programs
                  </div>
                  {programsList.map((prog) => {
                    const IconComp = prog.icon;
                    return (
                      <button
                        key={prog.id}
                        onClick={() => handleProgramClick(prog.id)}
                        className="w-full text-left p-2 rounded-lg hover:bg-slate-50 transition-colors flex items-start gap-2.5 group cursor-pointer"
                      >
                        <div className="w-8 h-8 rounded-md bg-slate-100 group-hover:bg-red-50 text-slate-600 group-hover:text-[#D9232A] flex items-center justify-center shrink-0 mt-0.5 transition-colors">
                          <IconComp className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-[#0A162B] group-hover:text-[#0022D6] transition-colors">
                            {prog.title}
                          </div>
                          <div className="text-[11px] text-slate-500 line-clamp-1">
                            {prog.tagline}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* 2. Ecosystem Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => {
              if (ecosystemTimeoutRef.current) clearTimeout(ecosystemTimeoutRef.current);
              setEcosystemDropdownOpen(true);
            }}
            onMouseLeave={() => {
              ecosystemTimeoutRef.current = setTimeout(() => setEcosystemDropdownOpen(false), 150);
            }}
          >
            <button
              id="nav-ecosystem-dropdown-btn"
              onClick={() => handleNavClick('governance')}
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-slate-700 hover:text-[#0022D6] rounded-md transition-colors cursor-pointer"
            >
              <span>Ecosystem</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${ecosystemDropdownOpen ? 'rotate-180 text-[#0022D6]' : ''}`} />
            </button>

            {ecosystemDropdownOpen && (
              <div className="absolute top-full left-0 w-84 pt-2 z-50 animate-in fade-in duration-150">
                <div className="bg-white rounded-xl shadow-xl border border-slate-200 p-2.5 space-y-1">
                  <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1">
                    Summit Architecture & Leadership
                  </div>
                  {ecosystemSections.map((sec) => (
                    <button
                      key={sec.id}
                      onClick={() => handleNavClick(sec.id)}
                      className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-between group cursor-pointer"
                    >
                      <div>
                        <div className="text-xs font-bold text-[#0A162B] group-hover:text-[#0022D6] transition-colors">
                          {sec.title}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {sec.desc}
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#0022D6] transition-colors shrink-0 ml-2" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 3. Ventures Tab */}
          <button
            id="nav-ventures-tab"
            onClick={() => handleNavClick('pavilion')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'pavilion'
                ? 'text-[#0022D6] font-semibold bg-blue-50/70'
                : 'text-slate-700 hover:text-[#0022D6] hover:bg-slate-50'
            }`}
          >
            Ventures
          </button>

          {/* 4. Capital Tab */}
          <button
            id="nav-capital-tab"
            onClick={() => handleNavClick('deal-room')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'deal-room'
                ? 'text-[#0022D6] font-semibold bg-blue-50/70'
                : 'text-slate-700 hover:text-[#0022D6] hover:bg-slate-50'
            }`}
          >
            Capital
          </button>

          {/* 5. Partners Tab */}
          <button
            id="nav-partners-tab"
            onClick={() => handleNavClick('partnership')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'partnership'
                ? 'text-[#0022D6] font-semibold bg-blue-50/70'
                : 'text-slate-700 hover:text-[#0022D6] hover:bg-slate-50'
            }`}
          >
            Partners
          </button>

          {/* 6. Events Tab */}
          <button
            id="nav-events-tab"
            onClick={() => handleNavClick('events')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'events'
                ? 'text-[#0022D6] font-semibold bg-blue-50/70'
                : 'text-slate-700 hover:text-[#0022D6] hover:bg-slate-50'
            }`}
          >
            Events
          </button>

          {/* 7. About / More Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => {
              if (moreTimeoutRef.current) clearTimeout(moreTimeoutRef.current);
              setMoreDropdownOpen(true);
            }}
            onMouseLeave={() => {
              moreTimeoutRef.current = setTimeout(() => setMoreDropdownOpen(false), 150);
            }}
          >
            <button
              id="nav-about-dropdown-btn"
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-slate-700 hover:text-[#0022D6] rounded-md transition-colors cursor-pointer"
            >
              <span>About</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${moreDropdownOpen ? 'rotate-180 text-[#0022D6]' : ''}`} />
            </button>

            {moreDropdownOpen && (
              <div className="absolute top-full right-0 w-64 pt-2 z-50 animate-in fade-in duration-150">
                <div className="bg-white rounded-xl shadow-xl border border-slate-200 p-2 space-y-1">
                  <button
                    onClick={() => handleNavClick('governance')}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#0022D6] rounded-lg transition-colors flex items-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4 text-slate-400" />
                    <span>Advisory Council & Governance</span>
                  </button>
                  <button
                    onClick={() => {
                      const faqEl = document.getElementById('summit-faq');
                      if (faqEl) faqEl.scrollIntoView({ behavior: 'smooth' });
                      setMoreDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#0022D6] rounded-lg transition-colors flex items-center gap-2"
                  >
                    <HelpCircle className="w-4 h-4 text-slate-400" />
                    <span>Frequently Asked Questions</span>
                  </button>
                  <button
                    onClick={() => handleNavClick('inquiries')}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#0022D6] rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4 text-slate-400" />
                    <span>Inquiries & Secretariat</span>
                  </button>
                  <button
                    onClick={() => handleNavClick('admin')}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#D9232A] rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Lock className="w-4 h-4 text-slate-400" />
                    <span>Secretariat & Admin Portal</span>
                  </button>
                  <div className="my-1 border-t border-slate-100" />
                  {onDownloadProspectus && (
                    <button
                      onClick={() => {
                        setMoreDropdownOpen(false);
                        onDownloadProspectus();
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-2 font-medium"
                    >
                      <FileText className="w-4 h-4 text-[#D9232A]" />
                      <span>Download Executive Prospectus</span>
                    </button>
                  )}
                  {onRequestExecutiveAccess && (
                    <button
                      onClick={() => {
                        setMoreDropdownOpen(false);
                        onRequestExecutiveAccess();
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-[#0A162B] hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-2 font-medium"
                    >
                      <Lock className="w-4 h-4 text-[#0022D6]" />
                      <span>Request Deal-Room Access</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* 
          Right: EXACT matching buttons from the reference image:
          - Red button: "Join Oghowa"
          - White button with border: "Login"
          (Removed "Prospectus" and "Executive Access" from the nav bar as requested)
        */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            id="header-join-oghowa-btn"
            onClick={() => onOpenJoinModal('founder')}
            className="px-5 py-2 text-xs sm:text-sm font-bold text-white bg-[#D9232A] hover:bg-[#B9181F] active:scale-[0.98] transition-all rounded-full shadow-sm cursor-pointer"
          >
            Join Oghowa
          </button>

          <button
            id="header-login-btn"
            onClick={onOpenLoginModal}
            className="px-5 py-2 text-xs sm:text-sm font-semibold text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 active:scale-[0.98] transition-all rounded-full shadow-2xs cursor-pointer"
          >
            Login
          </button>
        </div>

        {/* Mobile menu hamburger toggle */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            onClick={() => onOpenJoinModal('founder')}
            className="px-3 py-1.5 text-xs font-bold text-white bg-[#D9232A] rounded-full"
          >
            Join
          </button>
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-drawer-nav"
          className="lg:hidden fixed inset-x-0 top-[60px] bg-white border-b border-slate-200 shadow-2xl p-5 max-h-[85vh] overflow-y-auto animate-in slide-in-from-top-2 duration-200 z-50 space-y-4"
        >
          {/* Programs Section */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Flagship Programs
            </div>
            <div className="space-y-1">
              {programsList.map((prog) => (
                <button
                  key={prog.id}
                  onClick={() => handleProgramClick(prog.id)}
                  className="w-full text-left px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50 rounded-lg flex items-center justify-between"
                >
                  <span>{prog.title}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
              ))}
            </div>
          </div>

          {/* Summit Navigation */}
          <div className="pt-2 border-t border-slate-100">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Summit & Ecosystem
            </div>
            <div className="space-y-1">
              <button
                onClick={() => handleNavClick('home')}
                className="w-full text-left px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50 rounded-lg"
              >
                Summit Overview
              </button>
              <button
                onClick={() => handleNavClick('governance')}
                className="w-full text-left px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50 rounded-lg"
              >
                Governance & Advisory Council
              </button>
              <button
                onClick={() => handleNavClick('pillars')}
                className="w-full text-left px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50 rounded-lg"
              >
                Strategic Pillars
              </button>
              <button
                onClick={() => handleNavClick('deal-room')}
                className="w-full text-left px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50 rounded-lg"
              >
                Capital & Deal Room
              </button>
              <button
                onClick={() => handleNavClick('pavilion')}
                className="w-full text-left px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50 rounded-lg"
              >
                Ventures & Innovation Pavilion
              </button>
              <button
                onClick={() => handleNavClick('partnership')}
                className="w-full text-left px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50 rounded-lg"
              >
                Institutional Partnership
              </button>
              <button
                onClick={() => {
                  const faqEl = document.getElementById('summit-faq');
                  if (faqEl) faqEl.scrollIntoView({ behavior: 'smooth' });
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50 rounded-lg"
              >
                FAQ & Inquiries
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2.5">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenJoinModal('founder');
              }}
              className="w-full py-3 text-sm font-bold text-white bg-[#D9232A] hover:bg-[#B9181F] rounded-full shadow text-center"
            >
              Join Oghowa
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenLoginModal();
              }}
              className="w-full py-2.5 text-sm font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-full text-center"
            >
              Login
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
