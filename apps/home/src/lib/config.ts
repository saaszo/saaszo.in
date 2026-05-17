const fallbackApiBaseUrl = "https://api.saaszo.in/api";
const fallbackAppUrl = "https://saaszo.in";

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
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
    messagingSenderId:
      process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "",
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
