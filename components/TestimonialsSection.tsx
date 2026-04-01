"use client";

import { motion } from "framer-motion";

const T = [
  {
    quote: "I'd been hunting for Pokémon Center plushies for months. Found a traveler heading back from Tokyo — got them at retail price in a week. This platform is genuinely magic.",
    name: "Emily R.", role: "Buyer · New York", emoji: "👩", rating: 5, route: "Tokyo → NYC",
    accentColor: "bg-rose-50 border-rose-100",
  },
  {
    quote: "I travel for work constantly. I've made over $600 just by carrying skincare and snacks on routes I was already flying. It's the most effortless side income I've ever had.",
    name: "David K.", role: "Top Carrier · Seoul", emoji: "🧔", rating: 5, route: "Seoul → London",
    accentColor: "bg-blue-50 border-blue-100",
  },
  {
    quote: "The handoff was so smooth. The traveler messaged when she landed, we met at a nearby café. My Ladurée macarons arrived perfectly intact. Would absolutely use again.",
    name: "Sophie T.", role: "Buyer · Amsterdam", emoji: "👱", rating: 5, route: "Paris → Amsterdam",
    accentColor: "bg-purple-50 border-purple-100",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="bg-stone border-t border-border py-section">
      <div className="wrap">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div>
            <motion.p initial={{ opacity:0,y:12 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }}
              transition={{ duration:0.5 }} className="eyebrow mb-5">
              Real stories
            </motion.p>
            <motion.h2 initial={{ opacity:0,y:24 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }}
              transition={{ duration:0.65, delay:0.1 }}
              className="text-d2 font-black text-ink">
              People love handi.
            </motion.h2>
          </div>
          <motion.div initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
            transition={{ duration:0.5, delay:0.2 }}
            className="flex items-center gap-4"
          >
            <div className="flex -space-x-3">
              {["🧑","👩","🧔","👱","🧓"].map((e,i) => (
                <span key={i} className="w-10 h-10 rounded-full bg-warm border-2 border-stone flex items-center justify-center text-lg shadow-sm">{e}</span>
              ))}
            </div>
            <div>
              <p className="font-bold text-ink text-[15px]">3,200+ travelers</p>
              <p className="text-muted text-sm">68 cities worldwide</p>
            </div>
          </motion.div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {T.map((t, i) => (
            <motion.div key={t.name}
              initial={{ opacity:0, y:32 }} whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true, margin:"-40px" }}
              transition={{ duration:0.65, delay:i*0.1, ease:[0.22,1,0.36,1] }}
              className="card p-8 hover:shadow-card hover:-translate-y-1 transition-all duration-300"
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-6">
                {Array.from({ length:t.rating }).map((_,j) => (
                  <span key={j} className="text-amber-400 text-lg">★</span>
                ))}
              </div>

              {/* Quote */}
              <p className="text-body text-ink leading-relaxed mb-8">
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center justify-between pt-6 border-t border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-warm flex items-center justify-center text-xl">{t.emoji}</div>
                  <div>
                    <p className="font-bold text-ink text-sm">{t.name}</p>
                    <p className="text-xs text-muted">{t.role}</p>
                  </div>
                </div>
                <div className={`tag border ${t.accentColor}`}>{t.route}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
