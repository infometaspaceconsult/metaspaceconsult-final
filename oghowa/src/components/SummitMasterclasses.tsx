import React from 'react';
import { EXECUTIVE_MASTERCLASSES } from '../data/summitData';
import { DynamicIcon } from './DynamicIcon';
import { ScrollReveal } from './ScrollReveal';
import { CheckCircle2, GraduationCap, ArrowRight } from 'lucide-react';

interface SummitMasterclassesProps {
  onRegisterMasterclass: (className: string) => void;
}

export const SummitMasterclasses: React.FC<SummitMasterclassesProps> = ({
  onRegisterMasterclass,
}) => {
  return (
    <section id="masterclasses" className="py-16 sm:py-20 lg:py-24 bg-slate-50 border-b border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal direction="up" distance={20}>
          <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#D9232A] mb-2 block">
              Enterprise Institutionalization
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0A162B] tracking-tight">
              Executive Masterclasses & Capacity Building
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 font-normal">
              High-intensity executive curricula designed to transition mid-sized Edo enterprises into audited, export-compliant, and automated market champions.
            </p>
          </div>
        </ScrollReveal>

        {/* 3 Masterclass Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {EXECUTIVE_MASTERCLASSES.map((course, idx) => (
            <ScrollReveal
              key={course.id}
              direction="up"
              staggerIndex={idx}
              staggerDelay={80}
              distance={24}
              className="h-full"
            >
              <div className="h-full bg-white rounded-2xl border border-slate-200/90 p-7 sm:p-8 flex flex-col justify-between shadow-xs hover:shadow-lg transition-all duration-300">
                <div>
                  {/* Icon & Category */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 text-[#0A162B] flex items-center justify-center">
                      <DynamicIcon name={course.iconName} className="w-6 h-6 text-[#D9232A]" />
                    </div>
                    <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                      Module 0{idx + 1}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-[#0A162B] mb-2.5">
                    {course.title}
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed mb-6">
                    {course.description}
                  </p>

                  {/* Target Audience */}
                  <div className="mb-5 bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Target Executive Profile:
                    </span>
                    <span className="text-xs font-semibold text-slate-800">
                      {course.targetAudience}
                    </span>
                  </div>

                  {/* Core Curriculum */}
                  <div className="space-y-2.5 mb-6">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Curriculum Highlights:
                    </span>
                    {course.coreCurriculum.map((topic, tIdx) => (
                      <div key={tIdx} className="flex items-start gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{topic}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <button
                    onClick={() => onRegisterMasterclass(course.title)}
                    className="w-full py-2.5 px-4 bg-slate-100 hover:bg-[#D9232A] text-slate-800 hover:text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Reserve Executive Seat</span>
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
