import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";

// Define TS interfaces for our store
import { Venture, ServiceOffer, InsightPost, Consultation, ContactInquiry } from "./src/types";

export interface SiteConfig {
  adminPassword?: string;
  logoUrl?: string; // Can be empty or base64 or custom URL
  lagosBridgeUrl?: string; // The hero image
  home_hero_title: string;
  home_hero_subtitle: string;
  home_hero_desc: string;
  about_hero_title: string;
  about_hero_desc: string;
  about_mission_title: string;
  about_mission_text: string;
  what_we_do_title: string;
  what_we_do_desc: string;
  ventures: Venture[];
  services: ServiceOffer[];
  teamMembers: { name: string; role: string; bio: string; avatar: string }[];
  insights: InsightPost[];
  whatsapp_number?: string;
  footer_tagline?: string;
  footer_desc?: string;
  footer_email?: string;
  footer_phone?: string;
  footer_address?: string;
  footer_linkedin?: string;
  footer_twitter?: string;
  footer_facebook?: string;
  footer_instagram?: string;
  footer_quick_links?: { label: string; tab: string }[];
  footer_ventures_links?: { label: string; tab: string }[];
  home_hero_title_color?: string;
  home_hero_title_highlight_color?: string;
}

// Default Seed Data
const DEFAULT_SITE_CONFIG: SiteConfig = {
  adminPassword: "admin", // Default password as requested
  logoUrl: "", // Default empty, falls back to Metaspace vector logo or download.jpg
  lagosBridgeUrl: "https://images.unsplash.com/photo-1599839352727-4c749b5c2253?q=80&w=1200&auto=format&fit=crop",
  home_hero_title_color: "#141b77",
  home_hero_title_highlight_color: "#ef4444",
  whatsapp_number: "+2348123456789",
  footer_tagline: "Building Systems. Empowering People. Transforming Africa.",
  footer_desc: "We design, build and scale innovative ventures and digital solutions that solve real problems and drive sustainable economic transformation across Africa.",
  footer_email: "info@metaspaceconsulting.com",
  footer_phone: "+234 812 345 6789",
  footer_address: "Benin City, Edo State, Nigeria",
  footer_linkedin: "https://linkedin.com/company/metaspace",
  footer_twitter: "https://twitter.com/metaspace",
  footer_facebook: "https://facebook.com/metaspace",
  footer_instagram: "https://instagram.com/metaspace",
  footer_quick_links: [
    { label: "About Us", tab: "about" },
    { label: "What We Do", tab: "what-we-do" },
    { label: "Our Ventures", tab: "ventures" },
    { label: "Insights", tab: "insights" },
    { label: "Contact Us", tab: "contact" }
  ],
  footer_ventures_links: [
    { label: "Ugbekun Platform", tab: "ventures" },
    { label: "Oghowa Accelerator", tab: "ventures" },
    { label: "EduRide Logistics", tab: "ventures" },
    { label: "Cyona Medicare", tab: "ventures" }
  ],
  home_hero_title: "Transforming Africa.",
  home_hero_subtitle: "Building Systems. Empowering People.",
  home_hero_desc: "We design, build and scale innovative ventures and digital solutions that solve real problems and drive sustainable economic transformation across Africa.",
  about_hero_title: "Empowering Innovation, Driving Impact.",
  about_hero_desc: "We are a dedicated venture builder and digital transformation architect driving industrial-strength technology ecosystems.",
  about_mission_title: "Our Core Mission",
  about_mission_text: "Across Africa, the challenge is rarely a lack of ideas or raw entrepreneurial talent. It is the deep friction of execution—regulatory compliance, high software engineering costs, and the absence of proven templates for corporate digital modernization.\n\nMetaspace Consulting was founded to serve as that foundational scaffold. Whether we are co-founding spin-offs like Ugbekun in education or advising public offices on startup policies, our methodologies are rigorous, evidence-based, and focused entirely on measurable, lasting outcomes.",
  what_we_do_title: "Architecting African Technology Infrastructure.",
  what_we_do_desc: "We design and support long-term systems to empower organizations and communities. Explore our 4 main corporate pillars.",
  ventures: [
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
  ],
  services: [
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
  ],
  teamMembers: [
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
  ],
  insights: [
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
  ]
};

