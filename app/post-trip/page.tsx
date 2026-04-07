"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

const STEPS = ["Route", "Listings", "Options", "Publish"];

const CATEGORY_EMOJIS: Record<string,string> = {
  "Fashion":"👟","Food & Snacks":"🍪","Beauty":"🧴","Collectibles":"🧸",
  "Books & Stationery":"📓","Home & Gifts":"🎁","Electronics":"📱","Other":"📦",
};
const CATEGORIES = Object.keys(CATEGORY_EMOJIS);

const CATEGORY_PHOTOS: Record<string,string> = {
  "Fashion":          "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&h=600&fit=crop&q=85",
  "Food & Snacks":    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop&q=85",
  "Beauty":           "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=600&fit=crop&q=85",
  "Collectibles":     "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=600&h=600&fit=crop&q=85",
  "Books & Stationery":"https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=600&fit=crop&q=85",
  "Home & Gifts":     "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=600&h=600&fit=crop&q=85",
  "Electronics":      "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=600&h=600&fit=crop&q=85",
  "Other":            "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&h=600&fit=crop&q=85",
};

const DELIVERY_OPTIONS = [
  { id: "meetup",  label: "Direct meetup",  icon: "🤝", desc: "Buyer picks up in person" },
  { id: "door",    label: "Door delivery",   icon: "🚪", desc: "Traveler delivers to address" },
  { id: "courier", label: "Courier relay",   icon: "🚗", desc: "Via local courier service" },
];

interface Product {
  name: string; store: string; category: string; price: number; qty: number;
  tags: string[]; tagInput: string; photo: string;
}
interface F {
  from: string; to: string; toZip: string; date: string;
  products: Product[]; fee: number; note: string; delivery: string[];
}

const emptyProduct = (): Product => ({
  name:"", store:"", category:"Fashion", price:0, qty:1,
  tags:[], tagInput:"", photo:"",
});

