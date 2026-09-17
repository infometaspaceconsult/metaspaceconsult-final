import React from 'react';
import { SUMMIT_GOVERNANCE } from '../data/summitData';
import { ScrollReveal } from './ScrollReveal';
import { Landmark, ShieldCheck, Award, Briefcase, GraduationCap, Building } from 'lucide-react';

interface SummitGovernanceProps {
  onRequestAdvisoryBrief?: () => void;
}

export const SummitGovernance: React.FC<SummitGovernanceProps> = ({ onRequestAdvisoryBrief }) => {
  return (
    <section id="governance" className="py-16 sm:py-20 lg:py-24 bg-white border-b border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal direction="up" distance={20}>
          <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#D9232A] mb-2 block">
              Leadership & Oversight
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0A162B] tracking-tight">
              The Advisory Council & Institutional Governance
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 font-normal">
              Anchoring regional economic policy and investment deployment with unmatched fiduciary integrity.
            </p>
          </div>
        </ScrollReveal>

        {/* 2 Institutional Pillars: Governing Authority & Ecosystem Anchors */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          {/* Card 1: Governing Authority */}
          <ScrollReveal direction="up" distance={24} delay={50} className="h-full">
            <div className="h-full bg-slate-50/80 rounded-2xl border border-slate-200 p-7 sm:p-9 flex flex-col justify-between shadow-xs hover:shadow-md transition-all">
              <div>
                <div className="flex items-center gap-3.5 mb-5">
                  <div className="w-12 h-12 rounded-xl bg-red-100/80 text-[#D9232A] flex items-center justify-center shrink-0">
                    <Landmark className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#0A162B]">
                      {SUMMIT_GOVERNANCE.governingAuthority.title}
                    </h3>
                    <span className="text-xs font-semibold text-slate-500">
                      Steering Committee & Strategic Oversight
                    </span>
                  </div>
                </div>

                <p className="text-sm sm:text-base text-slate-700 leading-relaxed mb-6">
                  {SUMMIT_GOVERNANCE.governingAuthority.description}
                </p>

                <div className="space-y-3 pt-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                    Steering Committee Composition:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {SUMMIT_GOVERNANCE.governingAuthority.councilMembers.map((member, idx) => (
                      <div
                        key={idx}
                        className="bg-white p-3 rounded-lg border border-slate-200/80 flex items-start gap-2.5"
                      >
                        <Award className="w-4 h-4 text-[#D9232A] shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-xs font-bold text-slate-900 block">
                            {member.role}
                          </strong>
                          <span className="text-[11px] text-slate-500 leading-snug block">
                            {member.focus}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-5 border-t border-slate-200/70 flex items-center justify-between text-xs text-slate-600">
                <span className="font-medium">Mandate: Fiduciary stewardship & policy alignment</span>
                <span className="text-[11px] font-semibold text-[#D9232A] bg-red-50 px-2.5 py-1 rounded">
                  Edo State Focus
                </span>
              </div>
            </div>
          </ScrollReveal>

          {/* Card 2: Ecosystem Anchors */}
          <ScrollReveal direction="up" distance={24} delay={120} className="h-full">
            <div className="h-full bg-slate-50/80 rounded-2xl border border-slate-200 p-7 sm:p-9 flex flex-col justify-between shadow-xs hover:shadow-md transition-all">
              <div>
                <div className="flex items-center gap-3.5 mb-5">
                  <div className="w-12 h-12 rounded-xl bg-blue-100/80 text-blue-900 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#0A162B]">
                      {SUMMIT_GOVERNANCE.ecosystemAnchors.title}
                    </h3>
                    <span className="text-xs font-semibold text-slate-500">
                      Capital Depth & Financial Infrastructure
                    </span>
                  </div>
                </div>

                <p className="text-sm sm:text-base text-slate-700 leading-relaxed mb-6">
                  {SUMMIT_GOVERNANCE.ecosystemAnchors.description}
                </p>

                <div className="space-y-3 pt-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                    Strategic Institutional Partners:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {SUMMIT_GOVERNANCE.ecosystemAnchors.anchors.map((anchor, idx) => (
                      <div
                        key={idx}
                        className="bg-white p-3 rounded-lg border border-slate-200/80 flex items-start gap-2.5"
                      >
                        <Building className="w-4 h-4 text-blue-800 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-xs font-bold text-slate-900 block">
                            {anchor.name}
                          </strong>
                          <span className="text-[11px] text-slate-500 leading-snug block">
                            {anchor.role}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-5 border-t border-slate-200/70 flex items-center justify-between text-xs text-slate-600">
                <span className="font-medium">Direct alignment: Edo Investors Network (EIN)</span>
                <span className="text-[11px] font-semibold text-blue-900 bg-blue-50 px-2.5 py-1 rounded">
                  Capital Markets Depth
                </span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};
