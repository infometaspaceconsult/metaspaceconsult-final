import fs from 'fs';
import path from 'path';
import { Firestore } from '@google-cloud/firestore';

/**
 * METASPACE CONSULT & OGHOWA ACCELERATOR DATABASE ARCHITECTURE
 * Target Database ID: ai-studio-metaspaceconsult-9ba2a98e-157c-4575-bf8c-0d59e54caf50
 *
 * Senior Cloud Security & Database Isolation Guard:
 * Strictly prevents overwriting, polluting, or querying general Metaspace Consult collections.
 * All Oghowa operations are isolated into explicit 'oghowa_*' prefixed collections.
 */

export const TARGET_DATABASE_ID = 'ai-studio-metaspaceconsult-9ba2a98e-157c-4575-bf8c-0d59e54caf50';

export const OGHOWA_COLLECTIONS = {
  SITE_CONFIG: 'oghowa_site_config',
  EVENTS: 'oghowa_events',
  REGISTRATIONS: 'oghowa_registrations',
  DEALROOM_DOSSIERS: 'oghowa_dealroom_dossiers',
} as const;

export const LIVE_PORTAL_DOC_ID = 'live_portal';

export const MANDATORY_METADATA = {
  parent_organization: 'Metaspace Consult',
  initiative: 'Oghowa Accelerator & Business Week',
  app_support: 'usiobaifovictory245@gmail.com',
} as const;

export const AUTHORIZED_ADMIN_PASSCODES = [
  'oghowa2026',
  'summit2026',
  'admin123',
  'demo123',
];

// Local Namespaced Data Directory for resilient fallback & zero-loss mirroring
const BASE_DATA_DIR = path.join(process.cwd(), 'data');
const NAMESPACES_DIR = path.join(BASE_DATA_DIR, 'namespaces');

const NAMESPACED_PATHS = {
  [OGHOWA_COLLECTIONS.SITE_CONFIG]: path.join(NAMESPACES_DIR, OGHOWA_COLLECTIONS.SITE_CONFIG),
  [OGHOWA_COLLECTIONS.EVENTS]: path.join(NAMESPACES_DIR, OGHOWA_COLLECTIONS.EVENTS),
  [OGHOWA_COLLECTIONS.REGISTRATIONS]: path.join(NAMESPACES_DIR, OGHOWA_COLLECTIONS.REGISTRATIONS),
  [OGHOWA_COLLECTIONS.DEALROOM_DOSSIERS]: path.join(NAMESPACES_DIR, OGHOWA_COLLECTIONS.DEALROOM_DOSSIERS),
};

// Ensure all isolated local directories exist
for (const dirPath of Object.values(NAMESPACED_PATHS)) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Lazy Firestore Client Initialization
let firestoreClient: Firestore | null = null;
let firestoreInitialized = false;
let isFirestoreAvailable = false;

export function isRemoteFirestoreConfigured(): boolean {
  return Boolean(
    process.env.GOOGLE_APPLICATION_CREDENTIALS ||
    process.env.FIREBASE_CONFIG ||
    (process.env.ENABLE_REMOTE_FIRESTORE === 'true' && process.env.GOOGLE_CLOUD_PROJECT)
  );
}

export function getFirestoreClient(): Firestore | null {
  if (firestoreInitialized) {
    return isFirestoreAvailable ? firestoreClient : null;
  }
  firestoreInitialized = true;

  if (!isRemoteFirestoreConfigured()) {
    isFirestoreAvailable = false;
    firestoreClient = null;
    console.log(
      `[Database Architect] Namespaced Storage Engine active for ${TARGET_DATABASE_ID} (Local isolated store at data/namespaces).`
    );
    return null;
  }

  try {
    const projectId = process.env.GOOGLE_CLOUD_PROJECT || 'ai-studio-metaspaceconsult';
    firestoreClient = new Firestore({
      projectId,
      databaseId: TARGET_DATABASE_ID,
    });
    isFirestoreAvailable = true;
    console.log(`[Database Architect] Firestore Client initialized for isolated database: ${TARGET_DATABASE_ID}`);
  } catch (err: any) {
    console.log(
      `[Database Architect] Cloud Firestore connection not initialized (${err?.message || 'Unverified'}). Active fallback: Namespaced Storage Engine.`
    );
    isFirestoreAvailable = false;
    firestoreClient = null;
  }
  return firestoreClient;
}

