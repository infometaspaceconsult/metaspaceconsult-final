import {
  StrategicPillar,
  DealRoomItem,
  MasterclassItem,
  PavilionItem,
  ImpactCommitmentItem,
  PartnershipFrameworkItem,
} from '../types';

/**
 * =========================================================================
 * OGHOWA BUSINESS WEEK: INSTITUTIONAL LEADERSHIP & ECONOMIC SUMMIT
 * Core Authoritative Institutional Architecture
 * =========================================================================
 */

export const SUMMIT_GOVERNANCE = {
  title: 'The Advisory Council & Institutional Governance',
  governingAuthority: {
    title: 'Governing Authority',
    description:
      'Governed by an eminent steering committee of seasoned Edo-based economists, industrial magnates, financial regulators, and academic leaders.',
    mandate: 'Fiduciary stewardship, policy alignment, and regional economic acceleration.',
    councilMembers: [
      { role: 'Industrial Magnates', focus: 'Manufacturing & Corridor Supply Chains' },
      { role: 'Financial Regulators & Economists', focus: 'Monetary Policy & Capital Depth' },
      { role: 'Academic Leaders & Chancellors', focus: 'Applied Research & Innovation Labs' },
      { role: 'Edo State Development Liaisons', focus: 'PPP Frameworks & Policy Harmonization' },
    ],
  },
  ecosystemAnchors: {
    title: 'Ecosystem Anchors',
    description:
      'Developed in strategic alignment with the Edo Investors Network (EIN), regional financial institutions, and advisory entities dedicated to deepening local capital markets.',
    anchors: [
      { name: 'Edo Investors Network (EIN)', role: 'Syndicate Anchor & LP Network' },
      { name: 'Regional Financial Institutions', role: 'Commercial Debt & Credit Guarantees' },
      { name: 'Advisory Entities & Law Firms', role: 'Regulatory & Cross-Border Compliance' },
      { name: 'Multilateral Development Agencies', role: 'Concessionary & Impact Facilities' },
    ],
  },
};

export const CORE_STRATEGIC_PILLARS: StrategicPillar[] = [
  {
    id: 'capital-deployment',
    title: 'Strategic Capital Deployment & Syndication',
    description:
      'Operationalizing the Oghowa Syndicate framework to bridge institutional liquidity with high-growth, pre-vetted Edo enterprises through structured debt, equity, and mezzanine financing.',
    iconName: 'Coins',
    actionTags: ['Structured Debt', 'Equity Co-Investments', 'Mezzanine Financing', 'Syndicate SPVs'],
    targetOutcome: 'Direct injection of institutional capital into high-growth, audited local firms.',
  },
  {
    id: 'industrialization',
    title: 'Industrialization & Value-Chain Integration',
    description:
      "Modernizing manufacturing, agricultural processing, and supply chain logistics across Edo's key corridors to substitute imports and drive export-readiness.",
    iconName: 'Factory',
    actionTags: ['Agro-Processing Hubs', 'Import Substitution', 'Logistics Corridors', 'Export Readiness'],
    targetOutcome: 'Turn raw agricultural outputs into high-value packaged exports with verified cold-chain logistics.',
  },
  {
    id: 'cultural-commerce',
    title: 'Cultural Commerce & Creative Economy',
    description:
      'Scaling traditional Edo craftsmanship, arts, and modern creative industries into institutional-grade, globally competitive commercial assets.',
    iconName: 'Palette',
    actionTags: ['Royal Benin Craftsmanship', 'IP Monetization', 'Global Heritage Export', 'Creative Hubs'],
    targetOutcome: 'Transforming indigenous artistic mastery into formal economic powerhouses and global IP.',
  },
  {
    id: 'infrastructure-energy',
    title: 'Infrastructure & Energy Transition',
    description:
      'Financing sustainable power grids, industrial parks, and smart urban mobility frameworks within Benin City.',
    iconName: 'Zap',
    actionTags: ['Clean Energy Grids', 'Special Economic Zones', 'Urban Mobility', 'Municipal Infrastructure'],
    targetOutcome: 'Continuous 24/7 industrial power generation and streamlined transit connectivity.',
  },
];

