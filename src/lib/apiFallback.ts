// Transparent Client-Side Fallback & Offline-First API Engine
// This guarantees the app is completely functional, interactive and editable 
// even on static shared cPanel environments that do not support Node.js.

const DEFAULT_CONFIG = {
  adminPassword: "admin",
  logoUrl: "",
  lagosBridgeUrl: "https://images.unsplash.com/photo-1599839352727-4c749b5c2253?q=80&w=1200&auto=format&fit=crop",
  home_hero_title: "Transforming Africa.",
  home_hero_title_color: "#141b77",
  home_hero_title_highlight_color: "#ef4444",
  home_hero_subtitle: "Building Systems. Empowering People.",
  home_hero_desc: "We design, build and scale innovative ventures and digital solutions that solve real problems and drive sustainable economic transformation across Africa.",
  about_hero_title: "Empowering Innovation, Driving Impact.",
  about_hero_desc: "We are a dedicated venture builder and digital transformation architect driving industrial-strength technology ecosystems.",
  about_mission_title: "Our Core Mission",
  about_mission_text: "Across Africa, the challenge is rarely a lack of ideas or raw entrepreneurial talent. It is the deep friction of execution—regulatory compliance, high software engineering costs, and the absence of proven templates for corporate digital modernization.\n\nMetaspace Consulting was founded to serve as that foundational scaffold. Whether we are co-founding spin-offs like Ugbekun in education or advising public offices on startup policies, our methodologies are rigorous, evidence-based, and focused entirely on measurable, lasting outcomes.",
  what_we_do_title: "Architecting African Technology Infrastructure.",
  what_we_do_desc: "We design and support long-term systems to empower organizations and communities. Explore our 4 main corporate pillars.",
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
    { label: "MetaGen Project", tab: "ventures" },
    { label: "Ugbekun Platform", tab: "ventures" },
    { label: "Oghowa Accelerator", tab: "ventures" },
    { label: "MyEduRide Logistics", tab: "ventures" },
    { label: "Cyona Medicare", tab: "ventures" }
  ],
  ventures: [
    {
      id: "metagen",
      name: "MetaGen Project",
      tagline: "Empowering Digital Leaders & Transformative Education",
      description: "An initiative of Metaspace Consult promoting digital transformation for School Administrators, Teachers, and Students to cultivate the digital leaders of tomorrow.",
      fullDetails: "Welcome to the MetaGen Project, an initiative of Metaspace Consult, a leading digital transformation company in Nigeria. At MetaGen Project, we promote a digital transformative experience designed to empower the digital leaders of tomorrow in this digital age.\n\nWith a focus on empowering educators and students, we provide a comprehensive suite of digital tools and ongoing support services designed to enhance teaching and learning experiences, foster collaboration, and drive student achievement.",
      iconName: "sparkles",
      color: "from-purple-600 to-indigo-800",
      url: "https://www.metaspaceconsult.com/metagen",
      stats: [
        { label: "Won Awards", value: "3x" },
        { label: "Schools Reached", value: "100+" },
        { label: "Students Trained", value: "1,000+" },
        { label: "Programs & Trainings", value: "50+" }
      ],
      impactPoints: [
        "Comprehensive digital human capital development for teachers, students, and administrators.",
        "Customized digital tools and support services tailored for Nigerian educational ecosystems.",
        "Fostering digital culture, equitable access to resources, and enhanced collaboration."
      ],
      founderQuote: "MetaGen Project equips educators and students with the knowledge, skills, and mindset to lead Africa's digital transformation."
    },
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
        { label: "Mentors Active", value: "35+" },
        { label: "Total Seed Raised", value: "$1.8M" }
      ],
      impactPoints: [
        "Interactive workshops covering technology architecture, taxation, and cap table design.",
        "Lifetime integration into the global South-South startup development network.",
        "Dedicated workspace and high-speed internet resources at our partner technology parks."
      ],
      founderQuote: "Oghowa is more than an incubator. It's an engine co-creating the next generation of African unicorns right from the grassroots."
    },
    {
      id: "eduride",
      name: "EduRide",
      tagline: "Eco-Friendly Campus Logistics",
      description: "A micro-mobility and ride-sharing service optimizing daily commutes and campus transit for students and academic staff using low-carbon light vehicles and proprietary routing software.",
      fullDetails: "EduRide tackles the severe logistics and transportation friction on expanding university campuses and tech hubs. By utilizing tracked, fuel-efficient light vehicles and an on-demand routing app, we cut commute times by 50% and keep campus logistics safe, cheap, and environment-friendly. The app features digital ticketing and offline ride authentication to fit low-connectivity environments.",
      iconName: "bus",
      color: "from-amber-600 to-orange-700",
      stats: [
        { label: "Active Commuters", value: "5,500+" },
        { label: "Rides Completed", value: "82,000+" },
        { label: "Carbon Saved", value: "14 Tons" }
      ],
      impactPoints: [
        "On-demand dispatching algorithms maximizing route utilization.",
        "Highly competitive cashless commuter subscriptions.",
        "Student driver employment program empowering campus youth."
      ],
      founderQuote: "EduRide ensures students and faculty get to their classes on-time and cost-effectively, fueling educational productivity."
    },
    {
      id: "cyona",
      name: "Cyona Medicare",
      tagline: "24/7 Tele-Triage & Eldercare",
      description: "A tailored health-tech ecosystem delivering emergency tele-triage, medical record management, and specialized home nurse visits directly to senior citizens and families.",
      fullDetails: "Cyona Medicare was founded to support Africa's aging population with clinical precision. Through emergency dial-in hotlines and smart tele-triage platforms, we match senior citizens with registered local healthcare practitioners. For households needing ongoing assistance, Cyona handles recurring physical doctor visits and maintains full, tamperproof digital health records.",
      iconName: "heart",
      color: "from-teal-600 to-emerald-700",
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
      shortDesc: "We advise sovereign leadership, corporations, and startups on technology regulations and operational strategy.",
      longDesc: "Policy, technology, and commercial outcomes are deeply intertwined. We analyze markets and compile intelligence reports to help governments implement robust tech policies and corporates identify expansion frameworks.",
      keyFeatures: [
        "National and regional startup act design and legal consulting.",
        "Deep tech landscape research and policy brief compilations.",
        "Corporate venture capital (CVC) setup and fund deployment advisory.",
        "Operational process scaling frameworks."
      ],
      caseStudy: {
        title: "Startup Act Consultation",
        description: "Provided strategic briefs and drafting committees with data supporting sovereign startup legislations, streamlining registration processes.",
        metric: "Policy Draft Supported"
      }
    }
  ]
};

