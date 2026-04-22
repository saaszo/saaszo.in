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
    'AIzaSyAIqz29k_DFOAYDQvdxDmLj8H-jke4gSFc',
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'saaszo.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'saaszo',
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    'saaszo.firebasestorage.app',
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '92234131478',
  appId:
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID ||
    '1:92234131478:web:560c698b11c5b1daeced37',
  databaseURL:
    process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL ||
    'https://saaszo-default-rtdb.firebaseio.com',
};
