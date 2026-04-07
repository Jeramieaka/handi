"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useCart } from "@/components/CartContext";

/* ─── Constants ──────────────────────────────────────────────── */

const CATEGORIES = ["All", "Collectibles", "Fashion", "Food & Snacks", "Beauty", "Books & Stationery", "Home & Gifts"];

const DELIVERY_META: Record<string,{ icon:string; label:string; desc:string }> = {
  meetup:  { icon:"🤝", label:"Direct meetup",  desc:"Buyer picks up in person"       },
  door:    { icon:"🚪", label:"Door delivery",   desc:"Traveler delivers to address"   },
  courier: { icon:"🚗", label:"Courier relay",   desc:"Via local courier service"      },
};

type DestRegion = "Worldwide"|"US"|"Europe"|"Asia"|"UK";
const REGION_LABELS: Record<DestRegion,string> = {
  US:"United States", UK:"United Kingdom", Asia:"Asia", Europe:"Europe", Worldwide:"Worldwide",
};

const LISTINGS = [
  { id:"t1-1", travelerEmoji:"🧔", travelerName:"James L.", travelerRating:5.0, travelerReviews:124, badge:"Top Carrier",
    from:"Tokyo", destinationRegion:"Worldwide" as DestRegion, date:"Apr 15",
    productName:"Pokémon Center Pikachu Plush (Large)", store:"Pokémon Center Mega Tokyo",
    category:"Collectibles", price:18, maxQty:3, categoryEmoji:"🧸",
    productImage:"https://images.unsplash.com/photo-1608889175523-6bebab82e69b?w=800&h=800&fit=crop&q=85",
    delivery:["meetup","courier"] },
  { id:"t1-2", travelerEmoji:"🧔", travelerName:"James L.", travelerRating:5.0, travelerReviews:124, badge:"Top Carrier",
    from:"Tokyo", destinationRegion:"Worldwide" as DestRegion, date:"Apr 15",
    productName:"Eevee Exclusive Figure (Limited Ed.)", store:"Pokémon Center Mega Tokyo",
    category:"Collectibles", price:35, maxQty:2, categoryEmoji:"🎁",
    productImage:"https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=800&h=800&fit=crop&q=85",
    delivery:["meetup","courier"] },
  { id:"t1-3", travelerEmoji:"🧔", travelerName:"James L.", travelerRating:5.0, travelerReviews:124, badge:"Top Carrier",
    from:"Tokyo", destinationRegion:"Worldwide" as DestRegion, date:"Apr 15",
    productName:"Seasonal KitKat Box (Matcha & Sakura)", store:"Tokyo Convenience",
    category:"Food & Snacks", price:14, maxQty:5, categoryEmoji:"🍫",
    productImage:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop&q=85",
    delivery:["meetup","courier"] },
  { id:"t6-1", travelerEmoji:"👩", travelerName:"Yuki H.", travelerRating:4.9, travelerReviews:68, badge:"Top Carrier",
    from:"Tokyo", destinationRegion:"Asia" as DestRegion, date:"Apr 25",
    productName:"Nintendo Switch Sports Bundle", store:"Nintendo Tokyo",
    category:"Collectibles", price:12, maxQty:2, categoryEmoji:"🎮",
    productImage:"https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=800&h=800&fit=crop&q=85",
    delivery:["door","courier"] },
  { id:"t6-2", travelerEmoji:"👩", travelerName:"Yuki H.", travelerRating:4.9, travelerReviews:68, badge:"Top Carrier",
    from:"Tokyo", destinationRegion:"Asia" as DestRegion, date:"Apr 25",
    productName:"Hobonichi Techo Planner 2025", store:"Hobonichi Tokyo",
    category:"Books & Stationery", price:10, maxQty:4, categoryEmoji:"📓",
    productImage:"https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&h=800&fit=crop&q=85",
    delivery:["door","courier"] },
  { id:"t2-1", travelerEmoji:"👩", travelerName:"Sarah K.", travelerRating:4.9, travelerReviews:87, badge:"Top Carrier",
    from:"New York", destinationRegion:"US" as DestRegion, date:"Apr 12",
    productName:"Levain Bakery Cookies (6-pack)", store:"Levain Bakery",
    category:"Food & Snacks", price:22, maxQty:4, categoryEmoji:"🍪",
    productImage:"https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800&h=800&fit=crop&q=85",
    delivery:["meetup","door"] },
  { id:"t2-2", travelerEmoji:"👩", travelerName:"Sarah K.", travelerRating:4.9, travelerReviews:87, badge:"Top Carrier",
    from:"New York", destinationRegion:"US" as DestRegion, date:"Apr 12",
    productName:"Kith × New Balance 550 (Size on request)", store:"Kith NYC",
    category:"Fashion", price:28, maxQty:1, categoryEmoji:"👟",
    productImage:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop&q=85",
    delivery:["meetup","door"] },
  { id:"t3-1", travelerEmoji:"🧑", travelerName:"Minho C.", travelerRating:4.8, travelerReviews:56, badge:null,
    from:"Seoul", destinationRegion:"Worldwide" as DestRegion, date:"Apr 18",
    productName:"COSRX Snail Mucin 96% Power Repairing Essence", store:"Olive Young",
    category:"Beauty", price:16, maxQty:5, categoryEmoji:"🧴",
    productImage:"https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&h=800&fit=crop&q=85",
    delivery:["meetup","door","courier"] },
  { id:"t3-2", travelerEmoji:"🧑", travelerName:"Minho C.", travelerRating:4.8, travelerReviews:56, badge:null,
    from:"Seoul", destinationRegion:"Worldwide" as DestRegion, date:"Apr 18",
    productName:"Beauty of Joseon Relief Sun SPF50+", store:"Olive Young",
    category:"Beauty", price:14, maxQty:5, categoryEmoji:"☀️",
    productImage:"https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&h=800&fit=crop&q=85",
    delivery:["meetup","door","courier"] },
  { id:"t3-3", travelerEmoji:"🧑", travelerName:"Minho C.", travelerRating:4.8, travelerReviews:56, badge:null,
    from:"Seoul", destinationRegion:"Worldwide" as DestRegion, date:"Apr 18",
    productName:"Gentle Monster Jennie Collab Sunglasses", store:"Gentle Monster Flagship",
    category:"Fashion", price:25, maxQty:1, categoryEmoji:"🕶️",
    productImage:"https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&h=800&fit=crop&q=85",
    delivery:["meetup","door","courier"] },
  { id:"t4-1", travelerEmoji:"👱", travelerName:"Elise M.", travelerRating:4.9, travelerReviews:43, badge:null,
    from:"Paris", destinationRegion:"Europe" as DestRegion, date:"Apr 20",
    productName:"Ladurée Macaron Box (12 pcs, assorted)", store:"Ladurée Champs-Élysées",
    category:"Food & Snacks", price:38, maxQty:3, categoryEmoji:"🥐",
    productImage:"https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=800&h=800&fit=crop&q=85",
    delivery:["door","courier"] },
  { id:"t4-2", travelerEmoji:"👱", travelerName:"Elise M.", travelerRating:4.9, travelerReviews:43, badge:null,
    from:"Paris", destinationRegion:"Europe" as DestRegion, date:"Apr 20",
    productName:"Diptyque Baies Candle (190g)", store:"Diptyque Flagship",
    category:"Home & Gifts", price:30, maxQty:2, categoryEmoji:"🕯️",
    productImage:"https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&h=800&fit=crop&q=85",
    delivery:["door","courier"] },
  { id:"t5-1", travelerEmoji:"🧓", travelerName:"Oliver T.", travelerRating:4.7, travelerReviews:31, badge:null,
    from:"London", destinationRegion:"Worldwide" as DestRegion, date:"Apr 22",
    productName:"Jellycat Bashful Bunny (Large, Cream)", store:"Harrods",
    category:"Home & Gifts", price:28, maxQty:3, categoryEmoji:"🐰",
    productImage:"https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800&h=800&fit=crop&q=85",
    delivery:["meetup","courier"] },
  { id:"t5-2", travelerEmoji:"🧓", travelerName:"Oliver T.", travelerRating:4.7, travelerReviews:31, badge:null,
    from:"London", destinationRegion:"Worldwide" as DestRegion, date:"Apr 22",
    productName:"Fortnum & Mason Earl Grey Tea (250g tin)", store:"Fortnum & Mason",
    category:"Food & Snacks", price:22, maxQty:4, categoryEmoji:"🍵",
    productImage:"https://images.unsplash.com/photo-1564890369478-c89ca3d9da7b?w=800&h=800&fit=crop&q=85",
    delivery:["meetup","courier"] },
  { id:"t5-3", travelerEmoji:"🧓", travelerName:"Oliver T.", travelerRating:4.7, travelerReviews:31, badge:null,
    from:"London", destinationRegion:"Worldwide" as DestRegion, date:"Apr 22",
    productName:"Harrods Classic Shortbread Gift Tin", store:"Harrods",
    category:"Food & Snacks", price:24, maxQty:3, categoryEmoji:"🍪",
    productImage:"https://images.unsplash.com/photo-1499638673689-79a0b5115d87?w=800&h=800&fit=crop&q=85",
    delivery:["meetup","courier"] },
  { id:"t8-1", travelerEmoji:"👩", travelerName:"Léa M.", travelerRating:5.0, travelerReviews:22, badge:"New",
    from:"Paris", destinationRegion:"Europe" as DestRegion, date:"May 2",
    productName:"Pierre Hermé Ispahan Macaron Box", store:"Pierre Hermé",
    category:"Food & Snacks", price:42, maxQty:2, categoryEmoji:"🥐",
    productImage:"https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&h=800&fit=crop&q=85",
    delivery:["door"] },
  { id:"t8-2", travelerEmoji:"👩", travelerName:"Léa M.", travelerRating:5.0, travelerReviews:22, badge:"New",
    from:"Paris", destinationRegion:"Europe" as DestRegion, date:"May 2",
    productName:"Dior Beauty Lip Glow Oil (limited shade)", store:"Sephora Paris",
    category:"Beauty", price:20, maxQty:2, categoryEmoji:"💄",
    productImage:"https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=800&fit=crop&q=85",
    delivery:["door"] },
];

