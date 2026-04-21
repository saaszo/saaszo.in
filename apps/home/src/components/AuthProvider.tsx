'use client';

import {
  createContext,
  startTransition,
  useContext,
  useEffect,
  useState,
} from 'react';
import { onAuthStateChanged, signOut as signOutFromFirebase } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth as firebaseAuth } from '@/lib/firebase';
import { API_BASE_URL } from '@/lib/app-config';
import { supabase } from '@/lib/supabase-browser';

type AuthPayload = {
  kind: 'supabase' | 'firebase';
  email: string | null;
  phone: string | null;
  providers: string[];
  primaryProvider: string;
  canChangePassword: boolean;
};

type ProfilePayload = {
  id: string;
  authUserId: string | null;
  firebaseUid: string | null;
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
        await hydrateProfile(supabaseToken);
        return;
      }

      if (firebaseAuth?.currentUser) {
        const firebaseToken = await firebaseAuth.currentUser.getIdToken();
        await hydrateProfile(firebaseToken);
        return;
      }

      if (isMounted) {
        setState(signedOutState);
      }
    }

    async function hydrateProfile(accessToken: string) {
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

    const firebaseUnsubscribe = firebaseAuth
      ? onAuthStateChanged(firebaseAuth, () => {
          void refreshAuthState();
        })
      : () => undefined;

    return () => {
      isMounted = false;
      supabaseSubscription.unsubscribe();
      firebaseUnsubscribe();
    };
  }, []);

  async function getActiveAccessToken() {
    const { data } = await supabase.auth.getSession();

    if (data.session?.access_token) {
      return data.session.access_token;
    }

    if (firebaseAuth?.currentUser) {
      return firebaseAuth.currentUser.getIdToken();
    }

    return null;
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
    await Promise.allSettled([
      supabase.auth.signOut(),
      firebaseAuth ? signOutFromFirebase(firebaseAuth) : Promise.resolve(),
    ]);

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
