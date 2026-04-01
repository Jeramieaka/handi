"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useParams } from "next/navigation";

const OFFERS = [
  { id:1,  emoji:"🧔", name:"James L.",  from:"Tokyo",    to:"Your city", date:"Apr 15", items:["Pokémon items","Gacha","Snacks"],      rating:5.0, reviews:124, price:10, badge:"Top Carrier",  bio:"I travel to Tokyo monthly for work. Happy to pick up items from Pokémon Center, convenience stores, and Akihabara.", response:"< 1 hour", completion:"98%", trips:22 },
  { id:2,  emoji:"👩", name:"Sarah K.",  from:"New York", to:"Your city", date:"Apr 12", items:["Sneakers","Streetwear","Supplements"], rating:4.9, reviews:87,  price:15, badge:"Top Carrier",  bio:"NYC local. I know all the best spots — Kith, Supreme drops, Levain, Eataly. Ask me anything.", response:"< 2 hours", completion:"97%", trips:18 },
  { id:3,  emoji:"🧑", name:"Minho C.",  from:"Seoul",    to:"Your city", date:"Apr 18", items:["K-beauty","Album merch","Fashion"],    rating:4.8, reviews:56,  price:12, badge:null,           bio:"Seoul native. I can hit Olive Young, Gentle Monster, and any K-pop merch store before my flight.", response:"< 3 hours", completion:"95%", trips:11 },
  { id:4,  emoji:"👱", name:"Elise M.",  from:"Paris",    to:"Your city", date:"Apr 20", items:["Macarons","Perfume","Fashion"],        rating:4.9, reviews:43,  price:20, badge:null,           bio:"Based in Paris, traveling back every few months. Ladurée, Bon Marché, Sephora exclusives — no problem.", response:"< 2 hours", completion:"96%", trips:9  },
  { id:5,  emoji:"🧓", name:"Oliver T.", from:"London",   to:"Your city", date:"Apr 22", items:["Harrods","UK snacks","Vintage"],      rating:4.7, reviews:31,  price:18, badge:null,           bio:"Frequent London–Asia traveller. Harrods hampers, Fortnum & Mason, vintage finds from Portobello.", response:"< 4 hours", completion:"93%", trips:7  },
  { id:6,  emoji:"👩", name:"Yuki H.",   from:"Tokyo",    to:"Your city", date:"Apr 25", items:["Nintendo merch","Sweets","Stationery"],rating:4.9, reviews:68,  price:8,  badge:"Top Carrier",  bio:"Game designer traveling for conferences. Nintendo Tokyo, Hobonichi planners, and all the seasonal KitKats.", response:"< 1 hour", completion:"99%", trips:15 },
  { id:7,  emoji:"🧑", name:"Chen W.",   from:"Seoul",    to:"Your city", date:"Apr 28", items:["COSRX","Gentle Monster","Tteok"],     rating:4.8, reviews:39,  price:14, badge:null,           bio:"K-beauty enthusiast. I stock up at Olive Young every visit — COSRX, Beauty of Joseon, Anua and more.", response:"< 2 hours", completion:"94%", trips:8  },
  { id:8,  emoji:"👩", name:"Léa M.",    from:"Paris",    to:"Your city", date:"May 2",  items:["Ladurée","Hermès","Truffles"],        rating:5.0, reviews:22,  price:25, badge:"New",           bio:"Fashion buyer visiting Paris for work. Can source from any major maison or specialty food shop.", response:"Same day",  completion:"100%",trips:4  },
  { id:9,  emoji:"🧔", name:"Tom B.",    from:"New York", to:"Your city", date:"May 5",  items:["Kith","NYC bagels","Books"],          rating:4.7, reviews:44,  price:12, badge:null,           bio:"NYC creative. I hit Kith on drop days. Also great for Levain, Ess-a-Bagel, and Strand bookstore finds.", response:"< 3 hours", completion:"94%", trips:10 },
];

const REVIEWS = [
  { name:"Emily R.", emoji:"👩", rating:5, text:"Super reliable — brought everything exactly as described. Fast responses too!", date:"Mar 22" },
  { name:"David K.", emoji:"🧔", rating:5, text:"Items were perfectly packaged. Delivered same day he arrived. Would 100% use again.", date:"Feb 14" },
  { name:"Sophie T.",emoji:"👱", rating:4, text:"Great experience overall, minor delay but communicated well throughout.", date:"Jan 30" },
];

