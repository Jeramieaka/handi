import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { HD } from '../data/sample';
import { HAvatar, HStars, HFlag, HVerified, HNav, HFooter, HSectionHead, HItemCard, HEmpty } from '../components/primitives';
import { addToCart } from '../cart';
import { HHoldTimer, HCarrierTrust, HAnchorPrice, HMicroSave, HSlotBar } from '../components/psychology';
import { CountUp, TiltCard, StaggerText, MagneticButton } from '../components/motion';
import { PageBrowse } from './browse';
import { PageItemDetail } from './item-detail';
import { HScrollReveal, PageLanding } from './landing';

// handi — Psychology v2 overrides
// Re-defines PageLanding, PageBrowse, PageItemDetail with psych devices baked in.
// Loaded AFTER the originals so window.PageX gets overwritten.

const { useState: usePsy2, useEffect: useEffectPsy2 } = React;

// ─── Enhanced item card with anchor + save ──────────────
export function HItemCardPsy({ item }) {
  // TODO(post-backend): replace synthetic 1.45x anchor with a real
  // localResalePrice on the item data; until then this is a placeholder so
  // the anchor visually exists during the prototype.
  const localResale = Math.round((item.retail + item.fee) * 1.45);
  const handiTotal = item.retail + item.fee;
  const slotsTaken = item.slotsTotal - (item.slots || 0);
  const slotsTotal = item.slotsTotal || 5;

  return (
    <Link to={`/item/${item.id}`} className="h-card h-card-hover" style={{ background: 'var(--paper)', borderRadius: 'var(--r-lg)', overflow: 'hidden', cursor: 'pointer', display: 'flex', flexDirection: 'column', textDecoration: 'none', color: 'inherit' }}>
      <div className="h-zoom-frame" style={{ position: 'relative', aspectRatio: '1' }}>
        <img src={item.img} alt={item.title} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
        <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-start' }}>
          {item.tag && <span className="h-chip h-chip-noir" style={{ fontSize: 10, fontFamily: 'var(--font-mono)', letterSpacing: '.08em', textTransform: 'uppercase' }}>{item.tag}</span>}
        </div>
        <div style={{ position: 'absolute', top: 12, right: 12 }} onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
          <HMicroSave size="sm" initialCount={Math.floor(Math.random() * 40) + 8} label=""/>
        </div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '12px', background: 'linear-gradient(to top, rgba(0,0,0,.6), transparent)', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', letterSpacing: '.12em', textTransform: 'uppercase', opacity: .8 }}>{item.from} → {item.to}</div>
            <div style={{ fontSize: 12, marginTop: 2, opacity: .9 }}>Departs {item.departs}</div>
          </div>
          {item.viewers && <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', opacity: .85, display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 5, height: 5, borderRadius: 999, background: 'var(--rouge)' }}/>{item.viewers} viewing</span>}
        </div>
      </div>

      <div style={{ padding: 18, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 11, color: 'var(--ink-3)', fontFamily: 'var(--font-mono)', letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 4 }}>{item.store}</div>
          <h3 style={{ fontSize: 15, margin: 0, fontWeight: 500, lineHeight: 1.3, letterSpacing: '-0.01em', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.title}</h3>
        </div>

        {/* Anchor row */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 10 }}>
          <span className="h-serif" style={{ fontSize: 18 }}>${handiTotal}</span>
          <span style={{ fontSize: 12, color: 'var(--ink-3)', textDecoration: 'line-through' }}>${localResale}</span>
          <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--rouge-deep)', letterSpacing: '.06em' }}>SAVE ${localResale - handiTotal}</span>
        </div>

        {/* Slot bar */}
        <div style={{ marginBottom: 12 }}>
          <HSlotBar taken={slotsTaken} total={slotsTotal} label="reserved"/>
        </div>

        {/* Carrier strip */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 12, borderTop: '1px solid var(--line)', marginTop: 'auto' }}>
          <HAvatar name={item.carrier} size={22} />
          <div style={{ fontSize: 12, color: 'var(--ink-2)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <HVerified size={11}/>
            {item.carrier} <span style={{ color: 'var(--ink-3)' }}>· ★{item.rating}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

// Override the global card so Landing/Browse/Detail all pick it up

// ─── Landing v2: trust-led above the fold ──────────────
export function PageLandingPsy() {
  const [heroIdx, setHeroIdx] = usePsy2(0);
  const cities = HD.cities;
  useEffectPsy2(() => {
    const id = setInterval(() => setHeroIdx(i => (i + 1) % cities.length), 4000);
    return () => clearInterval(id);
  }, [cities.length]);

  return (
    <div className="h-app" style={{ width: '100%' }}>
      <HNav active=""/>

      {/* HERO — fills the viewport. Top: trust strip. Middle: headline anchor.
          Bottom: paragraph, CTAs, and city pills — all left-stacked.
          Using space-between distributes content so the photo can breathe. */}
      <section style={{ position: 'relative', minHeight: 'calc(100vh - 73px)', padding: '40px 40px 56px', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          {cities.map((c, i) => (
            <div key={c.code} style={{
              position: 'absolute', inset: 0,
              backgroundImage: `linear-gradient(180deg, rgba(250,248,244,.55), rgba(250,248,244,.88) 70%, var(--paper)), url(${c.hero})`,
              backgroundSize: 'cover', backgroundPosition: 'center',
              opacity: i === heroIdx ? 1 : 0,
              transition: 'opacity 1.2s ease',
            }}/>
          ))}
        </div>

        {/* TOP — live trust strip (shown to everyone) */}
        <div style={{ position: 'relative', maxWidth: 1280, margin: '0 auto', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--rouge)' }} className="h-pulse"/>
            <span className="h-eyebrow">Live · 31 carriers in flight · 68 cities</span>
          </div>
        </div>

        {/* MIDDLE — headline. Anchored slightly above center, left side. */}
        <div style={{ position: 'relative', maxWidth: 1280, margin: '0 auto', width: '100%', display: 'flex', alignItems: 'center', flex: 1, paddingTop: 48 }}>
          <h1 className="h-display" style={{ fontSize: 'clamp(56px, 8.5vw, 132px)', margin: 0, lineHeight: 0.96 }}>
            <StaggerText text="Anywhere" delay={120} gap={70}/>
            {' '}
            <StaggerText text="in the world," delay={260} gap={70}/>
            <br/>
            <span style={{ fontStyle: 'italic', color: 'var(--rouge)' }}>
              <StaggerText text="hand-carried." delay={520} gap={80}/>
            </span>
          </h1>
        </div>

        {/* BOTTOM — paragraph, CTAs, then city pills, all left-anchored. */}
        <div style={{ position: 'relative', maxWidth: 1280, margin: '0 auto', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 48, flexWrap: 'wrap' }}>
            <p style={{ fontSize: 18, lineHeight: 1.55, color: 'var(--ink-2)', maxWidth: 480, margin: 0 }}>
              Real travelers. Real receipts. Hand-carried from any city — at retail price, with escrow and ID-verified carriers.
            </p>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
              <Link className="h-btn h-btn-primary h-btn-lg" to="/browse">Browse carriers
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
              </Link>
              <Link className="h-btn h-btn-ghost h-btn-lg" to="/post-trip">I'm traveling →</Link>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--line)' }}>
            <span className="h-mono" style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: '.12em', marginRight: 8 }}>WATCH A CITY</span>
            {cities.map((c, i) => (
              <button key={c.code} onClick={() => setHeroIdx(i)} style={{
                padding: '6px 12px', border: 'none', borderRadius: 999, cursor: 'pointer',
                background: i === heroIdx ? 'var(--ink)' : 'transparent',
                color: i === heroIdx ? 'var(--paper)' : 'var(--ink-3)',
                fontSize: 11, fontFamily: 'var(--font-mono)', letterSpacing: '.1em', textTransform: 'uppercase',
                transition: 'all .25s',
              }}>{c.name}</button>
            ))}
          </div>
        </div>
      </section>

      {/* STATS — count up from 0 when they enter the viewport */}
      <section style={{ padding: '88px 40px', borderBottom: '1px solid var(--line)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32 }}>
          {[
            { to: 12400, suffix: '+', label: 'Orders completed' },
            { to: 3200,  suffix: '+', label: 'Active travelers' },
            { to: 0,     prefix: '$', label: 'Customs · shipping' },
            { to: 4.9,   suffix: ' ★', decimals: 1, label: 'Average rating · 8,210 reviews' },
          ].map((s, i) => (
            <HScrollReveal key={s.label} delay={i * 80}>
              <div style={{ borderTop: '1px solid var(--line-2)', paddingTop: 20 }}>
                <CountUp
                  className="h-display"
                  to={s.to}
                  prefix={s.prefix || ''}
                  suffix={s.suffix || ''}
                  decimals={s.decimals || 0}
                  style={{ fontSize: 48, lineHeight: 1.04, display: 'inline-block' }}
                />
                <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 8, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '.08em' }}>{s.label}</div>
              </div>
            </HScrollReveal>
          ))}
        </div>
      </section>

      {/* HOW (unchanged from v1) */}
      <section style={{ padding: '96px 40px', background: 'var(--paper-2)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <HScrollReveal>
            <HSectionHead eyebrow="How it works" title={<>Three steps. <span style={{ fontStyle: 'italic', color: 'var(--rouge)' }}>That's it.</span></>} sub="Buyer or traveler — the whole flow is set up in under three minutes."/>
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
                      <HVerified size={12}/> {s.note}
                    </div>
                  </div>
                </div>
              </HScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* IN FLIGHT */}
      <section style={{ padding: '96px 40px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 48, gap: 32 }}>
            <HScrollReveal>
              <HSectionHead eyebrow="In flight now" title={<>Hand-picked. <span style={{ fontStyle: 'italic' }}>From this week's carriers.</span></>}/>
            </HScrollReveal>
            <Link to="/browse" className="h-btn h-btn-ghost">All 68 cities →</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
            {HD.items.slice(0, 4).map((it, i) => (
              <HScrollReveal key={it.id} delay={i * 80}><HItemCardPsy item={it}/></HScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: '96px 40px', background: 'var(--noir)', color: 'var(--paper)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <HSectionHead eyebrow="Real stories · 4.9 average · 8,210 reviews" title={<>People love <span style={{ fontStyle: 'italic', color: 'var(--rouge)' }}>handi.</span></>} dark/>
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

      {/* FINAL CTA */}
      <section style={{ padding: '96px 40px', background: `linear-gradient(180deg, var(--paper) 0%, var(--paper-2) 100%)`, textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: .12, backgroundImage: `url(${cities[0].hero})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'grayscale(.4)' }}/>
        <div style={{ maxWidth: 900, margin: '0 auto', position: 'relative' }}>
          <div className="h-eyebrow" style={{ marginBottom: 24 }}>It's free to start · Browse without an account</div>
          <h2 className="h-display" style={{ fontSize: 'clamp(72px, 9vw, 144px)', margin: 0, lineHeight: 0.95 }}>
            Ready to carry<br/>
            <span style={{ fontStyle: 'italic', color: 'var(--rouge)' }}>the world?</span>
          </h2>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 56 }}>
            <Link className="h-btn h-btn-primary h-btn-lg" to="/browse">Find a carrier</Link>
            <Link className="h-btn h-btn-ghost h-btn-lg" to="/post-trip">Post a trip →</Link>
          </div>
          <p style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 32, fontFamily: 'var(--font-mono)', letterSpacing: '.06em' }}>Free to join · No subscription · Escrow on every order</p>
        </div>
      </section>

      {/* TICKER — pinned to the bottom of the page, just above the footer */}
      <div style={{ borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)', padding: '14px 0', overflow: 'hidden', background: 'var(--paper-2)' }}>
        <div style={{ display: 'flex', gap: 48, animation: 'h-marquee 40s linear infinite', whiteSpace: 'nowrap', fontSize: 12, fontFamily: 'var(--font-mono)', letterSpacing: '.08em', color: 'var(--ink-2)' }}>
          {Array.from({ length: 2 }).flatMap((_, k) => [
            'Tokyo → NYC · 12 carriers', 'Seoul → SF · 8 carriers', 'Paris → NYC · 6 carriers',
            'London → Boston · 4 carriers', 'NYC → Tokyo · 9 carriers', 'Singapore → London · 3 carriers', 'Tokyo → LA · 7 carriers',
          ].map((t, i) => (
            <span key={`${k}-${i}`} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ width: 4, height: 4, background: 'var(--rouge)', borderRadius: 999 }}/> {t}
            </span>
          )))}
        </div>
      </div>

      <HFooter/>
    </div>
  );
}

// ─── Browse v2: persistent recommendation rail + live activity ──
export function PageBrowsePsy() {
  const [city, setCity] = usePsy2('all');
  const [cat, setCat] = usePsy2('all');
  const [sort, setSort] = usePsy2('Soonest');
  const [feeMin, setFeeMin] = usePsy2('');
  const [feeMax, setFeeMax] = usePsy2('');
  const [trustIdOnly, setTrustIdOnly] = usePsy2(true);
  const [trustTopRated, setTrustTopRated] = usePsy2(false);
  const [trustRepeat, setTrustRepeat] = usePsy2(false);
  const [trustNoDispute, setTrustNoDispute] = usePsy2(false);

  const items = HD.items
    .filter(i => city === 'all' || i.from.toLowerCase() === city)
    .filter(i => cat === 'all' || i.category === cat)
    .filter(i => !feeMin || i.fee >= Number(feeMin))
    .filter(i => !feeMax || i.fee <= Number(feeMax))
    .filter(i => !trustTopRated || (i.rating || 0) >= 4.8)
    .sort((a, b) => {
      if (sort === 'Best value') return (a.fee / a.retail) - (b.fee / b.retail);
      if (sort === 'Top rated') return (b.rating || 0) - (a.rating || 0);
      if (sort === 'Most saved') return (b.viewers || 0) - (a.viewers || 0);
      // Soonest — by departs date string (May X)
      const monthDay = (s) => { const m = (s || '').match(/(\w+)\s+(\d+)/); return m ? new Date(`${m[1]} ${m[2]}, 2026`).getTime() : 0; };
      return monthDay(a.departs) - monthDay(b.departs);
    });
  const cats = ['all', ...Array.from(new Set(HD.items.map(i => i.category)))];

  return (
    <div className="h-app" style={{ width: '100%' }}>
      <HNav active="browse"/>

      <section style={{ padding: '48px 40px 32px', borderBottom: '1px solid var(--line)' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <div style={{ marginBottom: 24 }}>
            <div className="h-eyebrow" style={{ marginBottom: 12 }}>Marketplace · 17 active carries · 31 in flight</div>
            <h1 className="h-display" style={{ fontSize: 88, margin: 0, lineHeight: 1 }}>Browse <span style={{ fontStyle: 'italic', color: 'var(--rouge)' }}>carriers.</span></h1>
          </div>

          <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 4, marginTop: 24 }}>
            <button onClick={() => setCity('all')} style={cityChipPsy(city === 'all')}>
              <span style={{ fontSize: 18 }}>🌍</span><span>All cities <span style={{ color: 'var(--ink-3)' }}>· 17</span></span>
            </button>
            {HD.cities.map(c => (
              <button key={c.code} onClick={() => setCity(c.name.toLowerCase())} style={cityChipPsy(city === c.name.toLowerCase())}>
                <HFlag code={c.code} size={16}/><span>{c.name} <span style={{ color: 'var(--ink-3)' }}>· {c.count}</span></span>
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 20 }}>
            <span className="h-mono" style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: '.1em' }}>SORT</span>
            {['Soonest', 'Best value', 'Top rated', 'Most saved'].map(s => (
              <button key={s} onClick={() => setSort(s)} style={{
                padding: '8px 14px', border: '1px solid', borderRadius: 999, fontSize: 12,
                background: sort === s ? 'var(--ink)' : 'transparent',
                color: sort === s ? 'var(--paper)' : 'var(--ink-2)',
                borderColor: sort === s ? 'var(--ink)' : 'var(--line-2)',
                cursor: 'pointer'
              }}>{s}</button>
            ))}
          </div>
        </div>
      </section>

      {/* Persistent "Picked for you" rail — anchoring + commitment */}
      <section style={{ padding: '32px 40px 0' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '20px 24px', background: 'var(--rouge-soft)', border: '1px solid rgba(139,30,45,.12)', borderRadius: 'var(--r-lg)', display: 'flex', alignItems: 'center', gap: 24 }}>
          <div style={{ flex: 1 }}>
            <div className="h-eyebrow" style={{ color: 'var(--rouge-deep)', marginBottom: 6 }}>Picked for you · Based on Tokyo & Seoul views</div>
            <div style={{ fontSize: 15, color: 'var(--rouge-ink)', fontFamily: 'var(--font-serif)' }}>Two carriers heading your way are <i>still taking requests this week.</i></div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {HD.items.slice(0, 3).map(it => (
              <div key={it.id} style={{ width: 56, height: 56, borderRadius: 8, overflow: 'hidden', border: '2px solid white', boxShadow: '0 1px 2px rgba(0,0,0,.06)' }}>
                <img src={it.img} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
              </div>
            ))}
          </div>
          <Link to="/browse" className="h-btn h-btn-rouge h-btn-sm">View 8 picks →</Link>
        </div>
      </section>

      <section style={{ padding: '32px 40px 100px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'grid', gridTemplateColumns: '220px 1fr', gap: 48 }}>
          <aside style={{ position: 'sticky', top: 92, alignSelf: 'flex-start' }}>
            <div className="h-mono" style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 16 }}>Category</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {cats.map(c => (
                <button key={c} onClick={() => setCat(c)} style={{
                  textAlign: 'left', padding: '10px 12px', borderRadius: 8, border: 'none',
                  background: cat === c ? 'var(--paper-2)' : 'transparent',
                  color: cat === c ? 'var(--ink)' : 'var(--ink-2)',
                  fontWeight: cat === c ? 500 : 400, fontSize: 14, cursor: 'pointer',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <span>{c === 'all' ? 'All categories' : c}</span>
                  {cat === c && <span style={{ width: 4, height: 4, background: 'var(--rouge)', borderRadius: 999 }}/>}
                </button>
              ))}
            </div>

            <hr className="h-divider" style={{ margin: '24px 0' }}/>

            <div className="h-mono" style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 16 }}>Carry fee</div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
              <input className="h-input" placeholder="Min" value={feeMin} onChange={e => setFeeMin(e.target.value.replace(/\D/g, ''))} style={{ padding: '8px 10px', fontSize: 12 }}/>
              <input className="h-input" placeholder="Max" value={feeMax} onChange={e => setFeeMax(e.target.value.replace(/\D/g, ''))} style={{ padding: '8px 10px', fontSize: 12 }}/>
            </div>

            <div className="h-mono" style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 16 }}>Trust filter</div>
            {[
              ['ID-verified only', trustIdOnly, setTrustIdOnly],
              ['Top rated (4.8+)', trustTopRated, setTrustTopRated],
              ['Repeat carriers (5+ trips)', trustRepeat, setTrustRepeat],
              ['Zero disputes', trustNoDispute, setTrustNoDispute],
            ].map(([t, on, set]) => (
              <label key={t} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', fontSize: 13, color: 'var(--ink-2)', cursor: 'pointer' }}>
                <input type="checkbox" checked={on} onChange={e => set(e.target.checked)} style={{ accentColor: 'var(--rouge)' }}/> {t}
              </label>
            ))}

            <hr className="h-divider" style={{ margin: '24px 0' }}/>

            {/* Saved-for-later micro commitment */}
            <div style={{ padding: 16, background: 'var(--paper-2)', borderRadius: 'var(--r-md)' }}>
              <div className="h-eyebrow" style={{ marginBottom: 8 }}>Your wishlist</div>
              <div style={{ fontSize: 13, color: 'var(--ink-2)', marginBottom: 12, lineHeight: 1.5 }}>
                <span className="h-serif" style={{ fontSize: 28, color: 'var(--ink)' }}>3</span> items saved.<br/>
                We'll alert you when a carrier picks up your route.
              </div>
              <Link to="/profile" className="h-btn h-btn-ghost h-btn-sm" style={{ width: '100%' }}>View wishlist →</Link>
            </div>

            <div style={{ marginTop: 16, padding: 20, background: 'var(--rouge-soft)', borderRadius: 'var(--r-md)', border: '1px solid rgba(139,30,45,.12)' }}>
              <div className="h-eyebrow" style={{ color: 'var(--rouge-deep)', marginBottom: 8 }}>Don't see it?</div>
              <p style={{ fontSize: 13, color: 'var(--rouge-ink)', lineHeight: 1.5, margin: 0 }}>Post a request — carriers heading your way will reach out.</p>
              <Link to="/requests" className="h-btn h-btn-rouge h-btn-sm" style={{ marginTop: 12, width: '100%' }}>Post a request →</Link>
            </div>
          </aside>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid var(--line)' }}>
              <span style={{ fontSize: 14, color: 'var(--ink-2)' }}>{items.length} {items.length === 1 ? 'item' : 'items'} · <span style={{ color: 'var(--ink-3)' }}>{city === 'all' ? 'All cities' : city}{cat !== 'all' ? ` · ${cat}` : ''}</span></span>
              <span className="h-eyebrow"><span style={{ color: 'var(--rouge)' }}>●</span> Average save with handi: <b style={{ color: 'var(--rouge-deep)', fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>32%</b></span>
            </div>
            {items.length === 0 ? (
              <HEmpty
                icon="✈"
                title="No carriers match those filters."
                body="Try widening your fee range, lifting the trust filters, or picking a different city."
                action={
                  <button onClick={() => { setCity('all'); setCat('all'); setFeeMin(''); setFeeMax(''); setTrustIdOnly(false); setTrustTopRated(false); setTrustRepeat(false); setTrustNoDispute(false); }} className="h-btn h-btn-ghost">
                    Reset all filters
                  </button>
                }
              />
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
                {items.map(it => <HItemCardPsy key={it.id} item={it}/>)}
              </div>
            )}
          </div>
        </div>
      </section>

      <HFooter/>
    </div>
  );
}
function cityChipPsy(active) {
  return {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    padding: '10px 16px', border: '1px solid', borderRadius: 999,
    fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap', cursor: 'pointer',
    background: active ? 'var(--ink)' : 'var(--paper)',
    color: active ? 'var(--paper)' : 'var(--ink)',
    borderColor: active ? 'var(--ink)' : 'var(--line-2)',
  };
}

// ─── Item Detail v2: hold timer + dossier + anchor + reservation flow ──
export function PageItemDetailPsy() {
  const [qty, setQty] = usePsy2(1);
  const [imgIdx, setImgIdx] = usePsy2(0);
  const navigate = useNavigate();
  const { id } = useParams();
  const item = HD.items.find(i => String(i.id) === String(id)) || HD.items[1];
  // TODO(post-backend): replace synthetic 1.55x anchor with real localResalePrice from data
  const localResale = Math.round((item.retail + item.fee) * 1.55);
  const handiTotal = item.retail + item.fee;
  const slotsLeft = Math.max(0, item.slots ?? 0);
  const slotsTotal = item.slotsTotal ?? slotsLeft;
  const slotsTaken = Math.max(0, slotsTotal - slotsLeft);
  const isSoldOut = slotsLeft <= 0;
  const handleReserve = () => {
    if (isSoldOut || qty < 1 || qty > slotsLeft) return;
    addToCart(item, qty);
    navigate('/cart');
  };
  useEffectPsy2(() => {
    if (qty > slotsLeft && slotsLeft > 0) setQty(slotsLeft);
    if (slotsLeft <= 0) setQty(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.id]);
  const gallery = [
    item.img,
    'https://images.unsplash.com/photo-1577741314755-048d8525d31e?w=900&h=900&fit=crop&q=85',
    'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=900&h=900&fit=crop&q=85',
    'https://images.unsplash.com/photo-1531525645387-7f14be1bdbbd?w=900&h=900&fit=crop&q=85',
  ];

  return (
    <div className="h-app" style={{ width: '100%' }}>
      <HNav active="browse"/>

      <div style={{ padding: '20px 40px', fontSize: 12, color: 'var(--ink-3)', fontFamily: 'var(--font-mono)', letterSpacing: '.06em' }}>
        <Link to="/browse" style={{ color: 'inherit' }}>BROWSE</Link> / <Link to="/browse" style={{ color: 'inherit' }}>TOKYO</Link> / <Link to="/browse" style={{ color: 'inherit' }}>COLLECTIBLES</Link> / <span style={{ color: 'var(--ink)' }}>{item.title.toUpperCase()}</span>
      </div>

      <section style={{ padding: '16px 40px 80px', maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 64 }}>
          {/* GALLERY */}
          <div>
            <div style={{ position: 'relative', aspectRatio: '1', borderRadius: 'var(--r-lg)', overflow: 'hidden', background: 'var(--paper-2)' }}>
              <img src={gallery[imgIdx]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt=""/>
              <span className="h-chip h-chip-noir" style={{ position: 'absolute', top: 16, left: 16, fontSize: 10, fontFamily: 'var(--font-mono)', letterSpacing: '.1em' }}>TOKYO · LIMITED</span>
              <div style={{ position: 'absolute', top: 16, right: 16 }}>
                <HMicroSave initialCount={47} label="Save"/>
              </div>
              {/* live viewers */}
              <div style={{ position: 'absolute', bottom: 16, left: 16, display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', background: 'rgba(0,0,0,.55)', backdropFilter: 'blur(8px)', borderRadius: 999, color: 'white', fontSize: 11, fontFamily: 'var(--font-mono)', letterSpacing: '.06em' }}>
                <span style={{ width: 5, height: 5, borderRadius: 999, background: 'var(--rouge)' }} className="h-pulse"/>
                10 people viewing now
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              {gallery.map((g, i) => (
                <button key={i} onClick={() => setImgIdx(i)} style={{
                  width: 80, height: 80, padding: 0, border: '2px solid', borderColor: i === imgIdx ? 'var(--ink)' : 'transparent', borderRadius: 8, overflow: 'hidden', cursor: 'pointer'
                }}>
                  <img src={g} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt=""/>
                </button>
              ))}
            </div>

            {/* Provenance */}
            <div style={{ marginTop: 40, paddingTop: 32, borderTop: '1px solid var(--line)' }}>
              <h3 className="h-eyebrow" style={{ marginBottom: 16 }}>Provenance</h3>
              <p style={{ fontSize: 15, lineHeight: 1.65, color: 'var(--ink-2)', margin: 0 }}>
                {item.title} sourced from {item.store} in {item.from}. The carrier will photograph the receipt at point of purchase and attach it to your order chat. Original packaging confirmed by carrier prior to checkout.
              </p>
              <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                {[['Origin', item.from], ['Retail', `$${item.retail} USD`], ['Pickup', item.store]].map(([k, v]) => (
                  <div key={k}>
                    <div className="h-mono" style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: '.1em', textTransform: 'uppercase' }}>{k}</div>
                    <div style={{ fontSize: 14, marginTop: 6 }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Carrier dossier */}
            <div style={{ marginTop: 40, paddingTop: 32, borderTop: '1px solid var(--line)' }}>
              <h3 className="h-eyebrow" style={{ marginBottom: 20 }}>Your carrier · the dossier</h3>
              <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', marginBottom: 24 }}>
                <HAvatar name="James L" size={64}/>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <h4 style={{ margin: 0, fontSize: 18 }}>James L.</h4>
                    <HVerified size={14}/>
                    <span className="h-chip h-chip-rouge" style={{ fontSize: 10 }}>Top 3% carrier</span>
                  </div>
                  <div style={{ display: 'flex', gap: 24, marginTop: 8, fontSize: 13, color: 'var(--ink-2)' }}>
                    <span><b style={{ color: 'var(--ink)' }}>★ 5.0</b> · 47 reviews</span>
                    <span>Member since 2024</span>
                    <span>23 trips completed</span>
                  </div>
                  <p style={{ marginTop: 12, fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.55 }}>
                    "Tokyo native, monthly NYC routes. I specialize in Pokémon Center, anime collectibles, and limited drops. Always carry receipts and photo proof."
                  </p>
                </div>
              </div>

              <HCarrierTrust name="James L."/>
            </div>

            {/* Recent reviews from the carrier */}
            <div style={{ marginTop: 40, paddingTop: 32, borderTop: '1px solid var(--line)' }}>
              <h3 className="h-eyebrow" style={{ marginBottom: 20 }}>Reviews · last 3 trips</h3>
              {[
                { name: 'Emily R.', body: 'James sent receipt photos within 20 minutes of pickup. Item arrived perfectly packed.', when: '2 weeks ago' },
                { name: 'Daniel P.', body: 'Communication was clear in both English and Japanese. Will use him again.', when: '1 month ago' },
              ].map(r => (
                <div key={r.name} style={{ padding: '16px 0', borderBottom: '1px solid var(--line)', display: 'flex', gap: 16 }}>
                  <HAvatar name={r.name} size={36}/>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 14, fontWeight: 500 }}>{r.name}</span>
                      <HStars value={5} size={11}/>
                      <span className="h-mono" style={{ fontSize: 10, color: 'var(--ink-3)', marginLeft: 'auto' }}>{r.when}</span>
                    </div>
                    <p style={{ fontSize: 14, color: 'var(--ink-2)', margin: '6px 0 0', lineHeight: 1.5 }}>{r.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* PURCHASE PANEL */}
          <aside style={{ position: 'sticky', top: 100, alignSelf: 'flex-start' }}>
            <div className="h-eyebrow" style={{ marginBottom: 12 }}>{item.store}</div>
            <h1 className="h-serif" style={{ fontSize: 48, margin: 0, lineHeight: 1.05, letterSpacing: '-0.02em' }}>{item.title}</h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 20, flexWrap: 'wrap' }}>
              <HStars value={5} size={14}/>
              <span style={{ fontSize: 13, color: 'var(--ink-2)' }}>5.0 · 12 carries this month</span>
              <span style={{ width: 3, height: 3, borderRadius: 999, background: 'var(--ink-3)' }}/>
              <span style={{ fontSize: 13, color: 'var(--rouge-deep)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 5, height: 5, borderRadius: 999, background: 'var(--rouge)' }} className="h-pulse"/>
                10 viewing
              </span>
            </div>

            {/* Hold timer — endowment */}
            <div style={{ marginTop: 24 }}>
              <HHoldTimer minutes={15}/>
            </div>

            {/* Anchor block — local resale crossed out */}
            <div style={{ marginTop: 16 }}>
              <HAnchorPrice retail={item.retail} fee={item.fee} localResale={localResale}/>
            </div>

            {/* price block */}
            <div style={{ marginTop: 16, padding: 24, background: 'var(--paper-2)', borderRadius: 'var(--r-lg)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div>
                  <div className="h-mono" style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: '.1em', textTransform: 'uppercase' }}>Retail (Tokyo)</div>
                  <div className="h-serif" style={{ fontSize: 30, marginTop: 4, lineHeight: 1 }}>${item.retail}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="h-mono" style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: '.1em', textTransform: 'uppercase' }}>+ Carry fee</div>
                  <div className="h-serif" style={{ fontSize: 30, marginTop: 4, lineHeight: 1, color: 'var(--rouge)' }}>${item.fee}</div>
                </div>
              </div>
              <hr style={{ border: 'none', borderTop: '1px dashed var(--line-2)', margin: '20px 0' }}/>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: 14, color: 'var(--ink-2)' }}>You pay total</span>
                <span className="h-serif" style={{ fontSize: 40 }}>${handiTotal}</span>
              </div>
              <div className="h-mono" style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: '.08em', marginTop: 4, textAlign: 'right' }}>NO CUSTOMS · NO SHIPPING · ALL-IN</div>
            </div>

            {/* qty + cta */}
            <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--line-2)', borderRadius: 'var(--r-pill)', padding: '4px' }}>
                <button onClick={() => setQty(Math.max(1, qty-1))} disabled={qty <= 1} style={{ ...qtyBtnPsy, opacity: qty <= 1 ? 0.35 : 1, cursor: qty <= 1 ? 'not-allowed' : 'pointer' }} aria-label="Decrease quantity">−</button>
                <span style={{ width: 32, textAlign: 'center', fontFamily: 'var(--font-mono)' }} aria-live="polite">{qty}</span>
                <button onClick={() => setQty(Math.min(slotsLeft || 1, qty+1))} disabled={qty >= slotsLeft} style={{ ...qtyBtnPsy, opacity: qty >= slotsLeft ? 0.35 : 1, cursor: qty >= slotsLeft ? 'not-allowed' : 'pointer' }} aria-label="Increase quantity">+</button>
              </div>
              <button onClick={handleReserve} disabled={isSoldOut} className="h-btn h-btn-primary" style={{ flex: 1, opacity: isSoldOut ? 0.5 : 1, cursor: isSoldOut ? 'not-allowed' : 'pointer' }}>
                {isSoldOut ? 'Sold out' : `Reserve · $${handiTotal * qty}`}
              </button>
            </div>
            <div className="h-mono" style={{ fontSize: 10, color: qty >= slotsLeft ? 'var(--rouge-deep)' : 'var(--ink-3)', letterSpacing: '.08em', marginTop: 8, textAlign: 'right' }}>
              {isSoldOut ? 'NO SLOTS REMAINING ON THIS TRIP' : `MAX ${slotsLeft} ON THIS TRIP · ${slotsLeft - qty} LEFT AFTER YOURS`}
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <button onClick={() => navigate('/messages')} className="h-btn h-btn-ghost" style={{ flex: 1 }}>Message James first</button>
              <HMicroSave label="Save for later"/>
            </div>
            <div className="h-mono" style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: '.08em', marginTop: 12, textAlign: 'center' }}>
              YOU WON'T BE CHARGED UNTIL JAMES ACCEPTS · ESCROW HELD
            </div>

            {/* Trip + slots scarcity */}
            <div style={{ marginTop: 24, padding: 20, border: '1px solid var(--line)', borderRadius: 'var(--r-lg)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <span className="h-eyebrow">Trip</span>
                <span className="h-chip h-chip-amber" style={{ fontSize: 11 }}>{slotsLeft} of {slotsTotal} slots left</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: 'var(--ink-3)', fontFamily: 'var(--font-mono)', letterSpacing: '.06em' }}>FROM</div>
                  <div style={{ fontSize: 18, marginTop: 4 }}>🇯🇵 Tokyo</div>
                </div>
                <div style={{ flex: 1, position: 'relative', height: 20 }}>
                  <div style={{ position: 'absolute', top: 9, left: 0, right: 0, height: 1, borderTop: '1.5px dashed var(--line-2)' }}/>
                  <svg width="20" height="20" viewBox="0 0 24 24" style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%) rotate(45deg)', background: 'var(--paper)' }} fill="var(--rouge)"><path d="M21 16v-2l-8-5V3.5C13 2.67 12.33 2 11.5 2S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg>
                </div>
                <div style={{ flex: 1, textAlign: 'right' }}>
                  <div style={{ fontSize: 11, color: 'var(--ink-3)', fontFamily: 'var(--font-mono)', letterSpacing: '.06em' }}>TO</div>
                  <div style={{ fontSize: 18, marginTop: 4 }}>🇺🇸 NYC</div>
                </div>
              </div>
              <hr className="h-divider" style={{ margin: '14px 0' }}/>
              <HSlotBar taken={slotsTaken} total={slotsTotal} label="reserved"/>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginTop: 14 }}>
                <span style={{ color: 'var(--ink-3)' }}>Departure</span>
                <span>May 7 · ~12 days delivery</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginTop: 6 }}>
                <span style={{ color: 'var(--ink-3)' }}>Hand-off</span>
                <span>Manhattan · Brooklyn · Queens</span>
              </div>
            </div>

            {/* trust pills */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 16 }}>
              {[['🛡️','Buyer protected'],['🔒','Escrow held'],['📷','Photo receipt'],['↺','Money back']].map(([e,t]) => (
                <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', background: 'var(--paper-2)', borderRadius: 8, fontSize: 12 }}>
                  <span>{e}</span><span>{t}</span>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      {/* RELATED — keep momentum, anchor on adjacent items */}
      <section style={{ padding: '40px 40px 120px', borderTop: '1px solid var(--line)' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 32 }}>
            <h3 className="h-display" style={{ fontSize: 40, margin: 0 }}>More from {item.from} <span style={{ fontStyle: 'italic', color: 'var(--rouge)' }}>· bundle to save</span></h3>
            <span className="h-eyebrow">Same route · save the carry fee</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
            {HD.items.filter(i => i.from === item.from && i.id !== item.id).slice(0, 4).map(it => <HItemCardPsy key={it.id} item={it}/>)}
          </div>
        </div>
      </section>

      <HFooter/>
    </div>
  );
}
const qtyBtnPsy = { width: 32, height: 32, border: 'none', background: 'transparent', borderRadius: 999, fontSize: 18, cursor: 'pointer', color: 'var(--ink-2)' };
