import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroCarouselBackgroundProps {
  images?: string[];
  intervalMs?: number;
  overlayClassName?: string;
  showControls?: boolean;
}

const DEFAULT_CAROUSEL_IMAGES = [
  'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=2000&q=80', // Institutional summit auditorium
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=80', // Modern architecture & business towers
  'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=2000&q=80', // Executive boardroom & deal-making
  'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=2000&q=80', // Industrial innovation & manufacturing
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=2000&q=80', // African tech innovation & pitch stage
];

export const HeroCarouselBackground: React.FC<HeroCarouselBackgroundProps> = ({
  images = DEFAULT_CAROUSEL_IMAGES,
  intervalMs = 5500,
  overlayClassName = 'bg-gradient-to-r from-[#07132B]/95 via-[#0A162B]/90 to-[#07132B]/85',
  showControls = true,
}) => {
  const activeImages = images && images.length > 0 ? images : DEFAULT_CAROUSEL_IMAGES;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || activeImages.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeImages.length);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [activeImages.length, intervalMs, isPaused]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + activeImages.length) % activeImages.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % activeImages.length);
  };

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Image Slides with Crossfade and Ken-Burns movement */}
      {activeImages.map((src, index) => {
        const isActive = index === currentIndex;
        return (
          <div
            key={src + index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <img
              src={src}
              alt=""
              aria-hidden="true"
              className={`w-full h-full object-cover object-center transform transition-transform duration-[7000ms] ease-out ${
                isActive ? 'scale-105' : 'scale-100'
              }`}
            />
          </div>
        );
      })}

      {/* Institutional High-Contrast Color Overlay for Readability */}
      <div className={`absolute inset-0 z-20 ${overlayClassName}`} />

      {/* Subtle Radial Vignette */}
      <div className="absolute inset-0 z-20 bg-[radial-gradient(ellipse_at_top_right,rgba(217,35,42,0.15),transparent_60%)] pointer-events-none" />

      {/* Carousel Navigation Indicators */}
      {showControls && activeImages.length > 1 && (
        <div className="absolute bottom-4 right-6 z-30 pointer-events-auto flex items-center gap-2 bg-[#0A162B]/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-lg">
          <button
            onClick={handlePrev}
            aria-label="Previous background photo"
            className="text-slate-300 hover:text-white transition-colors p-0.5 rounded cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center gap-1.5 px-1">
            {activeImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Slide ${idx + 1}`}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  idx === currentIndex
                    ? 'w-4 h-1.5 bg-[#D9232A]'
                    : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            aria-label="Next background photo"
            className="text-slate-300 hover:text-white transition-colors p-0.5 rounded cursor-pointer"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
