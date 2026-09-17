import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';
import { useSiteConfig } from '../context/SiteConfigContext';
import { HeroCarouselBackground } from './HeroCarouselBackground';

interface HeroProps {
  onRequestExecutiveAccess: () => void;
  onDownloadProspectus: () => void;
  onSelectRoleFilter?: (roleId: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  onRequestExecutiveAccess,
  onDownloadProspectus,
  onSelectRoleFilter,
}) => {
  const { config } = useSiteConfig();

  const audienceTracks = [
    { id: 'founders', label: 'Founders' },
    { id: 'investors', label: 'Investors' },
    { id: 'corporates', label: 'Corporates' },
    { id: 'government', label: 'Government' },
    { id: 'universities', label: 'Universities' },
    { id: 'ecosystem', label: 'Development Partners' },
  ];

  return (
    <section
      id="ecosystem-hero"
      className="relative bg-[#07132B] text-white overflow-hidden pt-16 md:pt-24 lg:pt-32 pb-0 min-h-[580px] sm:min-h-[640px] flex flex-col justify-between"
    >
      {/* Background Image Carousel rolling in time intervals */}
      <HeroCarouselBackground
        images={config.hero.carouselImages}
        intervalMs={(config.settings?.carouselIntervalSeconds || 5) * 1000}
        overlayClassName="bg-gradient-to-r from-[#07132B]/95 via-[#0A162B]/90 to-[#07132B]/85"
      />

      {/* Hero Content Container */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 w-full pt-4">
        <div className="max-w-3xl">
          {/* Badge */}
          <ScrollReveal direction="down" delay={50} distance={16}>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-950/80 border border-red-500/30 text-red-300 text-xs font-semibold tracking-wide uppercase mb-6 shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-red-400" />
              <span>{config.hero.eyebrow || 'Institutional Leadership & Economic Summit • Benin City'}</span>
            </div>
          </ScrollReveal>

          {/* Headline */}
          <ScrollReveal direction="up" delay={120} distance={24}>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.14] mb-6">
              {config.hero.headlineLine1}{' '}
              <span className="text-white block sm:inline">{config.hero.headlineLine2}</span>
            </h1>
          </ScrollReveal>

          {/* Subheadline */}
          <ScrollReveal direction="up" delay={200} distance={20}>
            <p className="text-base sm:text-lg lg:text-xl text-slate-200 font-normal leading-relaxed mb-8 max-w-2xl text-shadow-sm">
              {config.hero.description}
            </p>
          </ScrollReveal>

          {/* CTAs */}
          <ScrollReveal direction="up" delay={280} distance={18}>
            <div className="flex flex-wrap items-center gap-4 mb-14 sm:mb-16">
              <button
                id="hero-request-executive-access-btn"
                onClick={onRequestExecutiveAccess}
                className="px-6 sm:px-7 py-3.5 text-sm sm:text-base font-semibold text-white bg-[#D9232A] hover:bg-[#B9181F] active:scale-[0.98] transition-all rounded-md shadow-lg shadow-red-900/40 flex items-center gap-2 cursor-pointer"
              >
                <span>{config.hero.primaryCtaText || 'Request Executive Access'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="hero-download-prospectus-btn"
                onClick={onDownloadProspectus}
                className="px-6 sm:px-7 py-3.5 text-sm sm:text-base font-medium text-white bg-white/10 hover:bg-white/20 border border-white/25 active:scale-[0.98] transition-all rounded-md cursor-pointer backdrop-blur-sm"
              >
                {config.hero.secondaryCtaText || 'Download Comprehensive Prospectus'}
              </button>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* Audience Track Strip */}
      <div className="relative z-10 border-t border-white/15 bg-[#050D1E]/95 backdrop-blur-md py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center sm:justify-between flex-wrap gap-y-2 gap-x-4 sm:gap-x-6 text-xs sm:text-sm font-medium tracking-wide text-slate-300">
            <span className="text-slate-400 font-semibold uppercase text-[11px] tracking-wider hidden lg:inline">
              Audience Tracks:
            </span>
            {audienceTracks.map((track, idx) => (
              <React.Fragment key={track.id}>
                <button
                  onClick={() => onSelectRoleFilter?.(track.id)}
                  className="hover:text-white transition-colors cursor-pointer font-medium"
                >
                  {track.label}
                </button>
                {idx < audienceTracks.length - 1 && (
                  <span className="text-slate-600 select-none">•</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
