import { Venture, ServiceOffer, InsightPost } from "./types";

export const VENTURES_DATA: Venture[] = [
  {
    id: "ugbekun",
    name: "Ugbekun",
    tagline: "Smart School Management System",
    description: "A comprehensive digital school administration and smart payment platform that streamlines operations, tracking student records, automated fee collection, and enhances communication between teachers and parents.",
    fullDetails: "Ugbekun is designed to address the deep operational inefficiencies in the African educational sector. By integrating academic management, staff scheduling, automated invoice dispatching, and parent-teacher feedback portals, it saves schools up to 40% in administrative hours. Most importantly, its secure payment gateway allows cashless, instant fee payments with flexible installments, significantly reducing school fee default rates.",
    iconName: "school",
    color: "from-blue-600 to-indigo-700",
    stats: [
      { label: "Schools Enrolled", value: "45+" },
      { label: "Students Tracked", value: "12,000+" },
      { label: "Cashless Payments", value: "$320K+" }
    ],
    impactPoints: [
      "99% automated payment accuracy reducing cash handling risks.",
      "Instant SMS academic updates sent directly to parents' mobile phones.",
      "Custom curriculum mapping compliant with national and international education boards."
    ],
    founderQuote: "Ugbekun bridges the gap between administrators, parents, and teachers, turning educational logistics into a seamless experience."
  },
  {
    id: "oghowa",
    name: "Oghowa Accelerator",
    tagline: "Empowering Next-Gen Startups",
    description: "An elite incubation and acceleration platform helping early-stage African tech startups go from prototype to product-market fit with access to mentors, seed funding, and global distribution.",
    fullDetails: "Oghowa Accelerator is Metaspace's ecosystem catalyst. Through structured 12-week cohorts, startups receive intense technical, financial, and legal masterclasses, paired with direct hands-on product design. We don't just advise; we co-build. Every cohort culminates in a Demo Day, exposing startups to over 50 regional and international venture capitalists, angel networks, and strategic corporate partners.",
    iconName: "rocket",
    color: "from-red-600 to-pink-700",
    stats: [
      { label: "Cohort Graduates", value: "24" },
      { label: "Total Funding Raised", value: "$1.8M+" },
      { label: "Survival Rate", value: "92%" }
    ],
    impactPoints: [
      "Hands-on architectural guidance from seasoned Metaspace principal engineers.",
      "Up to $50,000 in direct seed-check investment and AWS/Google Cloud credit perks.",
      "Access to an exclusive alumni network spanning 6 African countries."
    ],
    founderQuote: "Africa doesn't lack talent; it lacks the supportive structure to convert raw grit into institutional wealth. Oghowa is that pipeline."
  },
  {
    id: "eduride",
    name: "EduRide",
    tagline: "Safe, Reliable Student Logistics",
    description: "A transportation-tech solution modernizing school bus operations and logistics with live GPS tracking, verified background-checked drivers, and dynamic route optimization.",
    fullDetails: "EduRide solves the daily anxiety of parent-student transportation logistics. Schools partner with us to optimize their transport fleet or outsource it entirely to our verified fleet. Our mobile app allows parents to see when their child is picked up, view real-time location mapping, and receive notifications upon arrival. Drivers undergo rigorous biometric vetting, security checks, and defensive driving certifications.",
    iconName: "bus",
    color: "from-cyan-600 to-teal-700",
    stats: [
      { label: "Daily Safe Trips", value: "1,500+" },
      { label: "Active Buses", value: "80+" },
      { label: "Logistics Saved", value: "35%" }
    ],
    impactPoints: [
      "Real-time GPS tracking with encrypted geo-fencing alerts.",
      "Vetted bus wardens onboard every ride to assist students and enforce safety protocols.",
      "Dynamic multi-stop routing algorithms saving schools 25% on fuel costs."
    ],
    founderQuote: "We want every parent to send their kids to school knowing that their journey is guarded by world-class safety systems."
  },
  {
    id: "cyona",
    name: "Cyona Medicare",
    tagline: "Quality Healthcare, Delivered Home",
    description: "A certified health-tech network providing premium, reliable in-home elderly care services, physical therapy, and telemedicine check-ins directly to African families.",
    fullDetails: "Cyona Medicare redefines wellness and eldercare across African cities. Our platform connects certified nurses, caregivers, and doctors with families seeking dedicated care for their aging loved ones. By combining physical visits with continuous smart-monitoring devices, we help prevent emergency crises, track vital metrics, and deliver prescription refills right to the patient's doorstep.",
    iconName: "heart",
    color: "from-rose-600 to-red-700",
    stats: [
      { label: "Registered Nurses", value: "120+" },
      { label: "Happy Families", value: "650+" },
      { label: "Response Time", value: "<15 min" }
    ],
    impactPoints: [
      "24/7 dedicated medical emergency dispatch and remote triage assistance.",
      "Personalized healthcare plans developed in collaboration with top regional hospitals.",
      "Direct digital medical records that can be instantly shared with clinical specialists."
    ],
    founderQuote: "Eldercare in Africa is deeply personal. Cyona ensures our parents receive the dignity, warmth, and clinical precision they deserve."
  }
];

