import React, { Fragment, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HD } from '../data/sample';
import { HAvatar, HVerified, HNav, HFooter, HSectionHead, HPillToggle } from '../components/primitives';
import { HScrollReveal } from './landing';
import { useCart, removeFromCart, updateQty, clearCart, cartSubtotal } from '../cart';

// Fallback so checkout always has a sensible carrier hand-off config,
// even if the cart contains an item from a carrier we haven't pre-seeded.
const DEFAULT_CARRIER_HANDOFF = {
  methods: ['meetup', 'doorstep'],
  spots: ['Public meetup spot · TBD'],
  pickupAddress: '',
  doorstepFee: 0,
};
const getCarrierHandoff = (name) => HD.carriers?.[name] || DEFAULT_CARRIER_HANDOFF;

// How It Works + Requests + Cart pages

export function PageHowItWorks() {
  const [tab, setTab] = useState('buyer');
  return (
    <div className="h-app" style={{ width: '100%' }}>
      <HNav active="how it works"/>

      {/* Hero */}
      <section style={{ padding: '72px 40px 56px', textAlign: 'center', maxWidth: 1100, margin: '0 auto' }}>
        <div className="h-eyebrow" style={{ marginBottom: 20 }}>How handi works</div>
        <h1 className="h-display" style={{ fontSize: 'clamp(72px, 9vw, 128px)', margin: 0, lineHeight: 1 }}>The carry, <span style={{ fontStyle: 'italic', color: 'var(--rouge)' }}>step by step.</span></h1>
        <p style={{ fontSize: 18, color: 'var(--ink-2)', maxWidth: 640, margin: '32px auto 0', lineHeight: 1.55 }}>
          Whether you're a buyer hunting an item that's only sold in Tokyo, or a traveler heading there next week — here's exactly what happens, who pays whom, and how trust is enforced.
        </p>
      </section>

      {/* Toggle (Buyer / Carrier) — sliding pill */}
      <section style={{ padding: '0 40px', display: 'flex', justifyContent: 'center' }}>
        <HPillToggle
          value={tab}
          onChange={setTab}
          options={[
            { value: 'buyer', label: 'As a Buyer' },
            { value: 'carrier', label: 'As a Carrier' },
          ]}
        />
      </section>

      {/* Five steps with numbered timeline */}
      <section style={{ padding: '80px 40px 120px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '120px 1fr', gap: 0 }}>
          {[
            { n: '01', t: 'Browse, or post a request', d: 'Filter active carriers by city and category. If nobody is heading your way, post a request — carriers will see it next time they fly.', img: 'https://images.unsplash.com/photo-1568667256549-094345857637?w=900&q=85', who: 'Buyer · 30 sec' },
            { n: '02', t: 'Reserve & pay into escrow', d: 'You pay the retail price + carry fee at checkout. Funds sit in our escrow account — the carrier doesn\'t see a cent yet.', img: 'https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=900&q=85', who: 'Buyer · 1 min' },
            { n: '03', t: 'Carrier purchases at retail', d: 'They go to the shop, pay with their own card, and upload a photo of the receipt + product to your private chat.', img: 'https://images.unsplash.com/photo-1555529902-5261145633bf?w=900&q=85', who: 'Carrier · variable' },
            { n: '04', t: 'In flight', d: 'Live tracking shows the trip status. You and the carrier coordinate the hand-off — meetup, courier, or doorstep.', img: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=900&q=85', who: '~ 1–14 days' },
            { n: '05', t: 'Receive & release', d: 'You inspect the item. Tap "Confirm receipt" and escrow releases instantly to the carrier. Both parties leave a review.', img: 'https://images.unsplash.com/photo-1556742044-3c52d6e88c62?w=900&q=85', who: 'Buyer · instant' },
          ].map((s, i, arr) => (
            <React.Fragment key={s.n}>
              {/* Timeline column */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                <div className="h-mono" style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: '.1em' }}>STEP</div>
                <div className="h-display" style={{ fontSize: 56, marginTop: 4 }}>{s.n}</div>
                {i < arr.length - 1 && <div style={{ flex: 1, width: 1, background: 'var(--line-2)', marginTop: 16, marginBottom: -32 }}/>}
              </div>
              {/* Content */}
              <div style={{ paddingBottom: 64, display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 40 }}>
                <div>
                  <h2 className="h-serif" style={{ fontSize: 40, margin: 0, letterSpacing: '-0.02em' }}>{s.t}</h2>
                  <p style={{ fontSize: 16, color: 'var(--ink-2)', lineHeight: 1.6, marginTop: 16 }}>{s.d}</p>
                  <span className="h-chip h-chip-rouge" style={{ marginTop: 16 }}>{s.who}</span>
                </div>
                <div style={{ aspectRatio: '4/3', background: `url(${s.img}) center/cover`, borderRadius: 'var(--r-lg)' }}/>
              </div>
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '88px 40px', background: 'var(--paper-2)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <HSectionHead eyebrow="FAQ" title={<>Common <span style={{ fontStyle: 'italic' }}>questions.</span></>}/>
          <div style={{ marginTop: 48, display: 'grid', gap: 1, background: 'var(--line)', border: '1px solid var(--line)', borderRadius: 'var(--r-lg)', overflow: 'hidden' }}>
            {[
              ['What if the carrier doesn\'t deliver?', 'Escrow refunds you in full. Disputes are resolved by a human within 24 hours.'],
              ['Are there customs fees or shipping?', 'No. The carrier carries it as personal luggage. You pay only retail + carry fee.'],
              ['Can I request anything?', 'Most legal goods. We restrict liquids over 100ml on aircraft, perishables that can\'t survive 24h, and counterfeit/stolen goods.'],
              ['How are carriers verified?', 'Government ID, selfie liveness check, and at least one completed carry before they\'re Top Carrier eligible.'],
              ['Who sets the carry fee?', 'The carrier proposes it; we suggest 15–20% of retail based on similar trips. Buyers see the total before reserving.'],
            ].map(([q, a], i) => (
              <details key={i} style={{ background: 'var(--paper)', padding: '24px 32px', cursor: 'pointer' }}>
                <summary style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', listStyle: 'none', fontSize: 18, fontFamily: 'var(--font-serif)', letterSpacing: '-0.01em' }}>
                  {q}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M12 5v14M5 12h14"/></svg>
                </summary>
                <p style={{ marginTop: 16, fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.6 }}>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <HFooter/>
    </div>
  );
}

// ─── Requests — Spotlight + bento grid ─────────────────────────────────
// Inspired by editorial premium pages (Aesop / Are.na / GQ). One hero
// request anchors the page with full-width city imagery; the rest fills
// a 3-column grid where each card has a real city photo. Sticky filter
// rail across the top.
const REQUEST_CITY_IMG = {
  PAR: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1600&q=85',
  TYO: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=1600&q=85',
  NYC: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1600&q=85',
  SEL: 'https://images.unsplash.com/photo-1548115184-bc6544d06a58?w=1600&q=85',
  LON: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1600&q=85',
  MEL: 'https://images.unsplash.com/photo-1514395462725-fb4566210144?w=1600&q=85',
};

export function PageRequests() {
  const navigate = useNavigate();
  const requests = [
    { id: 1, item: 'Sezane Linen Dress',      store: 'Sezane flagship',         city: 'Paris',     cityCode: 'PAR', budget: 180, fee: 35, postedBy: 'Anna L.',  when: '2h ago',  detail: 'Sezane flagship only — the Aurora linen in cream, size 36. Happy to wait for next restock if needed.', urgency: 'medium', carriers: 3 },
    { id: 2, item: 'Lego Tokyo Skyline',      store: 'Pokémon Center / Bic',     city: 'Tokyo',     cityCode: 'TYO', budget: 90,  fee: 22, postedBy: 'Marco D.', when: '6h ago',  detail: 'Hard to find in Europe — must be original sealed packaging. The 21051 set, Architecture series.', urgency: 'low', carriers: 5 },
    { id: 3, item: 'Glossier You EDP 50ml',   store: 'Glossier SoHo',            city: 'New York',  cityCode: 'NYC', budget: 76,  fee: 18, postedBy: 'Riku S.',  when: '1d ago',  detail: 'SoHo flagship carries the larger 50ml bottle. EU only has 30ml. Glass dropper version preferred.', urgency: 'low', carriers: 4 },
    { id: 4, item: 'Hario V60 02 dripper',    store: 'Hario flagship Asakusa',   city: 'Tokyo',     cityCode: 'TYO', budget: 35,  fee: 10, postedBy: 'Jia W.',   when: '3h ago',  detail: 'Any matte black or white — flexible. Ceramic only, plastic V60s are easy to find here.', urgency: 'low', carriers: 5 },
    { id: 5, item: 'Aesop Resurrection Balm', store: 'Aesop Collins St.',        city: 'Melbourne', cityCode: 'MEL', budget: 42,  fee: 12, postedBy: 'Theo K.',  when: '8h ago',  detail: 'AU pricing is much better than EU. 75ml or 120ml — either size works.', urgency: 'low', carriers: 1 },
    { id: 6, item: 'Hermès silk twilly',      store: 'Faubourg Saint-Honoré',    city: 'Paris',     cityCode: 'PAR', budget: 280, fee: 60, postedBy: 'Mei C.',   when: '4h ago',  detail: 'Faubourg Saint-Honoré flagship. Specific pattern — Brides de Gala in rouge/black. SA can hold for 48h.', urgency: 'high', carriers: 3 },
  ];

  const [city, setCity] = useState('All');
  const [claimed, setClaimed] = useState(new Set());

  const cityCounts = requests.reduce((acc, r) => {
    acc[r.cityCode] = (acc[r.cityCode] || 0) + 1; return acc;
  }, {});
  const cities = [['All', requests.length], ...Object.entries(cityCounts)];

  const filtered = city === 'All' ? requests : requests.filter(r => r.cityCode === city);

  const toggleClaim = (id) => setClaimed(prev => {
    const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n;
  });

  // Build a stable issue label, e.g. "Issue 04 / 2026"
  const issueLabel = `Issue ${String(new Date().getMonth() + 1).padStart(2, '0')} / ${new Date().getFullYear()}`;

  return (
    <div className="h-app" style={{ width: '100%' }}>
      <HNav active="requests"/>

      {/* MASTHEAD — single editorial block, plenty of air */}
      <section style={{ padding: '64px 40px 32px', maxWidth: 1100, margin: '0 auto' }}>
        <div className="h-mono" style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: '.18em', textTransform: 'uppercase' }}>{issueLabel} · {requests.length} open</div>
        <h1 className="h-display" style={{ fontSize: 'clamp(48px, 7vw, 96px)', margin: '12px 0 0', lineHeight: 0.98, maxWidth: 900 }}>
          Requests <span style={{ fontStyle: 'italic', color: 'var(--rouge)' }}>worth flying for.</span>
        </h1>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 24, gap: 24, flexWrap: 'wrap' }}>
          <p style={{ fontSize: 16, color: 'var(--ink-2)', maxWidth: 520, margin: 0, lineHeight: 1.55 }}>
            Six buyers. Six cities. Pick one heading your way and keep the carry fee in full — escrow on every order.
          </p>
          <button onClick={() => navigate('/post-trip')} className="h-btn h-btn-rouge">+ Post a request</button>
        </div>
      </section>

      {/* STICKY FILTER RAIL — quiet city chooser, slides under the nav */}
      <div style={{ position: 'sticky', top: 73, zIndex: 20, background: 'rgba(250,248,244,.92)', backdropFilter: 'saturate(150%) blur(10px)', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '14px 40px', display: 'flex', alignItems: 'center', gap: 24, overflowX: 'auto' }}>
          <span className="h-mono" style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: '.14em', whiteSpace: 'nowrap' }}>FILTER BY CITY</span>
          {cities.map(([code, n]) => {
            const on = city === code;
            return (
              <button key={code} onClick={() => setCity(code)} style={{
                background: 'transparent', border: 'none', cursor: 'pointer', padding: '6px 0',
                fontSize: 13, fontFamily: 'inherit',
                color: on ? 'var(--ink)' : 'var(--ink-3)',
                fontWeight: on ? 600 : 400,
                position: 'relative', whiteSpace: 'nowrap',
                transition: 'color .2s',
              }}>
                {code === 'All' ? 'All' : code} <span style={{ color: 'var(--ink-4)', fontFamily: 'var(--font-mono)', fontSize: 11 }}>· {n}</span>
                {on && <span style={{ position: 'absolute', left: 0, right: 0, bottom: -14, height: 2, background: 'var(--rouge)' }}/>}
              </button>
            );
          })}
        </div>
      </div>

      {/* REQUESTS — hero spotlight + 3-column grid */}
      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 40px 96px' }}>
        {filtered.length === 0 ? (
          <div style={{ padding: '120px 40px', textAlign: 'center' }}>
            <div className="h-serif" style={{ fontSize: 28, color: 'var(--ink-3)' }}>No requests in {city} yet.</div>
            <button onClick={() => setCity('All')} className="h-btn h-btn-ghost" style={{ marginTop: 20 }}>See all cities →</button>
          </div>
        ) : (
          <>
            {/* Hero spotlight — most-urgent / highest-fee */}
            {(() => {
              const hero = [...filtered].sort((a, b) =>
                (b.urgency === 'high' ? 1 : 0) - (a.urgency === 'high' ? 1 : 0) || b.fee - a.fee
              )[0];
              const rest = filtered.filter(r => r.id !== hero.id);
              return (
                <>
                  <RequestHero
                    r={hero}
                    isClaimed={claimed.has(hero.id)}
                    onToggleClaim={() => toggleClaim(hero.id)}
                    onMessage={() => navigate('/messages')}
                  />
                  {rest.length > 0 && (
                    <div style={{ marginTop: 32 }}>
                      <div className="h-mono" style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: '.16em', marginBottom: 20 }}>
                        ALSO OPEN · {rest.length}
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
                        {rest.map((r, i) => (
                          <HScrollReveal key={r.id} delay={i * 60}>
                            <RequestTile
                              r={r}
                              isClaimed={claimed.has(r.id)}
                              onToggleClaim={() => toggleClaim(r.id)}
                            />
                          </HScrollReveal>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              );
            })()}
          </>
        )}
      </main>

      <HFooter/>
    </div>
  );
}

// ─── Hero spotlight card — full-width, city imagery, premium typography ─────
function RequestHero({ r, isClaimed, onToggleClaim, onMessage }) {
  const img = REQUEST_CITY_IMG[r.cityCode] || REQUEST_CITY_IMG.PAR;
  return (
    <article className="h-card-in" style={{
      position: 'relative',
      borderRadius: 'var(--r-lg)',
      overflow: 'hidden',
      minHeight: 520,
      background: `linear-gradient(135deg, rgba(20,17,14,.78) 0%, rgba(20,17,14,.45) 55%, rgba(20,17,14,.85) 100%), url(${img}) center/cover`,
      color: 'var(--paper)',
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      padding: '40px 44px',
    }}>
      {/* Top — meta */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 24 }}>
        <div className="h-mono" style={{ fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase', color: 'rgba(250,248,244,.85)' }}>
          {r.urgency === 'high' && <span style={{ color: '#FFB6C1', marginRight: 10 }}>● Urgent</span>}
          {r.city} · {r.when}
        </div>
        <div className="h-mono" style={{ fontSize: 11, letterSpacing: '.14em', color: 'rgba(250,248,244,.7)' }}>
          FEATURED · ISSUE PICK
        </div>
      </div>

      {/* Middle — headline */}
      <div style={{ maxWidth: '70%' }}>
        <h2 className="h-display" style={{
          fontSize: 'clamp(48px, 6vw, 84px)',
          margin: 0,
          lineHeight: 0.98,
          color: 'var(--paper)',
          letterSpacing: '-0.02em',
        }}>
          {r.item}
        </h2>
        <p className="h-serif" style={{
          fontStyle: 'italic',
          fontSize: 18,
          lineHeight: 1.55,
          color: 'rgba(250,248,244,.86)',
          marginTop: 20,
          maxWidth: '54ch',
        }}>
          "{r.detail}"
        </p>
      </div>

      {/* Bottom — buyer + fee + CTAs */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        gap: 32,
        alignItems: 'flex-end',
        paddingTop: 24,
        borderTop: '1px solid rgba(250,248,244,.18)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <HAvatar name={r.postedBy} size={40}/>
          <div>
            <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--paper)' }}>{r.postedBy}</div>
            <div className="h-mono" style={{ fontSize: 11, color: 'rgba(250,248,244,.65)', letterSpacing: '.06em', marginTop: 2 }}>
              FROM {r.store.toUpperCase()} · RESPONDS IN 24H
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 28 }}>
          <div style={{ textAlign: 'right' }}>
            <div className="h-mono" style={{ fontSize: 10, letterSpacing: '.14em', color: 'rgba(250,248,244,.65)' }}>YOU EARN</div>
            <div className="h-display" style={{ fontSize: 64, lineHeight: 1, color: 'var(--paper)', marginTop: 4 }}>
              ${r.fee}
            </div>
            <div className="h-mono" style={{ fontSize: 10, color: 'rgba(250,248,244,.55)', letterSpacing: '.06em', marginTop: 4 }}>
              ≈ ${r.budget} RETAIL · BUYER PAYS ${r.budget + r.fee}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button
              onClick={onToggleClaim}
              style={{
                padding: '14px 24px',
                borderRadius: 999,
                border: 'none',
                background: isClaimed ? 'transparent' : 'var(--paper)',
                color: isClaimed ? 'var(--paper)' : 'var(--ink)',
                fontSize: 14, fontWeight: 600, fontFamily: 'inherit',
                cursor: 'pointer',
                boxShadow: isClaimed ? 'inset 0 0 0 1px rgba(250,248,244,.45)' : 'none',
                transition: 'all .25s var(--ease-out)',
                whiteSpace: 'nowrap',
              }}
            >
              {isClaimed ? 'Claimed ✓ · Undo' : `Claim · earn $${r.fee}`}
            </button>
            <button onClick={onMessage} style={{
              background: 'transparent', border: 'none', cursor: 'pointer',
              fontSize: 12, color: 'rgba(250,248,244,.7)', fontFamily: 'inherit',
              padding: '4px 0', textDecoration: 'underline', textUnderlineOffset: 3, textAlign: 'center',
            }}>
              Ask {r.postedBy.split(' ')[0]} a question
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

// ─── Compact tile for the bento grid ─────────────────────
function RequestTile({ r, isClaimed, onToggleClaim }) {
  const img = REQUEST_CITY_IMG[r.cityCode] || REQUEST_CITY_IMG.PAR;
  return (
    <article
      className="h-card h-zoom-frame"
      style={{
        position: 'relative',
        cursor: 'pointer',
        borderColor: isClaimed ? 'var(--rouge)' : 'var(--line)',
        background: isClaimed ? 'var(--rouge-soft)' : 'var(--paper)',
        transition: 'transform .25s var(--ease-out), box-shadow .25s var(--ease-out), background .25s var(--ease-out)',
        display: 'flex', flexDirection: 'column',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
    >
      {/* Image — city context */}
      <div style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden' }}>
        <img src={img} alt={r.city} className="h-zoom-img" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(.92)' }}/>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(20,17,14,.05) 0%, rgba(20,17,14,.55) 100%)' }}/>
        <div style={{ position: 'absolute', top: 14, left: 14, right: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="h-mono" style={{ fontSize: 10, letterSpacing: '.14em', color: 'var(--paper)', background: 'rgba(0,0,0,.32)', backdropFilter: 'blur(6px)', padding: '4px 10px', borderRadius: 999 }}>
            {r.cityCode}
          </span>
          {r.urgency === 'high' && <span className="h-mono" style={{ fontSize: 9, letterSpacing: '.16em', color: 'var(--paper)', background: 'var(--rouge)', padding: '4px 8px', borderRadius: 999 }}>URGENT</span>}
        </div>
        <div style={{ position: 'absolute', bottom: 14, left: 14, right: 14, color: 'var(--paper)' }}>
          <h3 className="h-serif" style={{ fontSize: 22, margin: 0, lineHeight: 1.15, letterSpacing: '-0.01em' }}>{r.item}</h3>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '18px 20px', flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <p style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.55, margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {r.detail}
        </p>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: 12, borderTop: '1px solid var(--line)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
            <HAvatar name={r.postedBy} size={22}/>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.postedBy}</div>
              <div className="h-mono" style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: '.06em' }}>{r.when.toUpperCase()}</div>
            </div>
          </div>
          <div className="h-display" style={{ fontSize: 26, color: 'var(--rouge)', whiteSpace: 'nowrap' }}>
            +${r.fee}
          </div>
        </div>

        <button
          onClick={onToggleClaim}
          className={isClaimed ? 'h-btn h-btn-ghost h-btn-sm' : 'h-btn h-btn-primary h-btn-sm'}
          style={{ width: '100%' }}
        >
          {isClaimed ? 'Claimed ✓ · Undo' : `Claim · earn $${r.fee}`}
        </button>
      </div>
    </article>
  );
}

export function PageCart() {
  const navigate = useNavigate();
  const cart = useCart();
  const items = cart.items;
  const itemCount = items.reduce((s, i) => s + i.qty, 0);
  // Group items by carrier
  const groups = items.reduce((acc, it) => {
    const key = it.carrier;
    if (!acc[key]) acc[key] = { carrier: it.carrier, from: it.from, to: it.to, departs: it.departs, items: [] };
    acc[key].items.push(it);
    return acc;
  }, {});
  const subtotal = cartSubtotal(items);
  const retailTotal = items.reduce((s, i) => s + i.retail * i.qty, 0);
  const feeTotal = items.reduce((s, i) => s + i.fee * i.qty, 0);
  const serviceFee = items.length ? 4.50 : 0;
  const total = subtotal + serviceFee;

  const handleCheckout = () => {
    if (!items.length) return;
    navigate('/checkout');
  };

  return (
    <div className="h-app" style={{ width: '100%' }}>
      <HNav active=""/>
      <section style={{ padding: '40px 40px 96px', maxWidth: 1280, margin: '0 auto' }}>
        <div className="h-eyebrow" style={{ marginBottom: 8 }}>Cart · {itemCount} item{itemCount !== 1 ? 's' : ''} · {Object.keys(groups).length} carrier{Object.keys(groups).length !== 1 ? 's' : ''}</div>
        <h1 className="h-display" style={{ fontSize: 44, margin: 0, lineHeight: 1.04 }}>Reserve <span style={{ fontStyle: 'italic', color: 'var(--rouge)' }}>your carries.</span></h1>
        <p style={{ fontSize: 14, color: 'var(--ink-3)', marginTop: 8, maxWidth: 520 }}>You're not charged until your carrier accepts. ★ 4.9 across 8,210 reviews.</p>

        {items.length === 0 ? (
          <div style={{ marginTop: 80, padding: '80px 40px', textAlign: 'center', border: '1px dashed var(--line-2)', borderRadius: 'var(--r-lg)' }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🛒</div>
            <h2 className="h-serif" style={{ fontSize: 32, margin: 0 }}>Your cart is empty</h2>
            <p style={{ fontSize: 14, color: 'var(--ink-3)', margin: '12px 0 24px' }}>Browse carriers and reserve an item to get started.</p>
            <Link to="/browse" className="h-btn h-btn-primary">Browse carriers →</Link>
          </div>
        ) : (
          <div style={{ marginTop: 56, display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 64 }}>
            <div>
              {Object.values(groups).map((g, gi) => (
                <div key={gi} style={{ marginBottom: 32 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingBottom: 16, borderBottom: '1px solid var(--line-2)' }}>
                    <HAvatar name={g.carrier} size={36}/>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 15, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>{g.carrier} <HVerified size={12}/></div>
                      <div className="h-mono" style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: '.06em' }}>{g.from.toUpperCase()} → {g.to.toUpperCase()} · {g.departs.toUpperCase()}</div>
                    </div>
                    <span className="h-chip h-chip-amber">In-flight slots</span>
                  </div>
                  {g.items.map(it => <CartLine key={it.id} item={it}/>)}
                </div>
              ))}
            </div>

            <aside style={{ position: 'sticky', top: 100, alignSelf: 'flex-start' }}>
              <div className="h-card" style={{ padding: 28 }}>
                <h3 className="h-eyebrow" style={{ marginBottom: 20 }}>Order summary</h3>
                <div style={{ display: 'grid', gap: 10, fontSize: 14 }}>
                  <Row k="Items retail" v={`$${retailTotal.toFixed(2)}`}/>
                  <Row k="Carry fees" v={`$${feeTotal.toFixed(2)}`} accent/>
                  <Row k="Service fee" v={`$${serviceFee.toFixed(2)}`}/>
                  <Row k="Customs / shipping" v="$0.00" muted/>
                </div>
                <hr className="h-divider" style={{ margin: '20px 0' }}/>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: 14 }}>Total today</span>
                  <span className="h-serif" style={{ fontSize: 40 }}>${total.toFixed(2)}</span>
                </div>
                <p className="h-mono" style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: '.08em', marginTop: 8 }}>HELD IN ESCROW — RELEASED ONLY ON RECEIPT</p>
                <button onClick={handleCheckout} className="h-btn h-btn-primary h-btn-lg" style={{ width: '100%', marginTop: 24 }}>Checkout securely →</button>
                <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: 16, fontSize: 11, color: 'var(--ink-3)' }}>
                  <span>🛡️ Buyer protected</span><span>🔒 256-bit SSL</span><span>↩ Free disputes</span>
                </div>
              </div>
              <div style={{ marginTop: 16, padding: 16, background: 'var(--paper-2)', borderRadius: 12, fontSize: 12, color: 'var(--ink-2)', lineHeight: 1.55 }}>
                <b style={{ color: 'var(--ink)' }}>Promo</b> — First-time buyers get $10 off carry fees. Auto-applied at checkout.
              </div>
            </aside>
          </div>
        )}
      </section>
      <HFooter/>
    </div>
  );
}

