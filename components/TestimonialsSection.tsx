"use client";

import { motion } from "framer-motion";

const T = [
  {
    quote: "I'd been hunting for Pokémon Center plushies for months. Found a traveler heading back from Tokyo — got them at retail price in a week. This platform is genuinely magic.",
    name: "Emily R.",
    role: "Buyer · New York",
    route: "Tokyo → NYC",
  },
  {
    quote: "I travel for work constantly. I've made over $600 just by carrying skincare and snacks on routes I was already flying. It's the most effortless side income I've ever had.",
    name: "David K.",
    role: "Top Carrier · Seoul",
    route: "Seoul → London",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-28 px-6 overflow-hidden" style={{ background: "#0C0B09" }}>
      <div className="max-w-6xl mx-auto">

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-20">
          <div>
            <motion.p
              className="text-[10px] font-bold tracking-[0.32em] uppercase mb-6"
              style={{ color: "rgba(255,255,255,0.22)" }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Real stories
            </motion.p>
            <div className="overflow-hidden">
              <motion.h2
                className="font-black text-white leading-[0.92] tracking-tight"
                style={{ fontSize: "clamp(48px, 5.5vw, 76px)" }}
                initial={{ y: "100%" }}
                whileInView={{ y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              >
                People love handi.
              </motion.h2>
            </div>
          </div>
          <motion.div
            className="flex items-center gap-2 lg:mb-2"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-amber-400 text-[22px]">★</span>
            ))}
            <span className="ml-3 text-[13px] font-semibold" style={{ color: "rgba(255,255,255,0.35)" }}>4.9 average</span>
          </motion.div>
        </div>

        <div
          className="grid grid-cols-1 lg:grid-cols-2"
          style={{ gap: "1px", background: "rgba(255,255,255,0.08)" }}
        >
          {T.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col justify-between p-10 lg:p-14"
              style={{ background: "#0C0B09" }}
            >
              <div>
                <span
                  className="block font-black select-none leading-none mb-6"
                  style={{ fontSize: "88px", color: "#FF4500", lineHeight: 0.85 }}
                >
                  &ldquo;
                </span>
                <p
                  className="text-white leading-relaxed font-medium mb-10"
                  style={{ fontSize: "clamp(16px, 1.6vw, 20px)" }}
                >
                  {t.quote}
                </p>
              </div>
              <div
                className="flex items-center justify-between pt-8"
                style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
              >
                <div>
                  <p className="font-bold text-white text-[15px]">{t.name}</p>
                  <p className="text-[12px] mt-0.5" style={{ color: "rgba(255,255,255,0.32)" }}>{t.role}</p>
                </div>
                <span
                  className="text-[11px] font-bold px-3.5 py-1.5 rounded-full"
                  style={{ background: "rgba(255,69,0,0.10)", color: "#FF4500", border: "1px solid rgba(255,69,0,0.22)" }}
                >
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
