import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HD } from '../data/sample';
import { HFlag, HNav, HFooter, HItemCard } from '../components/primitives';

// Browse page — premium marketplace with filters
const { useState: useStateB } = React;

export function PageBrowse() {
  const [city, setCity] = useStateB('all');
  const [cat, setCat] = useStateB('all');
  const [sort, setSort] = useStateB('Soonest');
  const items = HD.items.filter(i => city === 'all' || i.from.toLowerCase() === city);

  const cats = ['all', 'Collectibles', 'Fashion', 'Food', 'Beauty', 'Stationery', 'Home', 'Gifts'];

  return (
    <div className="h-app" style={{ width: '100%' }}>
      <HNav active="browse" />

      {/* HEADER */}
      <section style={{ padding: '64px 40px 40px', borderBottom: '1px solid var(--line)' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32 }}>
            <div>
              <div className="h-eyebrow" style={{ marginBottom: 12 }}>Marketplace · 17 active carries</div>
              <h1 className="h-display" style={{ fontSize: 88, margin: 0, lineHeight: 1 }}>Browse <span style={{ fontStyle: 'italic', color: 'var(--rouge)' }}>carriers.</span></h1>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="h-mono" style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: '.1em', marginRight: 8 }}>SORT</span>
              {['Soonest', 'Fee ↑', 'Top rated'].map(s => (
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

          {/* City scroller */}
          <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 4 }}>
            <button onClick={() => setCity('all')} style={cityChip(city === 'all')}>
              <span style={{ fontSize: 18 }}>🌍</span>
              <span>All cities <span style={{ color: 'var(--ink-3)' }}>· 17</span></span>
            </button>
            {HD.cities.map(c => (
              <button key={c.code} onClick={() => setCity(c.name.toLowerCase())} style={cityChip(city === c.name.toLowerCase())}>
                <HFlag code={c.code} size={16}/>
                <span>{c.name} <span style={{ color: 'var(--ink-3)' }}>· {c.count}</span></span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORY FILTER + RESULTS */}
      <section style={{ padding: '32px 40px 100px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'grid', gridTemplateColumns: '220px 1fr', gap: 48 }}>
          {/* Sidebar */}
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
              <input className="h-input" placeholder="Min" style={{ padding: '8px 10px', fontSize: 12 }}/>
              <input className="h-input" placeholder="Max" style={{ padding: '8px 10px', fontSize: 12 }}/>
            </div>

            <div className="h-mono" style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 16 }}>Trust</div>
            {['ID-verified only', 'Top rated (4.8+)', 'Repeat carriers'].map(t => (
              <label key={t} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', fontSize: 13, color: 'var(--ink-2)', cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked={t === 'ID-verified only'} style={{ accentColor: 'var(--rouge)' }}/> {t}
              </label>
            ))}

            <div style={{ marginTop: 32, padding: 20, background: 'var(--rouge-soft)', borderRadius: 'var(--r-md)', border: '1px solid rgba(139,30,45,.12)' }}>
              <div className="h-eyebrow" style={{ color: 'var(--rouge-deep)', marginBottom: 8 }}>Don't see it?</div>
              <p style={{ fontSize: 13, color: 'var(--rouge-ink)', lineHeight: 1.5, margin: 0 }}>Post a request — carriers heading your way will reach out.</p>
              <Link to="/requests" className="h-btn h-btn-rouge h-btn-sm" style={{ marginTop: 12, width: '100%' }}>Post a request →</Link>
            </div>
          </aside>

          {/* Grid */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid var(--line)' }}>
              <span style={{ fontSize: 14, color: 'var(--ink-2)' }}>{items.length} items · <span style={{ color: 'var(--ink-3)' }}>{city === 'all' ? 'All cities' : city}</span></span>
              <span className="h-eyebrow"><span style={{ color: 'var(--rouge)' }}>●</span> 31 carriers in flight</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
              {items.map(it => <HItemCard key={it.id} item={it}/>)}
            </div>
          </div>
        </div>
      </section>

      <HFooter/>
    </div>
  );
}

function cityChip(active) {
  return {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    padding: '10px 16px', border: '1px solid', borderRadius: 999,
    fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap', cursor: 'pointer',
    background: active ? 'var(--ink)' : 'var(--paper)',
    color: active ? 'var(--paper)' : 'var(--ink)',
    borderColor: active ? 'var(--ink)' : 'var(--line-2)',
    transition: 'all .15s',
  };
}
