/**
 * =========================================================================
 * ÓGHOWA ACCELERATOR - CLOUD SITE CONFIGURATION & CONTENT MANAGEMENT
 * =========================================================================
 */

import { EventItem } from '../types';

export interface NavigationMenuItem {
  id: string;
  label: string;
  url: string;
  order: number;
  isCta?: boolean;
  active: boolean;
}

export interface TypographyPaletteConfig {
  primaryNavy: string;
  accentRed: string;
  darkBg: string;
  lightBg: string;
  displayFont: string;
  bodyFont: string;
}

export interface FooterLegalConfig {
  officeAddress: string;
  cityState: string;
  primaryEmail: string;
  primaryPhone: string;
  metaspaceCopyright: string;
  disclaimerNotice: string;
  privacyUrl: string;
  termsUrl: string;
}

export interface WhoWeServeCard {
  id: string;
  title: string;
  tagline: string;
  icon: string;
  targetUrl: string;
}

export interface JourneyStepConfig {
  stepNumber: number;
  title: string;
  tagline: string;
  description: string;
  milestones: string[];
}

export interface InfrastructureEnablerConfig {
  id: string;
  name: string;
  category: string;
  icon: string;
  description: string;
}

export interface StrategicPartnerLogoConfig {
  id: string;
  name: string;
  category: string;
  badge: string;
  logoUrl?: string;
  websiteUrl?: string;
}

export interface AdvisoryCouncilMemberConfig {
  id: string;
  name: string;
  title: string;
  affiliation: string;
  photoUrl: string;
  bio?: string;
}

export interface DealRoomArchitectureConfig {
  id: string;
  title: string;
  description: string;
  participants: string;
  deliverables: string[];
}

export interface ExecutiveMasterclassConfig {
  id: string;
  title: string;
  targetAudience: string;
  curriculum: string[];
}

export interface VenturePavilionConfig {
  id: string;
  title: string;
  description: string;
  innovations: string[];
}

export interface PartnershipTierConfig {
  id: string;
  tierName: string;
  investmentTier: string;
  badgeText: string;
  deliverables: string[];
}

export interface SubProgramPagesConfig {
  innovationWeekend: {
    heroHeadline: string;
    heroSubheadline: string;
    curriculum54h: { phase: string; duration: string; description: string }[];
    targetProfiles: string[];
    prizes: { title: string; award: string; perks: string }[];
    sponsors: string[];
  };
  incubation: {
    heroHeadline: string;
    timeline: string;
    criteria: string[];
    deliverables: string[];
    workspacePerks: string[];
  };
  ventureStudio: {
    heroHeadline: string;
    studioModel: string;
    focusSectors: string[];
    coFoundingTerms: string[];
  };
  capitalNetwork: {
    heroHeadline: string;
    syndicateFramework: string;
    stageCriteria: string[];
    partnerNetwork: string[];
  };
}

export interface InnovationWeekendConfig {
  headline: string;
  dates: string;
  prizePool: string;
  targetAudience: string;
  tagline: string;
  description: string;
}

export interface IncubationProgramConfig {
  headline: string;
  duration: string;
  targetStage: string;
  cohortSize: string;
  description: string;
}

export interface VentureStudioConfig {
  headline: string;
  coFoundingTerms: string;
  focusSectors: string[];
  description: string;
}

export interface CapitalNetworkConfig {
  headline: string;
  ticketSizes: string;
  targetStages: string;
  syndicateStructure: string;
  description: string;
}

export interface VentureItem {
  id: string;
  name: string;
  sector: string;
  tagline: string;
  description: string;
  logoText: string;
  badgeColor: string;
  logoUrl?: string;
  link?: string;
  metrics?: { label: string; value: string }[];
}

export interface ProgramConfigItem {
  id: string;
  title: string;
  tagline: string;
  shortDescription: string;
  active: boolean;
}

export interface StrategicPillarConfig {
  id: string;
  title: string;
  desc: string;
}

export interface SiteConfig {
  brand: {
    name: string;
    subTitle: string;
    tagline: string;
    shortAbout: string;
    foundedYear: number;
    logoUrl?: string;
  };
  global: {
    siteTitle: string;
    contactEmail: string;
    location: string;
    primaryCtaUrl: string;
    secondaryCtaUrl: string;
  };
  hero: {
    eyebrow: string;
    headlineLine1: string;
    headlineLine2: string;
    description: string;
    primaryCtaText: string;
    secondaryCtaText: string;
    bannerNotice?: string;
    audienceTracks: string[];
    carouselImages: string[];
  };
  summitData: {
    advisoryCouncilText: string;
    ecosystemAnchorsText: string;
    dealRoomAgendasText: string;
    pillars: StrategicPillarConfig[];
  };
  impactMetrics: {
    target1Value: string;
    target1Label: string;
    target2Value: string;
    target2Label: string;
    target3Value: string;
    target3Label: string;
  };
  flagshipPrograms: ProgramConfigItem[];
  featuredVentures: VentureItem[];
  events: EventItem[];
  eventCategories: string[];
  headerNav: NavigationMenuItem[];
  typographyPalette: TypographyPaletteConfig;
  footerConfig: FooterLegalConfig;
  whoWeServe: WhoWeServeCard[];
  journeyRoadmap: JourneyStepConfig[];
  infrastructureEnablers: InfrastructureEnablerConfig[];
  strategicPartners: StrategicPartnerLogoConfig[];
  advisoryCouncil: AdvisoryCouncilMemberConfig[];
  dealRoomArchitecture: DealRoomArchitectureConfig[];
  executiveMasterclasses: ExecutiveMasterclassConfig[];
  venturePavilion: VenturePavilionConfig[];
  partnershipTiers: PartnershipTierConfig[];
  subPrograms: SubProgramPagesConfig;
  innovationWeekend?: InnovationWeekendConfig;
  incubationProgram?: IncubationProgramConfig;
  ventureStudio?: VentureStudioConfig;
  capitalNetwork?: CapitalNetworkConfig;
  contact: {
    email: string;
    phone: string;
    location: string;
    dealRoomEmail: string;
    pressEmail: string;
    inquiriesAdvisor: string;
  };
  socials: {
    linkedin: string;
    twitter: string;
    instagram: string;
    youtube: string;
    facebook: string;
  };
  settings: {
    enablePreloader: boolean;
    enableScrollAnimations: boolean;
    enableLogoFollower: boolean;
    carouselIntervalSeconds: number;
  };
}

