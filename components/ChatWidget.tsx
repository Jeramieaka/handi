"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Message = { id: number; from: "user" | "agent"; text: string };
type Phase = "reason" | "replied" | "ask_human" | "queuing" | "connected";

const REASON_REPLIES: Record<string, string> = {
  damage:  "Sorry to hear that 😔 I've noted your item arrived damaged. Our buyer protection covers this — you can open a dispute from your Orders page within 48 hours and attach photos.",
  lost:    "That's really frustrating — I'm sorry your item didn't arrive 😔 Buyer protection covers all orders. I've flagged this on your account.",
  refund:  "Got it — refunds are processed within 3–5 business days once a dispute is resolved in your favour. I've noted your request.",
  cancel:  "Understood. Orders can be cancelled within 1 hour of placing them from your Orders page. I've noted you'd like to cancel.",
  track:   "Sure! Tracking updates are sent via email and you can always check your Orders tab in your Membership dashboard.",
  carrier: "Of course — you can message your carrier directly from the order detail page. They're notified instantly.",
  default: "Thanks for letting me know! I've noted your issue and can help you further.",
};

const QUICK_OPTIONS = [
  { label: "📦 Item damaged", key: "damage" },
  { label: "❓ Item not arrived", key: "lost" },
  { label: "💸 Request refund", key: "refund" },
  { label: "❌ Cancel order", key: "cancel" },
  { label: "📍 Track my order", key: "track" },
  { label: "💬 Contact carrier", key: "carrier" },
];

function detectReason(text: string): string {
  const t = text.toLowerCase();
  if (t.includes("damage") || t.includes("broken") || t.includes("crack")) return "damage";
  if (t.includes("lost") || t.includes("missing") || t.includes("not arrive") || t.includes("didn't arrive") || t.includes("where is my")) return "lost";
  if (t.includes("refund") || t.includes("money back") || t.includes("reimburs")) return "refund";
  if (t.includes("cancel")) return "cancel";
  if (t.includes("track") || t.includes("status") || t.includes("where is")) return "track";
  if (t.includes("carrier") || t.includes("traveler") || t.includes("contact")) return "carrier";
  return "default";
}

