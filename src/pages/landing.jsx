import React, { useState, useEffect, useRef } from 'react';
import { HD } from '../data/sample';
import { HAvatar, HStars, HVerified, HNav, HFooter, HSectionHead, HItemCard } from '../components/primitives';

// Landing — full bleed editorial hero, scroll-triggered sections
const { useState: useStateL, useEffect: useEffectL, useRef: useRefL } = React;

export function HScrollReveal({ children, delay = 0, y = 16 }) {
  const ref = useRefL(null);
  const [vis, setVis] = useStateL(false);
  useEffectL(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.15 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? 'translateY(0)' : `translateY(${y}px)`,
      transition: `opacity .8s cubic-bezier(.2,.7,.2,1) ${delay}ms, transform .8s cubic-bezier(.2,.7,.2,1) ${delay}ms`,
    }}>{children}</div>
  );
}

export function PageLanding() {
  const [heroIdx, setHeroIdx] = useStateL(0);
  const cities = HD.cities;

  useEffectL(() => {
    const id = setInterval(() => setHeroIdx(i => (i + 1) % cities.length), 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="h-app" style={{ width: '100%' }}>
      <HNav active="" />

      {/* HERO */}
      <section style={{ position: 'relative', minHeight: 760, padding: '80px 40px 120px', overflow: 'hidden' }}>
        {/* Cycling backdrop */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          {cities.map((c, i) => (
            <div key={c.code} style={{
              position: 'absolute', inset: 0,
              backgroundImage: `linear-gradient(180deg, rgba(250,248,244,.5), rgba(250,248,244,.92) 60%, var(--paper)), url(${c.hero})`,
              backgroundSize: 'cover', backgroundPosition: 'center',
              opacity: i === heroIdx ? 1 : 0,
              transition: 'opacity 1.2s ease',
            }}/>
          ))}
        </div>

        <div style={{ position: 'relative', maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 80 }}>
            <span style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--rouge)', boxShadow: '0 0 0 4px rgba(139,30,45,.15)' }} className="h-pulse"/>
            <span className="h-eyebrow">Live · 31 carriers in flight · 68 cities</span>
          </div>

          <h1 className="h-display" style={{ fontSize: 'clamp(72px, 11vw, 168px)', margin: 0, lineHeight: 0.92 }}>
            Carry the world<br/>
            <span style={{ fontStyle: 'italic', color: 'var(--rouge)' }}>for someone.</span>
          </h1>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, marginTop: 64, alignItems: 'end' }}>
            <p style={{ fontSize: 19, lineHeight: 1.5, color: 'var(--ink-2)', maxWidth: 540, margin: 0 }}>
              Real travelers. Real receipts. Hand-carried from any city in the world — at retail price, with escrow on every order.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', alignItems: 'center', flexWrap: 'wrap' }}>
              <a className="h-btn h-btn-primary h-btn-lg" href="/browse">Browse carriers
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
              </a>
              <a className="h-btn h-btn-ghost h-btn-lg" href="/post-trip">I'm traveling →</a>
            </div>
          </div>

          {/* City switcher dots */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 80 }}>
            {cities.map((c, i) => (
              <button key={c.code} onClick={() => setHeroIdx(i)} style={{
                padding: '6px 12px', border: 'none', borderRadius: 999, cursor: 'pointer',
                background: i === heroIdx ? 'var(--ink)' : 'transparent',
                color: i === heroIdx ? 'var(--paper)' : 'var(--ink-3)',
                fontSize: 11, fontFamily: 'var(--font-mono)', letterSpacing: '.1em', textTransform: 'uppercase',
                transition: 'all .25s',
              }}>
                {c.name}
              </button>
            ))}
            <div style={{ flex: 1 }}/>
            <span className="h-mono" style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: '.1em' }}>{String(heroIdx+1).padStart(2,'0')} / {String(cities.length).padStart(2,'0')}</span>
          </div>
        </div>
      </section>

      {/* TICKER */}
      <div style={{ borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)', padding: '14px 0', overflow: 'hidden', background: 'var(--paper-2)' }}>
        <div style={{ display: 'flex', gap: 48, animation: 'h-marquee 40s linear infinite', whiteSpace: 'nowrap', fontSize: 12, fontFamily: 'var(--font-mono)', letterSpacing: '.08em', color: 'var(--ink-2)' }}>
          {Array.from({ length: 2 }).flatMap((_, k) => [
            'Tokyo → NYC · 12 carriers',
            'Seoul → SF · 8 carriers',
            'Paris → NYC · 6 carriers',
            'London → Boston · 4 carriers',
            'NYC → Tokyo · 9 carriers',
            'Singapore → London · 3 carriers',
            'Tokyo → LA · 7 carriers',
          ].map((t, i) => (
            <span key={`${k}-${i}`} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ width: 4, height: 4, background: 'var(--rouge)', borderRadius: 999 }}/> {t}
            </span>
          )))}
        </div>
      </div>

      {/* STATS BAR */}
      <section style={{ padding: '120px 40px', borderBottom: '1px solid var(--line)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32 }}>
          {[
            ['12,400+', 'Orders completed'],
            ['3,200+', 'Active travelers'],
            ['68', 'Cities worldwide'],
            ['$0', 'Customs · shipping fees'],
          ].map(([n, l], i) => (
            <HScrollReveal key={l} delay={i * 80}>
              <div style={{ borderTop: '1px solid var(--line-2)', paddingTop: 24 }}>
                <div className="h-display" style={{ fontSize: 64, lineHeight: 1 }}>{n}</div>
                <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 8, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '.08em' }}>{l}</div>
              </div>
            </HScrollReveal>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS — three steps with imagery */}
      <section style={{ padding: '160px 40px', background: 'var(--paper-2)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <HScrollReveal>
            <HSectionHead eyebrow="How it works" title={<>Three steps. <span style={{ fontStyle: 'italic', color: 'var(--rouge)' }}>That's it.</span></>} sub="Buyer or traveler — the whole flow is set up in under three minutes." />
          </HScrollReveal>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginTop: 80 }}>
            {[
              { n: '01', t: 'Request from any city', d: 'Browse active travelers by route and item. Send a request to someone already heading your way.', note: 'No account needed to browse', img: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=900&q=85' },
              { n: '02', t: 'Carrier picks it up', d: 'They purchase at retail. No customs markup, no international shipping. Receipt uploaded to chat.', note: 'Payment held in escrow', img: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=900&q=85' },
              { n: '03', t: 'Receive and confirm', d: 'Meetup, courier, or doorstep — your choice. Confirm receipt and payment releases instantly.', note: 'Buyer protection on every order', img: 'https://images.unsplash.com/photo-1556742044-3c52d6e88c62?w=900&q=85' },
            ].map((s, i) => (
              <HScrollReveal key={s.n} delay={i * 120}>
                <div style={{ background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: 'var(--r-lg)', overflow: 'hidden', height: '100%' }}>
                  <div style={{ aspectRatio: '4/3', background: `url(${s.img}) center/cover`, position: 'relative' }}>
                    <span className="h-mono" style={{ position: 'absolute', top: 16, left: 16, fontSize: 11, color: 'white', background: 'rgba(0,0,0,.35)', backdropFilter: 'blur(6px)', padding: '4px 10px', borderRadius: 999, letterSpacing: '.1em' }}>{s.n}</span>
                  </div>
                  <div style={{ padding: 28 }}>
                    <h3 className="h-serif" style={{ fontSize: 28, margin: 0, letterSpacing: '-0.02em' }}>{s.t}</h3>
                    <p style={{ fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.6, marginTop: 12 }}>{s.d}</p>
                    <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--rouge-deep)' }}>
                      <HVerified size={12} /> {s.note}
                    </div>
                  </div>
                </div>
              </HScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED ITEMS */}
      <section style={{ padding: '160px 40px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 48, gap: 32 }}>
            <HScrollReveal>
              <HSectionHead eyebrow="In flight now" title={<>Hand-picked. <span style={{ fontStyle: 'italic' }}>From this week's carriers.</span></>} />
            </HScrollReveal>
            <a href="/browse" className="h-btn h-btn-ghost">All 68 cities →</a>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
            {HD.items.slice(0, 4).map((it, i) => (
              <HScrollReveal key={it.id} delay={i * 80}><HItemCard item={it} /></HScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS — editorial split */}
      <section style={{ padding: '160px 40px', background: 'var(--noir)', color: 'var(--paper)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <HSectionHead eyebrow="Real stories · 4.9 average" title={<>People love <span style={{ fontStyle: 'italic', color: 'var(--rouge)' }}>handi.</span></>} dark />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginTop: 64 }}>
            {HD.reviews.slice(0, 2).map((r, i) => (
              <HScrollReveal key={r.name} delay={i * 120}>
                <div style={{ padding: 40, border: '1px solid rgba(250,248,244,.12)', borderRadius: 'var(--r-lg)', height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <HStars value={r.rating} size={14} color="var(--rouge)"/>
                  <p className="h-serif" style={{ fontSize: 30, lineHeight: 1.35, letterSpacing: '-0.02em', marginTop: 24, marginBottom: 32, fontStyle: 'italic' }}>"{r.body}"</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 'auto', paddingTop: 24, borderTop: '1px solid rgba(250,248,244,.1)' }}>
                    <HAvatar name={r.name} size={44}/>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 500 }}>{r.name}</div>
                      <div style={{ fontSize: 12, color: 'rgba(250,248,244,.6)', fontFamily: 'var(--font-mono)', letterSpacing: '.06em', marginTop: 2 }}>{r.route}</div>
                    </div>
                  </div>
                </div>
              </HScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section style={{ padding: '120px 40px', background: 'var(--paper)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
          <HScrollReveal>
            <div className="h-eyebrow" style={{ marginBottom: 16 }}>Trust by design</div>
            <h2 className="h-display" style={{ fontSize: 72, margin: 0, lineHeight: 1 }}>Every order, <span style={{ fontStyle: 'italic', color: 'var(--rouge)' }}>protected.</span></h2>
            <p style={{ fontSize: 16, color: 'var(--ink-2)', lineHeight: 1.6, marginTop: 24, maxWidth: 480 }}>
              Funds sit in escrow until you confirm receipt. Every carrier is ID-verified, rated by past buyers, and visible on a single trip-by-trip ledger. Disputes go to a real human within 24 hours.
            </p>
          </HScrollReveal>
          <HScrollReveal delay={120}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: 'var(--line)', border: '1px solid var(--line)', borderRadius: 'var(--r-lg)', overflow: 'hidden' }}>
              {[
                ['ID', 'Government ID + selfie required'],
                ['Escrow', 'Held until you confirm receipt'],
                ['Receipts', 'Photo proof attached to chat'],
                ['Disputes', '24-hr human resolution'],
              ].map(([k, v]) => (
                <div key={k} style={{ padding: 24, background: 'var(--paper)' }}>
                  <div className="h-mono" style={{ fontSize: 11, color: 'var(--rouge)', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 8 }}>{k}</div>
                  <div style={{ fontSize: 14, color: 'var(--ink)', lineHeight: 1.4 }}>{v}</div>
                </div>
              ))}
            </div>
          </HScrollReveal>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ padding: '160px 40px', background: `linear-gradient(180deg, var(--paper) 0%, var(--paper-2) 100%)`, textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: .12, backgroundImage: `url(${cities[0].hero})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'grayscale(.4)' }}/>
        <div style={{ maxWidth: 900, margin: '0 auto', position: 'relative' }}>
          <div className="h-eyebrow" style={{ marginBottom: 24 }}>It's free to start</div>
          <h2 className="h-display" style={{ fontSize: 'clamp(72px, 9vw, 144px)', margin: 0, lineHeight: 0.95 }}>
            Ready to carry<br/>
            <span style={{ fontStyle: 'italic', color: 'var(--rouge)' }}>the world?</span>
          </h2>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 56 }}>
            <a className="h-btn h-btn-primary h-btn-lg" href="/browse">Find a carrier</a>
            <a className="h-btn h-btn-ghost h-btn-lg" href="/post-trip">Post a trip →</a>
          </div>
          <p style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 32, fontFamily: 'var(--font-mono)', letterSpacing: '.06em' }}>Free to join · No subscription · No hidden fees</p>
        </div>
      </section>

      <HFooter />
    </div>
  );
}

