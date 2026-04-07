"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Stage = "idle" | "flying" | "splitting" | "done";

export default function EntranceScreen() {
  const [visible, setVisible] = useState(false);
  const [zip, setZip] = useState("");
  const [stage, setStage] = useState<Stage>("idle");
  const inputRef = useRef<HTMLInputElement>(null);

  /* Check session on mount — only show once per session */
  useEffect(() => {
    const entered = sessionStorage.getItem("handi_entered");
    if (!entered) {
      setVisible(true);
      setTimeout(() => inputRef.current?.focus(), 400);
    }
  }, []);

  const handleSubmit = () => {
    if (stage !== "idle") return;
    setStage("flying");

    // Curtains open when plane is crossing center (~30% into flight)
    setTimeout(() => setStage("splitting"), 750);

    // Done after curtains finish (750 + 600 + 100 buffer)
    setTimeout(() => {
      sessionStorage.setItem("handi_entered", "1");
      if (zip.trim()) {
        sessionStorage.setItem("handi_zip", zip.trim());
        window.dispatchEvent(new Event("storage"));
      }
      setStage("done");
      setTimeout(() => setVisible(false), 80);
    }, 1550);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSubmit();
  };

  if (!visible) return null;

  const isFlying   = stage === "flying" || stage === "splitting" || stage === "done";
  const isSplitting = stage === "splitting" || stage === "done";

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Top curtain */}
          <motion.div
            key="curtain-top"
            className="fixed top-0 left-0 w-full h-1/2 z-[55] pointer-events-none"
            style={{ backgroundColor: "#0C0C0B" }}
            animate={isSplitting ? { y: "-100%" } : { y: 0 }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          />

          {/* Bottom curtain */}
          <motion.div
            key="curtain-bottom"
            className="fixed bottom-0 left-0 w-full h-1/2 z-[55] pointer-events-none"
            style={{ backgroundColor: "#0C0C0B" }}
            animate={isSplitting ? { y: "100%" } : { y: 0 }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          />

          {/* Airplane — flies across the screen */}
          <motion.div
            key="airplane"
            className="fixed top-1/2 -translate-y-1/2 z-[60] pointer-events-none"
            initial={{ x: -200 }}
            animate={isFlying ? { x: "calc(100vw + 200px)" } : { x: -200 }}
            transition={{ duration: 2.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Try airplane.png first; fallback to SVG */}
            <AirplaneSVG />
          </motion.div>

          {/* Form overlay — sits above curtains on z-[56], fades out when flying */}
          <motion.div
            key="form"
            className="fixed inset-0 z-[56] flex flex-col items-center justify-center px-6"
            style={{ backgroundColor: "#0C0C0B" }}
            animate={isFlying ? { opacity: 0, pointerEvents: "none" } : { opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {/* Subtle noise texture */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
              style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")" }}
            />

            <motion.div
              className="w-full max-w-[480px] text-center relative z-10"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Logo mark */}
              <div className="flex items-center justify-center gap-1 mb-10">
                <span className="text-[22px] font-black tracking-tight text-white">handi</span>
                <span className="w-[6px] h-[6px] rounded-full bg-accent mb-3" />
              </div>

              {/* Headline */}
              <h1 className="text-[clamp(1.9rem,5vw,3rem)] font-black text-white leading-[1.05] tracking-[-0.04em] mb-3">
                Where are you shopping from?
              </h1>
              <p className="text-[14px] text-white/35 mb-8">
                Enter your ZIP so we can show travelers near you.
              </p>

              {/* Input */}
              <input
                ref={inputRef}
                type="text"
                inputMode="numeric"
                maxLength={10}
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                onKeyDown={handleKey}
                placeholder="e.g. 10001"
                className="w-full text-center text-[1.125rem] text-white/80 placeholder:text-white/20
                           bg-white/[0.06] border border-white/10 rounded-full
                           px-7 py-5 mb-4
                           focus:outline-none focus:border-white/20 focus:bg-white/[0.08]
                           transition-all duration-200"
              />

              {/* ZIP preview pill — appears when user types */}
              <div className="h-8 mb-6 flex items-center justify-center">
                <AnimatePresence>
                  {zip.trim().length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.85, y: 4 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.85, y: 4 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center gap-2 bg-accent/15 border border-accent/25 rounded-full px-4 py-1.5"
                    >
                      <svg className="w-3 h-3 text-accent" fill="none" viewBox="0 0 16 16">
                        <path d="M8 1.5C5.5 1.5 3.5 3.5 3.5 6c0 3.5 4.5 8.5 4.5 8.5S12.5 9.5 12.5 6c0-2.5-2-4.5-4.5-4.5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="8" cy="6" r="1.5" stroke="currentColor" strokeWidth="1.5"/>
                      </svg>
                      <span className="text-[13px] font-semibold text-accent tracking-wide">{zip}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Primary button */}
              <button
                onClick={handleSubmit}
                className="w-full inline-flex items-center justify-center gap-2.5
                           active:scale-[0.97] text-white font-bold text-[16px]
                           rounded-full px-10 py-4 transition-all duration-200 mb-4"
                style={{ background: "linear-gradient(135deg, #FF5214 0%, #D93A00 100%)", boxShadow: "0 4px 20px rgba(255,69,0,0.35)" }}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
                  <path d="M6 2L3 6v8a1 1 0 001 1h8a1 1 0 001-1V6l-3-4z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="3" y1="6" x2="13" y2="6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                  <path d="M10 9a2 2 0 01-4 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Start shopping
              </button>

              {/* Skip */}
              <button
                onClick={handleSubmit}
                className="text-[13px] text-white/25 hover:text-white/50 transition-colors duration-200"
              >
                Skip for now →
              </button>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function AirplaneSVG() {
  return (
    <div className="relative">
      <svg
        width="200"
        height="80"
        viewBox="0 0 200 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-[0_0_28px_rgba(255,69,0,0.45)]"
      >
        {/* Fuselage */}
        <ellipse cx="104" cy="40" rx="76" ry="13" fill="white" />
        {/* Nose cone */}
        <path d="M180 40 C194 37 198 40 196 43 C194 46 180 43 180 40Z" fill="white" />
        {/* Tail fin vertical */}
        <path d="M32 40 L18 16 L40 30 Z" fill="white" />
        {/* Main wing */}
        <path d="M115 40 L88 10 L145 28 Z" fill="white" opacity="0.92"/>
        {/* Rear stabiliser */}
        <path d="M44 40 L34 54 L58 46 Z" fill="white" opacity="0.85"/>
        {/* Engine pod */}
        <ellipse cx="112" cy="51" rx="16" ry="6" fill="#DEDAD4" />
        {/* Accent stripe on fuselage */}
        <rect x="50" y="37" width="120" height="2" rx="1" fill="#FF4500" opacity="0.7" />
        {/* Windows */}
        <circle cx="160" cy="37" r="3" fill="#0C0C0B" opacity="0.25"/>
        <circle cx="148" cy="36" r="3" fill="#0C0C0B" opacity="0.25"/>
        <circle cx="136" cy="35.5" r="3" fill="#0C0C0B" opacity="0.25"/>
        <circle cx="124" cy="35" r="3" fill="#0C0C0B" opacity="0.25"/>
        {/* handi wordmark on fuselage side */}
        <text
          x="72"
          y="44"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="10"
          fontWeight="900"
          letterSpacing="-0.3"
          fill="#0C0C0B"
          opacity="0.55"
        >
          handi
        </text>
        {/* Dot after handi */}
        <circle cx="103" cy="40" r="2" fill="#FF4500" opacity="0.7" />
        {/* Exhaust trail */}
        <ellipse cx="22" cy="40" rx="10" ry="4" fill="rgba(255,69,0,0.45)" />
        <ellipse cx="10" cy="40" rx="7" ry="2.5" fill="rgba(255,69,0,0.20)" />
      </svg>
    </div>
  );
}
