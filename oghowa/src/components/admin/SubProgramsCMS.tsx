import React, { useState } from 'react';
import { SiteConfig, defaultSiteConfig } from '../../data/siteConfig';
import {
  Code,
  Flame,
  Building,
  Coins,
  Check,
  Plus,
  Trash2,
  Clock,
  Award,
  Layers,
  Sparkles,
} from 'lucide-react';

interface SubProgramsCMSProps {
  formData: SiteConfig;
  onChange: (updated: Partial<SiteConfig>) => void;
  activeSubSection?: string;
}

export const SubProgramsCMS: React.FC<SubProgramsCMSProps> = ({
  formData,
  onChange,
  activeSubSection,
}) => {
  const [activeTab, setActiveTab] = useState<'weekend' | 'incubation' | 'studio' | 'capital'>(
    'weekend'
  );

  React.useEffect(() => {
    if (activeSubSection) {
      const valid = ['weekend', 'incubation', 'studio', 'capital'];
      if (valid.includes(activeSubSection)) {
        setActiveTab(activeSubSection as any);
      }
    }
  }, [activeSubSection]);

  const iw = formData?.innovationWeekend || defaultSiteConfig.innovationWeekend;
  const inc = formData?.incubationProgram || defaultSiteConfig.incubationProgram;
  const vs = formData?.ventureStudio || defaultSiteConfig.ventureStudio;
  const cap = formData?.capitalNetwork || defaultSiteConfig.capitalNetwork;

  return (
    <div className="space-y-8">
      {/* SECTION HEADER */}
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-xl font-bold text-[#06132b] flex items-center gap-2">
          <Layers className="w-5 h-5 text-red-600" />
          <span>Specialized Sub-Program Pages CMS</span>
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Detailed curricular workflows and institutional guidelines for Innovation Weekend, Incubation cohorts, Venture Studio, and the Oghowa Capital Syndicate.
        </p>
      </div>

      {/* SUB-TABS */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {[
          { id: 'weekend', label: '1. Innovation Weekend (54h Hackathon)', icon: Code },
          { id: 'incubation', label: '2. Incubation Program (3-6 Months)', icon: Flame },
          { id: 'studio', label: '3. Venture Studio Model', icon: Building },
          { id: 'capital', label: '4. Capital Syndicate Network', icon: Coins },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
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

      {/* 1. INNOVATION WEEKEND */}
      {activeTab === 'weekend' && iw && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Code className="w-4 h-4 text-red-600" />
              <span>Innovation Weekend CMS (`/programs/innovation-weekend`)</span>
            </h3>
            <p className="text-xs text-slate-500">
              54-hour builder sprint, prize pool, target profiles (Developers, Designers, Students), and dates.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Headline</label>
              <input
                type="text"
                value={iw.headline}
                onChange={(e) =>
                  onChange({ innovationWeekend: { ...iw, headline: e.target.value } })
                }
                className="w-full px-3 py-1.5 text-xs font-bold border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Dates / Duration</label>
              <input
                type="text"
                value={iw.dates}
                onChange={(e) =>
                  onChange({ innovationWeekend: { ...iw, dates: e.target.value } })
                }
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Prize Pool / Grants</label>
              <input
                type="text"
                value={iw.prizePool}
                onChange={(e) =>
                  onChange({ innovationWeekend: { ...iw, prizePool: e.target.value } })
                }
                className="w-full px-3 py-1.5 text-xs font-bold text-red-600 border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Target Audience</label>
              <input
                type="text"
                value={iw.targetAudience}
                onChange={(e) =>
                  onChange({ innovationWeekend: { ...iw, targetAudience: e.target.value } })
                }
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Tagline</label>
              <input
                type="text"
                value={iw.tagline}
                onChange={(e) =>
                  onChange({ innovationWeekend: { ...iw, tagline: e.target.value } })
                }
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Description</label>
              <textarea
                rows={3}
                value={iw.description}
                onChange={(e) =>
                  onChange({ innovationWeekend: { ...iw, description: e.target.value } })
                }
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
              />
            </div>
          </div>
        </div>
      )}

      {/* 2. INCUBATION PROGRAM */}
      {activeTab === 'incubation' && inc && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Flame className="w-4 h-4 text-red-600" />
              <span>Incubation Program CMS (`/programs/incubation`)</span>
            </h3>
            <p className="text-xs text-slate-500">
              3-6 month validation cohorts, criteria (Pre-Seed/Seed, MVP, Validation), deliverables, and workspace perks.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Program Headline</label>
              <input
                type="text"
                value={inc.headline}
                onChange={(e) =>
                  onChange({ incubationProgram: { ...inc, headline: e.target.value } })
                }
                className="w-full px-3 py-1.5 text-xs font-bold border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Duration</label>
              <input
                type="text"
                value={inc.duration}
                onChange={(e) =>
                  onChange({ incubationProgram: { ...inc, duration: e.target.value } })
                }
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Target Stage</label>
              <input
                type="text"
                value={inc.targetStage}
                onChange={(e) =>
                  onChange({ incubationProgram: { ...inc, targetStage: e.target.value } })
                }
                className="w-full px-3 py-1.5 text-xs font-bold text-red-600 border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Cohort Frequency</label>
              <input
                type="text"
                value={inc.cohortSize}
                onChange={(e) =>
                  onChange({ incubationProgram: { ...inc, cohortSize: e.target.value } })
                }
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
              <textarea
                rows={3}
                value={inc.description}
                onChange={(e) =>
                  onChange({ incubationProgram: { ...inc, description: e.target.value } })
                }
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
              />
            </div>
          </div>
        </div>
      )}

      {/* 3. VENTURE STUDIO */}
      {activeTab === 'studio' && vs && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Building className="w-4 h-4 text-red-600" />
              <span>Venture Studio CMS (`/programs/venture-studio`)</span>
            </h3>
            <p className="text-xs text-slate-500">
              Co-creation engine, focus sectors (EdTech, HealthTech, FinTech, Logistics, AgTech), equity terms.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Studio Headline</label>
              <input
                type="text"
                value={vs.headline}
                onChange={(e) =>
                  onChange({ ventureStudio: { ...vs, headline: e.target.value } })
                }
                className="w-full px-3 py-1.5 text-xs font-bold border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Co-Founding Terms</label>
              <input
                type="text"
                value={vs.coFoundingTerms}
                onChange={(e) =>
                  onChange({ ventureStudio: { ...vs, coFoundingTerms: e.target.value } })
                }
                className="w-full px-3 py-1.5 text-xs font-bold text-red-600 border border-slate-300 rounded-lg"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Focus Sectors</label>
              <input
                type="text"
                value={(vs.focusSectors || []).join(', ')}
                onChange={(e) =>
                  onChange({
                    ventureStudio: {
                      ...vs,
                      focusSectors: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                    },
                  })
                }
                placeholder="EdTech, HealthTech, FinTech, Logistics, AgTech"
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
              <textarea
                rows={3}
                value={vs.description}
                onChange={(e) =>
                  onChange({ ventureStudio: { ...vs, description: e.target.value } })
                }
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
              />
            </div>
          </div>
        </div>
      )}

      {/* 4. CAPITAL NETWORK */}
      {activeTab === 'capital' && cap && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Coins className="w-4 h-4 text-red-600" />
              <span>Capital Syndicate Network CMS (`/capital`)</span>
            </h3>
            <p className="text-xs text-slate-500">
              Syndicate framework, ticket size ranges, stage criteria (Pre-Seed to Growth), and institutional LP/GP network.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Syndicate Headline</label>
              <input
                type="text"
                value={cap.headline}
                onChange={(e) =>
                  onChange({ capitalNetwork: { ...cap, headline: e.target.value } })
                }
                className="w-full px-3 py-1.5 text-xs font-bold border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Ticket Size Range</label>
              <input
                type="text"
                value={cap.ticketSizes}
                onChange={(e) =>
                  onChange({ capitalNetwork: { ...cap, ticketSizes: e.target.value } })
                }
                className="w-full px-3 py-1.5 text-xs font-bold text-red-600 border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Target Stages</label>
              <input
                type="text"
                value={cap.targetStages}
                onChange={(e) =>
                  onChange({ capitalNetwork: { ...cap, targetStages: e.target.value } })
                }
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Syndicate Structure</label>
              <input
                type="text"
                value={cap.syndicateStructure}
                onChange={(e) =>
                  onChange({ capitalNetwork: { ...cap, syndicateStructure: e.target.value } })
                }
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
              <textarea
                rows={3}
                value={cap.description}
                onChange={(e) =>
                  onChange({ capitalNetwork: { ...cap, description: e.target.value } })
                }
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
