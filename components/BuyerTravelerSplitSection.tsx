"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const CARDS = [
  {
    emoji: "🛍️",
    heading: "I want something carried",
    sub: "Browse traveler offers or post a custom request — pay only after delivery is confirmed.",
    bullets: [
      "Shop exclusive items from Tokyo, Seoul, Paris & more",
      "Escrow-protected: funds held until you confirm receipt",
      "5-day dispute window on every order",
    ],
    cta: "Browse offers",
    href: "/browse",
    accent: false,
  },
  {
    emoji: "✈️",
    heading: "I'm traveling and can carry",
    sub: "Post your route, list what you can bring, and earn carry fees on trips you're already taking.",
    bullets: [
      "Earn $10–$45 per item — zero extra effort",
      "You control what you carry and how many orders",
      "Get paid as soon as the buyer confirms receipt",
    ],
    cta: "Post your trip",
    href: "/post-trip",
    accent: true,
  },
];

export default function BuyerTravelerSplitSection() {
  return (
    <section className="bg-stone border-t border-border py-20">
      <div className="wrap">
        <div className="text-center mb-12">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="eyebrow mb-4"
          >
            Two ways to use handi
          </motion.p>
          <div className="overflow-hidden">
            <motion.h2
              initial={{ y: "100%" }}
              whileInView={{ y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="text-d2 font-black text-ink"
            >
              Which one are you?
            </motion.h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
          {CARDS.map((card, i) => (
            <motion.div
              key={card.href}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex flex-col bg-white border border-border rounded-3xl p-8 shadow-soft hover:shadow-card transition-shadow duration-300"
            >
              {/* Accent top bar */}
              {card.accent && (
                <div className="absolute top-0 left-8 right-8 h-[3px] rounded-full bg-accent" />
              )}

              <div className="text-5xl mb-6">{card.emoji}</div>

              <h3 className="text-[22px] font-black text-ink leading-snug mb-3">
                {card.heading}
              </h3>
              <p className="text-[14px] text-muted leading-relaxed mb-7">
                {card.sub}
              </p>

              <ul className="space-y-2.5 mb-8 flex-1">
                {card.bullets.map(b => (
                  <li key={b} className="flex items-start gap-2.5">
                    <span className="text-accent font-black text-[11px] mt-[3px] flex-shrink-0">✓</span>
                    <span className="text-[13px] text-ink/70 leading-snug">{b}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={card.href}
                className={`inline-flex items-center justify-center gap-2 rounded-2xl py-3.5 px-6 text-[14px] font-bold transition-all active:scale-[0.98] ${
                  card.accent
                    ? "text-white"
                    : "border border-border text-ink hover:border-accent/40 hover:text-accent hover:bg-accent-light"
                }`}
                style={card.accent ? {
                  background: "linear-gradient(135deg, #FF5214 0%, #D93A00 100%)",
                  boxShadow: "0 4px 16px rgba(255,69,0,0.25)",
                } : {}}
              >
                {card.cta}
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 14 14">
                  <path d="M2.5 7h9M8 3.5L11.5 7 8 10.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