// Local JSON File Path fallback
const SITE_CONFIG_PATH = path.join(process.cwd(), "data", "site_config.json");
const CONSULTATIONS_PATH = path.join(process.cwd(), "data", "consultations.json");
const INQUIRIES_PATH = path.join(process.cwd(), "data", "inquiries.json");

// Define consultations and inquiries lists separate or inside the store
interface InFileDB {
  siteConfig: SiteConfig;
  consultations: Consultation[];
  contactInquiries: ContactInquiry[];
}

let mysqlPool: mysql.Pool | null = null;
let useLocalFile = true;

export function isUsingMySQL(): boolean {
  return !useLocalFile;
}

// Helper to check for database settings in environment
const hasMySQLConfig = (): boolean => {
  return !!(
    process.env.DB_HOST ||
    process.env.MYSQL_HOST ||
    process.env.DB_PASSWORD ||
    process.env.MYSQL_PASSWORD
  );
};

// Initialize DB Connection and Tables
export async function initDatabase() {
  if (hasMySQLConfig()) {
    try {
      console.log("MySQL environment variables detected. Attempting connection to external cPanel MySQL...");
      const dbConfig = {
        host: process.env.DB_HOST || process.env.MYSQL_HOST || "localhost",
        user: process.env.DB_USER || process.env.MYSQL_USER || "root",
        password: process.env.DB_PASSWORD || process.env.MYSQL_PASSWORD || "",
        database: process.env.DB_NAME || process.env.MYSQL_DATABASE || "metaspace",
        port: parseInt(process.env.DB_PORT || process.env.MYSQL_PORT || "3306", 10),
        ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : undefined,
      };

      mysqlPool = mysql.createPool(dbConfig);
      
      // Test Connection
      const conn = await mysqlPool.getConnection();
      console.log("Successfully connected to MySQL database!");
      conn.release();
      useLocalFile = false;

      // Migrate Tables
      await runMySQLMigrations();
    } catch (err: any) {
      console.error("Failed to connect to MySQL. Falling back to local persistent JSON file database.", err.message);
      useLocalFile = true;
    }
  } else {
    console.log("No MySQL environment variables detected. Using local persistent JSON file database.");
    useLocalFile = true;
  }

  // Double check data directory exists
  const dataDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // Ensure JSON files exist and are seeded
  if (!fs.existsSync(SITE_CONFIG_PATH)) {
    fs.writeFileSync(SITE_CONFIG_PATH, JSON.stringify(DEFAULT_SITE_CONFIG, null, 2), "utf8");
  }
  if (!fs.existsSync(CONSULTATIONS_PATH)) {
    const initConsults = [
      {
        id: "const-1",
        name: "Dr. Alabi Johnson",
        email: "alabi@edo-health.org",
        organization: "Edo Health Initiative",
        sector: "Healthcare",
        service: "Digital Transformation",
        message: "We want to digitize our primary healthcare operations in rural Edo state and are looking for a technical partner.",
        createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
        status: "scheduled",
      },
      {
        id: "const-2",
        name: "Amarachi Okafor",
        email: "ceo@agrotech-africa.com",
        organization: "AgroTech Africa",
        sector: "Agriculture / Startups",
        service: "Venture Design Studio",
        message: "Interested in incubation through the Oghowa Accelerator for our seed stage supply-chain venture.",
        createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
        status: "pending",
      }
    ];
    fs.writeFileSync(CONSULTATIONS_PATH, JSON.stringify(initConsults, null, 2), "utf8");
  }
  if (!fs.existsSync(INQUIRIES_PATH)) {
    fs.writeFileSync(INQUIRIES_PATH, JSON.stringify([], null, 2), "utf8");
    console.log("Local file-based databases successfully initialized/seeded!");
  }
}

