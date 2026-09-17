import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, Lock, Send, ArrowRight } from 'lucide-react';
import { SUMMIT_INQUIRIES } from '../data/summitData';

interface ExecutiveAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: string;
}

export const ExecutiveAccessModal: React.FC<ExecutiveAccessModalProps> = ({
  isOpen,
  onClose,
  defaultRole = 'Institutional Investor',
}) => {
  const [formData, setFormData] = useState({
    fullName: '',
    title: '',
    organization: '',
    sectorCategory: defaultRole,
    institutionalEmail: '',
    directPhone: '',
    dealRoomInterests: 'Syndicated Debt & Equity ($1M - $10M)',
    ndaAccepted: true,
  });

  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="bg-[#07132B] text-white p-6 sm:p-7 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-red-400 mb-1.5">
            <Lock className="w-3.5 h-3.5" />
            <span>Closed-Door Executive Accreditation</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-white">
            Request Executive Summit Access
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Oghowa Business Week: Institutional Leadership & Economic Summit • Benin City, Edo State
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7 overflow-y-auto flex-1">
          {submitted ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 bg-red-50 text-[#D9232A] rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-[#0A162B]">
                Executive Accreditation Dossier Received
              </h4>
              <div className="text-xs font-mono bg-slate-100 p-2.5 rounded-md inline-block text-slate-700">
                Docket ID: OBW-2026-{Math.floor(100000 + Math.random() * 900000)}
              </div>
              <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Thank you, <strong>{formData.fullName}</strong>. Your credential file has been submitted to the Advisory Steering Committee. Our Institutional Liaison will dispatch your accreditation pass and bilateral deal-room calendar via <strong>{SUMMIT_INQUIRIES.email}</strong>.
              </p>
              <div className="pt-4">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-2.5 bg-[#0A162B] text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors"
                >
                  Return to Summit Overview
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="bg-red-50/60 border border-red-200/80 rounded-lg p-3 text-xs text-red-900 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-[#D9232A] shrink-0 mt-0.5" />
                <span>
                  Access to Private Deal Rooms and Sovereign-Private Dialogues is restricted to accredited principals, institutional investors, and ministry executives.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name & Honorific *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Dr. Osasere Ighodaro"
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D9232A] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Designation / Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Managing Director / Commissioner / Partner"
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D9232A] focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Organization / Entity *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    placeholder="Entity Name"
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D9232A] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Sector Category *
                  </label>
                  <select
                    value={formData.sectorCategory}
                    onChange={(e) => setFormData({ ...formData, sectorCategory: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D9232A] focus:bg-white"
                  >
                    <option value="Policymaker & Sovereign Regulatory">Policymaker & Sovereign Regulatory</option>
                    <option value="Financial Sector Leader & Bank CEO">Financial Sector Leader & Bank CEO</option>
                    <option value="Industrial Pioneer & Manufacturer">Industrial Pioneer & Manufacturer</option>
                    <option value="Institutional Investor & Private Equity LP">Institutional Investor & Private Equity LP</option>
                    <option value="High-Growth Enterprise Founder (Series A+)">High-Growth Enterprise Founder (Series A+)</option>
                    <option value="Academic Leader & Economic Researcher">Academic Leader & Economic Researcher</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Institutional Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.institutionalEmail}
                    onChange={(e) => setFormData({ ...formData, institutionalEmail: e.target.value })}
                    placeholder="name@organization.com"
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D9232A] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Direct Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.directPhone}
                    onChange={(e) => setFormData({ ...formData, directPhone: e.target.value })}
                    placeholder="+234 ..."
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D9232A] focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Primary Deal-Room & Strategic Interest
                </label>
                <select
                  value={formData.dealRoomInterests}
                  onChange={(e) => setFormData({ ...formData, dealRoomInterests: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D9232A] focus:bg-white"
                >
                  <option value="Syndicated Debt & Equity ($1M - $10M)">Syndicated Debt & Equity ($1M - $10M)</option>
                  <option value="Large-Scale Infrastructure & Power Concession (> $10M)">Large-Scale Infrastructure & Power Concession (&gt; $10M)</option>
                  <option value="Agro-Processing & Industrial Corridor Expansion">Agro-Processing & Industrial Corridor Expansion</option>
                  <option value="Sovereign Policy Harmonization & Tax Incentives">Sovereign Policy Harmonization & Tax Incentives</option>
                  <option value="Executive Masterclass & Board Transition">Executive Masterclass & Board Transition</option>
                </select>
              </div>

              <div className="pt-2">
                <label className="flex items-start gap-2 text-xs text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.ndaAccepted}
                    onChange={(e) => setFormData({ ...formData, ndaAccepted: e.target.checked })}
                    className="mt-0.5 rounded text-[#D9232A] focus:ring-[#D9232A]"
                  />
                  <span>
                    I acknowledge that private deal-room deliberations and bilateral materials are subject to institutional confidentiality.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#D9232A] hover:bg-[#B9181F] text-white font-semibold text-xs sm:text-sm rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md mt-4"
              >
                <Send className="w-4 h-4" />
                <span>Submit Executive Access Request</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
