"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useCart } from "@/components/CartContext";

const formatCard = (v: string) =>
  v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();

const formatExpiry = (v: string) => {
  const d = v.replace(/\D/g, "").slice(0, 4);
  if (d.length >= 3) return d.slice(0, 2) + " / " + d.slice(2);
  return d;
};

function cardBrand(num: string) {
  const n = num.replace(/\s/g, "");
  if (n.startsWith("4")) return "visa";
  if (n.startsWith("5") || n.startsWith("2")) return "mastercard";
  if (n.startsWith("3")) return "amex";
  return null;
}

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", handoff: "meetup",
    cardName: "", cardNumber: "", expiry: "", cvv: "",
  });

  const rawCard = form.cardNumber.replace(/\s/g, "");
  const rawExpiry = form.expiry.replace(/\s\/\s/g, "").replace(/\s/g, "");
  const isPaymentValid =
    form.cardName.trim().length > 1 &&
    rawCard.length === 16 &&
    rawExpiry.length === 4 &&
    form.cvv.length >= 3;

  const canPlace = form.name && form.email && isPaymentValid;

  const handlePlace = () => {
    clearCart();
    setDone(true);
  };

  const brand = cardBrand(form.cardNumber);

  if (done) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-stone flex items-center justify-center px-6">
          <div className="text-center max-w-md">
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 300, damping: 22 }}>
              <div className="text-8xl mb-7">🎉</div>
            </motion.div>
            <h2 className="text-d2 font-black text-ink mb-4">Order placed!</h2>
            <p className="text-body-lg text-muted mb-3">Your carry request has been sent to the traveler.</p>
            <p className="text-body text-muted mb-10">Payment is held in escrow — released only after you confirm receipt.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/membership" className="btn-primary px-10 py-4">Track your order</Link>
              <Link href="/browse" className="btn-outline px-10 py-4">Keep shopping</Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-stone flex items-center justify-center px-6">
          <div className="text-center">
            <p className="text-5xl mb-4">🛍️</p>
            <h2 className="text-h1 font-bold text-ink mb-3">Your cart is empty</h2>
            <Link href="/browse" className="btn-primary mt-4 inline-flex px-8 py-3">Browse items</Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-stone">
        <div className="bg-ink border-b border-white/8 pt-20 pb-12" >
          <div className="wrap">
            <p className="eyebrow mb-4 text-accent">Checkout</p>
            <h1 className="text-d2 font-black text-white">Almost there.</h1>
          </div>
        </div>

        <div className="wrap py-10">
          <div className="flex flex-col lg:flex-row gap-10">

            {/* Form */}
            <div className="flex-1 min-w-0 space-y-6">

              {/* Contact */}
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="card p-7">
                <p className="eyebrow mb-5">Your details</p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-muted mb-2 uppercase tracking-wide">Full name</label>
                    <input type="text" placeholder="Alex Johnson" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                      className="w-full border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted mb-2 uppercase tracking-wide">Email</label>
                    <input type="email" placeholder="alex@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                      className="w-full border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all" />
                  </div>
                </div>
              </motion.div>

              {/* Handoff */}
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.06 }} className="card p-7">
                <p className="eyebrow mb-5">Handoff method</p>
                <div className="space-y-3">
                  {[
                    { key: "meetup", icon: "🤝", title: "Direct meetup", desc: "Meet the traveler at an agreed location." },
                    { key: "door",   icon: "🚪", title: "Traveler delivers", desc: "Traveler drops off at your address." },
                    { key: "courier",icon: "🚗", title: "Courier relay", desc: "Use Grab or Uber to collect from the traveler." },
                  ].map(opt => (
                    <label key={opt.key} className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${
                      form.handoff === opt.key ? "border-accent bg-accent-light" : "border-border hover:bg-warm"
                    }`}>
                      <input type="radio" name="handoff" value={opt.key} checked={form.handoff === opt.key}
                        onChange={() => setForm({ ...form, handoff: opt.key })} className="mt-0.5 accent-accent" />
                      <div>
                        <span className="text-xl mr-2">{opt.icon}</span>
                        <span className="font-semibold text-ink text-sm">{opt.title}</span>
                        <p className="text-xs text-muted mt-0.5">{opt.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </motion.div>

              {/* Payment */}
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="card p-7">
                <p className="eyebrow mb-6">Payment</p>

                {/* Card preview */}
                <div className="relative rounded-2xl overflow-hidden mb-6 h-[190px] select-none"
                  style={{ background: "linear-gradient(135deg, #1a1a18 0%, #2d2d2b 50%, #1a1a18 100%)" }}>
                  {/* Shimmer pattern */}
                  <div className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: "radial-gradient(circle at 20% 80%, rgba(255,69,0,0.40) 0%, transparent 60%), radial-gradient(circle at 80% 20%, rgba(255,120,0,0.20) 0%, transparent 50%)" }}/>

                  {/* Chip */}
                  <div className="absolute top-5 left-6">
                    <div className="w-10 h-7 rounded-md border-2 border-white/20 bg-gradient-to-br from-yellow-300/60 to-yellow-500/40 flex items-center justify-center">
                      <div className="w-7 h-[14px] rounded-sm border border-yellow-400/60 flex">
                        <div className="w-1/2 border-r border-yellow-400/40"/>
                      </div>
                    </div>
                  </div>

                  {/* Brand logo */}
                  <div className="absolute top-5 right-6">
                    {brand === "visa" && (
                      <span className="text-white font-black text-xl italic tracking-tight" style={{ fontFamily: "serif" }}>VISA</span>
                    )}
                    {brand === "mastercard" && (
                      <div className="flex items-center -gap-2">
                        <div className="w-8 h-8 rounded-full bg-red-500 opacity-90"/>
                        <div className="w-8 h-8 rounded-full bg-orange-400 opacity-90 -ml-4"/>
                      </div>
                    )}
                    {!brand && (
                      <div className="flex items-center gap-1">
                        <div className="w-7 h-7 rounded-full bg-white/10"/>
                        <div className="w-7 h-7 rounded-full bg-white/10 -ml-3"/>
                      </div>
                    )}
                  </div>

                  {/* Card number */}
                  <div className="absolute bottom-[60px] left-6 right-6">
                    <p className="font-mono text-white text-lg tracking-[0.22em]">
                      {form.cardNumber || "•••• •••• •••• ••••"}
                    </p>
                  </div>

                  {/* Name + Expiry */}
                  <div className="absolute bottom-5 left-6 right-6 flex justify-between items-end">
                    <div>
                      <p className="text-[10px] text-white/30 uppercase tracking-widest mb-0.5">Cardholder</p>
                      <p className="text-sm font-semibold text-white tracking-wide uppercase truncate max-w-[160px]">
                        {form.cardName || "—"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-white/30 uppercase tracking-widest mb-0.5">Expires</p>
                      <p className="text-sm font-mono text-white">
                        {form.expiry || "MM / YY"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card form fields */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-muted mb-2 uppercase tracking-wide">Cardholder name</label>
                    <input
                      type="text"
                      placeholder="Alex Johnson"
                      value={form.cardName}
                      onChange={e => setForm({ ...form, cardName: e.target.value })}
                      className="w-full border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-muted mb-2 uppercase tracking-wide">Card number</label>
                    <div className="relative">
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="1234 5678 9012 3456"
                        value={form.cardNumber}
                        onChange={e => setForm({ ...form, cardNumber: formatCard(e.target.value) })}
                        className="w-full border border-border rounded-xl pl-4 pr-16 py-3 text-sm font-mono focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all tracking-wider"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                        <svg className="h-5 w-auto text-blue-700" viewBox="0 0 38 24" fill="none">
                          <rect width="38" height="24" rx="4" fill="#1434CB"/>
                          <text x="7" y="17" fontSize="10" fontFamily="serif" fontWeight="bold" fontStyle="italic" fill="white">VISA</text>
                        </svg>
                        <div className="flex -space-x-1.5">
                          <div className="w-5 h-5 rounded-full bg-red-500"/>
                          <div className="w-5 h-5 rounded-full bg-orange-400"/>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-muted mb-2 uppercase tracking-wide">Expiry</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="MM / YY"
                        value={form.expiry}
                        onChange={e => setForm({ ...form, expiry: formatExpiry(e.target.value) })}
                        className="w-full border border-border rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-muted mb-2 uppercase tracking-wide">CVV</label>
                      <div className="relative">
                        <input
                          type="password"
                          inputMode="numeric"
                          placeholder="•••"
                          maxLength={4}
                          value={form.cvv}
                          onChange={e => setForm({ ...form, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) })}
                          className="w-full border border-border rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-2 text-xs text-muted">
                  <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"/>
                  </svg>
                  256-bit SSL encryption. Your card info is never stored.
                </div>
              </motion.div>

              {/* Escrow notice */}
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.14 }}
                className="card p-6 border-accent/20 bg-accent-light">
                <p className="text-sm font-semibold text-accent mb-1">🔒 Escrow payment</p>
                <p className="text-sm text-muted">Your payment is held securely and only released to the traveler after you confirm receipt. You have 5 days to raise a dispute.</p>
              </motion.div>
            </div>

            {/* Summary */}
            <div className="lg:w-[320px] flex-shrink-0">
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
                className="card p-7 sticky top-24">
                <h2 className="text-h2 font-bold text-ink mb-6">Your order</h2>
                <div className="space-y-3 mb-6">
                  {items.map(item => (
                    <div key={item.id} className="flex gap-3 items-start">
                      <span className="text-xl">{item.categoryEmoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-ink leading-snug truncate">{item.productName}</p>
                        <p className="text-xs text-muted">{item.travelerName} · {item.from}</p>
                      </div>
                      <span className="text-sm font-bold text-ink flex-shrink-0">${(item.price * item.qty).toFixed(0)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-border pt-4 mb-6">
                  <div className="flex justify-between text-[17px] font-black text-ink">
                    <span>Total</span>
                    <span>${totalPrice.toFixed(0)}</span>
                  </div>
                </div>
                <button
                  onClick={handlePlace}
                  disabled={!canPlace}
                  className="btn-primary w-full py-4 justify-center text-[15px] disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Place order →
                </button>
                {!canPlace && (
                  <p className="text-center text-xs text-muted mt-3">
                    {!form.name || !form.email ? "Fill in your details above" : "Complete payment info to continue"}
                  </p>
                )}
                <Link href="/cart" className="block text-center text-sm text-muted hover:text-ink mt-4 transition-colors">
                  ← Back to cart
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