// Helper: Deep non-destructive merge
export function deepMerge(target: any, source: any): any {
  if (!source || typeof source !== 'object') return target;
  if (!target || typeof target !== 'object') return source;

  const output = { ...target };
  for (const key of Object.keys(source)) {
    const srcVal = source[key];
    const tgtVal = target[key];

    if (
      srcVal &&
      typeof srcVal === 'object' &&
      !Array.isArray(srcVal) &&
      tgtVal &&
      typeof tgtVal === 'object' &&
      !Array.isArray(tgtVal)
    ) {
      output[key] = deepMerge(tgtVal, srcVal);
    } else {
      output[key] = srcVal;
    }
  }
  return output;
}

// ============================================================================
// 1. SITE CONFIGURATION (Collection: 'oghowa_site_config', Doc: 'live_portal')
// ============================================================================

export async function getLiveSiteConfig(): Promise<any | null> {
  const firestore = getFirestoreClient();
  if (firestore) {
    try {
      const docRef = firestore.collection(OGHOWA_COLLECTIONS.SITE_CONFIG).doc(LIVE_PORTAL_DOC_ID);
      const snap = await docRef.get();
      if (snap.exists) {
        return snap.data();
      }
    } catch (err: any) {
      isFirestoreAvailable = false;
      firestoreClient = null;
      console.log(`[Database Architect] Remote site_config unavailable (${err?.message || 'Access unverified'}). Using local namespaced store.`);
    }
  }

  // Local namespaced read
  const filePath = path.join(NAMESPACED_PATHS[OGHOWA_COLLECTIONS.SITE_CONFIG], `${LIVE_PORTAL_DOC_ID}.json`);
  if (fs.existsSync(filePath)) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(content);
    } catch (err) {
      console.error('[Database Architect] Error reading isolated site_config:', err);
    }
  }

  // Legacy fallback migration: if data/cloud-config.json exists, load it
  const legacyPath = path.join(BASE_DATA_DIR, 'cloud-config.json');
  if (fs.existsSync(legacyPath)) {
    try {
      const content = fs.readFileSync(legacyPath, 'utf-8');
      const legacyData = JSON.parse(content);
      const migrated = {
        ...legacyData,
        ...MANDATORY_METADATA,
        migrated_to_namespace: true,
        updated_at: new Date().toISOString(),
      };
      // Save to namespaced path non-destructively
      fs.writeFileSync(filePath, JSON.stringify(migrated, null, 2), 'utf-8');
      return migrated;
    } catch (err) {
      console.error('[Database Architect] Error migrating legacy cloud-config:', err);
    }
  }

  return null;
}

/**
 * Non-destructive atomic write policy:
 * Always executes atomic set with { merge: true } or deep merge
 * Enforces mandatory Metaspace Consult metadata tagging
 */
export async function saveLiveSiteConfig(configPatch: any): Promise<{ success: boolean; data: any }> {
  if (!configPatch || typeof configPatch !== 'object') {
    throw new Error('Invalid configuration payload provided.');
  }

  const existing = (await getLiveSiteConfig()) || {};
  const mergedDocument = {
    ...deepMerge(existing, configPatch),
    ...MANDATORY_METADATA,
    doc_id: LIVE_PORTAL_DOC_ID,
    namespace: OGHOWA_COLLECTIONS.SITE_CONFIG,
    database_id: TARGET_DATABASE_ID,
    updated_at: new Date().toISOString(),
  };

  // 1. Live Firestore atomic merge
  const firestore = getFirestoreClient();
  if (firestore) {
    try {
      const docRef = firestore.collection(OGHOWA_COLLECTIONS.SITE_CONFIG).doc(LIVE_PORTAL_DOC_ID);
      await docRef.set(mergedDocument, { merge: true });
      console.log('[Firestore] Atomic set(merge: true) applied successfully to oghowa_site_config/live_portal');
    } catch (err: any) {
      isFirestoreAvailable = false;
      firestoreClient = null;
      console.log(`[Database Architect] Remote atomic merge unavailable (${err?.message || 'Access unverified'}). Merged into local namespaced store.`);
    }
  }

  // 2. Local Isolated Namespaced Mirror
  const filePath = path.join(NAMESPACED_PATHS[OGHOWA_COLLECTIONS.SITE_CONFIG], `${LIVE_PORTAL_DOC_ID}.json`);
  fs.writeFileSync(filePath, JSON.stringify(mergedDocument, null, 2), 'utf-8');

  // Also update legacy file to keep backward compatibility without touching any Metaspace files
  try {
    fs.writeFileSync(path.join(BASE_DATA_DIR, 'cloud-config.json'), JSON.stringify(mergedDocument, null, 2), 'utf-8');
  } catch {
    // ignore
  }

  return { success: true, data: mergedDocument };
}