export const DEAL_ROOM_ARCHITECTURE: DealRoomItem[] = [
  {
    id: 'private-deal-rooms',
    title: 'Private Deal Rooms',
    description:
      'Curated, closed-door bilateral sessions connecting institutional limited partners, venture funds, and high-growth founders.',
    iconName: 'Lock',
    targetParticipants: 'LPs, Institutional Fund Managers, Sovereigns & Scale-up CEOs',
    deliverables: [
      'Bilateral term sheet negotiations',
      'Confidential capital deployment matchmaking',
      'Due-diligence data room access',
    ],
  },
  {
    id: 'venture-showcase',
    title: 'Venture Showcase',
    description:
      'Rigorously vetted pitch presentations highlighting Series A+ expansion projects originating from Edo State.',
    iconName: 'TrendingUp',
    targetParticipants: 'Growth-Stage Founders, Venture Capitalists & Private Equity Investors',
    deliverables: [
      'Audited financial model reviews',
      'Live institutional investor Q&A',
      'Syndicated investment commitments',
    ],
  },
  {
    id: 'sovereign-private-dialogues',
    title: 'Sovereign-Private Dialogues',
    description:
      'High-level roundtables addressing regulatory bottlenecks, tax incentives, and public-private partnership models.',
    iconName: 'Landmark',
    targetParticipants: 'State Commissioners, Regulatory Bodies & Industry Captains',
    deliverables: [
      'Resolution of cross-agency regulatory frictions',
      'Structuring pioneer tax status & incentives',
      'Fast-track municipal licensing frameworks',
    ],
  },
];

export const EXECUTIVE_MASTERCLASSES: MasterclassItem[] = [
  {
    id: 'corporate-governance',
    title: 'Corporate Governance & Scaling',
    description:
      'Rigorous modules for mid-sized enterprises transitioning into institutional corporations, focusing on audit readiness and board structures.',
    iconName: 'Building2',
    targetAudience: 'MDs, CEOs, Board Chairs & Family Business Principals',
    coreCurriculum: [
      'Board formation and independent director appointment',
      'Big-4 audit readiness & international financial reporting',
      'Enterprise risk management & compliance architecture',
    ],
  },
  {
    id: 'export-compliance',
    title: 'Export Compliance & Trade Logistics',
    description:
      'Advanced training on navigating continental and international export standards, tariff frameworks, and supply chain digitization.',
    iconName: 'Ship',
    targetAudience: 'Exporters, Manufacturers, Agro-Processors & Trade Directors',
    coreCurriculum: [
      'Navigating AfCFTA continental trade protocols',
      'US FDA & EU phytosanitary certification standards',
      'Digital customs clearance & multimodal logistics',
    ],
  },
  {
    id: 'tech-automation',
    title: 'Technology & Enterprise Automation',
    description:
      'Strategic adoption of modern enterprise resource planning (ERP) and digital infrastructure for legacy businesses.',
    iconName: 'Cpu',
    targetAudience: 'CTOs, COOs & Heads of Digital Transformation',
    coreCurriculum: [
      'ERP migration for manufacturing & wholesale inventory',
      'Automated payroll, tax remittance & invoice financing',
      'Cybersecurity & resilient operational workflows',
    ],
  },
];

