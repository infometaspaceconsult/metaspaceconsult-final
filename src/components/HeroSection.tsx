import React from 'react';
import { SiteConfig } from '../types';
import { ArrowRight, Lightbulb, Rocket, Users, TrendingUp, MapPin } from 'lucide-react';

interface HeroSectionProps {
  config: SiteConfig;
  onExploreVentures: () => void;
  onPartnerWithUs: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  config,
  onExploreVentures,
  onPartnerWithUs,
}) => {
  const { content, services } = config;

  return (
    <section id="hero" className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden bg-[#f5faff]">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headline & Content */}
          <div className="lg:col-span-7">
            {/* Eyebrow Tag matching Image 1 */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-100/80 border border-red-200/80 text-[#E63946] text-[11px] font-extrabold uppercase tracking-wider mb-6 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#E63946] animate-pulse" />
              <span>BUILDING SYSTEMS. EMPOWERING PEOPLE.</span>
            </div>

            {/* Headline matching Image 1 */}
            <h1 className="font-headline-xl text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] mb-6">
              <span className="block text-[#141B77]">Transforming</span>
              <span className="block text-[#E63946]">Africa.</span>
            </h1>

            {/* Subtitle */}
            <p className="font-body-lg text-base sm:text-lg text-slate-600 mb-8 leading-relaxed max-w-xl font-normal">
              {content.heroSubheadline}
            </p>

            {/* Call to Actions matching Image 1 */}
            <div className="flex flex-wrap items-center gap-3.5">
              <button
                onClick={onExploreVentures}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-[#E63946] hover:bg-[#d92332] text-white text-xs font-extrabold uppercase tracking-wider rounded-md transition shadow-md shadow-red-500/20 cursor-pointer transform hover:-translate-y-0.5"
              >
                <span>EXPLORE OUR VENTURES</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onPartnerWithUs}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-white hover:bg-slate-50 border border-slate-200 text-[#141B77] text-xs font-extrabold uppercase tracking-wider rounded-md transition shadow-2xs cursor-pointer"
              >
                <span>PARTNER WITH US</span>
                <ArrowRight className="w-4 h-4 text-[#E63946]" />
              </button>
            </div>
          </div>

          {/* Right Column: Ambient Visual Card matching Image 1 */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-[#141B77] via-[#2A31A0] to-[#0D1250] p-1 border border-white/20">
              <div className="relative h-80 sm:h-96 rounded-[22px] overflow-hidden flex flex-col justify-between p-6 bg-slate-900">
                {/* Background Image of Lekki Ikoyi Link Bridge */}
                <img
                  src="https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=1000&q=80"
                  alt="Lagos Lekki Ikoyi Link Bridge Metaspace"
                  className="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-700 hover:scale-105"
                />
                
                {/* Atmospheric Purple Gradient Overlay matching Image 1 */}
                <div className="absolute inset-0 bg-gradient-to-b from-purple-900/50 via-slate-900/40 to-slate-950/90 pointer-events-none" />
                <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/25 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute inset-0 bg-grid-pattern opacity-15 pointer-events-none" />

                {/* Top Bridge Tag matching Image 1 */}
                <div className="relative z-10">
                  <span className="text-[11px] font-semibold text-white/70 tracking-wider uppercase drop-shadow">
                    Lagos Lekki Ikoyi Link Bridge Metaspace
                  </span>
                </div>

                {/* Bottom Location Card Badge matching Image 1 */}
                <div className="relative z-10 bg-slate-900/85 backdrop-blur-md border border-white/10 rounded-2xl p-5 text-white shadow-xl">
                  <div className="flex items-center gap-2 mb-1.5 text-xs font-bold text-[#E63946]">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Benin City Headquarters</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-medium">
                    Anchoring technology ecosystem infrastructure & digital transformation across Nigeria's South-South region.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Top Services Bar matching Image 3 */}
        <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-3 bg-[#141B77] rounded-2xl p-3 sm:p-4 text-white shadow-xl border border-navy-900">
          {services.slice(0, 4).map((service, idx) => {
            const icons = [Lightbulb, Rocket, Users, TrendingUp];
            const Icon = icons[idx % icons.length];
            return (
              <a
                key={service.id}
                href={`#${service.id}`}
                className="flex flex-col sm:flex-row items-center sm:items-start gap-3 p-3.5 rounded-xl hover:bg-white/10 transition-colors group text-center sm:text-left"
              >
                <div className="p-2.5 rounded-lg bg-white/10 group-hover:bg-[#E63946] transition-colors shrink-0">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-red-200 transition-colors leading-snug">
                    {service.title}
                  </h4>
                  <p className="text-[11px] text-slate-300 line-clamp-2 mt-1 leading-normal font-normal hidden sm:block">
                    {service.description}
                  </p>
                </div>
              </a>
            );
          })}
        </div>

      </div>
    </section>
  );
};
