// Lightweight motion primitives — no animation library, just hooks
// using IntersectionObserver, requestAnimationFrame, and CSS transforms.
// All components degrade gracefully when JS or motion preference is reduced.
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

// ─── Count-up number — animates 0 → target when entering viewport ─────────
// Accepts numeric or string target. If string contains a non-digit prefix or
// suffix (e.g. "$1,840", "12,400+", "★ 4.92"), it preserves them verbatim.
export function CountUp({ to, duration = 1400, prefix = '', suffix = '', decimals = 0, className, style }) {
  const ref = useRef(null);
  const [value, setValue] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started) { setStarted(true); obs.disconnect(); }
    }, { threshold: 0.4 });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const start = performance.now();
    let raf;
    const tick = (t) => {
      const p = Math.min(1, (t - start) / duration);
      // ease-out cubic for the natural settle
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(to * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started, to, duration]);

  const formatted = value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return <span ref={ref} className={className} style={style}>{prefix}{formatted}{suffix}</span>;
}

// ─── Cursor-aware tilt (subtle 3D parallax on hover) ──────────────────────
// Wrap a card; the child element rotates a few degrees toward the cursor
// and lifts on hover. Reverts smoothly on leave.
export function TiltCard({ children, max = 6, scale = 1.01, perspective = 900, style, ...rest }) {
  const ref = useRef(null);
  const onMove = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;  // -0.5 .. 0.5
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    el.style.transform = `perspective(${perspective}px) rotateX(${-y * max}deg) rotateY(${x * max}deg) scale(${scale})`;
  }, [max, scale, perspective]);
  const onLeave = useCallback(() => {
    if (ref.current) ref.current.style.transform = `perspective(${perspective}px) rotateX(0) rotateY(0) scale(1)`;
  }, [perspective]);
  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} style={{
      transition: 'transform .35s cubic-bezier(.2,.7,.2,1)',
      transformStyle: 'preserve-3d',
      willChange: 'transform',
      ...style,
    }} {...rest}>{children}</div>
  );
}

// ─── Magnetic button — the inner content drifts toward the cursor ─────────
export function MagneticButton({ children, strength = 0.25, style, ...rest }) {
  const ref = useRef(null);
  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * strength;
    const y = (e.clientY - rect.top - rect.height / 2) * strength;
    el.style.transform = `translate(${x}px, ${y}px)`;
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = 'translate(0,0)';
  };
  return (
    <span ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} style={{
      display: 'inline-flex',
      transition: 'transform .25s cubic-bezier(.2,.7,.2,1)',
      willChange: 'transform',
      ...style,
    }} {...rest}>{children}</span>
  );
}

// ─── Page-transition wrapper — fades + slides children whenever pathname changes
export function PageTransition({ children }) {
  const { pathname } = useLocation();
  return (
    <div key={pathname} className="h-page-in">
      {children}
    </div>
  );
}

// ─── Scroll progress bar — thin line at top, fills 0→100% with scroll ────
export function ScrollProgress({ color = 'var(--rouge)' }) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const pct = h.scrollHeight - h.clientHeight > 0
        ? (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100
        : 0;
      setProgress(pct);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, height: 2,
      background: 'transparent', zIndex: 100, pointerEvents: 'none',
    }}>
      <div style={{
        height: '100%',
        width: `${progress}%`,
        background: color,
        transition: 'width .08s linear',
      }}/>
    </div>
  );
}

// ─── Word-staggered text reveal — splits a string by spaces and fades each
// in sequence. Useful for hero headlines.
export function StaggerText({ text, delay = 0, gap = 60, className, style }) {
  return (
    <span className={className} style={style}>
      {text.split(' ').map((w, i) => (
        <span key={i} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'baseline' }}>
          <span style={{
            display: 'inline-block',
            animation: `h-word-up .8s cubic-bezier(.2,.7,.2,1) both`,
            animationDelay: `${delay + i * gap}ms`,
          }}>{w}{i < text.split(' ').length - 1 ? ' ' : ''}</span>
        </span>
      ))}
    </span>
  );
}
