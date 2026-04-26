"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const STEPS = [
  {
    n: "01",
    title: "Request from any city",
    body: "Browse active travelers by city and item type. Send a request to someone already heading your way.",
    note: "No account needed to browse",
  },
  {
    n: "02",
    title: "Carrier picks it up at retail",
    body: "They purchase at local retail price. No customs markups, no international shipping headaches.",
    note: "Payment held in escrow until delivery",
  },
  {
    n: "03",
    title: "Receive and confirm",
    body: "Meetup, courier, or door delivery — your choice. Confirm receipt and payment releases instantly.",
    note: "Buyer protection on every order",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-28 px-6 overflow-hidden" style={{ background: "#F5F1EA" }}>
      <div className="max-w-6xl mx-auto">

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-20">
          <div>
            <motion.p
              className="text-[10px] font-bold tracking-[0.32em] uppercase mb-6"
              style={{ color: "rgba(0,0,0,0.25)" }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              How it works
            </motion.p>
            <div className="overflow-hidden">
              <motion.h2
                className="font-black text-[#0A0A09] leading-[0.92] tracking-tight"
                style={{ fontSize: "clamp(48px, 5.5vw, 76px)" }}
                initial={{ y: "100%" }}
                whileInView={{ y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              >
                Three steps.<br />That&apos;s it.
              </motion.h2>
            </div>
          </div>
          <motion.p
            className="text-[14px] leading-relaxed max-w-[280px] lg:mb-2"
            style={{ color: "rgba(0,0,0,0.38)" }}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            Buyer or traveler — the whole flow takes under 3 minutes to set up.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.65, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="pt-10 pb-14 md:pr-14"
              style={{ borderTop: "2px solid rgba(0,0,0,0.10)" }}
            >
              <p
                className="font-black leading-none mb-8 select-none"
                style={{ fontSize: "clamp(60px, 7vw, 84px)", color: "#FF4500" }}
              >
                {s.n}
              </p>
              <h3 className="text-[17px] font-bold text-[#0A0A09] mb-3 leading-snug">{s.title}</h3>
              <p className="text-[14px] leading-relaxed mb-7" style={{ color: "rgba(0,0,0,0.42)" }}>{s.body}</p>
              <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "rgba(0,0,0,0.25)" }}>
                → {s.note}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mt-4 pt-12"
          style={{ borderTop: "1px solid rgba(0,0,0,0.08)" }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Link
            href="/browse"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-[13px] text-white transition-all duration-200 hover:brightness-110 active:scale-[0.97]"
            style={{ background: "#FF4500" }}
          >
            Find a traveler
          </Link>
          <Link
            href="/post-trip"
            className="text-[13px] font-semibold transition-colors duration-200"
            style={{ color: "rgba(0,0,0,0.30)" }}
          >
            Post a trip →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
