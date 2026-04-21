"use client";

import { motion } from "framer-motion";

const FEATURES = [
  {
    icon: "🔍",
    title: "Browse traveler offers",
    body: "Search active trips by city or item. See exactly who's going where and what they can bring back for you.",
  },
  {
    icon: "✈️",
    title: "Post your trip & earn",
    body: "Already traveling? List your route and start date. Buyers in your network will request items directly from you.",
  },
  {
    icon: "🛒",
    title: "Order with one click",
    body: "Add items to cart, select your preferred handoff method, and pay securely. Funds are held until delivery.",
  },
  {
    icon: "🤝",
    title: "Flexible handoff options",
    body: "Choose from direct meetup, door delivery, or a courier relay. The last mile, handled your way.",
  },
  {
    icon: "⭐",
    title: "Trust built on reviews",
    body: "Every carrier has a public rating. Check completion rate, response time, and real reviews before you commit.",
  },
  {
    icon: "🛡️",
    title: "Buyer protection always on",
    body: "Payment is released only after you confirm receipt. Disputes are resolved within 24 hours by our team.",
  },
];

export default function SixIconsSection() {
  return (
    <section className="bg-white py-28 px-6">
      <div className="max-w-5xl mx-auto">

        <div className="text-center mb-16">
          <p className="eyebrow text-accent mb-4">Why choose handi</p>
          <h2 className="text-d2 font-black text-ink text-balance">
            Built for trust. Built to scale.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white rounded-2xl p-6 border border-border/60 shadow-card flex flex-col gap-4"
            >
              <div className="w-11 h-11 rounded-xl bg-accent/8 flex items-center justify-center text-2xl">
                {f.icon}
              </div>
              <div>
                <span className="text-[10px] font-black tracking-[0.18em] text-accent/50 uppercase">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-[15px] font-bold text-ink mt-0.5 mb-2">{f.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{f.body}</p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