export const INNOVATION_PAVILION: PavilionItem[] = [
  {
    id: 'startup-alley',
    title: 'Startup Alley',
    description:
      'Dedicated exhibition space for early-stage and high-growth ventures building scalable solutions across fintech, agritech, logistics, and clean energy.',
    iconName: 'Rocket',
    featuredInnovations: [
      'Decentralized agricultural escrow & warehouse receipts',
      'Sub-national trade finance & borderless B2B payments',
      'Off-grid solar mini-grids for industrial clusters',
    ],
  },
  {
    id: 'tech-showcase',
    title: 'Technology & Enterprise Showcase',
    description:
      'Live demonstrations of homegrown software, digital public infrastructure, and hardware innovations transforming local industries.',
    iconName: 'Layers',
    featuredInnovations: [
      'Automated state tax & land registry digitization engines',
      'Industrial IoT sensors for agro-commodity silos',
      'Telemedicine networks linking rural Edo clinics',
    ],
  },
  {
    id: 'talent-hub',
    title: 'Talent & Workforce Development Hub',
    description:
      'Connecting growing enterprises with top-tier regional engineering, business development, and operational talent.',
    iconName: 'Users',
    featuredInnovations: [
      'Direct executive recruiting roundtables',
      'Engineering apprentice match with VC-backed startups',
      'Vocational mastery certifications in industrial tech',
    ],
  },
];

export const IMPACT_COMMITMENTS: ImpactCommitmentItem[] = [
  {
    id: 'capital-target',
    metric: '≥ $50M',
    title: 'Capital Mobilization Target',
    description: 'Active deal-room commitments and syndicated investments deployed into regional enterprises.',
    verificationMethod: 'Audited deal-room escrow reports and syndicated SPV term sheets.',
    iconName: 'BadgeDollarSign',
  },
  {
    id: 'enterprise-cohort',
    metric: '150+',
    title: 'Enterprise Cohort',
    description: 'High-growth regional corporations, industrial leaders, and scalable startups participating.',
    verificationMethod: 'Vetted registration dossiers and investment-readiness scoring.',
    iconName: 'Building',
  },
  {
    id: 'policy-deliverable',
    metric: '1',
    title: 'Policy Deliverable',
    description:
      'Publication of an actionable economic white paper submitted directly to state development councils and key legislative committees.',
    verificationMethod: 'Formal gazetting and legislative session presentation in Benin City.',
    iconName: 'FileText',
  },
];

export const PARTNERSHIP_FRAMEWORK: PartnershipFrameworkItem[] = [
  {
    id: 'thought-leadership',
    title: 'Thought Leadership Integration',
    description:
      'Secure keynote delivery slots, moderated panel seats, and exclusive white paper authorship to shape regional economic discourse.',
    iconName: 'Lightbulb',
    perks: [
      'Mainstage keynote address before 500+ institutional delegates',
      'Named lead author on thematic sector policy chapters',
      'Chairmanship of high-level sector breakout roundtables',
    ],
  },
  {
    id: 'c-suite-access',
    title: 'C-Suite Access',
    description:
      'Direct entry into closed-door ministerial roundtables, executive networking dinners, and private matchmaking sessions.',
    iconName: 'Award',
    perks: [
      'VIP access to the Governor’s Institutional Banquet',
      'Pre-scheduled 1-on-1 bilateral deal-room encounters',
      'Concierge matchmaking with Series A+ founders and asset managers',
    ],
  },
  {
    id: 'brand-equity',
    title: 'Brand Equity',
    description:
      'Align your organization with elite governance, rigorous intellectual capital, and verifiable economic transformation in Edo State.',
    iconName: 'ShieldCheck',
    perks: [
      'Dominant institutional brand presence across all media & stages',
      'Enduring legacy recognition in the State Economic White Paper',
      'Accredited stakeholder badge across the Edo Investors Network',
    ],
  },
];

export const SUMMIT_INQUIRIES = {
  leadContact: 'Oghowa Institutional Directorate',
  email: 'ogho@metaspaceconsult.com',
  location: 'Benin City, Edo State, Nigeria',
  address: 'Edo State Economic Hub, Benin City, Nigeria',
  phone: '+234 812 000 4469',
  executiveLiaison: 'Advisory, Partnership & Deal-Room Inquiries',
};
