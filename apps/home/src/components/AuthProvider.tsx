"use client";

import {
  createContext,
  startTransition,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/lib/app-config";
import { appConfig } from "@/lib/config";
import { auth } from "@/lib/firebase";
import {
  buildSearchParams,
  getCookieValue,
  meetsPasswordRequirements,
  toSafeAbsoluteUrl,
  toSafeAppPath,
  type SearchParamValue,
} from "@/lib/utils";
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
} from "firebase/auth";

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
  emailVerified?: boolean;
};

type SubscriptionInfo = {
  planName: string;
  status: string;
  billingCycle: string;
  seats: number;
  currentPeriodEnd: string | null;
};

export type SessionUserInfo = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  role: string | null;
  is_active: boolean;
  branch_id?: number | null;
  branch_scope?: "all" | "single" | null;
  tool_access?: string[];
};

type OnboardingInfo = {
  setup_completed?: boolean;
  setup_skipped?: boolean;
  current_step?: number | null;
};

export type BranchInfo = {
  id: number;
  name: string;
  branch_code: string | null;
  branch_type: string;
  business_name: string | null;
  admin_name: string | null;
  manager_id: number | null;
  location: string | null;
  state: string | null;
  city: string | null;
  town?: string | null;
  address?: string | null;
  email: string | null;
  phone: string | null;
  is_active: boolean;
  employee_count: number;
};

export type StaffMember = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  branch_id: number;
  branch_scope: "all" | "single";
  branch_name: string | null;
  employee_id: string | null;
  department: string | null;
  designation: string | null;
  salary: number;
  joining_date: string | null;
  work_type: string;
  notes?: string | null;
  is_active: boolean;
  tool_access: string[];
  permission_overrides: Record<string, boolean>;
  password?: string;
};

export type RoleTemplate = {
  name: string;
  description: string;
  tools: string[];
  branch_scope: "all" | "single";
  permissions: Record<string, boolean>;
};

export type PermissionGroup = {
  label: string;
  actions: Record<string, string>;
};

type StaffFilters = Record<string, SearchParamValue>;

type AuthContextValue = {
  user: FirebaseUser | null;
  authenticated: boolean;
  error: string;
  loading: boolean;
  workspaceUser: SessionUserInfo | null;
  profile: ProfilePayload | null;
  auth: AuthInfo | null;
  subscription: SubscriptionInfo | null;
  onboarding: OnboardingInfo | null;
  postAuthRedirect: string | null;
  setOnboardingState: (next: Partial<OnboardingInfo>) => void;
  reloadUser: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  setupRecaptcha: (
    containerId: string,
    options?: {
      size?: "normal" | "invisible";
      onSolved?: () => void | Promise<void>;
      onExpired?: () => void | Promise<void>;
    },
  ) => RecaptchaVerifier;
  sendPhoneOtp: (
    phoneNumber: string,
    appVerifier: RecaptchaVerifier,
  ) => Promise<ConfirmationResult>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (
    email: string,
    password: string,
    name?: string,
    companyName?: string,
  ) => Promise<void>;
  updateProfile: (
    values: Partial<ProfilePayload>,
  ) => Promise<{ error?: string }>;
  updatePassword: (password: string) => Promise<{ error?: string }>;
  sendPasswordReset: (email: string) => Promise<{ error?: string }>;
  confirmPasswordReset: (
    email: string,
    code: string,
    password: string,
  ) => Promise<{ error?: string }>;
  getHandoffToken: (
    tool: string,
  ) => Promise<{ redirectUrl?: string; error?: string }>;
  getBranches: () => Promise<BranchInfo[]>;
  saveBranch: (
    data: any,
  ) => Promise<{ success: boolean; message?: string; branch?: BranchInfo }>;
  deleteBranch: (id: number) => Promise<{ success: boolean; message?: string }>;
  getStaff: (filters?: StaffFilters) => Promise<StaffMember[]>;
  saveStaff: (
    data: any,
  ) => Promise<{ success: boolean; message?: string; staff?: StaffMember }>;
  deleteStaff: (id: number) => Promise<{ success: boolean; message?: string }>;
  getStaffTemplates: () => Promise<{
    roles: Record<string, RoleTemplate>;
    groups: Record<string, PermissionGroup>;
  }>;
  checkToolAccess: (
    tool: string,
  ) => Promise<{
    allowed: boolean;
    status: string;
    message?: string;
    redirectUrl?: string;
  }>;
};

