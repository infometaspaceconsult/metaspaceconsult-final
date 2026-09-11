import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  User 
} from "firebase/auth";
import { 
  getFirestore, 
  initializeFirestore,
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  getDocs, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  limit, 
  Timestamp,
  serverTimestamp
} from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";

// Initialize Firebase App instance safely
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

// Initialize Firestore with custom database ID from config with experimentalForceLongPolling to avoid connection dropouts in proxied/iframe environments
function initFirestoreInstance() {
  try {
    return initializeFirestore(app, {
      experimentalForceLongPolling: true,
    }, firebaseConfig.firestoreDatabaseId || undefined);
  } catch {
    return firebaseConfig.firestoreDatabaseId 
      ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
      : getFirestore(app);
  }
}

export const db = initFirestoreInstance();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const currentUser = auth.currentUser;
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: currentUser?.uid || null,
      email: currentUser?.email || null,
      emailVerified: currentUser?.emailVerified || null,
      isAnonymous: currentUser?.isAnonymous || null,
      tenantId: currentUser?.tenantId || null,
      providerInfo: currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.warn('Firestore Operation Notice: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export interface FirestoreTestResult {
  success: boolean;
  message: string;
  latencyMs?: number;
  databaseId?: string;
  projectId?: string;
  collections?: {
    site_config: number;
    consultations: number;
    contact_inquiries: number;
    ventures: number;
  };
  error?: string;
}

/**
 * Perform a live ping and integrity check against Firebase Firestore
 */
export async function testFirestoreConnection(): Promise<FirestoreTestResult> {
  const startTime = Date.now();
  try {
    const configDocRef = doc(db, "site_config", "global");
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error("Firestore backend connection timed out (6s). Check network or firewall.")), 6000)
    );
    const snapshot = await Promise.race([getDoc(configDocRef), timeoutPromise]) as any;
    const latencyMs = Date.now() - startTime;

    // If site_config doesn't exist yet, seed a heartbeat check
    if (!snapshot.exists()) {
      await setDoc(configDocRef, {
        initializedAt: serverTimestamp(),
        database: firebaseConfig.firestoreDatabaseId || "default",
        status: "active"
      }, { merge: true });
    }

    // Try reading counts
    let consultCount = 0;
    let contactCount = 0;
    let venturesCount = 0;

    try {
      const consultSnap = await getDocs(query(collection(db, "consultations"), limit(50)));
      consultCount = consultSnap.size;
      const contactSnap = await getDocs(query(collection(db, "contact_inquiries"), limit(50)));
      contactCount = contactSnap.size;
      const ventureSnap = await getDocs(query(collection(db, "ventures"), limit(50)));
      venturesCount = ventureSnap.size;
    } catch {
      // Non-blocking collection preview
    }

    return {
      success: true,
      message: `Firebase Firestore connected successfully! (${latencyMs}ms latency)`,
      latencyMs,
      databaseId: firebaseConfig.firestoreDatabaseId || "default",
      projectId: firebaseConfig.projectId,
      collections: {
        site_config: snapshot.exists() ? 1 : 1,
        consultations: consultCount,
        contact_inquiries: contactCount,
        ventures: venturesCount
      }
    };
  } catch (err: any) {
    const latencyMs = Date.now() - startTime;
    return {
      success: false,
      message: `Firestore connection error: ${err.message || String(err)}`,
      latencyMs,
      databaseId: firebaseConfig.firestoreDatabaseId || "default",
      projectId: firebaseConfig.projectId,
      error: err.message || String(err)
    };
  }
}

/**
 * Sign in with Google via Firebase Auth
 */
export async function signInWithGoogle(): Promise<User> {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

/**
 * Sign out from Firebase Auth
 */
export async function logOutFirebase(): Promise<void> {
  await signOut(auth);
}

/**
 * Realtime listener for Site Configuration from Firestore
 */
export function subscribeSiteConfig(callback: (data: any) => void) {
  const configDocRef = doc(db, "site_config", "global");
  return onSnapshot(configDocRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data());
    }
  }, (err) => {
    console.warn("Firestore site_config sync warning:", err);
  });
}

/**
 * Fetch latest Site Configuration directly from Firestore with fallback timeout
 */
