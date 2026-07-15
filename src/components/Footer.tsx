import React from "react";
import { Mail, Phone, MapPin, Linkedin, Twitter, Facebook, Instagram, ShieldCheck } from "lucide-react";
import { TabType } from "../types";
import MetaspaceLogo from "./MetaspaceLogo";

interface FooterProps {
  setCurrentTab: (tab: TabType) => void;
  onBookClick: () => void;
  logoUrl?: string;
  footerTagline?: string;
  footerDesc?: string;
  footerEmail?: string;
  footerPhone?: string;
  footerAddress?: string;
  footerLinkedin?: string;
  footerTwitter?: string;
  footerFacebook?: string;
  footerInstagram?: string;
  footerQuickLinks?: { label: string; tab: string }[];
  footerVenturesLinks?: { label: string; tab: string }[];
}

export default function Footer({
  setCurrentTab,
  onBookClick,
  logoUrl,
  footerTagline = "Building Systems. Empowering People. Transforming Africa.",
  footerDesc = "We design, build and scale innovative ventures and digital solutions that solve real problems and drive sustainable economic transformation across Africa.",
  footerEmail = "info@metaspaceconsulting.com",
  footerPhone = "+234 812 345 6789",
  footerAddress = "Benin City, Edo State, Nigeria",
  footerLinkedin = "https://linkedin.com/company/metaspace",
  footerTwitter = "https://twitter.com/metaspace",
  footerFacebook = "https://facebook.com/metaspace",
  footerInstagram = "https://instagram.com/metaspace",
  footerQuickLinks,
  footerVenturesLinks,
}: FooterProps) {
  const currentYear = new Date().getFullYear();

  const defaultQuickLinks = [
    { label: "About Us", tab: "about" },
    { label: "What We Do", tab: "what-we-do" },
    { label: "Our Ventures", tab: "ventures" },
    { label: "Insights", tab: "insights" },
    { label: "Contact Us", tab: "contact" }
  ];

  const defaultVenturesLinks = [
    { label: "Ugbekun Platform", tab: "ventures" },
    { label: "Oghowa Accelerator", tab: "ventures" },
    { label: "EduRide Logistics", tab: "ventures" },
    { label: "Cyona Medicare", tab: "ventures" }
  ];

  const quickLinksToRender = footerQuickLinks && footerQuickLinks.length > 0 ? footerQuickLinks : defaultQuickLinks;
  const venturesLinksToRender = footerVenturesLinks && footerVenturesLinks.length > 0 ? footerVenturesLinks : defaultVenturesLinks;

  const Logo = () => (
    <div className="flex items-center space-x-2.5 cursor-pointer" onClick={() => setCurrentTab("home")}>
      <MetaspaceLogo size={32} className="h-8 w-8" logoUrl={logoUrl} />
      <div className="flex flex-col">
        <span className="font-display font-extrabold text-[15px] tracking-[0.06em] text-white leading-none">
          METASPACE
        </span>
        <span className="font-sans font-bold text-[7px] tracking-[0.16em] text-brand-crimson uppercase leading-none mt-1">
          CONSULTING LIMITED
        </span>
      </div>
    </div>
  );

  return (
    <footer className="bg-brand-blue text-gray-300 pt-16 pb-24 md:pb-12 border-t border-white/5 relative overflow-hidden">
      {/* Decorative accent background grids */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16 pb-12 border-b border-white/10">
          
          {/* Logo & Tagline column */}
          <div className="md:col-span-6 lg:col-span-4 flex flex-col space-y-4">
            <Logo />
            <p className="text-xs text-gray-300 font-sans leading-relaxed max-w-sm font-medium">
              {footerTagline}
            </p>
            <p className="text-[11px] text-gray-400 font-sans leading-relaxed max-w-sm">
              {footerDesc}
            </p>
          </div>

          {/* Quick Links Column */}
          <div className="md:col-span-3 lg:col-span-2 flex flex-col space-y-4">
            <h4 className="text-xs font-bold tracking-widest text-white uppercase border-l-2 border-brand-crimson pl-2.5">
              Quick Links
            </h4>
            <ul className="space-y-3 text-xs">
              {quickLinksToRender.map((link, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => setCurrentTab(link.tab as TabType)}
                    className="text-gray-400 hover:text-white transition-all duration-200 transform hover:translate-x-1.5 text-left focus:outline-none inline-block font-sans"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Our Ventures Column */}
          <div className="md:col-span-3 lg:col-span-2 flex flex-col space-y-4">
            <h4 className="text-xs font-bold tracking-widest text-white uppercase border-l-2 border-brand-crimson pl-2.5">
              Our Ventures
            </h4>
            <ul className="space-y-3 text-xs">
              {venturesLinksToRender.map((link, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => setCurrentTab(link.tab as TabType)}
                    className="text-gray-400 hover:text-white transition-all duration-200 transform hover:translate-x-1.5 text-left focus:outline-none inline-block font-sans"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details Column */}
          <div className="md:col-span-12 lg:col-span-4 flex flex-col space-y-4">
            <h4 className="text-xs font-bold tracking-widest text-white uppercase border-l-2 border-brand-crimson pl-2.5">
              Contact Us
            </h4>
            <ul className="space-y-3.5 text-xs">
              {footerEmail && (
                <li className="flex items-start space-x-2.5">
                  <Mail size={15} className="text-brand-crimson shrink-0 mt-0.5" />
                  <a href={`mailto:${footerEmail}`} className="text-gray-400 hover:text-white transition-colors duration-200">
                    {footerEmail}
                  </a>
                </li>
              )}
              {footerPhone && (
                <li className="flex items-start space-x-2.5">
                  <Phone size={15} className="text-brand-crimson shrink-0 mt-0.5" />
                  <a href={`tel:${footerPhone.replace(/[^0-9+]/g, "")}`} className="text-gray-400 hover:text-white transition-colors duration-200">
                    {footerPhone}
                  </a>
                </li>
              )}
              {footerAddress && (
                <li className="flex items-start space-x-2.5">
                  <MapPin size={15} className="text-brand-crimson shrink-0 mt-0.5" />
                  <span className="text-gray-400">
                    {footerAddress}
                  </span>
                </li>
              )}
            </ul>

            {/* Social Icons */}
            <div className="flex items-center space-x-3 pt-2">
              {[
                { icon: <Linkedin size={15} />, href: footerLinkedin },
                { icon: <Twitter size={15} />, href: footerTwitter },
                { icon: <Facebook size={15} />, href: footerFacebook },
                { icon: <Instagram size={15} />, href: footerInstagram }
              ].filter(soc => soc.href).map((soc, idx) => (
                <a
                  key={idx}
                  href={soc.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-brand-crimson text-gray-400 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-sm"
                >
                  {soc.icon}
                </a>
              ))}
            </div>
          </div>

        </div>

        {/* Copyright & bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-500 font-sans">
          <p>© {currentYear} Metaspace Consulting Limited. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <button onClick={() => setCurrentTab("admin")} className="hover:text-gray-400 flex items-center gap-1">
              <ShieldCheck size={12} />
              <span>System Records Ledger</span>
            </button>
            <span className="text-gray-700">|</span>
            <button className="hover:text-gray-400">Privacy Policy</button>
            <span className="text-gray-700">|</span>
            <button className="hover:text-gray-400">Terms of Service</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
