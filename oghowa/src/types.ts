export type NavigationTab = 
  | 'home'
  | 'summit'
  | 'events'
  | 'admin'
  | 'governance'
  | 'pillars'
  | 'deal-room'
  | 'masterclasses'
  | 'pavilion'
  | 'impact'
  | 'partnership'
  | 'inquiries'
  | 'programs'
  | 'ecosystem'
  | 'ventures';

export type ProgramId = 
  | 'innovation-weekend'
  | 'incubation-program'
  | 'venture-studio'
  | 'capital-network'
  | 'business-week'
  | 'research-policy-lab';

export interface AudienceRole {
  id: string;
  title: string;
  description: string;
  actionText: string;
  iconName: string;
  details?: string[];
}

export interface JourneyStep {
  stepNumber: number;
  title: string;
  description: string;
  iconName: string;
  isHighlighted?: boolean;
  milestones?: string[];
}

export interface FlagshipProgram {
  id: ProgramId;
  title: string;
  tagline: string;
  shortDescription: string;
  fullDescription: string;
  imageUrl: string;
  ctaPrimary: string;
  ctaSecondary: string;
  statsPills: { label: string; value: string; icon?: string }[];
  overviewTitle?: string;
  overviewDescription?: string;
  highlightsTitle: string;
  highlights: string[];
  audienceTitle: string;
  audienceItems: { title: string; iconName: string; description?: string }[];
  focusSectors?: string[];
  bannerCta?: {
    headline: string;
    buttonText: string;
  };
}

export interface InfrastructureItem {
  id: string;
  name: string;
  iconName: string;
  category: string;
  description: string;
}

export interface ImpactStat {
  value: string;
  label: string;
  iconName: string;
  description?: string;
}

export interface Venture {
  id: string;
  name: string;
  sector: string;
  tagline: string;
  description: string;
  logoText: string;
  badgeColor: string;
  logoUrl?: string;
  metrics?: { label: string; value: string }[];
  websiteUrl?: string;
}

export interface Partner {
  name: string;
  category: string;
  badge: string;
  color?: string;
}

// ==========================================
// SUMMIT CORE DOMAIN TYPES
// ==========================================

export interface StrategicPillar {
  id: string;
  title: string;
  description: string;
  iconName: string;
  actionTags: string[];
  targetOutcome: string;
}

export interface DealRoomItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
  targetParticipants: string;
  deliverables: string[];
}

export interface MasterclassItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
  targetAudience: string;
  coreCurriculum: string[];
}

export interface PavilionItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
  featuredInnovations: string[];
}

export interface ImpactCommitmentItem {
  id: string;
  metric: string;
  title: string;
  description: string;
  verificationMethod: string;
  iconName: string;
}

export interface PartnershipFrameworkItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
  perks: string[];
}

export interface EventCategoryItem {
  id: string;
  name: string;
  badgeColor: string;
  isDefault?: boolean;
}

export type EventCategory = string;

export interface EventItem {
  id: string;
  title: string;
  category: EventCategory;
  badge: string;
  date: string;
  startDate?: string;
  endDate?: string;
  time: string;
  startTime?: string;
  endTime?: string;
  timezone?: string;
  location: string;
  track: string;
  description: string;
  capacityLimit?: number;
  registeredCount?: number;
  status: 'Registration Open' | 'Limited Seats' | 'Vetting Required' | 'Registration Closed';
  bannerImageUrl?: string;
  isFeatured?: boolean;
  expectedTier?: string;
}

export type AttendeeTrack = 
  | 'Entrepreneur / Founder'
  | 'Investor / Funder'
  | 'Government / Policy'
  | 'Corporate / Sponsor'
  | 'Student'
  | 'Media / Press'
  | 'Other'
  | 'Institutional Investor / GP / LP' 
  | 'Founder / Industrialist' 
  | 'Policymaker / Public Sector' 
  | 'Ecosystem Partner';

export interface EventRegistration {
  id: string;
  eventId: string;
  eventTitle: string;
  fullName: string;
  email: string;
  phone: string;
  organization?: string;
  professionalTitle?: string;
  track: AttendeeTrack;
  otherRoleText?: string;
  selectedDays?: string[];
  innovationWeekendDays?: string[];
  referralSource?: string;
  dietaryAccessibility?: string;
  qualifications?: {
    fundSize?: string;
    targetTicket?: string;
    preferredAssetClass?: string;
    companyStage?: string;
    sector?: string;
    annualRevenue?: string;
    requestDealRoom?: boolean;
  };
  attendanceMode?: 'In-Person (Benin City)' | 'Virtual Executive Stream';
  linkedInUrl?: string;
  accommodations?: string;
  consent?: boolean;
  accreditationStatus: 'Pending' | 'Approved' | 'Declined';
  accreditationCode: string;
  passCode?: string;
  qrPayload?: string;
  declineReason?: string;
  reviewer?: string;
  reviewed_at?: string;
  createdAt: string;
}

export interface NavigationMenuItem {
  id: string;
  label: string;
  targetTab: NavigationTab;
  url?: string;
  order: number;
  isCta?: boolean;
  active: boolean;
}

export interface AdvisoryCouncilMember {
  id: string;
  name: string;
  title: string;
  affiliation: string;
  photoUrl: string;
  bio?: string;
}

export interface PartnerLogoItem {
  id: string;
  name: string;
  category: string;
  logoUrl?: string;
  badgeText: string;
  color?: string;
}
