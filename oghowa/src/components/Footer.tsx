import React from 'react';
import { Logo } from './Logo';
import { NavigationTab, ProgramId } from '../types';
import { useSiteConfig } from '../context/SiteConfigContext';
import { SUMMIT_INQUIRIES } from '../data/summitData';
import { Mail, MapPin, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onSelectTab: (tab: NavigationTab) => void;
  onSelectProgram: (programId: ProgramId) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab, onSelectProgram }) => {
  const { config } = useSiteConfig();

  const summitSections: { label: string; tab: NavigationTab }[] = [
    { label: 'Summit Overview', tab: 'home' },
    { label: 'Advisory Council & Governance', tab: 'governance' },
    { label: 'Core Strategic Pillars', tab: 'pillars' },
    { label: 'Deal-Room & Investment Architecture', tab: 'deal-room' },
    { label: 'Executive Masterclasses', tab: 'masterclasses' },
    { label: 'Innovation & Venture Pavilion', tab: 'pavilion' },
    { label: 'Measurable Impact Commitments', tab: 'impact' },
    { label: 'Institutional Partnership Framework', tab: 'partnership' },
    { label: 'Inquiries & Advisory', tab: 'inquiries' },
  ];

  const socialLinks = [
    { name: 'LinkedIn', icon: 'in', href: config.socials.linkedin },
    { name: 'Twitter/X', icon: '𝕏', href: config.socials.twitter },
    { name: 'Instagram', icon: 'ig', href: config.socials.instagram },
    { name: 'YouTube', icon: 'yt', href: config.socials.youtube },
  ];

  return (
    <footer id="main-footer" className="bg-[#050D1E] text-slate-300 pt-16 pb-12 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-slate-800">
          {/* Col 1: Brand & Summit Info (5 cols) */}
          <div className="lg:col-span-5">
            <Logo variant="dark" onClick={() => onSelectTab('home')} />
            <div className="mt-3">
              <span className="text-xs font-mono uppercase tracking-wider text-red-400 font-semibold">
                Oghowa Business Week: Institutional Leadership & Economic Summit
              </span>
            </div>
            <p className="mt-3 text-xs sm:text-sm text-slate-400 leading-relaxed max-w-md">
              Architecting Edo State&apos;s Industrial Renaissance and Economic Autonomy. Convening policymakers, financial sector leaders, industrial pioneers, and institutional investors in Benin City to deploy capital, scale high-impact enterprises, and institutionalize long-term prosperity.
            </p>

            <div className="mt-6 space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-red-400" />
                <span>Inquiries: <a href={`mailto:${SUMMIT_INQUIRIES.email}`} className="text-white hover:underline">{SUMMIT_INQUIRIES.email}</a></span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-red-400" />
                <span>Location: {SUMMIT_INQUIRIES.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Strategic Alignment: Edo Investors Network (EIN)</span>
              </div>
            </div>

            <p className="mt-6 text-xs text-slate-500">
              © {config.brand.foundedYear} ÓGHOWA Ecosystem. All rights reserved.
            </p>
          </div>

          {/* Col 2: Summit Architecture Navigation (4 cols) */}
          <div className="lg:col-span-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Summit Architecture
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {summitSections.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => onSelectTab(item.tab)}
                  className="hover:text-red-400 text-slate-400 transition-colors cursor-pointer text-left py-1"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Col 3: Institutional Channels & Socials (3 cols) */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Institutional Channels
            </h4>
            <p className="text-xs text-slate-400 mb-4">
              All advisory briefs, sponsorship decks, and deal-room accreditations are facilitated through the executive secretariat in Benin City.
            </p>

            <div className="flex items-center gap-2 mb-6">
              {socialLinks.map((soc) => (
                <a
                  key={soc.name}
                  href={soc.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={soc.name}
                  className="w-8 h-8 rounded-full bg-slate-900 hover:bg-[#D9232A] text-white flex items-center justify-center text-xs font-bold transition-colors border border-slate-700"
                >
                  {soc.icon}
                </a>
              ))}
            </div>

            <span className="text-[11px] font-semibold text-slate-500 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-md inline-block">
              Target: ≥ $50M Capital Mobilization
            </span>
          </div>
        </div>

        {/* Footnote */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-4">
          <p>
            Benin City, Edo State, Nigeria • In Strategic Alignment with Edo Investors Network (EIN)
          </p>
          <div className="flex items-center gap-4 flex-wrap">
            <a href="#governance" className="hover:text-slate-400 transition-colors">Governance Charter</a>
            <span>•</span>
            <a href="#deal-room" className="hover:text-slate-400 transition-colors">Deal-Room NDA</a>
            <span>•</span>
            <a href="#inquiries" className="hover:text-slate-400 transition-colors">Secretariat Inquiries</a>
            <span>•</span>
            <button
              onClick={() => onSelectTab('admin')}
              className="hover:text-slate-300 text-slate-500 transition-colors flex items-center gap-1 cursor-pointer"
              title="Secretariat Admin Dashboard (/admin)"
            >
              <ShieldCheck className="w-3 h-3 text-red-500" />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
