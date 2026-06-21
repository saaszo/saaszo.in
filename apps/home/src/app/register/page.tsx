"use client";
import React, { useEffect, useMemo, useRef, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuthSession } from "@/components/AuthProvider";
import { API_BASE_URL } from "@/lib/app-config";
import { appConfig, toAbsoluteApiUrl } from "@/lib/config";
import { navigateTo } from "@/lib/auth-client";
import { lookupAuthIdentifier } from "@/lib/auth-utils";
import { getCookieValue, resolveSafeRedirectTarget } from "@/lib/utils";

/* ─── Design tokens — identical to auth/page.tsx ─── */
const C = {
  black:    "#08090a",
  cyan:     "#06b6d4",
  cyanMid:  "#0891b2",
  cyanGlow: "rgba(6,182,212,0.22)",
  cyanSoft: "rgba(6,182,212,0.10)",
  cyanBrd:  "rgba(6,182,212,0.20)",
  white:    "#ffffff",
  muted:    "rgba(255,255,255,0.48)",
  subtle:   "rgba(255,255,255,0.08)",
  rBg:      "#f6f8fa",
  rCard:    "#ffffff",
  rText:    "#09090b",
  rMuted:   "#64748b",
  rBorder:  "rgba(9,9,11,0.09)",
};

/* ─── Helpers ─── */
function normalizeEmail(value: string) { return value.trim().toLowerCase(); }

function passwordMeetsRequirements(password: string) {
  return (
    password.length >= 8 &&
    /[a-z]/.test(password) &&
    /[A-Z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  );
}

function isTooManyAttemptsMessage(message: string) {
  return /too many|wait \d+ seconds|attempts/i.test(message);
}

async function fetchWithCsrf(path: string, init: RequestInit = {}) {
  const method = init.method?.toUpperCase() || "GET";
  const isMutation = !["GET", "HEAD", "OPTIONS"].includes(method);
  if (isMutation && !getCookieValue("XSRF-TOKEN")) {
    await fetch(toAbsoluteApiUrl("/sanctum/csrf-cookie").replace("/api/sanctum", "/sanctum"), {
      method: "GET", credentials: "include",
    }).catch(() => null);
  }
  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...((init.headers as Record<string, string>) ?? {}),
  };
  const xsrfToken = getCookieValue("XSRF-TOKEN");
  if (xsrfToken && isMutation) headers["X-XSRF-TOKEN"] = xsrfToken;
  const response = await fetch(`${API_BASE_URL}${path}`, { ...init, headers, credentials: "include" });
  const payload = await response.json().catch(() => null);
  if (!response.ok && payload?.message) throw Object.assign(new Error(payload.message), { status: response.status, payload });
  return payload;
}

/* ─── Icons ─── */
function GoogleIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

function EyeIcon({ show }: { show: boolean }) {
  return show ? (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );
}