function ensureConfigIntegrity(config: any): any {
  if (!config || typeof config !== "object") return DEFAULT_CONFIG;
  const merged = { ...DEFAULT_CONFIG, ...config };

  const defaultUrls: Record<string, string> = {
    metagen: "https://www.metaspaceconsult.com/metagen",
    ugbekun: "https://www.metaspaceconsult.com/ugbekun",
    oghowa: "https://www.metaspaceconsult.com/oghowa",
    eduride: "https://www.myeduride.com",
    cyona: "https://www.cynonamediccare.com"
  };

  if (Array.isArray(merged.ventures)) {
    const hasMetagen = merged.ventures.some(v => v && (v.id === 'metagen' || (v.name && v.name.toLowerCase().includes('metagen'))));
    if (!hasMetagen) {
      merged.ventures = [DEFAULT_CONFIG.ventures[0], ...merged.ventures];
    } else {
      merged.ventures = merged.ventures.map(v => {
        if (!v) return v;
        if (v.id === 'metagen' || (v.name && v.name.toLowerCase().includes('metagen'))) {
          return { ...DEFAULT_CONFIG.ventures[0], ...v, url: v.url || DEFAULT_CONFIG.ventures[0].url };
        }
        return v;
      });
    }

    // Ensure all ventures have official URLs and complete properties
    merged.ventures = merged.ventures.map((v: any) => {
      if (!v) return v;
      const fallbackUrl = defaultUrls[v.id] || "https://www.metaspaceconsult.com";
      return {
        ...v,
        url: v.url && v.url.trim() !== "" ? v.url : fallbackUrl
      };
    });
  } else {
    merged.ventures = DEFAULT_CONFIG.ventures;
  }

  if (Array.isArray(merged.footer_ventures_links)) {
    const hasMetagenLink = merged.footer_ventures_links.some(l => l && l.label && l.label.toLowerCase().includes('metagen'));
    if (!hasMetagenLink) {
      merged.footer_ventures_links = [
        { label: "MetaGen Project", tab: "ventures" },
        ...merged.footer_ventures_links
      ];
    }
  } else {
    merged.footer_ventures_links = DEFAULT_CONFIG.footer_ventures_links;
  }

  return merged;
}

