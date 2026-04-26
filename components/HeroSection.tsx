"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const CITY_PHOTOS = [
  { src: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1600&q=85", alt: "New York" },
  { src: "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=1600&q=85", alt: "Tokyo" },
  { src: "https://images.unsplash.com/photo-1548115184-bc6544d06a58?w=1600&q=85", alt: "Seoul" },
  { src: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1600&q=85", alt: "Paris" },
  { src: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1600&q=85", alt: "London" },
];

const ROTATE_MS = 6000;

export default function HeroSection() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setActive(a => (a + 1) % CITY_PHOTOS.length), ROTATE_MS);
    return () => clearTimeout(t);
  }, [active]);

  return (
    <section className="relative min-h-screen bg-[#0A0A09] flex overflow-hidden">

      {/* Right — rotating city photos */}
      <div className="absolute right-0 top-0 bottom-0 w-full lg:w-[52%]">
        {CITY_PHOTOS.map((photo, i) => (
          <motion.div
            key={photo.alt}
            className="absolute inset-0"
            animate={{ opacity: i === active ? 1 : 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            style={{ pointerEvents: "none" }}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              unoptimized
              className="object-cover object-center"
              priority={i === 0}
            />
          </motion.div>
        ))}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(to right, #0A0A09 0%, #0A0A09 10%, rgba(10,10,9,0.75) 45%, rgba(10,10,9,0.1) 100%)" }} />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(to top, #0A0A09 0%, transparent 28%)" }} />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, #0A0A09 0%, transparent 18%)" }} />
        <div className="absolute inset-0 pointer-events-none" style={{ background: "rgba(10,10,9,0.25)" }} />
      </div>

      {/* Left — content */}
      <div className="relative z-10 flex flex-col min-h-screen w-full lg:w-[60%] px-10 lg:px-20 xl:px-28">

        <div className="flex-1 flex flex-col justify-center pt-36 pb-20">

          <motion.p
            className="text-[10px] font-bold tracking-[0.35em] uppercase mb-12"
            style={{ color: "rgba(255,255,255,0.18)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.1 }}
          >
            Peer-to-peer carry network · 68 cities
          </motion.p>

          <div className="overflow-hidden mb-1">
            <motion.h1
              className="font-black text-white leading-[0.91] tracking-tight"
              style={{ fontSize: "clamp(60px, 8vw, 112px)" }}
              initial={{ y: "105%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.95, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            >
              Get anything.
            </motion.h1>
          </div>
          <div className="overflow-hidden mb-11">
            <motion.h1
              className="font-black leading-[0.91] tracking-tight"
              style={{ fontSize: "clamp(60px, 8vw, 112px)", color: "#FF4500" }}
              initial={{ y: "105%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.95, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              From anywhere.
            </motion.h1>
          </div>

          <motion.p
            className="text-[15px] leading-relaxed max-w-[390px] mb-12"
            style={{ color: "rgba(255,255,255,0.38)" }}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.46, ease: [0.22, 1, 0.36, 1] }}
          >
            Real travelers carry exclusive, local items from any city —
            directly to you. Retail price, no shipping, no customs.
          </motion.p>

          <motion.div
            className="flex items-center gap-6"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.58 }}
          >
            <Link
              href="/browse"
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full font-bold text-[14px] text-white transition-all duration-200 hover:brightness-110 active:scale-[0.97]"
              style={{ background: "#FF4500" }}
            >
              Browse travelers
              <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
                <path d="M3 8h10M8 3l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <Link
              href="/post-trip"
              className="text-[14px] font-semibold transition-colors duration-200"
              style={{ color: "rgba(255,255,255,0.32)" }}
            >
              I&apos;m a traveler →
            </Link>
          </motion.div>
        </div>

        {/* Stats strip */}
        <motion.div
          className="pb-14"
          style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.75 }}
        >
          <div className="flex items-start gap-10 pt-10">
            {[
              ["12,400+", "orders completed"],
              ["3,200+",  "active travelers"],
              ["68",      "cities worldwide"],
            ].map(([v, l]) => (
              <div key={l}>
                <p className="text-white font-black text-[22px] leading-none mb-1.5">{v}</p>
                <p className="text-[11px] tracking-wide" style={{ color: "rgba(255,255,255,0.22)" }}>{l}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

    </section>
  );
}
