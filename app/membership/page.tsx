"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// ── Types ─────────────────────────────────────────────────────────────────────
type OrderStatus = "Delivered" | "In Transit" | "Ordered" | "Return Requested";
type TripStatus  = "Active" | "Completed" | "Upcoming";

// ── Mock data ─────────────────────────────────────────────────────────────────
const ORDERS = [
  {
    id: "ORD-001", item: "Pokémon Center Eevee plushie ×2", store: "Pokémon Center Shibuya",
    from: "Tokyo", traveler: "James L.", travelerEmoji: "🧔", status: "Delivered" as OrderStatus,
    date: "Mar 15, 2026", price: 42, image: "🧸",
    timeline: [
      { label: "Order placed",      date: "Mar 15", done: true },
      { label: "Traveler accepted", date: "Mar 15", done: true },
      { label: "Item purchased",    date: "Mar 17", done: true },
      { label: "In transit",        date: "Mar 19", done: true },
      { label: "Delivered",         date: "Mar 22", done: true },
    ],
    meetup: "Shinjuku Station South Exit",
    canReturn: true,
  },
  {
    id: "ORD-002", item: "Levain Bakery chocolate chip cookies ×2", store: "Levain Bakery NYC",
    from: "New York", traveler: "Sarah K.", travelerEmoji: "👩", status: "In Transit" as OrderStatus,
    date: "Mar 28, 2026", price: 28, image: "🍪",
    timeline: [
      { label: "Order placed",      date: "Mar 28",     done: true  },
      { label: "Traveler accepted", date: "Mar 28",     done: true  },
      { label: "Item purchased",    date: "Mar 29",     done: true  },
      { label: "In transit",        date: "Apr 1",      done: true  },
      { label: "Delivered",         date: "Est. Apr 5", done: false },
    ],
    meetup: "Grand Central Terminal",
    canReturn: false,
  },
  {
    id: "ORD-003", item: "COSRX Advanced Snail Mucin set", store: "Olive Young Hongdae",
    from: "Seoul", traveler: "Minho C.", travelerEmoji: "🧑", status: "Ordered" as OrderStatus,
    date: "Apr 2, 2026", price: 55, image: "🧴",
    timeline: [
      { label: "Order placed",      date: "Apr 2",       done: true  },
      { label: "Traveler accepted", date: "Apr 2",       done: true  },
      { label: "Item purchased",    date: "",            done: false },
      { label: "In transit",        date: "",            done: false },
      { label: "Delivered",         date: "Est. Apr 12", done: false },
    ],
    meetup: "Hongdae Station Exit 9",
    canReturn: false,
  },
  {
    id: "ORD-004", item: "Ladurée Rose Macaron Box (12pcs)", store: "Ladurée Champs-Élysées",
    from: "Paris", traveler: "Elise M.", travelerEmoji: "👱", status: "Delivered" as OrderStatus,
    date: "Feb 28, 2026", price: 38, image: "🍬",
    timeline: [
      { label: "Order placed",      date: "Feb 28", done: true },
      { label: "Traveler accepted", date: "Feb 28", done: true },
      { label: "Item purchased",    date: "Mar 1",  done: true },
      { label: "In transit",        date: "Mar 3",  done: true },
      { label: "Delivered",         date: "Mar 5",  done: true },
    ],
    meetup: "Le Marais Café",
    canReturn: false,
  },
  {
    id: "ORD-005", item: "Nintendo Switch OLED White — Limited Edition", store: "Nintendo Tokyo",
    from: "Tokyo", traveler: "Yuki H.", travelerEmoji: "👩", status: "Delivered" as OrderStatus,
    date: "Jan 20, 2026", price: 320, image: "🎮",
    timeline: [
      { label: "Order placed",      date: "Jan 20", done: true },
      { label: "Traveler accepted", date: "Jan 20", done: true },
      { label: "Item purchased",    date: "Jan 22", done: true },
      { label: "In transit",        date: "Jan 24", done: true },
      { label: "Delivered",         date: "Jan 28", done: true },
    ],
    meetup: "Akihabara Electric Town Exit",
    canReturn: false,
  },
];

const TRIPS = [
  {
    id: "TRP-001", route: "Seoul → London", date: "Apr 10, 2026",
    status: "Active" as TripStatus, capacity: 3, filled: 2,
    orders: [
      { id: "O-A1", buyer: "Emma W.",  emoji: "👱",   item: "Gentle Monster Ami sunglasses",  qty: 1, price: 48, status: "Pending"  },
      { id: "O-A2", buyer: "Liam T.",  emoji: "🧑",   item: "COSRX snail mucin 3-pack",       qty: 2, price: 62, status: "Accepted" },
      { id: "O-A3", buyer: "Yuna K.",  emoji: "👩",   item: "Laneige lip sleeping mask set",  qty: 1, price: 35, status: "Pending"  },
    ],
    earnings: 110,
  },
  {
    id: "TRP-002", route: "Tokyo → NYC", date: "Mar 20, 2026",
    status: "Completed" as TripStatus, capacity: 5, filled: 5,
    orders: [
      { id: "O-B1", buyer: "Marcus L.", emoji: "🧑",   item: "Pokémon Center Pikachu set", qty: 2, price: 55, status: "Delivered" },
      { id: "O-B2", buyer: "Sophie T.", emoji: "👱",   item: "Kit Kat matcha box ×3",      qty: 3, price: 36, status: "Delivered" },
      { id: "O-B3", buyer: "David K.",  emoji: "🧔",   item: "Harajuku vintage jacket",    qty: 1, price: 90, status: "Delivered" },
      { id: "O-B4", buyer: "Priya N.",  emoji: "🧑‍💼", item: "Wagashi assorted box",       qty: 1, price: 28, status: "Delivered" },
      { id: "O-B5", buyer: "Alex M.",   emoji: "🧓",   item: "Gacha blind box set ×5",     qty: 5, price: 40, status: "Delivered" },
    ],
    earnings: 249,
  },
];

const REQUESTS = [
  { id: "REQ-001", item: "Ladurée macarons assorted box",             from: "Paris",    budget: 30,  responses: 3, status: "Open",     date: "Apr 1" },
  { id: "REQ-002", item: "Limited Kith × New Balance 990v6 hoodie",   from: "New York", budget: 80,  responses: 1, status: "Accepted", date: "Mar 20" },
  { id: "REQ-003", item: "Harrods shortbread tin — Classic",          from: "London",   budget: 25,  responses: 0, status: "Open",     date: "Apr 3" },
  { id: "REQ-004", item: "LEGO Ideas Botanical Collection set",        from: "Tokyo",    budget: 95,  responses: 2, status: "Open",     date: "Apr 5" },
  { id: "REQ-005", item: "Gentle Monster Musee sunglasses",           from: "Seoul",    budget: 120, responses: 4, status: "Accepted", date: "Mar 15" },
];

