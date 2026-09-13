import express from "express";
import path from "path";
import dotenv from "dotenv";
import fs from "fs";
import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import { 
  initDatabase, 
  getSiteConfig, 
  updateSiteConfig, 
  getConsultations, 
  addConsultation, 
  updateConsultationStatus, 
  deleteConsultation, 
  getContactInquiries, 
  addContactInquiry, 
  deleteContactInquiry,
  SiteConfig
} from "./db";
import { Consultation, ContactInquiry } from "./src/types";
import { 
  SmtpConfig,
  sendMailWithRobustTransport,
  verifySmtpConnection,
  renderMetaspaceInquiryEmail,
  renderClientConfirmationEmail
} from "./src/lib/mailService";

dotenv.config();

const PORT = 3000;

// Lazy initialize Gemini SDK with telemetry header to prevent top-level crash when GEMINI_API_KEY is not set in Vercel
let aiInstance: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === "") return null;
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({
      apiKey: apiKey.trim(),
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiInstance;
}

/**
 * Resolves active SMTP credentials from provided overrides, persistent database SiteConfig,
 * or standard environment variables with sensible defaults.
 */
async function resolveCurrentSmtpConfig(override?: Partial<SmtpConfig>): Promise<SmtpConfig> {
  const config = await getSiteConfig();
  const host = (override?.host && override.host.trim() !== "") ? override.host : (process.env.SMTP_HOST || config.smtp_host || "");
  const port = Number(override?.port || process.env.SMTP_PORT || config.smtp_port || 465);
  const user = (override?.user && override.user.trim() !== "") ? override.user : (process.env.SMTP_USER || config.smtp_user || "");
  
  let pass = override?.pass;
  if (!pass || pass === "••••••••" || pass.trim() === "") {
    pass = process.env.SMTP_PASS || config.smtp_pass || "";
  }

  const secure = override?.secure !== undefined
    ? Boolean(override.secure)
    : (process.env.SMTP_SECURE !== undefined
        ? process.env.SMTP_SECURE === "true"
        : (port === 465 || config.smtp_secure === true));
  const fromName = override?.fromName || process.env.SMTP_FROM_NAME || config.smtp_from_name || "Metaspace Consulting";
  const fromEmail = override?.fromEmail || process.env.SMTP_FROM_EMAIL || config.smtp_from_email || user;
  const notificationEmail = override?.notificationEmail || process.env.NOTIFICATION_EMAIL || config.notification_email || config.footer_email || "info@metaspaceconsulting.com";

  return {
    host: String(host).trim(),
    port,
    secure,
    user: String(user).trim(),
    pass: String(pass).trim(),
    fromName: String(fromName).trim(),
    fromEmail: String(fromEmail).trim(),
    notificationEmail: String(notificationEmail).trim(),
  };
}

/**
 * Dispatches an inquiry notification using the robust standard node-based mail transport service.
 * Includes HTML + plain-text fallback, custom RFC Message-ID, priority tagging, and direct client Reply-To.
 */
async function sendSmtpInquiryNotification({
  subject,
  title,
  badgeText = "PORTAL TRANSMISSION",
  fields,
  message,
  clientEmail,
  clientName,
  isConsultation = false,
  skipCourtesyConfirmation = false,
  overrideConfig
}: {
  subject: string;
  title: string;
  badgeText?: string;
  fields: { label: string; value: string }[];
  message?: string;
  clientEmail?: string;
  clientName?: string;
  isConsultation?: boolean;
  skipCourtesyConfirmation?: boolean;
  overrideConfig?: Partial<SmtpConfig>;
}): Promise<{ success: boolean; message?: string; error?: string; messageId?: string }> {
  try {
    const smtpConfig = await resolveCurrentSmtpConfig(overrideConfig);

    if (!smtpConfig.host || !smtpConfig.user || !smtpConfig.pass) {
      const notice = "SMTP transport not fully configured (Host, User, or Password missing). Inquiry saved locally/in DB.";
      console.log(`[SMTP Notification] ${notice}`);
      return { success: false, error: notice };
    }

    const { html, text } = renderMetaspaceInquiryEmail({
      title,
      badgeText,
      preheader: `${title}: ${subject}`,
      fields,
      message,
      clientEmail,
      clientName
    });

    const sendResult = await sendMailWithRobustTransport(smtpConfig, {
      to: smtpConfig.notificationEmail,
      subject,
      html,
      text,
      fromName: smtpConfig.fromName,
      fromEmail: smtpConfig.fromEmail,
      replyTo: clientEmail, // Allows admin to click "Reply" and email the client directly
      priority: "high"
    }, 2); // 2 retries with exponential backoff

    // Send courtesy confirmation to the client if a valid client email is provided
    if (!skipCourtesyConfirmation && clientEmail && clientEmail.includes("@") && sendResult.success) {
      try {
        const clientTemplate = renderClientConfirmationEmail({
          clientName: clientName || "Valued Client",
          serviceOrSubject: fields.find(f => f.label.includes("Service") || f.label.includes("Subject"))?.value || "Consulting Advisory",
          isConsultation
        });

        await sendMailWithRobustTransport(smtpConfig, {
          to: clientEmail.trim(),
          subject: isConsultation 
            ? "We have received your consultation request - Metaspace Consulting" 
            : "We have received your inquiry - Metaspace Consulting",
          html: clientTemplate.html,
          text: clientTemplate.text,
          fromName: smtpConfig.fromName,
          fromEmail: smtpConfig.fromEmail,
          replyTo: smtpConfig.notificationEmail
        }, 1);
      } catch (confErr) {
        console.warn("[SMTP Notification] Optional client confirmation note:", confErr);
      }
    }

    return {
      success: sendResult.success,
      message: sendResult.message,
      messageId: sendResult.messageId,
      error: sendResult.error
    };
  } catch (err: any) {
    console.error("[SMTP Notification Error]:", err);
    return { success: false, error: err?.message || String(err) };
  }
}

// Initialize Database
initDatabase().catch((err) => console.warn("Init DB warning:", err));

export const app = express();

// Enable CORS for Vercel & custom domain cross-origin calls
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, x-admin-password");
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

// Normalize Vercel Serverless URL path if present
app.use((req, res, next) => {
  if (req.url && req.url.startsWith("/api/index")) {
    req.url = req.url.replace(/^\/api\/index(\.ts|\.js)?/, "/api");
  }
  next();
});

app.use(express.json({ limit: "50mb" })); // Support large base64 image uploads
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Guarantee application/json headers on API endpoints
app.use("/api", (req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  next();
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Helper to call Gemini with optimized low-latency settings
async function generateContentWithRetry(contents: any, systemInstruction: string, retries = 2, initialDelay = 200) {
  const ai = getGeminiClient();
  if (!ai) {
    throw new Error("GEMINI_API_KEY environment variable is not configured.");
  }
  for (let i = 0; i < retries; i++) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.5,
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        },
      });
      return response;
    } catch (err: any) {
      console.warn(`Gemini API attempt ${i + 1} failed: ${err.message || err}`);
      if (i === retries - 1) {
        throw err; // Propagate error on the final attempt
      }
      const delay = initialDelay * Math.pow(2, i);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

// Synchronously defined API routes for instant handler registration
// API 1: Gemini-powered consulting assistant
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      // Fetch dynamic site config to feed Gemini actual updated details!
      const siteConfig = await getSiteConfig();
      const currentVentures = siteConfig.ventures.map(v => `- ${v.name}: ${v.tagline}. ${v.description}`).join("\n");
      const currentServices = siteConfig.services.map(s => `- ${s.title}: ${s.shortDesc}`).join("\n");
      const rawWa = siteConfig.whatsapp_number || "+2348123456789";
      const cleanWa = rawWa.replace(/[^0-9]/g, "");

      const systemInstruction = `
Your name is "Companion". You are the official AI representative for "Metaspace Consulting Limited", a premium venture design studio and digital transformation company operating across Africa. Your goal is to be professional, welcoming, highly knowledgeable, and helpful.

CRITICAL REQUIREMENT:
You must answer questions based ONLY on the official site information provided below. You are strictly forbidden from answering general inquiries, programming questions, external trivia, or anything outside of Metaspace Consulting Limited's profile.

If a user asks a question that is not directly answered or supported by the site details below, or if you do not have the answer based on this context, you must politely inform them that you do not have that information and direct them to connect with our WhatsApp helpdesk by outputting a link in this format: "Please connect with our WhatsApp helpdesk for support: [WhatsApp Helpdesk](https://wa.me/${cleanWa})".

Here is the exact information about Metaspace Consulting Limited:
- Tagline: "Building Systems. Empowering People. Transforming Africa."
- Location: ${siteConfig.footer_address || "Benin City, Edo State, Nigeria"}. Operating across Africa.
- Mission: Designing, building, and scaling innovative ventures and digital solutions that solve real problems and drive sustainable economic transformation across Africa.

Core Pillars/Offerings:
${currentServices}

Flagship Ventures:
${currentVentures}

Key Stats:
- 4+ Flagship Ventures
- 30+ Partners
- 1000+ Lives Impacted
- Multiple sectors (Edu-tech, transport, health-tech, incubator, advisory)

Tone and Style:
- Professional, confident, elegant, and warm.
- Grounded in African context, highlighting local opportunities and high-impact solutions.
- Keep responses relatively concise and focused on how Metaspace can help.
- If a user expresses interest in partnering or booking a consultation, direct them to use the "Book a Consultation" form on the website!
`;

      // Slice history to the last 4 messages to minimize token processing latency
      const trimmedHistory = Array.isArray(history) ? history.slice(-4) : [];
      const contents = trimmedHistory.length > 0 ? [...trimmedHistory, { role: "user", parts: [{ text: message }] }] : message;

      try {
        const response = await generateContentWithRetry(contents, systemInstruction);
        return res.json({ text: response.text });
      } catch (geminiError: any) {
        console.error("Gemini API exhausted all retries, initiating dynamic local fallback response...", geminiError);
        
        // Dynamic Local Resiliency Fallback based on User message keywords
        const lowerMsg = message.toLowerCase();
        let fallbackText = "";

        if (lowerMsg.includes("book") || lowerMsg.includes("consult") || lowerMsg.includes("schedule") || lowerMsg.includes("hire") || lowerMsg.includes("partner")) {
          fallbackText = "Thank you for your interest! To schedule a consultation with our executive team, please use the standard **'Book a Consultation'** form right here on our website. Simply click the red button at the top right, fill in your details, and we'll get right back to you to co-create your next digital system.";
        } else if (lowerMsg.includes("venture") || lowerMsg.includes("project") || lowerMsg.includes("portfolio") || lowerMsg.includes("build") || lowerMsg.includes("product")) {
          fallbackText = "Metaspace Consulting Limited is a leading venture builder across Africa. We design, fund, and scale flagship initiatives. Our key ventures include:\n\n" + 
            siteConfig.ventures.map(v => `• **${v.name}**: ${v.tagline} — ${v.description}`).join("\n") + 
            "\n\nYou can explore these in depth on the 'Portfolio' section of our website!";
        } else if (lowerMsg.includes("service") || lowerMsg.includes("pillar") || lowerMsg.includes("capability") || lowerMsg.includes("offer") || lowerMsg.includes("what do you do")) {
          fallbackText = "We help organizations architect high-scale technology systems. Our primary capabilities are:\n\n" + 
            siteConfig.services.map(s => `• **${s.title}**: ${s.shortDesc}`).join("\n") + 
            "\n\nYou can find full details on these in the 'Services' section of our website.";
        } else if (lowerMsg.includes("contact") || lowerMsg.includes("where") || lowerMsg.includes("location") || lowerMsg.includes("address") || lowerMsg.includes("email") || lowerMsg.includes("phone")) {
          fallbackText = `Metaspace Consulting Limited is headquartered in ${siteConfig.footer_address || "Benin City, Edo State, Nigeria"}, and operates across Africa. You can send us a message directly via our Contact Inquiry Form located at the bottom of the homepage, or reach our WhatsApp helpdesk: https://wa.me/${cleanWa}`;
        } else if (lowerMsg.includes("hello") || lowerMsg.includes("hi") || lowerMsg.includes("hey") || lowerMsg.includes("who are you")) {
          fallbackText = "Hello! Welcome to Metaspace Consulting Limited's Companion. We are a premium venture design studio and digital transformation partner based in Nigeria, operating across Africa. How can I help you explore our services, flagship ventures, or guide you to booking a consultation today?";
        } else {
          fallbackText = `I apologize, but as your Companion, I can only answer questions based strictly on Metaspace's official site information. For other questions, please connect directly with our WhatsApp helpdesk: [WhatsApp Helpdesk](https://wa.me/${cleanWa})`;
        }

        return res.json({ 
          text: fallbackText, 
          isFallback: true 
        });
      }
    } catch (error: any) {
      console.error("General API Error in Chat route:", error);
      res.status(500).json({
        error: "We're experiencing heavy traffic. Please try again soon.",
        details: error.message,
      });
    }
  });

  // API 2: Book a Consultation
  app.post("/api/consultations", async (req, res) => {
    try {
      const { name, email, organization, sector, service, message } = req.body;
      if (!name || !email || !service || !message) {
        return res.status(400).json({ error: "Please fill out all required fields (Name, Email, Service, and Message)." });
      }

      const newConsultation: Consultation = {
        id: "const-" + Math.random().toString(36).substr(2, 9),
        name,
        email,
        organization: organization || "Independent",
        sector: sector || "Not Specified",
        service,
        message,
        createdAt: new Date().toISOString(),
        status: "pending",
      };

      await addConsultation(newConsultation);

      // Trigger robust email notification via standard Node-based SMTP transport service
      sendSmtpInquiryNotification({
        subject: `[New Consultation Request] ${name} - ${service}`,
        title: "New Consultation Request Received",
        badgeText: "CONSULTATION BOOKING",
        clientName: name,
        clientEmail: email,
        isConsultation: true,
        fields: [
          { label: "Client Name", value: name },
          { label: "Email Address", value: email },
          { label: "Organization", value: organization || "Independent" },
          { label: "Industry Sector", value: sector || "Not Specified" },
          { label: "Service Pillar", value: service },
          { label: "Date Submitted", value: new Date().toLocaleString("en-US", { timeZone: "Africa/Lagos" }) + " (WAT)" }
        ],
        message: message
      }).catch(err => {
        console.warn("[Consultation Mail Error]:", err);
      });

      res.status(201).json({ 
        success: true, 
        consultation: newConsultation,
        message: "Consultation booked successfully. Notification dispatched via SMTP." 
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // API 3: Retrieve booked consultations
  app.get("/api/consultations", async (req, res) => {
    try {
      const consultations = await getConsultations();
      res.json(consultations);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // API 4: Contact Inquiry
  app.post("/api/contact", async (req, res) => {
    try {
      const { name, email, subject, message } = req.body;
      if (!name || !email || !subject || !message) {
        return res.status(400).json({ error: "All contact fields are required." });
      }

      const newInquiry: ContactInquiry = {
        id: "inq-" + Math.random().toString(36).substr(2, 9),
        name,
        email,
        subject,
        message,
        createdAt: new Date().toISOString(),
      };

      await addContactInquiry(newInquiry);

      // Trigger robust email notification via standard Node-based SMTP transport service
      sendSmtpInquiryNotification({
        subject: `[Portal Inquiry] ${subject} from ${name}`,
        title: "New Contact Portal Inquiry Received",
        badgeText: "PORTAL INQUIRY",
        clientName: name,
        clientEmail: email,
        isConsultation: false,
        fields: [
          { label: "Sender Name", value: name },
          { label: "Sender Email", value: email },
          { label: "Inquiry Subject", value: subject },
          { label: "Date Transmitted", value: new Date().toLocaleString("en-US", { timeZone: "Africa/Lagos" }) + " (WAT)" }
        ],
        message: message
      }).catch(err => {
        console.warn("[Contact Mail Error]:", err);
      });

      res.status(201).json({ 
        success: true, 
        inquiry: newInquiry,
        message: "Inquiry submitted successfully. Notification dispatched via SMTP."
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // API: Admin Verify SMTP Connection (Handshake & Credentials without sending mail)
  app.post("/api/admin/verify-smtp", async (req, res) => {
    try {
      const body = req.body || {};
      const { host, port, secure, user, pass } = body;
      const config = await getSiteConfig();
      
      const actualHost = (host && String(host).trim() !== "") ? String(host).trim() : (config.smtp_host || process.env.SMTP_HOST || "");
      const actualPort = Number(port || config.smtp_port || process.env.SMTP_PORT || 465);
      const actualSecure = secure !== undefined ? Boolean(secure) : (actualPort === 465 || config.smtp_secure === true);
      const actualUser = (user && String(user).trim() !== "") ? String(user).trim() : (config.smtp_user || process.env.SMTP_USER || "");
      const actualPass = (pass && String(pass).trim() !== "" && String(pass).trim() !== "••••••••")
        ? String(pass).trim()
        : (config.smtp_pass || process.env.SMTP_PASS || "");

      if (!actualHost || !actualUser || !actualPass) {
        return res.status(400).json({ 
          success: false, 
          error: "Please provide SMTP Host, Username/Email, and Password before verifying." 
        });
      }

      const smtpConfig: SmtpConfig = {
        host: actualHost,
        port: actualPort,
        secure: actualSecure,
        user: actualUser,
        pass: actualPass
      };

      const result = await verifySmtpConnection(smtpConfig);
      if (result.success) {
        res.json({ success: true, message: result.message });
      } else {
        res.status(400).json({ success: false, error: result.message, code: result.code });
      }
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message || String(error) });
    }
  });

  // API: Admin Test SMTP Email Connection & Dispatch Diagnostic Email
  app.post("/api/admin/test-smtp", async (req, res) => {
    try {
      const body = req.body || {};
      const { host, port, secure, user, pass, fromName, fromEmail, recipientEmail } = body;
      const config = await getSiteConfig();

      const actualHost = (host && String(host).trim() !== "") ? String(host).trim() : (config.smtp_host || process.env.SMTP_HOST || "");
      const actualPort = Number(port || config.smtp_port || process.env.SMTP_PORT || 465);
      const actualSecure = secure !== undefined ? Boolean(secure) : (actualPort === 465 || config.smtp_secure === true);
      const actualUser = (user && String(user).trim() !== "") ? String(user).trim() : (config.smtp_user || process.env.SMTP_USER || "");
      const actualPass = (pass && String(pass).trim() !== "" && String(pass).trim() !== "••••••••")
        ? String(pass).trim()
        : (config.smtp_pass || process.env.SMTP_PASS || "");

      if (!actualHost || !actualUser || !actualPass) {
        return res.status(400).json({ 
          success: false, 
          error: "Please provide SMTP Host, Username/Email, and Password before dispatching test email." 
        });
      }

      const targetRecipient = (recipientEmail || actualUser || config.notification_email || "info@metaspaceconsulting.com").trim();

      const smtpConfig: SmtpConfig = {
        host: actualHost,
        port: actualPort,
        secure: actualSecure,
        user: actualUser,
        pass: actualPass,
        fromName: (fromName || config.smtp_from_name || "Metaspace Consulting").trim(),
        fromEmail: (fromEmail || config.smtp_from_email || actualUser).trim(),
        notificationEmail: targetRecipient
      };

      // 1. First perform TLS socket & auth verification
      const verification = await verifySmtpConnection(smtpConfig);
      if (!verification.success) {
        return res.status(400).json({ 
          success: false, 
          error: `SMTP Authentication / Handshake failed: ${verification.message}` 
        });
      }

      // 2. Dispatch a full diagnostic test message
      const result = await sendSmtpInquiryNotification({
        subject: "Metaspace Consulting - SMTP Transport Diagnostic Verification",
        title: "SMTP Relay System Diagnostic Test",
        badgeText: "SYSTEM DIAGNOSTIC",
        clientName: "Metaspace System Administrator",
        clientEmail: targetRecipient,
        skipCourtesyConfirmation: true,
        overrideConfig: smtpConfig,
        fields: [
          { label: "Transport Engine", value: "Standard Node-based Mail Transport (Nodemailer Pool)" },
          { label: "SMTP Host", value: `${smtpConfig.host}:${smtpConfig.port}` },
          { label: "Encryption Mode", value: smtpConfig.secure ? "SSL/TLS (Port 465)" : "STARTTLS (Port 587/25)" },
          { label: "Authenticated User", value: smtpConfig.user },
          { label: "Sender Address", value: `"${smtpConfig.fromName}" <${smtpConfig.fromEmail}>` },
          { label: "Target Recipient", value: targetRecipient },
          { label: "Transmission Time", value: new Date().toISOString() + " (UTC)" }
        ],
        message: "This test email confirms that your standard Node-based SMTP mail transport service is operating correctly. Live email notifications for Consultation Bookings and Contact Inquiries will be delivered reliably to your target inbox with RFC headers, high-priority flags, and direct client Reply-To support."
      });

      if (result.success) {
        res.json({ 
          success: true, 
          message: `Standard SMTP transport verified! Diagnostic email delivered to ${targetRecipient}${result.messageId ? ` (ID: ${result.messageId})` : ""}.` 
        });
      } else {
        res.status(400).json({ success: false, error: result.error || "Failed to dispatch test email." });
      }
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message || String(error) });
    }
  });

  // API 5: Get Contact Inquiries
  app.get("/api/contact", async (req, res) => {
    try {
      const contactInquiries = await getContactInquiries();
      res.json(contactInquiries);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get Site Config
  app.get("/api/site-config", async (req, res) => {
    try {
      const config = await getSiteConfig();
      // Hide password for security
      const safeConfig: any = { 
        ...config,
        isFirestore: true,
        firestoreDatabaseId: "ai-studio-metaspaceconsult-9ba2a98e-157c-4575-bf8c-0d59e54caf50",
        hasSmtpConfigured: Boolean(config.smtp_host && config.smtp_user && config.smtp_pass)
      };
      delete safeConfig.adminPassword;
      if (safeConfig.smtp_pass) {
        safeConfig.hasSmtpPassword = true;
        safeConfig.smtp_pass = "••••••••";
      }
      if (safeConfig.adminUsernames) {
        safeConfig.adminUsernames = safeConfig.adminUsernames.map((a: any) => ({
          username: a.username,
          isSuperadmin: a.isSuperadmin
        }));
      }
      res.json(safeConfig);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Admin Login
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body || {};
      if (!password || typeof password !== "string" || password.trim() === "") {
        return res.status(400).json({ error: "Password is required to access the admin console." });
      }

      const cleanPassword = password.trim();
      const cleanUsername = (username || "superadmin").trim().toLowerCase();

      const config = await getSiteConfig();
      const actualPassword = (config.adminPassword || "admin").trim();
      
      const admins = config.adminUsernames || [
        { username: "superadmin", password: actualPassword, isSuperadmin: true },
        { username: "admin", password: actualPassword, isSuperadmin: true }
      ];

      const foundUser = admins.find((a: any) => 
        (a.username || "").toLowerCase() === cleanUsername && ((a.password || "").trim() === cleanPassword)
      );

      const isValidPassword = 
        cleanPassword === actualPassword || 
        foundUser !== undefined ||
        (actualPassword === "admin" && cleanPassword === "admin");

      if (isValidPassword) {
        return res.json({ 
          success: true, 
          token: "metaspace-authenticated-token-" + Date.now(),
          user: {
            username: foundUser?.username || username || "superadmin",
            isSuperadmin: foundUser?.isSuperadmin ?? true
          }
        });
      } else {
        return res.status(401).json({ error: "Invalid username or administrator password." });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Admin Change Password
  app.post("/api/admin/change-password", async (req, res) => {
    try {
      const { currentPassword, newPassword, username } = req.body || {};
      const config = await getSiteConfig();
      const actualPassword = (config.adminPassword || "admin").trim();

      const admins = config.adminUsernames || [
        { username: "superadmin", password: actualPassword, isSuperadmin: true },
        { username: "admin", password: actualPassword, isSuperadmin: true }
      ];

      const isCurrentValid = 
        currentPassword === actualPassword || 
        (actualPassword === "admin" && currentPassword === "admin") ||
        admins.some((a: any) => (a.username || "").toLowerCase() === (username || "").toLowerCase() && a.password === currentPassword);

      if (!isCurrentValid) {
        return res.status(401).json({ error: "Current administrator password is incorrect." });
      }

      if (!newPassword || typeof newPassword !== "string" || newPassword.trim().length < 3) {
        return res.status(400).json({ error: "New password must be at least 3 characters long." });
      }

      const cleanNewPassword = newPassword.trim();
      const updatedAdmins = admins.map((a: any) => {
        if (!username || a.username.toLowerCase() === (username || "").toLowerCase() || a.isSuperadmin) {
          return { ...a, password: cleanNewPassword };
        }
        return a;
      });

      await updateSiteConfig({
        adminPassword: cleanNewPassword,
        adminUsernames: updatedAdmins
      });

      res.json({ success: true, message: "Administrator password updated successfully." });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Admin Users List
  app.get("/api/admin/users", async (req, res) => {
    try {
      const config = await getSiteConfig();
      const actualPassword = (config.adminPassword || "admin").trim();
      const authHeader = (req.headers["x-admin-password"] as string) || "";

      const admins = config.adminUsernames || [
        { username: "superadmin", password: actualPassword, isSuperadmin: true },
        { username: "admin", password: actualPassword, isSuperadmin: true }
      ];

      const isAuthorized = 
        authHeader === actualPassword || 
        (actualPassword === "admin" && authHeader === "admin") ||
        admins.some((a: any) => a.password === authHeader);

      if (!isAuthorized) {
        return res.status(401).json({ error: "Unauthorized access." });
      }

      const safeAdmins = admins.map((a: any) => ({
        username: a.username,
        isSuperadmin: Boolean(a.isSuperadmin)
      }));

      res.json(safeAdmins);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Add or Update Admin User
  app.post("/api/admin/users", async (req, res) => {
    try {
      const { password, currentPassword, username: newUsername, newPassword, isSuperadmin } = req.body || {};
      const authPassword = currentPassword || password || (req.headers["x-admin-password"] as string) || "";
      const config = await getSiteConfig();
      const actualPassword = (config.adminPassword || "admin").trim();

      const admins = config.adminUsernames || [
        { username: "superadmin", password: actualPassword, isSuperadmin: true },
        { username: "admin", password: actualPassword, isSuperadmin: true }
      ];

      const isAuthorized = 
        authPassword === actualPassword || 
        (actualPassword === "admin" && authPassword === "admin") ||
        admins.some((a: any) => a.password === authPassword);

      if (!isAuthorized) {
        return res.status(401).json({ error: "Unauthorized access." });
      }

      if (!newUsername || typeof newUsername !== "string" || newUsername.trim().length < 2) {
        return res.status(400).json({ error: "Username must be at least 2 characters long." });
      }

      const cleanUsername = newUsername.trim();
      const userIndex = admins.findIndex((a: any) => a.username.toLowerCase() === cleanUsername.toLowerCase());

      const userPwd = newPassword && typeof newPassword === "string" && newPassword.trim().length >= 3 
        ? newPassword.trim() 
        : actualPassword;

      if (userIndex >= 0) {
        admins[userIndex] = {
          ...admins[userIndex],
          username: cleanUsername,
          password: userPwd,
          isSuperadmin: isSuperadmin !== undefined ? Boolean(isSuperadmin) : admins[userIndex].isSuperadmin
        };
      } else {
        admins.push({
          username: cleanUsername,
          password: userPwd,
          isSuperadmin: Boolean(isSuperadmin)
        });
      }

      const updatesToApply: any = { adminUsernames: admins };
      if (cleanUsername.toLowerCase() === "superadmin" && newPassword) {
        updatesToApply.adminPassword = userPwd;
      }

      await updateSiteConfig(updatesToApply);

      const safeAdmins = admins.map((a: any) => ({
        username: a.username,
        isSuperadmin: Boolean(a.isSuperadmin)
      }));

      res.json({ success: true, users: safeAdmins, message: `Admin account for ${cleanUsername} saved successfully.` });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Revoke Admin User Access
  app.delete("/api/admin/users/:targetUsername", async (req, res) => {
    try {
      const { targetUsername } = req.params;
      const { password, currentPassword } = req.body || {};
      const authPassword = currentPassword || password || (req.headers["x-admin-password"] as string) || "";
      const config = await getSiteConfig();
      const actualPassword = (config.adminPassword || "admin").trim();

      const admins = config.adminUsernames || [
        { username: "superadmin", password: actualPassword, isSuperadmin: true },
        { username: "admin", password: actualPassword, isSuperadmin: true }
      ];

      const isAuthorized = 
        authPassword === actualPassword || 
        (actualPassword === "admin" && authPassword === "admin") ||
        admins.some((a: any) => a.password === authPassword);

      if (!isAuthorized) {
        return res.status(401).json({ error: "Unauthorized access." });
      }

      if (targetUsername.toLowerCase() === "superadmin" && admins.filter((a: any) => a.isSuperadmin).length <= 1) {
        return res.status(400).json({ error: "Cannot revoke the main superadmin account." });
      }

      const updatedAdmins = admins.filter((a: any) => a.username.toLowerCase() !== targetUsername.toLowerCase());

      if (updatedAdmins.length === 0) {
        return res.status(400).json({ error: "Cannot delete all admin accounts." });
      }

      await updateSiteConfig({ adminUsernames: updatedAdmins });

      const safeAdmins = updatedAdmins.map((a: any) => ({
        username: a.username,
        isSuperadmin: Boolean(a.isSuperadmin)
      }));

      res.json({ success: true, users: safeAdmins, message: `Revoked access for ${targetUsername}.` });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Update Site Config (with admin verification)
  app.post("/api/admin/site-config", async (req, res) => {
    try {
      const { password, updates } = req.body || {};
      const authHeader = (req.headers["x-admin-password"] as string) || "";
      const effectivePassword = password || authHeader;
      const config = await getSiteConfig();
      const actualPassword = (config.adminPassword || "admin").trim();

      const admins = config.adminUsernames || [];
      const isAuthorized = 
        effectivePassword === actualPassword || 
        (actualPassword === "admin" && effectivePassword === "admin") ||
        admins.some((a: any) => a.password === effectivePassword);

      if (!isAuthorized) {
        return res.status(401).json({ error: "Unauthorized access." });
      }

      if (!updates || typeof updates !== "object") {
        return res.status(400).json({ error: "Invalid updates format." });
      }

      // If updating adminPassword via site-config, also sync adminUsernames
      if (updates.adminPassword && typeof updates.adminPassword === "string" && updates.adminPassword.trim().length >= 3) {
        const cleanPwd = updates.adminPassword.trim();
        updates.adminPassword = cleanPwd;
        const currentAdmins = config.adminUsernames || [
          { username: "superadmin", password: cleanPwd, isSuperadmin: true },
          { username: "admin", password: cleanPwd, isSuperadmin: true }
        ];
        updates.adminUsernames = currentAdmins.map((a: any) => ({ ...a, password: cleanPwd }));
      }

      const updatedConfig = await updateSiteConfig(updates);
      const safeConfig: any = { ...updatedConfig };
      delete safeConfig.adminPassword;
      if (safeConfig.adminUsernames) {
        safeConfig.adminUsernames = safeConfig.adminUsernames.map((a: any) => ({
          username: a.username,
          isSuperadmin: a.isSuperadmin
        }));
      }
      res.json({ success: true, siteConfig: safeConfig });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // NEW: Update Consultation Status (admin)
  app.patch("/api/admin/consultations/:id", async (req, res) => {
    try {
      const { password, status } = req.body;
      const { id } = req.params;
      const config = await getSiteConfig();
      const actualPassword = config.adminPassword || "admin";

      if (password !== actualPassword) {
        return res.status(401).json({ error: "Unauthorized access." });
      }

      const success = await updateConsultationStatus(id, status);
      if (success) {
        res.json({ success: true });
      } else {
        res.status(404).json({ error: "Consultation not found." });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // NEW: Delete Consultation (admin)
  app.delete("/api/admin/consultations/:id", async (req, res) => {
    try {
      const { password } = req.body;
      const { id } = req.params;
      const config = await getSiteConfig();
      const actualPassword = config.adminPassword || "admin";

      if (password !== actualPassword) {
        return res.status(401).json({ error: "Unauthorized access." });
      }

      const success = await deleteConsultation(id);
      if (success) {
        res.json({ success: true });
      } else {
        res.status(404).json({ error: "Consultation not found." });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // NEW: Delete Inquiry (admin)
  app.delete("/api/admin/contact/:id", async (req, res) => {
    try {
      const { password } = req.body;
      const { id } = req.params;
      const config = await getSiteConfig();
      const actualPassword = config.adminPassword || "admin";

      if (password !== actualPassword) {
        return res.status(401).json({ error: "Unauthorized access." });
      }

      const success = await deleteContactInquiry(id);
      if (success) {
        res.json({ success: true });
      } else {
        res.status(404).json({ error: "Inquiry not found." });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Handle unmatched API endpoints with JSON 404
  app.use("/api/*", (req, res) => {
    res.status(404).json({ error: `API route not found: ${req.method} ${req.originalUrl}` });
  });

  // Serve static assets / Vite middleware
  app.use("/data", express.static(path.join(process.cwd(), "data")));
  app.use("/assets", express.static(path.join(process.cwd(), "assets")));

  async function startServer() {
    const isVercelEnvironment = !!process.env.VERCEL || !!process.env.VERCEL_ENV || !!process.env.NOW_BUILDER || process.env.VERCEL_URL !== undefined;
    if (!isVercelEnvironment) {
      if (process.env.NODE_ENV !== "production") {
        const { createServer: createViteServer } = await import("vite");
        const vite = await createViteServer({
          server: { middlewareMode: true },
          appType: "spa",
        });
        app.use(vite.middlewares);
      } else {
        const distPath = path.join(process.cwd(), "dist");
        app.use(express.static(distPath));
        app.get("*", (req, res) => {
          res.sendFile(path.join(distPath, "index.html"));
        });
      }

      app.listen(PORT, "0.0.0.0", () => {
        console.log(`Server running on http://0.0.0.0:${PORT}`);
      });
    }
  }

startServer();

export default app;
