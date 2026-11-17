"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { openPlatformCheckout } from "@/lib/platform-checkout";
import { PlatformRequestScope } from "@/lib/platform-request-scope.mjs";
import { useAuthSession } from "@/components/AuthProvider";
import {
  acceptWorkspaceInvitation,
  createApiCredential,
  createCheckoutOrder,
  createCheckoutQuote,
  createWorkspace,
  dismissRecommendation,
  fetchCatalogue,
  fetchCheckoutOrder,
  fetchPlatformContext,
  fetchRecommendations,
  fetchWorkspaceIntegrations,
  fetchWorkspaceMembers,
  fetchWorkspaceSubscriptions,
  fetchApiCredentials,
  revokeApiCredential,
  rotateApiCredential,
  inviteWorkspaceMember,
  performMemberAction,
  PlatformApiCredentialItem,
  PlatformCatalogueProduct,
  PlatformContext,
  PlatformIntegrationsStatus,
  PlatformMember,
  PlatformOrder,
  PlatformQuote,
  PlatformRecommendation,
  PlatformSubscriptionItem,
  recordMessagingConsent,
  sendMessagingMessage,
} from "@/lib/platform-client";

type ConsoleTab = "workspaces" | "products" | "team" | "billing" | "integrations";

export function PlatformConsole() {
  const { authenticated, loading: authLoading, getHandoffToken, workspaceUser } = useAuthSession();

  const [activeTab, setActiveTab] = useState<ConsoleTab>("products");
  const [context, setContext] = useState<PlatformContext | null>(null);
  const [loadingContext, setLoadingContext] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Tab data states
  const [members, setMembers] = useState<PlatformMember[]>([]);
  const [catalogue, setCatalogue] = useState<PlatformCatalogueProduct[]>([]);
  const [subscriptions, setSubscriptions] = useState<PlatformSubscriptionItem[]>([]);
  const [recommendations, setRecommendations] = useState<PlatformRecommendation[]>([]);
  const [integrationsStatus, setIntegrationsStatus] = useState<PlatformIntegrationsStatus | null>(null);

  // Modal / Form states
  const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState("");
  const [newWorkspaceType, setNewWorkspaceType] = useState("retail");
  const [newWorkspacePhone, setNewWorkspacePhone] = useState("");

  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("member");

  // Checkout states
  const [selectedProductForQuote, setSelectedProductForQuote] = useState<string | null>(null);
  const [activeQuote, setActiveQuote] = useState<PlatformQuote | null>(null);
  const [createdOrder, setCreatedOrder] = useState<PlatformOrder | null>(null);

  // Messaging states
  const [consentRecipient, setConsentRecipient] = useState("");
  const [consentEvidence, setConsentEvidence] = useState("");
  const [consentPurpose, setConsentPurpose] = useState("transactional");
  const [outboxRecipient, setOutboxRecipient] = useState("");
  const [outboxPurpose, setOutboxPurpose] = useState("transactional");
  const [outboxTemplate, setOutboxTemplate] = useState("");
  const [outboxResult, setOutboxResult] = useState<string | null>(null);
  const [apiKeyName, setApiKeyName] = useState("");
  const [apiSenders, setApiSenders] = useState<string[]>([]);
  const [apiPurposes, setApiPurposes] = useState<string[]>([]);
  const [outboxSender, setOutboxSender] = useState("");
  const [newApiKey, setNewApiKey] = useState<string | null>(null);
  const [credentials, setCredentials] = useState<PlatformApiCredentialItem[]>([]);

  const sessionIdentity = workspaceUser?.id ?? null;
  const identityRef = useRef(`${authenticated}:${sessionIdentity}`);
  identityRef.current = `${authenticated}:${sessionIdentity}`;
  const requestScope = useRef(new PlatformRequestScope(() => identityRef.current)).current;
  const authenticatedRef = useRef(authenticated);
  authenticatedRef.current = authenticated;
  const currentContext = useRef<PlatformContext | null>(null);
  const [isMutating, setIsMutating] = useState(false);
  const checkoutKeys = useRef(new Map<string, string>());

  const clearTransient = useCallback(() => {
    setMembers([]); setCatalogue([]); setSubscriptions([]); setRecommendations([]);
    setIntegrationsStatus(null); setCredentials([]); setActiveQuote(null); setCreatedOrder(null);
    setNewApiKey(null); setOutboxResult(null); setSelectedProductForQuote(null);
    setInviteEmail(""); setConsentRecipient(""); setOutboxRecipient(""); setConsentEvidence("");
    checkoutKeys.current.clear(); setIsMutating(false); setSuccessMessage(null); setErrorMessage(null);
    setIsCreatingWorkspace(false); setNewWorkspaceName(""); setNewWorkspacePhone(""); setOutboxTemplate(""); setInviteRole("member"); setApiKeyName(""); setApiSenders([]); setApiPurposes([]); setOutboxSender("");
  }, []);

  const invalidateContext = useCallback(() => {
    requestScope.reset(); currentContext.current = null; setContext(null); clearTransient(); setLoadingContext(false);
    setErrorMessage("Your session or workspace permissions changed. Refresh access or sign in again.");
  }, [requestScope, clearTransient]);

  const loadContext = useCallback(async (targetWorkspaceId?: number, quiet = false) => {
    if (quiet && requestScope.isBusy()) return;
    const epoch = requestScope.reset();
    if (!quiet) { clearTransient(); currentContext.current = null; setContext(null); setLoadingContext(true); }
    setErrorMessage(null);
    try {
      const result = await fetchPlatformContext(targetWorkspaceId);
      if (!requestScope.isCurrent(epoch) || !authenticatedRef.current) return;
      if (!result.ok || !result.data?.success || !result.data.data) throw new Error(result.data?.message || "Workspace access could not be verified.");
      const value = result.data.data;
      if (targetWorkspaceId && value.active_workspace?.id !== targetWorkspaceId) throw new Error("The requested workspace is no longer available.");
      if (value.active_workspace && !value.workspaces.some(item => item.id === value.active_workspace?.id)) throw new Error("Workspace membership could not be verified.");
      const previous = currentContext.current;
      if (previous && (previous.user.id !== value.user.id || previous.active_workspace?.id !== value.active_workspace?.id ||
        previous.active_workspace?.role !== value.active_workspace?.role || JSON.stringify(previous.capabilities) !== JSON.stringify(value.capabilities))) clearTransient();
      currentContext.current = value; setContext(value);
    } catch (reason) {
      if (requestScope.isCurrent(epoch)) { clearTransient(); currentContext.current = null; setContext(null); setErrorMessage(reason instanceof Error ? reason.message : "Workspace access is unavailable."); }
    } finally { if (requestScope.isCurrent(epoch)) setLoadingContext(false); }
  }, [requestScope, clearTransient]);

  useEffect(() => {
    if (!authenticated) { requestScope.reset(); currentContext.current = null; setContext(null); clearTransient(); setLoadingContext(false); return; }
    const params = new URLSearchParams(window.location.search);
    const id = Number(params.get("workspace_id"));
    const tab = params.get("tab") as ConsoleTab | null;
    if (tab && ["workspaces", "products", "team", "billing", "integrations"].includes(tab)) setActiveTab(tab);
    void loadContext(Number.isSafeInteger(id) && id > 0 ? id : undefined);
    const refresh = () => { if (document.visibilityState === "visible" && !requestScope.isBusy()) void loadContext(currentContext.current?.active_workspace?.id, true); };
    const timer = setInterval(refresh, 30000); document.addEventListener("visibilitychange", refresh);
    return () => { requestScope.reset(); clearInterval(timer); document.removeEventListener("visibilitychange", refresh); };
  }, [authenticated, sessionIdentity, requestScope, clearTransient, loadContext]);

  useEffect(() => {
    if (!context?.active_workspace) return;
    const url = new URL(window.location.href); url.searchParams.set("workspace_id", String(context.active_workspace.id)); url.searchParams.set("tab", activeTab);
    window.history.replaceState({}, "", url.toString());
  }, [activeTab, context?.active_workspace?.id]);

  useEffect(() => {
    if (!context?.active_workspace) return;
    const workspace = context.active_workspace.id; const epoch = requestScope.current(); let active = true;
    const current = () => active && requestScope.isCurrent(epoch) && authenticatedRef.current;
    const accept = <T,>(promise: Promise<{ ok: boolean; status: number; data: { success?: boolean; data?: T; message?: string } }>, setter: (data: T) => void) => {
      void promise.then(result => {
        if (!current()) return;
        if (result.status === 401 || result.status === 403) { invalidateContext(); return; }
        if (result.ok && result.data.success && result.data.data !== undefined) setter(result.data.data);
        else setErrorMessage(result.data.message || "This section could not be loaded.");
      }).catch(() => { if (current()) setErrorMessage("Connection interrupted. Refresh this section."); });
    };
    if (activeTab === "team" && context.capabilities.can_manage_workspace) accept(fetchWorkspaceMembers(workspace), setMembers);
    if (activeTab === "products" || (activeTab === "billing" && context.capabilities.can_manage_billing)) {
      accept(fetchCatalogue(), setCatalogue); accept(fetchWorkspaceSubscriptions(workspace), setSubscriptions);
    }
    if (activeTab === "products" && context.capabilities.can_manage_billing) accept(fetchRecommendations(workspace), setRecommendations);
    if (activeTab === "integrations" && context.capabilities.can_manage_integrations) {
      accept(fetchWorkspaceIntegrations(workspace), setIntegrationsStatus); accept(fetchApiCredentials(workspace), setCredentials);
    }
    return () => { active = false; };
  }, [activeTab, context, requestScope, invalidateContext]);

  useEffect(() => {
    if (context && ((activeTab === "team" && !context.capabilities.can_manage_workspace) ||
      (activeTab === "billing" && !context.capabilities.can_manage_billing) ||
      (activeTab === "integrations" && !context.capabilities.can_manage_integrations))) setActiveTab("products");
  }, [activeTab, context]);

  const handleSwitchWorkspace = (id: number) => { if (Number.isSafeInteger(id) && id > 0) void loadContext(id); };

  const handleRevokeCredential = async (credId: number) => {
    const requestEpoch = requestScope.beginMutation();
    if (requestEpoch === null) return;
    setIsMutating(true);
    try {

    if (!context?.active_workspace) return;
    try {
      const res = await revokeApiCredential(context.active_workspace.id, credId);
      if (!requestScope.isCurrent(requestEpoch)) return;
      if (res.status === 401 || res.status === 403) { invalidateContext(); return; }
      if (res.ok && res.data?.success) {
        setSuccessMessage("API Key revoked successfully.");
        const refreshed = await fetchApiCredentials(context.active_workspace.id);
      if (!requestScope.isCurrent(requestEpoch)) return;
      if (refreshed.status === 401 || refreshed.status === 403) { invalidateContext(); return; }
        if (refreshed.ok && refreshed.data?.data) setCredentials(refreshed.data.data);
      } else {
        setErrorMessage("Failed to revoke API key.");
      }
    } catch {
      if (!requestScope.isCurrent(requestEpoch)) return;
      setErrorMessage("Network error revoking credential.");
    }
  
    } finally { if (requestScope.finishMutation(requestEpoch)) setIsMutating(false); }
  };

  const handleRotateCredential = async (credId: number) => {
    const requestEpoch = requestScope.beginMutation();
    if (requestEpoch === null) return;
    setIsMutating(true);
    try {

    if (!context?.active_workspace) return;
    try {
      const res = await rotateApiCredential(context.active_workspace.id, credId);
      if (!requestScope.isCurrent(requestEpoch)) return;
      if (res.status === 401 || res.status === 403) { invalidateContext(); return; }
      if (res.ok && res.data?.success && res.data.data?.raw_api_key) {
        setNewApiKey(res.data.data.raw_api_key);
        setSuccessMessage("API Key rotated. Save the new key now.");
        const refreshed = await fetchApiCredentials(context.active_workspace.id);
      if (!requestScope.isCurrent(requestEpoch)) return;
      if (refreshed.status === 401 || refreshed.status === 403) { invalidateContext(); return; }
        if (refreshed.ok && refreshed.data?.data) setCredentials(refreshed.data.data);
      } else {
        setErrorMessage("Failed to rotate API key.");
      }
    } catch {
      if (!requestScope.isCurrent(requestEpoch)) return;
      setErrorMessage("Network error rotating credential.");
    }
  
    } finally { if (requestScope.finishMutation(requestEpoch)) setIsMutating(false); }
  };

  const handleCreateWorkspace = async (e: React.FormEvent) => {
    const requestEpoch = requestScope.beginMutation();
    if (requestEpoch === null) return;
    setIsMutating(true);
    try {

    e.preventDefault();
    if (!newWorkspaceName.trim()) return;
    setErrorMessage(null);
    try {
      const res = await createWorkspace({
        name: newWorkspaceName.trim(),
        business_type: newWorkspaceType,
        contact_phone: newWorkspacePhone.trim() || undefined,
      });
      if (!requestScope.isCurrent(requestEpoch)) return;
      if (res.status === 401 || res.status === 403) { invalidateContext(); return; }
      if (res.ok && res.data?.success && res.data.data) {
        setIsCreatingWorkspace(false);
        setNewWorkspaceName("");
        setNewWorkspacePhone("");
        setSuccessMessage(`Workspace "${res.data.data.name}" created successfully.`);
        loadContext(res.data.data.id);
      } else {
        setErrorMessage(res.data?.message || "Could not create workspace.");
      }
    } catch {
      if (!requestScope.isCurrent(requestEpoch)) return;
      setErrorMessage("Error submitting workspace creation.");
    }
  
    } finally { if (requestScope.finishMutation(requestEpoch)) setIsMutating(false); }
  };

  const handleAcceptInvitation = async (invitationId: number) => {
    const requestEpoch = requestScope.beginMutation();
    if (requestEpoch === null) return;
    setIsMutating(true);
    try {

    try {
      const res = await acceptWorkspaceInvitation(invitationId);
      if (!requestScope.isCurrent(requestEpoch)) return;
      if (res.status === 401 || res.status === 403) { invalidateContext(); return; }
      if (res.ok && res.data?.success) {
        setSuccessMessage("Invitation accepted successfully!");
        loadContext();
      } else {
        setErrorMessage(res.data?.message || "Could not accept invitation.");
      }
    } catch {
      if (!requestScope.isCurrent(requestEpoch)) return;
      setErrorMessage("Network error accepting invitation.");
    }
  
    } finally { if (requestScope.finishMutation(requestEpoch)) setIsMutating(false); }
  };

  const handleInviteMember = async (e: React.FormEvent) => {
    const requestEpoch = requestScope.beginMutation();
    if (requestEpoch === null) return;
    setIsMutating(true);
    try {

    e.preventDefault();
    if (!context?.active_workspace || !inviteEmail.trim()) return;
    try {
      const res = await inviteWorkspaceMember(context.active_workspace.id, {
        email: inviteEmail.trim(),
        role: inviteRole,
      });
      if (!requestScope.isCurrent(requestEpoch)) return;
      if (res.status === 401 || res.status === 403) { invalidateContext(); return; }
      if (res.ok && res.data?.success) {
        setSuccessMessage(`Invitation created for ${inviteEmail}. They can accept it in SaaSzo.`);
        setInviteEmail("");
        const refreshed = await fetchWorkspaceMembers(context.active_workspace.id);
      if (!requestScope.isCurrent(requestEpoch)) return;
      if (refreshed.status === 401 || refreshed.status === 403) { invalidateContext(); return; }
        if (refreshed.ok && refreshed.data?.data) setMembers(refreshed.data.data);
      } else {
        setErrorMessage(res.data?.message || "Failed to invite member.");
      }
    } catch {
      if (!requestScope.isCurrent(requestEpoch)) return;
      setErrorMessage("Network error sending invite.");
    }
  
    } finally { if (requestScope.finishMutation(requestEpoch)) setIsMutating(false); }
  };

  const handleMemberAction = async (memberId: number, action: "change_role" | "revoke", role?: string) => {
    const requestEpoch = requestScope.beginMutation();
    if (requestEpoch === null) return;
    setIsMutating(true);
    try {

    if (!context?.active_workspace) return;
    try {
      const res = await performMemberAction(context.active_workspace.id, memberId, action, role);
      if (!requestScope.isCurrent(requestEpoch)) return;
      if (res.status === 401 || res.status === 403) { invalidateContext(); return; }
      if (res.ok && res.data?.success) {
        setSuccessMessage(action === "revoke" ? "Member access revoked." : "Role updated.");
        const refreshed = await fetchWorkspaceMembers(context.active_workspace.id);
      if (!requestScope.isCurrent(requestEpoch)) return;
      if (refreshed.status === 401 || refreshed.status === 403) { invalidateContext(); return; }
        if (refreshed.ok && refreshed.data?.data) setMembers(refreshed.data.data);
      } else {
        setErrorMessage(res.data?.message || "Action failed.");
      }
    } catch {
      if (!requestScope.isCurrent(requestEpoch)) return;
      setErrorMessage("Action failed.");
    }
  
    } finally { if (requestScope.finishMutation(requestEpoch)) setIsMutating(false); }
  };

  const handleDismissRecommendation = async (productKey: string) => {
    const requestEpoch = requestScope.beginMutation();
    if (requestEpoch === null) return;
    setIsMutating(true);
    try {

    if (!context?.active_workspace) return;
    try {
      await dismissRecommendation(context.active_workspace.id, productKey);
      if (!requestScope.isCurrent(requestEpoch)) return;
      setRecommendations((prev) => prev.filter((r) => r.product_key !== productKey));
    } catch {
      if (!requestScope.isCurrent(requestEpoch)) return;
      // ignore
    }
  
    } finally { if (requestScope.finishMutation(requestEpoch)) setIsMutating(false); }
  };

  const handleGetQuote = async (productKey: string, versionId: number) => {
    const requestEpoch = requestScope.beginMutation();
    if (requestEpoch === null) return;
    setIsMutating(true);
    try {

    if (!context?.active_workspace) return;
    setErrorMessage(null);
    try {
      const res = await createCheckoutQuote(context.active_workspace.id, {
        product_key: productKey,
        plan_version_id: versionId,
      });
      if (!requestScope.isCurrent(requestEpoch)) return;
      if (res.status === 401 || res.status === 403) { invalidateContext(); return; }
      if (res.ok && res.data?.success && res.data.data) {
        setActiveQuote(res.data.data);
        setCreatedOrder(null);
      } else {
        setErrorMessage(res.data?.message || "Failed to generate quote.");
      }
    } catch {
      if (!requestScope.isCurrent(requestEpoch)) return;
      setErrorMessage("Quote creation error.");
    }
  
    } finally { if (requestScope.finishMutation(requestEpoch)) setIsMutating(false); }
  };

  const handleProceedOrder = async () => {
    const requestEpoch = requestScope.beginMutation();
    if (requestEpoch === null) return;
    setIsMutating(true);
    try {

    if (!context?.active_workspace || !activeQuote) return;
    setErrorMessage(null);
    try {
      const idempotencyKey = checkoutKeys.current.get(activeQuote.quote_id) || crypto.randomUUID();
      checkoutKeys.current.set(activeQuote.quote_id, idempotencyKey);
      const res = await createCheckoutOrder(context.active_workspace.id, {
        quote_id: activeQuote.quote_id,
        provider: "razorpay",
        idempotency_key: idempotencyKey,
      });
      if (!requestScope.isCurrent(requestEpoch)) return;
      if (res.status === 401 || res.status === 403) { invalidateContext(); return; }
      if (res.ok && res.data?.success && res.data.data) {
        setCreatedOrder(res.data.data);
        setActiveQuote(null);
        setSuccessMessage(res.data.data.status === "created" ? "Order created. Payment has not been confirmed." : "Order status refreshed. Access activates only after verified payment.");
      } else {
        const unresolved = res.data?.data;
        if (unresolved?.order_id && unresolved.status === "unknown") {
          const status = await fetchCheckoutOrder(context.active_workspace.id, unresolved.order_id);
          if (!requestScope.isCurrent(requestEpoch)) return;
          if (status.ok && status.data.data) { setCreatedOrder(status.data.data); setActiveQuote(null); }
        }
        setErrorMessage(res.data?.message || "Failed to create order.");
      }
    } catch {
      if (!requestScope.isCurrent(requestEpoch)) return;
      setErrorMessage("Order creation error.");
    }
  
    } finally { if (requestScope.finishMutation(requestEpoch)) setIsMutating(false); }
  };

  const handleRecordConsent = async (e: React.FormEvent) => {
    const requestEpoch = requestScope.beginMutation();
    if (requestEpoch === null) return;
    setIsMutating(true);
    try {

    e.preventDefault();
    if (!context?.active_workspace || !consentRecipient.trim() || !consentEvidence.trim()) return;
    try {
      const res = await recordMessagingConsent(context.active_workspace.id, {
        recipient: consentRecipient.trim(),
        channel: "whatsapp",
        purpose: consentPurpose,
        status: "granted",
        evidence: consentEvidence.trim(),
      });
      if (!requestScope.isCurrent(requestEpoch)) return;
      if (res.status === 401 || res.status === 403) { invalidateContext(); return; }
      if (res.ok && res.data?.success) {
        setSuccessMessage(`Consent recorded for ${consentRecipient}.`);
        setConsentRecipient("");
        if (context.active_workspace) {
          const refreshed = await fetchWorkspaceIntegrations(context.active_workspace.id);
      if (!requestScope.isCurrent(requestEpoch)) return;
      if (refreshed.status === 401 || refreshed.status === 403) { invalidateContext(); return; }
          if (refreshed.ok && refreshed.data?.data) setIntegrationsStatus(refreshed.data.data);
        }
      } else {
        setErrorMessage(res.data?.message || "Could not record consent.");
      }
    } catch {
      if (!requestScope.isCurrent(requestEpoch)) return;
      setErrorMessage("Consent record error.");
    }
  
    } finally { if (requestScope.finishMutation(requestEpoch)) setIsMutating(false); }
  };

  const handleSendTestMessage = async (e: React.FormEvent) => {
    const requestEpoch = requestScope.beginMutation();
    if (requestEpoch === null) return;
    setIsMutating(true);
    try {

    e.preventDefault();
    if (!context?.active_workspace || !outboxRecipient.trim()) return;
    setOutboxResult(null);
    try {
      const idempotencyKey = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      const res = await sendMessagingMessage(context.active_workspace.id, {
        recipient: outboxRecipient.trim(),
        channel: "whatsapp",
        purpose: outboxPurpose,
        template_name: outboxTemplate.trim() || undefined,
        sender_id: outboxSender || undefined,
        idempotency_key: idempotencyKey,
      });
      if (!requestScope.isCurrent(requestEpoch)) return;
      if (res.status === 401 || res.status === 403) { invalidateContext(); return; }
      if (res.ok && res.data?.success && res.data.data) {
        setOutboxResult(`Message enqueued in durable outbox. ID: ${res.data.data.message_id} (Status: ${res.data.data.status})`);
        setOutboxRecipient("");
      } else {
        setErrorMessage(res.data?.message || "Messaging enqueue failed.");
      }
    } catch {
      if (!requestScope.isCurrent(requestEpoch)) return;
      setErrorMessage("Messaging error.");
    }
  
    } finally { if (requestScope.finishMutation(requestEpoch)) setIsMutating(false); }
  };

  const handleGenerateApiKey = async () => {
    const requestEpoch = requestScope.beginMutation();
    if (requestEpoch === null) return;
    setIsMutating(true);
    try {

    if (!context?.active_workspace || !apiKeyName.trim() || !apiSenders.length || !apiPurposes.length) return;
    try {
      const res = await createApiCredential(context.active_workspace.id, {
        name: apiKeyName.trim(),
        allowed_senders: apiSenders,
        allowed_purposes: apiPurposes,
        scopes: ["messaging:send"],
      });
      if (!requestScope.isCurrent(requestEpoch)) return;
      if (res.status === 401 || res.status === 403) { invalidateContext(); return; }
      if (res.ok && res.data?.success && res.data.data) {
        if (res.data.data.raw_api_key) setNewApiKey(res.data.data.raw_api_key);
        else setErrorMessage("No API key was issued. Review setup and permissions.");
      }
    } catch {
      if (!requestScope.isCurrent(requestEpoch)) return;
      setErrorMessage("Could not generate API credential.");
    }
  
    } finally { if (requestScope.finishMutation(requestEpoch)) setIsMutating(false); }
  };

  const refreshOrderStatus = useCallback(async (workspace: number, orderId: string, epoch: number) => {
    const response = await fetchCheckoutOrder(workspace, orderId);
    if (!requestScope.isCurrent(epoch) || !authenticatedRef.current) return;
    if (response.status === 401 || response.status === 403) { invalidateContext(); return; }
    if (!response.ok || !response.data.success || !response.data.data) { setErrorMessage(response.data.message || "Order status is unavailable."); return; }
    setCreatedOrder(response.data.data);
    if (response.data.data.status === "captured") {
      setSuccessMessage("Payment verified. Your product access is active.");
      const subscriptions = await fetchWorkspaceSubscriptions(workspace);
      if (requestScope.isCurrent(epoch) && subscriptions.ok && subscriptions.data.data) setSubscriptions(subscriptions.data.data);
    }
  }, [requestScope, invalidateContext]);

  useEffect(() => {
    if (!createdOrder || !context?.active_workspace || !["created", "authorized", "processing", "unknown"].includes(createdOrder.status)) return;
    const workspace = context.active_workspace.id; const id = createdOrder.order_id; const epoch = requestScope.current(); let polls = 0;
    const timer = setInterval(() => { if (++polls > 60) { clearInterval(timer); return; } if (document.visibilityState === "visible" && !requestScope.isBusy()) void refreshOrderStatus(workspace, id, epoch); }, 5000);
    return () => clearInterval(timer);
  }, [createdOrder?.order_id, createdOrder?.status, context?.active_workspace?.id, requestScope, refreshOrderStatus]);

  const handleOpenCheckout = async () => {
    if (!context?.active_workspace || !createdOrder) return;
    const epoch = requestScope.beginMutation(); if (epoch === null) return; setIsMutating(true);
    const workspace = context.active_workspace.id; const orderId = createdOrder.order_id;
    try {
      const result = await fetchCheckoutOrder(workspace, orderId);
      if (!requestScope.isCurrent(epoch)) return;
      if (!result.ok || !result.data.data) throw new Error(result.data.message || "Checkout could not be verified.");
      setCreatedOrder(result.data.data);
      await openPlatformCheckout(result.data.data, () => { if (requestScope.isCurrent(epoch)) void refreshOrderStatus(workspace, orderId, epoch); }, () => requestScope.isCurrent(epoch) && authenticatedRef.current);
    } catch (reason) { if (requestScope.isCurrent(epoch)) setErrorMessage(reason instanceof Error ? reason.message : "Checkout is unavailable."); }
    finally { if (requestScope.finishMutation(epoch)) setIsMutating(false); }
  };

  const handleLaunchProduct = async (tool: string, destination?: string, admin = false) => {
    const value = currentContext.current; const product = value?.products.find(item => item.key === tool);
    if (!product || !value?.active_workspace || !product.access.allowed || (admin && !product.access.admin)) return;
    if (!value.active_workspace.is_primary || value.active_workspace.operations_ready === false) { setErrorMessage("Product operations for this workspace require access setup."); return; }
    const epoch = requestScope.beginMutation(); if (epoch === null) return; setIsMutating(true);
    try {
      const expected = `https://${tool}.saaszo.in`; const target = new URL(destination || (admin ? product.admin_url : product.dashboard_url), expected);
      if (target.origin !== expected || target.username || target.password) throw new Error("This product destination is not available.");
      if (tool === "digital") { window.location.assign(target.toString()); return; }
      if (admin) target.searchParams.set("workspace_id", String(value.active_workspace.id));
      const handoff = await getHandoffToken(tool);
      if (!requestScope.isCurrent(epoch)) return;
      if (!handoff.redirectUrl) throw new Error(handoff.error || "Could not open this product.");
      const bridge = new URL(handoff.redirectUrl);
      if (bridge.origin !== expected || !["/auth-bridge", "/auth/sso"].includes(bridge.pathname)) throw new Error("The product sign-in destination could not be verified.");
      bridge.searchParams.set("redirect", target.pathname + target.search);
      window.location.assign(bridge.toString());
    } catch (reason) { if (requestScope.isCurrent(epoch)) setErrorMessage(reason instanceof Error ? reason.message : "Product sign-in is unavailable."); }
    finally { if (requestScope.finishMutation(epoch)) setIsMutating(false); }
  };

  if (authLoading || loadingContext || (context && sessionIdentity && String(context.user.id) !== sessionIdentity)) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-slate-500">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-500 border-t-transparent mb-4" />
        <p className="text-sm font-medium">Loading SaaSzo Platform Console...</p>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="p-8 max-w-xl mx-auto text-center bg-white rounded-xl shadow-sm border border-slate-200 mt-8">
        <h2 className="text-xl font-bold text-slate-800">Sign In Required</h2>
        <p className="text-sm text-slate-600 mt-2">
          Please sign in to your SaaSzo account to manage platform workspaces, products, and billing.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full min-w-0 max-w-7xl mx-auto px-0 sm:px-4 py-8 space-y-6 [overflow-wrap:anywhere]" aria-busy={isMutating}>
      <fieldset disabled={isMutating} className="min-w-0 w-full space-y-6 border-0 p-0">
      {isMutating && <p role="status" className="text-sm text-slate-600">Processing your request…</p>}
      {/* Top Banner / Workspace Selector */}
      <div className="flex flex-col 2xl:flex-row 2xl:items-center justify-between gap-4 bg-slate-900 text-white p-6 rounded-2xl shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider bg-teal-500/20 text-teal-300 px-2.5 py-0.5 rounded-full border border-teal-500/30">
              Workspace Console
            </span>
            {context?.active_workspace?.is_primary && (
              <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                Primary
              </span>
            )}
          </div>
          <h1 className="text-2xl font-bold mt-1">
            {context?.active_workspace?.name || "Select Workspace"}
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Role: <span className="text-teal-400 font-medium capitalize">{context?.active_workspace?.role || "Member"}</span> | User: {context?.user.email}
          </p>
        </div>

        <div className="flex min-w-0 flex-wrap items-center gap-3">
          {/* Workspace Switcher */}
          {context && context.workspaces.length > 0 && (
            <select
              aria-label="Active Workspace"
              className="min-w-0 max-w-full bg-slate-800 text-white text-sm border border-slate-700 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-teal-400"
              value={context.active_workspace?.id || ""}
              onChange={(e) => handleSwitchWorkspace(Number(e.target.value))}
            >
              {context.workspaces.map((ws) => (
                <option key={ws.id} value={ws.id}>
                  {ws.name} ({ws.role}) {ws.is_primary ? "★" : ""}
                </option>
              ))}
            </select>
          )}

          <button
            onClick={() => setIsCreatingWorkspace(true)}
            className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold text-sm px-4 py-2 rounded-lg transition"
          >
            + New Workspace
          </button>
        </div>
      </div>

      {/* Non-primary Workspace Context Notice */}
      {context?.active_workspace && !context.active_workspace.is_primary && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 px-4 py-3 rounded-xl text-xs flex flex-wrap gap-3 items-center justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold uppercase tracking-wider bg-amber-200/80 px-2 py-0.5 rounded text-[10px]">Context Notice</span>
            <span>Managing &quot;{context.active_workspace.name}&quot;. Product operations for this workspace require setup.</span>
          </div>
          <button
            onClick={() => {
              const primary = context.workspaces.find((w) => w.is_primary);
              if (primary) handleSwitchWorkspace(primary.id);
            }}
            className="text-amber-800 underline font-semibold text-xs ml-4 hover:text-amber-950"
          >
            Switch to Primary
          </button>
        </div>
      )}

      {/* Notifications / Alerts */}
      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl flex justify-between items-center">
          <span role="alert">{errorMessage}</span><button onClick={() => void loadContext(currentContext.current?.active_workspace?.id)}>Refresh access</button>
          <button onClick={() => setErrorMessage(null)} className="text-red-500 hover:text-red-700 font-bold">✕</button>
        </div>
      )}
      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-xl flex justify-between items-center">
          <span>{successMessage}</span>
          <button onClick={() => setSuccessMessage(null)} className="text-emerald-600 hover:text-emerald-800 font-bold">✕</button>
        </div>
      )}

      {/* Pending Invitations Alert */}
      {context?.pending_invitations && context.pending_invitations.length > 0 && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
          <h3 className="text-sm font-bold text-amber-900">Pending Workspace Invitations</h3>
          <div className="space-y-2">
            {context.pending_invitations.map((inv) => (
              <div key={inv.id} className="flex items-center justify-between bg-white p-3 rounded-lg border border-amber-200 text-sm">
                <div>
                  <span className="font-semibold text-slate-800">{inv.workspace_name}</span> has invited you as <span className="font-medium text-amber-700 capitalize">{inv.role}</span>.
                </div>
                <button
                  onClick={() => handleAcceptInvitation(inv.id)}
                  className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold px-3 py-1.5 rounded-md transition"
                >
                  Accept Invitation
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex flex-wrap border-b border-slate-200 gap-1">
        {(["products", "workspaces", "team", "billing", "integrations"] as ConsoleTab[]).filter(tab => tab === "products" || tab === "workspaces" || (tab === "team" && context?.capabilities.can_manage_workspace) || (tab === "billing" && context?.capabilities.can_manage_billing) || (tab === "integrations" && context?.capabilities.can_manage_integrations)).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`shrink-0 whitespace-nowrap px-3 py-3 text-sm font-semibold capitalize border-b-2 transition ${
              activeTab === tab
                ? "border-teal-500 text-teal-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* TAB CONTENT: PRODUCTS */}
      {activeTab === "products" && (
        <div className="space-y-6">
          {/* Recommendations Banner */}
          {recommendations.length > 0 && (
            <div className="bg-teal-50 border border-teal-200 p-5 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-teal-950 uppercase tracking-wide">
                  Curated Cross-Sell Recommendations
                </h3>
                <span className="text-xs text-teal-700">Eligible billing purchaser only</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendations.map((rec) => (
                  <div key={rec.product_key} className="bg-white p-4 rounded-xl border border-teal-100 shadow-sm flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-slate-800">{rec.name}</h4>
                      <p className="text-xs text-slate-600 mt-1">{rec.reason}</p>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
                      <button
                        onClick={() => setActiveTab("billing")}
                        className="text-xs font-semibold text-teal-600 hover:underline"
                      >
                        Explore Plans →
                      </button>
                      <button
                        onClick={() => handleDismissRecommendation(rec.product_key)}
                        className="text-xs text-slate-400 hover:text-slate-600"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {context?.products.map((p) => (
              <div key={p.key} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:border-slate-300 transition">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      {p.kind}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 font-medium rounded-full ${
                        p.access.allowed
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : p.available
                          ? "bg-slate-100 text-slate-600 border border-slate-200"
                          : "bg-slate-50 text-slate-400"
                      }`}
                    >
                      {p.kind === "legacy" || p.kind === "consumer" ? "Independent store" : p.access.allowed ? "Access available" : p.available ? "Available" : "Planned"}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mt-2">{p.name}</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {p.kind === "legacy" || p.kind === "consumer" ? "Store purchases remain separate from workspace subscriptions." : p.access.reason || "Review product access and setup"}
                  </p>

                  {/* Modules quick access */}
                  {p.modules.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-slate-100">
                      <span className="text-xs font-semibold text-slate-400 uppercase">Modules</span>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {p.modules.map((m) => (
                          <a
                            key={m.label}
                            href={m.href}
                            onClick={event => { event.preventDefault(); void handleLaunchProduct(p.key, m.href); }}
                            aria-disabled={!context?.active_workspace?.is_primary || context.active_workspace.operations_ready === false}
                            className="text-xs bg-slate-50 hover:bg-slate-100 text-slate-700 px-2 py-1 rounded border border-slate-200 transition"
                          >
                            {m.label}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-5 pt-4 border-t border-slate-100">
                  {p.kind === "consumer" || p.kind === "legacy" ? (
                    <a href={`https://${p.key}.saaszo.in/`} className="text-sm font-semibold underline">Open store</a>
                  ) : p.kind === "companion" ? (
                    <span className="text-xs text-slate-600">Included with Mantanes · use the Gate mobile app</span>
                  ) : p.kind === "capability" && p.access.allowed ? (<button onClick={() => setActiveTab("integrations")} className="text-sm font-semibold underline">Manage integration</button>) : p.access.allowed ? (
                    <a
                      href={p.dashboard_url}
                      onClick={event => { event.preventDefault(); void handleLaunchProduct(p.key); }}
                      className="flex-1 text-center bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold py-2 rounded-lg transition"
                    >
                      Open Dashboard
                    </a>
                  ) : p.available && context?.capabilities.can_manage_billing ? (
                    <button
                      onClick={() => {
                        setSelectedProductForQuote(p.key);
                        setActiveTab("billing");
                      }}
                      className="flex-1 text-center bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold py-2 rounded-lg transition"
                    >
                      View plans
                    </button>
                  ) : (
                    <span className="flex-1 text-center bg-slate-100 text-slate-400 text-xs py-2 rounded-lg cursor-not-allowed">
                      {p.available ? "Ask workspace owner" : "Planned Release"}
                    </span>
                  )}

                  {p.access.allowed && p.access.admin && p.kind !== "companion" && (
                    <a
                      href={p.admin_url}
                      onClick={event => { event.preventDefault(); void handleLaunchProduct(p.key, p.admin_url, true); }}
                      className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-3 py-2 rounded-lg transition"
                    >
                      Admin
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: WORKSPACES */}
      {activeTab === "workspaces" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-800">Your Workspaces</h2>
            <button
              onClick={() => setIsCreatingWorkspace(true)}
              className="bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
            >
              + Create Workspace
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {context?.workspaces.map((ws) => (
              <div
                key={ws.id}
                className={`p-5 rounded-2xl border transition ${
                  context.active_workspace?.id === ws.id
                    ? "border-teal-500 bg-teal-50/20"
                    : "border-slate-200 bg-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-800 text-lg">{ws.name}</h3>
                  {ws.is_primary && (
                    <span className="text-xs bg-slate-900 text-white px-2 py-0.5 rounded font-medium">
                      Primary
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Your Role: <span className="font-semibold text-slate-700 capitalize">{ws.role}</span>
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
                  {context.active_workspace?.id === ws.id ? (
                    <span className="text-xs text-teal-600 font-bold">Currently Active</span>
                  ) : (
                    <button
                      onClick={() => handleSwitchWorkspace(ws.id)}
                      className="text-xs bg-slate-900 hover:bg-slate-800 text-white font-semibold px-3 py-1.5 rounded-lg transition"
                    >
                      Switch to Workspace
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: TEAM */}
      {activeTab === "team" && context?.capabilities.can_manage_workspace && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Workspace Members</h2>
              <p className="text-xs text-slate-500">Manage members and role permissions for this workspace (Owner only).</p>
            </div>
          </div>

          {/* Invite Form (Owner only) */}
          {context?.capabilities.can_manage_workspace && (
            <form onSubmit={handleInviteMember} className="bg-white p-4 border border-slate-200 rounded-2xl flex flex-col md:flex-row gap-3">
              <input
                type="email"
                placeholder="colleague@example.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                required
                className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-teal-500"
              />
              <select
                aria-label="Member Role"
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
                className="border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-teal-500"
              >
                <option value="member">Member</option>
                <option value="billing_admin">Billing Admin</option>
                <option value="admin">Admin</option>
              </select>
              <button
                type="submit"
                className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm px-5 py-2 rounded-lg transition"
              >
                Send Invite
              </button>
            </form>
          )}

          {/* Members Table */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 text-xs font-semibold uppercase">
                <tr>
                  <th className="px-5 py-3">Member</th>
                  <th className="px-5 py-3">Role</th>
                  <th className="px-5 py-3">Status</th>
                  {context?.capabilities.can_manage_workspace && <th className="px-5 py-3 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {members.map((m, idx) => (
                  <tr key={m.id ?? `implicit_${idx}`} className="hover:bg-slate-50">
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-slate-800">{m.name}</div>
                      <div className="text-xs text-slate-500">{m.email}</div>
                    </td>
                    <td className="px-5 py-3.5 capitalize font-medium text-slate-700">{m.role}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        m.status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"
                      }`}>
                        {m.status}
                      </span>
                    </td>
                    {context?.capabilities.can_manage_workspace && (
                      <td className="px-5 py-3.5 text-right space-x-2">
                        {m.id && m.status === "active" && (
                          <button
                            onClick={() => handleMemberAction(m.id!, "revoke")}
                            className="text-xs text-red-600 hover:underline"
                          >
                            Revoke
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: BILLING */}
      {activeTab === "billing" && context?.capabilities.can_manage_billing && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Billing & Catalogue</h2>
            <p className="text-xs text-slate-500">Review published SaaSzo product plans and subscriptions.</p>
          </div>

          {/* Active Subscriptions */}
          {subscriptions.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">Current Workspace Subscriptions</h3>
              <div className="divide-y divide-slate-100">
                {subscriptions.map((sub) => (
                  <div key={sub.id} className="py-3 flex items-center justify-between text-sm">
                    <div>
                      <span className="font-bold text-slate-800 uppercase">{sub.product_key}</span> — {sub.plan_name}
                      <div className="text-xs text-slate-500">
                        Status: <span className="text-emerald-600 font-semibold">{sub.status}</span>
                        {sub.expires_at && ` | Expires: ${new Date(sub.expires_at).toLocaleDateString()}`}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Active Quote Review */}
          {activeQuote && (
            <div className="bg-amber-50 border border-amber-300 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs uppercase font-bold tracking-wider text-amber-800">Locked Price Quote</span>
                  <h3 className="text-xl font-bold text-slate-900 mt-1">{activeQuote.plan_name}</h3>
                  <p className="text-xs text-slate-600">Product: {activeQuote.product_key.toUpperCase()} | Cycle: {activeQuote.billing_cycle}</p>
                </div>
                <button onClick={() => setActiveQuote(null)} className="text-amber-800 text-sm font-bold">✕ Cancel</button>
              </div>

              <div className="bg-white p-4 rounded-xl border border-amber-200 text-sm space-y-1.5">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span>{activeQuote.formatted_subtotal}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Tax:</span>
                  <span>{activeQuote.formatted_tax}</span>
                </div>
                <div className="flex justify-between font-bold text-slate-900 pt-2 border-t border-slate-200 text-base">
                  <span>Total Amount:</span>
                  <span>{activeQuote.formatted_total}</span>
                </div>
              </div>

              <button
                onClick={handleProceedOrder}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 rounded-xl transition text-sm"
              >
                Confirm Order & Proceed to Provider Checkout
              </button>
            </div>
          )}

          {/* Created Order Details */}
          {createdOrder && (
            <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-6 shadow-sm space-y-3">
              <h3 className="text-base font-bold text-emerald-950">Payment status: {createdOrder.status.replaceAll("_", " ")}</h3>
              <p className="text-sm text-slate-700">Product access activates after the server verifies captured payment.</p>
              <p className="text-sm text-slate-700">
                Order ID: <span className="font-mono font-bold">{createdOrder.order_id}</span> ({createdOrder.provider_order_id})
              </p>
              <p className="text-sm text-slate-700">Amount: <span className="font-bold">{createdOrder.formatted_amount}</span></p>
              <div className="text-xs text-slate-500 pt-2 border-t border-emerald-200">
                Provider: {createdOrder.provider}
                {createdOrder.checkout_allowed && <button type="button" className="ml-3 underline font-semibold" onClick={() => void handleOpenCheckout()}>{createdOrder.key_id.startsWith("rzp_test_") ? "Open test checkout" : "Pay securely"}</button>}
                <button type="button" className="ml-3 underline" onClick={() => context?.active_workspace && void refreshOrderStatus(context.active_workspace.id, createdOrder.order_id, requestScope.current())}>Refresh payment status</button>
              </div>
            </div>
          )}

          {/* Published Catalogue Plans */}
          <div className="space-y-4">
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">Available Plans</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {catalogue.filter(cat => cat.available && ["business","operations","capability"].includes(cat.kind)).map((cat) => (
                <div key={cat.product_key} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
                  <div>
                    <span className="text-xs uppercase font-semibold text-slate-400">{cat.kind}</span>
                    <h4 className="text-lg font-bold text-slate-800 mt-1">{cat.name}</h4>
                    <p className="text-xs text-slate-500 mt-1">{cat.description}</p>

                    <div className="mt-4 space-y-2">
                      {cat.plans.map((pl) => (
                        <div key={pl.version_id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                          <div>
                            <div className="font-bold text-slate-800">{pl.name}</div>
                            <div className="text-teal-600 font-semibold">{pl.formatted_price} / {pl.billing_cycle}</div>
                          </div>
                          {context?.capabilities.can_manage_billing && (
                            <button
                              onClick={() => handleGetQuote(cat.product_key, pl.version_id)}
                              className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-3 py-1.5 rounded-lg transition"
                            >
                              Get Quote
                            </button>
                          )}
                        </div>
                      ))}

                      {cat.plans.length === 0 && (
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center text-xs text-slate-400">
                          Contact sales
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: INTEGRATIONS */}
      {activeTab === "integrations" && context?.capabilities.can_manage_integrations && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Shared Services & Provider Readiness</h2>
            <p className="text-xs text-slate-500">Manage business connections, recipient consent, approved messages and server API keys.</p>
          </div>

          {/* Provider Readiness Cards */}
          {integrationsStatus && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-slate-800 text-sm">WhatsApp Business Channel</h3>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium capitalize ${
                    integrationsStatus.whatsapp.status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                  }`}>
                    {integrationsStatus.whatsapp.status.replace("_", " ")}
                  </span>
                </div>
                <div className="text-xs text-slate-600">Phone ID: {integrationsStatus.whatsapp.phone_number_id || "Unassigned"}</div>
                <div className="text-xs text-slate-600">Active Consents: {integrationsStatus.whatsapp.granted_consents} | Daily Quota: {integrationsStatus.whatsapp.daily_limit}</div>
                {integrationsStatus.whatsapp.missing_setup_reasons.length > 0 && (
                  <div className="pt-2 border-t border-slate-100 text-xs text-amber-800 space-y-1">
                    {integrationsStatus.whatsapp.missing_setup_reasons.map((r, i) => (
                      <div key={i}>• {r}</div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-slate-800 text-sm">Razorpay Payment Gateway</h3>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium capitalize ${
                    integrationsStatus.payments.status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-700"
                  }`}>
                    {integrationsStatus.payments.status}
                  </span>
                </div>
                <div className="text-xs text-slate-600">Key ID: {integrationsStatus.payments.key_id}</div>
                <div className="text-xs text-slate-600">Currency: {integrationsStatus.payments.currency} | Purpose: {integrationsStatus.payments.purpose}</div>
                {integrationsStatus.payments.missing_setup_reasons.length > 0 && (
                  <div className="pt-2 border-t border-slate-100 text-xs text-amber-800 space-y-1">
                    {integrationsStatus.payments.missing_setup_reasons.map((r, i) => (
                      <div key={i}>• {r}</div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Consent Form */}
            <form onSubmit={handleRecordConsent} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
              <h3 className="font-bold text-slate-800 text-sm">Record Recipient Consent</h3>
              <p className="text-xs text-slate-500">External messaging strictly requires verified opt-in evidence.</p>
              <input
                type="tel"
                placeholder="+919876543210"
                value={consentRecipient}
                onChange={(e) => setConsentRecipient(e.target.value)}
                required
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-teal-500"
              />
              <select
                aria-label="Consent Purpose"
                value={consentPurpose}
                onChange={(e) => setConsentPurpose(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none"
              >
                <option value="transactional">Transactional (Receipts, OTPs)</option>
                <option value="alerts">Alerts (Maintenance, Staff)</option>
                <option value="marketing">Marketing (Offers)</option>
              </select>
              <label className="block text-sm text-slate-700">Consent evidence
                <input value={consentEvidence} onChange={event => setConsentEvidence(event.target.value)} required placeholder="Source and date of the recipient’s consent" className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2" />
              </label>
              <label className="flex gap-2 text-xs text-slate-600"><input type="checkbox" required /> I confirm the recipient provided consent for this purpose.</label>
              <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm py-2 rounded-lg transition">
                Record Consent
              </button>
            </form>

            {/* Outbox Test Enqueue */}
            <form onSubmit={handleSendTestMessage} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
              <h3 className="font-bold text-slate-800 text-sm">Send an approved message</h3>
              <label className="block text-xs text-slate-600">Approved sender
                <select className="block w-full border rounded-lg p-2" value={outboxSender} onChange={event=>setOutboxSender(event.target.value)}>
                  <option value="">{integrationsStatus?.whatsapp.senders?.length===1 ? "Use the approved sender" : "Choose sender"}</option>
                  {integrationsStatus?.whatsapp.senders?.map(sender=><option key={sender.id} value={sender.sender_id}>{sender.label}</option>)}
                </select>
              </label>
              <p className="text-xs text-slate-500">Messages are checked against consent and approved sender settings.</p>
              <input
                type="tel"
                placeholder="+919876543210"
                value={outboxRecipient}
                onChange={(e) => setOutboxRecipient(e.target.value)}
                required
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-teal-500"
              />
              <input
                type="text"
                placeholder="Approved template name"
                required
                value={outboxTemplate}
                onChange={(e) => setOutboxTemplate(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none"
              />
              <button type="submit" disabled={!integrationsStatus?.whatsapp.ready} className="w-full disabled:opacity-50 bg-teal-600 hover:bg-teal-500 text-white font-semibold text-sm py-2 rounded-lg transition">
                Enqueue Message
              </button>
              {outboxResult && (
                <div className="p-3 bg-teal-50 border border-teal-200 text-teal-800 text-xs rounded-lg">
                  {outboxResult}
                </div>
              )}
            </form>
          </div>

          {/* API Key Generation & Management */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Workspace Server API Keys</h3>
                <p className="text-xs text-slate-500">Restricted credentials for backend messaging automation.</p>
              </div>
              <button
                onClick={handleGenerateApiKey}
                disabled={!apiKeyName.trim() || !apiSenders.length || !apiPurposes.length || !context?.products.some(product=>product.key==="whatsapp_api" && product.access.allowed)}
                className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-3 py-2 rounded-lg transition"
              >
                + Generate Key
              </button>
            </div>

            {context?.products.some(product=>product.key==="whatsapp_api" && product.access.allowed) ? <div className="grid gap-3 md:grid-cols-3">
              <label className="text-xs text-slate-600">Integration name<input className="block w-full border rounded-lg p-2" value={apiKeyName} onChange={event=>setApiKeyName(event.target.value)} placeholder="Name this server integration" /></label>
              <label className="text-xs text-slate-600">Allowed senders<select multiple className="block w-full border rounded-lg p-2" value={apiSenders} onChange={event=>setApiSenders(Array.from(event.target.selectedOptions,option=>option.value))}>
                {integrationsStatus?.whatsapp.senders?.map(sender=><option key={sender.id} value={sender.sender_id}>{sender.label}</option>)}
              </select></label>
              <fieldset className="text-xs text-slate-600"><legend>Allowed purposes</legend>{["transactional","alerts","marketing"].map(purpose=><label key={purpose} className="block"><input type="checkbox" checked={apiPurposes.includes(purpose)} onChange={event=>setApiPurposes(current=>event.target.checked?[...current,purpose]:current.filter(value=>value!==purpose))} /> {purpose}</label>)}</fieldset>
            </div> : <p className="text-sm text-slate-600">Server API access requires an approved WhatsApp API plan. New plans are available after publication.</p>}

            {newApiKey && (
              <div className="p-3 bg-amber-50 border border-amber-200 text-xs rounded-lg space-y-1">
                <div className="font-bold text-amber-900">Your New API Key (Shown only once):</div>
                <div className="font-mono bg-white p-2 rounded border border-amber-300 select-all">{newApiKey}</div>
              </div>
            )}

            {credentials.length > 0 && (
              <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                    <tr>
                      <th className="p-2.5">Name</th>
                      <th className="p-2.5">Prefix</th>
                      <th className="p-2.5">Scopes</th>
                      <th className="p-2.5">Usage / Quota</th>
                      <th className="p-2.5">Status</th>
                      <th className="p-2.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {credentials.map((c) => (
                      <tr key={c.id}>
                        <td className="p-2.5 font-medium text-slate-800">{c.name}</td>
                        <td className="p-2.5 font-mono text-slate-500">{c.key_prefix}...</td>
                        <td className="p-2.5 text-slate-600">{c.scopes.join(", ")}</td>
                        <td className="p-2.5 text-slate-600">{c.usage_today} / {c.daily_usage_limit}</td>
                        <td className="p-2.5">
                          {c.revoked_at ? (
                            <span className="text-red-600 font-semibold">Revoked</span>
                          ) : (
                            <span className="text-emerald-600 font-semibold">Active</span>
                          )}
                        </td>
                        <td className="p-2.5 text-right space-x-2">
                          {!c.revoked_at && (
                            <>
                              <button
                                onClick={() => handleRotateCredential(c.id)}
                                className="text-teal-600 hover:text-teal-800 font-medium text-xs"
                              >
                                Rotate
                              </button>
                              <button
                                onClick={() => handleRevokeCredential(c.id)}
                                className="text-red-500 hover:text-red-700 font-medium text-xs"
                              >
                                Revoke
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CREATE WORKSPACE MODAL */}
      {isCreatingWorkspace && (
        <div className="fixed inset-0 bg-slate-950/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-slate-800">Create New Platform Workspace</h3>
            <form onSubmit={handleCreateWorkspace} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700">Workspace Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Acme Retail Solutions"
                  value={newWorkspaceName}
                  onChange={(e) => setNewWorkspaceName(e.target.value)}
                  required
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm mt-1 outline-none focus:border-teal-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700">Business Type</label>
                <select
                  value={newWorkspaceType}
                  onChange={(e) => setNewWorkspaceType(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm mt-1 outline-none"
                >
                  <option value="retail">Retail / Shop</option>
                  <option value="services">Services / Consulting</option>
                  <option value="housing_society">Housing Society / Property</option>
                  <option value="manufacturing">Manufacturing</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700">Contact Phone</label>
                <input
                  type="tel"
                  placeholder="9876543210"
                  value={newWorkspacePhone}
                  onChange={(e) => setNewWorkspacePhone(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm mt-1 outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreatingWorkspace(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 rounded-lg text-sm transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-teal-600 hover:bg-teal-500 text-white font-semibold py-2 rounded-lg text-sm transition"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </fieldset>
    </div>
  );
}
