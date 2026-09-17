import React from 'react';
import { IMPACT_STATS } from '../data/mockData';
import { DynamicIcon } from './DynamicIcon';
import { ScrollReveal } from './ScrollReveal';

export const ImpactSection: React.FC = () => {
  return (
    <section id="our-impact" className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal direction="up" distance={20}>
          <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0A162B] tracking-tight">
              Our Impact
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 font-normal">
              Empowering ventures that build resilient industries across the African continent.
            </p>
          </div>
        </ScrollReveal>

        {/* 6 Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {IMPACT_STATS.map((stat, index) => (
            <ScrollReveal
              key={index}
              direction="up"
              staggerIndex={index}
              staggerDelay={70}
              distance={22}
            >
              <div
                id={`impact-stat-${index}`}
                className="bg-white rounded-xl border border-slate-200/90 p-5 sm:p-6 flex flex-col items-center text-center shadow-xs hover:shadow-xl hover:border-slate-300 transition-all duration-300 group h-full"
              >
                {/* Icon Container */}
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-slate-50 flex items-center justify-center text-[#D9232A] group-hover:bg-red-50 group-hover:scale-110 transition-all duration-300 mb-4">
                  <DynamicIcon name={stat.iconName} className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>

                {/* Stat Metric */}
                <div className="text-2xl sm:text-3xl lg:text-3xl font-extrabold text-[#0A162B] tracking-tight mb-1">
                  {stat.value}
                </div>

                {/* Stat Label */}
                <div className="text-xs sm:text-sm font-medium text-slate-600 leading-snug">
                  {stat.label}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};
