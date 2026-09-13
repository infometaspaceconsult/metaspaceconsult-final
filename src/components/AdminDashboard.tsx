import React, { useState, useEffect, useRef, useCallback } from "react";
import { 
  ShieldCheck, RefreshCw, Calendar, Mail, FileText, CheckCircle, Clock, 
  Trash2, Plus, ArrowRight, Loader2, Sparkles, Image as ImageIcon, 
  Settings, Lock, KeyRound, Save, Edit3, HelpCircle, Eye, EyeOff, AlertCircle,
  Briefcase, UserPlus, UserCheck, UserX, Users, Database, Send,
  CheckCircle2, AlertTriangle, CloudUpload, HardDrive, Rocket, MessageSquare,
  BookOpen, Bookmark, Copy, ExternalLink, Search, Filter
} from "lucide-react";
import { Consultation, ContactInquiry, Venture, ServiceOffer, ClientLogo, InsightPost } from "../types";
import { CLIENT_LOGOS_DATA, VENTURES_DATA, INSIGHTS_DATA } from "../data";
import { 
  apiFetchSiteConfig, apiSaveSiteConfig, apiLoginAdmin, 
  apiFetchConsultations, apiFetchInquiries,
  apiFetchAdminUsers, apiAddAdminUser, apiDeleteAdminUser,
  apiUpdateConsultationStatus, apiDeleteConsultation, apiDeleteInquiry,
  apiCreateConsultation, apiChangePassword
} from "../lib/apiFallback";
import { 
  testFirestoreConnection, 
  saveToCloudDatabaseAndStorage, 
  saveLedgerToCloudDatabase,
  savePageTextToCloudDatabase,
  saveMediaToCloudDatabase,
  saveVenturesAndServicesToCloudDatabase,
  saveInsightsToCloudDatabase,
  saveFooterAndSupportToCloudDatabase,
  saveAdminsAndAccessToCloudDatabase,
  CloudSaveNotice 
} from "../lib/firebase";

