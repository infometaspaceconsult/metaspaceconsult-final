import React, { useState } from 'react';
import { useSiteConfig } from '../context/SiteConfigContext';
import {
  X,
  Sliders,
  Sparkles,
  FileCode,
  RotateCcw,
  Copy,
  Check,
  Building,
  Type,
  Phone,
  Play,
  Layers,
  HelpCircle,
} from 'lucide-react';

interface SiteCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReplayPreloader: () => void;
}

export const SiteCustomizerModal: React.FC<SiteCustomizerModalProps> = ({
  isOpen,
  onClose,
  onReplayPreloader,
}) => {
  const {
    config,
    updateBrand,
    updateHero,
    updateContact,
    updateSettings,
    resetToDefault,
    exportConfigJson,
  } = useSiteConfig();

  const [activeTab, setActiveTab] = useState<'hero' | 'brand' | 'contact' | 'settings' | 'guide'>('hero');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyConfig = () => {
    navigator.clipboard.writeText(
      `// Replace the contents of defaultSiteConfig in src/data/siteConfig.ts with:\nexport const defaultSiteConfig = ${exportConfigJson()};`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl relative border border-slate-200 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-50 text-[#D9232A] flex items-center justify-center">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#0A162B]">
                Site Content & Configuration
              </h3>
              <p className="text-xs text-slate-500">
                Change text, headlines, contact details, and test animations live.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1.5 pt-3 pb-3 border-b border-slate-100 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('hero')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors shrink-0 ${
              activeTab === 'hero'
                ? 'bg-[#0A162B] text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            <span>Hero & Headlines</span>
          </button>
          <button
            onClick={() => setActiveTab('brand')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors shrink-0 ${
              activeTab === 'brand'
                ? 'bg-[#0A162B] text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>Brand Identity</span>
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors shrink-0 ${
              activeTab === 'contact'
                ? 'bg-[#0A162B] text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Contact & Social</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors shrink-0 ${
              activeTab === 'settings'
                ? 'bg-[#0A162B] text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Animations</span>
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors shrink-0 ${
              activeTab === 'guide'
                ? 'bg-[#D9232A] text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Where to Edit Files</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1 text-xs sm:text-sm">
          {/* TAB 1: HERO */}
          {activeTab === 'hero' && (
            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Hero Eyebrow Badge
                </label>
                <input
                  type="text"
                  value={config.hero.eyebrow}
                  onChange={(e) => updateHero({ eyebrow: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Main Headline Line 1
                  </label>
                  <input
                    type="text"
                    value={config.hero.headlineLine1}
                    onChange={(e) => updateHero({ headlineLine1: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Main Headline Line 2
                  </label>
                  <input
                    type="text"
                    value={config.hero.headlineLine2}
                    onChange={(e) => updateHero({ headlineLine2: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Hero Description / Mission
                </label>
                <textarea
                  rows={3}
                  value={config.hero.description}
                  onChange={(e) => updateHero({ description: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Primary Button Label
                  </label>
                  <input
                    type="text"
                    value={config.hero.primaryCtaText}
                    onChange={(e) => updateHero({ primaryCtaText: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Secondary Button Label
                  </label>
                  <input
                    type="text"
                    value={config.hero.secondaryCtaText}
                    onChange={(e) => updateHero({ secondaryCtaText: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BRAND */}
          {activeTab === 'brand' && (
            <div className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Brand Name
                  </label>
                  <input
                    type="text"
                    value={config.brand.name}
                    onChange={(e) => updateBrand({ name: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Sub-Brand Title
                  </label>
                  <input
                    type="text"
                    value={config.brand.subTitle}
                    onChange={(e) => updateBrand({ subTitle: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tagline
                </label>
                <input
                  type="text"
                  value={config.brand.tagline}
                  onChange={(e) => updateBrand({ tagline: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Footer Summary Text
                </label>
                <textarea
                  rows={3}
                  value={config.brand.shortAbout}
                  onChange={(e) => updateBrand({ shortAbout: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* TAB 3: CONTACT */}
          {activeTab === 'contact' && (
            <div className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    General Inquiries Email
                  </label>
                  <input
                    type="email"
                    value={config.contact.email}
                    onChange={(e) => updateContact({ email: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Investor Deal Room Email
                  </label>
                  <input
                    type="email"
                    value={config.contact.dealRoomEmail}
                    onChange={(e) => updateContact({ dealRoomEmail: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={config.contact.phone}
                    onChange={(e) => updateContact({ phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Physical Location
                  </label>
                  <input
                    type="text"
                    value={config.contact.location}
                    onChange={(e) => updateContact({ location: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ANIMATIONS & PRELOADER */}
          {activeTab === 'settings' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block text-xs sm:text-sm">
                    Replay Logo Preloader
                  </span>
                  <span className="text-xs text-slate-500 block mt-0.5">
                    View the full animated intro with the spinning coral beaded emblem.
                  </span>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onReplayPreloader();
                  }}
                  className="px-3.5 py-2 rounded-lg bg-[#D9232A] text-white font-semibold text-xs hover:bg-[#B9181F] transition-colors flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Play Intro</span>
                </button>
              </div>

              <div className="space-y-2.5">
                <label className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                  <div>
                    <span className="text-xs font-semibold text-slate-800 block">
                      Enable Scroll Fade-In Animations
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Uses IntersectionObserver for smooth upward entrance on titles and cards.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.settings.enableScrollAnimations}
                    onChange={(e) => updateSettings({ enableScrollAnimations: e.target.checked })}
                    className="w-4 h-4 text-red-600 rounded focus:ring-red-500 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                  <div>
                    <span className="text-xs font-semibold text-slate-800 block">
                      Enable Logo Hover Particle Follower
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Shows an orbiting glowing tracer around the royal emblem.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.settings.enableLogoFollower}
                    onChange={(e) => updateSettings({ enableLogoFollower: e.target.checked })}
                    className="w-4 h-4 text-red-600 rounded focus:ring-red-500 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                  <div>
                    <span className="text-xs font-semibold text-slate-800 block">
                      Show Preloader On Page Open
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Automatically play the animated intro on fresh visits.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.settings.enablePreloader}
                    onChange={(e) => updateSettings({ enablePreloader: e.target.checked })}
                    className="w-4 h-4 text-red-600 rounded focus:ring-red-500 cursor-pointer"
                  />
                </label>
              </div>
            </div>
          )}

          {/* TAB 5: WHERE TO EDIT FILES IN CODE */}
          {activeTab === 'guide' && (
            <div className="space-y-3">
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-xs leading-relaxed">
                <span className="font-bold block mb-1">💡 Quick File Reference Map:</span>
                Here are the exact files in the codebase to change any part of the site permanently:
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="font-bold text-slate-900 block font-mono text-[11px] text-red-700">
                    /src/data/siteConfig.ts
                  </span>
                  <span className="text-slate-600">
                    Main headlines, mission statement, contact email, phone, location, and social media handles.
                  </span>
                </div>

                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="font-bold text-slate-900 block font-mono text-[11px] text-red-700">
                    /src/data/mockData.ts
                  </span>
                  <span className="text-slate-600">
                    Audience roles, the 6 journey stages, 6 flagship programs, impact statistics (100+ ventures, ₦500M+), featured portfolio startups, and partners list.
                  </span>
                </div>

                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="font-bold text-slate-900 block font-mono text-[11px] text-red-700">
                    /src/components/Logo.tsx
                  </span>
                  <span className="text-slate-600">
                    The SVG emblem of the Benin royal ivory crown, coral bead ring, and jewel animations.
                  </span>
                </div>

                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="font-bold text-slate-900 block font-mono text-[11px] text-red-700">
                    /src/components/Preloader.tsx
                  </span>
                  <span className="text-slate-600">
                    The animated initial loading screen with progress percentage and glowing crest follower.
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleCopyConfig}
                  className="w-full py-2.5 px-3 bg-[#0A162B] hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Copied Current Configuration to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Current Edits to Paste in siteConfig.ts</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
          <button
            onClick={resetToDefault}
            className="text-slate-500 hover:text-slate-800 flex items-center gap-1.5 transition-colors cursor-pointer font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-[#0A162B] hover:bg-slate-800 text-white font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Done / Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
