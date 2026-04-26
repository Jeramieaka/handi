"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/components/CartContext";
import { useZip } from "@/components/ZipContext";

const NAV = [
  { label: "Browse",        href: "/browse"       },
  { label: "Requests",      href: "/requests"     },
  { label: "Post a Trip",   href: "/post-trip"     },
  { label: "How It Works",  href: "/how-it-works"  },
];

export default function Navbar() {
  const [scrolled,  setScrolled]  = useState(false);
  const [open,      setOpen]      = useState(false);
  const [zipOpen,   setZipOpen]   = useState(false);
  const [zipInput,  setZipInput]  = useState("");
  const [user,      setUser]      = useState<string | null>(null);
  const pathname = usePathname();
  const isDark   = pathname === "/" && !scrolled;
  const { totalItems } = useCart();
  const { zip, setZip } = useZip();
  const zipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const u = sessionStorage.getItem("handi_user");
    if (u) setUser(u);
    const onStorage = () => {
      const usr = sessionStorage.getItem("handi_user");
      setUser(usr);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Close ZIP popover on outside click
  useEffect(() => {
    if (!zipOpen) return;
    const handler = (e: MouseEvent) => {
      if (zipRef.current && !zipRef.current.contains(e.target as Node)) {
        setZipOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [zipOpen]);

  const openZipEditor = () => {
    setZipInput(zip);
    setZipOpen(true);
  };

  const saveZip = () => {
    const val = zipInput.trim();
    if (val) setZip(val);
    setZipOpen(false);
  };

  const handleZipKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") saveZip();
    if (e.key === "Escape") setZipOpen(false);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || pathname !== "/"
          ? "bg-stone/95 backdrop-blur-xl border-b border-border"
          : "bg-transparent"
      }`}
    >

      <div className="wrap">
        <div className="flex items-center justify-between h-[64px]">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-0.5 group select-none">
            <span className={`text-lg font-black tracking-tight transition-colors ${isDark ? "text-white" : "text-ink"}`}>
              handi
            </span>
            <span className="w-[5px] h-[5px] rounded-full bg-accent mb-2 transition-transform group-hover:scale-150 duration-200" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV.map(({ label, href }) => {
              const active = pathname.startsWith(href);
              return (
                <Link key={href} href={href}
                  className={`relative text-sm font-medium transition-colors duration-150 group ${
                    active
                      ? "text-accent"
                      : isDark
                        ? "text-white/60 hover:text-white"
                        : "text-muted hover:text-ink"
                  }`}
                >
                  {label}
                  {/* underline on hover */}
                  <span className={`absolute -bottom-0.5 left-0 h-px bg-accent transition-all duration-300 ${active ? "w-full" : "w-0 group-hover:w-full"}`} />
                </Link>
              );
            })}
          </nav>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-3">

            {/* ZIP badge + popover */}
            <AnimatePresence>
              {zip && (
                <motion.div
                  ref={zipRef}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="relative"
                >
                  {/* Badge button */}
                  <button
                    onClick={openZipEditor}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[12px] font-semibold transition-all hover:border-accent/40 hover:text-accent group ${
                      isDark
                        ? "border-white/15 text-white/60 bg-white/6"
                        : "border-border text-muted bg-warm"
                    }`}
                  >
                    <svg className="w-3 h-3 text-accent flex-shrink-0" fill="none" viewBox="0 0 16 16">
                      <path d="M8 1.5C5.5 1.5 3.5 3.5 3.5 6c0 3.5 4.5 8.5 4.5 8.5S12.5 9.5 12.5 6c0-2.5-2-4.5-4.5-4.5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="8" cy="6" r="1.5" fill="currentColor"/>
                    </svg>
                    {zip}
                    {/* pencil icon on hover */}
                    <svg className="w-2.5 h-2.5 opacity-0 group-hover:opacity-60 transition-opacity -ml-0.5" fill="none" viewBox="0 0 16 16">
                      <path d="M11 2l3 3-8 8H3v-3l8-8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>

                  {/* Popover */}
                  <AnimatePresence>
                    {zipOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.97 }}
                        transition={{ duration: 0.18, ease: [0.22,1,0.36,1] }}
                        className="absolute top-full right-0 mt-2 w-56 bg-white rounded-2xl border border-border shadow-card p-4 z-50"
                      >
                        <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-muted mb-2">Your location</p>
                        <div className="flex gap-2">
                          <input
                            autoFocus
                            type="text"
                            value={zipInput}
                            onChange={e => setZipInput(e.target.value)}
                            onKeyDown={handleZipKey}
                            placeholder="ZIP / postal code"
                            className="flex-1 min-w-0 border border-border rounded-xl px-3 py-2 text-sm text-ink focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all"
                          />
                          <button
                            onClick={saveZip}
                            className="flex-shrink-0 w-9 h-9 rounded-xl bg-accent text-white flex items-center justify-center hover:bg-accent-hover transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
                              <path d="M3 8l4 4 6-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </button>
                        </div>
                        <p className="text-[11px] text-muted mt-2">Press Enter to save</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>

            {user ? (
              <Link href="/membership" className="flex items-center gap-2 group">
                <div className="w-8 h-8 rounded-full bg-accent/15 flex items-center justify-center text-accent font-black text-[13px] ring-2 ring-accent/20 group-hover:ring-accent/40 transition-all">
                  {user[0]}
                </div>
                <span className={`text-sm font-semibold transition-colors ${isDark ? "text-white/80 group-hover:text-white" : "text-ink/80 group-hover:text-ink"}`}>
                  {user}
                </span>
              </Link>
            ) : (
              <Link href="/signin"
                className={`text-sm font-medium transition-colors ${
                  isDark ? "text-white/60 hover:text-white" : "text-muted hover:text-ink"
                }`}
              >
                Sign in
              </Link>
            )}

            {/* Cart icon */}
            <Link href="/cart" className="relative flex items-center justify-center w-9 h-9 rounded-full hover:bg-accent/10 transition-colors">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <svg className={`w-5 h-5 transition-colors ${isDark ? "text-white/70" : "text-ink/70"}`} fill="none" viewBox="0 0 24 24">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                  <path d="M16 10a4 4 0 01-8 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.div>
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span
                    key="badge"
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 20 }}
                    className="absolute -top-0.5 -right-0.5 bg-accent text-white text-[10px] font-black rounded-full w-4 h-4 flex items-center justify-center leading-none"
                  >
                    {totalItems > 9 ? "9+" : totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link href="/browse" className="btn-sm shadow-none px-5 py-2.5">
                Get started
              </Link>
            </motion.div>
          </div>

          {/* Mobile: cart + burger */}
          <div className="md:hidden flex items-center gap-2">
            <Link href="/cart" className="relative w-9 h-9 flex items-center justify-center">
              <svg className={`w-5 h-5 ${isDark ? "text-white/70" : "text-ink/70"}`} fill="none" viewBox="0 0 24 24">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                <path d="M16 10a4 4 0 01-8 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-accent text-white text-[10px] font-black rounded-full w-4 h-4 flex items-center justify-center">
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </Link>
            <button
              onClick={() => setOpen(!open)}
              className="w-10 h-10 flex flex-col items-center justify-center gap-[5px]"
              aria-label="Menu"
            >
              {[0,1,2].map((i) => (
                <span key={i} className={`block h-[1.5px] rounded-full transition-all duration-300 ${isDark ? "bg-white" : "bg-ink"} ${
                  i === 1 ? "w-[18px]" : "w-6"
                } ${open && i===0 ? "rotate-45 translate-y-[6.5px] w-[18px]" : ""}
                  ${open && i===1 ? "opacity-0 scale-x-0" : ""}
                  ${open && i===2 ? "-rotate-45 -translate-y-[6.5px] w-[18px]" : ""}`}
                />
              ))}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden overflow-hidden bg-stone border-t border-border"
          >
            <div className="wrap py-5 space-y-1">
              {NAV.map(({ label, href }) => (
                <Link key={href} href={href} onClick={() => setOpen(false)}
                  className={`block py-3 text-[15px] font-medium border-b border-border/50 last:border-0 ${
                    pathname.startsWith(href) ? "text-accent" : "text-ink hover:text-accent"
                  } transition-colors`}
                >
                  {label}
                </Link>
              ))}
              <div className="flex gap-3 pt-4">
                {user ? (
                  <Link href="/membership" className="btn-outline py-3 px-5 text-sm flex-1 justify-center">
                    {user}
                  </Link>
                ) : (
                  <Link href="/signin" className="btn-outline py-3 px-5 text-sm flex-1 justify-center">Sign in</Link>
                )}
                <Link href="/browse" className="btn-primary py-3 px-5 text-sm flex-1 justify-center">Get started</Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
