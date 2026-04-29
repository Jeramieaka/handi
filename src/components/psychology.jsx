import React, { useState, useEffect, useRef } from 'react';
import { HVerified } from './primitives';

// handi — Psychology layer components
// Subtle, premium-grade conversion devices grounded in trust.
// Every component is designed to feel editorial, not sales-y.

// ──────────────────────────────────────────────────────────
// HHoldTimer — Endowment effect
// "Reserved for you" countdown. Feels like a concierge holding a table,
// not a pushy timer. Resets when user interacts.
// ──────────────────────────────────────────────────────────
export function HHoldTimer({ minutes = 15, label = 'Reserved for you', compact = false }) {
  const [secs, setSecs] = useState(minutes * 60);
  useEffect(() => {
    setSecs(minutes * 60);
    const id = setInterval(() => setSecs(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [minutes]);
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  // Guard against minutes=0 — prevents NaN that would break the progress bar.
  const pct = minutes > 0 ? (secs / (minutes * 60)) * 100 : 0;

  if (compact) {
    return (
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 11, fontFamily: 'var(--font-mono)', letterSpacing: '.08em', color: 'var(--rouge-deep)', textTransform: 'uppercase' }}>
        <span style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--rouge)' }} className="h-pulse"/>
        Held · {String(m).padStart(2,'0')}:{String(s).padStart(2,'0')}
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '12px 16px',
      background: 'var(--paper)',
      border: '1px solid var(--line-2)',
      borderRadius: 'var(--r-md)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', left: 0, bottom: 0, height: 2, width: `${pct}%`, background: 'var(--rouge)', transition: 'width 1s linear' }}/>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--rouge)" strokeWidth="1.6">
        <circle cx="12" cy="12" r="9"/>
        <path d="M12 7v5l3 2"/>
      </svg>
      <div style={{ flex: 1 }}>
        <div className="h-mono" style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: '.1em', textTransform: 'uppercase' }}>{label}</div>
        <div style={{ fontSize: 14, marginTop: 2, fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>
          {String(m).padStart(2,'0')}:{String(s).padStart(2,'0')} <span style={{ fontSize: 11, color: 'var(--ink-3)', fontFamily: 'var(--font-mono)', letterSpacing: '.08em' }}>· auto-releases</span>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// HCarrierTrust — Authority dossier
// Compact "credentials" stack — verifications, trips, escrow record.
// Frames the carrier as a vetted professional, not a stranger.
// ──────────────────────────────────────────────────────────
export function HCarrierTrust({ name = 'James L.', verifications = [], stats = [], compact = false }) {
  const defaultV = verifications.length ? verifications : [
    { k: 'ID', v: 'Government photo ID' },
    { k: 'Selfie', v: 'Liveness matched' },
    { k: 'Phone', v: '+81 verified' },
    { k: 'Payout', v: 'Stripe Connect' },
  ];
  const defaultS = stats.length ? stats : [
    { k: '23', v: 'Trips completed' },
    { k: '100%', v: 'Receipt photos' },
    { k: '0', v: 'Disputes' },
    { k: '4h', v: 'Avg reply time' },
  ];

  return (
    <div style={{
      border: '1px solid var(--line)',
      borderRadius: 'var(--r-lg)',
      overflow: 'hidden',
      background: 'var(--paper)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderBottom: '1px solid var(--line)', background: 'var(--paper-2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <HVerified size={13}/>
          <span className="h-mono" style={{ fontSize: 11, color: 'var(--rouge-deep)', letterSpacing: '.12em', textTransform: 'uppercase' }}>Verified Carrier</span>
        </div>
        <span className="h-mono" style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: '.08em' }}>TRUST · 98 / 100</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: '1px solid var(--line)' }}>
        {defaultV.map((row, i) => (
          <div key={row.k} style={{
            padding: '14px 18px',
            borderRight: i % 2 === 0 ? '1px solid var(--line)' : 'none',
            borderBottom: i < 2 ? '1px solid var(--line)' : 'none',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="var(--rouge)"><path d="M9 16.2l-3.5-3.5L4 14.2 9 19.2 20 8.2 18.5 6.7z"/></svg>
            <div>
              <div style={{ fontSize: 13, color: 'var(--ink)', fontWeight: 500 }}>{row.k}</div>
              <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>{row.v}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
        {defaultS.map((s, i) => (
          <div key={s.v} style={{ padding: '16px 12px', textAlign: 'center', borderRight: i < 3 ? '1px solid var(--line)' : 'none' }}>
            <div className="h-serif" style={{ fontSize: 22, lineHeight: 1 }}>{s.k}</div>
            <div className="h-mono" style={{ fontSize: 9, color: 'var(--ink-3)', letterSpacing: '.08em', textTransform: 'uppercase', marginTop: 4 }}>{s.v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// HAnchorPrice — Anchoring effect
// Shows local retail vs handi "all-in" so the comparison is built into the page.
// Highlights savings without screaming.
// ──────────────────────────────────────────────────────────
export function HAnchorPrice({ retail = 120, fee = 35, localResale = 240, currency = '$' }) {
  const handiTotal = retail + fee;
  // Guard against handi being more expensive than the anchor (which would
  // produce a negative savings %). Display 0% in that edge case rather than
  // a misleading "−25% savings".
  const saved = Math.max(0, localResale - handiTotal);
  const savedPct = saved > 0 && localResale > 0 ? Math.round((saved / localResale) * 100) : 0;

  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '1fr auto 1fr',
      gap: 16, alignItems: 'center',
      padding: '16px 18px',
      background: 'var(--paper-2)',
      borderRadius: 'var(--r-md)',
      border: '1px dashed var(--line-2)',
    }}>
      <div>
        <div className="h-mono" style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: '.1em', textTransform: 'uppercase' }}>Local resale (NYC)</div>
        <div className="h-serif" style={{ fontSize: 22, color: 'var(--ink-3)', textDecoration: 'line-through', textDecorationThickness: 1, marginTop: 4, lineHeight: 1 }}>{currency}{localResale}</div>
      </div>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--rouge)" strokeWidth="1.5"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
      <div style={{ textAlign: 'right' }}>
        <div className="h-mono" style={{ fontSize: 10, color: 'var(--rouge-deep)', letterSpacing: '.1em', textTransform: 'uppercase' }}>handi all-in</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, justifyContent: 'flex-end' }}>
          <span className="h-serif" style={{ fontSize: 28, color: 'var(--ink)', lineHeight: 1, marginTop: 4 }}>{currency}{handiTotal}</span>
          <span style={{ fontSize: 11, color: 'var(--rouge-deep)', fontFamily: 'var(--font-mono)', letterSpacing: '.06em' }}>SAVE {savedPct}%</span>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// HMicroSave — Micro-commitment
// Subtle "Save for later" toggle. Counts up. The act of saving
// creates light commitment that boosts return-conversion.
// ──────────────────────────────────────────────────────────
export function HMicroSave({ initialCount = 0, label = 'Save', size = 'md' }) {
  const [saved, setSaved] = useState(false);
  const [count, setCount] = useState(initialCount);
  const px = size === 'sm' ? 32 : 40;

  return (
    <button
      onClick={(e) => { e.stopPropagation(); setSaved(s => !s); setCount(c => saved ? c - 1 : c + 1); }}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        padding: size === 'sm' ? '6px 10px' : '10px 14px',
        background: saved ? 'var(--rouge-soft)' : 'var(--paper)',
        border: '1px solid', borderColor: saved ? 'var(--rouge)' : 'var(--line-2)',
        borderRadius: 'var(--r-pill)', cursor: 'pointer',
        color: saved ? 'var(--rouge-deep)' : 'var(--ink-2)',
        fontSize: 12, fontWeight: 500,
        transition: 'all .2s cubic-bezier(.2,.7,.2,1)',
      }}>
      <svg width="13" height="13" viewBox="0 0 24 24" fill={saved ? 'var(--rouge)' : 'none'} stroke={saved ? 'var(--rouge)' : 'currentColor'} strokeWidth="1.6">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
      </svg>
      <span>{saved ? 'Saved' : label}</span>
      {count > 0 && <span style={{ color: 'var(--ink-3)', fontFamily: 'var(--font-mono)', fontSize: 11 }}>· {count}</span>}
    </button>
  );
}

// ──────────────────────────────────────────────────────────
// HLiveActivity — Live social proof (subtle ticker)
// "Maya from Brooklyn reserved · 2 min ago"
// Cycles every 6s. Editorial typography, not toasts.
// ──────────────────────────────────────────────────────────
// TODO(post-backend): replace static `data` with a real-time stream pulled from
// the activity feed (recent reservations / receipts / signups). Until the
// backend is live, the rotating sample set below stands in.
export function HLiveActivity({ events, position = 'inline' }) {
  const data = events || [
    { who: 'Maya', where: 'Brooklyn', what: 'reserved a Tokyo carry', when: '2 min ago' },
    { who: 'Daniel', where: 'Boston', what: 'confirmed receipt from Paris', when: '4 min ago' },
    { who: 'Sora', where: 'San Francisco', what: 'saved this carrier', when: '7 min ago' },
    { who: 'Lin', where: 'Vancouver', what: 'just signed up', when: '11 min ago' },
    { who: 'Robin', where: 'Austin', what: 'booked Seoul → SF', when: '14 min ago' },
  ];
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI(x => (x + 1) % data.length), 5500);
    return () => clearInterval(id);
  }, [data.length]);
  const e = data[i];

  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 10,
      padding: '8px 14px',
      background: 'rgba(255,255,255,.85)',
      border: '1px solid var(--line)',
      borderRadius: 999,
      fontSize: 12,
      backdropFilter: 'saturate(140%) blur(10px)',
      boxShadow: '0 1px 0 rgba(0,0,0,.02)',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--rouge)' }} className="h-pulse"/>
      <span key={i} style={{ animation: 'h-fade-up .4s cubic-bezier(.2,.7,.2,1)' }}>
        <b style={{ fontWeight: 500 }}>{e.who}</b> <span style={{ color: 'var(--ink-3)' }}>· {e.where}</span> {e.what}
      </span>
      <span className="h-mono" style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: '.06em' }}>{e.when}</span>
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// HRetailAnchor — Tiny inline anchor for cards
// "Retail $120 · You save $52 with handi"
// ──────────────────────────────────────────────────────────
export function HRetailAnchor({ retail, you, currency = '$' }) {
  const save = retail - you;
  if (save <= 0) return null;
  return (
    <div className="h-mono" style={{ fontSize: 10, letterSpacing: '.08em', color: 'var(--ink-3)' }}>
      <span style={{ textDecoration: 'line-through' }}>{currency}{retail}</span>
      <span style={{ color: 'var(--rouge-deep)', marginLeft: 8 }}>↓ SAVE {currency}{save}</span>
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// HSlotBar — Scarcity (slots remaining)
// Subtle progress bar — not "ONLY 2 LEFT!!!" red banner.
// ──────────────────────────────────────────────────────────
export function HSlotBar({ taken, total, label = 'slots taken' }) {
  const pct = (taken / total) * 100;
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontFamily: 'var(--font-mono)', letterSpacing: '.06em', color: 'var(--ink-3)', textTransform: 'uppercase', marginBottom: 6 }}>
        <span>{taken} of {total} {label}</span>
        <span style={{ color: total - taken <= 2 ? 'var(--rouge-deep)' : 'var(--ink-3)' }}>
          {total - taken} left
        </span>
      </div>
      <div style={{ height: 3, background: 'var(--paper-3)', borderRadius: 999, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: 'var(--ink)', transition: 'width .8s cubic-bezier(.2,.7,.2,1)' }}/>
      </div>
    </div>
  );
}

