import React, { useState } from 'react';
import { CORE_STRATEGIC_PILLARS } from '../data/summitData';
import { DynamicIcon } from './DynamicIcon';
import { ScrollReveal } from './ScrollReveal';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

interface SummitPillarsProps {
  onSelectPillar?: (pillarId: string) => void;
}

export const SummitPillars: React.FC<SummitPillarsProps> = ({ onSelectPillar }) => {
  const [activePillarId, setActivePillarId] = useState<string>(CORE_STRATEGIC_PILLARS[0].id);

  return (
    <section id="pillars" className="py-16 sm:py-20 lg:py-24 bg-slate-50 border-b border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal direction="up" distance={20}>
          <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#D9232A] mb-2 block">
              Architecting Economic Autonomy
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0A162B] tracking-tight">
              Core Strategic Pillars
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 font-normal">
              Four transformative economic engines driving industrial capacity, value addition, and investment depth across Edo State.
            </p>
          </div>
        </ScrollReveal>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {CORE_STRATEGIC_PILLARS.map((pillar, idx) => {
            const isSelected = activePillarId === pillar.id;

            return (
              <ScrollReveal
                key={pillar.id}
                direction="up"
                staggerIndex={idx}
                staggerDelay={80}
                distance={24}
                className="h-full"
              >
                <div
                  id={`pillar-card-${pillar.id}`}
                  onClick={() => {
                    setActivePillarId(pillar.id);
                    onSelectPillar?.(pillar.id);
                  }}
                  className={`group h-full bg-white rounded-2xl border p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 cursor-pointer shadow-xs ${
                    isSelected
                      ? 'border-[#D9232A]/50 ring-2 ring-red-500/10 shadow-lg'
                      : 'border-slate-200/90 hover:border-slate-300 hover:shadow-md'
                  }`}
                >
                  <div>
                    {/* Header: Icon & Pillar Number */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-13 h-13 rounded-xl bg-slate-100 group-hover:bg-red-50 text-[#0A162B] group-hover:text-[#D9232A] flex items-center justify-center transition-colors">
                        <DynamicIcon name={pillar.iconName} className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-slate-100 text-slate-600">
                        PILLAR 0{idx + 1}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-[#0A162B] group-hover:text-[#D9232A] transition-colors mb-3">
                      {pillar.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6">
                      {pillar.description}
                    </p>

                    {/* Action Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {pillar.actionTags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[11px] font-medium bg-slate-100/90 text-slate-700 px-2.5 py-1 rounded-md"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Target Deliverable Outcome */}
                  <div className="pt-4 border-t border-slate-100 flex items-start gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900">Deliverable:</strong>{' '}
                      <span>{pillar.targetOutcome}</span>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};