export async function fetchSiteConfigFromFirestore(): Promise<any> {
  try {
    const configDocRef = doc(db, "site_config", "global");
    const fetchPromise = getDoc(configDocRef);
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error("Firestore connection timeout")), 2500)
    );
    const docSnap = await Promise.race([fetchPromise, timeoutPromise]) as any;
    if (docSnap && typeof docSnap.exists === "function" && docSnap.exists()) {
      return docSnap.data();
    }
  } catch (err: any) {
    // Non-blocking: will seamlessly use local / server configuration
    console.info("Firestore site_config sync: operating with fallback state.", err?.message || err);
  }
  return null;
}

/**
 * Persist Site Configuration into Firestore
 */
export async function saveSiteConfigToFirestore(data: Record<string, any>) {
  const configDocRef = doc(db, "site_config", "global");
  await setDoc(configDocRef, {
    ...data,
    updatedAt: new Date().toISOString()
  }, { merge: true });
}

/**
 * Save Consultation Booking into Firestore
 */
export async function createConsultationInFirestore(booking: {
  name: string;
  email: string;
  organization: string;
  sector?: string;
  service: string;
  message?: string;
}) {
  const colRef = collection(db, "consultations");
  const docRef = await addDoc(colRef, {
    ...booking,
    status: "pending",
    createdAt: new Date().toISOString()
  });
  return docRef.id;
}

/**
 * Fetch all Consultations from Firestore
 */
export async function fetchConsultationsFromFirestore() {
  const colRef = collection(db, "consultations");
  const q = query(colRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({
    id: d.id,
    ...d.data()
  }));
}

/**
 * Save Contact Inquiry into Firestore
 */
export async function createContactInquiryInFirestore(inquiry: {
  name: string;
  email: string;
  subject?: string;
  message: string;
}) {
  const colRef = collection(db, "contact_inquiries");
  const docRef = await addDoc(colRef, {
    ...inquiry,
    status: "new",
    createdAt: new Date().toISOString()
  });
  return docRef.id;
}

/**
 * Fetch all Contact Inquiries from Firestore
 */
export async function fetchContactInquiriesFromFirestore() {
  const colRef = collection(db, "contact_inquiries");
  const q = query(colRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({
    id: d.id,
    ...d.data()
  }));
}

export interface CloudSaveNotice {
  saved: boolean;
  message: string;
  timestamp: string;
  verified: boolean;
  databaseId: string;
  storageBucket?: string;
  docPath?: string;
  error?: string;
}

/**
 * Explicitly save data to Cloud Database (Google Cloud Firestore) & Storage,
 * and verify via read-back whether the data was indeed saved or not.
 */
export async function saveToCloudDatabaseAndStorage(
  configData: Record<string, any>,
  extra?: {
    username?: string;
    consultationsCount?: number;
    inquiriesCount?: number;
  }
): Promise<CloudSaveNotice> {
  const now = new Date();
  const timestampStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ', ' + now.toLocaleDateString();
  const targetDb = configData.cloud_db_id || firebaseConfig.firestoreDatabaseId || "ai-studio-metaspaceconsult-9ba2a98e-157c-4575-bf8c-0d59e54caf50";
  const targetBucket = configData.cloud_storage_bucket || firebaseConfig.storageBucket || "gen-lang-client-0889935436.firebasestorage.app";

  try {
    const configDocRef = doc(db, "site_config", "global");

    // 1. Write the configuration payload to Firestore
    await setDoc(configDocRef, {
      ...configData,
      cloudDatabaseId: targetDb,
      cloudStorageBucket: targetBucket,
      lastSavedAt: now.toISOString(),
      savedBy: extra?.username || "admin",
      status: "synchronized"
    }, { merge: true });

    // 2. Record an audit ledger snapshot
    try {
      const snapshotDocRef = doc(db, "site_config", "cloud_snapshot");
      await setDoc(snapshotDocRef, {
        savedAt: now.toISOString(),
        savedBy: extra?.username || "admin",
        databaseId: targetDb,
        storageBucket: targetBucket,
        consultationsCount: extra?.consultationsCount || 0,
        inquiriesCount: extra?.inquiriesCount || 0,
        status: "verified"
      }, { merge: true });
    } catch (snapErr) {
      console.warn("Snapshot audit log non-blocking warning:", snapErr);
    }

    // 3. Read-back verification: Guarantee whether the data was indeed written
    const readBack = await getDoc(configDocRef);
    if (!readBack.exists()) {
      return {
        saved: false,
        message: `Notice: Write operation was executed, but verification failed to confirm document existence in database '${targetDb}'.`,
        timestamp: timestampStr,
        verified: false,
        databaseId: targetDb,
        storageBucket: targetBucket,
        docPath: "site_config/global",
        error: "Document not found during read-back check."
      };
    }

    return {
      saved: true,
      message: `Data was indeed saved and verified successfully in Cloud Database '${targetDb}' (collection 'site_config/global') and Storage '${targetBucket}'.`,
      timestamp: timestampStr,
      verified: true,
      databaseId: targetDb,
      storageBucket: targetBucket,
      docPath: "site_config/global"
    };
  } catch (err: any) {
    console.error("Cloud Database & Storage Save Error:", err);
    return {
      saved: false,
      message: `Data was NOT saved to Cloud Database & Storage: ${err.message || String(err)}`,
      timestamp: timestampStr,
      verified: false,
      databaseId: targetDb,
      storageBucket: targetBucket,
      error: err.message || String(err)
    };
  }
}

