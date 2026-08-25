import React, { useState } from "react";
import { ClientLogo } from "../types";

interface ClientLogosCarouselProps {
  clientLogos: ClientLogo[];
  title?: string;
  subtitle?: string;
}

export default function ClientLogosCarousel({
  clientLogos,
  title = "Trusted by Innovators & Institutions",
  subtitle = "Powering forward-thinking organizations, venture builders, and public partners across Africa",
}: ClientLogosCarouselProps) {
  const [activeLogoId, setActiveLogoId] = useState<string | null>(null);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  if (!clientLogos || clientLogos.length === 0) return null;

  // Duplicate the list 3x to ensure uninterrupted, seamless infinite scrolling loop
  const duplicatedLogos = [...clientLogos, ...clientLogos, ...clientLogos];

  const handleImageError = (id: string) => {
    setFailedImages((prev) => ({ ...prev, [id]: true }));
  };

  const handleLogoClick = (e: React.MouseEvent, logoId: string) => {
    // Strictly prevent any navigation or hyperlink function
    e.preventDefault();
    e.stopPropagation();
    setActiveLogoId((current) => (current === logoId ? null : logoId));
  };

  return (
    <section className="py-12 bg-white/70 border-y border-gray-100 overflow-hidden relative select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 text-center space-y-1.5">
        <h3 className="text-xs sm:text-sm font-display font-extrabold uppercase tracking-widest text-brand-blue/80">
          {title}
        </h3>
        {subtitle && (
          <p className="text-[11px] text-gray-500 font-sans max-w-xl mx-auto line-clamp-1">
            {subtitle}
          </p>
        )}
      </div>

      {/* Infinite Carousel Scroller Container with Edge Gradient Fades */}
      <div className="relative w-full overflow-hidden group">
        {/* Left and Right Subtle Gradient Fade Overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />

        {/* Moving Track */}
        <div className="flex w-max items-center gap-6 sm:gap-8 py-3 animate-marquee group-hover:[animation-play-state:paused]">
          {duplicatedLogos.map((client, index) => {
            const isFailed = failedImages[`${client.id}-${index}`] || !client.logoUrl;
            const isSelected = activeLogoId === client.id;

            return (
              <button
                key={`${client.id}-${index}`}
                type="button"
                onClick={(e) => handleLogoClick(e, client.id)}
                className={`flex items-center gap-3 px-5 py-3 rounded-2xl border transition-all duration-300 transform outline-none cursor-pointer text-left shrink-0 ${
                  isSelected
                    ? "opacity-100 bg-white border-brand-blue/30 shadow-md scale-105 ring-2 ring-brand-blue/15"
                    : "opacity-50 hover:opacity-100 bg-gray-50/80 hover:bg-white border-gray-200/70 hover:border-gray-300 hover:shadow-sm hover:scale-105"
                }`}
                title={client.name}
              >
                {/* Logo Image / Avatar / Fallback */}
                <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 shadow-inner flex items-center justify-center overflow-hidden shrink-0">
                  {!isFailed ? (
                    <img
                      src={client.logoUrl}
                      alt={client.name}
                      referrerPolicy="no-referrer"
                      onError={() => handleImageError(`${client.id}-${index}`)}
                      className="w-full h-full object-cover object-center"
                    />
                  ) : (
                    <div className="w-full h-full bg-brand-blue/10 flex items-center justify-center text-brand-blue font-bold text-xs uppercase">
                      {client.name ? client.name.slice(0, 2) : "MC"}
                    </div>
                  )}
                </div>

                {/* Client / Partner Typography */}
                <div className="flex flex-col">
                  <span className="font-display font-bold text-xs text-brand-blue whitespace-nowrap">
                    {client.name}
                  </span>
                  <span className="text-[9px] font-sans font-medium text-gray-600 uppercase tracking-wider whitespace-nowrap">
                    Partner / Client
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-33.333333%);
          }
        }
        .animate-marquee {
          animation: marquee 32s linear infinite;
        }
      `}</style>
    </section>
  );
}