// Migrate MySQL tables
async function runMySQLMigrations() {
  if (!mysqlPool) return;

  console.log("Running MySQL Migrations...");
  try {
    // 1. admin_settings
    await mysqlPool.query(`
      CREATE TABLE IF NOT EXISTS admin_settings (
        setting_key VARCHAR(100) PRIMARY KEY,
        setting_value TEXT NOT NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 2. page_contents
    await mysqlPool.query(`
      CREATE TABLE IF NOT EXISTS page_contents (
        content_key VARCHAR(100) PRIMARY KEY,
        content_value TEXT NOT NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 3. images
    await mysqlPool.query(`
      CREATE TABLE IF NOT EXISTS images (
        image_key VARCHAR(100) PRIMARY KEY,
        image_value LONGTEXT NOT NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 4. consultations
    await mysqlPool.query(`
      CREATE TABLE IF NOT EXISTS consultations (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        organization VARCHAR(255) NULL,
        sector VARCHAR(255) NULL,
        service VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        createdAt VARCHAR(100) NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'pending'
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 5. contact_inquiries
    await mysqlPool.query(`
      CREATE TABLE IF NOT EXISTS contact_inquiries (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        subject VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        createdAt VARCHAR(100) NOT NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Seed defaults in MySQL if empty
    const [rows]: any = await mysqlPool.query("SELECT COUNT(*) as count FROM admin_settings");
    if (rows[0].count === 0) {
      console.log("MySQL database is empty. Seeding default configuration...");
      
      // Seed Admin settings
      await mysqlPool.query("INSERT INTO admin_settings (setting_key, setting_value) VALUES (?, ?)", [
        "adminPassword", DEFAULT_SITE_CONFIG.adminPassword || "admin"
      ]);
      await mysqlPool.query("INSERT INTO admin_settings (setting_key, setting_value) VALUES (?, ?)", [
        "logoUrl", DEFAULT_SITE_CONFIG.logoUrl || ""
      ]);
      await mysqlPool.query("INSERT INTO admin_settings (setting_key, setting_value) VALUES (?, ?)", [
        "lagosBridgeUrl", DEFAULT_SITE_CONFIG.lagosBridgeUrl || ""
      ]);

      // Seed core site config fields
      const keysToSeed = [
        "home_hero_title", "home_hero_subtitle", "home_hero_desc",
        "about_hero_title", "about_hero_desc", "about_mission_title", "about_mission_text",
        "what_we_do_title", "what_we_do_desc",
        "ventures", "services", "teamMembers", "insights"
      ];

      for (const k of keysToSeed) {
        const val = DEFAULT_SITE_CONFIG[k as keyof SiteConfig];
        const strVal = typeof val === "string" ? val : JSON.stringify(val);
        await mysqlPool.query("INSERT INTO page_contents (content_key, content_value) VALUES (?, ?)", [k, strVal]);
      }

      // Seed initial consultations
      const initConsults = [
        {
          id: "const-1",
          name: "Dr. Alabi Johnson",
          email: "alabi@edo-health.org",
          organization: "Edo Health Initiative",
          sector: "Healthcare",
          service: "Digital Transformation",
          message: "We want to digitize our primary healthcare operations in rural Edo state and are looking for a technical partner.",
          createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
          status: "scheduled"
        },
        {
          id: "const-2",
          name: "Amarachi Okafor",
          email: "ceo@agrotech-africa.com",
          organization: "AgroTech Africa",
          sector: "Agriculture / Startups",
          service: "Venture Design Studio",
          message: "Interested in incubation through the Oghowa Accelerator for our seed stage supply-chain venture.",
          createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
          status: "pending"
        }
      ];

      for (const c of initConsults) {
        await mysqlPool.query(
          "INSERT INTO consultations (id, name, email, organization, sector, service, message, createdAt, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [c.id, c.name, c.email, c.organization, c.sector, c.service, c.message, c.createdAt, c.status]
        );
      }
      
      console.log("MySQL successfully populated with default seed data!");
    }
  } catch (err: any) {
    console.error("Error running migrations or seeding database:", err);
  }
}

// Read database file
function readLocalFile(): InFileDB {
  let siteConfig = DEFAULT_SITE_CONFIG;
  let consultations: Consultation[] = [];
  let contactInquiries: ContactInquiry[] = [];

  try {
    if (fs.existsSync(SITE_CONFIG_PATH)) {
      siteConfig = JSON.parse(fs.readFileSync(SITE_CONFIG_PATH, "utf8"));
    }
  } catch (err) {
    console.error("Error reading SITE_CONFIG_PATH file", err);
  }

  try {
    if (fs.existsSync(CONSULTATIONS_PATH)) {
      consultations = JSON.parse(fs.readFileSync(CONSULTATIONS_PATH, "utf8"));
    }
  } catch (err) {
    console.error("Error reading CONSULTATIONS_PATH file", err);
  }

  try {
    if (fs.existsSync(INQUIRIES_PATH)) {
      contactInquiries = JSON.parse(fs.readFileSync(INQUIRIES_PATH, "utf8"));
    }
  } catch (err) {
    console.error("Error reading INQUIRIES_PATH file", err);
  }

  return {
    siteConfig,
    consultations,
    contactInquiries
  };
}

// Write database file
function writeLocalFile(data: InFileDB) {
  try {
    const dataDir = path.dirname(SITE_CONFIG_PATH);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(SITE_CONFIG_PATH, JSON.stringify(data.siteConfig, null, 2), "utf8");
    fs.writeFileSync(CONSULTATIONS_PATH, JSON.stringify(data.consultations, null, 2), "utf8");
    fs.writeFileSync(INQUIRIES_PATH, JSON.stringify(data.contactInquiries, null, 2), "utf8");
  } catch (err) {
    console.error("Error writing JSON db files", err);
  }
}

// API EXPORTS: Get Entire Site Config
export async function getSiteConfig(): Promise<SiteConfig> {
  if (!useLocalFile && mysqlPool) {
    try {
      const config: any = {};
      
      // Get Admin setting keys
      const [settingsRows]: any = await mysqlPool.query("SELECT * FROM admin_settings");
      for (const row of settingsRows) {
        config[row.setting_key] = row.setting_value;
      }

      // Get page contents
      const [contentRows]: any = await mysqlPool.query("SELECT * FROM page_contents");
      for (const row of contentRows) {
        const k = row.content_key;
        const v = row.setting_value || row.content_value;
        try {
          // If it is JSON structured, parse it
          if (v && typeof v === "string" && (v.startsWith("{") || v.startsWith("["))) {
            config[k] = JSON.parse(v);
          } else {
            config[k] = v;
          }
        } catch {
          config[k] = v;
        }
      }

      // Add missing fields from default config to ensure type safety
      return {
        ...DEFAULT_SITE_CONFIG,
        ...config
      };
    } catch (err) {
      console.error("Error fetching site config from MySQL, using local file.", err);
    }
  }

  // Fallback to Local JSON file
  const fileData = readLocalFile();
  return fileData.siteConfig;
}

// API EXPORTS: Update Site Config
export async function updateSiteConfig(updates: Partial<SiteConfig>): Promise<SiteConfig> {
  if (!useLocalFile && mysqlPool) {
    try {
      for (const [key, value] of Object.entries(updates)) {
        const valStr = typeof value === "string" ? value : JSON.stringify(value);
        
        if (key === "adminPassword" || key === "logoUrl" || key === "lagosBridgeUrl") {
          // Upsert in admin_settings
          await mysqlPool.query(
            "INSERT INTO admin_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?",
            [key, valStr, valStr]
          );
        } else {
          // Upsert in page_contents
          await mysqlPool.query(
            "INSERT INTO page_contents (content_key, content_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE content_value = ?",
            [key, valStr, valStr]
          );
        }
      }
      return getSiteConfig();
    } catch (err) {
      console.error("Error updating MySQL Site Config:", err);
    }
  }

  // Update in Local File
  const fileData = readLocalFile();
  fileData.siteConfig = {
    ...fileData.siteConfig,
    ...updates
  };
  writeLocalFile(fileData);
  return fileData.siteConfig;
}

// API EXPORTS: Get consultations
export async function getConsultations(): Promise<Consultation[]> {
  if (!useLocalFile && mysqlPool) {
    try {
      const [rows]: any = await mysqlPool.query("SELECT * FROM consultations ORDER BY createdAt DESC");
      return rows.map((r: any) => ({
        ...r,
        status: r.status as "pending" | "scheduled" | "completed"
      }));
    } catch (err) {
      console.error("Error reading MySQL consultations:", err);
    }
  }

  // Local File Fallback
  return readLocalFile().consultations;
}

// API EXPORTS: Add consultation
export async function addConsultation(c: Consultation): Promise<Consultation> {
  if (!useLocalFile && mysqlPool) {
    try {
      await mysqlPool.query(
        "INSERT INTO consultations (id, name, email, organization, sector, service, message, createdAt, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [c.id, c.name, c.email, c.organization, c.sector, c.service, c.message, c.createdAt, c.status]
      );
      return c;
    } catch (err) {
      console.error("Error saving consultation to MySQL:", err);
    }
  }

  // Local File
  const fileData = readLocalFile();
  fileData.consultations.push(c);
  writeLocalFile(fileData);
  return c;
}

// API EXPORTS: Update consultation status
export async function updateConsultationStatus(id: string, status: "pending" | "scheduled" | "completed"): Promise<boolean> {
  if (!useLocalFile && mysqlPool) {
    try {
      await mysqlPool.query("UPDATE consultations SET status = ? WHERE id = ?", [status, id]);
      return true;
    } catch (err) {
      console.error("Error updating consultation status in MySQL:", err);
    }
  }

  // Local File
  const fileData = readLocalFile();
  const c = fileData.consultations.find(item => item.id === id);
  if (c) {
    c.status = status;
    writeLocalFile(fileData);
    return true;
  }
  return false;
}

// API EXPORTS: Delete consultation
export async function deleteConsultation(id: string): Promise<boolean> {
  if (!useLocalFile && mysqlPool) {
    try {
      await mysqlPool.query("DELETE FROM consultations WHERE id = ?", [id]);
      return true;
    } catch (err) {
      console.error("Error deleting consultation from MySQL:", err);
    }
  }

  // Local File
  const fileData = readLocalFile();
  const initialLen = fileData.consultations.length;
  fileData.consultations = fileData.consultations.filter(item => item.id !== id);
  if (fileData.consultations.length !== initialLen) {
    writeLocalFile(fileData);
    return true;
  }
  return false;
}

// API EXPORTS: Get Contact Inquiries
export async function getContactInquiries(): Promise<ContactInquiry[]> {
  if (!useLocalFile && mysqlPool) {
    try {
      const [rows]: any = await mysqlPool.query("SELECT * FROM contact_inquiries ORDER BY createdAt DESC");
      return rows;
    } catch (err) {
      console.error("Error reading MySQL inquiries:", err);
    }
  }

  // Local File
  return readLocalFile().contactInquiries;
}

// API EXPORTS: Add Contact Inquiry
export async function addContactInquiry(inq: ContactInquiry): Promise<ContactInquiry> {
  if (!useLocalFile && mysqlPool) {
    try {
      await mysqlPool.query(
        "INSERT INTO contact_inquiries (id, name, email, subject, message, createdAt) VALUES (?, ?, ?, ?, ?, ?)",
        [inq.id, inq.name, inq.email, inq.subject, inq.message, inq.createdAt]
      );
      return inq;
    } catch (err) {
      console.error("Error saving inquiry to MySQL:", err);
    }
  }

  // Local File
  const fileData = readLocalFile();
  fileData.contactInquiries.push(inq);
  writeLocalFile(fileData);
  return inq;
}

// API EXPORTS: Delete Contact Inquiry
export async function deleteContactInquiry(id: string): Promise<boolean> {
  if (!useLocalFile && mysqlPool) {
    try {
      await mysqlPool.query("DELETE FROM contact_inquiries WHERE id = ?", [id]);
      return true;
    } catch (err) {
      console.error("Error deleting inquiry from MySQL:", err);
    }
  }

  // Local File
  const fileData = readLocalFile();
  const initialLen = fileData.contactInquiries.length;
  fileData.contactInquiries = fileData.contactInquiries.filter(item => item.id !== id);
  if (fileData.contactInquiries.length !== initialLen) {
    writeLocalFile(fileData);
    return true;
  }
  return false;
}
