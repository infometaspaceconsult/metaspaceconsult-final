import React, { useState } from 'react';
import { ProgramId, EventItem, AttendeeTrack } from '../types';
import { useSiteConfig } from '../context/SiteConfigContext';
import { DynamicIcon } from './DynamicIcon';
import {
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Users,
  Award,
  Layers,
  ArrowLeft,
  Share2,
  Bookmark,
  TrendingUp,
  Cpu,
  ShieldCheck,
  Code,
  Sparkles,
} from 'lucide-react';
import { HeroCarouselBackground } from './HeroCarouselBackground';

interface ProgramDetailViewProps {
  programId: ProgramId;
  onSelectProgram: (id: ProgramId) => void;
  onBackToHome: () => void;
  onOpenJoinModal: (programTitle: string) => void;
  onOpenEventRegistration?: (event: EventItem, defaultTrack?: AttendeeTrack) => void;
}

interface ProgramVariantData {
  id: ProgramId;
  title: string;
  tagline: string;
  badge: string;
  shortDesc: string;
  fullDesc: string;
  stats: { label: string; value: string; icon: any }[];
  whatYouGet: string[];
  targetedPersonas: { role: string; desc: string; icon: any }[];
  cohortTimeline: string;
  registrationCta: string;
  carouselImages: string[];
}