export default function PostTripPage() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [f, setF] = useState<F>({
    from:"", to:"", toZip:"", date:"",
    products:[emptyProduct()], fee:15, note:"", delivery:["meetup"],
  });
  const fileRefs = useRef<(HTMLInputElement|null)[]>([]);

  const addProduct    = () => setF(p => ({ ...p, products:[...p.products, emptyProduct()] }));
  const removeProduct = (i:number) => setF(p => ({ ...p, products:p.products.filter((_,idx)=>idx!==i) }));
  const updateProduct = (i:number, key:keyof Product, val:string|number|string[]) =>
    setF(p => ({ ...p, products:p.products.map((prod,idx)=>idx===i?{...prod,[key]:val}:prod) }));

  const addTag = (i:number) => {
    const val = f.products[i].tagInput.trim().replace(/,/g,"");
    if (val && !f.products[i].tags.includes(val)) updateProduct(i,"tags",[...f.products[i].tags, val]);
    updateProduct(i,"tagInput","");
  };
  const removeTag = (i:number, tag:string) =>
    updateProduct(i,"tags", f.products[i].tags.filter(t=>t!==tag));
  const handleTagKey = (e:React.KeyboardEvent, i:number) => {
    if (e.key==="Enter"||e.key===",") { e.preventDefault(); addTag(i); }
    if (e.key==="Backspace"&&f.products[i].tagInput===""&&f.products[i].tags.length>0)
      removeTag(i, f.products[i].tags[f.products[i].tags.length-1]);
  };

  const handlePhoto = (e:React.ChangeEvent<HTMLInputElement>, i:number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => updateProduct(i,"photo", ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const toggleDelivery = (method:string) =>
    setF(p => ({
      ...p,
      delivery: p.delivery.includes(method)
        ? p.delivery.filter(d=>d!==method)
        : [...p.delivery, method],
    }));

  const canNext = () => {
    if (step===0) return f.from.trim() && (f.to||f.toZip) && f.date;
    if (step===1) return f.products.length>0 && f.products.every(p=>p.name.trim()&&p.store.trim()&&p.price>0);
    if (step===2) return f.delivery.length>0;
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
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/browse" className="btn-primary px-10 py-4 text-[16px]">View marketplace →</Link>
            <Link href="/requests" className="btn-outline px-10 py-4 text-[16px]">Browse buyer requests →</Link>
          </div>
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
                  i<step ? "bg-accent text-white" : i===step ? "bg-accent text-white ring-4 ring-accent/20" : "bg-warm border-2 border-border text-muted"
                }`}>
                  {i<step ? "✓" : i+1}
                </div>
                <span className={`ml-2 text-sm font-medium hidden sm:block mr-4 ${i===step?"text-ink":"text-muted"}`}>{s}</span>
                {i<STEPS.length-1 && <div className={`flex-1 h-0.5 mx-2 transition-all duration-500 ${i<step?"bg-accent":"bg-border"}`}/>}
              </div>
            ))}
          </div>

          <div className="card p-10 shadow-card">
            <AnimatePresence mode="wait">

              {/* ── Step 0: Route ── */}
              {step===0 && (
                <motion.div key="s0" initial={{opacity:0,x:24}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-24}} transition={{duration:0.28}}>
                  <h2 className="text-h1 font-bold text-ink mb-8">Where are you going?</h2>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-muted mb-2">Departing from</label>
                      <input
                        type="text"
                        value={f.from}
                        onChange={e=>setF({...f,from:e.target.value})}
                        placeholder="e.g. Tokyo, Seoul, Paris…"
                        className="w-full border border-border rounded-2xl px-4 py-3.5 text-[15px] focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all"
                      />
                      <p className="text-xs text-muted mt-2">Enter your departure city — we'll use this to match buyers near your route.</p>
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

              {/* ── Step 1: Listings ── */}
              {step===1 && (
                <motion.div key="s1" initial={{opacity:0,x:24}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-24}} transition={{duration:0.28}}>
                  <h2 className="text-h1 font-bold text-ink mb-2">List your items.</h2>
                  <p className="text-body text-muted mb-7">
                    Add specific products you can carry from {f.from||"your city"}. Buyers will purchase these directly.
                  </p>

                  <div className="space-y-5">
                    {f.products.map((prod,i) => (
                      <motion.div key={i} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}
                        className="border border-border rounded-2xl p-5 relative bg-white">
                        {f.products.length>1 && (
                          <button onClick={()=>removeProduct(i)}
                            className="absolute top-4 right-4 w-7 h-7 rounded-full bg-warm hover:bg-red-50 hover:text-red-500 text-muted flex items-center justify-center text-lg transition-colors">×</button>
                        )}
                        <p className="text-xs font-black uppercase tracking-widest text-muted mb-4">Item {i+1}</p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="sm:col-span-2">
                            <label className="block text-xs font-semibold text-muted mb-1.5">Product name</label>
                            <input type="text" placeholder="e.g. Jellycat Bashful Bunny Large (Cream)"
                              value={prod.name} onChange={e=>updateProduct(i,"name",e.target.value)}
                              className="w-full border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all"/>
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-muted mb-1.5">Store / brand</label>
                            <input type="text" placeholder="e.g. Harrods"
                              value={prod.store} onChange={e=>updateProduct(i,"store",e.target.value)}
                              className="w-full border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all"/>
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-muted mb-1.5">Category</label>
                            <select value={prod.category} onChange={e=>updateProduct(i,"category",e.target.value)}
                              className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all appearance-none">
                              {CATEGORIES.map(c=><option key={c}>{c}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-muted mb-1.5">Carry fee (USD)</label>
                            <input type="number" min={1} placeholder="e.g. 18"
                              value={prod.price||""} onChange={e=>updateProduct(i,"price",Number(e.target.value))}
                              className="w-full border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all"/>
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-muted mb-1.5">Max quantity</label>
                            <input type="number" min={1} max={20}
                              value={prod.qty} onChange={e=>updateProduct(i,"qty",Number(e.target.value))}
                              className="w-full border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all"/>
                          </div>

                          {/* Tags */}
                          <div className="sm:col-span-2">
                            <label className="block text-xs font-semibold text-muted mb-1.5">
                              Tags <span className="font-normal normal-case">(helps the algorithm surface your listing)</span>
                            </label>
                            <div className="flex flex-wrap gap-1.5 items-center border border-border rounded-xl px-3 py-2 transition-all focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/10 min-h-[44px] bg-white">
                              {prod.tags.map(tag=>(
                                <span key={tag} className="flex items-center gap-1 bg-accent-light text-accent text-xs font-semibold px-2.5 py-1 rounded-full">
                                  {tag}
                                  <button onClick={()=>removeTag(i,tag)} className="text-accent/50 hover:text-accent transition-colors leading-none ml-0.5">×</button>
                                </span>
                              ))}
                              <input
                                type="text"
                                value={prod.tagInput}
                                onChange={e=>updateProduct(i,"tagInput",e.target.value)}
                                onKeyDown={e=>handleTagKey(e,i)}
                                placeholder={prod.tags.length===0?"e.g. limited edition, plush, gift… (Enter to add)":"Add more…"}
                                className="flex-1 min-w-[140px] text-sm bg-transparent outline-none placeholder:text-muted/40 py-0.5"
                              />
                            </div>
                          </div>

                          {/* Photo upload */}
                          <div className="sm:col-span-2">
                            <label className="block text-xs font-semibold text-muted mb-1.5">
                              Product photo <span className="font-normal normal-case">(optional — we'll auto-select one if skipped)</span>
                            </label>
                            <div className="flex items-start gap-3">
                              {/* Thumbnail */}
                              <div className="w-20 h-20 rounded-xl border border-border flex-shrink-0 overflow-hidden bg-warm flex items-center justify-center relative">
                                {prod.photo ? (
                                  <>
                                    <img src={prod.photo} alt="preview" className="w-full h-full object-cover"/>
                                    <button
                                      onClick={()=>updateProduct(i,"photo","")}
                                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-ink/60 text-white flex items-center justify-center text-xs hover:bg-red-500 transition-colors">×</button>
                                  </>
                                ) : (
                                  <div className="text-center pointer-events-none">
                                    <div className="text-2xl mb-0.5">{CATEGORY_EMOJIS[prod.category]??"📦"}</div>
                                    <p className="text-[9px] text-muted/50 leading-none">Auto</p>
                                  </div>
                                )}
                              </div>
                              {/* Upload button */}
                              <div className="flex-1">
                                <input
                                  ref={el=>{ fileRefs.current[i]=el; }}
                                  type="file" accept="image/*" className="hidden"
                                  onChange={e=>handlePhoto(e,i)}
                                />
                                <button
                                  onClick={()=>fileRefs.current[i]?.click()}
                                  className="flex items-center gap-2 px-4 py-2.5 border border-dashed border-border rounded-xl text-sm font-medium text-muted hover:border-accent/40 hover:text-accent hover:bg-accent-light transition-all w-full justify-center"
                                >
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
                                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                  {prod.photo?"Change photo":"Upload photo"}
                                </button>
                                {!prod.photo && (
                                  <p className="text-[11px] text-muted/50 mt-1.5 text-center">If you skip, we'll pick a photo based on the category.</p>
                                )}
                              </div>
                            </div>
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

              {/* ── Step 2: Delivery options + notes ── */}
              {step===2 && (
                <motion.div key="s2" initial={{opacity:0,x:24}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-24}} transition={{duration:0.28}}>
                  <h2 className="text-h1 font-bold text-ink mb-2">Delivery & notes.</h2>
                  <p className="text-body text-muted mb-8">Choose how you're willing to hand off items, then add any notes for buyers.</p>

                  {/* Delivery method multi-select */}
                  <div className="mb-8">
                    <label className="block text-sm font-semibold text-muted mb-3">
                      Accepted delivery methods <span className="text-accent font-bold">*</span>
                      <span className="text-xs font-normal ml-1">(multi-select)</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {DELIVERY_OPTIONS.map(opt=>{
                        const selected=f.delivery.includes(opt.id);
                        return (
                          <button key={opt.id} type="button" onClick={()=>toggleDelivery(opt.id)}
                            className={`flex flex-col items-start gap-1.5 p-4 rounded-2xl border-2 text-left transition-all duration-200 ${
                              selected ? "border-accent bg-accent-light" : "border-border bg-white hover:border-accent/30 hover:bg-warm"
                            }`}
                          >
                            <div className="flex items-center justify-between w-full">
                              <span className="text-xl">{opt.icon}</span>
                              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${selected?"border-accent bg-accent":"border-border"}`}>
                                {selected && (
                                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 12 12">
                                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                )}
                              </div>
                            </div>
                            <p className={`text-sm font-bold ${selected?"text-accent":"text-ink"}`}>{opt.label}</p>
                            <p className="text-xs text-muted">{opt.desc}</p>
                          </button>
                        );
                      })}
                    </div>
                    {f.delivery.length===0 && (
                      <p className="text-xs text-red-500 mt-2">Please select at least one delivery method.</p>
                    )}
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-semibold text-muted mb-2">Notes for buyers <span className="font-normal">(optional)</span></label>
                    <textarea rows={4}
                      placeholder="e.g. I can carry up to 3kg total. Items must be in original packaging. Happy to source from other stores on request."
                      value={f.note} onChange={e=>setF({...f,note:e.target.value})}
                      className="w-full border border-border rounded-2xl px-4 py-3.5 text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all resize-none"/>
                  </div>

                  <div className="mt-6 p-5 bg-accent-light border border-accent/15 rounded-2xl">
                    <p className="text-xs font-black uppercase tracking-widest text-accent mb-2">How it works</p>
                    <p className="text-sm text-muted leading-relaxed">Buyers will add your items to their cart and pay the carry fee. You get paid after they confirm receipt. Disputes are handled within 24h.</p>
                  </div>
                  <Link href="/requests"
                    className="mt-4 flex items-center justify-between p-4 rounded-2xl border border-border bg-white hover:border-accent/40 hover:bg-accent-light transition-all group">
                    <div>
                      <p className="text-sm font-bold text-ink">See open buyer requests</p>
                      <p className="text-xs text-muted">Buyers are waiting for travelers on your route.</p>
                    </div>
                    <svg className="w-5 h-5 text-muted group-hover:text-accent group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 16 16">
                      <path d="M3 8h10M8 3l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Link>
                </motion.div>
              )}

              {/* ── Step 3: Review ── */}
              {step===3 && (
                <motion.div key="s3" initial={{opacity:0,x:24}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-24}} transition={{duration:0.28}}>
                  <h2 className="text-h1 font-bold text-ink mb-8">Review & publish.</h2>

                  {/* Trip info */}
                  <div className="divide-y divide-border mb-8">
                    {[
                      ["Route", `${f.from} → ${f.to}`],
                      ["Date", f.date],
                      ["Delivery", f.delivery.map(d=>DELIVERY_OPTIONS.find(o=>o.id===d)?.label).join(", ")],
                    ].map(([k,v])=>(
                      <div key={k} className="flex justify-between items-center py-4">
                        <span className="text-body text-muted">{k}</span>
                        <span className="font-bold text-ink text-[15px]">{v}</span>
                      </div>
                    ))}
                  </div>

                  <p className="text-xs font-black tracking-widest uppercase text-muted mb-4">Your listings ({f.products.length} items)</p>
                  <div className="space-y-3">
                    {f.products.map((prod,i)=>{
                      const photoSrc=prod.photo||CATEGORY_PHOTOS[prod.category]||CATEGORY_PHOTOS["Other"];
                      return (
                        <div key={i} className="flex items-center gap-4 p-4 bg-warm rounded-2xl">
                          <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-white border border-border">
                            <img src={photoSrc} alt={prod.name} className="w-full h-full object-cover"/>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-ink text-sm truncate">{prod.name}</p>
                            <p className="text-xs text-muted">{prod.store} · qty {prod.qty}</p>
                            {prod.tags.length>0 && (
                              <div className="flex flex-wrap gap-1 mt-1.5">
                                {prod.tags.map(tag=>(
                                  <span key={tag} className="text-[10px] bg-accent-light text-accent px-2 py-0.5 rounded-full font-medium">{tag}</span>
                                ))}
                              </div>
                            )}
                          </div>
                          <span className="font-black text-ink">${prod.price}</span>
                        </div>
                      );
                    })}
                  </div>

                  {f.note && (
                    <div className="mt-6 p-4 bg-warm rounded-2xl border border-border">
                      <p className="text-xs font-bold text-muted uppercase tracking-wider mb-1.5">Notes</p>
                      <p className="text-sm text-ink">{f.note}</p>
                    </div>
                  )}
                </motion.div>
              )}

            </AnimatePresence>

            {/* Navigation */}
            <div className="flex justify-between mt-10 pt-8 border-t border-border">
              <button onClick={()=>setStep(s=>Math.max(0,s-1))}
                className={`btn-outline text-sm px-6 py-3 ${step===0?"invisible":""}`}>
                Back
              </button>
              {step<STEPS.length-1 ? (
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
      <Footer/>
    </>
  );
}
