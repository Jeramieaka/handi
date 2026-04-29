import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HD } from '../data/sample';
import { HAvatar, HStars, HVerified, HNav, HFooter, HItemCard } from '../components/primitives';

// Item Detail — gallery + carrier panel + escrow timeline
const { useState: useStateID } = React;

export function PageItemDetail() {
  const navigate = useNavigate();
  const [qty, setQty] = useStateID(1);
  const [imgIdx, setImgIdx] = useStateID(0);
  const item = HD.items[1]; // Eevee figure
  const gallery = [
    item.img,
    'https://images.unsplash.com/photo-1577741314755-048d8525d31e?w=900&h=900&fit=crop&q=85',
    'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=900&h=900&fit=crop&q=85',
    'https://images.unsplash.com/photo-1531525645387-7f14be1bdbbd?w=900&h=900&fit=crop&q=85',
  ];

  return (
    <div className="h-app" style={{ width: '100%' }}>
      <HNav active="browse"/>

      {/* breadcrumb */}
      <div style={{ padding: '20px 40px', fontSize: 12, color: 'var(--ink-3)', fontFamily: 'var(--font-mono)', letterSpacing: '.06em' }}>
        <Link to="/browse" style={{ color: 'inherit' }}>BROWSE</Link> / <Link to="/browse" style={{ color: 'inherit' }}>TOKYO</Link> / <Link to="/browse" style={{ color: 'inherit' }}>COLLECTIBLES</Link> / <span style={{ color: 'var(--ink)' }}>{item.title.toUpperCase()}</span>
      </div>

      <section style={{ padding: '32px 40px 80px', maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 64 }}>
          {/* GALLERY */}
          <div>
            <div style={{ position: 'relative', aspectRatio: '1', borderRadius: 'var(--r-lg)', overflow: 'hidden', background: 'var(--paper-2)' }}>
              <img src={gallery[imgIdx]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={`Item photo ${imgIdx + 1}`}/>
              <span className="h-chip h-chip-noir" style={{ position: 'absolute', top: 16, left: 16, fontSize: 10, fontFamily: 'var(--font-mono)', letterSpacing: '.1em' }}>TOKYO · LIMITED</span>
              <button style={iconBtnAbs(16, 'right')} aria-label="Save">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
              </button>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              {gallery.map((g, i) => (
                <button key={i} onClick={() => setImgIdx(i)} style={{
                  width: 80, height: 80, padding: 0, border: '2px solid', borderColor: i === imgIdx ? 'var(--ink)' : 'transparent', borderRadius: 8, overflow: 'hidden', cursor: 'pointer'
                }}>
                  <img src={g} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={`Item thumbnail ${i + 1}`}/>
                </button>
              ))}
            </div>

            {/* Provenance */}
            <div style={{ marginTop: 40, paddingTop: 32, borderTop: '1px solid var(--line)' }}>
              <h3 className="h-eyebrow" style={{ marginBottom: 16 }}>Provenance</h3>
              <p style={{ fontSize: 15, lineHeight: 1.65, color: 'var(--ink-2)', margin: 0 }}>
                Limited-edition Eevee figure available exclusively at Pokémon Center Mega Tokyo. James will photograph the receipt at point of purchase and attach it to your order chat. Original packaging confirmed by carrier prior to checkout.
              </p>
              <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                {[['Origin', 'Tokyo, JP'], ['Retail', '$120 USD'], ['Pickup', 'Mega Tokyo, Sunshine City']].map(([k, v]) => (
                  <div key={k}>
                    <div className="h-mono" style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: '.1em', textTransform: 'uppercase' }}>{k}</div>
                    <div style={{ fontSize: 14, marginTop: 6 }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Carrier mini bio */}
            <div style={{ marginTop: 40, paddingTop: 32, borderTop: '1px solid var(--line)' }}>
              <h3 className="h-eyebrow" style={{ marginBottom: 20 }}>Your carrier</h3>
              <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                <HAvatar name="James L" size={64}/>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <h4 style={{ margin: 0, fontSize: 18 }}>James L.</h4>
                    <HVerified size={14}/>
                    <span className="h-chip h-chip-rouge" style={{ fontSize: 10 }}>Top carrier</span>
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
            </div>
          </div>

          {/* PURCHASE PANEL */}
          <aside style={{ position: 'sticky', top: 100, alignSelf: 'flex-start' }}>
            <div className="h-eyebrow" style={{ marginBottom: 12 }}>{item.store}</div>
            <h1 className="h-serif" style={{ fontSize: 48, margin: 0, lineHeight: 1.05, letterSpacing: '-0.02em' }}>{item.title}</h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 20 }}>
              <HStars value={5} size={14}/>
              <span style={{ fontSize: 13, color: 'var(--ink-2)' }}>5.0 · 12 carries this month</span>
            </div>

            {/* price block */}
            <div style={{ marginTop: 32, padding: 24, background: 'var(--paper-2)', borderRadius: 'var(--r-lg)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div>
                  <div className="h-mono" style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: '.1em', textTransform: 'uppercase' }}>Retail (Tokyo)</div>
                  <div className="h-serif" style={{ fontSize: 36, marginTop: 4, lineHeight: 1 }}>${item.retail}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="h-mono" style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: '.1em', textTransform: 'uppercase' }}>+ Carry fee</div>
                  <div className="h-serif" style={{ fontSize: 36, marginTop: 4, lineHeight: 1, color: 'var(--rouge)' }}>${item.fee}</div>
                </div>
              </div>
              <hr style={{ border: 'none', borderTop: '1px dashed var(--line-2)', margin: '20px 0' }}/>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: 14, color: 'var(--ink-2)' }}>You pay total</span>
                <span className="h-serif" style={{ fontSize: 44 }}>${item.retail + item.fee}</span>
              </div>
              <div className="h-mono" style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: '.08em', marginTop: 4, textAlign: 'right' }}>NO CUSTOMS · NO SHIPPING</div>
            </div>

            {/* qty + cta */}
            <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--line-2)', borderRadius: 'var(--r-pill)', padding: '4px' }}>
                <button onClick={() => setQty(Math.max(1, qty-1))} style={qtyBtn}>−</button>
                <span style={{ width: 32, textAlign: 'center', fontFamily: 'var(--font-mono)' }}>{qty}</span>
                <button onClick={() => setQty(qty+1)} style={qtyBtn}>+</button>
              </div>
              <button onClick={() => navigate('/cart')} className="h-btn h-btn-primary" style={{ flex: 1 }}>Reserve · ${(item.retail + item.fee) * qty}</button>
            </div>
            <button onClick={() => navigate('/messages')} className="h-btn h-btn-ghost" style={{ marginTop: 8, width: '100%' }}>Message James first</button>

            {/* trip info */}
            <div style={{ marginTop: 32, padding: 20, border: '1px solid var(--line)', borderRadius: 'var(--r-lg)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <span className="h-eyebrow">Trip</span>
                <span className="h-chip h-chip-amber" style={{ fontSize: 11 }}>2 of 4 slots left</span>
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
              <hr className="h-divider" style={{ margin: '16px 0' }}/>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
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
              {[['🛡️','Buyer protected'],['🔒','Escrow held'],['📷','Photo receipt'],['💬','24h dispute']].map(([e,t]) => (
                <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', background: 'var(--paper-2)', borderRadius: 8, fontSize: 12 }}>
                  <span>{e}</span><span>{t}</span>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      {/* RELATED */}
      <section style={{ padding: '40px 40px 120px', borderTop: '1px solid var(--line)' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <h3 className="h-display" style={{ fontSize: 40, margin: '0 0 32px' }}>More from this trip</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
            {HD.items.filter(i => i.from === 'Tokyo').slice(0, 4).map(it => <HItemCard key={it.id} item={it}/>)}
          </div>
        </div>
      </section>

      <HFooter/>
    </div>
  );
}

const qtyBtn = { width: 32, height: 32, border: 'none', background: 'transparent', borderRadius: 999, fontSize: 18, cursor: 'pointer', color: 'var(--ink-2)' };
const iconBtnAbs = (offset, side) => ({
  position: 'absolute', top: offset, [side]: offset,
  width: 40, height: 40, borderRadius: 999, border: 'none',
  background: 'rgba(255,255,255,.92)', backdropFilter: 'blur(8px)',
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
});
