export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://api.saaszo.in/api';

const FIREBASE_FALLBACK_CONFIG = {
  apiKey: 'AIzaSyDCzvZFghhyIZ5p1-ZJ9MmgIvDkt34gws4',
  authDomain: 'full-project-saaszo.firebaseapp.com',
  projectId: 'full-project-saaszo',
  storageBucket: 'full-project-saaszo.firebasestorage.app',
  messagingSenderId: '808658963162',
  appId: '1:808658963162:web:3831bd837b2a054d7a33e3',
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
