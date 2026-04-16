"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

type Step = "account" | "profile" | "role" | "done";

export default function SignUpPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("account");

  // Step 1 — Account
  const [email,     setEmail]     = useState("");
  const [password,  setPassword]  = useState("");
  const [confirm,   setConfirm]   = useState("");
  const [showPw,    setShowPw]    = useState(false);
  const [showCf,    setShowCf]    = useState(false);

  // Step 2 — Profile
  const [name,      setName]      = useState("");
  const [username,  setUsername]  = useState("");
  const [location,  setLocation]  = useState("");

  // Step 3 — Role
  const [role,      setRole]      = useState<"buyer" | "carrier" | "both" | "">("");

  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState("");

  const STEPS: Step[] = ["account", "profile", "role", "done"];
  const stepIdx = STEPS.indexOf(step);

  const pwMatch  = confirm === "" || password === confirm;
  const pwStrong = password.length >= 6;

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!pwStrong) { setError("Password must be at least 6 characters."); return; }
    if (password !== confirm) { setError("Passwords do not match."); return; }
    setStep("profile");
  };

  const handleStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("role");
  };

  const handleStep3 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) { setError("Please select how you'd like to use handi."); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    setStep("done");
    setLoading(false);
  };

  const ROLES = [
    {
      id: "buyer" as const,
      icon: "🛍️",
      title: "Buyer",
      desc: "Request items from anywhere in the world and have travelers bring them back.",
    },
    {
      id: "carrier" as const,
      icon: "✈️",
      title: "Carrier",
      desc: "Earn money on your trips by carrying items for buyers along your route.",
    },
    {
      id: "both" as const,
      icon: "🌍",
      title: "Both",
      desc: "Buy items from abroad and earn on your own trips — the full handi experience.",
    },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center px-4 pt-[64px] pb-16" style={{ background: "#F7F5F0" }}>

        {/* Background accent */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full opacity-[0.06]"
            style={{ background: "radial-gradient(circle, #FF4500, transparent 70%)" }} />
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full opacity-[0.04]"
            style={{ background: "radial-gradient(circle, #FF4500, transparent 70%)" }} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-[440px]"
        >
          <div className="bg-white rounded-3xl border border-border shadow-float px-8 py-10">

            {/* Logo */}
            <div className="flex items-center gap-0.5 mb-8">
              <span className="text-lg font-black tracking-tight text-ink">handi</span>
              <span className="w-[5px] h-[5px] rounded-full bg-accent mb-2" />
            </div>

            {/* Step header */}
            {step !== "done" && (
              <>
                <div className="mb-6">
                  <h1 className="text-[1.75rem] font-black text-ink tracking-[-0.03em] leading-tight mb-1">
                    {step === "account" && "Create account."}
                    {step === "profile" && "Your profile."}
                    {step === "role"    && "How will you use handi?"}
                  </h1>
                  <p className="text-sm text-muted">
                    {step === "account" && "Join thousands of travelers and buyers on handi."}
                    {step === "profile" && "Tell us a bit about yourself."}
                    {step === "role"    && "You can always change this later."}
                  </p>
                </div>

                {/* Progress bar */}
                <div className="flex gap-1.5 mb-7">
                  {[0, 1, 2].map(i => (
                    <div key={i} className="flex-1 h-1 rounded-full bg-warm overflow-hidden">
                      <div
                        className="h-full bg-accent rounded-full transition-all duration-400"
                        style={{ width: stepIdx > i ? "100%" : "0%" }}
                      />
                    </div>
                  ))}
                </div>
              </>
            )}

            <AnimatePresence mode="wait">

              {/* ── Step 1: Account ── */}
              {step === "account" && (
                <motion.form key="account" onSubmit={handleStep1}
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.22 }} className="space-y-4">

                  <div>
                    <label className="block text-[11px] font-bold tracking-[0.14em] uppercase text-muted mb-2">Email</label>
                    <input type="email" value={email} onChange={e => { setEmail(e.target.value); setError(""); }}
                      placeholder="you@example.com" required
                      className="w-full border border-border rounded-xl px-4 py-3 text-sm text-ink placeholder:text-muted/50 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all" />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold tracking-[0.14em] uppercase text-muted mb-2">Password</label>
                    <div className="relative">
                      <input type={showPw ? "text" : "password"} value={password}
                        onChange={e => { setPassword(e.target.value); setError(""); }}
                        placeholder="Min. 6 characters" required
                        className="w-full border border-border rounded-xl px-4 py-3 pr-11 text-sm text-ink placeholder:text-muted/50 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all" />
                      <button type="button" onClick={() => setShowPw(v => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
                          {showPw ? (
                            <>
                              <path d="M2 8s2.5-5 6-5 6 5 6 5-2.5 5-6 5-6-5-6-5z" stroke="currentColor" strokeWidth="1.5"/>
                              <circle cx="8" cy="8" r="1.8" stroke="currentColor" strokeWidth="1.5"/>
                              <path d="M2 2l12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                            </>
                          ) : (
                            <>
                              <path d="M2 8s2.5-5 6-5 6 5 6 5-2.5 5-6 5-6-5-6-5z" stroke="currentColor" strokeWidth="1.5"/>
                              <circle cx="8" cy="8" r="1.8" stroke="currentColor" strokeWidth="1.5"/>
                            </>
                          )}
                        </svg>
                      </button>
                    </div>
                    {/* Strength indicator */}
                    {password.length > 0 && (
                      <div className="mt-2 flex gap-1">
                        {[1,2,3].map(i => (
                          <div key={i} className={`flex-1 h-1 rounded-full transition-colors ${
                            password.length >= i * 4 ? (password.length >= 10 ? "bg-emerald-400" : "bg-accent") : "bg-warm"
                          }`} />
                        ))}
                        <span className="text-[10px] text-muted ml-1">
                          {password.length < 4 ? "Weak" : password.length < 8 ? "Fair" : password.length < 10 ? "Good" : "Strong"}
                        </span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold tracking-[0.14em] uppercase text-muted mb-2">Confirm password</label>
                    <div className="relative">
                      <input type={showCf ? "text" : "password"} value={confirm}
                        onChange={e => { setConfirm(e.target.value); setError(""); }}
                        placeholder="Re-enter your password" required
                        className={`w-full border rounded-xl px-4 py-3 pr-11 text-sm text-ink placeholder:text-muted/50 focus:outline-none focus:ring-2 transition-all ${
                          !pwMatch ? "border-red-300 focus:border-red-400 focus:ring-red-100" : "border-border focus:border-accent focus:ring-accent/10"
                        }`} />
                      <button type="button" onClick={() => setShowCf(v => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
                          {showCf ? (
                            <>
                              <path d="M2 8s2.5-5 6-5 6 5 6 5-2.5 5-6 5-6-5-6-5z" stroke="currentColor" strokeWidth="1.5"/>
                              <circle cx="8" cy="8" r="1.8" stroke="currentColor" strokeWidth="1.5"/>
                              <path d="M2 2l12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                            </>
                          ) : (
                            <>
                              <path d="M2 8s2.5-5 6-5 6 5 6 5-2.5 5-6 5-6-5-6-5z" stroke="currentColor" strokeWidth="1.5"/>
                              <circle cx="8" cy="8" r="1.8" stroke="currentColor" strokeWidth="1.5"/>
                            </>
                          )}
                        </svg>
                      </button>
                    </div>
                    {!pwMatch && confirm.length > 0 && (
                      <p className="text-[11px] text-red-500 mt-1">Passwords do not match</p>
                    )}
                  </div>

                  {error && (
                    <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                      <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 16 16">
                        <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.4"/>
                        <path d="M8 5v3.5M8 10.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                      <p className="text-[12px] text-red-700">{error}</p>
                    </motion.div>
                  )}

                  <button type="submit" disabled={!email || !password || !confirm}
                    className="w-full flex items-center justify-center gap-2 rounded-2xl py-3.5 text-[15px] font-bold text-white disabled:opacity-50 transition-all active:scale-[0.98]"
                    style={{ background: "linear-gradient(135deg,#FF5214 0%,#D93A00 100%)", boxShadow: "0 4px 16px rgba(255,69,0,0.28)" }}>
                    Continue
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>

                  {/* Divider */}
                  <div className="flex items-center gap-3 my-1">
                    <div className="flex-1 h-px bg-border" />
                    <span className="text-[11px] text-muted font-medium">or</span>
                    <div className="flex-1 h-px bg-border" />
                  </div>

                  {/* Google */}
                  <button type="button"
                    className="w-full flex items-center justify-center gap-2.5 border border-border rounded-2xl py-3 text-sm font-semibold text-ink hover:bg-warm transition-colors">
                    <svg className="w-4 h-4" viewBox="0 0 16 16">
                      <path d="M15.5 8.17c0-.52-.05-1.02-.13-1.5H8v2.84h4.19a3.58 3.58 0 01-1.55 2.35v1.95h2.51C14.67 12.33 15.5 10.4 15.5 8.17z" fill="#4285F4"/>
                      <path d="M8 16c2.1 0 3.87-.7 5.16-1.89l-2.51-1.95c-.7.47-1.59.74-2.65.74-2.04 0-3.76-1.38-4.38-3.23H1.04v2.01A8 8 0 008 16z" fill="#34A853"/>
                      <path d="M3.62 9.67A4.8 4.8 0 013.37 8c0-.58.1-1.14.25-1.67V4.32H1.04A8 8 0 000 8c0 1.29.31 2.51.86 3.59l2.76-1.92z" fill="#FBBC05"/>
                      <path d="M8 3.18c1.15 0 2.18.4 2.99 1.17l2.24-2.24C11.87.79 10.1 0 8 0A8 8 0 001.04 4.32l2.58 2.01C4.24 4.56 5.96 3.18 8 3.18z" fill="#EA4335"/>
                    </svg>
                    Continue with Google
                  </button>
                </motion.form>
              )}

              {/* ── Step 2: Profile ── */}
              {step === "profile" && (
                <motion.form key="profile" onSubmit={handleStep2}
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.22 }} className="space-y-4">

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold tracking-[0.14em] uppercase text-muted mb-2">Full name</label>
                      <input value={name} onChange={e => setName(e.target.value)}
                        placeholder="Alex Johnson" required
                        className="w-full border border-border rounded-xl px-4 py-3 text-sm text-ink placeholder:text-muted/50 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold tracking-[0.14em] uppercase text-muted mb-2">Username</label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted text-sm">@</span>
                        <input value={username} onChange={e => setUsername(e.target.value.replace(/\s/g, ""))}
                          placeholder="alexj" required
                          className="w-full border border-border rounded-xl pl-7 pr-4 py-3 text-sm text-ink placeholder:text-muted/50 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold tracking-[0.14em] uppercase text-muted mb-2">Location <span className="text-muted/60 normal-case tracking-normal font-normal">(optional)</span></label>
                    <div className="relative">
                      <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted" fill="none" viewBox="0 0 14 14">
                        <path d="M7 1C4.8 1 3 2.8 3 5c0 3 4 8 4 8s4-5 4-8c0-2.2-1.8-4-4-4z" stroke="currentColor" strokeWidth="1.3"/>
                        <circle cx="7" cy="5" r="1.3" fill="currentColor"/>
                      </svg>
                      <input value={location} onChange={e => setLocation(e.target.value)}
                        placeholder="City, Country"
                        className="w-full border border-border rounded-xl pl-8 pr-4 py-3 text-sm text-ink placeholder:text-muted/50 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all" />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => setStep("account")}
                      className="px-5 py-3 rounded-2xl border border-border text-[13px] font-semibold text-muted hover:text-ink transition-colors">
                      Back
                    </button>
                    <button type="submit" disabled={!name || !username}
                      className="flex-1 flex items-center justify-center gap-2 rounded-2xl py-3 text-[15px] font-bold text-white disabled:opacity-50 transition-all active:scale-[0.98]"
                      style={{ background: "linear-gradient(135deg,#FF5214 0%,#D93A00 100%)", boxShadow: "0 4px 16px rgba(255,69,0,0.28)" }}>
                      Continue
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
                        <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </motion.form>
              )}

              {/* ── Step 3: Role ── */}
              {step === "role" && (
                <motion.form key="role" onSubmit={handleStep3}
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.22 }} className="space-y-3">

                  {ROLES.map(r => (
                    <button key={r.id} type="button" onClick={() => { setRole(r.id); setError(""); }}
                      className={`w-full flex items-start gap-4 p-4 rounded-2xl border text-left transition-all ${
                        role === r.id
                          ? "border-accent bg-accent-light"
                          : "border-border hover:border-ink/20 hover:bg-warm"
                      }`}>
                      <span className="text-2xl flex-shrink-0 mt-0.5">{r.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-ink text-[14px]">{r.title}</p>
                          <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 transition-all ${
                            role === r.id ? "border-accent bg-accent" : "border-border"
                          }`}>
                            {role === r.id && (
                              <svg className="w-full h-full text-white p-0.5" fill="none" viewBox="0 0 10 10">
                                <path d="M2 5l2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            )}
                          </div>
                        </div>
                        <p className="text-[12px] text-muted mt-0.5 leading-relaxed">{r.desc}</p>
                      </div>
                    </button>
                  ))}

                  {error && (
                    <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                      <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 16 16">
                        <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.4"/>
                        <path d="M8 5v3.5M8 10.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                      <p className="text-[12px] text-red-700">{error}</p>
                    </motion.div>
                  )}

                  <div className="flex gap-3 pt-1">
                    <button type="button" onClick={() => setStep("profile")}
                      className="px-5 py-3 rounded-2xl border border-border text-[13px] font-semibold text-muted hover:text-ink transition-colors">
                      Back
                    </button>
                    <button type="submit" disabled={!role || loading}
                      className="flex-1 flex items-center justify-center gap-2 rounded-2xl py-3 text-[15px] font-bold text-white disabled:opacity-50 transition-all active:scale-[0.98]"
                      style={{ background: "linear-gradient(135deg,#FF5214 0%,#D93A00 100%)", boxShadow: "0 4px 16px rgba(255,69,0,0.28)" }}>
                      {loading ? (
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 16 16">
                          <circle className="opacity-25" cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2"/>
                          <path className="opacity-75" d="M8 2a6 6 0 016 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      ) : (
                        <>
                          Create account
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
                            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </>
                      )}
                    </button>
                  </div>
                </motion.form>
              )}

              {/* ── Done ── */}
              {step === "done" && (
                <motion.div key="done"
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="text-center py-4">
                  <motion.div
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.1 }}
                    className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center mx-auto mb-5">
                    <svg className="w-7 h-7 text-emerald-500" fill="none" viewBox="0 0 24 24">
                      <path d="M5 12l5 5L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </motion.div>
                  <h2 className="text-[1.5rem] font-black text-ink tracking-tight mb-1">Welcome, {name}!</h2>
                  <p className="text-sm text-muted mb-7">Your account has been created. You're ready to start using handi.</p>
                  <button onClick={() => router.push("/membership")}
                    className="w-full flex items-center justify-center gap-2 rounded-2xl py-3.5 text-[15px] font-bold text-white transition-all active:scale-[0.98]"
                    style={{ background: "linear-gradient(135deg,#FF5214 0%,#D93A00 100%)", boxShadow: "0 4px 16px rgba(255,69,0,0.28)" }}>
                    Go to my dashboard
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </motion.div>
              )}

            </AnimatePresence>

            {/* Sign in link */}
            {step !== "done" && (
              <p className="text-center text-[12px] text-muted mt-6">
                Already have an account?{" "}
                <Link href="/signin" className="text-accent font-semibold hover:underline">
                  Sign in
                </Link>
              </p>
            )}
          </div>
        </motion.div>
      </main>
    </>
  );
}
