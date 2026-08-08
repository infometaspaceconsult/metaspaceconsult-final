import React from 'react';
import { SiteConfig, ServiceItem } from '../types';
import { Lightbulb, Rocket, Users, TrendingUp, Cpu, Check, ArrowRight } from 'lucide-react';

interface ServicesSectionProps {
  config: SiteConfig;
  onSelectService: (service: ServiceItem) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  config,
  onSelectService,
}) => {
  const { services } = config;

  const getServiceIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'lightbulb':
        return <Lightbulb className="w-6 h-6 text-[#141B77]" />;
      case 'rocket':
        return <Rocket className="w-6 h-6 text-[#E63946]" />;
      case 'users':
        return <Users className="w-6 h-6 text-[#141B77]" />;
      case 'trendingup':
        return <TrendingUp className="w-6 h-6 text-[#E63946]" />;
      case 'cpu':
        return <Cpu className="w-6 h-6 text-amber-500" />;
      default:
        return <Rocket className="w-6 h-6 text-[#E63946]" />;
    }
  };

  return (
    <section id="services" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#E63946] mb-2 block">
            Capabilities & Core Offerings
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#141B77] tracking-tight font-headline-xl">
            What We Do
          </h2>
          <p className="text-base text-slate-600 mt-3">
            We partner with enterprises, visionary founders, and development institutions to turn high-impact ideas into market leaders.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className={`p-8 rounded-2xl border transition-all duration-300 flex flex-col justify-between group ${
                service.highlight
                  ? 'bg-gradient-to-br from-[#141B77] to-[#0A0E45] text-white border-[#141B77] shadow-xl'
                  : 'bg-[#f5faff] border-slate-200/80 text-slate-800 hover:shadow-lg hover:border-slate-300'
              }`}
            >
              <div>
                <div
                  className={`p-3.5 w-fit rounded-xl mb-6 ${
                    service.highlight ? 'bg-white/10 text-white' : 'bg-white shadow-xs border border-slate-100'
                  }`}
                >
                  {getServiceIcon(service.iconName)}
                </div>

                <h3
                  className={`text-xl font-bold mb-3 ${
                    service.highlight ? 'text-white' : 'text-[#141B77]'
                  }`}
                >
                  {service.title}
                </h3>

                <p
                  className={`text-xs sm:text-sm leading-relaxed mb-6 ${
                    service.highlight ? 'text-slate-200' : 'text-slate-600'
                  }`}
                >
                  {service.description}
                </p>

                {/* Features List */}
                {service.features && (
                  <div className="space-y-2 mb-8">
                    {service.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-2 text-xs font-medium">
                        <Check
                          className={`w-3.5 h-3.5 shrink-0 ${
                            service.highlight ? 'text-emerald-400' : 'text-[#E63946]'
                          }`}
                        />
                        <span className={service.highlight ? 'text-slate-300' : 'text-slate-700'}>
                          {feat}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => onSelectService(service)}
                className={`inline-flex items-center gap-2 text-xs font-bold transition-all ${
                  service.highlight
                    ? 'text-red-400 hover:text-white'
                    : 'text-[#141B77] group-hover:text-[#E63946]'
                }`}
              >
                <span>Request Consultation for {service.title}</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
