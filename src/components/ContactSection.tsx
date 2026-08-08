import React, { useState } from 'react';
import { SiteConfig } from '../types';
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare, PhoneCall } from 'lucide-react';

interface ContactSectionProps {
  config: SiteConfig;
  prefillInterest?: string;
  onOpenCompanionChat: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  config,
  prefillInterest = '',
  onOpenCompanionChat,
}) => {
  const { content } = config;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    interest: prefillInterest || 'Venture Design & Partnerships',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSubmitted(true);
      } else {
        setErrorMessage(data.error || 'Failed to submit inquiry. Please try again.');
      }
    } catch (err: any) {
      setErrorMessage('Network error occurred. Please try again or use WhatsApp support.');
    } finally {
      setSubmitting(false);
    }
  };

  const whatsappUrl = `https://wa.me/${content.whatsappNumber}?text=${encodeURIComponent(
    'Hello Metaspace Consulting team, I would like to make an inquiry regarding your ventures and services.'
  )}`;

  return (
    <section id="contact" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Banner CTA Card (Matching image 1 bottom block) */}
        <div className="bg-[#141B77] text-white rounded-2xl p-8 sm:p-12 mb-16 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-[#E63946] rounded-xl flex items-center justify-center font-extrabold text-2xl text-white shrink-0 shadow-md">
              M
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl font-extrabold leading-tight">
                Let's build something extraordinary together.
              </h3>
              <p className="text-slate-300 text-sm sm:text-base mt-2">
                Whether you're a government, investor, organization, or entrepreneur, we're ready to partner with you.
              </p>
            </div>
          </div>

          <a
            href="#booking-form"
            className="px-8 py-4 bg-[#E63946] hover:bg-red-600 text-white font-bold text-xs uppercase tracking-widest rounded-md shrink-0 transition shadow-lg"
          >
            Book a Consultation
          </a>
        </div>

        {/* Contact Form & Information Split */}
        <div id="booking-form" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Info Column */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <h2 className="text-3xl font-extrabold text-[#141B77] tracking-tight mb-4">
                Get In Touch
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                Connect directly with our team to discuss venture co-creation, digital transformation projects, or Metagen enterprise deployments.
              </p>
            </div>

            <div className="space-y-5">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-[#f5faff] border border-slate-100">
                <div className="p-2.5 bg-white rounded-lg text-[#141B77] shadow-xs">
                  <Mail className="w-5 h-5 text-[#E63946]" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase block">Email Us:</span>
                  <a href={`mailto:${content.contactEmail}`} className="text-sm font-bold text-[#141B77] hover:underline">
                    {content.contactEmail}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-[#f5faff] border border-slate-100">
                <div className="p-2.5 bg-white rounded-lg text-[#141B77] shadow-xs">
                  <Phone className="w-5 h-5 text-[#141B77]" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase block">Call Us:</span>
                  <a href={`tel:${content.contactPhone}`} className="text-sm font-bold text-[#141B77] hover:underline">
                    {content.contactPhone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-[#f5faff] border border-slate-100">
                <div className="p-2.5 bg-white rounded-lg text-[#141B77] shadow-xs">
                  <MapPin className="w-5 h-5 text-[#E63946]" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase block">Headquarters:</span>
                  <span className="text-sm font-bold text-[#141B77]">{content.locationAddress}</span>
                </div>
              </div>
            </div>

            {/* Direct Support Options */}
            <div className="p-6 bg-[#f5faff] rounded-2xl border border-slate-200/80 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Instant AI & Human Support Channels:
              </h4>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={onOpenCompanionChat}
                  className="flex items-center justify-center gap-2 p-3 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800 hover:bg-slate-50 transition shadow-xs"
                >
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                  <span>Companion AI</span>
                </button>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 p-3 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition shadow-xs"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>WhatsApp Agent</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Form Column */}
          <div className="lg:col-span-7 bg-[#f5faff] p-8 sm:p-10 rounded-2xl border border-slate-200/80 shadow-md">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="p-4 bg-emerald-100 text-emerald-700 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-[#141B77]">Consultation Request Received!</h3>
                <p className="text-slate-600 text-sm max-w-md mx-auto">
                  Thank you for contacting Metaspace Consulting Limited. An email notification has been dispatched via Resend, and our partners team will follow up within 24 hours.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', phone: '', company: '', interest: 'Venture Design', message: '' });
                  }}
                  className="px-6 py-2.5 bg-[#141B77] text-white text-xs font-bold uppercase rounded-md"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h3 className="text-xl font-bold text-[#141B77] mb-2">Book a Consultation</h3>

                {errorMessage && (
                  <div className="p-3 bg-red-50 text-red-700 text-xs rounded-md border border-red-200">
                    {errorMessage}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Victory Usiobaifo"
                      className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-md text-sm text-slate-800 focus:ring-2 focus:ring-[#141B77] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. victory@example.com"
                      className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-md text-sm text-slate-800 focus:ring-2 focus:ring-[#141B77] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+234 812 XXX XXXX"
                      className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-md text-sm text-slate-800 focus:ring-2 focus:ring-[#141B77] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Organization / Company</label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="Company Name"
                      className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-md text-sm text-slate-800 focus:ring-2 focus:ring-[#141B77] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Primary Interest Area</label>
                  <select
                    value={formData.interest}
                    onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-md text-sm text-slate-800 focus:ring-2 focus:ring-[#141B77] focus:outline-none"
                  >
                    <option value="Venture Design Studio">Venture Design Studio</option>
                    <option value="Digital Transformation">Digital Transformation</option>
                    <option value="Metagen AI Platform">Metagen AI Platform Deployment</option>
                    <option value="Startup Incubation & Accelerator">Startup Incubation & Accelerator</option>
                    <option value="Venture Partnership / Investment">Venture Partnership / Investment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Project Details / Inquiry</label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about your goals, timelines, or partnership proposals..."
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-md text-sm text-slate-800 focus:ring-2 focus:ring-[#141B77] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 bg-[#141B77] hover:bg-blue-900 text-white font-bold text-xs uppercase tracking-widest rounded-md transition flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
                >
                  {submitting ? (
                    <span>Dispatching Request via Resend API...</span>
                  ) : (
                    <>
                      <span>Submit Consultation Inquiry</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
