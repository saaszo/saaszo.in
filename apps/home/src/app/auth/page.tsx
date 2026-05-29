"use client";
import React, { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { appConfig } from "@/lib/config";
import { useAuthSession } from "@/components/AuthProvider";
import { toSafeAppPath } from "@/lib/utils";

/* ─── Icons (inline SVG — no extra deps) ─── */
function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

function EyeIcon({ show }: { show: boolean }) {
  return show ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );
}

type AuthTab = "email" | "google" | "phone";

function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    authenticated,
    loading: sessionLoading,
    signInWithGoogle,
    signInWithEmail,
    postAuthRedirect,
  } = useAuthSession();

  const [activeTab, setActiveTab] = useState<AuthTab>("email");
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [showPass, setShowPass]   = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [tabAnimating, setTabAnimating] = useState(false);
  const prevTab = useRef<AuthTab>("email");

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) setEmail(emailParam);
    if (searchParams.get("registered") === "true") setSuccessMsg("Account created! Please sign in.");
  }, [searchParams]);

  useEffect(() => {
    if (!sessionLoading && authenticated) {
      router.replace(toSafeAppPath(postAuthRedirect, appConfig.appUrl));
    }
  }, [authenticated, postAuthRedirect, router, sessionLoading]);

  function switchTab(tab: AuthTab) {
    if (tab === activeTab || tabAnimating) return;
    setTabAnimating(true);
    prevTab.current = activeTab;
    setError("");
    setTimeout(() => {
      setActiveTab(tab);
      setTabAnimating(false);
    }, 180);
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    setError("");
    try {
      await signInWithEmail(email, password);
    } catch (err: any) {
      setError(err?.message || "Authentication failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setError("");
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setError(err?.message || "Google sign-in failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const FEATURES = [
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
          <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
        </svg>
      ),
      title: "All-in-one Business Toolkit",
      desc: "Invoice, tasks, CRM, HRMS — all in a single unified workspace.",
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
        </svg>
      ),
      title: "Enterprise-grade Security",
      desc: "End-to-end encryption, MFA, and SOC2-ready data protection.",
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
        </svg>
      ),
      title: "AI-powered Analytics",
      desc: "Transform raw data into actionable insights in real-time.",
    },
  ];

  return (
    <div style={{
      minHeight: "100vh", width: "100%", display: "flex",
      fontFamily: "'Inter', system-ui, sans-serif",
      overflow: "hidden",
    }}>
      {/* ── LEFT HERO PANEL — 50% ─────────────────────────────────────── */}
      <div
        className="auth-saaszo-hero"
        style={{
          width: "50%", flexShrink: 0,
          display: "flex", flexDirection: "column",
          position: "relative", overflow: "hidden",
          background: "linear-gradient(145deg, #1a0533 0%, #2d1a6e 30%, #4648d4 65%, #6b38d4 100%)",
        }}
      >
        {/* Ambient orbs */}
        <div style={{ position:"absolute",top:"-80px",right:"-80px",width:"350px",height:"350px",borderRadius:"50%",background:"radial-gradient(circle,rgba(192,193,255,0.2) 0%,transparent 70%)",pointerEvents:"none" }} />
        <div style={{ position:"absolute",bottom:"-100px",left:"-60px",width:"400px",height:"400px",borderRadius:"50%",background:"radial-gradient(circle,rgba(107,56,212,0.4) 0%,transparent 70%)",pointerEvents:"none" }} />
        <div style={{ position:"absolute",top:"50%",left:"25%",width:"220px",height:"220px",borderRadius:"50%",background:"radial-gradient(circle,rgba(255,255,255,0.06) 0%,transparent 70%)",pointerEvents:"none" }} />
        {/* Subtle grid */}
        <div style={{ position:"absolute",inset:0,backgroundImage:"linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px)",backgroundSize:"40px 40px",pointerEvents:"none" }} />

        <div style={{ position:"relative",zIndex:10,display:"flex",flexDirection:"column",height:"100%",padding:"48px 52px 52px" }}>
          {/* Logo */}
          <div style={{ display:"flex",alignItems:"center",gap:"12px",marginBottom:"60px" }}>
            <div style={{ width:"38px",height:"38px",borderRadius:"10px",background:"rgba(255,255,255,0.15)",backdropFilter:"blur(8px)",border:"1px solid rgba(255,255,255,0.25)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:"18px",color:"#fff" }}>S</div>
            <span style={{ fontSize:"1.35rem",fontWeight:800,color:"#fff",letterSpacing:"-0.02em" }}>SaaSzo</span>
          </div>

          {/* Hero copy */}
          <div style={{ flex:1,display:"flex",flexDirection:"column",justifyContent:"center" }}>
            <p style={{ margin:"0 0 16px",fontSize:"0.72rem",fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:"rgba(255,255,255,0.6)" }}>
              SAASZO · PLATFORM
            </p>
            <h1 style={{ margin:"0 0 18px",fontSize:"clamp(1.9rem,3.2vw,2.9rem)",fontWeight:800,color:"#fff",lineHeight:1.15,letterSpacing:"-0.03em",maxWidth:"16ch" }}>
              Elevate your operational architecture.
            </h1>
            <p style={{ margin:"0 0 44px",fontSize:"0.95rem",color:"rgba(255,255,255,0.7)",lineHeight:1.65,maxWidth:"34ch" }}>
              The unified workspace for invoicing, tasks, HR and beyond — shared auth, shared identity.
            </p>

            {/* Feature cards */}
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

          {/* Footer */}
          <div style={{ marginTop:"40px" }}>
            <span style={{ fontSize:"0.72rem",color:"rgba(255,255,255,0.38)",fontWeight:600 }}>Part of the SaaSzo platform</span>
          </div>
        </div>
      </div>

      {/* ── RIGHT FORM PANEL — 50% ────────────────────────────────────── */}
      <div style={{ width:"50%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"40px 32px",overflowY:"auto",background:"#f5f6fa",minWidth:0 }}>

        {/* Mobile logo */}
        <div className="auth-saaszo-mobile-logo" style={{ display:"flex",alignItems:"center",gap:"10px",marginBottom:"28px" }}>
          <div style={{ width:"36px",height:"36px",borderRadius:"10px",background:"linear-gradient(135deg,#4648d4,#6b38d4)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,color:"#fff",fontSize:"16px" }}>S</div>
          <span style={{ fontSize:"1.1rem",fontWeight:800,color:"#1a0533",letterSpacing:"-0.02em" }}>SaaSzo</span>
        </div>

        {/* Auth card */}
        <div style={{ width:"100%",maxWidth:"440px",background:"#fff",borderRadius:"20px",boxShadow:"0 4px 28px rgba(70,72,212,0.1),0 1px 4px rgba(13,15,26,0.06)",border:"1px solid rgba(70,72,212,0.1)",padding:"36px 36px 32px" }}>

          {/* Header */}
          <div style={{ marginBottom:"28px" }}>
            <p style={{ margin:"0 0 6px",fontSize:"0.72rem",fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:"#6b7280" }}>Sign In</p>
            <h2 style={{ margin:"0 0 6px",fontSize:"1.65rem",fontWeight:800,color:"#0d0f1a",letterSpacing:"-0.025em",lineHeight:1.2 }}>Welcome back</h2>
            <p style={{ margin:0,fontSize:"0.88rem",color:"#6b7280",lineHeight:1.5 }}>Enter your details to access your workspace.</p>
          </div>

          {/* Success / Error */}
          {successMsg && (
            <div style={{ marginBottom:"20px",padding:"12px 14px",borderRadius:"10px",background:"rgba(34,197,94,0.08)",border:"1px solid rgba(34,197,94,0.25)",display:"flex",alignItems:"center",gap:"8px",fontSize:"0.85rem",color:"#16a34a",fontWeight:600 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              {successMsg}
            </div>
          )}
          {error && (
            <div style={{ marginBottom:"20px",padding:"12px 14px",borderRadius:"10px",background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.22)",display:"flex",alignItems:"flex-start",gap:"8px",fontSize:"0.85rem",color:"#dc2626",fontWeight:500,lineHeight:1.5 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink:0,marginTop:"2px" }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {error}
            </div>
          )}

          {/* ── TAB SWITCHER ── */}
          <div style={{ display:"flex",background:"#f3f4f6",borderRadius:"12px",padding:"4px",marginBottom:"24px",gap:"2px" }}>
            {([
              { id:"email" as AuthTab, label:"Email" },
              { id:"google" as AuthTab, label:"Google" },
              { id:"phone" as AuthTab, label:"Mobile OTP" },
            ]).map((t) => (
              <button
                key={t.id}
                onClick={() => switchTab(t.id)}
                style={{
                  flex:1, padding:"8px 6px", borderRadius:"9px", border:"none",
                  fontSize:"0.82rem", fontWeight:activeTab===t.id?700:500,
                  cursor:"pointer",
                  background: activeTab===t.id ? "#fff" : "transparent",
                  color: activeTab===t.id ? "#4648d4" : "#6b7280",
                  boxShadow: activeTab===t.id ? "0 1px 4px rgba(70,72,212,0.15),0 0 0 1px rgba(70,72,212,0.08)" : "none",
                  transition:"all 0.2s ease",
                  whiteSpace:"nowrap",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* ── TAB CONTENT — animated ── */}
          <div style={{ position:"relative",overflow:"hidden" }}>
            <div style={{ opacity:tabAnimating?0:1, transform:tabAnimating?"translateY(8px)":"translateY(0)", transition:"opacity 0.18s ease,transform 0.18s ease" }}>

              {/* EMAIL TAB */}
              {activeTab === "email" && (
                <form onSubmit={handleEmailSubmit} style={{ display:"flex",flexDirection:"column",gap:"16px" }}>
                  <div style={{ display:"flex",flexDirection:"column",gap:"6px" }}>
                    <label style={{ fontSize:"0.78rem",fontWeight:700,color:"#374151",textTransform:"uppercase",letterSpacing:"0.06em" }}>Email Address</label>
                    <div style={{ position:"relative" }}>
                      <svg style={{ position:"absolute",left:"13px",top:"50%",transform:"translateY(-50%)",color:"#9ca3af",pointerEvents:"none" }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                      <input
                        type="email" placeholder="name@company.com" value={email}
                        onChange={(e) => setEmail(e.target.value)} required
                        style={{ width:"100%",padding:"11px 12px 11px 40px",borderRadius:"10px",border:"1px solid rgba(13,15,26,0.15)",background:"#fafafa",fontSize:"0.93rem",color:"#0d0f1a",outline:"none",boxSizing:"border-box",transition:"border-color 0.15s,box-shadow 0.15s" }}
                        onFocus={(e) => { e.target.style.borderColor="#4648d4"; e.target.style.boxShadow="0 0 0 3px rgba(70,72,212,0.12)"; e.target.style.background="#fff"; }}
                        onBlur={(e) => { e.target.style.borderColor="rgba(13,15,26,0.15)"; e.target.style.boxShadow="none"; e.target.style.background="#fafafa"; }}
                      />
                    </div>
                  </div>

                  <div style={{ display:"flex",flexDirection:"column",gap:"6px" }}>
                    <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                      <label style={{ fontSize:"0.78rem",fontWeight:700,color:"#374151",textTransform:"uppercase",letterSpacing:"0.06em" }}>Password</label>
                      <Link href="/auth/forgot-password" style={{ fontSize:"13px",fontWeight:700,color:"#4648d4",textDecoration:"none" }}>Forgot Password?</Link>
                    </div>
                    <div style={{ position:"relative" }}>
                      <svg style={{ position:"absolute",left:"13px",top:"50%",transform:"translateY(-50%)",color:"#9ca3af",pointerEvents:"none" }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                      <input
                        type={showPass?"text":"password"} placeholder="••••••••" value={password}
                        onChange={(e) => setPassword(e.target.value)} required
                        style={{ width:"100%",padding:"11px 44px 11px 40px",borderRadius:"10px",border:"1px solid rgba(13,15,26,0.15)",background:"#fafafa",fontSize:"0.93rem",color:"#0d0f1a",outline:"none",boxSizing:"border-box",transition:"border-color 0.15s,box-shadow 0.15s" }}
                        onFocus={(e) => { e.target.style.borderColor="#4648d4"; e.target.style.boxShadow="0 0 0 3px rgba(70,72,212,0.12)"; e.target.style.background="#fff"; }}
                        onBlur={(e) => { e.target.style.borderColor="rgba(13,15,26,0.15)"; e.target.style.boxShadow="none"; e.target.style.background="#fafafa"; }}
                      />
                      <button type="button" onClick={() => setShowPass(!showPass)} style={{ position:"absolute",right:"13px",top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",padding:0,display:"flex",alignItems:"center",color:"#9ca3af" }}>
                        <EyeIcon show={showPass} />
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit" disabled={isLoading}
                    style={{ width:"100%",padding:"13px",borderRadius:"12px",border:"none",background:"linear-gradient(135deg,#4648d4 0%,#6b38d4 100%)",color:"#fff",fontSize:"0.95rem",fontWeight:700,cursor:isLoading?"not-allowed":"pointer",opacity:isLoading?0.75:1,boxShadow:"0 2px 8px rgba(70,72,212,0.3),0 6px 20px rgba(70,72,212,0.15)",transition:"all 0.2s ease",letterSpacing:"0.01em",marginTop:"4px" }}
                    onMouseEnter={(e) => { if(!isLoading) (e.target as HTMLButtonElement).style.boxShadow="0 4px 12px rgba(70,72,212,0.4),0 10px 28px rgba(70,72,212,0.22)"; }}
                    onMouseLeave={(e) => { (e.target as HTMLButtonElement).style.boxShadow="0 2px 8px rgba(70,72,212,0.3),0 6px 20px rgba(70,72,212,0.15)"; }}
                  >
                    {isLoading ? "Signing in…" : "Sign In with Email"}
                  </button>
                </form>
              )}

              {/* GOOGLE TAB */}
              {activeTab === "google" && (
                <div style={{ display:"flex",flexDirection:"column",gap:"20px",padding:"8px 0" }}>
                  <div style={{ textAlign:"center",padding:"8px 0 4px" }}>
                    <div style={{ width:"56px",height:"56px",borderRadius:"16px",background:"#f8f9fa",border:"1px solid #e5e7eb",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px" }}>
                      <GoogleIcon />
                    </div>
                    <p style={{ margin:0,fontSize:"0.88rem",color:"#6b7280",lineHeight:1.6 }}>Sign in securely using your Google account. No password needed.</p>
                  </div>

                  <button
                    type="button" onClick={handleGoogleSignIn} disabled={isLoading}
                    style={{ width:"100%",padding:"13px 16px",borderRadius:"12px",border:"1px solid #e5e7eb",background:"#fff",color:"#374151",fontSize:"0.95rem",fontWeight:700,cursor:isLoading?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:"10px",boxShadow:"0 1px 3px rgba(13,15,26,0.06),0 2px 8px rgba(13,15,26,0.04)",transition:"all 0.2s ease" }}
                    onMouseEnter={(e) => { const b = e.currentTarget; b.style.boxShadow="0 2px 6px rgba(13,15,26,0.1),0 6px 16px rgba(13,15,26,0.08)"; b.style.transform="translateY(-1px)"; }}
                    onMouseLeave={(e) => { const b = e.currentTarget; b.style.boxShadow="0 1px 3px rgba(13,15,26,0.06),0 2px 8px rgba(13,15,26,0.04)"; b.style.transform="translateY(0)"; }}
                  >
                    <GoogleIcon />
                    {isLoading ? "Signing in…" : "Continue with Google"}
                  </button>

                  <p style={{ margin:0,textAlign:"center",fontSize:"0.78rem",color:"#9ca3af" }}>
                    You'll be redirected to Google to complete sign-in.
                  </p>
                </div>
              )}

              {/* PHONE TAB */}
              {activeTab === "phone" && (
                <div style={{ display:"flex",flexDirection:"column",gap:"20px",padding:"8px 0" }}>
                  <div style={{ textAlign:"center",padding:"8px 0 4px" }}>
                    <div style={{ width:"56px",height:"56px",borderRadius:"16px",background:"rgba(70,72,212,0.08)",border:"1px solid rgba(70,72,212,0.15)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px" }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4648d4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
                        <line x1="12" y1="18" x2="12.01" y2="18"/>
                      </svg>
                    </div>
                    <p style={{ margin:0,fontSize:"0.88rem",color:"#6b7280",lineHeight:1.6 }}>Sign in with your mobile number using a one-time OTP. No password needed.</p>
                  </div>

                  <Link
                    href="/auth/phone?intent=signin"
                    style={{ width:"100%",padding:"13px 16px",borderRadius:"12px",border:"none",background:"linear-gradient(135deg,#4648d4 0%,#6b38d4 100%)",color:"#fff",fontSize:"0.95rem",fontWeight:700,textAlign:"center",display:"flex",alignItems:"center",justifyContent:"center",gap:"10px",boxShadow:"0 2px 8px rgba(70,72,212,0.3),0 6px 20px rgba(70,72,212,0.15)",transition:"all 0.2s ease",textDecoration:"none",boxSizing:"border-box" }}
                    onMouseEnter={(e) => { const a = e.currentTarget; a.style.boxShadow="0 4px 12px rgba(70,72,212,0.4),0 10px 28px rgba(70,72,212,0.22)"; a.style.transform="translateY(-1px)"; }}
                    onMouseLeave={(e) => { const a = e.currentTarget; a.style.boxShadow="0 2px 8px rgba(70,72,212,0.3),0 6px 20px rgba(70,72,212,0.15)"; a.style.transform="translateY(0)"; }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
                    Send OTP to Mobile
                  </Link>

                  <p style={{ margin:0,textAlign:"center",fontSize:"0.78rem",color:"#9ca3af" }}>
                    We'll send a 6-digit OTP to verify your number.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Divider + Sign up */}
          <div style={{ marginTop:"28px",paddingTop:"20px",borderTop:"1px solid rgba(13,15,26,0.07)",textAlign:"center" }}>
            <p style={{ margin:"0 0 10px",fontSize:"0.85rem",color:"#6b7280" }}>Don't have an account?</p>
            <Link
              href="/register"
              style={{ display:"inline-flex",alignItems:"center",gap:"6px",padding:"9px 20px",borderRadius:"10px",border:"1px solid rgba(70,72,212,0.25)",background:"rgba(70,72,212,0.05)",color:"#4648d4",fontSize:"0.88rem",fontWeight:700,textDecoration:"none",transition:"all 0.2s ease" }}
              onMouseEnter={(e) => { const a = e.currentTarget; a.style.background="rgba(70,72,212,0.1)"; a.style.borderColor="rgba(70,72,212,0.4)"; }}
              onMouseLeave={(e) => { const a = e.currentTarget; a.style.background="rgba(70,72,212,0.05)"; a.style.borderColor="rgba(70,72,212,0.25)"; }}
            >
              Create a free account
            </Link>
          </div>

          {/* Legal */}
          <p style={{ margin:"18px 0 0",textAlign:"center",fontSize:"0.73rem",color:"#9ca3af",lineHeight:1.6 }}>
            By continuing, you agree to our{" "}
            <Link href="/terms" style={{ color:"#6b7280",textDecoration:"underline" }}>Terms</Link>{" "}and{" "}
            <Link href="/privacy" style={{ color:"#6b7280",textDecoration:"underline" }}>Privacy Policy</Link>.
          </p>
        </div>

        {/* Trust badges */}
        <div style={{ marginTop:"24px",display:"flex",alignItems:"center",gap:"16px",flexWrap:"wrap",justifyContent:"center" }}>
          {["SSL Secured","GDPR Ready","SOC2 Ready"].map((badge) => (
            <div key={badge} style={{ display:"flex",alignItems:"center",gap:"5px",fontSize:"0.72rem",fontWeight:700,color:"#6b7280" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4648d4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              {badge}
            </div>
          ))}
        </div>
      </div>

      {/* Responsive */}
      <style>{`
        @media (max-width: 1024px) {
          .auth-saaszo-hero { display: none !important; }
          .auth-saaszo-mobile-logo { display: flex !important; }
          div[style*="width: 50%"]:last-of-type { width: 100% !important; }
        }
        @media (min-width: 1025px) {
          .auth-saaszo-mobile-logo { display: none !important; }
        }
      `}</style>
    </div>
  );
}

export default function UnifiedAuthHub() {
  return (
    <Suspense>
      <AuthForm />
    </Suspense>
  );
}
