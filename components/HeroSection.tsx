"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const MARQUEE_ITEMS = [
  { emoji: "🗽", city: "New York",   item: "Kith × New Balance",    buyer: "M. Chen",    price: "$22" },
  { emoji: "🗼", city: "Tokyo",      item: "Pokémon Center pikachu", buyer: "S. Park",    price: "$14" },
  { emoji: "🇰🇷", city: "Seoul",     item: "COSRX skincare set",    buyer: "L. Dupont",  price: "$18" },
  { emoji: "🗺️", city: "Paris",     item: "Ladurée macarons ×12",  buyer: "A. Wong",    price: "$30" },
  { emoji: "🇬🇧", city: "London",    item: "Harrods shortbread",    buyer: "R. Tanaka",  price: "$16" },
  { emoji: "🇸🇬", city: "Singapore", item: "TWG tea collection",    buyer: "J. Kim",     price: "$24" },
];

const ALL = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

// Word-by-word stagger animation
const wordVariants = {
  hidden: { opacity: 0, y: 32, filter: "blur(8px)" },
  visible: (i: number) => ({
    opacity: 1, y: 0, filter: "blur(0px)",
    transition: { duration: 0.65, delay: 0.15 + i * 0.075, ease: [0.22, 1, 0.36, 1] },
  }),
};

function AnimatedHeadline() {
  const line1 = ["Get", "anything."];
  const line2 = ["From"];

  return (
    <h1 className="text-d1 font-black text-white mb-7 text-balance leading-[0.96]">
      <span className="flex flex-wrap gap-x-[0.25em]">
        {line1.map((w, i) => (
          <motion.span key={w} custom={i} variants={wordVariants} initial="hidden" animate="visible" className="inline-block">
            {w}
          </motion.span>
        ))}
      </span>
      <span className="flex flex-wrap gap-x-[0.25em] items-baseline">
        {line2.map((w, i) => (
          <motion.span key={w} custom={line1.length + i} variants={wordVariants} initial="hidden" animate="visible" className="inline-block">
            {w}
          </motion.span>
        ))}
        {/* "anywhere." — gradient + italic + extra delay */}
        <motion.span
          custom={line1.length + line2.length}
          variants={wordVariants}
          initial="hidden"
          animate="visible"
          className="inline-block text-gradient italic"
        >
          anywhere.
        </motion.span>
      </span>
    </h1>
  );
}

// Floating orb component
function Orb({ x, y, size, delay, color }: { x: string; y: string; size: number; delay: number; color: string }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{ left: x, top: y, width: size, height: size, background: color, filter: `blur(${size * 0.6}px)` }}
      animate={{ y: [0, -20, 0], x: [0, 10, 0], scale: [1, 1.08, 1] }}
      transition={{ duration: 8 + delay, repeat: Infinity, ease: "easeInOut", delay }}
    />
  );
}

