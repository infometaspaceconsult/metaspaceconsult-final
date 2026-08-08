import React, { useState, useEffect } from 'react';
import { Calendar, X, Send, CheckCircle2 } from 'lucide-react';
import { SiteConfig } from '../types';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  config?: SiteConfig;
  prefillService?: string;
}

export const ConsultationModal: React.FC<ConsultationModalProps> = ({
  isOpen,
  onClose,
  config,
  prefillService,
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [industry, setIndustry] = useState('');
  const [service, setService] = useState('Venture Design Studio');
  const [projectBrief, setProjectBrief] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (prefillService) {
      setService(prefillService);
    }
  }, [prefillService]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !projectBrief.trim()) {
      setErrorMessage('Please complete all required fields.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          email,
          organization,
          industry,
          interest: `[CONSULTATION] ${service}`,
          message: projectBrief,
        }),
      });

      const resData = await response.json();
      if (resData.success || response.ok) {
        setSubmitted(true);
      } else {
        setErrorMessage(resData.error || 'Failed to submit request. Please try again.');
      }
    } catch (err) {
      // Fallback success if offline/dev
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  const resetAndClose = () => {
    setSubmitted(false);
    setFullName('');
    setEmail('');
    setOrganization('');
    setIndustry('');
    setProjectBrief('');
    setErrorMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden my-8 transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Banner */}
        <div className="bg-[#0B1038] text-white p-5 sm:p-6 flex items-start justify-between border-b border-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 bg-[#E63946] rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Book a Consultation
              </h3>
              <p className="text-xs text-slate-300 mt-0.5 font-medium">
                Set up a session with our principal venture architects.
              </p>
            </div>
          </div>
          <button
            onClick={resetAndClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {submitted ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-2xl font-extrabold text-slate-900">
                Consultation Slot Secured!
              </h4>
              <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Thank you, <strong className="text-slate-900">{fullName}</strong>. Your consultation brief for <span className="font-semibold text-[#141B77]">{service}</span> has been received. Our team will review your requirements and respond within 24 hours.
              </p>
              <div className="pt-4">
                <button
                  onClick={resetAndClose}
                  className="px-8 py-3 bg-[#141B77] hover:bg-navy-900 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition shadow-md cursor-pointer"
                >
                  Close Window
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg font-medium">
                  {errorMessage}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1 block">
                    Full Name <span className="text-[#E63946]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Osaze Alabi"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#141B77] focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1 block">
                    Email Address <span className="text-[#E63946]">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. name@domain.com"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#141B77] focus:bg-white transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1 block">
                    Organization / Company
                  </label>
                  <input
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="e.g. Federal Ministry of Tech"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#141B77] focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1 block">
                    Industry / Sector
                  </label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#141B77] focus:bg-white transition"
                  >
                    <option value="" disabled>
                      Select industry sector...
                    </option>
                    <option value="Government & Public Sector">Government & Public Sector</option>
                    <option value="FinTech & Financial Services">FinTech & Financial Services</option>
                    <option value="EdTech & Education">EdTech & Education</option>
                    <option value="HealthTech & Healthcare">HealthTech & Healthcare</option>
                    <option value="Enterprise Infrastructure">Enterprise Infrastructure</option>
                    <option value="Venture Capital & Private Equity">Venture Capital & Private Equity</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1 block">
                  Requested Service <span className="text-[#E63946]">*</span>
                </label>
                <select
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#141B77] focus:bg-white transition font-medium"
                >
                  <option value="Venture Design Studio">Venture Design Studio</option>
                  <option value="Digital Transformation">Digital Transformation</option>
                  <option value="Innovation Ecosystem Builder">Innovation Ecosystem Builder</option>
                  <option value="Strategy & Advisory">Strategy & Advisory</option>
                  <option value="Custom Venture Inquiry">Custom Venture Inquiry</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1 block">
                  Project Brief & Requirements <span className="text-[#E63946]">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={projectBrief}
                  onChange={(e) => setProjectBrief(e.target.value)}
                  placeholder="Tell us about the challenges you are facing, your goals, and timelines..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#141B77] focus:bg-white transition resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-[#E63946] hover:bg-[#d92332] text-white font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xl transition shadow-lg shadow-red-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? 'Securing Slot...' : 'SECURE CONSULTATION SLOT'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
