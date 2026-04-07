"use client";

import { motion } from "framer-motion";
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

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-ink border-t border-white/5 py-section">
      <div className="wrap">

        {/* Header */}
        <div className="text-center mb-20">
          <motion.p initial={{ opacity:0,y:12 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }}
            transition={{ duration:0.5 }} className="eyebrow mb-5 text-accent">
            How it works
          </motion.p>
          <motion.h2 initial={{ opacity:0,y:24 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }}
            transition={{ duration:0.65, delay:0.1 }}
            className="text-d2 font-black text-white text-balance">
            Simple by design.
          </motion.h2>
          <motion.p initial={{ opacity:0,y:16 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }}
            transition={{ duration:0.55, delay:0.2 }}
            className="mt-4 text-body-lg text-white/40 max-w-md mx-auto">
            Buyer or traveler — the whole flow takes under 3 minutes.
          </motion.p>
        </div>

        {/* Two columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {[
            { label:"For Buyers",    icon:"🛒", steps: BUYER,    cta: "Start browsing →", href: "/browse"     },
            { label:"For Travelers", icon:"✈️", steps: TRAVELER, cta: "Post your trip →", href: "/post-trip"  },
          ].map((col) => (
            <motion.div key={col.label}
              initial={{ opacity:0, y:32 }} whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true, margin:"-60px" }}
              transition={{ duration:0.7, ease:[0.22,1,0.36,1] }}
            >
              {/* Column header */}
              <div className="inline-flex items-center gap-2.5 bg-white/6 border border-white/10 rounded-full px-5 py-2.5 mb-10">
                <span className="text-lg">{col.icon}</span>
                <span className="text-sm font-bold text-white">{col.label}</span>
              </div>

              {/* Steps */}
              <div className="space-y-0">
                {col.steps.map((s, i) => (
                  <motion.div
                    key={s.n}
                    initial={{ opacity: 0, x: -18 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.6, delay: i * 0.15, ease: [0.22,1,0.36,1] }}
                    className="flex gap-6 group"
                  >
                    {/* Left: number + line */}
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-2xl bg-white/8 border border-white/10 flex items-center justify-center text-xl flex-shrink-0">
                        {s.icon}
                      </div>
                      {i < col.steps.length - 1 && (
                        <div className="w-px flex-1 bg-white/8 my-2 min-h-[2rem]" />
                      )}
                    </div>

                    {/* Right: text */}
                    <div className="pb-10">
                      <div className="flex items-center gap-2.5 mb-2">
                        <span className="text-[10px] font-black tracking-[0.25em] text-accent/60 uppercase">{s.n}</span>
                        <h4 className="text-h2 text-white">{s.title}</h4>
                      </div>
                      <p className="text-sm text-white/45 leading-relaxed max-w-[360px]">{s.body}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <Link href={col.href} className="btn-ghost-white text-sm px-6 py-3">
                {col.cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