const PROGRAM_VARIANTS: Record<string, ProgramVariantData> = {
  // Variant A: Innovation Weekend
  'innovation-weekend': {
    id: 'innovation-weekend',
    title: 'Oghowa Innovation Weekend',
    tagline: '54-Hour Intensive Sprint: Prototype, Pitch, and Validate',
    badge: 'Variant A: Rapid Prototyping Hackathon',
    shortDesc: 'A high-velocity 54-hour sprint transforming raw concepts into validated prototypes with hands-on mentor guidance.',
    fullDesc:
      'The Oghowa Innovation Weekend is an immersive 54-hour hackathon and venture simulation. Builders, designers, domain specialists, and operators converge to form teams, architect MVPs, conduct live customer discovery on the streets of Benin City, and pitch before a panel of institutional investors and tech founders.',
    stats: [
      { label: 'Duration', value: '54 Hours (Fri - Sun)', icon: Calendar },
      { label: 'Mentors', value: '18+ Executive Mentors', icon: Award },
      { label: 'Focus Sectors', value: 'AgroTech, Logistics, EdTech', icon: Layers },
      { label: 'Cohort Size', value: '12-15 Teams (60 Builders)', icon: Users },
    ],
    whatYouGet: [
      'Rapid prototype development sprints and technical architecture code review',
      'Live customer validation frameworks and structured interview methodologies',
      'UI/UX design sprints guided by senior African product designers',
      'Investor pitch coaching, financial model stress-testing, and deck styling',
      'Guaranteed fast-track entry into the Oghowa Incubation Program for winners',
      'Over ₦5M in prototype grants, cloud hosting credits, and legal toolkits',
    ],
    targetedPersonas: [
      {
        role: 'Engineers & Developers',
        desc: 'Full-stack software and hardware builders looking for commercial co-founders.',
        icon: Code,
      },
      {
        role: 'Domain Specialists',
        desc: 'Professionals in healthcare, logistics, agriculture, and law with unaddressed industry pain points.',
        icon: Cpu,
      },
      {
        role: 'Product Designers & Marketers',
        desc: 'Visual storytellers and growth operators eager to build real products from scratch.',
        icon: Sparkles,
      },
    ],
    cohortTimeline: 'Next Sprint: November 2026 • Physical Hub, Benin City',
    registrationCta: 'Apply for Innovation Weekend',
    carouselImages: [
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80',
    ],
  },

  // Variant B: Incubation Program
  'incubation-program': {
    id: 'incubation-program',
    title: 'Oghowa Incubation Program',
    tagline: '3–6 Month Cohort: Product Validation, Governance, and Investor Readiness',
    badge: 'Variant B: Structured Enterprise Incubation',
    shortDesc: 'A rigorous 3–6 month curriculum supporting early-stage ventures to validate product-market fit and reach institutional seed readiness.',
    fullDesc:
      'The Oghowa Incubation Program equips founders with institutional-grade operating frameworks. Through weekly modules covering customer acquisition, unit economics, statutory compliance, corporate governance, and technical scaling, startups build durable foundations to attract institutional syndicate capital.',
    stats: [
      { label: 'Duration', value: '3 to 6 Months', icon: Calendar },
      { label: 'Mentors', value: '25+ C-Suite Advisors', icon: Award },
      { label: 'Focus Sectors', value: 'Fintech, HealthTech, CleanTech', icon: Layers },
      { label: 'Cohort Size', value: '15 High-Potential Startups', icon: Users },
    ],
    whatYouGet: [
      'Dedicated EIRs (Entrepreneurs-in-Residence) assigned to your executive team',
      'Deep unit economics auditing, pricing model stress-tests, and CAC/LTV calibration',
      'Access to state-wide procurement pilots with corporate and municipal entities',
      'Comprehensive statutory compliance, CAC filing, and IP assignment frameworks',
      'Bi-weekly closed-door investor dinners and pitch reviews with EIN partners',
      'Up to $25,000 in seed syndication grant matching for qualifying milestones',
    ],
    targetedPersonas: [
      {
        role: 'Early-Stage Founders',
        desc: 'Founders with a working MVP seeking validated customer traction and unit economics.',
        icon: Users,
      },
      {
        role: 'Corporate Spin-Outs',
        desc: 'Technical leaders commercializing proprietary intellectual property or software.',
        icon: ShieldCheck,
      },
      {
        role: 'Regional Innovators',
        desc: 'Founders solving regional infrastructure, commerce, and agricultural supply chain gaps.',
        icon: TrendingUp,
      },
    ],
    cohortTimeline: 'Cohort 04 Admissions Open • Winter 2026',
    registrationCta: 'Apply for Incubation Cohort',
    carouselImages: [
      'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1600&q=80',
    ],
  },

  // Variant C: Venture Studio
  'venture-studio': {
    id: 'venture-studio',
    title: 'Oghowa Venture Studio',
    tagline: 'Co-Founding Model: Institutional Capital, Shared Services, and Equity Alignment',
    badge: 'Variant C: Institutional Co-Creation Studio',
    shortDesc: 'We co-create and institutionalize breakout companies from scratch alongside exceptional domain leaders, providing shared engineering, legal, and growth teams.',
    fullDesc:
      'The Oghowa Venture Studio does not merely advise—we co-found. Our studio originates validated industrial and digital business hypotheses, injects dedicated full-stack engineering, legal, and operational horsepower, and partners with experienced operators to build sovereign market leaders.',
    stats: [
      { label: 'Duration', value: '12-18 Months Co-Build', icon: Calendar },
      { label: 'Shared Team', value: '15 Full-Stack In-House Staff', icon: Users },
      { label: 'Focus Sectors', value: 'Energy, Corridor Logistics, Agro-Processing', icon: Layers },
      { label: 'Studio Portfolio', value: '4 Anchor Ventures Annually', icon: Award },
    ],
    whatYouGet: [
      'Turnkey engineering studio: Dedicated senior CTO, UI/UX, and cloud DevOps teams',
      'Full legal incorporation, regulatory sandbox access, and board architecture',
      'Day-1 catalytic balance sheet capital and institutional mezzanine structuring',
      'Corporate pilot agreements pre-negotiated across Edo manufacturing corridors',
      'Shared finance, payroll, talent recruitment, and PR syndication services',
      'Direct pathway to Series A syndication with pan-African venture funds',
    ],
    targetedPersonas: [
      {
        role: 'Experienced Operators',
        desc: 'Senior corporate executives and leaders wanting to build high-equity ventures.',
        icon: Award,
      },
      {
        role: 'Serial Tech Founders',
        desc: 'Experienced founders who want unfair execution advantages and institutional backing.',
        icon: TrendingUp,
      },
      {
        role: 'Institutional Partners',
        desc: 'Conglomerates looking to co-develop spun-off digital infrastructure products.',
        icon: ShieldCheck,
      },
    ],
    cohortTimeline: 'Rolling Applications • Continuous Studio Pipeline',
    registrationCta: 'Apply as Co-Founder / EIR',
    carouselImages: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1600&q=80',
    ],
  },

  // Variant D: Capital Network
  'capital-network': {
    id: 'capital-network',
    title: 'Oghowa Capital Network',
    tagline: 'Syndicated Rounds, Edo Investors Network Deal Flow, and Mezzanine Instruments',
    badge: 'Variant D: Institutional Capital Syndication',
    shortDesc: 'Connecting diligence-ready African technology and industrial ventures to angel syndicates, sovereign funds, debt vehicles, and EIN deal flow.',
    fullDesc:
      'The Oghowa Capital Network serves as the investment syndication backbone for Edo State. Through our strategic integration with the Edo Investors Network (EIN), regional banks, and DFIs, we bridge the capital gap for scaling companies requiring structured equity, debt, and mezzanine financing.',
    stats: [
      { label: 'Target Pool', value: '≥ $50M Active Capital', icon: TrendingUp },
      { label: 'Investor Network', value: '120+ LPs, GPs, and Angels', icon: Users },
      { label: 'Instruments', value: 'Equity, Mezzanine, Blended Debt', icon: Layers },
      { label: 'Deal Velocity', value: 'Quarterly Syndication Rooms', icon: Calendar },
    ],
    whatYouGet: [
      'Vetted deal room access with high-net-worth members of the Edo diaspora and EIN',
      'SPV (Special Purpose Vehicle) syndication structuring and cap table modeling',
      'Mezzanine financing and working capital lines facilitated with banking partners',
      'Comprehensive institutional investment memos and virtual data-room diligence',
      'Quarterly closed-door LP/GP syndication roundtables and demo days',
      'Continuous quarterly investor reporting and governance compliance audits',
    ],
    targetedPersonas: [
      {
        role: 'Growth-Stage Startups',
        desc: 'Post-revenue ventures raising $250k - $3M to expand regional market share.',
        icon: TrendingUp,
      },
      {
        role: 'Institutional Investors & LPs',
        desc: 'Family offices, fund managers, and angel networks seeking vetted deal flow.',
        icon: ShieldCheck,
      },
      {
        role: 'Industrial Corporates',
        desc: 'Mid-sized manufacturing and processing firms seeking debt and equity expansion.',
        icon: Award,
      },
    ],
    cohortTimeline: 'Quarterly Syndication Deal-Room Active',
    registrationCta: 'Request Capital Network Access',
    carouselImages: [
      'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1600&q=80',
    ],
  },
};

