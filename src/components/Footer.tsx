import React from 'react';
import { SiteConfig } from '../types';
import { MetaspaceLogo } from './MetaspaceLogo';
import { Mail, Phone, MapPin, Lock, Linkedin, Twitter, Facebook, Instagram } from 'lucide-react';

interface FooterProps {
  config: SiteConfig;
  onOpenSuperadmin: () => void;
  isSuperadmin: boolean;
}

export const Footer: React.FC<FooterProps> = ({
  config,
  onOpenSuperadmin,
  isSuperadmin,
}) => {
  const { content, ventures } = config;

  return (
    <footer className="bg-[#0A0D36] text-white pt-16 pb-8 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Column 1: Brand & Tagline */}
          <div className="space-y-4">
            <MetaspaceLogo theme={{ ...config.theme, primaryNavy: '#ffffff' }} size="md" />
            <p className="text-xs text-slate-300 leading-relaxed pt-2">
              Building Systems. Empowering People. Transforming Africa.
            </p>
            <p className="text-[11px] text-slate-400">
              Venture design studio & digital transformation platform headquartered in Nigeria.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="p-2 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-lg transition">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-lg transition">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-lg transition">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-lg transition">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-red-400 mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li><a href="#hero" className="hover:text-white transition">Home</a></li>
              <li><a href="#whoweare" className="hover:text-white transition">About Us</a></li>
              <li><a href="#services" className="hover:text-white transition">What We Do</a></li>
              <li><a href="#metagen" className="hover:text-white transition">Metagen AI Suite</a></li>
              <li><a href="#ventures" className="hover:text-white transition">Our Ventures</a></li>
              <li><a href="#contact" className="hover:text-white transition">Contact & Booking</a></li>
            </ul>
          </div>

          {/* Column 3: Our Ventures */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-red-400 mb-4">Our Ventures</h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              {ventures.map((v) => (
                <li key={v.id}>
                  <a href="#ventures" className="hover:text-white transition flex items-center justify-between">
                    <span>{v.title}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Us */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-red-400 mb-4">Contact Us</h4>
            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-red-400 shrink-0" />
                <span>{content.contactEmail}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-red-400 shrink-0" />
                <span>{content.contactPhone}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{content.locationAddress}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Hidden Superadmin Gateway */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} Metaspace Consulting Limited. All rights reserved.</p>

          <div className="flex items-center gap-4">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:underline">Terms of Service</a>
            <span>•</span>

            {/* Hidden Superadmin Login Gateway */}
            <button
              onClick={onOpenSuperadmin}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition ${
                isSuperadmin
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-500 hover:text-slate-200'
              }`}
              title="Regulated Superadmin Gateway"
            >
              <Lock className="w-3 h-3" />
              <span>{isSuperadmin ? 'Superadmin Active' : 'Superadmin'}</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
