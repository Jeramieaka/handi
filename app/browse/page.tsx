"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useCart } from "@/components/CartContext";
import { useZip } from "@/components/ZipContext";

/* ─── Data ────────────────────────────────────────────────────── */

const CATEGORIES = ["All", "Collectibles", "Fashion", "Food & Snacks", "Beauty", "Books & Stationery", "Home & Gifts"];
const CITIES     = ["All", "Tokyo", "New York", "Seoul", "Paris", "London"];

const CITY_META: Record<string, { flag: string; color: string }> = {
  "Tokyo":    { flag: "🇯🇵", color: "#E8F4FF" },
  "New York": { flag: "🇺🇸", color: "#FFF1EC" },
  "Seoul":    { flag: "🇰🇷", color: "#F0FFF4" },
  "Paris":    { flag: "🇫🇷", color: "#FFF0F6" },
  "London":   { flag: "🇬🇧", color: "#F0F4FF" },
};

const DELIVERY_META: Record<string, { icon: string; label: string; desc: string }> = {
  meetup:  { icon: "🤝", label: "Direct meetup",  desc: "Buyer picks up in person"     },
  door:    { icon: "🚪", label: "Door delivery",   desc: "Traveler delivers to address" },
  courier: { icon: "🚗", label: "Courier relay",   desc: "Via local courier service"    },
};

const LISTINGS = [
  { id:"t1-1", travelerEmoji:"🧔", travelerName:"James L.", travelerRating:5.0, travelerReviews:124, badge:"Top Carrier",
    verified:true, completionRate:98, responseTime:"< 30 min",
    from:"Tokyo", date:"May 8", deliverArea:"New York", deliverZips:["100","101","102","103","104","112","113","114"],
    productName:"Pokémon Center Pikachu Plush (Large)", store:"Pokémon Center Mega Tokyo",
    category:"Collectibles", price:18, maxQty:3, categoryEmoji:"🧸",
    productImage:"https://images.unsplash.com/photo-1608889175523-6bebab82e69b?w=800&h=800&fit=crop&q=85",
    delivery:["meetup","courier"], meetupLocations:["Shinjuku Station South Exit","Shibuya Starbucks"] },
  { id:"t1-2", travelerEmoji:"🧔", travelerName:"James L.", travelerRating:5.0, travelerReviews:124, badge:"Top Carrier",
    verified:true, completionRate:98, responseTime:"< 30 min",
    from:"Tokyo", date:"May 8", deliverArea:"New York", deliverZips:["100","101","102","103","104","112","113","114"],
    productName:"Eevee Exclusive Figure (Limited Ed.)", store:"Pokémon Center Mega Tokyo",
    category:"Collectibles", price:35, maxQty:2, categoryEmoji:"🎁",
    productImage:"https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=800&h=800&fit=crop&q=85",
    delivery:["meetup","courier"], meetupLocations:["Shinjuku Station South Exit","Shibuya Starbucks"] },
  { id:"t1-3", travelerEmoji:"🧔", travelerName:"James L.", travelerRating:5.0, travelerReviews:124, badge:"Top Carrier",
    verified:true, completionRate:98, responseTime:"< 30 min",
    from:"Tokyo", date:"May 8", deliverArea:"New York", deliverZips:["100","101","102","103","104","112","113","114"],
    productName:"Seasonal KitKat Box (Matcha & Sakura)", store:"Tokyo Convenience",
    category:"Food & Snacks", price:14, maxQty:5, categoryEmoji:"🍫",
    productImage:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop&q=85",
    delivery:["meetup","courier"], meetupLocations:["Shinjuku Station South Exit","Shibuya Starbucks"] },
  { id:"t6-1", travelerEmoji:"👩", travelerName:"Yuki H.", travelerRating:4.9, travelerReviews:68, badge:"Top Carrier",
    verified:true, completionRate:95, responseTime:"< 1 hr",
    from:"Tokyo", date:"Apr 25", deliverArea:"Los Angeles", deliverZips:["900","901","902","903","904","913","914"],
    productName:"Nintendo Switch Sports Bundle", store:"Nintendo Tokyo",
    category:"Collectibles", price:12, maxQty:2, categoryEmoji:"🎮",
    productImage:"https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=800&h=800&fit=crop&q=85",
    delivery:["door","courier"], meetupLocations:[] },
  { id:"t6-2", travelerEmoji:"👩", travelerName:"Yuki H.", travelerRating:4.9, travelerReviews:68, badge:"Top Carrier",
    verified:true, completionRate:95, responseTime:"< 1 hr",
    from:"Tokyo", date:"Apr 25", deliverArea:"Los Angeles", deliverZips:["900","901","902","903","904","913","914"],
    productName:"Hobonichi Techo Planner 2025", store:"Hobonichi Tokyo",
    category:"Books & Stationery", price:10, maxQty:4, categoryEmoji:"📓",
    productImage:"https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&h=800&fit=crop&q=85",
    delivery:["door","courier"], meetupLocations:[] },
  { id:"t2-1", travelerEmoji:"👩", travelerName:"Sarah K.", travelerRating:4.9, travelerReviews:87, badge:"Top Carrier",
    verified:true, completionRate:97, responseTime:"< 30 min",
    from:"New York", date:"May 2", deliverArea:"New York", deliverZips:["100","101","102","103","104","110","111","112","113","114"],
    productName:"Levain Bakery Cookies (6-pack)", store:"Levain Bakery",
    category:"Food & Snacks", price:22, maxQty:4, categoryEmoji:"🍪",
    productImage:"https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800&h=800&fit=crop&q=85",
    delivery:["meetup","door"], meetupLocations:["Grand Central Terminal","Bryant Park"] },
  { id:"t2-2", travelerEmoji:"👩", travelerName:"Sarah K.", travelerRating:4.9, travelerReviews:87, badge:"Top Carrier",
    verified:true, completionRate:97, responseTime:"< 30 min",
    from:"New York", date:"May 2", deliverArea:"New York", deliverZips:["100","101","102","103","104","110","111","112","113","114"],
    productName:"Kith × New Balance 550 (Size on request)", store:"Kith NYC",
    category:"Fashion", price:28, maxQty:1, categoryEmoji:"👟",
    productImage:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop&q=85",
    delivery:["meetup","door"], meetupLocations:["Grand Central Terminal","Bryant Park"] },
  { id:"t3-1", travelerEmoji:"🧑", travelerName:"Minho C.", travelerRating:4.8, travelerReviews:56, badge:null,
    verified:false, completionRate:88, responseTime:"< 2 hrs",
    from:"Seoul", date:"Apr 27", deliverArea:"San Francisco", deliverZips:["940","941","942","943","944"],
    productName:"COSRX Snail Mucin 96% Power Repairing Essence", store:"Olive Young",
    category:"Beauty", price:16, maxQty:5, categoryEmoji:"🧴",
    productImage:"https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&h=800&fit=crop&q=85",
    delivery:["meetup","door","courier"], meetupLocations:["Hongdae Station Exit 9","Gangnam COEX Mall"] },
  { id:"t3-2", travelerEmoji:"🧑", travelerName:"Minho C.", travelerRating:4.8, travelerReviews:56, badge:null,
    verified:false, completionRate:88, responseTime:"< 2 hrs",
    from:"Seoul", date:"Apr 27", deliverArea:"San Francisco", deliverZips:["940","941","942","943","944"],
    productName:"Beauty of Joseon Relief Sun SPF50+", store:"Olive Young",
    category:"Beauty", price:14, maxQty:5, categoryEmoji:"☀️",
    productImage:"https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&h=800&fit=crop&q=85",
    delivery:["meetup","door","courier"], meetupLocations:["Hongdae Station Exit 9","Gangnam COEX Mall"] },
  { id:"t3-3", travelerEmoji:"🧑", travelerName:"Minho C.", travelerRating:4.8, travelerReviews:56, badge:null,
    verified:false, completionRate:88, responseTime:"< 2 hrs",
    from:"Seoul", date:"Apr 27", deliverArea:"San Francisco", deliverZips:["940","941","942","943","944"],
    productName:"Gentle Monster Jennie Collab Sunglasses", store:"Gentle Monster Flagship",
    category:"Fashion", price:25, maxQty:1, categoryEmoji:"🕶️",
    productImage:"https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&h=800&fit=crop&q=85",
    delivery:["meetup","door","courier"], meetupLocations:["Hongdae Station Exit 9","Gangnam COEX Mall"] },
  { id:"t4-1", travelerEmoji:"👱", travelerName:"Elise M.", travelerRating:4.9, travelerReviews:43, badge:null,
    verified:false, completionRate:91, responseTime:"< 1 hr",
    from:"Paris", date:"Apr 30", deliverArea:"New York", deliverZips:["100","101","102","103","104","112"],
    productName:"Ladurée Macaron Box (12 pcs, assorted)", store:"Ladurée Champs-Élysées",
    category:"Food & Snacks", price:38, maxQty:3, categoryEmoji:"🥐",
    productImage:"https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=800&h=800&fit=crop&q=85",
    delivery:["door","courier"], meetupLocations:[] },
  { id:"t4-2", travelerEmoji:"👱", travelerName:"Elise M.", travelerRating:4.9, travelerReviews:43, badge:null,
    verified:false, completionRate:91, responseTime:"< 1 hr",
    from:"Paris", date:"Apr 30", deliverArea:"New York", deliverZips:["100","101","102","103","104","112"],
    productName:"Diptyque Baies Candle (190g)", store:"Diptyque Flagship",
    category:"Home & Gifts", price:30, maxQty:2, categoryEmoji:"🕯️",
    productImage:"https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&h=800&fit=crop&q=85",
    delivery:["door","courier"], meetupLocations:[] },
  { id:"t5-1", travelerEmoji:"🧓", travelerName:"Oliver T.", travelerRating:4.7, travelerReviews:31, badge:null,
    verified:false, completionRate:85, responseTime:"< 2 hrs",
    from:"London", date:"Apr 22", deliverArea:"Boston", deliverZips:["021","022","023","024"],
    productName:"Jellycat Bashful Bunny (Large, Cream)", store:"Harrods",
    category:"Home & Gifts", price:28, maxQty:3, categoryEmoji:"🐰",
    productImage:"https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800&h=800&fit=crop&q=85",
    delivery:["meetup","courier"], meetupLocations:["Liverpool Street Station","Canary Wharf Café"] },
  { id:"t5-2", travelerEmoji:"🧓", travelerName:"Oliver T.", travelerRating:4.7, travelerReviews:31, badge:null,
    verified:false, completionRate:85, responseTime:"< 2 hrs",
    from:"London", date:"Apr 22", deliverArea:"Boston", deliverZips:["021","022","023","024"],
    productName:"Fortnum & Mason Earl Grey Tea (250g tin)", store:"Fortnum & Mason",
    category:"Food & Snacks", price:22, maxQty:4, categoryEmoji:"🍵",
    productImage:"https://images.unsplash.com/photo-1564890369478-c89ca3d9da7b?w=800&h=800&fit=crop&q=85",
    delivery:["meetup","courier"], meetupLocations:["Liverpool Street Station","Canary Wharf Café"] },
  { id:"t5-3", travelerEmoji:"🧓", travelerName:"Oliver T.", travelerRating:4.7, travelerReviews:31, badge:null,
    verified:false, completionRate:85, responseTime:"< 2 hrs",
    from:"London", date:"Apr 22", deliverArea:"Boston", deliverZips:["021","022","023","024"],
    productName:"Harrods Classic Shortbread Gift Tin", store:"Harrods",
    category:"Food & Snacks", price:24, maxQty:3, categoryEmoji:"🍪",
    productImage:"https://images.unsplash.com/photo-1499638673689-79a0b5115d87?w=800&h=800&fit=crop&q=85",
    delivery:["meetup","courier"], meetupLocations:["Liverpool Street Station","Canary Wharf Café"] },
  { id:"t8-1", travelerEmoji:"👩", travelerName:"Léa M.", travelerRating:5.0, travelerReviews:22, badge:"New",
    verified:true, completionRate:100, responseTime:"< 1 hr",
    from:"Paris", date:"May 2", deliverArea:"Miami", deliverZips:["331","332","333","334"],
    productName:"Pierre Hermé Ispahan Macaron Box", store:"Pierre Hermé",
    category:"Food & Snacks", price:42, maxQty:2, categoryEmoji:"🥐",
    productImage:"https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&h=800&fit=crop&q=85",
    delivery:["door"], meetupLocations:[] },
  { id:"t8-2", travelerEmoji:"👩", travelerName:"Léa M.", travelerRating:5.0, travelerReviews:22, badge:"New",
    verified:true, completionRate:100, responseTime:"< 1 hr",
    from:"Paris", date:"May 2", deliverArea:"Miami", deliverZips:["331","332","333","334"],
    productName:"Dior Beauty Lip Glow Oil (limited shade)", store:"Sephora Paris",
    category:"Beauty", price:20, maxQty:2, categoryEmoji:"💄",
    productImage:"https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=800&fit=crop&q=85",
    delivery:["door"], meetupLocations:[] },
];

