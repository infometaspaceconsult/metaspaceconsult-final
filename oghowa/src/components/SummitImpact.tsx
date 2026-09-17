import React from 'react';
import { ScrollReveal } from './ScrollReveal';
import { ShieldCheck, FileCheck2, TrendingUp, Users, FileText } from 'lucide-react';
import { useSiteConfig } from '../context/SiteConfigContext';

interface SummitImpactProps {
  onDownloadWhitepaperBrief?: () => void;
}

export const SummitImpact: React.FC<SummitImpactProps> = ({ onDownloadWhitepaperBrief }) => {
  const { config } = useSiteConfig();
  const metrics = config.impactMetrics || {
    target1Value: '≥ $50M',
    target1Label: 'in active deal-room commitments & syndicated investments',
    target2Value: '150+',
    target2Label: 'high-growth regional corporations & scalable startups',
    target3Value: '1 Actionable',
    target3Label: 'Economic White Paper for state legislative councils',
  };

  const targets = [
    {
      id: 'target-1',
      metric: metrics.target1Value,
      title: 'Capital Syndication Deployment',
      description: metrics.target1Label,
      icon: <TrendingUp className="w-6 h-6 text-red-400" />,
      verification: 'Monitored through bilateral LP/GP deal-room term sheets and escrow accounts.',
    },
    {
      id: 'target-2',
      metric: metrics.target2Value,
      title: 'Enterprise & Founder Participation',
      description: metrics.target2Label,
      icon: <Users className="w-6 h-6 text-amber-400" />,
      verification: 'Audited delegate accreditation and venture pavilion verified registries.',
    },
    {
      id: 'target-3',
      metric: metrics.target3Value,
      title: 'Legislative White Paper Deliverable',
      description: metrics.target3Label,
      icon: <FileText className="w-6 h-6 text-emerald-400" />,
      verification: 'Formally presented to the Edo State House of Assembly & Executive Council.',
    },
  ];

  return (
    <section id="impact" className="py-16 sm:py-20 lg:py-24 bg-[#07132B] text-white border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal direction="up" distance={20}>
          <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-red-400 mb-2 block">
              Rigorous Economic Accountability
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              Measurable Impact Commitments
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-300 font-normal">
              Unlike generic conferences, Oghowa Business Week measures success through verifiable capital deployment, enterprise participation, and statutory policy enactments.
            </p>
          </div>
        </ScrollReveal>

        {/* 3 Impact Commitment Cards (Prompt 2 & 5) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {targets.map((item, idx) => (
            <ScrollReveal
              key={item.id}
              direction="up"
              staggerIndex={idx}
              staggerDelay={90}
              distance={24}
              className="h-full"
            >
              <div className="h-full bg-slate-900/80 rounded-2xl border border-white/10 p-7 sm:p-9 flex flex-col justify-between shadow-xl hover:border-red-500/40 transition-all duration-300">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-red-950/80 border border-red-500/30 flex items-center justify-center">
                      {item.icon}
                    </div>
                    <span className="text-[11px] font-mono uppercase tracking-wider px-2.5 py-1 rounded bg-slate-800 text-slate-400">
                      Target 0{idx + 1}
                    </span>
                  </div>

                  {/* Big Impact Metric */}
                  <div className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-2 text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-red-300">
                    {item.metric}
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                    {item.title}
                  </h3>

                  <p className="text-sm text-slate-300 leading-relaxed mb-6">
                    {item.description}
                  </p>
                </div>

                {/* Verification Mechanism */}
                <div className="pt-4 border-t border-white/10">
                  <div className="flex items-start gap-2 text-xs text-slate-400">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-200">Verification Protocol:</strong>{' '}
                      <span>{item.verification}</span>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Policy Deliverable Feature Card */}
        <ScrollReveal direction="up" delay={200} distance={18}>
          <div className="bg-gradient-to-r from-red-950/60 to-slate-900/90 rounded-2xl p-6 sm:p-8 border border-red-500/25 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-600/20 text-red-400 flex items-center justify-center shrink-0">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-lg sm:text-xl font-bold text-white mb-1">
                  Edo State Economic White Paper Gazetting
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
                  Outputs from closed-door roundtables and sovereign-private dialogues will be consolidated into a statutory white paper submitted directly to the State Development Council and Legislative Committees.
                </p>
              </div>
            </div>
            {onDownloadWhitepaperBrief && (
              <button
                onClick={onDownloadWhitepaperBrief}
                className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-medium text-xs rounded-lg transition-colors border border-white/20 shrink-0 cursor-pointer"
              >
                White Paper Outline Brief
              </button>
            )}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
