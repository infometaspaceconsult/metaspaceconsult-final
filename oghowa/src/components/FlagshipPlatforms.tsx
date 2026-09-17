import React from 'react';
import { FLAGSHIP_PROGRAMS } from '../data/mockData';
import { ProgramId } from '../types';
import { ArrowRight } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

interface FlagshipPlatformsProps {
  onSelectProgram: (programId: ProgramId) => void;
}

export const FlagshipPlatforms: React.FC<FlagshipPlatformsProps> = ({ onSelectProgram }) => {
  return (
    <section id="flagship-platforms" className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal direction="up" distance={20}>
          <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0A162B] tracking-tight">
              Flagship Platforms
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 font-normal">
              Initiatives designed to turn ideas into high-impact businesses.
            </p>
          </div>
        </ScrollReveal>

        {/* 6 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {FLAGSHIP_PROGRAMS.map((program, idx) => (
            <ScrollReveal
              key={program.id}
              direction="up"
              staggerIndex={idx}
              staggerDelay={80}
              distance={24}
              className="h-full"
            >
              <div
                id={`flagship-card-${program.id}`}
                onClick={() => onSelectProgram(program.id)}
                className="group h-full bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col cursor-pointer"
              >
                {/* Image Container with Zoom on Hover */}
                <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-100">
                  <img
                    src={program.imageUrl}
                    alt={program.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
                  <span className="absolute top-3 left-3 bg-[#0A162B]/85 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-1 rounded-md shadow-xs">
                    {program.tagline.split('.')[0]}
                  </span>
                </div>

                {/* Card Body */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-[#0A162B] group-hover:text-[#D9232A] transition-colors duration-200">
                      {program.title.replace('Oghowa ', '')}
                    </h3>
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed line-clamp-3">
                      {program.shortDescription}
                    </p>
                  </div>

                  {/* Learn More Action */}
                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-semibold text-blue-900 group-hover:text-[#D9232A] flex items-center gap-1.5 transition-colors">
                      <span>Learn More</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      Cohort 2026
                    </span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};
