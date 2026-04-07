"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [visible, setVisible] = useState(false);
  const [variant, setVariant] = useState<"default" | "hover" | "click">("default");
  const [label, setLabel] = useState("");

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Dot — instant
  const dotX = useSpring(mouseX, { stiffness: 2000, damping: 80 });
  const dotY = useSpring(mouseY, { stiffness: 2000, damping: 80 });

  // Ring — slightly lagged
  const ringX = useSpring(mouseX, { stiffness: 280, damping: 28 });
  const ringY = useSpring(mouseY, { stiffness: 280, damping: 28 });

  useEffect(() => {
    // Only show on pointer devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const move = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setVisible(true);
    };

    const out = () => setVisible(false);

    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const interactive = t.closest("a, button, [role='button'], input, textarea, select");
      if (interactive) {
        const cursorLabel = interactive.getAttribute("data-cursor-label") || "";
        setLabel(cursorLabel);
        setVariant("hover");
      } else {
        setLabel("");
        setVariant("default");
      }
    };

    const down = () => setVariant("click");
    const up = () => setVariant(label ? "hover" : "default");

    document.addEventListener("mousemove", move);
    document.addEventListener("mouseleave", out);
    document.addEventListener("mouseover", over);
    document.addEventListener("mousedown", down);
    document.addEventListener("mouseup", up);

    return () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseleave", out);
      document.removeEventListener("mouseover", over);
      document.removeEventListener("mousedown", down);
      document.removeEventListener("mouseup", up);
    };
  }, [mouseX, mouseY, label]);

  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) return null;

  const ringSize = variant === "hover" ? 44 : variant === "click" ? 28 : 36;
  const ringOpacity = variant === "click" ? 0.5 : 0.6;

  return (
    <>
      {/* Main dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full mix-blend-difference"
        style={{
          x: dotX,
          y: dotY,
          translateX: "-50%",
          translateY: "-50%",
          width: variant === "hover" ? 8 : 6,
          height: variant === "hover" ? 8 : 6,
          background: "#fff",
          opacity: visible ? 1 : 0,
          transition: "width 0.2s, height 0.2s, opacity 0.3s",
        }}
      />

      {/* Ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998] rounded-full border"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
          width: ringSize,
          height: ringSize,
          borderColor: variant === "hover" ? "rgba(47,111,235,0.7)" : "rgba(255,255,255,0.4)",
          opacity: visible ? ringOpacity : 0,
          scale: variant === "click" ? 0.85 : 1,
          transition: "width 0.25s cubic-bezier(0.22,1,0.36,1), height 0.25s cubic-bezier(0.22,1,0.36,1), border-color 0.2s, opacity 0.3s, scale 0.15s",
        }}
      >
        {/* Label inside ring when hovering */}
        {label && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-white uppercase tracking-widest"
          >
            {label}
          </motion.span>
        )}
      </motion.div>
    </>
  );
}
