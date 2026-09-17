import React from 'react';
import { Venture } from '../types';
import { ArrowRight, BookOpen, Bus, HeartPulse, Sparkles, ExternalLink } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';
import { useSiteConfig } from '../context/SiteConfigContext';

interface FeaturedVenturesProps {
  onSelectVenture?: (venture: any) => void;
}

export const FeaturedVentures: React.FC<FeaturedVenturesProps> = ({ onSelectVenture }) => {
  const { config } = useSiteConfig();
  const ventures = config.featuredVentures || [];

  const getVentureIcon = (name: string, sector: string) => {
    const lower = (name + ' ' + sector).toLowerCase();
    if (lower.includes('ugbekun') || lower.includes('edtech') || lower.includes('education')) {
      return <BookOpen className="w-5 h-5 text-emerald-600" />;
    }
    if (lower.includes('eduride') || lower.includes('transport') || lower.includes('transit')) {
      return <Bus className="w-5 h-5 text-amber-600" />;
    }
    if (lower.includes('cysma') || lower.includes('health') || lower.includes('medicare')) {
      return <HeartPulse className="w-5 h-5 text-blue-600" />;
    }
    return <Sparkles className="w-5 h-5 text-rose-600" />;
  };

  return (
    <section id="featured-ventures" className="py-16 sm:py-20 lg:py-24 bg-slate-50 border-t border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal direction="up" distance={20}>
          <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#D9232A] mb-2 block">
              Portfolio & Category Leaders
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0A162B] tracking-tight">
              Featured Ventures Showcase
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 font-normal">
              High-growth scalable enterprises incubated, accelerated, and syndicated through Oghowa.
            </p>
          </div>
        </ScrollReveal>

        {/* 4 Cards Grid: Ugbekun, EduRide, Cysma Medicare, Future Ventures */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {ventures.map((venture, idx) => (
            <ScrollReveal
              key={venture.id}
              direction="up"
              staggerIndex={idx}
              staggerDelay={80}
              distance={22}
              className="h-full"
            >
              <div
                id={`venture-card-${venture.id}`}
                onClick={() => onSelectVenture?.(venture)}
                className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between shadow-xs hover:shadow-xl hover:border-slate-300 transition-all duration-300 group cursor-pointer h-full"
              >
                <div>
                  {/* Header: Logo Icon & Sector Badge */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-center shrink-0 group-hover:bg-white group-hover:shadow-xs transition-colors overflow-hidden p-1">
                      {venture.logoUrl ? (
                        <img
                          src={venture.logoUrl}
                          alt={venture.name}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        getVentureIcon(venture.name, venture.sector)
                      )}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#0A162B] group-hover:text-[#D9232A] transition-colors leading-snug">
                        {venture.name}
                      </h3>
                      <span className="text-[11px] font-medium text-slate-500 block">
                        {venture.sector}
                      </span>
                    </div>
                  </div>

                  {/* Tagline */}
                  <p className="text-xs font-semibold text-slate-700 mb-2">
                    {venture.tagline}
                  </p>

                  {/* Description */}
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-4">
                    {venture.description}
                  </p>

                  {/* Quick Metrics if available */}
                  {venture.metrics && venture.metrics.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 my-3 p-2 bg-slate-50 rounded-lg border border-slate-100 text-center">
                      {venture.metrics.map((m, mIdx) => (
                        <div key={mIdx}>
                          <div className="text-xs font-bold text-[#0A162B]">{m.value}</div>
                          <div className="text-[10px] text-slate-500">{m.label}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer Action */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                  <span className="text-xs font-semibold text-blue-900 group-hover:text-[#D9232A] flex items-center gap-1 transition-colors">
                    <span>Explore Venture</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200/60">
                    Active
                  </span>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};
