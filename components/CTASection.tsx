"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const LINKS = [
  { label:"Browse",       href:"/browse"      },
  { label:"Post a Trip",  href:"/post-trip"    },
  { label:"How It Works", href:"/how-it-works" },
  { label:"Membership",   href:"/membership"   },
  { label:"Privacy",      href:"#"             },
  { label:"Terms",        href:"#"             },
];

export default function CTASection() {
  return (
    <>
      {/* CTA */}
      <section className="bg-stone border-t border-border py-section">
        <div className="wrap">
          <div className="relative bg-ink rounded-[2.5rem] overflow-hidden px-10 py-20 lg:py-28 text-center">

            {/* Glow effects */}
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(255,69,0,0.20), transparent)" }} />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-transparent via-accent/30 to-transparent" />

            <motion.p initial={{ opacity:0,y:12 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }}
              transition={{ duration:0.5 }} className="eyebrow mb-6 text-accent">
              Get started today — it&apos;s free
            </motion.p>

            <motion.h2 initial={{ opacity:0,y:28 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }}
              transition={{ duration:0.7, delay:0.08, ease:[0.22,1,0.36,1] }}
              className="text-d2 font-black text-white text-balance mb-6">
              Ready to carry,
              <br />
              <span className="text-gradient">or be carried?</span>
            </motion.h2>

            <motion.p initial={{ opacity:0,y:16 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }}
              transition={{ duration:0.55, delay:0.18 }}
              className="text-body-lg text-white/40 max-w-lg mx-auto mb-12 leading-relaxed">
              Join thousands of buyers and travelers already making the world
              a little smaller — one trip at a time.
            </motion.p>

            <motion.div initial={{ opacity:0,y:16 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }}
              transition={{ duration:0.55, delay:0.26 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link href="/browse"
                className="btn-primary text-[16px] px-10 py-4">
                Find a traveler
              </Link>
              <Link href="/post-trip" className="btn-ghost-white text-[16px] px-10 py-4">
                Post a trip
              </Link>
            </motion.div>

            <motion.p initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
              transition={{ duration:0.5, delay:0.4 }}
              className="mt-8 text-xs text-white/20">
              Free to join · No subscription fees · No hidden charges
            </motion.p>

            {/* Stats strip */}
            <motion.div initial={{ opacity:0, y:12 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
              transition={{ duration:0.5, delay:0.5 }}
              className="mt-14 pt-10 border-t border-white/8 grid grid-cols-2 sm:grid-cols-4 gap-6">
              {[
                { value:"12,400+", label:"Orders completed" },
                { value:"68",      label:"Cities worldwide" },
                { value:"3,200+",  label:"Active travelers" },
                { value:"4.9★",    label:"Average rating"  },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <p className="text-2xl font-black text-white tabular-nums">{s.value}</p>
                  <p className="text-xs text-white/35 mt-1">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone border-t border-border py-10">
        <div className="wrap flex flex-col md:flex-row items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-0.5 select-none">
            <span className="font-black text-ink text-base tracking-tight">handi</span>
            <span className="w-[5px] h-[5px] rounded-full bg-accent mb-1.5" />
          </Link>
          <div className="flex flex-wrap justify-center gap-5">
            {LINKS.map((l) => (
              <Link key={l.label} href={l.href}
                className="text-xs text-muted hover:text-ink transition-colors duration-150">
                {l.label}
              </Link>
            ))}
          </div>
          <p className="text-xs text-muted">© 2025 handi. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
