"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/components/CartContext";

const NAV = [
  { label: "Browse",        href: "/browse"       },
  { label: "Post a Trip",   href: "/post-trip"     },
  { label: "How It Works",  href: "/how-it-works"  },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open,     setOpen]     = useState(false);
  const pathname = usePathname();
  const isDark   = pathname === "/" && !scrolled;
  const { totalItems } = useCart();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1,  y: 0   }}
      transition={{ duration: 0.6, ease: [0.22,1,0.36,1] }}
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
                  className={`text-sm font-medium transition-colors duration-150 ${
                    active
                      ? "text-accent"
                      : isDark
                        ? "text-white/60 hover:text-white"
                        : "text-muted hover:text-ink"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/membership"
              className={`text-sm font-medium transition-colors ${
                isDark ? "text-white/60 hover:text-white" : "text-muted hover:text-ink"
              }`}
            >
              Sign in
            </Link>

            {/* Cart icon */}
            <Link href="/cart" className="relative flex items-center justify-center w-9 h-9 rounded-full hover:bg-white/10 transition-colors">
              <svg className={`w-5 h-5 transition-colors ${isDark ? "text-white/70" : "text-ink/70"}`} fill="none" viewBox="0 0 24 24">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                <path d="M16 10a4 4 0 01-8 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span
                    key="badge"
                    initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                    className="absolute -top-0.5 -right-0.5 bg-accent text-white text-[10px] font-black rounded-full w-4 h-4 flex items-center justify-center leading-none"
                  >
                    {totalItems > 9 ? "9+" : totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            <Link href="/browse" className="btn-sm shadow-none px-5 py-2.5">
              Get started
            </Link>
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
                <Link href="/membership" className="btn-outline py-3 px-5 text-sm flex-1 justify-center">Sign in</Link>
                <Link href="/browse" className="btn-primary py-3 px-5 text-sm flex-1 justify-center">Get started</Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
