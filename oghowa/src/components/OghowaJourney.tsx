import React, { useState } from 'react';
import { JOURNEY_STEPS } from '../data/mockData';
import { DynamicIcon } from './DynamicIcon';
import { CheckCircle2 } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

export const OghowaJourney: React.FC = () => {
  const [activeStepIndex, setActiveStepIndex] = useState<number | null>(3); // Default Fund highlighted

  return (
    <section id="oghowa-journey" className="py-16 sm:py-20 lg:py-24 bg-slate-50 border-y border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <ScrollReveal direction="up" distance={20}>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0A162B] tracking-tight">
              The Oghowa Journey
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 font-normal">
              We support entrepreneurs throughout their entire venture lifecycle—from idea to impact.
            </p>
          </div>
        </ScrollReveal>

        {/* Stepper Pipeline */}
        <div className="relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-7 left-[6%] right-[6%] h-[2px] bg-slate-200 z-0">
            <div
              className="h-full bg-red-500/50 transition-all duration-300"
              style={{
                width: activeStepIndex !== null ? `${((activeStepIndex + 1) / 6) * 100}%` : '66%',
              }}
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-4 relative z-10">
            {JOURNEY_STEPS.map((step, idx) => {
              const isSelected = activeStepIndex === idx;
              const isFundStep = step.isHighlighted; // Step 4 is red in screenshot

              return (
                <ScrollReveal
                  key={step.stepNumber}
                  direction="up"
                  staggerIndex={idx}
                  staggerDelay={80}
                  distance={20}
                >
                  <div
                    id={`journey-step-${step.stepNumber}`}
                    onClick={() => setActiveStepIndex(idx)}
                    className={`flex flex-col items-center text-center p-3 rounded-xl transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? 'bg-white shadow-sm ring-1 ring-slate-300/80 scale-102'
                        : 'hover:bg-white/60'
                    }`}
                  >
                    {/* Step Circle with Icon */}
                    <div className="relative mb-4">
                      <div
                        className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-md transition-all duration-300 ${
                          isFundStep
                            ? 'bg-[#D9232A] ring-4 ring-red-100'
                            : isSelected
                            ? 'bg-[#0A162B] ring-4 ring-blue-100'
                            : 'bg-[#0A162B] hover:bg-[#122447]'
                        }`}
                      >
                        <DynamicIcon name={step.iconName} className="w-6 h-6" />
                      </div>

                      {/* Step Number Badge */}
                      <span
                        className={`absolute -top-1 -right-1 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center border-2 border-white ${
                          isFundStep ? 'bg-[#0A162B] text-white' : 'bg-[#D9232A] text-white'
                        }`}
                      >
                        {step.stepNumber}
                      </span>
                    </div>

                    {/* Step Title */}
                    <h3
                      className={`text-base font-bold mb-1.5 ${
                        isFundStep
                          ? 'text-[#D9232A]'
                          : isSelected
                          ? 'text-[#0A162B]'
                          : 'text-slate-800'
                      }`}
                    >
                      {step.title}
                    </h3>

                    {/* Step Description */}
                    <p className="text-xs text-slate-600 leading-relaxed max-w-[170px]">
                      {step.description}
                    </p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>

        {/* Interactive Milestones Drawer */}
        {activeStepIndex !== null && (
          <ScrollReveal direction="up" delay={200} distance={15}>
            <div className="mt-10 max-w-3xl mx-auto bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-sm transition-all duration-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Stage {JOURNEY_STEPS[activeStepIndex].stepNumber} Focus:
                  </span>
                  <span className="text-sm font-bold text-[#0A162B]">
                    {JOURNEY_STEPS[activeStepIndex].title} Phase Deliverables
                  </span>
                </div>
                <span className="text-xs text-slate-500 hidden sm:inline">
                  Click any circle above to inspect stages
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {JOURNEY_STEPS[activeStepIndex].milestones?.map((milestone, mIdx) => (
                  <div
                    key={mIdx}
                    className="flex items-start gap-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{milestone}</span>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
};