// ============================================================================
// 2. REGISTRATIONS & ACCREDITATIONS (Collection: 'oghowa_registrations')
// ============================================================================

const SEED_REGISTRATIONS = [
  {
    id: 'reg-101',
    eventId: 'event-summit-2026',
    eventTitle: 'Oghowa Business Week: Institutional Leadership & Economic Summit',
    fullName: 'Osagie Alenkhe',
    email: 'osagie.alenkhe@midwestern-capital.com',
    phone: '+234 803 555 0192',
    organization: 'Midwestern Capital Partners',
    professionalTitle: 'Managing Partner',
    track: 'Investor / Funder',
    attendanceMode: 'In-Person (Benin City)',
    accreditationStatus: 'Approved',
    accreditationCode: 'OGH-2026-8821',
    selectedDays: ['Mon 16', 'Tue 17', 'Wed 18', 'Thu 19', 'Fri 20', 'Sat 21'],
    innovationWeekendDays: ['Fri 6', 'Sat 7'],
    referralSource: 'Metaspace / Óghowa network',
    dietaryAccessibility: 'VIP access required; no dietary restrictions',
    createdAt: '2026-09-12T14:32:00Z',
    ...MANDATORY_METADATA,
  },
  {
    id: 'reg-102',
    eventId: 'event-deal-room-2026',
    eventTitle: 'Sovereign-Private Deal Room & Syndicate Session',
    fullName: 'Amina Bello',
    email: 'amina@afrilogistics-tech.ng',
    phone: '+234 802 888 3410',
    organization: 'Benin Corridor Freight & Warehousing',
    professionalTitle: 'Chief Executive Officer',
    track: 'Entrepreneur / Founder',
    attendanceMode: 'In-Person (Benin City)',
    accreditationStatus: 'Pending',
    accreditationCode: 'OGH-2026-4419',
    selectedDays: ['Tue 17', 'Wed 18', 'Thu 19'],
    referralSource: 'Referred by a partner or attendee',
    createdAt: '2026-09-14T09:15:00Z',
    ...MANDATORY_METADATA,
  },
  {
    id: 'reg-103',
    eventId: 'event-innovation-weekend',
    eventTitle: 'Óghowa Innovation Weekend (BTF 2.0)',
    fullName: 'Erhunse Idahosa',
    email: 'erhunse@ugbekun.edu.ng',
    phone: '+234 701 444 9901',
    organization: 'Ugbekun Learning Tech',
    professionalTitle: 'Lead Software Architect',
    track: 'Entrepreneur / Founder',
    attendanceMode: 'In-Person (Benin City)',
    accreditationStatus: 'Approved',
    accreditationCode: 'OGH-2026-1184',
    selectedDays: ['Thu 19', 'Fri 20'],
    innovationWeekendDays: ['Thu 5', 'Fri 6', 'Sat 7'],
    referralSource: 'Social media',
    createdAt: '2026-09-15T11:45:00Z',
    ...MANDATORY_METADATA,
  },
];

