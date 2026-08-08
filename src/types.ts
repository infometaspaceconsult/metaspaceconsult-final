export interface Venture {
  id: string;
  title: string;
  tagline: string;
  description: string;
  category: string;
  iconName: string;
  impactMetric?: string;
  link?: string;
  featured?: boolean;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
  highlight?: boolean;
  features?: string[];
}

export interface StatItem {
  id: string;
  number: string;
  label: string;
  iconName: string;
}

export interface LayoutSection {
  id: string;
  name: string;
  title: string;
  order: number;
  enabled: boolean;
}

export interface ThemeConfig {
  primaryNavy: string;
  secondaryRed: string;
  backgroundColor: string;
  textColor: string;
  fontHeading: string;
  fontBody: string;
  borderRadius: string;
  logoType: 'default-image3' | 'custom-image' | 'text-only';
  customLogoUrl?: string;
}

export interface SiteContent {
  companyName: string;
  tagline: string;
  heroHeadline: string;
  heroSubheadline: string;
  aboutHeadline: string;
  aboutText: string;
  ecosystemHeadline: string;
  contactEmail: string;
  contactPhone: string;
  locationAddress: string;
  whatsappNumber: string;
}

export interface SiteConfig {
  content: SiteContent;
  theme: ThemeConfig;
  sections: LayoutSection[];
  ventures: Venture[];
  services: ServiceItem[];
  stats: StatItem[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'companion' | 'system';
  text: string;
  timestamp: string;
  actionType?: 'lead_capture' | 'whatsapp_referral' | 'consultation';
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  interest?: string;
  message?: string;
  source: 'companion_chatbot' | 'contact_form' | 'consultation_booking';
  status: 'new' | 'contacted' | 'qualified' | 'converted';
  createdAt: string;
}
