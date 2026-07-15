export type TabType = "home" | "about" | "what-we-do" | "ventures" | "insights" | "contact" | "admin";

export interface Venture {
  id: string;
  name: string;
  tagline: string;
  description: string;
  fullDetails: string;
  iconName: "school" | "rocket" | "bus" | "heart";
  color: string;
  stats: { label: string; value: string }[];
  impactPoints: string[];
  founderQuote?: string;
}

export interface ServiceOffer {
  id: string;
  title: string;
  iconName: "studio" | "transform" | "ecosystem" | "advisory";
  shortDesc: string;
  longDesc: string;
  keyFeatures: string[];
  caseStudy?: {
    title: string;
    description: string;
    metric: string;
  };
}

export interface InsightPost {
  id: string;
  title: string;
  category: "Venture Builder" | "Digital Transformation" | "Startup Policy" | "Healthcare Tech";
  date: string;
  author: string;
  readTime: string;
  summary: string;
  content: string;
  image: string;
}

export interface ChatMessage {
  role: "user" | "model";
  parts: { text: string }[];
  timestamp: string;
}

export interface Consultation {
  id: string;
  name: string;
  email: string;
  organization: string;
  sector: string;
  service: string;
  message: string;
  createdAt: string;
  status: "pending" | "scheduled" | "completed";
}

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}
