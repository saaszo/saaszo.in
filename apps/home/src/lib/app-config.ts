export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://api.saaszo.in';

export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://vulsmysstduolqqobjkr.supabase.co';

export const SUPABASE_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  'sb_publishable_YxcULmbfMUMMGJSwZwc3vA_Ktrz7vBs';

export const FIREBASE_PUBLIC_CONFIG = {
  apiKey:
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
    'AIzaSyAYSuUGlOTRxqafhk_xrrYa6EbJWNh0X5Y',
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ||
    'saaszo-51d83.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'saaszo-51d83',
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    'saaszo-51d83.firebasestorage.app',
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '16070894516',
  appId:
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID ||
    '1:16070894516:web:2b8630d55c75e8952a48e1',
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
};
