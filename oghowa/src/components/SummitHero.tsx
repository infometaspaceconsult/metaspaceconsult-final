import React from 'react';
import { ArrowRight, FileText, MapPin, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';
import { useSiteConfig } from '../context/SiteConfigContext';
import { HeroCarouselBackground } from './HeroCarouselBackground';

interface SummitHeroProps {
  onRequestExecutiveAccess: () => void;
  onDownloadProspectus: () => void;
  onViewDealRoomSchedule?: () => void;
  onExplorePillars?: () => void;
}

export const SummitHero: React.FC<SummitHeroProps> = ({
  onRequestExecutiveAccess,
  onDownloadProspectus,
  onViewDealRoomSchedule,
  onExplorePillars,
}) => {
  const { config } = useSiteConfig();

  const summitPillarsPills = [
    { label: 'STRATEGIC CAPITAL', action: onExplorePillars },
    { label: 'INDUSTRIAL CORRIDORS', action: onExplorePillars },
    { label: 'CULTURAL COMMERCE', action: onExplorePillars },
    { label: 'ENERGY TRANSITION', action: onExplorePillars },
    { label: 'DEAL-ROOM SESSIONS', action: onViewDealRoomSchedule },
  ];

  return (
    <section
      id="summit-hero"
      className="relative bg-[#07132B] text-white overflow-hidden pt-16 md:pt-24 lg:pt-32 pb-0 min-h-[600px] flex flex-col justify-between"
    >
      {/* Background Image Carousel with rotating photos at intervals */}
      <HeroCarouselBackground
        images={config.hero.carouselImages}
        intervalMs={(config.settings?.carouselIntervalSeconds || 5) * 1000}
        overlayClassName="bg-gradient-to-r from-[#07132B]/95 via-[#0A162B]/90 to-[#07132B]/85"
      />

      {/* Summit Content Container */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 w-full pt-4">
        <div className="max-w-4xl">
          {/* Overline Badge */}
          <ScrollReveal direction="down" delay={50} distance={16}>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-950/80 border border-red-500/30 text-red-300 text-xs font-semibold tracking-wide uppercase mb-6 shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-red-400" />
              <span>Benin City, Edo State | Annual Institutional Summit</span>
            </div>
          </ScrollReveal>

          {/* Main Headline */}
          <ScrollReveal direction="up" delay={100} distance={24}>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12] mb-6">
              Architecting Edo State’s{' '}
              <span className="text-white">Industrial Renaissance</span>{' '}
              and Economic Autonomy
            </h1>
          </ScrollReveal>

          {/* Subheadline */}
          <ScrollReveal direction="up" delay={180} distance={20}>
            <p className="text-base sm:text-lg lg:text-xl text-slate-200 font-normal leading-relaxed mb-8 max-w-3xl">
              {config.hero.description ||
                "Convening the state's foremost policymakers, financial sector leaders, industrial pioneers, and institutional investors in Benin City to deploy capital, scale high-impact enterprises, and institutionalize long-term prosperity."}
            </p>
          </ScrollReveal>

          {/* Institutional Anchor Badges */}
          <ScrollReveal direction="up" delay={240} distance={18}>
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-8 text-xs text-slate-300">
              <div className="flex items-center gap-1.5 bg-slate-900/90 border border-white/10 px-3 py-1.5 rounded-md backdrop-blur-sm">
                <MapPin className="w-3.5 h-3.5 text-red-400" />
                <span className="font-semibold text-white">Benin City, Edo State, Nigeria</span>
              </div>

              <div className="flex items-center gap-1.5 bg-slate-900/90 border border-white/10 px-3 py-1.5 rounded-md backdrop-blur-sm">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Aligned with <strong className="text-white">Edo Investors Network (EIN)</strong></span>
              </div>
            </div>
          </ScrollReveal>

          {/* Quick Action Bar (Prompt 3: Request Executive Access | Download Comprehensive Prospectus | View Deal-Room Schedule) */}
          <ScrollReveal direction="up" delay={300} distance={18}>
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-14 sm:mb-16">
              <button
                id="summit-request-executive-access-btn"
                onClick={onRequestExecutiveAccess}
                className="px-6 sm:px-7 py-3.5 text-sm sm:text-base font-semibold text-white bg-[#D9232A] hover:bg-[#B9181F] active:scale-[0.98] transition-all rounded-md shadow-lg shadow-red-900/40 flex items-center gap-2 cursor-pointer"
              >
                <span>Request Executive Access</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="summit-download-prospectus-btn"
                onClick={onDownloadProspectus}
                className="px-6 sm:px-7 py-3.5 text-sm sm:text-base font-medium text-white bg-white/10 hover:bg-white/20 border border-white/25 active:scale-[0.98] transition-all rounded-md flex items-center gap-2 cursor-pointer backdrop-blur-sm"
              >
                <FileText className="w-4 h-4 text-slate-300" />
                <span>Download Comprehensive Prospectus</span>
              </button>

              {onViewDealRoomSchedule && (
                <button
                  id="summit-view-dealroom-btn"
                  onClick={onViewDealRoomSchedule}
                  className="px-5 sm:px-6 py-3.5 text-sm sm:text-base font-medium text-slate-200 hover:text-white bg-[#0A162B]/80 hover:bg-[#0A162B] border border-white/20 active:scale-[0.98] transition-all rounded-md flex items-center gap-2 cursor-pointer"
                >
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span>View Deal-Room Schedule</span>
                </button>
              )}
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* Bottom Ticker Strip */}
      <div className="relative z-10 border-t border-white/10 bg-[#050D1E]/95 backdrop-blur-md py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center sm:justify-between flex-wrap gap-y-2 gap-x-4 sm:gap-x-6 text-xs sm:text-sm font-medium tracking-wide text-slate-300">
            {summitPillarsPills.map((pill, idx) => (
              <React.Fragment key={idx}>
                <button
                  onClick={pill.action}
                  className="hover:text-red-400 transition-colors cursor-pointer uppercase text-xs tracking-wider"
                >
                  {pill.label}
                </button>
                {idx < summitPillarsPills.length - 1 && (
                  <span className="text-slate-600 select-none hidden sm:inline">•</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
