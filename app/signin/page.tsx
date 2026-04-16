"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

// Demo credentials
const DEMO_EMAIL    = "demo@handi.com";
const DEMO_PASSWORD = "12345";

export default function SignInPage() {
  const router = useRouter();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [welcome,  setWelcome]  = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    await new Promise(r => setTimeout(r, 800));

    if (email.trim().toLowerCase() === DEMO_EMAIL && password === DEMO_PASSWORD) {
      sessionStorage.setItem("handi_user", "Alex");
      window.dispatchEvent(new Event("storage"));
      setLoading(false);
      setWelcome(true);
      await new Promise(r => setTimeout(r, 2200));
      setWelcome(false);
      await new Promise(r => setTimeout(r, 500));
      router.push("/membership");
    } else {
      setError("Incorrect email or password. Try the demo credentials below.");
      setLoading(false);
    }
  };

  return (
    <>
      {/* Welcome overlay */}
      <AnimatePresence>
        {welcome && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, filter: "blur(12px)" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[300] flex items-center justify-center overflow-hidden"
            style={{ background: "#0C0C0B", willChange: "opacity" }}
          >
            {/* Radial glow */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.3 }}
              transition={{ duration: 1.0, ease: "easeOut" }}
              className="absolute w-[700px] h-[700px] rounded-full pointer-events-none"
              style={{
                background: "radial-gradient(circle, rgba(255,69,0,0.15) 0%, transparent 65%)",
                willChange: "transform, opacity",
              }}
            />

            <div className="relative text-center px-8" style={{ willChange: "transform" }}>
              {/* Logo */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, delay: 0.05 }}
                className="flex items-center justify-center gap-1 mb-10"
              >
                <span className="text-sm font-black tracking-tight text-white/25">handi</span>
                <span className="w-[4px] h-[4px] rounded-full bg-accent/60 mb-1.5" />
              </motion.div>

              {/* "Welcome back" */}
              <div className="overflow-hidden mb-4">
                <motion.p
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "-100%", opacity: 0 }}
                  transition={{ duration: 0.65, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                  className="text-[0.8rem] font-semibold tracking-[0.35em] uppercase text-white/30"
                  style={{ willChange: "transform" }}
                >
                  Welcome back
                </motion.p>
              </div>

              {/* Name — italic serif */}
              <div className="overflow-hidden">
                <motion.h1
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "-80%", opacity: 0 }}
                  transition={{ duration: 0.75, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="leading-none text-white"
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontStyle: "italic",
                    fontWeight: 400,
                    fontSize: "clamp(5rem, 14vw, 8rem)",
                    letterSpacing: "-0.025em",
                    willChange: "transform",
                  }}
                >
                  Alex.
                </motion.h1>
              </div>

              {/* Accent line */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                exit={{ scaleX: 0, opacity: 0 }}
                transition={{ duration: 0.6, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="h-px w-32 mx-auto mt-8 origin-left"
                style={{
                  background: "linear-gradient(90deg, #FF4500, #FF7A3C, transparent)",
                  willChange: "transform",
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Navbar />
      <main className="min-h-screen flex items-center justify-center px-4 pt-[64px]" style={{ background: "#F7F5F0" }}>

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
          className="relative w-full max-w-[420px]"
        >

          {/* Card */}
          <div className="bg-white rounded-3xl border border-border shadow-float px-8 py-10">

            {/* Logo */}
            <div className="flex items-center gap-0.5 mb-8">
              <span className="text-lg font-black tracking-tight text-ink">handi</span>
              <span className="w-[5px] h-[5px] rounded-full bg-accent mb-2" />
            </div>

            <h1 className="text-[1.75rem] font-black text-ink tracking-[-0.03em] leading-tight mb-1">
              Welcome back.
            </h1>
            <p className="text-sm text-muted mb-8">Sign in to your account to continue.</p>

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Email */}
              <div>
                <label className="block text-[11px] font-bold tracking-[0.14em] uppercase text-muted mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(""); }}
                  placeholder="you@example.com"
                  required
                  className="w-full border border-border rounded-xl px-4 py-3 text-sm text-ink placeholder:text-muted/50 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all"
                />
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-[11px] font-bold tracking-[0.14em] uppercase text-muted">
                    Password
                  </label>
                  <button type="button" className="text-[11px] text-accent hover:underline font-medium">
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={e => { setPassword(e.target.value); setError(""); }}
                    placeholder="••••••••"
                    required
                    className="w-full border border-border rounded-xl px-4 py-3 pr-11 text-sm text-ink placeholder:text-muted/50 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink transition-colors"
                    aria-label="Toggle password visibility"
                  >
                    {showPw ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
                        <path d="M2 8s2.5-5 6-5 6 5 6 5-2.5 5-6 5-6-5-6-5z" stroke="currentColor" strokeWidth="1.5"/>
                        <circle cx="8" cy="8" r="1.8" stroke="currentColor" strokeWidth="1.5"/>
                        <path d="M2 2l12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
                        <path d="M2 8s2.5-5 6-5 6 5 6 5-2.5 5-6 5-6-5-6-5z" stroke="currentColor" strokeWidth="1.5"/>
                        <circle cx="8" cy="8" r="1.8" stroke="currentColor" strokeWidth="1.5"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3"
                >
                  <svg className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 16 16">
                    <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.4"/>
                    <path d="M8 5v3.5M8 10.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  <p className="text-[12px] text-red-700 leading-snug">{error}</p>
                </motion.div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-2xl py-3.5 text-[15px] font-bold text-white transition-all active:scale-[0.98] disabled:opacity-70"
                style={{ background: "linear-gradient(135deg, #FF5214 0%, #D93A00 100%)", boxShadow: "0 4px 16px rgba(255,69,0,0.28)" }}
              >
                {loading ? (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 16 16">
                    <circle className="opacity-25" cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2"/>
                    <path className="opacity-75" d="M8 2a6 6 0 016 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                ) : (
                  <>
                    Sign in
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-border" />
              <span className="text-[11px] text-muted font-medium">or</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Google SSO placeholder */}
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2.5 border border-border rounded-2xl py-3 text-sm font-semibold text-ink hover:bg-warm transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 16 16">
                <path d="M15.5 8.17c0-.52-.05-1.02-.13-1.5H8v2.84h4.19a3.58 3.58 0 01-1.55 2.35v1.95h2.51C14.67 12.33 15.5 10.4 15.5 8.17z" fill="#4285F4"/>
                <path d="M8 16c2.1 0 3.87-.7 5.16-1.89l-2.51-1.95c-.7.47-1.59.74-2.65.74-2.04 0-3.76-1.38-4.38-3.23H1.04v2.01A8 8 0 008 16z" fill="#34A853"/>
                <path d="M3.62 9.67A4.8 4.8 0 013.37 8c0-.58.1-1.14.25-1.67V4.32H1.04A8 8 0 000 8c0 1.29.31 2.51.86 3.59l2.76-1.92z" fill="#FBBC05"/>
                <path d="M8 3.18c1.15 0 2.18.4 2.99 1.17l2.24-2.24C11.87.79 10.1 0 8 0A8 8 0 001.04 4.32l2.58 2.01C4.24 4.56 5.96 3.18 8 3.18z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>

            <p className="text-center text-[12px] text-muted mt-6">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-accent font-semibold hover:underline">
                Sign up
              </Link>
            </p>
          </div>

          {/* Demo credentials hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-4 rounded-2xl border border-border bg-white/70 backdrop-blur-sm px-5 py-4"
          >
            <p className="text-[11px] font-bold tracking-[0.14em] uppercase text-muted mb-2">Demo credentials</p>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-muted">Email</span>
                <span className="text-[12px] font-mono font-semibold text-ink">{DEMO_EMAIL}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-muted">Password</span>
                <span className="text-[12px] font-mono font-semibold text-ink">{DEMO_PASSWORD}</span>
              </div>
            </div>
          </motion.div>

        </motion.div>
      </main>
    </>
  );
}
