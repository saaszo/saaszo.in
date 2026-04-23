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
import {
  clearPhoneSessionToken,
  getPhoneSessionToken,
  PHONE_SESSION_EVENT,
  PHONE_SESSION_STORAGE_KEY,
} from '@/lib/auth-utils';
import { supabase } from '@/lib/supabase-browser';

type AuthPayload = {
  kind: 'supabase' | 'phone';
  email: string | null;
  phone: string | null;
  providers: string[];
  primaryProvider: string;
  canChangePassword: boolean;
};

type ProfilePayload = {
  id: string;
  authUserId: string | null;
  phoneAuthUid: string | null;
  email: string | null;
  phone: string | null;
  fullName: string | null;
  companyName: string | null;
  avatarUrl: string | null;
  authProvider: string;
  profileCompleted: boolean;
  createdAt: string;
  updatedAt: string;
};

type SubscriptionPayload = {
  id: string;
  profileId: string;
  planCode: string;
  planName: string;
  status: string;
  billingCycle: string;
  seats: number;
  currentPeriodEnd: string | null;
  createdAt: string;
  updatedAt: string;
};

type ProfileApiResponse = {
  success: boolean;
  auth: AuthPayload;
  profile: ProfilePayload;
  subscription: SubscriptionPayload;
};

type UpdateProfileInput = {
  fullName?: string;
  companyName?: string;
  phone?: string;
  avatarUrl?: string;
};

type AuthContextValue = {
  auth: AuthPayload | null;
  authenticated: boolean;
  error: string;
  loading: boolean;
  profile: ProfilePayload | null;
  refreshProfile: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  subscription: SubscriptionPayload | null;
  updatePassword: (newPassword: string) => Promise<{ error?: string }>;
  updateProfile: (
    values: UpdateProfileInput,
  ) => Promise<{ error?: string }>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const signedOutState = {
  auth: null,
  authenticated: false,
  error: '',
  loading: false,
  profile: null,
  subscription: null,
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [state, setState] = useState<
    Omit<AuthContextValue, 'refreshProfile' | 'signInWithGoogle' | 'signOut' | 'updatePassword' | 'updateProfile'>
  >({
    ...signedOutState,
    loading: true,
  });

  useEffect(() => {
    let isMounted = true;

    async function refreshAuthState() {
      if (!isMounted) {
        return;
      }

      setState((current) => ({
        ...current,
        loading: true,
        error: '',
      }));

      const { data } = await supabase.auth.getSession();
      const supabaseToken = data.session?.access_token ?? null;

      if (supabaseToken) {
        await hydrateProfile(supabaseToken, 'supabase');
        return;
      }

      const phoneSessionToken = getPhoneSessionToken();

      if (phoneSessionToken) {
        await hydrateProfile(phoneSessionToken, 'phone');
        return;
      }

      if (isMounted) {
        setState(signedOutState);
      }
    }

    async function hydrateProfile(
      accessToken: string,
      source: 'supabase' | 'phone',
    ) {
      try {
        const response = await fetch(`${API_BASE_URL}/profile/me`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          cache: 'no-store',
        });

        const data = (await response.json().catch(() => null)) as
          | ProfileApiResponse
          | { message?: string }
          | null;

        if (!response.ok || !data || !('profile' in data)) {
          throw new Error(
            data && 'message' in data && typeof data.message === 'string'
              ? data.message
              : 'Could not load your workspace profile.',
          );
        }

        if (isMounted) {
          setState({
            auth: data.auth,
            authenticated: true,
            error: '',
            loading: false,
            profile: data.profile,
            subscription: data.subscription,
          });
        }
      } catch (error) {
        if (source === 'phone') {
          clearPhoneSessionToken();
        }

        if (isMounted) {
          setState({
            ...signedOutState,
            error:
              error instanceof Error
                ? error.message
                : 'Could not load your workspace profile.',
          });
        }
      }
    }

    void refreshAuthState();

    const {
      data: { subscription: supabaseSubscription },
    } = supabase.auth.onAuthStateChange(() => {
      void refreshAuthState();
    });
    const handlePhoneSessionChanged = () => {
      void refreshAuthState();
    };
    const handleStorage = (event: StorageEvent) => {
      if (event.key === PHONE_SESSION_STORAGE_KEY) {
        void refreshAuthState();
      }
    };

    window.addEventListener(PHONE_SESSION_EVENT, handlePhoneSessionChanged);
    window.addEventListener('storage', handleStorage);

    return () => {
      isMounted = false;
      supabaseSubscription.unsubscribe();
      window.removeEventListener(PHONE_SESSION_EVENT, handlePhoneSessionChanged);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  async function getActiveAccessToken() {
    const { data } = await supabase.auth.getSession();

    if (data.session?.access_token) {
      return data.session.access_token;
    }

    return getPhoneSessionToken();
  }

  async function refreshProfile() {
    const accessToken = await getActiveAccessToken();

    if (!accessToken) {
      setState(signedOutState);
      return;
    }

    setState((current) => ({
      ...current,
      loading: true,
    }));

    try {
      const response = await fetch(`${API_BASE_URL}/profile/me`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        cache: 'no-store',
      });

      const data = (await response.json().catch(() => null)) as
        | ProfileApiResponse
        | { message?: string }
        | null;

      if (!response.ok || !data || !('profile' in data)) {
        throw new Error(
          data && 'message' in data && typeof data.message === 'string'
            ? data.message
            : 'Could not refresh your profile.',
        );
      }

      setState({
        auth: data.auth,
        authenticated: true,
        error: '',
        loading: false,
        profile: data.profile,
        subscription: data.subscription,
      });
    } catch (error) {
      setState((current) => ({
        ...current,
        error:
          error instanceof Error
            ? error.message
            : 'Could not refresh your profile.',
        loading: false,
      }));
    }
  }

  async function signInWithGoogle() {
    const redirectTo = `${window.location.origin}/auth/callback?next=/dashboard`;
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
      },
    });

    if (error) {
      throw error;
    }

    if (data.url) {
      window.location.assign(data.url);
    }
  }

  async function signOut() {
    const phoneSessionToken = getPhoneSessionToken();

    await Promise.allSettled([
      supabase.auth.signOut(),
      phoneSessionToken
        ? fetch(`${API_BASE_URL}/auth/logout`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${phoneSessionToken}`,
            },
          })
        : Promise.resolve(),
    ]);

    clearPhoneSessionToken();

    setState(signedOutState);
    startTransition(() => {
      router.push('/auth');
    });
  }

  async function updateProfile(values: UpdateProfileInput) {
    const accessToken = await getActiveAccessToken();

    if (!accessToken) {
      return { error: 'You need to sign in again.' };
    }

    const response = await fetch(`${API_BASE_URL}/profile/me`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    });

    const data = (await response.json().catch(() => null)) as
      | ProfileApiResponse
      | { message?: string }
      | null;

    if (!response.ok || !data || !('profile' in data)) {
      return {
        error:
          data && 'message' in data && typeof data.message === 'string'
            ? data.message
            : 'Profile update failed.',
      };
    }

    setState({
      auth: data.auth,
      authenticated: true,
      error: '',
      loading: false,
      profile: data.profile,
      subscription: data.subscription,
    });

    return {};
  }

  async function updatePassword(newPassword: string) {
    if (!state.auth?.canChangePassword) {
      return { error: 'Password changes are only available for email sign-in.' };
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      return { error: error.message };
    }

    return {};
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        refreshProfile,
        signInWithGoogle,
        signOut,
        updatePassword,
        updateProfile,
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
