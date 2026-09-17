import React, { useState } from 'react';
import { Mail, MapPin, Phone, Send, CheckCircle2, Building, ShieldCheck, ArrowRight, Loader2, AlertCircle, ExternalLink } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';
import { SUMMIT_INQUIRIES } from '../data/summitData';

interface SummitInquiriesProps {
  onRequestExecutiveAccess?: () => void;
}

export const SummitInquiries: React.FC<SummitInquiriesProps> = ({ onRequestExecutiveAccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    organization: '',
    email: '',
    phone: '',
    subject: 'Private Deal-Room Bilateral Access',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submissionId, setSubmissionId] = useState<string | null>(null);

  // Formspree integration endpoint (supports VITE_FORMSPREE_FORM_ID environment variable or default fallback)
  const formspreeFormId = import.meta.env.VITE_FORMSPREE_FORM_ID || 'mqkenawv';
  const FORMSPREE_URL = `https://formspree.io/f/${formspreeFormId}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    const payload = {
      name: formData.name,
      organization: formData.organization,
      email: formData.email,
      phone: formData.phone || 'Not provided',
      subject: formData.subject,
      message: formData.message,
      _replyto: formData.email,
      _subject: `[Oghowa Summit Inquiry] ${formData.subject} - ${formData.organization} (${formData.name})`,
      target_inbox: SUMMIT_INQUIRIES.email,
      submitted_at: new Date().toISOString(),
    };

    try {
      const response = await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const refId = `OGH-${Date.now().toString(36).toUpperCase()}`;
        setSubmissionId(refId);
        setSubmitted(true);
      } else {
        const data = await response.json().catch(() => ({}));
        // If Formspree returned an error or unconfirmed email
        const errorText =
          data?.error ||
          data?.errors?.[0]?.message ||
          'Server transmission error. You can also dispatch directly via email.';
        setErrorMessage(errorText);
      }
    } catch (err) {
      setErrorMessage(
        'Network communication error while connecting to the email service. You can send directly via your mail client.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDirectEmailFallback = () => {
    const subjectEncoded = encodeURIComponent(`[Oghowa Summit Inquiry] ${formData.subject} - ${formData.organization}`);
    const bodyEncoded = encodeURIComponent(
      `Executive Name: ${formData.name}\nOrganization: ${formData.organization}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nNature of Inquiry: ${formData.subject}\n\nContext & Message:\n${formData.message}\n\n---\nSent via Oghowa Summit Portal`
    );
    window.location.href = `mailto:${SUMMIT_INQUIRIES.email}?subject=${subjectEncoded}&body=${bodyEncoded}`;
  };

  return (
    <section id="inquiries" className="py-16 sm:py-20 lg:py-24 bg-slate-50 border-b border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up" distance={20}>
          <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#D9232A] mb-2 block">
              Direct Institutional Channel
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0A162B] tracking-tight">
              Inquiries & Institutional Advisory
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 font-normal">
              For bilateral deal-room coordination, sponsorship syndication, and steering committee briefings.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Official Contact Architecture */}
          <ScrollReveal direction="up" distance={24} delay={50} className="lg:col-span-5 h-full">
            <div className="bg-[#07132B] text-white rounded-2xl p-7 sm:p-9 h-full flex flex-col justify-between shadow-xl">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-red-400 block mb-2">
                  Official Secretariat
                </span>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Oghowa Business Week Directorate
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed mb-8">
                  Institutional coordination, delegation accreditation, and deal-room schedules are handled directly by the executive advisory secretariat.
                </p>

                <div className="space-y-5">
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-lg bg-red-950/80 border border-red-500/30 text-red-400 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        Inquiries & Advisory Email:
                      </span>
                      <a
                        href={`mailto:${SUMMIT_INQUIRIES.email}`}
                        className="text-sm sm:text-base font-semibold text-white hover:text-red-400 transition-colors"
                      >
                        {SUMMIT_INQUIRIES.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-lg bg-red-950/80 border border-red-500/30 text-red-400 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        Summit Secretariat Location:
                      </span>
                      <span className="text-sm font-medium text-slate-200">
                        {SUMMIT_INQUIRIES.location}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-lg bg-red-950/80 border border-red-500/30 text-red-400 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        Ecosystem Alignment:
                      </span>
                      <span className="text-sm font-medium text-slate-200">
                        Edo Investors Network (EIN) & Regional Regulators
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10">
                <button
                  type="button"
                  onClick={onRequestExecutiveAccess}
                  className="w-full py-3 bg-[#D9232A] hover:bg-[#B9181F] text-white font-semibold text-xs sm:text-sm rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <span>Request Closed-Door Executive Access</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </ScrollReveal>

          {/* Right Column: Direct Advisory Communication Form with Formspree Integration */}
          <ScrollReveal direction="up" distance={24} delay={120} className="lg:col-span-7">
            <div className="bg-white rounded-2xl border border-slate-200/90 p-7 sm:p-9 shadow-xs">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-xl font-bold text-[#0A162B]">
                  Dispatch an Institutional Inquiry
                </h3>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live API Connected
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mb-6">
                All communications are transmitted directly to <strong className="text-slate-800">{SUMMIT_INQUIRIES.email}</strong> via secure email endpoint.
              </p>

              {submitted ? (
                <div className="py-10 text-center animate-in fade-in duration-200">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h4 className="text-lg font-bold text-[#0A162B] mb-1">
                    Inquiry Dispatched to {SUMMIT_INQUIRIES.email}
                  </h4>
                  {submissionId && (
                    <div className="inline-block bg-slate-100 text-slate-700 text-xs font-mono px-3 py-1 rounded-md mb-3">
                      Reference Code: {submissionId}
                    </div>
                  )}
                  <p className="text-sm text-slate-600 max-w-md mx-auto mb-6">
                    Your institutional inquiry has been transmitted directly into the executive directorate inbox. A dedicated secretariat officer will review your dossier and respond within 24 business hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setSubmissionId(null);
                      setFormData({
                        name: '',
                        organization: '',
                        email: '',
                        phone: '',
                        subject: 'Private Deal-Room Bilateral Access',
                        message: '',
                      });
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D9232A] hover:underline cursor-pointer"
                  >
                    <span>Dispatch another inquiry</span>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errorMessage && (
                    <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>{errorMessage}</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleDirectEmailFallback}
                        className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-md font-semibold text-[11px] shrink-0 inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>Send via Email App</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Dr. / Chief / Mrs. / Mr."
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D9232A] focus:bg-white text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Organization / Ministry / Fund *
                      </label>
                      <input
                        type="text"
                        name="organization"
                        required
                        value={formData.organization}
                        onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                        placeholder="e.g. Apex Capital / Ministry of Trade"
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D9232A] focus:bg-white text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Institutional Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="executive@institution.org"
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D9232A] focus:bg-white text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Direct Phone / WhatsApp
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+234 ..."
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D9232A] focus:bg-white text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Nature of Inquiry
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D9232A] focus:bg-white text-slate-900"
                    >
                      <option value="Private Deal-Room Bilateral Access">Private Deal-Room Bilateral Access</option>
                      <option value="Institutional Partnership & Sponsorship">Institutional Partnership & Sponsorship</option>
                      <option value="Executive Masterclass Seat Reservation">Executive Masterclass Seat Reservation</option>
                      <option value="Innovation Pavilion Showcase Demonstration">Innovation Pavilion Showcase Demonstration</option>
                      <option value="State Development Council Policy White Paper Submission">State Development Council Policy White Paper Submission</option>
                      <option value="General Summit Inquiries">General Summit Inquiries</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Institutional Context or Specific Questions *
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Outline your fund size, enterprise valuation, policy focus, or deal-room objectives..."
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D9232A] focus:bg-white text-slate-900 resize-none"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-1">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 py-3 bg-[#0A162B] hover:bg-[#D9232A] disabled:bg-slate-400 text-white font-semibold text-xs sm:text-sm rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Dispatching Email via API...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Transmit Inquiry to {SUMMIT_INQUIRIES.email}</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleDirectEmailFallback}
                      title="Open in your default mail app"
                      className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs sm:text-sm rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Mail className="w-4 h-4 text-slate-500" />
                      <span className="hidden sm:inline">Open Mail App</span>
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-400 text-center pt-1">
                    Direct inquiries are also accepted via <strong className="text-slate-600">{SUMMIT_INQUIRIES.phone}</strong>.
                  </p>
                </form>
              )}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};
