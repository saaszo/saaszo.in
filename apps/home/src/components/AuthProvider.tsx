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
  updatePassword as firebaseUpdatePassword,
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
    options?: {
      size?: 'normal' | 'invisible';
      onSolved?: () => void | Promise<void>;
      onExpired?: () => void | Promise<void>;
    },
  ) => RecaptchaVerifier;
  sendPhoneOtp: (
    phoneNumber: string,
    appVerifier: RecaptchaVerifier,
  ) => Promise<ConfirmationResult>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, name?: string) => Promise<void>;
  updateProfile: (values: Partial<ProfilePayload>) => Promise<{ error?: string }>;
  updatePassword: (password: string) => Promise<{ error?: string }>;
  sendPasswordReset: (email: string) => Promise<{ error?: string }>;
  confirmPasswordReset: (
    email: string,
    code: string,
    password: string,
  ) => Promise<{ error?: string }>;
};

type AuthSessionState = Pick<
  AuthContextValue,
  'user' | 'authenticated' | 'error' | 'loading' | 'profile' | 'auth' | 'subscription'
>;

type BackendAuthResponse = {
  success?: boolean;
  message?: string;
  type?: string;
  redirect?: string;
  access_token?: string | null;
  profile?: ProfilePayload;
  auth?: AuthInfo;
  subscription?: SubscriptionInfo;
  user?: {
    id?: number | string;
    name?: string | null;
    email?: string | null;
    phone?: string | null;
    firebase_uid?: string | null;
    is_active?: boolean;
  };
  company?: {
    name?: string | null;
    plan_type?: string | null;
    is_active?: boolean;
  };
  branch?: unknown;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const BACKEND_AUTH_STORAGE_KEY = 'saaszo.backend_auth_token';

const signedOutState = {
  user: null,
  authenticated: false,
  error: '',
  loading: false,
  profile: null,
  auth: null,
  subscription: null,
};

function getStoredBackendToken() {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage.getItem(BACKEND_AUTH_STORAGE_KEY);
}

function setStoredBackendToken(token: string) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(BACKEND_AUTH_STORAGE_KEY, token);
}

function clearStoredBackendToken() {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(BACKEND_AUTH_STORAGE_KEY);
}

