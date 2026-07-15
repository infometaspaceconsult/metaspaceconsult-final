import React, { useState, useEffect } from "react";
import { 
  ArrowRight, BookOpen, Rocket, Bus, Heart, Globe, Cpu, Network, Award, 
  MapPin, Phone, Mail, CheckCircle, Sparkles, Send, ShieldCheck, HelpCircle, 
  ChevronRight, Calendar, ArrowUpRight, MessageSquare, GraduationCap, Clock, User,
  Users, TrendingUp
} from "lucide-react";
import { TabType, Venture, ServiceOffer, InsightPost } from "./types";
import { VENTURES_DATA, SERVICES_DATA, INSIGHTS_DATA, LAGOS_BRIDGE_IMAGE, TEAM_MEMBERS } from "./data";
import { apiFetchSiteConfig, apiCreateInquiry } from "./lib/apiFallback";
import Header from "./components/Header";
import Footer from "./components/Footer";
import GeminiAssistant from "./components/GeminiAssistant";
import ConsultationForm from "./components/ConsultationForm";
import VentureDetail from "./components/VentureDetail";
import AdminDashboard from "./components/AdminDashboard";
import { Preloader } from "./components/Preloader";

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>("home");
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isTabLoading, setIsTabLoading] = useState(false);
  const [targetTab, setTargetTab] = useState<TabType | null>(null);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [preselectedService, setPreselectedService] = useState("Venture Design Studio");
  const [selectedVenture, setSelectedVenture] = useState<Venture | null>(null);
  const [expandedPost, setExpandedPost] = useState<InsightPost | null>(null);

  // Dynamic Site Layout & Content State Hooks
  const [ventures, setVentures] = useState<Venture[]>(VENTURES_DATA);
  const [services, setServices] = useState<ServiceOffer[]>(SERVICES_DATA);
  const [teamMembers, setTeamMembers] = useState<any[]>(TEAM_MEMBERS);
  const [insights, setInsights] = useState<InsightPost[]>(INSIGHTS_DATA);
  const [logoUrl, setLogoUrl] = useState<string>("");
  const [lagosBridgeUrl, setLagosBridgeUrl] = useState<string>(LAGOS_BRIDGE_IMAGE);

  const [homeHeroTitle, setHomeHeroTitle] = useState("Transforming Africa.");
  const [homeHeroTitleColor, setHomeHeroTitleColor] = useState("#141b77");
  const [homeHeroTitleHighlightColor, setHomeHeroTitleHighlightColor] = useState("#ef4444");
  const [homeHeroSubtitle, setHomeHeroSubtitle] = useState("Building Systems. Empowering People.");
  const [homeHeroDesc, setHomeHeroDesc] = useState("We design, build and scale innovative ventures and digital solutions that solve real problems and drive sustainable economic transformation across Africa.");
  const [aboutHeroTitle, setAboutHeroTitle] = useState("Empowering Innovation, Driving Impact.");
  const [aboutHeroDesc, setAboutHeroDesc] = useState("We are a dedicated venture builder and digital transformation architect driving industrial-strength technology ecosystems.");
  const [aboutMissionTitle, setAboutMissionTitle] = useState("Our Core Mission");
  const [aboutMissionText, setAboutMissionText] = useState("Across Africa, the challenge is rarely a lack of ideas or raw entrepreneurial talent. It is the deep friction of execution—regulatory compliance, high software engineering costs, and the absence of proven templates for corporate digital modernization.\n\nMetaspace Consulting was founded to serve as that foundational scaffold. Whether we are co-founding spin-offs like Ugbekun in education or advising public offices on startup policies, our methodologies are rigorous, evidence-based, and focused entirely on measurable, lasting outcomes.");
  const [whatWeDoTitle, setWhatWeDoTitle] = useState("Architecting African Technology Infrastructure.");
  const [whatWeDoDesc, setWhatWeDoDesc] = useState("We design and support long-term systems to empower organizations and communities. Explore our 4 main corporate pillars.");

  // WhatsApp & Footer dynamic settings
  const [whatsappNumber, setWhatsappNumber] = useState("+2348123456789");
  const [footerTagline, setFooterTagline] = useState("Building Systems. Empowering People. Transforming Africa.");
  const [footerDesc, setFooterDesc] = useState("We design, build and scale innovative ventures and digital solutions that solve real problems and drive sustainable economic transformation across Africa.");
  const [footerEmail, setFooterEmail] = useState("info@metaspaceconsulting.com");
  const [footerPhone, setFooterPhone] = useState("+234 812 345 6789");
  const [footerAddress, setFooterAddress] = useState("Benin City, Edo State, Nigeria");
  const [footerLinkedin, setFooterLinkedin] = useState("https://linkedin.com/company/metaspace");
  const [footerTwitter, setFooterTwitter] = useState("https://twitter.com/metaspace");
  const [footerFacebook, setFooterFacebook] = useState("https://facebook.com/metaspace");
  const [footerInstagram, setFooterInstagram] = useState("https://instagram.com/metaspace");
  const [footerQuickLinks, setFooterQuickLinks] = useState<{ label: string; tab: string }[]>([]);
  const [footerVenturesLinks, setFooterVenturesLinks] = useState<{ label: string; tab: string }[]>([]);

  const loadSiteConfig = async () => {
    try {
      const d = await apiFetchSiteConfig();
      if (d) {
        if (d.ventures) setVentures(d.ventures);
        if (d.services) setServices(d.services);
        if (d.teamMembers) setTeamMembers(d.teamMembers);
        if (d.insights) setInsights(d.insights);
        if (d.logoUrl !== undefined) setLogoUrl(d.logoUrl);
        if (d.lagosBridgeUrl) setLagosBridgeUrl(d.lagosBridgeUrl);

        if (d.home_hero_title) setHomeHeroTitle(d.home_hero_title);
        if (d.home_hero_title_color) setHomeHeroTitleColor(d.home_hero_title_color);
        if (d.home_hero_title_highlight_color) setHomeHeroTitleHighlightColor(d.home_hero_title_highlight_color);
        if (d.home_hero_subtitle) setHomeHeroSubtitle(d.home_hero_subtitle);
        if (d.home_hero_desc) setHomeHeroDesc(d.home_hero_desc);
        if (d.about_hero_title) setAboutHeroTitle(d.about_hero_title);
        if (d.about_hero_desc) setAboutHeroDesc(d.about_hero_desc);
        if (d.about_mission_title) setAboutMissionTitle(d.about_mission_title);
        if (d.about_mission_text) setAboutMissionText(d.about_mission_text);
        if (d.what_we_do_title) setWhatWeDoTitle(d.what_we_do_title);
        if (d.what_we_do_desc) setWhatWeDoDesc(d.what_we_do_desc);

        if (d.whatsapp_number) setWhatsappNumber(d.whatsapp_number);
        if (d.footer_tagline) setFooterTagline(d.footer_tagline);
        if (d.footer_desc) setFooterDesc(d.footer_desc);
        if (d.footer_email) setFooterEmail(d.footer_email);
        if (d.footer_phone) setFooterPhone(d.footer_phone);
        if (d.footer_address) setFooterAddress(d.footer_address);
        if (d.footer_linkedin) setFooterLinkedin(d.footer_linkedin);
        if (d.footer_twitter) setFooterTwitter(d.footer_twitter);
        if (d.footer_facebook) setFooterFacebook(d.footer_facebook);
        if (d.footer_instagram) setFooterInstagram(d.footer_instagram);
        if (d.footer_quick_links) setFooterQuickLinks(d.footer_quick_links);
        if (d.footer_ventures_links) setFooterVenturesLinks(d.footer_ventures_links);
      }
    } catch (err) {
      console.error("Failed to load site configurations", err);
    }
  };

  useEffect(() => {
    loadSiteConfig();
  }, []);

  const handleTabChange = (tab: TabType) => {
    if (tab === currentTab) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setTargetTab(tab);
    setIsTabLoading(true);
  };

  const handleTabTransitionComplete = () => {
    if (targetTab) {
      setCurrentTab(targetTab);
      window.scrollTo({ top: 0, behavior: "smooth" });
      if (currentTab === "admin" && targetTab !== "admin") {
        loadSiteConfig();
      }
    }
    setIsTabLoading(false);
  };

  // Standard Contact form state
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactSubject, setContactSubject] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);
  const [contactError, setContactError] = useState("");

  const handleBookClick = (serviceName: string = "Venture Design Studio") => {
    setPreselectedService(serviceName);
    setIsBookModalOpen(true);
  };

  const handleVentureLearnMore = (v: Venture) => {
    setSelectedVenture(v);
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactEmail.trim() || !contactSubject.trim() || !contactMessage.trim()) {
      setContactError("All fields are required.");
      return;
    }

    setIsSubmittingContact(true);
    setContactError("");

    try {
      const success = await apiCreateInquiry({
        name: contactName,
        email: contactEmail,
        subject: contactSubject,
        message: contactMessage
      });

      if (!success) {
        throw new Error("Failed to submit inquiry.");
      }

      setContactSuccess(true);
      setContactName("");
      setContactEmail("");
      setContactSubject("");
      setContactMessage("");
    } catch (err: any) {
      setContactError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmittingContact(false);
    }
  };

  // Helper to map ServiceOffer iconName to Lucide components
  const getServiceIcon = (name: string, size = 20, className = "text-brand-crimson") => {
    switch (name) {
      case "studio":
        return <Cpu size={size} className={className} />;
      case "transform":
        return <Cpu size={size} className={className} />;
      case "ecosystem":
        return <Network size={size} className={className} />;
      case "advisory":
        return <Award size={size} className={className} />;
      default:
        return <Sparkles size={size} className={className} />;
    }
  };

  // Helper to map Venture iconName to Lucide components
  const getVentureIcon = (name: string, size = 18, className = "text-white") => {
    switch (name) {
      case "school":
        return <GraduationCap size={size} className={className} />;
      case "rocket":
        return <Rocket size={size} className={className} />;
      case "bus":
        return <Bus size={size} className={className} />;
      case "heart":
        return <Heart size={size} className={className} />;
      default:
        return <Sparkles size={size} className={className} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FCFDFE] text-gray-800 pb-16 md:pb-0 selection:bg-brand-crimson/10 selection:text-brand-crimson">
      {isInitialLoading && (
        <Preloader logoUrl={logoUrl} onComplete={() => setIsInitialLoading(false)} />
      )}

      {isTabLoading && (
        <Preloader logoUrl={logoUrl} isTabTransition={true} onComplete={handleTabTransitionComplete} />
      )}

      <Header 
        currentTab={currentTab} 
        setCurrentTab={handleTabChange} 
        onBookClick={() => handleBookClick()} 
        logoUrl={logoUrl}
      />

      {/* Main viewport */}
      <main className="flex-1">
        
        {/* TAB 1: HOME PAGE */}
        {currentTab === "home" && (
          <div className="space-y-16 animate-in fade-in duration-300">
            
            {/* HERO SECTION - Lekki-Ikoyi Link Bridge shown on right */}
            <section className="relative overflow-hidden bg-gradient-to-br from-white via-gray-50/50 to-blue-50/20 pt-10 pb-16 md:py-20 lg:py-24">
              <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                  
                  {/* Left Hero Text Content */}
                  <div className="lg:col-span-7 space-y-6 text-left">
                    <div className="inline-flex items-center space-x-2 bg-red-50 px-3 py-1.5 rounded-full border border-red-100">
                      <span className="w-2 h-2 bg-brand-crimson rounded-full animate-pulse" />
                      <span className="font-display font-bold text-[10px] sm:text-xs uppercase tracking-widest text-brand-crimson">
                        {homeHeroSubtitle}
                      </span>
                    </div>

                    <h1 
                      style={{ color: homeHeroTitleColor }}
                      className="font-display font-black text-4xl sm:text-5xl md:text-6xl tracking-tight leading-[1.08]"
                    >
                      {homeHeroTitle.includes("Africa") ? (
                        <>
                          {homeHeroTitle.split("Africa")[0]}
                          <span style={{ color: homeHeroTitleHighlightColor }}>Africa</span>
                          {homeHeroTitle.split("Africa")[1]}
                        </>
                      ) : homeHeroTitle}
                    </h1>

                    <p className="font-sans text-xs sm:text-sm text-gray-600 max-w-xl leading-relaxed">
                      {homeHeroDesc}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 pt-3">
                      <button
                        onClick={() => handleTabChange("ventures")}
                        className="px-6 py-3 bg-brand-red hover:bg-brand-crimson text-white text-[11px] font-bold uppercase tracking-wider rounded-lg shadow-lg hover:shadow-xl transition-all duration-150 flex items-center justify-center space-x-2"
                      >
                        <span>Explore Our Ventures</span>
                        <ArrowRight size={14} />
                      </button>
                      <button
                        onClick={() => handleBookClick("Strategy & Advisory")}
                        className="px-6 py-3 bg-white border border-gray-200 text-brand-blue hover:border-brand-blue text-[11px] font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center space-x-2"
                      >
                        <span>Partner With Us</span>
                        <ArrowRight size={14} className="text-brand-crimson" />
                      </button>
                    </div>
                  </div>

                  {/* Right Hero Image Frame (Lagos Lekki Bridge) */}
                  <div className="lg:col-span-5 relative">
                    <div className="absolute -inset-1.5 bg-gradient-to-tr from-brand-crimson to-brand-blue rounded-3xl blur-md opacity-25" />
                    <div className="relative overflow-hidden rounded-2xl border border-gray-100 shadow-2xl h-[300px] sm:h-[400px] w-full">
                      <img 
                        src={lagosBridgeUrl} 
                        alt="Lagos Lekki Ikoyi Link Bridge Metaspace"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-center scale-105 hover:scale-110 transition duration-1000"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-brand-blue/70 via-brand-blue/20 to-transparent flex flex-col justify-end p-5">
                        <div className="backdrop-blur-md bg-white/10 border border-white/15 p-4 rounded-xl text-white">
                          <p className="font-display font-bold text-xs tracking-wide">Benin City Headquarters</p>
                          <p className="text-[10px] text-white/85 mt-0.5">Anchoring technology ecosystem infrastructure across Nigeria's South-South region.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </section>

            {/* FOUR PILLARS BLOCK (Venture studio, digital transformation, ecosystem, strategy) */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-gradient-to-r from-brand-blue via-brand-navy to-red-950 text-white rounded-3xl shadow-xl overflow-hidden relative">
                <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />
                <div className="grid grid-cols-2 lg:grid-cols-4 divide-y divide-x divide-white/5 lg:divide-y-0">
                  {services.slice(0, 4).map((srv) => (
                    <button
                      key={srv.id}
                      onClick={() => handleTabChange("what-we-do")}
                      className="p-6 md:p-8 text-left hover:bg-white/[0.03] transition duration-200 group focus:outline-none flex flex-col justify-between space-y-4"
                    >
                      <div className="bg-white/10 p-3 rounded-2xl w-fit group-hover:bg-brand-crimson transition duration-200">
                        {getServiceIcon(srv.iconName, 18, "text-white")}
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-display font-extrabold text-xs md:text-sm tracking-wide group-hover:text-brand-crimson transition">
                          {srv.title}
                        </h4>
                        <p className="text-[10px] text-gray-300 font-sans leading-relaxed line-clamp-2">
                          {srv.shortDesc}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* OUR VENTURES SECTION */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
              <div className="text-center space-y-2">
                <h2 className="font-display font-black text-3xl tracking-tight text-brand-blue">
                  Our <span className="text-brand-crimson">Ventures</span>
                </h2>
                <p className="text-xs text-gray-500 font-sans max-w-md mx-auto">
                  Purpose-built ventures solving Africa's most important challenges.
                </p>
              </div>

              {/* 4 Ventures horizontal scroll or grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {ventures.map((ven) => (
                  <div 
                    key={ven.id}
                    className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col h-full overflow-hidden group"
                  >
                    <div className="p-6 flex-1 space-y-4 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className={`w-10 h-10 rounded-2xl bg-gradient-to-tr ${ven.color || "from-brand-blue to-brand-navy"} flex items-center justify-center shadow`}>
                          {getVentureIcon(ven.iconName, 18, "text-white")}
                        </div>
                        <div>
                          <h3 className="font-display font-extrabold text-sm tracking-wide text-brand-blue">
                            {ven.name}
                          </h3>
                          <p className="text-[10px] text-brand-crimson font-sans font-medium mt-0.5 uppercase tracking-wider">
                            {ven.tagline}
                          </p>
                        </div>
                        <p className="text-[11px] text-gray-500 font-sans leading-relaxed line-clamp-3 pt-1">
                          {ven.description}
                        </p>
                      </div>

                      <button
                        onClick={() => handleVentureLearnMore(ven)}
                        className="text-[11px] font-bold text-brand-blue hover:text-brand-crimson flex items-center space-x-1 transition w-fit pt-2 group-hover:translate-x-1"
                      >
                        <span>Learn More</span>
                        <ArrowRight size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* WHY METASPACE? SECTION */}
            <section className="bg-gray-50/50 py-16 border-y border-gray-100">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                <div className="text-center space-y-2">
                  <h2 className="font-display font-black text-3xl tracking-tight text-brand-blue">
                    Why <span className="text-brand-crimson">Metaspace?</span>
                  </h2>
                  <p className="text-xs text-gray-500 font-sans max-w-sm mx-auto">
                    We match world-class venture architecture with deep local execution.
                  </p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { title: "Impact Driven", desc: "We build solutions with measurable and lasting impact.", icon: <TrendingUp className="text-brand-crimson" size={20} /> },
                    { title: "Technology First", desc: "Leveraging modern technology to drive efficiency and scale.", icon: <Cpu className="text-brand-crimson" size={20} /> },
                    { title: "African Focused", desc: "Solutions designed for African realities and opportunities.", icon: <Globe className="text-brand-crimson" size={20} /> },
                    { title: "Long-term Partner", desc: "We grow with you beyond projects and consultancy.", icon: <Users className="text-brand-crimson" size={20} /> }
                  ].map((feat, idx) => (
                    <div key={idx} className="bg-white border border-gray-100/50 p-6 rounded-2xl shadow-sm text-center flex flex-col items-center space-y-3.5">
                      <div className="w-10 h-10 rounded-2xl bg-red-50 flex items-center justify-center">
                        {feat.icon}
                      </div>
                      <h4 className="font-display font-extrabold text-xs tracking-wider uppercase text-brand-blue">
                        {feat.title}
                      </h4>
                      <p className="text-[11px] text-gray-500 font-sans leading-relaxed max-w-xs">
                        {feat.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* WHO WE ARE & ECOSYSTEMS STATS */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                
                {/* Who We Are block */}
                <div className="lg:col-span-6 bg-white border border-gray-100 p-8 rounded-3xl shadow-sm flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <span className="text-[10px] font-bold text-brand-crimson uppercase tracking-widest border-l-2 border-brand-crimson pl-2">
                      Who We Are
                    </span>
                    <h3 className="font-display font-black text-2xl tracking-tight text-brand-blue">
                      Metaspace Consulting Limited is a venture design studio and digital transformation company.
                    </h3>
                    <p className="text-xs text-gray-500 font-sans leading-relaxed">
                      We are committed to building scalable solutions, enterprises and ecosystems that create lasting impact across the continent, anchoring technology from Benin City, Edo State.
                    </p>
                  </div>
                  <button
                    onClick={() => handleTabChange("about")}
                    className="px-5 py-2.5 bg-brand-blue hover:bg-brand-navy text-white text-[10px] font-bold uppercase tracking-wider rounded-lg transition duration-150 w-fit flex items-center gap-1"
                  >
                    <span>More About Us</span>
                    <ArrowRight size={11} className="text-brand-crimson" />
                  </button>
                </div>

                {/* Stats block */}
                <div className="lg:col-span-6 bg-brand-navy text-white p-8 rounded-3xl shadow-xl flex flex-col justify-between space-y-6 relative overflow-hidden">
                  <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none" />
                  <div className="space-y-2 relative z-10">
                    <span className="text-[10px] font-bold text-brand-crimson uppercase tracking-widest border-l-2 border-brand-crimson pl-2">
                      Our Philosophy
                    </span>
                    <h3 className="font-display font-extrabold text-xl tracking-wide text-white">
                      We don't just build companies.<br />We build <span className="text-brand-crimson">ecosystems.</span>
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 relative z-10">
                    {[
                      { label: "Flagship Ventures", val: "4+" },
                      { label: "Partners Partners", val: "30+" },
                      { label: "Lives Impacted", val: "1000+" },
                      { label: "Multiple Sectors", val: "Across" }
                    ].map((stat, idx) => (
                      <div key={idx} className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                        <span className="font-display font-black text-brand-crimson text-xl md:text-2xl block">
                          {stat.val}
                        </span>
                        <span className="text-[9px] text-gray-300 font-sans tracking-wide uppercase mt-1 block">
                          {stat.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </section>

            {/* READY TO BUILD THE FUTURE TOGETHER */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
              <div className="rounded-3xl bg-gradient-to-r from-brand-crimson to-brand-blue text-white p-8 md:p-12 relative overflow-hidden shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="absolute inset-0 bg-grid-pattern opacity-[0.08] pointer-events-none" />
                <div className="relative z-10 max-w-xl space-y-2">
                  <h3 className="font-display font-black text-xl sm:text-2xl md:text-3xl tracking-tight">
                    Ready to build the future together?
                  </h3>
                  <p className="text-xs text-white/80 font-sans leading-relaxed">
                    Let's create systems that transform lives and economies. Book a session with our principal venture architects.
                  </p>
                </div>
                <button
                  onClick={() => handleBookClick("Venture Design Studio")}
                  className="relative z-10 shrink-0 px-6 py-3.5 bg-white text-brand-blue hover:text-brand-crimson text-[11px] font-bold uppercase tracking-wider rounded-xl shadow-lg transition hover:scale-105 active:scale-95"
                >
                  Book a Consultation
                </button>
              </div>
            </section>

          </div>
        )}

        {/* TAB 2: ABOUT US PAGE */}
        {currentTab === "about" && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 animate-in fade-in duration-200">
            {/* Page Header */}
            <div className="text-center space-y-3">
              <span className="text-[10px] font-bold text-brand-crimson uppercase tracking-widest border-b border-brand-crimson pb-1.5">
                About Metaspace Consulting
              </span>
              <h1 className="font-display font-black text-3xl sm:text-4xl text-brand-blue tracking-tight">
                {aboutHeroTitle.includes("Impact") ? (
                  <>
                    {aboutHeroTitle.split("Impact")[0]}
                    <span className="text-brand-crimson">Impact</span>
                    {aboutHeroTitle.split("Impact")[1]}
                  </>
                ) : aboutHeroTitle}
              </h1>
              <p className="text-xs text-gray-500 font-sans max-w-xl mx-auto leading-relaxed">
                {aboutHeroDesc}
              </p>
            </div>

            {/* Grid philosophy details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <div className="space-y-4">
                <h3 className="font-display font-extrabold text-lg text-brand-blue border-l-3 border-brand-crimson pl-3">
                  {aboutMissionTitle}
                </h3>
                <div className="text-xs text-gray-600 leading-relaxed font-sans whitespace-pre-line space-y-3">
                  {aboutMissionText}
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-4">
                <h3 className="font-display font-extrabold text-sm uppercase tracking-wider text-brand-blue">
                  Operating Principles
                </h3>
                <ul className="space-y-3">
                  {[
                    { title: "Direct Co-Founding", desc: "We don't consult from distance. Our engineering and operations teams join forces to build solutions on-site." },
                    { title: "Regional Gateway Anchor", desc: "Based in Benin City, Edo State, we tap into massive secondary markets often ignored by metropolitan hubs." },
                    { title: "Long-Term Integration", desc: "We grow alongside governments and corporations, remaining active partners long after initial project handoffs." }
                  ].map((princ, idx) => (
                    <li key={idx} className="flex gap-3">
                      <div className="w-5 h-5 rounded-full bg-brand-crimson/10 text-brand-crimson flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-bold text-gray-800">{princ.title}</h4>
                        <p className="text-[10px] text-gray-500 leading-relaxed">{princ.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Team Members Section */}
            <div className="space-y-8">
              <div className="text-center space-y-1">
                <h3 className="font-display font-black text-xl text-brand-blue">
                  Our Leadership Team
                </h3>
                <p className="text-xs text-gray-400">
                  Veteran builders, developers, and ecosystem strategists.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {teamMembers.map((t, idx) => (
                  <div key={idx} className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm space-y-4">
                    <div className="flex items-center space-x-3.5">
                      <img 
                        src={t.avatar} 
                        alt={t.name} 
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-full object-cover shadow"
                      />
                      <div>
                        <h4 className="font-display font-extrabold text-xs text-brand-blue leading-snug">
                          {t.name}
                        </h4>
                        <p className="text-[10px] text-brand-crimson font-sans font-medium">
                          {t.role}
                        </p>
                      </div>
                    </div>
                    <p className="text-[11px] text-gray-500 leading-relaxed font-sans">
                      {t.bio}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: WHAT WE DO */}
        {currentTab === "what-we-do" && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 animate-in fade-in duration-200">
            {/* Page Header */}
            <div className="text-center space-y-3">
              <span className="text-[10px] font-bold text-brand-crimson uppercase tracking-widest border-b border-brand-crimson pb-1.5">
                Our Capabilities
              </span>
              <h1 className="font-display font-black text-3xl sm:text-4xl text-brand-blue tracking-tight">
                {whatWeDoTitle.includes("Infrastructure") ? (
                  <>
                    {whatWeDoTitle.split("Infrastructure")[0]}
                    <span className="text-brand-crimson">Infrastructure</span>
                    {whatWeDoTitle.split("Infrastructure")[1]}
                  </>
                ) : whatWeDoTitle}
              </h1>
              <p className="text-xs text-gray-500 font-sans max-w-xl mx-auto leading-relaxed">
                {whatWeDoDesc}
              </p>
            </div>

            {/* Grid of detailed services */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {services.map((srv) => (
                <div key={srv.id} className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-red-50 p-2.5 rounded-xl">
                        {getServiceIcon(srv.iconName, 18, "text-brand-crimson")}
                      </div>
                      <h3 className="font-display font-extrabold text-sm text-brand-blue">
                        {srv.title}
                      </h3>
                    </div>

                    <p className="text-xs text-gray-600 leading-relaxed font-sans">
                      {srv.longDesc}
                    </p>

                    <div className="space-y-2">
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        Operational Scope
                      </h4>
                      <ul className="space-y-1.5 text-xs text-gray-500">
                        {srv.keyFeatures.map((feat, fIdx) => (
                          <li key={fIdx} className="flex items-start space-x-2">
                            <CheckCircle size={12} className="text-green-500 shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {srv.caseStudy && (
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100/50 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-brand-crimson">
                          Case Study Highlight
                        </span>
                        <span className="text-[10px] font-bold text-brand-blue bg-blue-50 px-2.5 py-0.5 rounded-md">
                          {srv.caseStudy.metric}
                        </span>
                      </div>
                      <h4 className="text-[11px] font-bold text-gray-800">
                        {srv.caseStudy.title}
                      </h4>
                      <p className="text-[10px] text-gray-500 leading-relaxed">
                        {srv.caseStudy.description}
                      </p>
                    </div>
                  )}

                  <button
                    onClick={() => handleBookClick(srv.title)}
                    className="w-full py-3 bg-brand-blue hover:bg-brand-navy text-white text-[10px] font-bold uppercase tracking-wider rounded-lg transition text-center shadow-inner"
                  >
                    Select Capability
                  </button>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* TAB 4: VENTURES LIST */}
        {currentTab === "ventures" && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 animate-in fade-in duration-200">
            {/* Page Header */}
            <div className="text-center space-y-3">
              <span className="text-[10px] font-bold text-brand-crimson uppercase tracking-widest border-b border-brand-crimson pb-1.5">
                Our Innovation Ledger
              </span>
              <h1 className="font-display font-black text-3xl sm:text-4xl text-brand-blue tracking-tight">
                Venture Portfolio <span className="text-brand-crimson">Breakdown.</span>
              </h1>
              <p className="text-xs text-gray-500 font-sans max-w-xl mx-auto leading-relaxed">
                Review our active, independent spin-offs built from the ground up to digitize education, healthcare, transport, and investments.
              </p>
            </div>

            {/* Detailed Portfolio Breakdown list with statistics */}
            <div className="space-y-8">
              {ventures.map((ven) => (
                <div key={ven.id} className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12">
                  
                  {/* Left Column Colored branding and Stats */}
                  <div className={`lg:col-span-4 p-6 text-white bg-gradient-to-br ${ven.color || "from-brand-blue to-brand-navy"} flex flex-col justify-between relative`}>
                    <div className="absolute inset-0 bg-grid-pattern opacity-[0.05] pointer-events-none" />
                    
                    <div className="space-y-4 relative z-10">
                      <div className="bg-white/10 p-2.5 rounded-xl w-fit border border-white/10 shadow-lg">
                        {getVentureIcon(ven.iconName, 20, "text-white")}
                      </div>
                      <div>
                        <h3 className="font-display font-black text-xl tracking-wide">{ven.name}</h3>
                        <p className="text-[10px] text-white/70 uppercase tracking-widest font-sans mt-0.5">{ven.tagline}</p>
                      </div>
                    </div>

                    <div className="space-y-2.5 pt-6 relative z-10">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">Live Metrics</p>
                      <div className="grid grid-cols-3 gap-2">
                        {ven.stats.map((s, idx) => (
                          <div key={idx} className="bg-white/10 p-2 rounded-lg border border-white/10 text-center">
                            <p className="text-xs font-black text-white">{s.value}</p>
                            <p className="text-[8px] text-white/70 font-sans leading-none mt-0.5">{s.label}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column operations details */}
                  <div className="lg:col-span-8 p-6 flex flex-col justify-between space-y-6">
                    <div className="space-y-4">
                      <p className="text-xs text-gray-600 leading-relaxed font-sans font-medium">
                        {ven.description}
                      </p>
                      <p className="text-xs text-gray-500 leading-relaxed font-sans">
                        {ven.fullDetails}
                      </p>

                      <div className="space-y-2 pt-2">
                        <h4 className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                          Direct System Value
                        </h4>
                        <ul className="space-y-2">
                          {ven.impactPoints.map((point, idx) => (
                            <li key={idx} className="flex items-start space-x-2 text-xs text-gray-500">
                              <CheckCircle size={14} className="text-green-500 shrink-0 mt-0.5" />
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <button
                        onClick={() => handleBookClick(`Partnership: ${ven.name}`)}
                        className="w-full sm:w-auto px-5 py-2.5 bg-brand-blue hover:bg-brand-navy text-white text-[11px] font-bold uppercase tracking-wider rounded-lg transition"
                      >
                        Book Venture Partnership
                      </button>
                      <button
                        onClick={() => handleVentureLearnMore(ven)}
                        className="text-xs font-bold text-brand-crimson hover:underline"
                      >
                        {"Full Operations Dossier \u2192"}
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>

          </div>
        )}

        {/* TAB 5: INSIGHTS BLOG */}
        {currentTab === "insights" && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 animate-in fade-in duration-200">
            {/* Page Header */}
            <div className="text-center space-y-3">
              <span className="text-[10px] font-bold text-brand-crimson uppercase tracking-widest border-b border-brand-crimson pb-1.5">
                Ecosystem Research & Ideas
              </span>
              <h1 className="font-display font-black text-3xl sm:text-4xl text-brand-blue tracking-tight">
                Metaspace Consulting <span className="text-brand-crimson">Insights.</span>
              </h1>
              <p className="text-xs text-gray-500 font-sans max-w-xl mx-auto leading-relaxed">
                Read deep-dives and empirical research prepared by our principal designers regarding technology development, funding, and healthcare in emerging markets.
              </p>
            </div>

            {/* Expanded Post view or Blog Grid */}
            {expandedPost ? (
              <article className="bg-white border border-gray-100 rounded-3xl shadow-md p-6 md:p-10 space-y-6 animate-in zoom-in-98 duration-200">
                <button
                  onClick={() => setExpandedPost(null)}
                  className="text-xs font-bold text-brand-crimson hover:underline flex items-center gap-1.5 mb-2 focus:outline-none"
                >
                  {"\u2190 Back to Insights Hub"}
                </button>

                <div className="space-y-4">
                  <span className="text-[10px] font-bold text-brand-crimson uppercase tracking-widest bg-red-50 border border-red-100 px-3 py-1 rounded-full">
                    {expandedPost.category}
                  </span>
                  <h2 className="font-display font-black text-2xl sm:text-3xl text-brand-blue leading-tight">
                    {expandedPost.title}
                  </h2>
                  <div className="flex items-center space-x-3.5 text-xs text-gray-400 font-sans border-b border-gray-50 pb-4">
                    <span>By <strong>{expandedPost.author}</strong></span>
                    <span>•</span>
                    <span>{expandedPost.date}</span>
                    <span>•</span>
                    <span>{expandedPost.readTime}</span>
                  </div>
                </div>

                <div className="h-[250px] sm:h-[350px] rounded-2xl overflow-hidden shadow-inner border border-gray-100">
                  <img 
                    src={expandedPost.image} 
                    alt={expandedPost.title} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center"
                  />
                </div>

                <div className="prose prose-sm max-w-none text-xs sm:text-sm text-gray-600 leading-relaxed font-sans space-y-4">
                  <p className="font-medium text-gray-800">{expandedPost.summary}</p>
                  <p className="whitespace-pre-line">{expandedPost.content}</p>
                </div>

                <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest">
                    Empirical Studies Ledger
                  </p>
                  <button
                    onClick={() => handleBookClick(`Consult: ${expandedPost.category}`)}
                    className="px-5 py-2.5 bg-brand-red hover:bg-brand-crimson text-white text-[11px] font-bold uppercase tracking-wider rounded-lg transition"
                  >
                    Consult on this Topic
                  </button>
                </div>
              </article>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {insights.map((post) => (
                  <div 
                    key={post.id}
                    className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition flex flex-col justify-between overflow-hidden group cursor-pointer"
                    onClick={() => setExpandedPost(post)}
                  >
                    <div>
                      <div className="h-44 overflow-hidden relative">
                        <img 
                          src={post.image} 
                          alt={post.title} 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />
                        <span className="absolute top-3 left-3 text-[9px] font-bold text-white bg-brand-crimson px-2.5 py-1 rounded-md uppercase tracking-wider">
                          {post.category}
                        </span>
                      </div>

                      <div className="p-5 space-y-2.5">
                        <div className="flex items-center space-x-2 text-[10px] text-gray-400 font-sans">
                          <span>{post.date}</span>
                          <span>•</span>
                          <span>{post.readTime}</span>
                        </div>
                        <h3 className="font-display font-extrabold text-sm text-brand-blue group-hover:text-brand-crimson transition leading-snug line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-3 font-sans">
                          {post.summary}
                        </p>
                      </div>
                    </div>

                    <div className="p-5 pt-0">
                      <span className="text-[11px] font-bold text-brand-blue hover:text-brand-crimson flex items-center space-x-1 transition group-hover:translate-x-1">
                        <span>Read Full Article</span>
                        <ArrowRight size={12} />
                      </span>
                    </div>

                  </div>
                ))}
              </div>
            )}

          </div>
        )}

        {/* TAB 6: CONTACT PAGE */}
        {currentTab === "contact" && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 animate-in fade-in duration-200">
            {/* Page Header */}
            <div className="text-center space-y-3">
              <span className="text-[10px] font-bold text-brand-crimson uppercase tracking-widest border-b border-brand-crimson pb-1.5">
                Get In Touch
              </span>
              <h1 className="font-display font-black text-3xl sm:text-4xl text-brand-blue tracking-tight">
                Connect With <span className="text-brand-crimson">Metaspace.</span>
              </h1>
              <p className="text-xs text-gray-500 font-sans max-w-xl mx-auto leading-relaxed">
                Whether you're a government, investor, legacy company, or seed-stage founder, we are ready to listen.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              
              {/* Left Column Information card */}
              <div className="lg:col-span-5 bg-brand-blue text-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-8 relative overflow-hidden shadow-xl">
                <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />
                
                <div className="space-y-5 relative z-10">
                  <h3 className="font-display font-extrabold text-lg">Contact Coordinates</h3>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    Our team anchors consulting and engineering teams directly out of Benin City, serving sovereign, commercial, and impact programs across all of Africa.
                  </p>

                  <ul className="space-y-4 pt-3.5 text-xs">
                    <li className="flex items-start space-x-3">
                      <Mail size={16} className="text-brand-crimson shrink-0 mt-0.5" />
                      <div>
                        <p className="text-gray-400 font-bold uppercase tracking-wider text-[9px]">General Inquiry Email</p>
                        <a href="mailto:info@metaspaceconsulting.com" className="hover:text-brand-crimson transition font-semibold">
                          info@metaspaceconsulting.com
                        </a>
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <Phone size={16} className="text-brand-crimson shrink-0 mt-0.5" />
                      <div>
                        <p className="text-gray-400 font-bold uppercase tracking-wider text-[9px]">Direct Telephone</p>
                        <a href="tel:+2348123456789" className="hover:text-brand-crimson transition font-semibold">
                          +234 812 345 6789
                        </a>
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <MapPin size={16} className="text-brand-crimson shrink-0 mt-0.5" />
                      <div>
                        <p className="text-gray-400 font-bold uppercase tracking-wider text-[9px]">Physical Headquarters</p>
                        <span className="text-gray-300 font-semibold leading-normal">
                          Benin City, Edo State, Nigeria
                        </span>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl relative z-10 space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-300">
                      SLA Response Time
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-300 leading-relaxed">
                    Consultation slots are processed and synced inside the admin record ledger within 15 minutes of transmission.
                  </p>
                </div>

              </div>

              {/* Right Column General Contact Form */}
              <div className="lg:col-span-7 bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between">
                
                {contactSuccess ? (
                  <div className="py-12 flex flex-col items-center text-center space-y-4">
                    <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center text-green-500 shadow-inner">
                      <CheckCircle size={30} className="animate-bounce" />
                    </div>
                    <h3 className="font-display font-extrabold text-lg text-brand-blue">
                      Inquiry Transmitted!
                    </h3>
                    <p className="text-xs text-gray-500 max-w-sm leading-relaxed">
                      Your message has been queued in the system inquiries records ledger. Our strategy teams will get back to you shortly.
                    </p>
                    <button
                      onClick={() => setContactSuccess(false)}
                      className="px-5 py-2 bg-brand-blue text-white text-xs font-bold rounded-lg transition mt-4"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <h3 className="font-display font-black text-lg text-brand-blue pb-2 border-b border-gray-50 flex items-center gap-2">
                      <Mail size={16} className="text-brand-crimson" />
                      <span>Transmit General Inquiry</span>
                    </h3>

                    {contactError && (
                      <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-brand-red">
                        {contactError}
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Name */}
                      <div className="flex flex-col space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Your Name *</label>
                        <input
                          type="text"
                          required
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          placeholder="e.g. Osas Igbinedion"
                          className="px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 focus:border-blue-900 rounded-lg focus:bg-white focus:outline-none transition"
                        />
                      </div>

                      {/* Email */}
                      <div className="flex flex-col space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Email Address *</label>
                        <input
                          type="email"
                          required
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          placeholder="e.g. name@domain.com"
                          className="px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 focus:border-blue-900 rounded-lg focus:bg-white focus:outline-none transition"
                        />
                      </div>
                    </div>

                    {/* Subject */}
                    <div className="flex flex-col space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Inquiry Subject *</label>
                      <input
                        type="text"
                        required
                        value={contactSubject}
                        onChange={(e) => setContactSubject(e.target.value)}
                        placeholder="e.g. Incubation options at Oghowa Accelerator"
                        className="px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 focus:border-blue-900 rounded-lg focus:bg-white focus:outline-none transition"
                      />
                    </div>

                    {/* Message */}
                    <div className="flex flex-col space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Your Message *</label>
                      <textarea
                        required
                        rows={4}
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        placeholder="Detail your questions, specific venture requests, or partnership scope..."
                        className="px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 focus:border-blue-900 rounded-lg focus:bg-white focus:outline-none transition resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmittingContact}
                      className="w-full py-3 bg-brand-red hover:bg-brand-crimson disabled:bg-brand-red/60 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg transition duration-150 flex items-center justify-center gap-1.5"
                    >
                      {isSubmittingContact ? "Transmitting..." : "Submit Inquiry"}
                    </button>
                  </form>
                )}

              </div>

            </div>

          </div>
        )}

        {/* TAB 7: ADMIN/RECORDS LEDGER */}
        {currentTab === "admin" && (
          <div className="animate-in fade-in duration-200">
            <AdminDashboard />
          </div>
        )}

      </main>

      {/* FOOTER */}
      <Footer 
        setCurrentTab={handleTabChange} 
        onBookClick={() => handleBookClick()} 
        logoUrl={logoUrl}
        footerTagline={footerTagline}
        footerDesc={footerDesc}
        footerEmail={footerEmail}
        footerPhone={footerPhone}
        footerAddress={footerAddress}
        footerLinkedin={footerLinkedin}
        footerTwitter={footerTwitter}
        footerFacebook={footerFacebook}
        footerInstagram={footerInstagram}
        footerQuickLinks={footerQuickLinks}
        footerVenturesLinks={footerVenturesLinks}
      />

      {/* SYSTEM CHATBOT FLOATING WIDGET */}
      <GeminiAssistant />

      {/* SYSTEM CONSULTATION FORM MODAL */}
      <ConsultationForm 
        isOpen={isBookModalOpen} 
        onClose={() => setIsBookModalOpen(false)} 
        preselectedService={preselectedService}
      />

      {/* PORTFOLIO DETAIL POPUP DRAWER */}
      <VentureDetail 
        venture={selectedVenture} 
        onClose={() => setSelectedVenture(null)} 
        onBookClick={(venName) => {
          setSelectedVenture(null);
          handleBookClick(`Venture: ${venName}`);
        }} 
      />
    </div>
  );
}