function CloudSaveNoticeBanner({ notice, onDismiss }: { notice: CloudSaveNotice | null; onDismiss?: () => void }) {
  if (!notice) return null;
  return (
    <div
      className={`p-4 rounded-2xl border text-xs leading-relaxed transition-all duration-200 animate-in fade-in shadow-xs ${
        notice.saved
          ? "bg-emerald-50/95 border-emerald-300 text-emerald-950"
          : "bg-rose-50/95 border-rose-300 text-rose-950"
      }`}
    >
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-black/5">
        <div className="flex items-center gap-2 font-bold">
          {notice.saved ? (
            <CheckCircle2 size={17} className="text-emerald-600 shrink-0" />
          ) : (
            <AlertTriangle size={17} className="text-rose-600 shrink-0" />
          )}
          <span className={`text-xs font-black uppercase tracking-wider ${notice.saved ? "text-emerald-900" : "text-rose-900"}`}>
            {notice.saved ? "Data Indeed Saved Successfully into DB!" : "Notice: Data Was NOT Saved to DB"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-2xs ${
            notice.saved ? "bg-emerald-200 text-emerald-900" : "bg-rose-200 text-rose-900"
          }`}>
            {notice.saved ? "Verified 🟢" : "Failed 🔴"}
          </span>
          {onDismiss && (
            <button
              type="button"
              onClick={onDismiss}
              className="text-gray-400 hover:text-gray-700 p-0.5 transition cursor-pointer text-xs font-bold"
              title="Dismiss notice"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <p className={`text-xs font-medium font-sans ${notice.saved ? "text-emerald-800" : "text-rose-800"}`}>
        {notice.message}
      </p>

      <div className="mt-2.5 pt-2 border-t border-black/5 flex flex-wrap items-center justify-between gap-2 text-[10px] text-gray-500 font-mono">
        <span>Recorded Timestamp: {notice.timestamp}</span>
        {notice.saved ? (
          <span className="text-emerald-700 font-bold flex items-center gap-1">
            Read-Back Confirmed ✓ {notice.docPath ? `(${notice.docPath})` : ""}
          </span>
        ) : (
          <span className="text-rose-700 font-bold flex items-center gap-1">
            Write Verification Incomplete ✕
          </span>
        )}
      </div>
    </div>
  );
}

interface AdminDashboardProps {
  onConfigChange?: (updatedConfig: any) => void;
}

export default function AdminDashboard({ onConfigChange }: AdminDashboardProps = {}) {
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [authError, setAuthError] = useState("");

  // Inactivity auto-lock timer (10 minutes)
  const INACTIVITY_TIMEOUT_MS = 10 * 60 * 1000;
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("metaspace_admin_token");
    localStorage.removeItem("metaspace_admin_password");
    localStorage.removeItem("metaspace_admin_username");
    setIsAuthenticated(false);
    setPassword("");
    setMessage("");
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
  }, []);

  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    if (!isAuthenticated) return;

    inactivityTimerRef.current = setTimeout(() => {
      handleLogout();
      setAuthError("Session auto-locked due to inactivity. Enter admin credentials & password to resume.");
    }, INACTIVITY_TIMEOUT_MS);
  }, [isAuthenticated, handleLogout]);

  useEffect(() => {
    if (!isAuthenticated) {
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
      return;
    }

    const activityEvents = ["mousedown", "mousemove", "keydown", "scroll", "touchstart", "click"];
    const handleActivity = () => resetInactivityTimer();

    activityEvents.forEach((evt) => window.addEventListener(evt, handleActivity, { passive: true }));
    resetInactivityTimer();

    return () => {
      activityEvents.forEach((evt) => window.removeEventListener(evt, handleActivity));
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    };
  }, [isAuthenticated, resetInactivityTimer]);

  // UI Tabs inside Admin: "ledger" | "text_editor" | "media_editor" | "ventures_services" | "insights_editor" | "footer_editor" | "admin_security"
  const [activeAdminTab, setActiveAdminTab] = useState<"ledger" | "text_editor" | "media_editor" | "ventures_services" | "insights_editor" | "footer_editor" | "admin_security">("ledger");

  // Admin Users Management States
  const [adminUsers, setAdminUsers] = useState<{ username: string; isSuperadmin: boolean }[]>([]);
  const [newAdminUsername, setNewAdminUsername] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const [newAdminIsSuperadmin, setNewAdminIsSuperadmin] = useState(false);

  // Data States
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
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
  const [insights, setInsights] = useState<InsightPost[]>(INSIGHTS_DATA);

  // Insights Creation & Correction States
  const [isCreatingInsight, setIsCreatingInsight] = useState(false);
  const [editingInsightId, setEditingInsightId] = useState<string | null>(null);
  const [insightSearch, setInsightSearch] = useState("");
  const [insightCategoryFilter, setInsightCategoryFilter] = useState("all");
  const [insightTitle, setInsightTitle] = useState("");
  const [insightCategory, setInsightCategory] = useState("Venture Builder");
  const [insightCustomCategory, setInsightCustomCategory] = useState("");
  const [insightAuthor, setInsightAuthor] = useState("Metaspace Leadership");
  const [insightReadTime, setInsightReadTime] = useState("5 min read");
  const [insightDate, setInsightDate] = useState("September 2026");
  const [insightSummary, setInsightSummary] = useState("");
  const [insightContent, setInsightContent] = useState("");
  const [insightImage, setInsightImage] = useState("https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80");

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
  const [username, setUsername] = useState(() => localStorage.getItem("metaspace_admin_username") || "superadmin");
  const [newPassword, setNewPassword] = useState("");

  // Live Cloud Database (Google Cloud Firestore) & Storage State
  const [cloudDbId, setCloudDbId] = useState("ai-studio-metaspaceconsult-9ba2a98e-157c-4575-bf8c-0d59e54caf50");
  const [cloudStorageBucket, setCloudStorageBucket] = useState("gen-lang-client-0889935436.firebasestorage.app");
  const [cloudSyncMode, setCloudSyncMode] = useState("realtime_mirror");
  const [cloudAutoSync, setCloudAutoSync] = useState(true);
  const [cloudLastSavedAt, setCloudLastSavedAt] = useState("");
  const [isSavingCloud, setIsSavingCloud] = useState(false);
  const [cloudSaveNotice, setCloudSaveNotice] = useState<CloudSaveNotice | null>(null);

  // Per-page / Per-tab Cloud DB Save Notices & States
  const [tabSaveNotices, setTabSaveNotices] = useState<Record<string, CloudSaveNotice | null>>({
    ledger: null,
    text_editor: null,
    media_editor: null,
    ventures_services: null,
    insights_editor: null,
    footer_editor: null,
    admin_security: null
  });
  const [tabIsSaving, setTabIsSaving] = useState<Record<string, boolean>>({
    ledger: false,
    text_editor: false,
    media_editor: false,
    ventures_services: false,
    insights_editor: false,
    footer_editor: false,
    admin_security: false
  });

  const [firestoreTestResult, setFirestoreTestResult] = useState("");
  const [isTestingFirestore, setIsTestingFirestore] = useState(false);

  // SMTP Mail Server State
  const [smtpHost, setSmtpHost] = useState("");
  const [smtpPort, setSmtpPort] = useState("465");
  const [smtpSecure, setSmtpSecure] = useState(true);
  const [smtpUser, setSmtpUser] = useState("");
  const [smtpPass, setSmtpPass] = useState("");
  const [smtpFromName, setSmtpFromName] = useState("Metaspace Consulting");
  const [smtpFromEmail, setSmtpFromEmail] = useState("");
  const [notificationEmail, setNotificationEmail] = useState("");
  const [smtpTestResult, setSmtpTestResult] = useState("");
  const [isTestingSmtp, setIsTestingSmtp] = useState(false);
  const [isVerifyingSmtp, setIsVerifyingSmtp] = useState(false);

  // Restore existing session if authenticated in current browser
  useEffect(() => {
    const savedToken = localStorage.getItem("metaspace_admin_token");
    const savedPwd = localStorage.getItem("metaspace_admin_password");
    const savedUser = localStorage.getItem("metaspace_admin_username");
    if (savedToken && savedPwd) {
      setIsAuthenticated(true);
      setPassword(savedPwd);
      if (savedUser) setUsername(savedUser);
      fetchAdminData(savedPwd);
    }
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
      const cleanUser = (username || "superadmin").trim();
      const result = await apiLoginAdmin(cleanUser, cleanPwd);
      if (result.success) {
        localStorage.setItem("metaspace_admin_token", result.token || "metaspace-token-" + Date.now());
        localStorage.setItem("metaspace_admin_password", cleanPwd);
        localStorage.setItem("metaspace_admin_username", cleanUser);
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
        
        const incomingVentures = (d.ventures && Array.isArray(d.ventures) && d.ventures.length > 0)
          ? d.ventures
          : VENTURES_DATA;
        const mergedVentures = VENTURES_DATA.map(defV => {
          const found = incomingVentures.find((v: any) => v && (v.id === defV.id || v.name?.toLowerCase() === defV.name?.toLowerCase()));
          return {
            ...defV,
            ...(found || {}),
            url: (found && found.url && found.url.trim() !== "") ? found.url : defV.url
          };
        });
        const customVentures = incomingVentures.filter((v: any) => 
          v && !VENTURES_DATA.some(defV => defV.id === v.id || defV.name?.toLowerCase() === v.name?.toLowerCase())
        );
        setVentures([...mergedVentures, ...customVentures]);

        setServices(d.services || []);
        if (d.clientLogos && Array.isArray(d.clientLogos) && d.clientLogos.length > 0) {
          setClientLogos(d.clientLogos);
        } else if (d.client_logos && Array.isArray(d.client_logos) && d.client_logos.length > 0) {
          setClientLogos(d.client_logos);
        } else {
          setClientLogos(CLIENT_LOGOS_DATA);
        }

        if (d.insights && Array.isArray(d.insights) && d.insights.length > 0) {
          setInsights(d.insights);
        } else {
          setInsights(INSIGHTS_DATA);
        }
        setSmtpHost(d.smtp_host || "");
        setSmtpPort(d.smtp_port ? String(d.smtp_port) : "465");
        setSmtpSecure(d.smtp_secure !== undefined ? Boolean(d.smtp_secure) : true);
        setSmtpUser(d.smtp_user || "");
        setSmtpPass(d.smtp_pass && d.smtp_pass !== "••••••••" ? d.smtp_pass : (d.hasSmtpPassword ? "••••••••" : ""));
        setSmtpFromName(d.smtp_from_name || "Metaspace Consulting");
        setSmtpFromEmail(d.smtp_from_email || "");
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

        if (d.cloud_db_id) setCloudDbId(d.cloud_db_id);
        if (d.cloud_storage_bucket) setCloudStorageBucket(d.cloud_storage_bucket);
        if (d.cloud_sync_mode) setCloudSyncMode(d.cloud_sync_mode);
        if (d.cloud_auto_sync !== undefined) setCloudAutoSync(Boolean(d.cloud_auto_sync));
        if (d.cloud_last_saved_at) setCloudLastSavedAt(d.cloud_last_saved_at);
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
        handleSaveMediaToCloudDb({ logoUrl: base64String });
      } else {
        setLagosBridgeUrl(base64String);
        handleSaveConfig({ lagosBridgeUrl: base64String });
        handleSaveMediaToCloudDb({ lagosBridgeUrl: base64String });
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
      await apiUpdateConsultationStatus(id, nextStatus, password);
      setMessage(`Consultation status updated to ${nextStatus}!`);
      fetchAdminData();
      setTimeout(() => setMessage(""), 3000);
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
      await apiDeleteConsultation(id, password);
      setMessage("Consultation record deleted successfully.");
      fetchAdminData();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveCloudDatabaseAndStorage = async () => {
    setIsSavingCloud(true);
    setCloudSaveNotice(null);
    try {
      const payload = {
        cloud_db_id: cloudDbId.trim() || "ai-studio-metaspaceconsult-9ba2a98e-157c-4575-bf8c-0d59e54caf50",
        cloud_storage_bucket: cloudStorageBucket.trim() || "gen-lang-client-0889935436.firebasestorage.app",
        cloud_sync_mode: cloudSyncMode,
        cloud_auto_sync: cloudAutoSync,
        cloud_last_saved_at: new Date().toISOString(),
        // Mirror active site settings to cloud doc
        home_hero_title: homeHeroTitle,
        home_hero_subtitle: homeHeroSubtitle,
        home_hero_desc: homeHeroDesc,
        about_hero_title: aboutHeroTitle,
        about_hero_desc: aboutHeroDesc,
        about_mission_title: aboutMissionTitle,
        about_mission_text: aboutMissionText,
        what_we_do_title: whatWeDoTitle,
        what_we_do_desc: whatWeDoDesc,
        logoUrl,
        lagosBridgeUrl,
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
        smtp_host: smtpHost,
        smtp_port: smtpPort,
        smtp_user: smtpUser,
        smtp_from_name: smtpFromName,
        smtp_from_email: smtpFromEmail,
        notification_email: notificationEmail
      };

      // 1. Direct write & read-back verification via Google Cloud Firestore
      const notice = await saveToCloudDatabaseAndStorage(payload, {
        username,
        consultationsCount: consultations.length,
        inquiriesCount: inquiries.length
      });

      // 2. Synchronize with server persistent ledger and localStorage
      await apiSaveSiteConfig(payload);

      // Notify parent & dispatch global update event so all pages instantly reflect
      onConfigChange?.(payload);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("metaspace_config_updated", { detail: payload }));
      }

      setCloudSaveNotice(notice);

      if (notice.saved) {
        setCloudLastSavedAt(new Date().toISOString());
        setMessage("Data was indeed saved successfully to Cloud Database & Storage.");
        setTimeout(() => setMessage(""), 5000);
      } else {
        setMessage("Notice: Data was NOT saved to Cloud Database & Storage.");
      }
    } catch (err: any) {
      const failNotice: CloudSaveNotice = {
        saved: false,
        message: `Data was NOT saved to Cloud Database & Storage: ${err.message || String(err)}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ', ' + new Date().toLocaleDateString(),
        verified: false,
        databaseId: cloudDbId,
        storageBucket: cloudStorageBucket,
        error: err.message || String(err)
      };
      setCloudSaveNotice(failNotice);
      setMessage("Notice: Data was NOT saved to Cloud Database & Storage.");
    } finally {
      setIsSavingCloud(false);
    }
  };

  // ==========================================
  // PER-TAB CLOUD DATABASE SAVE & NOTICE HANDLERS
  // ==========================================

  // TAB 1: Save Bookings Ledger to DB
  const handleSaveLedgerToCloudDb = async (overrideConsults?: Consultation[], overrideInquiries?: ContactInquiry[]) => {
    setTabIsSaving(prev => ({ ...prev, ledger: true }));
    try {
      const cList = overrideConsults || consultations;
      const iList = overrideInquiries || inquiries;
      const notice = await saveLedgerToCloudDatabase(cList, iList, { username });
      setTabSaveNotices(prev => ({ ...prev, ledger: notice }));
      if (notice.saved) {
        setMessage("Bookings Ledger saved and verified in Cloud Database!");
        fetchAdminData();
        setTimeout(() => setMessage(""), 4000);
      } else {
        setErrMessage(notice.message || "Notice: Ledger was NOT saved to Cloud DB.");
      }
    } catch (err: any) {
      setTabSaveNotices(prev => ({
        ...prev,
        ledger: {
          saved: false,
          message: `Data was NOT saved to Cloud Database: ${err.message || String(err)}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ', ' + new Date().toLocaleDateString(),
          verified: false,
          databaseId: cloudDbId,
          error: err.message
        }
      }));
    } finally {
      setTabIsSaving(prev => ({ ...prev, ledger: false }));
    }
  };

  // TAB 2: Save Page Text & Layout to DB
  const handleSavePageTextToCloudDb = async (customPayload?: Record<string, any>) => {
    setTabIsSaving(prev => ({ ...prev, text_editor: true }));
    try {
      const payload = {
        home_hero_subtitle: homeHeroSubtitle,
        home_hero_title: homeHeroTitle,
        home_hero_title_color: homeHeroTitleColor,
        home_hero_title_highlight_color: homeHeroTitleHighlightColor,
        home_hero_desc: homeHeroDesc,
        about_hero_title: aboutHeroTitle,
        about_hero_desc: aboutHeroDesc,
        about_mission_title: aboutMissionTitle,
        about_mission_text: aboutMissionText,
        what_we_do_title: whatWeDoTitle,
        what_we_do_desc: whatWeDoDesc,
        ...(customPayload || {})
      };
      const notice = await savePageTextToCloudDatabase(payload, { username });
      await apiSaveSiteConfig(payload);
      onConfigChange?.(payload);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("metaspace_config_updated", { detail: payload }));
      }
      setTabSaveNotices(prev => ({ ...prev, text_editor: notice }));
      if (notice.saved) {
        setMessage("Page Text & Layout saved and verified in Cloud Database!");
        fetchAdminData();
        setTimeout(() => setMessage(""), 4000);
      } else {
        setErrMessage(notice.message || "Notice: Page Text was NOT saved to Cloud DB.");
      }
    } catch (err: any) {
      setTabSaveNotices(prev => ({
        ...prev,
        text_editor: {
          saved: false,
          message: `Data was NOT saved to Cloud Database: ${err.message || String(err)}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ', ' + new Date().toLocaleDateString(),
          verified: false,
          databaseId: cloudDbId,
          error: err.message
        }
      }));
    } finally {
      setTabIsSaving(prev => ({ ...prev, text_editor: false }));
    }
  };

  // TAB 3: Save Images & Client Logos to DB
  const handleSaveMediaToCloudDb = async (
    optionsOrLogos?: ClientLogo[] | { logoUrl?: string; lagosBridgeUrl?: string; clientLogos?: ClientLogo[] },
    overrideLogoUrl?: string,
    overrideLagosBridge?: string
  ) => {
    setTabIsSaving(prev => ({ ...prev, media_editor: true }));
    try {
      let finalLogos = clientLogos;
      let finalLogoUrl = logoUrl;
      let finalLagosBridgeUrl = lagosBridgeUrl;

      if (Array.isArray(optionsOrLogos)) {
        finalLogos = optionsOrLogos;
        if (overrideLogoUrl !== undefined) finalLogoUrl = overrideLogoUrl;
        if (overrideLagosBridge !== undefined) finalLagosBridgeUrl = overrideLagosBridge;
      } else if (optionsOrLogos && typeof optionsOrLogos === "object") {
        if (optionsOrLogos.clientLogos !== undefined) finalLogos = optionsOrLogos.clientLogos;
        if (optionsOrLogos.logoUrl !== undefined) finalLogoUrl = optionsOrLogos.logoUrl;
        if (optionsOrLogos.lagosBridgeUrl !== undefined) finalLagosBridgeUrl = optionsOrLogos.lagosBridgeUrl;
      }

      const payload = {
        logoUrl: finalLogoUrl,
        lagosBridgeUrl: finalLagosBridgeUrl,
        clientLogos: finalLogos
      };
      const notice = await saveMediaToCloudDatabase(payload, { username });
      await apiSaveSiteConfig(payload);
      onConfigChange?.(payload);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("metaspace_config_updated", { detail: payload }));
      }
      setTabSaveNotices(prev => ({ ...prev, media_editor: notice }));
      if (notice.saved) {
        setMessage("Images & Client Logos saved and verified in Cloud Database & Storage!");
        fetchAdminData();
        setTimeout(() => setMessage(""), 4000);
      } else {
        setErrMessage(notice.message || "Notice: Images & Logos were NOT saved to Cloud DB.");
      }
    } catch (err: any) {
      setTabSaveNotices(prev => ({
        ...prev,
        media_editor: {
          saved: false,
          message: `Data was NOT saved to Cloud Database & Storage: ${err.message || String(err)}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ', ' + new Date().toLocaleDateString(),
          verified: false,
          databaseId: cloudDbId,
          storageBucket: cloudStorageBucket,
          error: err.message
        }
      }));
    } finally {
      setTabIsSaving(prev => ({ ...prev, media_editor: false }));
    }
  };

  // TAB 4: Save Ventures & Services to DB
  const handleSaveVenturesServicesToCloudDb = async (overrideVentures?: Venture[], overrideServices?: ServiceOffer[]) => {
    setTabIsSaving(prev => ({ ...prev, ventures_services: true }));
    try {
      const rawVentures = overrideVentures || ventures;
      const vToSave = rawVentures.map(v => {
        const defV = VENTURES_DATA.find(d => d.id === v.id || d.name?.toLowerCase() === v.name?.toLowerCase());
        return {
          ...(defV || {}),
          ...v,
          url: v.url && v.url.trim() !== "" ? v.url : (defV?.url || "https://www.metaspaceconsult.com")
        };
      });
      const sToSave = overrideServices || services;
      const notice = await saveVenturesAndServicesToCloudDatabase(vToSave, sToSave, { username });
      await apiSaveSiteConfig({ ventures: vToSave, services: sToSave });
      onConfigChange?.({ ventures: vToSave, services: sToSave });
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("metaspace_config_updated", { detail: { ventures: vToSave, services: sToSave } }));
      }
      setTabSaveNotices(prev => ({ ...prev, ventures_services: notice }));
      if (notice.saved) {
        setMessage("Ventures & Services saved and verified in Cloud Database!");
        fetchAdminData();
        setTimeout(() => setMessage(""), 4000);
      } else {
        setErrMessage(notice.message || "Notice: Ventures & Services were NOT saved to Cloud DB.");
      }
    } catch (err: any) {
      setTabSaveNotices(prev => ({
        ...prev,
        ventures_services: {
          saved: false,
          message: `Data was NOT saved to Cloud Database: ${err.message || String(err)}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ', ' + new Date().toLocaleDateString(),
          verified: false,
          databaseId: cloudDbId,
          error: err.message
        }
      }));
    } finally {
      setTabIsSaving(prev => ({ ...prev, ventures_services: false }));
    }
  };

  // TAB Insights: Save Insights & Articles to Cloud DB & Backend
  const handleSaveInsightsToCloudDb = async (overrideInsights?: InsightPost[]) => {
    setTabIsSaving(prev => ({ ...prev, insights_editor: true }));
    try {
      const iToSave = overrideInsights || insights;
      const notice = await saveInsightsToCloudDatabase(iToSave, { username });
      await apiSaveSiteConfig({ insights: iToSave });
      onConfigChange?.({ insights: iToSave });
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("metaspace_config_updated", { detail: { insights: iToSave } }));
      }
      setTabSaveNotices(prev => ({ ...prev, insights_editor: notice }));
      if (notice.saved) {
        setMessage("Insights articles successfully saved and verified in Cloud Database!");
        fetchAdminData();
        setTimeout(() => setMessage(""), 4000);
      } else {
        setErrMessage(notice.message || "Notice: Insights were NOT saved to Cloud DB.");
      }
    } catch (err: any) {
      setTabSaveNotices(prev => ({
        ...prev,
        insights_editor: {
          saved: false,
          message: `Data was NOT saved to Cloud Database: ${err.message || String(err)}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ', ' + new Date().toLocaleDateString(),
          verified: false,
          databaseId: cloudDbId,
          error: err.message
        }
      }));
    } finally {
      setTabIsSaving(prev => ({ ...prev, insights_editor: false }));
    }
  };

  const resetInsightForm = () => {
    setInsightTitle("");
    setInsightCategory("Venture Builder");
    setInsightCustomCategory("");
    setInsightAuthor("Metaspace Leadership");
    setInsightReadTime("5 min read");
    setInsightDate(new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));
    setInsightSummary("");
    setInsightContent("");
    setInsightImage("https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80");
    setEditingInsightId(null);
    setIsCreatingInsight(false);
  };

  const handleStartNewInsight = () => {
    resetInsightForm();
    setIsCreatingInsight(true);
  };

  const handleStartEditInsight = (post: InsightPost) => {
    setEditingInsightId(post.id);
    setInsightTitle(post.title || "");
    const standardCategories = ["Venture Builder", "Digital Transformation", "Startup Policy", "Healthcare Tech"];
    if (standardCategories.includes(post.category)) {
      setInsightCategory(post.category);
      setInsightCustomCategory("");
    } else {
      setInsightCategory("Custom");
      setInsightCustomCategory(post.category || "");
    }
    setInsightAuthor(post.author || "Metaspace Leadership");
    setInsightReadTime(post.readTime || "5 min read");
    setInsightDate(post.date || "");
    setInsightSummary(post.summary || "");
    setInsightContent(post.content || "");
    setInsightImage(post.image || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80");
    setIsCreatingInsight(true);
  };

  const handleSaveInsight = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!insightTitle.trim() || !insightSummary.trim() || !insightContent.trim()) {
      setErrMessage("Please fill in the required article title, summary, and content.");
      return;
    }

    const effectiveCategory = insightCategory === "Custom" 
      ? (insightCustomCategory.trim() || "Venture Insights") 
      : insightCategory;

    let updatedList: InsightPost[];
    if (editingInsightId) {
      // Correction / update
      updatedList = insights.map(p => {
        if (p.id === editingInsightId) {
          return {
            ...p,
            title: insightTitle.trim(),
            category: effectiveCategory,
            author: insightAuthor.trim() || "Metaspace Leadership",
            readTime: insightReadTime.trim() || "5 min read",
            date: insightDate.trim() || new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
            summary: insightSummary.trim(),
            content: insightContent.trim(),
            image: insightImage.trim() || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
          };
        }
        return p;
      });
      setMessage("Article corrections applied and saved successfully!");
    } else {
      // Creation
      const newPost: InsightPost = {
        id: "post-" + Date.now(),
        title: insightTitle.trim(),
        category: effectiveCategory,
        author: insightAuthor.trim() || "Metaspace Leadership",
        readTime: insightReadTime.trim() || "5 min read",
        date: insightDate.trim() || new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        summary: insightSummary.trim(),
        content: insightContent.trim(),
        image: insightImage.trim() || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
      };
      updatedList = [newPost, ...insights];
      setMessage("New insight article created and published successfully!");
    }

    setInsights(updatedList);
    resetInsightForm();
    await handleSaveInsightsToCloudDb(updatedList);
  };

  const handleDeleteInsight = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete the article: "${title}"? This cannot be undone.`)) {
      return;
    }
    const updatedList = insights.filter(p => p.id !== id);
    setInsights(updatedList);
    if (editingInsightId === id) {
      resetInsightForm();
    }
    setMessage(`Article "${title}" removed.`);
    await handleSaveInsightsToCloudDb(updatedList);
  };

  const handleDuplicateInsight = async (post: InsightPost) => {
    const cloned: InsightPost = {
      ...post,
      id: "post-" + Date.now(),
      title: `${post.title} (Copy)`,
      date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    };
    const updatedList = [cloned, ...insights];
    setInsights(updatedList);
    setMessage(`Cloned article "${post.title}". You can now edit this copy.`);
    await handleSaveInsightsToCloudDb(updatedList);
  };

  const handleMoveInsight = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= insights.length) return;
    const nextList = [...insights];
    const [moved] = nextList.splice(index, 1);
    nextList.splice(targetIndex, 0, moved);
    setInsights(nextList);
    await handleSaveInsightsToCloudDb(nextList);
  };

  // TAB 5: Save Footer & Chat Support to DB
  const handleSaveFooterToCloudDb = async (overridePayload?: Record<string, any>) => {
    setTabIsSaving(prev => ({ ...prev, footer_editor: true }));
    try {
      const payload = overridePayload || {
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
      };
      const notice = await saveFooterAndSupportToCloudDatabase(payload, { username });
      await apiSaveSiteConfig(payload);
      onConfigChange?.(payload);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("metaspace_config_updated", { detail: payload }));
      }
      setTabSaveNotices(prev => ({ ...prev, footer_editor: notice }));
      if (notice.saved) {
        setMessage("Footer & Chat Support saved and verified in Cloud Database!");
        fetchAdminData();
        setTimeout(() => setMessage(""), 4000);
      } else {
        setErrMessage(notice.message || "Notice: Footer & Support settings were NOT saved to Cloud DB.");
      }
    } catch (err: any) {
      setTabSaveNotices(prev => ({
        ...prev,
        footer_editor: {
          saved: false,
          message: `Data was NOT saved to Cloud Database: ${err.message || String(err)}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ', ' + new Date().toLocaleDateString(),
          verified: false,
          databaseId: cloudDbId,
          error: err.message
        }
      }));
    } finally {
      setTabIsSaving(prev => ({ ...prev, footer_editor: false }));
    }
  };

  // TAB 6: Save Admins & Access to DB
  const handleSaveAdminsToCloudDb = async (overrideUsers?: { username: string; isSuperadmin: boolean }[]) => {
    setTabIsSaving(prev => ({ ...prev, admin_security: true }));
    try {
      const usersToSave = overrideUsers || adminUsers;
      const notice = await saveAdminsAndAccessToCloudDatabase(usersToSave, { username });
      setTabSaveNotices(prev => ({ ...prev, admin_security: notice }));
      if (notice.saved) {
        setMessage("Admins & Access Control saved and verified in Cloud Database!");
        setTimeout(() => setMessage(""), 4000);
      } else {
        setErrMessage(notice.message || "Notice: Admins roster was NOT saved to Cloud DB.");
      }
    } catch (err: any) {
      setTabSaveNotices(prev => ({
        ...prev,
        admin_security: {
          saved: false,
          message: `Data was NOT saved to Cloud Database: ${err.message || String(err)}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ', ' + new Date().toLocaleDateString(),
          verified: false,
          databaseId: cloudDbId,
          error: err.message
        }
      }));
    } finally {
      setTabIsSaving(prev => ({ ...prev, admin_security: false }));
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
        if (res.users) {
          setAdminUsers(res.users);
          handleSaveAdminsToCloudDb(res.users);
        }
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
        if (res.users) {
          setAdminUsers(res.users);
          handleSaveAdminsToCloudDb(res.users);
        }
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

  const handleVerifySmtp = async () => {
    if (!smtpHost || !smtpUser || !smtpPass) {
      setSmtpTestResult("🔴 Please fill in SMTP Host, Username/Email, and Password before verifying connection.");
      return;
    }
    setIsVerifyingSmtp(true);
    setSmtpTestResult("Connecting to SMTP socket and verifying authentication credentials...");
    try {
      const res = await fetch("/api/admin/verify-smtp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          host: smtpHost.trim(),
          port: Number(smtpPort) || 465,
          secure: smtpSecure,
          user: smtpUser.trim(),
          pass: smtpPass,
        })
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        setSmtpTestResult(`🟢 ${data.message || "SMTP connection verified! Socket connected and credentials authenticated successfully."}`);
      } else {
        setSmtpTestResult(`🔴 ${data.error || "SMTP verification failed. Please check host, port, username, and password."}`);
      }
    } catch (err: any) {
      setSmtpTestResult(`🔴 Verification Error: ${err.message || String(err)}`);
    } finally {
      setIsVerifyingSmtp(false);
    }
  };

  const handleTestSmtp = async () => {
    if (!smtpHost || !smtpUser || !smtpPass) {
      setSmtpTestResult("🔴 Please fill in SMTP Host, Username/Email, and Password before testing.");
      return;
    }
    setIsTestingSmtp(true);
    setSmtpTestResult("Authenticating with SMTP server and dispatching diagnostic email...");
    try {
      const payload: any = {
        host: smtpHost.trim(),
        port: Number(smtpPort) || 465,
        secure: smtpSecure,
        user: smtpUser.trim(),
        pass: smtpPass,
        fromName: smtpFromName.trim() || "Metaspace Consulting",
        fromEmail: smtpFromEmail.trim() || smtpUser.trim(),
        recipientEmail: (notificationEmail || footerEmail || "info@metaspaceconsulting.com").trim()
      };

      const res = await fetch("/api/admin/test-smtp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        setSmtpTestResult(`🟢 ${data.message || "SMTP test email transmitted successfully!"}`);
        const savePayload: any = {
          smtp_host: smtpHost.trim(),
          smtp_port: Number(smtpPort) || 465,
          smtp_secure: smtpSecure,
          smtp_user: smtpUser.trim(),
          smtp_from_name: smtpFromName.trim(),
          smtp_from_email: smtpFromEmail.trim() || smtpUser.trim(),
          notification_email: notificationEmail.trim()
        };
        if (smtpPass && smtpPass !== "••••••••" && smtpPass.trim() !== "") {
          savePayload.smtp_pass = smtpPass.trim();
        }
        await apiSaveSiteConfig(savePayload);
      } else {
        setSmtpTestResult(`🔴 ${data.error || "SMTP delivery failed. Please verify your host, credentials, and port."}`);
      }
    } catch (err: any) {
      setSmtpTestResult(`🔴 Error: ${err.message || String(err)}`);
    } finally {
      setIsTestingSmtp(false);
    }
  };

  const handleSaveSmtp = async () => {
    setIsLoading(true);
    setMessage("");
    setErrMessage("");
    try {
      const savePayload: any = {
        smtp_host: smtpHost.trim(),
        smtp_port: Number(smtpPort) || 465,
        smtp_secure: smtpSecure,
        smtp_user: smtpUser.trim(),
        smtp_from_name: smtpFromName.trim(),
        smtp_from_email: smtpFromEmail.trim() || smtpUser.trim(),
        notification_email: notificationEmail.trim()
      };
      if (smtpPass && smtpPass !== "••••••••" && smtpPass.trim() !== "") {
        savePayload.smtp_pass = smtpPass.trim();
      }

      const success = await apiSaveSiteConfig(savePayload);
      if (success) {
        setMessage("Node.js SMTP Mail Delivery Service configuration saved and synced successfully!");
        fetchAdminData();
        setTimeout(() => setMessage(""), 4000);
      } else {
        setErrMessage("Failed to save SMTP configuration.");
      }
    } catch (err: any) {
      setErrMessage(err.message || "Failed to save SMTP configuration.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this inquiry from the inbox?")) return;
    setIsLoading(true);
    try {
      await apiDeleteInquiry(id, password);
      setMessage("Inquiry message deleted.");
      fetchAdminData();
      setTimeout(() => setMessage(""), 3000);
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
      const cleanNewPwd = newPassword.trim();
      const res = await apiChangePassword(password, cleanNewPwd, username);
      if (res.success) {
        setMessage("Admin password changed and saved successfully across backend and database!");
        setPassword(cleanNewPwd);
        localStorage.setItem("metaspace_admin_password", cleanNewPwd);
        setNewPassword("");
        fetchAdminData(cleanNewPwd);
        setTimeout(() => setMessage(""), 5000);
      } else {
        setErrMessage(res.error || "Failed to update password.");
      }
    } catch (err: any) {
      setErrMessage(err.message || "Update operation failed.");
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

      await apiCreateConsultation(mockConsult);
      setMessage("Simulated record injected successfully!");
      fetchAdminData();
      setTimeout(() => setMessage(""), 3000);
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
    onConfigChange?.({ clientLogos: updated });
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("metaspace_config_updated", { detail: { clientLogos: updated } }));
    }
    handleSaveConfig({ clientLogos: updated });
    handleSaveMediaToCloudDb({ clientLogos: updated });
    setMessage("New client logo added and synced successfully!");
  };

  const handleUpdateClientLogoField = (index: number, key: keyof ClientLogo, val: string) => {
    const list = [...clientLogos];
    list[index] = { ...list[index], [key]: val };
    setClientLogos(list);
    onConfigChange?.({ clientLogos: list });
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("metaspace_config_updated", { detail: { clientLogos: list } }));
    }
  };

  const handleDeleteClientLogo = (index: number) => {
    const logoName = clientLogos[index]?.name || "this client logo";
    if (!window.confirm(`Are you sure you want to remove "${logoName}" from the carousel?`)) return;
    const updated = clientLogos.filter((_, i) => i !== index);
    setClientLogos(updated);
    onConfigChange?.({ clientLogos: updated });
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("metaspace_config_updated", { detail: { clientLogos: updated } }));
    }
    handleSaveConfig({ clientLogos: updated });
    handleSaveMediaToCloudDb({ clientLogos: updated });
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
        onConfigChange?.({ clientLogos: list });
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("metaspace_config_updated", { detail: { clientLogos: list } }));
        }
        handleSaveConfig({ clientLogos: list });
        handleSaveMediaToCloudDb({ clientLogos: list });
        setMessage(`Uploaded custom logo for "${list[index].name}"!`);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleResetDefaultClientLogos = () => {
    if (!window.confirm("Reset client logos back to original institutional partners?")) return;
    setClientLogos(CLIENT_LOGOS_DATA);
    onConfigChange?.({ clientLogos: CLIENT_LOGOS_DATA });
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("metaspace_config_updated", { detail: { clientLogos: CLIENT_LOGOS_DATA } }));
    }
    handleSaveConfig({ clientLogos: CLIENT_LOGOS_DATA });
    handleSaveMediaToCloudDb({ clientLogos: CLIENT_LOGOS_DATA });
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
              Enter admin credentials & password
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
            Connected database: <strong className="text-brand-blue uppercase">Google Cloud Firestore & Local Persistent Ledger (Live 🟢)</strong>
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
          { id: "insights_editor", label: "Insights & Articles", icon: <BookOpen size={13} /> },
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
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Action Bar & Save to DB Button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white border border-gray-100 p-4 rounded-2xl shadow-xs">
            <div>
              <h3 className="font-display font-bold text-sm text-brand-blue flex items-center gap-2">
                <Calendar size={16} className="text-brand-crimson" />
                Bookings Ledger & Inquiries Database
              </h3>
              <p className="text-[11px] text-gray-400">
                Manage active consultation bookings, partnership requests, and client submissions synchronized with Firestore.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleSaveLedgerToCloudDb()}
              disabled={tabIsSaving.ledger}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition shadow flex items-center gap-2 cursor-pointer shrink-0"
            >
              {tabIsSaving.ledger ? <Loader2 size={13} className="animate-spin" /> : <Database size={13} />}
              <span>{tabIsSaving.ledger ? "Saving to DB & Verifying..." : "Save Bookings Ledger to DB"}</span>
            </button>
          </div>

          <CloudSaveNoticeBanner 
            notice={tabSaveNotices.ledger} 
            onDismiss={() => setTabSaveNotices(prev => ({ ...prev, ledger: null }))} 
          />

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
          {/* Action Bar & Save to DB Button */}
          <div className="lg:col-span-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white border border-gray-100 p-4 rounded-2xl shadow-xs">
            <div>
              <h3 className="font-display font-bold text-sm text-brand-blue flex items-center gap-2">
                <Edit3 size={16} className="text-brand-crimson" />
                Page Text & Layout Configuration
              </h3>
              <p className="text-[11px] text-gray-400">
                Edit headlines, color themes, mission statements, and core copy across Home, About Us, and Services synchronized to Firestore.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleSavePageTextToCloudDb()}
              disabled={tabIsSaving.text_editor}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition shadow flex items-center gap-2 cursor-pointer shrink-0"
            >
              {tabIsSaving.text_editor ? <Loader2 size={13} className="animate-spin" /> : <Database size={13} />}
              <span>{tabIsSaving.text_editor ? "Saving to DB & Verifying..." : "Save Page Text & Layout to DB"}</span>
            </button>
          </div>

          <div className="lg:col-span-12">
            <CloudSaveNoticeBanner 
              notice={tabSaveNotices.text_editor} 
              onDismiss={() => setTabSaveNotices(prev => ({ ...prev, text_editor: null }))} 
            />
          </div>

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
                  onClick={() => handleSavePageTextToCloudDb({
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
                  onClick={() => handleSavePageTextToCloudDb({
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
                  onClick={() => handleSavePageTextToCloudDb({
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
            
            {/* CLOUD DATABASE & STORAGE (GOOGLE CLOUD FIRESTORE) */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 space-y-4 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500" />
              <div className="flex items-center justify-between pb-2 border-b border-gray-50">
                <h3 className="font-display font-bold text-sm text-brand-blue flex items-center gap-1.5">
                  <Database size={14} className="text-amber-500" />
                  <span>Cloud Database & Storage</span>
                </h3>
                <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase rounded-full bg-emerald-100 text-emerald-700 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Firestore Live 🟢</span>
                </span>
              </div>

              <div className="space-y-3.5">
                {/* Configuration Specs */}
                <div className="p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-amber-900 uppercase">Provider</span>
                    <span className="text-[10px] font-mono font-bold text-amber-800">Google Cloud Firestore</span>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-amber-950 uppercase flex items-center justify-between">
                      <span>Firestore Database ID</span>
                      <span className="text-[9px] font-mono text-gray-500">europe-west2</span>
                    </label>
                    <input
                      type="text"
                      value={cloudDbId}
                      onChange={(e) => setCloudDbId(e.target.value)}
                      placeholder="ai-studio-metaspaceconsult-9ba2a98e-157c-4575-bf8c-0d59e54caf50"
                      className="w-full px-2.5 py-1.5 text-[11px] font-mono bg-white border border-amber-200 focus:border-amber-500 rounded-lg outline-none text-gray-800"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-amber-950 uppercase">
                      Cloud Storage Bucket
                    </label>
                    <input
                      type="text"
                      value={cloudStorageBucket}
                      onChange={(e) => setCloudStorageBucket(e.target.value)}
                      placeholder="gen-lang-client-0889935436.firebasestorage.app"
                      className="w-full px-2.5 py-1.5 text-[11px] font-mono bg-white border border-amber-200 focus:border-amber-500 rounded-lg outline-none text-gray-800"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div>
                      <label className="text-[9px] font-bold text-amber-950 uppercase block mb-1">
                        Sync Strategy
                      </label>
                      <select
                        value={cloudSyncMode}
                        onChange={(e) => setCloudSyncMode(e.target.value)}
                        className="w-full px-2 py-1.5 text-[10px] bg-white border border-amber-200 rounded-lg outline-none font-sans text-gray-700"
                      >
                        <option value="realtime_mirror">Realtime Mirroring</option>
                        <option value="scheduled_backup">Scheduled Sync</option>
                        <option value="manual_commit">Manual On-Demand</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[9px] font-bold text-amber-950 uppercase block mb-1">
                        Auto-Mirror
                      </label>
                      <button
                        type="button"
                        onClick={() => setCloudAutoSync(!cloudAutoSync)}
                        className={`w-full py-1.5 px-2 text-[10px] font-bold rounded-lg border transition flex items-center justify-center gap-1 cursor-pointer ${
                          cloudAutoSync 
                            ? "bg-emerald-50 border-emerald-300 text-emerald-800" 
                            : "bg-gray-100 border-gray-200 text-gray-600"
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${cloudAutoSync ? "bg-emerald-500" : "bg-gray-400"}`} />
                        <span>{cloudAutoSync ? "Enabled 🟢" : "Disabled ⚪"}</span>
                      </button>
                    </div>
                  </div>

                  <div className="pt-1 flex items-center justify-between border-t border-amber-200/50 text-[10px]">
                    <span className="font-bold text-amber-900 uppercase">Engine Status</span>
                    <span className="font-bold text-emerald-600">Provisioned & Live 🟢</span>
                  </div>
                </div>

                {/* Tracked Collections Summary */}
                <div className="p-2.5 bg-gray-50 border border-gray-100 rounded-xl space-y-1.5">
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">
                    Synchronized Collections
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-2 py-0.5 bg-white border border-gray-200 rounded-md text-[10px] text-gray-700 font-mono">
                      site_config <span className="text-emerald-600 font-bold">✓</span>
                    </span>
                    <span className="px-2 py-0.5 bg-white border border-gray-200 rounded-md text-[10px] text-gray-700 font-mono">
                      consultations ({consultations.length}) <span className="text-emerald-600 font-bold">✓</span>
                    </span>
                    <span className="px-2 py-0.5 bg-white border border-gray-200 rounded-md text-[10px] text-gray-700 font-mono">
                      contact_inquiries ({inquiries.length}) <span className="text-emerald-600 font-bold">✓</span>
                    </span>
                    <span className="px-2 py-0.5 bg-white border border-gray-200 rounded-md text-[10px] text-gray-700 font-mono">
                      ventures ({ventures.length}) <span className="text-emerald-600 font-bold">✓</span>
                    </span>
                  </div>
                </div>

                {/* PRIMARY ACTION: SAVE BUTTON */}
                <button
                  type="button"
                  id="btn-save-cloud-database"
                  onClick={handleSaveCloudDatabaseAndStorage}
                  disabled={isSavingCloud}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 transition cursor-pointer shadow-sm disabled:opacity-50"
                >
                  {isSavingCloud ? (
                    <>
                      <Loader2 size={13} className="animate-spin" />
                      <span>Saving & Verifying Cloud Data...</span>
                    </>
                  ) : (
                    <>
                      <Save size={13} />
                      <span>Save to Cloud Database & Storage</span>
                    </>
                  )}
                </button>

                {/* RETURN NOTICE: IF DATA WAS INDEED SAVED OR NOT */}
                {cloudSaveNotice && (
                  <div
                    id="cloud-save-notice"
                    className={`p-3.5 rounded-xl border text-xs leading-relaxed transition-all duration-200 ${
                      cloudSaveNotice.saved
                        ? "bg-emerald-50/90 border-emerald-300 text-emerald-950 shadow-xs"
                        : "bg-rose-50/90 border-rose-300 text-rose-950 shadow-xs"
                    }`}
                  >
                    <div className="flex items-center justify-between pb-1 mb-1.5 border-b border-black/5">
                      <div className="flex items-center gap-1.5 font-bold">
                        {cloudSaveNotice.saved ? (
                          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                        ) : (
                          <AlertTriangle size={16} className="text-rose-600 shrink-0" />
                        )}
                        <span className={cloudSaveNotice.saved ? "text-emerald-900 font-bold" : "text-rose-900 font-bold"}>
                          {cloudSaveNotice.saved ? "Data Indeed Saved Successfully!" : "Notice: Data Was NOT Saved"}
                        </span>
                      </div>
                      <span className={`text-[9px] font-mono font-extrabold px-1.5 py-0.5 rounded uppercase ${
                        cloudSaveNotice.saved ? "bg-emerald-200 text-emerald-900" : "bg-rose-200 text-rose-900"
                      }`}>
                        {cloudSaveNotice.saved ? "Verified 🟢" : "Failed 🔴"}
                      </span>
                    </div>

                    <p className={`text-[11px] ${cloudSaveNotice.saved ? "text-emerald-800" : "text-rose-800"}`}>
                      {cloudSaveNotice.message}
                    </p>

                    <div className="mt-2 pt-2 border-t border-black/5 flex items-center justify-between text-[10px] text-gray-500 font-mono">
                      <span>Timestamp: {cloudSaveNotice.timestamp}</span>
                      {cloudSaveNotice.saved && (
                        <span className="text-emerald-700 font-semibold flex items-center gap-0.5">
                          Read-Back Confirmed ✓
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* SECONDARY ACTION: TEST CONNECTION */}
                {firestoreTestResult && (
                  <div className="p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs leading-relaxed font-sans">
                    {firestoreTestResult}
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleTestFirestore}
                  disabled={isTestingFirestore}
                  className="w-full py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-900 text-[10px] font-bold uppercase tracking-wider rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer border border-amber-200/80"
                >
                  {isTestingFirestore ? <Loader2 size={12} className="animate-spin" /> : <Database size={12} className="text-amber-700" />}
                  <span>{isTestingFirestore ? "Pinging Cloud Firestore..." : "Test Firestore Connection"}</span>
                </button>
              </div>
            </div>

            {/* SMTP MAIL SERVER INTEGRATION (STANDARD NODE-BASED MAIL TRANSPORT) */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 space-y-4 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-brand-blue" />
              <div className="flex items-center justify-between pb-2 border-b border-gray-50">
                <h3 className="font-display font-bold text-sm text-brand-blue flex items-center gap-1.5">
                  <Mail size={14} className="text-brand-blue" />
                  <span>Node.js SMTP Mail Delivery Service</span>
                </h3>
                <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase rounded-full bg-emerald-100 text-emerald-800">
                  Standard Transport Pool
                </span>
              </div>

              {/* Quick Provider Presets */}
              <div className="space-y-1.5">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Quick Fill Presets:</span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setSmtpHost("smtp.gmail.com");
                      setSmtpPort("465");
                      setSmtpSecure(true);
                      setMessage("Applied Google Gmail preset (Port 465 SSL). Please use your 16-character Google App Password.");
                      setTimeout(() => setMessage(""), 5000);
                    }}
                    className="px-2.5 py-1 text-[10px] font-bold bg-blue-50 text-brand-blue hover:bg-brand-blue hover:text-white rounded-md transition cursor-pointer border border-blue-200"
                  >
                    Google Gmail (465 SSL)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSmtpHost("smtp-relay.brevo.com");
                      setSmtpPort("587");
                      setSmtpSecure(false);
                      setMessage("Applied Brevo / Sendinblue preset (Port 587 STARTTLS). Free 300 emails/day.");
                      setTimeout(() => setMessage(""), 5000);
                    }}
                    className="px-2.5 py-1 text-[10px] font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white rounded-md transition cursor-pointer border border-emerald-200"
                  >
                    Brevo Free SMTP (587 TLS)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSmtpHost("smtp.sendgrid.net");
                      setSmtpPort("587");
                      setSmtpSecure(false);
                      setMessage("Applied SendGrid preset (Port 587 STARTTLS). Use 'apikey' as username.");
                      setTimeout(() => setMessage(""), 5000);
                    }}
                    className="px-2 py-1 text-[10px] font-semibold bg-gray-100 hover:bg-brand-blue hover:text-white rounded-md transition cursor-pointer"
                  >
                    SendGrid (587 TLS)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSmtpHost("smtp.office365.com");
                      setSmtpPort("587");
                      setSmtpSecure(false);
                      setMessage("Applied Microsoft 365 preset (Port 587 STARTTLS).");
                      setTimeout(() => setMessage(""), 4000);
                    }}
                    className="px-2 py-1 text-[10px] font-semibold bg-gray-100 hover:bg-brand-blue hover:text-white rounded-md transition cursor-pointer"
                  >
                    Microsoft 365 (587 TLS)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSmtpHost("mail.privateemail.com");
                      setSmtpPort("465");
                      setSmtpSecure(true);
                      setMessage("Applied Namecheap PrivateEmail preset (Port 465 SSL).");
                      setTimeout(() => setMessage(""), 4000);
                    }}
                    className="px-2 py-1 text-[10px] font-semibold bg-gray-100 hover:bg-brand-blue hover:text-white rounded-md transition cursor-pointer"
                  >
                    PrivateEmail (465 SSL)
                  </button>
                </div>
              </div>

              {/* DOMAIN PARKING WARNING NOTICE */}
              {smtpHost.includes("metaspaceconsulting.com") && (
                <div className="p-3 bg-amber-50 border border-amber-200/90 rounded-xl text-[11px] text-amber-900 space-y-1.5 animate-in fade-in duration-200">
                  <div className="flex items-center gap-1.5 font-bold text-amber-800">
                    <AlertTriangle size={14} className="text-amber-600 shrink-0" />
                    <span>Domain Registrar Parking Notice (ECONNREFUSED Root Cause):</span>
                  </div>
                  <p className="leading-relaxed">
                    <code>metaspaceconsulting.com</code> currently resolves to <code>212.123.41.108</code>, which is the domain registrar's parking web server (hold page pending ICANN verification). It has <strong>no SMTP mail server running on port 465 or 587</strong>, causing an immediate connection refusal.
                  </p>
                  <p className="font-semibold text-brand-blue pt-0.5">
                    Recommended Fix: Click the <strong>Google Gmail (465 SSL)</strong> preset button above, enter your email and a 16-character Google App Password, or select <strong>Brevo Free SMTP</strong>.
                  </p>
                </div>
              )}

              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2 flex flex-col space-y-1">
                    <label className="text-[9px] font-bold text-gray-400 uppercase">SMTP Host</label>
                    <input
                      type="text"
                      value={smtpHost}
                      onChange={(e) => setSmtpHost(e.target.value)}
                      placeholder="e.g. mail.metaspaceconsulting.com or smtp.gmail.com"
                      className="px-2.5 py-1.5 text-xs bg-gray-50 border border-gray-200 focus:border-brand-blue rounded-lg outline-none font-mono"
                    />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <label className="text-[9px] font-bold text-gray-400 uppercase">Port</label>
                    <input
                      type="text"
                      value={smtpPort}
                      onChange={(e) => setSmtpPort(e.target.value)}
                      placeholder="465 or 587"
                      className="px-2.5 py-1.5 text-xs bg-gray-50 border border-gray-200 focus:border-brand-blue rounded-lg outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-gray-700">SSL / TLS Encryption</span>
                    <span className="text-[9px] text-gray-400">Port 465 uses SSL/TLS; Port 587 uses STARTTLS</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={smtpSecure}
                    onChange={(e) => setSmtpSecure(e.target.checked)}
                    className="w-4 h-4 text-brand-blue rounded cursor-pointer"
                  />
                </div>

                <div className="flex flex-col space-y-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase">SMTP Username / Email</label>
                  <input
                    type="text"
                    value={smtpUser}
                    onChange={(e) => setSmtpUser(e.target.value)}
                    placeholder="e.g. info@metaspaceconsulting.com"
                    className="px-2.5 py-1.5 text-xs bg-gray-50 border border-gray-200 focus:border-brand-blue rounded-lg outline-none font-mono"
                  />
                </div>

                <div className="flex flex-col space-y-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase">SMTP Password / App Password</label>
                  <input
                    type="password"
                    value={smtpPass}
                    onChange={(e) => setSmtpPass(e.target.value)}
                    placeholder="Enter SMTP password or 16-char App Password"
                    className="px-2.5 py-1.5 text-xs bg-gray-50 border border-gray-200 focus:border-brand-blue rounded-lg outline-none font-mono"
                  />
                  <span className="text-[9px] text-gray-400">For Gmail/Workspace, generate a 16-character App Password under Google Account &gt; Security.</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col space-y-1">
                    <label className="text-[9px] font-bold text-gray-400 uppercase">Sender Name</label>
                    <input
                      type="text"
                      value={smtpFromName}
                      onChange={(e) => setSmtpFromName(e.target.value)}
                      placeholder="Metaspace Consulting"
                      className="px-2.5 py-1.5 text-xs bg-gray-50 border border-gray-200 focus:border-brand-blue rounded-lg outline-none"
                    />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <label className="text-[9px] font-bold text-gray-400 uppercase">Sender Email</label>
                    <input
                      type="text"
                      value={smtpFromEmail}
                      onChange={(e) => setSmtpFromEmail(e.target.value)}
                      placeholder="info@metaspaceconsulting.com"
                      className="px-2.5 py-1.5 text-xs bg-gray-50 border border-gray-200 focus:border-brand-blue rounded-lg outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="flex flex-col space-y-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase">Admin Notification Target</label>
                  <input
                    type="email"
                    value={notificationEmail}
                    onChange={(e) => setNotificationEmail(e.target.value)}
                    placeholder="e.g. usiobaifovictory245@gmail.com"
                    className="px-2.5 py-1.5 text-xs bg-gray-50 border border-gray-200 focus:border-brand-blue rounded-lg outline-none"
                  />
                </div>

                {smtpTestResult && (
                  <div className="p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs leading-relaxed font-sans break-words">
                    {smtpTestResult}
                  </div>
                )}

                <div className="grid grid-cols-3 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleVerifySmtp}
                    disabled={isVerifyingSmtp || isTestingSmtp}
                    className="py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-[10px] font-bold uppercase tracking-wider rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer border border-gray-300"
                  >
                    {isVerifyingSmtp ? <Loader2 size={12} className="animate-spin" /> : <ShieldCheck size={12} />}
                    <span>{isVerifyingSmtp ? "Verifying..." : "Verify Socket"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleTestSmtp}
                    disabled={isTestingSmtp || isVerifyingSmtp}
                    className="py-2.5 bg-brand-blue hover:bg-brand-navy text-white text-[10px] font-bold uppercase tracking-wider rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    {isTestingSmtp ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />}
                    <span>{isTestingSmtp ? "Testing..." : "Test Dispatch"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveSmtp}
                    className="py-2.5 bg-gray-800 hover:bg-black text-white text-[10px] font-bold uppercase tracking-wider rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <Save size={12} />
                    <span>Save SMTP</span>
                  </button>
                </div>
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
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Action Bar & Save to DB Button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white border border-gray-100 p-4 rounded-2xl shadow-xs">
            <div>
              <h3 className="font-display font-bold text-sm text-brand-blue flex items-center gap-2">
                <ImageIcon size={16} className="text-brand-crimson" />
                Images & Client Logos Placements
              </h3>
              <p className="text-[11px] text-gray-400">
                Replace brand logo, Lagos bridge hero imagery, and customize partner logos carousel synchronized with Firestore.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleSaveMediaToCloudDb()}
              disabled={tabIsSaving.media_editor}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition shadow flex items-center gap-2 cursor-pointer shrink-0"
            >
              {tabIsSaving.media_editor ? <Loader2 size={13} className="animate-spin" /> : <Database size={13} />}
              <span>{tabIsSaving.media_editor ? "Saving to DB & Verifying..." : "Save Images & Client Logos to DB"}</span>
            </button>
          </div>

          <CloudSaveNoticeBanner 
            notice={tabSaveNotices.media_editor} 
            onDismiss={() => setTabSaveNotices(prev => ({ ...prev, media_editor: null }))} 
          />

          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 space-y-8">
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

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSaveMediaToCloudDb({ clientLogos })}
                  disabled={tabIsSaving.media_editor}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-[10px] font-bold uppercase tracking-wider transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  {tabIsSaving.media_editor ? <Loader2 size={11} className="animate-spin" /> : <Save size={11} />}
                  <span>{tabIsSaving.media_editor ? "Saving to DB..." : "Save Carousel to DB"}</span>
                </button>
                <button
                  type="button"
                  onClick={handleResetDefaultClientLogos}
                  className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl text-[10px] font-bold uppercase tracking-wider transition flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw size={11} />
                  <span>Reset Default Showcase</span>
                </button>
                <button
                  type="button"
                  onClick={handleAddClientLogo}
                  className="px-3 py-1.5 bg-brand-crimson hover:bg-red-700 text-white rounded-xl text-[10px] font-bold uppercase tracking-wider transition flex items-center gap-1.5 shadow-sm cursor-pointer"
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
                      className="p-1.5 text-gray-400 hover:text-brand-crimson hover:bg-red-50 rounded-lg transition cursor-pointer"
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
                          onBlur={() => handleSaveMediaToCloudDb({ clientLogos })}
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
                          onBlur={() => handleSaveMediaToCloudDb({ clientLogos })}
                          placeholder="https://... or data:image/..."
                          className="w-full text-[10px] text-gray-600 px-3 py-1.5 bg-white border border-gray-200 rounded-xl focus:border-brand-blue focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick save banner for carousel */}
            <div className="p-3.5 bg-blue-50/70 border border-blue-100/80 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-brand-blue font-medium">
                <Database size={15} className="text-brand-crimson shrink-0" />
                <span>Changed carousel partner logos? Save them directly into the database to reflect instantly across all visitor sessions.</span>
              </div>
              <button
                type="button"
                onClick={() => handleSaveMediaToCloudDb({ clientLogos })}
                disabled={tabIsSaving.media_editor}
                className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold uppercase tracking-wider rounded-xl transition shadow flex items-center justify-center gap-2 cursor-pointer shrink-0 disabled:opacity-50"
              >
                {tabIsSaving.media_editor ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
                <span>{tabIsSaving.media_editor ? "Saving to DB..." : "Save Carousel to DB"}</span>
              </button>
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
      </div>
      )}

      {/* TAB 4: VENTURES & SERVICES */}
      {activeAdminTab === "ventures_services" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Action Bar & Save to DB Button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white border border-gray-100 p-4 rounded-2xl shadow-xs">
            <div>
              <h3 className="font-display font-bold text-sm text-brand-blue flex items-center gap-2">
                <Rocket size={16} className="text-brand-crimson" />
                Ventures Portfolio & Services Offerings
              </h3>
              <p className="text-[11px] text-gray-400">
                Manage flagship venture investments, executive taglines, operational frameworks, and strategic advisory pillars in Firestore.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleSaveVenturesServicesToCloudDb()}
              disabled={tabIsSaving.ventures_services}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition shadow flex items-center gap-2 cursor-pointer shrink-0"
            >
              {tabIsSaving.ventures_services ? <Loader2 size={13} className="animate-spin" /> : <Database size={13} />}
              <span>{tabIsSaving.ventures_services ? "Saving to DB & Verifying..." : "Save Ventures & Services to DB"}</span>
            </button>
          </div>

          <CloudSaveNoticeBanner 
            notice={tabSaveNotices.ventures_services} 
            onDismiss={() => setTabSaveNotices(prev => ({ ...prev, ventures_services: null }))} 
          />

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
                  onClick={() => handleSaveVenturesServicesToCloudDb()}
                  disabled={tabIsSaving.ventures_services}
                  className="px-4 py-2 bg-brand-crimson hover:bg-red-800 disabled:opacity-50 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg flex items-center gap-1 transition shadow cursor-pointer"
                >
                  {tabIsSaving.ventures_services ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
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
                onClick={() => handleSaveVenturesServicesToCloudDb()}
                disabled={tabIsSaving.ventures_services}
                className="px-4 py-2 bg-brand-crimson hover:bg-red-800 disabled:opacity-50 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg flex items-center gap-1 transition shadow cursor-pointer"
              >
                {tabIsSaving.ventures_services ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
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

      {/* TAB: INSIGHTS & ARTICLES EDITOR */}
      {activeAdminTab === "insights_editor" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Notice Banner */}
          <CloudSaveNoticeBanner 
            notice={tabSaveNotices.insights_editor} 
            onDismiss={() => setTabSaveNotices(prev => ({ ...prev, insights_editor: null }))} 
          />

          {/* Action Bar & Save to DB Button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white border border-gray-100 p-4 rounded-2xl shadow-xs">
            <div>
              <h3 className="font-display font-bold text-sm text-brand-blue flex items-center gap-2">
                <BookOpen size={16} className="text-brand-crimson" />
                Insights & Thought Leadership Articles
              </h3>
              <p className="text-[11px] text-gray-400">
                Create, edit, correct, or remove publication articles displayed on the public Insights page. Fully synchronized with Firestore.
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={handleStartNewInsight}
                className="px-4 py-2.5 bg-brand-blue hover:bg-blue-900 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition shadow flex items-center gap-2 cursor-pointer shrink-0"
              >
                <Plus size={13} />
                <span>Write New Article</span>
              </button>
              <button
                type="button"
                onClick={() => handleSaveInsightsToCloudDb()}
                disabled={tabIsSaving.insights_editor}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition shadow flex items-center gap-2 cursor-pointer shrink-0"
              >
                {tabIsSaving.insights_editor ? <Loader2 size={13} className="animate-spin" /> : <Database size={13} />}
                <span>{tabIsSaving.insights_editor ? "Saving..." : "Save Insights to Cloud DB"}</span>
              </button>
            </div>
          </div>

          {/* Creation / Correction Form Drawer */}
          {isCreatingInsight && (
            <div className="bg-gradient-to-b from-blue-50/60 to-white border-2 border-blue-200/80 rounded-2xl p-5 sm:p-7 shadow-md space-y-5 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-blue-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-brand-crimson text-white flex items-center justify-center font-bold">
                    {editingInsightId ? <Edit3 size={16} /> : <Plus size={16} />}
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-sm text-brand-blue">
                      {editingInsightId ? "Editing Article / Applying Corrections" : "Create New Insight Article"}
                    </h4>
                    <p className="text-[11px] text-gray-500">
                      {editingInsightId 
                        ? "Update content, title, category, or cover photography. Changes sync live across the platform."
                        : "Draft a new knowledge base post for public display and cloud persistence."
                      }
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={resetInsightForm}
                  className="text-xs text-gray-400 hover:text-gray-700 font-bold px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
              </div>

              <form onSubmit={handleSaveInsight} className="space-y-4">
                {/* Title */}
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider flex items-center justify-between">
                    <span>Article Title <span className="text-brand-crimson">*</span></span>
                    <span className="text-[10px] text-gray-400 font-normal">Clear, compelling title for the post</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={insightTitle}
                    onChange={(e) => setInsightTitle(e.target.value)}
                    placeholder="e.g. Scaling Tech Ventures Across Emerging African Markets"
                    className="px-3.5 py-2.5 text-xs sm:text-sm font-semibold bg-white border border-gray-200 focus:border-brand-blue rounded-xl outline-none transition"
                  />
                </div>

                {/* Metadata Row: Category, Author, Read Time, Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                  {/* Category */}
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider">
                      Category <span className="text-brand-crimson">*</span>
                    </label>
                    <select
                      value={insightCategory}
                      onChange={(e) => setInsightCategory(e.target.value)}
                      className="px-3 py-2 text-xs bg-white border border-gray-200 focus:border-brand-blue rounded-xl outline-none"
                    >
                      <option value="Venture Builder">Venture Builder</option>
                      <option value="Digital Transformation">Digital Transformation</option>
                      <option value="Startup Policy">Startup Policy</option>
                      <option value="Healthcare Tech">Healthcare Tech</option>
                      <option value="Custom">Custom Category...</option>
                    </select>
                    {insightCategory === "Custom" && (
                      <input
                        type="text"
                        value={insightCustomCategory}
                        onChange={(e) => setInsightCustomCategory(e.target.value)}
                        placeholder="Enter custom category..."
                        className="mt-1 px-3 py-1.5 text-xs bg-white border border-brand-crimson/50 focus:border-brand-crimson rounded-lg outline-none"
                      />
                    )}
                  </div>

                  {/* Author */}
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider">
                      Author Name
                    </label>
                    <input
                      type="text"
                      value={insightAuthor}
                      onChange={(e) => setInsightAuthor(e.target.value)}
                      placeholder="e.g. Osaze Omonbude"
                      className="px-3 py-2 text-xs bg-white border border-gray-200 focus:border-brand-blue rounded-xl outline-none"
                    />
                  </div>

                  {/* Read Time */}
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider">
                      Read Time
                    </label>
                    <input
                      type="text"
                      value={insightReadTime}
                      onChange={(e) => setInsightReadTime(e.target.value)}
                      placeholder="e.g. 5 min read"
                      className="px-3 py-2 text-xs bg-white border border-gray-200 focus:border-brand-blue rounded-xl outline-none"
                    />
                  </div>

                  {/* Publication Date */}
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider">
                      Publication Date
                    </label>
                    <input
                      type="text"
                      value={insightDate}
                      onChange={(e) => setInsightDate(e.target.value)}
                      placeholder="e.g. September 2026"
                      className="px-3 py-2 text-xs bg-white border border-gray-200 focus:border-brand-blue rounded-xl outline-none"
                    />
                  </div>
                </div>

                {/* Cover Image URL & Preview */}
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider flex items-center justify-between">
                    <span>Cover Photo URL</span>
                    <span className="text-[10px] text-gray-400 font-normal">High-resolution banner photography</span>
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="url"
                      value={insightImage}
                      onChange={(e) => setInsightImage(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="flex-1 px-3.5 py-2 text-xs bg-white border border-gray-200 focus:border-brand-blue rounded-xl outline-none"
                    />
                    {insightImage && (
                      <div className="w-16 h-10 rounded-lg overflow-hidden border border-gray-200 shrink-0 bg-gray-100">
                        <img 
                          src={insightImage} 
                          alt="Cover Preview" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </div>
                  {/* Preset quick picks */}
                  <div className="flex items-center gap-2 pt-1 flex-wrap text-[10px] text-gray-500">
                    <span className="font-semibold">Quick Photo Presets:</span>
                    <button
                      type="button"
                      onClick={() => setInsightImage("https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80")}
                      className="text-brand-blue hover:underline cursor-pointer"
                    >
                      Team Collaboration
                    </button>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={() => setInsightImage("https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80")}
                      className="text-brand-blue hover:underline cursor-pointer"
                    >
                      Global Tech
                    </button>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={() => setInsightImage("https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80")}
                      className="text-brand-blue hover:underline cursor-pointer"
                    >
                      Health Systems
                    </button>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={() => setInsightImage("https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80")}
                      className="text-brand-blue hover:underline cursor-pointer"
                    >
                      Venture Studio
                    </button>
                  </div>
                </div>

                {/* Article Summary */}
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider flex items-center justify-between">
                    <span>Summary / Lead Excerpt <span className="text-brand-crimson">*</span></span>
                    <span className="text-[10px] text-gray-400 font-normal">Displayed on cards and social previews (1-3 sentences)</span>
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={insightSummary}
                    onChange={(e) => setInsightSummary(e.target.value)}
                    placeholder="Brief overview summarizing the core thesis of the article..."
                    className="px-3.5 py-2 text-xs bg-white border border-gray-200 focus:border-brand-blue rounded-xl outline-none leading-relaxed"
                  />
                </div>

                {/* Full Article Content */}
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider flex items-center justify-between">
                    <span>Full Article Body <span className="text-brand-crimson">*</span></span>
                    <span className="text-[10px] text-gray-400 font-normal">Complete thought leadership article. Use paragraphs for natural flow.</span>
                  </label>
                  <textarea
                    required
                    rows={8}
                    value={insightContent}
                    onChange={(e) => setInsightContent(e.target.value)}
                    placeholder="Write the full comprehensive article body text here..."
                    className="px-3.5 py-2.5 text-xs bg-white border border-gray-200 focus:border-brand-blue rounded-xl outline-none leading-relaxed font-sans"
                  />
                </div>

                {/* Submit / Cancel Buttons */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-blue-100">
                  <button
                    type="button"
                    onClick={resetInsightForm}
                    className="px-4 py-2.5 text-xs font-bold text-gray-600 hover:text-gray-900 border border-gray-200 hover:bg-gray-100 rounded-xl transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={tabIsSaving.insights_editor}
                    className="px-6 py-2.5 bg-brand-crimson hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition shadow flex items-center gap-2 cursor-pointer"
                  >
                    <Save size={14} />
                    <span>{editingInsightId ? "Apply Corrections & Save" : "Publish Article to Site"}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Articles Filter & Search Bar */}
          <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={insightSearch}
                onChange={(e) => setInsightSearch(e.target.value)}
                placeholder="Search articles by title, author, or keyword..."
                className="w-full pl-9 pr-3.5 py-2 text-xs bg-gray-50 focus:bg-white border border-gray-200 focus:border-brand-blue rounded-xl outline-none transition"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mr-1">Filter:</span>
              {["all", "Venture Builder", "Digital Transformation", "Startup Policy", "Healthcare Tech"].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setInsightCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-lg font-bold text-[11px] transition cursor-pointer ${
                    insightCategoryFilter === cat
                      ? "bg-brand-blue text-white shadow-xs"
                      : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {cat === "all" ? "All Articles" : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Articles Directory List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Published Knowledge Base ({insights.length} Total Articles)
              </span>
              <span className="text-[11px] text-gray-400">
                Click "Edit / Correct" on any post to modify details, fix errors, or update content.
              </span>
            </div>

            {insights
              .filter((post) => {
                const matchesSearch = 
                  !insightSearch.trim() ||
                  post.title?.toLowerCase().includes(insightSearch.toLowerCase()) ||
                  post.author?.toLowerCase().includes(insightSearch.toLowerCase()) ||
                  post.summary?.toLowerCase().includes(insightSearch.toLowerCase());
                const matchesCat = 
                  insightCategoryFilter === "all" || post.category === insightCategoryFilter;
                return matchesSearch && matchesCat;
              })
              .map((post, idx) => (
                <div
                  key={post.id || idx}
                  className={`bg-white border rounded-2xl p-4 sm:p-5 shadow-xs transition hover:shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                    editingInsightId === post.id 
                      ? "border-brand-crimson ring-2 ring-brand-crimson/20 bg-red-50/10" 
                      : "border-gray-100 hover:border-gray-200"
                  }`}
                >
                  {/* Left: Thumbnail & Info */}
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-100">
                      <img
                        src={post.image || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"}
                        alt={post.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 bg-blue-50 text-brand-blue font-bold text-[10px] rounded-md uppercase tracking-wider">
                          {post.category}
                        </span>
                        <span className="text-gray-400 text-[11px] flex items-center gap-1">
                          <Clock size={11} />
                          {post.readTime || "5 min read"}
                        </span>
                        <span className="text-gray-300">•</span>
                        <span className="text-gray-400 text-[11px]">
                          {post.date}
                        </span>
                      </div>

                      <h4 className="font-display font-bold text-sm sm:text-base text-gray-900 line-clamp-1">
                        {post.title}
                      </h4>

                      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                        {post.summary}
                      </p>

                      <div className="pt-1 flex items-center gap-2 text-[11px] text-gray-400">
                        <span>By <strong className="text-gray-700">{post.author || "Metaspace Leadership"}</strong></span>
                        <span className="text-gray-300">•</span>
                        <span>ID: <code className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">{post.id}</code></span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center border-t md:border-t-0 pt-2 md:pt-0 w-full md:w-auto justify-end">
                    {/* Move Up/Down */}
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                      <button
                        type="button"
                        onClick={() => handleMoveInsight(idx, "up")}
                        disabled={idx === 0}
                        title="Move Up"
                        className="p-1.5 hover:bg-white text-gray-500 hover:text-brand-blue disabled:opacity-30 transition cursor-pointer"
                      >
                        <ArrowRight size={13} className="-rotate-90" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveInsight(idx, "down")}
                        disabled={idx === insights.length - 1}
                        title="Move Down"
                        className="p-1.5 hover:bg-white text-gray-500 hover:text-brand-blue disabled:opacity-30 transition cursor-pointer"
                      >
                        <ArrowRight size={13} className="rotate-90" />
                      </button>
                    </div>

                    {/* Clone / Duplicate */}
                    <button
                      type="button"
                      onClick={() => handleDuplicateInsight(post)}
                      title="Duplicate / Clone Article"
                      className="p-2 text-gray-500 hover:text-brand-blue bg-gray-50 hover:bg-blue-50 border border-gray-200 rounded-lg transition cursor-pointer"
                    >
                      <Copy size={13} />
                    </button>

                    {/* Edit / Correct Button */}
                    <button
                      type="button"
                      onClick={() => handleStartEditInsight(post)}
                      className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-brand-blue border border-blue-200 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Edit3 size={13} />
                      <span>Edit / Correct</span>
                    </button>

                    {/* Delete Button */}
                    <button
                      type="button"
                      onClick={() => handleDeleteInsight(post.id, post.title)}
                      title="Delete Article"
                      className="p-2 text-gray-400 hover:text-brand-crimson bg-gray-50 hover:bg-red-50 border border-gray-200 hover:border-red-200 rounded-lg transition cursor-pointer"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}

            {insights.length === 0 && (
              <div className="p-8 text-center bg-gray-50 border border-dashed border-gray-200 rounded-2xl space-y-2">
                <BookOpen size={24} className="mx-auto text-gray-400" />
                <p className="text-xs font-semibold text-gray-600">No insight articles in the database yet.</p>
                <button
                  type="button"
                  onClick={handleStartNewInsight}
                  className="px-4 py-2 bg-brand-crimson text-white text-xs font-bold rounded-lg"
                >
                  Create First Article
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      {activeAdminTab === "footer_editor" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Action Bar & Save to DB Button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white border border-gray-100 p-4 rounded-2xl shadow-xs">
            <div>
              <h3 className="font-display font-bold text-sm text-brand-blue flex items-center gap-2">
                <MessageSquare size={16} className="text-brand-crimson" />
                Footer & Chat Support Configuration
              </h3>
              <p className="text-[11px] text-gray-400">
                Update customer WhatsApp helpdesk, institutional email/address contacts, and footer navigation links in Firestore.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleSaveFooterToCloudDb()}
              disabled={tabIsSaving.footer_editor}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition shadow flex items-center gap-2 cursor-pointer shrink-0"
            >
              {tabIsSaving.footer_editor ? <Loader2 size={13} className="animate-spin" /> : <Database size={13} />}
              <span>{tabIsSaving.footer_editor ? "Saving to DB & Verifying..." : "Save Footer & Support to DB"}</span>
            </button>
          </div>

          <CloudSaveNoticeBanner 
            notice={tabSaveNotices.footer_editor} 
            onDismiss={() => setTabSaveNotices(prev => ({ ...prev, footer_editor: null }))} 
          />
          
          {/* SECURITY & ADMIN CREDENTIALS CARD */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 space-y-4">
            <div className="border-b border-gray-100 pb-3 flex justify-between items-center">
              <div>
                <h3 className="font-display font-bold text-sm text-brand-blue flex items-center gap-2">
                  <ShieldCheck size={16} className="text-brand-crimson" />
                  Admin Console Credentials & Security
                </h3>
                <p className="text-[11px] text-gray-400">
                  Update administrator password for <strong>{username}</strong>. Changes take effect across Cloud Firestore & backend configuration.
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
                onClick={() => handleSaveFooterToCloudDb({
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
                disabled={tabIsSaving.footer_editor}
                className="px-4 py-2 bg-brand-crimson hover:bg-red-800 disabled:opacity-50 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg flex items-center gap-1 transition shadow cursor-pointer"
              >
                {tabIsSaving.footer_editor ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
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
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Action Bar & Save to DB Button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white border border-gray-100 p-4 rounded-2xl shadow-xs">
            <div>
              <h3 className="font-display font-bold text-sm text-brand-blue flex items-center gap-2">
                <ShieldCheck size={16} className="text-brand-crimson" />
                Console Administrators & Access Control
              </h3>
              <p className="text-[11px] text-gray-400">
                Manage active console user accounts, assign admin roles, revoke permissions, and synchronize privileges to Cloud Firestore.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleSaveAdminsToCloudDb()}
              disabled={tabIsSaving.admin_security}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition shadow flex items-center gap-2 cursor-pointer shrink-0"
            >
              {tabIsSaving.admin_security ? <Loader2 size={13} className="animate-spin" /> : <Database size={13} />}
              <span>{tabIsSaving.admin_security ? "Saving to DB & Verifying..." : "Save Admins & Access to DB"}</span>
            </button>
          </div>

          <CloudSaveNoticeBanner 
            notice={tabSaveNotices.admin_security} 
            onDismiss={() => setTabSaveNotices(prev => ({ ...prev, admin_security: null }))} 
          />
          
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
                  Update your administrator password across the backend and Cloud Firestore data store.
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
