"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const FEATURES = [
  {
    icon: "🔍",
    title: "Browse traveler offers",
    body: "Search active trips by city or item. See exactly who's going where and what they can bring back for you.",
  },
  {
    icon: "✈️",
    title: "Post your trip & earn",
    body: "Already traveling? List your route and start date. Buyers in your network will request items directly from you.",
  },
  {
    icon: "🛒",
    title: "Order with one click",
    body: "Add items to cart, select your preferred handoff method, and pay securely. Funds are held until delivery.",
  },
  {
    icon: "🤝",
    title: "Flexible handoff options",
    body: "Choose from direct meetup, door delivery, or a courier relay. The last mile, handled your way.",
  },
  {
    icon: "⭐",
    title: "Trust built on reviews",
    body: "Every carrier has a public rating. Check completion rate, response time, and real reviews before you commit.",
  },
  {
    icon: "🛡️",
    title: "Buyer protection always on",
    body: "Payment is released only after you confirm receipt. Disputes are resolved within 24 hours by our team.",
  },
];

export default function SixIconsSection() {
  const sectionRef  = useRef<HTMLElement>(null);
  const stickyRef   = useRef<HTMLDivElement>(null);
  const mapRef      = useRef<HTMLDivElement>(null);
  const headRef     = useRef<HTMLDivElement>(null);
  const itemRefs    = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);

  useGSAP(() => {
    const items = itemRefs.current.filter(Boolean);

    /* ── Pin the sticky panel for 6 steps ── */
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start:   "top top",
      end:     () => `+=${window.innerHeight * 6}`,
      pin:     stickyRef.current,
      pinSpacing: false,
      anticipatePin: 1,
    });

    /* ── Fade in heading + map on enter ── */
    gsap.fromTo([headRef.current, mapRef.current],
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0, stagger: 0.15, duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      }
    );

    /* ── Each feature item highlights as user scrolls ── */
    items.forEach((el, i) => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start:   () => `top+=${i * window.innerHeight} top`,
        end:     () => `top+=${(i + 1) * window.innerHeight} top`,
        onEnter:      () => setActive(i),
        onEnterBack:  () => setActive(i),
      });

      /* Animate the item in from the right when its step is reached */
      gsap.fromTo(el,
        { x: 40, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 0.65, ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start:   () => `top+=${i * window.innerHeight * 0.9} top`,
            toggleActions: "play none none none",
          },
        }
      );
    });
  }, { scope: sectionRef });

  return (
    /* Outer section — tall enough to accommodate 6 scroll steps */
    <section ref={sectionRef} className="relative z-0 bg-stone" style={{ height: `${7 * 100}vh` }}>

      {/* Sticky panel (pinned) */}
      <div ref={stickyRef} className="h-screen flex flex-col lg:flex-row overflow-hidden">

        {/* ── Left: Map + heading ── */}
        <div className="relative lg:w-[55%] bg-ink-2 flex flex-col items-center justify-center p-10 lg:p-16 overflow-hidden">

          {/* Subtle grid lines */}
          <div className="absolute inset-0 opacity-[0.06]"
            style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "60px 60px" }}
          />

          {/* Section heading */}
          <div ref={headRef} className="text-center mb-10 relative z-10 opacity-0">
            <p className="eyebrow text-accent mb-4">How handi works</p>
            <h2 className="text-d2 font-black text-white text-balance">
              Six reasons<br />people choose us.
            </h2>
          </div>

          {/* The GIF — animated world map with 6 blue icons */}
          <div ref={mapRef} className="relative w-full max-w-[520px] opacity-0">
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-white/8 shadow-float">
              <Image
                src="/six-icons.gif"
                alt="handi platform features illustrated on world map"
                fill
                unoptimized
                priority
                className="object-cover"
              />
              {/* Dark gradient overlay for contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-ink-2/60 via-transparent to-transparent" />
            </div>

            {/* Step counter */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
              {FEATURES.map((_, i) => (
                <div key={i} className={`h-1 rounded-full transition-all duration-400 ${
                  i === active ? "w-6 bg-accent" : "w-1.5 bg-white/20"
                }`} />
              ))}
            </div>
          </div>

          {/* Current step label on mobile */}
          <div className="mt-10 lg:hidden text-center relative z-10">
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-accent/70 mb-2">Step {String(active + 1).padStart(2,"0")}</p>
            <h3 className="text-h1 text-white font-bold">{FEATURES[active].title}</h3>
          </div>
        </div>

        {/* ── Right: Feature list ── */}
        <div className="hidden lg:flex lg:w-[45%] bg-stone flex-col justify-center px-12 xl:px-16 gap-4">
          {FEATURES.map((f, i) => (
            <div
              key={i}
              ref={(el) => { itemRefs.current[i] = el; }}
              className={`group flex items-start gap-5 p-5 rounded-2xl transition-all duration-300 cursor-default opacity-0 ${
                i === active
                  ? "bg-white shadow-card border border-border/60"
                  : "hover:bg-warm"
              }`}
            >
              {/* Icon */}
              <div className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center text-2xl transition-all duration-300 ${
                i === active ? "bg-accent-light" : "bg-warm"
              }`}>
                {f.icon}
              </div>

              {/* Text */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-black tracking-widest text-accent/60 uppercase">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className={`font-bold transition-colors duration-200 ${
                    i === active ? "text-ink text-[16px]" : "text-muted text-[15px]"
                  }`}>
                    {f.title}
                  </h3>
                </div>
                <p className={`text-sm leading-relaxed transition-all duration-300 ${
                  i === active ? "text-muted max-h-20 opacity-100" : "text-transparent max-h-0 opacity-0 overflow-hidden"
                }`}>
                  {f.body}
                </p>
              </div>

              {/* Active indicator */}
              {i === active && (
                <div className="flex-shrink-0 mt-1">
                  <div className="w-2 h-2 rounded-full bg-accent" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Invisible scroll steps (one per feature) ── */}
      {FEATURES.map((_, i) => (
        <div key={i} style={{ height: "100vh" }} />
      ))}
    </section>
  );
}
