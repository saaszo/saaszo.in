"use client";
import React, { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { appConfig } from "@/lib/config";
import { useAuthSession } from "@/components/AuthProvider";
import { toSafeAppPath } from "@/lib/utils";

/* ─── Icons ─── */
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}
function EyeIcon({ show }: { show: boolean }) {
  return show ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );
}

type AuthTab = "email" | "google" | "phone";

function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { authenticated, loading: sessionLoading, signInWithGoogle, signInWithEmail, postAuthRedirect } = useAuthSession();

  const [activeTab, setActiveTab]   = useState<AuthTab>("email");
  const [email, setEmail]           = useState("");
  const [password, setPassword]     = useState("");
  const [showPass, setShowPass]     = useState(false);
  const [isLoading, setIsLoading]   = useState(false);
  const [error, setError]           = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [tabAnimating, setTabAnimating] = useState(false);
  const prevTab = useRef<AuthTab>("email");

  useEffect(() => {
    const ep = searchParams.get("email"); if (ep) setEmail(ep);
    if (searchParams.get("registered") === "true") setSuccessMsg("Account created! Please sign in.");
  }, [searchParams]);

  useEffect(() => {
    if (!sessionLoading && authenticated) router.replace(toSafeAppPath(postAuthRedirect, appConfig.appUrl));
  }, [authenticated, postAuthRedirect, router, sessionLoading]);

  function switchTab(tab: AuthTab) {
    if (tab === activeTab || tabAnimating) return;
    setTabAnimating(true); prevTab.current = activeTab; setError("");
    setTimeout(() => { setActiveTab(tab); setTabAnimating(false); }, 160);
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); if (isLoading) return;
    setIsLoading(true); setError("");
    try { await signInWithEmail(email, password); }
    catch (err: any) { setError(err?.message || "Authentication failed. Please try again."); }
    finally { setIsLoading(false); }
  };

  const handleGoogleSignIn = async () => {
    if (isLoading) return; setIsLoading(true); setError("");
    try { await signInWithGoogle(); }
    catch (err: any) { setError(err?.message || "Google sign-in failed. Please try again."); }
    finally { setIsLoading(false); }
  };

  const FEATURES = [
    { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>, title: "All-in-one Toolkit", desc: "Invoice, tasks, CRM, HRMS — one workspace." },
    { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>, title: "Enterprise Security", desc: "End-to-end encryption + SOC2-ready." },
    { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>, title: "AI-powered Analytics", desc: "Real-time insights from your data." },
  ];

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "9px 12px 9px 36px", borderRadius: "9px",
    border: "1px solid rgba(13,15,26,0.15)", background: "#fafafa",
    fontSize: "0.88rem", color: "#0d0f1a", outline: "none",
    boxSizing: "border-box", transition: "border-color 0.15s,box-shadow 0.15s",
  };
  const btnStyle: React.CSSProperties = {
    width: "100%", padding: "11px", borderRadius: "11px", border: "none",
    background: "linear-gradient(135deg,#4648d4 0%,#6b38d4 100%)",
    color: "#fff", fontSize: "0.9rem", fontWeight: 700,
    cursor: isLoading ? "not-allowed" : "pointer", opacity: isLoading ? 0.75 : 1,
    boxShadow: "0 2px 8px rgba(70,72,212,0.28)", transition: "all 0.2s ease",
    display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
  };

  return (
    /* ── Outer shell: exactly 100vh, no overflow ── */
    <div style={{ height:"100vh", width:"100%", display:"flex", fontFamily:"'Inter',system-ui,sans-serif", overflow:"hidden" }}>

      {/* ── LEFT HERO — 50% ── */}
      <div className="saaszo-auth-hero" style={{ width:"50%", flexShrink:0, display:"flex", flexDirection:"column", position:"relative", overflow:"hidden", background:"linear-gradient(145deg,#1a0533 0%,#2d1a6e 30%,#4648d4 65%,#6b38d4 100%)" }}>
        {/* Orbs */}
        <div style={{ position:"absolute",top:"-80px",right:"-80px",width:"320px",height:"320px",borderRadius:"50%",background:"radial-gradient(circle,rgba(192,193,255,0.18) 0%,transparent 70%)",pointerEvents:"none" }}/>
        <div style={{ position:"absolute",bottom:"-80px",left:"-60px",width:"360px",height:"360px",borderRadius:"50%",background:"radial-gradient(circle,rgba(107,56,212,0.35) 0%,transparent 70%)",pointerEvents:"none" }}/>
        <div style={{ position:"absolute",inset:0,backgroundImage:"linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px)",backgroundSize:"40px 40px",pointerEvents:"none" }}/>

        <div style={{ position:"relative",zIndex:10,display:"flex",flexDirection:"column",height:"100%",padding:"36px 44px 36px" }}>
          {/* Logo */}
          <div style={{ display:"flex",alignItems:"center",gap:"10px",marginBottom:"auto" }}>
            <div style={{ width:"34px",height:"34px",borderRadius:"9px",background:"rgba(255,255,255,0.15)",backdropFilter:"blur(8px)",border:"1px solid rgba(255,255,255,0.25)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:"16px",color:"#fff" }}>S</div>
            <span style={{ fontSize:"1.2rem",fontWeight:800,color:"#fff",letterSpacing:"-0.02em" }}>SaaSzo</span>
          </div>

          {/* Copy — vertically centered */}
          <div style={{ flex:1,display:"flex",flexDirection:"column",justifyContent:"center",gap:"28px" }}>
            <div>
              <p style={{ margin:"0 0 12px",fontSize:"0.68rem",fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:"rgba(255,255,255,0.55)" }}>SAASZO · PLATFORM</p>
              <h1 style={{ margin:"0 0 12px",fontSize:"clamp(1.7rem,2.6vw,2.5rem)",fontWeight:800,color:"#fff",lineHeight:1.15,letterSpacing:"-0.03em",maxWidth:"16ch" }}>
                Elevate your operational architecture.
              </h1>
              <p style={{ margin:0,fontSize:"0.88rem",color:"rgba(255,255,255,0.65)",lineHeight:1.6,maxWidth:"32ch" }}>
                The unified workspace for invoicing, tasks, HR and beyond — shared auth, shared identity.
              </p>
            </div>

            {/* Feature cards */}
            <div style={{ display:"flex",flexDirection:"column",gap:"10px" }}>
              {FEATURES.map((f) => (
                <div key={f.title} style={{ display:"flex",alignItems:"center",gap:"12px",background:"rgba(255,255,255,0.08)",backdropFilter:"blur(12px)",WebkitBackdropFilter:"blur(12px)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"12px",padding:"11px 14px" }}>
                  <div style={{ width:"34px",height:"34px",borderRadius:"9px",background:"rgba(255,255,255,0.12)",border:"1px solid rgba(255,255,255,0.15)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>{f.icon}</div>
                  <div>
                    <p style={{ margin:"0 0 2px",fontSize:"0.82rem",fontWeight:700,color:"#fff" }}>{f.title}</p>
                    <p style={{ margin:0,fontSize:"0.73rem",color:"rgba(255,255,255,0.58)",lineHeight:1.4 }}>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div style={{ marginTop:"auto",paddingTop:"16px" }}>
            <span style={{ fontSize:"0.68rem",color:"rgba(255,255,255,0.32)",fontWeight:600 }}>Part of the SaaSzo platform</span>
          </div>
        </div>
      </div>

      {/* ── RIGHT FORM PANEL — 50% ── */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"24px 28px", background:"#f5f6fa", overflow:"hidden", minWidth:0 }}>

        {/* Mobile logo — hidden on desktop */}
        <div className="saaszo-auth-mobile-logo" style={{ display:"flex",alignItems:"center",gap:"8px",marginBottom:"16px" }}>
          <div style={{ width:"32px",height:"32px",borderRadius:"9px",background:"linear-gradient(135deg,#4648d4,#6b38d4)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,color:"#fff",fontSize:"14px" }}>S</div>
          <span style={{ fontSize:"1rem",fontWeight:800,color:"#1a0533",letterSpacing:"-0.02em" }}>SaaSzo</span>
        </div>

        {/* Auth card */}
        <div style={{ width:"100%",maxWidth:"420px",background:"#fff",borderRadius:"18px",boxShadow:"0 4px 24px rgba(70,72,212,0.09),0 1px 4px rgba(13,15,26,0.05)",border:"1px solid rgba(70,72,212,0.09)",padding:"24px 28px 20px" }}>

          {/* Header */}
          <div style={{ marginBottom:"16px" }}>
            <p style={{ margin:"0 0 4px",fontSize:"0.68rem",fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:"#9ca3af" }}>Sign In</p>
            <h2 style={{ margin:"0 0 4px",fontSize:"1.45rem",fontWeight:800,color:"#0d0f1a",letterSpacing:"-0.025em",lineHeight:1.2 }}>Welcome back</h2>
            <p style={{ margin:0,fontSize:"0.82rem",color:"#6b7280",lineHeight:1.4 }}>Access your SaaSzo workspace.</p>
          </div>

          {/* Alerts */}
          {successMsg && (
            <div style={{ marginBottom:"12px",padding:"9px 12px",borderRadius:"9px",background:"rgba(34,197,94,0.08)",border:"1px solid rgba(34,197,94,0.22)",display:"flex",alignItems:"center",gap:"7px",fontSize:"0.8rem",color:"#16a34a",fontWeight:600 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              {successMsg}
            </div>
          )}
          {error && (
            <div style={{ marginBottom:"12px",padding:"9px 12px",borderRadius:"9px",background:"rgba(239,68,68,0.07)",border:"1px solid rgba(239,68,68,0.2)",display:"flex",alignItems:"flex-start",gap:"7px",fontSize:"0.8rem",color:"#dc2626",fontWeight:500,lineHeight:1.4 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink:0,marginTop:"1px" }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {error}
            </div>
          )}

          {/* Tab switcher */}
          <div style={{ display:"flex",background:"#f3f4f6",borderRadius:"10px",padding:"3px",marginBottom:"16px",gap:"2px" }}>
            {(["email","google","phone"] as AuthTab[]).map((t) => (
              <button key={t} onClick={() => switchTab(t)} style={{ flex:1,padding:"7px 4px",borderRadius:"8px",border:"none",fontSize:"0.78rem",fontWeight:activeTab===t?700:500,cursor:"pointer",background:activeTab===t?"#fff":"transparent",color:activeTab===t?"#4648d4":"#6b7280",boxShadow:activeTab===t?"0 1px 3px rgba(70,72,212,0.14),0 0 0 1px rgba(70,72,212,0.07)":"none",transition:"all 0.18s ease",whiteSpace:"nowrap" }}>
                {t === "email" ? "Email" : t === "google" ? "Google" : "Mobile OTP"}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div style={{ opacity:tabAnimating?0:1,transform:tabAnimating?"translateY(6px)":"translateY(0)",transition:"opacity 0.16s ease,transform 0.16s ease" }}>

            {/* EMAIL TAB */}
            {activeTab === "email" && (
              <form onSubmit={handleEmailSubmit} style={{ display:"flex",flexDirection:"column",gap:"10px" }}>
                {/* Email */}
                <div style={{ display:"flex",flexDirection:"column",gap:"4px" }}>
                  <label style={{ fontSize:"0.72rem",fontWeight:700,color:"#374151",textTransform:"uppercase",letterSpacing:"0.06em" }}>Email</label>
                  <div style={{ position:"relative" }}>
                    <svg style={{ position:"absolute",left:"11px",top:"50%",transform:"translateY(-50%)",color:"#9ca3af",pointerEvents:"none" }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    <input type="email" placeholder="name@company.com" value={email} onChange={(e) => setEmail(e.target.value)} required style={inputStyle}
                      onFocus={(e)=>{e.target.style.borderColor="#4648d4";e.target.style.boxShadow="0 0 0 3px rgba(70,72,212,0.11)";e.target.style.background="#fff";}}
                      onBlur={(e)=>{e.target.style.borderColor="rgba(13,15,26,0.15)";e.target.style.boxShadow="none";e.target.style.background="#fafafa";}} />
                  </div>
                </div>

                {/* Password */}
                <div style={{ display:"flex",flexDirection:"column",gap:"4px" }}>
                  <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                    <label style={{ fontSize:"0.72rem",fontWeight:700,color:"#374151",textTransform:"uppercase",letterSpacing:"0.06em" }}>Password</label>
                    <Link href="/auth/forgot-password" style={{ fontSize:"0.75rem",fontWeight:700,color:"#4648d4",textDecoration:"none" }}>Forgot?</Link>
                  </div>
                  <div style={{ position:"relative" }}>
                    <svg style={{ position:"absolute",left:"11px",top:"50%",transform:"translateY(-50%)",color:"#9ca3af",pointerEvents:"none" }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                    <input type={showPass?"text":"password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ ...inputStyle, paddingRight:"36px" }}
                      onFocus={(e)=>{e.target.style.borderColor="#4648d4";e.target.style.boxShadow="0 0 0 3px rgba(70,72,212,0.11)";e.target.style.background="#fff";}}
                      onBlur={(e)=>{e.target.style.borderColor="rgba(13,15,26,0.15)";e.target.style.boxShadow="none";e.target.style.background="#fafafa";}} />
                    <button type="button" onClick={() => setShowPass(!showPass)} style={{ position:"absolute",right:"10px",top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",padding:0,display:"flex",alignItems:"center",color:"#9ca3af" }}><EyeIcon show={showPass} /></button>
                  </div>
                </div>

                <button type="submit" disabled={isLoading} style={{ ...btnStyle, marginTop:"4px" }}
                  onMouseEnter={(e)=>{if(!isLoading)(e.currentTarget as HTMLElement).style.boxShadow="0 4px 14px rgba(70,72,212,0.38)";}}
                  onMouseLeave={(e)=>{(e.currentTarget as HTMLElement).style.boxShadow="0 2px 8px rgba(70,72,212,0.28)";}}>
                  {isLoading ? "Signing in…" : "Sign In with Email"}
                </button>
              </form>
            )}

            {/* GOOGLE TAB */}
            {activeTab === "google" && (
              <div style={{ display:"flex",flexDirection:"column",gap:"14px",padding:"4px 0" }}>
                <div style={{ textAlign:"center",padding:"4px 0" }}>
                  <div style={{ width:"48px",height:"48px",borderRadius:"13px",background:"#f8f9fa",border:"1px solid #e5e7eb",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 10px" }}><GoogleIcon /></div>
                  <p style={{ margin:0,fontSize:"0.82rem",color:"#6b7280",lineHeight:1.5 }}>Sign in securely using your Google account. No password needed.</p>
                </div>
                <button type="button" onClick={handleGoogleSignIn} disabled={isLoading} style={{ width:"100%",padding:"11px 14px",borderRadius:"11px",border:"1px solid #e5e7eb",background:"#fff",color:"#374151",fontSize:"0.9rem",fontWeight:700,cursor:isLoading?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:"8px",boxShadow:"0 1px 3px rgba(13,15,26,0.06)",transition:"all 0.2s ease" }}
                  onMouseEnter={(e)=>{const b=e.currentTarget;b.style.boxShadow="0 2px 8px rgba(13,15,26,0.1)";b.style.transform="translateY(-1px)";}}
                  onMouseLeave={(e)=>{const b=e.currentTarget;b.style.boxShadow="0 1px 3px rgba(13,15,26,0.06)";b.style.transform="translateY(0)";}}>
                  <GoogleIcon />{isLoading ? "Signing in…" : "Continue with Google"}
                </button>
                <p style={{ margin:0,textAlign:"center",fontSize:"0.73rem",color:"#9ca3af" }}>You'll be redirected to Google to complete sign-in.</p>
              </div>
            )}

            {/* PHONE TAB */}
            {activeTab === "phone" && (
              <div style={{ display:"flex",flexDirection:"column",gap:"14px",padding:"4px 0" }}>
                <div style={{ textAlign:"center",padding:"4px 0" }}>
                  <div style={{ width:"48px",height:"48px",borderRadius:"13px",background:"rgba(70,72,212,0.07)",border:"1px solid rgba(70,72,212,0.14)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 10px" }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4648d4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
                  </div>
                  <p style={{ margin:0,fontSize:"0.82rem",color:"#6b7280",lineHeight:1.5 }}>Sign in with your mobile number using a one-time OTP.</p>
                </div>
                <Link href="/auth/phone?intent=signin" style={{ width:"100%",padding:"11px",borderRadius:"11px",border:"none",background:"linear-gradient(135deg,#4648d4 0%,#6b38d4 100%)",color:"#fff",fontSize:"0.9rem",fontWeight:700,textAlign:"center",display:"flex",alignItems:"center",justifyContent:"center",gap:"8px",boxShadow:"0 2px 8px rgba(70,72,212,0.28)",transition:"all 0.2s ease",textDecoration:"none",boxSizing:"border-box" }}
                  onMouseEnter={(e)=>{const a=e.currentTarget;a.style.boxShadow="0 4px 14px rgba(70,72,212,0.38)";a.style.transform="translateY(-1px)";}}
                  onMouseLeave={(e)=>{const a=e.currentTarget;a.style.boxShadow="0 2px 8px rgba(70,72,212,0.28)";a.style.transform="translateY(0)";}}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
                  Send OTP to Mobile
                </Link>
                <p style={{ margin:0,textAlign:"center",fontSize:"0.73rem",color:"#9ca3af" }}>We'll send a 6-digit OTP to verify your number.</p>
              </div>
            )}
          </div>

          {/* Divider + Sign up */}
          <div style={{ marginTop:"16px",paddingTop:"14px",borderTop:"1px solid rgba(13,15,26,0.07)",display:"flex",alignItems:"center",justifyContent:"space-between",gap:"10px" }}>
            <p style={{ margin:0,fontSize:"0.8rem",color:"#6b7280" }}>No account?</p>
            <Link href="/register" style={{ display:"inline-flex",alignItems:"center",gap:"5px",padding:"7px 14px",borderRadius:"9px",border:"1px solid rgba(70,72,212,0.22)",background:"rgba(70,72,212,0.05)",color:"#4648d4",fontSize:"0.82rem",fontWeight:700,textDecoration:"none",transition:"all 0.18s ease" }}
              onMouseEnter={(e)=>{const a=e.currentTarget;a.style.background="rgba(70,72,212,0.1)";a.style.borderColor="rgba(70,72,212,0.35)";}}
              onMouseLeave={(e)=>{const a=e.currentTarget;a.style.background="rgba(70,72,212,0.05)";a.style.borderColor="rgba(70,72,212,0.22)";}}>
              Create free account
            </Link>
          </div>
        </div>

        {/* Trust badges */}
        <div style={{ marginTop:"14px",display:"flex",alignItems:"center",gap:"14px",flexWrap:"wrap",justifyContent:"center" }}>
          {["SSL Secured","GDPR Ready","SOC2 Ready"].map((b) => (
            <div key={b} style={{ display:"flex",alignItems:"center",gap:"4px",fontSize:"0.68rem",fontWeight:700,color:"#9ca3af" }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#4648d4" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              {b}
            </div>
          ))}
        </div>

        {/* Legal */}
        <p style={{ margin:"10px 0 0",textAlign:"center",fontSize:"0.68rem",color:"#b0b7c3",lineHeight:1.5 }}>
          By continuing, you agree to our{" "}
          <Link href="/terms" style={{ color:"#9ca3af",textDecoration:"underline" }}>Terms</Link>{" "}and{" "}
          <Link href="/privacy" style={{ color:"#9ca3af",textDecoration:"underline" }}>Privacy Policy</Link>.
        </p>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .saaszo-auth-hero { display: none !important; }
          .saaszo-auth-mobile-logo { display: flex !important; }
          div[style*="flex:1"][style*="background: rgb(245, 246, 250)"] { padding: 20px 16px !important; }
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
