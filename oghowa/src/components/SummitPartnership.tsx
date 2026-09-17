import React from 'react';
import { PARTNERSHIP_FRAMEWORK } from '../data/summitData';
import { DynamicIcon } from './DynamicIcon';
import { ScrollReveal } from './ScrollReveal';
import { CheckCircle2, ArrowRight, Handshake } from 'lucide-react';

interface SummitPartnershipProps {
  onInquirePartnership: (tierTitle: string) => void;
}

export const SummitPartnership: React.FC<SummitPartnershipProps> = ({ onInquirePartnership }) => {
  return (
    <section id="partnership" className="py-16 sm:py-20 lg:py-24 bg-white border-b border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal direction="up" distance={20}>
          <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#D9232A] mb-2 block">
              Strategic Institutional Alignment
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0A162B] tracking-tight">
              Institutional Partnership Framework
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 font-normal">
              Position your institution at the forefront of Edo State’s industrial transformation through high-level governance, keynote integration, and direct bilateral access.
            </p>
          </div>
        </ScrollReveal>

        {/* 3 Partnership Value Pillars */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {PARTNERSHIP_FRAMEWORK.map((item, idx) => (
            <ScrollReveal
              key={item.id}
              direction="up"
              staggerIndex={idx}
              staggerDelay={80}
              distance={24}
              className="h-full"
            >
              <div className="h-full bg-slate-50/70 rounded-2xl border border-slate-200/90 p-7 sm:p-8 flex flex-col justify-between shadow-xs hover:shadow-lg transition-all duration-300">
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-red-100 text-[#D9232A] flex items-center justify-center">
                      <DynamicIcon name={item.iconName} className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-semibold text-slate-500 bg-white border border-slate-200 px-2.5 py-1 rounded-full">
                      Pillar 0{idx + 1}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-[#0A162B] mb-2.5">
                    {item.title}
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed mb-6">
                    {item.description}
                  </p>

                  <div className="space-y-2.5 mb-6">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Institutional Value & Deliverables:
                    </span>
                    {item.perks.map((perk, pIdx) => (
                      <div key={pIdx} className="flex items-start gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{perk}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <button
                    onClick={() => onInquirePartnership(item.title)}
                    className="w-full py-2.5 px-4 bg-[#0A162B] hover:bg-[#D9232A] text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <span>Request Partnership Dossier</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};