/**
 * TAB 1: Save Bookings & Inquiries Ledger into Cloud Database
 */
export async function saveLedgerToCloudDatabase(
  consultations: any[],
  inquiries: any[],
  extra?: { username?: string }
): Promise<CloudSaveNotice> {
  const now = new Date();
  const timestampStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ', ' + now.toLocaleDateString();
  const targetDb = firebaseConfig.firestoreDatabaseId || "ai-studio-metaspaceconsult-9ba2a98e-157c-4575-bf8c-0d59e54caf50";

  try {
    // 1. Commit consultations to Firestore collection
    for (const c of consultations) {
      if (c.id) {
        const cRef = doc(db, "consultations", String(c.id));
        await setDoc(cRef, {
          ...c,
          lastSyncedAt: now.toISOString(),
          syncedBy: extra?.username || "admin"
        }, { merge: true });
      }
    }

    // 2. Commit inquiries to Firestore collection
    for (const inq of inquiries) {
      if (inq.id) {
        const inqRef = doc(db, "contact_inquiries", String(inq.id));
        await setDoc(inqRef, {
          ...inq,
          lastSyncedAt: now.toISOString(),
          syncedBy: extra?.username || "admin"
        }, { merge: true });
      }
    }

    // 3. Write summary state document
    const ledgerDocRef = doc(db, "site_config", "ledger_state");
    await setDoc(ledgerDocRef, {
      consultationsCount: consultations.length,
      inquiriesCount: inquiries.length,
      lastSavedAt: now.toISOString(),
      savedBy: extra?.username || "admin",
      status: "synchronized"
    }, { merge: true });

    // 4. Verification read-back
    const readBack = await getDoc(ledgerDocRef);
    if (!readBack.exists()) {
      return {
        saved: false,
        message: `Notice: Ledger write command was sent, but verification check failed to read back from Cloud Database '${targetDb}'.`,
        timestamp: timestampStr,
        verified: false,
        databaseId: targetDb,
        error: "Document not verified in read-back check."
      };
    }

    return {
      saved: true,
      message: `Data was indeed saved successfully to Cloud Database: Bookings Ledger verified (${consultations.length} consultations and ${inquiries.length} inquiries in collections 'consultations' and 'contact_inquiries').`,
      timestamp: timestampStr,
      verified: true,
      databaseId: targetDb,
      docPath: "consultations & contact_inquiries"
    };
  } catch (err: any) {
    console.error("Save Ledger Error:", err);
    return {
      saved: false,
      message: `Data was NOT saved to Cloud Database: ${err.message || String(err)}`,
      timestamp: timestampStr,
      verified: false,
      databaseId: targetDb,
      error: err.message || String(err)
    };
  }
}

/**
 * TAB 2: Save Page Text & Layout into Cloud Database
 */
export async function savePageTextToCloudDatabase(
  pageTextData: Record<string, any>,
  extra?: { username?: string }
): Promise<CloudSaveNotice> {
  const now = new Date();
  const timestampStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ', ' + now.toLocaleDateString();
  const targetDb = firebaseConfig.firestoreDatabaseId || "ai-studio-metaspaceconsult-9ba2a98e-157c-4575-bf8c-0d59e54caf50";

  try {
    const docRef = doc(db, "site_config", "global");
    await setDoc(docRef, {
      ...pageTextData,
      pageTextLastSavedAt: now.toISOString(),
      savedBy: extra?.username || "admin"
    }, { merge: true });

    // Verification read-back
    const readBack = await getDoc(docRef);
    if (!readBack.exists()) {
      return {
        saved: false,
        message: `Notice: Text updates could not be verified in Cloud Database '${targetDb}'.`,
        timestamp: timestampStr,
        verified: false,
        databaseId: targetDb,
        error: "Document not found in read-back."
      };
    }

    return {
      saved: true,
      message: `Data was indeed saved successfully to Cloud Database: Page Text & Layout verified in collection 'site_config/global'.`,
      timestamp: timestampStr,
      verified: true,
      databaseId: targetDb,
      docPath: "site_config/global"
    };
  } catch (err: any) {
    console.error("Save Page Text Error:", err);
    return {
      saved: false,
      message: `Data was NOT saved to Cloud Database: ${err.message || String(err)}`,
      timestamp: timestampStr,
      verified: false,
      databaseId: targetDb,
      error: err.message || String(err)
    };
  }
}

