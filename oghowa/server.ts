import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import {
  TARGET_DATABASE_ID,
  OGHOWA_COLLECTIONS,
  MANDATORY_METADATA,
  AUTHORIZED_ADMIN_PASSCODES,
  getLiveSiteConfig,
  saveLiveSiteConfig,
  getAllRegistrations,
  saveRegistrationRecord,
  updateRegistrationStatus,
  deleteRegistrationWithPasscode,
  getAllDealRoomDossiers,
  saveDealRoomDossier,
  exportOghowaIsolatedDataset,
} from "./src/server/firestoreService";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// In-memory fallback cache for ultra-fast response
let cachedConfig: any = null;

// Initialize config on startup
getLiveSiteConfig().then((cfg) => {
  cachedConfig = cfg;
  console.log(`[Database Architect] Namespaced storage verified for ${TARGET_DATABASE_ID}`);
});

// ==========================================
// API ROUTES: NAMESPACED DATA ISOLATION
// ==========================================

// Health check & Ecosystem Namespace Status
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "oghowa-accelerator-cloud-api",
    parent_organization: MANDATORY_METADATA.parent_organization,
    initiative: MANDATORY_METADATA.initiative,
    database_id: TARGET_DATABASE_ID,
    isolated_namespaces: Object.values(OGHOWA_COLLECTIONS),
  });
});

