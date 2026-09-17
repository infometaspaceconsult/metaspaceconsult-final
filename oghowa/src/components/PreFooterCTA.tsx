import React from 'react';
import { ArrowRight, Handshake } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

interface PreFooterCTAProps {
  onJoinOghowa: () => void;
  onBecomePartner: () => void;
}

export const PreFooterCTA: React.FC<PreFooterCTAProps> = ({
  onJoinOghowa,
  onBecomePartner,
}) => {
  return (
    <section id="cta-banner" className="bg-[#07132B] text-white py-16 sm:py-20 relative overflow-hidden border-t border-slate-800">
      {/* Background soft ambient accents */}
      <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-20 -top-20 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl">
          <ScrollReveal direction="up" distance={20}>
            {/* Main Headline */}
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white mb-4">
              Africa's Next Great Venture Could Start Here.
            </h2>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={80} distance={18}>
            {/* Subtitle */}
            <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed mb-8 max-w-2xl">
              Whether you're building a startup, investing in innovation, shaping policy or partnering for impact, Oghowa provides the ecosystem to turn ambition into lasting success.
            </p>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={160} distance={15}>
            {/* Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                id="cta-join-oghowa-button"
                onClick={onJoinOghowa}
                className="px-6 sm:px-7 py-3 text-sm sm:text-base font-semibold text-white bg-[#D9232A] hover:bg-[#B9181F] active:scale-[0.98] transition-all rounded-md shadow-lg shadow-red-900/30 flex items-center gap-2 cursor-pointer"
              >
                <span>Join Oghowa</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="cta-become-partner-button"
                onClick={onBecomePartner}
                className="px-6 sm:px-7 py-3 text-sm sm:text-base font-medium text-white bg-transparent hover:bg-white/10 border border-white/30 active:scale-[0.98] transition-all rounded-md flex items-center gap-2 cursor-pointer"
              >
                <Handshake className="w-4 h-4 text-slate-300" />
                <span>Become a Partner</span>
              </button>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};