function toTitleCase(value: string | null | undefined, fallback: string) {
  const normalized = value?.trim();

  if (!normalized) {
    return fallback;
  }

  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

function getErrorMessage(payload: any, fallback: string) {
  if (payload?.message && typeof payload.message === 'string') {
    return payload.message;
  }

  const firstError = payload?.errors
    ? Object.values(payload.errors)[0]
    : null;

  if (Array.isArray(firstError) && typeof firstError[0] === 'string') {
    return firstError[0];
  }

  return fallback;
}

function normalizeBackendSession(payload: BackendAuthResponse): Omit<AuthSessionState, 'user' | 'authenticated' | 'error' | 'loading'> {
  if (payload.profile && payload.auth && payload.subscription) {
    return {
      profile: payload.profile,
      auth: payload.auth,
      subscription: payload.subscription,
    };
  }

  const user = payload.user ?? {};
  const company = payload.company ?? {};

  return {
    profile: {
      id: String(user.id ?? ''),
      email: user.email ?? null,
      phone: user.phone ?? null,
      fullName: user.name ?? null,
      companyName: company.name ?? null,
      avatarUrl: null,
      profileCompleted: Boolean(
        (user.name ?? '').toString().trim() &&
          (company.name ?? '').toString().trim(),
      ),
    },
    auth: {
      kind: 'backend',
      email: user.email ?? null,
      phone: user.phone ?? null,
      providers: user.firebase_uid ? ['password', 'firebase'] : ['password'],
      primaryProvider: 'Password',
      canChangePassword: true,
    },
    subscription: {
      planName: toTitleCase(company.plan_type, 'Free'),
      status: company.is_active === false ? 'inactive' : 'active',
      billingCycle: 'monthly',
      seats: 1,
      currentPeriodEnd: null,
    },
  };
}

function navigateAfterAuth(router: ReturnType<typeof useRouter>, target?: string | null) {
  const destination = target?.trim() || '/dashboard';

  if (typeof window !== 'undefined' && /^https?:\/\//i.test(destination)) {
    const sameOrigin = destination.startsWith(window.location.origin);

    if (!sameOrigin) {
      window.location.assign(destination);
      return;
    }

    const url = new URL(destination);
    router.push(`${url.pathname}${url.search}${url.hash}`);
    return;
  }

  router.push(destination);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [state, setState] = useState<AuthSessionState>({
    ...signedOutState,
    loading: true,
  });
  const [backendToken, setBackendToken] = useState<string | null>(null);

  async function syncFirebaseUserSession(firebaseUser: FirebaseUser) {
    const token = await firebaseUser.getIdToken();
    const response = await fetch(`${API_BASE_URL}/auth/sync`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as
        | BackendAuthResponse
        | null;

      throw new Error(
        getErrorMessage(payload, 'Failed to sync profile with server.'),
      );
    }

    const data = (await response.json()) as BackendAuthResponse;

    setBackendToken(null);
    clearStoredBackendToken();
    setState({
      user: firebaseUser,
      authenticated: true,
      error: '',
      loading: false,
      profile: data.profile ?? null,
      auth: data.auth ?? null,
      subscription: data.subscription ?? null,
    });

    return data;
  }

  async function fetchBackendJson(
    path: string,
    init: RequestInit = {},
  ): Promise<BackendAuthResponse> {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...(init.headers ?? {}),
      },
    });

    const payload = (await response.json().catch(() => null)) as
      | BackendAuthResponse
      | null;

    if (!response.ok) {
      throw new Error(
        getErrorMessage(payload, 'The authentication server is currently unreachable.'),
      );
    }

    return payload ?? {};
  }

  async function hydrateBackendSession(token: string) {
    const payload = await fetchBackendJson('/auth/profile', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const session = normalizeBackendSession(payload);

    setBackendToken(token);
    setState({
      user: null,
      authenticated: true,
      error: '',
      loading: false,
      profile: session.profile,
      auth: session.auth,
      subscription: session.subscription,
    });
  }

  async function reloadUser() {
    if (auth?.currentUser) {
      await auth.currentUser.reload();
      await auth.currentUser.getIdToken(true);
      return;
    }

    const storedToken = backendToken ?? getStoredBackendToken();
    if (!storedToken) {
      return;
    }

    await hydrateBackendSession(storedToken);
  }

  useEffect(() => {
    let isMounted = true;

    async function hydrateStoredBackendToken() {
      const storedToken = getStoredBackendToken();

      if (!storedToken) {
        if (isMounted) {
          setBackendToken(null);
          setState(signedOutState);
        }
        return;
      }

      if (isMounted) {
        setState((current) => ({ ...current, loading: true, error: '' }));
      }

      try {
        await hydrateBackendSession(storedToken);
      } catch (error) {
        clearStoredBackendToken();

        if (isMounted) {
          setBackendToken(null);
          setState({
            ...signedOutState,
            error:
              error instanceof Error
                ? error.message
                : 'Authentication failed.',
          });
        }
      }
    }

    if (!auth) {
      void hydrateStoredBackendToken();
      return () => {
        isMounted = false;
      };
    }

    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      if (!isMounted) {
        return;
      }

      if (!user) {
        await hydrateStoredBackendToken();
        return;
      }

      setState((current) => ({ ...current, loading: true, error: '' }));

      try {
        await syncFirebaseUserSession(user);
      } catch (error) {
        if (isMounted) {
          setState({
            ...signedOutState,
            error:
              error instanceof Error
                ? error.message
                : 'Authentication failed.',
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
    if (!auth) {
      throw new Error('Firebase not initialized');
    }

    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    await syncFirebaseUserSession(result.user);
    navigateAfterAuth(router, '/dashboard');
  }

  function setupRecaptcha(
    containerId: string,
    options?: {
      size?: 'normal' | 'invisible';
      onSolved?: () => void | Promise<void>;
      onExpired?: () => void | Promise<void>;
    },
  ) {
    if (!auth) {
      throw new Error('Firebase not initialized');
    }

    return new RecaptchaVerifier(auth, containerId, {
      size: options?.size ?? 'normal',
      callback: () => {
        void options?.onSolved?.();
      },
      'expired-callback': () => {
        void options?.onExpired?.();
      },
    });
  }

  async function sendPhoneOtp(
    phoneNumber: string,
    appVerifier: RecaptchaVerifier,
  ) {
    if (!auth) {
      throw new Error('Firebase not initialized');
    }

    return await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
  }

  async function signInWithEmail(email: string, password: string) {
    const payload = await fetchBackendJson('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (!payload.success) {
      if (payload.redirect && ['NOT_REGISTERED', 'LOCKOUT', 'ACCOUNT_RECOVERY'].includes(payload.type ?? '')) {
        navigateAfterAuth(router, payload.redirect);
      }

      throw new Error(payload.message || 'Login failed.');
    }

    if (!payload.access_token) {
      throw new Error('Login succeeded but no API token was returned.');
    }

    setStoredBackendToken(payload.access_token);
    await hydrateBackendSession(payload.access_token);
    navigateAfterAuth(router, payload.redirect);
  }

  async function signUpWithEmail(email: string, password: string, name?: string) {
    const displayName = name?.trim() || email.split('@')[0] || 'SaaSzo User';
    const companyName = `${displayName} Workspace`;

    const payload = await fetchBackendJson('/auth/register-unified', {
      method: 'POST',
      body: JSON.stringify({
        company_name: companyName,
        name: displayName,
        email,
        password,
      }),
    });

    if (!payload.success) {
      throw new Error(payload.message || 'Could not create your account.');
    }

    if (!payload.access_token) {
      throw new Error('Account created but no API token was returned.');
    }

    setStoredBackendToken(payload.access_token);
    await hydrateBackendSession(payload.access_token);
    router.push('/dashboard');
  }

  async function updateProfile(values: Partial<ProfilePayload>) {
    try {
      const firebaseUser = auth?.currentUser;

      if (!firebaseUser) {
        return {
          error:
            'Profile editing for password accounts will be enabled from the backend settings module.',
        };
      }

      const token = await firebaseUser.getIdToken();
      const response = await fetch(`${API_BASE_URL}/profile/me`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const data = (await response.json()) as BackendAuthResponse;

      setState((current) => ({
        ...current,
        profile: data.profile ?? current.profile,
        auth: data.auth ?? current.auth,
        subscription: data.subscription ?? current.subscription,
      }));

      return { error: undefined };
    } catch (err: any) {
      return { error: err.message };
    }
  }

  async function updatePassword(password: string) {
    try {
      const firebaseUser = auth?.currentUser;

      if (!firebaseUser) {
        return {
          error:
            'Use the forgot password flow for email/password accounts until the backend password settings screen is connected.',
        };
      }

      await firebaseUpdatePassword(firebaseUser, password);
      return { error: undefined };
    } catch (err: any) {
      return { error: err.message };
    }
  }

  async function sendPasswordReset(email: string) {
    try {
      const payload = await fetchBackendJson('/auth/password/reset/send', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });

      if (!payload.success) {
        throw new Error(payload.message || 'Could not start password reset.');
      }

      return { error: undefined };
    } catch (err: any) {
      return { error: err.message };
    }
  }

  async function confirmPasswordReset(
    email: string,
    code: string,
    password: string,
  ) {
    try {
      const payload = await fetchBackendJson('/auth/password/reset/verify', {
        method: 'POST',
        body: JSON.stringify({
          email,
          otp: code,
          password,
        }),
      });

      if (!payload.success) {
        throw new Error(payload.message || 'Password reset failed.');
      }

      return { error: undefined };
    } catch (err: any) {
      return { error: err.message };
    }
  }

  async function signOut() {
    const token = backendToken ?? getStoredBackendToken();

    clearStoredBackendToken();
    setBackendToken(null);

    if (auth?.currentUser) {
      await firebaseSignOut(auth);
    }

    if (token) {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      }).catch(() => undefined);
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