type Listing = typeof LISTINGS[0];

/* ─── Psychology helpers ──────────────────────────────────────── */

function viewerCount(id: string): number {
  const n = id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return 3 + (n % 11);
}

function parseDepartDate(s: string): number {
  const M: Record<string,number> = {Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11};
  const [m,d] = s.split(" ");
  if (!m||!d||!(m in M)) return Infinity;
  return new Date(new Date().getFullYear(), M[m], +d).getTime();
}

function daysLeft(dateStr: string): number | null {
  const diff = Math.ceil((parseDepartDate(dateStr) - Date.now()) / 86400000);
  return diff > 0 ? diff : null;
}

/* ─── Ticker ──────────────────────────────────────────────────── */

const TICKER_ITEMS = [
  "🌍 31 travelers active right now",
  "✈️ 12 items delivered this week",
  "🔥 Tokyo listings trending",
  "🛡️ 100% buyer protection, always",
  "⭐ 4.9 average traveler rating",
  "💎 Exclusive items unavailable anywhere else",
  "⚡ New Seoul drop just landed",
  "🔒 Escrow payment — zero risk",
];

function Ticker() {
  const doubled = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div className="overflow-hidden" style={{ background: "#0A0907", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <motion.div
        className="flex items-center gap-10 py-2.5 whitespace-nowrap"
        style={{ width: "max-content" }}
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 30, ease: "linear", repeat: Infinity }}
      >
        {doubled.map((t, i) => (
          <span key={i} className="text-[11px] font-medium" style={{ color: "rgba(255,255,255,0.35)" }}>
            {t}
            {i < doubled.length - 1 && <span className="ml-10 opacity-20">·</span>}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ─── Product Detail Modal ────────────────────────────────────── */

function ProductDetailModal({ product, onClose, onViewRelated }: {
  product: Listing; onClose: () => void; onViewRelated: (p: Listing) => void;
}) {
  const { addItem, items } = useCart();
  const [qty,      setQty]      = useState(1);
  const [added,    setAdded]    = useState(false);
  const [imgError, setImgError] = useState(false);

  const inCart    = items.find(it => it.id === product.id);
  const cartQty   = inCart?.qty ?? 0;
  const remaining = product.maxQty - cartQty;
  const related   = LISTINGS.filter(l => l.travelerName === product.travelerName && l.id !== product.id);
  const days      = daysLeft(product.date);

  const handleAdd = () => {
    for (let n = 0; n < qty; n++) addItem({ id:product.id, productName:product.productName, store:product.store,
      travelerName:product.travelerName, travelerEmoji:product.travelerEmoji, from:product.from,
      date:product.date, price:product.price, maxQty:product.maxQty, categoryEmoji:product.categoryEmoji,
      meetupLocations:product.meetupLocations });
    setAdded(true); setTimeout(() => setAdded(false), 2000); setQty(1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-6 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ opacity:0, y:40 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:40 }}
        transition={{ duration:0.3, ease:[0.22,1,0.36,1] }}
        className="w-full sm:max-w-xl bg-white rounded-t-3xl sm:rounded-3xl overflow-hidden flex flex-col max-h-[92vh] shadow-2xl"
        onClick={e => e.stopPropagation()}>
        <div className="relative flex-shrink-0 h-64 sm:h-72 overflow-hidden" style={{ background:"#F5F3EF" }}>
          <span className="absolute inset-0 flex items-center justify-center text-[7rem] opacity-[0.08]">{product.categoryEmoji}</span>
          {!imgError && <img src={product.productImage} alt={product.productName} className="absolute inset-0 w-full h-full object-cover" onError={() => setImgError(true)} />}
          {product.badge && <span className="absolute top-4 left-4 text-[10px] font-black px-3 py-1.5 rounded-full" style={{ background:product.badge==="New"?"#ECFDF5":"#FF4500", color:product.badge==="New"?"#065F46":"white" }}>{product.badge}</span>}
          <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-xl shadow-lg hover:bg-white transition-colors" style={{ color:"#111110" }}>×</button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 sm:p-7">
            <p className="text-[11px] font-semibold uppercase tracking-wider mb-1" style={{ color:"#A09C97" }}>{product.store}</p>
            <h2 className="text-xl font-black leading-snug mb-5" style={{ color:"#111110" }}>{product.productName}</h2>
            {days && days <= 5 && (
              <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl mb-4 border" style={{ background:"#FFF7ED", borderColor:"#FED7AA" }}>
                <span className="text-base">⏰</span>
                <p className="text-[13px] font-bold" style={{ color:"#9A3412" }}>Traveler leaves in {days} day{days!==1?"s":""}. Order now to secure your slot.</p>
              </div>
            )}
            <div className="flex items-center gap-3 p-4 rounded-2xl mb-5" style={{ background:"#F7F5F2" }}>
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-xl flex-shrink-0 shadow-sm">{product.travelerEmoji}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <p className="text-sm font-bold" style={{ color:"#111110" }}>{product.travelerName}</p>
                  {product.verified && <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full" style={{ background:"#EFF6FF", color:"#1D4ED8", border:"1px solid #BFDBFE" }}>✓ ID Verified</span>}
                </div>
                <p className="text-xs" style={{ color:"#A09C97" }}>{product.from} → {product.deliverArea} · ✈️ {product.date}</p>
              </div>
              <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
                <div className="flex items-center gap-1"><span className="text-amber-400">★</span><span className="text-sm font-bold" style={{ color:"#111110" }}>{product.travelerRating}</span><span className="text-xs" style={{ color:"#A09C97" }}>({product.travelerReviews})</span></div>
                <span className="text-[10px]" style={{ color:"#A09C97" }}>{product.completionRate}% completion</span>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-2xl mb-5 border" style={{ background:"#FFFBEB", borderColor:"#FDE68A" }}>
              <span className="text-base flex-shrink-0">💡</span>
              <div><p className="text-xs font-bold mb-0.5" style={{ color:"#92400E" }}>How the carry fee works</p><p className="text-[11px] leading-relaxed" style={{ color:"#92400E", opacity:.75 }}>This is the <strong>carry fee</strong> paid to your traveler. The item's retail price is paid separately at handoff.</p></div>
            </div>
            <div className="mb-6">
              <p className="text-xs font-black tracking-[0.16em] uppercase mb-3" style={{ color:"#A09C97" }}>Accepted delivery</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {product.delivery.map(d => { const m = DELIVERY_META[d]; return m ? (
                  <div key={d} className="p-3 rounded-xl border" style={{ background:"#F7F5F2", borderColor:"#ECEAE5" }}>
                    <div className="flex items-center gap-2 mb-1.5"><span className="text-lg">{m.icon}</span><div><p className="text-xs font-bold" style={{ color:"#111110" }}>{m.label}</p><p className="text-[10px]" style={{ color:"#A09C97" }}>{m.desc}</p></div></div>
                    {d==="meetup" && product.meetupLocations?.length>0 && <div className="pt-1.5 border-t flex flex-col gap-1" style={{ borderColor:"rgba(0,0,0,0.06)" }}>{product.meetupLocations.map(loc => <span key={loc} className="text-[10px]" style={{ color:"#A09C97" }}>📍 {loc}</span>)}</div>}
                  </div>) : null;})}
              </div>
            </div>
            <div className="flex items-center gap-4 p-5 rounded-2xl mb-5" style={{ background:"#F7F5F2" }}>
              <div className="flex-1"><p className="text-xs mb-0.5" style={{ color:"#A09C97" }}>Carry fee</p><p className="text-2xl font-black" style={{ color:"#111110" }}>${product.price}</p><p className="text-[10px] mt-0.5" style={{ color:"#A09C97" }}>+ item retail price at handoff</p></div>
              {remaining > 0 ? (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-white border rounded-xl overflow-hidden" style={{ borderColor:"#ECEAE5" }}>
                    <button onClick={() => setQty(q => Math.max(1,q-1))} className="w-9 h-9 flex items-center justify-center font-bold text-lg transition-colors" style={{ color:"#A09C97" }}>−</button>
                    <span className="w-7 text-center text-sm font-semibold" style={{ color:"#111110" }}>{qty}</span>
                    <button onClick={() => setQty(q => Math.min(remaining,q+1))} className="w-9 h-9 flex items-center justify-center font-bold text-lg transition-colors" style={{ color:"#A09C97" }}>+</button>
                  </div>
                  <button onClick={handleAdd} className="px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 active:scale-95" style={added?{background:"#22c55e",color:"white"}:{background:"#FF4500",color:"white"}}>
                    {added ? "Added ✓" : "Add to cart"}
                  </button>
                </div>
              ) : <span className="text-sm font-semibold px-4 py-2.5 rounded-xl border" style={{ color:"#A09C97", borderColor:"#ECEAE5" }}>Sold out</span>}
            </div>
            {remaining > 0 && remaining <= 3 && <p className="text-xs font-semibold -mt-3 mb-5" style={{ color:"#FF4500" }}>⚡ Only {remaining} slot{remaining!==1?"s":""} left at this price</p>}
            <div className="flex items-start gap-3 p-4 rounded-2xl mb-6 border" style={{ background:"#F0FDF4", borderColor:"#BBF7D0" }}>
              <span className="text-lg flex-shrink-0">🛡️</span>
              <div><p className="text-xs font-bold mb-0.5" style={{ color:"#166534" }}>Buyer protection included</p><p className="text-[11px]" style={{ color:"#166534", opacity:.8 }}>Payment held in escrow — released only after you confirm receipt. 5-day dispute window.</p></div>
            </div>
            {related.length > 0 && (
              <div>
                <p className="text-xs font-black tracking-[0.16em] uppercase mb-3" style={{ color:"#A09C97" }}>More from {product.travelerName}</p>
                <div className="grid grid-cols-2 gap-3">
                  {related.map(rel => (
                    <button key={rel.id} onClick={() => onViewRelated(rel)} className="flex items-center gap-3 p-3 rounded-2xl border text-left group transition-all hover:border-[#FF4500]/30" style={{ background:"#F7F5F2", borderColor:"#ECEAE5" }}>
                      <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 relative" style={{ background:"#ECEAE5" }}>
                        <span className="absolute inset-0 flex items-center justify-center text-2xl opacity-50">{rel.categoryEmoji}</span>
                        <img src={rel.productImage} alt={rel.productName} className="absolute inset-0 w-full h-full object-cover"/>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold line-clamp-2 leading-snug group-hover:text-[#FF4500] transition-colors" style={{ color:"#111110" }}>{rel.productName}</p>
                        <p className="text-[10px] mt-0.5" style={{ color:"#A09C97" }}>Fee · <span className="font-bold text-[#FF4500]">${rel.price}</span></p>
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

/* ─── Post Request Modal ──────────────────────────────────────── */

function PostRequestModal({ onClose }: { onClose: () => void }) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ from:"", to:"", item:"", budget:"", note:"" });
  const canSubmit = form.from && form.to && form.item && form.budget;
  if (submitted) return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
      <motion.div initial={{ scale:.95, opacity:0 }} animate={{ scale:1, opacity:1 }} className="bg-white p-10 rounded-3xl max-w-md w-full text-center shadow-2xl">
        <div className="text-6xl mb-5">🎉</div>
        <h2 className="text-xl font-black mb-3" style={{ color:"#111110" }}>Request posted!</h2>
        <p className="text-sm mb-8" style={{ color:"#A09C97" }}>Travelers on matching routes will see your request and reach out.</p>
        <button onClick={onClose} className="px-10 py-3 rounded-2xl font-bold text-white" style={{ background:"#FF4500" }}>Done</button>
      </motion.div>
    </div>
  );
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ scale:.95, opacity:0, y:20 }} animate={{ scale:1, opacity:1, y:0 }} transition={{ duration:.3, ease:[0.22,1,0.36,1] }}
        className="bg-white p-8 rounded-3xl max-w-lg w-full shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-7">
          <div><h2 className="text-xl font-black" style={{ color:"#111110" }}>Post a custom request</h2><p className="text-sm mt-1" style={{ color:"#A09C97" }}>Can't find it? Let travelers come to you.</p></div>
          <button onClick={onClose} className="w-9 h-9 rounded-full flex items-center justify-center text-xl flex-shrink-0 ml-4 transition-colors hover:bg-gray-100" style={{ color:"#A09C97" }}>×</button>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {[{label:"Item from",key:"from",opts:["Tokyo","New York","Seoul","Paris","London","Singapore","Milan","Sydney"]},{label:"Deliver to",key:"to",opts:["Taipei","Toronto","Singapore","Bangkok","Sydney","Amsterdam","Berlin","Dubai"]}].map(({label,key,opts}) => (
              <div key={key}><label className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color:"#A09C97" }}>{label}</label>
                <select value={(form as Record<string,string>)[key]} onChange={e => setForm({...form,[key]:e.target.value})} className="w-full border rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#FF4500]/20 appearance-none transition-all" style={{ borderColor:"#ECEAE5" }}>
                  <option value="">City</option>{opts.map(c => <option key={c}>{c}</option>)}</select></div>
            ))}
          </div>
          <div><label className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color:"#A09C97" }}>What do you want?</label>
            <input type="text" placeholder="e.g. Jellycat Bashful Bunny Medium, cream" value={form.item} onChange={e => setForm({...form,item:e.target.value})} className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF4500]/20 transition-all" style={{ borderColor:"#ECEAE5" }}/></div>
          <div><label className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color:"#A09C97" }}>Budget (USD, incl. carry fee)</label>
            <input type="number" placeholder="e.g. 60" value={form.budget} onChange={e => setForm({...form,budget:e.target.value})} className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF4500]/20 transition-all" style={{ borderColor:"#ECEAE5" }}/></div>
          <div><label className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color:"#A09C97" }}>Notes <span className="normal-case font-normal">(optional)</span></label>
            <textarea rows={2} placeholder="Size, colour, packaging preference…" value={form.note} onChange={e => setForm({...form,note:e.target.value})} className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF4500]/20 transition-all resize-none" style={{ borderColor:"#ECEAE5" }}/></div>
        </div>
        <div className="flex gap-3 mt-7">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl text-sm font-semibold border transition-all hover:bg-gray-50" style={{ borderColor:"#ECEAE5", color:"#6B6763" }}>Cancel</button>
          <button onClick={() => setSubmitted(true)} disabled={!canSubmit} className="flex-1 py-3 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-40" style={{ background:"#FF4500" }}>Post request</button>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Hero Card (editorial dark overlay) ─────────────────────── */

