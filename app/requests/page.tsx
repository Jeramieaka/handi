"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

/* ─── Data ───────────────────────────────────────────────────── */

const CATEGORIES = ["All", "Collectibles", "Fashion", "Food & Snacks", "Beauty", "Home & Gifts", "Books & Stationery"];
const CITIES = ["All", "Tokyo", "New York", "Seoul", "Paris", "London", "Singapore"];

const REQUESTS = [
  {
    id: "r1",
    buyerEmoji: "👩", buyerName: "Emily R.", buyerRating: 4.9, buyerOrders: 12,
    category: "Collectibles", categoryEmoji: "🧸",
    item: "Pokémon Center Eevee Plush (Large, exclusive colorway)",
    store: "Pokémon Center Mega Tokyo",
    from: "Tokyo", to: "New York", toZip: "10001",
    budget: 55, note: "Must be the 2024 limited colorway, not the standard version. Original bag preferred.",
    posted: "2h ago", urgency: "high",
  },
  {
    id: "r2",
    buyerEmoji: "🧑", buyerName: "Marcus L.", buyerRating: 5.0, buyerOrders: 6,
    category: "Fashion", categoryEmoji: "🕶️",
    item: "Gentle Monster × Jennie collab sunglasses (any style)",
    store: "Gentle Monster Flagship, Garosu-gil",
    from: "Seoul", to: "Singapore", toZip: "238841",
    budget: 80, note: "Happy with any style from the collab. Open to multiple pairs if you can carry them.",
    posted: "5h ago", urgency: "high",
  },
  {
    id: "r3",
    buyerEmoji: "👱", buyerName: "Sophie T.", buyerRating: 4.8, buyerOrders: 21,
    category: "Food & Snacks", categoryEmoji: "🥐",
    item: "Ladurée Ispahan macarons (box of 12, assorted)",
    store: "Ladurée Champs-Élysées or Saint-Germain",
    from: "Paris", to: "Amsterdam", toZip: "1012 JS",
    budget: 65, note: "Please pick up within 2 days of travel — macarons don't keep well. Refrigerated carry is a bonus.",
    posted: "1d ago", urgency: "medium",
  },
  {
    id: "r4",
    buyerEmoji: "🧔", buyerName: "David K.", buyerRating: 4.7, buyerOrders: 4,
    category: "Beauty", categoryEmoji: "🧴",
    item: "COSRX Advanced Snail 96 Mucin Power Essence (3× 100ml)",
    store: "Olive Young — any branch",
    from: "Seoul", to: "London", toZip: "EC1A 1BB",
    budget: 50, note: "Three bottles if possible. Just the standard product, no gift sets needed.",
    posted: "1d ago", urgency: "low",
  },
  {
    id: "r5",
    buyerEmoji: "🧓", buyerName: "Aisha M.", buyerRating: 5.0, buyerOrders: 8,
    category: "Collectibles", categoryEmoji: "🎮",
    item: "Nintendo Switch Sports Bundle (Japanese box preferred)",
    store: "Nintendo Tokyo or Yodobashi Akihabara",
    from: "Tokyo", to: "Dubai", toZip: "Dubai",
    budget: 45, note: "Japanese packaging preferred but not required. Willing to pay more for a same-day pickup.",
    posted: "2d ago", urgency: "low",
  },
  {
    id: "r6",
    buyerEmoji: "👩", buyerName: "Léa D.", buyerRating: 4.9, buyerOrders: 17,
    category: "Home & Gifts", categoryEmoji: "🕯️",
    item: "Diptyque Baies candle (190g) + Figuier if available",
    store: "Diptyque Flagship, Saint-Germain-des-Prés",
    from: "Paris", to: "Toronto", toZip: "M5V 2T6",
    budget: 90, note: "Two candles if carry weight allows. Gift wrap if the store offers it.",
    posted: "3d ago", urgency: "low",
  },
  {
    id: "r7",
    buyerEmoji: "🧑‍💼", buyerName: "James P.", buyerRating: 4.6, buyerOrders: 3,
    category: "Books & Stationery", categoryEmoji: "📓",
    item: "Hobonichi Techo Planner 2025 (A6 original, English edition)",
    store: "Hobonichi Tokyo flagship or Loft Shibuya",
    from: "Tokyo", to: "Sydney", toZip: "2000",
    budget: 35, note: "English version only. If sold out, the Japanese edition is fine too.",
    posted: "3d ago", urgency: "low",
  },
  {
    id: "r8",
    buyerEmoji: "👱", buyerName: "Nina K.", buyerRating: 4.8, buyerOrders: 9,
    category: "Fashion", categoryEmoji: "👟",
    item: "New Balance 1906R 'Protection Pack' (Size US 7.5W or 8W)",
    store: "New Balance flagship or END. London",
    from: "London", to: "New York", toZip: "10014",
    budget: 60, note: "Size 7.5 preferred, 8 acceptable. Not available at US retail yet.",
    posted: "4d ago", urgency: "medium",
  },
];

