import React, { useState } from 'react';
import { Cpu, Sparkles, Zap, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';

export const MetagenShowcase: React.FC = () => {
  const [selectedSector, setSelectedSector] = useState<string>('EdTech & Logistics');
  const [generating, setGenerating] = useState<boolean>(false);
  const [generatedOutput, setGeneratedOutput] = useState<any | null>({
    title: 'Smart Learning Transit Engine',
    architecture: 'Multi-tenant cloud architecture with offline SMS backup & automated route optimization',
    leadGenTarget: '1,200 High Schools & University Campuses across West Africa',
    impactPotential: '$2.4M Annual Operational Savings & 99.4% Student Safety Rating',
  });

  const sectors = [
    { name: 'EdTech & Logistics', defaultTitle: 'Smart Learning Transit Engine' },
    { name: 'HealthTech & Senior Care', defaultTitle: 'Tele-Triage & Elderly Monitoring Hub' },
    { name: 'Agritech & Supply Chain', defaultTitle: 'Farmer-to-Market Produce Matcher' },
    { name: 'Fintech & Merchant Commerce', defaultTitle: 'Cross-Border B2B Settlement Gateway' },
  ];

  const handleSynthesize = (sectorName: string) => {
    setSelectedSector(sectorName);
    setGenerating(true);
    setTimeout(() => {
      if (sectorName.includes('EdTech')) {
        setGeneratedOutput({
          title: 'Smart Learning Transit Engine',
          architecture: 'Multi-tenant cloud architecture with offline SMS backup & automated route optimization',
          leadGenTarget: '1,200 High Schools & University Campuses across West Africa',
          impactPotential: '$2.4M Annual Operational Savings & 99.4% Student Safety Rating',
        });
      } else if (sectorName.includes('HealthTech')) {
        setGeneratedOutput({
          title: 'Tele-Triage & Elderly Monitoring Hub',
          architecture: 'AI diagnostic proxy, remote vital logs & instant emergency responder dispatcher',
          leadGenTarget: '450 Clinics & Senior Residential Facilities',
          impactPotential: '40% Faster Emergency Response & 85% Care Continuity Rate',
        });
      } else if (sectorName.includes('Agritech')) {
        setGeneratedOutput({
          title: 'Farmer-to-Market Produce Matcher',
          architecture: 'USSD/WhatsApp micro-trading layer, cold-chain route solver & spot price index',
          leadGenTarget: '25,000 Smallholder Farmers & Regional Wholesalers',
          impactPotential: '30% Waste Reduction & Direct Fair-Trade Yield Boost',
        });
      } else {
        setGeneratedOutput({
          title: 'Cross-Border B2B Settlement Gateway',
          architecture: 'Regulated fiat escrow pipeline, automated FX liquidity router & instant invoicing',
          leadGenTarget: '3,800 Import/Export Merchants in Lagos & Accra',
          impactPotential: 'Instant T+0 Settlement & Zero Slippage Trade Corridor',
        });
      }
      setGenerating(false);
    }, 600);
  };

  return (
    <section id="metagen" className="py-20 bg-gradient-to-b from-[#141B77] to-[#0A0E45] text-white relative overflow-hidden">
      {/* Decorative Cyber Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left Text Column */}
          <div className="lg:w-1/2">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-bold uppercase tracking-widest text-red-400 mb-6">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Flagship Metaspace AI Innovation</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
              Meet <span className="text-red-400">Metagen</span>
              <br />
              AI Ecosystem Generator
            </h2>

            <p className="text-slate-300 text-lg leading-relaxed mb-8">
              Metagen is Metaspace Consulting's proprietary artificial intelligence engine designed to accelerate enterprise venture design, synthesize market intelligence, and automate customer lead generation across emerging markets.
            </p>

            <div className="space-y-4 mb-8">
              {[
                'Automated Market Intelligence & Lead Acquisition',
                'Rapid System Architecture & Venture Blueprints',
                'Seamless WhatsApp & Multi-Channel Customer Concierge',
                'Tailored for High-Growth African Enterprise Ecosystems',
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="p-1 rounded-full bg-red-500/20 text-red-400">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <span className="text-slate-200 font-medium text-sm sm:text-base">{feature}</span>
                </div>
              ))}
            </div>

            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#E63946] hover:bg-red-600 text-white font-bold text-sm rounded-md transition shadow-lg"
            >
              <span>Deploy Metagen for Your Enterprise</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Right Interactive Synthesizer Card */}
          <div className="lg:w-1/2 w-full">
            <div className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl p-6 sm:p-8 shadow-2xl">
              <div className="flex items-center justify-between pb-6 mb-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-red-500/20 text-red-400 rounded-xl">
                    <Cpu className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Metagen Live Synthesizer</h3>
                    <p className="text-xs text-slate-400">Simulate rapid venture & ecosystem generation</p>
                  </div>
                </div>
                <span className="text-xs font-mono bg-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-500/30">
                  Ready v3.6
                </span>
              </div>

              {/* Sector Selector */}
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Select Industry Sector:
              </label>
              <div className="grid grid-cols-2 gap-2 mb-6">
                {sectors.map((sec) => (
                  <button
                    key={sec.name}
                    onClick={() => handleSynthesize(sec.name)}
                    className={`px-3 py-2 text-xs font-semibold rounded-lg border text-left transition ${
                      selectedSector === sec.name
                        ? 'bg-red-500 text-white border-red-400 shadow'
                        : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    {sec.name}
                  </button>
                ))}
              </div>

              {/* Generated Architecture Output Card */}
              <div className="bg-[#080B2B] rounded-xl p-5 border border-white/10">
                {generating ? (
                  <div className="py-10 text-center space-y-3">
                    <Zap className="w-8 h-8 text-amber-400 animate-bounce mx-auto" />
                    <p className="text-xs font-mono text-slate-300">Synthesizing Metagen AI System Architecture...</p>
                  </div>
                ) : generatedOutput ? (
                  <div className="space-y-3 text-xs sm:text-sm">
                    <div>
                      <span className="text-[10px] font-mono text-red-400 uppercase tracking-widest block">
                        Venture Concept:
                      </span>
                      <h4 className="text-base font-bold text-white mt-0.5">{generatedOutput.title}</h4>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">
                        Generated Architecture:
                      </span>
                      <p className="text-slate-300 font-mono text-xs mt-0.5">{generatedOutput.architecture}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
                      <div>
                        <span className="text-[9px] font-mono text-slate-400 uppercase block">Target Lead Pool:</span>
                        <span className="text-xs font-semibold text-emerald-400">{generatedOutput.leadGenTarget}</span>
                      </div>
                      <div>
                        <span className="text-[9px] font-mono text-slate-400 uppercase block">Impact Metric:</span>
                        <span className="text-xs font-semibold text-amber-300">{generatedOutput.impactPotential}</span>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