// Initialize localStorage if needed
function getLocalConfig() {
  const local = localStorage.getItem("metaspace_site_config");
  if (!local) {
    localStorage.setItem("metaspace_site_config", JSON.stringify(DEFAULT_CONFIG));
    return DEFAULT_CONFIG;
  }
  try {
    const parsed = JSON.parse(local);
    const verified = ensureConfigIntegrity(parsed);
    localStorage.setItem("metaspace_site_config", JSON.stringify(verified));
    return verified;
  } catch (err) {
    localStorage.setItem("metaspace_site_config", JSON.stringify(DEFAULT_CONFIG));
    return DEFAULT_CONFIG;
  }
}

function saveLocalConfig(config: any) {
  localStorage.setItem("metaspace_site_config", JSON.stringify(config));
}

// ---------------- API INTERCEPT WRAPPERS ----------------

export async function apiFetchSiteConfig(): Promise<any> {
  try {
    const res = await fetch("/api/site-config");
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn("Server API site-config failed. Using Client-side fallback.");
  }
  return getLocalConfig();
}

export async function apiSaveSiteConfig(updates: any): Promise<boolean> {
  // 1. Try to sync with Server first
  try {
    const pwd = localStorage.getItem("metaspace_admin_password") || "admin";
    const res = await fetch("/api/admin/site-config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        password: pwd,
        updates
      })
    });
    if (res.ok) {
      // Keep local storage in sync as well
      const local = getLocalConfig();
      saveLocalConfig({ ...local, ...updates });
      return true;
    }
  } catch (err) {
    console.warn("Server API save-config failed. Saving client-side in localStorage.");
  }

  // 2. Save local-only if offline/cPanel static
  const local = getLocalConfig();
  const merged = { ...local, ...updates };
  saveLocalConfig(merged);
  return true;
}

export async function apiLoginAdmin(usernameOrPassword: string, passwordInput?: string): Promise<{ success: boolean; token?: string; username?: string; isSuperadmin?: boolean; error?: string }> {
  const username = passwordInput !== undefined ? usernameOrPassword : "superadmin";
  const password = passwordInput !== undefined ? passwordInput : usernameOrPassword;

  try {
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });
    if (res.ok) {
      const data = await res.json();
      return { 
        success: true, 
        token: data.token,
        username: data.user?.username || username,
        isSuperadmin: data.user?.isSuperadmin ?? true
      };
    } else {
      const data = await res.json();
      return { success: false, error: data.error };
    }
  } catch (err) {
    console.warn("Server API admin login failed. Validating client-side.");
    // Fallback comparison
    const config = getLocalConfig();
    const actualPassword = config.adminPassword || "admin";
    
    // Check superadmin/admin fallback
    const admins = config.adminUsernames || [
      { username: "superadmin", password: actualPassword, isSuperadmin: true },
      { username: "admin", password: actualPassword, isSuperadmin: true }
    ];

    const foundAdmin = admins.find(a => 
      a.username.toLowerCase() === username.toLowerCase() && (a.password === password || password === actualPassword)
    );

    if (foundAdmin || password === actualPassword) {
      return { 
        success: true, 
        token: "mock-client-token-" + Date.now(),
        username: foundAdmin?.username || username || "superadmin",
        isSuperadmin: foundAdmin?.isSuperadmin ?? true
      };
    } else {
      return { success: false, error: "Incorrect admin credentials." };
    }
  }
}