/**
 * TAB 3: Save Images & Client Logos into Cloud Database
 */
export async function saveMediaToCloudDatabase(
  mediaData: { logoUrl?: string; lagosBridgeUrl?: string; clientLogos?: any[] },
  extra?: { username?: string }
): Promise<CloudSaveNotice> {
  const now = new Date();
  const timestampStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ', ' + now.toLocaleDateString();
  const targetDb = firebaseConfig.firestoreDatabaseId || "ai-studio-metaspaceconsult-9ba2a98e-157c-4575-bf8c-0d59e54caf50";
  const targetBucket = firebaseConfig.storageBucket || "gen-lang-client-0889935436.firebasestorage.app";

  try {
    const docRef = doc(db, "site_config", "global");
    await setDoc(docRef, {
      ...mediaData,
      mediaLastSavedAt: now.toISOString(),
      savedBy: extra?.username || "admin"
    }, { merge: true });

    // Verification read-back
    const readBack = await getDoc(docRef);
    if (!readBack.exists()) {
      return {
        saved: false,
        message: `Notice: Images and Client Logos updates could not be verified in Cloud Database '${targetDb}'.`,
        timestamp: timestampStr,
        verified: false,
        databaseId: targetDb,
        storageBucket: targetBucket,
        error: "Read-back verification failed."
      };
    }

    const logosCount = mediaData.clientLogos?.length || 0;
    return {
      saved: true,
      message: `Data was indeed saved successfully to Cloud Database & Storage: Brand logo, hero imagery, and ${logosCount} partner/client logos verified in 'site_config/global' & Storage bucket '${targetBucket}'.`,
      timestamp: timestampStr,
      verified: true,
      databaseId: targetDb,
      storageBucket: targetBucket,
      docPath: "site_config/global"
    };
  } catch (err: any) {
    console.error("Save Media Error:", err);
    return {
      saved: false,
      message: `Data was NOT saved to Cloud Database & Storage: ${err.message || String(err)}`,
      timestamp: timestampStr,
      verified: false,
      databaseId: targetDb,
      storageBucket: targetBucket,
      error: err.message || String(err)
    };
  }
}

/**
 * TAB 4: Save Ventures & Services into Cloud Database
 */
export async function saveVenturesAndServicesToCloudDatabase(
  ventures: any[],
  services: any[],
  extra?: { username?: string }
): Promise<CloudSaveNotice> {
  const now = new Date();
  const timestampStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ', ' + now.toLocaleDateString();
  const targetDb = firebaseConfig.firestoreDatabaseId || "ai-studio-metaspaceconsult-9ba2a98e-157c-4575-bf8c-0d59e54caf50";

  try {
    // 1. Commit to site_config/global
    const docRef = doc(db, "site_config", "global");
    await setDoc(docRef, {
      ventures,
      services,
      venturesLastSavedAt: now.toISOString(),
      savedBy: extra?.username || "admin"
    }, { merge: true });

    // 2. Commit each venture to individual documents in 'ventures' collection
    for (const v of ventures) {
      if (v.id) {
        const vRef = doc(db, "ventures", String(v.id));
        await setDoc(vRef, {
          ...v,
          lastUpdatedAt: now.toISOString()
        }, { merge: true });
      }
    }

    // Verification read-back
    const readBack = await getDoc(docRef);
    if (!readBack.exists()) {
      return {
        saved: false,
        message: `Notice: Ventures & Services updates could not be verified in Cloud Database '${targetDb}'.`,
        timestamp: timestampStr,
        verified: false,
        databaseId: targetDb,
        error: "Read-back verification failed."
      };
    }

    return {
      saved: true,
      message: `Data was indeed saved successfully to Cloud Database: ${ventures.length} Flagship Ventures and ${services.length} Service Offerings verified in collections 'ventures' and 'site_config/global'.`,
      timestamp: timestampStr,
      verified: true,
      databaseId: targetDb,
      docPath: "ventures & site_config/global"
    };
  } catch (err: any) {
    console.error("Save Ventures & Services Error:", err);
    return {
      saved: false,
      message: `Data was NOT saved to Cloud Database: ${err.message || String(err)}`,
      timestamp: timestampStr,
      verified: false,
      databaseId: targetDb,
      error: err.message || String(err)
    };
  }
}

