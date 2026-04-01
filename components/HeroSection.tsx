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

export default function HeroSection() {
  return (
    <section className="relative min-h-screen bg-ink overflow-hidden flex flex-col">

      {/* Noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")" }}
      />

      {/* Radial glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px]
                      bg-[radial-gradient(ellipse_at_center,rgba(255,69,0,0.10),transparent_65%)]
                      pointer-events-none" />

      {/* Main content */}
      <div className="wrap flex-1 flex flex-col justify-center pt-32 pb-16 relative z-10">
        <div className="max-w-[760px]">

          {/* Eyebrow pill */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22,1,0.36,1] }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="flex items-center gap-1.5 bg-white/8 border border-white/10 rounded-full px-4 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              <span className="text-[13px] font-medium text-white/60">Peer-to-peer carry network · 68 cities</span>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.1, ease: [0.22,1,0.36,1] }}
            className="text-d1 font-black text-white mb-7 text-balance"
          >
            Get anything.
            <br />
            <span className="text-accent">From anywhere.</span>
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.22, ease: [0.22,1,0.36,1] }}
            className="text-body-lg text-white/50 max-w-[540px] mb-12 leading-relaxed"
          >
            Connect with real travelers heading your way. Get exclusive,
            local, or hard-to-find items from any city — without paying
            for international shipping.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.34, ease: [0.22,1,0.36,1] }}
            className="flex flex-col sm:flex-row items-start gap-4 mb-20"
          >
            <Link href="/browse" className="btn-primary text-[16px] px-9 py-4 shadow-[0_6px_28px_rgba(255,69,0,0.40)]">
              Find a traveler
              <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
                <path d="M3 8h10M8 3l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <Link href="/post-trip" className="btn-ghost-white text-[16px] px-9 py-4">
              I&apos;m a traveler
            </Link>
          </motion.div>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap items-center gap-6"
          >
            <div className="flex -space-x-2.5">
              {["🧑","👩","🧔","👱","🧓"].map((e,i) => (
                <span key={i} className="w-9 h-9 rounded-full bg-white/10 border-2 border-ink flex items-center justify-center text-base shadow-sm">{e}</span>
              ))}
            </div>
            <div className="h-8 w-px bg-white/10" />
            {[["12,400+","completed orders"],["3,200+","active travelers"],["4.9★","avg rating"]].map(([v,l]) => (
              <div key={l}>
                <span className="text-white font-bold text-[15px]">{v}</span>
                <span className="text-white/40 text-[13px] ml-1.5">{l}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Live activity marquee — full-width ticker at bottom of hero */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.9 }}
        className="relative z-10 border-t border-white/8 overflow-hidden bg-white/[0.03] py-4"
      >
        <div className="absolute left-0 top-0 h-full w-20 bg-gradient-to-r from-ink to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-ink to-transparent z-10 pointer-events-none" />

        <div className="marquee-track">
          {ALL.map((item, i) => (
            <div key={i} className="flex items-center gap-3 px-8 flex-shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
              <span className="text-lg leading-none">{item.emoji}</span>
              <span className="text-[13px] font-semibold text-white/80 whitespace-nowrap">{item.city}</span>
              <span className="text-[13px] text-white/35 whitespace-nowrap">{item.item}</span>
              <span className="text-[13px] font-bold text-accent whitespace-nowrap">{item.price}</span>
              <span className="text-[13px] text-white/25 whitespace-nowrap">→ {item.buyer}</span>
              <span className="ml-8 w-px h-4 bg-white/10 flex-shrink-0" />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
      >
        <span className="text-[10px] tracking-[0.3em] uppercase text-white/20 font-medium">Scroll</span>
        <motion.div animate={{ y: [0,6,0] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}>
          <svg className="w-4 h-4 text-white/20" fill="none" viewBox="0 0 16 16">
            <path d="M8 3v10M3 8l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
