import { SiteConfig } from '../types';

export const initialSiteConfig: SiteConfig = {
  content: {
    companyName: 'METASPACE CONSULTING LIMITED',
    tagline: 'Building Systems. Empowering People. Transforming Africa.',
    heroHeadline: 'Building Systems. Empowering People. Transforming Africa.',
    heroSubheadline: 'We design, build and scale innovative ventures and digital solutions that solve real problems and drive sustainable economic transformation across Africa.',
    aboutHeadline: 'Metaspace Consulting Limited is a venture design studio and digital transformation company committed to building scalable solutions, enterprises and ecosystems that create lasting impact.',
    aboutText: 'We don\'t just build companies. We build ecosystems.',
    ecosystemHeadline: 'Connecting technology, capital, and talent to empower the next generation of African enterprises.',
    contactEmail: 'info@metaspaceconsulting.com',
    contactPhone: '+234 812 345 6789',
    locationAddress: 'Benin City, Edo State, Nigeria',
    whatsappNumber: '2348123456789',
  },
  theme: {
    primaryNavy: '#141B77',
    secondaryRed: '#E63946',
    backgroundColor: '#f5faff',
    textColor: '#151d22',
    fontHeading: 'Montserrat',
    fontBody: 'Inter',
    borderRadius: '0.5rem',
    logoType: 'default-image3',
    customLogoUrl: '/baboon-icon.svg',
  },
  sections: [
    { id: 'hero', name: 'Hero Banner', title: 'Building Systems. Empowering People.', order: 1, enabled: true },
    { id: 'services', name: 'Core Services', title: 'What We Do', order: 2, enabled: true },
    { id: 'metagen', name: 'Metagen Platform', title: 'Metagen AI Engine', order: 3, enabled: true },
    { id: 'ventures', name: 'Our Ventures', title: 'Purpose-built Ventures', order: 4, enabled: true },
    { id: 'whoweare', name: 'Who We Are', title: 'Venture Design & Ecosystems', order: 5, enabled: true },
    { id: 'stats', name: 'Ecosystem Impact', title: 'Ecosystem Metrics', order: 6, enabled: true },
    { id: 'cta', name: 'Consultation CTA', title: 'Build Something Extraordinary', order: 7, enabled: true },
    { id: 'contact', name: 'Contact & Booking', title: 'Get In Touch', order: 8, enabled: true },
  ],
  services: [
    {
      id: 'venture-design',
      title: 'Venture Design Studio',
      description: 'End-to-end venture creation from ideation and rapid prototyping to market entry and growth scaling.',
      iconName: 'Lightbulb',
      highlight: false,
      features: ['Market Validation', 'Product Prototyping', 'Business Model Design', 'Go-To-Market Strategy']
    },
    {
      id: 'digital-transformation',
      title: 'Digital Transformation',
      description: 'Helping established institutions and startups digitize operations, automate workflows, and integrate modern AI systems.',
      iconName: 'Rocket',
      highlight: false,
      features: ['System Architecture', 'Cloud Migration', 'Enterprise Software', 'Data Analytics']
    },
    {
      id: 'innovation-ecosystem',
      title: 'Innovation Ecosystem Builder',
      description: 'Fostering tech ecosystems by connecting founders with capital, corporate partners, mentors, and government stakeholders.',
      iconName: 'Users',
      highlight: false,
      features: ['Startup Incubators', 'Hackathons & Accelerators', 'Capital Matching', 'Talent Pipelines']
    },
    {
      id: 'strategy-advisory',
      title: 'Strategy & Advisory',
      description: 'Strategic advisory for governments, enterprises, and venture funds navigating complex African markets.',
      iconName: 'TrendingUp',
      highlight: false,
      features: ['Policy Advisory', 'Venture Capital Strategy', 'Risk Assessment', 'Growth Benchmarking']
    },
    {
      id: 'metagen-platform',
      title: 'Metagen Platform',
      description: 'AI-powered venture synthesis and automated digital ecosystem generation engine developed by Metaspace.',
      iconName: 'Cpu',
      highlight: true,
      features: ['Automated Lead Synth', 'Market Intelligence AI', 'Digital Ecosystem Generation', 'Venture Orchestration']
    }
  ],
  ventures: [
    {
      id: 'ugbekun',
      title: 'Ugbekun',
      tagline: 'Smart School Management Platform',
      description: 'A smart school management platform that streamlines operations, attendance, grading and enhances learning outcomes across institutions.',
      category: 'EdTech & Administration',
      iconName: 'GraduationCap',
      impactMetric: '50+ Schools Onboarded',
      featured: true
    },
    {
      id: 'oghowa',
      title: 'Oghowa Accelerator',
      tagline: 'Startup Incubation & Investment Access',
      description: 'Empowering startups through incubation, mentorship, seed funding access, and high-impact market connections.',
      category: 'Venture Incubation',
      iconName: 'Rocket',
      impactMetric: '30+ Funded Founders',
      featured: true
    },
    {
      id: 'eduride',
      title: 'EduRide',
      tagline: 'Student Transit & Logistics Platform',
      description: 'Improving student transportation and school logistics with technology, route tracking, and safety at the core.',
      category: 'Mobility & Logistics',
      iconName: 'Bus',
      impactMetric: '10k+ Safe Trips',
      featured: true
    },
    {
      id: 'cyona',
      title: 'Cyona Medicare',
      tagline: 'Accessible Healthcare & Senior Care',
      description: 'Enhancing elderly care services, digital consultations, and making quality healthcare more accessible for families.',
      category: 'HealthTech & Care',
      iconName: 'HeartPulse',
      impactMetric: '5,000+ Patients Served',
      featured: true
    },
    {
      id: 'metagen',
      title: 'Metagen Engine',
      tagline: 'AI Ecosystem Synthesis Suite',
      description: 'Metaspace\'s proprietary AI engine that generates tailored digital workflows, market insights, and lead automation for businesses.',
      category: 'Artificial Intelligence',
      iconName: 'Zap',
      impactMetric: 'Instant Synthesis',
      featured: true
    }
  ],
  stats: [
    { id: 'stat-ventures', number: '4+', label: 'Flagship Ventures', iconName: 'Boxes' },
    { id: 'stat-partners', number: '30+', label: 'Partners & Collaborators', iconName: 'Handshake' },
    { id: 'stat-impact', number: '1000+', label: 'Lives Impacted', iconName: 'Heart' },
    { id: 'stat-sectors', number: 'Across', label: 'Multiple Sectors', iconName: 'Layers' },
  ]
};
