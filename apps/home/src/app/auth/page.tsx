"use client";
import React, { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { appConfig } from "@/lib/config";
import { useAuthSession } from "@/components/AuthProvider";
import { toSafeAppPath, resolveSafeRedirectTarget } from "@/lib/utils";
import type { ConfirmationResult, RecaptchaVerifier } from "firebase/auth";

/* ─── Design tokens — Black + Cyan ─── */
const C = {
  black:    "#08090a",
  cyan:     "#06b6d4",
  cyanMid:  "#0891b2",
  cyanGlow: "rgba(6,182,212,0.22)",
  cyanSoft: "rgba(6,182,212,0.1)",
  cyanBrd:  "rgba(6,182,212,0.2)",
  white:    "#ffffff",
  muted:    "rgba(255,255,255,0.48)",
  subtle:   "rgba(255,255,255,0.08)",
  rBg:     "#f6f8fa",
  rCard:   "#ffffff",
  rText:   "#09090b",
  rMuted:  "#64748b",
  rBorder: "rgba(9,9,11,0.09)",
};

/* ─── Country codes ─── */
const COUNTRIES = [
  { flag:"🇮🇳", code:"+91",  iso:"IN" },
  { flag:"🇺🇸", code:"+1",   iso:"US" },
  { flag:"🇬🇧", code:"+44",  iso:"GB" },
  { flag:"🇦🇪", code:"+971", iso:"AE" },
  { flag:"🇸🇬", code:"+65",  iso:"SG" },
  { flag:"🇦🇺", code:"+61",  iso:"AU" },
  { flag:"🇨🇦", code:"+1",   iso:"CA" },
];

/* ─── Firebase error mapper ─── */
function mapFirebasePhoneError(err: any): string {
  const code: string = err?.code ?? "";
  if (code.includes("invalid-phone-number"))    return "Invalid phone number. Include country code.";
  if (code.includes("too-many-requests"))        return "Too many attempts. Please wait a few minutes.";
  if (code.includes("invalid-verification-code"))return "Incorrect OTP. Please try again.";
  if (code.includes("code-expired"))             return "OTP expired. Please request a new one.";
  if (code.includes("quota-exceeded"))           return "SMS quota exceeded. Try email login.";
  if (code.includes("captcha"))                  return "Security check failed. Refresh and try again.";
  return err?.message ?? "Something went wrong. Please try again.";
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

type AuthTab   = "email" | "google" | "phone";
type PhoneStep = "enter" | "otp" | "success";

function AuthForm() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const {
    authenticated, loading: sessionLoading,
    signInWithGoogle, signInWithEmail, postAuthRedirect,
    setupRecaptcha, sendPhoneOtp,
  } = useAuthSession();

  /* ── Main tab state ── */
  const [activeTab, setActiveTab]       = useState<AuthTab>("email");
  const [tabAnimating, setTabAnimating] = useState(false);

  /* ── Email state ── */
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [showPass, setShowPass]   = useState(false);

  /* ── Phone OTP state ── */
  const [phoneStep, setPhoneStep]                   = useState<PhoneStep>("enter");
  const [countryCode, setCountryCode]               = useState("+91");
  const [phoneNum, setPhoneNum]                     = useState("");
  const [otp, setOtp]                               = useState(["","","","","",""]);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [recaptchaVerifier, setRecaptchaVerifier]   = useState<RecaptchaVerifier | null>(null);
  const [resendTimer, setResendTimer]               = useState(0);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  /* ── Shared state ── */
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  /* ── Hero features ── */
  const FEATURES = [
    {
      icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={C.cyan} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
      title: "All-in-one Toolkit",
      desc: "Invoice, tasks, CRM, HRMS — one workspace.",
    },
    {
      icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={C.cyan} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>,
      title: "Enterprise Security",
      desc: "End-to-end encryption, MFA, SOC2-ready.",
    },
    {
      icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={C.cyan} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
      title: "AI-powered Analytics",
      desc: "Real-time insights from your business data.",
    },
  ];

  /* ── Redirect when already logged in ── */
  useEffect(() => {
    const ep = searchParams.get("email"); if (ep) setEmail(ep);
    if (searchParams.get("registered") === "true") setSuccessMsg("Account created! Sign in below.");
  }, [searchParams]);

  useEffect(() => {
    if (!sessionLoading && authenticated)
      // Use resolveSafeRedirectTarget (not toSafeAppPath) so cross-origin
      // saaszo.in redirects (e.g. task.saaszo.in/auth-bridge?...) are honoured
      // after a portal login that was initiated from a product app.
      router.replace(resolveSafeRedirectTarget(postAuthRedirect, appConfig.appUrl));
  }, [authenticated, postAuthRedirect, router, sessionLoading]);

  /* ── Resend countdown ── */
  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setInterval(() => setResendTimer((c) => (c > 0 ? c - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [resendTimer > 0]);

  /* ── Cleanup recaptcha ── */
  useEffect(() => {
    return () => { try { recaptchaVerifier?.clear(); } catch {} };
  }, [recaptchaVerifier]);

  function switchTab(tab: AuthTab) {
    if (tab === activeTab || tabAnimating) return;
    setTabAnimating(true);
    setError(""); setSuccessMsg("");
    // reset phone flow when leaving
    if (tab !== "phone") { setPhoneStep("enter"); setPhoneNum(""); setOtp(["","","","","",""]); }
    setTimeout(() => { setActiveTab(tab); setTabAnimating(false); }, 150);
  }

  /* ── Email submit ── */
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); if (isLoading) return;
    setIsLoading(true); setError("");
    try { await signInWithEmail(email, password); }
    catch (err: any) { setError(err?.message || "Authentication failed. Try again."); }
    finally { setIsLoading(false); }
  };

  /* ── Google ── */
  const handleGoogleSignIn = async () => {
    if (isLoading) return; setIsLoading(true); setError("");
    try { await signInWithGoogle(); }
    catch (err: any) { setError(err?.message || "Google sign-in failed. Try again."); }
    finally { setIsLoading(false); }
  };

  /* ── Phone: ensure recaptcha ── */
  const ensureRecaptcha = async () => {
    if (recaptchaVerifier) return recaptchaVerifier;
    const verifier = setupRecaptcha("phone-recaptcha-inline", { size: "invisible" });
    await verifier.render();
    setRecaptchaVerifier(verifier);
    return verifier;
  };

  /* ── Phone: send OTP ── */
  const handleSendOtp = async () => {
    if (isLoading) return;
    const digits = phoneNum.replace(/\D/g, "");
    if (digits.length < 6) { setError("Please enter a valid phone number."); return; }
    setIsLoading(true); setError("");
    try {
      const verifier = await ensureRecaptcha();
      const result   = await sendPhoneOtp(`${countryCode}${digits}`, verifier);
      setConfirmationResult(result);
      setOtp(["","","","","",""]);
      setResendTimer(60);
      setPhoneStep("otp");
    } catch (err: any) {
      setError(mapFirebasePhoneError(err));
      try { recaptchaVerifier?.clear(); } catch {}
      setRecaptchaVerifier(null);
    } finally { setIsLoading(false); }
  };

  /* ── Phone: verify OTP ── */
  const handleVerifyOtp = async () => {
    if (isLoading || !confirmationResult) return;
    const code = otp.join("");
    if (code.length < 6) { setError("Please enter all 6 digits."); return; }
    setIsLoading(true); setError("");
    try {
      await confirmationResult.confirm(code);
      // onIdTokenChanged in AuthProvider will sync + redirect
      setPhoneStep("success");
    } catch (err: any) {
      setError(mapFirebasePhoneError(err));
    } finally { setIsLoading(false); }
  };

  /* ── OTP input key handling ── */
  const handleOtpKey = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (otp[idx]) {
        const n = [...otp]; n[idx] = ""; setOtp(n);
      } else if (idx > 0) {
        otpRefs.current[idx - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft"  && idx > 0) otpRefs.current[idx - 1]?.focus();
    else if   (e.key === "ArrowRight" && idx < 5) otpRefs.current[idx + 1]?.focus();
    else if   (e.key === "Enter" && otp.join("").length === 6) handleVerifyOtp();
  };

  const handleOtpChange = (idx: number, val: string) => {
    const digit = val.replace(/\D/g, "").slice(-1);
    const n = [...otp]; n[idx] = digit; setOtp(n);
    if (digit && idx < 5) setTimeout(() => otpRefs.current[idx + 1]?.focus(), 10);
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (text.length > 0) {
      const n = Array(6).fill("").map((_, i) => text[i] ?? "");
      setOtp(n);
      e.preventDefault();
      setTimeout(() => otpRefs.current[Math.min(text.length, 5)]?.focus(), 10);
    }
  };

  /* ── Shared input style ── */
  const inputBase: React.CSSProperties = {
    width: "100%", padding: "9px 12px 9px 34px",
    borderRadius: "9px", border: `1px solid ${C.rBorder}`,
    background: "#f9fafb", fontSize: "0.88rem", color: C.rText,
    outline: "none", boxSizing: "border-box",
    transition: "border-color 0.15s, box-shadow 0.15s",
  };
  const cyanBtn: React.CSSProperties = {
    width: "100%", padding: "11px", borderRadius: "10px", border: "none",
    background: `linear-gradient(135deg, ${C.cyan}, ${C.cyanMid})`,
    color: C.white, fontSize: "0.9rem", fontWeight: 700,
    cursor: isLoading ? "not-allowed" : "pointer",
    opacity: isLoading ? 0.72 : 1,
    boxShadow: `0 2px 12px ${C.cyanGlow}`,
    transition: "all 0.2s ease",
    display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
  };

  /* ── Phone tab inner UI ── */
  const renderPhoneTab = () => {
    /* SUCCESS */
    if (phoneStep === "success") {
      return (
        <div style={{ textAlign:"center",padding:"10px 0 6px" }}>
          <div style={{ width:"52px",height:"52px",borderRadius:"50%",background:`rgba(6,182,212,0.1)`,border:`1.5px solid ${C.cyanBrd}`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={C.cyan} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <h3 style={{ margin:"0 0 6px",fontSize:"1.1rem",fontWeight:800,color:C.rText }}>Verified!</h3>
          <p style={{ margin:0,fontSize:"0.82rem",color:C.rMuted }}>Signing you in to SaaSzo…</p>
          <div style={{ margin:"14px auto 0",width:"24px",height:"24px",border:`2.5px solid ${C.cyanSoft}`,borderTopColor:C.cyan,borderRadius:"50%",animation:"saaszo-spin 0.8s linear infinite" }}/>
        </div>
      );
    }

    /* OTP ENTRY */
    if (phoneStep === "otp") {
      return (
        <div style={{ display:"flex",flexDirection:"column",gap:"14px" }}>
          {/* Header */}
          <div>
            <button onClick={() => { setPhoneStep("enter"); setError(""); }} style={{ background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:"5px",fontSize:"0.75rem",fontWeight:600,color:C.rMuted,padding:"0 0 6px",marginBottom:"4px" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
              Change number
            </button>
            <p style={{ margin:0,fontSize:"0.83rem",color:C.rText,fontWeight:600 }}>
              OTP sent to{" "}
              <span style={{ color:C.cyanMid }}>{countryCode} {phoneNum}</span>
            </p>
            <p style={{ margin:"2px 0 0",fontSize:"0.76rem",color:C.rMuted }}>Enter the 6-digit code below</p>
          </div>

          {/* OTP boxes */}
          <div style={{ display:"flex",gap:"7px",justifyContent:"center" }} onPaste={handleOtpPaste}>
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => { otpRefs.current[idx] = el; }}
                type="text" inputMode="numeric" maxLength={2}
                value={digit}
                onChange={(e) => handleOtpChange(idx, e.target.value)}
                onKeyDown={(e) => handleOtpKey(idx, e)}
                onFocus={(e) => { e.target.select(); e.target.style.borderColor=C.cyan; e.target.style.boxShadow=`0 0 0 3px ${C.cyanSoft}`; }}
                onBlur={(e)  => { e.target.style.borderColor=digit?C.cyan:C.rBorder; e.target.style.boxShadow="none"; }}
                style={{ width:"40px",height:"46px",textAlign:"center",fontSize:"1.25rem",fontWeight:800,borderRadius:"9px",border:`2px solid ${digit?C.cyan:C.rBorder}`,background:digit?`rgba(6,182,212,0.04)`:"#f9fafb",color:C.rText,outline:"none",transition:"all 0.15s",caretColor:C.cyan }}
              />
            ))}
          </div>

          {/* Verify button */}
          <button onClick={handleVerifyOtp} disabled={isLoading || otp.join("").length < 6}
            style={{ ...cyanBtn, opacity: (isLoading || otp.join("").length < 6) ? 0.65 : 1 }}
            onMouseEnter={(e) => { if(!isLoading) { (e.currentTarget as HTMLElement).style.boxShadow=`0 6px 22px ${C.cyanGlow}`; (e.currentTarget as HTMLElement).style.transform="translateY(-1px)"; } }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow=`0 2px 12px ${C.cyanGlow}`; (e.currentTarget as HTMLElement).style.transform="translateY(0)"; }}>
            {isLoading ? (
              <><span style={{ width:"16px",height:"16px",border:`2px solid rgba(255,255,255,0.3)`,borderTopColor:"#fff",borderRadius:"50%",animation:"saaszo-spin 0.7s linear infinite" }}/> Verifying…</>
            ) : "Verify OTP"}
          </button>

          {/* Resend */}
          <div style={{ textAlign:"center" }}>
            {resendTimer > 0 ? (
              <p style={{ margin:0,fontSize:"0.76rem",color:C.rMuted }}>
                Resend in <span style={{ fontWeight:700,color:C.cyanMid }}>{resendTimer}s</span>
              </p>
            ) : (
              <button onClick={handleSendOtp} disabled={isLoading}
                style={{ background:"none",border:"none",cursor:"pointer",fontSize:"0.76rem",fontWeight:700,color:C.cyanMid,padding:0 }}>
                Resend OTP
              </button>
            )}
          </div>
          {/* Hidden recaptcha */}
          <div id="phone-recaptcha-inline" style={{ display:"none" }}/>
        </div>
      );
    }

    /* PHONE ENTRY (default) */
    return (
      <div style={{ display:"flex",flexDirection:"column",gap:"12px" }}>
        <div>
          <label style={{ fontSize:"0.71rem",fontWeight:700,color:"#374151",textTransform:"uppercase",letterSpacing:"0.07em",display:"block",marginBottom:"6px" }}>
            Mobile Number
          </label>
          <div style={{ display:"flex",gap:"8px" }}>
            {/* Country code */}
            <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              style={{ flexShrink:0,padding:"9px 8px",borderRadius:"9px",border:`1px solid ${C.rBorder}`,background:"#f9fafb",fontSize:"0.85rem",color:C.rText,outline:"none",cursor:"pointer",fontFamily:"inherit" }}>
              {COUNTRIES.map((c) => (
                <option key={c.iso} value={c.code}>{c.flag} {c.code}</option>
              ))}
            </select>
            {/* Number */}
            <div style={{ position:"relative",flex:1 }}>
              <svg style={{ position:"absolute",left:"10px",top:"50%",transform:"translateY(-50%)",color:"#94a3b8",pointerEvents:"none" }} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
              <input
                type="tel" placeholder="98765 43210"
                value={phoneNum} onChange={(e) => setPhoneNum(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
                style={{ ...inputBase, padding:"9px 12px 9px 32px" }}
                onFocus={(e) => { e.target.style.borderColor=C.cyan; e.target.style.boxShadow=`0 0 0 3px ${C.cyanSoft}`; e.target.style.background="#fff"; }}
                onBlur={(e)  => { e.target.style.borderColor=C.rBorder; e.target.style.boxShadow="none"; e.target.style.background="#f9fafb"; }}
              />
            </div>
          </div>
        </div>

        {/* Send OTP button */}
        <button onClick={handleSendOtp} disabled={isLoading}
          style={{ ...cyanBtn }}
          onMouseEnter={(e) => { if(!isLoading) { (e.currentTarget as HTMLElement).style.boxShadow=`0 6px 22px ${C.cyanGlow}`; (e.currentTarget as HTMLElement).style.transform="translateY(-1px)"; } }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow=`0 2px 12px ${C.cyanGlow}`; (e.currentTarget as HTMLElement).style.transform="translateY(0)"; }}>
          {isLoading ? (
            <><span style={{ width:"16px",height:"16px",border:`2px solid rgba(255,255,255,0.3)`,borderTopColor:"#fff",borderRadius:"50%",animation:"saaszo-spin 0.7s linear infinite" }}/> Sending OTP…</>
          ) : (
            <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> Send OTP</>
          )}
        </button>
        <p style={{ margin:0,textAlign:"center",fontSize:"0.72rem",color:"#94a3b8" }}>Protected by invisible reCAPTCHA</p>
        {/* Hidden recaptcha container */}
        <div id="phone-recaptcha-inline" style={{ display:"none" }}/>
      </div>
    );
  };

  return (
    <div style={{ height:"100vh", width:"100%", display:"flex", fontFamily:"'Inter',system-ui,sans-serif", overflow:"hidden" }}>

      {/* ═══ LEFT HERO — Black + Cyan ════════════════════════════ */}
      <div className="saaszo-auth-hero" style={{ width:"50%",flexShrink:0,display:"flex",flexDirection:"column",position:"relative",overflow:"hidden",background:C.black }}>
        {/* Cyan glow orbs */}
        <div style={{ position:"absolute",top:"-80px",left:"20%",width:"340px",height:"340px",borderRadius:"50%",background:`radial-gradient(circle,rgba(6,182,212,0.18) 0%,transparent 65%)`,pointerEvents:"none" }}/>
        <div style={{ position:"absolute",bottom:"-100px",right:"-60px",width:"380px",height:"380px",borderRadius:"50%",background:`radial-gradient(circle,rgba(6,182,212,0.1) 0%,transparent 65%)`,pointerEvents:"none" }}/>
        <div style={{ position:"absolute",top:"55%",left:"-40px",width:"200px",height:"200px",borderRadius:"50%",background:`radial-gradient(circle,rgba(6,182,212,0.07) 0%,transparent 70%)`,pointerEvents:"none" }}/>
        {/* Dot grid */}
        <div style={{ position:"absolute",inset:0,backgroundImage:"radial-gradient(rgba(6,182,212,0.18) 1px,transparent 1px)",backgroundSize:"28px 28px",opacity:0.6,pointerEvents:"none" }}/>
        {/* Cyan top bar */}
        <div style={{ position:"absolute",top:0,left:0,right:0,height:"1.5px",background:`linear-gradient(90deg,transparent,${C.cyan},transparent)`,opacity:0.8 }}/>

        <div style={{ position:"relative",zIndex:10,display:"flex",flexDirection:"column",height:"100%",padding:"32px 44px" }}>
          {/* Logo */}
          <div style={{ display:"flex",alignItems:"center",gap:"10px",marginBottom:"auto" }}>
            <div style={{ width:"34px",height:"34px",borderRadius:"9px",background:`linear-gradient(135deg,${C.cyan},${C.cyanMid})`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:"15px",color:C.black,boxShadow:`0 0 18px ${C.cyanGlow}` }}>S</div>
            <span style={{ fontSize:"1.2rem",fontWeight:800,color:C.white,letterSpacing:"-0.02em" }}>SaaSzo</span>
            <span style={{ marginLeft:"2px",fontSize:"0.6rem",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:C.cyan,border:`1px solid ${C.cyanBrd}`,borderRadius:"4px",padding:"2px 5px" }}>CENTRAL</span>
          </div>

          {/* Copy */}
          <div style={{ flex:1,display:"flex",flexDirection:"column",justifyContent:"center",gap:"22px" }}>
            <div>
              <p style={{ margin:"0 0 10px",fontSize:"0.67rem",fontWeight:700,letterSpacing:"0.14em",textTransform:"uppercase",color:C.cyan }}>Command Portal · SaaSzo</p>
              <h1 style={{ margin:"0 0 12px",fontSize:"clamp(1.8rem,2.8vw,2.55rem)",fontWeight:900,color:C.white,lineHeight:1.12,letterSpacing:"-0.03em",maxWidth:"15ch" }}>
                The operating{" "}<span style={{ color:C.cyan }}>system</span>{" "}for modern business.
              </h1>
              <p style={{ margin:0,fontSize:"0.87rem",color:C.muted,lineHeight:1.65,maxWidth:"32ch" }}>
                One login. Unified identity across every SaaSzo product — invoice, tasks, HR, CRM, and beyond.
              </p>
            </div>
            <div style={{ display:"flex",flexDirection:"column",gap:"9px" }}>
              {FEATURES.map((f) => (
                <div key={f.title} style={{ display:"flex",alignItems:"center",gap:"12px",background:`rgba(6,182,212,0.06)`,border:`1px solid rgba(6,182,212,0.15)`,borderRadius:"11px",padding:"11px 14px" }}>
                  <div style={{ width:"32px",height:"32px",borderRadius:"8px",background:`rgba(6,182,212,0.1)`,border:`1px solid rgba(6,182,212,0.2)`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>{f.icon}</div>
                  <div>
                    <p style={{ margin:"0 0 1px",fontSize:"0.82rem",fontWeight:700,color:C.white }}>{f.title}</p>
                    <p style={{ margin:0,fontSize:"0.72rem",color:C.muted,lineHeight:1.4 }}>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display:"flex",gap:"24px" }}>
              {[["10K+","Businesses"],["99.9%","Uptime"],["<50ms","Response"]].map(([val,lbl]) => (
                <div key={lbl}>
                  <p style={{ margin:"0 0 1px",fontSize:"1.1rem",fontWeight:800,color:C.cyan,letterSpacing:"-0.02em" }}>{val}</p>
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

      {/* ═══ RIGHT FORM PANEL ═══════════════════════════════════ */}
      <div style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"24px 28px",background:C.rBg,overflow:"hidden",minWidth:0 }}>

        {/* Mobile logo */}
        <div className="saaszo-auth-mobile-logo" style={{ display:"flex",alignItems:"center",gap:"8px",marginBottom:"14px" }}>
          <div style={{ width:"30px",height:"30px",borderRadius:"8px",background:`linear-gradient(135deg,${C.cyan},${C.cyanMid})`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,color:C.black,fontSize:"13px" }}>S</div>
          <span style={{ fontSize:"1rem",fontWeight:800,color:C.black,letterSpacing:"-0.02em" }}>SaaSzo</span>
        </div>

        {/* Card */}
        <div style={{ width:"100%",maxWidth:"418px",background:C.rCard,borderRadius:"18px",boxShadow:"0 4px 24px rgba(0,0,0,0.07),0 1px 3px rgba(0,0,0,0.04)",border:"1px solid rgba(0,0,0,0.06)",padding:"24px 26px 20px" }}>

          {/* Card header */}
          <div style={{ marginBottom:"16px" }}>
            <div style={{ display:"flex",alignItems:"center",gap:"7px",marginBottom:"6px" }}>
              <div style={{ width:"7px",height:"7px",borderRadius:"50%",background:C.cyan,boxShadow:`0 0 6px ${C.cyanGlow}` }}/>
              <p style={{ margin:0,fontSize:"0.67rem",fontWeight:700,letterSpacing:"0.13em",textTransform:"uppercase",color:C.rMuted }}>
                {phoneStep==="otp" ? "OTP Verification" : phoneStep==="success" ? "Success" : "Sign In"}
              </p>
            </div>
            <h2 style={{ margin:"0 0 3px",fontSize:"1.45rem",fontWeight:800,color:C.rText,letterSpacing:"-0.025em",lineHeight:1.18 }}>
              {phoneStep==="otp" ? "Enter your OTP" : phoneStep==="success" ? "You're in!" : "Welcome back"}
            </h2>
            {phoneStep==="enter" && <p style={{ margin:0,fontSize:"0.81rem",color:C.rMuted }}>Access your unified SaaSzo workspace.</p>}
          </div>

          {/* Alerts */}
          {successMsg && (
            <div style={{ marginBottom:"12px",padding:"9px 12px",borderRadius:"8px",background:"rgba(34,197,94,0.08)",border:"1px solid rgba(34,197,94,0.2)",display:"flex",alignItems:"center",gap:"7px",fontSize:"0.79rem",color:"#16a34a",fontWeight:600 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              {successMsg}
            </div>
          )}
          {error && (
            <div style={{ marginBottom:"12px",padding:"9px 12px",borderRadius:"8px",background:"rgba(239,68,68,0.07)",border:"1px solid rgba(239,68,68,0.18)",display:"flex",alignItems:"flex-start",gap:"7px",fontSize:"0.79rem",color:"#dc2626",fontWeight:500,lineHeight:1.4 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink:0,marginTop:"1px" }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {error}
            </div>
          )}

          {/* Tabs — only show for enter step or non-phone tabs */}
          {phoneStep === "enter" && (
            <div style={{ display:"flex",background:"#f1f5f9",borderRadius:"10px",padding:"3px",marginBottom:"16px",gap:"2px" }}>
              {(["email","google","phone"] as AuthTab[]).map((t) => (
                <button key={t} onClick={() => switchTab(t)}
                  style={{ flex:1,padding:"7px 4px",borderRadius:"8px",border:"none",fontSize:"0.77rem",fontWeight:activeTab===t?700:500,cursor:"pointer",whiteSpace:"nowrap",transition:"all 0.18s ease",
                    background: activeTab===t ? C.rCard : "transparent",
                    color:       activeTab===t ? C.rText : C.rMuted,
                    boxShadow:   activeTab===t ? "0 1px 4px rgba(0,0,0,0.08),0 0 0 1px rgba(0,0,0,0.04)" : "none",
                  }}>
                  {t === "email" ? "Email" : t === "google" ? "Google" : "Mobile OTP"}
                </button>
              ))}
            </div>
          )}

          {/* Tab body — animated */}
          <div style={{ opacity:tabAnimating?0:1,transform:tabAnimating?"translateY(5px)":"translateY(0)",transition:"opacity 0.15s,transform 0.15s" }}>

            {/* EMAIL */}
            {activeTab === "email" && (
              <form onSubmit={handleEmailSubmit} style={{ display:"flex",flexDirection:"column",gap:"10px" }}>
                <div style={{ display:"flex",flexDirection:"column",gap:"4px" }}>
                  <label style={{ fontSize:"0.71rem",fontWeight:700,color:"#374151",textTransform:"uppercase",letterSpacing:"0.07em" }}>Email</label>
                  <div style={{ position:"relative" }}>
                    <svg style={{ position:"absolute",left:"10px",top:"50%",transform:"translateY(-50%)",color:"#94a3b8",pointerEvents:"none" }} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    <input type="email" placeholder="name@company.com" value={email} onChange={(e) => setEmail(e.target.value)} required style={inputBase}
                      onFocus={(e) => { e.target.style.borderColor=C.cyan; e.target.style.boxShadow=`0 0 0 3px ${C.cyanSoft}`; e.target.style.background="#fff"; }}
                      onBlur={(e)  => { e.target.style.borderColor=C.rBorder; e.target.style.boxShadow="none"; e.target.style.background="#f9fafb"; }} />
                  </div>
                </div>
                <div style={{ display:"flex",flexDirection:"column",gap:"4px" }}>
                  <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                    <label style={{ fontSize:"0.71rem",fontWeight:700,color:"#374151",textTransform:"uppercase",letterSpacing:"0.07em" }}>Password</label>
                    <Link href="/auth/forgot-password" style={{ fontSize:"0.73rem",fontWeight:700,color:C.cyanMid,textDecoration:"none" }}>Forgot?</Link>
                  </div>
                  <div style={{ position:"relative" }}>
                    <svg style={{ position:"absolute",left:"10px",top:"50%",transform:"translateY(-50%)",color:"#94a3b8",pointerEvents:"none" }} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                    <input type={showPass?"text":"password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ ...inputBase, paddingRight:"34px" }}
                      onFocus={(e) => { e.target.style.borderColor=C.cyan; e.target.style.boxShadow=`0 0 0 3px ${C.cyanSoft}`; e.target.style.background="#fff"; }}
                      onBlur={(e)  => { e.target.style.borderColor=C.rBorder; e.target.style.boxShadow="none"; e.target.style.background="#f9fafb"; }} />
                    <button type="button" onClick={() => setShowPass(!showPass)} style={{ position:"absolute",right:"9px",top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",padding:0,display:"flex",alignItems:"center",color:"#94a3b8" }}><EyeIcon show={showPass}/></button>
                  </div>
                </div>
                <button type="submit" disabled={isLoading} style={{ ...cyanBtn, marginTop:"4px" }}
                  onMouseEnter={(e) => { if(!isLoading){(e.currentTarget as HTMLElement).style.boxShadow=`0 6px 22px ${C.cyanGlow}`;(e.currentTarget as HTMLElement).style.transform="translateY(-1px)";} }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow=`0 2px 12px ${C.cyanGlow}`;(e.currentTarget as HTMLElement).style.transform="translateY(0)"; }}>
                  {isLoading ? (
                    <><span style={{ width:"16px",height:"16px",border:"2px solid rgba(255,255,255,0.3)",borderTopColor:"#fff",borderRadius:"50%",animation:"saaszo-spin 0.7s linear infinite" }}/> Signing in…</>
                  ) : "Sign In with Email"}
                </button>
              </form>
            )}

            {/* GOOGLE */}
            {activeTab === "google" && (
              <div style={{ display:"flex",flexDirection:"column",gap:"12px",padding:"4px 0" }}>
                <div style={{ textAlign:"center",padding:"4px 0" }}>
                  <div style={{ width:"46px",height:"46px",borderRadius:"12px",background:"#f8f9fa",border:"1px solid #e2e8f0",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 9px" }}><GoogleIcon/></div>
                  <p style={{ margin:0,fontSize:"0.81rem",color:C.rMuted,lineHeight:1.5 }}>Sign in using your Google account — no password needed.</p>
                </div>
                <button type="button" onClick={handleGoogleSignIn} disabled={isLoading}
                  style={{ width:"100%",padding:"11px 14px",borderRadius:"10px",border:"1px solid #e2e8f0",background:"#fff",color:"#374151",fontSize:"0.9rem",fontWeight:700,cursor:isLoading?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:"8px",boxShadow:"0 1px 3px rgba(0,0,0,0.06)",transition:"all 0.2s ease" }}
                  onMouseEnter={(e) => { const b=e.currentTarget; b.style.boxShadow="0 3px 10px rgba(0,0,0,0.1)"; b.style.transform="translateY(-1px)"; }}
                  onMouseLeave={(e) => { const b=e.currentTarget; b.style.boxShadow="0 1px 3px rgba(0,0,0,0.06)"; b.style.transform="translateY(0)"; }}>
                  <GoogleIcon/>{isLoading ? "Signing in…" : "Continue with Google"}
                </button>
                <p style={{ margin:0,textAlign:"center",fontSize:"0.72rem",color:"#94a3b8" }}>You'll be redirected to Google to complete sign-in.</p>
              </div>
            )}

            {/* PHONE — inline flow */}
            {activeTab === "phone" && renderPhoneTab()}
          </div>

          {/* Footer row — hide during otp/success */}
          {phoneStep === "enter" && (
            <div style={{ marginTop:"16px",paddingTop:"14px",borderTop:"1px solid rgba(0,0,0,0.05)",display:"flex",alignItems:"center",justifyContent:"space-between",gap:"8px" }}>
              <p style={{ margin:0,fontSize:"0.78rem",color:C.rMuted }}>No account yet?</p>
              <Link href="/register"
                style={{ display:"inline-flex",alignItems:"center",gap:"5px",padding:"7px 13px",borderRadius:"8px",border:`1px solid ${C.cyanBrd}`,background:C.cyanSoft,color:C.cyanMid,fontSize:"0.8rem",fontWeight:700,textDecoration:"none",transition:"all 0.18s ease" }}
                onMouseEnter={(e) => { const a=e.currentTarget; a.style.background=`rgba(6,182,212,0.15)`; a.style.borderColor=`rgba(6,182,212,0.35)`; }}
                onMouseLeave={(e) => { const a=e.currentTarget; a.style.background=C.cyanSoft; a.style.borderColor=C.cyanBrd; }}>
                Create free account
              </Link>
            </div>
          )}
        </div>

        {/* Trust badges */}
        <div style={{ marginTop:"13px",display:"flex",alignItems:"center",gap:"14px",flexWrap:"wrap",justifyContent:"center" }}>
          {["SSL Secured","GDPR Ready","SOC2 Ready"].map((b) => (
            <div key={b} style={{ display:"flex",alignItems:"center",gap:"4px",fontSize:"0.67rem",fontWeight:700,color:"#94a3b8" }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={C.cyan} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              {b}
            </div>
          ))}
        </div>
        <p style={{ margin:"9px 0 0",textAlign:"center",fontSize:"0.67rem",color:"#b0bec8",lineHeight:1.5 }}>
          By continuing, you agree to our{" "}
          <Link href="/terms" style={{ color:"#94a3b8",textDecoration:"underline" }}>Terms</Link>{" "}and{" "}
          <Link href="/privacy" style={{ color:"#94a3b8",textDecoration:"underline" }}>Privacy Policy</Link>.
        </p>
      </div>

      <style>{`
        @keyframes saaszo-spin { to { transform: rotate(360deg); } }
        @media (max-width: 1024px) {
          .saaszo-auth-hero { display: none !important; }
          .saaszo-auth-mobile-logo { display: flex !important; }
        }
        @media (min-width: 1025px) {
          .saaszo-auth-mobile-logo { display: none !important; }
        }
      `}</style>
    </div>
  );
}

export default function UnifiedAuthHub() {
  return <Suspense><AuthForm /></Suspense>;
}
