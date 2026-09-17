import React, { useState } from 'react';
import { INFRASTRUCTURE_ITEMS } from '../data/mockData';
import { DynamicIcon } from './DynamicIcon';
import { Sparkles } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

interface InfrastructureSectionProps {
  onExploreTech?: () => void;
}

export const InfrastructureSection: React.FC<InfrastructureSectionProps> = ({ onExploreTech }) => {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  return (
    <section
      id="infrastructure-section"
      className="py-16 sm:py-20 lg:py-24 bg-[#051026] text-white relative overflow-hidden"
    >
      {/* Subtle background gradient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <ScrollReveal direction="up" distance={20}>
          <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
              Infrastructure That Builds Businesses
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-300 font-normal">
              We provide access to critical infrastructure so founders can focus on what matters.
            </p>
          </div>
        </ScrollReveal>

        {/* Responsive Grid of Infrastructure Icons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 sm:gap-4">
          {INFRASTRUCTURE_ITEMS.map((item, idx) => {
            const isSelected = selectedItem === item.id;

            return (
              <ScrollReveal
                key={item.id}
                direction="up"
                staggerIndex={idx}
                staggerDelay={45}
                distance={18}
              >
                <div
                  id={`infra-card-${item.id}`}
                  onClick={() => setSelectedItem(isSelected ? null : item.id)}
                  className={`group h-full rounded-xl p-4 sm:p-5 flex flex-col items-center text-center transition-all duration-300 cursor-pointer border ${
                    isSelected
                      ? 'bg-blue-900/60 border-blue-400 shadow-lg shadow-blue-900/40 scale-102'
                      : 'bg-[#0A1A3A]/70 hover:bg-[#0E234D] border-white/10 hover:border-white/20'
                  }`}
                >
                  {/* Icon Container */}
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-lg bg-white/10 group-hover:bg-white/15 flex items-center justify-center text-blue-200 group-hover:text-white transition-colors mb-3">
                    <DynamicIcon name={item.iconName} className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>

                  {/* Name */}
                  <span className="text-xs sm:text-sm font-semibold text-slate-100 group-hover:text-white leading-snug">
                    {item.name}
                  </span>

                  {/* Category Pill */}
                  <span className="mt-1 text-[10px] text-blue-300/70 uppercase tracking-wider font-medium">
                    {item.category}
                  </span>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Interactive Feature Tooltip / Info Banner */}
        {selectedItem && (
          <ScrollReveal direction="up" delay={50} distance={12}>
            <div className="mt-8 max-w-2xl mx-auto bg-blue-950/90 border border-blue-500/30 rounded-xl p-4 sm:p-5 flex items-start gap-3.5 text-slate-200 animate-in fade-in duration-150">
              <div className="w-9 h-9 rounded-lg bg-blue-500/20 text-blue-300 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">
                  {INFRASTRUCTURE_ITEMS.find((i) => i.id === selectedItem)?.name} Stack
                </h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {INFRASTRUCTURE_ITEMS.find((i) => i.id === selectedItem)?.description}
                </p>
              </div>
            </div>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
};
