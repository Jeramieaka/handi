"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const CITIES = [
  {
    num: "01", city: "New York", flag: "🗽",
    tagline: "The city that never stops dropping.",
    sub: "NYC exclusives live and die in 24 hours. Sneaker collabs, street food, rare supplements — our travelers are already there.",
    items: ["Limited sneaker collabs", "Kith & Supreme NYC drops", "Levain cookies & NYC deli goods", "Rare supplements & wellness"],
    imgSrc: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1600&q=85",
  },
  {
    num: "02", city: "Tokyo", flag: "🗼",
    tagline: "Where limited means truly one-of-a-kind.",
    sub: "Japan's culture of craft and scarcity creates a permanent global wishlist. Pokémon Center, seasonal wagashi, Harajuku finds.",
    items: ["Pokémon Center exclusives", "Gacha & blind-box collectibles", "Seasonal wagashi & snacks", "Harajuku fashion & vintage"],
    imgSrc: "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=1600&q=85",
  },
  {
    num: "03", city: "Seoul", flag: "🇰🇷",
    tagline: "K-culture, delivered fresh.",
    sub: "Olive Young, Gentle Monster, K-pop merch drops. Seoul sets trends the world follows six months later.",
    items: ["Olive Young & COSRX skincare", "K-pop limited album merch", "Gentle Monster & Ader Error", "Dongdaemun cutting-edge fashion"],
    imgSrc: "https://images.unsplash.com/photo-1548115184-bc6544d06a58?w=1600&q=85",
  },
  {
    num: "04", city: "Paris", flag: "🗺️",
    tagline: "Luxury, pastry, and savoir-faire.",
    sub: "Parisian exclusives carry a prestige that can't be replicated — whether it's a patisserie box or a fashion house drop.",
    items: ["Ladurée & Pierre Hermé macarons", "Maison Margiela & A.P.C. drops", "Niche perfumery & apothecary", "Galeries Lafayette exclusives"],
    imgSrc: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1600&q=85",
  },
  {
    num: "05", city: "London", flag: "🇬🇧",
    tagline: "Iconic British finds, done properly.",
    sub: "Harrods hampers, M&S seasonal ranges, New Balance Made in UK — London's curation is unlike any other city.",
    items: ["Harrods biscuit tins & hampers", "M&S seasonal treats", "New Balance Made in UK", "Portobello Road vintage"],
    imgSrc: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1600&q=85",
  },
];

export default function CityScrollSection() {
  const [active, setActive] = useState(0);
  const c = CITIES[active];

  return (
    <section className="relative overflow-hidden" style={{ minHeight: "92vh" }}>

      {/* Full-bleed background image with crossfade */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <Image
            src={c.imgSrc}
            alt={c.city}
            fill
            unoptimized
            className="object-cover object-center"
          />
          {/* Left-to-right gradient — content lives on left */}
          <div className="absolute inset-0" style={{
            background: "linear-gradient(to right, rgba(10,8,6,0.92) 0%, rgba(10,8,6,0.70) 40%, rgba(10,8,6,0.15) 75%, rgba(10,8,6,0.05) 100%)"
          }} />
          {/* Bottom fade */}
          <div className="absolute inset-0" style={{
            background: "linear-gradient(to top, rgba(10,8,6,0.85) 0%, transparent 45%)"
          }} />
          {/* Top fade */}
          <div className="absolute inset-0" style={{
            background: "linear-gradient(to bottom, rgba(10,8,6,0.5) 0%, transparent 30%)"
          }} />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 flex flex-col" style={{ minHeight: "92vh" }}>

        {/* Top label */}
        <div className="px-10 lg:px-16 pt-14">
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-white/35">What you can get</p>
        </div>

        {/* Center content */}
        <div className="flex-1 flex items-end px-10 lg:px-16 pb-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-lg"
            >
              {/* Counter */}
              <p className="text-[10px] font-black tracking-[0.3em] text-white/30 uppercase mb-5">
                {c.num} / 05
              </p>

              {/* City name */}
              <h2 className="font-black text-white leading-none tracking-tight mb-5"
                style={{ fontSize: "clamp(56px, 9vw, 112px)" }}>
                {c.city}
              </h2>

              {/* Tagline */}
              <p className="text-[18px] lg:text-[22px] font-bold text-white/90 leading-snug mb-3">
                {c.tagline}
              </p>

              {/* Description */}
              <p className="text-[13px] text-white/50 leading-relaxed mb-7 max-w-[360px]">
                {c.sub}
              </p>

              {/* Item pills */}
              <div className="flex flex-wrap gap-2 mb-8">
                {c.items.map(item => (
                  <span
                    key={item}
                    className="px-3 py-1.5 rounded-full text-[11px] font-semibold text-white/75 border border-white/15"
                    style={{ background: "rgba(255,255,255,0.07)", backdropFilter: "blur(10px)" }}
                  >
                    {item}
                  </span>
                ))}
              </div>

              {/* CTA */}
              <Link
                href="/browse"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-[13px] text-white transition-all duration-200 hover:scale-105"
                style={{ background: "rgba(255,69,0,1)", boxShadow: "0 0 0 1px rgba(255,69,0,0.3), 0 8px 24px rgba(255,69,0,0.35)" }}
              >
                Browse {c.city} offers
                <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
                  <path d="M3 8h10M8 3l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* City selector tabs at bottom */}
        <div className="px-10 lg:px-16 pb-10">
          <div className="flex items-center gap-2 flex-wrap">
            {CITIES.map((city, i) => (
              <button
                key={city.city}
                onClick={() => setActive(i)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full transition-all duration-300"
                style={
                  i === active
                    ? { background: "rgba(255,255,255,1)", color: "#0C0C0B", fontWeight: 700, fontSize: "13px" }
                    : { background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.55)", fontWeight: 600, fontSize: "13px", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.12)" }
                }
              >
                <span className="text-base leading-none">{city.flag}</span>
                <span>{city.city}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
