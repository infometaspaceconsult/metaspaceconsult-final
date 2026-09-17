import React from 'react';
import { ScrollReveal } from './ScrollReveal';
import { GraduationCap, Store, ShieldCheck, Globe, Cpu, Rocket, Users, Award, ArrowRight } from 'lucide-react';

interface SummitSplitProps {
  onRegisterMasterclass: (className: string) => void;
  onRegisterExhibitor: (pavilionName: string) => void;
}

export const SummitSplitMasterclassesPavilion: React.FC<SummitSplitProps> = ({
  onRegisterMasterclass,
  onRegisterExhibitor,
}) => {
  const masterclasses = [
    {
      title: 'Corporate Governance & Board Architecture',
      tag: 'Governance',
      desc: 'Transitioning founder-led companies into institutional corporate boards with fiduciary diligence and audit readiness.',
      icon: <ShieldCheck className="w-5 h-5 text-red-600" />,
    },
    {
      title: 'AfCFTA & Export Compliance Readiness',
      tag: 'Export Trade',
      desc: 'Certifications, phytosanitary standards, and cross-border logistics to export Edo products across continental trade zones.',
      icon: <Globe className="w-5 h-5 text-blue-600" />,
    },
    {
      title: 'Enterprise ERP & Process Automation',
      tag: 'Digital Systems',
      desc: 'Implementing modern inventory control, digitized accounting, and supply chain telemetry for manufacturing firms.',
      icon: <Cpu className="w-5 h-5 text-amber-600" />,
    },
  ];

  const pavilions = [
    {
      title: 'Startup Alley',
      tag: 'Early Stage',
      desc: 'Dedicated showcase pods for seed-stage startups displaying live software demonstrations, hardware prototypes, and traction.',
      icon: <Rocket className="w-5 h-5 text-emerald-600" />,
    },
    {
      title: 'Tech & Enterprise Showcase',
      tag: 'Growth Stage',
      desc: 'Interactive experiential booths for established Edo industrial conglomerates, fintech infrastructure providers, and energy firms.',
      icon: <Store className="w-5 h-5 text-indigo-600" />,
    },
    {
      title: 'Talent Development Hub',
      tag: 'Human Capital',
      desc: 'Recruitment pavilions connecting technical talent from UNIBEN and technical colleges with regional scale-ups.',
      icon: <Users className="w-5 h-5 text-rose-600" />,
    },
  ];

  return (
    <section id="masterclasses-and-pavilion" className="py-16 sm:py-20 lg:py-24 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal direction="up" distance={20}>
          <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#D9232A] mb-2 block">
              Capacity & Innovation Ecosystem
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0A162B] tracking-tight">
              Executive Masterclasses & Innovation Pavilion
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 font-normal">
              A dual-track environment pairing rigorous executive enterprise education with live commercial technology showcases.
            </p>
          </div>
        </ScrollReveal>

        {/* Split Layout: Left = Masterclasses, Right = Pavilion */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left: Masterclasses */}
          <ScrollReveal direction="left" distance={24} className="h-full">
            <div className="h-full bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 pb-5 mb-6 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-red-50 text-[#D9232A] flex items-center justify-center">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#0A162B]">Executive Masterclasses</h3>
                    <p className="text-xs text-slate-500">Curricula for enterprise transition and corporate scale</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {masterclasses.map((cls, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-300 hover:bg-slate-50/80 transition-all cursor-pointer group"
                      onClick={() => onRegisterMasterclass(cls.title)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {cls.icon}
                          <h4 className="text-sm font-bold text-[#0A162B] group-hover:text-[#D9232A] transition-colors">
                            {cls.title}
                          </h4>
                        </div>
                        <span className="text-[10px] font-semibold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded">
                          {cls.tag}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed pl-7">
                        {cls.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">Accredited certification provided</span>
                <button
                  onClick={() => onRegisterMasterclass('Masterclass Executive Delegate')}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D9232A] hover:underline cursor-pointer"
                >
                  <span>Register for Masterclasses</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </ScrollReveal>

          {/* Right: Innovation & Venture Pavilion */}
          <ScrollReveal direction="right" distance={24} className="h-full">
            <div className="h-full bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 pb-5 mb-6 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center">
                    <Store className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#0A162B]">Venture & Innovation Pavilion</h3>
                    <p className="text-xs text-slate-500">Live exhibition floors, pilot deals, and recruitment</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {pavilions.map((pav, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-300 hover:bg-slate-50/80 transition-all cursor-pointer group"
                      onClick={() => onRegisterExhibitor(pav.title)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {pav.icon}
                          <h4 className="text-sm font-bold text-[#0A162B] group-hover:text-blue-900 transition-colors">
                            {pav.title}
                          </h4>
                        </div>
                        <span className="text-[10px] font-semibold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded">
                          {pav.tag}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed pl-7">
                        {pav.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">Limited exhibition pods remaining</span>
                <button
                  onClick={() => onRegisterExhibitor('Pavilion Exhibitor')}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-900 hover:underline cursor-pointer"
                >
                  <span>Book Pavilion Space</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};
