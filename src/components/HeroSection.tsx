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
    <section id="hero" className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-slate-950 text-white min-h-[80vh] flex flex-col justify-center">
      {/* Background Image of Lekki Ikoyi Link Bridge across the entire Hero section */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=2000&q=80"
          alt="Lagos Lekki Ikoyi Link Bridge Metaspace"
          className="w-full h-full object-cover object-center"
        />
        {/* Dark Deep Navy Gradient Overlay for optimal readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F3B]/95 via-[#141B77]/85 to-slate-950/80" />
        <div className="absolute inset-0 bg-grid-pattern opacity-15 pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="max-w-3xl">
          {/* Eyebrow Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/20 border border-red-500/30 text-[#E63946] text-[11px] font-extrabold uppercase tracking-wider mb-6 backdrop-blur-md shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#E63946] animate-pulse" />
            <span>BUILDING SYSTEMS. EMPOWERING PEOPLE.</span>
          </div>

          {/* Location Badge */}
          <div className="flex items-center gap-2 mb-4 text-xs font-semibold text-slate-300">
            <MapPin className="w-3.5 h-3.5 text-[#E63946]" />
            <span>Lagos Lekki-Ikoyi Link Bridge & Benin City Headquarters, Nigeria</span>
          </div>

          {/* Headline */}
          <h1 className="font-headline-xl text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] mb-6 text-white">
            <span className="block">Transforming</span>
            <span className="block text-[#E63946]">Africa.</span>
          </h1>

          {/* Subtitle */}
          <p className="font-body-lg text-base sm:text-lg text-slate-200 mb-8 leading-relaxed max-w-2xl font-normal drop-shadow">
            {content.heroSubheadline}
          </p>

          {/* Call to Actions */}
          <div className="flex flex-wrap items-center gap-3.5 mb-12">
            <button
              onClick={onExploreVentures}
              className="inline-flex items-center gap-2.5 px-7 py-4 bg-[#E63946] hover:bg-[#d92332] text-white text-xs font-extrabold uppercase tracking-wider rounded-md transition shadow-lg shadow-red-600/30 cursor-pointer transform hover:-translate-y-0.5"
            >
              <span>EXPLORE OUR VENTURES</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onPartnerWithUs}
              className="inline-flex items-center gap-2.5 px-7 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-extrabold uppercase tracking-wider rounded-md backdrop-blur-md transition shadow-sm cursor-pointer"
            >
              <span>PARTNER WITH US</span>
              <ArrowRight className="w-4 h-4 text-[#E63946]" />
            </button>
          </div>
        </div>

        {/* Top Services Bar */}
        <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-3 bg-[#141B77]/90 backdrop-blur-md rounded-2xl p-3 sm:p-4 text-white shadow-2xl border border-white/10">
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
