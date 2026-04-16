"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

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
  const [active, setActive] = useState(0);

  return (
    <section className="bg-stone py-24 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-16">
          <p className="eyebrow text-accent mb-4">How handi works</p>
          <h2 className="text-d2 font-black text-ink text-balance">
            Six reasons<br />people choose us.
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 items-center">

          {/* Left — GIF + step dots */}
          <div className="lg:w-[480px] flex-shrink-0">
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-border shadow-card bg-ink">
              <Image
                src="/six-icons.gif"
                alt="handi platform features"
                fill
                unoptimized
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
            </div>
            {/* Step dots */}
            <div className="flex gap-1.5 justify-center mt-4">
              {FEATURES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    i === active ? "w-6 bg-accent" : "w-1.5 bg-ink/20"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Right — Feature list */}
          <div className="flex-1 space-y-3">
            {FEATURES.map((f, i) => (
              <motion.div
                key={i}
                onClick={() => setActive(i)}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className={`flex items-start gap-5 p-5 rounded-2xl cursor-pointer transition-all duration-200 ${
                  i === active
                    ? "bg-white shadow-card border border-border/60"
                    : "hover:bg-warm border border-transparent"
                }`}
              >
                {/* Icon */}
                <div className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center text-2xl transition-all duration-200 ${
                  i === active ? "bg-accent/10" : "bg-warm"
                }`}>
                  {f.icon}
                </div>

                {/* Text */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-black tracking-widest text-accent/60 uppercase">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className={`font-bold transition-colors duration-200 ${
                      i === active ? "text-ink text-[16px]" : "text-muted text-[15px]"
                    }`}>
                      {f.title}
                    </h3>
                  </div>
                  <div className={`overflow-hidden transition-all duration-300 ${
                    i === active ? "max-h-20 opacity-100" : "max-h-0 opacity-0"
                  }`}>
                    <p className="text-sm text-muted leading-relaxed">{f.body}</p>
                  </div>
                </div>

                {/* Active dot */}
                {i === active && (
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-2 h-2 rounded-full bg-accent" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