export const ProgramDetailView: React.FC<ProgramDetailViewProps> = ({
  programId,
  onSelectProgram,
  onBackToHome,
  onOpenJoinModal,
  onOpenEventRegistration,
}) => {
  const { config } = useSiteConfig();

  // Normalize program key or fallback to innovation-weekend
  const normalizedKey = PROGRAM_VARIANTS[programId] ? programId : 'innovation-weekend';
  const program = PROGRAM_VARIANTS[normalizedKey];

  const [copiedToast, setCopiedToast] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2500);
  };

  // Open the official registration form that directly tallies with the Events page
  const handleApply = () => {
    if (!onOpenEventRegistration) {
      onOpenJoinModal(program.title);
      return;
    }

    let matchedEvent: EventItem | undefined;
    let defaultTrack: AttendeeTrack = 'Entrepreneur / Founder';

    if (programId === 'innovation-weekend') {
      matchedEvent = config.events?.find(
        (e) =>
          e.id === 'event-innovation-weekend' ||
          e.title.toLowerCase().includes('innovation weekend')
      );
      if (!matchedEvent) {
        matchedEvent = {
          id: 'event-innovation-weekend',
          title: 'Oghowa Innovation Weekend',
          category: 'Founder Sprints',
          badge: 'Registration Open',
          date: 'October 9–11, 2026',
          time: '54-Hour Intensive Sprint (Fri 5PM - Sun 9PM)',
          location: 'Oghowa Innovation Hub, Sapele Road, Benin City',
          track: 'Founders, Software Engineers & Product Designers',
          description:
            'A high-velocity 54-hour hackathon and venture simulation. Builders, designers, and domain specialists converge to form teams, build MVPs, and pitch before early-stage angel syndicates.',
          capacityLimit: 60,
          registeredCount: 42,
          status: 'Registration Open',
          bannerImageUrl:
            'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1600&q=80',
          expectedTier: 'Founder / Builder',
        };
      }
      defaultTrack = 'Entrepreneur / Founder';
    } else if (programId === 'incubation-program') {
      matchedEvent = config.events?.find((e) =>
        e.title.toLowerCase().includes('incubation')
      ) || {
        id: 'event-incubation-cohort',
        title: 'Óghowa Incubation Program (Cohort 04)',
        category: 'Founder Sprints',
        badge: 'Admissions Open',
        date: 'Winter 2026 Cohort Cycle',
        time: '3-6 Month Structured Incubation',
        location: 'Oghowa Innovation Hub, Sapele Road, Benin City',
        track: 'Early-Stage Founders & Builders',
        description:
          'Official registration & admissions application for the Óghowa 3-6 month incubation cohort. Submissions are reviewed by the admissions board.',
        capacityLimit: 20,
        registeredCount: 14,
        status: 'Registration Open',
        bannerImageUrl:
          'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1600&q=80',
        expectedTier: 'Founder / Builder',
      };
      defaultTrack = 'Entrepreneur / Founder';
    } else if (programId === 'venture-studio') {
      matchedEvent = config.events?.find((e) =>
        e.title.toLowerCase().includes('venture studio')
      ) || {
        id: 'event-venture-studio',
        title: 'Óghowa Venture Studio Co-Founder Application',
        category: 'Founder Sprints',
        badge: 'Co-Founder Call',
        date: 'Rolling Admissions 2026',
        time: 'Institutional Venture Co-Creation',
        location: 'Benin City & Remote Studio',
        track: 'Technical Co-Founders & EIRs',
        description:
          'Official application for Venture Studio EIRs and Technical Co-Founders. Co-build validated high-yield ventures with institutional backing.',
        capacityLimit: 12,
        registeredCount: 6,
        status: 'Registration Open',
        bannerImageUrl:
          'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80',
        expectedTier: 'Founder / Builder',
      };
      defaultTrack = 'Entrepreneur / Founder';
    } else if (programId === 'capital-network') {
      matchedEvent = config.events?.find((e) => e.id === 'event-deal-room') || {
        id: 'event-capital-network',
        title: 'Óghowa Capital Network & Syndicate Accreditation',
        category: 'Summit & Deal-Rooms',
        badge: 'Accreditation Required',
        date: 'November 19–21, 2026',
        time: 'Closed-Door Capital Allocations',
        location: 'Executive Boardroom, Benin City (Strict NDA)',
        track: 'Institutional Investors & Family Offices',
        description:
          'Official accreditation application for institutional investors, DFIs, and syndicates seeking verified allocations with EIN partners.',
        capacityLimit: 40,
        registeredCount: 28,
        status: 'Registration Open',
        bannerImageUrl:
          'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1600&q=80',
        expectedTier: 'Executive Delegate / LP',
      };
      defaultTrack = 'Investor / Funder';
    } else {
      matchedEvent = config.events?.[0];
    }

    onOpenEventRegistration(matchedEvent, defaultTrack);
  };

  const programNavList: { id: ProgramId; label: string }[] = [
    { id: 'innovation-weekend', label: 'Innovation Weekend' },
    { id: 'incubation-program', label: 'Incubation Program' },
    { id: 'venture-studio', label: 'Venture Studio' },
    { id: 'capital-network', label: 'Capital Network' },
  ];

  return (
    <div id="program-detail-page" className="min-h-screen bg-white">
      {/* Program Switcher Top Bar */}
      <div className="bg-[#050D1E] border-b border-slate-800 text-slate-300 py-3 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 text-xs flex-wrap">
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onBackToHome}
              className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Ecosystem</span>
            </button>
            <span className="text-slate-700">|</span>
            <span className="text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
              Flagship Programs:
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 overflow-x-auto">
            {programNavList.map((prog) => (
              <button
                key={prog.id}
                onClick={() => onSelectProgram(prog.id)}
                className={`px-3 py-1.5 rounded text-xs whitespace-nowrap transition-colors cursor-pointer ${
                  prog.id === program.id
                    ? 'bg-[#D9232A] text-white font-semibold shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {prog.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 1. Header with Breadcrumbs, dynamic title, tagline, CTA, and Hero Carousel */}
      <section className="relative bg-[#07132B] text-white py-14 sm:py-20 overflow-hidden min-h-[440px] flex items-center">
        <HeroCarouselBackground
          images={program.carouselImages}
          intervalMs={6000}
          overlayClassName="bg-gradient-to-r from-[#07132B]/95 via-[#0A162B]/90 to-[#07132B]/85"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-xs text-slate-400 mb-6 flex-wrap">
            <button
              onClick={onBackToHome}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Home
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-slate-400">Programs</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-red-400 font-medium">{program.title}</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-block px-3 py-1 rounded-full bg-red-950/80 border border-red-500/30 text-red-300 text-xs font-semibold uppercase tracking-wider mb-4">
              {program.badge}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4 leading-tight">
              {program.title}
            </h1>

            <p className="text-base sm:text-lg text-slate-200 leading-relaxed mb-8 max-w-2xl font-normal">
              {program.tagline}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={handleApply}
                className="px-6 py-3 bg-[#D9232A] hover:bg-[#B9181F] text-white text-sm font-semibold rounded-md shadow-lg shadow-red-900/30 flex items-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
              >
                <span>{program.registrationCta}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleShare}
                className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-md border border-white/20 flex items-center gap-2 cursor-pointer transition-colors backdrop-blur-sm"
              >
                <Share2 className="w-4 h-4" />
                <span>{copiedToast ? 'Link Copied!' : 'Share Program'}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Program Overview & Key Stats Grid (Duration, Mentors, Focus Sectors, Cohort Size) */}
      <section className="py-12 sm:py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-3xl">
            <h2 className="text-xl sm:text-2xl font-bold text-[#0A162B] mb-3">Program Overview</h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              {program.fullDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {program.stats.map((stat, idx) => {
              const IconComp = stat.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-lg bg-red-50 text-[#D9232A] flex items-center justify-center">
                      <IconComp className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      {stat.label}
                    </span>
                  </div>
                  <div className="text-base sm:text-lg font-bold text-[#0A162B] pl-12">
                    {stat.value}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Value Proposition ("What You Get") paired with Targeted Participant Personas */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Left: Value Proposition ("What You Get") Checklist */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold mb-3">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Value Proposition</span>
              </div>
              <h3 className="text-2xl font-bold text-[#0A162B] mb-6">
                What You Get in this Program
              </h3>

              <div className="space-y-4">
                {program.whatYouGet.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Targeted Participant Personas */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold mb-3">
                <Users className="w-3.5 h-3.5 text-blue-600" />
                <span>Targeted Participants</span>
              </div>
              <h3 className="text-2xl font-bold text-[#0A162B] mb-6">
                Who this Program is Built For
              </h3>

              <div className="space-y-4">
                {program.targetedPersonas.map((persona, idx) => {
                  const IconComp = persona.icon;
                  return (
                    <div
                      key={idx}
                      className="p-5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-slate-300 transition-colors"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-900 flex items-center justify-center">
                          <IconComp className="w-4 h-4" />
                        </div>
                        <h4 className="text-base font-bold text-[#0A162B]">
                          {persona.role}
                        </h4>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 pl-11">
                        {persona.desc}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Cohort Notice & Direct Apply */}
              <div className="mt-8 p-5 bg-[#07132B] text-white rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-red-400 font-semibold block">
                    Cohort Schedule
                  </span>
                  <span className="text-xs sm:text-sm font-medium text-slate-200">
                    {program.cohortTimeline}
                  </span>
                </div>
                <button
                  onClick={handleApply}
                  className="px-5 py-2.5 bg-[#D9232A] hover:bg-[#B9181F] text-white text-xs font-bold rounded-lg shrink-0 cursor-pointer transition-colors shadow-sm"
                >
                  Apply Today
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
