import express from "express";
import path from "path";
import dotenv from "dotenv";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
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

async function startServer() {
  // Initialize Database (MySQL pool or Local file fallback)
  await initDatabase();

  const app = express();
  app.use(express.json({ limit: "50mb" })); // Support large base64 image uploads

  // Helper to call Gemini with exponential backoff retries
  async function generateContentWithRetry(contents: any, systemInstruction: string, retries = 3, initialDelay = 500) {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: contents,
          config: {
            systemInstruction: systemInstruction,
            temperature: 0.7,
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

      const contents = history ? [...history, { role: "user", parts: [{ text: message }] }] : message;

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

  // NEW: Get Site Config
  app.get("/api/site-config", async (req, res) => {
    try {
      const config = await getSiteConfig();
      // Hide password for security
      const safeConfig = { 
        ...config,
        isMySQL: isUsingMySQL()
      };
      delete safeConfig.adminPassword;
      res.json(safeConfig);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // NEW: Admin Login
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { password } = req.body;
      const config = await getSiteConfig();
      const actualPassword = config.adminPassword || "admin";
      
      if (password === actualPassword) {
        return res.json({ success: true, token: "metaspace-authenticated-token" });
      } else {
        return res.status(401).json({ error: "Invalid administrator password." });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // NEW: Update Site Config (with admin verification)
  app.post("/api/admin/site-config", async (req, res) => {
    try {
      const { password, updates } = req.body;
      const config = await getSiteConfig();
      const actualPassword = config.adminPassword || "admin";

      if (password !== actualPassword) {
        return res.status(401).json({ error: "Unauthorized access." });
      }

      if (!updates || typeof updates !== "object") {
        return res.status(400).json({ error: "Invalid updates format." });
      }

      const updatedConfig = await updateSiteConfig(updates);
      const safeConfig = { ...updatedConfig };
      delete safeConfig.adminPassword;
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

  // support Unix socket pipes (cPanel Passenger) or numeric ports
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

startServer();
