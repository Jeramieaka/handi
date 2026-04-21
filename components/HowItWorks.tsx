"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const BUYER = [
  { n:"01", icon:"🔍", title:"Find your item",       body:"Browse by city or item type. See which travelers are active, their ratings, and what they can carry." },
  { n:"02", icon:"🤝", title:"Choose your carrier",   body:"Review ratings, read reviews, and chat directly before committing. Full transparency on every profile." },
  { n:"03", icon:"💳", title:"Pay & track",           body:"Secure checkout. Payment held until you confirm receipt. Every step notified in real-time." },
];
const TRAVELER = [
  { n:"01", icon:"✈️", title:"Post your trip",        body:"Add your route and travel dates. We suggest a fair price based on distance, demand, and carry weight." },
  { n:"02", icon:"🛍️", title:"List what you carry",   body:"Choose item categories you're comfortable with. Buyers request from you — you accept or decline." },
  { n:"03", icon:"💰", title:"Deliver & get paid",    body:"Complete the handoff. Buyer confirms. Your payment hits your account the same day." },
];

const TABS = [
  { label: "For Buyers",    icon: "🛒", steps: BUYER,    cta: "Start browsing →", href: "/browse"    },
  { label: "For Travelers", icon: "✈️", steps: TRAVELER, cta: "Post your trip →", href: "/post-trip" },
];

export default function HowItWorks() {
  const [tab, setTab] = useState(0);
  const col = TABS[tab];

  return (
    <section id="how-it-works" className="bg-ink border-t border-white/5 py-24 px-6">
      <div className="max-w-3xl mx-auto">

        <div className="text-center mb-12">
          <motion.p initial={{ opacity:0, y:12 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
            transition={{ duration:0.5 }} className="eyebrow mb-4 text-accent">
            How it works
          </motion.p>
          <motion.h2 initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
            transition={{ duration:0.6, delay:0.1 }} className="text-d2 font-black text-white">
            Simple by design.
          </motion.h2>
          <motion.p initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
            transition={{ duration:0.5, delay:0.2 }} className="mt-3 text-white/40 text-sm max-w-sm mx-auto">
            Buyer or traveler — the whole flow takes under 3 minutes.
          </motion.p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-10">
          <div className="flex bg-white/6 rounded-full p-1 border border-white/10 gap-1">
            {TABS.map((t, i) => (
              <button
                key={t.label}
                onClick={() => setTab(i)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-200 ${
                  i === tab ? "bg-accent text-white shadow" : "text-white/50 hover:text-white"
                }`}
              >
                <span>{t.icon}</span>{t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Steps */}
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="space-y-0"
          >
            {col.steps.map((s, i) => (
              <div key={s.n} className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-11 h-11 rounded-2xl bg-white/8 border border-white/10 flex items-center justify-center text-xl flex-shrink-0">
                    {s.icon}
                  </div>
                  {i < col.steps.length - 1 && (
                    <div className="w-px flex-1 bg-white/8 my-2 min-h-[2rem]" />
                  )}
                </div>
                <div className="pb-8">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-black tracking-[0.25em] text-accent/60 uppercase">{s.n}</span>
                    <h4 className="text-[16px] font-bold text-white">{s.title}</h4>
                  </div>
                  <p className="text-sm text-white/45 leading-relaxed">{s.body}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-center mt-2">
          <Link href={col.href} className="btn-ghost-white text-sm px-7 py-3">
            {col.cta}
          </Link>
        </div>
      </div>
    </section>
  );
}
