"use client";

import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useCart } from "@/components/CartContext";

export default function CartPage() {
  const { items, updateQty, removeItem, totalItems, totalPrice } = useCart();

  return (
    <>
      <Navbar />
      <main className="min-h-screen" style={{ background: "#F7F5F0" }}>

        {/* ── Hero ── */}
        <div className="pt-[64px]">
          <div className="wrap pt-14 pb-10 border-b border-border">
            <p className="text-[11px] font-bold tracking-[0.18em] uppercase text-muted mb-3">Your Cart</p>
            <h1 className="text-[clamp(2.2rem,5vw,3.4rem)] font-black text-ink tracking-[-0.04em] leading-[1.05]">
              {totalItems === 0 ? "Nothing here yet." : (
                <>{totalItems} item{totalItems !== 1 ? "s" : ""}<span className="text-accent">.</span></>
              )}
            </h1>
          </div>
        </div>

        {totalItems === 0 ? (
          /* ── Empty state ── */
          <div className="wrap py-16">
            <div className="flex flex-col items-center text-center mb-16">
              <div className="w-20 h-20 rounded-3xl bg-white border border-border flex items-center justify-center text-4xl mb-8 shadow-soft">
                🛍️
              </div>
              <h2 className="text-2xl font-bold text-ink mb-3">Your cart is empty</h2>
              <p className="text-muted mb-8 max-w-xs">Browse traveler offers and add items you want carried back for you.</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/browse" className="btn-primary px-10 py-4">Browse items</Link>
                <Link href="/requests" className="btn-outline px-10 py-4">Post a custom request</Link>
              </div>
            </div>

            {/* Popular right now */}
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-muted mb-6 text-center">Popular right now</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
                {[
                  { emoji:"🧸", name:"Pokémon Center Pikachu Plush", store:"Pokémon Center Tokyo", fee:18, route:"Tokyo → Worldwide" },
                  { emoji:"🧴", name:"COSRX Snail Mucin Essence", store:"Olive Young Seoul", fee:16, route:"Seoul → Worldwide" },
                  { emoji:"🥐", name:"Ladurée Macaron Box (12 pcs)", store:"Ladurée Champs-Élysées", fee:38, route:"Paris → Europe" },
                ].map(item => (
                  <Link key={item.name} href="/browse"
                    className="flex gap-3 p-4 bg-white border border-border rounded-2xl hover:border-accent/30 hover:shadow-card transition-all group">
                    <div className="w-12 h-12 rounded-xl bg-warm flex items-center justify-center text-2xl flex-shrink-0">{item.emoji}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-bold text-ink leading-snug line-clamp-2 group-hover:text-accent transition-colors">{item.name}</p>
                      <p className="text-[10px] text-muted mt-1">{item.route}</p>
                      <p className="text-[11px] font-bold text-accent mt-0.5">Carry fee · ${item.fee}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="wrap py-12">
            <div className="flex flex-col lg:flex-row gap-10 items-start">

              {/* ── Left: Item list ── */}
              <div className="flex-1 min-w-0">

                {/* Column headers */}
                <div className="hidden sm:grid grid-cols-[1fr_auto_auto_auto] gap-4 items-center px-1 mb-4">
                  <p className="text-[11px] font-bold tracking-[0.16em] uppercase text-muted">Item</p>
                  <p className="text-[11px] font-bold tracking-[0.16em] uppercase text-muted w-28 text-center">Qty</p>
                  <p className="text-[11px] font-bold tracking-[0.16em] uppercase text-muted w-16 text-right">Price</p>
                  <div className="w-8" />
                </div>

                <AnimatePresence mode="popLayout">
                  {items.map((item, idx) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -24, transition: { duration: 0.2 } }}
                      transition={{ duration: 0.35, delay: idx * 0.04, ease: [0.22, 1, 0.36, 1] }}
                      className="group relative bg-white border border-border rounded-2xl mb-3 overflow-hidden"
                      style={{ boxShadow: "0 1px 3px rgba(12,12,11,0.05)" }}
                    >
                      {/* Thin accent line on left edge */}
                      <div className="absolute left-0 top-4 bottom-4 w-[3px] rounded-full bg-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      <div className="p-5 sm:p-6 grid grid-cols-[auto_1fr] sm:grid-cols-[auto_1fr_auto_auto_auto] gap-4 sm:gap-5 items-center">

                        {/* Emoji thumbnail */}
                        <div className="w-16 h-16 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center text-3xl flex-shrink-0"
                          style={{ background: "linear-gradient(135deg, #F0EDE8 0%, #E8E4DE 100%)" }}>
                          {item.categoryEmoji}
                        </div>

                        {/* Info */}
                        <div className="min-w-0">
                          <p className="font-bold text-ink text-[15px] leading-snug mb-1 truncate pr-2">{item.productName}</p>
                          <p className="text-[12px] text-muted mb-2">{item.store}</p>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                            <span className="flex items-center gap-1.5 text-[11px] text-muted">
                              <span>{item.travelerEmoji}</span>
                              <span>{item.travelerName} · {item.from}</span>
                            </span>
                            <span className="text-[11px] font-semibold text-accent">
                              ✈️ Departs {item.date}
                            </span>
                          </div>
                        </div>

                        {/* Qty stepper */}
                        <div className="col-span-2 sm:col-span-1 flex sm:justify-center">
                          <div className="flex items-center gap-0 rounded-xl border border-border overflow-hidden bg-stone/60">
                            <button
                              onClick={() => updateQty(item.id, item.qty - 1)}
                              className="w-9 h-9 flex items-center justify-center text-muted hover:text-ink hover:bg-warm transition-all font-bold text-base"
                            >
                              −
                            </button>
                            <span className="w-9 text-center text-[13px] font-bold text-ink border-x border-border">{item.qty}</span>
                            <button
                              onClick={() => updateQty(item.id, Math.min(item.maxQty, item.qty + 1))}
                              className="w-9 h-9 flex items-center justify-center text-muted hover:text-ink hover:bg-warm transition-all font-bold text-base"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* Price */}
                        <p className="hidden sm:block font-black text-ink text-[18px] w-16 text-right tabular-nums">
                          ${(item.price * item.qty).toFixed(0)}
                        </p>

                        {/* Remove */}
                        <button
                          onClick={() => removeItem(item.id)}
                          className="hidden sm:flex w-8 h-8 items-center justify-center rounded-full text-border hover:text-accent hover:bg-accent/8 transition-all"
                          aria-label="Remove"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 14 14">
                            <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                          </svg>
                        </button>

                        {/* Mobile: price + remove row */}
                        <div className="sm:hidden col-span-2 flex items-center justify-between pt-1 border-t border-border/50">
                          <p className="font-black text-ink text-[17px] tabular-nums">${(item.price * item.qty).toFixed(0)}</p>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-[12px] text-muted hover:text-accent transition-colors font-medium"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                <Link href="/browse"
                  className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-muted hover:text-ink transition-colors mt-4 group">
                  <svg className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 14 14">
                    <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Continue shopping
                </Link>
              </div>

              {/* ── Right: Order summary ── */}
              <div className="lg:w-[340px] w-full flex-shrink-0">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="sticky top-[88px]"
                >
                  {/* Summary card */}
                  <div className="bg-white border border-border rounded-2xl overflow-hidden"
                    style={{ boxShadow: "0 4px 24px rgba(12,12,11,0.07), 0 1px 3px rgba(12,12,11,0.05)" }}>

                    {/* Card header */}
                    <div className="px-7 pt-7 pb-5 border-b border-border">
                      <p className="text-[11px] font-bold tracking-[0.16em] uppercase text-muted mb-1">Order summary</p>
                      <p className="text-2xl font-black text-ink">${totalPrice.toFixed(0)} <span className="text-sm font-medium text-muted">USD</span></p>
                    </div>

                    {/* Line items */}
                    <div className="px-7 py-5 space-y-3 border-b border-border">
                      {items.map(item => (
                        <div key={item.id} className="flex justify-between items-start gap-3 text-sm">
                          <span className="text-muted leading-snug line-clamp-1 flex-1">{item.productName} <span className="text-muted/60">×{item.qty}</span></span>
                          <span className="font-semibold text-ink tabular-nums flex-shrink-0">${(item.price * item.qty).toFixed(0)}</span>
                        </div>
                      ))}
                    </div>

                    {/* Totals */}
                    <div className="px-7 py-5 space-y-2.5 border-b border-border">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted">Subtotal</span>
                        <span className="font-semibold text-ink tabular-nums">${totalPrice.toFixed(0)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted">Platform fee</span>
                        <span className="font-semibold text-emerald-600 text-xs bg-emerald-50 px-2 py-0.5 rounded-full">No charge</span>
                      </div>
                      <div className="flex justify-between items-baseline pt-2 border-t border-border mt-2">
                        <span className="font-bold text-ink">Total</span>
                        <span className="text-[22px] font-black text-ink tabular-nums">${totalPrice.toFixed(0)}</span>
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="px-7 py-6">
                      <Link href="/checkout"
                        className="w-full flex items-center justify-center gap-2 rounded-2xl py-4 text-[15px] font-bold text-white transition-all active:scale-[0.98]"
                        style={{ background: "linear-gradient(135deg, #FF5214 0%, #D93A00 100%)", boxShadow: "0 4px 16px rgba(255,69,0,0.30)" }}
                      >
                        Proceed to checkout
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
                          <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </Link>
                    </div>
                  </div>

                  {/* Trust block — below card */}
                  <div className="mt-4 rounded-2xl border border-border bg-white/60 backdrop-blur-sm px-6 py-5 space-y-3">
                    {[
                      { icon: "🔒", label: "Escrow payment", sub: "Funds held until you confirm receipt" },
                      { icon: "🛡️", label: "Buyer protection", sub: "5-day dispute window on every order" },
                      { icon: "✈️", label: "Authentic items", sub: "Sourced directly from stores abroad" },
                    ].map(({ icon, label, sub }) => (
                      <div key={label} className="flex items-start gap-3">
                        <span className="text-base flex-shrink-0 mt-0.5">{icon}</span>
                        <div>
                          <p className="text-[12px] font-bold text-ink">{label}</p>
                          <p className="text-[11px] text-muted">{sub}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>

            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
