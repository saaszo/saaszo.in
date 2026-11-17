"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { ConfirmationResult, RecaptchaVerifier } from "firebase/auth";
import { useAuthSession } from "@/components/AuthProvider";
import { lookupAuthIdentifier, parseAuthIdentifier } from "@/lib/auth-utils";
import { resolveSafeRedirectTarget } from "@/lib/utils";
import { appConfig } from "@/lib/config";
import { resolveSignupReturn } from "@/lib/purchase-intent";
import styles from "./simple-account.module.css";

export function SimpleAccountForm({ intent }: { intent: "signup" | "login" }) {
  const params = useSearchParams();
  const {
    authenticated,
    loading,
    signInWithGoogle,
    setupRecaptcha,
    sendPhoneOtp,
    requestEmailCode,
    completeEmailCode,
  } = useAuthSession();
  const [identifier, setIdentifier] = useState(
    params.get("email") || params.get("phone") || "",
  );
  const [otp, setOtp] = useState("");
  const [challenge, setChallenge] = useState("");
  const [phoneConfirmation, setPhoneConfirmation] =
    useState<ConfirmationResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [consent, setConsent] = useState(false);
  const [resendAt, setResendAt] = useState(0);
  const [now, setNow] = useState(Date.now());
  const verifier = useRef<RecaptchaVerifier | null>(null);
  const inFlight = useRef(false);
  const destination = resolveSafeRedirectTarget(
    params.get("redirect"),
    appConfig.appUrl,
    "/dashboard",
  );
  const returnTo =
    intent === "signup"
      ? resolveSignupReturn(destination, appConfig.appUrl)
      : destination.includes("/dashboard/setup")
        ? "/dashboard"
        : destination;
  const authUrl = (page: string, value = identifier) => {
    const u = new URL(page, appConfig.appUrl);
    u.searchParams.set("redirect", returnTo);
    const parsed = parseAuthIdentifier(value);
    if (parsed.type === "email") u.searchParams.set("email", parsed.email);
    if (parsed.type === "phone") u.searchParams.set("phone", parsed.e164);
    return u.toString();
  };
  useEffect(() => {
    if (authenticated && !loading && !inFlight.current)
      window.location.replace(new URL(returnTo, appConfig.appUrl).toString());
  }, [authenticated, loading, returnTo]);
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => {
      clearInterval(timer);
      verifier.current?.clear();
    };
  }, []);
  async function send(event: React.FormEvent) {
    event.preventDefault();
    if (inFlight.current || Date.now() < resendAt) return;
    inFlight.current = true;
    setBusy(true);
    setError("");
    try {
      if (intent === "signup" && !consent)
        throw new Error("Please accept the terms and privacy policy.");
      const parsed = parseAuthIdentifier(identifier);
      if (parsed.type === "unknown")
        throw new Error(
          "Enter a valid email or mobile number with country code.",
        );
      const value = parsed.type === "email" ? parsed.email : parsed.e164;
      const result = await lookupAuthIdentifier(value);
      if (
        (intent === "signup" && result.exists) ||
        (intent === "login" && !result.exists)
      ) {
        const url = new URL(
          authUrl(result.exists ? "/auth" : "/register", value),
        );
        url.searchParams.set(
          "notice",
          result.exists ? "account_exists" : "create_account",
        );
        window.location.replace(url.toString());
        return;
      }
      if (parsed.type === "email")
        setChallenge(await requestEmailCode(parsed.email, intent));
      else {
        if (!verifier.current) {
          verifier.current = setupRecaptcha("simple-phone-recaptcha", {
            size: "invisible",
          });
          await verifier.current.render();
        }
        setPhoneConfirmation(
          await sendPhoneOtp(parsed.e164, verifier.current, intent),
        );
      }
      setSent(true);
      setOtp("");
      setResendAt(Date.now() + 60000);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Could not send a verification code.",
      );
      verifier.current?.clear();
      verifier.current = null;
    } finally {
      inFlight.current = false;
      setBusy(false);
    }
  }
  async function verify(event: React.FormEvent) {
    event.preventDefault();
    if (inFlight.current) return;
    inFlight.current = true;
    setBusy(true);
    setError("");
    try {
      if (!/^[0-9]{6}$/.test(otp)) throw new Error("Enter the 6-digit code.");
      const parsed = parseAuthIdentifier(identifier);
      if (parsed.type === "email")
        await completeEmailCode(parsed.email, challenge, otp, intent);
      else if (phoneConfirmation) {
        await phoneConfirmation.confirm(otp);
        inFlight.current = false;
      } else throw new Error("Request a new code.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Verification failed.");
      inFlight.current = false;
    } finally {
      setBusy(false);
    }
  }
  async function google() {
    if (inFlight.current) return;
    if (intent === "signup" && !consent) {
      setError("Please accept the terms and privacy policy.");
      return;
    }
    inFlight.current = true;
    setBusy(true);
    setError("");
    try {
      await signInWithGoogle({ intent });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Google sign in failed.");
      inFlight.current = false;
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className={styles.screen}>
      <section className={styles.card}>
        <Link href="/" className={styles.brand}>
          SaaSzo
        </Link>
        <h1>
          {intent === "signup" ? "Create your account" : "Sign in with OTP"}
        </h1>
        <p>
          {intent === "signup"
            ? "Verify your email or mobile and start exploring. Add company details later in Settings."
            : "Use the email or mobile connected to your SaaSzo account."}
        </p>
        {params.get("notice") === "create_account" && (
          <p role="status">No account found. Create your account below.</p>
        )}
        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}
        <form onSubmit={sent ? verify : send}>
          <label htmlFor="identity">Email or mobile number</label>
          <input
            id="identity"
            autoComplete="username"
            value={identifier}
            disabled={sent || busy}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="you@company.com or +91…"
            required
          />
          {intent === "signup" && (
            <label className={styles.consent}>
              <input
                type="checkbox"
                checked={consent}
                disabled={busy || sent}
                onChange={(e) => setConsent(e.target.checked)}
              />
              <span>
                I agree to the <Link href="/terms">Terms</Link> and{" "}
                <Link href="/privacy">Privacy Policy</Link>.
              </span>
            </label>
          )}
          {sent && (
            <>
              <label htmlFor="verification-code">Verification code</label>
              <input
                id="verification-code"
                autoComplete="one-time-code"
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                required
              />
              <p role="status">Code sent. Use the latest code.</p>
            </>
          )}
          <button disabled={busy || loading} type="submit">
            {busy
              ? "Please wait…"
              : sent
                ? intent === "signup"
                  ? "Verify & create account"
                  : "Verify & sign in"
                : "Send verification code"}
          </button>
        </form>
        {sent && (
          <div className={styles.actions}>
            <button
              type="button"
              disabled={busy || now < resendAt}
              onClick={send}
            >
              Resend{" "}
              {now < resendAt
                ? `(${Math.ceil((resendAt - now) / 1000)}s)`
                : "code"}
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => {
                setSent(false);
                setOtp("");
                setChallenge("");
                setPhoneConfirmation(null);
                verifier.current?.clear();
                verifier.current = null;
              }}
            >
              Change email/mobile
            </button>
          </div>
        )}
        <div id="simple-phone-recaptcha" />
        <button
          className={styles.secondary}
          disabled={busy || loading}
          onClick={google}
        >
          Continue with Google
        </button>
        <p>
          {intent === "signup"
            ? "Already have an account? "
            : "New to SaaSzo? "}
          <a href={authUrl(intent === "signup" ? "/auth" : "/register")}>
            {intent === "signup" ? "Log in" : "Create account"}
          </a>
        </p>
        <Link href={authUrl("/forgot-password")}>Forgot password?</Link>
      </section>
    </main>
  );
}
