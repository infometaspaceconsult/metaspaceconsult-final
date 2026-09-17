import React from 'react';
import { DEAL_ROOM_ARCHITECTURE } from '../data/summitData';
import { DynamicIcon } from './DynamicIcon';
import { ScrollReveal } from './ScrollReveal';
import { ArrowRight, CheckCircle2, Lock, ShieldAlert } from 'lucide-react';

interface SummitDealRoomProps {
  onRequestDealRoomAccess: () => void;
}

export const SummitDealRoom: React.FC<SummitDealRoomProps> = ({ onRequestDealRoomAccess }) => {
  return (
    <section id="deal-room" className="py-16 sm:py-20 lg:py-24 bg-white border-b border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal direction="up" distance={20}>
          <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#D9232A] mb-2 block">
              Direct Capital Intermediation
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0A162B] tracking-tight">
              The Deal-Room & Investment Architecture
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 font-normal">
              Structured bilateral engagement connecting institutional capital, sovereign policymakers, and high-growth Edo expansion projects.
            </p>
          </div>
        </ScrollReveal>

        {/* 3 Tracks Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {DEAL_ROOM_ARCHITECTURE.map((track, idx) => (
            <ScrollReveal
              key={track.id}
              direction="up"
              staggerIndex={idx}
              staggerDelay={90}
              distance={24}
              className="h-full"
            >
              <div className="h-full bg-slate-50/70 rounded-2xl border border-slate-200 p-7 sm:p-8 flex flex-col justify-between shadow-xs hover:shadow-lg transition-all duration-300">
                <div>
                  {/* Top Badge */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-red-100 text-[#D9232A] flex items-center justify-center">
                      <DynamicIcon name={track.iconName} className="w-6 h-6" />
                    </div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-white border border-slate-200 px-2.5 py-1 rounded-full">
                      <Lock className="w-3 h-3 text-[#D9232A]" />
                      <span>Closed-Door</span>
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-[#0A162B] mb-2.5">
                    {track.title}
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed mb-6">
                    {track.description}
                  </p>

                  {/* Target Participants */}
                  <div className="mb-5 bg-white p-3 rounded-lg border border-slate-200/80">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Target Participants:
                    </span>
                    <span className="text-xs font-semibold text-slate-800">
                      {track.targetParticipants}
                    </span>
                  </div>

                  {/* Deliverables Checklist */}
                  <div className="space-y-2 mb-6">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Core Deliverables:
                    </span>
                    {track.deliverables.map((del, dIdx) => (
                      <div key={dIdx} className="flex items-start gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{del}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <span className="text-[11px] font-semibold text-[#D9232A]">
                    Strict NDA & Accreditation Required
                  </span>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* CTA Bar */}
        <ScrollReveal direction="up" delay={150} distance={16}>
          <div className="bg-[#07132B] rounded-2xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="max-w-2xl text-center sm:text-left">
              <h4 className="text-lg sm:text-xl font-bold mb-1">
                Are you an Institutional LP, Venture Fund, or Series A+ Enterprise?
              </h4>
              <p className="text-xs sm:text-sm text-slate-300">
                Accredited participants gain direct access to bilateral term sheets, sovereign roundtable schedules, and vetted Edo investment portfolios.
              </p>
            </div>
            <button
              onClick={onRequestDealRoomAccess}
              className="px-6 py-3 bg-[#D9232A] hover:bg-[#B9181F] text-white font-semibold text-sm rounded-lg transition-all shadow-md shrink-0 flex items-center gap-2 cursor-pointer"
            >
              <span>Apply for Deal-Room Access</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
