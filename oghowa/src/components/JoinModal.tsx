import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, ArrowRight, Sparkles, Building, Rocket, TrendingUp, GraduationCap } from 'lucide-react';
import { useSiteConfig } from '../context/SiteConfigContext';
import { EventRegistration, AttendeeTrack } from '../types';

interface JoinModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRole?: string;
}

export const JoinModal: React.FC<JoinModalProps> = ({
  isOpen,
  onClose,
  initialRole = 'founder',
}) => {
  const [selectedRole, setSelectedRole] = useState(initialRole);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [stage, setStage] = useState('Idea / Concept');
  const [notes, setNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { addRegistration, config } = useSiteConfig();

  useEffect(() => {
    if (initialRole) {
      setSelectedRole(initialRole.toLowerCase());
    }
  }, [initialRole]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Map role to AttendeeTrack
    let track: AttendeeTrack = 'Entrepreneur / Founder';
    if (selectedRole === 'investor') track = 'Investor / Funder';
    else if (selectedRole === 'corporate') track = 'Corporate / Sponsor';
    else if (selectedRole === 'academic') track = 'Other';

    // Find closest event
    const matchedEvent =
      config.events?.find((ev) => ev.id === 'event-innovation-weekend') ||
      config.events?.[0];

    if (matchedEvent) {
      const reg: Partial<EventRegistration> = {
        eventId: matchedEvent.id,
        eventTitle: `${matchedEvent.title} (Ecosystem Intake)`,
        fullName: fullName.trim() || 'Ecosystem Applicant',
        email: email.trim() || 'applicant@oghowa.africa',
        phone: '+234 800 000 0000',
        organization: organization.trim() || 'Venture Candidate',
        professionalTitle: stage,
        track,
        attendanceMode: 'In-Person (Benin City)',
        innovationWeekendDays: ['Thu 5', 'Fri 6', 'Sat 7'],
        dietaryAccessibility: 'Standard',
        accreditationStatus: 'Approved',
        accreditationCode: `OGH-BW26-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
        passCode: `PASS-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
        createdAt: new Date().toISOString(),
      };
      addRegistration(reg);
    }

    setIsSubmitted(true);
  };

  const roles = [
    { id: 'founder', label: 'Founder / Startup', icon: Rocket },
    { id: 'investor', label: 'Investor / Angel', icon: TrendingUp },
    { id: 'corporate', label: 'Corporate Partner', icon: Building },
    { id: 'academic', label: 'University / Researcher', icon: GraduationCap },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-slate-100 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSubmitted ? (
          <div>
            {/* Header */}
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 text-[#D9232A] text-xs font-semibold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Oghowa Accelerator</span>
              </div>
              <h3 className="text-2xl font-bold text-[#0A162B] tracking-tight">
                Join the Ecosystem
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Tell us about your venture, investment interests, or institutional objectives.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Role Selector Tabs */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  I want to join as:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {roles.map((r) => {
                    const Icon = r.icon;
                    const active = selectedRole.includes(r.id);
                    return (
                      <button
                        type="button"
                        key={r.id}
                        onClick={() => setSelectedRole(r.id)}
                        className={`flex items-center gap-2 p-2.5 rounded-lg text-xs font-semibold border transition-all text-left ${
                          active
                            ? 'bg-[#0A162B] text-white border-[#0A162B] shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <Icon className={`w-3.5 h-3.5 ${active ? 'text-red-400' : 'text-slate-500'}`} />
                        <span className="truncate">{r.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Personal Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Osasogie Eghosa"
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="osas@startup.africa"
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Startup / Organization Name
                  </label>
                  <input
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="e.g. Benin HealthTech"
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Venture / Engagement Stage
                  </label>
                  <select
                    value={stage}
                    onChange={(e) => setStage(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white"
                  >
                    <option value="Idea / Concept">Idea / Concept</option>
                    <option value="MVP / Prototype">MVP / Prototype</option>
                    <option value="Traction / Revenue">Early Traction / Revenue</option>
                    <option value="Scaling / Series A">Scaling / Growth</option>
                    <option value="Investor / Partner">Institutional Partner</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  How can Oghowa best support you?
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Share a brief overview of what you're building, funding needs, or partnership scope..."
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 text-sm font-semibold text-white bg-[#D9232A] hover:bg-[#B9181F] active:scale-[0.99] rounded-lg shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Submit Application</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <p className="text-[11px] text-center text-slate-500 mt-2">
                By submitting, you agree to Oghowa’s privacy policy and ecosystem terms.
              </p>
            </form>
          </div>
        ) : (
          <div className="py-8 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-[#0A162B] mb-2">
              Application Received!
            </h3>
            <p className="text-sm text-slate-600 max-w-sm mx-auto mb-6">
              Thank you, <span className="font-semibold text-slate-900">{fullName || 'Builder'}</span>. Our ecosystem team will review your application and reach out to <span className="font-semibold text-slate-900">{email}</span> within 2 business days.
            </p>
            <button
              onClick={() => {
                setIsSubmitted(false);
                onClose();
              }}
              className="px-6 py-2.5 text-sm font-semibold text-white bg-[#0A162B] hover:bg-slate-800 rounded-lg transition-colors"
            >
              Back to Overview
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
