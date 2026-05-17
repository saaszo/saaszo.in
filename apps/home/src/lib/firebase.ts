import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
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

if (typeof window !== "undefined" && hasFirebaseConfig) {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  auth = getAuth(app);
}

export { app, auth };

export function getVerificationAuth() {
  if (typeof window === "undefined" || !hasFirebaseConfig) {
    return null;
  }

  if (!verificationApp) {
    verificationApp =
      getApps().find((candidate) => candidate.name === "phone-verification") ??
      initializeApp(firebaseConfig, "phone-verification");
  }

  if (!verificationAuth) {
    verificationAuth = getAuth(verificationApp ?? getApp());
  }

  return verificationAuth;
}

export default app;