export default function HeroSection() {
  return (
    <section className="relative min-h-screen bg-ink overflow-hidden flex flex-col">

      {/* Layered background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.035]"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)", backgroundSize: "72px 72px" }} />

        {/* Floating orbs */}
        <Orb x="60%"   y="15%"  size={280} delay={0}   color="rgba(255,69,0,0.12)"  />
        <Orb x="75%"   y="55%"  size={200} delay={2.5} color="rgba(255,120,0,0.08)" />
        <Orb x="5%"    y="60%"  size={180} delay={4}   color="rgba(180,40,0,0.18)"  />
        <Orb x="45%"   y="80%"  size={350} delay={1.2} color="rgba(40,30,20,0.40)"  />

        {/* Noise */}
        <div className="absolute inset-0 opacity-[0.022]"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")" }} />
      </div>

      {/* Main content */}
      <div className="wrap flex-1 flex flex-col justify-center pt-32 pb-16 relative z-10">
        <div className="max-w-[820px]">

          {/* Eyebrow pill */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22,1,0.36,1] }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="flex items-center gap-2 border border-white/10 rounded-full px-4 py-2"
              style={{ background: "rgba(255,69,0,0.10)", backdropFilter: "blur(8px)" }}>
              <motion.span
                className="w-1.5 h-1.5 rounded-full bg-accent"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-[13px] font-medium text-white/60 tracking-wide">Peer-to-peer carry network · 68 cities</span>
            </div>
          </motion.div>

          {/* Animated headline */}
          <AnimatedHeadline />

          {/* Sub-headline */}
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.5, ease: [0.22,1,0.36,1] }}
            className="text-body-lg text-white/45 max-w-[520px] mb-12 leading-relaxed"
          >
            Connect with real travelers heading your way. Get exclusive,
            local, or hard-to-find items from any city — without paying
            for international shipping.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.62, ease: [0.22,1,0.36,1] }}
            className="flex flex-col sm:flex-row items-start gap-4 mb-20"
          >
            <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
              <Link href="/browse" className="btn-primary text-[16px] px-9 py-4">
                Find a traveler
                <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
                  <path d="M3 8h10M8 3l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link href="/post-trip" className="btn-ghost-white text-[16px] px-9 py-4">
                I'm a traveler
              </Link>
            </motion.div>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="flex flex-wrap items-center gap-4 mb-8"
          >
            {[
              { icon: "🔒", label: "Escrow payment" },
              { icon: "🛡️", label: "Buyer protection" },
              { icon: "✅", label: "ID-verified travelers" },
              { icon: "⚡", label: "24h dispute resolution" },
            ].map(b => (
              <span key={b.label} className="flex items-center gap-1.5 text-[12px] font-medium text-white/40">
                <span className="text-sm">{b.icon}</span>
                {b.label}
              </span>
            ))}
          </motion.div>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-wrap items-center gap-6"
          >
            <div className="flex -space-x-2.5">
              {["🧑","👩","🧔","👱","🧓"].map((e,i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0, x: -10 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  transition={{ delay: 0.85 + i * 0.06, type: "spring", stiffness: 400, damping: 20 }}
                  className="w-9 h-9 rounded-full border-2 flex items-center justify-center text-base"
                  style={{ background: "rgba(255,69,0,0.12)", borderColor: "rgba(255,255,255,0.12)" }}
                >
                  {e}
                </motion.span>
              ))}
            </div>
            <div className="h-8 w-px bg-white/10" />
            {[["12,400+","completed orders"],["3,200+","active travelers"],["4.9★","avg rating"]].map(([v,l], i) => (
              <motion.div
                key={l}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + i * 0.08 }}
              >
                <span className="text-white font-bold text-[15px]">{v}</span>
                <span className="text-white/35 text-[13px] ml-1.5">{l}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Live activity marquee */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.1 }}
        className="relative z-10 overflow-hidden py-4"
        style={{ borderTop: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,69,0,0.04)", backdropFilter: "blur(4px)" }}
      >
        <div className="absolute left-0 top-0 h-full w-24 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to right, #0C0C0B, transparent)" }} />
        <div className="absolute right-0 top-0 h-full w-24 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to left, #0C0C0B, transparent)" }} />

        <div className="marquee-track">
          {ALL.map((item, i) => (
            <div key={i} className="flex items-center gap-3 px-8 flex-shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0 opacity-70" />
              <span className="text-lg leading-none">{item.emoji}</span>
              <span className="text-[13px] font-semibold text-white/80 whitespace-nowrap">{item.city}</span>
              <span className="text-[13px] text-white/30 whitespace-nowrap">{item.item}</span>
              <span className="text-[13px] font-bold whitespace-nowrap text-gradient">{item.price}</span>
              <span className="text-[13px] text-white/20 whitespace-nowrap">→ {item.buyer}</span>
              <span className="ml-8 w-px h-4 flex-shrink-0" style={{ background: "rgba(255,255,255,0.08)" }} />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
      >
        <span className="text-[10px] tracking-[0.3em] uppercase text-white/15 font-medium">Scroll</span>
        <motion.div animate={{ y: [0,7,0] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}>
          <svg className="w-4 h-4 text-white/15" fill="none" viewBox="0 0 16 16">
            <path d="M8 3v10M3 8l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
