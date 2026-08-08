import React, { useState } from 'react';
import { SiteConfig, Venture } from '../types';
import { GraduationCap, Rocket, Bus, HeartPulse, Zap, ArrowRight, X, ExternalLink } from 'lucide-react';

interface VenturesSectionProps {
  config: SiteConfig;
  onSelectVentureForInquiry: (venture: Venture) => void;
}

export const VenturesSection: React.FC<VenturesSectionProps> = ({
  config,
  onSelectVentureForInquiry,
}) => {
  const { ventures, theme } = config;
  const [selectedVenture, setSelectedVenture] = useState<Venture | null>(null);

  const getVentureIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'graduationcap':
        return <GraduationCap className="w-6 h-6 text-[#E63946]" />;
      case 'bus':
        return <Bus className="w-6 h-6 text-[#141B77]" />;
      case 'heartpulse':
        return <HeartPulse className="w-6 h-6 text-[#E63946]" />;
      case 'zap':
        return <Zap className="w-6 h-6 text-amber-500" />;
      default:
        return <Rocket className="w-6 h-6 text-[#E63946]" />;
    }
  };

  return (
    <section id="ventures" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#141B77] tracking-tight mb-4 font-headline-xl">
            Our Ventures
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-normal">
            Purpose-built ventures solving Africa's most important challenges.
          </p>
        </div>

        {/* Venture Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ventures.map((venture) => (
            <div
              key={venture.id}
              className="bg-[#f5faff] border border-slate-200/80 rounded-xl p-6 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
            >
              <div>
                {/* Header Icon & Category */}
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                    {getVentureIcon(venture.iconName)}
                  </div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 bg-white border border-slate-200 text-slate-600 rounded-full">
                    {venture.category.split(' ')[0]}
                  </span>
                </div>

                {/* Title & Tagline */}
                <h3 className="text-xl font-bold text-[#141B77] mb-2 group-hover:text-[#E63946] transition-colors">
                  {venture.title}
                </h3>

                <p className="text-xs font-semibold text-slate-500 mb-3">
                  {venture.tagline}
                </p>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6 line-clamp-3">
                  {venture.description}
                </p>
              </div>

              <div>
                {/* Impact Badge */}
                {venture.impactMetric && (
                  <div className="mb-4 py-1.5 px-3 bg-white/80 rounded-lg border border-slate-200 text-[11px] font-medium text-slate-700 flex items-center justify-between">
                    <span className="text-slate-400">Impact:</span>
                    <span className="font-bold text-[#141B77]">{venture.impactMetric}</span>
                  </div>
                )}

                {/* Action Link */}
                <button
                  onClick={() => setSelectedVenture(venture)}
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#141B77] group-hover:text-[#E63946] transition-colors"
                >
                  <span>Learn More</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal View for Selected Venture */}
      {selectedVenture && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative border border-slate-100">
            <button
              onClick={() => setSelectedVenture(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-[#f5faff] rounded-xl border border-slate-200">
                {getVentureIcon(selectedVenture.iconName)}
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#E63946]">
                  {selectedVenture.category}
                </span>
                <h3 className="text-2xl font-extrabold text-[#141B77]">{selectedVenture.title}</h3>
              </div>
            </div>

            <p className="text-sm font-semibold text-slate-700 mb-4">{selectedVenture.tagline}</p>

            <p className="text-sm text-slate-600 leading-relaxed mb-6">{selectedVenture.description}</p>

            {selectedVenture.impactMetric && (
              <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100 mb-6">
                <span className="text-xs font-semibold text-slate-500 uppercase block mb-1">
                  Validated Ecosystem Metric:
                </span>
                <span className="text-base font-bold text-[#141B77]">{selectedVenture.impactMetric}</span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  const v = selectedVenture;
                  setSelectedVenture(null);
                  onSelectVentureForInquiry(v);
                }}
                className="flex-1 py-3 bg-[#141B77] hover:bg-navy-900 text-white font-bold text-xs uppercase tracking-wider rounded-md text-center shadow"
              >
                Inquire / Partner with {selectedVenture.title}
              </button>

              <button
                onClick={() => setSelectedVenture(null)}
                className="py-3 px-5 border border-slate-300 text-slate-700 font-semibold text-xs rounded-md text-center hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
