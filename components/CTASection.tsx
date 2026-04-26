"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const LINKS = [
  { label: "Browse",      href: "/browse"      },
  { label: "Post a Trip", href: "/post-trip"    },
  { label: "How It Works",href: "/how-it-works" },
  { label: "Membership",  href: "/membership"   },
  { label: "Privacy",     href: "#"             },
  { label: "Terms",       href: "#"             },
];

export default function CTASection() {
  return (
    <>
      <section className="relative overflow-hidden py-36 px-6" style={{ background: "#0A0A09" }}>

        {/* Background city photo — subtle */}
        <div className="absolute inset-0 pointer-events-none">
          <Image
            src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1600&q=85"
            alt="Paris"
            fill
            unoptimized
            className="object-cover object-center"
            style={{ opacity: 0.07 }}
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to right, #0A0A09 0%, rgba(10,10,9,0.85) 60%, #0A0A09 100%)" }}
          />
        </div>

        {/* Accent glow */}
        <div
          className="absolute bottom-0 left-1/4 w-[600px] h-[300px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse at center, rgba(255,69,0,0.12) 0%, transparent 70%)" }}
        />

        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="max-w-[820px]">

            <motion.p
              className="text-[10px] font-bold tracking-[0.35em] uppercase mb-10"
              style={{ color: "rgba(255,69,0,0.65)" }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Get started today — it&apos;s free
            </motion.p>

            <div className="overflow-hidden mb-2">
              <motion.h2
                className="font-black text-white leading-[0.91] tracking-tight"
                style={{ fontSize: "clamp(56px, 7.5vw, 108px)" }}
                initial={{ y: "100%" }}
                whileInView={{ y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
              >
                Ready to carry
              </motion.h2>
            </div>
            <div className="overflow-hidden mb-14">
              <motion.h2
                className="font-black leading-[0.91] tracking-tight"
                style={{ fontSize: "clamp(56px, 7.5vw, 108px)", color: "#FF4500" }}
                initial={{ y: "100%" }}
                whileInView={{ y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
              >
                the world?
              </motion.h2>
            </div>

            <motion.div
              className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-10"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.28 }}
            >
              <Link
                href="/browse"
                className="inline-flex items-center gap-2.5 px-9 py-4 rounded-full font-bold text-[15px] text-white transition-all duration-200 hover:brightness-110 active:scale-[0.97]"
                style={{ background: "#FF4500" }}
              >
                Find a traveler
                <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
                  <path d="M3 8h10M8 3l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <Link
                href="/post-trip"
                className="text-[14px] font-semibold transition-colors duration-200"
                style={{ color: "rgba(255,255,255,0.32)" }}
              >
                Post a trip →
              </Link>
            </motion.div>

            <motion.p
              className="text-[12px]"
              style={{ color: "rgba(255,255,255,0.16)" }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Free to join · No subscription fees · No hidden charges
            </motion.p>
          </div>
        </div>
      </section>

      {/* Mini footer */}
      <footer className="bg-stone border-t border-border py-10">
        <div className="wrap flex flex-col md:flex-row items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-0.5 select-none">
            <span className="font-black text-ink text-base tracking-tight">handi</span>
            <span className="w-[5px] h-[5px] rounded-full bg-accent mb-1.5" />
          </Link>
          <div className="flex flex-wrap justify-center gap-5">
            {LINKS.map((l) => (
              <Link key={l.label} href={l.href}
                className="text-xs text-muted hover:text-ink transition-colors duration-150">
                {l.label}
              </Link>
            ))}
          </div>
          <p className="text-xs text-muted">© 2025 handi. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