const REVIEWS = [
  { name: "James L.", emoji: "🧔", rating: 5, text: "Super reliable, brought everything exactly as described. Fast responses too!", date: "Mar 22", route: "Tokyo → NYC" },
  { name: "Elise M.", emoji: "👱", rating: 5, text: "Packaged perfectly, delivered same day she arrived. Would use again.", date: "Feb 14", route: "Paris → Amsterdam" },
  { name: "Minho C.", emoji: "🧑", rating: 4, text: "Great experience overall, minor delay but communicated well throughout.", date: "Jan 30", route: "Seoul → London" },
  { name: "Priya N.", emoji: "🧑‍💼", rating: 5, text: "Found exactly the item I was looking for. Communication was top-notch the whole time.", date: "Jan 12", route: "Mumbai → London" },
  { name: "Marcus L.", emoji: "🧑", rating: 5, text: "Everything arrived in perfect condition. Really went above and beyond — highly recommend!", date: "Dec 28", route: "Tokyo → NYC" },
  { name: "Sophie T.", emoji: "👱", rating: 5, text: "Lightning-fast responses and great packaging. This is how handi should always work.", date: "Dec 10", route: "Paris → Berlin" },
];

const CONVERSATIONS = [
  {
    id: "conv-1", name: "James L.", emoji: "🧔", orderId: "ORD-001", item: "Pokémon Center Eevee plushie",
    lastMsg: "Great, see you at Shinjuku!", time: "11:47 AM", unread: 0,
    messages: [
      { from: "them", text: "Hi! I've just purchased the plushies. They look great!", time: "2:14 PM", date: "Mar 17" },
      { from: "me",   text: "Amazing, thank you! Looking forward to it 😊",            time: "2:31 PM", date: "Mar 17" },
      { from: "them", text: "I land on Mar 22. Meet at Shinjuku South Exit around 3pm?", time: "9:05 AM", date: "Mar 20" },
      { from: "me",   text: "Perfect, I'll be there!",                                 time: "9:18 AM", date: "Mar 20" },
      { from: "them", text: "Great, see you at Shinjuku!",                             time: "11:47 AM", date: "Mar 21" },
    ],
  },
  {
    id: "conv-2", name: "Sarah K.", emoji: "👩", orderId: "ORD-002", item: "Levain Bakery cookies",
    lastMsg: "They're in my bag, safely packed!", time: "3:31 PM", unread: 2,
    messages: [
      { from: "them", text: "Hi! Just picked up your cookies from Levain 🍪",                time: "10:22 AM", date: "Mar 29" },
      { from: "me",   text: "That's so exciting, thank you!",                               time: "10:45 AM", date: "Mar 29" },
      { from: "them", text: "They're in my bag, safely packed!",                            time: "3:30 PM",  date: "Apr 1"  },
      { from: "them", text: "I land on Apr 5 at JFK. I'll message when I'm through customs.", time: "3:31 PM", date: "Apr 1" },
    ],
  },
  {
    id: "conv-3", name: "Minho C.", emoji: "🧑", orderId: "ORD-003", item: "COSRX Snail Mucin set",
    lastMsg: "Will pick it up tomorrow morning.", time: "9:12 AM", unread: 1,
    messages: [
      { from: "me",   text: "Hi Minho! Just confirming my order for the COSRX set.", time: "8:55 AM", date: "Apr 2" },
      { from: "them", text: "Got it! Olive Young Hongdae has it in stock.",           time: "9:10 AM", date: "Apr 2" },
      { from: "them", text: "Will pick it up tomorrow morning.",                      time: "9:12 AM", date: "Apr 3" },
    ],
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const STATUS_CLS: Record<string, string> = {
  Delivered:        "badge-green",
  "In Transit":     "badge-blue",
  Ordered:          "badge-orange",
  Active:           "badge-orange",
  Completed:        "badge-green",
  Upcoming:         "badge-blue",
  Open:             "badge-blue",
  Accepted:         "badge-green",
  Pending:          "badge-orange",
  Paid:             "badge-green",
  "Return Requested":"badge-orange",
  Declined:         "text-[11px] font-semibold px-2.5 py-1 rounded-full bg-red-50 text-red-600 border border-red-200",
};

const TABS = ["Overview", "Orders", "Trips", "Messages", "Requests", "Earnings", "Reviews"] as const;
type Tab = typeof TABS[number];

// ── Modal ─────────────────────────────────────────────────────────────────────
function Modal({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  useEffect(() => {
    if (!open) return;
    const fn = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[200] flex items-center justify-center px-4"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="relative bg-white rounded-3xl shadow-float w-full max-w-[420px] p-8"
            onClick={e => e.stopPropagation()}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Withdraw Modal ────────────────────────────────────────────────────────────
function WithdrawModal({ open, onClose, balance }: { open: boolean; onClose: () => void; balance: number }) {
  const [step, setStep] = useState<"form" | "confirm" | "success">("form");
  const [method, setMethod] = useState<"bank" | "paypal">("bank");
  const [amount, setAmount] = useState(balance.toFixed(2));

  const handleClose = () => {
    setStep("form");
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      {step === "form" && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-[1.2rem] font-black text-ink">Withdraw funds</h2>
              <p className="text-sm text-muted mt-0.5">${balance.toFixed(2)} available</p>
            </div>
            <button onClick={handleClose} className="w-8 h-8 rounded-full hover:bg-warm flex items-center justify-center text-muted transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16"><path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold tracking-[0.14em] uppercase text-muted mb-2">Amount (USD)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted font-semibold">$</span>
                <input
                  type="number"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  max={balance}
                  className="w-full border border-border rounded-xl pl-8 pr-4 py-3 text-sm text-ink focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all"
                />
              </div>
              <button onClick={() => setAmount(balance.toFixed(2))} className="text-[11px] text-accent font-semibold mt-1.5 hover:underline">Use full balance</button>
            </div>

            <div>
              <label className="block text-[11px] font-bold tracking-[0.14em] uppercase text-muted mb-2">Payout method</label>
              <div className="grid grid-cols-2 gap-2">
                {([["bank", "🏦", "Bank transfer", "2–3 days"], ["paypal", "🅿️", "PayPal", "Instant"]] as const).map(([val, icon, label, sub]) => (
                  <button key={val} onClick={() => setMethod(val)}
                    className={`border rounded-xl p-3 text-left transition-all ${method === val ? "border-accent bg-accent-light" : "border-border hover:border-ink/20"}`}>
                    <span className="text-xl block mb-1">{icon}</span>
                    <p className="text-[13px] font-semibold text-ink">{label}</p>
                    <p className="text-[11px] text-muted">{sub}</p>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setStep("confirm")}
              disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > balance}
              className="w-full py-3.5 rounded-2xl text-[15px] font-bold text-white disabled:opacity-40 transition-all"
              style={{ background: "linear-gradient(135deg,#FF5214 0%,#D93A00 100%)", boxShadow: "0 4px 16px rgba(255,69,0,0.28)" }}
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {step === "confirm" && (
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-warm flex items-center justify-center text-3xl mx-auto mb-5">💸</div>
          <h2 className="text-[1.2rem] font-black text-ink mb-1">Confirm withdrawal</h2>
          <p className="text-sm text-muted mb-6">You are about to withdraw <strong className="text-ink">${parseFloat(amount).toFixed(2)}</strong> via {method === "bank" ? "bank transfer" : "PayPal"}.</p>
          <div className="bg-warm rounded-xl px-4 py-3 mb-6 text-left space-y-2">
            <div className="flex justify-between text-sm"><span className="text-muted">Amount</span><span className="font-semibold text-ink">${parseFloat(amount).toFixed(2)}</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted">Method</span><span className="font-semibold text-ink">{method === "bank" ? "Bank transfer" : "PayPal"}</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted">Arrival</span><span className="font-semibold text-ink">{method === "bank" ? "2–3 business days" : "Instant"}</span></div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep("form")} className="flex-1 py-3 rounded-2xl border border-border text-[14px] font-semibold text-muted hover:text-ink transition-colors">Back</button>
            <button onClick={() => setStep("success")} className="flex-1 py-3 rounded-2xl text-[14px] font-bold text-white transition-all"
              style={{ background: "linear-gradient(135deg,#FF5214 0%,#D93A00 100%)", boxShadow: "0 4px 16px rgba(255,69,0,0.20)" }}>
              Confirm
            </button>
          </div>
        </div>
      )}

      {step === "success" && (
        <div className="text-center py-2">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center mx-auto mb-5">
            <svg className="w-7 h-7 text-emerald-500" fill="none" viewBox="0 0 24 24"><path d="M5 12l5 5L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </motion.div>
          <h2 className="text-[1.2rem] font-black text-ink mb-1">Withdrawal requested!</h2>
          <p className="text-sm text-muted mb-6">Your ${parseFloat(amount).toFixed(2)} withdrawal is being processed. {method === "bank" ? "Funds arrive in 2–3 business days." : "Funds sent to PayPal instantly."}</p>
          <button onClick={handleClose} className="w-full py-3.5 rounded-2xl text-[15px] font-bold text-white"
            style={{ background: "linear-gradient(135deg,#FF5214 0%,#D93A00 100%)", boxShadow: "0 4px 16px rgba(255,69,0,0.20)" }}>
            Done
          </button>
        </div>
      )}
    </Modal>
  );
}

// ── Return Modal ──────────────────────────────────────────────────────────────
function ReturnModal({ open, onClose, item, onConfirm }: { open: boolean; onClose: () => void; item: string; onConfirm: () => void }) {
  const [reason, setReason] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleClose = () => { setReason(""); setSubmitted(false); onClose(); };

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => { onConfirm(); handleClose(); }, 1500);
  };

  return (
    <Modal open={open} onClose={handleClose}>
      {!submitted ? (
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[1.1rem] font-black text-ink">Request return</h2>
            <button onClick={handleClose} className="w-8 h-8 rounded-full hover:bg-warm flex items-center justify-center text-muted transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16"><path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
            </button>
          </div>
          <p className="text-sm text-muted mb-4">Item: <span className="font-semibold text-ink">{item}</span></p>
          <div className="mb-4">
            <label className="block text-[11px] font-bold tracking-[0.14em] uppercase text-muted mb-2">Reason for return</label>
            <select value={reason} onChange={e => setReason(e.target.value)}
              className="w-full border border-border rounded-xl px-4 py-3 text-sm text-ink focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all bg-white">
              <option value="">Select a reason…</option>
              <option value="wrong">Wrong item received</option>
              <option value="damaged">Item arrived damaged</option>
              <option value="not-as-described">Not as described</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={handleClose} className="flex-1 py-3 rounded-2xl border border-border text-[14px] font-semibold text-muted hover:text-ink transition-colors">Cancel</button>
            <button onClick={handleSubmit} disabled={!reason}
              className="flex-1 py-3 rounded-2xl text-[14px] font-bold text-white disabled:opacity-40 transition-all"
              style={{ background: "linear-gradient(135deg,#FF5214 0%,#D93A00 100%)" }}>
              Submit request
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-4">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="w-14 h-14 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24"><path d="M5 12l5 5L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </motion.div>
          <p className="font-bold text-ink">Return request submitted</p>
          <p className="text-sm text-muted mt-1">We'll review your request within 24 hours.</p>
        </div>
      )}
    </Modal>
  );
}

// ── Receipt Modal ─────────────────────────────────────────────────────────────
function ReceiptModal({ open, onClose, order }: { open: boolean; onClose: () => void; order: typeof ORDERS[0] | null }) {
  if (!order) return null;
  return (
    <Modal open={open} onClose={onClose}>
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-[1.1rem] font-black text-ink">Receipt</h2>
            <p className="text-[12px] text-muted">{order.id}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-warm flex items-center justify-center text-muted transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16"><path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
          </button>
        </div>

        <div className="border border-dashed border-border rounded-2xl p-5 mb-5 space-y-3">
          <div className="flex items-center gap-3 pb-3 border-b border-border">
            <span className="text-3xl">{order.image}</span>
            <div>
              <p className="font-semibold text-ink text-[13px]">{order.item}</p>
              <p className="text-[11px] text-muted">{order.store}</p>
            </div>
          </div>
          {[
            ["Carrier", `${order.travelerEmoji} ${order.traveler}`],
            ["Route", order.from],
            ["Date", order.date],
            ["Meetup", order.meetup],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between text-sm">
              <span className="text-muted">{k}</span>
              <span className="font-semibold text-ink">{v}</span>
            </div>
          ))}
          <div className="border-t border-border pt-3 flex justify-between">
            <span className="font-bold text-ink">Total paid</span>
            <span className="font-black text-ink text-[16px]">${order.price}.00</span>
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 rounded-2xl border border-border text-[14px] font-semibold text-muted hover:text-ink transition-colors">Close</button>
          <button className="flex-1 py-3 rounded-2xl text-[14px] font-bold text-white flex items-center justify-center gap-2"
            style={{ background: "linear-gradient(135deg,#FF5214 0%,#D93A00 100%)" }}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16"><path d="M3 12h10M8 2v8M4 7l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Download PDF
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ── Edit Profile Modal ────────────────────────────────────────────────────────
function EditProfileModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [name, setName] = useState("Alex Johnson");
  const [username, setUsername] = useState("alexjohnson");
  const [email, setEmail] = useState("demo@handi.com");
  const [bio, setBio] = useState("Frequent traveler & product enthusiast based in NYC.");
  const [location, setLocation] = useState("New York, USA");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 1200);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-7">
          <div>
            <h2 className="text-[1.15rem] font-black text-ink">Edit profile</h2>
            <p className="text-[12px] text-muted mt-0.5">Your public handi identity</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-warm flex items-center justify-center text-muted transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16"><path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
          </button>
        </div>

        {/* Avatar section */}
        <div className="flex items-center gap-4 p-4 bg-warm rounded-2xl mb-5">
          <div className="relative flex-shrink-0">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-orange-700 flex items-center justify-center text-3xl shadow-md">👤</div>
            <button className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white border border-border shadow-sm flex items-center justify-center hover:bg-warm transition-colors">
              <svg className="w-3 h-3 text-muted" fill="none" viewBox="0 0 12 12">
                <path d="M8 1l3 3-6 6H2V7l6-6z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          <div>
            <p className="font-bold text-ink text-[14px]">{name || "Your name"}</p>
            <p className="text-[12px] text-muted">@{username || "username"}</p>
            <button className="text-[11px] text-accent font-semibold mt-1 hover:underline">Upload photo</button>
          </div>
        </div>

        {/* Fields */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold tracking-[0.13em] uppercase text-muted mb-1.5">Full name</label>
              <input value={name} onChange={e => setName(e.target.value)}
                className="w-full border border-border rounded-xl px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all" />
            </div>
            <div>
              <label className="block text-[11px] font-bold tracking-[0.13em] uppercase text-muted mb-1.5">Username</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted text-sm">@</span>
                <input value={username} onChange={e => setUsername(e.target.value)}
                  className="w-full border border-border rounded-xl pl-7 pr-3.5 py-2.5 text-sm text-ink focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold tracking-[0.13em] uppercase text-muted mb-1.5">Email</label>
            <input value={email} onChange={e => setEmail(e.target.value)} type="email"
              className="w-full border border-border rounded-xl px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all" />
          </div>

          <div>
            <label className="block text-[11px] font-bold tracking-[0.13em] uppercase text-muted mb-1.5">Location</label>
            <div className="relative">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted" fill="none" viewBox="0 0 14 14">
                <path d="M7 1C4.8 1 3 2.8 3 5c0 3 4 8 4 8s4-5 4-8c0-2.2-1.8-4-4-4z" stroke="currentColor" strokeWidth="1.3"/>
                <circle cx="7" cy="5" r="1.3" fill="currentColor"/>
              </svg>
              <input value={location} onChange={e => setLocation(e.target.value)}
                className="w-full border border-border rounded-xl pl-8 pr-3.5 py-2.5 text-sm text-ink focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold tracking-[0.13em] uppercase text-muted mb-1.5">Bio</label>
            <textarea value={bio} onChange={e => setBio(e.target.value)} rows={2}
              className="w-full border border-border rounded-xl px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all resize-none" />
            <p className="text-[10px] text-muted mt-1">{bio.length}/150 characters</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6 pt-5 border-t border-border">
          <button onClick={onClose} className="flex-1 py-3 rounded-2xl border border-border text-[13px] font-semibold text-muted hover:text-ink transition-colors">Cancel</button>
          <button onClick={handleSave}
            className="flex-1 py-3 rounded-2xl text-[13px] font-bold text-white transition-all flex items-center justify-center gap-2"
            style={{ background: "linear-gradient(135deg,#FF5214 0%,#D93A00 100%)", boxShadow: "0 4px 14px rgba(255,69,0,0.22)" }}>
            {saved ? (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16"><path d="M3 8l4 4 6-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Saved!
              </>
            ) : "Save changes"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ── Order Card ────────────────────────────────────────────────────────────────
function OrderCard({ order, onMessage }: { order: typeof ORDERS[0]; onMessage?: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const [returned, setReturned] = useState(false);
  const [returnOpen, setReturnOpen] = useState(false);
  const [receiptOpen, setReceiptOpen] = useState(false);

  return (
    <>
      <ReturnModal open={returnOpen} onClose={() => setReturnOpen(false)} item={order.item} onConfirm={() => setReturned(true)} />
      <ReceiptModal open={receiptOpen} onClose={() => setReceiptOpen(false)} order={order} />

      <div className="bg-white border border-border rounded-2xl overflow-hidden transition-shadow hover:shadow-soft">
        {/* Row */}
        <button className="w-full p-5 flex items-center gap-4 text-left" onClick={() => setExpanded(v => !v)}>
          <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
            style={{ background: "linear-gradient(135deg,#F0EDE8,#E8E4DE)" }}>
            {order.image}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-ink text-[14px] truncate">{order.item}</p>
            <p className="text-[11px] text-muted mt-0.5">{order.travelerEmoji} {order.traveler} · {order.from} · {order.date}</p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <span className="font-black text-ink text-[15px]">${order.price}</span>
            <span className={STATUS_CLS[order.status]}>{order.status}</span>
            <div className={`w-6 h-6 flex items-center justify-center rounded-full transition-all text-muted ${expanded ? "bg-warm" : ""}`}>
              <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 14 14">
                <path d="M2 5l5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </button>

        {/* Expanded */}
        <AnimatePresence>
          {expanded && (
            <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}
              transition={{ duration: 0.22, ease: [0.22,1,0.36,1] }} className="overflow-hidden">
              <div className="border-t border-border px-5 pt-5 pb-5 grid grid-cols-1 sm:grid-cols-2 gap-6">

                {/* Timeline */}
                <div>
                  <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-muted mb-4">Shipment tracking</p>
                  <div className="space-y-0">
                    {order.timeline.map((step, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 border-2 transition-all ${
                            step.done ? "bg-accent border-accent" : "bg-white border-border"
                          }`}>
                            {step.done && (
                              <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 10">
                                <path d="M2 5l2.5 2.5 3.5-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            )}
                          </div>
                          {i < order.timeline.length - 1 && (
                            <div className={`w-px flex-1 my-1 min-h-[16px] ${step.done ? "bg-accent/25" : "bg-border"}`} />
                          )}
                        </div>
                        <div className="pb-3">
                          <span className={`text-[12px] font-semibold ${step.done ? "text-ink" : "text-muted/60"}`}>{step.label}</span>
                          {step.date && <span className="text-[11px] text-muted ml-2">{step.date}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right column */}
                <div className="space-y-3">
                  <div className="bg-warm rounded-xl px-4 py-3">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-muted mb-1">Meetup location</p>
                    <p className="text-[13px] font-semibold text-ink flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5 text-accent flex-shrink-0" fill="none" viewBox="0 0 16 16">
                        <path d="M8 1.5C5.5 1.5 3.5 3.5 3.5 6c0 3.5 4.5 8.5 4.5 8.5S12.5 9.5 12.5 6c0-2.5-2-4.5-4.5-4.5z" stroke="currentColor" strokeWidth="1.5"/>
                        <circle cx="8" cy="6" r="1.5" fill="currentColor"/>
                      </svg>
                      {order.meetup}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <button onClick={onMessage}
                      className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent text-white text-[12px] font-semibold hover:bg-accent-hover transition-colors">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 14 14">
                        <path d="M1 1h12v9H1z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
                        <path d="M4 10l-2 3 3-1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Message traveler
                    </button>

                    <button onClick={() => setReceiptOpen(true)}
                      className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border text-[12px] font-semibold text-muted hover:text-ink hover:border-ink/20 transition-colors">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 14 14">
                        <path d="M3 11h8M7 2v7M4 6l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Download receipt
                    </button>

                    {order.status === "Delivered" && !returned && order.canReturn && (
                      <button onClick={() => setReturnOpen(true)}
                        className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border text-[12px] font-semibold text-muted hover:text-red-500 hover:border-red-200 transition-colors">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 14 14">
                          <path d="M1 5h8a4 4 0 010 8H4M1 5l3-3M1 5l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Request return
                      </button>
                    )}
                    {returned && (
                      <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-50 border border-orange-200">
                        <svg className="w-3.5 h-3.5 text-orange-500" fill="none" viewBox="0 0 14 14">
                          <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.4"/>
                          <path d="M7 4.5v3M7 9v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                        <span className="text-[12px] font-semibold text-orange-700">Return requested — under review</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

// ── Trip Card ─────────────────────────────────────────────────────────────────
function TripCard({ trip }: { trip: typeof TRIPS[0] }) {
  const [expanded, setExpanded] = useState(false);
  const [states, setStates] = useState<Record<string, string>>(
    Object.fromEntries(trip.orders.map(o => [o.id, o.status]))
  );
  const pending = trip.orders.filter(o => states[o.id] === "Pending").length;
  const pct = Math.round((trip.filled / trip.capacity) * 100);

  return (
    <div className="bg-white border border-border rounded-2xl overflow-hidden transition-shadow hover:shadow-soft">
      <button className="w-full p-5 flex items-center gap-4 text-left" onClick={() => setExpanded(v => !v)}>
        <div className="w-11 h-11 rounded-xl bg-ink flex items-center justify-center text-xl flex-shrink-0">✈️</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-ink text-[14px]">{trip.route}</p>
            {pending > 0 && (
              <span className="w-4 h-4 rounded-full bg-accent text-white text-[9px] font-black flex items-center justify-center">{pending}</span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <p className="text-[11px] text-muted">{trip.date}</p>
            <span className="text-border">·</span>
            <p className="text-[11px] text-muted">{trip.orders.length} orders</p>
            <span className="text-border">·</span>
            <p className="text-[11px] text-muted">{trip.filled}/{trip.capacity} slots</p>
          </div>
          {/* Mini progress bar */}
          <div className="mt-2 h-1 bg-warm rounded-full overflow-hidden w-32">
            <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${pct}%` }} />
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="font-black text-ink text-[15px]">${trip.earnings}</span>
          <span className={STATUS_CLS[trip.status]}>{trip.status}</span>
          <div className={`w-6 h-6 flex items-center justify-center rounded-full transition-all text-muted ${expanded ? "bg-warm" : ""}`}>
            <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 14 14">
              <path d="M2 5l5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}
            transition={{ duration: 0.22, ease: [0.22,1,0.36,1] }} className="overflow-hidden">
            <div className="border-t border-border divide-y divide-border/60">
              {trip.orders.map(order => {
                const st = states[order.id];
                return (
                  <div key={order.id} className="px-5 py-3.5 flex items-center gap-3">
                    <span className="text-lg flex-shrink-0">{order.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-ink truncate">{order.item}</p>
                      <p className="text-[11px] text-muted">{order.buyer} · qty {order.qty}</p>
                    </div>
                    <span className="font-semibold text-ink text-[13px] flex-shrink-0">${order.price}</span>
                    {st === "Pending" ? (
                      <div className="flex gap-1.5 flex-shrink-0">
                        <button onClick={() => setStates(s => ({ ...s, [order.id]: "Accepted" }))}
                          className="px-3 py-1.5 rounded-lg bg-accent text-white text-[11px] font-bold hover:bg-accent-hover transition-colors">Accept</button>
                        <button onClick={() => setStates(s => ({ ...s, [order.id]: "Declined" }))}
                          className="px-3 py-1.5 rounded-lg border border-border text-[11px] font-bold text-muted hover:text-red-500 hover:border-red-200 transition-colors">Decline</button>
                      </div>
                    ) : (
                      <span className={STATUS_CLS[st] ?? "badge-green"}>{st}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Messages Tab ──────────────────────────────────────────────────────────────
function MessagesTab({ openConvId }: { openConvId?: string }) {
  const [activeId, setActiveId] = useState<string | null>(openConvId ?? null);
  const [input, setInput] = useState("");
  const [convMessages, setConvMessages] = useState(
    Object.fromEntries(CONVERSATIONS.map(c => [c.id, c.messages]))
  );
  const bottomRef = useRef<HTMLDivElement>(null);
  const active = CONVERSATIONS.find(c => c.id === activeId);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ block: "nearest" });
    }
  }, [activeId, convMessages]);

  const send = () => {
    if (!input.trim() || !activeId) return;
    const now = new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    setConvMessages(prev => ({
      ...prev,
      [activeId]: [...(prev[activeId] ?? []), { from: "me", text: input.trim(), time: now, date: "Today" }],
    }));
    setInput("");
  };

  const totalUnread = CONVERSATIONS.reduce((s, c) => s + c.unread, 0);

  return (
    <div className="bg-white border border-border rounded-2xl overflow-hidden" style={{ height: 560 }}>
      <div className="flex h-full">
        {/* Sidebar */}
        <div className="w-[240px] flex-shrink-0 border-r border-border flex flex-col">
          <div className="px-4 py-3.5 border-b border-border flex items-center justify-between">
            <p className="text-[13px] font-bold text-ink">Messages</p>
            {totalUnread > 0 && <span className="badge-orange">{totalUnread} new</span>}
          </div>
          <div className="flex-1 overflow-y-auto">
            {CONVERSATIONS.map(conv => (
              <button key={conv.id} onClick={() => setActiveId(conv.id)}
                className={`w-full text-left px-4 py-3 border-b border-border/40 transition-colors flex items-center gap-3 ${activeId === conv.id ? "bg-accent-light border-l-2 border-l-accent" : "hover:bg-warm"}`}>
                <div className="relative flex-shrink-0">
                  <div className="w-9 h-9 rounded-full bg-warm flex items-center justify-center text-base">{conv.emoji}</div>
                  {conv.unread > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-accent text-white text-[9px] font-black flex items-center justify-center">{conv.unread}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className={`text-[12px] truncate ${conv.unread > 0 ? "font-bold text-ink" : "font-semibold text-ink"}`}>{conv.name}</p>
                    <span className="text-[10px] text-muted flex-shrink-0 ml-1">{conv.time}</span>
                  </div>
                  <p className={`text-[11px] truncate ${conv.unread > 0 ? "text-ink/70" : "text-muted"}`}>{conv.lastMsg}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat area */}
        {active ? (
          <div className="flex-1 flex flex-col min-w-0">
            {/* Header */}
            <div className="px-5 py-3 border-b border-border flex items-center gap-3 flex-shrink-0 bg-stone/40">
              <div className="w-8 h-8 rounded-full bg-warm flex items-center justify-center text-base">{active.emoji}</div>
              <div className="flex-1">
                <p className="text-[13px] font-bold text-ink">{active.name}</p>
                <p className="text-[11px] text-muted">{active.item}</p>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" title="Online" />
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-1">
              {(convMessages[active.id] ?? []).map((msg, i, arr) => {
                const isMe = msg.from === "me";
                const isLast = i === arr.length - 1;
                const isLastFromMe = isMe && isLast;
                const msgDate = (msg as any).date ?? null;
                const prevDate = i > 0 ? ((arr[i - 1] as any).date ?? null) : null;
                const showDateHeader = msgDate && msgDate !== prevDate;
                return (
                  <div key={i}>
                    {showDateHeader && (
                      <div className="flex items-center justify-center my-4">
                        <span className="text-[11px] text-muted bg-warm px-3 py-1 rounded-full font-medium">{msgDate}</span>
                      </div>
                    )}
                    <div className={`flex items-end gap-2 ${isMe ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[68%] px-3.5 py-2.5 rounded-2xl text-[13px] leading-relaxed ${
                        isMe ? "bg-accent text-white rounded-br-sm" : "bg-warm text-ink rounded-bl-sm"
                      }`}>
                        {msg.text}
                      </div>
                      {!isMe && <span className="text-[10px] text-muted whitespace-nowrap mb-1 flex-shrink-0">{msg.time}</span>}
                      {isMe && (
                        <div className="flex flex-col items-end gap-0.5 mb-1 flex-shrink-0 order-first">
                          <span className="text-[10px] text-muted whitespace-nowrap">{msg.time}</span>
                          {isLastFromMe && active.unread === 0 && (
                            <span className="text-[10px] text-muted font-medium">Seen ✓</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="px-4 py-3 border-t border-border flex gap-2 flex-shrink-0 bg-white">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && send()}
                placeholder="Type a message…"
                className="flex-1 border border-border rounded-xl px-4 py-2.5 text-[13px] text-ink focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all bg-stone/30"
              />
              <button onClick={send}
                className="w-10 h-10 rounded-xl bg-accent text-white flex items-center justify-center hover:bg-accent-hover transition-colors flex-shrink-0 disabled:opacity-40"
                disabled={!input.trim()}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
                  <path d="M14 8H2M9 3l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-center px-8">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-warm flex items-center justify-center text-2xl mx-auto mb-3">💬</div>
              <p className="font-semibold text-ink text-[14px] mb-1">Select a conversation</p>
              <p className="text-[12px] text-muted max-w-[200px] mx-auto">Choose a traveler from the list to see your messages.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Earnings Tab ──────────────────────────────────────────────────────────────
function EarningsTab() {
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const BALANCE = 237.00;
  const PENDING = 104.50;

  const earningsHistory = [
    { route: "Tokyo → NYC",    date: "Mar 20", net: 237.00, fee: 12.50, status: "Paid",    orders: 5 },
    { route: "Seoul → London", date: "Apr 10", net: 104.50, fee: 5.50,  status: "Pending", orders: 2 },
  ];

  return (
    <>
      <WithdrawModal open={withdrawOpen} onClose={() => setWithdrawOpen(false)} balance={BALANCE} />

      <div className="space-y-4">
        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: "Total earned",   value: "$341.00", sub: "After platform fees",      icon: "💰" },
            { label: "Pending payout", value: `$${PENDING.toFixed(2)}`, sub: "Est. Apr 15, 2026", icon: "⏳" },
            { label: "Platform fee",   value: "5%",      sub: "Per completed trip",       icon: "📊" },
          ].map(s => (
            <div key={s.label} className="bg-white border border-border rounded-2xl p-5 flex items-start gap-3">
              <span className="text-2xl mt-0.5">{s.icon}</span>
              <div>
                <p className="text-[11px] font-bold tracking-[0.12em] uppercase text-muted">{s.label}</p>
                <p className="text-[1.6rem] font-black text-ink leading-tight mt-0.5">{s.value}</p>
                <p className="text-[11px] text-muted mt-0.5">{s.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Wallet + withdraw */}
        <div className="bg-white border border-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[11px] font-bold tracking-[0.12em] uppercase text-muted mb-1">Wallet balance</p>
              <p className="text-[2rem] font-black text-ink">${BALANCE.toFixed(2)}</p>
              <p className="text-[12px] text-muted mt-0.5">Available to withdraw instantly</p>
            </div>
            <div className="text-right">
              <button onClick={() => setWithdrawOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-bold text-white transition-all hover:brightness-110 active:scale-[0.98]"
                style={{ background: "linear-gradient(135deg,#FF5214 0%,#D93A00 100%)", boxShadow: "0 4px 16px rgba(255,69,0,0.25)" }}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
                  <path d="M3 12h10M8 2v8M4 7l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Withdraw
              </button>
              <p className="text-[11px] text-muted mt-1.5">Bank · PayPal · Crypto</p>
            </div>
          </div>
          {/* Balance bar */}
          <div className="bg-warm rounded-full h-2 overflow-hidden">
            <div className="h-full bg-accent rounded-full" style={{ width: `${(BALANCE / 341) * 100}%` }} />
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-[11px] text-muted">$0</span>
            <span className="text-[11px] text-muted">$341 total</span>
          </div>
        </div>

        {/* Payout history */}
        <div>
          <p className="text-[13px] font-bold text-ink mb-3">Payout history</p>
          <div className="space-y-2">
            {earningsHistory.map((e, i) => (
              <div key={i} className="bg-white border border-border rounded-2xl px-5 py-4 flex items-center gap-4">
                <div className="w-9 h-9 rounded-xl bg-warm flex items-center justify-center text-lg flex-shrink-0">✈️</div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-ink text-[13px]">{e.route}</p>
                  <p className="text-[11px] text-muted">{e.date} · {e.orders} orders · ${e.fee} fee</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-black text-ink">${e.net.toFixed(2)}</p>
                  <span className={STATUS_CLS[e.status]}>{e.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

// ── Orders Tab ────────────────────────────────────────────────────────────────
function OrdersTab({ orderFilter, setOrderFilter, openMessage }: {
  orderFilter: "All" | "Active" | "Delivered";
  setOrderFilter: (f: "All" | "Active" | "Delivered") => void;
  openMessage: (orderId: string) => void;
}) {
  const filtered = ORDERS.filter(o =>
    orderFilter === "All" ? true :
    orderFilter === "Delivered" ? o.status === "Delivered" :
    o.status !== "Delivered"
  );
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[13px] font-bold text-ink">{filtered.length} order{filtered.length !== 1 ? "s" : ""}</p>
        <div className="flex gap-2">
          {(["All", "Active", "Delivered"] as const).map(f => (
            <button key={f} onClick={() => setOrderFilter(f)}
              className={`px-3 py-1.5 rounded-full border text-[11px] font-semibold transition-colors ${orderFilter === f ? "bg-ink text-white border-ink" : "border-border text-muted hover:text-ink hover:border-ink/20"}`}>
              {f}
            </button>
          ))}
        </div>
      </div>
      {filtered.map(o => (
        <OrderCard key={o.id} order={o} onMessage={() => openMessage(o.id)} />
      ))}
      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted">
          <p className="text-3xl mb-3">📦</p>
          <p className="font-semibold text-ink">No {orderFilter.toLowerCase()} orders</p>
        </div>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function MembershipPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("Overview");
  const [messageConvId, setMessageConvId] = useState<string | undefined>(undefined);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [orderFilter, setOrderFilter] = useState<"All"|"Active"|"Delivered">("All");
  const [expandedReq, setExpandedReq] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionStorage.getItem("handi_user")) {
      router.push("/signin");
    }
  }, [router]);

  const pendingCount = TRIPS.flatMap(t => t.orders).filter(o => o.status === "Pending").length;
  const unreadCount  = CONVERSATIONS.reduce((s, c) => s + c.unread, 0);

  const openMessage = (convId: string) => {
    setMessageConvId(convId);
    setTab("Messages");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const orderConvMap: Record<string, string> = {
    "ORD-001": "conv-1", "ORD-002": "conv-2", "ORD-003": "conv-3",
    "ORD-004": "conv-1", "ORD-005": "conv-1",
  };

  return (
    <>
      <Navbar />
      <EditProfileModal open={editProfileOpen} onClose={() => setEditProfileOpen(false)} />

      <main className="min-h-screen" style={{ background: "#F7F5F0" }}>

        {/* ── Header ── */}
        <div className="bg-ink border-b border-white/8 pt-[64px]">
          <div className="wrap pt-8 pb-0">

            {/* Profile row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent to-orange-700 flex items-center justify-center text-2xl flex-shrink-0 shadow-glow">
                  👤
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-[1.3rem] font-black text-white leading-none">Alex Johnson</h1>
                    <span className="px-2 py-0.5 rounded-full bg-white/10 text-white/60 text-[10px] font-bold tracking-wider uppercase">Pro</span>
                  </div>
                  <p className="text-white/40 text-[12px] mt-1">Member since Jan 2024 · ⭐ 4.9 · 26 reviews</p>
                </div>
              </div>
              <button
                onClick={() => setEditProfileOpen(true)}
                className="flex items-center gap-2 border border-white/15 rounded-full px-4 py-2 text-[12px] font-semibold text-white/50 hover:text-white hover:border-white/30 transition-colors w-fit">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 14 14">
                  <path d="M9.5 1.5l3 3-7.5 7.5H2v-3L9.5 1.5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Edit profile
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-0 overflow-x-auto -mx-1">
              {TABS.map(t => (
                <button key={t} onClick={() => setTab(t)}
                  className={`relative px-4 py-2.5 text-[13px] font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 rounded-t-xl mx-0.5 ${
                    tab === t
                      ? "text-ink bg-[#F7F5F0]"
                      : "text-white/40 hover:text-white/70 hover:bg-white/5"
                  }`}>
                  {t}
                  {t === "Trips"    && pendingCount > 0 && <span className="w-4 h-4 rounded-full bg-accent text-white text-[9px] font-black flex items-center justify-center">{pendingCount}</span>}
                  {t === "Messages" && unreadCount  > 0 && <span className="w-4 h-4 rounded-full bg-accent text-white text-[9px] font-black flex items-center justify-center">{unreadCount}</span>}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Content ── */}
        <div className="wrap py-7">
          <AnimatePresence mode="wait">
            <motion.div key={tab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}>

              {/* OVERVIEW */}
              {tab === "Overview" && (
                <div className="space-y-6">
                  {/* Stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { icon: "📦", label: "Total orders", value: `${ORDERS.length}`,  sub: "+2 this month",  onClick: () => setTab("Orders")   },
                      { icon: "✈️", label: "Trips made",   value: `${TRIPS.length}`,   sub: "$341 earned",    onClick: () => setTab("Trips")    },
                      { icon: "⭐", label: "Rating",       value: "4.9", sub: `${REVIEWS.length} reviews`,   onClick: () => setTab("Reviews")  },
                      { icon: "💰", label: "Wallet",       value: "$237.00", sub: "Available now", onClick: () => setTab("Earnings") },
                    ].map(s => (
                      <button key={s.label} onClick={s.onClick}
                        className="bg-white border border-border rounded-2xl px-4 py-4 flex items-center gap-3 text-left hover:border-accent/30 hover:shadow-soft transition-all group">
                        <span className="text-2xl">{s.icon}</span>
                        <div>
                          <p className="text-[19px] font-black text-ink leading-none">{s.value}</p>
                          <p className="text-[11px] text-muted mt-0.5">{s.label}</p>
                          <p className="text-[10px] text-accent font-semibold mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">{s.sub}</p>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Recent orders */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-[13px] font-bold text-ink">Recent orders</p>
                      <button onClick={() => setTab("Orders")} className="text-[12px] font-semibold text-accent hover:underline flex items-center gap-1">
                        View all
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 12 12"><path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </button>
                    </div>
                    <div className="space-y-2">
                      {ORDERS.slice(0, 2).map(o => (
                        <OrderCard key={o.id} order={o} onMessage={() => openMessage(orderConvMap[o.id])} />
                      ))}
                    </div>
                  </div>

                  {/* Active trips */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-[13px] font-bold text-ink">Active trips</p>
                      <button onClick={() => setTab("Trips")} className="text-[12px] font-semibold text-accent hover:underline flex items-center gap-1">
                        View all
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 12 12"><path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </button>
                    </div>
                    <div className="space-y-2">
                      {TRIPS.filter(t => t.status === "Active").map(t => <TripCard key={t.id} trip={t} />)}
                    </div>
                  </div>
                </div>
              )}

              {/* ORDERS */}
              {tab === "Orders" && (
                <OrdersTab
                  orderFilter={orderFilter}
                  setOrderFilter={setOrderFilter}
                  openMessage={(id) => openMessage(orderConvMap[id])}
                />
              )}

              {/* TRIPS */}
              {tab === "Trips" && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-[13px] font-bold text-ink">{TRIPS.length} trips</p>
                    <Link href="/post-trip" className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent text-white text-[12px] font-bold hover:bg-accent-hover transition-colors">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 14 14"><path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                      Post a trip
                    </Link>
                  </div>
                  {TRIPS.map(t => <TripCard key={t.id} trip={t} />)}
                </div>
              )}

              {/* MESSAGES */}
              {tab === "Messages" && <MessagesTab openConvId={messageConvId} />}

              {/* REQUESTS */}
              {tab === "Requests" && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-[13px] font-bold text-ink">{REQUESTS.length} requests</p>
                    <Link href="/browse" className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent text-white text-[12px] font-bold hover:bg-accent-hover transition-colors">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 14 14"><path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                      New request
                    </Link>
                  </div>
                  {REQUESTS.map((r, i) => (
                    <motion.div key={r.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                      <div className="bg-white border border-border rounded-2xl overflow-hidden transition-shadow hover:shadow-soft">
                        <div className="px-5 py-4 flex items-center gap-4">
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-ink text-[14px] truncate">{r.item}</p>
                            <p className="text-[11px] text-muted mt-0.5">from {r.from} · budget ${r.budget} · Posted {r.date}</p>
                          </div>
                          <div className="flex items-center gap-3 flex-shrink-0">
                            {r.responses > 0 && (
                              <span className="text-[11px] text-muted">{r.responses} response{r.responses !== 1 ? "s" : ""}</span>
                            )}
                            <span className={STATUS_CLS[r.status]}>{r.status}</span>
                            <button
                              onClick={() => setExpandedReq(expandedReq === r.id ? null : r.id)}
                              className="px-3 py-1.5 rounded-lg border border-border text-[11px] font-semibold text-muted hover:text-ink hover:border-ink/20 transition-colors flex items-center gap-1">
                              {expandedReq === r.id ? "Close" : "View"}
                              <svg className={`w-3 h-3 transition-transform ${expandedReq === r.id ? "rotate-180" : ""}`} fill="none" viewBox="0 0 12 12">
                                <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </button>
                          </div>
                        </div>
                        <AnimatePresence>
                          {expandedReq === r.id && (
                            <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}
                              transition={{ duration: 0.2, ease: [0.22,1,0.36,1] }} className="overflow-hidden">
                              <div className="border-t border-border px-5 py-4 bg-warm/40 space-y-3">
                                <div className="grid grid-cols-3 gap-3">
                                  {[["📍 From", r.from], ["💰 Budget", `$${r.budget}`], ["📅 Posted", r.date]].map(([k,v]) => (
                                    <div key={k as string}>
                                      <p className="text-[10px] font-bold uppercase tracking-wide text-muted mb-0.5">{k}</p>
                                      <p className="text-[13px] font-semibold text-ink">{v}</p>
                                    </div>
                                  ))}
                                </div>
                                <div className="flex gap-2 pt-1">
                                  <Link href="/requests" className="flex-1 py-2 rounded-xl bg-accent text-white text-[12px] font-bold text-center hover:bg-accent-hover transition-colors">
                                    Browse carriers
                                  </Link>
                                  <button className="flex-1 py-2 rounded-xl border border-border text-[12px] font-semibold text-muted hover:text-red-500 hover:border-red-200 transition-colors">
                                    Cancel request
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* EARNINGS */}
              {tab === "Earnings" && <EarningsTab />}

              {/* REVIEWS */}
              {tab === "Reviews" && (
                <div className="space-y-3">
                  {/* Summary */}
                  <div className="bg-white border border-border rounded-2xl p-6 flex items-center gap-8">
                    <div className="text-center flex-shrink-0">
                      <p className="text-[3rem] font-black text-ink leading-none">4.9</p>
                      <div className="flex gap-0.5 justify-center my-2">
                        {"★★★★★".split("").map((s, i) => <span key={i} className="text-amber-400 text-lg">{s}</span>)}
                      </div>
                      <p className="text-[12px] text-muted">{REVIEWS.length} reviews</p>
                    </div>
                    <div className="flex-1 space-y-2">
                      {[5,4,3,2,1].map(stars => {
                        const count = stars === 5 ? REVIEWS.filter(r => r.rating === 5).length : stars === 4 ? REVIEWS.filter(r => r.rating === 4).length : 0;
                        return (
                          <div key={stars} className="flex items-center gap-3">
                            <span className="text-[12px] text-muted w-3 text-right">{stars}</span>
                            <span className="text-amber-400 text-xs">★</span>
                            <div className="flex-1 h-1.5 bg-warm rounded-full overflow-hidden">
                              <div className="h-full bg-amber-400 rounded-full transition-all" style={{ width: `${(count/REVIEWS.length)*100}%` }} />
                            </div>
                            <span className="text-[11px] text-muted w-4 text-right">{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Review cards */}
                  {REVIEWS.map((r, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                      <div className="bg-white border border-border rounded-2xl p-5">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-warm flex items-center justify-center text-lg">{r.emoji}</div>
                            <div>
                              <p className="font-semibold text-ink text-[13px]">{r.name}</p>
                              <p className="text-[11px] text-muted">{r.route} · {r.date}</p>
                            </div>
                          </div>
                          <div className="flex gap-0.5">
                            {Array.from({ length: r.rating }).map((_, j) => <span key={j} className="text-amber-400 text-sm">★</span>)}
                          </div>
                        </div>
                        <p className="text-[13px] text-muted leading-relaxed">&ldquo;{r.text}&rdquo;</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </>
  );
}
