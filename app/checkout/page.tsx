"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useCart } from "@/components/CartContext";

const formatCard = (v: string) => {
  const digits = v.replace(/\D/g, "").slice(0, 16);
  return digits.match(/.{1,4}/g)?.join(" ") ?? digits;
};

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

const inputCls = "w-full border border-border rounded-xl px-4 py-3.5 text-sm bg-white focus:outline-none focus:border-ink focus:ring-2 focus:ring-ink/6 transition-all placeholder:text-muted/40";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", handoff: "meetup",
    cardName: "", cardNumber: "", expiry: "", cvv: "",
  });
  const [selectedMeetupLocation, setSelectedMeetupLocation] = useState("");

  // Collect unique meetup locations from all cart items
  const allMeetupLocations = Array.from(new Set(
    items.flatMap(item => item.meetupLocations ?? [])
  ));

  const DELIVERY_FEE = 5;
  const deliveryFee  = form.handoff === "door" ? DELIVERY_FEE : 0;
  const grandTotal   = totalPrice + deliveryFee;

  const rawCard   = form.cardNumber.replace(/\s/g, "");
  const rawExpiry = form.expiry.replace(/\s\/\s/g, "").replace(/\s/g, "");
  const isPaymentValid =
    form.cardName.trim().length > 1 &&
    rawCard.length === 16 &&
    rawExpiry.length === 4 &&
    form.cvv.length >= 3;

  const [cvvFocused, setCvvFocused] = useState(false);
  const meetupLocationRequired = form.handoff === "meetup" && allMeetupLocations.length > 0;
  const canPlace = form.name && form.email && isPaymentValid &&
    (!meetupLocationRequired || !!selectedMeetupLocation);
  const brand    = cardBrand(form.cardNumber);

  const handlePlace = () => { clearCart(); setDone(true); };

  /* ── Success screen ── */
  if (done) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-stone flex items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-center max-w-md w-full"
          >
            {/* Checkmark circle */}
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
              className="w-20 h-20 rounded-full bg-ink flex items-center justify-center mx-auto mb-8"
            >
              <svg className="w-9 h-9 text-white" fill="none" viewBox="0 0 32 32">
                <path d="M7 16l6 6 12-12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.div>

            <h2 className="text-[2.4rem] font-black text-ink tracking-[-0.04em] mb-3">Order placed.</h2>
            <p className="text-muted mb-10 leading-relaxed">
              Your carry request has been sent to the traveler.<br/>
              Payment is held in escrow until you confirm receipt.
            </p>

            <div className="text-left bg-white border border-border rounded-2xl divide-y divide-border mb-10"
              style={{ boxShadow: "0 1px 4px rgba(12,12,11,0.06)" }}>
              {[
                { label: "Check your email", sub: "Your traveler will confirm within 1–2 hours" },
                { label: "Payment is secure", sub: "Funds released only after you confirm delivery" },
                { label: "Need help?",        sub: "5-day dispute window — our team responds within 24 hrs" },
              ].map(({ label, sub }) => (
                <div key={label} className="flex items-start gap-4 px-6 py-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-ink">{label}</p>
                    <p className="text-xs text-muted mt-0.5">{sub}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/membership" className="btn-primary px-10 py-4">Track your order</Link>
              <Link href="/browse" className="btn-outline px-10 py-4">Keep shopping</Link>
            </div>
          </motion.div>
        </main>
        <Footer />
      </>
    );
  }

  /* ── Empty cart ── */
  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-stone flex items-center justify-center px-6">
          <div className="text-center">
            <h2 className="text-h1 font-bold text-ink mb-3">Your cart is empty</h2>
            <Link href="/browse" className="btn-primary mt-4 inline-flex px-8 py-3">Browse items</Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  /* ── Main checkout ── */
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-stone">

        {/* Header */}
        <div className="pt-[64px]">
          <div className="wrap pt-14 pb-10 border-b border-border">
            <p className="text-[11px] font-bold tracking-[0.18em] uppercase text-muted mb-3">Checkout</p>
            <h1 className="text-[clamp(2.2rem,5vw,3.2rem)] font-black text-ink tracking-[-0.04em] leading-[1.05]">
              Almost there<span className="text-accent">.</span>
            </h1>
          </div>
        </div>

        <div className="wrap py-12">
          <div className="flex flex-col lg:flex-row gap-12 items-start">

            {/* ── Left: Forms ── */}
            <div className="flex-1 min-w-0 space-y-5">

              {/* Step 1 — Contact */}
              <motion.section
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: [0.22,1,0.36,1] }}
                className="bg-white border border-border rounded-2xl p-7"
                style={{ boxShadow: "0 1px 3px rgba(12,12,11,0.05)" }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-6 h-6 rounded-full bg-ink text-white text-[11px] font-black flex items-center justify-center flex-shrink-0">1</span>
                  <p className="text-[11px] font-bold tracking-[0.16em] uppercase text-muted">Your details</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-muted uppercase tracking-[0.1em] mb-2">Full name</label>
                    <input type="text" placeholder="Alex Johnson" value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })} className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-muted uppercase tracking-[0.1em] mb-2">Email address</label>
                    <input type="email" placeholder="alex@email.com" value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })} className={inputCls} />
                    <p className="text-[11px] text-muted mt-2 leading-relaxed">
                      Your traveler will confirm via email — usually within 2 hours.
                    </p>
                  </div>
                </div>
              </motion.section>

              {/* Step 2 — Handoff */}
              <motion.section
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.07, ease: [0.22,1,0.36,1] }}
                className="bg-white border border-border rounded-2xl p-7"
                style={{ boxShadow: "0 1px 3px rgba(12,12,11,0.05)" }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-6 h-6 rounded-full bg-ink text-white text-[11px] font-black flex items-center justify-center flex-shrink-0">2</span>
                  <p className="text-[11px] font-bold tracking-[0.16em] uppercase text-muted">Handoff method</p>
                </div>
                <div className="space-y-2.5">
                  {[
                    { key: "meetup",  icon: <MeetupIcon />,  title: "Direct meetup",     desc: "Meet the traveler at an agreed location." },
                    { key: "door",    icon: <DoorIcon />,    title: "Traveler delivers",  desc: "Traveler drops off at your address." },
                    { key: "courier", icon: <CourierIcon />, title: "Courier relay",      desc: "Use Grab or Uber to collect from the traveler." },
                  ].map(opt => {
                    const active = form.handoff === opt.key;
                    return (
                      <label key={opt.key}
                        className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                          active ? "border-ink bg-ink/[0.03]" : "border-border hover:bg-warm"
                        }`}
                      >
                        <input type="radio" name="handoff" value={opt.key} checked={active}
                          onChange={() => setForm({ ...form, handoff: opt.key })} className="sr-only" />
                        <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                          active ? "border-ink" : "border-border"
                        }`}>
                          {active && <div className="w-2 h-2 rounded-full bg-ink" />}
                        </div>
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                          active ? "bg-ink text-white" : "bg-warm text-muted"
                        }`}>
                          {opt.icon}
                        </div>
                        <div>
                          <p className={`text-sm font-semibold transition-colors ${active ? "text-ink" : "text-muted"}`}>{opt.title}</p>
                          <p className="text-xs text-muted mt-0.5">{opt.desc}</p>
                        </div>
                      </label>
                    );
                  })}
                </div>

                {/* Meetup location picker */}
                <AnimatePresence>
                  {form.handoff === "meetup" && allMeetupLocations.length > 0 && (
                    <motion.div
                      key="meetup-picker"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 p-4 bg-stone border border-border rounded-xl">
                        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted mb-3">Select meetup location</p>
                        <div className="space-y-2">
                          {allMeetupLocations.map(loc => {
                            const isSelected = selectedMeetupLocation === loc;
                            return (
                              <label key={loc}
                                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-200 ${
                                  isSelected ? "border-ink bg-white" : "border-border bg-white hover:bg-warm"
                                }`}
                              >
                                <input type="radio" name="meetupLocation" value={loc}
                                  checked={isSelected}
                                  onChange={() => setSelectedMeetupLocation(loc)}
                                  className="sr-only" />
                                <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                                  isSelected ? "border-ink" : "border-border"
                                }`}>
                                  {isSelected && <div className="w-2 h-2 rounded-full bg-ink" />}
                                </div>
                                <svg className="w-3.5 h-3.5 text-accent flex-shrink-0" fill="none" viewBox="0 0 14 14">
                                  <path d="M7 1C4.8 1 3 2.8 3 5c0 3 4 8 4 8s4-5 4-8c0-2.2-1.8-4-4-4z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                                  <circle cx="7" cy="5" r="1.2" fill="currentColor"/>
                                </svg>
                                <span className="text-sm text-ink">{loc}</span>
                              </label>
                            );
                          })}
                        </div>
                        {!selectedMeetupLocation && (
                          <p className="text-[11px] text-muted mt-2">Please select a meetup point to continue.</p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.section>

              {/* Step 3 — Payment */}
              <motion.section
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.13, ease: [0.22,1,0.36,1] }}
                className="bg-white border border-border rounded-2xl p-7"
                style={{ boxShadow: "0 1px 3px rgba(12,12,11,0.05)" }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-6 h-6 rounded-full bg-ink text-white text-[11px] font-black flex items-center justify-center flex-shrink-0">3</span>
                  <p className="text-[11px] font-bold tracking-[0.16em] uppercase text-muted">Payment</p>
                </div>

                {/* Escrow notice */}
                <div className="flex items-center gap-3 mb-6 px-4 py-3 rounded-xl bg-stone border border-border">
                  <svg className="w-4 h-4 text-ink flex-shrink-0" fill="none" viewBox="0 0 20 20">
                    <path d="M10 2L3 6v5c0 4 3.1 7.6 7 8.9C13.9 18.6 17 15 17 11V6l-7-4z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <p className="text-xs text-muted">Payment held in escrow — released only after you confirm receipt.</p>
                </div>

                {/* Card 3D flip */}
                <div className="mb-6 select-none" style={{ perspective: "1200px" }}>
                  <motion.div
                    animate={{ rotateY: cvvFocused ? 180 : 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    style={{ transformStyle: "preserve-3d", position: "relative", height: 220 }}
                  >
                    {/* Front */}
                    <div className="absolute inset-0 rounded-2xl overflow-hidden"
                      style={{ backfaceVisibility: "hidden", background: "linear-gradient(135deg, #1a1a18 0%, #2d2d2b 50%, #1a1a18 100%)" }}>
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
                      {/* Brand */}
                      <div className="absolute top-5 right-6">
                        {brand === "visa" && <span className="text-white font-black text-xl italic tracking-tight" style={{ fontFamily: "serif" }}>VISA</span>}
                        {brand === "mastercard" && (
                          <div className="flex"><div className="w-8 h-8 rounded-full bg-red-500 opacity-90"/><div className="w-8 h-8 rounded-full bg-orange-400 opacity-90 -ml-4"/></div>
                        )}
                        {!brand && (
                          <div className="flex"><div className="w-7 h-7 rounded-full bg-white/10"/><div className="w-7 h-7 rounded-full bg-white/10 -ml-3"/></div>
                        )}
                      </div>
                      {/* Number */}
                      <div className="absolute bottom-[62px] left-6 right-6">
                        <p className="font-mono text-white text-lg tracking-[0.22em]">{form.cardNumber || "•••• •••• •••• ••••"}</p>
                      </div>
                      {/* Name + Expiry */}
                      <div className="absolute bottom-5 left-6 right-6 flex justify-between items-end">
                        <div>
                          <p className="text-[10px] text-white/30 uppercase tracking-widest mb-0.5">Cardholder</p>
                          <p className="text-sm font-semibold text-white tracking-wide uppercase truncate max-w-[160px]">{form.cardName || "—"}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-white/30 uppercase tracking-widest mb-0.5">Expires</p>
                          <p className="text-sm font-mono text-white">{form.expiry || "MM / YY"}</p>
                        </div>
                      </div>
                    </div>

                    {/* Back */}
                    <div className="absolute inset-0 rounded-2xl overflow-hidden"
                      style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)", background: "linear-gradient(135deg, #1a1a18 0%, #2d2d2b 50%, #1a1a18 100%)" }}>
                      {/* Magnetic stripe */}
                      <div className="absolute top-8 left-0 right-0 h-11 bg-black/80" />
                      {/* Signature + CVV */}
                      <div className="absolute left-6 right-6 top-[82px] flex items-center gap-3">
                        <div className="flex-1 h-9 rounded flex items-center px-3"
                          style={{ background: "repeating-linear-gradient(90deg, #e8e4dc 0px, #e8e4dc 1px, #f0ece4 1px, #f0ece4 8px)" }}>
                          <span className="text-[11px] text-stone-400 italic">Authorized Signature</span>
                        </div>
                        <div className="flex-shrink-0 text-center">
                          <p className="text-[9px] text-white/30 uppercase tracking-widest mb-1">CVV</p>
                          <div className="w-14 h-9 rounded bg-white/90 flex items-center justify-center">
                            <p className="font-mono text-stone-800 text-[15px] font-bold tracking-wider">
                              {form.cvv ? "•".repeat(form.cvv.length) : "•••"}
                            </p>
                          </div>
                        </div>
                      </div>
                      {/* Brand faded */}
                      <div className="absolute bottom-5 right-6 opacity-30">
                        {brand === "visa" && <span className="text-white font-black text-lg italic" style={{ fontFamily: "serif" }}>VISA</span>}
                        {brand === "mastercard" && (
                          <div className="flex"><div className="w-7 h-7 rounded-full bg-red-500"/><div className="w-7 h-7 rounded-full bg-orange-400 -ml-3"/></div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Fields */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-muted uppercase tracking-[0.1em] mb-2">Cardholder name</label>
                    <input type="text" placeholder="As it appears on your card" value={form.cardName}
                      onChange={e => setForm({ ...form, cardName: e.target.value })} className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-muted uppercase tracking-[0.1em] mb-2">Card number</label>
                    <div className="relative">
                      <input type="text" inputMode="numeric" placeholder="1234 5678 9012 3456"
                        value={form.cardNumber}
                        onChange={e => setForm({ ...form, cardNumber: formatCard(e.target.value) })}
                        className={`${inputCls} font-mono tracking-wider pr-16`} />
                      <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                        <svg className="h-5 w-auto" viewBox="0 0 38 24" fill="none">
                          <rect width="38" height="24" rx="4" fill="#1434CB"/>
                          <text x="7" y="17" fontSize="10" fontFamily="serif" fontWeight="bold" fontStyle="italic" fill="white">VISA</text>
                        </svg>
                        <div className="flex -space-x-1.5">
                          <div className="w-5 h-5 rounded-full bg-red-500" />
                          <div className="w-5 h-5 rounded-full bg-amber-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-muted uppercase tracking-[0.1em] mb-2">Expiry</label>
                      <input type="text" inputMode="numeric" placeholder="MM / YY"
                        value={form.expiry}
                        onChange={e => setForm({ ...form, expiry: formatExpiry(e.target.value) })}
                        className={`${inputCls} font-mono`} />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-muted uppercase tracking-[0.1em] mb-2">CVV</label>
                      <input type="password" inputMode="numeric" placeholder="•••" maxLength={4}
                        value={form.cvv}
                        onChange={e => setForm({ ...form, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) })}
                        onFocus={() => setCvvFocused(true)}
                        onBlur={() => setCvvFocused(false)}
                        className={`${inputCls} font-mono`} />
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 text-muted flex-shrink-0" fill="none" viewBox="0 0 16 16">
                    <path d="M8 1L2 4v4c0 3.2 2.5 6.1 6 7 3.5-.9 6-3.8 6-7V4l-6-3z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <p className="text-[11px] text-muted">256-bit SSL encryption. Your card info is never stored.</p>
                </div>
              </motion.section>
            </div>

            {/* ── Right: Order summary ── */}
            <div className="lg:w-[340px] w-full flex-shrink-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1, ease: [0.22,1,0.36,1] }}
                className="sticky top-[88px]"
              >
                <div className="rounded-2xl overflow-hidden border border-border bg-white"
                  style={{ boxShadow: "0 8px 32px rgba(12,12,11,0.08), 0 1px 3px rgba(12,12,11,0.05)" }}>

                  {/* Dark header */}
                  <div className="px-7 pt-7 pb-6" style={{ background: "linear-gradient(160deg, #0C0C0B 0%, #1c1c1a 100%)" }}>
                    <p className="text-[10px] font-bold tracking-[0.22em] uppercase text-white/30 mb-2">Order total</p>
                    <motion.p
                      key={grandTotal}
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className="text-[2.2rem] font-black text-white tabular-nums tracking-[-0.03em]"
                    >
                      ${grandTotal.toFixed(0)}
                      <span className="text-base font-medium text-white/30 ml-1.5">USD</span>
                    </motion.p>
                  </div>

                  {/* Items */}
                  <div className="px-7 py-5 space-y-4 border-b border-border">
                    {items.map(item => (
                      <div key={item.id} className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-semibold text-ink leading-snug line-clamp-2">{item.productName}</p>
                          <p className="text-[11px] text-muted mt-0.5">{item.travelerName} · {item.from}{item.qty > 1 ? ` · ×${item.qty}` : ""}</p>
                        </div>
                        <span className="text-[13px] font-bold text-ink flex-shrink-0 tabular-nums">${(item.price * item.qty).toFixed(0)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  <div className="px-7 py-5 space-y-3 border-b border-border">
                    <div className="flex justify-between text-[13px]">
                      <span className="text-muted">Subtotal</span>
                      <span className="font-semibold text-ink tabular-nums">${totalPrice.toFixed(0)}</span>
                    </div>

                    {/* Delivery fee — animated */}
                    <AnimatePresence>
                      {form.handoff === "door" && (
                        <motion.div
                          key="delivery-fee"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="flex justify-between items-center text-[13px] pt-0.5">
                            <div className="flex items-center gap-2">
                              <span className="text-muted">Delivery fee</span>
                              <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full">Door delivery</span>
                            </div>
                            <span className="font-semibold text-ink tabular-nums">+${DELIVERY_FEE}</span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="flex justify-between text-[13px] items-center">
                      <span className="text-muted">Platform fee</span>
                      <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">No charge</span>
                    </div>

                    <div className="flex justify-between items-baseline pt-3 mt-1 border-t border-border">
                      <span className="font-bold text-ink">Total</span>
                      <motion.span
                        key={grandTotal}
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className="text-[20px] font-black text-ink tabular-nums"
                      >
                        ${grandTotal.toFixed(0)}
                      </motion.span>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="px-7 py-6 space-y-3">
                    <button
                      onClick={handlePlace}
                      disabled={!canPlace}
                      className="w-full flex items-center justify-center gap-2 rounded-2xl py-4 text-[15px] font-bold text-white transition-all active:scale-[0.98] disabled:opacity-35 disabled:cursor-not-allowed"
                      style={{ background: "linear-gradient(135deg, #FF5214 0%, #D93A00 100%)", boxShadow: canPlace ? "0 4px 16px rgba(255,69,0,0.28)" : "none" }}
                    >
                      Place order
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
                        <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    {!canPlace && (
                      <p className="text-center text-[11px] text-muted">
                        {!form.name || !form.email ? "Fill in your details to continue" : meetupLocationRequired && !selectedMeetupLocation ? "Select a meetup location to continue" : "Complete payment info to continue"}
                      </p>
                    )}
                    <Link href="/cart" className="block text-center text-[12px] text-muted hover:text-ink transition-colors">
                      ← Back to cart
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

/* ── Handoff icons (SVG, no emoji) ── */
function MeetupIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
      <circle cx="6" cy="4" r="2" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M2 13c0-2.2 1.8-4 4-4s4 1.8 4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <circle cx="12" cy="4" r="2" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M10 13c0-1.1.4-2.1 1-2.8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}

function DoorIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
      <rect x="3" y="1.5" width="10" height="13" rx="1" stroke="currentColor" strokeWidth="1.4"/>
      <circle cx="10.5" cy="8" r="0.8" fill="currentColor"/>
    </svg>
  );
}

function CourierIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
      <rect x="1" y="5" width="9" height="6" rx="1" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M10 7l2.5-2 2.5 2v4h-5V7z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
      <circle cx="3.5" cy="12" r="1.2" stroke="currentColor" strokeWidth="1.2"/>
      <circle cx="11.5" cy="12" r="1.2" stroke="currentColor" strokeWidth="1.2"/>
    </svg>
  );
}
