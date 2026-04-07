"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

const BUYER = [
  { n:"01",icon:"🔍",title:"Search or request",  body:"Browse active traveler offers by city or item. No match? Post your wishlist with budget — travelers will come to you." },
  { n:"02",icon:"🤝",title:"Choose your carrier", body:"Full profile transparency: ratings, reviews, completion rate, response time. Chat before you commit." },
  { n:"03",icon:"💳",title:"Pay & track",          body:"Secure checkout. Funds held until you confirm receipt. Real-time status on every order." },
  { n:"04",icon:"⭐",title:"Review & repeat",      body:"Leave a review to strengthen the community. Great reviews help carriers get more work." },
];
const TRAVELER = [
  { n:"01",icon:"✈️",title:"Post your trip",       body:"Add route and travel dates. We suggest a fair price based on distance and demand. Takes 2 minutes." },
  { n:"02",icon:"🛍️",title:"List what you carry",  body:"Choose item categories you're comfortable with. Accept or decline individual buyer requests." },
  { n:"03",icon:"📋",title:"Check open requests",  body:"Browse buyer requests matching your route. Accept ones that work for you — no pressure." },
  { n:"04",icon:"💰",title:"Deliver & get paid",   body:"Handoff on your terms. Buyer confirms. Payment hits your account the same day." },
];
const FAQS = [
  { q:"Is handi safe?", a:"All users go through identity verification. Payments are held in escrow until delivery is confirmed. Disputes are resolved within 24 hours." },
  { q:"What if my item is damaged or lost?", a:"handi's buyer protection covers all orders. Open a dispute within 48 hours and our team will handle it." },
  { q:"How does the traveler get paid?", a:"Payment is released after the buyer confirms receipt, or automatically after 5 days from the delivery date." },
  { q:"Can I cancel a trip?", a:"Yes — as a traveler you can cancel before accepting orders. If buyers have ordered, they receive an instant full refund." },
  { q:"What if a traveler cancels last minute?", a:"You receive a full refund immediately. We also surface other travelers on similar routes so you can rebook fast." },
];

export default function HowItWorksPage() {
  const [role, setRole] = useState<"buyer"|"traveler">("buyer");
  const [open, setOpen] = useState<number|null>(null);
  const steps = role==="buyer" ? BUYER : TRAVELER;

  return (
    <>
      <Navbar/>
      <main className="min-h-screen bg-stone">

        {/* Hero */}
        <div className="bg-ink border-b border-white/8 pt-24 pb-20 text-center px-6" >
          <p className="eyebrow mb-5 text-accent">How it works</p>
          <h1 className="text-d1 font-black text-white text-balance max-w-3xl mx-auto mb-5">
            People helping people,<br/>
            <span className="text-accent">everywhere.</span>
          </h1>
          <p className="text-body-lg text-white/40 max-w-lg mx-auto mb-10">
            handi turns everyday travel into a global carry network. Here&apos;s exactly how.
          </p>
          <div className="inline-flex bg-white/6 border border-white/10 rounded-full p-1">
            {(["buyer","traveler"] as const).map(t => (
              <button key={t} onClick={()=>setRole(t)}
                className={`relative px-8 py-3 rounded-full text-[15px] font-semibold transition-all ${role===t?"text-white":"text-white/50 hover:text-white/80"}`}>
                {role===t && <motion.div layoutId="hiw-pill-v2" className="absolute inset-0 bg-accent rounded-full" transition={{type:"spring",stiffness:400,damping:30}}/>}
                <span className="relative z-10">{t==="buyer"?"I'm a Buyer":"I'm a Traveler"}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Steps */}
        <div className="wrap py-20">
          <AnimatePresence mode="wait">
            <motion.div key={role} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-20}} transition={{duration:0.3}}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((s,i) => (
                <motion.div key={s.title} initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{delay:i*0.08,duration:0.5}}
                  className="card p-7">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-accent-light flex items-center justify-center text-2xl">{s.icon}</div>
                    <span className="text-xs font-black tracking-[0.2em] text-accent uppercase">{s.n}</span>
                  </div>
                  <h3 className="text-h2 text-ink mb-2">{s.title}</h3>
                  <p className="text-sm text-muted leading-relaxed">{s.body}</p>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Handoff */}
        <div className="bg-white border-y border-border py-16">
          <div className="wrap text-center">
            <h2 className="text-d3 font-black text-ink mb-3">Flexible handoff.</h2>
            <p className="text-body text-muted mb-10 max-w-md mx-auto">Choose how the item reaches you.</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-3xl mx-auto text-left">
              {[
                {icon:"🤝",title:"Direct meetup",     desc:"Agree on a location. Meet the traveler in person."},
                {icon:"🚪",title:"Traveler delivers",  desc:"Traveler drops the item at your front door."},
                {icon:"🚗",title:"Courier relay",      desc:"Use Uber or Grab to pick up from the traveler."},
              ].map(m => (
                <div key={m.title} className="card p-7">
                  <div className="text-4xl mb-4">{m.icon}</div>
                  <h4 className="font-bold text-ink text-[16px] mb-2">{m.title}</h4>
                  <p className="text-sm text-muted">{m.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="wrap max-w-[680px] py-20">
          <h2 className="text-d3 font-black text-ink mb-10 text-center">FAQ</h2>
          <div className="space-y-2">
            {FAQS.map((faq,i) => (
              <div key={i} className="card overflow-hidden">
                <button onClick={()=>setOpen(open===i?null:i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left">
                  <span className="text-[15px] font-semibold text-ink">{faq.q}</span>
                  <motion.span animate={{rotate:open===i?45:0}} transition={{duration:0.2}}
                    className="text-accent text-2xl font-light flex-shrink-0 ml-4">+</motion.span>
                </button>
                <AnimatePresence>
                  {open===i && (
                    <motion.div initial={{height:0}} animate={{height:"auto"}} exit={{height:0}} transition={{duration:0.22}} className="overflow-hidden">
                      <p className="px-6 pb-5 text-body text-muted leading-relaxed">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="bg-accent py-16 text-center px-6">
          <h2 className="text-d3 font-black text-white mb-4">Ready to start?</h2>
          <p className="text-white/70 text-body mb-8 max-w-sm mx-auto">Join thousands already using handi.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/browse" className="btn bg-white text-accent font-bold px-10 py-4 text-[15px] hover:bg-stone transition-colors">Find a traveler</Link>
            <Link href="/post-trip" className="btn-ghost-white text-[15px] px-10 py-4">Post a trip</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
