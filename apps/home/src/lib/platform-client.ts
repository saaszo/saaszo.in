"use client";

import { getStoredBackendToken } from "@/components/AuthProvider";
import { requestJson } from "@/lib/auth-client";

// The platform console shares the current Home session, including email-only login.
async function authedRequest<T extends Record<string, unknown>>(path:string, init?:RequestInit) {
  const token=getStoredBackendToken();
  return requestJson<T>(path,{...init,headers:{...(init?.headers||{}),...(token?{Authorization:`Bearer ${token}`}:{})}});
}

export interface PlatformUser {
  id: number;
  name: string;
  email: string;
}

export interface PlatformWorkspace {
  id: number;
  name: string;
  role: string;
  is_primary: boolean;
  operations_ready?: boolean;
  business_type?: string;
  created_at?: string;
}

export interface PlatformProductModule {
  label: string;
  href: string;
}

export interface PlatformProduct {
  key: string;
  name: string;
  kind: string;
  admin_url: string;
  dashboard_url: string;
  status: string;
  available: boolean;
  access: {
    allowed: boolean;
    admin: boolean;
    reason: string | null;
  };
  modules: PlatformProductModule[];
}

export interface PlatformCapabilities {
  can_manage_workspace: boolean;
  can_manage_billing: boolean;
  can_manage_integrations: boolean;
}

export interface PlatformInvitation {
  id: number;
  workspace_name: string;
  role: string;
  expires_at: string;
}

export interface PlatformContext {
  development_access?: boolean;
  user: PlatformUser;
  active_workspace: PlatformWorkspace | null;
  workspaces: PlatformWorkspace[];
  products: PlatformProduct[];
  capabilities: PlatformCapabilities;
  pending_invitations: PlatformInvitation[];
  legacy_plan: {
    plan_type: string;
    display_name: string;
    billing_cycle: string;
  } | null;
}

export interface PlatformMember {
  id: number | null;
  user_id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  product_roles: Record<string, string>;
  revoked_at: string | null;
  created_at: string | null;
}

export interface PlatformPlanVersion {
  version_id: number;
  version: number;
  price_minor_units: number;
  formatted_price: string;
  currency: string;
  billing_cycle: string;
  features: string[];
  limits: Record<string, unknown>;
}

export interface PlatformCatalogueProduct {
  product_key: string;
  name: string;
  kind: string;
  status: string;
  available: boolean;
  description: string;
  pricing_status: "published" | "contact_sales";
  plans: Array<{
    plan_id: number;
    plan_code: string;
    name: string;
    description: string | null;
    version_id: number;
    version: number;
    price_minor_units: number;
    formatted_price: string;
    currency: string;
    billing_cycle: string;
    features: string[];
    limits: Record<string, unknown>;
  }>;
}

export interface PlatformSubscriptionItem {
  id: number;
  product_key: string;
  status: string;
  is_active: boolean;
  plan_name: string;
  plan_code: string;
  starts_at: string | null;
  expires_at: string | null;
  cancelled_at: string | null;
  entitlements: string[];
}

export interface PlatformRecommendation {
  product_key: string;
  name: string;
  reason: string;
  kind: string;
  dashboard_url: string;
}

export interface PlatformQuote {
  quote_id: string;
  product_key: string;
  plan_name: string;
  billing_cycle: string;
  subtotal_minor: number;
  tax_minor: number;
  total_minor: number;
  formatted_subtotal: string;
  formatted_tax: string;
  formatted_total: string;
  currency: string;
  status: string;
  expires_at: string;
}

export interface PlatformOrder {
  product_key?: string;
  plan_version_id?: number;
  plan_name?: string;
  billing_cycle?: string;
  order_id: string;
  provider: string;
  provider_order_id: string | null;
  checkout_allowed?: boolean;
  checkout_reason?: string | null;
  amount_minor: number;
  formatted_amount: string;
  currency: string;
  status: string;
  key_id: string;
  created_at: string;
}

export interface PlatformIntegrationsStatus {
  whatsapp: {
    provider: string;
    status: string;
    phone_number_id: string | null;
    ready?: boolean;
    senders?: Array<{id:number;sender_id:string;label:string}>;
    granted_consents: number;
    daily_limit: number;
    missing_setup_reasons: string[];
  };
  payments: {
    provider: string;
    purpose: string;
    status: string;
    key_id: string;
    currency: string;
    missing_setup_reasons: string[];
  };
}

export interface PlatformOutboxMessage {
  message_id: string;
  channel: string;
  recipient: string;
  status: string;
  purpose: string;
  attempts: number;
  created_at: string;
}

export interface PlatformApiCredentialItem {
  id: number;
  name: string;
  key_prefix: string;
  raw_api_key?: string;
  usage_today: number;
  revoked_at: string | null;
  last_used_at?: string | null;
  allowed_senders?: string[];
  allowed_purposes?: string[];
  scopes: string[];
  daily_usage_limit: number;
  created_at: string;
}

export async function fetchPlatformContext(workspaceId?: number, product?: string) {
  const params = new URLSearchParams();
  if (workspaceId !== undefined) params.set("workspace_id", String(workspaceId));
  if (product) params.set("product", product);

  const query = params.toString() ? `?${params.toString()}` : "";
  return authedRequest<{ success: boolean; data: PlatformContext }>(`/api/platform/v1/context${query}`);
}