export const SERVICES_DATA: ServiceOffer[] = [
  {
    id: "studio",
    title: "Venture Design Studio",
    iconName: "studio",
    shortDesc: "We design, build, and scale innovative startups to solve Africa's most critical systemic challenges.",
    longDesc: "As a premier venture builder, we don't just invest capital; we invest ourselves. We combine deep market research, software engineering brilliance, and local distribution networks to ideate, prototype, launch, and fund standalone companies from scratch.",
    keyFeatures: [
      "Rigorous problem validation and commercial viability modeling.",
      "Rapid high-fidelity prototyping and agile MVP development.",
      "Recruiting stellar C-suite talent to lead launched spin-offs.",
      "Initial seed funding and investor match-making services."
    ],
    caseStudy: {
      title: "Spinning out Ugbekun",
      description: "Identified cash-handling leaks in Edo State secondary schools. Co-designed Ugbekun and turned it into an independent venture, achieving $320K in transacted volume within 9 months.",
      metric: "9 Months to Scale"
    }
  },
  {
    id: "transform",
    title: "Digital Transformation",
    iconName: "transform",
    shortDesc: "We help enterprises, legacies, and public institutions modernize with cutting-edge software and cloud systems.",
    longDesc: "Legacy operations waste invaluable human capacity. We partner with established organizations to audit their workflows, design responsive internal tools, migrate complex architectures to secure cloud servers, and retrain teams on automated digital practices.",
    keyFeatures: [
      "Comprehensive digital capability auditing and operational roadmap design.",
      "Legacy software refactoring and high-availability cloud migration (AWS, GCP).",
      "Custom CRM, ERP, and payment gateway integration.",
      "Data-analytics dashboards representing real-time organizational KPIs."
    ],
    caseStudy: {
      title: "State-wide Education Auditing",
      description: "Partnered with local school boards to migrate educational rosters from paper ledgers to secure databases, optimizing resource planning across hundreds of schools.",
      metric: "100% Rosters Digitized"
    }
  },
  {
    id: "ecosystem",
    title: "Innovation Ecosystem Builder",
    iconName: "ecosystem",
    shortDesc: "We construct and execute standard startup accelerators, digital hubs, and talent pipelines.",
    longDesc: "Ecosystems grow when founders, capital, and mentorship collide effectively. We design and operate structured acceleration programs, technology hubs, and co-working spaces for sovereign sponsors, corporates, and developmental partners.",
    keyFeatures: [
      "Designing high-impact curriculums custom-fitted to emerging markets.",
      "Managing mentor networks consisting of seasoned global tech executives.",
      "Coordinating demographic-specific developer bootcamps and tech meetups.",
      "Structuring venture-capital readiness clinics and pitch simulators."
    ],
    caseStudy: {
      title: "The Oghowa Initiative",
      description: "Built the Oghowa Accelerator hub, providing 24 startups with mentorship, structural workshops, and bringing international angel investors directly to Nigeria's South-South region.",
      metric: "$1.8M Raised by Cohorts"
    }
  },
  {
    id: "advisory",
    title: "Strategy & Advisory",
    iconName: "advisory",
    shortDesc: "We provide high-level tech advisory to governments, impact investors, and corporations.",
    longDesc: "Technology requires smart frameworks to deliver sustainable value. We provide research, economic assessments, and design regulatory and technology guidelines for public institutions, NGOs, and corporate boards eager to drive digital adoption.",
    keyFeatures: [
      "National and subnational startup policy and ecosystem roadmap design.",
      "Feasibility studies for digital parks, optical fiber layouts, and tech zones.",
      "Impact assessment reporting for developmental fund sponsors.",
      "Corporate tech-stack governance and digital policy guidelines."
    ],
    caseStudy: {
      title: "Policy Framework Design",
      description: "Advising regional committees on structuring policies that incentivize tech talent retention, developer tax credits, and seamless digital payment models.",
      metric: "1 Subnational Policy Guided"
    }
  }
];

