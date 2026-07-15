import React, { useState, useEffect } from "react";
import { 
  ShieldCheck, RefreshCw, Calendar, Mail, FileText, CheckCircle, Clock, 
  Trash2, Plus, ArrowRight, Loader2, Sparkles, Image as ImageIcon, 
  Settings, Lock, KeyRound, Save, Edit3, HelpCircle, Eye, AlertCircle,
  Briefcase
} from "lucide-react";
import { Consultation, ContactInquiry, Venture, ServiceOffer } from "../types";
import { 
  apiFetchSiteConfig, apiSaveSiteConfig, apiLoginAdmin, 
  apiFetchConsultations, apiFetchInquiries 
} from "../lib/apiFallback";

export default function AdminDashboard() {
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [authError, setAuthError] = useState("");

  // UI Tabs inside Admin: "ledger" | "text_editor" | "media_editor" | "ventures_services" | "footer_editor"
  const [activeAdminTab, setActiveAdminTab] = useState<"ledger" | "text_editor" | "media_editor" | "ventures_services" | "footer_editor">("ledger");

  // Data States
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [isMySQL, setIsMySQL] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errMessage, setErrMessage] = useState("");

  // Editable site config fields
  const [homeHeroTitle, setHomeHeroTitle] = useState("");
  const [homeHeroTitleColor, setHomeHeroTitleColor] = useState("#141b77");
  const [homeHeroTitleHighlightColor, setHomeHeroTitleHighlightColor] = useState("#ef4444");
  const [homeHeroSubtitle, setHomeHeroSubtitle] = useState("");
  const [homeHeroDesc, setHomeHeroDesc] = useState("");
  const [aboutHeroTitle, setAboutHeroTitle] = useState("");
  const [aboutHeroDesc, setAboutHeroDesc] = useState("");
  const [aboutMissionTitle, setAboutMissionTitle] = useState("");
  const [aboutMissionText, setAboutMissionText] = useState("");
  const [whatWeDoTitle, setWhatWeDoTitle] = useState("");
  const [whatWeDoDesc, setWhatWeDoDesc] = useState("");

  const [logoUrl, setLogoUrl] = useState("");
  const [lagosBridgeUrl, setLagosBridgeUrl] = useState("");

  const [ventures, setVentures] = useState<Venture[]>([]);
  const [services, setServices] = useState<ServiceOffer[]>([]);

  // WhatsApp & Footer dynamic fields
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [footerTagline, setFooterTagline] = useState("");
  const [footerDesc, setFooterDesc] = useState("");
  const [footerEmail, setFooterEmail] = useState("");
  const [footerPhone, setFooterPhone] = useState("");
  const [footerAddress, setFooterAddress] = useState("");
  const [footerLinkedin, setFooterLinkedin] = useState("");
  const [footerTwitter, setFooterTwitter] = useState("");
  const [footerFacebook, setFooterFacebook] = useState("");
  const [footerInstagram, setFooterInstagram] = useState("");
  const [footerQuickLinks, setFooterQuickLinks] = useState<{ label: string; tab: string }[]>([]);
  const [footerVenturesLinks, setFooterVenturesLinks] = useState<{ label: string; tab: string }[]>([]);

  // Password update fields
  const [newPassword, setNewPassword] = useState("");

  // Check existing token on mount
  useEffect(() => {
    const token = localStorage.getItem("metaspace_admin_token");
    const savedPassword = localStorage.getItem("metaspace_admin_password");
    if (token && savedPassword) {
      setPassword(savedPassword);
      setIsAuthenticated(true);
      fetchAdminData(savedPassword);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;

    setIsLoggingIn(true);
    setAuthError("");

    try {
      const result = await apiLoginAdmin(password);
      if (result.success) {
        setIsAuthenticated(true);
        localStorage.setItem("metaspace_admin_token", result.token || "mock-token");
        localStorage.setItem("metaspace_admin_password", password);
        fetchAdminData(password);
      } else {
        setAuthError(result.error || "Incorrect password.");
      }
    } catch (err) {
      setAuthError("Server connection failed. Try again.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("metaspace_admin_token");
    localStorage.removeItem("metaspace_admin_password");
    setIsAuthenticated(false);
    setPassword("");
  };

  const fetchAdminData = async (pwd = password) => {
    setIsLoading(true);
    try {
      // Fetch dynamic content and submissions seamlessly
      const [consultsData, inqsData, configData] = await Promise.all([
        apiFetchConsultations(),
        apiFetchInquiries(),
        apiFetchSiteConfig()
      ]);

      setConsultations(consultsData);
      setInquiries(inqsData);

      if (configData) {
        const d = configData;
        setHomeHeroTitle(d.home_hero_title || "");
        setHomeHeroTitleColor(d.home_hero_title_color || "#141b77");
        setHomeHeroTitleHighlightColor(d.home_hero_title_highlight_color || "#ef4444");
        setHomeHeroSubtitle(d.home_hero_subtitle || "");
        setHomeHeroDesc(d.home_hero_desc || "");
        setAboutHeroTitle(d.about_hero_title || "");
        setAboutHeroDesc(d.about_hero_desc || "");
        setAboutMissionTitle(d.about_mission_title || "");
        setAboutMissionText(d.about_mission_text || "");
        setWhatWeDoTitle(d.what_we_do_title || "");
        setWhatWeDoDesc(d.what_we_do_desc || "");
        setLogoUrl(d.logoUrl || "");
        setLagosBridgeUrl(d.lagosBridgeUrl || "");
        setVentures(d.ventures || []);
        setServices(d.services || []);
        setIsMySQL(d.isMySQL || false);

        setWhatsappNumber(d.whatsapp_number || "");
        setFooterTagline(d.footer_tagline || "");
        setFooterDesc(d.footer_desc || "");
        setFooterEmail(d.footer_email || "");
        setFooterPhone(d.footer_phone || "");
        setFooterAddress(d.footer_address || "");
        setFooterLinkedin(d.footer_linkedin || "");
        setFooterTwitter(d.footer_twitter || "");
        setFooterFacebook(d.footer_facebook || "");
        setFooterInstagram(d.footer_instagram || "");
        setFooterQuickLinks(d.footer_quick_links || []);
        setFooterVenturesLinks(d.footer_ventures_links || []);
      }
    } catch (err) {
      console.error("Admin Fetch Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Generic config save helper
  const handleSaveConfig = async (updates: Record<string, any>) => {
    setIsLoading(true);
    setMessage("");
    setErrMessage("");
    try {
      const success = await apiSaveSiteConfig(updates);
      if (success) {
        setMessage("Site settings saved and updated successfully!");
        fetchAdminData();
        setTimeout(() => setMessage(""), 4000);
      } else {
        setErrMessage("Failed to save configurations.");
      }
    } catch (err) {
      setErrMessage("Database server sync failed.");
    } finally {
      setIsLoading(false);
    }
  };

  // File to Base64 helper
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: "logoUrl" | "lagosBridgeUrl") => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      setErrMessage("Image is too large. Keep it under 8MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      if (fieldName === "logoUrl") {
        setLogoUrl(base64String);
        handleSaveConfig({ logoUrl: base64String });
      } else {
        setLagosBridgeUrl(base64String);
        handleSaveConfig({ lagosBridgeUrl: base64String });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUpdateConsultStatus = async (id: string, currentStatus: string) => {
    const nextStatusMap: Record<string, "pending" | "scheduled" | "completed"> = {
      pending: "scheduled",
      scheduled: "completed",
      completed: "pending"
    };
    const nextStatus = nextStatusMap[currentStatus] || "pending";

    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/consultations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, status: nextStatus })
      });
      if (res.ok) {
        setMessage(`Consultation status updated to ${nextStatus}!`);
        fetchAdminData();
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteConsultation = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this consultation slot?")) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/consultations/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      });
      if (res.ok) {
        setMessage("Consultation record deleted successfully.");
        fetchAdminData();
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this inquiry from the inbox?")) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/contact/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      });
      if (res.ok) {
        setMessage("Inquiry message deleted.");
        fetchAdminData();
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword.trim()) return;

    setIsLoading(true);
    setMessage("");
    setErrMessage("");
    try {
      const res = await fetch("/api/admin/site-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password,
          updates: { adminPassword: newPassword }
        })
      });

      if (res.ok) {
        setMessage("Admin password changed successfully! Please log in again with your new password.");
        setPassword(newPassword);
        localStorage.setItem("metaspace_admin_password", newPassword);
        setNewPassword("");
        setTimeout(() => setMessage(""), 4000);
      } else {
        setErrMessage("Failed to update password.");
      }
    } catch (err) {
      setErrMessage("Server communication failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInjectSimulatedData = async () => {
    setIsLoading(true);
    try {
      const mockConsult = {
        name: "Eseosa Igbinedion",
        email: "eseosa@edo-ventures.com",
        organization: "Edo Capital Ventures",
        sector: "Financial Technology",
        service: "Innovation Ecosystem Builder",
        message: "Simulated partner inquiry regarding structural co-investment opportunities for the Oghowa Accelerator 2026 Cohort."
      };

      const response = await fetch("/api/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mockConsult)
      });

      if (response.ok) {
        setMessage("Simulated record injected successfully!");
        fetchAdminData();
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateVentureField = (index: number, key: keyof Venture, val: any) => {
    const list = [...ventures];
    list[index] = { ...list[index], [key]: val };
    setVentures(list);
  };

  const handleUpdateServiceField = (index: number, key: keyof ServiceOffer, val: any) => {
    const list = [...services];
    list[index] = { ...list[index], [key]: val };
    setServices(list);
  };

  // RENDER AUTH SCREEN IF NOT LOGGED IN
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 sm:py-24 space-y-6">
        <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-xl space-y-6 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-crimson to-brand-blue" />
          
          <div className="mx-auto w-12 h-12 bg-red-50 text-brand-crimson rounded-2xl flex items-center justify-center">
            <Lock size={22} />
          </div>

          <div className="space-y-1">
            <h2 className="font-display font-extrabold text-xl text-brand-blue tracking-tight">
              Metaspace Gatekeeper
            </h2>
            <p className="text-xs text-gray-400 font-sans">
              Enter admin password to modify page contents & view transaction ledgers.
            </p>
          </div>

          {authError && (
            <div className="p-3 bg-red-50 border border-red-100 text-brand-red text-xs rounded-xl flex items-center justify-center gap-1.5">
              <AlertCircle size={14} />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="flex flex-col space-y-1 text-left">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Administrator Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="e.g. admin"
                  className="w-full pl-9 pr-3 py-3 text-xs bg-gray-50 border border-gray-200 focus:border-brand-blue rounded-xl focus:bg-white focus:outline-none transition font-semibold"
                />
                <KeyRound size={13} className="absolute left-3.5 top-3.5 text-gray-400" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 bg-brand-blue hover:bg-brand-navy text-white text-[11px] font-bold uppercase tracking-wider rounded-xl transition shadow flex items-center justify-center gap-1.5"
            >
              {isLoggingIn ? <Loader2 size={13} className="animate-spin" /> : <ShieldCheck size={14} />}
              <span>Verify Password</span>
            </button>
          </form>

          <p className="text-[10px] text-gray-400 leading-normal italic">
            Default test credential is "admin"
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 min-h-[60vh] bg-grid-pattern">
      
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-100 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-brand-blue">
            <ShieldCheck size={20} className="text-brand-crimson animate-pulse" />
            <span className="font-sans font-bold text-xs uppercase tracking-widest text-brand-crimson">
              Metaspace Administrator Panel
            </span>
          </div>
          <h2 className="font-display font-black text-2xl tracking-tight text-brand-blue mt-1">
            Corporate Operations & Layout Console
          </h2>
          <p className="text-xs text-gray-500 font-sans mt-0.5">
            Connected database: <strong className="text-brand-blue uppercase">{isMySQL ? "cPanel MySQL Database" : "Local persistent JSON ledger"}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchAdminData}
            disabled={isLoading}
            className="px-3.5 py-2 bg-white border border-gray-200 text-gray-700 text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-sm hover:bg-gray-50 flex items-center gap-1.5"
          >
            {isLoading ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />}
            <span>Sync DB</span>
          </button>
          <button
            onClick={handleLogout}
            className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-brand-crimson border border-red-100 text-[10px] font-bold uppercase tracking-wider rounded-lg flex items-center gap-1"
          >
            <Lock size={12} />
            <span>Lock</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {message && (
        <div className="p-3 bg-green-50 border border-green-100 text-green-700 text-xs rounded-xl flex items-center gap-2 animate-pulse">
          <CheckCircle size={15} />
          <span className="font-semibold">{message}</span>
        </div>
      )}
      {errMessage && (
        <div className="p-3 bg-red-50 border border-red-100 text-brand-red text-xs rounded-xl flex items-center gap-2">
          <AlertCircle size={15} />
          <span className="font-semibold">{errMessage}</span>
        </div>
      )}

      {/* Admin Navigation Tabs */}
      <div className="flex border-b border-gray-100 overflow-x-auto pb-px gap-1">
        {[
          { id: "ledger", label: "Bookings Ledger", icon: <Calendar size={13} /> },
          { id: "text_editor", label: "Page Text & Layout", icon: <Edit3 size={13} /> },
          { id: "media_editor", label: "Images & Logo", icon: <ImageIcon size={13} /> },
          { id: "ventures_services", label: "Ventures & Services", icon: <Briefcase size={13} /> },
          { id: "footer_editor", label: "Footer & Chat Support", icon: <Settings size={13} /> }
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => {
              setActiveAdminTab(t.id as any);
              setErrMessage("");
            }}
            className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 whitespace-nowrap flex items-center gap-1.5 transition ${
              activeAdminTab === t.id
                ? "border-brand-crimson text-brand-crimson bg-red-50/20"
                : "border-transparent text-gray-500 hover:text-brand-blue"
            }`}
          >
            {t.icon}
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: SUBMISSIONS LEDGER */}
      {activeAdminTab === "ledger" && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Booked Consultations", val: consultations.length, color: "text-brand-blue" },
              { label: "General Inquiries", val: inquiries.length, color: "text-brand-crimson" },
              { label: "Pending Slots", val: consultations.filter(c => c.status === "pending").length, color: "text-orange-500" },
              { label: "Scheduled Slots", val: consultations.filter(c => c.status === "scheduled").length, color: "text-blue-500" }
            ].map((c, i) => (
              <div key={i} className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{c.label}</span>
                <p className={`font-display font-black text-2xl mt-1.5 ${c.color}`}>{c.val}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Consultation Partners schedules */}
            <div className="lg:col-span-8 bg-white border border-gray-100 rounded-2xl shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-gray-50 pb-3">
                <div className="flex items-center space-x-2">
                  <Calendar size={15} className="text-brand-crimson" />
                  <h3 className="font-display font-bold text-sm text-brand-blue">
                    Consultation Partnership Schedules
                  </h3>
                </div>
                <button
                  onClick={handleInjectSimulatedData}
                  className="px-3 py-1 bg-gray-50 border border-gray-200 text-gray-600 hover:text-brand-blue text-[9px] font-bold uppercase tracking-wider rounded flex items-center gap-1"
                >
                  <Plus size={10} />
                  <span>Simulate Input</span>
                </button>
              </div>

              {consultations.length === 0 ? (
                <div className="py-12 text-center text-xs text-gray-400">
                  No partnership inquiries submitted yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {consultations.map((c) => (
                    <div key={c.id} className="p-4 bg-gray-50/50 border border-gray-100 rounded-xl space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                          <h4 className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                            {c.name}
                            {c.organization && (
                              <span className="text-[10px] font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                                {c.organization}
                              </span>
                            )}
                          </h4>
                          <p className="text-[10px] text-gray-500">{c.email} • {c.sector}</p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleUpdateConsultStatus(c.id, c.status)}
                            className={`text-[9px] font-bold px-2 py-1 rounded flex items-center gap-1 cursor-pointer transition uppercase ${
                              c.status === "scheduled" ? "bg-green-50 border border-green-100 text-green-700" :
                              c.status === "completed" ? "bg-blue-50 border border-blue-100 text-brand-blue" :
                              "bg-orange-50 border border-orange-100 text-orange-700"
                            }`}
                            title="Click to cycle status: Pending -> Scheduled -> Completed"
                          >
                            <Clock size={10} />
                            <span>{c.status}</span>
                          </button>
                          <button
                            onClick={() => handleDeleteConsultation(c.id)}
                            className="p-1 text-gray-400 hover:text-brand-crimson hover:bg-red-50 rounded"
                            title="Delete record"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 bg-white p-3 rounded-lg border border-gray-50 font-sans">
                        {c.message}
                      </p>
                      <div className="text-[9px] text-gray-400 flex items-center justify-between">
                        <span>Logged: {new Date(c.createdAt).toLocaleString()}</span>
                        <span>Service: <strong>{c.service}</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Standard inquiry Inbox */}
            <div className="lg:col-span-4 bg-white border border-gray-100 rounded-2xl shadow-sm p-6 space-y-4">
              <div className="flex items-center space-x-2 border-b border-gray-50 pb-3">
                <Mail size={15} className="text-brand-crimson" />
                <h3 className="font-display font-bold text-sm text-brand-blue">
                  Inquiries Inbox
                </h3>
              </div>

              {inquiries.length === 0 ? (
                <div className="py-12 text-center text-xs text-gray-400">
                  Inbox empty.
                </div>
              ) : (
                <div className="space-y-4">
                  {inquiries.map((inq) => (
                    <div key={inq.id} className="p-4 bg-gray-50/50 border border-gray-100 rounded-xl space-y-2 relative">
                      <button
                        onClick={() => handleDeleteInquiry(inq.id)}
                        className="absolute top-4 right-4 p-1 text-gray-400 hover:text-brand-crimson hover:bg-red-50 rounded"
                        title="Delete Inquiry"
                      >
                        <Trash2 size={11} />
                      </button>
                      <div className="pr-6">
                        <h4 className="text-xs font-bold text-gray-800">{inq.name}</h4>
                        <p className="text-[9px] text-gray-400">{inq.email}</p>
                      </div>
                      <div className="text-xs pt-1">
                        <p className="font-semibold text-brand-blue text-[10px]">Subject: {inq.subject}</p>
                        <p className="text-gray-600 mt-1 italic text-[11px] leading-relaxed">
                          "{inq.message}"
                        </p>
                      </div>
                      <p className="text-[8px] text-gray-400 text-right pt-1">
                        {new Date(inq.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PAGE TEXT EDITOR */}
      {activeAdminTab === "text_editor" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-200">
          <div className="lg:col-span-8 space-y-6">
            
            {/* HOME PAGE HERO */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 space-y-4">
              <h3 className="font-display font-bold text-sm text-brand-blue border-b border-gray-50 pb-2">
                Home Page Hero Content
              </h3>
              <div className="space-y-4">
                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Hero Accent Text (Subtitle)</label>
                  <input
                    type="text"
                    value={homeHeroSubtitle}
                    onChange={(e) => setHomeHeroSubtitle(e.target.value)}
                    className="px-3 py-2 text-xs bg-gray-50 border border-gray-200 focus:border-brand-blue rounded-lg outline-none"
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Hero Main Title Heading</label>
                  <input
                    type="text"
                    value={homeHeroTitle}
                    onChange={(e) => setHomeHeroTitle(e.target.value)}
                    className="px-3 py-2 text-xs bg-gray-50 border border-gray-200 focus:border-brand-blue rounded-lg outline-none font-bold"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Title Main Text Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={homeHeroTitleColor}
                        onChange={(e) => setHomeHeroTitleColor(e.target.value)}
                        className="w-8 h-8 rounded border border-gray-200 cursor-pointer p-0 bg-transparent"
                      />
                      <input
                        type="text"
                        value={homeHeroTitleColor}
                        onChange={(e) => setHomeHeroTitleColor(e.target.value)}
                        placeholder="#141b77"
                        className="px-3 py-1.5 text-xs bg-gray-50 border border-gray-200 focus:border-brand-blue rounded-lg outline-none font-mono flex-1"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Highlight Text Color (e.g. Africa)</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={homeHeroTitleHighlightColor}
                        onChange={(e) => setHomeHeroTitleHighlightColor(e.target.value)}
                        className="w-8 h-8 rounded border border-gray-200 cursor-pointer p-0 bg-transparent"
                      />
                      <input
                        type="text"
                        value={homeHeroTitleHighlightColor}
                        onChange={(e) => setHomeHeroTitleHighlightColor(e.target.value)}
                        placeholder="#ef4444"
                        className="px-3 py-1.5 text-xs bg-gray-50 border border-gray-200 focus:border-brand-blue rounded-lg outline-none font-mono flex-1"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Hero Description Text</label>
                  <textarea
                    rows={3}
                    value={homeHeroDesc}
                    onChange={(e) => setHomeHeroDesc(e.target.value)}
                    className="px-3 py-2 text-xs bg-gray-50 border border-gray-200 focus:border-brand-blue rounded-lg outline-none resize-none leading-relaxed"
                  />
                </div>
                <button
                  onClick={() => handleSaveConfig({
                    home_hero_subtitle: homeHeroSubtitle,
                    home_hero_title: homeHeroTitle,
                    home_hero_title_color: homeHeroTitleColor,
                    home_hero_title_highlight_color: homeHeroTitleHighlightColor,
                    home_hero_desc: homeHeroDesc
                  })}
                  className="px-4 py-2 bg-brand-blue hover:bg-brand-navy text-white text-[10px] font-bold uppercase tracking-wider rounded-lg flex items-center gap-1.5 transition"
                >
                  <Save size={12} />
                  <span>Update Home Hero</span>
                </button>
              </div>
            </div>

            {/* ABOUT US HERO & MISSION */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 space-y-4">
              <h3 className="font-display font-bold text-sm text-brand-blue border-b border-gray-50 pb-2">
                About Page Contents
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">About Hero Title</label>
                    <input
                      type="text"
                      value={aboutHeroTitle}
                      onChange={(e) => setAboutHeroTitle(e.target.value)}
                      className="px-3 py-2 text-xs bg-gray-50 border border-gray-200 focus:border-brand-blue rounded-lg outline-none"
                    />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">About Mission Title</label>
                    <input
                      type="text"
                      value={aboutMissionTitle}
                      onChange={(e) => setAboutMissionTitle(e.target.value)}
                      className="px-3 py-2 text-xs bg-gray-50 border border-gray-200 focus:border-brand-blue rounded-lg outline-none"
                    />
                  </div>
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">About Hero Description</label>
                  <textarea
                    rows={2}
                    value={aboutHeroDesc}
                    onChange={(e) => setAboutHeroDesc(e.target.value)}
                    className="px-3 py-2 text-xs bg-gray-50 border border-gray-200 focus:border-brand-blue rounded-lg outline-none resize-none"
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Core Mission Text Copy (Use double line breaks to split paragraphs)</label>
                  <textarea
                    rows={6}
                    value={aboutMissionText}
                    onChange={(e) => setAboutMissionText(e.target.value)}
                    className="px-3 py-2 text-xs bg-gray-50 border border-gray-200 focus:border-brand-blue rounded-lg outline-none leading-relaxed font-sans"
                  />
                </div>
                <button
                  onClick={() => handleSaveConfig({
                    about_hero_title: aboutHeroTitle,
                    about_hero_desc: aboutHeroDesc,
                    about_mission_title: aboutMissionTitle,
                    about_mission_text: aboutMissionText
                  })}
                  className="px-4 py-2 bg-brand-blue hover:bg-brand-navy text-white text-[10px] font-bold uppercase tracking-wider rounded-lg flex items-center gap-1.5 transition"
                >
                  <Save size={12} />
                  <span>Update About Copy</span>
                </button>
              </div>
            </div>

            {/* WHAT WE DO PAGE */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 space-y-4">
              <h3 className="font-display font-bold text-sm text-brand-blue border-b border-gray-50 pb-2">
                What We Do Page Copy
              </h3>
              <div className="space-y-4">
                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Services Page Header Title</label>
                  <input
                    type="text"
                    value={whatWeDoTitle}
                    onChange={(e) => setWhatWeDoTitle(e.target.value)}
                    className="px-3 py-2 text-xs bg-gray-50 border border-gray-200 focus:border-brand-blue rounded-lg outline-none"
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Services Page Description</label>
                  <textarea
                    rows={2}
                    value={whatWeDoDesc}
                    onChange={(e) => setWhatWeDoDesc(e.target.value)}
                    className="px-3 py-2 text-xs bg-gray-50 border border-gray-200 focus:border-brand-blue rounded-lg outline-none resize-none"
                  />
                </div>
                <button
                  onClick={() => handleSaveConfig({
                    what_we_do_title: whatWeDoTitle,
                    what_we_do_desc: whatWeDoDesc
                  })}
                  className="px-4 py-2 bg-brand-blue hover:bg-brand-navy text-white text-[10px] font-bold uppercase tracking-wider rounded-lg flex items-center gap-1.5 transition"
                >
                  <Save size={12} />
                  <span>Update Services Page Copy</span>
                </button>
              </div>
            </div>

          </div>

          {/* SIDEBAR: Security Settings */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 space-y-4 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-brand-crimson" />
              <h3 className="font-display font-bold text-sm text-brand-blue flex items-center gap-1.5 pb-2 border-b border-gray-50">
                <Lock size={14} className="text-brand-crimson" />
                <span>Security Credentials</span>
              </h3>
              
              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Change Admin Password</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Type new password"
                    className="px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 focus:border-brand-blue rounded-lg outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-brand-crimson hover:bg-red-800 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg flex items-center justify-center gap-1 transition"
                >
                  <Save size={11} />
                  <span>Update Credentials</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: MEDIA EDITOR */}
      {activeAdminTab === "media_editor" && (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 space-y-8 animate-in fade-in duration-200">
          <div className="border-b border-gray-50 pb-3">
            <h3 className="font-display font-bold text-sm text-brand-blue">
              Logo & Hero Image Placements
            </h3>
            <p className="text-[11px] text-gray-400">
              Select image files (PNG, JPG, SVG) from your computer to replace key assets instantly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* LOGO IMAGE */}
            <div className="p-6 border border-gray-100 rounded-2xl space-y-5 flex flex-col justify-between">
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">Website Logo</h4>
                <p className="text-[11px] text-gray-500 font-sans leading-relaxed">
                  Upload an image to display across the header, footer, and brand frames. Leaving this empty or uploading a broken file automatically falls back to our vector silhouette baboon logo.
                </p>

                {/* Display Current Logo */}
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100/50 flex items-center justify-center space-x-4">
                  <div className="text-center">
                    <p className="text-[9px] font-bold text-gray-400 uppercase mb-2">Active Logo Preview</p>
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow border border-gray-100 overflow-hidden">
                      {logoUrl ? (
                        <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-xs text-gray-400 italic font-medium">Vector Default</div>
                      )}
                    </div>
                  </div>
                  {logoUrl && (
                    <button
                      onClick={() => {
                        setLogoUrl("");
                        handleSaveConfig({ logoUrl: "" });
                      }}
                      className="px-2 py-1 bg-red-50 text-brand-crimson rounded text-[9px] font-bold uppercase hover:bg-red-100"
                    >
                      Reset Default
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block w-full py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 hover:text-brand-blue border border-dashed border-gray-300 rounded-xl text-center text-[10px] font-bold uppercase tracking-wider cursor-pointer transition">
                  <span>Browse Logo Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, "logoUrl")}
                  />
                </label>
              </div>
            </div>

            {/* HERO MAIN IMAGE */}
            <div className="p-6 border border-gray-100 rounded-2xl space-y-5 flex flex-col justify-between">
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">Hero Main Background Image</h4>
                <p className="text-[11px] text-gray-500 font-sans leading-relaxed">
                  Upload an image to place on the right-hand hero frame (currently showing the Lagos Lekki Link Bridge).
                </p>

                {/* Display Current Hero Image */}
                <div className="space-y-2">
                  <p className="text-[9px] font-bold text-gray-400 uppercase">Active Hero Image Frame</p>
                  <div className="w-full h-24 bg-gray-100 rounded-xl overflow-hidden border border-gray-100 relative shadow-inner">
                    <img src={lagosBridgeUrl} alt="Hero bg" className="w-full h-full object-cover object-center" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block w-full py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 hover:text-brand-blue border border-dashed border-gray-300 rounded-xl text-center text-[10px] font-bold uppercase tracking-wider cursor-pointer transition">
                  <span>Browse Hero Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, "lagosBridgeUrl")}
                  />
                </label>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 4: VENTURES & SERVICES */}
      {activeAdminTab === "ventures_services" && (
        <div className="space-y-8 animate-in fade-in duration-200">
          
          {/* FLAGSHIP VENTURES EDITOR */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 space-y-6">
            <div className="border-b border-gray-50 pb-3 flex justify-between items-center">
              <div>
                <h3 className="font-display font-bold text-sm text-brand-blue">
                  Flagship Ventures Portfolio Editor
                </h3>
                <p className="text-[11px] text-gray-400">
                  Update name, taglines, and core descriptions for the 4 primary spin-offs.
                </p>
              </div>
              <button
                onClick={() => handleSaveConfig({ ventures })}
                className="px-4 py-2 bg-brand-crimson hover:bg-red-800 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg flex items-center gap-1 transition shadow"
              >
                <Save size={12} />
                <span>Save Venture Changes</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ventures.map((v, idx) => (
                <div key={v.id} className="p-5 bg-gray-50/50 border border-gray-100 rounded-2xl space-y-3.5">
                  <div className="flex items-center space-x-2">
                    <span className="w-5 h-5 rounded-full bg-brand-blue text-white flex items-center justify-center text-[10px] font-black">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-black text-brand-blue uppercase">Venture ID: {v.id}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex flex-col space-y-1">
                      <label className="text-[9px] font-bold text-gray-400 uppercase">Venture Name</label>
                      <input
                        type="text"
                        value={v.name}
                        onChange={(e) => handleUpdateVentureField(idx, "name", e.target.value)}
                        className="px-3 py-1.5 text-xs bg-white border border-gray-200 focus:border-brand-blue rounded outline-none font-bold"
                      />
                    </div>
                    <div className="flex flex-col space-y-1">
                      <label className="text-[9px] font-bold text-gray-400 uppercase">Slogan/Tagline</label>
                      <input
                        type="text"
                        value={v.tagline}
                        onChange={(e) => handleUpdateVentureField(idx, "tagline", e.target.value)}
                        className="px-3 py-1.5 text-xs bg-white border border-gray-200 focus:border-brand-blue rounded outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col space-y-1">
                    <label className="text-[9px] font-bold text-gray-400 uppercase">Short Description (Cards)</label>
                    <textarea
                      rows={2}
                      value={v.description}
                      onChange={(e) => handleUpdateVentureField(idx, "description", e.target.value)}
                      className="px-3 py-1.5 text-xs bg-white border border-gray-200 focus:border-brand-blue rounded outline-none resize-none leading-relaxed"
                    />
                  </div>

                  <div className="flex flex-col space-y-1">
                    <label className="text-[9px] font-bold text-gray-400 uppercase">Detailed Operational breakdown</label>
                    <textarea
                      rows={4}
                      value={v.fullDetails}
                      onChange={(e) => handleUpdateVentureField(idx, "fullDetails", e.target.value)}
                      className="px-3 py-1.5 text-xs bg-white border border-gray-200 focus:border-brand-blue rounded outline-none leading-relaxed"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SERVICE PILLARS EDITOR */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 space-y-6">
            <div className="border-b border-gray-50 pb-3 flex justify-between items-center">
              <div>
                <h3 className="font-display font-bold text-sm text-brand-blue">
                  Pillars & Services Offerings Editor
                </h3>
                <p className="text-[11px] text-gray-400">
                  Update descriptions and titles of corporate operational frameworks.
                </p>
              </div>
              <button
                onClick={() => handleSaveConfig({ services })}
                className="px-4 py-2 bg-brand-crimson hover:bg-red-800 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg flex items-center gap-1 transition shadow"
              >
                <Save size={12} />
                <span>Save Service Changes</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {services.map((s, idx) => (
                <div key={s.id} className="p-5 bg-gray-50/50 border border-gray-100 rounded-2xl space-y-3.5">
                  <div className="flex items-center space-x-2">
                    <span className="w-5 h-5 rounded-full bg-brand-crimson text-white flex items-center justify-center text-[10px] font-black">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-black text-brand-blue uppercase">Service ID: {s.id}</span>
                  </div>

                  <div className="flex flex-col space-y-1">
                    <label className="text-[9px] font-bold text-gray-400 uppercase">Service Pillar Title</label>
                    <input
                      type="text"
                      value={s.title}
                      onChange={(e) => handleUpdateServiceField(idx, "title", e.target.value)}
                      className="px-3 py-1.5 text-xs bg-white border border-gray-200 focus:border-brand-blue rounded outline-none font-bold"
                    />
                  </div>

                  <div className="flex flex-col space-y-1">
                    <label className="text-[9px] font-bold text-gray-400 uppercase">Short Description</label>
                    <textarea
                      rows={2}
                      value={s.shortDesc}
                      onChange={(e) => handleUpdateServiceField(idx, "shortDesc", e.target.value)}
                      className="px-3 py-1.5 text-xs bg-white border border-gray-200 focus:border-brand-blue rounded outline-none resize-none leading-relaxed"
                    />
                  </div>

                  <div className="flex flex-col space-y-1">
                    <label className="text-[9px] font-bold text-gray-400 uppercase">Long Description Detail</label>
                    <textarea
                      rows={4}
                      value={s.longDesc}
                      onChange={(e) => handleUpdateServiceField(idx, "longDesc", e.target.value)}
                      className="px-3 py-1.5 text-xs bg-white border border-gray-200 focus:border-brand-blue rounded outline-none leading-relaxed"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 5: FOOTER & CHAT SUPPORT */}
      {activeAdminTab === "footer_editor" && (
        <div className="space-y-8 animate-in fade-in duration-200">
          
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 space-y-6">
            <div className="border-b border-gray-50 pb-3 flex justify-between items-center">
              <div>
                <h3 className="font-display font-bold text-sm text-brand-blue">
                  Footer & Support Configuration
                </h3>
                <p className="text-[11px] text-gray-400">
                  Update customer support channels, footer branding text, and customizable navigation links.
                </p>
              </div>
              <button
                onClick={() => handleSaveConfig({
                  whatsapp_number: whatsappNumber,
                  footer_tagline: footerTagline,
                  footer_desc: footerDesc,
                  footer_email: footerEmail,
                  footer_phone: footerPhone,
                  footer_address: footerAddress,
                  footer_linkedin: footerLinkedin,
                  footer_twitter: footerTwitter,
                  footer_facebook: footerFacebook,
                  footer_instagram: footerInstagram,
                  footer_quick_links: footerQuickLinks,
                  footer_ventures_links: footerVenturesLinks
                })}
                className="px-4 py-2 bg-brand-crimson hover:bg-red-800 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg flex items-center gap-1 transition shadow"
              >
                <Save size={12} />
                <span>Save All Footer Settings</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* SUPPORT & WHATSAPP */}
              <div className="space-y-4 p-5 bg-gray-50/50 border border-gray-100 rounded-2xl">
                <h4 className="text-xs font-black text-brand-blue uppercase border-b border-gray-100 pb-2">
                  Customer Helpdesk Channels
                </h4>
                
                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">WhatsApp Helpdesk Number</label>
                  <input
                    type="text"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    placeholder="e.g. +2348123456789"
                    className="px-3 py-2 text-xs bg-white border border-gray-200 focus:border-brand-blue rounded-lg outline-none font-bold"
                  />
                  <span className="text-[9px] text-gray-400 font-sans leading-normal">
                    This is the destination helpdesk number. When Companion AI cannot resolve an inquiry, it automatically routes users to WhatsApp with a link: <code>https://wa.me/&lt;number&gt;</code>.
                  </span>
                </div>

                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Contact Email</label>
                  <input
                    type="email"
                    value={footerEmail}
                    onChange={(e) => setFooterEmail(e.target.value)}
                    placeholder="info@metaspaceconsulting.com"
                    className="px-3 py-2 text-xs bg-white border border-gray-200 focus:border-brand-blue rounded-lg outline-none"
                  />
                </div>

                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Contact Phone</label>
                  <input
                    type="text"
                    value={footerPhone}
                    onChange={(e) => setFooterPhone(e.target.value)}
                    placeholder="+234 812 345 6789"
                    className="px-3 py-2 text-xs bg-white border border-gray-200 focus:border-brand-blue rounded-lg outline-none"
                  />
                </div>

                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Office Physical Address</label>
                  <input
                    type="text"
                    value={footerAddress}
                    onChange={(e) => setFooterAddress(e.target.value)}
                    placeholder="Benin City, Edo State, Nigeria"
                    className="px-3 py-2 text-xs bg-white border border-gray-200 focus:border-brand-blue rounded-lg outline-none"
                  />
                </div>
              </div>

              {/* FOOTER BRANDING COPY */}
              <div className="space-y-4 p-5 bg-gray-50/50 border border-gray-100 rounded-2xl">
                <h4 className="text-xs font-black text-brand-blue uppercase border-b border-gray-100 pb-2">
                  Footer Brand Statements
                </h4>
                
                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Footer Primary Tagline</label>
                  <input
                    type="text"
                    value={footerTagline}
                    onChange={(e) => setFooterTagline(e.target.value)}
                    className="px-3 py-2 text-xs bg-white border border-gray-200 focus:border-brand-blue rounded-lg outline-none"
                  />
                </div>

                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Footer Narrative Description</label>
                  <textarea
                    rows={4}
                    value={footerDesc}
                    onChange={(e) => setFooterDesc(e.target.value)}
                    className="px-3 py-2 text-xs bg-white border border-gray-200 focus:border-brand-blue rounded-lg outline-none resize-none leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col space-y-1">
                    <label className="text-[9px] font-bold text-gray-400 uppercase">LinkedIn Profile</label>
                    <input
                      type="text"
                      value={footerLinkedin}
                      onChange={(e) => setFooterLinkedin(e.target.value)}
                      placeholder="https://..."
                      className="px-3 py-1.5 text-xs bg-white border border-gray-200 rounded outline-none"
                    />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <label className="text-[9px] font-bold text-gray-400 uppercase">Twitter Profile</label>
                    <input
                      type="text"
                      value={footerTwitter}
                      onChange={(e) => setFooterTwitter(e.target.value)}
                      placeholder="https://..."
                      className="px-3 py-1.5 text-xs bg-white border border-gray-200 rounded outline-none"
                    />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <label className="text-[9px] font-bold text-gray-400 uppercase">Facebook Profile</label>
                    <input
                      type="text"
                      value={footerFacebook}
                      onChange={(e) => setFooterFacebook(e.target.value)}
                      placeholder="https://..."
                      className="px-3 py-1.5 text-xs bg-white border border-gray-200 rounded outline-none"
                    />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <label className="text-[9px] font-bold text-gray-400 uppercase">Instagram Profile</label>
                    <input
                      type="text"
                      value={footerInstagram}
                      onChange={(e) => setFooterInstagram(e.target.value)}
                      placeholder="https://..."
                      className="px-3 py-1.5 text-xs bg-white border border-gray-200 rounded outline-none"
                    />
                  </div>
                </div>
              </div>

            </div>

            {/* NAVIGATION LINKS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              
              {/* QUICK LINKS SECTION */}
              <div className="space-y-4 p-5 bg-gray-50/50 border border-gray-100 rounded-2xl">
                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                  <h4 className="text-xs font-black text-brand-blue uppercase">
                    Footer Quick Links List
                  </h4>
                  <button
                    onClick={() => setFooterQuickLinks([
                      { label: "About Us", tab: "about" },
                      { label: "What We Do", tab: "what-we-do" },
                      { label: "Our Ventures", tab: "ventures" },
                      { label: "Insights", tab: "insights" },
                      { label: "Contact Us", tab: "contact" }
                    ])}
                    className="text-[9px] font-bold text-brand-crimson hover:underline"
                  >
                    Reset Defaults
                  </button>
                </div>
                
                <div className="space-y-3">
                  {footerQuickLinks.map((link, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-gray-400 w-12 shrink-0">Item {idx + 1}:</span>
                      <input
                        type="text"
                        value={link.label}
                        onChange={(e) => {
                          const updated = [...footerQuickLinks];
                          updated[idx].label = e.target.value;
                          setFooterQuickLinks(updated);
                        }}
                        placeholder="Link label"
                        className="px-2.5 py-1.5 text-xs bg-white border border-gray-200 focus:border-brand-blue rounded-md outline-none flex-1"
                      />
                      <select
                        value={link.tab}
                        onChange={(e) => {
                          const updated = [...footerQuickLinks];
                          updated[idx].tab = e.target.value;
                          setFooterQuickLinks(updated);
                        }}
                        className="px-2 py-1.5 text-xs bg-white border border-gray-200 rounded-md outline-none w-32"
                      >
                        <option value="home">Home</option>
                        <option value="about">About Us</option>
                        <option value="what-we-do">What We Do</option>
                        <option value="ventures">Our Ventures</option>
                        <option value="insights">Insights</option>
                        <option value="contact">Contact Us</option>
                      </select>
                    </div>
                  ))}
                  {footerQuickLinks.length === 0 && (
                    <p className="text-xs text-gray-400 italic">No quick links defined. Click reset defaults or load configuration.</p>
                  )}
                </div>
              </div>

              {/* OUR VENTURES SECTION */}
              <div className="space-y-4 p-5 bg-gray-50/50 border border-gray-100 rounded-2xl">
                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                  <h4 className="text-xs font-black text-brand-blue uppercase">
                    Footer Ventures Links List
                  </h4>
                  <button
                    onClick={() => setFooterVenturesLinks([
                      { label: "Ugbekun Platform", tab: "ventures" },
                      { label: "Oghowa Accelerator", tab: "ventures" },
                      { label: "EduRide Logistics", tab: "ventures" },
                      { label: "Cyona Medicare", tab: "ventures" }
                    ])}
                    className="text-[9px] font-bold text-brand-crimson hover:underline"
                  >
                    Reset Defaults
                  </button>
                </div>

                <div className="space-y-3">
                  {footerVenturesLinks.map((link, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-gray-400 w-12 shrink-0">Item {idx + 1}:</span>
                      <input
                        type="text"
                        value={link.label}
                        onChange={(e) => {
                          const updated = [...footerVenturesLinks];
                          updated[idx].label = e.target.value;
                          setFooterVenturesLinks(updated);
                        }}
                        placeholder="Venture label"
                        className="px-2.5 py-1.5 text-xs bg-white border border-gray-200 focus:border-brand-blue rounded-md outline-none flex-1"
                      />
                      <select
                        value={link.tab}
                        onChange={(e) => {
                          const updated = [...footerVenturesLinks];
                          updated[idx].tab = e.target.value;
                          setFooterVenturesLinks(updated);
                        }}
                        className="px-2 py-1.5 text-xs bg-white border border-gray-200 rounded-md outline-none w-32"
                      >
                        <option value="home">Home</option>
                        <option value="about">About Us</option>
                        <option value="what-we-do">What We Do</option>
                        <option value="ventures">Our Ventures</option>
                        <option value="insights">Insights</option>
                        <option value="contact">Contact Us</option>
                      </select>
                    </div>
                  ))}
                  {footerVenturesLinks.length === 0 && (
                    <p className="text-xs text-gray-400 italic">No ventures links defined. Click reset defaults or load configuration.</p>
                  )}
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}
