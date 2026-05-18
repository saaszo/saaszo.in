const fallbackApiBaseUrl = "https://api.saaszo.in/api";
const fallbackAppUrl = "https://saaszo.in";
const fallbackFirebaseConfig = {
  apiKey: "AIzaSyDCzvZFghhyIZ5p1-ZJ9MmgIvDkt34gws4",
  authDomain: "full-project-saaszo.firebaseapp.com",
  projectId: "full-project-saaszo",
  storageBucket: "full-project-saaszo.firebasestorage.app",
  messagingSenderId: "808658963162",
  appId: "1:808658963162:web:3831bd837b2a054d7a33e3",
  measurementId: "G-KVP0DT2KHZ",
  databaseURL: "",
} as const;

export type FirebasePublicConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
  databaseURL: string;
};

export const appConfig = {
  appName: process.env.NEXT_PUBLIC_APP_NAME || "SaaSzo",
  appUrl: process.env.NEXT_PUBLIC_APP_URL || fallbackAppUrl,
  apiBaseUrl:
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    fallbackApiBaseUrl,
  firebase: {
    apiKey:
      process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
      fallbackFirebaseConfig.apiKey,
    authDomain:
      process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ||
      fallbackFirebaseConfig.authDomain,
    projectId:
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
      fallbackFirebaseConfig.projectId,
    storageBucket:
      process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
      fallbackFirebaseConfig.storageBucket,
    messagingSenderId:
      process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ||
      fallbackFirebaseConfig.messagingSenderId,
    appId:
      process.env.NEXT_PUBLIC_FIREBASE_APP_ID || fallbackFirebaseConfig.appId,
    measurementId:
      process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ||
      fallbackFirebaseConfig.measurementId,
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || "",
  } satisfies FirebasePublicConfig,
};

export function toAbsoluteApiUrl(path: string) {
  const baseUrl = appConfig.apiBaseUrl.replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  if (baseUrl.endsWith("/api") && normalizedPath === "/api") {
    return baseUrl;
  }

  if (baseUrl.endsWith("/api") && normalizedPath.startsWith("/api/")) {
    return `${baseUrl}${normalizedPath.slice(4)}`;
  }

  return `${baseUrl}${normalizedPath}`;
}