type AuthSessionState = Pick<
  AuthContextValue,
  | "user"
  | "authenticated"
  | "error"
  | "loading"
  | "workspaceUser"
  | "profile"
  | "auth"
  | "subscription"
  | "onboarding"
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
  onboarding?: OnboardingInfo;
  user?: {
    id?: number | string;
    name?: string | null;
    email?: string | null;
    phone?: string | null;
    role?: string | null;
    firebase_uid?: string | null;
    is_active?: boolean;
    branch_id?: number | null;
    branch_scope?: "all" | "single" | null;
    tool_access?: string[] | null;
  };
  company?: {
    name?: string | null;
    plan_type?: string | null;
    is_active?: boolean;
  };
  branch?: unknown;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const BACKEND_AUTH_STORAGE_KEY = "saaszo.backend_auth_token";

const signedOutState = {
  user: null,
  authenticated: false,
  error: "",
  loading: false,
  workspaceUser: null,
  profile: null,
  auth: null,
  subscription: null,
  onboarding: null,
};

function getStoredBackendToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(BACKEND_AUTH_STORAGE_KEY);
}

function setStoredBackendToken(token: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(BACKEND_AUTH_STORAGE_KEY, token);
}

function clearStoredBackendToken() {
  if (typeof window === "undefined") {
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
  if (payload?.message && typeof payload.message === "string") {
    return payload.message;
  }

  const firstError = payload?.errors ? Object.values(payload.errors)[0] : null;

  if (Array.isArray(firstError) && typeof firstError[0] === "string") {
    return firstError[0];
  }

  return fallback;
}

function normalizeBackendSession(
  payload: BackendAuthResponse,
): Omit<AuthSessionState, "user" | "authenticated" | "error" | "loading"> {
  if (payload.profile && payload.auth && payload.subscription) {
    return {
      workspaceUser: {
        id: String(payload.user?.id ?? payload.profile.id ?? ""),
        name: payload.user?.name ?? payload.profile.fullName ?? null,
        email: payload.user?.email ?? payload.profile.email ?? null,
        phone: payload.user?.phone ?? payload.profile.phone ?? null,
        role: payload.user?.role ?? null,
        is_active: payload.user?.is_active ?? true,
        branch_id: payload.user?.branch_id ?? null,
        branch_scope: payload.user?.branch_scope ?? null,
        tool_access: payload.user?.tool_access ?? [],
      },
      profile: payload.profile,
      auth: payload.auth,
      subscription: payload.subscription,
      onboarding: payload.onboarding ?? null,
    };
  }

  const user = payload.user ?? {};
  const company = payload.company ?? {};

  return {
    workspaceUser: {
      id: String(user.id ?? ""),
      name: user.name ?? null,
      email: user.email ?? null,
      phone: user.phone ?? null,
      role: user.role ?? null,
      is_active: user.is_active ?? true,
      branch_id: user.branch_id ?? null,
      branch_scope: user.branch_scope ?? null,
      tool_access: user.tool_access ?? [],
    },
    profile: {
      id: String(user.id ?? ""),
      email: user.email ?? null,
      phone: user.phone ?? null,
      fullName: user.name ?? null,
      companyName: company.name ?? null,
      avatarUrl: null,
      profileCompleted: Boolean(
        (user.name ?? "").toString().trim() &&
          (company.name ?? "").toString().trim(),
      ),
    },
    auth: {
      kind: "backend",
      email: user.email ?? null,
      phone: user.phone ?? null,
      providers: user.firebase_uid ? ["password", "firebase"] : ["password"],
      primaryProvider: "Password",
      canChangePassword: true,
      emailVerified: Boolean(user.email),
    },
    subscription: {
      planName: toTitleCase(company.plan_type, "Free"),
      status: company.is_active === false ? "inactive" : "active",
      billingCycle: "monthly",
      seats: 1,
      currentPeriodEnd: null,
    },
    onboarding: payload.onboarding ?? null,
  };
}

function navigateAfterAuth(
  router: ReturnType<typeof useRouter>,
  target?: string | null,
) {
  const safePath = toSafeAppPath(target, appConfig.appUrl);
  const safeAbsoluteUrl = toSafeAbsoluteUrl(target, appConfig.appUrl);

  if (safeAbsoluteUrl) {
    try {
      const url = new URL(safeAbsoluteUrl);
      const appOrigin = new URL(appConfig.appUrl).origin;

      if (url.origin !== appOrigin) {
        window.location.assign(safeAbsoluteUrl);
        return;
      }
    } catch {
      router.push("/dashboard");
      return;
    }
  }

  router.push(safePath);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [state, setState] = useState<AuthSessionState>({
    ...signedOutState,
    loading: true,
  });
  const [backendToken, setBackendToken] = useState<string | null>(null);
  const [postAuthRedirect, setPostAuthRedirect] = useState<string | null>(null);

  async function refreshBackendTokenFromSession() {
    const response = await fetchWithCsrf(`${API_BASE_URL}/auth/bridge-token`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json().catch(() => null)) as {
      access_token?: string | null;
    } | null;

    const token = payload?.access_token ?? null;

    if (token) {
      setBackendToken(token);
      setStoredBackendToken(token);
    }

    return token;
  }

  async function syncFirebaseUserSession(firebaseUser: FirebaseUser) {
    const token = await firebaseUser.getIdToken();
    const response = await fetchWithCsrf(`${API_BASE_URL}/auth/sync`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const payload = (await response
        .json()
        .catch(() => null)) as BackendAuthResponse | null;

      throw new Error(
        getErrorMessage(payload, "Failed to sync profile with server."),
      );
    }

    const data = (await response.json()) as BackendAuthResponse & {
      access_token?: string;
    };
    setPostAuthRedirect(data.redirect ?? "/dashboard");

    // ✅ CRITICAL: Store the Sanctum token returned by /auth/sync.
    // Without this, Firebase-authenticated users have no backend token,
    // which causes getHandoffToken → product-token API to fail (401),
    // preventing SSO redirect to invoice.saaszo.in and other subdomain apps.
    const sanctumToken = data.access_token ?? null;
    if (sanctumToken) {
      setBackendToken(sanctumToken);
      setStoredBackendToken(sanctumToken);
    } else {
      setBackendToken(null);
      clearStoredBackendToken();
    }

    setState({
      user: firebaseUser,
      authenticated: true,
      error: "",
      loading: false,
      workspaceUser: data.user
        ? {
            id: String(data.user.id ?? ""),
            name: data.user.name ?? null,
            email: data.user.email ?? null,
            phone: data.user.phone ?? null,
            role: data.user.role ?? null,
            is_active: data.user.is_active ?? true,
            branch_id: data.user.branch_id ?? null,
            branch_scope: data.user.branch_scope ?? null,
            tool_access: data.user.tool_access ?? [],
          }
        : null,
      profile: data.profile ?? null,
      auth: data.auth ?? null,
      subscription: data.subscription ?? null,
      onboarding: data.onboarding ?? null,
    });

    return data;
  }

  async function hydrateCookieSession() {
    const payload = await fetchBackendJson("/auth/profile", {
      method: "GET",
    });

    const session = normalizeBackendSession(payload);
    setPostAuthRedirect(payload.redirect ?? "/dashboard");

    setState({
      user: null,
      authenticated: true,
      error: "",
      loading: false,
      workspaceUser: session.workspaceUser,
      profile: session.profile,
      auth: session.auth,
      subscription: session.subscription,
      onboarding: session.onboarding,
    });

    try {
      await refreshBackendTokenFromSession();
    } catch {
      setBackendToken(null);
      clearStoredBackendToken();
    }
  }

  async function fetchWithCsrf(url: string, init: RequestInit = {}) {
    const isMutation = !["GET", "HEAD", "OPTIONS"].includes(
      init.method?.toUpperCase() || "GET",
    );

    if (isMutation && !getCookieValue("XSRF-TOKEN")) {
      await fetch(`${API_BASE_URL.replace("/api", "")}/sanctum/csrf-cookie`, {
        method: "GET",
        credentials: "include",
      }).catch(() => null);
    }

    const headers: Record<string, string> = {
      ...((init.headers as Record<string, string>) ?? {}),
    };

    const xsrfToken = getCookieValue("XSRF-TOKEN");
    if (xsrfToken && isMutation) {
      headers["X-XSRF-TOKEN"] = xsrfToken;
    }

    return fetch(url, {
      ...init,
      headers,
      credentials: "include",
    });
  }

  async function fetchBackendJson(
    path: string,
    init: RequestInit = {},
  ): Promise<BackendAuthResponse> {
    const resolveAuthorizationHeader = async () => {
      let authorizationHeader =
        (init.headers as Record<string, string> | undefined)?.Authorization ??
        (init.headers as Record<string, string> | undefined)?.authorization;

      if (authorizationHeader) {
        return authorizationHeader;
      }

      const sanctumToken = backendToken ?? getStoredBackendToken();
      if (sanctumToken) {
        return `Bearer ${sanctumToken}`;
      }

      if (auth?.currentUser) {
        try {
          const firebaseToken = await auth.currentUser.getIdToken();
          if (firebaseToken) {
            return `Bearer ${firebaseToken}`;
          }
        } catch {
          return undefined;
        }
      }

      return undefined;
    };

    const performRequest = async (authorizationHeader?: string) => {
      const headers: Record<string, string> = {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...((init.headers as Record<string, string>) ?? {}),
        ...(authorizationHeader ? { Authorization: authorizationHeader } : {}),
      };

      const response = await fetchWithCsrf(`${API_BASE_URL}${path}`, {
        ...init,
        headers,
      });

      const payload = (await response
        .json()
        .catch(() => null)) as BackendAuthResponse | null;

      return { response, payload };
    };

    let authorizationHeader = await resolveAuthorizationHeader();
    let { response, payload } = await performRequest(authorizationHeader);

    if (response.status === 401) {
      let recovered = false;

      if (auth?.currentUser) {
        try {
          await syncFirebaseUserSession(auth.currentUser);
          authorizationHeader = await resolveAuthorizationHeader();
          ({ response, payload } = await performRequest(authorizationHeader));
          recovered = response.ok;
        } catch {
          recovered = false;
        }
      }

      if (!recovered) {
        try {
          const sessionToken = await refreshBackendTokenFromSession();
          if (sessionToken) {
            ({ response, payload } = await performRequest(
              `Bearer ${sessionToken}`,
            ));
          }
        } catch {
          // noop; let the final error surface below
        }
      }
    }

    if (!response.ok) {
      if (response.status === 401) {
        clearStoredBackendToken();
        setBackendToken(null);
      }

      throw new Error(
        getErrorMessage(
          payload,
          "The authentication server is currently unreachable.",
        ),
      );
    }

    return payload ?? {};
  }

  async function hydrateBackendSession(token: string) {
    const payload = await fetchBackendJson("/auth/profile", {
      method: "GET",
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : undefined,
    });

    const session = normalizeBackendSession(payload);
    setPostAuthRedirect(payload.redirect ?? "/dashboard");

    setBackendToken(token);
    setState({
      user: null,
      authenticated: true,
      error: "",
      loading: false,
      workspaceUser: session.workspaceUser,
      profile: session.profile,
      auth: session.auth,
      subscription: session.subscription,
      onboarding: session.onboarding,
    });
  }

  async function reloadUser() {
    if (auth?.currentUser) {
      await auth.currentUser.reload();
      await auth.currentUser.getIdToken(true);
      await syncFirebaseUserSession(auth.currentUser);
      return;
    }

    const storedToken = backendToken ?? getStoredBackendToken();
    if (!storedToken) {
      await hydrateCookieSession();
      return;
    }

    await hydrateBackendSession(storedToken);
  }

  function setOnboardingState(next: Partial<OnboardingInfo>) {
    setState((current) => ({
      ...current,
      onboarding: {
        ...(current.onboarding ?? {}),
        ...next,
      },
    }));
  }

  useEffect(() => {
    let isMounted = true;

    async function hydrateStoredBackendToken() {
      const storedToken = getStoredBackendToken();

      if (!storedToken) {
        try {
          await hydrateCookieSession();
          if (isMounted) {
            setBackendToken(null);
          }
          return;
        } catch {
          if (isMounted) {
            setBackendToken(null);
            setState(signedOutState);
          }
          return;
        }
      }

      if (isMounted) {
        setState((current) => ({ ...current, loading: true, error: "" }));
      }

      try {
        await hydrateBackendSession(storedToken);
      } catch (error) {
        clearStoredBackendToken();

        try {
          await hydrateCookieSession();
          if (isMounted) {
            setBackendToken(null);
          }
        } catch {
          if (isMounted) {
            setBackendToken(null);
            setState({
              ...signedOutState,
              error:
                error instanceof Error
                  ? error.message
                  : "Authentication failed.",
            });
          }
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

      setState((current) => ({ ...current, loading: true, error: "" }));

      try {
        await syncFirebaseUserSession(user);
      } catch (error) {
        if (isMounted) {
          setState({
            ...signedOutState,
            error:
              error instanceof Error ? error.message : "Authentication failed.",
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
      throw new Error("Firebase not initialized");
    }

    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const data = await syncFirebaseUserSession(result.user);
    navigateAfterAuth(router, data.redirect ?? "/dashboard");
  }

  function setupRecaptcha(
    containerId: string,
    options?: {
      size?: "normal" | "invisible";
      onSolved?: () => void | Promise<void>;
      onExpired?: () => void | Promise<void>;
    },
  ) {
    if (!auth) {
      throw new Error("Firebase not initialized");
    }

    return new RecaptchaVerifier(auth, containerId, {
      size: options?.size ?? "normal",
      callback: () => {
        void options?.onSolved?.();
      },
      "expired-callback": () => {
        void options?.onExpired?.();
      },
    });
  }

  async function sendPhoneOtp(
    phoneNumber: string,
    appVerifier: RecaptchaVerifier,
  ) {
    if (!auth) {
      throw new Error("Firebase not initialized");
    }

    return await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
  }

  async function signInWithEmail(email: string, password: string) {
    // 1. Check if identifier exists first
    const checkResponse = await fetchWithCsrf(
      `${API_BASE_URL}/auth/check-identifier`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: email }),
      },
    );

    if (checkResponse.ok) {
      const checkData = await checkResponse.json();
      if (checkData.success && !checkData.exists) {
        navigateAfterAuth(
          router,
          `/register?email=${encodeURIComponent(email)}`,
        );
        throw new Error("Not registered. Redirecting to signup...");
      }
    }

    // 2. Perform Login
    const payload = await fetchBackendJson("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (!payload.success) {
      if (
        payload.redirect &&
        ["NOT_REGISTERED", "LOCKOUT", "ACCOUNT_RECOVERY"].includes(
          payload.type ?? "",
        )
      ) {
        navigateAfterAuth(router, payload.redirect);
      }

      throw new Error(payload.message || "Login failed.");
    }

    // Backend wraps token inside a 'data' object: { success, message, data: { access_token, redirect } }
    const loginData = (payload as any).data ?? payload;
    const accessToken = loginData.access_token;
    const redirectUrl = loginData.redirect ?? payload.redirect;

    if (accessToken) {
      setStoredBackendToken(accessToken);
      await hydrateBackendSession(accessToken);
    } else {
      await hydrateCookieSession();
    }
    navigateAfterAuth(router, redirectUrl);
  }

  async function signUpWithEmail(
    email: string,
    password: string,
    name?: string,
    companyName?: string,
  ) {
    // 1. Check if identifier already exists
    const checkResponse = await fetchWithCsrf(
      `${API_BASE_URL}/auth/check-identifier`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: email }),
      },
    );

    if (checkResponse.ok) {
      const checkData = await checkResponse.json();
      if (checkData.success && checkData.exists) {
        navigateAfterAuth(router, `/auth?email=${encodeURIComponent(email)}`);
        throw new Error("Account already exists. Redirecting to login...");
      }
    }

    // 2. Perform Signup only after verification-gated backend path
    const displayName = name?.trim() || email.split("@")[0] || "SaaSzo User";
    const normalizedCompanyName = companyName?.trim() || "SaaSzo Workspace";

    const payload = await fetchBackendJson("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        business_name: normalizedCompanyName,
        name: displayName,
        email,
        password,
        password_confirmation: password,
        email_verified_via: "otp",
      }),
    });

    if (!payload.success) {
      throw new Error(payload.message || "Could not create your account.");
    }

    // Backend wraps token inside a 'data' object: { success, message, data: { access_token } }
    const signupData = (payload as any).data ?? payload;
    const accessToken = signupData.access_token;

    if (accessToken) {
      setStoredBackendToken(accessToken);
      await hydrateBackendSession(accessToken);
    } else {
      await hydrateCookieSession();
    }
    router.push("/dashboard/setup");
  }

  async function updateProfile(values: Partial<ProfilePayload>) {
    try {
      const firebaseUser = auth?.currentUser;

      if (!firebaseUser) {
        return {
          error:
            "Profile editing for password accounts will be enabled from the backend settings module.",
        };
      }

      const token = await firebaseUser.getIdToken();
      const response = await fetchWithCsrf(`${API_BASE_URL}/profile/me`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const data = (await response.json()) as BackendAuthResponse;

      setState((current) => ({
        ...current,
        workspaceUser: data.user
          ? {
              id: String(data.user.id ?? current.workspaceUser?.id ?? ""),
              name: data.user.name ?? current.workspaceUser?.name ?? null,
              email: data.user.email ?? current.workspaceUser?.email ?? null,
              phone: data.user.phone ?? current.workspaceUser?.phone ?? null,
              role: data.user.role ?? current.workspaceUser?.role ?? null,
              is_active:
                data.user.is_active ?? current.workspaceUser?.is_active ?? true,
              branch_id:
                data.user.branch_id ?? current.workspaceUser?.branch_id ?? null,
              branch_scope:
                data.user.branch_scope ??
                current.workspaceUser?.branch_scope ??
                null,
              tool_access:
                data.user.tool_access ??
                current.workspaceUser?.tool_access ??
                [],
            }
          : current.workspaceUser,
        profile: data.profile ?? current.profile,
        auth: data.auth ?? current.auth,
        subscription: data.subscription ?? current.subscription,
        onboarding: data.onboarding ?? current.onboarding,
      }));

      return { error: undefined };
    } catch (err: any) {
      return { error: err.message };
    }
  }

  async function updatePassword(password: string) {
    try {
      if (!meetsPasswordRequirements(password)) {
        return {
          error:
            "Password must be at least 8 characters and include uppercase, lowercase, number, and special character.",
        };
      }

      const firebaseUser = auth?.currentUser;

      if (!firebaseUser) {
        return {
          error:
            "Use the forgot password flow for email/password accounts until the backend password settings screen is connected.",
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
      const payload = await fetchBackendJson("/auth/password/reset/send", {
        method: "POST",
        body: JSON.stringify({ email }),
      });

      if (!payload.success) {
        throw new Error(payload.message || "Could not start password reset.");
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
      const payload = await fetchBackendJson("/auth/password/reset/verify", {
        method: "POST",
        body: JSON.stringify({
          email,
          otp: code,
          password,
        }),
      });

      if (!payload.success) {
        throw new Error(payload.message || "Password reset failed.");
      }

      return { error: undefined };
    } catch (err: any) {
      return { error: err.message };
    }
  }

  async function getHandoffToken(
    tool: string,
  ): Promise<{ redirectUrl?: string; error?: string }> {
    try {
      // Primary: use Sanctum backend token (set after login or Firebase sync)
      let bearerToken = backendToken ?? getStoredBackendToken();

      if (!bearerToken && auth?.currentUser) {
        bearerToken = await auth.currentUser.getIdToken();
      }

      const response = await fetchWithCsrf(
        `${API_BASE_URL}/auth/product-token`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            ...(bearerToken ? { Authorization: `Bearer ${bearerToken}` } : {}),
          },
          body: JSON.stringify({ tool }),
        },
      );

      const payload = (await response.json().catch(() => null)) as any;

      if (!response.ok || !payload?.success) {
        throw new Error(
          payload?.message || "Could not generate product access token.",
        );
      }

      return { redirectUrl: payload.redirect_url as string };
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
      await fetchWithCsrf(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }).catch(() => undefined);
    }

    setState(signedOutState);
    startTransition(() => {
      router.push("/auth");
    });
  }

  async function getBranches(): Promise<BranchInfo[]> {
    try {
      const payload = await fetchBackendJson("/auth/workspace/branches");
      return ((payload as any).data || []) as BranchInfo[];
    } catch (err) {
      console.error("getBranches error:", err);
      return [];
    }
  }

  async function saveBranch(
    data: any,
  ): Promise<{ success: boolean; message?: string; branch?: BranchInfo }> {
    try {
      const isUpdate = !!data.id;
      const path = isUpdate
        ? `/auth/workspace/branches/${data.id}`
        : "/auth/workspace/branches";
      const method = isUpdate ? "PUT" : "POST";

      const payload = await fetchBackendJson(path, {
        method,
        body: JSON.stringify(data),
      });

      return {
        success: !!payload.success,
        message: payload.message,
        branch: (payload as any).data as BranchInfo | undefined,
      };
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  }

  async function deleteBranch(
    id: number,
  ): Promise<{ success: boolean; message?: string }> {
    try {
      const payload = await fetchBackendJson(`/auth/workspace/branches/${id}`, {
        method: "DELETE",
      });
      return { success: !!payload.success, message: payload.message };
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  }

  async function getStaff(filters?: StaffFilters): Promise<StaffMember[]> {
    try {
      const query = buildSearchParams(filters);
      const path = query
        ? `/auth/workspace/staff?${query}`
        : "/auth/workspace/staff";
      const payload = await fetchBackendJson(path);
      return ((payload as any).data || []) as StaffMember[];
    } catch (err) {
      console.error("getStaff error:", err);
      return [];
    }
  }

  async function saveStaff(
    data: any,
  ): Promise<{ success: boolean; message?: string; staff?: StaffMember }> {
    try {
      const isUpdate = !!data.id;
      const path = isUpdate
        ? `/auth/workspace/staff/${data.id}`
        : "/auth/workspace/staff";
      const method = isUpdate ? "PUT" : "POST";

      const payload = await fetchBackendJson(path, {
        method,
        body: JSON.stringify(data),
      });

      return {
        success: !!payload.success,
        message: payload.message,
        staff: (payload as any).data as StaffMember | undefined,
      };
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  }

  async function deleteStaff(
    id: number,
  ): Promise<{ success: boolean; message?: string }> {
    try {
      const payload = await fetchBackendJson(`/auth/workspace/staff/${id}`, {
        method: "DELETE",
      });
      return { success: !!payload.success, message: payload.message };
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  }

  async function getStaffTemplates() {
    try {
      const res = await fetchBackendJson("/auth/workspace/staff/templates");
      return (res as any).data || { roles: {}, groups: {} };
    } catch (err) {
      console.error("getStaffTemplates error:", err);
      return { roles: {}, groups: {} };
    }
  }

  async function checkToolAccess(tool: string) {
    try {
      const payload = await fetchBackendJson("/tools/check-access", {
        method: "POST",
        body: JSON.stringify({ tool }),
      });

      return {
        allowed: Boolean((payload as any).allowed),
        status: String((payload as any).status || "unknown"),
        message: payload.message,
        redirectUrl: (payload as any).redirect_url,
      };
    } catch (err: any) {
      return {
        allowed: false,
        status: "error",
        message: err.message || "Could not verify tool access.",
      };
    }
  }

  const contextValue: AuthContextValue = {
    ...state,
    postAuthRedirect,
    setOnboardingState,
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
    getHandoffToken,
    getBranches,
    saveBranch,
    deleteBranch,
    getStaff,
    saveStaff,
    deleteStaff,
    getStaffTemplates,
    checkToolAccess,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export function useAuthSession() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthSession must be used inside AuthProvider.");
  }

  return context;
}
