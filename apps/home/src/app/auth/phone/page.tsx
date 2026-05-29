"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { appConfig } from "@/lib/config";
import { AUTH_COUNTRY_OPTIONS } from "@/lib/auth-utils";
import { useAuthSession } from "@/components/AuthProvider";
import { toSafeAppPath } from "@/lib/utils";
import { ConfirmationResult, RecaptchaVerifier } from "firebase/auth";

/* ─── Types ─────────────────────────────────────────────────── */
type Step = "phone" | "otp" | "success";
type AuthIntent = "signin" | "signup" | "recover";

function mapFirebasePhoneError(error: any) {
  const code = error.code || "";
  if (code === "auth/invalid-phone-number") return "Invalid phone number format.";
  if (code === "auth/too-many-requests") return "Too many requests. Please try again later.";
  if (code === "auth/captcha-check-failed") return "reCAPTCHA verification failed. Please try again.";
  if (code === "auth/invalid-verification-code") return "Invalid OTP code. Please check and try again.";
  if (code === "auth/code-expired") return "OTP code has expired. Please request a new one.";
  return error.message || "Phone verification failed.";
}

/* ─── Inline SVG icons ───────────────────────────────────────── */
function PhoneIcon({ size = 20, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>
    </svg>
  );
}
function ChevronDownIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  );
}
function ArrowBackIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
    </svg>
  );
}
function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
    </svg>
  );
}
function SendIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
    </svg>
  );
}
function CheckIcon({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
}
function SmsIcon({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
    </svg>
  );
}

/* ─── Left hero panel ─────────────────────────────────────────── */
const FEATURES = [
  {
    icon: <PhoneIcon size={20} color="rgba(255,255,255,0.9)" />,
    title: "Passwordless & Secure",
    desc: "No password to remember — just your phone number.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
    title: "Lightning Fast",
    desc: "OTP delivered in seconds via secure Firebase verification.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    title: "Military-grade Verification",
    desc: "Each OTP is single-use and validated before workspace access.",
  },
];

function HeroPanel() {
  return (
    <div
      style={{
        width: "50%", flexShrink: 0,
        display: "flex", flexDirection: "column",
        position: "relative", overflow: "hidden",
        background: "linear-gradient(145deg,#1a0533 0%,#2d1a6e 30%,#4648d4 65%,#6b38d4 100%)",
      }}
    >
      {/* Orbs */}
      <div style={{ position:"absolute",top:"-80px",right:"-80px",width:"350px",height:"350px",borderRadius:"50%",background:"radial-gradient(circle,rgba(192,193,255,0.2) 0%,transparent 70%)",pointerEvents:"none" }} />
      <div style={{ position:"absolute",bottom:"-100px",left:"-60px",width:"400px",height:"400px",borderRadius:"50%",background:"radial-gradient(circle,rgba(107,56,212,0.4) 0%,transparent 70%)",pointerEvents:"none" }} />
      <div style={{ position:"absolute",top:"50%",left:"25%",width:"220px",height:"220px",borderRadius:"50%",background:"radial-gradient(circle,rgba(255,255,255,0.06) 0%,transparent 70%)",pointerEvents:"none" }} />
      {/* Grid */}
      <div style={{ position:"absolute",inset:0,backgroundImage:"linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px)",backgroundSize:"40px 40px",pointerEvents:"none" }} />

      <div style={{ position:"relative",zIndex:10,display:"flex",flexDirection:"column",height:"100%",padding:"48px 52px 52px" }}>
        {/* Logo */}
        <div style={{ display:"flex",alignItems:"center",gap:"12px",marginBottom:"60px" }}>
          <div style={{ width:"38px",height:"38px",borderRadius:"10px",background:"rgba(255,255,255,0.15)",backdropFilter:"blur(8px)",border:"1px solid rgba(255,255,255,0.25)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:"18px",color:"#fff" }}>S</div>
          <span style={{ fontSize:"1.35rem",fontWeight:800,color:"#fff",letterSpacing:"-0.02em" }}>SaaSzo</span>
        </div>

        {/* Copy */}
        <div style={{ flex:1,display:"flex",flexDirection:"column",justifyContent:"center" }}>
          <p style={{ margin:"0 0 16px",fontSize:"0.72rem",fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:"rgba(255,255,255,0.6)" }}>
            MOBILE OTP · SAASZO
          </p>
          <h1 style={{ margin:"0 0 18px",fontSize:"clamp(1.9rem,3.2vw,2.9rem)",fontWeight:800,color:"#fff",lineHeight:1.15,letterSpacing:"-0.03em",maxWidth:"12ch" }}>
            One tap.<br />Full access.
          </h1>
          <p style={{ margin:"0 0 44px",fontSize:"0.95rem",color:"rgba(255,255,255,0.7)",lineHeight:1.65,maxWidth:"32ch" }}>
            Verify your identity in seconds with a one-time password sent directly to your mobile.
          </p>

          <div style={{ display:"flex",flexDirection:"column",gap:"14px" }}>
            {FEATURES.map((f) => (
              <div key={f.title} style={{ display:"flex",alignItems:"flex-start",gap:"14px",background:"rgba(255,255,255,0.08)",backdropFilter:"blur(12px)",WebkitBackdropFilter:"blur(12px)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:"14px",padding:"14px 18px" }}>
                <div style={{ width:"38px",height:"38px",borderRadius:"10px",background:"rgba(255,255,255,0.13)",border:"1px solid rgba(255,255,255,0.18)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                  {f.icon}
                </div>
                <div>
                  <p style={{ margin:"0 0 3px",fontSize:"0.88rem",fontWeight:700,color:"#fff" }}>{f.title}</p>
                  <p style={{ margin:0,fontSize:"0.78rem",color:"rgba(255,255,255,0.62)",lineHeight:1.5 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop:"40px" }}>
          <span style={{ fontSize:"0.72rem",color:"rgba(255,255,255,0.38)",fontWeight:600 }}>Part of the SaaSzo platform</span>
        </div>
      </div>
    </div>
  );
}

/* ─── Shared alert components ─────────────────────────────────── */
function ErrorAlert({ message }: { message: string }) {
  return (
    <div style={{ marginBottom:"18px",padding:"12px 14px",borderRadius:"10px",background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.22)",display:"flex",alignItems:"flex-start",gap:"8px",fontSize:"0.85rem",color:"#dc2626",fontWeight:500,lineHeight:1.5 }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink:0,marginTop:"2px" }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      {message}
    </div>
  );
}
function NoticeAlert({ message }: { message: string }) {
  return (
    <div style={{ marginBottom:"18px",padding:"12px 14px",borderRadius:"10px",background:"rgba(70,72,212,0.08)",border:"1px solid rgba(70,72,212,0.2)",display:"flex",alignItems:"center",gap:"8px",fontSize:"0.85rem",color:"#4648d4",fontWeight:500 }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink:0 }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
      {message}
    </div>
  );
}

/* ─── Main component ─────────────────────────────────────────── */
export default function PhoneOtpAuth() {
  const router = useRouter();
  const { authenticated, loading, setupRecaptcha, sendPhoneOtp, postAuthRedirect } = useAuthSession();

  const [step, setStep]                           = useState<Step>("phone");
  const [intent, setIntent]                       = useState<AuthIntent>("signin");
  const [countryCode, setCountryCode]             = useState("+91");
  const [phone, setPhone]                         = useState("");
  const [otp, setOtp]                             = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading]                 = useState(false);
  const [error, setError]                         = useState("");
  const [notice, setNotice]                       = useState("");
  const [resendTimer, setResendTimer]             = useState(0);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null);
  const [recaptchaSolved, setRecaptchaSolved]     = useState(false);
  const [verifyAttempts, setVerifyAttempts]       = useState(0);
  const [verifyLockSeconds, setVerifyLockSeconds] = useState(0);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const ri = params.get("intent");
    if (ri === "signin" || ri === "signup" || ri === "recover") setIntent(ri);
    const rc = params.get("countryCode"); if (rc) setCountryCode(rc);
    const rp = params.get("phone"); if (rp) setPhone(rp);
  }, []);

  useEffect(() => {
    if (resendTimer <= 0 && verifyLockSeconds <= 0) return;
    const t = window.setInterval(() => {
      setResendTimer((c) => (c > 0 ? c - 1 : c));
      setVerifyLockSeconds((c) => (c > 0 ? c - 1 : c));
    }, 1000);
    return () => window.clearInterval(t);
  }, [resendTimer > 0, verifyLockSeconds > 0]);

  useEffect(() => {
    if (verifyLockSeconds === 0 && verifyAttempts >= 5) {
      setVerifyAttempts(0);
      if (/too many incorrect otp attempts/i.test(error)) setError("");
    }
  }, [error, verifyAttempts, verifyLockSeconds]);

  useEffect(() => {
    return () => {
      if (recaptchaVerifier) { try { recaptchaVerifier.clear(); } catch { /* destroyed */ } }
    };
  }, [recaptchaVerifier]);

  useEffect(() => {
    if (!loading && authenticated) router.replace(toSafeAppPath(postAuthRedirect, appConfig.appUrl));
  }, [authenticated, loading, postAuthRedirect, router]);

  const ensureRecaptcha = async () => {
    if (recaptchaVerifier) return recaptchaVerifier;
    if (typeof window === "undefined") throw new Error("Must run in browser.");
    if (!document.getElementById("phone-otp-recaptcha-container"))
      throw new Error("Phone verification is still loading. Please try again.");
    const verifier = setupRecaptcha("phone-otp-recaptcha-container", {
      size: "invisible",
      onSolved: () => { setRecaptchaSolved(true); setError(""); },
      onExpired: () => { setRecaptchaSolved(false); setError("Security check expired. Tap Send OTP again."); },
    });
    await verifier.render();
    setRecaptchaVerifier(verifier);
    return verifier;
  };

  const requestPhoneOtp = async () => {
    setError(""); setNotice("");
    if (phone.trim().length < 6) { setError("Please enter a valid phone number."); return false; }
    const fullPhone = `${countryCode}${phone.replace(/\D/g, "")}`;
    setIsLoading(true);
    try {
      const verifier = await ensureRecaptcha();
      const result = await sendPhoneOtp(fullPhone, verifier);
      setConfirmationResult(result);
      setStep("otp");
      setOtp(["", "", "", "", "", ""]);
      setVerifyAttempts(0); setVerifyLockSeconds(0);
      setResendTimer(60);
      setNotice(`OTP sent to ${fullPhone}.`);
      return true;
    } catch (err: any) {
      setError(mapFirebasePhoneError(err));
      try { recaptchaVerifier?.clear(); } catch { /* destroyed */ }
      setRecaptchaVerifier(null); setRecaptchaSolved(false);
      return false;
    } finally { setIsLoading(false); }
  };

  const handleSendOtp = async (e: React.FormEvent) => { e.preventDefault(); await requestPhoneOtp(); };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault(); setError(""); setNotice("");
    const code = otp.join("");
    if (code.length !== 6) { setError("Please enter all 6 digits."); return; }
    if (verifyLockSeconds > 0) { setError(`Too many attempts. Wait ${verifyLockSeconds}s then request a new OTP.`); return; }
    if (!confirmationResult) { setError("Session expired. Please request a new OTP."); setStep("phone"); return; }
    setIsLoading(true);
    try {
      await confirmationResult.confirm(code);
      setVerifyAttempts(0); setVerifyLockSeconds(0);
      setStep("success");
    } catch (err: any) {
      const mapped = mapFirebasePhoneError(err);
      if (/invalid otp code/i.test(mapped)) {
        const next = verifyAttempts + 1;
        if (next >= 5) {
          setVerifyAttempts(5); setVerifyLockSeconds(60);
          setResendTimer((c) => Math.max(c, 60)); setConfirmationResult(null);
          setError("Too many incorrect OTP attempts. Wait 60s and request a new OTP.");
        } else {
          setVerifyAttempts(next);
          setError(`Incorrect OTP. ${5 - next} attempt${5 - next !== 1 ? "s" : ""} remaining.`);
        }
      } else { setError(mapped); }
    } finally { setIsLoading(false); }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...otp]; next[index] = value; setOtp(next);
    if (value && index < 5) otpInputRefs.current[index + 1]?.focus();
  };
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) otpInputRefs.current[index - 1]?.focus();
  };
  const handleOtpPaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length) {
      const next = [...otp];
      pasted.split("").forEach((ch, i) => { next[i] = ch; });
      setOtp(next);
      otpInputRefs.current[Math.min(pasted.length, 5)]?.focus();
      e.preventDefault();
    }
  };
  const handleResend = async () => {
    if (resendTimer > 0) return;
    setOtp(["", "", "", "", "", ""]); setError(""); setNotice("");
    setVerifyAttempts(0); setVerifyLockSeconds(0); setRecaptchaSolved(false);
    try { recaptchaVerifier?.clear(); } catch { /* destroyed */ }
    setRecaptchaVerifier(null);
    await requestPhoneOtp();
  };

  const isRecoverIntent = intent === "recover";
  const isSignupIntent  = intent === "signup";
  const primaryHeading  = isRecoverIntent ? "Recover with Mobile OTP" : isSignupIntent ? "Sign up with Mobile" : "Sign in with Mobile";
  const primaryDescription = isRecoverIntent
    ? "We'll verify your number and take you back into your workspace."
    : isSignupIntent
    ? "We'll send a 6-digit OTP to create and secure your mobile account."
    : "We'll send a 6-digit OTP to verify your number.";
  const submitLabel = isRecoverIntent ? "Send Recovery OTP" : isSignupIntent ? "Send Signup OTP" : "Send OTP";

  /* shared button style */
  const primaryBtn: React.CSSProperties = {
    width: "100%", padding: "13px", borderRadius: "12px", border: "none",
    background: "linear-gradient(135deg,#4648d4 0%,#6b38d4 100%)",
    color: "#fff", fontSize: "0.95rem", fontWeight: 700,
    cursor: isLoading ? "not-allowed" : "pointer",
    opacity: isLoading ? 0.75 : 1,
    boxShadow: "0 2px 8px rgba(70,72,212,0.3),0 6px 20px rgba(70,72,212,0.15)",
    transition: "all 0.2s ease", display: "flex", alignItems: "center",
    justifyContent: "center", gap: "8px", letterSpacing: "0.01em",
  };

  return (
    <div style={{ minHeight:"100vh",width:"100%",display:"flex",fontFamily:"'Inter',system-ui,sans-serif",overflow:"hidden" }}>

      {/* ── LEFT HERO — desktop only ─────────────────────────── */}
      <div className="phone-auth-hero">
        <HeroPanel />
      </div>

      {/* ── RIGHT FORM PANEL ─────────────────────────────────── */}
      <div style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"40px 32px",overflowY:"auto",background:"#f5f6fa",minWidth:0 }}>

        {/* Mobile logo */}
        <div className="phone-auth-mobile-logo" style={{ display:"flex",alignItems:"center",gap:"10px",marginBottom:"28px" }}>
          <div style={{ width:"36px",height:"36px",borderRadius:"10px",background:"linear-gradient(135deg,#4648d4,#6b38d4)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,color:"#fff",fontSize:"16px" }}>S</div>
          <span style={{ fontSize:"1.1rem",fontWeight:800,color:"#1a0533",letterSpacing:"-0.02em" }}>SaaSzo</span>
        </div>

        {/* Card */}
        <div style={{ width:"100%",maxWidth:"440px",background:"#fff",borderRadius:"20px",boxShadow:"0 4px 28px rgba(70,72,212,0.1),0 1px 4px rgba(13,15,26,0.06)",border:"1px solid rgba(70,72,212,0.1)",padding:"36px 36px 32px" }}>

          {/* ═══ STEP 1 — Phone entry ═══ */}
          {step === "phone" && (
            <>
              {/* Header */}
              <div style={{ marginBottom:"28px" }}>
                <p style={{ margin:"0 0 6px",fontSize:"0.72rem",fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:"#6b7280" }}>
                  {isRecoverIntent ? "Account Recovery" : isSignupIntent ? "Sign Up" : "Sign In"}
                </p>
                <h2 style={{ margin:"0 0 6px",fontSize:"1.65rem",fontWeight:800,color:"#0d0f1a",letterSpacing:"-0.025em",lineHeight:1.2 }}>{primaryHeading}</h2>
                <p style={{ margin:0,fontSize:"0.88rem",color:"#6b7280",lineHeight:1.5 }}>{primaryDescription}</p>
              </div>

              {error  && <ErrorAlert message={error} />}
              {notice && <NoticeAlert message={notice} />}

              <form onSubmit={handleSendOtp} style={{ display:"flex",flexDirection:"column",gap:"16px" }}>
                {/* Country + phone row */}
                <div style={{ display:"flex",flexDirection:"column",gap:"6px" }}>
                  <label style={{ fontSize:"0.78rem",fontWeight:700,color:"#374151",textTransform:"uppercase",letterSpacing:"0.06em" }}>Mobile Number</label>
                  <div style={{ display:"flex",gap:"8px" }}>
                    {/* Country code */}
                    <div style={{ position:"relative",flexShrink:0 }}>
                      <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        aria-label="Country code"
                        style={{ height:"100%",padding:"11px 32px 11px 12px",borderRadius:"10px",border:"1px solid rgba(13,15,26,0.15)",background:"#fafafa",fontSize:"0.88rem",fontWeight:600,color:"#0d0f1a",outline:"none",appearance:"none",cursor:"pointer",transition:"border-color 0.15s,box-shadow 0.15s" }}
                        onFocus={(e) => { e.target.style.borderColor="#4648d4"; e.target.style.boxShadow="0 0 0 3px rgba(70,72,212,0.12)"; }}
                        onBlur={(e)  => { e.target.style.borderColor="rgba(13,15,26,0.15)"; e.target.style.boxShadow="none"; }}
                      >
                        {AUTH_COUNTRY_OPTIONS.map((c) => (
                          <option key={`${c.code}-${c.name}`} value={c.code}>{c.flag} {c.code}</option>
                        ))}
                      </select>
                      <span style={{ position:"absolute",right:"8px",top:"50%",transform:"translateY(-50%)",pointerEvents:"none",color:"#6b7280" }}>
                        <ChevronDownIcon />
                      </span>
                    </div>

                    {/* Phone number */}
                    <div style={{ position:"relative",flex:1 }}>
                      <span style={{ position:"absolute",left:"13px",top:"50%",transform:"translateY(-50%)",color:"#9ca3af",pointerEvents:"none",display:"flex" }}>
                        <PhoneIcon size={16} />
                      </span>
                      <input
                        type="tel" placeholder="98765 43210"
                        value={phone} onChange={(e) => setPhone(e.target.value)}
                        required inputMode="tel"
                        style={{ width:"100%",padding:"11px 12px 11px 38px",borderRadius:"10px",border:"1px solid rgba(13,15,26,0.15)",background:"#fafafa",fontSize:"0.93rem",color:"#0d0f1a",outline:"none",boxSizing:"border-box",transition:"border-color 0.15s,box-shadow 0.15s" }}
                        onFocus={(e) => { e.target.style.borderColor="#4648d4"; e.target.style.boxShadow="0 0 0 3px rgba(70,72,212,0.12)"; e.target.style.background="#fff"; }}
                        onBlur={(e)  => { e.target.style.borderColor="rgba(13,15,26,0.15)"; e.target.style.boxShadow="none"; e.target.style.background="#fafafa"; }}
                      />
                    </div>
                  </div>
                </div>

                {/* Hidden reCAPTCHA container */}
                <div id="phone-otp-recaptcha-container" style={{ position:"absolute",left:"-9999px",top:0,height:0,width:0,overflow:"hidden",opacity:0,pointerEvents:"none" }} />

                <button
                  id="send-phone-otp-button" type="submit" disabled={isLoading}
                  style={{ ...primaryBtn, marginTop:"4px" }}
                  onMouseEnter={(e) => { if (!isLoading) (e.currentTarget as HTMLButtonElement).style.boxShadow="0 4px 12px rgba(70,72,212,0.4),0 10px 28px rgba(70,72,212,0.22)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.boxShadow="0 2px 8px rgba(70,72,212,0.3),0 6px 20px rgba(70,72,212,0.15)"; }}
                >
                  {isLoading ? (
                    <>
                      <span style={{ width:"18px",height:"18px",border:"2px solid rgba(255,255,255,0.35)",borderTopColor:"#fff",borderRadius:"50%",animation:"phone-spin 0.8s linear infinite",flexShrink:0 }} />
                      Sending OTP…
                    </>
                  ) : (
                    <><SendIcon />{submitLabel}</>
                  )}
                </button>
              </form>

              <p style={{ margin:"12px 0 0",textAlign:"center",fontSize:"0.75rem",color:"#9ca3af" }}>
                Protected by invisible reCAPTCHA.
              </p>

              {/* Divider + alternate */}
              <div style={{ margin:"24px 0",display:"flex",alignItems:"center",gap:"12px" }}>
                <div style={{ flex:1,height:"1px",background:"rgba(13,15,26,0.08)" }} />
                <span style={{ fontSize:"0.78rem",color:"#9ca3af",fontWeight:500 }}>or</span>
                <div style={{ flex:1,height:"1px",background:"rgba(13,15,26,0.08)" }} />
              </div>

              <div style={{ textAlign:"center" }}>
                <Link
                  href={isSignupIntent ? "/register" : "/auth"}
                  style={{ display:"inline-flex",alignItems:"center",gap:"6px",fontSize:"0.88rem",fontWeight:700,color:"#4648d4",textDecoration:"none" }}
                >
                  <MailIcon />
                  {isSignupIntent ? "Sign up with Email instead" : "Sign in with Email instead"}
                </Link>
              </div>

              {/* Legal */}
              <p style={{ margin:"20px 0 0",textAlign:"center",fontSize:"0.73rem",color:"#9ca3af",lineHeight:1.6 }}>
                By continuing, you agree to our{" "}
                <Link href="/terms" style={{ color:"#6b7280",textDecoration:"underline" }}>Terms</Link>{" "}and{" "}
                <Link href="/privacy" style={{ color:"#6b7280",textDecoration:"underline" }}>Privacy Policy</Link>.
              </p>
            </>
          )}

          {/* ═══ STEP 2 — OTP Entry ═══ */}
          {step === "otp" && (
            <>
              {/* Icon + header */}
              <div style={{ textAlign:"center",marginBottom:"28px" }}>
                <div style={{ width:"60px",height:"60px",borderRadius:"16px",background:"rgba(70,72,212,0.1)",border:"1px solid rgba(70,72,212,0.18)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px",color:"#4648d4" }}>
                  <SmsIcon size={26} />
                </div>
                <p style={{ margin:"0 0 6px",fontSize:"0.72rem",fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:"#6b7280" }}>Verification</p>
                <h2 style={{ margin:"0 0 8px",fontSize:"1.65rem",fontWeight:800,color:"#0d0f1a",letterSpacing:"-0.025em",lineHeight:1.2 }}>Check your messages</h2>
                <p style={{ margin:0,fontSize:"0.88rem",color:"#6b7280",lineHeight:1.5 }}>
                  We sent a 6-digit code to{" "}
                  <span style={{ fontWeight:700,color:"#0d0f1a" }}>{countryCode} {phone}</span>
                </p>
              </div>

              {error  && <ErrorAlert message={error} />}
              {notice && <NoticeAlert message={notice} />}

              <form onSubmit={handleVerifyOtp} style={{ display:"flex",flexDirection:"column",gap:"20px" }}>
                {/* OTP digit boxes */}
                <div style={{ display:"flex",gap:"8px",justifyContent:"center" }} onPaste={handleOtpPaste}>
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => { otpInputRefs.current[i] = el; }}
                      type="text" inputMode="numeric" maxLength={1} value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      aria-label={`OTP digit ${i + 1}`}
                      style={{
                        width:"46px", height:"56px", textAlign:"center",
                        fontSize:"1.35rem", fontWeight:800, borderRadius:"12px",
                        border: digit ? "2px solid #4648d4" : "2px solid rgba(13,15,26,0.15)",
                        background: digit ? "#fff" : "#fafafa",
                        color:"#0d0f1a", outline:"none",
                        boxShadow: digit ? "0 0 0 3px rgba(70,72,212,0.12)" : "none",
                        transition:"all 0.15s ease",
                      }}
                      onFocus={(e) => { e.target.style.borderColor="#4648d4"; e.target.style.boxShadow="0 0 0 3px rgba(70,72,212,0.12)"; e.target.style.background="#fff"; }}
                      onBlur={(e)  => { if (!e.target.value) { e.target.style.borderColor="rgba(13,15,26,0.15)"; e.target.style.boxShadow="none"; e.target.style.background="#fafafa"; } }}
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={isLoading || otp.join("").length < 6}
                  style={{ ...primaryBtn, opacity: (isLoading || otp.join("").length < 6) ? 0.65 : 1, cursor: (isLoading || otp.join("").length < 6) ? "not-allowed" : "pointer" }}
                  onMouseEnter={(e) => { if (!isLoading && otp.join("").length === 6) (e.currentTarget as HTMLButtonElement).style.boxShadow="0 4px 12px rgba(70,72,212,0.4),0 10px 28px rgba(70,72,212,0.22)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.boxShadow="0 2px 8px rgba(70,72,212,0.3),0 6px 20px rgba(70,72,212,0.15)"; }}
                >
                  {isLoading ? (
                    <>
                      <span style={{ width:"18px",height:"18px",border:"2px solid rgba(255,255,255,0.35)",borderTopColor:"#fff",borderRadius:"50%",animation:"phone-spin 0.8s linear infinite",flexShrink:0 }} />
                      Verifying…
                    </>
                  ) : (
                    <>
                      <CheckIcon size={18} />
                      Verify &amp; Continue
                    </>
                  )}
                </button>
              </form>

              {/* Resend + back */}
              <div style={{ marginTop:"20px",display:"flex",flexDirection:"column",gap:"10px",textAlign:"center" }}>
                <p style={{ margin:0,fontSize:"0.85rem",color:"#6b7280" }}>
                  Didn't receive the code?{" "}
                  {resendTimer > 0 ? (
                    <span style={{ color:"#9ca3af" }}>
                      Resend in{" "}
                      <span style={{ fontWeight:700,color:"#4648d4",fontVariantNumeric:"tabular-nums" }}>{resendTimer}s</span>
                    </span>
                  ) : (
                    <button onClick={handleResend} style={{ background:"none",border:"none",padding:0,cursor:"pointer",fontWeight:700,color:"#4648d4",fontSize:"0.85rem" }}>
                      Resend OTP
                    </button>
                  )}
                </p>
                <button
                  onClick={() => { setStep("phone"); setError(""); setOtp(["","","","","",""]); setConfirmationResult(null); }}
                  style={{ background:"none",border:"none",padding:0,cursor:"pointer",display:"inline-flex",alignItems:"center",justifyContent:"center",gap:"4px",fontSize:"0.82rem",color:"#6b7280",fontWeight:500 }}
                >
                  <ArrowBackIcon /> Change phone number
                </button>
              </div>
            </>
          )}

          {/* ═══ STEP 3 — Success ═══ */}
          {step === "success" && (
            <div style={{ textAlign:"center",padding:"16px 0" }}>
              <div style={{ width:"68px",height:"68px",borderRadius:"20px",background:"rgba(70,72,212,0.1)",border:"1px solid rgba(70,72,212,0.2)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px",color:"#4648d4" }}>
                <CheckIcon size={32} />
              </div>
              <p style={{ margin:"0 0 6px",fontSize:"0.72rem",fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:"#6b7280" }}>Success</p>
              <h2 style={{ margin:"0 0 10px",fontSize:"1.65rem",fontWeight:800,color:"#0d0f1a",letterSpacing:"-0.025em" }}>Verified!</h2>
              <p style={{ margin:"0 0 28px",fontSize:"0.88rem",color:"#6b7280",lineHeight:1.6 }}>
                {isSignupIntent
                  ? "Your mobile account is ready. Redirecting to your workspace…"
                  : isRecoverIntent
                  ? "Your number is verified. Redirecting you back…"
                  : "Welcome to SaaSzo. Redirecting to your workspace…"}
              </p>
              <div style={{ display:"flex",justifyContent:"center" }}>
                <span style={{ width:"24px",height:"24px",border:"2.5px solid rgba(70,72,212,0.2)",borderTopColor:"#4648d4",borderRadius:"50%",animation:"phone-spin 0.8s linear infinite",display:"inline-block" }} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Responsive + spinner keyframe */}
      <style>{`
        @keyframes phone-spin { to { transform: rotate(360deg); } }
        @media (max-width: 1024px) {
          .phone-auth-hero { display: none !important; }
          .phone-auth-mobile-logo { display: flex !important; }
        }
        @media (min-width: 1025px) {
          .phone-auth-mobile-logo { display: none !important; }
        }
      `}</style>
    </div>
  );
}
