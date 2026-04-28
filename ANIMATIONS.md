# handi — Animation Specs

A reference for the motion system. Animations are subtle, purposeful, and editorial — never decorative.

## Tokens
- **Ease:** `cubic-bezier(.2, .7, .2, 1)` (out) for entries; `cubic-bezier(.6, 0, .2, 1)` for transitions.
- **Durations:** 180ms (micro), 600–800ms (scroll reveals), 1200ms (hero crossfades).

## Implemented in this prototype

### 1. Hero city crossfade (Landing)
Five city backdrops auto-rotate every 4s with a 1.2s opacity crossfade. Click any city pill to jump. The pulse dot uses `h-pulse-rouge` — rouge → transparent ring at 2s loop.

### 2. Marquee ticker
"Tokyo → NYC · 12 carriers" strip uses `h-marquee` (40s linear infinite) with the content duplicated 2× so it never visibly seams.

### 3. Scroll reveals
`<HScrollReveal>` uses IntersectionObserver (threshold 0.15). Children fade in + translateY(16→0) over 800ms. Stagger via `delay={i * 80}` for grids.

### 4. Card hover lift
Item cards translateY(-2px) + box-shadow on hover, 200ms.

### 5. Button hover
Primary button: ink → rouge background, translateY(-1px), rouge shadow at 180ms.

### 6. Order timeline
Active step gets a rouge ring (`4px solid rouge-soft`) — visually pulses by being the only one with a ring.

## Recommended additions (post-prototype)

### 7. Plane in flight
On Dashboard's flight tracker, the plane SVG follows the curved path:
```js
// Use Popmotion's animate({ from: 0, to: 1, duration: 8000, repeat: Infinity })
// + offsetPath: path("M 0 30 Q 50% 0 100% 30")
// + offset-distance going 0% → 100% in a continuous loop with 1.5s pause at end
```

### 7. "Confirm receipt" celebration
On confirm, the rouge timeline node bursts into 12 rouge particles (8px circles, scale 0→1, opacity 1→0, random radial direction over 800ms). Use Stage + Sprite from animations.jsx.

### 8. Add-to-cart fly
When clicking "Reserve", the product image clones, scales 0.3, and animates from button position to the cart icon in nav (top-right) using FLIP. ~600ms with overshoot.

### 9. Map flight path (Profile)
Profile cover hero shows a great-circle arc between cities — animate stroke-dasharray over 2s on first scroll into view.

### 10. Skeleton loading
On Browse, show 8 skeleton cards with `linear-gradient(90deg, paper-2 0%, paper-3 50%, paper-2 100%)` shimmer at 1.5s loop while items fetch.

### 11. Typing indicator (Messages)
Three dots bouncing — each `keyframes` of `translateY(0,-4px,0)` at 0/150/300ms delay, 1.2s loop.

### 12. Number count-up (Wallet, Stats)
`$3,640` counts from 0 over 1200ms when visible, easeOutExpo. Use `requestAnimationFrame` lerp.

### 13. Page transitions
Use View Transitions API (`document.startViewTransition`) on route change. Names items by route key for shared-element morphs (item card → detail hero).

### 14. Scroll-trigger flight path on Landing
As user scrolls past the stats section, draw a dashed great-circle arc from "Tokyo" pill on the left to "NYC" on the right — `pathLength` animation over 1.5s.

## Where to add what
| Page | Animation | Purpose |
|---|---|---|
| Landing | Hero crossfade, marquee, scroll reveals | Editorial polish |
| Landing | Map flight arc on scroll | Visual metaphor |
| Browse | Skeleton shimmer, card stagger fade | Perceived speed |
| Detail | Image gallery crossfade, "Reserve" fly-to-cart | Delight |
| Dashboard | Plane on path, count-up numbers | Storytelling |
| Order Detail | Timeline node ring pulse, dispute reveal | Trust + status |
| Messages | Typing dots, message slide-in | Real-time feel |
| Wallet | Balance count-up, transaction stagger | Editorial weight |
| Membership | Card hover scale on Best plan | Conversion |
