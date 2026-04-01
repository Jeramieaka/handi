"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const PINS = [
  { city: "New York", left: "21%", top: "37%", dir: "left"  as const },
  { city: "London",   left: "46%", top: "29%", dir: "left"  as const },
  { city: "Paris",    left: "49%", top: "32%", dir: "right" as const },
  { city: "Seoul",    left: "76%", top: "35%", dir: "left"  as const },
  { city: "Tokyo",    left: "79%", top: "38%", dir: "right" as const },
];

export default function WorldMapSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const mapRef     = useRef<HTMLDivElement>(null);
  const headRef    = useRef<HTMLDivElement>(null);
  const chipsRef   = useRef<HTMLDivElement>(null);
  const pinRefs    = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start:   "top top",
        end:     "+=700",
        pin:     true,
        scrub:   0.9,
        anticipatePin: 1,
      },
    });

    tl.fromTo(headRef.current,
      { y: 30, opacity: 0 },
      { y: 0,  opacity: 1, duration: 0.25, ease: "power2.out" },
      0
    );
    tl.fromTo(mapRef.current,
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1,   duration: 0.35, ease: "power2.out" },
      0.1
    );
    pinRefs.current.forEach((pin, i) => {
      if (!pin) return;
      tl.fromTo(pin,
        { opacity: 0, scale: 0, transformOrigin: "bottom center" },
        { opacity: 1, scale: 1, duration: 0.15, ease: "back.out(2.2)" },
        0.38 + i * 0.12
      );
    });
    tl.fromTo(chipsRef.current,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0,  duration: 0.2 },
      0.9
    );
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen bg-brand-dark overflow-hidden flex flex-col items-center justify-center"
    >
      {/* Subtle radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_55%,rgba(232,68,10,0.08),transparent)] pointer-events-none" />

      {/* Section header */}
      <div ref={headRef} className="text-center mb-10 px-6 opacity-0 z-10">
        <p className="text-xs font-bold tracking-[0.2em] uppercase text-brand-orange mb-4">
          Global reach
        </p>
        <h2 className="text-display-md font-black text-white tracking-display">
          Travelers active in
          <br />
          <span className="text-brand-orange">68 cities worldwide.</span>
        </h2>
        <p className="mt-4 text-[15px] text-white/45 max-w-md mx-auto leading-relaxed">
          Scroll to see where the handi network spans right now.
        </p>
      </div>

      {/* Map */}
      <div ref={mapRef} className="relative w-full max-w-5xl px-6 opacity-0 z-10">
        <div className="relative w-full aspect-[150/84]">
          <Image
            src="/world-map.gif"
            alt="World map"
            fill
            unoptimized
            priority
            className="object-contain select-none"
            style={{ opacity: 0.35, filter: "brightness(2) saturate(0)" }}
          />

          {/* City pins */}
          {PINS.map((pin, i) => (
            <div
              key={pin.city}
              ref={(el) => { pinRefs.current[i] = el; }}
              className="absolute opacity-0"
              style={{ left: pin.left, top: pin.top, transform: "translate(-50%,-100%)" }}
            >
              {/* Label */}
              <div className={`absolute bottom-full mb-1.5 whitespace-nowrap
                bg-white/10 backdrop-blur-sm border border-white/15 rounded-full
                px-2.5 py-1 text-[11px] font-semibold text-white
                flex items-center gap-1.5
                ${pin.dir === "right" ? "left-0" : "right-0"}`}
              >
                <span className="w-1 h-1 rounded-full bg-brand-orange" />
                {pin.city}
              </div>

              {/* Dot + stem */}
              <div className="flex flex-col items-center">
                <div className="relative w-4 h-4 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-brand-orange/25 animate-ping" />
                  <div className="w-2.5 h-2.5 rounded-full bg-brand-orange shadow-[0_0_8px_rgba(232,68,10,0.8)] z-10" />
                </div>
                <div className="w-px h-2.5 bg-brand-orange/50" />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom chips */}
        <div ref={chipsRef} className="flex flex-wrap justify-center gap-3 mt-8 opacity-0">
          {[
            { icon: "🌍", text: "68 cities" },
            { icon: "✈️", text: "3,200+ travelers" },
            { icon: "📦", text: "12,400+ orders" },
            { icon: "⭐", text: "4.9 avg rating" },
          ].map((c) => (
            <div
              key={c.text}
              className="flex items-center gap-2 bg-white/6 border border-white/10 rounded-full px-4 py-2 text-sm font-medium text-white/70"
            >
              <span className="text-base">{c.icon}</span>
              {c.text}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