export const INSIGHTS_DATA: InsightPost[] = [
  {
    id: "post-1",
    title: "The Rise of Venture Building Studios in Africa: Why Direct Investment is Shifting",
    category: "Venture Builder",
    date: "July 2026",
    author: "Osaze Omonbude",
    readTime: "6 min read",
    summary: "Standard VC models in Africa face unique challenges. We explore why the active Venture Studio model provides the operational scaffolding local founders need to survive and scale.",
    content: "Over the last decade, millions of dollars have flowed into African tech startups. However, the mortality rate of early-stage tech ventures remains exceptionally high. The reason isn't a lack of talent or market opportunities. Rather, it is the absolute vacuum of supportive operational structures. Founders are forced to solve everything: legal hurdles, hiring top-tier talent, database configurations, and government relations, all before writing their first line of commercial code. This is where Venture Studios like Metaspace step in. Instead of simply writing checks and sitting in quarterly board meetings, we work on-site, serving as co-founders. Our principal engineers deploy code, our legal teams secure licenses, and our recruiters source stars. By relieving founders of routine operational weights, we increase startup survival rates to over 90%.",
    image: "https://images.unsplash.com/photo-1531538606174-0f90ff5dce83?q=80&w=800"
  },
  {
    id: "post-2",
    title: "Digitizing South-South Nigeria: Opportunities Outside the Lagos Corridor",
    category: "Digital Transformation",
    date: "June 2026",
    author: "Dr. Efe Ogbebo",
    readTime: "8 min read",
    summary: "Lagos is often seen as the sole hub of Nigerian tech. We share our experiences building ecosystems from Benin City and unlocking the massive agricultural and educational opportunities in neighboring states.",
    content: "When investors think of Nigerian technology, they almost exclusively think of Lagos. However, Lagos is becoming heavily saturated, with high talent costs and intense infrastructure congestion. At Metaspace, we chose Benin City, Edo State, as our launchpad. Benin City is structurally positioned as the gateway to Eastern, Western, and Northern Nigeria. Edo State's commitment to civil digitization and civil reforms has created a remarkably fertile environment for software startups. Sectors like agriculture tech, smart educational management (like our venture Ugbekun), and public administration are ripe for modernization. By building tech solutions tailored to secondary cities and rural logistics, we are serving a massive, highly motivated market that the Lagos corridor often ignores.",
    image: "https://images.unsplash.com/photo-1542744094-3a31f103e35f?q=80&w=800"
  },
  {
    id: "post-3",
    title: "Elderly Care and Health-Tech: Bridging the Cultural Gap with Modern Medicine",
    category: "Healthcare Tech",
    date: "May 2026",
    author: "Nosa Osunbor",
    readTime: "5 min read",
    summary: "Healthcare in Africa is traditionally home-bound. Discover how Cyona Medicare combines local cultural preferences with digital health records to provide dignified, certified medical care to seniors.",
    content: "African culture deeply values family care, and nursing home models are culturally discouraged. However, as the younger generation migrates to urban centers or abroad, senior relatives are often left without adequate, structured care. Designing solutions for this sector requires immense cultural empathy. You cannot simply build an 'app' and expect elderly patients to navigate UI. Instead, we built Cyona Medicare. Cyona operates as a hybrid tech-service network. Our technology allows medical practitioners to coordinate visits, keep central encrypted medical records, and monitor heart rates remotely. The patient simply experiences the warmth of a certified local nurse visiting their home, backed by the best digital tools. This is how we utilize technology to reinforce local culture, rather than disrupt it.",
    image: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?q=80&w=800"
  }
];
export const LAGOS_BRIDGE_IMAGE = "https://images.unsplash.com/photo-1599839352727-4c749b5c2253?q=80&w=1200&auto=format&fit=crop";
export const TEAM_MEMBERS = [
  {
    name: "Engr. Osaze Omonbude",
    role: "Managing Director & Co-Founder",
    bio: "Ex-Google Software Architect and local technology advocate with 14+ years building high-availability financial and logistics systems globally.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150"
  },
  {
    name: "Dr. Efe Ogbebo",
    role: "Director of Ecosystems & Strategy",
    bio: "Former development policy advisor with the African Development Bank, specializing in technology infrastructure planning and subnational investment.",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150"
  },
  {
    name: "Nosa Osunbor",
    role: "Principal Venture Designer",
    bio: "Product strategist and researcher, formerly leading UX and operations at regional mobility and digital health scale-ups across West Africa.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150"
  }
];
