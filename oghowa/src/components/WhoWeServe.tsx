import React from 'react';
import { AUDIENCE_ROLES } from '../data/mockData';
import { DynamicIcon } from './DynamicIcon';
import { ArrowRight } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

interface WhoWeServeProps {
  onSelectRole: (roleId: string) => void;
}

export const WhoWeServe: React.FC<WhoWeServeProps> = ({ onSelectRole }) => {
  return (
    <section id="who-we-serve" className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal direction="up" distance={20}>
          <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#D9232A] mb-2 block">
              Multi-Stakeholder Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0A162B] tracking-tight">
              Who We Serve
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 font-normal">
              A comprehensive platform designed for every participant in Africa&apos;s emerging industrial and technology economy.
            </p>
          </div>
        </ScrollReveal>

        {/* 6 Cards Grid (Prompt 2: Founders, Investors, Corporates, Government, Universities, Ecosystem Partners) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {AUDIENCE_ROLES.map((role, idx) => (
            <ScrollReveal
              key={role.id}
              direction="up"
              staggerIndex={idx}
              staggerDelay={70}
              distance={24}
              className="h-full"
            >
              <div
                id={`role-card-${role.id}`}
                onClick={() => onSelectRole(role.id)}
                className="group relative h-full bg-white rounded-xl border border-slate-200 p-7 text-center flex flex-col items-center justify-between hover:border-slate-300 hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                {/* Icon in Circular Container */}
                <div className="w-14 h-14 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-[#0A162B] mb-5 group-hover:bg-red-50 group-hover:text-[#D9232A] group-hover:border-red-100 transition-colors duration-300">
                  <DynamicIcon name={role.iconName} className="w-6 h-6" />
                </div>

                {/* Title & Tagline/Description */}
                <div className="flex-1 flex flex-col items-center">
                  <h3 className="text-lg font-bold text-[#0A162B] group-hover:text-[#D9232A] transition-colors mb-2">
                    {role.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed max-w-xs">
                    {role.description}
                  </p>
                </div>

                {/* Learn More Action Link */}
                <div className="mt-6 pt-2 border-t border-slate-100 w-full flex items-center justify-center">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectRole(role.id);
                    }}
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-blue-900 group-hover:text-[#D9232A] transition-colors cursor-pointer"
                  >
                    <span>Learn More</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
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