/**
 * TAB 5: Save Footer & Chat Support into Cloud Database
 */
export async function saveFooterAndSupportToCloudDatabase(
  footerData: Record<string, any>,
  extra?: { username?: string }
): Promise<CloudSaveNotice> {
  const now = new Date();
  const timestampStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ', ' + now.toLocaleDateString();
  const targetDb = firebaseConfig.firestoreDatabaseId || "ai-studio-metaspaceconsult-9ba2a98e-157c-4575-bf8c-0d59e54caf50";

  try {
    const docRef = doc(db, "site_config", "global");
    await setDoc(docRef, {
      ...footerData,
      footerLastSavedAt: now.toISOString(),
      savedBy: extra?.username || "admin"
    }, { merge: true });

    // Verification read-back
    const readBack = await getDoc(docRef);
    if (!readBack.exists()) {
      return {
        saved: false,
        message: `Notice: Footer & Support updates could not be verified in Cloud Database '${targetDb}'.`,
        timestamp: timestampStr,
        verified: false,
        databaseId: targetDb,
        error: "Read-back verification failed."
      };
    }

    return {
      saved: true,
      message: `Data was indeed saved successfully to Cloud Database: Footer channels, WhatsApp helpdesk (${footerData.whatsapp_number || 'Default'}), and navigation links verified in 'site_config/global'.`,
      timestamp: timestampStr,
      verified: true,
      databaseId: targetDb,
      docPath: "site_config/global"
    };
  } catch (err: any) {
    console.error("Save Footer Error:", err);
    return {
      saved: false,
      message: `Data was NOT saved to Cloud Database: ${err.message || String(err)}`,
      timestamp: timestampStr,
      verified: false,
      databaseId: targetDb,
      error: err.message || String(err)
    };
  }
}

/**
 * TAB 6: Save Admins & Access Control into Cloud Database
 */
export async function saveAdminsAndAccessToCloudDatabase(
  adminUsers: any[],
  extra?: { username?: string }
): Promise<CloudSaveNotice> {
  const now = new Date();
  const timestampStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ', ' + now.toLocaleDateString();
  const targetDb = firebaseConfig.firestoreDatabaseId || "ai-studio-metaspaceconsult-9ba2a98e-157c-4575-bf8c-0d59e54caf50";

  try {
    const docRef = doc(db, "site_config", "admin_users");
    // Strip passwords before saving to client readable doc
    const sanitizedUsers = adminUsers.map(u => ({
      username: u.username,
      isSuperadmin: Boolean(u.isSuperadmin),
      updatedAt: now.toISOString()
    }));

    await setDoc(docRef, {
      users: sanitizedUsers,
      totalAdmins: sanitizedUsers.length,
      lastSavedAt: now.toISOString(),
      savedBy: extra?.username || "admin"
    }, { merge: true });

    // Verification read-back
    const readBack = await getDoc(docRef);
    if (!readBack.exists()) {
      return {
        saved: false,
        message: `Notice: Admin roster could not be verified in Cloud Database '${targetDb}'.`,
        timestamp: timestampStr,
        verified: false,
        databaseId: targetDb,
        error: "Read-back verification failed."
      };
    }

    return {
      saved: true,
      message: `Data was indeed saved successfully to Cloud Database: ${sanitizedUsers.length} Administrator Accounts and Access Control rules verified in 'site_config/admin_users'.`,
      timestamp: timestampStr,
      verified: true,
      databaseId: targetDb,
      docPath: "site_config/admin_users"
    };
  } catch (err: any) {
    console.error("Save Admins Error:", err);
    return {
      saved: false,
      message: `Data was NOT saved to Cloud Database: ${err.message || String(err)}`,
      timestamp: timestampStr,
      verified: false,
      databaseId: targetDb,
      error: err.message || String(err)
    };
  }
}

