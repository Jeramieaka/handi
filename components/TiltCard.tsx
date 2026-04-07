"use client";

import { useRef, useState } from "react";
import { motion, useSpring } from "framer-motion";

interface Props {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}

export default function TiltCard({ children, className = "", intensity = 8 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });

  const rotateX = useSpring(0, { stiffness: 300, damping: 28 });
  const rotateY = useSpring(0, { stiffness: 300, damping: 28 });
  const scale   = useSpring(1, { stiffness: 300, damping: 28 });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;   // 0–1
    const y = (e.clientY - rect.top)  / rect.height;   // 0–1
    rotateX.set((0.5 - y) * intensity * 2);
    rotateY.set((x - 0.5) * intensity * 2);
    setGlowPos({ x: x * 100, y: y * 100 });
  };

  const onLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    scale.set(1);
    setGlowPos({ x: 50, y: 50 });
  };

  const onEnter = () => scale.set(1.02);

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onMouseEnter={onEnter}
      style={{ rotateX, rotateY, scale, transformStyle: "preserve-3d", transformPerspective: 800 }}
      className={`relative ${className}`}
    >
      {children}
      {/* Specular highlight that follows cursor */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300 opacity-0 hover:opacity-100"
        style={{
          background: `radial-gradient(circle at ${glowPos.x}% ${glowPos.y}%, rgba(255,255,255,0.07) 0%, transparent 60%)`,
        }}
      />
    </motion.div>
  );
}
