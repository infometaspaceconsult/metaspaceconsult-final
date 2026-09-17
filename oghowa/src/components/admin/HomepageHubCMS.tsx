import React, { useState } from 'react';
import {
  SiteConfig,
  WhoWeServeCard,
  JourneyStepConfig,
  InfrastructureEnablerConfig,
  StrategicPartnerLogoConfig,
  VentureItem,
} from '../../data/siteConfig';
import { MediaAssetController } from './MediaAssetController';
import {
  Layout,
  Layers,
  Sparkles,
  TrendingUp,
  Building2,
  Rocket,
  Plus,
  Trash2,
  Edit2,
  Check,
  Globe,
  Sliders,
  Award,
  Link,
  ChevronRight,
  ExternalLink,
  ArrowUp,
  ArrowDown,
  X,
} from 'lucide-react';

interface HomepageHubCMSProps {
  formData: SiteConfig;
  onChange: (updated: Partial<SiteConfig>) => void;
  activeSubSection?: string;
}

export const HomepageHubCMS: React.FC<HomepageHubCMSProps> = ({
  formData,
  onChange,
  activeSubSection,
}) => {
  const [activeSection, setActiveSection] = useState<
    'hero' | 'tracks' | 'serve' | 'journey' | 'infra' | 'impact' | 'ventures' | 'partners'
  >('hero');

  React.useEffect(() => {
    if (activeSubSection) {
      const valid = ['hero', 'tracks', 'serve', 'journey', 'infra', 'impact', 'ventures', 'partners'];
      if (valid.includes(activeSubSection)) {
        setActiveSection(activeSubSection as any);
      }
    }
  }, [activeSubSection]);

  // Sub-items states
  const hero = formData.hero;
  const whoWeServe = formData.whoWeServe || [];
  const journey = formData.journeyRoadmap || [];
  const infrastructure = formData.infrastructureEnablers || [];
  const impactMetrics = formData.impactMetrics;
  const ventures = formData.featuredVentures || [];
  const partners = formData.strategicPartners || [];

  // Add Venture modal state
  const [newVenture, setNewVenture] = useState<VentureItem>({
    id: `ven-${Date.now()}`,
    name: '',
    sector: 'EdTech & Operating Systems',
    tagline: '',
    description: '',
    logoText: 'OGH',
    badgeColor: 'bg-red-50 text-red-700 border-red-200',
    link: '#',
  });
  const [isAddingVenture, setIsAddingVenture] = useState(false);
  const [editingVenture, setEditingVenture] = useState<VentureItem | null>(null);

  // Add Partner state
  const [newPartner, setNewPartner] = useState<StrategicPartnerLogoConfig>({
    id: `part-${Date.now()}`,
    name: '',
    category: 'Technology Partner',
    badge: 'Strategic Enabler',
    logoUrl: '',
    websiteUrl: '#',
  });
  const [isAddingPartner, setIsAddingPartner] = useState(false);
  const [editingPartner, setEditingPartner] = useState<StrategicPartnerLogoConfig | null>(null);

  // Audience track state
  const [newTrack, setNewTrack] = useState('');

  const handleAddTrack = () => {
    if (!newTrack.trim()) return;
    onChange({
      hero: {
        ...hero,
        audienceTracks: [...(hero.audienceTracks || []), newTrack.trim()],
      },
    });
    setNewTrack('');
  };

  const handleRemoveTrack = (index: number) => {
    onChange({
      hero: {
        ...hero,
        audienceTracks: hero.audienceTracks.filter((_, idx) => idx !== index),
      },
    });
  };

  const handleSaveNewVenture = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVenture.name.trim()) return;
    onChange({
      featuredVentures: [
        ...ventures,
        {
          ...newVenture,
          id: `ven-${Date.now()}`,
          logoText: newVenture.logoText || newVenture.name.slice(0, 3).toUpperCase(),
        },
      ],
    });
    setIsAddingVenture(false);
    setNewVenture({
      id: `ven-${Date.now()}`,
      name: '',
      sector: 'EdTech & Operating Systems',
      tagline: '',
      description: '',
      logoText: 'OGH',
      badgeColor: 'bg-red-50 text-red-700 border-red-200',
      logoUrl: '',
      link: '#',
    });
  };

  const handleUpdateVenture = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVenture || !editingVenture.name.trim()) return;
    const updated = ventures.map((v) => (v.id === editingVenture.id ? editingVenture : v));
    onChange({ featuredVentures: updated });
    setEditingVenture(null);
  };

  const handleMoveVenture = (idx: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= ventures.length) return;
    const updated = [...ventures];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;
    onChange({ featuredVentures: updated });
  };

  const handleRemoveVenture = (id: string) => {
    onChange({
      featuredVentures: ventures.filter((v) => v.id !== id),
    });
  };

  const handleSaveNewPartner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPartner.name.trim()) return;
    onChange({
      strategicPartners: [
        ...partners,
        { ...newPartner, id: `part-${Date.now()}` },
      ],
    });
    setIsAddingPartner(false);
    setNewPartner({
      id: `part-${Date.now()}`,
      name: '',
      category: 'Technology Partner',
      badge: 'Strategic Enabler',
      logoUrl: '',
      websiteUrl: '#',
    });
  };

  const handleUpdatePartner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPartner || !editingPartner.name.trim()) return;
    const updated = partners.map((p) => (p.id === editingPartner.id ? editingPartner : p));
    onChange({ strategicPartners: updated });
    setEditingPartner(null);
  };

  const handleMovePartner = (idx: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= partners.length) return;
    const updated = [...partners];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;
    onChange({ strategicPartners: updated });
  };

  const handleRemovePartner = (id: string) => {
    onChange({
      strategicPartners: partners.filter((p) => p.id !== id),
    });
  };

  return (
    <div className="space-y-8">
      {/* SECTION HEADER */}
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-xl font-bold text-[#06132b] flex items-center gap-2">
          <Layout className="w-5 h-5 text-red-600" />
          <span>Homepage Hub CMS</span>
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Full content management for the public ecosystem gateway: Hero slider, audience tracks, roadmap, infrastructure grid, metrics, and venture showcase.
        </p>
      </div>

      {/* SUB-SECTION SELECTOR TABS */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {[
          { id: 'hero', label: '1. Hero & Backgrounds', icon: Sparkles },
          { id: 'tracks', label: '2. Audience Track Ribbon', icon: Sliders },
          { id: 'serve', label: '3. "Who We Serve" Matrix', icon: Building2 },
          { id: 'journey', label: '4. 6-Step Roadmap', icon: Rocket },
          { id: 'infra', label: '5. Infrastructure Grid', icon: Layers },
          { id: 'impact', label: '6. Impact Metrics', icon: TrendingUp },
          { id: 'ventures', label: '7. Featured Ventures', icon: Award },
          { id: 'partners', label: '8. Strategic Partners', icon: Globe },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSection(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-red-400' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. HERO BANNER & IMAGE SLIDER */}
      {activeSection === 'hero' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-red-600" />
              <span>Hero Banner & Visual Media Slider</span>
            </h3>
            <p className="text-xs text-slate-500">
              Customize the gateway value proposition, action buttons, and high-impact background imagery.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Eyebrow Badge Notice
              </label>
              <input
                type="text"
                value={hero.eyebrow}
                onChange={(e) => onChange({ hero: { ...hero, eyebrow: e.target.value } })}
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Headline Line 1 (Primary)
              </label>
              <input
                type="text"
                value={hero.headlineLine1}
                onChange={(e) => onChange({ hero: { ...hero, headlineLine1: e.target.value } })}
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Headline Line 2 (Accent)
              </label>
              <input
                type="text"
                value={hero.headlineLine2}
                onChange={(e) => onChange({ hero: { ...hero, headlineLine2: e.target.value } })}
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg font-bold text-red-700"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Executive Hero Description
              </label>
              <textarea
                rows={3}
                value={hero.description}
                onChange={(e) => onChange({ hero: { ...hero, description: e.target.value } })}
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Primary CTA Button Label
              </label>
              <input
                type="text"
                value={hero.primaryCtaText}
                onChange={(e) => onChange({ hero: { ...hero, primaryCtaText: e.target.value } })}
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Secondary CTA Button Label
              </label>
              <input
                type="text"
                value={hero.secondaryCtaText}
                onChange={(e) => onChange({ hero: { ...hero, secondaryCtaText: e.target.value } })}
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
              />
            </div>
          </div>

          {/* Background Images Slider */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Hero Background Imagery Carousel ({hero.carouselImages?.length || 0} Assets)
            </h4>
            <div className="space-y-3">
              {(hero.carouselImages || []).map((imgUrl, idx) => (
                <MediaAssetController
                  key={idx}
                  label={`Hero Slide #${idx + 1}`}
                  value={imgUrl}
                  onChange={(newUrl) => {
                    const updated = [...(hero.carouselImages || [])];
                    updated[idx] = newUrl;
                    onChange({ hero: { ...hero, carouselImages: updated } });
                  }}
                  helperText="High-resolution hero backdrop displayed in automated transition loop."
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. AUDIENCE TRACK RIBBON */}
      {activeSection === 'tracks' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-red-600" />
              <span>Audience Track Ribbon</span>
            </h3>
            <p className="text-xs text-slate-500">
              Audience stakeholder tracks displayed under the hero banner (Founders, Investors, Corporates, Government, etc.).
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {(hero.audienceTracks || []).map((track, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 bg-slate-100 text-slate-800 rounded-lg text-xs font-bold border border-slate-200 flex items-center gap-2"
              >
                <span>{track}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTrack(idx)}
                  className="text-slate-400 hover:text-red-600 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 pt-3 border-t border-slate-100 max-w-md">
            <input
              type="text"
              value={newTrack}
              onChange={(e) => setNewTrack(e.target.value)}
              placeholder="e.g. University Researchers & Spinouts"
              className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
            />
            <button
              type="button"
              onClick={handleAddTrack}
              className="px-4 py-1.5 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-lg shrink-0 cursor-pointer"
            >
              Add Track
            </button>
          </div>
        </div>
      )}

      {/* 3. WHO WE SERVE 6-CARD MATRIX */}
      {activeSection === 'serve' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-red-600" />
              <span>"Who We Serve" 6-Card Stakeholder Matrix</span>
            </h3>
            <p className="text-xs text-slate-500">
              Interactive stakeholder cards connecting founders, institutional investors, corporates, and policymakers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {whoWeServe.map((card, idx) => (
              <div
                key={card.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-white border border-slate-200 text-slate-700 rounded-full">
                    Card #{idx + 1}
                  </span>
                  <span className="text-xs font-mono text-slate-400">{card.icon}</span>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={card.title}
                    onChange={(e) => {
                      const updated = [...whoWeServe];
                      updated[idx] = { ...card, title: e.target.value };
                      onChange({ whoWeServe: updated });
                    }}
                    className="w-full px-2.5 py-1 text-xs font-bold border border-slate-300 rounded-lg bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Value Tagline & Offerings
                  </label>
                  <textarea
                    rows={2}
                    value={card.tagline}
                    onChange={(e) => {
                      const updated = [...whoWeServe];
                      updated[idx] = { ...card, tagline: e.target.value };
                      onChange({ whoWeServe: updated });
                    }}
                    className="w-full px-2.5 py-1 text-xs border border-slate-300 rounded-lg bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Target Portal Anchor / URL
                  </label>
                  <input
                    type="text"
                    value={card.targetUrl}
                    onChange={(e) => {
                      const updated = [...whoWeServe];
                      updated[idx] = { ...card, targetUrl: e.target.value };
                      onChange({ whoWeServe: updated });
                    }}
                    className="w-full px-2.5 py-1 text-xs font-mono border border-slate-300 rounded-lg bg-white"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. THE OGHOWA JOURNEY 6-STEP ROADMAP */}
      {activeSection === 'journey' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Rocket className="w-4 h-4 text-red-600" />
              <span>"The Oghowa Journey" 6-Step Commercial Roadmap</span>
            </h3>
            <p className="text-xs text-slate-500">
              Configure the 6 milestone steps: Discover, Build, Validate, Fund, Scale, Exit & Reinvest.
            </p>
          </div>

          <div className="space-y-4">
            {journey.map((step, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 grid grid-cols-1 md:grid-cols-12 gap-3 items-start"
              >
                <div className="md:col-span-1 flex items-center justify-center">
                  <span className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                    {step.stepNumber}
                  </span>
                </div>
                <div className="md:col-span-4 space-y-2">
                  <input
                    type="text"
                    value={step.title}
                    onChange={(e) => {
                      const updated = [...journey];
                      updated[idx] = { ...step, title: e.target.value };
                      onChange({ journeyRoadmap: updated });
                    }}
                    placeholder="Step Title"
                    className="w-full px-2.5 py-1 text-xs font-bold border border-slate-300 rounded-lg bg-white"
                  />
                  <input
                    type="text"
                    value={step.tagline}
                    onChange={(e) => {
                      const updated = [...journey];
                      updated[idx] = { ...step, tagline: e.target.value };
                      onChange({ journeyRoadmap: updated });
                    }}
                    placeholder="Tagline"
                    className="w-full px-2.5 py-1 text-xs border border-slate-300 rounded-lg bg-white text-slate-600"
                  />
                </div>
                <div className="md:col-span-4">
                  <textarea
                    rows={2}
                    value={step.description}
                    onChange={(e) => {
                      const updated = [...journey];
                      updated[idx] = { ...step, description: e.target.value };
                      onChange({ journeyRoadmap: updated });
                    }}
                    placeholder="Executive description..."
                    className="w-full px-2.5 py-1 text-xs border border-slate-300 rounded-lg bg-white"
                  />
                </div>
                <div className="md:col-span-3">
                  <span className="text-[10px] font-bold text-slate-500 block mb-1">
                    Key Milestones:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {step.milestones.map((m, mIdx) => (
                      <span
                        key={mIdx}
                        className="text-[10px] bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-700"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. INFRASTRUCTURE & ENABLERS GRID */}
      {activeSection === 'infra' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-red-600" />
              <span>Infrastructure & Enablers Grid</span>
            </h3>
            <p className="text-xs text-slate-500">
              Core institutional enablers (Cloud, AI, Payments, Legal, BI, Logistics, etc.).
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {infrastructure.map((item, idx) => (
              <div key={item.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-red-600">
                    {item.category}
                  </span>
                  <span className="text-xs font-mono text-slate-400">{item.icon}</span>
                </div>
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => {
                    const updated = [...infrastructure];
                    updated[idx] = { ...item, name: e.target.value };
                    onChange({ infrastructureEnablers: updated });
                  }}
                  className="w-full px-2 py-1 text-xs font-bold border border-slate-300 rounded-lg bg-white"
                />
                <textarea
                  rows={2}
                  value={item.description}
                  onChange={(e) => {
                    const updated = [...infrastructure];
                    updated[idx] = { ...item, description: e.target.value };
                    onChange({ infrastructureEnablers: updated });
                  }}
                  className="w-full px-2 py-1 text-xs border border-slate-300 rounded-lg bg-white text-slate-600"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. IMPACT METRICS COUNTERS */}
      {activeSection === 'impact' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-red-600" />
              <span>Impact Metrics Counters</span>
            </h3>
            <p className="text-xs text-slate-500">
              Verified institutional outcomes (≥ $50M Capital, 150+ Enterprises, 1 Policy White Paper, 5,000+ Community, 20+ Programs).
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <label className="block text-xs font-bold text-slate-700">Metric 1 (Capital)</label>
              <input
                type="text"
                value={impactMetrics.target1Value}
                onChange={(e) =>
                  onChange({ impactMetrics: { ...impactMetrics, target1Value: e.target.value } })
                }
                placeholder="≥ $50M"
                className="w-full px-3 py-1.5 text-base font-extrabold text-red-600 border border-slate-300 rounded-lg bg-white"
              />
              <input
                type="text"
                value={impactMetrics.target1Label}
                onChange={(e) =>
                  onChange({ impactMetrics: { ...impactMetrics, target1Label: e.target.value } })
                }
                placeholder="Target Institutional Capital Mobilized"
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
              />
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <label className="block text-xs font-bold text-slate-700">Metric 2 (Enterprises)</label>
              <input
                type="text"
                value={impactMetrics.target2Value}
                onChange={(e) =>
                  onChange({ impactMetrics: { ...impactMetrics, target2Value: e.target.value } })
                }
                placeholder="150+"
                className="w-full px-3 py-1.5 text-base font-extrabold text-slate-900 border border-slate-300 rounded-lg bg-white"
              />
              <input
                type="text"
                value={impactMetrics.target2Label}
                onChange={(e) =>
                  onChange({ impactMetrics: { ...impactMetrics, target2Label: e.target.value } })
                }
                placeholder="High-Growth Regional Enterprises Scaled"
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
              />
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <label className="block text-xs font-bold text-slate-700">Metric 3 (Policy)</label>
              <input
                type="text"
                value={impactMetrics.target3Value}
                onChange={(e) =>
                  onChange({ impactMetrics: { ...impactMetrics, target3Value: e.target.value } })
                }
                placeholder="1"
                className="w-full px-3 py-1.5 text-base font-extrabold text-slate-900 border border-slate-300 rounded-lg bg-white"
              />
              <input
                type="text"
                value={impactMetrics.target3Label}
                onChange={(e) =>
                  onChange({ impactMetrics: { ...impactMetrics, target3Label: e.target.value } })
                }
                placeholder="State Economic White Paper & Consensus"
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* 7. FEATURED VENTURES SHOWCASE */}
      {activeSection === 'ventures' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-4 h-4 text-red-600" />
                <span>Featured Ventures Showcase</span>
              </h3>
              <p className="text-xs text-slate-500">
                Manage portfolio companies (Ugbekun, EduRide, Cysma Medicare, etc.), edit company logos, pictures, taglines, and sectors.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsAddingVenture(true)}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Venture</span>
            </button>
          </div>

          {/* Add Venture Modal */}
          {isAddingVenture && (
            <div className="p-4 bg-red-50/50 border border-red-200 rounded-xl space-y-3">
              <h4 className="text-xs font-bold text-red-900">Add New Portfolio Venture</h4>
              <form onSubmit={handleSaveNewVenture} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Company Name</label>
                  <input
                    type="text"
                    value={newVenture.name}
                    onChange={(e) => setNewVenture({ ...newVenture, name: e.target.value })}
                    placeholder="e.g. Agrisync Edo"
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Sector</label>
                  <input
                    type="text"
                    value={newVenture.sector}
                    onChange={(e) => setNewVenture({ ...newVenture, sector: e.target.value })}
                    placeholder="e.g. Agro-Processing & Supply Chain"
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Tagline</label>
                  <input
                    type="text"
                    value={newVenture.tagline}
                    onChange={(e) => setNewVenture({ ...newVenture, tagline: e.target.value })}
                    placeholder="e.g. Automated grain silos connecting regional cooperative farmers"
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <MediaAssetController
                    label="Venture Logo / Brand Picture"
                    value={newVenture.logoUrl || ''}
                    onChange={(url) => setNewVenture({ ...newVenture, logoUrl: url })}
                    recommendedAspect="Square or Landscape"
                    helperText="Upload or drag-and-drop the brand logo/icon for this portfolio venture."
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={newVenture.description}
                    onChange={(e) => setNewVenture({ ...newVenture, description: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                  />
                </div>
                <div className="sm:col-span-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingVenture(false)}
                    className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg cursor-pointer"
                  >
                    Save Venture
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Edit Venture Modal */}
          {editingVenture && (
            <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xl max-w-xl w-full space-y-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
                    <h4 className="text-sm font-bold text-slate-900">
                      Edit Featured Venture: {editingVenture.name}
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditingVenture(null)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleUpdateVenture} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Company Name</label>
                      <input
                        type="text"
                        value={editingVenture.name}
                        onChange={(e) => setEditingVenture({ ...editingVenture, name: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white font-bold"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Sector</label>
                      <input
                        type="text"
                        value={editingVenture.sector}
                        onChange={(e) => setEditingVenture({ ...editingVenture, sector: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                        required
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Tagline</label>
                      <input
                        type="text"
                        value={editingVenture.tagline}
                        onChange={(e) => setEditingVenture({ ...editingVenture, tagline: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <MediaAssetController
                        label="Venture Logo / Brand Picture (File Upload or URL)"
                        value={editingVenture.logoUrl || ''}
                        onChange={(url) => setEditingVenture({ ...editingVenture, logoUrl: url })}
                        recommendedAspect="Square or 1:1"
                        helperText="Upload or drag-and-drop the logo for this venture. Applies immediately to the Featured Ventures Showcase."
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Detailed Description</label>
                      <textarea
                        rows={3}
                        value={editingVenture.description}
                        onChange={(e) => setEditingVenture({ ...editingVenture, description: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Fallback Initials / Monogram</label>
                      <input
                        type="text"
                        maxLength={4}
                        value={editingVenture.logoText || ''}
                        onChange={(e) => setEditingVenture({ ...editingVenture, logoText: e.target.value.toUpperCase() })}
                        placeholder="e.g. UGB"
                        className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white uppercase"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Website / Portfolio Link</label>
                      <input
                        type="text"
                        value={editingVenture.link || ''}
                        onChange={(e) => setEditingVenture({ ...editingVenture, link: e.target.value })}
                        placeholder="e.g. https://ugbekun.ng"
                        className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setEditingVenture(null)}
                      className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg cursor-pointer shadow-xs"
                    >
                      Update Venture
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Ventures List */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {ventures.map((ven, idx) => (
              <div key={ven.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2 relative hover:border-slate-300 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
                    {ven.logoUrl ? (
                      <img src={ven.logoUrl} alt={ven.name} className="w-full h-full object-contain p-1" />
                    ) : (
                      <span className="bg-[#06132b] text-white font-bold text-xs w-full h-full flex items-center justify-center">
                        {ven.logoText || ven.name.slice(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveVenture(idx, 'up')}
                      className={`p-1 rounded text-slate-400 hover:text-slate-800 cursor-pointer ${idx === 0 ? 'opacity-30 cursor-not-allowed' : ''}`}
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === ventures.length - 1}
                      onClick={() => handleMoveVenture(idx, 'down')}
                      className={`p-1 rounded text-slate-400 hover:text-slate-800 cursor-pointer ${idx === ventures.length - 1 ? 'opacity-30 cursor-not-allowed' : ''}`}
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingVenture({ ...ven })}
                      className="text-slate-400 hover:text-blue-600 hover:bg-blue-50 cursor-pointer p-1 rounded transition-colors"
                      title="Edit venture details & picture"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveVenture(ven.id)}
                      className="text-slate-400 hover:text-red-600 hover:bg-red-50 cursor-pointer p-1 rounded transition-colors"
                      title="Remove venture"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <div className="font-bold text-xs text-slate-900">{ven.name}</div>
                <div className="text-[11px] font-semibold text-red-600">{ven.sector}</div>
                <div className="text-[11px] text-slate-600 line-clamp-2">{ven.tagline || ven.description}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 8. STRATEGIC PARTNERS & SOVEREIGN ANCHORS CAROUSEL */}
      {activeSection === 'partners' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Globe className="w-4 h-4 text-red-600" />
                <span>Strategic Partners & Sovereign Anchors</span>
              </h3>
              <p className="text-xs text-slate-500">
                Institutional logos and sovereign partners: Edo State Government, EIN, Sterling, Microsoft, AWS, MTN, Dangote, GIZ, Standard Chartered, AFD.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsAddingPartner(true)}
              className="px-3 py-1.5 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Partner</span>
            </button>
          </div>

          {/* Add Partner Form */}
          {isAddingPartner && (
            <form onSubmit={handleSaveNewPartner} className="p-4 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Partner Name</label>
                <input
                  type="text"
                  value={newPartner.name}
                  onChange={(e) => setNewPartner({ ...newPartner, name: e.target.value })}
                  placeholder="e.g. Bank of Industry (BOI)"
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Category / Subtitle</label>
                <input
                  type="text"
                  value={newPartner.category}
                  onChange={(e) => setNewPartner({ ...newPartner, category: e.target.value })}
                  placeholder="e.g. Development Finance Institution"
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Badge Tag</label>
                <input
                  type="text"
                  value={newPartner.badge}
                  onChange={(e) => setNewPartner({ ...newPartner, badge: e.target.value })}
                  placeholder="e.g. DFI Anchor"
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                />
              </div>
              <div className="sm:col-span-3">
                <MediaAssetController
                  label="Partner Logo / Emblem Image (File Upload or URL)"
                  value={newPartner.logoUrl || ''}
                  onChange={(url) => setNewPartner({ ...newPartner, logoUrl: url })}
                  recommendedAspect="Landscape or 1:1"
                  helperText="Upload official brand logo or sovereign insignia for the partners marquee & carousel."
                />
              </div>
              <div className="sm:col-span-3">
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Website URL</label>
                <input
                  type="text"
                  value={newPartner.websiteUrl || ''}
                  onChange={(e) => setNewPartner({ ...newPartner, websiteUrl: e.target.value })}
                  placeholder="e.g. https://www.boi.ng"
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                />
              </div>
              <div className="sm:col-span-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingPartner(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-lg cursor-pointer"
                >
                  Save Partner
                </button>
              </div>
            </form>
          )}

          {/* Edit Partner Modal */}
          {editingPartner && (
            <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xl max-w-xl w-full space-y-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-900" />
                    <h4 className="text-sm font-bold text-slate-900">
                      Edit Strategic Partner: {editingPartner.name}
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditingPartner(null)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleUpdatePartner} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Partner Name</label>
                      <input
                        type="text"
                        value={editingPartner.name}
                        onChange={(e) => setEditingPartner({ ...editingPartner, name: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white font-bold"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Category / Subtitle</label>
                      <input
                        type="text"
                        value={editingPartner.category}
                        onChange={(e) => setEditingPartner({ ...editingPartner, category: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Badge Tag</label>
                      <input
                        type="text"
                        value={editingPartner.badge}
                        onChange={(e) => setEditingPartner({ ...editingPartner, badge: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Website URL</label>
                      <input
                        type="text"
                        value={editingPartner.websiteUrl || ''}
                        onChange={(e) => setEditingPartner({ ...editingPartner, websiteUrl: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <MediaAssetController
                        label="Partner Logo / Picture (File Upload or URL)"
                        value={editingPartner.logoUrl || ''}
                        onChange={(url) => setEditingPartner({ ...editingPartner, logoUrl: url })}
                        recommendedAspect="Landscape or 1:1"
                        helperText="Upload official logo or emblem. Renders in the institutional partners carousel and marquee."
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setEditingPartner(null)}
                      className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-lg cursor-pointer shadow-xs"
                    >
                      Update Partner
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Partner Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {partners.map((part, idx) => (
              <div
                key={part.id}
                className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between hover:border-slate-300 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] bg-red-50 text-red-700 font-bold px-1.5 py-0.5 rounded border border-red-200 truncate max-w-[90px]">
                      {part.badge}
                    </span>
                    <div className="flex items-center gap-0.5">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMovePartner(idx, 'up')}
                        className={`p-0.5 rounded text-slate-400 hover:text-slate-800 cursor-pointer ${idx === 0 ? 'opacity-30 cursor-not-allowed' : ''}`}
                        title="Move Up"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === partners.length - 1}
                        onClick={() => handleMovePartner(idx, 'down')}
                        className={`p-0.5 rounded text-slate-400 hover:text-slate-800 cursor-pointer ${idx === partners.length - 1 ? 'opacity-30 cursor-not-allowed' : ''}`}
                        title="Move Down"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingPartner({ ...part })}
                        className="text-slate-400 hover:text-blue-600 cursor-pointer p-0.5 rounded hover:bg-blue-50 transition-colors"
                        title="Edit partner details & picture"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemovePartner(part.id)}
                        className="text-slate-400 hover:text-red-600 cursor-pointer p-0.5 rounded hover:bg-red-50 transition-colors"
                        title="Remove partner"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <div className="h-10 flex items-center justify-center bg-white rounded-lg border border-slate-200/80 mb-2 overflow-hidden p-1">
                    {part.logoUrl ? (
                      <img src={part.logoUrl} alt={part.name} className="max-h-full max-w-full object-contain" />
                    ) : (
                      <span className="text-xs font-black text-slate-800 truncate px-1">
                        {part.name.slice(0, 4).toUpperCase()}
                      </span>
                    )}
                  </div>

                  <div className="font-bold text-xs text-slate-900 line-clamp-1">{part.name}</div>
                  <div className="text-[10px] text-slate-500 line-clamp-1">{part.category}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