export default function OfferPage() {
  const { id } = useParams();
  const offer = OFFERS.find(o => o.id === Number(id));
  const [requested, setRequested] = useState(false);
  const [item, setItem] = useState("");

  if (!offer) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-stone flex items-center justify-center">
          <div className="text-center">
            <p className="text-6xl mb-4">🔍</p>
            <h1 className="text-h1 font-bold text-ink mb-2">Offer not found</h1>
            <Link href="/browse" className="btn-primary mt-6 inline-flex">Back to Browse</Link>
          </div>
        </main>
      </>
    );
  }

  if (requested) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-stone flex items-center justify-center px-6">
          <div className="text-center max-w-md">
            <div className="text-7xl mb-6">🎉</div>
            <h2 className="text-d2 font-black text-ink mb-3">Request sent!</h2>
            <p className="text-body text-muted mb-8">{offer.name} has been notified. They typically respond {offer.response}.</p>
            <Link href="/membership" className="btn-primary px-10 py-4">View in dashboard →</Link>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-stone">
        {/* Hero bar */}
        <div className="bg-ink border-b border-white/8 pt-20 pb-12">
          <div className="wrap">
            <Link href="/browse" className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm mb-6 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16"><path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Back to Browse
            </Link>
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-warm flex items-center justify-center text-4xl flex-shrink-0">{offer.emoji}</div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-h1 font-bold text-white">{offer.name}</h1>
                  {offer.badge && <span className={offer.badge === "New" ? "badge-green" : "badge-orange"}>{offer.badge}</span>}
                </div>
                <div className="flex items-center gap-2 text-sm text-white/50">
                  <span className="text-amber-400">★</span>
                  <span>{offer.rating} · {offer.reviews} reviews</span>
                  <span>·</span>
                  <span>{offer.trips} trips completed</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="wrap py-10">
          <div className="flex flex-col lg:flex-row gap-10">

            {/* Left — details */}
            <div className="flex-1 min-w-0 space-y-6">

              {/* Trip info */}
              <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:0.4}} className="card p-7">
                <p className="eyebrow mb-5">Trip details</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                  {[
                    ["✈️","Flying from", offer.from],
                    ["📅","Travel date", offer.date],
                    ["⚡","Response time", offer.response],
                    ["✅","Completion rate", offer.completion],
                    ["💰","Starting from", `$${offer.price}`],
                  ].map(([icon,label,val]) => (
                    <div key={label as string}>
                      <p className="text-xs text-muted mb-1">{icon} {label}</p>
                      <p className="font-bold text-ink text-[15px]">{val}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Bio */}
              <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:0.4,delay:0.05}} className="card p-7">
                <p className="eyebrow mb-4">About {offer.name.split(" ")[0]}</p>
                <p className="text-body text-muted leading-relaxed">{offer.bio}</p>
              </motion.div>

              {/* Items */}
              <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:0.4,delay:0.1}} className="card p-7">
                <p className="eyebrow mb-5">What they can carry</p>
                <div className="flex flex-wrap gap-2">
                  {offer.items.map(it => <span key={it} className="tag text-sm px-4 py-2">{it}</span>)}
                </div>
              </motion.div>

              {/* Reviews */}
              <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:0.4,delay:0.15}} className="card p-7">
                <p className="eyebrow mb-6">Recent reviews</p>
                <div className="space-y-5">
                  {REVIEWS.map((r,i) => (
                    <div key={i} className={i < REVIEWS.length-1 ? "pb-5 border-b border-border" : ""}>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="w-9 h-9 rounded-full bg-warm flex items-center justify-center text-lg">{r.emoji}</span>
                        <div>
                          <p className="font-semibold text-ink text-sm">{r.name}</p>
                          <div className="flex items-center gap-1 text-xs text-muted">
                            <span className="text-amber-400">{"★".repeat(r.rating)}</span>
                            <span>· {r.date}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-muted leading-relaxed">{r.text}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right — request sidebar */}
            <motion.aside initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} transition={{duration:0.5,delay:0.1}}
              className="lg:w-[320px] flex-shrink-0">
              <div className="card p-7 sticky top-24">
                <p className="text-h2 font-bold text-ink mb-1">Request an item</p>
                <p className="text-sm text-muted mb-6">Describe what you need from {offer.from}.</p>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-xs font-semibold text-muted mb-2 uppercase tracking-wide">What do you want?</label>
                    <input
                      type="text"
                      placeholder={`e.g. ${offer.items[0]}`}
                      value={item}
                      onChange={e => setItem(e.target.value)}
                      className="w-full border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted mb-2 uppercase tracking-wide">Budget (USD)</label>
                    <input
                      type="number"
                      placeholder="e.g. 50"
                      className="w-full border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted mb-2 uppercase tracking-wide">Notes (optional)</label>
                    <textarea
                      rows={3}
                      placeholder="Size, colour, specific edition…"
                      className="w-full border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all resize-none"
                    />
                  </div>
                </div>

                <button
                  onClick={() => setRequested(true)}
                  disabled={!item.trim()}
                  className="btn-primary w-full py-4 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Send request
                </button>

                <p className="text-xs text-muted text-center mt-4">
                  No payment until {offer.name.split(" ")[0]} accepts. Free to request.
                </p>

                {/* Trust badges */}
                <div className="mt-6 pt-5 border-t border-border space-y-2.5">
                  {["🔒 Secure escrow payment","✅ Buyer protection included","⚡ Responds in {r}".replace("{r}", offer.response)].map(t => (
                    <p key={t} className="text-xs text-muted flex items-center gap-2">{t}</p>
                  ))}
                </div>
              </div>
            </motion.aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
