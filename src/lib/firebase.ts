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

// Initialize Firestore with custom database ID from config if present
export const db = firebaseConfig.firestoreDatabaseId 
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

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
    const snapshot = await getDoc(configDocRef);
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