/* ─── Password strength bar ─── */
function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: "8+ chars",    ok: password.length >= 8 },
    { label: "Uppercase",   ok: /[A-Z]/.test(password) },
    { label: "Number",      ok: /[0-9]/.test(password) },
    { label: "Symbol",      ok: /[^A-Za-z0-9]/.test(password) },
  ];
  const score = checks.filter(c => c.ok).length;
  if (!password) return null;
  const color = score <= 1 ? "#ef4444" : score <= 2 ? "#f97316" : score === 3 ? "#eab308" : C.cyan;
  const label = score <= 1 ? "Weak" : score <= 2 ? "Fair" : score === 3 ? "Good" : "Strong";
  return (
    <div style={{ marginTop: "6px" }}>
      <div style={{ display: "flex", gap: "4px", marginBottom: "4px" }}>
        {[0,1,2,3].map(i => (
          <div key={i} style={{ flex:1, height:"3px", borderRadius:"2px",
            background: i < score ? color : "rgba(0,0,0,0.08)",
            transition: "background 0.2s" }} />
        ))}
      </div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <span style={{ fontSize:"0.7rem", fontWeight:600, color }}>
          {label}
        </span>
        <div style={{ display:"flex", gap:"8px" }}>
          {checks.map(c => (
            <span key={c.label} style={{ fontSize:"0.65rem", color: c.ok ? C.cyan : "#94a3b8", fontWeight:600,
              display:"flex", alignItems:"center", gap:"2px" }}>
              {c.ok
                ? <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke={C.cyan} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                : <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>}
              {c.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Shared input style ─── */
const inputBase: React.CSSProperties = {
  width: "100%", padding: "9px 12px 9px 34px",
  borderRadius: "9px", border: `1px solid ${C.rBorder}`,
  background: "#f9fafb", fontSize: "0.87rem", color: C.rText,
  outline: "none", boxSizing: "border-box",
  transition: "border-color 0.15s, box-shadow 0.15s, background 0.15s",
};

function onFocus(e: React.FocusEvent<HTMLInputElement>) {
  e.target.style.borderColor = C.cyan;
  e.target.style.boxShadow  = `0 0 0 3px ${C.cyanSoft}`;
  e.target.style.background = "#fff";
}
function onBlur(e: React.FocusEvent<HTMLInputElement>) {
  e.target.style.borderColor = C.rBorder;
  e.target.style.boxShadow   = "none";
  e.target.style.background  = "#f9fafb";
}

function InlineFieldError({ message }: { message: string }) {
  return (
    <p style={{ margin:"6px 0 0",fontSize:"0.73rem",fontWeight:700,color:"#dc2626",lineHeight:1.35 }}>
      {message}
    </p>
  );
}

function FloatingToast({
  message,
  tone = "error",
}: {
  message: string;
  tone?: "error" | "success";
}) {
  return (
    <div
      style={{
        position:"fixed",
        top:"18px",
        right:"18px",
        zIndex:9999,
        maxWidth:"360px",
        padding:"12px 14px",
        borderRadius:"12px",
        background: tone === "error" ? "rgba(127,29,29,0.96)" : "rgba(20,83,45,0.96)",
        color:"#fff",
        boxShadow:"0 12px 30px rgba(0,0,0,0.22)",
        fontSize:"0.84rem",
        fontWeight:700,
        lineHeight:1.45,
      }}
    >
      {message}
    </div>
  );
}

/* ═══ Main form ══════════════════════════════════════════════════════════ */
function RegisterForm() {
  const searchParams = useSearchParams();
  const { authenticated, loading: sessionLoading, postAuthRedirect, signInWithGoogle, signUpWithEmail } = useAuthSession();

  /* form fields */
  const [name,        setName]        = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email,       setEmail]       = useState("");
  const [password,    setPassword]    = useState("");
  const [otp,         setOtp]         = useState("");
  const [showPassword,setShowPassword]= useState(false);
  const [acceptedLegal, setAcceptedLegal] = useState(false);

  /* OTP states */
  const [otpSent,         setOtpSent]         = useState(false);
  const [emailVerified,   setEmailVerified]   = useState(false);
  const [otpLockSeconds,  setOtpLockSeconds]  = useState(0);
  const [resendTimer,     setResendTimer]      = useState(0);

  /* loading */
  const [isLoading,     setIsLoading]     = useState(false);
  const [otpLoading,    setOtpLoading]    = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);

  /* messages */
  const [error,     setError]     = useState("");
  const [otpError,  setOtpError]  = useState("");
  const [otpNotice, setOtpNotice] = useState("");
  const [emailFieldError, setEmailFieldError] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  const verifyRequestInFlight = useRef(false);
  const toastTimerRef = useRef<number | null>(null);
  const normalizedEmail = useMemo(() => normalizeEmail(email), [email]);
  const pendingSetupRedirect = searchParams.get("redirect");

  function showToast(message: string) {
    setToastMessage(message);
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => {
      setToastMessage("");
      toastTimerRef.current = null;
    }, 4500);
  }

  function rememberPostSetupRedirect() {
    const safeRedirect = resolveSafeRedirectTarget(
      pendingSetupRedirect,
      appConfig.appUrl,
      "",
    );

    if (safeRedirect && typeof window !== "undefined") {
      window.sessionStorage.setItem("saaszo_post_setup_redirect", safeRedirect);
    }
  }

  useEffect(() => {
    const ep = searchParams.get("email"); if (ep) setEmail(ep);
  }, [searchParams]);

  useEffect(() => {
    if (!sessionLoading && authenticated)
      navigateTo(resolveSafeRedirectTarget(postAuthRedirect, appConfig.appUrl), {
        replace: true,
      });
  }, [authenticated, postAuthRedirect, sessionLoading]);

  /* countdown timer */
  const hasRunningTimers = otpLockSeconds > 0 || resendTimer > 0;
  useEffect(() => {
    if (!hasRunningTimers) return;
    const t = window.setInterval(() => {
      setOtpLockSeconds(c => c > 0 ? c - 1 : c);
      setResendTimer(c => c > 0 ? c - 1 : c);
    }, 1000);
    return () => window.clearInterval(t);
  }, [hasRunningTimers]);

  useEffect(() => {
    if (otpLockSeconds === 0 && isTooManyAttemptsMessage(otpError)) setOtpError("");
  }, [otpError, otpLockSeconds]);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    };
  }, []);

  /* reset OTP when email changes */
  useEffect(() => {
    setOtp(""); setOtpSent(false); setEmailVerified(false);
    setOtpError(""); setOtpNotice(""); setOtpLockSeconds(0); setResendTimer(0);
    setEmailFieldError("");
  }, [normalizedEmail]);

  if (sessionLoading || authenticated) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: C.rBg,
        }}
      />
    );
  }

  /* ── handlers ── */
  const handleSendOtp = async () => {
    if (otpLoading || verifyLoading) return;
    setOtpLoading(true); setOtpError(""); setOtpNotice("");
    try {
      if (!normalizedEmail) throw new Error("Enter your email address first.");
      const lookup = await lookupAuthIdentifier(normalizedEmail);
      if (lookup.exists) {
        const message = "This email is already registered with another account. Please sign in instead.";
        setEmailFieldError(message);
        showToast(message);
        throw new Error(message);
      }
      const result = await fetchWithCsrf("/auth/signup/send-otp", {
        method: "POST", body: JSON.stringify({ email: normalizedEmail }),
      });
      if (!result?.success) throw new Error(result?.message || "We could not send the verification code.");
      setEmailFieldError("");
      setOtpSent(true); setEmailVerified(false); setOtp(""); setOtpLockSeconds(0); setResendTimer(60);
      setOtpNotice(otpSent
        ? `New code sent to ${normalizedEmail}. Use the latest OTP — older codes are invalid.`
        : result.message || `Verification code sent to ${normalizedEmail}.`);
    } catch (err: any) {
      const sec = Number(err?.payload?.seconds_remaining ?? 0);
      if (err?.status === 423 && sec > 0) { setOtpLockSeconds(sec); setResendTimer(sec); }
      setOtpError(err?.message || "We could not send the verification code.");
    } finally { setOtpLoading(false); }
  };

  const handleVerifyOtp = async () => {
    if (verifyRequestInFlight.current || verifyLoading || otpLockSeconds > 0) return;
    verifyRequestInFlight.current = true;
    setVerifyLoading(true); setOtpError(""); setOtpNotice("");
    try {
      if (!otpSent) throw new Error("Send the verification code first.");
      if (otp.trim().length !== 6) throw new Error("Enter the 6-digit verification code.");
      const result = await fetchWithCsrf("/auth/signup/verify-otp", {
        method: "POST", body: JSON.stringify({ email: normalizedEmail, otp: otp.trim() }),
      });
      if (!result?.success) throw new Error(result?.message || "Verification failed.");
      setEmailVerified(true); setOtpError("");
      setOtpNotice("Email verified ✓ You can now create your account.");
      setOtpLockSeconds(0); setResendTimer(0);
    } catch (err: any) {
      const sec = Number(err?.payload?.seconds_remaining ?? 0);
      if ((err?.status === 423 || err?.status === 429) && sec > 0) { setOtpLockSeconds(sec); setResendTimer(sec); }
      const fb = err?.status === 429 ? "Too many attempts. Please wait." : "Verification failed.";
      const msg = err?.message || fb;
      setOtpError(/incorrect otp|invalid otp|invalid verification/i.test(msg)
        ? "Incorrect OTP. If you requested a new code, use the latest one."
        : msg);
      setEmailVerified(false);
    } finally { verifyRequestInFlight.current = false; setVerifyLoading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); if (isLoading) return;
    setIsLoading(true); setError(""); setEmailFieldError("");
    try {
      if (!acceptedLegal) throw new Error("Accept the Terms of Service and Privacy Policy to continue.");
      if (!emailVerified) throw new Error("Verify your email address before creating your account.");
      if (!passwordMeetsRequirements(password)) throw new Error("Password must be 8+ chars with uppercase, lowercase, number, and symbol.");
      rememberPostSetupRedirect();
      await signUpWithEmail(normalizedEmail, password, name, companyName, {
        redirect: pendingSetupRedirect,
      });
    } catch (err: any) {
      const duplicateField = err?.payload?.duplicate_field;
      const duplicateMessage = err?.message || "The registration server is currently unreachable.";
      if (duplicateField === "email") {
        setEmailFieldError("This email is already registered with another account.");
        showToast(duplicateMessage);
      }
      setError(duplicateMessage);
    } finally { setIsLoading(false); }
  };

  const handleGoogleSignIn = async () => {
    if (isLoading) return; setIsLoading(true); setError("");
    try {
      rememberPostSetupRedirect();
      await signInWithGoogle();
    }
    catch (err: any) { setError(err.message || "Google sign-up is not available right now."); }
    finally { setIsLoading(false); }
  };

  /* ── hero features ── */
  const STEPS = [
    { n:"1", title:"Verify Email", desc:"Get a 6-digit OTP — confirms your identity instantly." },
    { n:"2", title:"Create Workspace", desc:"Name your company and set a strong password." },
    { n:"3", title:"You're in!", desc:"Access Invoice, Tasks, Seller, HR, and Engage from one dashboard." },
  ];

  const cyanBtn: React.CSSProperties = {
    width:"100%", padding:"11px", borderRadius:"10px", border:"none",
    background: `linear-gradient(135deg, ${C.cyan}, ${C.cyanMid})`,
    color: C.white, fontSize:"0.9rem", fontWeight:700,
    cursor: isLoading ? "not-allowed" : "pointer",
    opacity: isLoading ? 0.72 : 1,
    boxShadow: `0 2px 12px ${C.cyanGlow}`,
    transition: "all 0.2s ease",
    display:"flex", alignItems:"center", justifyContent:"center", gap:"6px",
  };

  return (
    <div style={{ height:"100vh", width:"100%", display:"flex", fontFamily:"'Inter',system-ui,sans-serif", overflow:"hidden" }}>
      {toastMessage && <FloatingToast message={toastMessage} />}

      {/* ═══ LEFT HERO — Black + Cyan ═══════════════════════════════════════ */}
      <div className="saaszo-reg-hero" style={{ width:"50%",flexShrink:0,display:"flex",flexDirection:"column",position:"relative",overflow:"hidden",background:C.black }}>
        {/* Glow orbs */}
        <div style={{ position:"absolute",top:"-80px",left:"20%",width:"340px",height:"340px",borderRadius:"50%",background:"radial-gradient(circle,rgba(6,182,212,0.18) 0%,transparent 65%)",pointerEvents:"none" }}/>
        <div style={{ position:"absolute",bottom:"-100px",right:"-60px",width:"380px",height:"380px",borderRadius:"50%",background:"radial-gradient(circle,rgba(6,182,212,0.10) 0%,transparent 65%)",pointerEvents:"none" }}/>
        <div style={{ position:"absolute",top:"50%",left:"-40px",width:"200px",height:"200px",borderRadius:"50%",background:"radial-gradient(circle,rgba(6,182,212,0.07) 0%,transparent 70%)",pointerEvents:"none" }}/>
        {/* Dot grid */}
        <div style={{ position:"absolute",inset:0,backgroundImage:"radial-gradient(rgba(6,182,212,0.18) 1px,transparent 1px)",backgroundSize:"28px 28px",opacity:0.6,pointerEvents:"none" }}/>
        {/* Top bar */}
        <div style={{ position:"absolute",top:0,left:0,right:0,height:"1.5px",background:`linear-gradient(90deg,transparent,${C.cyan},transparent)`,opacity:0.8 }}/>

        <div style={{ position:"relative",zIndex:10,display:"flex",flexDirection:"column",height:"100%",padding:"32px 44px" }}>
          {/* Logo */}
          <div style={{ display:"flex",alignItems:"center",gap:"10px",marginBottom:"auto" }}>
            <div style={{ width:"34px",height:"34px",borderRadius:"9px",background:`linear-gradient(135deg,${C.cyan},${C.cyanMid})`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:"15px",color:C.black,boxShadow:`0 0 18px ${C.cyanGlow}` }}>S</div>
            <span style={{ fontSize:"1.2rem",fontWeight:800,color:C.white,letterSpacing:"-0.02em" }}>SaaSzo</span>
            <span style={{ marginLeft:"2px",fontSize:"0.6rem",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:C.cyan,border:`1px solid ${C.cyanBrd}`,borderRadius:"4px",padding:"2px 5px" }}>FREE</span>
          </div>

          {/* Copy */}
          <div style={{ flex:1,display:"flex",flexDirection:"column",justifyContent:"center",gap:"24px" }}>
            <div>
              <p style={{ margin:"0 0 10px",fontSize:"0.67rem",fontWeight:700,letterSpacing:"0.14em",textTransform:"uppercase",color:C.cyan }}>Get Started · SaaSzo</p>
              <h1 style={{ margin:"0 0 12px",fontSize:"clamp(1.8rem,2.6vw,2.4rem)",fontWeight:900,color:C.white,lineHeight:1.12,letterSpacing:"-0.03em",maxWidth:"16ch" }}>
                Your business,{" "}<span style={{ color:C.cyan }}>fully</span>{" "}connected.
              </h1>
              <p style={{ margin:0,fontSize:"0.87rem",color:C.muted,lineHeight:1.65,maxWidth:"32ch" }}>
                Create your free workspace in under 2 minutes. One login unlocks every SaaSzo product.
              </p>
            </div>

            {/* Steps */}
            <div style={{ display:"flex",flexDirection:"column",gap:"10px" }}>
              {STEPS.map((s) => (
                <div key={s.n} style={{ display:"flex",alignItems:"center",gap:"12px",background:"rgba(6,182,212,0.06)",border:"1px solid rgba(6,182,212,0.15)",borderRadius:"11px",padding:"11px 14px" }}>
                  <div style={{ width:"28px",height:"28px",borderRadius:"50%",background:`linear-gradient(135deg,${C.cyan},${C.cyanMid})`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:"0.75rem",fontWeight:900,color:C.black }}>{s.n}</div>
                  <div>
                    <p style={{ margin:"0 0 1px",fontSize:"0.82rem",fontWeight:700,color:C.white }}>{s.title}</p>
                    <p style={{ margin:0,fontSize:"0.72rem",color:C.muted,lineHeight:1.4 }}>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div style={{ display:"flex",gap:"24px" }}>
              {[["Free","Forever plan"],["2 min","Setup time"],["5 apps","Included"]].map(([val,lbl]) => (
                <div key={lbl}>
                  <p style={{ margin:"0 0 1px",fontSize:"1.05rem",fontWeight:800,color:C.cyan,letterSpacing:"-0.02em" }}>{val}</p>
                  <p style={{ margin:0,fontSize:"0.67rem",color:C.muted,fontWeight:500 }}>{lbl}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop:"auto",paddingTop:"14px",borderTop:`1px solid ${C.subtle}` }}>
            <span style={{ fontSize:"0.66rem",color:"rgba(255,255,255,0.2)",fontWeight:500 }}>© 2025 SaaSzo Inc. All rights reserved.</span>
          </div>
        </div>
      </div>

      {/* ═══ RIGHT FORM PANEL ════════════════════════════════════════════════ */}
      <div style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"16px 24px",background:C.rBg,overflow:"auto",minWidth:0 }}>

        {/* Mobile logo */}
        <div className="saaszo-reg-mobile-logo" style={{ display:"flex",alignItems:"center",gap:"8px",marginBottom:"12px" }}>
          <div style={{ width:"30px",height:"30px",borderRadius:"8px",background:`linear-gradient(135deg,${C.cyan},${C.cyanMid})`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,color:C.black,fontSize:"13px" }}>S</div>
          <span style={{ fontSize:"1rem",fontWeight:800,color:C.black,letterSpacing:"-0.02em" }}>SaaSzo</span>
        </div>

        {/* Card */}
        <div style={{ width:"100%",maxWidth:"430px",background:C.rCard,borderRadius:"18px",boxShadow:"0 4px 24px rgba(0,0,0,0.07),0 1px 3px rgba(0,0,0,0.04)",border:"1px solid rgba(0,0,0,0.06)",padding:"22px 24px 18px" }}>

          {/* Card header */}
          <div style={{ marginBottom:"14px" }}>
            <div style={{ display:"flex",alignItems:"center",gap:"7px",marginBottom:"5px" }}>
              <div style={{ width:"7px",height:"7px",borderRadius:"50%",background:C.cyan,boxShadow:`0 0 6px ${C.cyanGlow}` }}/>
              <p style={{ margin:0,fontSize:"0.67rem",fontWeight:700,letterSpacing:"0.13em",textTransform:"uppercase",color:C.rMuted }}>Create Account</p>
            </div>
            <h2 style={{ margin:"0 0 2px",fontSize:"1.4rem",fontWeight:800,color:C.rText,letterSpacing:"-0.025em",lineHeight:1.2 }}>Start for free today</h2>
            <p style={{ margin:0,fontSize:"0.8rem",color:C.rMuted }}>Verify your email, then set up your workspace.</p>
          </div>

          {/* Error */}
          {error && (
            <div style={{ marginBottom:"10px",padding:"9px 12px",borderRadius:"8px",background:"rgba(239,68,68,0.07)",border:"1px solid rgba(239,68,68,0.18)",display:"flex",alignItems:"flex-start",gap:"7px",fontSize:"0.79rem",color:"#dc2626",fontWeight:500,lineHeight:1.4 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink:0,marginTop:"1px" }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {error}
            </div>
          )}

          {/* Google sign-up */}
          <button type="button" onClick={handleGoogleSignIn} disabled={isLoading}
            style={{ width:"100%",padding:"9px 14px",borderRadius:"10px",border:"1px solid #e2e8f0",background:"#fff",color:"#374151",fontSize:"0.87rem",fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:"8px",boxShadow:"0 1px 3px rgba(0,0,0,0.06)",transition:"all 0.2s ease",marginBottom:"10px" }}
            onMouseEnter={(e) => { const b=e.currentTarget; b.style.boxShadow="0 3px 10px rgba(0,0,0,0.1)"; b.style.transform="translateY(-1px)"; }}
            onMouseLeave={(e) => { const b=e.currentTarget; b.style.boxShadow="0 1px 3px rgba(0,0,0,0.06)"; b.style.transform="translateY(0)"; }}>
            <GoogleIcon/> Continue with Google
          </button>

          {/* Divider */}
          <div style={{ display:"flex",alignItems:"center",gap:"8px",marginBottom:"12px" }}>
            <div style={{ flex:1,height:"1px",background:"rgba(0,0,0,0.07)" }}/>
            <span style={{ fontSize:"0.72rem",fontWeight:600,color:"#94a3b8" }}>or sign up with email</span>
            <div style={{ flex:1,height:"1px",background:"rgba(0,0,0,0.07)" }}/>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display:"flex",flexDirection:"column",gap:"9px" }}>

            {/* Row: Name + Company */}
            <div style={{ display:"flex",gap:"8px" }}>
              {/* Name */}
              <div style={{ flex:1,position:"relative" }}>
                <svg style={{ position:"absolute",left:"10px",top:"50%",transform:"translateY(-50%)",color:"#94a3b8",pointerEvents:"none" }} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} required
                  style={inputBase} onFocus={onFocus} onBlur={onBlur} />
              </div>
              {/* Company */}
              <div style={{ flex:1,position:"relative" }}>
                <svg style={{ position:"absolute",left:"10px",top:"50%",transform:"translateY(-50%)",color:"#94a3b8",pointerEvents:"none" }} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
                <input type="text" placeholder="Company (optional)" value={companyName} onChange={e => setCompanyName(e.target.value)}
                  style={inputBase} onFocus={onFocus} onBlur={onBlur} />
              </div>
            </div>

            {/* Email + OTP block */}
            <div style={{ background:"#f8fafc",borderRadius:"11px",border:`1px solid ${C.rBorder}`,padding:"10px",display:"flex",flexDirection:"column",gap:"8px" }}>
              <p style={{ margin:0,fontSize:"0.69rem",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",color:"#94a3b8" }}>Email Verification</p>

              {/* Email input */}
              <div style={{ position:"relative" }}>
                <svg style={{ position:"absolute",left:"10px",top:"50%",transform:"translateY(-50%)",color:"#94a3b8",pointerEvents:"none" }} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                <input type="email" placeholder="name@company.com" value={email} onChange={e => { setEmail(e.target.value); setEmailFieldError(""); }} required
                  style={{ ...inputBase, borderColor: emailFieldError ? "#dc2626" : C.rBorder }} onFocus={onFocus} onBlur={onBlur} />
              </div>
              {emailFieldError && <InlineFieldError message={emailFieldError} />}

              {/* Send OTP + status */}
              <div style={{ display:"flex",gap:"7px",alignItems:"stretch" }}>
                <button type="button" onClick={() => void handleSendOtp()}
                  disabled={otpLoading || !normalizedEmail || resendTimer > 0}
                  style={{ flex:1,padding:"8px 10px",borderRadius:"8px",border:"none",
                    background: (otpLoading || !normalizedEmail || resendTimer > 0) ? "rgba(6,182,212,0.35)" : `linear-gradient(135deg,${C.cyan},${C.cyanMid})`,
                    color:"#fff",fontSize:"0.81rem",fontWeight:700,cursor:(otpLoading || !normalizedEmail || resendTimer > 0)?"not-allowed":"pointer",
                    transition:"all 0.2s",display:"flex",alignItems:"center",justifyContent:"center",gap:"5px" }}>
                  {otpLoading
                    ? <><span style={{ width:"12px",height:"12px",border:"2px solid rgba(255,255,255,0.4)",borderTopColor:"#fff",borderRadius:"50%",animation:"saaszo-spin 0.7s linear infinite" }}/> Sending…</>
                    : resendTimer > 0 ? `Resend in ${resendTimer}s`
                    : otpSent ? "Resend OTP" : "Send OTP"}
                </button>
                {/* Verified badge */}
                <div style={{ padding:"8px 10px",borderRadius:"8px",fontSize:"0.75rem",fontWeight:700,whiteSpace:"nowrap",display:"flex",alignItems:"center",gap:"4px",
                  background: emailVerified ? "rgba(34,197,94,0.08)" : "rgba(0,0,0,0.04)",
                  color: emailVerified ? "#16a34a" : "#94a3b8",
                  border: emailVerified ? "1px solid rgba(34,197,94,0.2)" : "1px solid transparent" }}>
                  {emailVerified
                    ? <><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Verified</>
                    : "Unverified"}
                </div>
              </div>

              {/* OTP input + verify (only when OTP sent) */}
              {otpSent && !emailVerified && (
                <div style={{ display:"flex",gap:"7px" }}>
                  <input type="text" inputMode="numeric" pattern="[0-9]*" maxLength={6}
                    placeholder="6-digit OTP" value={otp}
                    onChange={e => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    onKeyDown={ev => { if (ev.key === "Enter") { ev.preventDefault(); void handleVerifyOtp(); } }}
                    style={{ flex:1,padding:"8px 12px",borderRadius:"8px",border:`1px solid ${C.rBorder}`,background:"#fff",fontSize:"0.9rem",fontWeight:700,letterSpacing:"0.15em",outline:"none",transition:"all 0.15s",color:C.rText }}
                    onFocus={e => { e.target.style.borderColor=C.cyan; e.target.style.boxShadow=`0 0 0 3px ${C.cyanSoft}`; }}
                    onBlur={e  => { e.target.style.borderColor=C.rBorder; e.target.style.boxShadow="none"; }}
                  />
                  <button type="button" onClick={() => void handleVerifyOtp()}
                    disabled={verifyLoading || otpLockSeconds > 0}
                    style={{ padding:"8px 14px",borderRadius:"8px",border:"none",fontSize:"0.81rem",fontWeight:700,cursor:"pointer",whiteSpace:"nowrap",
                      background: (verifyLoading || otpLockSeconds > 0) ? "rgba(6,182,212,0.35)" : `linear-gradient(135deg,${C.cyan},${C.cyanMid})`,
                      color:"#fff",transition:"all 0.2s",display:"flex",alignItems:"center",gap:"4px" }}>
                    {verifyLoading ? <><span style={{ width:"12px",height:"12px",border:"2px solid rgba(255,255,255,0.4)",borderTopColor:"#fff",borderRadius:"50%",animation:"saaszo-spin 0.7s linear infinite" }}/> …</>
                      : otpLockSeconds > 0 ? `Wait ${otpLockSeconds}s` : "Verify"}
                  </button>
                </div>
              )}

              {/* OTP messages */}
              {otpNotice && (
                <p style={{ margin:0,fontSize:"0.75rem",fontWeight:600,color: emailVerified ? "#16a34a" : C.cyanMid,lineHeight:1.4 }}>{otpNotice}</p>
              )}
              {otpError && (
                <p style={{ margin:0,fontSize:"0.75rem",fontWeight:600,color:"#dc2626",lineHeight:1.4 }}>{otpError}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <div style={{ position:"relative" }}>
                <svg style={{ position:"absolute",left:"10px",top:"50%",transform:"translateY(-50%)",color:"#94a3b8",pointerEvents:"none" }} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                <input type={showPassword ? "text" : "password"} placeholder="Create a password" value={password}
                  onChange={e => setPassword(e.target.value)} required
                  style={{ ...inputBase, paddingRight:"36px",
                    borderColor: password.length > 0 && !passwordMeetsRequirements(password) ? "#f97316" : C.rBorder }}
                  onFocus={onFocus} onBlur={onBlur} />
                <button type="button" onClick={() => setShowPassword(s => !s)}
                  style={{ position:"absolute",right:"9px",top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",padding:0,display:"flex",alignItems:"center",color:"#94a3b8" }}>
                  <EyeIcon show={showPassword}/>
                </button>
              </div>
              <PasswordStrength password={password}/>
            </div>

            {/* Legal */}
            <label style={{ display:"flex",alignItems:"flex-start",gap:"9px",padding:"9px 10px",borderRadius:"9px",border:`1px solid ${C.rBorder}`,background:"#f9fafb",cursor:"pointer",fontSize:"0.77rem",color:C.rMuted,lineHeight:1.5 }}>
              <div style={{ position:"relative",flexShrink:0,marginTop:"1px" }}>
                <input type="checkbox" checked={acceptedLegal} onChange={e => setAcceptedLegal(e.target.checked)}
                  style={{ width:"15px",height:"15px",accentColor:C.cyan,cursor:"pointer" }}/>
              </div>
              <span>
                I agree to SaaSzo&apos;s{" "}
                <Link href="/terms" style={{ fontWeight:700,color:C.cyanMid,textDecoration:"none" }}>Terms of Service</Link>
                {" "}and{" "}
                <Link href="/privacy" style={{ fontWeight:700,color:C.cyanMid,textDecoration:"none" }}>Privacy Policy</Link>.
              </span>
            </label>

            {/* Submit */}
            <button type="submit" disabled={isLoading || !emailVerified || !acceptedLegal}
              style={{ ...cyanBtn, opacity: (isLoading || !emailVerified || !acceptedLegal) ? 0.6 : 1,
                cursor: (isLoading || !emailVerified || !acceptedLegal) ? "not-allowed" : "pointer" }}
              onMouseEnter={(e) => { if(!isLoading && emailVerified && acceptedLegal) { const b=e.currentTarget as HTMLElement; b.style.boxShadow=`0 6px 22px ${C.cyanGlow}`; b.style.transform="translateY(-1px)"; } }}
              onMouseLeave={(e) => { const b=e.currentTarget as HTMLElement; b.style.boxShadow=`0 2px 12px ${C.cyanGlow}`; b.style.transform="translateY(0)"; }}>
              {isLoading
                ? <><span style={{ width:"16px",height:"16px",border:"2px solid rgba(255,255,255,0.3)",borderTopColor:"#fff",borderRadius:"50%",animation:"saaszo-spin 0.7s linear infinite" }}/> Creating Account…</>
                : !emailVerified ? "Verify Email First"
                : "Create My Account →"}
            </button>
          </form>

          {/* Already have account */}
          <div style={{ marginTop:"14px",paddingTop:"12px",borderTop:"1px solid rgba(0,0,0,0.05)",display:"flex",alignItems:"center",justifyContent:"space-between",gap:"8px" }}>
            <p style={{ margin:0,fontSize:"0.78rem",color:C.rMuted }}>Already have an account?</p>
            <Link href="/auth"
              style={{ display:"inline-flex",alignItems:"center",gap:"5px",padding:"7px 13px",borderRadius:"8px",border:`1px solid ${C.cyanBrd}`,background:C.cyanSoft,color:C.cyanMid,fontSize:"0.8rem",fontWeight:700,textDecoration:"none",transition:"all 0.18s" }}
              onMouseEnter={e => { const a=e.currentTarget; a.style.background="rgba(6,182,212,0.15)"; a.style.borderColor="rgba(6,182,212,0.35)"; }}
              onMouseLeave={e => { const a=e.currentTarget; a.style.background=C.cyanSoft; a.style.borderColor=C.cyanBrd; }}>
              Sign in
            </Link>
          </div>
        </div>

        {/* Trust badges */}
        <div style={{ marginTop:"12px",display:"flex",alignItems:"center",gap:"14px",flexWrap:"wrap",justifyContent:"center" }}>
          {["SSL Secured","GDPR Ready","Free Forever"].map(b => (
            <div key={b} style={{ display:"flex",alignItems:"center",gap:"4px",fontSize:"0.67rem",fontWeight:700,color:"#94a3b8" }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={C.cyan} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              {b}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes saaszo-spin { to { transform: rotate(360deg); } }
        @media (max-width: 1024px) {
          .saaszo-reg-hero { display: none !important; }
          .saaszo-reg-mobile-logo { display: flex !important; }
        }
        @media (min-width: 1025px) {
          .saaszo-reg-mobile-logo { display: none !important; }
        }
      `}</style>
    </div>
  );
}

export default function Register() {
  return <Suspense><RegisterForm /></Suspense>;
}
