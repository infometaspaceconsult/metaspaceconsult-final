import React, { useState } from 'react';
import { SiteConfig, NavigationMenuItem } from '../../data/siteConfig';
import { useSiteConfig } from '../../context/SiteConfigContext';
import { MediaAssetController } from './MediaAssetController';
import { Logo } from '../Logo';
import {
  Palette,
  Compass,
  FileText,
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  Globe,
  Link,
  ShieldCheck,
  Check,
  Mail,
  Phone,
  MapPin,
  Save,
  Image as ImageIcon,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface GlobalBrandingCMSProps {
  formData: SiteConfig;
  onChange: (updated: Partial<SiteConfig>) => void;
  activeSubSection?: string;
}

export const GlobalBrandingCMS: React.FC<GlobalBrandingCMSProps> = ({
  formData,
  onChange,
  activeSubSection,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'nav' | 'palette' | 'footer'>('all');

  React.useEffect(() => {
    if (activeSubSection === 'global-nav') setActiveTab('nav');
    else if (activeSubSection === 'global-theme') setActiveTab('palette');
    else if (activeSubSection === 'global-footer') setActiveTab('footer');
  }, [activeSubSection]);

  const [newNavLabel, setNewNavLabel] = useState('');
  const [newNavUrl, setNewNavUrl] = useState('');
  const [newNavIsCta, setNewNavIsCta] = useState(false);

  const { saveToCloud, cloudSaveStatus } = useSiteConfig();
  const [paletteSavedNotice, setPaletteSavedNotice] = useState(false);
  const [isSavingPaletteLocal, setIsSavingPaletteLocal] = useState(false);

  const PALETTE_PRESETS = [
    {
      name: 'Sovereign Benin (Default)',
      primaryNavy: '#06132b',
      accentRed: '#dc2626',
      darkBg: '#050C17',
      lightBg: '#F8FAFC',
      displayFont: "'Playfair Display', serif",
      bodyFont: "'Plus Jakarta Sans', sans-serif",
    },
    {
      name: 'Royal Heritage Bronze',
      primaryNavy: '#1C1608',
      accentRed: '#D97706',
      darkBg: '#0F0B06',
      lightBg: '#FAFAF9',
      displayFont: "'Playfair Display', serif",
      bodyFont: "'Plus Jakarta Sans', sans-serif",
    },
    {
      name: 'Metaspace Dark Cobalt',
      primaryNavy: '#0A162B',
      accentRed: '#D9232A',
      darkBg: '#050C17',
      lightBg: '#F8FAFC',
      displayFont: "'Playfair Display', serif",
      bodyFont: "'Plus Jakarta Sans', sans-serif",
    },
    {
      name: 'Executive Slate & Ruby',
      primaryNavy: '#0F172A',
      accentRed: '#E11D48',
      darkBg: '#020617',
      lightBg: '#F8FAFC',
      displayFont: "'Playfair Display', serif",
      bodyFont: "'Inter', sans-serif",
    },
  ];

  const handleApplyPreset = (p: typeof PALETTE_PRESETS[0]) => {
    onChange({
      typographyPalette: {
        primaryNavy: p.primaryNavy,
        accentRed: p.accentRed,
        darkBg: p.darkBg,
        lightBg: p.lightBg,
        displayFont: p.displayFont,
        bodyFont: p.bodyFont,
      },
    });
  };

  const handleSavePaletteChanges = async () => {
    setIsSavingPaletteLocal(true);
    try {
      const mergedConfig: SiteConfig = {
        ...formData,
        typographyPalette: palette,
      };
      onChange({ typographyPalette: palette });
      const res = await saveToCloud(mergedConfig);
      if (res.success) {
        setPaletteSavedNotice(true);
        setTimeout(() => setPaletteSavedNotice(false), 4000);
      }
    } finally {
      setIsSavingPaletteLocal(false);
    }
  };

  const headerNav = formData.headerNav || [];
  const palette = formData.typographyPalette || {
    primaryNavy: '#06132b',
    accentRed: '#dc2626',
    darkBg: '#050C17',
    lightBg: '#F8FAFC',
    displayFont: "'Playfair Display', serif",
    bodyFont: "'Plus Jakarta Sans', sans-serif",
  };
  const footer = formData.footerConfig || {
    officeAddress: 'The Heritage Hall & Innovation Hub, Sapele Road',
    cityState: 'Benin City, Edo State, Nigeria',
    primaryEmail: 'secretariat@oghowa.africa',
    primaryPhone: '+234 812 000 4469',
    metaspaceCopyright: '© 2026 Metaspace Consult & Óghowa Accelerator. All Rights Reserved.',
    disclaimerNotice: 'Óghowa Accelerator and Oghowa Business Week are operating initiatives of Metaspace Consult.',
    privacyUrl: '#privacy',
    termsUrl: '#terms',
  };

  const handleAddNavItem = () => {
    if (!newNavLabel.trim()) return;
    const newItem: NavigationMenuItem = {
      id: `nav-${Date.now()}`,
      label: newNavLabel.trim(),
      url: newNavUrl.trim() || '#',
      order: headerNav.length + 1,
      isCta: newNavIsCta,
      active: true,
    };
    onChange({ headerNav: [...headerNav, newItem] });
    setNewNavLabel('');
    setNewNavUrl('');
    setNewNavIsCta(false);
  };

  const handleRemoveNavItem = (id: string) => {
    onChange({ headerNav: headerNav.filter((item) => item.id !== id) });
  };

  const handleMoveNav = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= headerNav.length) return;
    const items = [...headerNav];
    const [moved] = items.splice(index, 1);
    items.splice(targetIndex, 0, moved);
    const reordered = items.map((it, idx) => ({ ...it, order: idx + 1 }));
    onChange({ headerNav: reordered });
  };

  const handleToggleNavActive = (id: string) => {
    onChange({
      headerNav: headerNav.map((it) => (it.id === id ? { ...it, active: !it.active } : it)),
    });
  };

  return (
    <div className="space-y-8">
      {/* SECTION HEADER */}
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-xl font-bold text-[#06132b] flex items-center gap-2">
          <Globe className="w-5 h-5 text-red-600" />
          <span>Global & Branding CMS</span>
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Configure site-wide institutional branding, live navigation menus, corporate color palette, and statutory footer disclosures.
        </p>
      </div>

      {/* 0. OFFICIAL BRAND LOGO & VISUAL IDENTITY (APPLIES SYSTEM-WIDE) */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-red-600" />
              <span>Official Brand Logo & Master Visual Identity</span>
            </h3>
            <p className="text-xs text-slate-500">
              Upload or update the master brand logo. Changes here automatically apply site-wide to the Preloader, Header, Footer, and Admin workspaces.
            </p>
          </div>
          <span className="text-[11px] font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Live System-Wide Sync</span>
          </span>
        </div>

        {/* Live Logo Previews on Light and Dark Canvas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
          <div className="p-4 bg-white rounded-lg border border-slate-200 flex flex-col items-center justify-center text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">
              Light Canvas Preview (Navbar & Documents)
            </span>
            <div className="p-2 border border-slate-100 rounded-md bg-white">
              <Logo
                variant="light"
                brandName={formData.brand?.name}
                subTitle={formData.brand?.subTitle}
                logoUrl={formData.brand?.logoUrl}
              />
            </div>
          </div>

          <div className="p-4 bg-[#050D1E] rounded-lg border border-slate-800 flex flex-col items-center justify-center text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">
              Dark Canvas Preview (Preloader & Footer)
            </span>
            <div className="p-2 border border-slate-800 rounded-md bg-[#0A162B]">
              <Logo
                variant="dark"
                brandName={formData.brand?.name}
                subTitle={formData.brand?.subTitle}
                logoUrl={formData.brand?.logoUrl}
              />
            </div>
          </div>
        </div>

        {/* Upload / Image Asset Controller */}
        <MediaAssetController
          label="Master Brand Logo (PNG, SVG, or JPG)"
          value={formData.brand?.logoUrl || ''}
          onChange={(newUrl) =>
            onChange({
              brand: {
                ...formData.brand,
                logoUrl: newUrl,
              },
            })
          }
          recommendedAspect="1:1 Square or Transparent Vector"
          helperText="Upload transparent PNG/SVG or drag-and-drop your emblem file. Leave empty to use the default Benin Bronze royal insignia."
        />

        {/* Brand Name and Subtitle */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Primary Brand Name
            </label>
            <input
              type="text"
              value={formData.brand?.name || ''}
              onChange={(e) =>
                onChange({
                  brand: { ...formData.brand, name: e.target.value },
                })
              }
              placeholder="ÒGHOWA"
              className="w-full px-3 py-1.5 text-xs font-serif font-bold border border-slate-300 rounded-lg"
            />
            <span className="text-[10px] text-slate-400 mt-0.5 block">Used in logo typographic mark</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Institutional Subtitle / Initiative
            </label>
            <input
              type="text"
              value={formData.brand?.subTitle || ''}
              onChange={(e) =>
                onChange({
                  brand: { ...formData.brand, subTitle: e.target.value },
                })
              }
              placeholder="Oghowa Accelerator"
              className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
            />
            <span className="text-[10px] text-slate-400 mt-0.5 block">Appears next to or beneath brand mark</span>
          </div>
        </div>
      </div>

      {/* 1. HEADER & NAVIGATION MENU BUILDER */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Compass className="w-4 h-4 text-red-600" />
              <span>Header & Navigation Menu Builder</span>
            </h3>
            <p className="text-xs text-slate-500">
              Customize primary navigation menu items, ordering, and executive call-to-action buttons.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full">
            {headerNav.length} Links Active
          </span>
        </div>

        {/* Existing Nav Links */}
        <div className="space-y-2">
          {headerNav.map((item, idx) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{item.label}</span>
                    {item.isCta && (
                      <span className="text-[10px] bg-red-100 text-red-700 font-bold px-1.5 py-0.5 rounded">
                        CTA Button
                      </span>
                    )}
                    {!item.active && (
                      <span className="text-[10px] bg-slate-200 text-slate-600 font-semibold px-1.5 py-0.5 rounded">
                        Hidden
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-mono text-slate-500 block truncate">{item.url}</span>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => handleMoveNav(idx, 'up')}
                  disabled={idx === 0}
                  className="p-1 rounded hover:bg-slate-200 disabled:opacity-30 cursor-pointer text-slate-600"
                  title="Move link up"
                >
                  <MoveUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleMoveNav(idx, 'down')}
                  disabled={idx === headerNav.length - 1}
                  className="p-1 rounded hover:bg-slate-200 disabled:opacity-30 cursor-pointer text-slate-600"
                  title="Move link down"
                >
                  <MoveDown className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleNavActive(item.id)}
                  className={`px-2 py-1 text-[11px] font-semibold rounded cursor-pointer ${
                    item.active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {item.active ? 'Active' : 'Show'}
                </button>
                <button
                  type="button"
                  onClick={() => handleRemoveNavItem(item.id)}
                  className="p-1.5 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 cursor-pointer transition-colors"
                  title="Remove link"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Link Form */}
        <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
          <div className="sm:col-span-4">
            <input
              type="text"
              value={newNavLabel}
              onChange={(e) => setNewNavLabel(e.target.value)}
              placeholder="Label (e.g. Deal-Rooms)"
              className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
            />
          </div>
          <div className="sm:col-span-4">
            <input
              type="text"
              value={newNavUrl}
              onChange={(e) => setNewNavUrl(e.target.value)}
              placeholder="Target URL / Anchor (#deal-room)"
              className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white font-mono"
            />
          </div>
          <div className="sm:col-span-2 flex items-center gap-1.5">
            <label className="text-xs text-slate-700 flex items-center gap-1 cursor-pointer">
              <input
                type="checkbox"
                checked={newNavIsCta}
                onChange={(e) => setNewNavIsCta(e.target.checked)}
                className="rounded border-slate-300 text-red-600 focus:ring-red-500"
              />
              <span className="text-[11px] font-semibold">CTA Style</span>
            </label>
          </div>
          <div className="sm:col-span-2">
            <button
              type="button"
              onClick={handleAddNavItem}
              className="w-full px-3 py-1.5 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Link</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. GLOBAL TYPOGRAPHY & PALETTE */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-5">
        <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Palette className="w-4 h-4 text-red-600" />
              <span>Global Typography & Brand Palette</span>
            </h3>
            <p className="text-xs text-slate-500">
              Enforce institutional identity colors (Deep Navy <code className="text-slate-700 bg-slate-100 px-1 rounded">{palette.primaryNavy}</code> & Sovereign Accent <code className="text-red-700 bg-red-50 px-1 rounded">{palette.accentRed}</code>) and typography system.
            </p>
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 self-start sm:self-auto">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Dynamic CSS Sync
          </span>
        </div>

        {/* Quick Institutional Presets */}
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Curated Institutional Presets</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {PALETTE_PRESETS.map((p) => {
              const isSelected =
                palette.primaryNavy.toLowerCase() === p.primaryNavy.toLowerCase() &&
                palette.accentRed.toLowerCase() === p.accentRed.toLowerCase();
              return (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => handleApplyPreset(p)}
                  className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                    isSelected
                      ? 'border-red-500 bg-red-50/30 ring-1 ring-red-500 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex shrink-0 -space-x-1.5">
                    <span
                      className="w-5 h-5 rounded-full border border-white shadow-xs"
                      style={{ backgroundColor: p.primaryNavy }}
                    />
                    <span
                      className="w-5 h-5 rounded-full border border-white shadow-xs"
                      style={{ backgroundColor: p.accentRed }}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-slate-800 truncate">{p.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono truncate">{p.primaryNavy} • {p.accentRed}</div>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-red-600 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Form Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-1">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Primary Institutional Navy
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={palette.primaryNavy}
                onChange={(e) =>
                  onChange({
                    typographyPalette: { ...palette, primaryNavy: e.target.value },
                  })
                }
                className="w-9 h-9 rounded border border-slate-300 cursor-pointer p-0.5 bg-white"
              />
              <input
                type="text"
                value={palette.primaryNavy}
                onChange={(e) =>
                  onChange({
                    typographyPalette: { ...palette, primaryNavy: e.target.value },
                  })
                }
                className="w-full px-2.5 py-1.5 text-xs font-mono border border-slate-300 rounded-lg bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Sovereign Red Accent
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={palette.accentRed}
                onChange={(e) =>
                  onChange({
                    typographyPalette: { ...palette, accentRed: e.target.value },
                  })
                }
                className="w-9 h-9 rounded border border-slate-300 cursor-pointer p-0.5 bg-white"
              />
              <input
                type="text"
                value={palette.accentRed}
                onChange={(e) =>
                  onChange({
                    typographyPalette: { ...palette, accentRed: e.target.value },
                  })
                }
                className="w-full px-2.5 py-1.5 text-xs font-mono border border-slate-300 rounded-lg bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Display Font Family
            </label>
            <input
              type="text"
              value={palette.displayFont}
              onChange={(e) =>
                onChange({
                  typographyPalette: { ...palette, displayFont: e.target.value },
                })
              }
              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
            />
            <span className="text-[10px] text-slate-400 mt-0.5 block">Used for Summit Headings</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Body Font Family
            </label>
            <input
              type="text"
              value={palette.bodyFont}
              onChange={(e) =>
                onChange({
                  typographyPalette: { ...palette, bodyFont: e.target.value },
                })
              }
              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
            />
            <span className="text-[10px] text-slate-400 mt-0.5 block">Used for Paragraphs & Cards</span>
          </div>
        </div>

        {/* Live Interactive Preview Swatch */}
        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-500">
            <span>Live Typography & Palette Rendering</span>
            <span className="font-mono text-[10px] text-slate-400">Interactive Preview</span>
          </div>

          <div
            className="p-4 rounded-lg border shadow-xs transition-colors"
            style={{ backgroundColor: palette.primaryNavy, borderColor: palette.primaryNavy }}
          >
            <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
              <div
                className="text-lg font-black tracking-tight text-white"
                style={{ fontFamily: palette.displayFont }}
              >
                Óghowa Business Week 2026
              </div>
              <button
                type="button"
                className="px-3 py-1 rounded text-xs font-bold text-white shadow-xs transition-all"
                style={{ backgroundColor: palette.accentRed }}
              >
                Register / Apply
              </button>
            </div>
            <p
              className="text-xs text-slate-200 leading-relaxed max-w-xl font-normal"
              style={{ fontFamily: palette.bodyFont }}
            >
              54-Hour Intensive Sprint • Sovereign Deal-Rooms • Founders, Software Engineers & Institutional Capital converging across Edo State.
            </p>
          </div>
        </div>

        {/* Card Actions: Direct Save & Revert */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {paletteSavedNotice && (
              <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-lg text-xs font-semibold animate-in fade-in">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Palette successfully saved and synced to cloud!</span>
              </div>
            )}
            {!paletteSavedNotice && (
              <span className="text-xs text-slate-400">
                Changes take effect across the live website upon saving.
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleApplyPreset(PALETTE_PRESETS[0])}
              className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-medium cursor-pointer transition-colors flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Reset Default</span>
            </button>

            <button
              type="button"
              onClick={handleSavePaletteChanges}
              disabled={isSavingPaletteLocal || cloudSaveStatus === 'saving'}
              className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs cursor-pointer transition-all flex items-center gap-1.5 active:scale-95 disabled:opacity-60"
            >
              <Save className="w-3.5 h-3.5" />
              <span>
                {isSavingPaletteLocal || cloudSaveStatus === 'saving'
                  ? 'Saving Palette...'
                  : 'Save Palette Changes'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. INSTITUTIONAL FOOTER & LEGAL NOTICES */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-red-600" />
            <span>Institutional Footer & Legal Notices</span>
          </h3>
          <p className="text-xs text-slate-500">
            Verified Benin City secretariat contact information, parent entity copyright, and statutory disclaimers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Secretariat Physical Address
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={footer.officeAddress}
                onChange={(e) =>
                  onChange({
                    footerConfig: { ...footer, officeAddress: e.target.value },
                  })
                }
                className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              City, State & Sovereign Jurisdiction
            </label>
            <input
              type="text"
              value={footer.cityState}
              onChange={(e) =>
                onChange({
                  footerConfig: { ...footer, cityState: e.target.value },
                })
              }
              className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Primary Secretariat Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="email"
                value={footer.primaryEmail}
                onChange={(e) =>
                  onChange({
                    footerConfig: { ...footer, primaryEmail: e.target.value },
                  })
                }
                className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Secretariat Inquiries Phone
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={footer.primaryPhone}
                onChange={(e) =>
                  onChange({
                    footerConfig: { ...footer, primaryPhone: e.target.value },
                  })
                }
                className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Metaspace Consult Copyright Notice
          </label>
          <input
            type="text"
            value={footer.metaspaceCopyright}
            onChange={(e) =>
              onChange({
                footerConfig: { ...footer, metaspaceCopyright: e.target.value },
              })
            }
            className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Statutory Legal Disclaimer Notice
          </label>
          <textarea
            rows={2}
            value={footer.disclaimerNotice}
            onChange={(e) =>
              onChange({
                footerConfig: { ...footer, disclaimerNotice: e.target.value },
              })
            }
            className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};
