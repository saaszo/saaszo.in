import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import {
  getAuth,
  inMemoryPersistence,
  setPersistence,
  type Auth,
} from "firebase/auth";
import { FIREBASE_PUBLIC_CONFIG } from "./app-config";

const firebaseConfig = FIREBASE_PUBLIC_CONFIG;

export const hasFirebaseConfig = Boolean(
  firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId,
);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let verificationApp: FirebaseApp | null = null;
let verificationAuth: Auth | null = null;
let verificationAuthPromise: Promise<Auth | null> | null = null;

if (typeof window !== "undefined" && hasFirebaseConfig) {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  auth = getAuth(app);
}

export { app, auth };

export async function getVerificationAuth() {
  if (typeof window === "undefined" || !hasFirebaseConfig) {
    return null;
  }

  if (!verificationAuthPromise) {
    verificationAuthPromise = (async () => {
      if (!verificationApp) {
        verificationApp =
          getApps().find((candidate) => candidate.name === "phone-verification") ??
          initializeApp(firebaseConfig, "phone-verification");
      }

      if (!verificationAuth) {
        verificationAuth = getAuth(verificationApp ?? getApp());
      }

      await setPersistence(verificationAuth, inMemoryPersistence);
      return verificationAuth;
    })().catch((error) => {
      verificationAuthPromise = null;
      throw error;
    });
  }

  return await verificationAuthPromise;
}

export default app;
