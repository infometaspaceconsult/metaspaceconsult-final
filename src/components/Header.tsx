import React, { useState, useEffect } from 'react';
import { MetaspaceLogo } from './MetaspaceLogo';
import { SiteConfig } from '../types';
import { Menu, X, ShieldCheck, UserCheck, MessageSquare } from 'lucide-react';

interface HeaderProps {
  config: SiteConfig;
  onOpenConsultation: () => void;
  onOpenSuperadmin: () => void;
  onOpenCompanionChat: () => void;
  isSuperadmin: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  config,
  onOpenConsultation,
  onOpenSuperadmin,
  onOpenCompanionChat,
  isSuperadmin,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('HOME');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);

      // Section scrollSpy
      const sections = ['hero', 'whoweare', 'services', 'ventures', 'metagen', 'contact'];
      const scrollPos = window.scrollY + 120;

      for (const sec of sections) {
        const el = document.getElementById(sec);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            if (sec === 'hero') setActiveNav('HOME');
            else if (sec === 'whoweare') setActiveNav('ABOUT');
            else if (sec === 'services') setActiveNav('WHAT WE DO');
            else if (sec === 'ventures') setActiveNav('VENTURES');
            else if (sec === 'metagen') setActiveNav('INSIGHTS');
            else if (sec === 'contact') setActiveNav('CONTACT');
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'HOME', href: '#hero' },
    { name: 'ABOUT', href: '#whoweare' },
    { name: 'WHAT WE DO', href: '#services' },
    { name: 'VENTURES', href: '#ventures' },
    { name: 'INSIGHTS', href: '#metagen' },
    { name: 'CONTACT', href: '#contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm py-3 border-b border-slate-100'
          : 'bg-white py-4 border-b border-slate-100/60'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="#hero" className="flex items-center">
          <MetaspaceLogo theme={config.theme} size="md" />
        </a>

        {/* Navigation Links matching Image 1 */}
        <nav className="hidden xl:flex items-center space-x-6">
          {navLinks.map((link) => {
            const isActive = activeNav === link.name;
            return (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setActiveNav(link.name)}
                className={`text-xs font-bold uppercase tracking-wider py-1.5 relative transition-colors ${
                  isActive
                    ? 'text-[#E63946]'
                    : 'text-slate-600 hover:text-[#141B77]'
                }`}
              >
                {link.name}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[2.5px] bg-[#E63946] rounded-full animate-fadeIn" />
                )}
              </a>
            );
          })}
        </nav>

        {/* Action Buttons matching Image 1 */}
        <div className="hidden lg:flex items-center space-x-2.5">
          {/* Admin Login Button */}
          <button
            onClick={onOpenSuperadmin}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border transition cursor-pointer shadow-2xs ${
              isSuperadmin
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : 'bg-slate-50/80 border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-[#141B77]'
            }`}
            title="Superadmin Dashboard Gateway"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
            <span>Admin Login</span>
          </button>

          {/* Staff Login Direct Link -> https://worksuite.metaspaceconsult.com/ */}
          <a
            href="https://worksuite.metaspaceconsult.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-slate-200 bg-slate-50/80 text-slate-700 hover:bg-slate-100 hover:text-[#141B77] transition shadow-2xs"
            title="Staff Portal (Worksuite)"
          >
            <UserCheck className="w-3.5 h-3.5 text-slate-500" />
            <span>Staff Login</span>
          </a>

          {/* Partner With Us Button -> Open Consultation Popup */}
          <button
            onClick={onOpenConsultation}
            className="px-5 py-2.5 bg-[#E63946] hover:bg-[#d92332] text-white font-extrabold text-xs uppercase tracking-widest rounded-lg transition shadow-md shadow-red-500/20 cursor-pointer transform hover:-translate-y-0.5"
          >
            PARTNER WITH US
          </button>
        </div>

        {/* Mobile Toggle Button */}
        <div className="flex xl:hidden items-center space-x-2">
          <button
            onClick={onOpenConsultation}
            className="px-3 py-1.5 bg-[#E63946] text-white text-[11px] font-bold uppercase tracking-wider rounded-md"
          >
            Partner
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 shadow-xl animate-fadeIn">
          <div className="flex flex-col space-y-2.5">
            {navLinks.map((link) => (
              <a
                key={`mobile-${link.name}`}
                href={link.href}
                onClick={() => {
                  setActiveNav(link.name);
                  setMobileMenuOpen(false);
                }}
                className={`text-sm font-bold uppercase tracking-wider py-2 border-b border-slate-50 flex items-center justify-between ${
                  activeNav === link.name ? 'text-[#E63946]' : 'text-slate-800'
                }`}
              >
                <span>{link.name}</span>
                {activeNav === link.name && <span className="w-2 h-2 rounded-full bg-[#E63946]" />}
              </a>
            ))}

            <div className="pt-3 flex flex-col gap-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenSuperadmin();
                  }}
                  className="flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold rounded-lg border border-slate-200 bg-slate-50 text-slate-700"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
                  Admin Login
                </button>

                <a
                  href="https://worksuite.metaspaceconsult.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold rounded-lg border border-slate-200 bg-slate-50 text-slate-700"
                >
                  <UserCheck className="w-3.5 h-3.5 text-slate-500" />
                  Staff Login
                </a>
              </div>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenConsultation();
                }}
                className="w-full py-3 bg-[#E63946] text-white text-xs font-bold uppercase tracking-widest rounded-lg shadow-md"
              >
                PARTNER WITH US
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

