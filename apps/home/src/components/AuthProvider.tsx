'use client';

import {
  createContext,
  startTransition,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '@/lib/app-config';
import { auth } from '@/lib/firebase';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onIdTokenChanged,
  User as FirebaseUser,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile as firebaseUpdateProfile,
  updatePassword as firebaseUpdatePassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  confirmPasswordReset as firebaseConfirmPasswordReset,
} from 'firebase/auth';

type ProfilePayload = {
  id: string;
  email: string | null;
  phone: string | null;
  fullName: string | null;
  companyName: string | null;
  avatarUrl: string | null;
  profileCompleted: boolean;
};

type AuthInfo = {
  kind: string;
  email: string | null;
  phone: string | null;
  providers: string[];
  primaryProvider: string;
  canChangePassword: boolean;
};

type SubscriptionInfo = {
  planName: string;
  status: string;
  billingCycle: string;
  seats: number;
  currentPeriodEnd: string | null;
};

type AuthContextValue = {
  user: FirebaseUser | null;
  authenticated: boolean;
  error: string;
  loading: boolean;
  profile: ProfilePayload | null;
  auth: AuthInfo | null;
  subscription: SubscriptionInfo | null;
  reloadUser: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  setupRecaptcha: (
    containerId: string,
    onSolved?: () => void | Promise<void>,
  ) => RecaptchaVerifier;
  sendPhoneOtp: (phoneNumber: string, appVerifier: RecaptchaVerifier) => Promise<ConfirmationResult>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, name?: string) => Promise<void>;
  updateProfile: (values: Partial<ProfilePayload>) => Promise<{ error?: string }>;
  updatePassword: (password: string) => Promise<{ error?: string }>;
  sendPasswordReset: (email: string) => Promise<{ error?: string }>;
  confirmPasswordReset: (code: string, password: string) => Promise<{ error?: string }>;
};

type AuthSessionState = Pick<
  AuthContextValue,
  'user' | 'authenticated' | 'error' | 'loading' | 'profile' | 'auth' | 'subscription'
>;

const AuthContext = createContext<AuthContextValue | null>(null);

const signedOutState = {
  user: null,
  authenticated: false,
  error: '',
  loading: false,
  profile: null,
  auth: null,
  subscription: null,
};

function buildActionCodeSettings(path: string) {
  const origin =
    typeof window !== 'undefined' ? window.location.origin : 'https://saaszo.in';

  return {
    url: `${origin}${path}`,
    handleCodeInApp: false,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [state, setState] = useState<AuthSessionState>({
    ...signedOutState,
    loading: true,
  });

  async function reloadUser() {
    if (!auth?.currentUser) return;
    await auth.currentUser.reload();
    // Trigger the onIdTokenChanged flow manually by getting a new token
    await auth.currentUser.getIdToken(true);
  }

  useEffect(() => {
    let isMounted = true;

    if (!auth) {
      if (isMounted) {
        setState({ ...signedOutState, error: 'Firebase is not initialized.' });
      }
      return;
    }

    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      if (!isMounted) return;

      if (!user) {
        setState(signedOutState);
        return;
      }

      const providerIds = user.providerData
        .map((provider) => provider.providerId)
        .filter(Boolean);
      const isPasswordUser = providerIds.includes('password');

      if (isPasswordUser && user.email && !user.emailVerified) {
        setState({
          user,
          authenticated: false,
          error: 'Please verify your email address before continuing.',
          loading: false,
          profile: null,
          auth: null,
          subscription: null,
        });
        return;
      }

      setState((current) => ({ ...current, loading: true, error: '' }));

      try {
        const token = await user.getIdToken();
        
        // Sync user with our backend Supabase database
        const response = await fetch(`${API_BASE_URL}/auth/sync`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to sync profile with server.');
        }

        const data = await response.json();

        if (isMounted) {
          setState({
            user,
            authenticated: true,
            error: '',
            loading: false,
            profile: data.profile,
            auth: data.auth,
            subscription: data.subscription,
          });
        }
      } catch (error) {
        if (isMounted) {
          setState({
            ...signedOutState,
            error: error instanceof Error ? error.message : 'Authentication failed.',
          });
        }
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  async function signInWithGoogle() {
    if (!auth) throw new Error('Firebase not initialized');
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
    router.push('/dashboard');
  }

  function setupRecaptcha(
    containerId: string,
    onSolved?: () => void | Promise<void>,
  ) {
    if (!auth) throw new Error('Firebase not initialized');
    return new RecaptchaVerifier(auth, containerId, {
      size: 'invisible',
      callback: () => {
        void onSolved?.();
      },
    });
  }

  async function sendPhoneOtp(phoneNumber: string, appVerifier: RecaptchaVerifier) {
    if (!auth) throw new Error('Firebase not initialized');
    return await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
  }
  
  async function signInWithEmail(email: string, password: string) {
    if (!auth) throw new Error('Firebase not initialized');
    const credential = await signInWithEmailAndPassword(auth, email, password);

    if (credential.user.email && !credential.user.emailVerified) {
      const error = new Error(
        'Please verify your email address before signing in.',
      );
      (error as Error & { code?: string }).code = 'auth/email-not-verified';
      throw error;
    }

    router.push('/dashboard');
  }

  async function signUpWithEmail(email: string, password: string, name?: string) {
    if (!auth) throw new Error('Firebase not initialized');
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    if (name) {
      await firebaseUpdateProfile(user, { displayName: name });
    }
    // Always send verification email for new signups
    await sendEmailVerification(user, buildActionCodeSettings('/auth/verify-email'));
    // Force token refresh to get updated profile if needed
    await user.getIdToken(true);
    
    router.push(`/auth/verify-email?email=${encodeURIComponent(email)}`);
  }

  async function updateProfile(values: Partial<ProfilePayload>) {
    try {
      const user = auth?.currentUser;
      if (!user) throw new Error('Not authenticated');
      
      const token = await user.getIdToken();
      const response = await fetch(`${API_BASE_URL}/profile/me`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error('Failed to update profile');
      const data = await response.json();
      
      setState(current => ({
        ...current,
        profile: data.profile,
        auth: data.auth,
        subscription: data.subscription
      }));
      
      return { error: undefined };
    } catch (err: any) {
      return { error: err.message };
    }
  }

  async function updatePassword(password: string) {
    try {
      const user = auth?.currentUser;
      if (!user) throw new Error('Not authenticated');
      await firebaseUpdatePassword(user, password);
      return { error: undefined };
    } catch (err: any) {
      return { error: err.message };
    }
  }

  async function sendPasswordReset(email: string) {
    try {
      if (!auth) throw new Error('Firebase not initialized');
      await sendPasswordResetEmail(
        auth,
        email,
        buildActionCodeSettings('/reset-password'),
      );
      return { error: undefined };
    } catch (err: any) {
      return { error: err.message };
    }
  }

  async function confirmPasswordReset(code: string, password: string) {
    try {
      if (!auth) throw new Error('Firebase not initialized');
      await firebaseConfirmPasswordReset(auth, code, password);
      return { error: undefined };
    } catch (err: any) {
      return { error: err.message };
    }
  }

  async function signOut() {
    if (auth) {
      await firebaseSignOut(auth);
    }
    setState(signedOutState);
    startTransition(() => {
      router.push('/auth');
    });
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        reloadUser,
        signInWithGoogle,
        signOut,
        setupRecaptcha,
        sendPhoneOtp,
        signInWithEmail,
        signUpWithEmail,
        updateProfile,
        updatePassword,
        sendPasswordReset,
        confirmPasswordReset,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthSession() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuthSession must be used inside AuthProvider.');
  }

  return context;
}