export const defaultSiteConfig: SiteConfig = {
  // Brand identity
  brand: {
    name: 'ÒGHOWA',
    subTitle: 'Oghowa Accelerator',
    tagline: "Architecting Edo State's Industrial Renaissance and Economic Autonomy",
    shortAbout:
      "Oghowa Accelerator powers Oghowa Business Week — the premier economic gathering convening Edo State's foremost policymakers, financial sector leaders, industrial pioneers, and institutional investors in Benin City to deploy capital, scale high-impact enterprises, and institutionalize long-term prosperity.",
    foundedYear: 2026,
    logoUrl: '',
  },

  // Global Settings for Admin Panel (Prompt 5)
  global: {
    siteTitle: "Oghowa Accelerator - Building Africa's Innovation Economy",
    contactEmail: 'ogho@metaspaceconsult.com',
    location: 'Benin City, Edo State, Nigeria',
    primaryCtaUrl: '#inquiries',
    secondaryCtaUrl: '#deal-room',
  },

  // Hero Section headlines, audience tracks, and carousel images (Prompt 2)
  hero: {
    eyebrow: 'Institutional Leadership & Economic Summit • Benin City',
    headlineLine1: "Architecting Edo State's Industrial Renaissance",
    headlineLine2: 'and Economic Autonomy',
    description:
      "Convening the state's foremost policymakers, financial sector leaders, industrial pioneers, and institutional investors in Benin City to deploy capital, scale high-impact enterprises, and institutionalize long-term prosperity.",
    primaryCtaText: 'Request Executive Access',
    secondaryCtaText: 'Download Comprehensive Prospectus',
    bannerNotice: 'Strategic Alignment with Edo Investors Network (EIN) & Regional Financial Institutions',
    audienceTracks: [
      'Founders',
      'Investors',
      'Corporates',
      'Government',
      'Universities',
      'Development Partners',
    ],
    carouselImages: [
      'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=2000&q=80',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=80',
      'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=2000&q=80',
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=2000&q=80',
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=2000&q=80',
    ],
  },

  // Summit Data (Prompt 3 & Prompt 5)
  summitData: {
    advisoryCouncilText:
      'Governed by an eminent steering committee of seasoned Edo-based economists, industrial magnates, financial regulators, and academic leaders dedicated to capital formation.',
    ecosystemAnchorsText:
      'Developed in strategic alignment with the Edo Investors Network (EIN), regional financial institutions, and advisory entities dedicated to deepening local capital markets.',
    dealRoomAgendasText:
      'Closed-door bilateral LP/GP sessions, Series A+ enterprise showcases, and sovereign-private investment roundtables mobilizing ≥ $50M in syndication capital.',
    pillars: [
      {
        id: 'capital',
        title: 'Strategic Capital Deployment & Syndication',
        desc: 'Oghowa Syndicate framework, structured debt, equity, and mezzanine financing for high-growth regional enterprises.',
      },
      {
        id: 'industry',
        title: 'Industrialization & Value-Chain Integration',
        desc: 'Corridor logistics, import substitution, agro-processing, and modern manufacturing clusters.',
      },
      {
        id: 'creative',
        title: 'Cultural Commerce & Creative Economy',
        desc: 'Commercializing traditional Edo craftsmanship, royal heritage assets, and digital creative exports.',
      },
      {
        id: 'energy',
        title: 'Infrastructure & Energy Transition',
        desc: 'Sustainable micro-grids, clean energy industrial clusters, and multimodal urban transit links.',
      },
    ],
  },

  // Measurable Impact Commitments Banner (Prompt 2 & Prompt 5)
  impactMetrics: {
    target1Value: '≥ $50M',
    target1Label: 'in active deal-room commitments & syndicated investments',
    target2Value: '150+',
    target2Label: 'high-growth regional corporations & scalable startups',
    target3Value: '1 Actionable',
    target3Label: 'Economic White Paper for state legislative councils',
  },

  // Flagship Platforms Grid (Prompt 2, 4 & 5)
  flagshipPrograms: [
    {
      id: 'business-week',
      title: 'Oghowa Business Week',
      tagline: 'Institutional Leadership & Economic Summit',
      shortDescription: 'Convening policymakers, industrial leaders, and investors to architect Edo’s economic autonomy.',
      active: true,
    },
    {
      id: 'innovation-weekend',
      title: 'Oghowa Innovation Weekend',
      tagline: 'Validate. Build. Pitch. Launch.',
      shortDescription: '54-hour intensive sprint transforming early concepts into market-tested prototypes.',
      active: true,
    },
    {
      id: 'incubation-program',
      title: 'Oghowa Incubation Program',
      tagline: 'Build. Validate. Grow.',
      shortDescription: '3–6 month comprehensive cohort supporting product validation and investor readiness.',
      active: true,
    },
    {
      id: 'venture-studio',
      title: 'Oghowa Venture Studio',
      tagline: 'We build ventures, together.',
      shortDescription: 'Institutional co-founding model providing full-stack shared services and equity alignment.',
      active: true,
    },
    {
      id: 'capital-network',
      title: 'Oghowa Capital Network',
      tagline: 'Connect. Access. Raise.',
      shortDescription: 'Direct pipeline connecting founders to syndicates, grants, venture capital, and EIN deal flow.',
      active: true,
    },
    {
      id: 'research-policy-lab',
      title: 'Research & Policy Lab',
      tagline: 'Evidence. Policy. Impact.',
      shortDescription: 'Empirical research and policy white papers shaping state and regional startup legislation.',
      active: true,
    },
  ],

  // Featured Ventures Showcase (Prompt 2, Item 6: Ugbekun, EduRide, Cysma Medicare, Future Ventures)
  featuredVentures: [
    {
      id: 'ugbekun',
      name: 'Ugbekun',
      sector: 'EdTech',
      tagline: 'Modern educational management for African primary and secondary schools',
      description:
        'Comprehensive school operating system streamlining academic records, parent communications, automated tuition collection, and curriculum tracking across Edo State.',
      logoText: 'Ugbekun',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      link: 'https://ugbekun.example.com',
      metrics: [
        { label: 'Schools Active', value: '48+' },
        { label: 'Students Reached', value: '32,000+' },
      ],
    },
    {
      id: 'eduride',
      name: 'EduRide',
      sector: 'Transport Tech',
      tagline: 'Safe, predictable student and commuter transit corridors',
      description:
        'Safe school transit and scheduled urban fleet coordination featuring real-time telemetry, geo-fenced safety check-ins, and verified driver vetting.',
      logoText: 'EduRide',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      link: 'https://eduride.example.com',
      metrics: [
        { label: 'Daily Safe Trips', value: '14,000+' },
        { label: 'Fleet Safety Record', value: '99.98%' },
      ],
    },
    {
      id: 'cysma-medicare',
      name: 'Cysma Medicare',
      sector: 'HealthTech',
      tagline: 'Accessible clinical diagnostics and rapid pharmaceutical distribution',
      description:
        'Digitized healthcare network providing distributed telemedicine consultations, electronic health records, and cold-chain pharmaceutical delivery to underserved clinics.',
      logoText: 'Cysma Medicare',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      link: 'https://cysmamedicare.example.com',
      metrics: [
        { label: 'Patients Treated', value: '18,500+' },
        { label: 'Clinics Integrated', value: '26' },
      ],
    },
    {
      id: 'future-ventures',
      name: 'Future Ventures',
      sector: 'Multi-Sector Incubator',
      tagline: 'Architecting the next wave of industrial and digital category leaders',
      description:
        'Next-generation portfolio companies currently in incubation across solar micro-grids, agricultural cold-storage, and cross-border digital payment gateways.',
      logoText: 'Future Ventures',
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
      link: '#',
      metrics: [
        { label: 'Pipeline Startups', value: '12' },
        { label: 'Combined Target', value: '$8.5M' },
      ],
    },
  ],

  // Events Hub Roster (Prompt 6)
  events: [
    {
      id: 'event-summit-2026',
      title: 'Oghowa Business Week: Institutional Leadership & Economic Summit',
      category: 'Summit & Deal-Rooms',
      badge: 'Flagship Summit',
      date: 'November 18–21, 2026',
      time: '09:00 AM - 05:30 PM WAT',
      location: 'The Heritage Hall & Convention Centre, Benin City, Edo State',
      track: 'Institutional Investors, Policymakers & Industrialists',
      description:
        "Architecting Edo State's Industrial Renaissance and Economic Autonomy. Connecting institutional investors, industrial leaders, and policymakers to commit ≥ $50M in capital deployment.",
      capacityLimit: 350,
      registeredCount: 284,
      status: 'Registration Open',
      bannerImageUrl:
        'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1600&q=80',
      isFeatured: true,
      expectedTier: 'Executive Delegate / LP',
    },
    {
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
      isFeatured: false,
      expectedTier: 'Founder / Builder',
    },
    {
      id: 'event-deal-room',
      title: 'Sovereign-Private Deal Room & Syndicate Session',
      category: 'Summit & Deal-Rooms',
      badge: 'Vetting Required',
      date: 'November 19, 2026',
      time: '11:00 AM - 03:00 PM WAT',
      location: 'Private Executive Boardroom, Benin City (Strict NDA)',
      track: 'Institutional Investors, Sovereign Funds & Series A+ Founders',
      description:
        'Closed-door bilateral capital allocation for Series A+ ventures and infrastructure projects. Facilitating verified allocations, structured debt, and equity syndication with EIN partners.',
      capacityLimit: 40,
      registeredCount: 29,
      status: 'Vetting Required',
      bannerImageUrl:
        'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1600&q=80',
      isFeatured: false,
      expectedTier: 'Institutional Investor / GP / LP',
    },
    {
      id: 'event-governance-masterclass',
      title: 'Corporate Governance & Scaling Masterclass',
      category: 'Masterclasses & Workshops',
      badge: 'Limited Seats',
      date: 'October 24, 2026',
      time: '10:00 AM - 02:00 PM WAT (Hybrid)',
      location: 'Edo State Secretariat & Virtual Executive Stream',
      track: 'Mid-Market Enterprise Executives & Managing Directors',
      description:
        'Board architecture, statutory audit readiness, AfCFTA compliance, and automated ERP workflows to transition mid-sized Edo commercial enterprises into institutional market champions.',
      capacityLimit: 80,
      registeredCount: 65,
      status: 'Limited Seats',
      bannerImageUrl:
        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80',
      isFeatured: false,
      expectedTier: 'Corporate Executive / Director',
    },
    {
      id: 'event-agro-roundtable',
      title: 'Edo Agro-Industrial Value Chain Roundtable',
      category: 'Investor Roundtables',
      badge: 'Registration Open',
      date: 'November 5, 2026',
      time: '01:00 PM - 04:30 PM WAT',
      location: 'Benin Industrial Park Hall, Benin City',
      track: 'Agro-processors, Corridor Logistics Operators & DFIs',
      description:
        'Import substitution, oil palm corridor logistics, factory automation, and cold-storage infrastructure to integrate rural farmers directly with regional industrial off-takers.',
      capacityLimit: 100,
      registeredCount: 54,
      status: 'Registration Open',
      bannerImageUrl:
        'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1600&q=80',
      isFeatured: false,
      expectedTier: 'Agro-Industrial Leader / DFI',
    },
    {
      id: 'event-venture-showcase',
      title: 'Oghowa Venture Showcase & Demo Day',
      category: 'Founder Sprints',
      badge: 'Vetting Required',
      date: 'November 20, 2026',
      time: '02:00 PM - 06:00 PM WAT',
      location: 'Main Auditorium, The Heritage Hall, Benin City',
      track: 'Graduating Cohort Founders, Angels & EIN Syndicate Partners',
      description:
        'Graduating cohort presentations from the Oghowa Incubation Program and Venture Studio pitching traction, pilot results, and seed/Series A rounds to vetted African investors.',
      capacityLimit: 200,
      registeredCount: 168,
      status: 'Vetting Required',
      bannerImageUrl:
        'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1600&q=80',
      isFeatured: false,
      expectedTier: 'Accredited Investor / Founder',
    },
  ],

  // Dynamic Event Categories (Add / Edit / Remove in CMS)
  eventCategories: [
    'Summit & Deal-Rooms',
    'Founder Sprints',
    'Masterclasses & Workshops',
    'Investor Roundtables',
    'Hackathons',
  ],

  // Header & Navigation Menu Builder
  headerNav: [
    { id: 'nav-home', label: 'Ecosystem Hub', url: '#home', order: 1, active: true },
    { id: 'nav-summit', label: 'Business Week Summit', url: '#business-week', order: 2, active: true },
    { id: 'nav-programs', label: 'Flagship Programs', url: '#programs', order: 3, active: true },
    { id: 'nav-events', label: 'Ecosystem Events', url: '#events', order: 4, active: true },
    { id: 'nav-ventures', label: 'Ventures', url: '#ventures', order: 5, active: true },
    { id: 'nav-cta', label: 'Request Access', url: '#inquiries', order: 6, isCta: true, active: true },
  ],

  // Global Typography & Brand Palette
  typographyPalette: {
    primaryNavy: '#06132b',
    accentRed: '#dc2626',
    darkBg: '#050C17',
    lightBg: '#F8FAFC',
    displayFont: "'Playfair Display', serif",
    bodyFont: "'Plus Jakarta Sans', sans-serif",
  },

  // Institutional Footer & Legal Notices
  footerConfig: {
    officeAddress: 'The Heritage Hall & Innovation Hub, Sapele Road',
    cityState: 'Benin City, Edo State, Nigeria',
    primaryEmail: 'secretariat@oghowa.africa',
    primaryPhone: '+234 812 000 4469',
    metaspaceCopyright: '© 2026 Metaspace Consult & Óghowa Accelerator. All Rights Reserved.',
    disclaimerNotice: 'Óghowa Accelerator and Oghowa Business Week are operating initiatives of Metaspace Consult in partnership with the Edo Investors Network (EIN) and regional industrial anchors.',
    privacyUrl: '#privacy',
    termsUrl: '#terms',
  },

  // Homepage: Who We Serve 6-Card Matrix
  whoWeServe: [
    {
      id: 'serve-founders',
      title: 'Founders & Builders',
      tagline: 'Technical sprint tracks, incubation, venture studio co-founding, and non-dilutive seed capital.',
      icon: 'Rocket',
      targetUrl: '#programs',
    },
    {
      id: 'serve-investors',
      title: 'Institutional Investors & LPs',
      tagline: 'Vetted pipeline of regional deal flows, bilateral deal-rooms, and co-investment syndicates.',
      icon: 'Briefcase',
      targetUrl: '#deal-room',
    },
    {
      id: 'serve-corporates',
      title: 'Corporates & Industry',
      tagline: 'Off-taker value chain integration, industrial innovation partnerships, and tech modernization.',
      icon: 'Building2',
      targetUrl: '#business-week',
    },
    {
      id: 'serve-government',
      title: 'Government & Policymakers',
      tagline: 'Policy white papers, sovereign-private economic dialogues, and state industrialization frameworks.',
      icon: 'Landmark',
      targetUrl: '#governance',
    },
    {
      id: 'serve-universities',
      title: 'Universities & Academia',
      tagline: 'Commercialization of academic research, student builder challenges, and talent hubs.',
      icon: 'GraduationCap',
      targetUrl: '#programs',
    },
    {
      id: 'serve-partners',
      title: 'Ecosystem & DFIs',
      tagline: 'Deepening sub-national economic resilience, export compliance, and impact capital allocation.',
      icon: 'Globe',
      targetUrl: '#partnership',
    },
  ],

  // Homepage: The Oghowa Journey 6-Step Roadmap
  journeyRoadmap: [
    {
      stepNumber: 1,
      title: 'Discover & Convene',
      tagline: 'Ecosystem Mapping & Challenge Definition',
      description: 'Mapping high-potential regional problems and convening visionary builders across key Edo industrial corridors.',
      milestones: ['54-Hour Innovation Weekend', 'Cohort Scout Sprints', 'Domain Assessment'],
    },
    {
      stepNumber: 2,
      title: 'Build & Prototype',
      tagline: 'Hands-on Technical Execution',
      description: 'Guiding founders through rapid MVP architecture, user testing, and verifiable unit economics.',
      milestones: ['Technical Mentorship', 'Cloud Credit Grants', 'Prototype Validation'],
    },
    {
      stepNumber: 3,
      title: 'Validate & Pilot',
      tagline: 'Commercial Off-Taker Alignment',
      description: 'Connecting cohort ventures to real commercial customers, schools, logistics fleets, and healthcare clinics.',
      milestones: ['First 10 Paid Pilots', 'Regulatory Compliance Check', 'Customer Feedback Loops'],
    },
    {
      stepNumber: 4,
      title: 'Fund & Syndicate',
      tagline: 'Catalytic Capital Deployment',
      description: 'Direct bilateral pitch rooms at Oghowa Business Week mobilizing early equity, grants, and structured debt.',
      milestones: ['Pre-Seed to Series A Deal-Rooms', 'EIN Syndicate Allocations', 'Sovereign Match Grants'],
    },
    {
      stepNumber: 5,
      title: 'Scale & Industrialize',
      tagline: 'Regional & Pan-African Expansion',
      description: 'Scaling manufacturing, distribution channels, and export capability across the South-South corridor.',
      milestones: ['Industrial Park Integration', 'Cross-State Logistics', 'Automated Operations'],
    },
    {
      stepNumber: 6,
      title: 'Exit & Reinvest',
      tagline: 'Generational Value Creation',
      description: 'Institutionalizing liquidity events and recycling founder expertise and capital back into local startups.',
      milestones: ['M&A Transitions', 'Founders Angel Network', 'Endowment Growth'],
    },
  ],

  // Homepage: Infrastructure & Enablers Grid
  infrastructureEnablers: [
    {
      id: 'infra-cloud',
      name: 'High-Performance Cloud & DevOps',
      category: 'Compute & Hosting',
      icon: 'Server',
      description: 'Tier-3 data center connectivity and cloud sponsorship packages for enterprise uptime.',
    },
    {
      id: 'infra-ai',
      name: 'Machine Intelligence & Data Labs',
      category: 'Artificial Intelligence',
      icon: 'Cpu',
      description: 'Domain-specific language models and computer vision pipelines tailored for African commerce.',
    },
    {
      id: 'infra-pay',
      name: 'Unified Payments & Escrow Engine',
      category: 'FinTech',
      icon: 'CreditCard',
      description: 'Automated multi-currency payouts, instant bank transfer APIs, and secure transaction infrastructure.',
    },
    {
      id: 'infra-legal',
      name: 'Corporate Structuring & IP Shield',
      category: 'Legal & Governance',
      icon: 'Scale',
      description: 'AfCFTA export compliance, CAC incorporation, patent filings, and statutory regulatory sandboxes.',
    },
    {
      id: 'infra-bi',
      name: 'Corridor Analytics & BI Dashboards',
      category: 'Analytics',
      icon: 'BarChart2',
      description: 'Real-time telemetry and regional economic activity indicators tracking SME transaction volumes.',
    },
    {
      id: 'infra-logistics',
      name: 'Cold-Chain & Corridor Logistics',
      category: 'Supply Chain',
      icon: 'Truck',
      description: 'Multi-modal transit nodes and refrigerated storage linking farms directly with processing factories.',
    },
  ],

  // Strategic Partners & Sovereign Anchors Carousel
  strategicPartners: [
    { id: 'part-edo', name: 'Edo State Government', category: 'Sovereign Anchor', badge: 'Public Sector Host', websiteUrl: 'https://edostate.gov.ng' },
    { id: 'part-ein', name: 'Edo Investors Network (EIN)', category: 'Capital Partner', badge: 'Syndicate Lead', websiteUrl: '#' },
    { id: 'part-sterling', name: 'Sterling One Foundation', category: 'Financial Institution', badge: 'Impact Partner', websiteUrl: '#' },
    { id: 'part-msft', name: 'Microsoft for Startups', category: 'Technology Partner', badge: 'Cloud Sponsor', websiteUrl: '#' },
    { id: 'part-aws', name: 'AWS Africa', category: 'Cloud Infrastructure', badge: 'Infrastructure Sponsor', websiteUrl: '#' },
    { id: 'part-mtn', name: 'MTN Business', category: 'Telecommunications', badge: 'Connectivity Partner', websiteUrl: '#' },
    { id: 'part-dangote', name: 'Dangote Industries', category: 'Industrial Pioneer', badge: 'Manufacturing Anchor', websiteUrl: '#' },
    { id: 'part-giz', name: 'GIZ Nigeria', category: 'Development Agency', badge: 'Institutional Partner', websiteUrl: '#' },
    { id: 'part-stanchart', name: 'Standard Chartered', category: 'Global Banking', badge: 'Finance Advisory', websiteUrl: '#' },
    { id: 'part-afd', name: 'Agence Française de Développement (AFD)', category: 'Bilateral DFI', badge: 'Development Partner', websiteUrl: '#' },
  ],

  // Summit: Advisory Council & Steering Committee Roster
  advisoryCouncil: [
    {
      id: 'c-1',
      name: 'Dr. Osahon Imasuen',
      title: 'Chairman, Edo Economic Council',
      affiliation: 'Former Deputy Governor, Central Bank Technical Group',
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      bio: 'Leading scholar on monetary policy, state fiscal autonomy, and sub-national capital formation.',
    },
    {
      id: 'c-2',
      name: 'Barr. Amina Obaseki',
      title: 'Managing Director, Corridor Infrastructure Fund',
      affiliation: 'Senior Partner, Midwest Legal Advisory',
      photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      bio: 'Specialist in public-private partnerships (PPP), industrial concessions, and commercial arbitration.',
    },
    {
      id: 'c-3',
      name: 'Engr. Victor Idahosa',
      title: 'Chief Technology Officer, Pan-African Payments',
      affiliation: 'Founding Member, EIN Syndicate',
      photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
      bio: 'Architect of scalable digital infrastructure and payment rails processing billions in regional transaction volumes.',
    },
    {
      id: 'c-4',
      name: 'Prof. Eghosa Osawe',
      title: 'Dean of Industrial Engineering',
      affiliation: 'University of Benin & Regional Innovation Lab',
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      bio: 'Championing academic spin-outs, robotics in agro-processing, and industrial automation.',
    },
  ],

  // Summit: Deal-Room Architecture
  dealRoomArchitecture: [
    {
      id: 'dr-lp-gp',
      title: 'Private Institutional LP/GP Boardrooms',
      description: 'Strictly bilateral meetings between international development finance institutions, sovereign funds, and fund managers.',
      participants: 'Accredited Institutional Investors, Sovereign Wealth Funds, General Partners',
      deliverables: ['Confidential Term Sheet Sign-offs', 'LP Allocation Commitments', 'Multi-Year Mandates'],
    },
    {
      id: 'dr-series-a',
      title: 'High-Growth Series A+ Venture Showcase',
      description: 'Curated enterprise pitches from growth-stage companies with verified audited revenues exceeding $500k ARR.',
      participants: 'Vetted Founders, Growth-Stage Venture Funds, Corporate Venture Arms',
      deliverables: ['Syndicated Equity Rounds', 'Commercial Lead Generation', 'Expansion Debt Facilities'],
    },
    {
      id: 'dr-sovereign',
      title: 'Sovereign-Private Industrial Roundtables',
      description: 'Direct dialogue with state commissioners, concession regulators, and port corridor authorities.',
      participants: 'Cabinet Commissioners, Industrialists, Infrastructure Developers',
      deliverables: ['Land Concessions & Tax Incentives', 'Right-of-Way Approvals', 'Off-Take Agreements'],
    },
  ],

  // Summit: Executive Masterclasses
  executiveMasterclasses: [
    {
      id: 'mc-gov',
      title: 'Corporate Governance & Board Architecture',
      targetAudience: 'CEOs, Managing Directors & Enterprise Board Members',
      curriculum: [
        'Statutory fiduciary obligations and shareholder agreements',
        'Board committee composition and independent director selection',
        'Audit readiness and cross-border regulatory compliance',
      ],
    },
    {
      id: 'mc-export',
      title: 'AfCFTA Trade Facilitation & Export Compliance',
      targetAudience: 'Manufacturers, Agro-Processors & Export Merchants',
      curriculum: [
        'Rules of origin documentation and duty exemption protocols',
        'Sanitary and phytosanitary international standards',
        'Letters of credit and export trade guarantee financing',
      ],
    },
    {
      id: 'mc-auto',
      title: 'Industrial Automation & ERP Deployment',
      targetAudience: 'Operations Directors & Chief Technology Officers',
      curriculum: [
        'Migrating legacy spreadsheets to integrated cloud ERPs',
        'Predictive supply chain analytics and warehouse automation',
        'Cybersecurity controls for critical enterprise infrastructure',
      ],
    },
  ],

  // Summit: Oghowa Venture Pavilion
  venturePavilion: [
    {
      id: 'pav-startup',
      title: 'Startup Alley & Interactive Demos',
      description: 'Live physical demo booths where 40+ graduating founders exhibit working hardware, software, and agro-processing products.',
      innovations: ['Solar Cold-Chain Units', 'School Telemetry Trackers', 'FinTech QR Terminals', 'Telemedicine Kits'],
    },
    {
      id: 'pav-talent',
      title: 'Executive Talent Hub & Developer Lounge',
      description: 'Exclusive networking lounge matching senior software architects and operational leaders with funded portfolio ventures.',
      innovations: ['Direct 1-on-1 Interviews', 'Resume Portfolios', 'Engineering Matchmaking Sessions'],
    },
    {
      id: 'pav-tech',
      title: 'Industrial Tech & Clean Energy Showcase',
      description: 'Interactive pavilion featuring modular renewable energy grids, automated palm oil extraction presses, and packaging prototypes.',
      innovations: ['Micro-Grid Power Cells', 'Biomass Processors', 'Electric Delivery Tricycles'],
    },
  ],

  // Summit: Partnership Tiers Matrix
  partnershipTiers: [
    {
      id: 'tier-sovereign',
      tierName: 'Principal Sovereign Anchor',
      investmentTier: 'Institutional / State Concession',
      badgeText: 'Highest Priority Placement',
      deliverables: [
        'Keynote address during opening plenary session',
        'Exclusive naming rights for the main convention hall',
        'Dedicated VIP deal-room suite with private secretariat',
        'Lead logo prominence across all regional and international broadcasts',
      ],
    },
    {
      id: 'tier-gold',
      tierName: 'Strategic Industrial Partner',
      investmentTier: '₦25,000,000 / $25,000',
      badgeText: 'Executive Recognition',
      deliverables: [
        'Panel moderator and speaker slots in 2 strategic sessions',
        'Prominent booth in the Oghowa Venture Pavilion',
        '10 all-access executive delegate passes with deal-room access',
        'Full-page feature in the printed Economic White Paper',
      ],
    },
    {
      id: 'tier-silver',
      tierName: 'Ecosystem Enabler',
      investmentTier: '₦10,000,000 / $10,000',
      badgeText: 'Innovation Sponsor',
      deliverables: [
        'Sponsorship of 1 Executive Masterclass track',
        'Exhibition booth in the tech pavilion',
        '5 executive delegate passes',
        'Logo placement across digital portals and accreditation badges',
      ],
    },
  ],

  // Specialized Sub-Program Pages CMS
  subPrograms: {
    innovationWeekend: {
      heroHeadline: '54 Hours to Validate, Build, Pitch, and Launch',
      heroSubheadline: 'The premier hackathon and venture simulation in Benin City bringing together 60 high-caliber software engineers, product designers, and commercial strategists.',
      curriculum54h: [
        { phase: 'Friday 5:00 PM', duration: 'Ideation & Pitch Fire', description: 'Open mic pitches, voting on top 10 venture concepts, and interdisciplinary team formation.' },
        { phase: 'Saturday All Day', duration: 'Sprint & Customer Validation', description: 'Intensive code execution, customer discovery calls, mentor office hours, and MVP deployment.' },
        { phase: 'Sunday 5:00 PM', duration: 'Grand Demo & Angel Awards', description: '3-minute pitches and live product demonstrations before an esteemed angel syndicate.' },
      ],
      targetProfiles: ['Full-Stack Engineers', 'Product Designers (UI/UX)', 'Growth Marketers', 'Commercial Founders', 'Domain Specialists'],
      prizes: [
        { title: '1st Place Grand Winner', award: '₦2,500,000 Cash Grant', perks: 'Direct entry into Oghowa Incubation Cohort + $10,000 Cloud Credits' },
        { title: '2nd Place Innovation Prize', award: '₦1,500,000 Cash Grant', perks: 'Workspace access at Oghowa Hub for 6 months + Legal Incorporation' },
        { title: '3rd Place Builder Award', award: '₦1,000,000 Cash Grant', perks: 'Technical mentorship + Prototyping stipend' },
      ],
      sponsors: ['Microsoft for Startups', 'Sterling One Foundation', 'Metaspace Consult', 'Edo Innovates'],
    },
    incubation: {
      heroHeadline: '3–6 Months of Rigorous Product Validation & Investor Readiness',
      timeline: '16 Weeks Cohort-based Full-Time Acceleration in Benin City',
      criteria: [
        'Early-stage technology or scalable manufacturing ventures targeting Edo State and Southern Nigeria',
        'Working functional prototype (MVP) or active initial pilot customer traction',
        'Minimum 2 committed co-founders with complementary technical and commercial skills',
        'Clear economic thesis for regional import substitution or digital export',
      ],
      deliverables: [
        'Dedicated product sprint coaching with seasoned technical architects',
        'Direct access to pilot off-takers across health, education, and transport',
        'Legal structuring, CAC incorporation, and AfCFTA export documentation',
        'Preparation of audited financial models and institutional data rooms',
      ],
      workspacePerks: [
        'High-speed fiber connectivity at Oghowa Innovation Hub',
        'Uninterrupted solar micro-grid power supply',
        'Executive meeting rooms and podcast recording studio',
        'Access to legal, accounting, and payroll shared services',
      ],
    },
    ventureStudio: {
      heroHeadline: 'We Don’t Just Fund Companies — We Architect and Build Them Together',
      studioModel: 'An institutional co-founding model pairing experienced entrepreneurs-in-residence with proprietary regional market research, full-stack design and engineering teams, and anchor sovereign customers.',
      focusSectors: [
        'EdTech & School Operating Systems (e.g. Ugbekun)',
        'Corridor Logistics & Fleet Telemetry (e.g. EduRide)',
        'Distributed Telemedicine & Pharma Cold-Chain (e.g. Cysma Medicare)',
        'Agro-Processing Automation & Oil Palm Supply Chain',
        'Clean Energy Micro-Grids for Industrial Clusters',
      ],
      coFoundingTerms: [
        'Initial pre-seed capital of up to $50,000 provided directly from studio balance sheet',
        'Dedicated embedded engineering and growth team for 9 months',
        'Shared equity alignment ensuring founders retain controlling majority',
        'Direct access to institutional deal-room at Oghowa Business Week',
      ],
    },
    capitalNetwork: {
      heroHeadline: 'Connecting Visionary Regional Founders to Institutional Capital',
      syndicateFramework: 'The Oghowa Capital Network coordinates bilateral syndicates, sovereign matching grants, and growth equity across the Edo Investors Network (EIN) and global DFIs.',
      stageCriteria: [
        'Pre-Seed: $25,000 to $100,000 for verified prototypes and initial cohort graduates',
        'Seed: $100,000 to $500,000 for ventures with repeatable unit economics and revenue',
        'Series A+: $500,000 to $5,000,000 for regional market leaders expanding multi-state footprint',
      ],
      partnerNetwork: [
        'Edo Investors Network (EIN) Angel Syndicate',
        'Midwestern Capital Partners',
        'African Development Finance Institutions',
        'Corporate Venture Arms & Sovereign Concession Funds',
      ],
    },
  },

  innovationWeekend: {
    headline: '54-Hour Intensive Prototyping Sprint & Hackathon',
    dates: 'Benin City • Bi-Annual Cohorts',
    prizePool: '₦5,000,000 in Grants + Cloud Credits',
    targetAudience: 'Software Engineers, UI/UX Designers, Product Architects, University Builders',
    tagline: 'From napkin sketch to functioning prototype with mentor validation in a single weekend',
    description: 'A weekend hackathon bringing together over 60 builders across Edo State to ideate, form teams, build working MVPs, and pitch before a panel of institutional angel investors and sovereign venture leaders.',
  },
  incubationProgram: {
    headline: '3–6 Months of Rigorous Product Validation & Investor Readiness',
    duration: '16 Weeks Cohort-based Acceleration',
    targetStage: 'Pre-Seed & Seed Tech/Manufacturing Startups',
    cohortSize: '10–12 Select Portfolio Companies',
    description: 'Full-time incubation offering co-working space, dedicated engineering advisory, legal structuring, CAC registration, and institutional investment data-room preparation.',
  },
  ventureStudio: {
    headline: 'We Don’t Just Fund Companies — We Architect and Build Them Together',
    coFoundingTerms: 'Co-Founding Equity Alignment with Dedicated Core Engineering Team',
    focusSectors: ['EdTech', 'HealthTech', 'FinTech', 'Logistics', 'AgTech', 'Clean Energy'],
    description: 'An institutional venture studio co-creating ventures by matching validated sovereign market problems with elite operators, funding, and direct pilot customer access.',
  },
  capitalNetwork: {
    headline: 'Connecting Visionary Regional Founders to Institutional Capital',
    ticketSizes: '$25,000 – $3,000,000 Ticket Sizes',
    targetStages: 'Pre-Seed, Seed, Series A & Mezzanine Facilities',
    syndicateStructure: 'SPV Co-Investment & Syndicate Framework with EIN and DFIs',
    description: 'Direct pipeline linking vetted Edo ventures with the Edo Investors Network, commercial banking partners, diaspora capital syndicates, and African development financial institutions.',
  },

  // Visual features and experience preferences
  contact: {
    email: 'ogho@metaspaceconsult.com',
    phone: '+234 812 000 4469',
    location: 'Benin City, Edo State, Nigeria',
    dealRoomEmail: 'ogho@metaspaceconsult.com',
    pressEmail: 'ogho@metaspaceconsult.com',
    inquiriesAdvisor: 'ogho@metaspaceconsult.com',
  },

  // Social media handles and links
  socials: {
    linkedin: 'https://linkedin.com/company/oghowa',
    twitter: 'https://twitter.com/oghowa_africa',
    instagram: 'https://instagram.com/oghowa_africa',
    youtube: 'https://youtube.com/@oghowa',
    facebook: 'https://facebook.com/oghowa',
  },

  // Visual features and experience preferences
  settings: {
    enablePreloader: true,
    enableScrollAnimations: true,
    enableLogoFollower: true,
    carouselIntervalSeconds: 5,
  },
};