// GET Database Isolation Status
app.get("/api/oghowa-database/status", async (_req, res) => {
  try {
    const [regs, dossiers, cfg] = await Promise.all([
      getAllRegistrations(),
      getAllDealRoomDossiers(),
      getLiveSiteConfig(),
    ]);

    res.json({
      success: true,
      database_id: TARGET_DATABASE_ID,
      parent_organization: MANDATORY_METADATA.parent_organization,
      initiative: MANDATORY_METADATA.initiative,
      app_support: MANDATORY_METADATA.app_support,
      isolation_guarantee: "Strictly isolated namespace (oghowa_*). No Metaspace Consult general tables modified or queried.",
      collections: {
        site_config: {
          collection: OGHOWA_COLLECTIONS.SITE_CONFIG,
          target_doc: "live_portal",
          status: cfg ? "Active & Merged" : "Default Fallback",
        },
        events: {
          collection: OGHOWA_COLLECTIONS.EVENTS,
          total_events: cfg?.events?.length || 0,
        },
        registrations: {
          collection: OGHOWA_COLLECTIONS.REGISTRATIONS,
          total_records: regs.length,
        },
        dealroom_dossiers: {
          collection: OGHOWA_COLLECTIONS.DEALROOM_DOSSIERS,
          total_records: dossiers.length,
        },
      },
      write_policy: "Non-destructive atomic merge (set with merge: true) + passcode-protected deletion.",
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET: Cloud Site Configuration (Collection: 'oghowa_site_config', Doc: 'live_portal')
app.get("/api/site-config", async (_req, res) => {
  try {
    const config = await getLiveSiteConfig();
    cachedConfig = config;
    if (config) {
      res.json({ success: true, config, source: "oghowa_site_config/live_portal" });
    } else {
      res.json({ success: true, config: null, source: "defaults" });
    }
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST: Save Site Configuration to Cloud (Atomic Non-Destructive Merge)
app.post("/api/site-config", async (req, res) => {
  const newConfig = req.body;
  if (!newConfig || typeof newConfig !== "object") {
    return res.status(400).json({ success: false, message: "Invalid configuration payload" });
  }

  try {
    const result = await saveLiveSiteConfig(newConfig);
    cachedConfig = result.data;
    console.log(`[Database Architect] Atomic set(merge: true) applied non-destructively to oghowa_site_config/live_portal.`);
    return res.json({
      success: true,
      config: result.data,
      message: "Non-destructive atomic merge completed. Namespaced in oghowa_site_config/live_portal.",
    });
  } catch (err: any) {
    console.error("[Database Architect] Error saving site config:", err);
    return res.status(500).json({ success: false, message: err.message || "Failed to persist configuration" });
  }
});

// POST: Safe Reset Cloud Site Configuration
app.post("/api/site-config/reset", async (_req, res) => {
  try {
    // Reset by saving default baseline with metadata tags
    const { defaultSiteConfig } = await import("./src/data/siteConfig");
    const result = await saveLiveSiteConfig(defaultSiteConfig);
    cachedConfig = result.data;
    return res.json({
      success: true,
      message: "Cloud configuration safely reset to summit defaults in oghowa_site_config/live_portal.",
    });
  } catch (err: any) {
    console.error("Failed to reset configuration:", err);
    return res.status(500).json({ success: false, message: "Failed to reset cloud configuration" });
  }
});

// GET: All Registered Delegates & Accreditations (Collection: 'oghowa_registrations')
app.get("/api/registrations", async (_req, res) => {
  try {
    const registrations = await getAllRegistrations();
    res.json({ success: true, registrations, namespace: OGHOWA_COLLECTIONS.REGISTRATIONS });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST: Submit New Event Registration (Collection: 'oghowa_registrations')
app.post("/api/registrations", async (req, res) => {
  const payload = req.body;
  if (!payload || !payload.fullName || !payload.email || !payload.eventTitle) {
    return res.status(400).json({ success: false, message: "Missing required registration fields" });
  }

  try {
    const newRegistration = await saveRegistrationRecord(payload);
    console.log(`[Registration] New delegate stored in ${OGHOWA_COLLECTIONS.REGISTRATIONS}: ${newRegistration.fullName} (${newRegistration.accreditationCode})`);
    return res.status(201).json({
      success: true,
      registration: newRegistration,
      message: "Registration submitted and securely saved in oghowa_registrations namespace.",
    });
  } catch (err: any) {
    console.error("[Registration] Error saving registration:", err);
    return res.status(500).json({ success: false, message: "Database write error" });
  }
});

// PATCH: Update Accreditation Status (Collection: 'oghowa_registrations')
app.patch("/api/registrations/:id", async (req, res) => {
  const { id } = req.params;
  const { status, declineReason, passCode } = req.body;

  if (!status) {
    return res.status(400).json({ success: false, message: "Missing accreditation status" });
  }

  const clean = status.toString().trim().toLowerCase();
  if (!["approved", "declined", "pending"].includes(clean)) {
    return res.status(400).json({ success: false, message: "Invalid accreditation status. Must be Approved, Declined, or Pending." });
  }

  try {
    const updated = await updateRegistrationStatus(id, status, {
      declineReason,
      passCode,
      reviewer: "usiobaifovictory245@gmail.com",
    });
    return res.json({
      success: true,
      registration: updated,
      message: `Accreditation status updated to ${updated.accreditationStatus} in ${OGHOWA_COLLECTIONS.REGISTRATIONS}`,
    });
  } catch (err: any) {
    return res.status(err.status || 500).json({ success: false, message: err.message });
  }
});

// POST: Bulk Update Accreditation Status
app.post("/api/registrations/bulk-status", async (req, res) => {
  const { ids, status, declineReason } = req.body;
  if (!Array.isArray(ids) || ids.length === 0 || !status) {
    return res.status(400).json({ success: false, message: "Valid delegate IDs and status are required." });
  }

  const clean = status.toString().trim().toLowerCase();
  if (!["approved", "declined", "pending"].includes(clean)) {
    return res.status(400).json({ success: false, message: "Invalid accreditation status" });
  }

  try {
    const results = [];
    for (const id of ids) {
      try {
        const updated = await updateRegistrationStatus(id, status, {
          declineReason,
          reviewer: "usiobaifovictory245@gmail.com",
        });
        results.push(updated);
      } catch (e) {
        // continue
      }
    }
    return res.json({
      success: true,
      count: results.length,
      registrations: results,
      message: `Successfully updated ${results.length} delegate accreditation passes to ${status}.`,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE: Delete a Registration Record (STRICT PASSCODE ENFORCEMENT)
app.delete("/api/registrations/:id", async (req, res) => {
  const { id } = req.params;
  const passcode =
    (req.headers["x-admin-passcode"] as string) ||
    (req.body && req.body.passcode) ||
    (req.query.passcode as string);

  try {
    await deleteRegistrationWithPasscode(id, passcode);
    console.log(`[Security Guard] Verified deletion of registration ${id} via administrative passcode.`);
    return res.json({
      success: true,
      message: "Registration record deleted successfully under verified administrative authorization.",
    });
  } catch (err: any) {
    if (err.code === "PASSCODE_REQUIRED" || err.status === 403) {
      return res.status(403).json({
        success: false,
        code: "PASSCODE_REQUIRED",
        message: "Protected Namespace Action: Document deletion prohibited without explicit administrative passcode confirmation.",
      });
    }
    return res.status(err.status || 500).json({ success: false, message: err.message });
  }
});

// GET: All Deal Room Dossiers (Collection: 'oghowa_dealroom_dossiers')
app.get("/api/dealroom-dossiers", async (_req, res) => {
  try {
    const dossiers = await getAllDealRoomDossiers();
    res.json({ success: true, dossiers, namespace: OGHOWA_COLLECTIONS.DEALROOM_DOSSIERS });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST: Submit New Deal Room Dossier (Collection: 'oghowa_dealroom_dossiers')
app.post("/api/dealroom-dossiers", async (req, res) => {
  try {
    const dossier = await saveDealRoomDossier(req.body);
    res.status(201).json({ success: true, dossier });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET: Safe Export of Oghowa Dataset (ONLY oghowa_* collections)
app.get("/api/oghowa-dataset/export", async (req, res) => {
  const format = (req.query.format as string) === "csv" ? "csv" : "json";
  try {
    const exportData = await exportOghowaIsolatedDataset(format);
    if (format === "csv" && exportData.csvContent) {
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", 'attachment; filename="oghowa_dataset_metaspace_export.csv"');
      return res.send(exportData.csvContent);
    }
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Disposition", 'attachment; filename="oghowa_dataset_metaspace_export.json"');
    return res.json(exportData);
  } catch (err: any) {
    console.error("[Database Architect] Error exporting Oghowa dataset:", err);
    return res.status(500).json({ success: false, message: "Export failed", error: err.message });
  }
});

// POST: Unified Authentication & Login (Superadmin, Admin, Secretariat, and Portal Users)
app.post(["/api/admin/login", "/api/auth/login"], (req, res) => {
  const rawIdentifier = (req.body?.username || req.body?.email || req.body?.identifier || "").trim().toLowerCase();
  const rawPassword = (req.body?.password || "").trim();

  if (!rawIdentifier || !rawPassword) {
    return res.status(400).json({
      success: false,
      message: "Please enter your username/email and password.",
    });
  }

  // 1. Superadmin Account (Full Root Access to Entire Ecosystem)
  if (
    (rawIdentifier === "superadmin" ||
      rawIdentifier === "superadmin@oghowa.africa" ||
      rawIdentifier === "executive@oghowa.africa") &&
    (rawPassword === "SuperAdmin@2026" ||
      rawPassword === "OghowaSuper2026#" ||
      rawPassword === "superadmin2026")
  ) {
    return res.json({
      success: true,
      user: {
        username: "superadmin",
        role: "superadmin",
        displayName: "Executive Superadministrator",
        email: "superadmin@oghowa.africa",
        tier: "superadmin",
        permissions: ["root", "all", "site_config", "dataset_export", "events_manage", "accreditations_all"],
      },
      token: `oghowa_super_${Date.now()}`,
      message: "Executive Superadministrator session authorized.",
    });
  }

  // 2. Admin Account (CMS, Convenings, Categories, Accreditation Roster)
  if (
    (rawIdentifier === "admin" ||
      rawIdentifier === "oghowa" ||
      rawIdentifier === "admin@oghowa.africa" ||
      rawIdentifier === "usiobaifovictory245@gmail.com") &&
    (rawPassword === "Admin@2026" ||
      rawPassword === "oghowa2026" ||
      rawPassword === "admin123" ||
      rawPassword === "summit2026")
  ) {
    return res.json({
      success: true,
      user: {
        username: "admin",
        role: "admin",
        displayName: "Portal Administrator",
        email: "admin@oghowa.africa",
        tier: "admin",
        permissions: ["events_manage", "categories_manage", "accreditations_manage", "cms_manage"],
      },
      token: `oghowa_adm_${Date.now()}`,
      message: "Administrator session authorized.",
    });
  }

  // 3. Secretariat Account (Accreditations, Roster, Verification, Check-in)
  if (
    (rawIdentifier === "secretariat" ||
      rawIdentifier === "secretariat@oghowa.africa" ||
      rawIdentifier === "secretariat@metaspaceconsult.com") &&
    (rawPassword === "Secretariat@2026" ||
      rawPassword === "summit2026" ||
      rawPassword === "oghowa2026")
  ) {
    return res.json({
      success: true,
      user: {
        username: "secretariat",
        role: "secretariat",
        displayName: "Secretariat & Accreditation Desk",
        email: "secretariat@oghowa.africa",
        tier: "secretariat",
        permissions: ["accreditations_verify", "check_in", "convenings_view"],
      },
      token: `oghowa_sec_${Date.now()}`,
      message: "Secretariat credentials authenticated successfully.",
    });
  }

  // 4. Founder / Ecosystem Member Demo Account
  if (
    (rawIdentifier === "founder" ||
      rawIdentifier === "founder@venture.africa" ||
      rawIdentifier === "founder@oghowa.africa") &&
    (rawPassword === "venture2026" || rawPassword === "oghowa2026" || rawPassword === "founder123")
  ) {
    return res.json({
      success: true,
      user: {
        username: "founder",
        role: "founder",
        displayName: "Ecosystem Venture Founder",
        email: "founder@venture.africa",
      },
      token: `oghowa_fnd_${Date.now()}`,
      message: "Founder session authorized.",
    });
  }

  // 5. Investor / Deal-Room Account
  if (
    (rawIdentifier === "investor" ||
      rawIdentifier === "investor@capital.africa" ||
      rawIdentifier === "investor@oghowa.africa") &&
    (rawPassword === "capital2026" || rawPassword === "oghowa2026" || rawPassword === "investor123")
  ) {
    return res.json({
      success: true,
      user: {
        username: "investor",
        role: "investor",
        displayName: "Institutional Investor",
        email: "investor@capital.africa",
      },
      token: `oghowa_inv_${Date.now()}`,
      message: "Deal-Room session authorized.",
    });
  }

  return res.status(401).json({
    success: false,
    message: "Invalid credentials. Please verify your username and password.",
  });
});

// ==========================================
// VITE MIDDLEWARE / STATIC ASSETS
// ==========================================

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Oghowa Server] Running on port ${PORT} (host: 0.0.0.0)`);
  });
}

startServer();
