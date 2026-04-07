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
      <main className="min-h-screen bg-stone">
        <div className="bg-ink border-b border-white/8 pt-20 pb-12" >
          <div className="wrap">
            <p className="eyebrow mb-4 text-accent">Your Cart</p>
            <h1 className="text-d2 font-black text-white">
              {totalItems === 0 ? "Nothing here yet." : `${totalItems} item${totalItems !== 1 ? "s" : ""}.`}
            </h1>
          </div>
        </div>

        <div className="wrap py-10">
          {totalItems === 0 ? (
            <div className="text-center py-32">
              <div className="text-7xl mb-6">🛍️</div>
              <h2 className="text-h1 font-bold text-ink mb-3">Your cart is empty</h2>
              <p className="text-body text-muted mb-8">Browse traveler offers and add items you want carried.</p>
              <Link href="/browse" className="btn-primary px-10 py-4">Browse items</Link>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-10">

              {/* Item list */}
              <div className="flex-1 min-w-0 space-y-4">
                <AnimatePresence>
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity:0, y:12 }}
                      animate={{ opacity:1, y:0 }}
                      exit={{ opacity:0, x:-40, height:0, marginBottom:0, paddingTop:0, paddingBottom:0 }}
                      transition={{ duration:0.3 }}
                      className="card p-5 flex items-center gap-5"
                    >
                      {/* Product emoji */}
                      <div className="w-16 h-16 rounded-2xl bg-warm flex items-center justify-center text-3xl flex-shrink-0">
                        {item.categoryEmoji}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-ink text-[15px] leading-snug mb-1">{item.productName}</p>
                        <p className="text-xs text-muted mb-2">{item.store}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-base">{item.travelerEmoji}</span>
                          <span className="text-xs text-muted">{item.travelerName} · {item.from} · ✈️ {item.date}</span>
                        </div>
                      </div>

                      {/* Qty + price */}
                      <div className="flex items-center gap-4 flex-shrink-0">
                        <div className="flex items-center gap-1 bg-warm border border-border rounded-xl overflow-hidden">
                          <button onClick={() => updateQty(item.id, item.qty - 1)}
                            className="w-8 h-8 flex items-center justify-center text-muted hover:text-ink transition-colors font-bold text-lg">
                            −
                          </button>
                          <span className="w-6 text-center text-sm font-semibold text-ink">{item.qty}</span>
                          <button onClick={() => updateQty(item.id, Math.min(item.maxQty, item.qty + 1))}
                            className="w-8 h-8 flex items-center justify-center text-muted hover:text-ink transition-colors font-bold text-lg">
                            +
                          </button>
                        </div>

                        <p className="font-black text-ink text-[18px] w-16 text-right">
                          ${(item.price * item.qty).toFixed(0)}
                        </p>

                        <button onClick={() => removeItem(item.id)}
                          className="w-8 h-8 flex items-center justify-center text-muted hover:text-accent transition-colors rounded-full hover:bg-accent-light">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
                            <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                          </svg>
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                <Link href="/browse" className="inline-flex items-center gap-2 text-sm text-accent font-semibold hover:underline mt-2">
                  ← Continue shopping
                </Link>
              </div>

              {/* Order summary */}
              <div className="lg:w-[320px] flex-shrink-0">
                <div className="card p-7 sticky top-24">
                  <h2 className="text-h2 font-bold text-ink mb-6">Order summary</h2>

                  <div className="space-y-3 mb-6">
                    {items.map(item => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-muted truncate max-w-[180px]">{item.productName} ×{item.qty}</span>
                        <span className="font-semibold text-ink flex-shrink-0 ml-2">${(item.price * item.qty).toFixed(0)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-border pt-4 mb-6 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted">Carry fees subtotal</span>
                      <span className="font-semibold text-ink">${totalPrice.toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted">Platform fee</span>
                      <span className="font-semibold text-ink">$0</span>
                    </div>
                    <div className="flex justify-between text-[17px] font-black text-ink pt-2 border-t border-border mt-2">
                      <span>Total</span>
                      <span>${totalPrice.toFixed(0)}</span>
                    </div>
                  </div>

                  <Link href="/checkout" className="btn-primary w-full py-4 justify-center text-[15px]">
                    Proceed to checkout →
                  </Link>

                  <div className="mt-5 space-y-2">
                    {["🔒 Secure payment via escrow","✅ Buyer protection on every order","⚡ Payment only released on delivery"].map(t => (
                      <p key={t} className="text-xs text-muted">{t}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