export default function ChatWidget() {
  const [open, setOpen]       = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, from: "agent", text: "Hi! 👋 I'm Mia from handi support. What can I help you with today?" },
  ]);
  const [phase, setPhase]     = useState<Phase>("reason");
  const [input, setInput]     = useState("");
  const [typing, setTyping]   = useState(false);
  const [unread, setUnread]   = useState(0);
  const [showQuick, setShowQuick] = useState(true);

  // Queue state
  const [queuePos, setQueuePos]     = useState(0);
  const [waitMins, setWaitMins]     = useState(0);
  const queueInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);
  const nextId    = useRef(1);

  useEffect(() => {
    if (open) { setUnread(0); setTimeout(() => inputRef.current?.focus(), 300); }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  // Cleanup queue interval on unmount
  useEffect(() => () => { if (queueInterval.current) clearInterval(queueInterval.current); }, []);

  const addAgent = useCallback((text: string, delay = 1200) => {
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      const msg: Message = { id: nextId.current++, from: "agent", text };
      setMessages(prev => [...prev, msg]);
      if (!open) setUnread(n => n + 1);
    }, delay + Math.random() * 400);
  }, [open]);

  const startQueue = useCallback(() => {
    const initPos  = Math.floor(Math.random() * 4) + 3; // 3–6
    const initWait = initPos * 2 + Math.floor(Math.random() * 3); // ~mins
    setQueuePos(initPos);
    setWaitMins(initWait);
    setPhase("queuing");

    addAgent(`You're now in queue 🕐 There are **${initPos} people** ahead of you. Estimated wait: **${initWait} minutes**. I'll keep you updated!`, 800);

    let pos  = initPos;
    let wait = initWait;

    queueInterval.current = setInterval(() => {
      if (pos <= 1) {
        clearInterval(queueInterval.current!);
        setPhase("connected");
        setQueuePos(0);
        const msg: Message = { id: nextId.current++, from: "agent", text: "✅ A support agent has joined the chat! They'll be with you shortly." };
        setMessages(prev => [...prev, msg]);
        if (!open) setUnread(n => n + 1);
        return;
      }
      pos  = Math.max(1, pos - 1);
      wait = Math.max(1, wait - 2);
      setQueuePos(pos);
      setWaitMins(wait);
      const msg: Message = {
        id: nextId.current++,
        from: "agent",
        text: `⏳ Queue update: **${pos} ${pos === 1 ? "person" : "people"}** ahead of you. Estimated wait: **${wait} minute${wait !== 1 ? "s" : ""}**.`,
      };
      setMessages(prev => [...prev, msg]);
      if (!open) setUnread(n => n + 1);
    }, 12000); // update every 12s
  }, [open, addAgent]);

  const handleReason = useCallback((reasonKey: string, userText: string) => {
    const userMsg: Message = { id: nextId.current++, from: "user", text: userText };
    setMessages(prev => [...prev, userMsg]);
    setShowQuick(false);
    setPhase("replied");

    const reply = REASON_REPLIES[reasonKey];
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      const replyMsg: Message = { id: nextId.current++, from: "agent", text: reply };
      setMessages(prev => [...prev, replyMsg]);
      if (!open) setUnread(n => n + 1);

      // Follow-up: ask if they want human agent
      setTimeout(() => {
        addAgent("Would you like me to connect you with a human agent for further assistance?", 1000);
        setPhase("ask_human");
      }, 1800);
    }, 1200 + Math.random() * 400);
  }, [open, addAgent]);

  const send = useCallback(() => {
    const text = input.trim();
    if (!text) return;
    setInput("");

    if (phase === "reason") {
      const key = detectReason(text);
      handleReason(key, text);
      return;
    }

    if (phase === "ask_human") {
      const userMsg: Message = { id: nextId.current++, from: "user", text };
      setMessages(prev => [...prev, userMsg]);
      const t = text.toLowerCase();
      if (t.includes("yes") || t.includes("yeah") || t.includes("sure") || t.includes("ok") || t.includes("please") || t.includes("connect")) {
        startQueue();
      } else {
        addAgent("No problem! Feel free to message me anytime if you need further help. Have a great day! 😊");
        setPhase("replied");
      }
      return;
    }

    if (phase === "connected") {
      const userMsg: Message = { id: nextId.current++, from: "user", text };
      setMessages(prev => [...prev, userMsg]);
      addAgent("The agent has received your message and will reply shortly.", 2000);
      return;
    }

    // fallback for "replied" phase
    const userMsg: Message = { id: nextId.current++, from: "user", text };
    setMessages(prev => [...prev, userMsg]);
    addAgent("Thanks! Is there anything else I can help you with?");
  }, [input, phase, handleReason, startQueue, addAgent]);

  const handleKey = (e: React.KeyboardEvent) => { if (e.key === "Enter") send(); };

  // Render bold markdown (**text**)
  const renderText = (text: string) => {
    const parts = text.split(/\*\*(.+?)\*\*/g);
    return parts.map((p, i) => i % 2 === 1 ? <strong key={i}>{p}</strong> : p);
  };

  const inputPlaceholder =
    phase === "ask_human" ? "Type yes / no…" :
    phase === "queuing"   ? "You're in queue…" :
    phase === "connected" ? "Message the agent…" :
    "Describe your issue…";

  const inputDisabled = phase === "queuing";

  return (
    <div className="fixed bottom-6 right-6 z-[90] flex flex-col items-end gap-3">

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="w-[340px] bg-white rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.16)] border border-border flex flex-col overflow-hidden"
            style={{ height: 500 }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border bg-ink flex-shrink-0">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-white font-black text-sm">M</div>
                <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-ink ${phase === "connected" ? "bg-emerald-400" : "bg-emerald-400"}`} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-white leading-none">
                  {phase === "connected" ? "Support Agent" : "Mia"}
                </p>
                <p className="text-[11px] text-white/40 mt-0.5">
                  {phase === "queuing"
                    ? `Queue position: #${queuePos} · ~${waitMins} min`
                    : phase === "connected"
                    ? "handi support · connected"
                    : "handi support · online"}
                </p>
              </div>
              <button onClick={() => setOpen(false)} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors">
                <svg className="w-4 h-4 text-white/60" fill="none" viewBox="0 0 16 16">
                  <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-stone/40">
              {messages.map(m => (
                <div key={m.id} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                  {m.from === "agent" && (
                    <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center text-white text-[10px] font-black mr-2 flex-shrink-0 mt-0.5">
                      {phase === "connected" ? "S" : "M"}
                    </div>
                  )}
                  <div className={`max-w-[220px] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    m.from === "user"
                      ? "bg-accent text-white rounded-br-sm"
                      : "bg-white text-ink shadow-sm border border-border/60 rounded-bl-sm"
                  }`}>
                    {renderText(m.text)}
                  </div>
                </div>
              ))}

              {/* Quick options */}
              {showQuick && phase === "reason" && (
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {QUICK_OPTIONS.map(opt => (
                    <button
                      key={opt.key}
                      onClick={() => handleReason(opt.key, opt.label.replace(/^\S+\s/, ""))}
                      className="text-[11px] font-semibold px-3 py-1.5 rounded-full border border-accent/30 text-accent bg-accent/5 hover:bg-accent/10 transition-colors"
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Yes/No quick reply for ask_human */}
              {phase === "ask_human" && (
                <div className="flex gap-2 mt-1">
                  <button
                    onClick={() => { setInput(""); const userMsg: Message = { id: nextId.current++, from: "user", text: "Yes, please connect me" }; setMessages(prev => [...prev, userMsg]); startQueue(); }}
                    className="flex-1 text-[12px] font-bold px-3 py-2 rounded-xl bg-accent text-white hover:bg-accent/90 transition-colors"
                  >
                    Yes, connect me
                  </button>
                  <button
                    onClick={() => { const userMsg: Message = { id: nextId.current++, from: "user", text: "No, I'm good" }; setMessages(prev => [...prev, userMsg]); addAgent("No problem! Feel free to message anytime. Have a great day! 😊"); setPhase("replied"); }}
                    className="flex-1 text-[12px] font-bold px-3 py-2 rounded-xl border border-border text-muted hover:text-ink hover:border-ink/20 transition-colors"
                  >
                    No thanks
                  </button>
                </div>
              )}

              {/* Typing indicator */}
              {typing && (
                <div className="flex justify-start">
                  <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center text-white text-[10px] font-black mr-2 flex-shrink-0 mt-0.5">M</div>
                  <div className="bg-white border border-border/60 shadow-sm rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1 items-center">
                    {[0, 1, 2].map(i => (
                      <motion.span key={i} className="w-1.5 h-1.5 rounded-full bg-muted"
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="px-3 py-3 border-t border-border bg-white flex items-center gap-2 flex-shrink-0">
              <input
                ref={inputRef}
                value={input}
                disabled={inputDisabled}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder={inputPlaceholder}
                className="flex-1 text-sm px-3.5 py-2.5 rounded-xl bg-stone border border-border focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              />
              <button
                onClick={send}
                disabled={!input.trim() || inputDisabled}
                className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center text-white disabled:opacity-30 transition-all hover:bg-accent/90 active:scale-95 flex-shrink-0"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
                  <path d="M14 2L2 7l5 2 2 5 5-12z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle button */}
      <motion.button
        onClick={() => setOpen(o => !o)}
        whileTap={{ scale: 0.92 }}
        className="w-14 h-14 rounded-full bg-accent text-white shadow-[0_4px_20px_rgba(255,69,0,0.4)] flex items-center justify-center relative hover:bg-accent/90 transition-colors"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.svg key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }} className="w-5 h-5" fill="none" viewBox="0 0 16 16">
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </motion.svg>
          ) : (
            <motion.svg key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }} className="w-5 h-5" fill="none" viewBox="0 0 24 24">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </motion.svg>
          )}
        </AnimatePresence>

        {unread > 0 && !open && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full text-[10px] font-black flex items-center justify-center text-white">
            {unread}
          </span>
        )}
      </motion.button>
    </div>
  );
}