export async function apiFetchAdminUsers(password: string): Promise<{ username: string; isSuperadmin: boolean }[]> {
  try {
    const res = await fetch("/api/admin/users", {
      headers: { "x-admin-password": password }
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn("Fetch admin users failed, fallback to local.");
  }
  const config = getLocalConfig();
  return (config.adminUsernames || [
    { username: "superadmin", isSuperadmin: true },
    { username: "admin", isSuperadmin: true }
  ]).map(a => ({ username: a.username, isSuperadmin: Boolean(a.isSuperadmin) }));
}

export async function apiAddAdminUser(password: string, newAdmin: { username: string; password?: string; isSuperadmin: boolean }): Promise<{ success: boolean; users?: any[]; error?: string }> {
  try {
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, ...newAdmin })
    });
    if (res.ok) {
      const data = await res.json();
      return { success: true, users: data.users };
    } else {
      const data = await res.json();
      return { success: false, error: data.error };
    }
  } catch (e: any) {
    const config = getLocalConfig();
    const admins = config.adminUsernames || [
      { username: "superadmin", password: "admin", isSuperadmin: true },
      { username: "admin", password: "admin", isSuperadmin: true }
    ];
    const idx = admins.findIndex(a => a.username.toLowerCase() === newAdmin.username.toLowerCase());
    if (idx >= 0) {
      admins[idx] = { ...admins[idx], ...newAdmin };
    } else {
      admins.push(newAdmin);
    }
    saveLocalConfig({ ...config, adminUsernames: admins });
    return { success: true, users: admins.map(a => ({ username: a.username, isSuperadmin: Boolean(a.isSuperadmin) })) };
  }
}

