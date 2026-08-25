import React, { useState, useEffect } from "react";
import { 
  ShieldCheck, RefreshCw, Calendar, Mail, FileText, CheckCircle, Clock, 
  Trash2, Plus, ArrowRight, Loader2, Sparkles, Image as ImageIcon, 
  Settings, Lock, KeyRound, Save, Edit3, HelpCircle, Eye, EyeOff, AlertCircle,
  Briefcase, UserPlus, UserCheck, UserX, Users, Database, Send
} from "lucide-react";
import { Consultation, ContactInquiry, Venture, ServiceOffer, ClientLogo } from "../types";
import { CLIENT_LOGOS_DATA } from "../data";
import { 
  apiFetchSiteConfig, apiSaveSiteConfig, apiLoginAdmin, 
  apiFetchConsultations, apiFetchInquiries,
  apiFetchAdminUsers, apiAddAdminUser, apiDeleteAdminUser
} from "../lib/apiFallback";
import { testFirestoreConnection } from "../lib/firebase";

export default function AdminDashboard() {
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [authError, setAuthError] = useState("");

  // UI Tabs inside Admin: "ledger" | "text_editor" | "media_editor" | "ventures_services" | "footer_editor" | "admin_security"
  const [activeAdminTab, setActiveAdminTab] = useState<"ledger" | "text_editor" | "media_editor" | "ventures_services" | "footer_editor" | "admin_security">("ledger");

  // Admin Users Management States
  const [adminUsers, setAdminUsers] = useState<{ username: string; isSuperadmin: boolean }[]>([]);
  const [newAdminUsername, setNewAdminUsername] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const [newAdminIsSuperadmin, setNewAdminIsSuperadmin] = useState(false);

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
  const [clientLogos, setClientLogos] = useState<ClientLogo[]>(CLIENT_LOGOS_DATA);

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

  // Username and Password fields
  const [username, setUsername] = useState(() => localStorage.getItem("metaspace_admin_username") || "");
  const [newPassword, setNewPassword] = useState("");

  // Live DB & Email state
  const [dbTab, setDbTab] = useState<"firebase" | "supabase" | "mysql">("firebase");
  const [firestoreTestResult, setFirestoreTestResult] = useState("");
  const [isTestingFirestore, setIsTestingFirestore] = useState(false);

  const [mysqlHost, setMysqlHost] = useState("");
  const [mysqlPort, setMysqlPort] = useState("3306");
  const [mysqlUser, setMysqlUser] = useState("");
  const [mysqlPassword, setMysqlPassword] = useState("");
  const [mysqlDatabase, setMysqlDatabase] = useState("");
  const [mysqlTestResult, setMysqlTestResult] = useState("");
  const [isTestingMysql, setIsTestingMysql] = useState(false);

  const [supabaseUrl, setSupabaseUrl] = useState("");
  const [supabaseKey, setSupabaseKey] = useState("");
  const [isSupabase, setIsSupabase] = useState(false);
  const [dbTestResult, setDbTestResult] = useState("");
  const [isTestingDb, setIsTestingDb] = useState(false);

  const [resendApiKey, setResendApiKey] = useState("");
  const [notificationEmail, setNotificationEmail] = useState("");
  const [emailTestResult, setEmailTestResult] = useState("");
  const [isTestingEmail, setIsTestingEmail] = useState(false);

  // Ensure Admin console is locked on load unless authenticated explicitly in current session
  useEffect(() => {
    // Clear legacy auto-login credentials so console is locked securely by default
    localStorage.removeItem("metaspace_admin_token");
    localStorage.removeItem("metaspace_admin_password");
    setIsAuthenticated(false);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPwd = password.trim();
    if (!cleanPwd) {
      setAuthError("Please provide the administrator password to unlock the console.");
      return;
    }

    setIsLoggingIn(true);
    setAuthError("");

    try {
      const cleanUser = (username || "admin").trim();
      const result = await apiLoginAdmin(cleanUser, cleanPwd);
      if (result.success) {
        setIsAuthenticated(true);
        setPassword(cleanPwd);
        setUsername(cleanUser);
        fetchAdminData(cleanPwd);
      } else {
        setAuthError(result.error || "Incorrect administrator password. Access denied.");
      }
    } catch (err) {
      setAuthError("Server connection failed. Please try again.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("metaspace_admin_token");
    localStorage.removeItem("metaspace_admin_password");
    localStorage.removeItem("metaspace_admin_username");
    setIsAuthenticated(false);
    setPassword("");
    setAuthError("");
    setMessage("");
  };

  const fetchAdminData = async (pwd = password) => {
    setIsLoading(true);
    try {
      // Fetch dynamic content and submissions seamlessly
      const [consultsData, inqsData, configData, usersData] = await Promise.all([
        apiFetchConsultations(),
        apiFetchInquiries(),
        apiFetchSiteConfig(),
        apiFetchAdminUsers(pwd)
      ]);

      setConsultations(consultsData);
      setInquiries(inqsData);
      if (usersData) setAdminUsers(usersData);

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
        if (d.clientLogos && Array.isArray(d.clientLogos) && d.clientLogos.length > 0) {
          setClientLogos(d.clientLogos);
        } else if (d.client_logos && Array.isArray(d.client_logos) && d.client_logos.length > 0) {
          setClientLogos(d.client_logos);
        } else {
          setClientLogos(CLIENT_LOGOS_DATA);
        }
        setIsMySQL(d.isMySQL || false);
        setIsSupabase(d.isSupabase || false);

        setSupabaseUrl(d.supabase_url || "");
        setSupabaseKey(d.supabase_key || "");
        setResendApiKey(d.resend_api_key || "");
        setNotificationEmail(d.notification_email || d.footer_email || "info@metaspaceconsulting.com");

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

  const handleAddAdminUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminUsername.trim()) return;
    setIsLoading(true);
    setMessage("");
    setErrMessage("");
    try {
      const res = await apiAddAdminUser(password, {
        username: newAdminUsername.trim(),
        password: newAdminPassword.trim() || undefined,
        isSuperadmin: newAdminIsSuperadmin
      });
      if (res.success) {
        setMessage(`Administrator account for "${newAdminUsername.trim()}" created/updated successfully!`);
        setNewAdminUsername("");
        setNewAdminPassword("");
        if (res.users) setAdminUsers(res.users);
        setTimeout(() => setMessage(""), 4000);
      } else {
        setErrMessage(res.error || "Failed to add administrator.");
      }
    } catch (err: any) {
      setErrMessage("Error processing administrator creation.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRevokeAdminUser = async (targetUsername: string) => {
    if (!window.confirm(`Are you sure you want to revoke access for administrator "${targetUsername}"?`)) return;
    setIsLoading(true);
    setMessage("");
    setErrMessage("");
    try {
      const res = await apiDeleteAdminUser(password, targetUsername);
      if (res.success) {
        setMessage(`Revoked access for administrator "${targetUsername}".`);
        if (res.users) setAdminUsers(res.users);
        setTimeout(() => setMessage(""), 4000);
      } else {
        setErrMessage(res.error || "Failed to revoke administrator access.");
      }
    } catch (err: any) {
      setErrMessage("Error revoking access.");
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

  const handleTestFirestore = async () => {
    setIsTestingFirestore(true);
    setFirestoreTestResult("Testing connection to Firebase Firestore...");
    try {
      const res = await testFirestoreConnection();
      if (res.success) {
        setFirestoreTestResult(`🟢 Connected! Database: ${res.databaseId} (Ping: ${res.latencyMs}ms). Collections active: Site Config, Consultations, Contact Inquiries, Ventures.`);
      } else {
        setFirestoreTestResult(`🔴 ${res.message}`);
      }
    } catch (err: any) {
      setFirestoreTestResult(`🔴 Firestore error: ${err.message || String(err)}`);
    } finally {
      setIsTestingFirestore(false);
    }
  };

  const handleTestMySQL = async () => {
    if (!mysqlHost || !mysqlUser || !mysqlDatabase) {
      setMysqlTestResult("🔴 Please fill in MySQL Host, User, and Database name before testing.");
      return;
    }
    setIsTestingMysql(true);
    setMysqlTestResult(`Testing live TCP connection to MySQL server at ${mysqlHost}:${mysqlPort}...`);
    try {
      const res = await fetch("/api/admin/test-mysql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          host: mysqlHost.trim(),
          port: Number(mysqlPort) || 3306,
          user: mysqlUser.trim(),
          password: mysqlPassword,
          database: mysqlDatabase.trim()
        })
      });
      const data = await res.json();
      if (data.success) {
        setMysqlTestResult(`🟢 ${data.message}`);
      } else {
        setMysqlTestResult(`🔴 ${data.error || "MySQL test failed."}`);
      }
    } catch (err: any) {
      setMysqlTestResult(`🔴 Error connecting to MySQL: ${err.message || String(err)}`);
    } finally {
      setIsTestingMysql(false);
    }
  };

  const handleTestSupabase = async () => {
    if (!supabaseUrl || !supabaseKey) {
      setDbTestResult("🔴 Please fill in both Supabase Project URL and Key before testing.");
      return;
    }
    setIsTestingDb(true);
    setDbTestResult("Testing live connection to Supabase database...");
    try {
      const res = await fetch("/api/admin/test-db", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ supabaseUrl: supabaseUrl.trim(), supabaseKey: supabaseKey.trim() })
      });
      
      const rawText = await res.text();
      let data: any = {};
      try {
        data = JSON.parse(rawText);
      } catch {
        const cleanMsg = rawText.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, 160);
        setDbTestResult(`🔴 Server response (${res.status}): ${cleanMsg || "Server returned non-JSON response."}`);
        return;
      }

      if (data.success) {
        setDbTestResult(`🟢 ${data.message}`);
        handleSaveConfig({ supabase_url: supabaseUrl.trim(), supabase_key: supabaseKey.trim() });
      } else {
        setDbTestResult(`🔴 ${data.message || data.error || "Database connection test failed."}`);
      }
    } catch (err: any) {
      setDbTestResult(`🔴 Error connecting: ${err.message || String(err)}`);
    } finally {
      setIsTestingDb(false);
    }
  };

  const handleTestEmail = async () => {
    if (!resendApiKey) {
      setEmailTestResult("🔴 Please enter your Resend API Key before testing.");
      return;
    }
    setIsTestingEmail(true);
    setEmailTestResult("Transmitting branded test email via Resend API...");
    try {
      const res = await fetch("/api/admin/test-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apiKey: resendApiKey.trim(),
          recipientEmail: notificationEmail || footerEmail || "info@metaspaceconsulting.com"
        })
      });

      const rawText = await res.text();
      let data: any = {};
      try {
        data = JSON.parse(rawText);
      } catch {
        const cleanMsg = rawText.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, 160);
        setEmailTestResult(`🔴 Server response (${res.status}): ${cleanMsg || "Server returned non-JSON response."}`);
        return;
      }

      if (data.success) {
        setEmailTestResult(`🟢 ${data.message}`);
        handleSaveConfig({ resend_api_key: resendApiKey.trim(), notification_email: notificationEmail });
      } else {
        setEmailTestResult(`🔴 ${data.error || "Failed to transmit test email."}`);
      }
    } catch (err: any) {
      setEmailTestResult(`🔴 Error: ${err.message || String(err)}`);
    } finally {
      setIsTestingEmail(false);
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

  const handleAddVenture = () => {
    const newV: Venture = {
      id: "venture-" + Math.random().toString(36).substr(2, 6),
      name: "New Venture",
      tagline: "Venture Slogan",
      description: "Brief overview of the new venture.",
      fullDetails: "Detailed operational and architectural breakdown of this venture.",
      iconName: "rocket",
      color: "from-brand-blue to-brand-navy",
      url: "https://www.metaspaceconsult.com",
      stats: [
        { label: "Active Users", value: "1,000+" },
        { label: "Growth Rate", value: "45%" }
      ],
      impactPoints: [
        "Scalable technology architecture.",
        "Sustainable economic transformation."
      ],
      founderQuote: "Innovation driven by deep execution."
    };
    const updated = [...ventures, newV];
    setVentures(updated);
    handleSaveConfig({ ventures: updated });
  };

  const handleDeleteVenture = (index: number) => {
    if (!window.confirm("Are you sure you want to remove this venture from the portfolio?")) return;
    const updated = ventures.filter((_, i) => i !== index);
    setVentures(updated);
    handleSaveConfig({ ventures: updated });
  };

  const handleUpdateServiceField = (index: number, key: keyof ServiceOffer, val: any) => {
    const list = [...services];
    list[index] = { ...list[index], [key]: val };
    setServices(list);
  };

  // CLIENT LOGOS HANDLERS
  const handleAddClientLogo = () => {
    const newLogo: ClientLogo = {
      id: "client-" + Math.random().toString(36).substr(2, 6),
      name: "New Partner / Client",
      logoUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=200&auto=format&fit=crop"
    };
    const updated = [...clientLogos, newLogo];
    setClientLogos(updated);
    handleSaveConfig({ clientLogos: updated });
    setMessage("New client logo added successfully!");
  };

  const handleUpdateClientLogoField = (index: number, key: keyof ClientLogo, val: string) => {
    const list = [...clientLogos];
    list[index] = { ...list[index], [key]: val };
    setClientLogos(list);
  };

  const handleDeleteClientLogo = (index: number) => {
    const logoName = clientLogos[index]?.name || "this client logo";
    if (!window.confirm(`Are you sure you want to remove "${logoName}" from the carousel?`)) return;
    const updated = clientLogos.filter((_, i) => i !== index);
    setClientLogos(updated);
    handleSaveConfig({ clientLogos: updated });
    setMessage(`Removed "${logoName}" from client carousel.`);
  };

  const handleUploadClientLogoFile = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (loadEvt) => {
      const result = loadEvt.target?.result as string;
      if (result) {
        const list = [...clientLogos];
        list[index] = { ...list[index], logoUrl: result };
        setClientLogos(list);
        handleSaveConfig({ clientLogos: list });
        setMessage(`Uploaded custom logo for "${list[index].name}"!`);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleResetDefaultClientLogos = () => {
    if (!window.confirm("Reset client logos back to original institutional partners?")) return;
    setClientLogos(CLIENT_LOGOS_DATA);
    handleSaveConfig({ clientLogos: CLIENT_LOGOS_DATA });
    setMessage("Client logos reset to default showcase.");
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
                Username / Admin ID
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter administrator username"
                  className="w-full pl-9 pr-3 py-3 text-xs bg-gray-50 border border-gray-200 focus:border-brand-blue rounded-xl focus:bg-white focus:outline-none transition font-semibold"
                />
                <ShieldCheck size={13} className="absolute left-3.5 top-3.5 text-gray-400" />
              </div>
            </div>

            <div className="flex flex-col space-y-1 text-left">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Administrator Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter administrator password"
                  className="w-full pl-9 pr-10 py-3 text-xs bg-gray-50 border border-gray-200 focus:border-brand-blue rounded-xl focus:bg-white focus:outline-none transition font-semibold"
                />
                <KeyRound size={13} className="absolute left-3.5 top-3.5 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-brand-blue transition p-0.5"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 bg-brand-blue hover:bg-brand-navy text-white text-[11px] font-bold uppercase tracking-wider rounded-xl transition shadow flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {isLoggingIn ? <Loader2 size={13} className="animate-spin" /> : <ShieldCheck size={14} />}
              <span>Sign In to Console</span>
            </button>
          </form>
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
            Connected database: <strong className="text-brand-blue uppercase">{isSupabase ? "Supabase Cloud Database (Live 🟢)" : "Local Persistent JSON Ledger (Fallback 🟡)"}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-blue-50/80 border border-blue-100 rounded-xl text-[11px] font-bold text-brand-blue">
            <ShieldCheck size={13} className="text-brand-crimson" />
            <span>Admin: {username || "superadmin"}</span>
          </div>

          <button
            onClick={fetchAdminData}
            disabled={isLoading}
            className="px-3.5 py-2 bg-white border border-gray-200 text-gray-700 text-[10px] font-bold uppercase tracking-wider rounded-xl shadow-xs hover:bg-gray-50 flex items-center gap-1.5 transition cursor-pointer"
          >
            {isLoading ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />}
            <span>Sync DB</span>
          </button>
          
          <button
            onClick={handleLogout}
            className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-brand-crimson border border-red-200/80 text-[10px] font-bold uppercase tracking-wider rounded-xl flex items-center gap-1.5 transition cursor-pointer shadow-xs"
            title="Lock the console immediately"
          >
            <Lock size={12} />
            <span>Lock Console</span>
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
          { id: "media_editor", label: "Images & Client Logos", icon: <ImageIcon size={13} /> },
          { id: "ventures_services", label: "Ventures & Services", icon: <Briefcase size={13} /> },
          { id: "footer_editor", label: "Footer & Chat Support", icon: <Settings size={13} /> },
          { id: "admin_security", label: "Admins & Access", icon: <Users size={13} /> }
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

          {/* SIDEBAR: Settings, DB & Email Cards */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* LIVE DATABASE HUB (FIREBASE FIRESTORE / SUPABASE / MYSQL) */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 space-y-4 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500" />
              <div className="flex items-center justify-between pb-2 border-b border-gray-50">
                <h3 className="font-display font-bold text-sm text-brand-blue flex items-center gap-1.5">
                  <Database size={14} className="text-amber-500" />
                  <span>Cloud Database & Storage</span>
                </h3>
                <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase rounded-full bg-emerald-100 text-emerald-700">
                  Firestore Ready 🟢
                </span>
              </div>

              {/* Database Engine Selector */}
              <div className="grid grid-cols-3 gap-1 bg-gray-100 p-1 rounded-xl text-[10px] font-bold">
                <button
                  type="button"
                  onClick={() => setDbTab("firebase")}
                  className={`py-1.5 rounded-lg transition text-center cursor-pointer ${
                    dbTab === "firebase"
                      ? "bg-white text-amber-600 shadow-xs font-black"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  🔥 Firebase
                </button>
                <button
                  type="button"
                  onClick={() => setDbTab("supabase")}
                  className={`py-1.5 rounded-lg transition text-center cursor-pointer ${
                    dbTab === "supabase"
                      ? "bg-white text-emerald-600 shadow-xs font-black"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  ⚡ Supabase
                </button>
                <button
                  type="button"
                  onClick={() => setDbTab("mysql")}
                  className={`py-1.5 rounded-lg transition text-center cursor-pointer ${
                    dbTab === "mysql"
                      ? "bg-white text-blue-600 shadow-xs font-black"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  🐬 MySQL
                </button>
              </div>

              {/* TAB 1: FIREBASE FIRESTORE */}
              {dbTab === "firebase" && (
                <div className="space-y-3">
                  <div className="p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-amber-900 uppercase">Provider</span>
                      <span className="text-[10px] font-mono font-bold text-amber-800">Google Cloud Firestore</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-amber-900 uppercase">Project</span>
                      <span className="text-[10px] font-mono text-gray-600 truncate max-w-[150px]">gen-lang-client-0889935436</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-amber-900 uppercase">Status</span>
                      <span className="text-[10px] font-bold text-emerald-600">Provisioned & Active 🟢</span>
                    </div>
                  </div>

                  {firestoreTestResult && (
                    <div className="p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs leading-relaxed font-sans">
                      {firestoreTestResult}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleTestFirestore}
                    disabled={isTestingFirestore}
                    className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs"
                  >
                    {isTestingFirestore ? <Loader2 size={12} className="animate-spin" /> : <Database size={12} />}
                    <span>{isTestingFirestore ? "Pinging Cloud Firestore..." : "Test Firestore Connection"}</span>
                  </button>
                </div>
              )}

              {/* TAB 2: SUPABASE */}
              {dbTab === "supabase" && (
                <div className="space-y-3">
                  <div className="flex flex-col space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Supabase Project URL</label>
                    <input
                      type="text"
                      value={supabaseUrl}
                      onChange={(e) => setSupabaseUrl(e.target.value)}
                      placeholder="https://xyz.supabase.co"
                      className="px-3 py-2 text-xs bg-gray-50 border border-gray-200 focus:border-brand-blue rounded-lg outline-none font-mono"
                    />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Supabase Service Key / Anon Key</label>
                    <input
                      type="password"
                      value={supabaseKey}
                      onChange={(e) => setSupabaseKey(e.target.value)}
                      placeholder="eyJhbGciOiJIUzI1NiI..."
                      className="px-3 py-2 text-xs bg-gray-50 border border-gray-200 focus:border-brand-blue rounded-lg outline-none font-mono"
                    />
                  </div>

                  {dbTestResult && (
                    <div className="p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs leading-relaxed font-sans">
                      {dbTestResult}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleTestSupabase}
                    disabled={isTestingDb}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    {isTestingDb ? <Loader2 size={12} className="animate-spin" /> : <Database size={12} />}
                    <span>{isTestingDb ? "Connecting..." : "Connect & Test Supabase DB"}</span>
                  </button>
                </div>
              )}

              {/* TAB 3: MYSQL SERVER */}
              {dbTab === "mysql" && (
                <div className="space-y-2.5">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2 flex flex-col space-y-1">
                      <label className="text-[9px] font-bold text-gray-400 uppercase">MySQL Host</label>
                      <input
                        type="text"
                        value={mysqlHost}
                        onChange={(e) => setMysqlHost(e.target.value)}
                        placeholder="e.g. localhost or 127.0.0.1"
                        className="px-2.5 py-1.5 text-xs bg-gray-50 border border-gray-200 focus:border-brand-blue rounded-lg outline-none font-mono"
                      />
                    </div>
                    <div className="flex flex-col space-y-1">
                      <label className="text-[9px] font-bold text-gray-400 uppercase">Port</label>
                      <input
                        type="text"
                        value={mysqlPort}
                        onChange={(e) => setMysqlPort(e.target.value)}
                        placeholder="3306"
                        className="px-2.5 py-1.5 text-xs bg-gray-50 border border-gray-200 focus:border-brand-blue rounded-lg outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col space-y-1">
                      <label className="text-[9px] font-bold text-gray-400 uppercase">Database User</label>
                      <input
                        type="text"
                        value={mysqlUser}
                        onChange={(e) => setMysqlUser(e.target.value)}
                        placeholder="metaspace_user"
                        className="px-2.5 py-1.5 text-xs bg-gray-50 border border-gray-200 focus:border-brand-blue rounded-lg outline-none font-mono"
                      />
                    </div>
                    <div className="flex flex-col space-y-1">
                      <label className="text-[9px] font-bold text-gray-400 uppercase">Database Name</label>
                      <input
                        type="text"
                        value={mysqlDatabase}
                        onChange={(e) => setMysqlDatabase(e.target.value)}
                        placeholder="metaspace_db"
                        className="px-2.5 py-1.5 text-xs bg-gray-50 border border-gray-200 focus:border-brand-blue rounded-lg outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col space-y-1">
                    <label className="text-[9px] font-bold text-gray-400 uppercase">MySQL Password</label>
                    <input
                      type="password"
                      value={mysqlPassword}
                      onChange={(e) => setMysqlPassword(e.target.value)}
                      placeholder="Enter MySQL password"
                      className="px-2.5 py-1.5 text-xs bg-gray-50 border border-gray-200 focus:border-brand-blue rounded-lg outline-none font-mono"
                    />
                  </div>

                  {mysqlTestResult && (
                    <div className="p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs leading-relaxed font-sans">
                      {mysqlTestResult}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleTestMySQL}
                    disabled={isTestingMysql}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    {isTestingMysql ? <Loader2 size={12} className="animate-spin" /> : <Database size={12} />}
                    <span>{isTestingMysql ? "Pinging MySQL..." : "Test MySQL Server Connection"}</span>
                  </button>
                </div>
              )}
            </div>

            {/* RESEND EMAIL NOTIFICATION INTEGRATION */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 space-y-4 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-brand-blue" />
              <h3 className="font-display font-bold text-sm text-brand-blue flex items-center gap-1.5 pb-2 border-b border-gray-50">
                <Mail size={14} className="text-brand-blue" />
                <span>Resend Email Dispatch</span>
              </h3>

              <div className="space-y-3">
                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Resend API Key</label>
                  <input
                    type="password"
                    value={resendApiKey}
                    onChange={(e) => setResendApiKey(e.target.value)}
                    placeholder="re_123456789..."
                    className="px-3 py-2 text-xs bg-gray-50 border border-gray-200 focus:border-brand-blue rounded-lg outline-none font-mono"
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Notification Target Email</label>
                  <input
                    type="email"
                    value={notificationEmail}
                    onChange={(e) => setNotificationEmail(e.target.value)}
                    placeholder="info@metaspaceconsulting.com"
                    className="px-3 py-2 text-xs bg-gray-50 border border-gray-200 focus:border-brand-blue rounded-lg outline-none"
                  />
                </div>

                {emailTestResult && (
                  <div className="p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs leading-relaxed font-sans">
                    {emailTestResult}
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleTestEmail}
                  disabled={isTestingEmail}
                  className="w-full py-2.5 bg-brand-blue hover:bg-brand-navy text-white text-[10px] font-bold uppercase tracking-wider rounded-lg flex items-center justify-center gap-1.5 transition"
                >
                  {isTestingEmail ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />}
                  <span>{isTestingEmail ? "Transmitting..." : "Test Resend Email Delivery"}</span>
                </button>
              </div>
            </div>

            {/* SECURITY CREDENTIALS */}
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
                      {logoUrl && logoUrl.trim() !== "" ? (
                        <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-xs text-gray-400 italic font-medium">Vector Default</div>
                      )}
                    </div>
                  </div>
                  {logoUrl && logoUrl.trim() !== "" && (
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
                    {lagosBridgeUrl && lagosBridgeUrl.trim() !== "" ? (
                      <img src={lagosBridgeUrl} alt="Hero bg" className="w-full h-full object-cover object-center" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-gray-400 italic">No Hero Image</div>
                    )}
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

          {/* CLIENT LOGOS CAROUSEL MANAGER */}
          <div className="pt-6 border-t border-gray-100 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-display font-bold text-sm text-brand-blue">
                    Client & Partner Logos Carousel
                  </h4>
                  <span className="px-2 py-0.5 bg-blue-50 text-brand-blue text-[10px] font-bold rounded-full">
                    {clientLogos.length} Active
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 font-sans mt-0.5">
                  Controls the infinite logo carousel on the Home page. Rendered at 50% opacity by default, 100% on mouse hover or click, with no hyperlink action.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleResetDefaultClientLogos}
                  className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl text-[10px] font-bold uppercase tracking-wider transition flex items-center gap-1.5"
                >
                  <RefreshCw size={11} />
                  <span>Reset Default Showcase</span>
                </button>
                <button
                  type="button"
                  onClick={handleAddClientLogo}
                  className="px-3 py-1.5 bg-brand-crimson hover:bg-red-700 text-white rounded-xl text-[10px] font-bold uppercase tracking-wider transition flex items-center gap-1.5 shadow-sm"
                >
                  <Plus size={12} />
                  <span>Add Client Logo</span>
                </button>
              </div>
            </div>

            {/* List of client logos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {clientLogos.map((client, index) => (
                <div
                  key={client.id || index}
                  className="p-4 bg-gray-50/70 border border-gray-100 rounded-2xl space-y-3 hover:border-gray-200 transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      Logo #{index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteClientLogo(index)}
                      className="p-1.5 text-gray-400 hover:text-brand-crimson hover:bg-red-50 rounded-lg transition"
                      title="Delete Client Logo"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>

                  <div className="flex items-start gap-4">
                    {/* Logo Image Preview & Upload Button */}
                    <div className="flex flex-col items-center gap-2 shrink-0">
                      <div className="w-14 h-14 bg-white rounded-xl border border-gray-200/80 shadow-sm flex items-center justify-center overflow-hidden p-1">
                        {client.logoUrl ? (
                          <img
                            src={client.logoUrl}
                            alt={client.name}
                            className="w-full h-full object-cover rounded-lg"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = "none";
                            }}
                          />
                        ) : (
                          <span className="text-[10px] font-bold text-gray-400 uppercase">
                            {client.name ? client.name.slice(0, 2) : "Logo"}
                          </span>
                        )}
                      </div>

                      <label className="px-2 py-1 bg-white hover:bg-gray-100 border border-gray-200 text-brand-blue rounded-lg text-[9px] font-bold uppercase tracking-wider cursor-pointer shadow-2xs transition text-center whitespace-nowrap">
                        <span>Upload File</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleUploadClientLogoFile(e, index)}
                        />
                      </label>
                    </div>

                    {/* Inputs */}
                    <div className="flex-1 space-y-2">
                      <div>
                        <label className="block text-[9px] font-bold text-gray-500 uppercase mb-0.5">
                          Partner / Client Name
                        </label>
                        <input
                          type="text"
                          value={client.name}
                          onChange={(e) => handleUpdateClientLogoField(index, "name", e.target.value)}
                          onBlur={() => handleSaveConfig({ clientLogos })}
                          placeholder="e.g. Edo Innovates Hub"
                          className="w-full text-xs font-semibold px-3 py-1.5 bg-white border border-gray-200 rounded-xl focus:border-brand-blue focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[9px] font-bold text-gray-500 uppercase mb-0.5">
                          Logo Image URL / Base64
                        </label>
                        <input
                          type="text"
                          value={client.logoUrl}
                          onChange={(e) => handleUpdateClientLogoField(index, "logoUrl", e.target.value)}
                          onBlur={() => handleSaveConfig({ clientLogos })}
                          placeholder="https://... or data:image/..."
                          className="w-full text-[10px] text-gray-600 px-3 py-1.5 bg-white border border-gray-200 rounded-xl focus:border-brand-blue focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Live Interactive Preview Box */}
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                  Live Carousel Behavior Preview (50% opacity default, 100% on hover/click)
                </span>
                <span className="text-[9px] text-gray-400 font-sans">
                  Click any item below to test active state without hyperlink navigation
                </span>
              </div>
              <div className="flex items-center gap-4 overflow-x-auto py-2 px-1">
                {clientLogos.map((client, idx) => (
                  <button
                    key={`preview-${idx}`}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setMessage(`Selected "${client.name}" (No hyperlink performed)`);
                    }}
                    className="flex items-center gap-2 px-3 py-2 bg-white rounded-xl border border-gray-200 opacity-50 hover:opacity-100 hover:scale-105 transition-all duration-200 cursor-pointer shrink-0 shadow-2xs"
                  >
                    <div className="w-6 h-6 rounded-lg bg-gray-100 overflow-hidden shrink-0 flex items-center justify-center">
                      {client.logoUrl ? (
                        <img src={client.logoUrl} alt={client.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[8px] font-bold text-gray-400 uppercase">{client.name.slice(0, 2)}</span>
                      )}
                    </div>
                    <span className="text-[11px] font-bold text-brand-blue whitespace-nowrap">{client.name}</span>
                  </button>
                ))}
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
            <div className="border-b border-gray-50 pb-3 flex flex-wrap justify-between items-center gap-3">
              <div>
                <h3 className="font-display font-bold text-sm text-brand-blue">
                  Flagship Ventures Portfolio Editor
                </h3>
                <p className="text-[11px] text-gray-400">
                  Update name, taglines, live URLs, and descriptions for your ventures portfolio.
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleAddVenture}
                  className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg flex items-center gap-1 transition shadow"
                >
                  <Plus size={12} />
                  <span>Add Venture</span>
                </button>
                <button
                  onClick={() => handleSaveConfig({ ventures })}
                  className="px-4 py-2 bg-brand-crimson hover:bg-red-800 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg flex items-center gap-1 transition shadow"
                >
                  <Save size={12} />
                  <span>Save Venture Changes</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ventures.map((v, idx) => (
                <div key={v.id} className="p-5 bg-gray-50/50 border border-gray-100 rounded-2xl space-y-3.5 relative">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="w-5 h-5 rounded-full bg-brand-blue text-white flex items-center justify-center text-[10px] font-black">
                        {idx + 1}
                      </span>
                      <span className="text-xs font-black text-brand-blue uppercase">Venture ID: {v.id}</span>
                    </div>
                    <button
                      onClick={() => handleDeleteVenture(idx)}
                      className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded transition"
                      title="Remove venture"
                    >
                      <Trash2 size={14} />
                    </button>
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
                    <label className="text-[9px] font-bold text-gray-400 uppercase">Official Venture Website URL</label>
                    <input
                      type="text"
                      value={v.url || ""}
                      placeholder="e.g. https://www.metaspaceconsult.com/metagen"
                      onChange={(e) => handleUpdateVentureField(idx, "url", e.target.value)}
                      className="px-3 py-1.5 text-xs bg-white border border-gray-200 focus:border-brand-blue rounded outline-none text-brand-blue font-medium"
                    />
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
          
          {/* SECURITY & ADMIN CREDENTIALS CARD */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 space-y-4">
            <div className="border-b border-gray-100 pb-3 flex justify-between items-center">
              <div>
                <h3 className="font-display font-bold text-sm text-brand-blue flex items-center gap-2">
                  <ShieldCheck size={16} className="text-brand-crimson" />
                  Admin Console Credentials & Security
                </h3>
                <p className="text-[11px] text-gray-400">
                  Update administrator password for <strong>{username}</strong>. Changes take effect across Supabase & backend configuration.
                </p>
              </div>
            </div>

            <form onSubmit={handleUpdatePassword} className="flex flex-col sm:flex-row items-end gap-3 pt-1">
              <div className="flex-1 w-full space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">New Password</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new administrator password"
                  className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 focus:border-brand-blue rounded-xl outline-none font-semibold"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || !newPassword.trim()}
                className="px-5 py-2.5 bg-brand-blue hover:bg-brand-navy text-white text-[11px] font-bold uppercase tracking-wider rounded-xl transition shadow flex items-center justify-center gap-1.5 shrink-0"
              >
                {isLoading ? <Loader2 size={13} className="animate-spin" /> : <Lock size={13} />}
                <span>Update Password</span>
              </button>
            </form>
          </div>
          
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

      {/* TAB 6: ADMIN USERS & SECURITY */}
      {activeAdminTab === "admin_security" && (
        <div className="space-y-8 animate-in fade-in duration-200">
          
          {/* ADMIN ACCOUNTS & REVOCATION CARD */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 space-y-6">
            <div className="border-b border-gray-100 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div>
                <h3 className="font-display font-bold text-sm text-brand-blue flex items-center gap-2">
                  <Users size={18} className="text-brand-crimson" />
                  Console User Management & Access Control
                </h3>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Add new administrator accounts, assign access levels, and revoke access for existing users instantly.
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-blue/5 border border-brand-blue/10 text-brand-blue text-[10px] font-bold rounded-full self-start md:self-auto">
                <ShieldCheck size={12} className="text-brand-blue" />
                {adminUsers.length} Active Console Admins
              </span>
            </div>

            {/* ACTIVE ADMINS LIST */}
            <div className="space-y-3">
              <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Active Administrator Accounts</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {adminUsers.map((admin) => {
                  const isSelf = admin.username.toLowerCase() === username.toLowerCase();
                  return (
                    <div 
                      key={admin.username}
                      className="p-3.5 bg-gray-50 border border-gray-200/80 rounded-xl flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                          admin.isSuperadmin ? "bg-brand-crimson text-white" : "bg-brand-blue text-white"
                        }`}>
                          {admin.username.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs text-brand-blue truncate">{admin.username}</span>
                            {isSelf && (
                              <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-[9px] font-extrabold rounded uppercase shrink-0">
                                You
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold block">
                            {admin.isSuperadmin ? "Super Admin" : "Console Admin"}
                          </span>
                        </div>
                      </div>

                      {!isSelf ? (
                        <button
                          type="button"
                          onClick={() => handleRevokeAdminUser(admin.username)}
                          disabled={isLoading}
                          title={`Revoke access for ${admin.username}`}
                          className="p-2 bg-red-50 hover:bg-red-100 text-brand-crimson border border-red-200 text-xs font-bold rounded-lg transition flex items-center gap-1 shrink-0"
                        >
                          <UserX size={13} />
                          <span className="text-[10px] uppercase font-bold">Revoke</span>
                        </button>
                      ) : (
                        <span className="text-[10px] text-gray-400 italic shrink-0">Active Session</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ADD NEW ADMIN USER FORM */}
            <div className="border-t border-gray-100 pt-6 space-y-4">
              <h4 className="text-[11px] font-bold text-brand-blue uppercase tracking-wider flex items-center gap-1.5">
                <UserPlus size={14} className="text-brand-crimson" />
                Add New Admin Account
              </h4>

              <form onSubmit={handleAddAdminUser} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                <div className="sm:col-span-4 space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Username / ID</label>
                  <input
                    type="text"
                    required
                    value={newAdminUsername}
                    onChange={(e) => setNewAdminUsername(e.target.value)}
                    placeholder="e.g. victor_admin"
                    className="w-full px-3 py-2.5 text-xs bg-gray-50 border border-gray-200 focus:border-brand-blue rounded-xl outline-none font-semibold"
                  />
                </div>

                <div className="sm:col-span-4 space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Password</label>
                  <input
                    type="password"
                    required
                    value={newAdminPassword}
                    onChange={(e) => setNewAdminPassword(e.target.value)}
                    placeholder="Set admin password"
                    className="w-full px-3 py-2.5 text-xs bg-gray-50 border border-gray-200 focus:border-brand-blue rounded-xl outline-none font-semibold"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1 flex flex-col justify-end">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Privileges</label>
                  <button
                    type="button"
                    onClick={() => setNewAdminIsSuperadmin(!newAdminIsSuperadmin)}
                    className={`w-full py-2.5 px-2 text-[10px] font-bold uppercase rounded-xl border transition text-center ${
                      newAdminIsSuperadmin ? "bg-brand-crimson text-white border-brand-crimson" : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
                    }`}
                  >
                    {newAdminIsSuperadmin ? "Super Admin" : "Standard Admin"}
                  </button>
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <button
                    type="submit"
                    disabled={isLoading || !newAdminUsername.trim() || !newAdminPassword.trim()}
                    className="w-full py-2.5 bg-brand-blue hover:bg-brand-navy text-white text-[10px] font-bold uppercase tracking-wider rounded-xl transition shadow flex items-center justify-center gap-1.5"
                  >
                    {isLoading ? <Loader2 size={13} className="animate-spin" /> : <UserPlus size={13} />}
                    <span>Add User</span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* CHANGE LOGGED-IN ACCOUNT PASSWORD CARD */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 space-y-4">
            <div className="border-b border-gray-100 pb-3 flex justify-between items-center">
              <div>
                <h3 className="font-display font-bold text-sm text-brand-blue flex items-center gap-2">
                  <KeyRound size={16} className="text-brand-crimson" />
                  Change Password for ({username})
                </h3>
                <p className="text-[11px] text-gray-400">
                  Update your administrator password across the backend and Supabase data store.
                </p>
              </div>
            </div>

            <form onSubmit={handleUpdatePassword} className="flex flex-col sm:flex-row items-end gap-3 pt-1">
              <div className="flex-1 w-full space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">New Password</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 focus:border-brand-blue rounded-xl outline-none font-semibold"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || !newPassword.trim()}
                className="px-5 py-2.5 bg-brand-blue hover:bg-brand-navy text-white text-[11px] font-bold uppercase tracking-wider rounded-xl transition shadow flex items-center justify-center gap-1.5 shrink-0"
              >
                {isLoading ? <Loader2 size={13} className="animate-spin" /> : <Lock size={13} />}
                <span>Update Password</span>
              </button>
            </form>
          </div>

        </div>
      )}

    </div>
  );
}
