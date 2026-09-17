import React, { useState, useEffect, useRef } from 'react';
import { EventItem, AttendeeTrack, EventRegistration } from '../types';
import { useSiteConfig } from '../context/SiteConfigContext';
import { EventCalendarMultiPicker, BUSINESS_WEEK_DAYS, INNOVATION_WEEKEND_DAYS } from './EventCalendarMultiPicker';
import {
  X,
  Calendar,
  MapPin,
  User,
  Mail,
  Phone,
  Building2,
  Briefcase,
  CheckCircle2,
  ShieldCheck,
  Download,
  CalendarPlus,
  Printer,
  Sparkles,
  Check,
  Send,
  HelpCircle,
  FileText,
} from 'lucide-react';

interface EventRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: EventItem | null;
  defaultTrack?: AttendeeTrack;
}

export const EventRegistrationModal: React.FC<EventRegistrationModalProps> = ({
  isOpen,
  onClose,
  event,
  defaultTrack,
}) => {
  const { addRegistration } = useSiteConfig();

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [accreditedPass, setAccreditedPass] = useState<EventRegistration | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Calendar Popup state
  const [calendarPopupOpen, setCalendarPopupOpen] = useState(false);
  const [calendarTarget, setCalendarTarget] = useState<'business-week' | 'innovation-weekend'>('business-week');

  // FORM FIELDS MATCHING EXACT USER TEMPLATE:
  // Section 1: Your details
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [organization, setOrganization] = useState('');
  const [professionalTitle, setProfessionalTitle] = useState('');

  // Section 2: How you fit in
  // Options: Entrepreneur / Founder, Investor / Funder, Government / Policy, Corporate / Sponsor, Student, Media / Press, Other
  const attendeeRoleOptions: AttendeeTrack[] = [
    'Entrepreneur / Founder',
    'Investor / Funder',
    'Government / Policy',
    'Corporate / Sponsor',
    'Student',
    'Media / Press',
    'Other',
  ];
  const [selectedRole, setSelectedRole] = useState<AttendeeTrack>('Entrepreneur / Founder');
  const [otherRoleText, setOtherRoleText] = useState('');

  // Days you plan to attend Business Week:
  // Options: Mon 16, Tue 17, Wed 18, Thu 19, Fri 20, Sat 21
  const [selectedBusinessWeekDays, setSelectedBusinessWeekDays] = useState<string[]>([
    'Mon 16',
    'Tue 17',
    'Wed 18',
    'Thu 19',
    'Fri 20',
    'Sat 21',
  ]);

  // Section 3: Óghowa Innovation Weekend (BTF 2.0)
  // Days you'll join at BTF 2.0 (optional — leave blank to skip):
  // Options: Thu 5, Fri 6, Sat 7
  const [selectedBTFDays, setSelectedBTFDays] = useState<string[]>([]);

  // Section 4: A little more
  // How did you hear about Óghowa Business Week? (optional)
  const referralOptions = [
    'Social media',
    'Referred by a partner or attendee',
    'Metaspace / Óghowa network',
    'Press or news coverage',
    'Event listing',
    'Other',
  ];
  const [selectedReferral, setSelectedReferral] = useState<string>('');
  const [otherReferralText, setOtherReferralText] = useState('');

  // Dietary or accessibility requirements (optional):
  const [dietaryRequirements, setDietaryRequirements] = useState('');

  // Validation errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Reset or pre-fill on open
  useEffect(() => {
    if (isOpen) {
      setShowSuccess(false);
      setAccreditedPass(null);
      setIsSubmitting(false);
      setErrors({});

      // Set default role if provided
      if (defaultTrack) {
        setSelectedRole(defaultTrack);
      } else if (event?.track?.toLowerCase().includes('investor')) {
        setSelectedRole('Investor / Funder');
      } else if (event?.track?.toLowerCase().includes('policy') || event?.track?.toLowerCase().includes('sovereign')) {
        setSelectedRole('Government / Policy');
      } else {
        setSelectedRole('Entrepreneur / Founder');
      }

      // Default all 6 days of Business Week checked
      setSelectedBusinessWeekDays(['Mon 16', 'Tue 17', 'Wed 18', 'Thu 19', 'Fri 20', 'Sat 21']);
    }
  }, [isOpen, event, defaultTrack]);

  if (!isOpen) return null;

  // Toggle Day helper for Business Week
  const toggleBusinessWeekDay = (dayStr: string) => {
    if (selectedBusinessWeekDays.includes(dayStr)) {
      setSelectedBusinessWeekDays(selectedBusinessWeekDays.filter((d) => d !== dayStr));
    } else {
      setSelectedBusinessWeekDays([...selectedBusinessWeekDays, dayStr]);
    }
  };

  // Toggle Day helper for Innovation Weekend
  const toggleBTFDay = (dayStr: string) => {
    if (selectedBTFDays.includes(dayStr)) {
      setSelectedBTFDays(selectedBTFDays.filter((d) => d !== dayStr));
    } else {
      setSelectedBTFDays([...selectedBTFDays, dayStr]);
    }
  };

  // Validation
  const validateForm = () => {
    const errs: { [key: string]: string } = {};
    if (!fullName.trim()) errs.fullName = 'Full name is required';
    if (!email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = 'Please enter a valid email address';
    }
    if (!phone.trim()) errs.phone = 'Phone number is required';

    if (selectedBusinessWeekDays.length === 0) {
      errs.days = 'Please select at least one day you plan to attend';
    }

    if (selectedRole === 'Other' && !otherRoleText.trim()) {
      errs.otherRole = 'Please specify your role';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const savedPass = await addRegistration({
        eventId: event?.id || 'event-summit-2026',
        eventTitle: event?.title || 'Óghowa Business Week: Institutional Leadership & Economic Summit',
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        organization: organization.trim() || undefined,
        professionalTitle: professionalTitle.trim() || undefined,
        track: selectedRole,
        otherRoleText: selectedRole === 'Other' ? otherRoleText.trim() : undefined,
        selectedDays: selectedBusinessWeekDays,
        innovationWeekendDays: selectedBTFDays.length > 0 ? selectedBTFDays : undefined,
        referralSource:
          selectedReferral === 'Other'
            ? `Other: ${otherReferralText.trim()}`
            : selectedReferral || undefined,
        dietaryAccessibility: dietaryRequirements.trim() || undefined,
        attendanceMode: 'In-Person (Benin City)',
        consent: true,
      });

      setTimeout(() => {
        setIsSubmitting(false);
        setAccreditedPass(savedPass);
        setShowSuccess(true);
      }, 500);
    } catch (err) {
      setIsSubmitting(false);
      console.error('Registration failed:', err);
    }
  };

  // Trigger Print View
  const handlePrint = () => {
    window.print();
  };

  // Google Calendar Link generator
  const getGoogleCalendarUrl = () => {
    const title = encodeURIComponent(
      event?.title || 'Óghowa Business Week: Institutional Leadership & Economic Summit'
    );
    const details = encodeURIComponent(
      `Óghowa Business Week Attendance\nDelegate: ${fullName}\nSelected Days: ${selectedBusinessWeekDays.join(
        ', '
      )}\nAccreditation Code: ${accreditedPass?.accreditationCode || 'PENDING'}\nBenin City, Edo State`
    );
    const loc = encodeURIComponent('The Heritage Hall & Convention Centre, Benin City, Edo State');
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${loc}&dates=20261116T080000Z/20261121T180000Z`;
  };

  // Download .ics calendar file
  const handleDownloadIcs = () => {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Oghowa Accelerator//Business Week 2026//EN',
      'BEGIN:VEVENT',
      'SUMMARY:Óghowa Business Week 2026',
      `DESCRIPTION:Óghowa Business Week Attendance - Delegate: ${fullName} (${accreditedPass?.accreditationCode})`,
      'LOCATION:The Heritage Hall & Convention Centre, Benin City, Edo State',
      'DTSTART:20261116T080000Z',
      'DTEND:20261121T180000Z',
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'oghowa-business-week-pass.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div
        id="event-registration-modal-overlay"
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150"
        onClick={(e) => {
          if (e.target === e.currentTarget && !isSubmitting) onClose();
        }}
      >
        <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
          {/* Header Strip with exact branding:
              ÓGHOWA BUSINESS WEEK
              Registration Form
              Nov 16–21, 2026   ·   Benin City, Edo State
          */}
          <div className="bg-[#0A162B] text-white p-5 sm:p-7 border-b border-slate-800 relative">
            <button
              onClick={onClose}
              aria-label="Close registration form"
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="max-w-xl">
              <div className="text-[11px] font-black uppercase tracking-widest text-[#D9232A] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#D9232A]" />
                <span>ÓGHOWA BUSINESS WEEK</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
                Registration Form
              </h2>
              <div className="flex items-center gap-2 mt-2 text-xs text-slate-300 font-medium">
                <Calendar className="w-3.5 h-3.5 text-red-400 shrink-0" />
                <span>Nov 16–21, 2026</span>
                <span className="text-slate-500">·</span>
                <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0" />
                <span>Benin City, Edo State</span>
              </div>

              {event && event.id !== 'event-summit-2026' && (
                <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700 text-[11px] text-slate-300">
                  <span className="text-slate-400">Convening:</span>
                  <span className="font-bold text-white truncate max-w-xs">{event.title}</span>
                </div>
              )}
            </div>
          </div>

          {/* Form Content / Success Screen */}
          <div className="p-5 sm:p-7 max-h-[80vh] overflow-y-auto">
            {showSuccess && accreditedPass ? (
              /* SUCCESS STATE: Official Credential Pass */
              <div className="text-center py-2 animate-in zoom-in-95 duration-200">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-7 h-7" />
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-[#0A162B]">
                  Registration Confirmed & Pass Issued
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  Your registration for Óghowa Business Week has been recorded in the ecosystem registry.
                </p>

                {/* Digital Delegate Pass Card */}
                <div className="mt-6 mx-auto max-w-md bg-[#0A162B] text-white p-5 rounded-2xl shadow-xl border border-slate-700 text-left relative overflow-hidden">
                  <div className="flex items-center justify-between border-b border-slate-700/80 pb-3 mb-3">
                    <div>
                      <span className="text-[10px] uppercase font-mono tracking-wider text-red-400 font-bold block">
                        Official Delegate Pass
                      </span>
                      <h4 className="text-sm font-bold text-white leading-tight mt-0.5">
                        Óghowa Business Week 2026
                      </h4>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                      ACCREDITED
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Full Name:</span>
                      <span className="font-bold text-white">{accreditedPass.fullName}</span>
                    </div>
                    {accreditedPass.organization && (
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Organization:</span>
                        <span className="text-slate-200">{accreditedPass.organization}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Attending As:</span>
                      <span className="text-red-300 font-semibold">{accreditedPass.track}</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-slate-400 shrink-0">Business Week Days:</span>
                      <span className="text-slate-200 text-right font-medium">
                        {accreditedPass.selectedDays && accreditedPass.selectedDays.length > 0
                          ? accreditedPass.selectedDays.join(', ')
                          : 'Full Week (Nov 16–21)'}
                      </span>
                    </div>
                    {accreditedPass.innovationWeekendDays && accreditedPass.innovationWeekendDays.length > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">BTF 2.0 Track:</span>
                        <span className="text-blue-300 font-medium">
                          {accreditedPass.innovationWeekendDays.join(', ')}
                        </span>
                      </div>
                    )}
                    <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
                      <span className="text-[11px] text-slate-400 font-mono">Pass Code:</span>
                      <span className="text-xs font-mono font-bold text-amber-400 bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
                        {accreditedPass.accreditationCode}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Calendar & Pass Actions */}
                <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
                  <a
                    href={getGoogleCalendarUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1.5 transition-colors"
                  >
                    <CalendarPlus className="w-3.5 h-3.5 text-[#0022D6]" />
                    <span>Add to Google Calendar</span>
                  </a>

                  <button
                    type="button"
                    onClick={handleDownloadIcs}
                    className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-[#D9232A]" />
                    <span>Download .ICS Invite</span>
                  </button>

                  <button
                    type="button"
                    onClick={handlePrint}
                    className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5 text-slate-600" />
                    <span>Print Pass</span>
                  </button>
                </div>

                <div className="mt-5 p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-600 max-w-md mx-auto">
                  <p>
                    Completed registration details have been dispatched to{' '}
                    <strong className="text-slate-800">{accreditedPass.email}</strong>. If you need special bilateral
                    accreditation or protocol escort, please reach out to the Secretariat at{' '}
                    <a href="mailto:ogho@metaspaceconsult.com" className="text-[#0022D6] font-semibold hover:underline">
                      ogho@metaspaceconsult.com
                    </a>.
                  </p>
                </div>

                <div className="mt-6">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2.5 bg-[#0A162B] hover:bg-[#122344] text-white text-xs font-bold rounded-lg shadow-sm cursor-pointer transition-all"
                  >
                    Done & Return
                  </button>
                </div>
              </div>
            ) : (
              /* THE REGISTRATION FORM MATCHING USER TEMPLATE */
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* SECTION 1: Your details */}
                <div>
                  <div className="border-b border-slate-200 pb-2 mb-3">
                    <h3 className="text-sm font-bold text-[#0A162B] uppercase tracking-wider">
                      Your details
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5 italic">
                      So we know who&apos;s walking through the door.
                    </p>
                  </div>

                  <div className="space-y-3.5">
                    {/* Full name */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Full name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="e.g. Osasere Imade"
                          className={`w-full pl-9 pr-3 py-2 text-xs bg-white border rounded-lg focus:outline-none focus:ring-2 ${
                            errors.fullName
                              ? 'border-red-500 focus:ring-red-100'
                              : 'border-slate-300 focus:ring-blue-100 focus:border-[#0022D6]'
                          }`}
                        />
                      </div>
                      {errors.fullName && (
                        <p className="text-[11px] text-red-600 mt-1">{errors.fullName}</p>
                      )}
                    </div>

                    {/* Email & Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@organization.com"
                            className={`w-full pl-9 pr-3 py-2 text-xs bg-white border rounded-lg focus:outline-none focus:ring-2 ${
                              errors.email
                                ? 'border-red-500 focus:ring-red-100'
                                : 'border-slate-300 focus:ring-blue-100 focus:border-[#0022D6]'
                            }`}
                          />
                        </div>
                        {errors.email && (
                          <p className="text-[11px] text-red-600 mt-1">{errors.email}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Phone <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+234 803 123 4567"
                            className={`w-full pl-9 pr-3 py-2 text-xs bg-white border rounded-lg focus:outline-none focus:ring-2 ${
                              errors.phone
                                ? 'border-red-500 focus:ring-red-100'
                                : 'border-slate-300 focus:ring-blue-100 focus:border-[#0022D6]'
                            }`}
                          />
                        </div>
                        {errors.phone && (
                          <p className="text-[11px] text-red-600 mt-1">{errors.phone}</p>
                        )}
                      </div>
                    </div>

                    {/* Organization & Role */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Organization (optional)
                        </label>
                        <div className="relative">
                          <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                          <input
                            type="text"
                            value={organization}
                            onChange={(e) => setOrganization(e.target.value)}
                            placeholder="e.g. Edo Innovates / Firm Name"
                            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#0022D6]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Role / title (optional)
                        </label>
                        <div className="relative">
                          <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                          <input
                            type="text"
                            value={professionalTitle}
                            onChange={(e) => setProfessionalTitle(e.target.value)}
                            placeholder="e.g. Founder, CEO, Director"
                            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#0022D6]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SECTION 2: How you fit in */}
                <div>
                  <div className="border-b border-slate-200 pb-2 mb-3">
                    <h3 className="text-sm font-bold text-[#0A162B] uppercase tracking-wider">
                      How you fit in
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5 italic">
                      This helps us route you to the right rooms and conversations.
                    </p>
                  </div>

                  {/* I'm attending as a: */}
                  <div className="space-y-2 mb-4">
                    <label className="block text-xs font-semibold text-slate-700">
                      I&apos;m attending as a:
                    </label>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {attendeeRoleOptions.map((role) => {
                        const isSelected = selectedRole === role;
                        return (
                          <button
                            key={role}
                            type="button"
                            onClick={() => setSelectedRole(role)}
                            className={`p-2.5 rounded-lg border text-left text-xs transition-all flex items-center gap-2 cursor-pointer ${
                              isSelected
                                ? 'bg-red-50 border-[#D9232A] text-[#0A162B] font-bold shadow-2xs'
                                : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                            }`}
                          >
                            <span
                              className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 text-[10px] ${
                                isSelected
                                  ? 'bg-[#D9232A] border-[#D9232A] text-white'
                                  : 'border-slate-300 bg-white'
                              }`}
                            >
                              {isSelected ? '✓' : ''}
                            </span>
                            <span className="truncate">{role}</span>
                          </button>
                        );
                      })}
                    </div>

                    {selectedRole === 'Other' && (
                      <div className="mt-2 animate-in fade-in duration-150">
                        <input
                          type="text"
                          value={otherRoleText}
                          onChange={(e) => setOtherRoleText(e.target.value)}
                          placeholder="Please specify your role / discipline..."
                          className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#D9232A]"
                        />
                        {errors.otherRole && (
                          <p className="text-[11px] text-red-600 mt-1">{errors.otherRole}</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Days you plan to attend Business Week */}
                  {/* REQUIREMENT: "the days for the event should be calender popup and the popup should allow multiple selection of dates" */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <label className="block text-xs font-semibold text-slate-700">
                        Days you plan to attend Business Week:
                      </label>

                      {/* Interactive Calendar Popup Trigger Button */}
                      <button
                        type="button"
                        onClick={() => {
                          setCalendarTarget('business-week');
                          setCalendarPopupOpen(true);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-[#D9232A] border border-red-200 text-xs font-bold transition-colors cursor-pointer self-start sm:self-auto shadow-2xs"
                      >
                        <Calendar className="w-3.5 h-3.5 text-[#D9232A]" />
                        <span>Calendar Popup (Select Dates)</span>
                      </button>
                    </div>

                    {/* Direct clickable checkbox options matching template:
                        ☐ Mon 16	☐ Tue 17	☐ Wed 18	☐ Thu 19	☐ Fri 20	☐ Sat 21
                    */}
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-1">
                      {BUSINESS_WEEK_DAYS.map((day) => {
                        const isChecked = selectedBusinessWeekDays.includes(day.dayStr);
                        return (
                          <button
                            key={day.dayStr}
                            type="button"
                            onClick={() => toggleBusinessWeekDay(day.dayStr)}
                            className={`p-2 rounded-lg border text-center text-xs font-bold transition-all cursor-pointer flex flex-col items-center justify-center ${
                              isChecked
                                ? 'bg-[#D9232A] text-white border-[#B9181F] shadow-xs'
                                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            <span className="text-[10px] uppercase font-semibold opacity-80">
                              {day.dayOfWeek}
                            </span>
                            <span className="text-sm font-black">{day.dayNumber}</span>
                            <span className="text-[9px] mt-0.5">
                              {isChecked ? '✓ Selected' : '☐ Select'}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {errors.days && (
                      <p className="text-[11px] text-red-600 mt-1">{errors.days}</p>
                    )}

                    <div className="text-[11px] text-slate-500 flex items-center justify-between">
                      <span>
                        <strong>{selectedBusinessWeekDays.length} of 6 days</strong> selected
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedBusinessWeekDays([
                            'Mon 16',
                            'Tue 17',
                            'Wed 18',
                            'Thu 19',
                            'Fri 20',
                            'Sat 21',
                          ])
                        }
                        className="text-[11px] text-[#0022D6] hover:underline font-semibold"
                      >
                        Select all days
                      </button>
                    </div>
                  </div>
                </div>

                {/* SECTION 3: Óghowa Innovation Weekend (BTF 2.0) */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="border-b border-slate-200 pb-2 mb-2">
                    <h3 className="text-xs font-bold text-[#0A162B] uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#D9232A]" />
                      <span>Óghowa Innovation Weekend (BTF 2.0)</span>
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5 italic">
                      An optional 3-day startup build track ahead of Business Week, Nov 5–7, 2026.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-slate-700">
                      Days you&apos;ll join at BTF 2.0 (optional — leave blank to skip):
                    </label>

                    <div className="grid grid-cols-3 gap-2">
                      {INNOVATION_WEEKEND_DAYS.map((day) => {
                        const isChecked = selectedBTFDays.includes(day.dayStr);
                        return (
                          <button
                            key={day.dayStr}
                            type="button"
                            onClick={() => toggleBTFDay(day.dayStr)}
                            className={`p-2 rounded-lg border text-center text-xs font-bold transition-all cursor-pointer flex flex-col items-center justify-center ${
                              isChecked
                                ? 'bg-[#0022D6] text-white border-blue-800 shadow-xs'
                                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            <span className="text-[10px] uppercase font-semibold opacity-80">
                              {day.dayOfWeek}
                            </span>
                            <span className="text-sm font-black">{day.dayNumber}</span>
                            <span className="text-[9px] mt-0.5">
                              {isChecked ? '✓ Joining' : '☐ Skip'}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* SECTION 4: A little more */}
                <div>
                  <div className="border-b border-slate-200 pb-2 mb-3">
                    <h3 className="text-sm font-bold text-[#0A162B] uppercase tracking-wider">
                      A little more
                    </h3>
                  </div>

                  {/* How did you hear about Óghowa Business Week? (optional) */}
                  <div className="space-y-2 mb-4">
                    <label className="block text-xs font-semibold text-slate-700">
                      How did you hear about Óghowa Business Week? (optional)
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {referralOptions.map((ref) => {
                        const isSelected = selectedReferral === ref;
                        return (
                          <button
                            key={ref}
                            type="button"
                            onClick={() => setSelectedReferral(isSelected ? '' : ref)}
                            className={`p-2 rounded-lg border text-left text-xs transition-all flex items-center gap-2 cursor-pointer ${
                              isSelected
                                ? 'bg-red-50 border-[#D9232A] text-[#0A162B] font-semibold'
                                : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                            }`}
                          >
                            <span
                              className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 text-[9px] ${
                                isSelected
                                  ? 'bg-[#D9232A] border-[#D9232A] text-white'
                                  : 'border-slate-300 bg-white'
                              }`}
                            >
                              {isSelected ? '✓' : ''}
                            </span>
                            <span className="truncate">{ref}</span>
                          </button>
                        );
                      })}
                    </div>

                    {selectedReferral === 'Other' && (
                      <div className="mt-2">
                        <input
                          type="text"
                          value={otherReferralText}
                          onChange={(e) => setOtherReferralText(e.target.value)}
                          placeholder="Please specify how you heard about the summit..."
                          className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#D9232A]"
                        />
                      </div>
                    )}
                  </div>

                  {/* Dietary or accessibility requirements (optional): */}
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      Dietary or accessibility requirements (optional):
                    </label>
                    <textarea
                      rows={2}
                      value={dietaryRequirements}
                      onChange={(e) => setDietaryRequirements(e.target.value)}
                      placeholder="e.g., Halal, vegetarian, wheelchair ramp access, translation, etc."
                      className="w-full p-2.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#0022D6]"
                    />
                  </div>
                </div>

                {/* Footer Notice & Actions */}
                <div className="pt-3 border-t border-slate-200 space-y-4">
                  {/* Notice from user template */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-600 text-[11px] leading-relaxed flex items-start gap-2">
                    <FileText className="w-4 h-4 text-[#D9232A] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-800">
                        Completed forms can be returned by email or handed to an Óghowa Business Week team member on site.
                      </p>
                      <p className="mt-0.5 text-slate-500">
                        Secretariat Email:{' '}
                        <a
                          href="mailto:ogho@metaspaceconsult.com"
                          className="text-[#0022D6] font-semibold hover:underline"
                        >
                          ogho@metaspaceconsult.com
                        </a>{' '}
                        · Benin City, Edo State
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={handlePrint}
                      className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 border border-slate-300 hover:bg-slate-100 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5 text-slate-500" />
                      <span>Print / Physical Form</span>
                    </button>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={onClose}
                        className="w-1/2 sm:w-auto px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-1/2 sm:w-auto px-6 py-2.5 bg-[#D9232A] hover:bg-[#B9181F] text-white text-xs font-bold rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-75"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Submitting Form...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5" />
                            <span>Submit Registration</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Calendar Popup with Multiple Date Selection */}
      <EventCalendarMultiPicker
        isOpen={calendarPopupOpen}
        onClose={() => setCalendarPopupOpen(false)}
        selectedDays={
          calendarTarget === 'business-week' ? selectedBusinessWeekDays : selectedBTFDays
        }
        onSaveDays={(newDays) => {
          if (calendarTarget === 'business-week') {
            setSelectedBusinessWeekDays(newDays);
          } else {
            setSelectedBTFDays(newDays);
          }
        }}
        title={
          calendarTarget === 'business-week'
            ? 'Select Business Week Dates'
            : 'Select BTF 2.0 Dates'
        }
        subtitle={
          calendarTarget === 'business-week'
            ? 'Multi-select days you plan to attend (Nov 16–21, 2026 · Benin City)'
            : 'Multi-select days for Innovation Weekend (Nov 5–7, 2026)'
        }
      />
    </>
  );
};
