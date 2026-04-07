"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const TABS = ["Orders","Trips","Requests","Reviews"] as const;
type Tab = typeof TABS[number];

const ORDERS   = [
  {id:"ORD-001",item:"Pokémon Center plushies",    from:"Tokyo",    status:"Delivered",  date:"Mar 15",price:42},
  {id:"ORD-002",item:"Levain Bakery cookies ×2",   from:"New York", status:"In Transit", date:"Mar 28",price:28},
  {id:"ORD-003",item:"K-beauty set (COSRX)",       from:"Seoul",    status:"Ordered",    date:"Apr 2", price:55},
];
const TRIPS    = [
  {id:"TRP-001",route:"Seoul → London", date:"Apr 10",items:["K-beauty","Fashion"], status:"Active",    orders:2},
  {id:"TRP-002",route:"Tokyo → NYC",    date:"Mar 20",items:["Snacks","Gacha"],     status:"Completed", orders:5},
];
const REQUESTS = [
  {id:"REQ-001",item:"Ladurée macarons",    from:"Paris",   budget:30,responses:3,status:"Open"},
  {id:"REQ-002",item:"Limited Kith hoodie", from:"New York",budget:80,responses:1,status:"Accepted"},
];
const REVIEWS  = [
  {name:"James L.",emoji:"🧔",rating:5,text:"Super reliable, brought everything exactly as described. Fast responses too!",date:"Mar 22"},
  {name:"Elise M.",emoji:"👱",rating:5,text:"Packaged perfectly, delivered same day she arrived. Would use again.",date:"Feb 14"},
  {name:"Minho C.",emoji:"🧑",rating:4,text:"Great experience overall, minor delay but communicated well throughout.",date:"Jan 30"},
];

const STATUS_CLS: Record<string,string> = {
  Delivered:"badge-green", "In Transit":"badge-blue", Ordered:"badge-orange",
  Active:"badge-orange", Completed:"badge-green", Open:"badge-blue", Accepted:"badge-green",
};

function Row({icon,primary,secondary,status,extra}:{icon:string;primary:string;secondary:string;status:string;extra?:string}) {
  return (
    <div className="card p-5 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-2xl bg-warm flex items-center justify-center text-2xl flex-shrink-0">{icon}</div>
        <div>
          <p className="text-[15px] font-semibold text-ink">{primary}</p>
          <p className="text-xs text-muted mt-0.5">{secondary}</p>
        </div>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        {extra && <span className="text-[15px] font-black text-ink">{extra}</span>}
        <span className={STATUS_CLS[status]}>{status}</span>
      </div>
    </div>
  );
}

export default function MembershipPage() {
  const [tab, setTab] = useState<Tab>("Orders");

  return (
    <>
      <Navbar/>
      <main className="min-h-screen bg-stone">
        <div className="bg-ink border-b border-white/8 pt-20 pb-12" >
          <div className="wrap">
            <p className="eyebrow mb-4 text-accent">My Account</p>
            <h1 className="text-d2 font-black text-white">Dashboard.</h1>
          </div>
        </div>

        <div className="wrap py-10">
          <div className="flex flex-col lg:flex-row gap-10">

            {/* Sidebar */}
            <motion.aside initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} transition={{duration:0.5}}
              className="lg:w-[260px] flex-shrink-0">
              <div className="card p-7 space-y-7">

                {/* Avatar */}
                <div className="text-center">
                  <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-accent to-orange-600 flex items-center justify-center text-4xl mx-auto mb-4 shadow-card">👤</div>
                  <h2 className="text-h1 font-bold text-ink">Alex Johnson</h2>
                  <p className="text-sm text-muted">Member since Jan 2024</p>
                  <div className="inline-flex items-center gap-1.5 bg-accent-light border border-accent/15 rounded-full px-4 py-1.5 mt-3">
                    <span className="text-amber-400 text-sm">★</span>
                    <span className="font-bold text-accent text-[15px]">4.9</span>
                    <span className="text-muted text-xs">· 26 reviews</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="space-y-3 pt-5 border-t border-border">
                  {[
                    {icon:"📦",label:"Orders placed",  val:"12"},
                    {icon:"✈️",label:"Trips posted",   val:"4"},
                    {icon:"✅",label:"Tasks accepted",  val:"18"},
                    {icon:"📋",label:"Requests made",  val:"7"},
                  ].map(s => (
                    <div key={s.label} className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5 text-muted text-sm">
                        <span className="text-base">{s.icon}</span>{s.label}
                      </div>
                      <span className="font-black text-ink text-[17px]">{s.val}</span>
                    </div>
                  ))}
                </div>

                {/* Badges */}
                <div className="pt-5 border-t border-border">
                  <p className="text-xs font-black tracking-[0.18em] uppercase text-muted mb-3">Badges</p>
                  <div className="flex flex-wrap gap-2">
                    {["⭐ Top Carrier","🎯 Trusted","⚡ Fast Responder"].map(b => (
                      <span key={b} className="badge-orange">{b}</span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.aside>

            {/* Main */}
            <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.5,delay:0.1}} className="flex-1 min-w-0">

              {/* Tabs */}
              <div className="flex gap-1 bg-white border border-border rounded-2xl p-1 w-fit mb-7 shadow-soft">
                {TABS.map(t => (
                  <button key={t} onClick={()=>setTab(t)}
                    className={`relative px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab===t?"text-white":"text-muted hover:text-ink"}`}>
                    {tab===t && <motion.div layoutId="mem-tab-v2" className="absolute inset-0 bg-accent rounded-xl" transition={{type:"spring",stiffness:400,damping:30}}/>}
                    <span className="relative z-10">{t}</span>
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                {tab==="Orders"   && ORDERS.map((o,i)=>(
                  <motion.div key={o.id} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:i*0.06}}>
                    <Row icon="📦" primary={o.item} secondary={`from ${o.from} · ${o.date} · ${o.id}`} status={o.status} extra={`$${o.price}`}/>
                  </motion.div>
                ))}
                {tab==="Trips"    && TRIPS.map((t,i)=>(
                  <motion.div key={t.id} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:i*0.06}}>
                    <Row icon="✈️" primary={t.route} secondary={`${t.date} · ${t.items.join(", ")} · ${t.orders} orders`} status={t.status}/>
                  </motion.div>
                ))}
                {tab==="Requests" && REQUESTS.map((r,i)=>(
                  <motion.div key={r.id} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:i*0.06}}>
                    <Row icon="📋" primary={r.item} secondary={`from ${r.from} · budget $${r.budget} · ${r.responses} response${r.responses!==1?"s":""}`} status={r.status}/>
                  </motion.div>
                ))}
                {tab==="Reviews"  && REVIEWS.map((r,i)=>(
                  <motion.div key={i} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:i*0.06}}>
                    <div className="card p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-warm flex items-center justify-center text-xl">{r.emoji}</div>
                        <div>
                          <p className="font-semibold text-ink">{r.name}</p>
                          <div className="flex items-center gap-1 text-xs text-muted">
                            <span className="text-amber-400">{"★".repeat(r.rating)}</span>
                            <span>· {r.date}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-body text-muted leading-relaxed">{r.text}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
