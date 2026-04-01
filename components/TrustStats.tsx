"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const STATS = [
  { value:12400, suffix:"+", label:"Orders completed",  icon:"📦" },
  { value:68,    suffix:"",  label:"Cities worldwide",  icon:"🌍" },
  { value:3200,  suffix:"+", label:"Active travelers",  icon:"✈️" },
  { value:4.9,   suffix:"★", label:"Average rating",   icon:"⭐" },
];

function CountUp({ value, suffix }: { value:number; suffix:string }) {
  const [d, setD] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once:true, margin:"-60px" });
  useEffect(() => {
    if (!inView) return;
    const isDecimal = value % 1 !== 0;
    let cur = 0; let s = 0; const steps = 55; const dur = 1400;
    const t = setInterval(() => {
      s++; cur = Math.min(cur + value / steps, value);
      setDisplay(isDecimal ? parseFloat(cur.toFixed(1)) : Math.floor(cur));
      if (s >= steps) clearInterval(t);
    }, dur / steps);
    return () => clearInterval(t);
    function setDisplay(v: number) { setD(v); }
  }, [inView, value]);
  return <span ref={ref}>{value%1!==0 ? d.toFixed(1) : d.toLocaleString()}{suffix}</span>;
}

export default function TrustStats() {
  return (
    <section className="bg-accent border-t border-accent-hover py-section-sm">
      <div className="wrap">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-1">
          {STATS.map((s, i) => (
            <motion.div key={s.label}
              initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true, margin:"-40px" }}
              transition={{ duration:0.55, delay:i*0.07, ease:[0.22,1,0.36,1] }}
              className="text-center py-10 px-6"
            >
              <div className="text-4xl mb-3">{s.icon}</div>
              <div className="text-d3 font-black text-white tabular-nums tracking-tight">
                <CountUp value={s.value} suffix={s.suffix} />
              </div>
              <p className="text-sm font-medium text-white/70 mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