function HeroCard({ p, onView, variant = "tall" }: { p: Listing; onView: (p: Listing) => void; variant?: "tall" | "wide" }) {
  const { addItem, items } = useCart();
  const [added,    setAdded]    = useState(false);
  const [imgError, setImgError] = useState(false);
  const inCart    = items.find(it => it.id === p.id);
  const remaining = p.maxQty - (inCart?.qty ?? 0);
  const days      = daysLeft(p.date);
  const viewers   = viewerCount(p.id);
  const stockPct  = Math.round(((p.maxQty - remaining) / p.maxQty) * 100);
  const isTall    = variant === "tall";

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (remaining <= 0) return;
    addItem({ id:p.id, productName:p.productName, store:p.store, travelerName:p.travelerName,
      travelerEmoji:p.travelerEmoji, from:p.from, date:p.date, price:p.price,
      maxQty:p.maxQty, categoryEmoji:p.categoryEmoji, meetupLocations:p.meetupLocations });
    setAdded(true); setTimeout(() => setAdded(false), 2200);
  };

  return (
    <div
      onClick={() => onView(p)}
      className="relative w-full h-full rounded-3xl overflow-hidden cursor-pointer group"
      style={{ background:"#0F0E0C", minHeight: isTall ? 320 : 190 }}
    >
      {/* Photo */}
      {!imgError && (
        <img src={p.productImage} alt={p.productName}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
          onError={() => setImgError(true)} />
      )}

      {/* Ghost city watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <span className="font-black text-white" style={{ fontSize:"clamp(72px,14vw,170px)", opacity:0.045, letterSpacing:"-0.06em", lineHeight:1 }}>
          {p.from.toUpperCase()}
        </span>
      </div>

      {/* Gradient — tall vs wide get different treatments */}
      {isTall ? (
        /* Tall: dark from bottom ~60% upward */
        <div className="absolute inset-0" style={{ background:"linear-gradient(to top, rgba(0,0,0,0.96) 0%, rgba(0,0,0,0.72) 30%, rgba(0,0,0,0.25) 60%, rgba(0,0,0,0.04) 100%)" }} />
      ) : (
        /* Wide: strong dark band covering entire bottom half */
        <>
          <div className="absolute inset-0" style={{ background:"linear-gradient(to top, rgba(0,0,0,0.97) 0%, rgba(0,0,0,0.88) 35%, rgba(0,0,0,0.45) 60%, rgba(0,0,0,0.15) 80%, rgba(0,0,0,0) 100%)" }} />
          {/* Extra top scrim so top pills stay legible */}
          <div className="absolute inset-0" style={{ background:"linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 28%)" }} />
        </>
      )}

      {/* ── Top row (both variants) ── */}
      <div className="absolute top-4 left-4 right-4 flex items-start justify-between z-10">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full w-fit"
            style={{ background:"rgba(255,255,255,0.14)", backdropFilter:"blur(14px)", border:"1px solid rgba(255,255,255,0.12)" }}>
            <span className="text-[13px] leading-none">{CITY_META[p.from]?.flag ?? "🌍"}</span>
            <span className="text-[11px] font-semibold text-white">{p.from}</span>
          </div>
          {remaining <= 2 && remaining > 0 && (
            <motion.span
              initial={{ scale:0.8, opacity:0 }} animate={{ scale:1, opacity:1 }} transition={{ delay:0.4, type:"spring", stiffness:400 }}
              className="text-[10px] font-black px-2.5 py-1 rounded-full text-white w-fit"
              style={{ background:"#FF4500", boxShadow:"0 4px 12px rgba(255,69,0,0.45)" }}>
              ⚡ Only {remaining} left
            </motion.span>
          )}
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full"
          style={{ background:"rgba(255,255,255,0.14)", backdropFilter:"blur(14px)", border:"1px solid rgba(255,255,255,0.1)" }}>
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
          <span className="text-[10px] font-semibold text-white">{viewers} viewing</span>
        </div>
      </div>

      {/* ── TALL card bottom content ── */}
      {isTall && (
        <div className="absolute bottom-0 left-0 right-0 z-10 p-6">
          {/* Traveler row */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-base leading-none">{p.travelerEmoji}</span>
            <span className="text-[11px] font-medium" style={{ color:"rgba(255,255,255,0.5)" }}>{p.travelerName}</span>
            {p.verified && (
              <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full"
                style={{ background:"rgba(255,255,255,0.14)", color:"rgba(255,255,255,0.75)", border:"1px solid rgba(255,255,255,0.15)" }}>
                ✓ ID
              </span>
            )}
            <div className="flex items-center gap-0.5 ml-auto">
              <span className="text-amber-400 text-[11px]">★</span>
              <span className="text-[11px] font-bold text-white">{p.travelerRating}</span>
            </div>
          </div>
          <p style={{ color:"rgba(255,255,255,0.36)", fontSize:10, letterSpacing:"0.14em", textTransform:"uppercase", marginBottom:5 }}>{p.store}</p>
          <h3 className="font-black leading-snug mb-5" style={{ color:"white", fontSize:20, letterSpacing:"-0.025em" }}>{p.productName}</h3>
          {/* Stock bar */}
          <div className="mb-5">
            <div className="flex justify-between text-[10px] mb-1.5">
              <span style={{ color:"rgba(255,255,255,0.35)" }}>{remaining}/{p.maxQty} carry slots</span>
              {days
                ? <span className="font-semibold" style={{ color: days<=2 ? "#FCA5A5" : "rgba(255,255,255,0.45)" }}>✈️ {days}d left</span>
                : <span style={{ color:"rgba(255,255,255,0.35)" }}>{p.date}</span>}
            </div>
            <div className="h-[3px] rounded-full overflow-hidden" style={{ background:"rgba(255,255,255,0.12)" }}>
              <motion.div className="h-full rounded-full"
                initial={{ width:0 }} animate={{ width:`${stockPct}%` }}
                transition={{ duration:1.4, delay:0.5, ease:[0.22,1,0.36,1] }}
                style={{ background: stockPct>=66 ? "linear-gradient(90deg,#f97316,#ef4444)" : "linear-gradient(90deg,#34d399,#f59e0b)" }} />
            </div>
          </div>
          <div className="h-px mb-5" style={{ background:"rgba(255,255,255,0.1)" }} />
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <span className="font-black text-white" style={{ fontSize:26 }}>${p.price}</span>
              <span className="ml-1.5" style={{ color:"rgba(255,255,255,0.32)", fontSize:10 }}>carry fee</span>
            </div>
            <button onClick={handleAdd} className="flex-shrink-0 font-black transition-all active:scale-95 hover:opacity-90"
              style={{ background: added ? "#22c55e" : remaining<=0 ? "rgba(255,255,255,0.1)" : "#FF4500", color:"white", borderRadius:16, fontSize:12, padding:"11px 24px", minWidth:130, boxShadow: added||remaining<=0 ? "none" : "0 4px 16px rgba(255,69,0,0.40)" }}>
              {added ? "Added ✓" : remaining<=0 ? "Sold out" : "Add to cart"}
            </button>
          </div>
        </div>
      )}

      {/* ── WIDE card bottom content — minimal, only essential info ── */}
      {!isTall && (
        <div className="absolute bottom-0 left-0 right-0 z-10 px-5 pb-5 pt-3">
          <p style={{ color:"rgba(255,255,255,0.42)", fontSize:10, letterSpacing:"0.14em", textTransform:"uppercase", marginBottom:4 }}>{p.store}</p>
          <h3 className="font-black leading-snug mb-4" style={{ color:"white", fontSize:16, letterSpacing:"-0.02em" }}>{p.productName}</h3>
          <div className="flex items-center gap-3">
            <div className="flex-1 flex items-center gap-3">
              <div>
                <span className="font-black text-white" style={{ fontSize:20 }}>${p.price}</span>
                <span className="ml-1" style={{ color:"rgba(255,255,255,0.35)", fontSize:10 }}>carry fee</span>
              </div>
              {days && (
                <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full"
                  style={{ background:"rgba(255,255,255,0.12)", backdropFilter:"blur(8px)", color: days<=2 ? "#FCA5A5" : "rgba(255,255,255,0.6)" }}>
                  ✈️ {days}d
                </span>
              )}
            </div>
            <button onClick={handleAdd} className="flex-shrink-0 font-black transition-all active:scale-95 hover:opacity-90"
              style={{ background: added ? "#22c55e" : remaining<=0 ? "rgba(255,255,255,0.1)" : "#FF4500", color:"white", borderRadius:14, fontSize:12, padding:"9px 20px", boxShadow: added||remaining<=0 ? "none" : "0 4px 14px rgba(255,69,0,0.40)" }}>
              {added ? "Added ✓" : remaining<=0 ? "Full" : "Add to cart"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Product Card (white grid card) ─────────────────────────── */

function ProductCard({ p, onView, index }: { p: Listing; onView: (p: Listing) => void; index: number }) {
  const { addItem, items } = useCart();
  const [imgError, setImgError] = useState(false);
  const [added,    setAdded]    = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  const inCart    = items.find(it => it.id === p.id);
  const remaining = p.maxQty - (inCart?.qty ?? 0);
  const days      = daysLeft(p.date);
  const viewers   = viewerCount(p.id);
  const stockPct  = Math.round(((p.maxQty - remaining) / p.maxQty) * 100);

  const isAlmostGone = remaining <= 2 && remaining > 0;
  const isTrending   = p.travelerRating >= 4.9 && p.travelerReviews >= 68;

  const badge = isAlmostGone
    ? { label:"⚡ Almost Gone", bg:"#FF4500", text:"white" }
    : isTrending
      ? { label:"🔥 Trending", bg:"#111110", text:"white" }
      : p.badge === "New"
        ? { label:"New", bg:"#ECFDF5", text:"#065F46" }
        : null;

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (remaining <= 0) return;
    addItem({ id:p.id, productName:p.productName, store:p.store, travelerName:p.travelerName,
      travelerEmoji:p.travelerEmoji, from:p.from, date:p.date, price:p.price,
      maxQty:p.maxQty, categoryEmoji:p.categoryEmoji, meetupLocations:p.meetupLocations });
    setAdded(true); setTimeout(() => setAdded(false), 2200);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity:0, y:20 }}
      animate={inView ? { opacity:1, y:0 } : { opacity:0, y:20 }}
      transition={{ duration:0.45, delay: Math.min(index * 0.05, 0.35), ease:[0.22,1,0.36,1] }}
      onClick={() => onView(p)}
      className="group bg-white rounded-3xl overflow-hidden cursor-pointer border transition-all duration-300 hover:-translate-y-1"
      style={{ borderColor:"#ECEAE5", boxShadow:"0 1px 4px rgba(0,0,0,0.05)" }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 16px 48px rgba(0,0,0,0.12)")}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.05)")}
    >
      {/* Image */}
      <div className="relative overflow-hidden" style={{ aspectRatio:"1/1", background:"#F5F3EF" }}>
        <span className="absolute inset-0 flex items-center justify-center text-[52px] opacity-[0.10] select-none pointer-events-none">{p.categoryEmoji}</span>
        {!imgError && <img src={p.productImage} alt={p.productName} className="absolute inset-0 w-full h-full object-cover transition-transform duration-600 group-hover:scale-[1.06]" onError={() => setImgError(true)} />}

        {/* Live viewers pill */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full transition-opacity" style={{ background:"rgba(255,255,255,0.92)", backdropFilter:"blur(8px)" }}>
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse flex-shrink-0" />
          <span className="text-[10px] font-bold" style={{ color:"#111110" }}>{viewers}</span>
        </div>

        {/* Badge */}
        {badge && (
          <span className="absolute top-3 left-3 text-[10px] font-black px-2.5 py-1 rounded-full" style={{ background:badge.bg, color:badge.text }}>
            {badge.label}
          </span>
        )}

        {/* Departure urgency bar */}
        {days && days <= 4 && (
          <div className="absolute bottom-0 inset-x-0 py-2 text-center text-[11px] font-bold" style={{ background: days<=2 ? "rgba(239,68,68,0.92)" : "rgba(17,17,16,0.80)", backdropFilter:"blur(4px)", color:"white" }}>
            ✈️ Departs in {days} day{days!==1?"s":""}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] mb-1 truncate" style={{ color:"#B0ABA5" }}>{p.store}</p>
        <h3 className="text-[13px] font-semibold leading-snug line-clamp-2 mb-3 transition-colors duration-150 group-hover:text-[#FF4500]" style={{ color:"#111110" }}>
          {p.productName}
        </h3>

        {/* Stock bar */}
        <div className="mb-4">
          <div className="h-[3px] rounded-full overflow-hidden mb-1.5" style={{ background:"#F0EDE8" }}>
            <motion.div
              className="h-full rounded-full"
              initial={{ width:0 }}
              animate={inView ? { width:`${stockPct}%` } : { width:0 }}
              transition={{ duration:1, delay: Math.min(index*0.05,0.35) + 0.3, ease:[0.22,1,0.36,1] }}
              style={{ background: stockPct >= 66 ? "linear-gradient(90deg,#f97316,#ef4444)" : stockPct >= 33 ? "#f59e0b" : "#34d399" }}
            />
          </div>
          <div className="flex justify-between text-[10px]">
            <span style={{ color:"#B0ABA5" }}>{remaining} slot{remaining!==1?"s":""} remaining</span>
            <span className="font-semibold" style={{ color: stockPct >= 66 ? "#FF4500" : "#B0ABA5" }}>{stockPct}% filled</span>
          </div>
        </div>

        {/* Price + CTA row */}
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-1 mb-0.5">
              <span className="text-[18px] font-black" style={{ color:"#111110" }}>${p.price}</span>
              <span className="text-[10px]" style={{ color:"#B0ABA5" }}>carry fee</span>
            </div>
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-amber-400 text-[11px]">★</span>
              <span className="text-[11px] font-bold" style={{ color:"#111110" }}>{p.travelerRating}</span>
              <span className="text-[10px] truncate" style={{ color:"#C0BBB5" }}>{p.travelerEmoji} {p.travelerName}</span>
            </div>
          </div>

          <button
            onClick={handleAdd}
            className="flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-black transition-all duration-150 active:scale-90"
            style={added
              ? { background:"#22c55e", color:"white" }
              : remaining<=0
                ? { background:"#F0EDE8", color:"#C0BBB5", cursor:"default" }
                : { background:"#111110", color:"white" }
            }
          >
            {added ? "✓" : remaining<=0 ? "–" : "+"}
          </button>
        </div>

        {/* Route chip */}
        <div className="flex items-center gap-1.5 mt-3 pt-3" style={{ borderTop:"1px solid #F5F3F0" }}>
          <span className="text-[10px] font-medium px-2.5 py-1 rounded-full" style={{ background:"#F5F3F0", color:"#6B6763" }}>
            {CITY_META[p.from]?.flag} {p.from} → {p.deliverArea} · {p.date}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Filter Drawer ───────────────────────────────────────────── */

function FilterDrawer({ open, onClose, category, setCategory, city, setCity, minFee, setMinFee, maxFee, setMaxFee, minRating, setMinRating, zip, setZip, onClearAll, catCount, nearCount, zipActive }:
  { open:boolean; onClose:()=>void; category:string; setCategory:(v:string)=>void; city:string; setCity:(v:string)=>void; minFee:string; setMinFee:(v:string)=>void; maxFee:string; setMaxFee:(v:string)=>void; minRating:number; setMinRating:(v:number)=>void; zip:string; setZip:(v:string)=>void; onClearAll:()=>void; catCount:Record<string,number>; nearCount:number; zipActive:boolean }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} transition={{ duration:0.2 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={onClose} />
          <motion.aside
            initial={{ x:"-100%" }} animate={{ x:0 }} exit={{ x:"-100%" }}
            transition={{ duration:0.3, ease:[0.22,1,0.36,1] }}
            className="fixed left-0 top-0 bottom-0 z-50 w-[300px] overflow-y-auto shadow-2xl flex flex-col"
            style={{ background:"#FAFAF8", borderRight:"1px solid #ECEAE5", paddingTop:64 }}
          >
            <div className="p-6 flex-1">
              <div className="flex items-center justify-between mb-7">
                <h3 className="text-[15px] font-black" style={{ color:"#111110" }}>Filters</h3>
                <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-lg transition-colors hover:bg-[#ECEAE5]" style={{ color:"#6B6763" }}>×</button>
              </div>

              {/* Category */}
              <div className="mb-7">
                <p className="text-[10px] font-black tracking-[0.18em] uppercase mb-3" style={{ color:"#A09C97" }}>Category</p>
                <div className="space-y-0.5">
                  {CATEGORIES.map(cat => (
                    <button key={cat} onClick={() => setCategory(cat)}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-[13px] transition-all text-left"
                      style={category===cat ? { background:"#FFF1EC", color:"#FF4500", fontWeight:700 } : { color:"#4B4844" }}>
                      <span>{cat==="All" ? "All categories" : cat}</span>
                      <span className="text-[11px]" style={{ color:category===cat?"#FF4500":"#C0BBB5" }}>{catCount[cat]??0}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="h-px mb-7" style={{ background:"#ECEAE5" }} />

              {/* City */}
              <div className="mb-7">
                <p className="text-[10px] font-black tracking-[0.18em] uppercase mb-3" style={{ color:"#A09C97" }}>Source city</p>
                <div className="space-y-0.5">
                  {CITIES.map(c => (
                    <button key={c} onClick={() => setCity(c)}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] transition-all text-left"
                      style={city===c ? { background:"#F5F3F0", color:"#111110", fontWeight:700 } : { color:"#6B6763" }}>
                      {city===c && <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background:"#FF4500" }} />}
                      {CITY_META[c]?.flag && <span>{CITY_META[c].flag}</span>}
                      {c==="All" ? "All cities" : c}
                    </button>
                  ))}
                </div>
              </div>
              <div className="h-px mb-7" style={{ background:"#ECEAE5" }} />

              {/* Fee */}
              <div className="mb-7">
                <p className="text-[10px] font-black tracking-[0.18em] uppercase mb-3" style={{ color:"#A09C97" }}>Carry fee (USD)</p>
                <div className="flex items-center gap-2">
                  <input type="number" placeholder="Min" value={minFee} onChange={e => setMinFee(e.target.value)} className="w-full border rounded-xl px-3 py-2.5 text-[13px] focus:outline-none transition-colors" style={{ borderColor:"#ECEAE5", color:"#111110" }} />
                  <span className="flex-shrink-0 text-sm" style={{ color:"#C0BBB5" }}>–</span>
                  <input type="number" placeholder="Max" value={maxFee} onChange={e => setMaxFee(e.target.value)} className="w-full border rounded-xl px-3 py-2.5 text-[13px] focus:outline-none transition-colors" style={{ borderColor:"#ECEAE5", color:"#111110" }} />
                </div>
              </div>
              <div className="h-px mb-7" style={{ background:"#ECEAE5" }} />

              {/* Rating */}
              <div className="mb-7">
                <p className="text-[10px] font-black tracking-[0.18em] uppercase mb-3" style={{ color:"#A09C97" }}>Traveler rating</p>
                <div className="space-y-0.5">
                  {[{label:"Any rating",val:0},{label:"4.5 & up",val:4.5},{label:"4.8 & up",val:4.8},{label:"5.0 only",val:5.0}].map(opt => (
                    <button key={opt.val} onClick={() => setMinRating(opt.val)}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] transition-all text-left"
                      style={minRating===opt.val ? { background:"#F5F3F0", color:"#111110", fontWeight:700 } : { color:"#6B6763" }}>
                      {minRating===opt.val && <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background:"#FF4500" }} />}
                      {opt.val>0 && <span className="text-amber-400 text-[12px]">★</span>}
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="h-px mb-7" style={{ background:"#ECEAE5" }} />

              {/* ZIP */}
              <div className="mb-7">
                <p className="text-[10px] font-black tracking-[0.18em] uppercase mb-3" style={{ color:"#A09C97" }}>Deliver near me</p>
                <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border transition-all" style={{ borderColor: zipActive && nearCount>0 ? "#16a34a" : zipActive ? "#FF4500" : "#ECEAE5" }}>
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 16 16" style={{ color: zipActive && nearCount>0 ? "#16a34a" : "#C0BBB5" }}><path d="M8 1C5.8 1 4 2.8 4 5c0 3.5 4 9 4 9s4-5.5 4-9c0-2.2-1.8-4-4-4z" stroke="currentColor" strokeWidth="1.4"/><circle cx="8" cy="5" r="1.5" fill="currentColor"/></svg>
                  <input value={zip} onChange={e => setZip(e.target.value.replace(/\D/g,"").slice(0,5))} placeholder="Your ZIP code" className="flex-1 min-w-0 text-[13px] bg-transparent focus:outline-none font-mono" style={{ color:"#111110" }} />
                  {zip && <button onClick={() => setZip("")} className="text-base leading-none" style={{ color:"#C0BBB5" }}>×</button>}
                </div>
                {zipActive && nearCount > 0 && <p className="text-[11px] font-semibold mt-2" style={{ color:"#16a34a" }}>{nearCount} items deliver to ZIP {zip}</p>}
                {zipActive && nearCount === 0 && <p className="text-[11px] mt-2" style={{ color:"#FF4500" }}>No items near ZIP {zip} yet</p>}
              </div>
            </div>

            <div className="p-6 border-t" style={{ borderColor:"#ECEAE5" }}>
              <button onClick={() => { onClearAll(); onClose(); }} className="w-full py-3 rounded-2xl text-[13px] font-bold border transition-all hover:bg-[#111110] hover:text-white hover:border-[#111110]" style={{ borderColor:"#D0CBC3", color:"#6B6763" }}>Clear all filters</button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

/* ─── Main Page ───────────────────────────────────────────────── */

export default function BrowsePage() {
  const { totalItems: cartItems } = useCart();
  const { zip, setZip } = useZip();

  const [category,    setCategory]    = useState("All");
  const [city,        setCity]        = useState("All");
  const [query,       setQuery]       = useState("");
  const [sortBy,      setSortBy]      = useState<"soonest"|"fee-low"|"fee-high"|"rating">("soonest");
  const [minFee,      setMinFee]      = useState("");
  const [maxFee,      setMaxFee]      = useState("");
  const [minRating,   setMinRating]   = useState(0);
  const [showRequest, setShowRequest] = useState(false);
  const [selected,    setSelected]    = useState<Listing | null>(null);
  const [filterOpen,  setFilterOpen]  = useState(false);

  const zipActive = zip.length >= 3;

  const catCount = useMemo(() => {
    const m: Record<string,number> = { All:0 };
    for (const p of LISTINGS) {
      const ok = city==="All" || p.from===city;
      if (!ok) continue;
      m["All"] = (m["All"]||0)+1;
      m[p.category] = (m[p.category]||0)+1;
    }
    return m;
  }, [city]);

  const cityCounts = useMemo(() => {
    const m: Record<string,number> = {};
    for (const p of LISTINGS) m[p.from] = (m[p.from]||0)+1;
    return m;
  }, []);

  const sorted = useMemo(() => {
    const f = LISTINGS.filter(p => {
      const catOk    = category==="All" || p.category===category;
      const cityOk   = city==="All" || p.from===city;
      const qOk      = !query || [p.productName,p.store,p.travelerName,p.from,p.deliverArea].some(s => s.toLowerCase().includes(query.toLowerCase()));
      const minOk    = !minFee || p.price>=+minFee;
      const maxOk    = !maxFee || p.price<=+maxFee;
      const ratingOk = p.travelerRating>=minRating;
      const zipOk    = !zipActive || p.deliverZips.some(pf => zip.startsWith(pf));
      return catOk && cityOk && qOk && minOk && maxOk && ratingOk && zipOk;
    });
    return [...f].sort((a,b) => {
      if (sortBy==="fee-low")  return a.price-b.price;
      if (sortBy==="fee-high") return b.price-a.price;
      if (sortBy==="rating")   return b.travelerRating-a.travelerRating;
      return parseDepartDate(a.date)-parseDepartDate(b.date);
    });
  }, [category, city, query, minFee, maxFee, minRating, zipActive, zip, sortBy]);

  const hasFilters  = category!=="All"||city!=="All"||query!==""||minFee!==""||maxFee!==""||minRating>0||zipActive;
  const nearCount   = zipActive ? LISTINGS.filter(p => p.deliverZips.some(pf => zip.startsWith(pf))).length : 0;
  const clearAll    = () => { setCategory("All");setCity("All");setQuery("");setMinFee("");setMaxFee("");setMinRating(0);setZip(""); };

  // Top 3 featured (top-rated + verified, for hero section)
  const featuredItems = useMemo(() =>
    LISTINGS.filter(p => p.verified && p.travelerRating >= 4.9).slice(0,3),
  []);

  const showFeatured = !hasFilters && sorted.length > 0;
  // Items below featured in grid
  const gridItems = showFeatured
    ? sorted.filter(p => !featuredItems.slice(0,3).map(f => f.id).includes(p.id))
    : sorted;

  return (
    <>
      <Navbar />

      {showRequest && <PostRequestModal onClose={() => setShowRequest(false)} />}
      <AnimatePresence>
        {selected && <ProductDetailModal product={selected} onClose={() => setSelected(null)} onViewRelated={p => setSelected(p)} />}
      </AnimatePresence>

      <FilterDrawer
        open={filterOpen} onClose={() => setFilterOpen(false)}
        category={category} setCategory={setCategory}
        city={city} setCity={setCity}
        minFee={minFee} setMinFee={setMinFee}
        maxFee={maxFee} setMaxFee={setMaxFee}
        minRating={minRating} setMinRating={setMinRating}
        zip={zip} setZip={setZip}
        onClearAll={clearAll}
        catCount={catCount} nearCount={nearCount} zipActive={zipActive}
      />

      <div style={{ minHeight:"100vh", paddingTop:64 }}>

        {/* ── Dark top section ── */}
        <div style={{ background:"#111110" }}>
          <Ticker />

          {/* Search + actions bar */}
          <div className="max-w-[1400px] mx-auto px-5 sm:px-8 py-4">
            <div className="flex items-center gap-3 flex-wrap">

              {/* Search */}
              <div className="flex-1 min-w-[200px] max-w-[460px] flex items-center gap-3 px-4 py-3 rounded-2xl" style={{ background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.1)" }}>
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 16 16" style={{ color:"rgba(255,255,255,0.3)" }}>
                  <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M10.5 10.5l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search products, stores, cities…"
                  className="flex-1 min-w-0 text-[13px] bg-transparent focus:outline-none"
                  style={{ color:"rgba(255,255,255,0.8)", caretColor:"#FF4500" }}/>
                {query && <button onClick={() => setQuery("")} className="text-base leading-none" style={{ color:"rgba(255,255,255,0.3)" }}>×</button>}
              </div>

              {/* Count */}
              <p className="text-[13px] hidden sm:block" style={{ color:"rgba(255,255,255,0.3)" }}>
                <span className="font-bold" style={{ color:"rgba(255,255,255,0.7)" }}>{sorted.length}</span> items
              </p>

              <div className="flex items-center gap-2 ml-auto">
                {/* Filters */}
                <button onClick={() => setFilterOpen(true)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-[13px] font-semibold transition-all border"
                  style={{ borderColor: hasFilters ? "#FF4500" : "rgba(255,255,255,0.12)", color: hasFilters ? "#FF4500" : "rgba(255,255,255,0.6)", background: hasFilters ? "rgba(255,69,0,0.1)" : "transparent" }}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.5"><path d="M2 4h12M4 8h8M6 12h4" strokeLinecap="round"/></svg>
                  Filters {hasFilters && `(${[category!=="All",city!=="All",query!=="",minFee!=="",maxFee!=="",minRating>0,zipActive].filter(Boolean).length})`}
                </button>

                {/* Sort */}
                <select value={sortBy} onChange={e => setSortBy(e.target.value as typeof sortBy)}
                  className="text-[13px] px-4 py-2.5 rounded-2xl border appearance-none focus:outline-none cursor-pointer transition-all"
                  style={{ borderColor:"rgba(255,255,255,0.12)", color:"rgba(255,255,255,0.6)", background:"transparent" }}>
                  <option value="soonest" style={{ background:"#111110" }}>Soonest</option>
                  <option value="fee-low" style={{ background:"#111110" }}>Fee ↑</option>
                  <option value="fee-high" style={{ background:"#111110" }}>Fee ↓</option>
                  <option value="rating" style={{ background:"#111110" }}>Top rated</option>
                </select>

                {/* Post request */}
                <button onClick={() => setShowRequest(true)}
                  className="px-4 py-2.5 rounded-2xl text-[13px] font-semibold transition-all hover:opacity-80 hidden sm:block"
                  style={{ background:"#FF4500", color:"white" }}>
                  + Request item
                </button>
              </div>
            </div>

            {/* City chips */}
            <div className="flex items-center gap-2 mt-4 overflow-x-auto scrollbar-none pb-1">
              <button onClick={() => setCity("All")}
                className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-[12px] font-semibold transition-all"
                style={city==="All"
                  ? { background:"white", color:"#111110" }
                  : { background:"rgba(255,255,255,0.08)", color:"rgba(255,255,255,0.5)", border:"1px solid rgba(255,255,255,0.1)" }}>
                🌍 All cities
                <span className="text-[10px] opacity-60">{LISTINGS.length}</span>
              </button>
              {Object.entries(CITY_META).map(([c, meta]) => (
                <button key={c} onClick={() => setCity(c)}
                  className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-[12px] font-semibold transition-all"
                  style={city===c
                    ? { background:"white", color:"#111110" }
                    : { background:"rgba(255,255,255,0.08)", color:"rgba(255,255,255,0.5)", border:"1px solid rgba(255,255,255,0.1)" }}>
                  {meta.flag} {c}
                  <span className="text-[10px] opacity-60">{cityCounts[c]||0}</span>
                </button>
              ))}
            </div>

            {/* Category pills */}
            <div className="flex items-center gap-2 mt-3 overflow-x-auto scrollbar-none pb-4">
              {CATEGORIES.map(cat => (
                <button key={cat} onClick={() => setCategory(cat)}
                  className="flex-shrink-0 px-3.5 py-1.5 rounded-full text-[11px] font-semibold transition-all"
                  style={category===cat
                    ? { background:"#FF4500", color:"white" }
                    : { background:"rgba(255,255,255,0.06)", color:"rgba(255,255,255,0.45)", border:"1px solid rgba(255,255,255,0.08)" }}>
                  {cat==="All" ? "All categories" : cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Content area ── */}
        <div style={{ background:"#F7F5F2" }}>
          <div className="max-w-[1400px] mx-auto px-5 sm:px-8 py-10">

            {/* Active filter chips */}
            {hasFilters && (
              <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }} className="flex items-center gap-2 flex-wrap mb-8">
                <span className="text-[11px]" style={{ color:"#A09C97" }}>Active filters:</span>
                {category!=="All" && <button onClick={() => setCategory("All")} className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-full border transition-all hover:bg-[#111110] hover:text-white hover:border-[#111110]" style={{ borderColor:"#D0CBC3", color:"#4B4844", background:"white" }}>{category} <span className="opacity-40">×</span></button>}
                {city!=="All" && <button onClick={() => setCity("All")} className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-full border transition-all hover:bg-[#111110] hover:text-white hover:border-[#111110]" style={{ borderColor:"#D0CBC3", color:"#4B4844", background:"white" }}>{CITY_META[city]?.flag} {city} <span className="opacity-40">×</span></button>}
                {query && <button onClick={() => setQuery("")} className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-full border transition-all hover:bg-[#111110] hover:text-white hover:border-[#111110]" style={{ borderColor:"#D0CBC3", color:"#4B4844", background:"white" }}>"{query}" <span className="opacity-40">×</span></button>}
                {minFee && <button onClick={() => setMinFee("")} className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-full border transition-all hover:bg-[#111110] hover:text-white hover:border-[#111110]" style={{ borderColor:"#D0CBC3", color:"#4B4844", background:"white" }}>Min ${minFee} <span className="opacity-40">×</span></button>}
                {maxFee && <button onClick={() => setMaxFee("")} className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-full border transition-all hover:bg-[#111110] hover:text-white hover:border-[#111110]" style={{ borderColor:"#D0CBC3", color:"#4B4844", background:"white" }}>Max ${maxFee} <span className="opacity-40">×</span></button>}
                {minRating>0 && <button onClick={() => setMinRating(0)} className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-full border transition-all hover:bg-[#111110] hover:text-white hover:border-[#111110]" style={{ borderColor:"#D0CBC3", color:"#4B4844", background:"white" }}>★ {minRating}+ <span className="opacity-40">×</span></button>}
                {zipActive && <button onClick={() => setZip("")} className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-full border transition-all hover:bg-[#111110] hover:text-white hover:border-[#111110]" style={{ borderColor:"#D0CBC3", color:"#4B4844", background:"white" }}>ZIP {zip} <span className="opacity-40">×</span></button>}
                <button onClick={clearAll} className="text-[11px] font-semibold underline underline-offset-2 transition-opacity hover:opacity-60" style={{ color:"#6B6763" }}>Clear all</button>
              </motion.div>
            )}

            {/* ── Featured editorial section ── */}
            <AnimatePresence>
              {showFeatured && featuredItems.length >= 2 && (
                <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }} transition={{ duration:0.5, ease:[0.22,1,0.36,1] }} className="mb-16">

                  {/* Section header */}
                  <div className="flex items-end justify-between mb-7">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="font-black" style={{ fontSize:26, color:"#111110", letterSpacing:"-0.035em", lineHeight:1 }}>
                          Featured drops
                        </h2>
                        {/* Live pill */}
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border"
                          style={{ background:"#F0FDF4", borderColor:"#BBF7D0" }}>
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                          <span className="text-[10px] font-black tracking-wide" style={{ color:"#16a34a" }}>LIVE</span>
                        </div>
                      </div>
                      <p className="text-[13px]" style={{ color:"#A09C97" }}>
                        Hand-picked · ★ 4.9+ rated · ID-verified travelers · Escrow-protected
                      </p>
                    </div>
                    {/* Trust badges row */}
                    <div className="hidden sm:flex items-center gap-3">
                      {["🛡️ Buyer protected","🔒 Escrow payment","⭐ Top rated"].map(t => (
                        <span key={t} className="text-[11px] font-semibold px-3 py-1.5 rounded-full"
                          style={{ background:"#F5F3F0", color:"#6B6763" }}>{t}</span>
                      ))}
                    </div>
                  </div>

                  {/* Editorial grid: tall left + 2 stacked right */}
                  <div className="grid gap-3 sm:gap-4" style={{ gridTemplateColumns:"5fr 7fr", gridTemplateRows:"repeat(2, 260px)" }}>

                    {/* Tall hero — spans both rows */}
                    <div className="row-span-2">
                      <HeroCard p={featuredItems[0]} onView={setSelected} variant="tall" />
                    </div>

                    {/* Wide top */}
                    <div>
                      <HeroCard p={featuredItems[1]} onView={setSelected} variant="wide" />
                    </div>

                    {/* Wide bottom */}
                    {featuredItems[2] && (
                      <div>
                        <HeroCard p={featuredItems[2]} onView={setSelected} variant="wide" />
                      </div>
                    )}
                  </div>

                  {/* Bottom separator */}
                  <div className="flex items-center gap-4 mt-10 mb-2">
                    <div className="flex-1 h-px" style={{ background:"#ECEAE5" }} />
                    <span className="text-[11px] font-semibold px-4 py-1.5 rounded-full border" style={{ color:"#A09C97", borderColor:"#ECEAE5", background:"white" }}>
                      All available listings ↓
                    </span>
                    <div className="flex-1 h-px" style={{ background:"#ECEAE5" }} />
                  </div>

                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Grid header ── */}
            <div className="flex items-baseline gap-3 mb-6">
              <h2 className="font-black text-[18px]" style={{ color:"#111110", letterSpacing:"-0.02em" }}>
                {showFeatured ? "All items" : "Results"}
              </h2>
              <span className="text-[13px]" style={{ color:"#A09C97" }}>
                <span className="font-bold" style={{ color:"#111110" }}>{sorted.length}</span> available
              </span>
            </div>

            {/* ── Product grid ── */}
            <AnimatePresence mode="wait">
              {sorted.length === 0 ? (
                <motion.div key="empty" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} className="py-32 text-center">
                  <p className="text-6xl mb-5">🔍</p>
                  <p className="font-black mb-3" style={{ fontSize:24, color:"#111110", letterSpacing:"-0.02em" }}>No items found</p>
                  <p className="text-[14px] mb-8" style={{ color:"#A09C97" }}>Adjust filters or post a custom request.</p>
                  <div className="flex items-center gap-3 justify-center flex-wrap">
                    {hasFilters && <button onClick={clearAll} className="px-6 py-3 rounded-full border-2 text-[13px] font-bold transition-all hover:bg-[#111110] hover:text-white hover:border-[#111110]" style={{ borderColor:"#111110", color:"#111110" }}>Clear filters</button>}
                    <button onClick={() => setShowRequest(true)} className="px-6 py-3 rounded-full text-[13px] font-bold text-white hover:opacity-90 transition-opacity" style={{ background:"#FF4500" }}>Post a request</button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key={`${category}-${city}-${query}-${sortBy}`}
                  initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} transition={{ duration:0.15 }}
                  className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-5 pb-28"
                >
                  {gridItems.map((p, i) => (
                    <ProductCard key={p.id} p={p} onView={setSelected} index={i} />
                  ))}

                  {/* Request card */}
                  <motion.div
                    initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
                    transition={{ duration:.4, delay: Math.min(gridItems.length*0.05,0.4), ease:[0.22,1,0.36,1] }}
                    onClick={() => setShowRequest(true)}
                    className="group rounded-3xl border-2 border-dashed flex flex-col items-center justify-center gap-4 cursor-pointer transition-all duration-200 min-h-[220px] p-6 hover:border-[#FF4500] hover:bg-[#FFF8F5]"
                    style={{ borderColor:"#D8D4CE" }}
                  >
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-colors group-hover:bg-[#FF4500]/10" style={{ background:"#F0EDE8" }}>✏️</div>
                    <div className="text-center">
                      <p className="text-[14px] font-bold mb-1" style={{ color:"#111110" }}>Don't see it?</p>
                      <p className="text-[12px] leading-relaxed" style={{ color:"#A09C97" }}>Post a request — travelers heading your way will reach out.</p>
                    </div>
                    <span className="text-[12px] font-bold group-hover:underline underline-offset-2" style={{ color:"#FF4500" }}>Post a request →</span>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Floating cart */}
      <AnimatePresence>
        {cartItems > 0 && (
          <motion.div
            initial={{ opacity:0, y:24, scale:.9 }} animate={{ opacity:1, y:0, scale:1 }} exit={{ opacity:0, y:24, scale:.9 }}
            transition={{ type:"spring", stiffness:400, damping:28 }}
            className="fixed bottom-24 right-6 z-40"
          >
            <Link href="/cart"
              className="flex items-center gap-3 px-7 py-4 rounded-full text-[12px] font-black tracking-[0.08em] uppercase shadow-2xl transition-all hover:scale-[1.03] active:scale-[0.97]"
              style={{ background:"linear-gradient(135deg,#FF4500,#FF6B35)", color:"white" }}>
              View cart
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black" style={{ background:"rgba(255,255,255,0.25)" }}>
                {cartItems}
              </span>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
}
