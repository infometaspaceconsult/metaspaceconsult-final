import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ShieldCheck } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';
import { useSiteConfig } from '../context/SiteConfigContext';

export const PartnersSection: React.FC = () => {
  const { config } = useSiteConfig();
  const rawPartners = config.strategicPartners && config.strategicPartners.length > 0
    ? config.strategicPartners
    : [
        {
          id: 'p1',
          name: 'Edo State Government',
          category: 'Sovereign Sponsor',
          badge: 'Sovereign Anchor',
          logoUrl: '',
          websiteUrl: 'https://edostate.gov.ng',
        },
        {
          id: 'p2',
          name: 'Edo Investors Network (EIN)',
          category: 'Ecosystem Anchor',
          badge: 'Ecosystem Host',
          logoUrl: '',
          websiteUrl: '#',
        },
        {
          id: 'p3',
          name: 'Bank of Industry',
          category: 'Development Financial Institution',
          badge: 'DFI Anchor',
          logoUrl: '',
          websiteUrl: 'https://www.boi.ng',
        },
        {
          id: 'p4',
          name: 'Africa Finance Corporation',
          category: 'Multilateral Financial Partner',
          badge: 'Multilateral',
          logoUrl: '',
          websiteUrl: 'https://www.africafc.org',
        },
        {
          id: 'p5',
          name: 'Sterling Bank',
          category: 'Commercial Banking Partner',
          badge: 'Banking Partner',
          logoUrl: '',
          websiteUrl: 'https://sterling.ng',
        },
        {
          id: 'p6',
          name: 'Microsoft',
          category: 'Technology & Cloud Partner',
          badge: 'Cloud Alliance',
          logoUrl: '',
          websiteUrl: 'https://microsoft.com',
        },
        {
          id: 'p7',
          name: 'AWS',
          category: 'Cloud Infrastructure Partner',
          badge: 'Infrastructure',
          logoUrl: '',
          websiteUrl: 'https://aws.amazon.com',
        },
        {
          id: 'p8',
          name: 'Dangote Group',
          category: 'Industrial Pioneer',
          badge: 'Industrial Anchor',
          logoUrl: '',
          websiteUrl: 'https://dangote.com',
        },
      ];

  const [startIndex, setStartIndex] = useState(0);

  // Auto-advance carousel every 4 seconds
  useEffect(() => {
    if (rawPartners.length <= 4) return;
    const timer = setInterval(() => {
      setStartIndex((prev) => (prev + 1) % rawPartners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [rawPartners.length]);

  const handlePrev = () => {
    setStartIndex((prev) => (prev - 1 + rawPartners.length) % rawPartners.length);
  };

  const handleNext = () => {
    setStartIndex((prev) => (prev + 1) % rawPartners.length);
  };

  // Visible items slice with wrap-around
  const count = rawPartners.length;
  const visiblePartners = count <= 4
    ? rawPartners
    : [
        rawPartners[startIndex % count],
        rawPartners[(startIndex + 1) % count],
        rawPartners[(startIndex + 2) % count],
        rawPartners[(startIndex + 3) % count],
      ];

  return (
    <section id="institutional-anchors" className="py-14 sm:py-16 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal direction="up" distance={16}>
          <div className="text-center mb-8 sm:mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-red-600" />
              <span>Institutional Governance & Alliances</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#0A162B] tracking-tight">
              Institutional Anchors & Strategic Partners
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Aligned with regulatory entities, sovereign agencies, regional banks, and pan-African capital networks.
            </p>
          </div>
        </ScrollReveal>

        {/* Rolling Partners Carousel */}
        <div className="relative flex items-center justify-between gap-2 sm:gap-4">
          <button
            type="button"
            onClick={handlePrev}
            className="flex w-9 h-9 rounded-full border border-slate-200 items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors shrink-0 cursor-pointer shadow-xs"
            aria-label="Previous partners"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Cards Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 flex-1">
            {visiblePartners.map((partner, index) => {
              const cardContent = (
                <div
                  key={partner.id || partner.name + index}
                  className="bg-slate-50/80 hover:bg-white border border-slate-200/80 rounded-xl p-4 flex flex-col items-center justify-center text-center transition-all duration-300 hover:shadow-md hover:border-slate-300 h-28 group"
                >
                  <div className="mb-2 flex items-center justify-center h-10 w-full">
                    {partner.logoUrl ? (
                      <img
                        src={partner.logoUrl}
                        alt={partner.name}
                        className="max-h-9 max-w-[130px] object-contain transition-transform group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-[#06132b] text-white flex items-center justify-center text-[10px] font-black shadow-2xs">
                          {partner.name.slice(0, 3).toUpperCase()}
                        </div>
                        <div className="text-left">
                          <span className="font-sans font-bold text-slate-900 text-xs line-clamp-1 block">
                            {partner.name}
                          </span>
                          <span className="text-[9px] text-red-600 font-semibold uppercase tracking-wider block truncate">
                            {partner.badge || partner.category}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider line-clamp-1">
                    {partner.category}
                  </span>
                </div>
              );

              return partner.websiteUrl && partner.websiteUrl !== '#' ? (
                <a
                  key={partner.id || partner.name + index}
                  href={partner.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block no-underline"
                >
                  {cardContent}
                </a>
              ) : (
                cardContent
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleNext}
            className="flex w-9 h-9 rounded-full border border-slate-200 items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors shrink-0 cursor-pointer shadow-xs"
            aria-label="Next partners"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
