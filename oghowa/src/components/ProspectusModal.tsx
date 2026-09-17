import React, { useState } from 'react';
import { X, Download, FileText, CheckCircle2, ShieldCheck, Printer, ArrowRight } from 'lucide-react';
import { SUMMIT_INQUIRIES } from '../data/summitData';

interface ProspectusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRequestExecutiveAccess?: () => void;
}

export const ProspectusModal: React.FC<ProspectusModalProps> = ({
  isOpen,
  onClose,
  onRequestExecutiveAccess,
}) => {
  const [downloadStarted, setDownloadStarted] = useState(false);

  if (!isOpen) return null;

  const handleDownload = () => {
    setDownloadStarted(true);
    // Simulate instantaneous, verified generation of the institutional briefing PDF
    const element = document.createElement('a');
    const file = new Blob([
      `OGHOWA BUSINESS WEEK: INSTITUTIONAL LEADERSHIP & ECONOMIC SUMMIT
Comprehensive Executive Prospectus - Benin City, Edo State, Nigeria
========================================================================

THEME: Architecting Edo State’s Industrial Renaissance and Economic Autonomy

GOVERNING AUTHORITY & STEERING COMMITTEE:
- Eminent steering committee of seasoned Edo-based economists, industrial magnates, financial regulators, and academic leaders.
- Ecosystem Anchors: Edo Investors Network (EIN), regional financial institutions, and advisory entities.

CORE STRATEGIC PILLARS:
1. Strategic Capital Deployment & Syndication
   - Operationalizing the Oghowa Syndicate framework to bridge institutional liquidity with high-growth, pre-vetted Edo enterprises through structured debt, equity, and mezzanine financing.
2. Industrialization & Value-Chain Integration
   - Modernizing manufacturing, agricultural processing, and supply chain logistics across Edo's key corridors to substitute imports and drive export-readiness.
3. Cultural Commerce & Creative Economy
   - Scaling traditional Edo craftsmanship, arts, and modern creative industries into institutional-grade, globally competitive commercial assets.
4. Infrastructure & Energy Transition
   - Financing sustainable power grids, industrial parks, and smart urban mobility frameworks within Benin City.

THE DEAL-ROOM & INVESTMENT ARCHITECTURE:
- Private Deal Rooms: Curated, closed-door bilateral sessions connecting institutional limited partners, venture funds, and high-growth founders.
- Venture Showcase: Rigorously vetted pitch presentations highlighting Series A+ expansion projects originating from Edo State.
- Sovereign-Private Dialogues: High-level roundtables addressing regulatory bottlenecks, tax incentives, and public-private partnership models.

EXECUTIVE MASTERCLASSES & CAPACITY BUILDING:
- Corporate Governance & Scaling (audit readiness, board structures)
- Export Compliance & Trade Logistics (AfCFTA, international standards)
- Technology & Enterprise Automation (ERP, operational digitization)

THE OGHOWA INNOVATION & VENTURE PAVILION:
- Startup Alley: Early-stage & scalable ventures in fintech, agritech, logistics, and clean energy.
- Technology & Enterprise Showcase: Live homegrown software & digital public infrastructure.
- Talent & Workforce Development Hub: Regional engineering and operations placement.

MEASURABLE IMPACT COMMITMENTS:
- Capital Mobilization Target: >= $50M in active deal-room commitments and syndicated investments.
- Enterprise Cohort: 150+ high-growth regional corporations, industrial leaders, and scalable startups.
- Policy Deliverable: Publication of an actionable economic white paper submitted directly to state development councils and key legislative committees.

INQUIRIES & ADVISORY:
Email: ${SUMMIT_INQUIRIES.email}
Location: ${SUMMIT_INQUIRIES.location}
Official Alignment: Edo Investors Network (EIN)
`
    ], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "Oghowa-Business-Week-Executive-Prospectus.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#07132B] text-white p-6 sm:p-7 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-red-400 mb-1.5">
            <FileText className="w-3.5 h-3.5" />
            <span>Official Summit Publication • 28 Pages</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-white">
            Comprehensive Executive Prospectus
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Institutional Leadership, Deal-Room Protocols & Economic Blueprint • Edo State, Nigeria
          </p>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-7 overflow-y-auto flex-1 space-y-6">
          {/* Prospectus Meta summary banner */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-red-100 text-[#D9232A] flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#0A162B]">
                  OBW-2026-Comprehensive-Prospectus.pdf
                </h4>
                <p className="text-xs text-slate-500">
                  Version 4.2 • Updated September 2026 • 8.4 MB (Encrypted)
                </p>
              </div>
            </div>

            <button
              onClick={handleDownload}
              className="w-full sm:w-auto px-4 py-2.5 bg-[#D9232A] hover:bg-[#B9181F] text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>{downloadStarted ? 'Downloaded Document' : 'Download Now'}</span>
            </button>
          </div>

          {/* Table of Contents Highlight */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Executive Prospectus Dossier Contents:
            </h5>

            <div className="space-y-2.5 text-xs text-slate-700">
              <div className="p-3 bg-white border border-slate-200 rounded-lg flex items-start gap-2.5">
                <span className="font-mono font-bold text-red-600">01.</span>
                <div>
                  <strong className="text-slate-900 block">The Advisory Council & Institutional Governance</strong>
                  <span className="text-slate-500 text-[11px]">
                    Steering committee charters, EIN strategic alignment, and fiduciary oversight.
                  </span>
                </div>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-lg flex items-start gap-2.5">
                <span className="font-mono font-bold text-red-600">02.</span>
                <div>
                  <strong className="text-slate-900 block">Core Strategic Pillars & Industrial Corridors</strong>
                  <span className="text-slate-500 text-[11px]">
                    Capital syndication, agro-processing corridors, creative economy IP, and energy transition.
                  </span>
                </div>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-lg flex items-start gap-2.5">
                <span className="font-mono font-bold text-red-600">03.</span>
                <div>
                  <strong className="text-slate-900 block">The Deal-Room & Investment Architecture</strong>
                  <span className="text-slate-500 text-[11px]">
                    Private bilateral sessions, Series A+ venture showcases, and sovereign-private dialogue mechanics.
                  </span>
                </div>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-lg flex items-start gap-2.5">
                <span className="font-mono font-bold text-red-600">04.</span>
                <div>
                  <strong className="text-slate-900 block">Executive Masterclasses & Innovation Pavilion</strong>
                  <span className="text-slate-500 text-[11px]">
                    Corporate governance, AfCFTA trade logistics, ERP automation, and startup exhibition floor plan.
                  </span>
                </div>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-lg flex items-start gap-2.5">
                <span className="font-mono font-bold text-red-600">05.</span>
                <div>
                  <strong className="text-slate-900 block">Measurable Impact Commitments (≥ $50M Target)</strong>
                  <span className="text-slate-500 text-[11px]">
                    150+ vetted enterprise cohorts and statutory state policy white paper delivery framework.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Institutional Advisory Inquiries note */}
          <div className="bg-red-50/70 border border-red-200 rounded-lg p-3 text-xs text-red-900 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-[#D9232A] shrink-0 mt-0.5" />
            <div>
              For customized institutional briefings or physical copies dispatched to your embassy or corporate headquarters, direct requests to{' '}
              <strong className="text-red-950 underline">{SUMMIT_INQUIRIES.email}</strong>.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <span className="text-[11px] text-slate-500">
            Benin City, Edo State, Nigeria
          </span>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {onRequestExecutiveAccess && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onRequestExecutiveAccess();
                }}
                className="w-full sm:w-auto px-4 py-2 bg-[#0A162B] text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Request Executive Access</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
