"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

const STEPS = ["Route", "Listings", "Pricing", "Publish"];
const CITIES = ["New York","Tokyo","Seoul","Paris","London","Singapore","Milan","Bangkok","Sydney","Toronto","Taipei","Dubai"];

const CATEGORY_EMOJIS: Record<string,string> = {
  "Fashion":"👟","Food & Snacks":"🍪","Beauty":"🧴","Collectibles":"🧸",
  "Books & Stationery":"📓","Home & Gifts":"🎁","Electronics":"📱","Other":"📦",
};
const CATEGORIES = Object.keys(CATEGORY_EMOJIS);

interface Product { name:string; store:string; category:string; price:number; qty:number; }
interface F { from:string; to:string; toZip:string; date:string; products:Product[]; fee:number; note:string; }
const emptyProduct = (): Product => ({ name:"", store:"", category:"Fashion", price:0, qty:1 });

export default function PostTripPage() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [f, setF] = useState<F>({ from:"", to:"", toZip:"", date:"", products:[emptyProduct()], fee:15, note:"" });

  const addProduct = () => setF(p => ({ ...p, products:[...p.products, emptyProduct()] }));
  const removeProduct = (i:number) => setF(p => ({ ...p, products:p.products.filter((_,idx)=>idx!==i) }));
  const updateProduct = (i:number, key:keyof Product, val:string|number) =>
    setF(p => ({ ...p, products:p.products.map((prod,idx)=>idx===i?{...prod,[key]:val}:prod) }));

  const canNext = () => {
    if (step===0) return f.from && (f.to || f.toZip) && f.date;
    if (step===1) return f.products.length > 0 && f.products.every(p => p.name.trim() && p.store.trim() && p.price > 0);
    return true;
  };

  if (done) return (
    <>
      <Navbar/>
      <main className="min-h-screen bg-stone flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="text-8xl mb-8">🎉</div>
          <h2 className="text-d2 font-black text-ink mb-4">Trip published!</h2>
          <p className="text-body-lg text-muted mb-3">Your listings are now live on the marketplace.</p>
          <p className="text-body text-muted mb-10">Buyers can browse your items and place orders directly.</p>
          <Link href="/browse" className="btn-primary px-10 py-4 text-[16px]">View marketplace →</Link>
        </div>
      </main>
    </>
  );

  return (
    <>
      <Navbar/>
      <main className="min-h-screen bg-stone">
        <div className="bg-ink border-b border-white/8 pt-20 pb-12">
          <div className="wrap max-w-[760px]">
            <p className="eyebrow mb-4 text-accent">For Travelers</p>
            <h1 className="text-d2 font-black text-white mb-3">Post your trip.</h1>
            <p className="text-body-lg text-white/40">List the items you can carry — buyers shop directly from your listings.</p>
          </div>
        </div>

        <div className="wrap max-w-[760px] py-12">
          {/* Stepper */}
          <div className="flex items-center gap-0 mb-12">
            {STEPS.map((s,i) => (
              <div key={s} className="flex items-center flex-1 last:flex-none">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 transition-all duration-300 ${
                  i < step ? "bg-accent text-white" : i===step ? "bg-accent text-white ring-4 ring-accent/20" : "bg-warm border-2 border-border text-muted"
                }`}>
                  {i < step ? "✓" : i+1}
                </div>
                <span className={`ml-2 text-sm font-medium hidden sm:block mr-4 ${i===step?"text-ink":"text-muted"}`}>{s}</span>
                {i < STEPS.length-1 && <div className={`flex-1 h-0.5 mx-2 transition-all duration-500 ${i<step?"bg-accent":"bg-border"}`}/>}
              </div>
            ))}
          </div>

          <div className="card p-10 shadow-card">
            <AnimatePresence mode="wait">

              {/* Step 0 — Route */}
              {step===0 && (
                <motion.div key="s0" initial={{opacity:0,x:24}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-24}} transition={{duration:0.28}}>
                  <h2 className="text-h1 font-bold text-ink mb-8">Where are you going?</h2>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-muted mb-2">Departing from</label>
                      <select value={f.from} onChange={e=>setF({...f,from:e.target.value})}
                        className="w-full border border-border rounded-2xl px-4 py-3.5 text-[15px] bg-white focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all appearance-none">
                        <option value="">Select a city</option>
                        {CITIES.map(c=><option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-muted mb-2">Delivery destination (ZIP / postal code)</label>
                      <input
                        type="text"
                        value={f.toZip}
                        onChange={e=>setF({...f,toZip:e.target.value,to:e.target.value})}
                        placeholder="e.g. 10001 or SW1A 1AA"
                        className="w-full border border-border rounded-2xl px-4 py-3.5 text-[15px] focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all"
                      />
                      <p className="text-xs text-muted mt-2">Enter a ZIP code, postal code, or city name.</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-muted mb-2">Travel date</label>
                      <input type="date" value={f.date} onChange={e=>setF({...f,date:e.target.value})}
                        className="w-full border border-border rounded-2xl px-4 py-3.5 text-[15px] focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all"/>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 1 — Product listings */}
              {step===1 && (
                <motion.div key="s1" initial={{opacity:0,x:24}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-24}} transition={{duration:0.28}}>
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-h1 font-bold text-ink">List your items.</h2>
                  </div>
                  <p className="text-body text-muted mb-7">
                    Add specific products you can carry from {f.from || "your city"}. Buyers will purchase these directly.
                  </p>

                  <div className="space-y-5">
                    {f.products.map((prod, i) => (
                      <motion.div key={i} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}
                        className="border border-border rounded-2xl p-5 relative bg-white">
                        {f.products.length > 1 && (
                          <button onClick={() => removeProduct(i)}
                            className="absolute top-4 right-4 w-7 h-7 rounded-full bg-warm hover:bg-red-50 hover:text-red-500 text-muted flex items-center justify-center text-lg transition-colors">
                            ×
                          </button>
                        )}
                        <p className="text-xs font-black uppercase tracking-widest text-muted mb-4">Item {i+1}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="sm:col-span-2">
                            <label className="block text-xs font-semibold text-muted mb-1.5">Product name</label>
                            <input type="text" placeholder="e.g. Jellycat Bashful Bunny Large (Cream)"
                              value={prod.name} onChange={e => updateProduct(i,"name",e.target.value)}
                              className="w-full border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all"/>
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-muted mb-1.5">Store / brand</label>
                            <input type="text" placeholder="e.g. Harrods"
                              value={prod.store} onChange={e => updateProduct(i,"store",e.target.value)}
                              className="w-full border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all"/>
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-muted mb-1.5">Category</label>
                            <select value={prod.category} onChange={e => updateProduct(i,"category",e.target.value)}
                              className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all appearance-none">
                              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-muted mb-1.5">Carry fee (USD)</label>
                            <input type="number" min={1} placeholder="e.g. 18"
                              value={prod.price || ""} onChange={e => updateProduct(i,"price",Number(e.target.value))}
                              className="w-full border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all"/>
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-muted mb-1.5">Max quantity</label>
                            <input type="number" min={1} max={20}
                              value={prod.qty} onChange={e => updateProduct(i,"qty",Number(e.target.value))}
                              className="w-full border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all"/>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <button onClick={addProduct}
                    className="mt-5 w-full py-3.5 border-2 border-dashed border-border rounded-2xl text-sm font-semibold text-muted hover:border-accent/40 hover:text-accent hover:bg-accent-light transition-all">
                    + Add another item
                  </button>
                </motion.div>
              )}

              {/* Step 2 — Pricing/notes */}
              {step===2 && (
                <motion.div key="s2" initial={{opacity:0,x:24}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-24}} transition={{duration:0.28}}>
                  <h2 className="text-h1 font-bold text-ink mb-2">Any notes for buyers?</h2>
                  <p className="text-body text-muted mb-8">Optional — describe weight limits, timing, or special handling.</p>
                  <textarea rows={4} placeholder="e.g. I can carry up to 3kg total. Items must be in original packaging. Happy to source from other stores on request."
                    value={f.note} onChange={e=>setF({...f,note:e.target.value})}
                    className="w-full border border-border rounded-2xl px-4 py-3.5 text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all resize-none"/>
                  <div className="mt-6 p-5 bg-accent-light border border-accent/15 rounded-2xl">
                    <p className="text-xs font-black uppercase tracking-widest text-accent mb-2">How it works</p>
                    <p className="text-sm text-muted leading-relaxed">Buyers will add your items to their cart and pay the carry fee. You get paid after they confirm receipt. Disputes are handled within 24h.</p>
                  </div>
                </motion.div>
              )}

              {/* Step 3 — Review */}
              {step===3 && (
                <motion.div key="s3" initial={{opacity:0,x:24}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-24}} transition={{duration:0.28}}>
                  <h2 className="text-h1 font-bold text-ink mb-8">Review & publish.</h2>
                  <div className="divide-y divide-border mb-8">
                    {[["Route",`${f.from} → ${f.to}`],["Date",f.date]].map(([k,v])=>(
                      <div key={k} className="flex justify-between items-center py-4">
                        <span className="text-body text-muted">{k}</span>
                        <span className="font-bold text-ink text-[15px]">{v}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs font-black tracking-widest uppercase text-muted mb-4">Your listings ({f.products.length} items)</p>
                  <div className="space-y-3">
                    {f.products.map((prod,i) => (
                      <div key={i} className="flex items-center gap-4 p-4 bg-warm rounded-2xl">
                        <span className="text-2xl">{CATEGORY_EMOJIS[prod.category] ?? "📦"}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-ink text-sm truncate">{prod.name}</p>
                          <p className="text-xs text-muted">{prod.store} · qty {prod.qty}</p>
                        </div>
                        <span className="font-black text-ink">${prod.price}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

            </AnimatePresence>

            {/* Navigation */}
            <div className="flex justify-between mt-10 pt-8 border-t border-border">
              <button onClick={()=>setStep(s=>Math.max(0,s-1))}
                className={`btn-outline text-sm px-6 py-3 ${step===0?"invisible":""}`}>
                Back
              </button>
              {step < STEPS.length-1 ? (
                <button onClick={()=>setStep(s=>s+1)} disabled={!canNext()}
                  className="btn-primary text-sm px-8 py-3 disabled:opacity-40 disabled:cursor-not-allowed">
                  Continue
                </button>
              ) : (
                <button onClick={()=>setDone(true)} className="btn-primary text-sm px-8 py-3">
                  Publish listings ✈️
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