// ─── Checkout — real payment form ───────────────────────────
export function PageCheckout() {
  const navigate = useNavigate();
  const cart = useCart();
  const items = cart.items;

  // Carrier-driven hand-off options. The first item's carrier gates the
  // available methods; in the demo, items from one cart share a carrier.
  const carrierName = items[0]?.carrier;
  const carrierHandoff = useMemo(() => getCarrierHandoff(carrierName), [carrierName]);
  const availableMethods = carrierHandoff.methods;

  // Form state — pick the carrier's first method by default.
  const [email, setEmail] = useState('demo@handi.com');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('Maya Chen');
  const [handoff, setHandoff] = useState(availableMethods[0] || 'meetup');
  const [meetupSpot, setMeetupSpot] = useState(carrierHandoff.spots[0] || '');
  const [address1, setAddress1] = useState('');
  const [city, setCity] = useState('Brooklyn');
  const [zip, setZip] = useState('11211');

  // Pricing — doorstep adds carrier-set fee to the total.
  const retailTotal = items.reduce((s, i) => s + i.retail * i.qty, 0);
  const feeTotal = items.reduce((s, i) => s + i.fee * i.qty, 0);
  const subtotal = cartSubtotal(items);
  const serviceFee = items.length ? 4.50 : 0;
  const handoffFee = handoff === 'doorstep' ? (carrierHandoff.doorstepFee || 0) : 0;
  const total = subtotal + serviceFee + handoffFee;

  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' | 'apple' | 'google'
  const [card, setCard] = useState('');
  const [exp, setExp] = useState('');
  const [cvc, setCvc] = useState('');
  const [cardName, setCardName] = useState('');
  const [savePayment, setSavePayment] = useState(true);
  const [cardFlipped, setCardFlipped] = useState(false);

  const [agree, setAgree] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Brand detection — derive everything from the digit prefix.
  const cardDigits = card.replace(/\s/g, '');
  const brand = detectBrand(cardDigits);
  const brandSpec = BRAND_SPECS[brand];

  // Format helpers — Amex uses 4-6-5 grouping with 15 digits + 4-digit CVC.
  const onCardChange = (v) => {
    const digits = v.replace(/\D/g, '').slice(0, brandSpec.maxLength);
    setCard(formatCardNumber(digits, detectBrand(digits)));
    // If user shrinks the number below 15/16, drop excess CVC too.
    const newCvcMax = BRAND_SPECS[detectBrand(digits)].cvcLength;
    if (cvc.length > newCvcMax) setCvc(cvc.slice(0, newCvcMax));
  };
  const onExpChange = (v) => {
    const digits = v.replace(/\D/g, '').slice(0, 4);
    setExp(digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits);
  };
  const onCvcChange = (v) => setCvc(v.replace(/\D/g, '').slice(0, brandSpec.cvcLength));

  // Validation — card fields only required when paying with a card.
  const cardValid = paymentMethod !== 'card' || (
    cardDigits.length === brandSpec.maxLength &&
    /^\d{2}\/\d{2}$/.test(exp) &&
    cvc.length === brandSpec.cvcLength &&
    cardName.trim().length > 1
  );
  const valid = (
    items.length > 0 &&
    /\S+@\S+\.\S+/.test(email) &&
    name.trim().length > 1 &&
    (handoff !== 'meetup' || meetupSpot.trim().length > 0) &&
    (handoff !== 'doorstep' || (address1.trim().length > 0 && city.trim().length > 0 && zip.trim().length >= 4)) &&
    cardValid &&
    agree
  );

  const placeOrder = () => {
    if (!valid || submitting) return;
    setSubmitting(true);
    // Navigate immediately; clear cart on next tick (after navigation kicks in)
    // so the empty-cart redirect view doesn't render during transition.
    navigate('/order-detail');
    Promise.resolve().then(() => clearCart());
  };

  // Empty cart redirect
  if (items.length === 0) {
    return (
      <div className="h-app" style={{ width: '100%' }}>
        <HNav active=""/>
        <section style={{ padding: '88px 40px', maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
          <div className="h-eyebrow" style={{ marginBottom: 16 }}>Checkout</div>
          <h1 className="h-display" style={{ fontSize: 44, margin: 0 }}>No items to <span style={{ fontStyle: 'italic', color: 'var(--rouge)' }}>check out.</span></h1>
          <p style={{ fontSize: 14, color: 'var(--ink-3)', margin: '16px 0 28px' }}>Reserve an item from a carrier first, then come back here to pay.</p>
          <Link to="/browse" className="h-btn h-btn-primary">Browse carriers →</Link>
        </section>
        <HFooter/>
      </div>
    );
  }

  return (
    <div className="h-app" style={{ width: '100%' }}>
      <HNav active=""/>
      <section style={{ padding: '32px 40px 96px', maxWidth: 1280, margin: '0 auto' }}>
        <Link to="/cart" style={{ fontSize: 12, color: 'var(--ink-3)', fontFamily: 'var(--font-mono)', letterSpacing: '.06em', textDecoration: 'none' }}>← BACK TO CART</Link>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 12, marginBottom: 32 }}>
          <div>
            <div className="h-eyebrow" style={{ marginBottom: 8 }}>Secure checkout · Step 2 of 3</div>
            <h1 className="h-display" style={{ fontSize: 44, margin: 0, lineHeight: 1.04 }}>Almost <span style={{ fontStyle: 'italic', color: 'var(--rouge)' }}>there.</span></h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'var(--ink-3)', fontFamily: 'var(--font-mono)', letterSpacing: '.06em' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
            256-BIT TLS · STRIPE
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 64 }}>
          {/* LEFT: form */}
          <div style={{ display: 'grid', gap: 32 }}>
            {/* Contact */}
            <fieldset className="h-card-in" style={{ ...fieldset, animationDelay: '40ms' }}>
              <legend style={legend}>01 · Contact</legend>
              <div style={twoCol}>
                <Field label="Email">
                  <input className="h-input" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com"/>
                </Field>
                <Field label="Phone (optional)">
                  <input className="h-input" type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+1 (555) 123-4567"/>
                </Field>
              </div>
            </fieldset>

            {/* Hand-off — driven by what the carrier offers */}
            <fieldset className="h-card-in" style={{ ...fieldset, animationDelay: '120ms' }}>
              <legend style={legend}>02 · Hand-off</legend>
              <p style={{ fontSize: 12, color: 'var(--ink-3)', margin: '0 0 14px' }}>
                {carrierName ? <>How {carrierName} will deliver — pick the option that works for you.</> : 'Pick how the carrier should deliver.'}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${availableMethods.length}, 1fr)`, gap: 12, marginBottom: 20 }}>
                {availableMethods.map(m => {
                  const meta = HANDOFF_META[m];
                  const on = handoff === m;
                  const showFee = m === 'doorstep' && (carrierHandoff.doorstepFee || 0) > 0;
                  return (
                    <button type="button" key={m} onClick={() => setHandoff(m)} style={{
                      padding: 18, textAlign: 'left', borderRadius: 12, cursor: 'pointer',
                      border: '1px solid', borderColor: on ? 'var(--ink)' : 'var(--line-2)',
                      background: on ? 'var(--paper-2)' : 'var(--paper)',
                      transition: 'border-color .25s var(--ease-out), background .25s var(--ease-out)',
                      fontFamily: 'inherit',
                    }}>
                      <div style={{ fontSize: 20, marginBottom: 8 }}>{meta.icon}</div>
                      <div style={{ fontSize: 14, fontWeight: 500 }}>{meta.t}{showFee && <span style={{ color: 'var(--rouge)', fontWeight: 400, marginLeft: 6 }}>+${carrierHandoff.doorstepFee}</span>}</div>
                      <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 4, lineHeight: 1.45 }}>{meta.d}</div>
                    </button>
                  );
                })}
              </div>

              <Field label="Recipient name">
                <input className="h-input" required value={name} onChange={e => setName(e.target.value)} placeholder="Full name"/>
              </Field>

              {/* Method-specific fields */}
              {handoff === 'meetup' && (
                <div style={{ marginTop: 14 }}>
                  <span className="h-mono" style={{ display: 'block', fontSize: 11, color: 'var(--ink-3)', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 8 }}>Pick a meetup spot</span>
                  {carrierHandoff.spots.length > 0 ? (
                    <div style={{ display: 'grid', gap: 8 }}>
                      {carrierHandoff.spots.map((s, i) => {
                        const on = meetupSpot === s;
                        return (
                          <button type="button" key={i} onClick={() => setMeetupSpot(s)} style={{
                            padding: '12px 14px', textAlign: 'left', borderRadius: 10, cursor: 'pointer',
                            border: '1px solid', borderColor: on ? 'var(--ink)' : 'var(--line-2)',
                            background: on ? 'var(--paper-2)' : 'var(--paper)',
                            display: 'flex', alignItems: 'center', gap: 12,
                            fontFamily: 'inherit',
                          }}>
                            <span style={{ width: 16, height: 16, borderRadius: 999, border: '1.5px solid', borderColor: on ? 'var(--ink)' : 'var(--line-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              {on && <span style={{ width: 8, height: 8, borderRadius: 999, background: 'var(--ink)' }}/>}
                            </span>
                            <span style={{ fontSize: 14 }}>{s}</span>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <input className="h-input" placeholder="No preset spots — agree on one in chat" value={meetupSpot} onChange={e => setMeetupSpot(e.target.value)}/>
                  )}
                </div>
              )}

              {handoff === 'doorstep' && (
                <>
                  <Field label="Address" style={{ marginTop: 14 }}>
                    <input className="h-input" required value={address1} onChange={e => setAddress1(e.target.value)} placeholder="123 Bedford Ave, Apt 2B"/>
                  </Field>
                  <div style={{ ...twoCol, marginTop: 12 }}>
                    <Field label="City">
                      <input className="h-input" required value={city} onChange={e => setCity(e.target.value)}/>
                    </Field>
                    <Field label="ZIP">
                      <input className="h-input" required value={zip} onChange={e => setZip(e.target.value)} placeholder="11211"/>
                    </Field>
                  </div>
                </>
              )}

              {handoff === 'pickup' && (
                <div style={{ marginTop: 14, padding: 14, background: 'var(--paper-2)', borderRadius: 10 }}>
                  <div className="h-mono" style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: '.08em' }}>YOU'LL PICK UP AT</div>
                  <div style={{ fontSize: 14, marginTop: 4, fontWeight: 500 }}>{carrierHandoff.pickupAddress || 'Address shared after order confirmation'}</div>
                  <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 6, lineHeight: 1.5 }}>Coordinate timing with {carrierName || 'the carrier'} in chat after they land.</div>
                </div>
              )}
            </fieldset>

            {/* Payment */}
            <fieldset className="h-card-in" style={{ ...fieldset, animationDelay: '200ms' }}>
              <legend style={legend}>03 · Payment</legend>

              {/* Method tabs — Card / Apple Pay / Google Pay */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 20 }}>
                {[
                  { v: 'card',   t: 'Card',       icon: <svg width="18" height="14" viewBox="0 0 24 18" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="1" y="1" width="22" height="16" rx="2"/><path d="M1 6h22M5 12h4"/></svg> },
                  { v: 'apple',  t: 'Apple Pay',  icon: <ApplePayMark height={16}/> },
                  { v: 'google', t: 'Google Pay', icon: <GooglePayMark height={14}/> },
                ].map(o => {
                  const on = paymentMethod === o.v;
                  return (
                    <button type="button" key={o.v} onClick={() => setPaymentMethod(o.v)} style={{
                      padding: '12px 14px', borderRadius: 10, cursor: 'pointer',
                      border: '1px solid', borderColor: on ? 'var(--ink)' : 'var(--line-2)',
                      background: on ? 'var(--paper-2)' : 'var(--paper)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      fontSize: 13, fontWeight: 500, fontFamily: 'inherit', color: 'var(--ink)',
                      transition: 'all .2s var(--ease-out)',
                    }}>
                      {o.icon}
                      <span>{o.t}</span>
                    </button>
                  );
                })}
              </div>

              {paymentMethod === 'card' && (
                <div className="h-fade-up">
                  {/* Brand badges — the detected one lights up */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
                    {['visa', 'mastercard', 'amex', 'discover', 'jcb'].map(b => {
                      const on = brand === b;
                      return (
                        <span key={b} style={{
                          fontSize: 10, fontFamily: 'var(--font-mono)', letterSpacing: '.08em', textTransform: 'uppercase',
                          padding: '4px 10px', borderRadius: 6,
                          border: '1px solid', borderColor: on ? BRAND_SPECS[b].accent : 'var(--line)',
                          background: on ? BRAND_SPECS[b].accent : 'transparent',
                          color: on ? 'white' : 'var(--ink-3)',
                          transition: 'all .25s var(--ease-out)',
                          transform: on ? 'scale(1.05)' : 'scale(1)',
                        }}>{BRAND_SPECS[b].label}</span>
                      );
                    })}
                  </div>

                  {/* Live card preview that flips on CVC focus */}
                  <CardPreview
                    flipped={cardFlipped}
                    brand={brand}
                    cardDigits={cardDigits}
                    exp={exp}
                    cvc={cvc}
                    cardName={cardName}
                  />

                  <div style={{ marginTop: 24 }}>
                    <Field label="Card number">
                      <div style={{ position: 'relative' }}>
                        <input className="h-input" required value={card} onChange={e => onCardChange(e.target.value)} placeholder={brandSpec.placeholder} inputMode="numeric" autoComplete="cc-number" style={{ paddingRight: 56 }}/>
                        <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center' }}>
                          <BrandMark brand={brand} small/>
                        </div>
                      </div>
                    </Field>
                    <div style={{ ...twoCol, marginTop: 12 }}>
                      <Field label="Expiry">
                        <input className="h-input" required value={exp} onChange={e => onExpChange(e.target.value)} placeholder="MM/YY" inputMode="numeric" autoComplete="cc-exp"/>
                      </Field>
                      <Field label={brand === 'amex' ? 'CID (4 digits)' : 'CVC'}>
                        <input
                          className="h-input"
                          required
                          value={cvc}
                          onChange={e => onCvcChange(e.target.value)}
                          onFocus={() => setCardFlipped(true)}
                          onBlur={() => setCardFlipped(false)}
                          placeholder={brand === 'amex' ? '1234' : '123'}
                          inputMode="numeric"
                          autoComplete="cc-csc"
                        />
                      </Field>
                    </div>
                    <Field label="Name on card" style={{ marginTop: 12 }}>
                      <input className="h-input" required value={cardName} onChange={e => setCardName(e.target.value)} placeholder="As it appears on the card" autoComplete="cc-name"/>
                    </Field>
                  </div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 16, fontSize: 13, color: 'var(--ink-2)', cursor: 'pointer' }}>
                    <input type="checkbox" checked={savePayment} onChange={e => setSavePayment(e.target.checked)} style={{ accentColor: 'var(--rouge)' }}/>
                    Save this card for future carries
                  </label>
                </div>
              )}

              {paymentMethod === 'apple' && (
                <div className="h-fade-up" style={{ display: 'grid', gap: 16 }}>
                  <div style={{
                    background: '#000', color: '#fff', borderRadius: 14, padding: '24px 28px',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
                  }}>
                    <div>
                      <div style={{ fontSize: 13, opacity: .8, fontFamily: 'var(--font-mono)', letterSpacing: '.06em' }}>YOU'LL CONFIRM WITH</div>
                      <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
                        <ApplePayMark height={28} color="#fff"/>
                        <span style={{ fontSize: 22, fontWeight: 500 }}>Touch ID / Face ID</span>
                      </div>
                    </div>
                    <div style={{ width: 64, height: 64, borderRadius: 999, background: 'rgba(255,255,255,.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 11c0 3.5-1.5 6.5-4 9M16 13c0 2-.5 4-1.5 6M8 9a4 4 0 1 1 8 0v3M4 9a8 8 0 0 1 12.5-6.6M20 9v3a8 8 0 0 1-1 4"/></svg>
                    </div>
                  </div>
                  <div style={{ padding: 14, background: 'var(--paper-2)', borderRadius: 10, fontSize: 12, color: 'var(--ink-2)', lineHeight: 1.55 }}>
                    Apple Pay uses your default card in Wallet — funds are still held in handi escrow until you confirm receipt. No card details are shared with the carrier.
                  </div>
                </div>
              )}

              {paymentMethod === 'google' && (
                <div className="h-fade-up" style={{ display: 'grid', gap: 16 }}>
                  <div style={{
                    background: '#fff', color: '#3c4043', border: '1px solid #dadce0',
                    borderRadius: 14, padding: '24px 28px',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
                  }}>
                    <div>
                      <div style={{ fontSize: 13, color: '#5f6368', fontFamily: 'var(--font-mono)', letterSpacing: '.06em' }}>YOU'LL CONFIRM WITH</div>
                      <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
                        <GooglePayMark height={26}/>
                        <span style={{ fontSize: 22, fontWeight: 500 }}>Google account</span>
                      </div>
                    </div>
                    <div style={{ width: 64, height: 64, borderRadius: 999, background: '#f1f3f4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="32" height="32" viewBox="0 0 24 24"><path d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.4c-.2 1.3-.9 2.4-2 3.1v2.6h3.2c1.9-1.7 3-4.3 3-7.5z" fill="#4285F4"/><path d="M12 22c2.7 0 5-.9 6.6-2.4l-3.2-2.6c-.9.6-2 1-3.4 1-2.6 0-4.8-1.7-5.6-4.1H3.1v2.6C4.7 19.7 8.1 22 12 22z" fill="#34A853"/><path d="M6.4 13.9c-.2-.6-.3-1.2-.3-1.9s.1-1.3.3-1.9V7.5H3.1A10 10 0 0 0 2 12c0 1.6.4 3.1 1.1 4.5l3.3-2.6z" fill="#FBBC05"/><path d="M12 6c1.5 0 2.8.5 3.8 1.5l2.8-2.8C17 3.1 14.7 2 12 2 8.1 2 4.7 4.3 3.1 7.5l3.3 2.6C7.2 7.7 9.4 6 12 6z" fill="#EA4335"/></svg>
                    </div>
                  </div>
                  <div style={{ padding: 14, background: 'var(--paper-2)', borderRadius: 10, fontSize: 12, color: 'var(--ink-2)', lineHeight: 1.55 }}>
                    Google Pay uses the default card in your Google account — funds are still held in handi escrow until you confirm receipt.
                  </div>
                </div>
              )}
            </fieldset>

            <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, color: 'var(--ink-2)', cursor: 'pointer', lineHeight: 1.5 }}>
              <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} style={{ accentColor: 'var(--rouge)', marginTop: 3 }}/>
              <span>I agree that funds will be held in escrow and released to the carrier only after I confirm receipt. <Link to="/how-it-works" style={{ color: 'var(--rouge-deep)' }}>Buyer protection terms</Link>.</span>
            </label>
          </div>

          {/* RIGHT: order summary */}
          <aside style={{ position: 'sticky', top: 100, alignSelf: 'flex-start' }}>
            <div
              className="h-card h-card-slide"
              style={{
                padding: 28,
                animationDelay: '280ms',
                boxShadow: 'var(--shadow-md)',
                transition: 'transform .3s var(--ease-out), box-shadow .3s var(--ease-out)',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
            >
              <h3 className="h-eyebrow" style={{ marginBottom: 20 }}>Order summary</h3>
              <div style={{ display: 'grid', gap: 14, marginBottom: 20 }}>
                {items.map((it, idx) => (
                  <div
                    key={it.id}
                    className="h-card-in"
                    style={{
                      display: 'grid', gridTemplateColumns: '48px 1fr auto', gap: 12, alignItems: 'center',
                      animationDelay: `${360 + idx * 80}ms`,
                    }}
                  >
                    <div style={{ width: 48, height: 48, borderRadius: 8, background: `url(${it.img}) center/cover`, position: 'relative' }}>
                      <span style={{ position: 'absolute', top: -6, right: -6, minWidth: 18, height: 18, padding: '0 5px', background: 'var(--ink)', color: 'var(--paper)', borderRadius: 999, fontSize: 10, fontWeight: 600, fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{it.qty}</span>
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{it.title}</div>
                      <div style={{ fontSize: 11, color: 'var(--ink-3)', fontFamily: 'var(--font-mono)', letterSpacing: '.04em' }}>{it.from} → {it.to}</div>
                    </div>
                    <div className="h-serif" style={{ fontSize: 15 }}>${(it.retail + it.fee) * it.qty}</div>
                  </div>
                ))}
              </div>
              <hr className="h-divider"/>
              <div style={{ display: 'grid', gap: 8, fontSize: 13, marginTop: 16 }}>
                <Row k="Items retail" v={`$${retailTotal.toFixed(2)}`}/>
                <Row k="Carry fees" v={`$${feeTotal.toFixed(2)}`} accent/>
                <Row k="Service fee" v={`$${serviceFee.toFixed(2)}`}/>
                {handoffFee > 0 && <Row k="Doorstep delivery" v={`$${handoffFee.toFixed(2)}`}/>}
                <Row k="Customs / shipping" v="$0.00" muted/>
              </div>
              <hr className="h-divider" style={{ margin: '16px 0' }}/>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: 14 }}>Total</span>
                <span className="h-serif" style={{ fontSize: 36 }}>${total.toFixed(2)}</span>
              </div>
              <p className="h-mono" style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: '.08em', marginTop: 6 }}>USD · INCLUSIVE OF ALL FEES</p>

              <button
                type="button"
                onClick={placeOrder}
                disabled={!valid || submitting}
                className={paymentMethod === 'card' ? 'h-btn h-btn-primary h-btn-lg' : 'h-btn h-btn-lg'}
                style={{
                  width: '100%', marginTop: 24,
                  opacity: !valid || submitting ? 0.55 : 1,
                  cursor: !valid || submitting ? 'not-allowed' : 'pointer',
                  // Apple Pay = pure black; Google Pay = white with thin border (per their brand guides)
                  ...(paymentMethod === 'apple'  ? { background: '#000', color: '#fff', border: 'none' } : {}),
                  ...(paymentMethod === 'google' ? { background: '#fff', color: '#3c4043', border: '1px solid #dadce0' } : {}),
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                }}
              >
                {submitting ? 'Processing…' : (
                  paymentMethod === 'apple'  ? <><ApplePayMark height={20} color="#fff"/><span>· Pay ${total.toFixed(2)}</span></> :
                  paymentMethod === 'google' ? <><GooglePayMark height={18}/><span>· Pay ${total.toFixed(2)}</span></> :
                  `Place order · $${total.toFixed(2)}`
                )}
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 14, padding: '10px 12px', background: 'var(--rouge-soft)', border: '1px solid rgba(139,30,45,.12)', borderRadius: 8 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--rouge-deep)" strokeWidth="1.8"><path d="M12 2L4 6v6c0 5 3.5 9.7 8 11 4.5-1.3 8-6 8-11V6l-8-4z"/></svg>
                <span style={{ fontSize: 11, color: 'var(--rouge-ink)', lineHeight: 1.4 }}>You won't be charged until the carrier accepts. Funds sit in escrow until you confirm receipt.</span>
              </div>
            </div>
          </aside>
        </div>
      </section>
      <HFooter/>
    </div>
  );
}

const fieldset = { border: '1px solid var(--line)', borderRadius: 'var(--r-lg)', padding: 28, margin: 0 };
const legend = { padding: '0 8px', fontSize: 11, fontFamily: 'var(--font-mono)', letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--ink-2)' };
const twoCol = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 };

const HANDOFF_META = {
  meetup:   { icon: '👋', t: 'Meetup',       d: 'Carrier picks a public spot near your route' },
  doorstep: { icon: '🏠', t: 'Doorstep',     d: 'Carrier drops at your address' },
  pickup:   { icon: '📦', t: 'Pickup',       d: 'You collect from the carrier' },
};

// ─── Card brand detection ─────────────────────────────────
// Each brand declares its prefix regex, max digit length, CVC length,
// gradient (for the live preview), accent color (for the badge), placeholder.
const BRAND_SPECS = {
  visa:       { label: 'Visa',       prefix: /^4/,                       maxLength: 16, cvcLength: 3, gradient: 'linear-gradient(135deg, #1A1F71 0%, #4361A8 100%)', accent: '#1A1F71', placeholder: '4242 4242 4242 4242' },
  mastercard: { label: 'Mastercard', prefix: /^(5[1-5]|2[2-7])/,         maxLength: 16, cvcLength: 3, gradient: 'linear-gradient(135deg, #1F1F1F 0%, #EB001B 60%, #F79E1B 100%)', accent: '#EB001B', placeholder: '5500 0000 0000 0004' },
  amex:       { label: 'Amex',       prefix: /^3[47]/,                   maxLength: 15, cvcLength: 4, gradient: 'linear-gradient(135deg, #006FCF 0%, #00A2E5 100%)', accent: '#006FCF', placeholder: '3782 822463 10005' },
  discover:   { label: 'Discover',   prefix: /^(6011|65|64[4-9])/,       maxLength: 16, cvcLength: 3, gradient: 'linear-gradient(135deg, #FF6000 0%, #FFA000 100%)', accent: '#FF6000', placeholder: '6011 0000 0000 0004' },
  jcb:        { label: 'JCB',        prefix: /^35/,                      maxLength: 16, cvcLength: 3, gradient: 'linear-gradient(135deg, #0E4C92 0%, #BC1A1F 50%, #007934 100%)', accent: '#0E4C92', placeholder: '3530 1113 3330 0000' },
  unknown:    { label: 'Card',       prefix: /^$/,                       maxLength: 16, cvcLength: 3, gradient: 'linear-gradient(135deg, #14110E 0%, #6B1722 100%)', accent: 'var(--ink)', placeholder: '1234 5678 9012 3456' },
};

const detectBrand = (digits) => {
  for (const [name, spec] of Object.entries(BRAND_SPECS)) {
    if (name === 'unknown') continue;
    if (spec.prefix.test(digits)) return name;
  }
  return 'unknown';
};

const formatCardNumber = (digits, brand) => {
  if (brand === 'amex') {
    // 4-6-5 grouping
    const a = digits.slice(0, 4);
    const b = digits.slice(4, 10);
    const c = digits.slice(10, 15);
    return [a, b, c].filter(Boolean).join(' ');
  }
  // 4-4-4-4 grouping
  return digits.match(/.{1,4}/g)?.join(' ') || '';
};

// ─── Wallet brand marks ───────────────────────────────────
function ApplePayMark({ height = 20, color = 'currentColor' }) {
  // 165:60 is roughly the official Apple Pay aspect ratio.
  return (
    <svg height={height} viewBox="0 0 165 60" fill={color} aria-label="Apple Pay" role="img">
      <path d="M28.4 16.7c-1.2 1.5-3.2 2.6-5.1 2.5-.3-2 .7-4.1 1.8-5.4 1.2-1.5 3.4-2.6 5.1-2.7.2 2.1-.6 4.1-1.8 5.6zm1.7 2.8c-2.8-.2-5.2 1.6-6.6 1.6-1.4 0-3.4-1.5-5.7-1.5-2.9 0-5.6 1.7-7.1 4.4-3.1 5.3-.8 13.2 2.2 17.5 1.5 2.1 3.2 4.5 5.6 4.4 2.2-.1 3.1-1.4 5.8-1.4s3.5 1.4 5.7 1.4c2.4 0 3.9-2.1 5.4-4.3 1.6-2.3 2.3-4.6 2.3-4.7-.1-.1-4.5-1.7-4.5-6.8 0-4.3 3.5-6.4 3.7-6.5-2-3-5.2-3.4-6.3-3.5l-.5-.6zM50 14v32h5V35h6.9c6.3 0 10.7-4.3 10.7-10.5S68.2 14 62 14H50zm5 4.2h5.7c4.3 0 6.7 2.3 6.7 6.3s-2.4 6.3-6.7 6.3H55V18.2zM82 46.4c3.1 0 6-1.6 7.4-4.1h.1V46h4.6V30c0-4.6-3.7-7.6-9.4-7.6-5.3 0-9.2 3-9.4 7.2H80c.4-2 2.2-3.3 4.6-3.3 2.9 0 4.5 1.4 4.5 3.9v1.7l-6.2.4c-5.8.3-8.9 2.7-8.9 6.9 0 4.2 3.3 7 8 7zm1.3-3.8c-2.5 0-4.1-1.2-4.1-3.1 0-1.9 1.5-3 4.5-3.2l5.5-.4v1.7c0 2.8-2.4 5-5.9 5zm17.7 11.6c5 0 7.4-2 9.4-7.7L119 22.6h-5.1L108.4 40h-.1l-5.6-17.4h-5.3l8 22.4-.4 1.4c-.7 2.4-1.9 3.3-4 3.3-.4 0-1.1 0-1.4-.1v3.9c.3.1 1.4.1 1.7.1z"/>
    </svg>
  );
}
function GooglePayMark({ height = 18 }) {
  // Google Pay wordmark — colored G + Pay text
  return (
    <svg height={height} viewBox="0 0 108 32" aria-label="Google Pay" role="img">
      <path d="M50.7 16.4v9.3h-2.9V2.9h7.7c1.9 0 3.6.7 5 2 1.4 1.3 2.1 3 2.1 4.9 0 2-.7 3.6-2.1 4.9-1.4 1.3-3.1 1.9-5 1.9h-4.8v-.2zm0-10.7v8h4.9c1.2 0 2.2-.4 3-1.2.8-.8 1.2-1.8 1.2-2.8 0-1.1-.4-2-1.2-2.8-.8-.8-1.8-1.2-3-1.2h-4.9zm17.7 4.4c2.2 0 3.9.6 5.2 1.8 1.3 1.2 1.9 2.8 1.9 4.8v9.7h-2.8v-2.2h-.1c-1.2 1.8-2.9 2.7-4.9 2.7-1.7 0-3.2-.5-4.4-1.5-1.2-1-1.7-2.3-1.7-3.8 0-1.6.6-2.9 1.8-3.8 1.2-.9 2.8-1.4 4.8-1.4 1.7 0 3.1.3 4.2 1v-.7c0-1.1-.4-2-1.3-2.8-.8-.8-1.8-1.1-3-1.1-1.7 0-3.1.7-4.1 2.2L57.4 14c1.5-2.6 3.8-3.9 7-3.9zm-3.7 11.2c0 .7.3 1.3.9 1.8.6.5 1.4.7 2.2.7 1.2 0 2.3-.5 3.2-1.4.9-.9 1.4-2 1.4-3.2-.9-.7-2.2-1.1-3.9-1.1-1.2 0-2.2.3-3 .9-.5.6-.8 1.2-.8 2.3zm26-10.7L80.7 31h-2.9l3.6-7.7-6.4-14.7h3.1l4.6 11.1h.1L87.1 8.6h3.6z" fill="#3c4043"/>
      <path d="M37.6 16c0-1-.1-1.9-.3-2.8H22.7v5.3h8.4c-.3 2-1.4 3.7-3.1 4.8v3.9h5c2.9-2.7 4.6-6.7 4.6-11.2z" fill="#4285F4"/>
      <path d="M22.7 31c4.2 0 7.7-1.4 10.3-3.8l-5-3.9c-1.4.9-3.2 1.5-5.3 1.5-4.1 0-7.5-2.7-8.8-6.5h-5.2v4c2.5 5.1 7.7 8.7 14 8.7z" fill="#34A853"/>
      <path d="M13.9 18.3c-.3-.9-.5-1.9-.5-2.9s.2-2 .5-2.9V8.5H8.7C7.6 10.6 7 13 7 15.4s.6 4.8 1.7 6.9l5.2-4z" fill="#FBBC04"/>
      <path d="M22.7 6.1c2.3 0 4.4.8 6 2.4l4.5-4.5C30.4 1.4 26.9 0 22.7 0c-6.3 0-11.5 3.6-14 8.5l5.2 4c1.3-3.8 4.7-6.4 8.8-6.4z" fill="#EA4335"/>
    </svg>
  );
}

// ─── Card brand mark ──────────────────────────────────────
function BrandMark({ brand, small }) {
  const sz = small ? 32 : 48;
  if (brand === 'visa') {
    return (
      <svg width={sz} height={sz * 0.34} viewBox="0 0 48 16" aria-label="Visa">
        <text x="0" y="13" fontFamily="Inter, sans-serif" fontWeight="900" fontStyle="italic" fontSize="14" fill="#1A1F71" letterSpacing="-.5">VISA</text>
      </svg>
    );
  }
  if (brand === 'mastercard') {
    return (
      <svg width={sz} height={sz * 0.6} viewBox="0 0 40 24" aria-label="Mastercard">
        <circle cx="14" cy="12" r="10" fill="#EB001B"/>
        <circle cx="26" cy="12" r="10" fill="#F79E1B" opacity=".88"/>
      </svg>
    );
  }
  if (brand === 'amex') {
    return (
      <svg width={sz} height={sz * 0.4} viewBox="0 0 56 22" aria-label="Amex">
        <rect width="56" height="22" rx="3" fill="#006FCF"/>
        <text x="28" y="14" textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight="800" fontSize="9" fill="white" letterSpacing=".5">AMEX</text>
      </svg>
    );
  }
  if (brand === 'discover') {
    return (
      <svg width={sz} height={sz * 0.34} viewBox="0 0 60 18" aria-label="Discover">
        <text x="0" y="13" fontFamily="Inter, sans-serif" fontWeight="700" fontSize="11" fill="#FF6000">DISCOVER</text>
      </svg>
    );
  }
  if (brand === 'jcb') {
    return (
      <svg width={sz} height={sz * 0.4} viewBox="0 0 36 14" aria-label="JCB">
        <rect width="36" height="14" rx="2" fill="white" stroke="#0E4C92" strokeWidth=".5"/>
        <rect x="0"  y="0" width="12" height="14" fill="#0E4C92"/>
        <rect x="12" y="0" width="12" height="14" fill="#BC1A1F"/>
        <rect x="24" y="0" width="12" height="14" fill="#007934"/>
        <text x="18" y="10" textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight="800" fontSize="6" fill="white">JCB</text>
      </svg>
    );
  }
  // unknown — show subtle generic chip outline
  return (
    <svg width={sz} height={sz * 0.34} viewBox="0 0 32 11" aria-label="Card">
      <rect x="0.5" y="0.5" width="31" height="10" rx="2" fill="none" stroke="var(--ink-4)" strokeWidth="1"/>
      <rect x="3" y="3" width="6" height="5" rx="1" fill="var(--ink-4)" opacity=".5"/>
    </svg>
  );
}

// ─── Live card preview that flips on CVC focus ────────────
function CardPreview({ flipped, brand, cardDigits, exp, cvc, cardName }) {
  const spec = BRAND_SPECS[brand];
  // Build display string with bullet placeholders so the layout stays steady.
  const total = spec.maxLength;
  const padded = cardDigits.padEnd(total, '•');
  const groups = brand === 'amex'
    ? [padded.slice(0, 4), padded.slice(4, 10), padded.slice(10, 15)]
    : [padded.slice(0, 4), padded.slice(4, 8), padded.slice(8, 12), padded.slice(12, 16)];

  const shellStyle = {
    position: 'absolute', inset: 0,
    backfaceVisibility: 'hidden',
    WebkitBackfaceVisibility: 'hidden',
    borderRadius: 16,
    background: spec.gradient,
    color: 'white',
    boxShadow: '0 18px 40px rgba(20,17,14,.18), 0 4px 12px rgba(20,17,14,.10)',
    overflow: 'hidden',
  };

  return (
    <div style={{ perspective: '1400px', width: '100%', maxWidth: 420, marginInline: 'auto' }}>
      <div style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '1.586 / 1',
        transformStyle: 'preserve-3d',
        transition: 'transform .65s cubic-bezier(.4,.0,.2,1)',
        transform: flipped ? 'rotateY(180deg)' : 'rotateY(0)',
      }}>
        {/* FRONT */}
        <div style={{ ...shellStyle, padding: '22px 24px' }}>
          {/* subtle top-right glow */}
          <div style={{ position: 'absolute', top: -60, right: -60, width: 220, height: 220, background: 'radial-gradient(circle, rgba(255,255,255,.18) 0%, transparent 70%)', pointerEvents: 'none' }}/>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div className="h-mono" style={{ fontSize: 10, letterSpacing: '.18em', opacity: .85 }}>HANDI · ESCROW</div>
            <div style={{ background: 'rgba(255,255,255,.14)', padding: '4px 8px', borderRadius: 6, backdropFilter: 'blur(4px)' }}>
              <BrandMark brand={brand} small/>
            </div>
          </div>

          {/* chip + contactless */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 24 }}>
            <svg width="36" height="28" viewBox="0 0 36 28" aria-hidden="true">
              <rect x="0.5" y="0.5" width="35" height="27" rx="4" fill="url(#chip-grad)" stroke="rgba(255,255,255,.4)"/>
              <defs>
                <linearGradient id="chip-grad" x1="0" x2="1" y1="0" y2="1">
                  <stop offset="0%" stopColor="#E8C988"/>
                  <stop offset="100%" stopColor="#B5894C"/>
                </linearGradient>
              </defs>
              <path d="M0 10h36M0 18h36M12 0v28M24 0v28" stroke="rgba(0,0,0,.18)" strokeWidth=".7"/>
            </svg>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" opacity=".75">
              <path d="M5 8a10 10 0 0 1 0 8M9 6a14 14 0 0 1 0 12M13 4a18 18 0 0 1 0 16M17 6a14 14 0 0 1 0 12"/>
            </svg>
          </div>

          {/* number */}
          <div style={{ display: 'flex', gap: brand === 'amex' ? 14 : 12, marginTop: 22, fontFamily: 'var(--font-mono)', fontSize: 20, letterSpacing: '.06em' }}>
            {groups.map((g, i) => (
              <span key={i} style={{ display: 'inline-flex', gap: 2 }}>
                {g.split('').map((ch, ci) => (
                  <span key={ci} style={{
                    display: 'inline-block',
                    minWidth: '0.6em',
                    transition: 'opacity .25s, color .25s',
                    opacity: ch === '•' ? .5 : 1,
                  }}>{ch}</span>
                ))}
              </span>
            ))}
          </div>

          {/* footer */}
          <div style={{ position: 'absolute', left: 24, right: 24, bottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <div className="h-mono" style={{ fontSize: 9, letterSpacing: '.14em', opacity: .65 }}>CARDHOLDER</div>
              <div style={{ fontSize: 14, marginTop: 4, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.04em' }}>
                {cardName.trim() || <span style={{ opacity: .55 }}>YOUR NAME</span>}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="h-mono" style={{ fontSize: 9, letterSpacing: '.14em', opacity: .65 }}>EXPIRES</div>
              <div className="h-mono" style={{ fontSize: 14, marginTop: 4, fontWeight: 500 }}>
                {exp || <span style={{ opacity: .55 }}>MM/YY</span>}
              </div>
            </div>
          </div>
        </div>

        {/* BACK */}
        <div style={{ ...shellStyle, transform: 'rotateY(180deg)', padding: 0 }}>
          <div style={{ width: '100%', height: 48, background: 'rgba(0,0,0,.7)', marginTop: 24 }}/>
          <div style={{ padding: '24px 24px 0' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12,
              background: 'rgba(255,255,255,.92)',
              padding: '10px 14px', borderRadius: 6,
            }}>
              <div style={{ flex: 1, height: 14, background: 'repeating-linear-gradient(45deg, transparent 0 4px, rgba(0,0,0,.06) 4px 8px)', borderRadius: 2 }}/>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 16, color: '#111', letterSpacing: '.1em', minWidth: brand === 'amex' ? 56 : 42, textAlign: 'center' }}>
                {cvc || (brand === 'amex' ? '••••' : '•••')}
              </span>
            </div>
            <div className="h-mono" style={{ fontSize: 9, letterSpacing: '.14em', opacity: .75, marginTop: 10 }}>
              {brand === 'amex' ? 'CID — 4 digits on the front' : 'CVC — 3 digits on the back'}
            </div>
          </div>
          <div style={{ position: 'absolute', bottom: 16, right: 24, opacity: .5 }}>
            <BrandMark brand={brand} small/>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children, style }) {
  return (
    <label style={{ display: 'block', ...style }}>
      <span className="h-mono" style={{ display: 'block', fontSize: 11, color: 'var(--ink-3)', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 6 }}>{label}</span>
      {children}
    </label>
  );
}

export function CartLine({ item }) {
  const dec = () => item.qty <= 1 ? removeFromCart(item.id) : updateQty(item.id, item.qty - 1);
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '88px 1fr auto auto', gap: 20, padding: '20px 0', borderBottom: '1px solid var(--line)', alignItems: 'center' }}>
      <div style={{ width: 88, height: 88, borderRadius: 12, overflow: 'hidden', background: `url(${item.img}) center/cover` }}/>
      <div>
        <div className="h-mono" style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: '.08em' }}>{item.store.toUpperCase()}</div>
        <h4 style={{ margin: '4px 0 8px', fontSize: 15, fontWeight: 500 }}>{item.title}</h4>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 12 }}>
          <Link to={`/item/${item.id}`} style={{ color: 'var(--rouge-deep)', textDecoration: 'none' }}>Edit</Link>
          <span style={{ color: 'var(--ink-4)' }}>·</span>
          <button onClick={() => removeFromCart(item.id)} style={{ background: 'transparent', border: 'none', padding: 0, color: 'var(--rouge-deep)', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', fontWeight: 500 }}>Remove</button>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--line-2)', borderRadius: 'var(--r-pill)', padding: '4px' }}>
        <button onClick={dec} title={item.qty <= 1 ? 'Remove' : 'Decrease'} style={{ width: 28, height: 28, border: 'none', background: 'transparent', borderRadius: 999, fontSize: 16, cursor: 'pointer', color: 'var(--ink-2)' }}>−</button>
        <span style={{ width: 24, textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 13 }}>{item.qty}</span>
        <button onClick={() => updateQty(item.id, item.qty + 1)} style={{ width: 28, height: 28, border: 'none', background: 'transparent', borderRadius: 999, fontSize: 16, cursor: 'pointer', color: 'var(--ink-2)' }}>+</button>
      </div>
      <div style={{ textAlign: 'right', minWidth: 120 }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--ink-3)', letterSpacing: '.04em' }}>
          <span>RETAIL ${item.retail}</span>
          <span style={{ color: 'var(--rouge)' }}>+ FEE ${item.fee}</span>
        </div>
        <div className="h-serif" style={{ fontSize: 26, marginTop: 4, lineHeight: 1 }}>${(item.retail + item.fee) * item.qty}</div>
      </div>
    </div>
  );
}

export function Row({ k, v, accent, muted }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <span style={{ color: 'var(--ink-2)' }}>{k}</span>
      <span style={{ color: accent ? 'var(--rouge)' : muted ? 'var(--ink-3)' : 'var(--ink)' }}>{v}</span>
    </div>
  );
}


