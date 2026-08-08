import React from 'react';
import { SiteConfig } from '../types';
import { ArrowRight, Boxes, Handshake, Heart, Layers } from 'lucide-react';

interface WhoWeAreSectionProps {
  config: SiteConfig;
  onLearnMore: () => void;
}

export const WhoWeAreSection: React.FC<WhoWeAreSectionProps> = ({
  config,
  onLearnMore,
}) => {
  const { content, stats } = config;

  const statIcons = [Boxes, Handshake, Heart, Layers];

  return (
    <section id="whoweare" className="py-20 bg-[#f5faff] border-y border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column: Who We Are Text */}
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#141B77] tracking-tight mb-6 font-headline-xl">
              Who We Are
            </h2>

            <p className="text-base sm:text-lg text-slate-700 leading-relaxed mb-6 font-normal">
              {content.aboutHeadline}
            </p>

            <p className="text-sm text-slate-600 leading-relaxed mb-8">
              By combining deep technical expertise with local contextual intelligence, Metaspace designs resilient digital systems that empower founders, governments, and enterprise leaders across Africa.
            </p>

            <button
              onClick={onLearnMore}
              className="inline-flex items-center gap-2 text-sm font-bold text-[#141B77] hover:text-[#E63946] transition-colors"
            >
              <span>More About Us</span>
              <ArrowRight className="w-4 h-4 text-[#E63946]" />
            </button>
          </div>

          {/* Right Column: Ecosystem Grid Card */}
          <div className="bg-white p-8 sm:p-10 rounded-2xl border border-slate-200/80 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#f5faff] rounded-bl-full pointer-events-none -z-0" />

            <div className="relative z-10">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#141B77] mb-8 leading-snug">
                We don't just build companies.
                <br />
                <span className="text-[#E63946]">We build ecosystems.</span>
              </h3>

              {/* 4 Stat Cards Grid (Matching image 1) */}
              <div id="stats" className="grid grid-cols-2 gap-6">
                {stats.map((stat, idx) => {
                  const Icon = statIcons[idx % statIcons.length];
                  return (
                    <div key={stat.id} className="p-4 bg-[#f5faff] rounded-xl border border-slate-100">
                      <div className="p-2 w-fit bg-white rounded-lg text-[#E63946] shadow-xs mb-3">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="text-2xl sm:text-3xl font-extrabold text-[#141B77] tracking-tight">
                        {stat.number}
                      </div>
                      <div className="text-xs font-semibold text-slate-600 mt-1">
                        {stat.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