export async function getAllRegistrations(): Promise<any[]> {
  const firestore = getFirestoreClient();
  if (firestore) {
    try {
      const snap = await firestore.collection(OGHOWA_COLLECTIONS.REGISTRATIONS).get();
      if (!snap.empty) {
        const results = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        return results;
      }
    } catch (err: any) {
      isFirestoreAvailable = false;
      firestoreClient = null;
      console.log(`[Database Architect] Remote registrations unavailable (${err?.message || 'Access unverified'}). Using local namespaced store.`);
    }
  }

  // Local namespaced read
  const regFile = path.join(NAMESPACED_PATHS[OGHOWA_COLLECTIONS.REGISTRATIONS], 'all_records.json');
  if (fs.existsSync(regFile)) {
    try {
      const content = fs.readFileSync(regFile, 'utf-8');
      return JSON.parse(content);
    } catch (err) {
      console.error('[Database Architect] Error reading isolated registrations:', err);
    }
  }

  // Legacy fallback migration
  const legacyFile = path.join(BASE_DATA_DIR, 'registrations.json');
  if (fs.existsSync(legacyFile)) {
    try {
      const content = fs.readFileSync(legacyFile, 'utf-8');
      const legacyRegs = JSON.parse(content);
      const tagged = legacyRegs.map((r: any) => ({
        ...r,
        ...MANDATORY_METADATA,
      }));
      fs.writeFileSync(regFile, JSON.stringify(tagged, null, 2), 'utf-8');
      return tagged;
    } catch (err) {
      console.error('[Database Architect] Error migrating legacy registrations:', err);
    }
  }

  // Seed default registrations stamped with metadata
  fs.writeFileSync(regFile, JSON.stringify(SEED_REGISTRATIONS, null, 2), 'utf-8');
  return SEED_REGISTRATIONS;
}

export async function saveRegistrationRecord(payload: any): Promise<any> {
  const current = await getAllRegistrations();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);

  const newDoc = {
    ...payload,
    id: payload.id || `reg-${Date.now()}`,
    accreditationCode: payload.accreditationCode || `OGH-2026-${randomSuffix}`,
    accreditationStatus: payload.accreditationStatus || 'Pending',
    createdAt: payload.createdAt || new Date().toISOString(),
    ...MANDATORY_METADATA,
    namespace: OGHOWA_COLLECTIONS.REGISTRATIONS,
    database_id: TARGET_DATABASE_ID,
  };

  // 1. Live Firestore Write
  const firestore = getFirestoreClient();
  if (firestore) {
    try {
      await firestore.collection(OGHOWA_COLLECTIONS.REGISTRATIONS).doc(newDoc.id).set(newDoc, { merge: true });
      console.log(`[Firestore] Registered delegate stored non-destructively in ${OGHOWA_COLLECTIONS.REGISTRATIONS}/${newDoc.id}`);
    } catch (err: any) {
      isFirestoreAvailable = false;
      firestoreClient = null;
      console.log(`[Database Architect] Remote registration write unavailable (${err?.message || 'Access unverified'}). Saved to local namespaced store.`);
    }
  }

  // 2. Local Isolated Namespaced Mirror
  const updatedList = [newDoc, ...current.filter((r) => r.id !== newDoc.id)];
  const regFile = path.join(NAMESPACED_PATHS[OGHOWA_COLLECTIONS.REGISTRATIONS], 'all_records.json');
  fs.writeFileSync(regFile, JSON.stringify(updatedList, null, 2), 'utf-8');

  // Also write individual document file for clean Firestore emulation
  const singleDocPath = path.join(NAMESPACED_PATHS[OGHOWA_COLLECTIONS.REGISTRATIONS], `${newDoc.id}.json`);
  fs.writeFileSync(singleDocPath, JSON.stringify(newDoc, null, 2), 'utf-8');

  // Sync to legacy file
  try {
    fs.writeFileSync(path.join(BASE_DATA_DIR, 'registrations.json'), JSON.stringify(updatedList, null, 2), 'utf-8');
  } catch {
    // ignore
  }

  return newDoc;
}

