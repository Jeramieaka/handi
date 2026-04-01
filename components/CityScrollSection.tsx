"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const CITIES = [
  {
    num: "01", city: "New York", flag: "🗽",
    tagline: "The city that never stops dropping.",
    sub: "NYC exclusives live and die in 24 hours. Sneaker collabs, street food, rare supplements — our travelers are already there.",
    items: ["Limited sneaker collabs", "Kith & Supreme NYC drops", "Levain cookies & NYC deli goods", "Rare supplements & wellness"],
    gradient: "from-zinc-800 to-zinc-600",
    gifPath: "/gifs/newyork.gif",
    isLeft: true,
  },
  {
    num: "02", city: "Tokyo", flag: "🗼",
    tagline: "Where limited means truly one-of-a-kind.",
    sub: "Japan's culture of craft and scarcity creates a permanent global wishlist. Pokémon Center, seasonal wagashi, Harajuku finds.",
    items: ["Pokémon Center exclusives", "Gacha & blind-box collectibles", "Seasonal wagashi & snacks", "Harajuku fashion & vintage"],
    gradient: "from-red-800 to-rose-600",
    gifPath: "/gifs/tokyo.gif",
    isLeft: false,
  },
  {
    num: "03", city: "Seoul", flag: "🇰🇷",
    tagline: "K-culture, delivered fresh.",
    sub: "Olive Young, Gentle Monster, K-pop merch drops. Seoul sets trends the world follows six months later.",
    items: ["Olive Young & COSRX skincare", "K-pop limited album merch", "Gentle Monster & Ader Error", "Dongdaemun cutting-edge fashion"],
    gradient: "from-blue-800 to-sky-600",
    gifPath: "/gifs/seoul.gif",
    isLeft: true,
  },
  {
    num: "04", city: "Paris", flag: "🗺️",
    tagline: "Luxury, pastry, and savoir-faire.",
    sub: "Parisian exclusives carry a prestige that can't be replicated — whether it's a patisserie box or a fashion house drop.",
    items: ["Ladurée & Pierre Hermé macarons", "Maison Margiela & A.P.C. drops", "Niche perfumery & apothecary", "Galeries Lafayette exclusives"],
    gradient: "from-purple-800 to-violet-600",
    gifPath: "/gifs/paris.gif",
    isLeft: false,
  },
  {
    num: "05", city: "London", flag: "🇬🇧",
    tagline: "Iconic British finds, done properly.",
    sub: "Harrods hampers, M&S seasonal ranges, New Balance Made in UK — London's curation is unlike any other city.",
    items: ["Harrods biscuit tins & hampers", "M&S seasonal treats", "New Balance Made in UK", "Portobello Road vintage"],
    gradient: "from-emerald-800 to-teal-600",
    gifPath: "/gifs/london.gif",
    isLeft: true,
  },
];

function CityCard({ c }: { c: typeof CITIES[0] }) {
  const img = (
    <motion.div
      initial={{ x: c.isLeft ? -60 : 60, opacity: 0 }}
      whileInView={{ x: 0, opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.22,1,0.36,1] }}
      className="w-full lg:w-[54%] relative"
    >
      <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-float">
        <Image
          src={c.gifPath} alt={c.city} fill unoptimized
          className="object-cover"
          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
        />
        {/* Placeholder — editorial dark card with city name */}
        <div className={`absolute inset-0 bg-gradient-to-br ${c.gradient} -z-10 flex flex-col items-end justify-end p-8`}>
          {/* Subtle grid */}
          <div className="absolute inset-0 opacity-[0.08]"
            style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "40px 40px" }}
          />
          <span className="relative text-[clamp(3rem,8vw,5rem)] font-black text-white/15 leading-none tracking-tighter select-none">
            {c.city.toUpperCase()}
          </span>
        </div>
      </div>
    </motion.div>
  );

  const text = (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.75, ease: [0.22,1,0.36,1], delay: 0.12 }}
      className="w-full lg:w-[42%] flex flex-col justify-center"
    >
      <div className="flex items-center gap-3 mb-6">
        <span className="text-4xl">{c.flag}</span>
        <span className="eyebrow">{c.num} / {c.city}</span>
      </div>

      <h3 className="text-d3 font-black text-ink mb-4 text-balance">{c.tagline}</h3>
      <p className="text-body text-muted leading-relaxed mb-8">{c.sub}</p>

      <ul className="space-y-3 mb-10">
        {c.items.map((item) => (
          <li key={item} className="flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
            <span className="text-body text-ink/80">{item}</span>
          </li>
        ))}
      </ul>

      <a href="/browse"
        className="inline-flex items-center gap-2 text-sm font-bold text-accent group w-fit"
      >
        Browse offers from {c.city}
        <svg className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-200" fill="none" viewBox="0 0 16 16">
          <path d="M3 8h10M8 3l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </a>
    </motion.div>
  );

  return (
    <div className={`flex flex-col lg:flex-row items-start gap-16 lg:gap-20 py-24 lg:py-32 ${!c.isLeft ? "lg:flex-row-reverse" : ""}`}>
      {img}
      {text}
    </div>
  );
}

export default function CityScrollSection() {
  return (
    <section className="relative z-10 bg-white border-t border-border">
      <div className="wrap pt-24 pb-6 text-center">
        <motion.p initial={{ opacity:0,y:12 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }}
          transition={{ duration:0.5 }} className="eyebrow mb-5">
          What you can get
        </motion.p>
        <motion.h2 initial={{ opacity:0,y:24 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }}
          transition={{ duration:0.65, delay:0.1 }}
          className="text-d2 font-black text-ink text-balance max-w-3xl mx-auto">
          Every city has something<br />
          <span className="text-accent">the world wants.</span>
        </motion.h2>
        <motion.p initial={{ opacity:0,y:16 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }}
          transition={{ duration:0.55, delay:0.2 }}
          className="mt-5 text-body-lg text-muted max-w-xl mx-auto">
          Not grey-market resells. Not overpriced shipping. The real thing,
          carried by someone who was already going there.
        </motion.p>
      </div>

      <div className="wrap">
        {CITIES.map((c, i) => (
          <div key={c.city} className={i < CITIES.length - 1 ? "border-b border-border" : ""}>
            <CityCard c={c} />
          </div>
        ))}
      </div>
    </section>
  );
}