export async function createWorkspace(data: { name: string; business_type?: string; contact_phone?: string }) {
  return authedRequest<{ success: boolean; data: PlatformWorkspace }>("/api/platform/v1/workspaces", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function fetchWorkspaceMembers(workspaceId: number) {
  return authedRequest<{ success: boolean; data: PlatformMember[] }>(`/api/platform/v1/workspaces/${workspaceId}/members`);
}

export async function inviteWorkspaceMember(
  workspaceId: number,
  data: {
    email: string;
    role: string;
    product_roles?: Record<string, string>;
    product_grants?: Array<{
      product_key: string;
      role: string;
      scope_type?: string;
      scope_ids?: number[];
    }>;
  }
) {
  return authedRequest<{ success: boolean; data: { id: number; email: string; role: string } }>(
    `/api/platform/v1/workspaces/${workspaceId}/invitations`,
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}

export async function acceptWorkspaceInvitation(invitationId: number, workspaceId?: number) {
  const url = workspaceId
    ? `/api/platform/v1/workspaces/${workspaceId}/invitations/${invitationId}/accept`
    : `/api/platform/v1/invitations/${invitationId}/accept`;

  return authedRequest<{ success: boolean; data: { membership_id: number; role: string } }>(url, {
    method: "POST",
  });
}

export async function performMemberAction(
  workspaceId: number,
  memberId: number,
  action: "change_role" | "revoke",
  role?: string
) {
  return authedRequest<{ success: boolean; data: { id: number; status?: string; role?: string } }>(
    `/api/platform/v1/workspaces/${workspaceId}/members/${memberId}/actions`,
    {
      method: "POST",
      body: JSON.stringify({ action, role }),
    }
  );
}

export async function fetchCatalogue(product?: string) {
  const query = product ? `?product=${encodeURIComponent(product)}` : "";
  return authedRequest<{ success: boolean; data: PlatformCatalogueProduct[] }>(`/api/platform/v1/catalogue${query}`);
}

export async function fetchWorkspaceSubscriptions(workspaceId: number) {
  return authedRequest<{ success: boolean; data: PlatformSubscriptionItem[] }>(
    `/api/platform/v1/workspaces/${workspaceId}/subscriptions`
  );
}

export async function fetchWorkspaceIntegrations(workspaceId: number) {
  return authedRequest<{ success: boolean; data: PlatformIntegrationsStatus }>(
    `/api/platform/v1/workspaces/${workspaceId}/integrations`
  );
}

export async function fetchRecommendations(workspaceId: number) {
  return authedRequest<{ success: boolean; data: PlatformRecommendation[] }>(
    `/api/platform/v1/workspaces/${workspaceId}/recommendations`
  );
}

export async function dismissRecommendation(workspaceId: number, productKey: string) {
  return authedRequest<{ success: boolean; message: string }>(
    `/api/platform/v1/workspaces/${workspaceId}/recommendations/${encodeURIComponent(productKey)}/dismiss`,
    {
      method: "POST",
    }
  );
}

export async function createCheckoutQuote(workspaceId: number, data: { product_key: string; plan_version_id: number }) {
  return authedRequest<{ success: boolean; data: PlatformQuote }>(
    `/api/platform/v1/workspaces/${workspaceId}/checkout/quote`,
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}

export async function createCheckoutOrder(
  workspaceId: number,
  data: { quote_id: string; provider?: string; idempotency_key: string }
) {
  return authedRequest<{ success: boolean; data: PlatformOrder }>(
    `/api/platform/v1/workspaces/${workspaceId}/checkout/orders`,
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}

export async function recordMessagingConsent(
  workspaceId: number,
  data: { recipient: string; channel?: string; purpose?: string; status?: string; evidence?: string }
) {
  return authedRequest<{ success: boolean; data: { id: number; recipient: string; status: string } }>(
    `/api/platform/v1/workspaces/${workspaceId}/messaging/consents`,
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}

export async function sendMessagingMessage(
  workspaceId: number,
  data: {
    recipient: string;
    channel?: string;
    sender_id?: string;
    template_name?: string;
    purpose: string;
    idempotency_key: string;
    payload?: Record<string, unknown>;
  }
) {
  return authedRequest<{ success: boolean; data: PlatformOutboxMessage }>(
    `/api/platform/v1/workspaces/${workspaceId}/messaging/messages`,
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}

export async function createApiCredential(
  workspaceId: number,
  data: { name: string; scopes?: string[]; daily_usage_limit?: number; allowed_senders?:string[]; allowed_purposes?:string[] }
) {
  return authedRequest<{ success: boolean; data: PlatformApiCredentialItem }>(
    `/api/platform/v1/workspaces/${workspaceId}/messaging/credentials`,
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}

export async function fetchApiCredentials(workspaceId: number) {
  return authedRequest<{ success: boolean; data: PlatformApiCredentialItem[] }>(
    `/api/platform/v1/workspaces/${workspaceId}/messaging/credentials`
  );
}

export async function revokeApiCredential(workspaceId: number, credentialId: number) {
  return authedRequest<{ success: boolean; data: { id: number; name: string; revoked: boolean } }>(
    `/api/platform/v1/workspaces/${workspaceId}/messaging/credentials/${credentialId}/revoke`,
    {
      method: "POST",
    }
  );
}

export async function rotateApiCredential(workspaceId: number, credentialId: number) {
  return authedRequest<{ success: boolean; data: PlatformApiCredentialItem }>(
    `/api/platform/v1/workspaces/${workspaceId}/messaging/credentials/${credentialId}/rotate`,
    {
      method: "POST",
    }
  );
}

export async function fetchCheckoutOrder(workspaceId:number,orderId:string) {
  return authedRequest<{success:boolean;data:PlatformOrder}>(`/api/platform/v1/workspaces/${workspaceId}/checkout/orders/${encodeURIComponent(orderId)}`);
}

export async function fetchPendingCheckout(workspace: number, product: string) {
  return authedRequest<{success:boolean;data:PlatformOrder|null}>(`/api/platform/v1/workspaces/${workspace}/checkout/pending?product=${encodeURIComponent(product)}`);
}
