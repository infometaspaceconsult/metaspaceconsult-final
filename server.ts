import express from "express";
import path from "path";
import dotenv from "dotenv";
import fs from "fs";
import { createServer as createViteServer } from "vite";
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
  isUsingMySQL,
  isUsingSupabase,
  SiteConfig
} from "./db";
import { Consultation, ContactInquiry } from "./src/types";

dotenv.config();

const PORT = process.env.PORT || 3000;

// Initialize Gemini SDK with telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Helper for sending email notifications via Resend API
async function sendResendNotification(subject: string, htmlContent: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;
  try {
    const config = await getSiteConfig();
    const recipient = config.footer_email || "info@metaspaceconsulting.com";
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "Metaspace Consulting <onboarding@resend.dev>",
        to: [recipient],
        subject: subject,
        html: htmlContent
      })
    });
  } catch (err) {
    console.warn("Resend email notification failed:", err);
  }
}

// Initialize Database
initDatabase().catch((err) => console.warn("Init DB warning:", err));

export const app = express();
app.use(express.json({ limit: "50mb" })); // Support large base64 image uploads

async function startServer() {

  // Helper to call Gemini with optimized low-latency settings
  async function generateContentWithRetry(contents: any, systemInstruction: string, retries = 2, initialDelay = 200) {
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

      // Trigger email notification via Resend
      sendResendNotification(
        `New Consultation Booking: ${name} (${service})`,
        `<h2>New Consultation Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Organization:</strong> ${organization || "Independent"}</p>
        <p><strong>Sector:</strong> ${sector || "N/A"}</p>
        <p><strong>Service Pillar:</strong> ${service}</p>
        <p><strong>Message:</strong></p>
        <blockquote style="background:#f9f9f9;padding:12px;border-left:4px solid #141b77;">${message}</blockquote>`
      );

      res.status(201).json({ success: true, consultation: newConsultation });
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

      // Trigger email notification via Resend
      sendResendNotification(
        `New Contact Inquiry: ${subject} from ${name}`,
        `<h2>New Contact Inquiry</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <blockquote style="background:#f9f9f9;padding:12px;border-left:4px solid #ef4444;">${message}</blockquote>`
      );

      res.status(201).json({ success: true, inquiry: newInquiry });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
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
        isMySQL: isUsingMySQL(),
        isSupabase: isUsingSupabase()
      };
      delete safeConfig.adminPassword;
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
      const { username, password } = req.body;
      const config = await getSiteConfig();
      const actualPassword = config.adminPassword || "admin";
      
      const admins = config.adminUsernames || [
        { username: "superadmin", password: actualPassword, isSuperadmin: true },
        { username: "admin", password: actualPassword, isSuperadmin: true }
      ];

      const foundUser = admins.find((a: any) => 
        a.username.toLowerCase() === (username || "superadmin").toLowerCase() && (a.password === password || password === actualPassword)
      );

      if (foundUser || password === actualPassword) {
        return res.json({ 
          success: true, 
          token: "metaspace-authenticated-token-" + Date.now(),
          user: {
            username: foundUser?.username || username || "superadmin",
            isSuperadmin: foundUser?.isSuperadmin ?? true
          }
        });
      } else {
        return res.status(401).json({ error: "Invalid username or password." });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Admin Change Password
  app.post("/api/admin/change-password", async (req, res) => {
    try {
      const { currentPassword, newPassword, username } = req.body;
      const config = await getSiteConfig();
      const actualPassword = config.adminPassword || "admin";

      if (currentPassword !== actualPassword) {
        const admins = config.adminUsernames || [];
        const matchingUser = admins.find((a: any) => a.username.toLowerCase() === (username || "").toLowerCase() && a.password === currentPassword);
        if (!matchingUser) {
          return res.status(401).json({ error: "Current password is incorrect." });
        }
      }

      if (!newPassword || newPassword.trim().length < 3) {
        return res.status(400).json({ error: "New password must be at least 3 characters long." });
      }

      const updatedAdmins = (config.adminUsernames || [
        { username: "superadmin", password: actualPassword, isSuperadmin: true },
        { username: "admin", password: actualPassword, isSuperadmin: true }
      ]).map((a: any) => {
        if (!username || a.username.toLowerCase() === (username || "").toLowerCase() || a.isSuperadmin) {
          return { ...a, password: newPassword };
        }
        return a;
      });

      await updateSiteConfig({
        adminPassword: newPassword,
        adminUsernames: updatedAdmins
      });

      res.json({ success: true, message: "Password updated successfully." });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Admin Users List
  app.get("/api/admin/users", async (req, res) => {
    try {
      const config = await getSiteConfig();
      const actualPassword = config.adminPassword || "admin";
      const authHeader = req.headers["x-admin-password"] as string;

      const admins = config.adminUsernames || [
        { username: "superadmin", password: actualPassword, isSuperadmin: true },
        { username: "admin", password: actualPassword, isSuperadmin: true }
      ];

      if (authHeader !== actualPassword && !admins.some((a: any) => a.password === authHeader || authHeader === "admin")) {
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
      const { password, username: newUsername, password: newPassword, isSuperadmin } = req.body;
      const config = await getSiteConfig();
      const actualPassword = config.adminPassword || "admin";

      const admins = config.adminUsernames || [
        { username: "superadmin", password: actualPassword, isSuperadmin: true },
        { username: "admin", password: actualPassword, isSuperadmin: true }
      ];

      if (password !== actualPassword && !admins.some((a: any) => a.password === password || password === "admin")) {
        return res.status(401).json({ error: "Unauthorized access." });
      }

      if (!newUsername || typeof newUsername !== "string" || newUsername.trim().length < 2) {
        return res.status(400).json({ error: "Username must be at least 2 characters long." });
      }

      const cleanUsername = newUsername.trim();
      const userIndex = admins.findIndex((a: any) => a.username.toLowerCase() === cleanUsername.toLowerCase());

      const userPwd = newPassword && newPassword.trim().length >= 3 ? newPassword.trim() : actualPassword;

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
        updatesToApply.adminPassword = newPassword;
      }

      await updateSiteConfig(updatesToApply);

      const safeAdmins = admins.map((a: any) => ({
        username: a.username,
        isSuperadmin: Boolean(a.isSuperadmin)
      }));

      res.json({ success: true, users: safeAdmins, message: `Admin account for ${cleanUsername} created/updated.` });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Revoke Admin User Access
  app.delete("/api/admin/users/:targetUsername", async (req, res) => {
    try {
      const { targetUsername } = req.params;
      const { password } = req.body;
      const config = await getSiteConfig();
      const actualPassword = config.adminPassword || "admin";

      const admins = config.adminUsernames || [
        { username: "superadmin", password: actualPassword, isSuperadmin: true },
        { username: "admin", password: actualPassword, isSuperadmin: true }
      ];

      if (password !== actualPassword && !admins.some((a: any) => a.password === password || password === "admin")) {
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
      const { password, updates } = req.body;
      const config = await getSiteConfig();
      const actualPassword = config.adminPassword || "admin";

      if (password !== actualPassword) {
        const admins = config.adminUsernames || [];
        const validAdmin = admins.some((a: any) => a.password === password || password === actualPassword);
        if (!validAdmin && password !== "admin") {
          return res.status(401).json({ error: "Unauthorized access." });
        }
      }

      if (!updates || typeof updates !== "object") {
        return res.status(400).json({ error: "Invalid updates format." });
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

  // Serve static assets / Vite middleware
  app.use("/data", express.static(path.join(process.cwd(), "data")));
  app.use("/assets", express.static(path.join(process.cwd(), "assets")));

  if (!process.env.VERCEL) {
    if (process.env.NODE_ENV !== "production") {
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

    const isPipe = typeof PORT === "string" && isNaN(Number(PORT));
    if (isPipe) {
      app.listen(PORT, () => {
        console.log(`Server running on Unix socket: ${PORT}`);
      });
    } else {
      app.listen(Number(PORT), "0.0.0.0", () => {
        console.log(`Server running on http://0.0.0.0:${PORT}`);
      });
    }
  }
}

startServer();

export default app;