export async function apiDeleteAdminUser(password: string, targetUsername: string): Promise<{ success: boolean; users?: any[]; error?: string }> {
  try {
    const res = await fetch(`/api/admin/users/${encodeURIComponent(targetUsername)}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password })
    });
    if (res.ok) {
      const data = await res.json();
      return { success: true, users: data.users };
    } else {
      const data = await res.json();
      return { success: false, error: data.error };
    }
  } catch (e: any) {
    const config = getLocalConfig();
    let admins = config.adminUsernames || [
      { username: "superadmin", password: "admin", isSuperadmin: true },
      { username: "admin", password: "admin", isSuperadmin: true }
    ];
    admins = admins.filter(a => a.username.toLowerCase() !== targetUsername.toLowerCase());
    saveLocalConfig({ ...config, adminUsernames: admins });
    return { success: true, users: admins.map(a => ({ username: a.username, isSuperadmin: Boolean(a.isSuperadmin) })) };
  }
}

export async function apiFetchConsultations(): Promise<any[]> {
  try {
    const res = await fetch("/api/consultations");
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn("Server consultations fetch failed. Falling back to local ledger.");
  }
  const local = localStorage.getItem("metaspace_consultations");
  return local ? JSON.parse(local) : [];
}

export async function apiCreateConsultation(booking: any): Promise<boolean> {
  try {
    const res = await fetch("/api/consultations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(booking)
    });
    if (res.ok) {
      return true;
    }
  } catch (err) {
    console.warn("Server save consultation failed. Saving to local storage ledger.");
  }

  // Fallback to localStorage
  const current = localStorage.getItem("metaspace_consultations");
  const list = current ? JSON.parse(current) : [];
  list.unshift({
    id: "ref-" + Math.floor(100000 + Math.random() * 900000),
    ...booking,
    createdAt: new Date().toISOString(),
    status: "pending"
  });
  localStorage.setItem("metaspace_consultations", JSON.stringify(list));
  return true;
}

export async function apiFetchInquiries(): Promise<any[]> {
  try {
    const res = await fetch("/api/contact");
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn("Server contact inquiries fetch failed. Falling back to local ledger.");
  }
  const local = localStorage.getItem("metaspace_contact_inquiries");
  return local ? JSON.parse(local) : [];
}

export async function apiCreateInquiry(inquiry: any): Promise<boolean> {
  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(inquiry)
    });
    if (res.ok) {
      return true;
    }
  } catch (err) {
    console.warn("Server save contact inquiry failed. Saving to local storage ledger.");
  }

  // Fallback to localStorage
  const current = localStorage.getItem("metaspace_contact_inquiries");
  const list = current ? JSON.parse(current) : [];
  list.unshift({
    id: "inq-" + Math.random().toString(36).substr(2, 9),
    ...inquiry,
    createdAt: new Date().toISOString()
  });
  localStorage.setItem("metaspace_contact_inquiries", JSON.stringify(list));
  return true;
}

export async function apiSendChatMsg(message: string, history: any[]): Promise<string> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, history }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      return data.text;
    }
  } catch (err) {
    console.warn("Server Chat endpoint failed or timed out. Formulating instant local response.");
  }

  // Client-Side Intelligent Response System (Matches exact Metaspace profile data!)
  const msg = message.toLowerCase();
  
  if (msg.includes("ugbekun") || msg.includes("school") || msg.includes("student")) {
    return "Ugbekun is our flagship smart school management system. It integrates school accounts, payment tracking, parent portals, and student reports. It manages 12,000+ students across 45+ schools, automating cashless transactions securely. If you want a live demo, we would love to configure a custom portal for your institution!";
  }
  
  if (msg.includes("oghowa") || msg.includes("accelerator") || msg.includes("incub") || msg.includes("cohort")) {
    return "Oghowa Accelerator is our South-South tech seedbed. Over 12-week cohorts, startups receive expert software advisory, legal structure design, and investor pitches. Our cohorts have raised over $1.8M and graduated 24 top-tier regional ventures. Applications run bi-annually; let us know if you want to apply!";
  }
  
  if (msg.includes("eduride") || msg.includes("commute") || msg.includes("transit") || msg.includes("transport")) {
    return "EduRide is our high-efficiency micro-logistics platform for university campuses. Operating eco-friendly commuter transport and low-carbon light vehicles, it manages 5,500+ daily riders. It leverages proprietary smart routing algorithms to reduce student transit time by 50%.";
  }
  
  if (msg.includes("cyona") || msg.includes("medical") || msg.includes("health") || msg.includes("parent") || msg.includes("elder")) {
    return "Cyona Medicare is our specialized eldercare and emergency tele-health platform. We provide 24/7 dedicated dispatch services, professional home-nurse routing, and electronic medical record hosting, ensuring your loved ones are tracked by clinical professionals at all times.";
  }

  if (msg.includes("consult") || msg.includes("book") || msg.includes("appointment") || msg.includes("meet")) {
    return "To book a consultation session with our lead system architects, click the 'Book Consultation' button in our header navigation. You can fill out your contact details and topic, and our coordinators will verify and sync it instantly.";
  }

  if (msg.includes("service") || msg.includes("do you do") || msg.includes("capabilities")) {
    return "Metaspace operates across 4 central pillars: 1) Venture Design Studio (building spin-offs from MVP to scale), 2) Digital Transformation (modernizing enterprise/legacy setups), 3) Innovation Ecosystem Builder (accelerators & technology hubs), and 4) Strategy & Advisory. What specific pillar can I details for you?";
  }

  if (msg.includes("contact") || msg.includes("location") || msg.includes("address") || msg.includes("phone") || msg.includes("email")) {
    return "You can email us at info@metaspaceconsulting.com, call us on +234 812 345 6789, or visit our primary offices in Benin City, Edo State, Nigeria. We also have a responsive WhatsApp helpdesk if you'd like a direct chat link!";
  }

  if (msg.includes("hello") || msg.includes("hi ") || msg.includes("hey")) {
    return "Greetings! I'm Metaspace Companion. I can give you detailed metrics about our spin-offs (Ugbekun, Oghowa Accelerator, EduRide, Cyona), guide you through scheduling consultations, or connect you directly with our Benin City leadership team. How is your day going?";
  }

  return "Thank you for asking! Metaspace Consulting Limited is a venture builder and corporate digital architect based in Benin City, Nigeria. I can details our platforms (Ugbekun, Oghowa, EduRide, Cyona) or corporate service capabilities. Feel free to type in your question, or tap our WhatsApp helpdesk for direct support.";
}
