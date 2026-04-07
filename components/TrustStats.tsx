"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const STATS = [
  { value:12400, suffix:"+", label:"Orders completed",  icon:"📦", gradient:"from-blue-500/20 to-cyan-500/10" },
  { value:68,    suffix:"",  label:"Cities worldwide",  icon:"🌍", gradient:"from-indigo-500/20 to-blue-500/10" },
  { value:3200,  suffix:"+", label:"Active travelers",  icon:"✈️", gradient:"from-sky-500/20 to-blue-500/10" },
  { value:4.9,   suffix:"★", label:"Average rating",   icon:"⭐", gradient:"from-blue-400/20 to-indigo-500/10" },
];

function CountUp({ value, suffix }: { value:number; suffix:string }) {
  const [d, setD] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once:true, margin:"-60px" });
  useEffect(() => {
    if (!inView) return;
    const isDecimal = value % 1 !== 0;
    let cur = 0; let s = 0; const steps = 60; const dur = 1600;
    const t = setInterval(() => {
      s++;
      // Ease-out: fast at start, slow at end
      const progress = 1 - Math.pow(1 - s / steps, 3);
      cur = value * progress;
      setDisplay(isDecimal ? parseFloat(cur.toFixed(1)) : Math.floor(cur));
      if (s >= steps) { setDisplay(isDecimal ? value : Math.floor(value)); clearInterval(t); }
    }, dur / steps);
    return () => clearInterval(t);
    function setDisplay(v: number) { setD(v); }
  }, [inView, value]);
  return <span ref={ref}>{value%1!==0 ? d.toFixed(1) : d.toLocaleString()}{suffix}</span>;
}

export default function TrustStats() {
  return (
    <section className="bg-ink border-t border-white/5 py-section">
      <div className="wrap">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="eyebrow mb-4 text-accent">By the numbers</p>
          <h2 className="text-d3 font-black text-white">Built on trust.</h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 28, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22,1,0.36,1] }}
              whileHover={{ y: -4, transition: { duration: 0.25 } }}
              className={`relative rounded-2xl border border-white/8 p-8 text-center overflow-hidden bg-gradient-to-br ${s.gradient}`}
              style={{ background: `linear-gradient(135deg, rgba(255,82,20,0.10) 0%, rgba(18,14,10,0.80) 100%)` }}
            >
              {/* Subtle border glow on hover */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: "radial-gradient(circle at 50% 0%, rgba(255,69,0,0.15), transparent 70%)" }} />

              <div className="text-3xl mb-4">{s.icon}</div>
              <div className="text-d3 font-black tabular-nums tracking-tight text-gradient mb-2">
                <CountUp value={s.value} suffix={s.suffix} />
              </div>
              <p className="text-sm font-medium text-white/50">{s.label}</p>

              {/* Decorative line */}
              <motion.div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] rounded-full"
                style={{ background: "linear-gradient(90deg, transparent, rgba(255,69,0,0.7), transparent)" }}
                initial={{ width: 0 }}
                whileInView={{ width: "60%" }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 + i * 0.1 }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
