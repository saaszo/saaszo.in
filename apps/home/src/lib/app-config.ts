export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://api.saaszo.in';

const FIREBASE_FALLBACK_CONFIG = {
  apiKey: 'AIzaSyAIqz29k_DFOAYDQvdxDmLj8H-jke4gSFc',
  authDomain: 'saaszo.firebaseapp.com',
  projectId: 'saaszo',
  storageBucket: 'saaszo.firebasestorage.app',
  messagingSenderId: '92234131478',
  appId: '1:92234131478:web:560c698b11c5b1daeced37',
};

export const FIREBASE_PUBLIC_CONFIG = {
  apiKey:
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY || FIREBASE_FALLBACK_CONFIG.apiKey,
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ||
    FIREBASE_FALLBACK_CONFIG.authDomain,
  projectId:
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
    FIREBASE_FALLBACK_CONFIG.projectId,
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    FIREBASE_FALLBACK_CONFIG.storageBucket,
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ||
    FIREBASE_FALLBACK_CONFIG.messagingSenderId,
  appId:
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID || FIREBASE_FALLBACK_CONFIG.appId,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
};