const URGENCY_CONFIG = {
  high:   { label: "Urgent",  classes: "bg-red-50 text-red-600 border-red-200" },
  medium: { label: "Soon",    classes: "bg-amber-50 text-amber-600 border-amber-200" },
  low:    { label: "Flexible",classes: "bg-emerald-50 text-emerald-700 border-emerald-200" },
};

/* ─── Accept Modal ───────────────────────────────────────────── */

function AcceptModal({ req, onClose }: { req: typeof REQUESTS[0]; onClose: () => void }) {
  const [done, setDone] = useState(false);
  const [msg, setMsg] = useState("");

  if (done) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-ink/60 backdrop-blur-sm">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 22 }}
          className="card p-10 max-w-md w-full text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 500, damping: 20 }}
            className="text-7xl mb-6"
          >
            ✈️
          </motion.div>
          <h2 className="text-h1 font-bold text-ink mb-3">Request accepted!</h2>
          <p className="text-body text-muted mb-2">
            <span className="font-semibold text-ink">{req.buyerName}</span> has been notified and will message you to confirm details.
          </p>
          <p className="text-sm text-muted mb-8">You&apos;ll receive payment once they confirm receipt.</p>
          <div className="flex gap-3">
            <button onClick={onClose} className="btn-outline flex-1 py-3 text-sm">Back to requests</button>
            <Link href="/post-trip" className="btn-primary flex-1 py-3 text-sm text-center">Post your trip →</Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-ink/60 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 16 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="card p-8 max-w-lg w-full"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-h1 font-bold text-ink">Accept this request</h2>
            <p className="text-sm text-muted mt-1">Leave a message for the buyer — confirm details and availability.</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-warm flex items-center justify-center text-muted hover:text-ink text-xl flex-shrink-0 ml-4">×</button>
        </div>

        {/* Request summary */}
        <div className="bg-warm rounded-2xl p-4 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">{req.categoryEmoji}</span>
            <div>
              <p className="font-bold text-ink text-sm leading-snug">{req.item}</p>
              <p className="text-xs text-muted">{req.store}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted">
            <span>✈️ {req.from} → {req.to}</span>
            <span>💰 Budget up to <span className="font-bold text-ink">${req.budget}</span></span>
          </div>
        </div>

        {/* Message */}
        <div className="mb-6">
          <label className="block text-xs font-semibold text-muted mb-2 uppercase tracking-wide">Your message</label>
          <textarea
            rows={3}
            value={msg}
            onChange={e => setMsg(e.target.value)}
            placeholder={`Hi ${req.buyerName.split(" ")[0]}, I can carry this on my trip from ${req.from}. I travel on [date] and can do a meetup or delivery near [area].`}
            className="w-full border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all resize-none"
          />
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="btn-outline flex-1 py-3 text-sm">Cancel</button>
          <button
            onClick={() => setDone(true)}
            className="btn-primary flex-1 py-3 text-sm"
          >
            Send & accept ✈️
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Request Card ───────────────────────────────────────────── */

function RequestCard({ r, i, onAccept }: { r: typeof REQUESTS[0]; i: number; onAccept: () => void }) {
  const urgency = URGENCY_CONFIG[r.urgency as keyof typeof URGENCY_CONFIG];
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: i * 0.05 }}
      className="card p-6 flex flex-col gap-5"
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-full bg-warm flex items-center justify-center text-xl flex-shrink-0">
            {r.buyerEmoji}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-ink text-sm">{r.buyerName}</p>
            <div className="flex items-center gap-1.5 text-xs text-muted">
              <span className="text-amber-400">★</span>
              <span>{r.buyerRating} · {r.buyerOrders} orders</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${urgency.classes}`}>
            {urgency.label}
          </span>
          <span className="text-[11px] text-muted">{r.posted}</span>
        </div>
      </div>

      {/* Item */}
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-base">{r.categoryEmoji}</span>
          <p className="font-bold text-ink text-[15px] leading-snug">{r.item}</p>
        </div>
        <p className="text-xs text-muted pl-7">{r.store}</p>
      </div>

      {/* Route + budget */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="flex items-center gap-1.5 text-xs font-semibold bg-warm px-3 py-1.5 rounded-full text-ink">
          ✈️ {r.from} → {r.to}
          {r.toZip !== r.to && <span className="text-muted font-normal ml-1">({r.toZip})</span>}
        </span>
        <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-accent-light text-accent border border-accent/15">
          💰 Budget up to ${r.budget}
        </span>
      </div>

      {/* Notes */}
      {r.note && (
        <div className="bg-warm rounded-xl px-4 py-3">
          <p className="text-xs text-muted leading-relaxed">
            <span className="font-semibold text-ink">Note: </span>{r.note}
          </p>
        </div>
      )}

      {/* Accept */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        onClick={onAccept}
        className="btn-primary w-full py-3 text-sm justify-center"
      >
        Accept this request ✈️
      </motion.button>
    </motion.div>
  );
}

/* ─── Page ───────────────────────────────────────────────────── */

export default function RequestsPage() {
  const [category, setCategory] = useState("All");
  const [city, setCity] = useState("All");
  const [query, setQuery] = useState("");
  const [accepting, setAccepting] = useState<typeof REQUESTS[0] | null>(null);

  const filtered = REQUESTS.filter(r => {
    const catOk  = category === "All" || r.category === category;
    const cityOk = city === "All" || r.from === city;
    const qOk    = !query || [r.item, r.store, r.buyerName, r.from, r.to].some(s =>
      s.toLowerCase().includes(query.toLowerCase())
    );
    return catOk && cityOk && qOk;
  });

  return (
    <>
      <Navbar />
      <AnimatePresence>
        {accepting && <AcceptModal req={accepting} onClose={() => setAccepting(null)} />}
      </AnimatePresence>

      <main className="min-h-screen bg-stone">

        {/* ── Hero ── */}
        <div className="bg-ink border-b border-white/8 pt-20 pb-14 relative overflow-hidden" >
          {/* Glow */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse 70% 80% at 80% 50%, rgba(255,69,0,0.10), transparent)" }} />

          <div className="wrap relative z-10">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="eyebrow mb-4 text-accent"
            >
              For Travelers
            </motion.p>
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div>
                <div className="overflow-hidden mb-3">
                  <motion.h1
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.65, delay: 0.1, ease: [0.22,1,0.36,1] }}
                    className="text-d2 font-black text-white"
                  >
                    Buyer requests.
                  </motion.h1>
                </div>
                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.25 }}
                  className="text-body-lg text-white/40 max-w-xl"
                >
                  Buyers need something you can pick up on your route. Accept a request, earn the carry fee.
                </motion.p>
              </div>

              {/* Stats pills */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="flex flex-wrap gap-3"
              >
                {[
                  ["🔴", `${REQUESTS.filter(r=>r.urgency==="high").length} Urgent requests`],
                  ["💰", `Up to $${Math.max(...REQUESTS.map(r=>r.budget))} per carry`],
                  ["🌍", "5 cities covered"],
                ].map(([emoji, label]) => (
                  <div key={label as string} className="flex items-center gap-2 border border-white/10 rounded-full px-4 py-2"
                    style={{ background: "rgba(255,255,255,0.06)" }}>
                    <span className="text-sm">{emoji}</span>
                    <span className="text-[13px] font-medium text-white/60">{label}</span>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>

        {/* ── Category pills ── */}
        <div className="border-b border-border bg-white">
          <div className="wrap overflow-x-auto">
            <div className="flex gap-1 py-3 min-w-max">
              {CATEGORIES.map(c => (
                <button key={c} onClick={() => setCategory(c)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                    category === c ? "bg-accent text-white" : "text-muted hover:text-ink hover:bg-warm"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Main content ── */}
        <div className="wrap py-10">
          <div className="flex flex-col lg:flex-row gap-10">

            {/* Sidebar */}
            <aside className="lg:w-[200px] flex-shrink-0 space-y-7">
              {/* Search */}
              <div className="relative">
                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" fill="none" viewBox="0 0 16 16">
                  <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M10.5 10.5l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search…"
                  className="w-full pl-9 pr-4 py-3 text-sm bg-white border border-border rounded-xl focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all" />
              </div>

              {/* Pick-up city filter */}
              <div>
                <p className="text-xs font-black tracking-[0.18em] uppercase text-muted mb-3">Pick up from</p>
                <div className="space-y-0.5">
                  {CITIES.map(c => (
                    <button key={c} onClick={() => setCity(c)}
                      className={`w-full text-left text-sm font-medium px-3 py-2.5 rounded-xl transition-all ${
                        city === c ? "bg-accent-light text-accent font-semibold" : "text-ink hover:bg-warm"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* CTA for travelers */}
              <div className="card p-5 border-accent/20 bg-accent-light">
                <p className="text-xs font-black text-accent uppercase tracking-wider mb-2">Traveling soon?</p>
                <p className="text-sm text-muted mb-4">Post your trip so buyers can also find you directly.</p>
                <Link href="/post-trip" className="btn-primary text-sm w-full justify-center py-2.5">
                  Post a trip
                </Link>
              </div>
            </aside>

            {/* Request grid */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-muted">
                  <span className="font-bold text-ink">{filtered.length}</span> open {filtered.length === 1 ? "request" : "requests"}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Updated live
                </div>
              </div>

              <AnimatePresence mode="wait">
                {filtered.length === 0 ? (
                  <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="text-center py-32 text-muted">
                    <div className="text-6xl mb-5">🔍</div>
                    <p className="text-h1 text-ink font-bold mb-2">No requests found</p>
                    <p className="text-body mb-6">Try a different city or category.</p>
                  </motion.div>
                ) : (
                  <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                    {filtered.map((r, i) => (
                      <RequestCard key={r.id} r={r} i={i} onAccept={() => setAccepting(r)} />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