type Listing = typeof LISTINGS[0];

const CITIES  = ["All","Tokyo","New York","Seoul","Paris","London"];
const STORES  = ["All stores",...Array.from(new Set(LISTINGS.map(l=>l.store))).sort()];

function detectRegion(zip:string): DestRegion|null {
  if (!zip) return null;
  const z=zip.trim();
  if (/^\d{5}(-\d{4})?$/.test(z)) return "US";
  if (/^[A-Za-z]{1,2}\d/i.test(z)) return "UK";
  if (/^\d{3}-?\d{4}$/.test(z))   return "Asia";
  if (/^\d{4,5}$/.test(z))         return "Europe";
  return null;
}

/* ─── Product Detail Modal ──────────────────────────────────── */

function ProductDetailModal({
  product, onClose, onViewRelated,
}: { product: Listing; onClose: ()=>void; onViewRelated: (p:Listing)=>void }) {
  const { addItem, items } = useCart();
  const [qty,   setQty]   = useState(1);
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const inCart    = items.find(it=>it.id===product.id);
  const cartQty   = inCart?.qty??0;
  const remaining = product.maxQty-cartQty;
  const related   = LISTINGS.filter(l=>l.travelerName===product.travelerName&&l.id!==product.id);

  const handleAdd = () => {
    for (let n=0;n<qty;n++) {
      addItem({
        id:product.id, productName:product.productName, store:product.store,
        travelerName:product.travelerName, travelerEmoji:product.travelerEmoji,
        from:product.from, date:product.date, price:product.price,
        maxQty:product.maxQty, categoryEmoji:product.categoryEmoji,
      });
    }
    setAdded(true); setTimeout(()=>setAdded(false),2000); setQty(1);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-6 bg-ink/50 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity:0, y:40 }}
        animate={{ opacity:1, y:0 }}
        exit={{ opacity:0, y:40 }}
        transition={{ duration:0.3, ease:[0.22,1,0.36,1] }}
        className="w-full sm:max-w-xl bg-white rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-float flex flex-col max-h-[92vh]"
        onClick={e=>e.stopPropagation()}
      >
        {/* Product image */}
        <div className="relative flex-shrink-0 h-64 sm:h-72 bg-warm overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[7rem] leading-none opacity-50">{product.categoryEmoji}</span>
          </div>
          {!imgError && (
            <img src={product.productImage} alt={product.productName}
              className="absolute inset-0 w-full h-full object-cover" onError={()=>setImgError(true)}/>
          )}
          {product.badge && (
            <span className={`absolute top-4 left-4 ${product.badge==="New"?"badge-green":"badge-orange"}`}>{product.badge}</span>
          )}
          {/* Close */}
          <button onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-ink text-xl shadow-card hover:bg-white transition-colors">
            ×
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 sm:p-7">

            {/* Store + name */}
            <p className="text-[11px] font-semibold text-muted uppercase tracking-wider mb-1.5">{product.store}</p>
            <h2 className="text-xl font-black text-ink leading-snug mb-5">{product.productName}</h2>

            {/* Traveler info */}
            <div className="flex items-center gap-3 p-4 bg-warm rounded-2xl mb-5">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-xl flex-shrink-0 shadow-soft">
                {product.travelerEmoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-ink">{product.travelerName}</p>
                <p className="text-xs text-muted">{product.from} · ✈️ {product.date}</p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <span className="text-amber-400">★</span>
                <span className="text-sm font-bold text-ink">{product.travelerRating}</span>
                <span className="text-xs text-muted">({product.travelerReviews})</span>
              </div>
            </div>

            {/* Delivery methods */}
            <div className="mb-6">
              <p className="text-xs font-black tracking-[0.16em] uppercase text-muted mb-3">Accepted delivery</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {product.delivery.map(d=>{
                  const m=DELIVERY_META[d];
                  return m ? (
                    <div key={d} className="flex items-center gap-2.5 p-3 bg-warm rounded-xl border border-border">
                      <span className="text-lg flex-shrink-0">{m.icon}</span>
                      <div>
                        <p className="text-xs font-bold text-ink">{m.label}</p>
                        <p className="text-[10px] text-muted">{m.desc}</p>
                      </div>
                    </div>
                  ) : null;
                })}
              </div>
            </div>

            {/* Price + add to cart */}
            <div className="flex items-center gap-4 p-5 bg-warm rounded-2xl mb-6">
              <div className="flex-1">
                <p className="text-xs text-muted mb-0.5">Carry fee</p>
                <p className="text-2xl font-black text-ink">${product.price}</p>
              </div>
              {remaining>0 ? (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-white border border-border rounded-xl overflow-hidden">
                    <button onClick={()=>setQty(q=>Math.max(1,q-1))} className="w-9 h-9 flex items-center justify-center text-muted hover:text-ink font-bold text-lg transition-colors">−</button>
                    <span className="w-7 text-center text-sm font-semibold text-ink">{qty}</span>
                    <button onClick={()=>setQty(q=>Math.min(remaining,q+1))} className="w-9 h-9 flex items-center justify-center text-muted hover:text-ink font-bold text-lg transition-colors">+</button>
                  </div>
                  <button onClick={handleAdd}
                    className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${added?"bg-emerald-500 text-white":"bg-accent text-white hover:bg-accent-hover active:scale-95"}`}>
                    {added?"Added ✓":"Add to cart"}
                  </button>
                </div>
              ) : (
                <span className="text-sm font-semibold text-muted bg-white border border-border px-4 py-2.5 rounded-xl">Sold out</span>
              )}
            </div>
            {remaining>0&&remaining<=2&&(
              <p className="text-xs text-accent font-semibold -mt-4 mb-6">Only {remaining} left</p>
            )}

            {/* More from this traveler */}
            {related.length>0 && (
              <div>
                <p className="text-xs font-black tracking-[0.16em] uppercase text-muted mb-3">More from {product.travelerName}</p>
                <div className="grid grid-cols-2 gap-3">
                  {related.map(rel=>(
                    <button key={rel.id} onClick={()=>onViewRelated(rel)}
                      className="flex items-center gap-3 p-3 bg-warm rounded-2xl border border-border hover:border-accent/30 hover:bg-accent-light transition-all text-left group">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-white flex-shrink-0 relative">
                        <span className="absolute inset-0 flex items-center justify-center text-2xl opacity-50">{rel.categoryEmoji}</span>
                        <img src={rel.productImage} alt={rel.productName} className="absolute inset-0 w-full h-full object-cover"/>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-ink leading-snug line-clamp-2 group-hover:text-accent transition-colors">{rel.productName}</p>
                        <p className="text-xs font-bold text-accent mt-0.5">${rel.price}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Product Card (simplified) ─────────────────────────────── */

function ProductCard({ p, i, onView }: { p:Listing; i:number; onView:(p:Listing)=>void }) {
  const [imgError, setImgError] = useState(false);

  return (
    <motion.div
      initial={{ opacity:0, y:20 }}
      animate={{ opacity:1, y:0 }}
      transition={{ duration:0.4, delay:i*0.04 }}
      whileHover={{ y:-5, boxShadow:"0 24px 48px rgba(12,12,11,0.12), 0 8px 20px rgba(12,12,11,0.06)", transition:{ type:"spring", stiffness:360, damping:28 } }}
      style={{ boxShadow:"0 1px 4px rgba(12,12,11,0.06), 0 0 0 1px rgba(12,12,11,0.04)" }}
      onClick={()=>onView(p)}
      className="bg-white rounded-2xl overflow-hidden cursor-pointer flex flex-col"
    >
      {/* Image */}
      <div className="relative h-48 flex-shrink-0 overflow-hidden bg-warm">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[5rem] leading-none select-none opacity-55">{p.categoryEmoji}</span>
        </div>
        {!imgError && (
          <img src={p.productImage} alt={p.productName}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={()=>setImgError(true)}/>
        )}
        {p.badge && (
          <span className={`absolute top-3 left-3 z-10 ${p.badge==="New"?"badge-green":"badge-orange"}`}>{p.badge}</span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-[10px] font-semibold text-muted uppercase tracking-wider mb-1">{p.store}</p>
        <p className="text-[14px] font-bold text-ink leading-snug mb-auto line-clamp-2">{p.productName}</p>

        {/* Traveler row */}
        <div className="flex items-center gap-2 mt-3 mb-3">
          <span className="text-sm">{p.travelerEmoji}</span>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-semibold text-ink truncate">{p.travelerName} · {p.from}</p>
            <p className="text-[11px] text-muted">✈️ {p.date}</p>
          </div>
          <div className="flex items-center gap-0.5 flex-shrink-0">
            <span className="text-amber-400 text-xs">★</span>
            <span className="text-xs font-semibold text-ink">{p.travelerRating}</span>
          </div>
        </div>

        {/* Price + View */}
        <div className="flex items-center justify-between pt-3 border-t border-border/60">
          <p className="text-[18px] font-black text-ink">${p.price}</p>
          <span className="text-xs font-semibold text-accent flex items-center gap-1">
            View details
            <svg className="w-3 h-3" fill="none" viewBox="0 0 12 12">
              <path d="M2.5 6h7M6.5 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Post Request Modal ─────────────────────────────────────── */

function PostRequestModal({ onClose }: { onClose:()=>void }) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ from:"", to:"", item:"", budget:"", note:"" });
  const canSubmit = form.from&&form.to&&form.item&&form.budget;

  if (submitted) return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-ink/60 backdrop-blur-sm">
      <motion.div initial={{scale:0.95,opacity:0}} animate={{scale:1,opacity:1}} className="card p-10 max-w-md w-full text-center">
        <div className="text-6xl mb-5">🎉</div>
        <h2 className="text-h1 font-bold text-ink mb-3">Request posted!</h2>
        <p className="text-body text-muted mb-8">Travelers on matching routes will see your request and reach out.</p>
        <button onClick={onClose} className="btn-primary px-10 py-3">Done</button>
      </motion.div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-ink/60 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{scale:0.95,opacity:0,y:20}} animate={{scale:1,opacity:1,y:0}}
        transition={{duration:0.3,ease:[0.22,1,0.36,1]}}
        className="card p-8 max-w-lg w-full" onClick={e=>e.stopPropagation()}>
        <div className="flex items-center justify-between mb-7">
          <div>
            <h2 className="text-h1 font-bold text-ink">Post a custom request</h2>
            <p className="text-sm text-muted mt-1">Can't find what you need? Let travelers come to you.</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-warm flex items-center justify-center text-muted hover:text-ink transition-colors text-xl flex-shrink-0 ml-4">×</button>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-muted mb-2 uppercase tracking-wide">Item from</label>
              <select value={form.from} onChange={e=>setForm({...form,from:e.target.value})}
                className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all appearance-none">
                <option value="">City</option>
                {["Tokyo","New York","Seoul","Paris","London","Singapore","Milan","Sydney"].map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted mb-2 uppercase tracking-wide">Deliver to</label>
              <select value={form.to} onChange={e=>setForm({...form,to:e.target.value})}
                className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all appearance-none">
                <option value="">City</option>
                {["Taipei","Toronto","Singapore","Bangkok","Sydney","Amsterdam","Berlin","Dubai"].map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted mb-2 uppercase tracking-wide">What do you want?</label>
            <input type="text" placeholder="e.g. Jellycat Bashful Bunny Medium, cream colour"
              value={form.item} onChange={e=>setForm({...form,item:e.target.value})}
              className="w-full border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all"/>
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted mb-2 uppercase tracking-wide">Your budget (USD, incl. carry fee)</label>
            <input type="number" placeholder="e.g. 60" value={form.budget} onChange={e=>setForm({...form,budget:e.target.value})}
              className="w-full border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all"/>
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted mb-2 uppercase tracking-wide">Notes <span className="normal-case font-normal">(optional)</span></label>
            <textarea rows={2} placeholder="Size, colour, packaging, store preference…"
              value={form.note} onChange={e=>setForm({...form,note:e.target.value})}
              className="w-full border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all resize-none"/>
          </div>
        </div>
        <div className="flex gap-3 mt-7">
          <button onClick={onClose} className="btn-outline flex-1 py-3 text-sm">Cancel</button>
          <button onClick={()=>setSubmitted(true)} disabled={!canSubmit}
            className="btn-primary flex-1 py-3 text-sm disabled:opacity-40 disabled:cursor-not-allowed">Post request</button>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Main page ──────────────────────────────────────────────── */

export default function BrowsePage() {
  const { totalItems } = useCart();
  const [category,   setCategory]   = useState("All");
  const [city,       setCity]       = useState("All");
  const [store,      setStore]      = useState("All stores");
  const [query,      setQuery]      = useState("");
  const [nearMe,     setNearMe]     = useState(false);
  const [userZip,    setUserZip]    = useState("");
  const [showModal,  setShowModal]  = useState(false);
  const [selected,   setSelected]   = useState<Listing|null>(null);

  useEffect(() => {
    const z = sessionStorage.getItem("handi_zip")||"";
    setUserZip(z);
    const handler = () => setUserZip(sessionStorage.getItem("handi_zip")||"");
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const userRegion = detectRegion(userZip);

  const filtered = LISTINGS.filter(p => {
    const catOk   = category==="All"||p.category===category;
    const cityOk  = city==="All"||p.from===city;
    const storeOk = store==="All stores"||p.store===store;
    const qOk     = !query||[p.productName,p.store,p.travelerName,p.from].some(s=>s.toLowerCase().includes(query.toLowerCase()));
    const nearOk  = !nearMe||!userRegion||p.destinationRegion==="Worldwide"||p.destinationRegion===userRegion;
    return catOk&&cityOk&&storeOk&&qOk&&nearOk;
  });

  const hasActiveFilters = nearMe||city!=="All"||store!=="All stores";

  return (
    <>
      <Navbar/>
      {showModal && <PostRequestModal onClose={()=>setShowModal(false)}/>}
      <AnimatePresence>
        {selected && (
          <ProductDetailModal
            product={selected}
            onClose={()=>setSelected(null)}
            onViewRelated={p=>setSelected(p)}
          />
        )}
      </AnimatePresence>

      <main className="min-h-screen bg-stone">
        {/* Hero */}
        <div className="bg-ink border-b border-white/8 pt-20 pb-12">
          <div className="wrap">
            <p className="eyebrow mb-4 text-accent">Global Marketplace</p>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <h1 className="text-d2 font-black text-white mb-2">Shop by traveler.</h1>
                <p className="text-body-lg text-white/40">Real items from real stores, carried by real people.</p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <button onClick={()=>setShowModal(true)} className="btn-ghost-white text-sm px-5 py-3">+ Custom request</button>
                <Link href="/cart" className="relative flex items-center gap-2 bg-white/10 border border-white/15 hover:bg-white/15 text-white text-sm font-semibold rounded-full px-5 py-3 transition-all">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                    <path d="M16 10a4 4 0 01-8 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Cart
                  {totalItems>0 && (
                    <span className="bg-accent text-white text-[11px] font-black rounded-full w-5 h-5 flex items-center justify-center">{totalItems}</span>
                  )}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Category pills */}
        <div className="border-b border-border bg-white sticky top-[64px] z-30">
          <div className="wrap overflow-x-auto">
            <div className="flex gap-1 py-3 min-w-max">
              {CATEGORIES.map(c=>(
                <button key={c} onClick={()=>setCategory(c)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${category===c?"bg-accent text-white":"text-muted hover:text-ink hover:bg-warm"}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="wrap py-10">
          <div className="flex flex-col lg:flex-row gap-10">

            {/* Sidebar */}
            <aside className="lg:w-[220px] flex-shrink-0 space-y-7">
              {/* Search */}
              <div className="relative">
                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" fill="none" viewBox="0 0 16 16">
                  <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M10.5 10.5l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search…"
                  className="w-full pl-9 pr-4 py-3 text-sm bg-white border border-border rounded-xl focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all"/>
              </div>

              {/* Near me */}
              {userZip && (
                <div>
                  <p className="text-xs font-black tracking-[0.18em] uppercase text-muted mb-3">Near me</p>
                  <button onClick={()=>setNearMe(n=>!n)}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl border-2 text-left transition-all duration-200 ${nearMe?"border-accent bg-accent-light":"border-border bg-white hover:border-accent/30 hover:bg-warm"}`}>
                    <svg className={`w-4 h-4 flex-shrink-0 ${nearMe?"text-accent":"text-muted"}`} fill="none" viewBox="0 0 16 16">
                      <path d="M8 1.5C5.5 1.5 3.5 3.5 3.5 6c0 3.5 4.5 8.5 4.5 8.5S12.5 9.5 12.5 6c0-2.5-2-4.5-4.5-4.5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="8" cy="6" r="1.5" fill="currentColor"/>
                    </svg>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold ${nearMe?"text-accent":"text-ink"}`}>Near {userZip}</p>
                      {userRegion && <p className="text-xs text-muted">{REGION_LABELS[userRegion]} deliveries</p>}
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${nearMe?"border-accent bg-accent":"border-border"}`}>
                      {nearMe && <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 12 12"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                    </div>
                  </button>
                </div>
              )}

              {/* Traveling from */}
              <div>
                <p className="text-xs font-black tracking-[0.18em] uppercase text-muted mb-3">Traveling from</p>
                <div className="space-y-0.5">
                  {CITIES.map(c=>(
                    <button key={c} onClick={()=>setCity(c)}
                      className={`w-full text-left text-sm font-medium px-3 py-2.5 rounded-xl transition-all ${city===c?"bg-accent-light text-accent font-semibold":"text-ink hover:bg-warm"}`}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Store */}
              <div>
                <p className="text-xs font-black tracking-[0.18em] uppercase text-muted mb-3">Store</p>
                <select value={store} onChange={e=>setStore(e.target.value)}
                  className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all appearance-none text-ink">
                  {STORES.map(s=><option key={s}>{s}</option>)}
                </select>
                {store!=="All stores" && (
                  <button onClick={()=>setStore("All stores")} className="text-xs text-accent hover:underline mt-1.5 block">Clear ×</button>
                )}
              </div>

              {/* Can't find it */}
              <div className="card p-5 border-accent/20 bg-accent-light">
                <p className="text-xs font-black text-accent uppercase tracking-wider mb-2">Can't find it?</p>
                <p className="text-sm text-muted mb-4">Post a custom request and let travelers come to you.</p>
                <button onClick={()=>setShowModal(true)} className="btn-primary text-sm w-full justify-center py-2.5">Post request</button>
              </div>
            </aside>

            {/* Grid */}
            <div className="flex-1 min-w-0">
              {/* Active filter pills */}
              {hasActiveFilters && (
                <div className="flex flex-wrap gap-2 mb-5">
                  {nearMe&&userZip && (
                    <span className="flex items-center gap-1.5 bg-accent-light border border-accent/20 text-accent text-xs font-semibold px-3 py-1.5 rounded-full">
                      📍 Near {userZip}
                      <button onClick={()=>setNearMe(false)}>×</button>
                    </span>
                  )}
                  {city!=="All" && (
                    <span className="flex items-center gap-1.5 bg-warm border border-border text-ink text-xs font-semibold px-3 py-1.5 rounded-full">
                      ✈️ From {city}
                      <button onClick={()=>setCity("All")} className="text-muted hover:text-ink">×</button>
                    </span>
                  )}
                  {store!=="All stores" && (
                    <span className="flex items-center gap-1.5 bg-warm border border-border text-ink text-xs font-semibold px-3 py-1.5 rounded-full">
                      🏪 {store}
                      <button onClick={()=>setStore("All stores")} className="text-muted hover:text-ink">×</button>
                    </span>
                  )}
                  <button onClick={()=>{setNearMe(false);setCity("All");setStore("All stores");}}
                    className="text-xs text-muted hover:text-accent transition-colors px-1.5">Clear all</button>
                </div>
              )}

              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-muted">
                  <span className="font-bold text-ink">{filtered.length}</span> items available
                </p>
                {totalItems>0 && (
                  <Link href="/cart" className="flex items-center gap-2 text-sm font-bold text-accent hover:underline">
                    View cart ({totalItems} {totalItems===1?"item":"items"}) →
                  </Link>
                )}
              </div>

              <AnimatePresence mode="wait">
                {filtered.length===0 ? (
                  <motion.div key="empty" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
                    className="text-center py-32 text-muted">
                    <div className="text-6xl mb-5">🔍</div>
                    <p className="text-h1 text-ink font-bold mb-2">Nothing found</p>
                    <p className="text-body mb-6">Try a different city, store, or category.</p>
                    <button onClick={()=>setShowModal(true)} className="btn-primary px-8 py-3">Post a custom request</button>
                  </motion.div>
                ) : (
                  <motion.div key="grid" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
                    className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                    {filtered.map((p,i)=><ProductCard key={p.id} p={p} i={i} onView={setSelected}/>)}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>
      <Footer/>
    </>
  );
}