export async function updateRegistrationStatus(
  id: string,
  status: string,
  extra?: { declineReason?: string; passCode?: string; reviewer?: string }
): Promise<any> {
  const current = await getAllRegistrations();
  const idx = current.findIndex((r) => r.id === id);
  if (idx === -1) {
    throw new Error(`Registration record with ID '${id}' not found in ${OGHOWA_COLLECTIONS.REGISTRATIONS}.`);
  }

  const cleanStatus = status.trim();
  const lower = cleanStatus.toLowerCase();
  const normalizedStatus =
    lower === 'approved' ? 'Approved' : lower === 'declined' ? 'Declined' : 'Pending';

  const existing = current[idx];
  const passCode =
    extra?.passCode ||
    existing.passCode ||
    existing.accreditationCode ||
    `OGH-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  const qrPayload = JSON.stringify({
    badge: passCode,
    delegate: existing.fullName,
    email: existing.email,
    event: existing.eventTitle,
    track: existing.track,
    status: normalizedStatus === 'Approved' ? 'APPROVED' : normalizedStatus === 'Declined' ? 'DECLINED' : 'PENDING',
    authority: 'Metaspace Consult / Óghowa Secretariat',
    database_id: TARGET_DATABASE_ID,
    verified_at: new Date().toISOString(),
  });

  const updatedRecord = {
    ...existing,
    accreditationStatus: normalizedStatus,
    status: normalizedStatus.toUpperCase(),
    accreditationCode: passCode,
    passCode: passCode,
    qrPayload: qrPayload,
    declineReason: normalizedStatus === 'Declined' ? extra?.declineReason || existing.declineReason || '' : undefined,
    reviewed_at: new Date().toISOString(),
    reviewer: extra?.reviewer || 'usiobaifovictory245@gmail.com',
    updated_at: new Date().toISOString(),
    ...MANDATORY_METADATA,
  };

  // 1. Live Firestore field-specific atomic update
  const firestore = getFirestoreClient();
  if (firestore) {
    try {
      await firestore.collection(OGHOWA_COLLECTIONS.REGISTRATIONS).doc(id).set(
        {
          accreditationStatus: normalizedStatus,
          status: normalizedStatus.toUpperCase(),
          accreditationCode: passCode,
          passCode: passCode,
          qrPayload: qrPayload,
          declineReason: updatedRecord.declineReason || null,
          reviewed_at: updatedRecord.reviewed_at,
          reviewer: updatedRecord.reviewer,
          updated_at: updatedRecord.updated_at,
          ...MANDATORY_METADATA,
        },
        { merge: true }
      );
    } catch (err: any) {
      isFirestoreAvailable = false;
      firestoreClient = null;
      console.log(`[Database Architect] Remote status update unavailable (${err?.message || 'Access unverified'}). Saved to local namespaced store.`);
    }
  }

  // 2. Local Isolated Mirror
  current[idx] = updatedRecord;
  const regFile = path.join(NAMESPACED_PATHS[OGHOWA_COLLECTIONS.REGISTRATIONS], 'all_records.json');
  fs.writeFileSync(regFile, JSON.stringify(current, null, 2), 'utf-8');

  const singleDocPath = path.join(NAMESPACED_PATHS[OGHOWA_COLLECTIONS.REGISTRATIONS], `${id}.json`);
  fs.writeFileSync(singleDocPath, JSON.stringify(updatedRecord, null, 2), 'utf-8');

  try {
    fs.writeFileSync(path.join(BASE_DATA_DIR, 'registrations.json'), JSON.stringify(current, null, 2), 'utf-8');
  } catch {
    // ignore
  }

  return updatedRecord;
}

/**
 * STRICT DELETION POLICY:
 * Prohibits document deletion without explicit administrative passcode confirmation.
 */
export async function deleteRegistrationWithPasscode(id: string, passcode?: string): Promise<{ success: boolean }> {
  if (!passcode || !AUTHORIZED_ADMIN_PASSCODES.includes(passcode.trim())) {
    const error = new Error('PASSCODE_REQUIRED: Deletion prohibited in oghowa_* namespace without explicit administrative passcode confirmation.');
    (error as any).status = 403;
    (error as any).code = 'PASSCODE_REQUIRED';
    throw error;
  }

  const current = await getAllRegistrations();
  const exists = current.some((r) => r.id === id);
  if (!exists) {
    const error = new Error(`Registration document '${id}' not found.`);
    (error as any).status = 404;
    throw error;
  }

  // 1. Live Firestore Delete
  const firestore = getFirestoreClient();
  if (firestore) {
    try {
      await firestore.collection(OGHOWA_COLLECTIONS.REGISTRATIONS).doc(id).delete();
      console.log(`[Firestore] Passcode-verified deletion executed on ${OGHOWA_COLLECTIONS.REGISTRATIONS}/${id}`);
    } catch (err: any) {
      isFirestoreAvailable = false;
      firestoreClient = null;
      console.log(`[Database Architect] Remote deletion unavailable (${err?.message || 'Access unverified'}). Deleted from local namespaced store.`);
    }
  }

  // 2. Local Isolated Mirror
  const filtered = current.filter((r) => r.id !== id);
  const regFile = path.join(NAMESPACED_PATHS[OGHOWA_COLLECTIONS.REGISTRATIONS], 'all_records.json');
  fs.writeFileSync(regFile, JSON.stringify(filtered, null, 2), 'utf-8');

  const singleDocPath = path.join(NAMESPACED_PATHS[OGHOWA_COLLECTIONS.REGISTRATIONS], `${id}.json`);
  if (fs.existsSync(singleDocPath)) {
    fs.unlinkSync(singleDocPath);
  }

  try {
    fs.writeFileSync(path.join(BASE_DATA_DIR, 'registrations.json'), JSON.stringify(filtered, null, 2), 'utf-8');
  } catch {
    // ignore
  }

  return { success: true };
}

// ============================================================================
// 3. DEAL ROOM DOSSIERS (Collection: 'oghowa_dealroom_dossiers')
// ============================================================================

const SEED_DOSSIERS = [
  {
    id: 'dossier-001',
    initiative: 'Oghowa Deal Room Syndicate',
    companyName: 'Edo Agro-Industrial Processing Corridor',
    sector: 'AgriTech & Cold-Chain Logistics',
    raisingAmount: '$3,500,000',
    valuation: '$14,000,000',
    leadPartner: 'Midwestern Capital Partners',
    executiveContact: 'Osagie Alenkhe',
    dealStatus: 'Vetting Active',
    targetCloseDate: '2026-11-20',
    confidentialNotes: 'Sovereign land concession secured; export tax rebate pre-approved by Edo State Ministry of Finance.',
    createdAt: '2026-09-10T12:00:00Z',
    ...MANDATORY_METADATA,
  },
  {
    id: 'dossier-002',
    initiative: 'Oghowa Deal Room Syndicate',
    companyName: 'Benin Corridor Freight & Warehousing',
    sector: 'Supply Chain Infrastructure',
    raisingAmount: '₦850,000,000',
    valuation: '₦3,400,000,000',
    leadPartner: 'Afrilogistics Tech NG',
    executiveContact: 'Amina Bello',
    dealStatus: 'Term Sheet Stage',
    targetCloseDate: '2026-11-19',
    confidentialNotes: 'Warehouse capacity expansion across Benin Bypass corridor.',
    createdAt: '2026-09-13T10:30:00Z',
    ...MANDATORY_METADATA,
  },
];

export async function getAllDealRoomDossiers(): Promise<any[]> {
  const firestore = getFirestoreClient();
  if (firestore) {
    try {
      const snap = await firestore.collection(OGHOWA_COLLECTIONS.DEALROOM_DOSSIERS).get();
      if (!snap.empty) {
        return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      }
    } catch (err: any) {
      isFirestoreAvailable = false;
      firestoreClient = null;
      console.log(`[Database Architect] Remote dossiers unavailable (${err?.message || 'Access unverified'}). Using local namespaced store.`);
    }
  }

  const dossierFile = path.join(NAMESPACED_PATHS[OGHOWA_COLLECTIONS.DEALROOM_DOSSIERS], 'all_dossiers.json');
  if (fs.existsSync(dossierFile)) {
    try {
      return JSON.parse(fs.readFileSync(dossierFile, 'utf-8'));
    } catch (err) {
      console.error('[Database Architect] Error reading isolated dossiers:', err);
    }
  }

  fs.writeFileSync(dossierFile, JSON.stringify(SEED_DOSSIERS, null, 2), 'utf-8');
  return SEED_DOSSIERS;
}

export async function saveDealRoomDossier(payload: any): Promise<any> {
  const current = await getAllDealRoomDossiers();
  const newDossier = {
    ...payload,
    id: payload.id || `dossier-${Date.now()}`,
    createdAt: payload.createdAt || new Date().toISOString(),
    ...MANDATORY_METADATA,
    namespace: OGHOWA_COLLECTIONS.DEALROOM_DOSSIERS,
    database_id: TARGET_DATABASE_ID,
  };

  const firestore = getFirestoreClient();
  if (firestore) {
    try {
      await firestore.collection(OGHOWA_COLLECTIONS.DEALROOM_DOSSIERS).doc(newDossier.id).set(newDossier, { merge: true });
    } catch (err: any) {
      isFirestoreAvailable = false;
      firestoreClient = null;
      console.log(`[Database Architect] Remote dossier save unavailable (${err?.message || 'Access unverified'}). Saved to local namespaced store.`);
    }
  }

  const updated = [newDossier, ...current.filter((d) => d.id !== newDossier.id)];
  const dossierFile = path.join(NAMESPACED_PATHS[OGHOWA_COLLECTIONS.DEALROOM_DOSSIERS], 'all_dossiers.json');
  fs.writeFileSync(dossierFile, JSON.stringify(updated, null, 2), 'utf-8');

  return newDossier;
}

// ============================================================================
// 4. SAFE NAMESPACED DATASET EXPORT
// Strictly queries ONLY 'oghowa_*' collections. Never reads Metaspace records.
// ============================================================================

export async function exportOghowaIsolatedDataset(format: 'json' | 'csv' = 'json'): Promise<{
  timestamp: string;
  database_id: string;
  parent_organization: string;
  initiative: string;
  collections_included: string[];
  records_count: {
    site_config: number;
    events: number;
    registrations: number;
    dealroom_dossiers: number;
  };
  data?: any;
  csvContent?: string;
}> {
  const [siteConfig, registrations, dossiers] = await Promise.all([
    getLiveSiteConfig(),
    getAllRegistrations(),
    getAllDealRoomDossiers(),
  ]);

  const events = (siteConfig && siteConfig.events) || [];

  const dataset = {
    metadata: {
      parent_organization: MANDATORY_METADATA.parent_organization,
      initiative: MANDATORY_METADATA.initiative,
      app_support: MANDATORY_METADATA.app_support,
      database_id: TARGET_DATABASE_ID,
      export_timestamp: new Date().toISOString(),
      isolation_guarantee: 'Exclusive query of oghowa_* collections. Zero cross-tenant Metaspace Consult table reads.',
      authorized_collections: Object.values(OGHOWA_COLLECTIONS),
    },
    collections: {
      [OGHOWA_COLLECTIONS.SITE_CONFIG]: siteConfig ? [siteConfig] : [],
      [OGHOWA_COLLECTIONS.EVENTS]: events,
      [OGHOWA_COLLECTIONS.REGISTRATIONS]: registrations,
      [OGHOWA_COLLECTIONS.DEALROOM_DOSSIERS]: dossiers,
    },
  };

  const recordCounts = {
    site_config: siteConfig ? 1 : 0,
    events: events.length,
    registrations: registrations.length,
    dealroom_dossiers: dossiers.length,
  };

  if (format === 'csv') {
    // Generate CSV for registrations with strict metadata tagging
    const headers = [
      'Collection_Namespace',
      'Parent_Organization',
      'Initiative',
      'Accreditation_Code',
      'Full_Name',
      'Email',
      'Phone',
      'Organization',
      'Title',
      'Track',
      'Event_Title',
      'Business_Week_Days',
      'Innovation_Weekend_Days',
      'Status',
      'Referral_Source',
      'Created_At',
    ];

    const rows = registrations.map((r: any) => [
      `"${OGHOWA_COLLECTIONS.REGISTRATIONS}"`,
      `"${MANDATORY_METADATA.parent_organization}"`,
      `"${MANDATORY_METADATA.initiative}"`,
      `"${r.accreditationCode || ''}"`,
      `"${(r.fullName || '').replace(/"/g, '""')}"`,
      `"${r.email || ''}"`,
      `"${r.phone || ''}"`,
      `"${(r.organization || '').replace(/"/g, '""')}"`,
      `"${(r.professionalTitle || '').replace(/"/g, '""')}"`,
      `"${r.track || ''}"`,
      `"${(r.eventTitle || '').replace(/"/g, '""')}"`,
      `"${(r.selectedDays || []).join('; ')}"`,
      `"${(r.innovationWeekendDays || []).join('; ')}"`,
      `"${r.accreditationStatus || 'Pending'}"`,
      `"${(r.referralSource || '').replace(/"/g, '""')}"`,
      `"${r.createdAt || ''}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

    return {
      timestamp: new Date().toISOString(),
      database_id: TARGET_DATABASE_ID,
      parent_organization: MANDATORY_METADATA.parent_organization,
      initiative: MANDATORY_METADATA.initiative,
      collections_included: Object.values(OGHOWA_COLLECTIONS),
      records_count: recordCounts,
      csvContent,
    };
  }

  return {
    timestamp: new Date().toISOString(),
    database_id: TARGET_DATABASE_ID,
    parent_organization: MANDATORY_METADATA.parent_organization,
    initiative: MANDATORY_METADATA.initiative,
    collections_included: Object.values(OGHOWA_COLLECTIONS),
    records_count: recordCounts,
    data: dataset,
  };
}
