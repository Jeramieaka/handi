"use client";

import { useRef } from "react";
import { motion } from "framer-motion";

const T = [
  {
    quote: "I'd been hunting for Pokémon Center plushies for months. Found a traveler heading back from Tokyo — got them at retail price in a week. This platform is genuinely magic.",
    name: "Emily R.", role: "Buyer · New York", emoji: "👩", rating: 5, route: "Tokyo → NYC",
  },
  {
    quote: "I travel for work constantly. I've made over $600 just by carrying skincare and snacks on routes I was already flying. It's the most effortless side income I've ever had.",
    name: "David K.", role: "Top Carrier · Seoul", emoji: "🧔", rating: 5, route: "Seoul → London",
  },
];

export default function TestimonialsSection() {
  const trackRef = useRef<HTMLDivElement>(null);

  return (
    <section className="bg-white border-t border-border py-section overflow-hidden">
      <div className="wrap mb-14">
        <div className="text-center">
          <motion.p initial={{ opacity:0,y:12 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }}
            transition={{ duration:0.5 }} className="eyebrow mb-5">
            Real stories
          </motion.p>
          <div className="overflow-hidden">
            <motion.h2
              initial={{ y: "100%" }}
              whileInView={{ y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.22,1,0.36,1] }}
              className="text-d2 font-black text-ink"
            >
              People love handi.
            </motion.h2>
          </div>
          <motion.p initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
            transition={{ duration:0.5, delay:0.2 }}
            className="mt-3 text-muted text-sm max-w-sm mx-auto">
            Real buyers and travelers — real results.
          </motion.p>
        </div>

      </div>

      <div className="wrap">
      <div
        ref={trackRef}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto"
      >
        {T.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.65, delay: i * 0.07, ease: [0.22,1,0.36,1] }}
            whileHover={{ y: -6, transition: { duration: 0.3 } }}
            className="card p-8"
          >
            <div className="flex gap-0.5 mb-5">
              {Array.from({ length: t.rating }).map((_,j) => (
                <span key={j} className="text-amber-400 text-base">★</span>
              ))}
            </div>

            <p className="text-[15px] text-ink leading-relaxed mb-8">
              &ldquo;{t.quote}&rdquo;
            </p>

            <div className="flex items-center justify-between pt-5 border-t border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-warm flex items-center justify-center text-xl">{t.emoji}</div>
                <div>
                  <p className="font-bold text-ink text-sm">{t.name}</p>
                  <p className="text-xs text-muted">{t.role}</p>
                </div>
              </div>
              <span className="text-[11px] font-semibold px-3 py-1.5 rounded-full bg-accent-light text-accent border border-accent/15">
                {t.route}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
      </div>
    </section>
  );
}
