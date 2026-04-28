import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { HD } from '../data/sample';
import { HAvatar, HVerified, HEmpty } from '../components/primitives';
import { HAppNav } from './dashboard';

// Orders, Order Detail, Trips

export function PageOrders() {
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const [query, setQuery] = useState('');
  const orders = [
    { id: 'HD-2847', status: 'In flight', tone: 'rouge', item: 'Eevee Limited Figure', store: 'Pokémon Center', img: HD.items[1].img, total: 155, carrier: 'James L.', route: 'TYO → NYC', date: 'May 7' },
    { id: 'HD-2845', status: 'In flight', tone: 'rouge', item: 'Pikachu Plush (Large)', store: 'Pokémon Center', img: HD.items[0].img, total: 82, carrier: 'James L.', route: 'TYO → NYC', date: 'May 7' },
    { id: 'HD-2841', status: 'Purchased', tone: 'amber', item: 'Hobonichi Techo 2026', store: 'Hobonichi Tokyo', img: HD.items[5].img, total: 45, carrier: 'Yuki H.', route: 'TYO → LA', date: 'May 9' },
    { id: 'HD-2812', status: 'Delivered', tone: 'green', item: 'COSRX Snail Mucin', store: 'Olive Young', img: HD.items[6].img, total: 41, carrier: 'Minho C.', route: 'SEL → SF', date: 'Apr 18' },
    { id: 'HD-2807', status: 'Delivered', tone: 'green', item: 'Beauty of Joseon Sun SPF50', store: 'Olive Young', img: HD.items[7].img, total: 32, carrier: 'Minho C.', route: 'SEL → SF', date: 'Apr 18' },
    { id: 'HD-2798', status: 'Delivered', tone: 'green', item: 'Ladurée Macaron Box (12)', store: 'Ladurée', img: HD.items[8].img, total: 96, carrier: 'Elise M.', route: 'PAR → NYC', date: 'Apr 14' },
    { id: 'HD-2790', status: 'Disputed', tone: 'amber', item: 'Diptyque Baies Candle', store: 'Diptyque', img: HD.items[9].img, total: 108, carrier: 'Elise M.', route: 'PAR → NYC', date: 'Apr 12' },
    { id: 'HD-2755', status: 'Delivered', tone: 'green', item: 'Levain Cookies 6-pk', store: 'Levain Bakery', img: HD.items[10].img, total: 50, carrier: 'Sarah K.', route: 'NYC → LA', date: 'Apr 4' },
    { id: 'HD-2740', status: 'Delivered', tone: 'green', item: 'Kith × New Balance 550', store: 'Kith NYC', img: HD.items[11].img, total: 193, carrier: 'Sarah K.', route: 'NYC → TYO', date: 'Mar 30' },
    { id: 'HD-2702', status: 'Delivered', tone: 'green', item: 'Fortnum Earl Grey 250g', store: 'Fortnum & Mason', img: HD.items[4].img, total: 54, carrier: 'Oliver T.', route: 'LON → BOS', date: 'Mar 22' },
    { id: 'HD-2688', status: 'Delivered', tone: 'green', item: 'Jellycat Bashful Bunny', store: 'Harrods', img: HD.items[3].img, total: 103, carrier: 'Oliver T.', route: 'LON → BOS', date: 'Mar 22' },
    { id: 'HD-2671', status: 'Delivered', tone: 'green', item: 'Seasonal KitKat Box', store: 'Tokyo Convenience', img: HD.items[2].img, total: 52, carrier: 'James L.', route: 'TYO → NYC', date: 'Mar 14' },
  ];
  const statuses = ['All', 'In flight', 'Purchased', 'Delivered', 'Disputed'];
  const counts = statuses.reduce((acc, s) => {
    acc[s] = s === 'All' ? orders.length : orders.filter(o => o.status === s).length;
    return acc;
  }, {});
  const tabs = statuses.map(s => `${s} · ${counts[s]}`);
  const q = query.trim().toLowerCase();
  const visibleOrders = orders.filter(o => {
    const matchesTab = tab === 0 || o.status === statuses[tab];
    if (!matchesTab) return false;
    if (!q) return true;
    return [o.id, o.item, o.store, o.carrier, o.route].some(v => v.toLowerCase().includes(q));
  });
  return (
    <div className="h-app" style={{ width: '100%', minHeight: 900 }}>
      <HAppNav active="orders" role="buyer"/>
      <section style={{ padding: '40px 32px', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32 }}>
          <div>
            <div className="h-eyebrow" style={{ marginBottom: 8 }}>{orders.length} lifetime orders · $340 saved on shipping</div>
            <h1 className="h-display" style={{ fontSize: 40, margin: 0, lineHeight: 1.04 }}>Your <span style={{ fontStyle: 'italic' }}>orders.</span></h1>
          </div>
          <input className="h-input" placeholder="Search by ID, item, carrier…" value={query} onChange={e => setQuery(e.target.value)} style={{ width: 320 }}/>
        </div>

        <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid var(--line)', marginBottom: 24, overflowX: 'auto' }}>
          {tabs.map((t, i) => (
            <button key={t} onClick={() => setTab(i)} style={{
              padding: '12px 16px', border: 'none', background: 'transparent',
              fontSize: 13, color: i === tab ? 'var(--ink)' : 'var(--ink-3)', fontWeight: i === tab ? 500 : 400,
              borderBottom: i === tab ? '2px solid var(--ink)' : '2px solid transparent',
              cursor: 'pointer', whiteSpace: 'nowrap', marginBottom: -1,
            }}>{t}</button>
          ))}
        </div>

        <div style={{ display: 'grid', gap: 12 }}>
          {visibleOrders.length === 0 ? (
            <HEmpty
              icon="📦"
              title={q || tab !== 0 ? 'No orders match this filter.' : "You haven't ordered yet."}
              body={q || tab !== 0 ? 'Try clearing the search or switching tabs.' : 'Browse active carriers and reserve your first carry — escrow protects every order.'}
              action={
                (tab !== 0 || q)
                  ? <button onClick={() => { setTab(0); setQuery(''); }} className="h-btn h-btn-ghost h-btn-sm">Clear filters</button>
                  : <Link to="/browse" className="h-btn h-btn-primary h-btn-sm">Browse carriers →</Link>
              }
            />
          ) : visibleOrders.map(o => (
            <div key={o.id} className="h-card" style={{ padding: 20, display: 'grid', gridTemplateColumns: '88px 1fr auto auto auto', gap: 24, alignItems: 'center' }}>
              <div style={{ width: 88, height: 88, borderRadius: 12, background: `url(${o.img}) center/cover` }}/>
              <div>
                <div className="h-mono" style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: '.08em' }}>{o.id} · {o.store.toUpperCase()}</div>
                <div style={{ fontSize: 16, fontWeight: 500, marginTop: 4 }}>{o.item}</div>
                <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 4 }}>{o.carrier} · {o.route} · {o.date}</div>
              </div>
              <span className={`h-chip h-chip-${o.tone}`}>● {o.status}</span>
              <div style={{ textAlign: 'right' }}>
                <div className="h-mono" style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: '.08em' }}>TOTAL</div>
                <div className="h-serif" style={{ fontSize: 22, marginTop: 2 }}>${o.total}</div>
              </div>
              <button onClick={() => navigate(`/orders/${o.id}`)} className="h-btn h-btn-ghost h-btn-sm">Details →</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export function PageOrderDetail() {
  const navigate = useNavigate();
  return (
    <div className="h-app" style={{ width: '100%', minHeight: 1200 }}>
      <HAppNav active="orders" role="buyer"/>
      <section style={{ padding: '32px 32px 80px', maxWidth: 1280, margin: '0 auto' }}>
        <Link to="/orders" style={{ fontSize: 12, color: 'var(--ink-3)', fontFamily: 'var(--font-mono)', letterSpacing: '.06em', textDecoration: 'none' }}>← BACK TO ORDERS</Link>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 16, marginBottom: 32 }}>
          <div>
            <div className="h-eyebrow">ORDER #HD-2847 · PLACED APR 22</div>
            <h1 className="h-display" style={{ fontSize: 40, margin: '8px 0 0', lineHeight: 1.04 }}>Your carrier <span style={{ fontStyle: 'italic', color: 'var(--rouge)' }}>just took off.</span></h1>
          </div>
          <span className="h-chip h-chip-rouge" style={{ fontSize: 13, padding: '8px 14px' }}>● In flight · TYO → NYC</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 32 }}>
          <div>
            <div className="h-card" style={{ padding: 32 }}>
              <h3 className="h-eyebrow" style={{ marginBottom: 24 }}>Order timeline</h3>
              <div>
                {[
                  { t: 'Reserved', d: 'Apr 22, 14:32', who: 'You paid $155 into escrow', done: true },
                  { t: 'Carrier accepted', d: 'Apr 22, 16:45', who: 'James L. confirmed your request', done: true },
                  { t: 'Purchased at retail', d: 'May 6, 11:10 JST', who: 'Receipt uploaded — $120 verified', done: true, hasReceipt: true },
                  { t: 'In flight', d: 'May 7, 14:30 JST', who: 'JAL JL006 · ETA May 7, 09:45 EST', done: true, current: true },
                  { t: 'Hand-off', d: 'Pending', who: 'Brooklyn · Williamsburg pickup', done: false },
                  { t: 'Receipt confirmed', d: 'Pending', who: 'Funds released to carrier', done: false },
                ].map((s, i, arr) => (
                  <div key={s.t} style={{ display: 'grid', gridTemplateColumns: '32px 1fr auto', gap: 16, paddingBottom: i < arr.length-1 ? 24 : 0, position: 'relative' }}>
                    {i < arr.length-1 && <div style={{ position: 'absolute', top: 28, left: 15, bottom: 0, width: 2, background: s.done ? 'var(--rouge)' : 'var(--paper-3)' }}/>}
                    <div style={{
                      width: 32, height: 32, borderRadius: 999, background: s.done ? 'var(--rouge)' : 'var(--paper-2)',
                      border: s.current ? '4px solid var(--rouge-soft)' : '1px solid var(--line)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.done ? 'var(--paper)' : 'var(--ink-3)',
                      position: 'relative', zIndex: 1,
                    }}>
                      {s.done ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 13l4 4L19 7"/></svg> : <span style={{ fontSize: 12 }}>○</span>}
                    </div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 500 }}>{s.t}</div>
                      <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>{s.who}</div>
                      {s.hasReceipt && (
                        <div style={{ marginTop: 12, padding: 12, background: 'var(--paper-2)', borderRadius: 8, display: 'inline-flex', alignItems: 'center', gap: 12 }}>
                          <div style={{ width: 40, height: 40, background: 'var(--paper-3)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>📄</div>
                          <div>
                            <div style={{ fontSize: 12, fontWeight: 500 }}>receipt-IMG_4421.jpg</div>
                            <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>Pokémon Center · ¥18,200 · 11:08 JST</div>
                          </div>
                          <a onClick={(e) => e.preventDefault()} style={{ fontSize: 12, color: 'var(--rouge-deep)', marginLeft: 16, cursor: 'pointer' }}>View →</a>
                        </div>
                      )}
                    </div>
                    <span className="h-mono" style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: '.06em', whiteSpace: 'nowrap' }}>{s.d}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="h-card" style={{ padding: 24, marginTop: 16, display: 'grid', gridTemplateColumns: '120px 1fr auto', gap: 20, alignItems: 'center' }}>
              <div style={{ width: 120, height: 120, background: `url(${HD.items[1].img}) center/cover`, borderRadius: 12 }}/>
              <div>
                <div className="h-mono" style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: '.08em' }}>POKÉMON CENTER MEGA TOKYO</div>
                <h4 style={{ margin: '4px 0 0', fontSize: 18 }}>{HD.items[1].title}</h4>
                <div style={{ fontSize: 13, color: 'var(--ink-2)', marginTop: 8 }}>Qty 1 · Limited edition packaging confirmed</div>
              </div>
              <div className="h-serif" style={{ fontSize: 28 }}>$155</div>
            </div>

            {/* DISPUTE FLOW (collapsed example) */}
            <div className="h-card" style={{ padding: 24, marginTop: 16, borderColor: 'rgba(139,30,45,.2)' }}>
              <h3 className="h-eyebrow" style={{ marginBottom: 16, color: 'var(--rouge-deep)' }}>Need help? Open a dispute</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                {['Item not received', 'Not as described', 'Damaged on arrival'].map(r => (
                  <button key={r} onClick={() => navigate('/messages')} style={{ padding: 14, border: '1px solid var(--line-2)', borderRadius: 10, background: 'var(--paper)', textAlign: 'left', fontSize: 13, cursor: 'pointer' }}>
                    {r} <span style={{ color: 'var(--ink-3)' }}>→</span>
                  </button>
                ))}
              </div>
              <p style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 12, lineHeight: 1.5 }}>Disputes are reviewed by a human within 24h. Funds remain in escrow until resolution.</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="h-card" style={{ padding: 24 }}>
              <h3 className="h-eyebrow" style={{ marginBottom: 16 }}>Your carrier</h3>
              <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                <HAvatar name="James L" size={56}/>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ fontWeight: 500 }}>James L.</span> <HVerified size={12}/></div>
                  <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>★ 5.0 · 47 reviews</div>
                </div>
                <button onClick={() => navigate('/messages')} className="h-btn h-btn-ghost h-btn-sm">Message</button>
              </div>
            </div>
            <div className="h-card" style={{ padding: 24 }}>
              <h3 className="h-eyebrow" style={{ marginBottom: 16 }}>Payment</h3>
              <div style={{ display: 'grid', gap: 8, fontSize: 13 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--ink-3)' }}>Item retail</span><span>$120.00</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--ink-3)' }}>Carry fee</span><span style={{ color: 'var(--rouge)' }}>$35.00</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--ink-3)' }}>Service fee</span><span>$0.00</span></div>
              </div>
              <hr className="h-divider" style={{ margin: '12px 0' }}/>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: 13 }}>Held in escrow</span>
                <span className="h-serif" style={{ fontSize: 24 }}>$155.00</span>
              </div>
              <div className="h-mono" style={{ fontSize: 10, color: 'var(--ink-3)', marginTop: 4, letterSpacing: '.08em' }}>RELEASES ON YOUR CONFIRMATION</div>
            </div>
            <div className="h-card" style={{ padding: 24 }}>
              <div style={{ display: 'grid', gap: 8 }}>
                <button onClick={() => { alert('Receipt confirmed — funds released to carrier (demo).'); navigate('/wallet'); }} className="h-btn h-btn-primary">Confirm receipt →</button>
                <button onClick={() => navigate('/messages')} className="h-btn h-btn-ghost">Message carrier</button>
                <a onClick={(e) => { e.preventDefault(); alert('Invoice download — demo only.'); }} style={{ fontSize: 12, color: 'var(--ink-3)', textAlign: 'center', marginTop: 4, cursor: 'pointer' }}>Download invoice (PDF)</a>
              </div>
              <div style={{ marginTop: 20, padding: 12, background: 'var(--rouge-soft)', borderRadius: 8, fontSize: 12, color: 'var(--rouge-ink)', lineHeight: 1.5 }}>
                <b>Buyer protection</b> covers item not received, not as described, or damaged. Open a dispute within 7 days of hand-off for a full refund.
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export function PageMyTrips() {
  const navigate = useNavigate();
  const trips = [
    { id: 'TR-1041', route: 'TYO → SF', date: 'May 14', status: 'Open', tone: 'green', slots: 4, slotsTotal: 4, requests: 6, earnings: '$0' },
    { id: 'TR-1029', route: 'TYO → SF', date: 'Apr 22', status: 'In flight', tone: 'rouge', slots: 0, slotsTotal: 4, requests: 4, earnings: '$280' },
    { id: 'TR-1014', route: 'NYC → TYO', date: 'Mar 30', status: 'Completed', tone: 'green', slots: 3, slotsTotal: 3, requests: 3, earnings: '$310' },
    { id: 'TR-1002', route: 'SF → SEL', date: 'Mar 10', status: 'Completed', tone: 'green', slots: 4, slotsTotal: 4, requests: 4, earnings: '$420' },
  ];
  const requests = [
    { item: 'Sezane linen dress (size 36)', emoji: '👗', city: 'PAR', fee: 35, urgent: false, who: 'Anna L.' },
    { item: 'Lego Tokyo Skyline', emoji: '🧱', city: 'TYO', fee: 22, urgent: true, who: 'Marco D.' },
    { item: 'COSRX bundle (4 items)', emoji: '🧴', city: 'SEL', fee: 48, urgent: false, who: 'Riku S.' },
  ];
  return (
    <div className="h-app" style={{ width: '100%', minHeight: 1100 }}>
      <HAppNav active="my trips" role="carrier"/>
      <section style={{ padding: '40px 32px 80px', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32 }}>
          <div>
            <div className="h-eyebrow">14 trips lifetime · $3,640 earned · ★ 4.92</div>
            <h1 className="h-display" style={{ fontSize: 40, margin: '8px 0 0', lineHeight: 1.04 }}>Your <span style={{ fontStyle: 'italic' }}>routes.</span></h1>
          </div>
          <button onClick={() => navigate('/post-trip')} className="h-btn h-btn-primary">+ Post a trip</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 32 }}>
          <div>
            <h3 className="h-eyebrow" style={{ marginBottom: 16 }}>Active & past trips</h3>
            <div style={{ display: 'grid', gap: 12 }}>
              {trips.length === 0 && (
                <HEmpty
                  icon="✈"
                  title="You haven't posted a trip yet."
                  body="Post a route — buyers heading your way will request items in advance."
                  action={<button onClick={() => navigate('/post-trip')} className="h-btn h-btn-primary h-btn-sm">+ Post a trip</button>}
                />
              )}
              {trips.map((t) => (
                <div key={t.id} className="h-card" style={{ padding: 24, display: 'grid', gridTemplateColumns: '1.2fr 0.8fr 1fr 0.8fr auto', gap: 20, alignItems: 'center' }}>
                  <div>
                    <div className="h-serif" style={{ fontSize: 26, letterSpacing: '-0.02em' }}>{t.route}</div>
                    <div className="h-mono" style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: '.06em', marginTop: 2 }}>{t.date.toUpperCase()}</div>
                  </div>
                  <div>
                    <div className="h-mono" style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: '.08em' }}>SLOTS</div>
                    <div style={{ fontSize: 16, marginTop: 2 }}>{t.slots} of {t.slotsTotal}</div>
                  </div>
                  <span className={`h-chip h-chip-${t.tone}`}>● {t.status}</span>
                  <div>
                    <div className="h-mono" style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: '.08em' }}>EARNED</div>
                    <div className="h-serif" style={{ fontSize: 20, marginTop: 2 }}>{t.earnings}</div>
                  </div>
                  <button onClick={() => navigate(`/trips/${t.id}`)} className="h-btn h-btn-ghost h-btn-sm">Manage →</button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="h-eyebrow" style={{ marginBottom: 16 }}>Requests on your routes</h3>
            <div style={{ display: 'grid', gap: 10 }}>
              {requests.length === 0 && (
                <HEmpty
                  icon="✦"
                  title="No requests yet."
                  body="Buyers will appear here when they post on your routes."
                />
              )}
              {requests.map((r, i) => (
                <div key={i} className="h-card" style={{ padding: 18 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 44, height: 44, background: 'var(--paper-2)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{r.emoji}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 500 }}>{r.item}</div>
                      <div style={{ fontSize: 11, color: 'var(--ink-3)', fontFamily: 'var(--font-mono)', letterSpacing: '.06em', marginTop: 2 }}>{r.city} · {r.who}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div className="h-serif" style={{ fontSize: 20, color: 'var(--rouge)' }}>+${r.fee}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
                    <button onClick={() => navigate('/messages')} className="h-btn h-btn-primary h-btn-sm" style={{ flex: 1 }}>Accept</button>
                    <button onClick={(e) => { e.currentTarget.closest('.h-card').style.opacity = '0.4'; }} className="h-btn h-btn-ghost h-btn-sm">Decline</button>
                  </div>
                  {r.urgent && <div className="h-mono" style={{ fontSize: 10, color: 'var(--rouge)', letterSpacing: '.08em', marginTop: 8 }}>● URGENT · BUYER NEEDS BY MAY 20</div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export function PageTripDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  // TODO(post-backend): fetch real trip by id; this is a sample carrier view.
  const tripsById = {
    'TR-1041': { id: 'TR-1041', route: 'TYO → SF', date: 'May 14, 2026', status: 'Open', tone: 'green', slots: 4, slotsTotal: 4, requests: 6, earnings: '$0' },
    'TR-1029': { id: 'TR-1029', route: 'TYO → SF', date: 'Apr 22, 2026', status: 'In flight', tone: 'rouge', slots: 0, slotsTotal: 4, requests: 4, earnings: '$280' },
    'TR-1014': { id: 'TR-1014', route: 'NYC → TYO', date: 'Mar 30, 2026', status: 'Completed', tone: 'green', slots: 3, slotsTotal: 3, requests: 3, earnings: '$310' },
    'TR-1002': { id: 'TR-1002', route: 'SF → SEL', date: 'Mar 10, 2026', status: 'Completed', tone: 'green', slots: 4, slotsTotal: 4, requests: 4, earnings: '$420' },
  };
  const trip = tripsById[id];
  if (!trip) {
    return (
      <div className="h-app" style={{ width: '100%', minHeight: 600 }}>
        <HAppNav active="my trips" role="carrier"/>
        <section style={{ padding: '64px 32px', maxWidth: 720, margin: '0 auto' }}>
          <HEmpty
            icon="✈"
            title="That trip doesn't exist."
            body={`We couldn't find a trip with the id "${id}".`}
            action={<Link to="/trips" className="h-btn h-btn-primary h-btn-sm">← Back to your trips</Link>}
          />
        </section>
      </div>
    );
  }

  const carries = [
    { who: 'Anna L.', item: 'Sezane linen dress', fee: 35, status: 'accepted' },
    { who: 'Marco D.', item: 'Lego Tokyo Skyline', fee: 22, status: 'pending' },
    { who: 'Riku S.', item: 'COSRX bundle', fee: 48, status: 'accepted' },
  ];
  const slotsTaken = trip.slotsTotal - trip.slots;

  return (
    <div className="h-app" style={{ width: '100%', minHeight: 1100 }}>
      <HAppNav active="my trips" role="carrier"/>
      <section style={{ padding: '32px 32px 80px', maxWidth: 1280, margin: '0 auto' }}>
        <Link to="/trips" style={{ fontSize: 12, color: 'var(--ink-3)', fontFamily: 'var(--font-mono)', letterSpacing: '.06em', textDecoration: 'none' }}>← BACK TO TRIPS</Link>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 16, marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div className="h-eyebrow">TRIP #{trip.id} · DEPARTS {trip.date.toUpperCase()}</div>
            <h1 className="h-display" style={{ fontSize: 40, margin: '8px 0 0', lineHeight: 1.04 }}>{trip.route} <span style={{ fontStyle: 'italic', color: 'var(--rouge)' }}>· {trip.status.toLowerCase()}</span></h1>
          </div>
          <span className={`h-chip h-chip-${trip.tone}`} style={{ fontSize: 13, padding: '8px 14px' }}>● {trip.status}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 32 }}>
          <div>
            <div className="h-card" style={{ padding: 24, marginBottom: 16 }}>
              <h3 className="h-eyebrow" style={{ marginBottom: 16 }}>Carries on this trip</h3>
              <div style={{ display: 'grid', gap: 10 }}>
                {carries.length === 0 ? (
                  <HEmpty icon="✦" title="No carries yet." body="Buyers can still send you requests until you depart."/>
                ) : carries.map((c, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 14, background: 'var(--paper-2)', borderRadius: 10 }}>
                    <HAvatar name={c.who} size={36}/>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 500 }}>{c.item}</div>
                      <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>{c.who} · {c.status === 'accepted' ? 'Accepted' : 'Pending response'}</div>
                    </div>
                    <div className="h-serif" style={{ fontSize: 18, color: 'var(--rouge)' }}>+${c.fee}</div>
                    <button onClick={() => navigate('/messages')} className="h-btn h-btn-ghost h-btn-sm">Message</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="h-card" style={{ padding: 24 }}>
              <h3 className="h-eyebrow" style={{ marginBottom: 12 }}>Capacity</h3>
              <div style={{ fontSize: 13, color: 'var(--ink-2)', marginBottom: 8 }}>{slotsTaken} of {trip.slotsTotal} slots filled</div>
              <div style={{ height: 6, background: 'var(--paper-2)', borderRadius: 999, overflow: 'hidden' }}>
                <div style={{ width: `${(slotsTaken / trip.slotsTotal) * 100}%`, height: '100%', background: 'var(--rouge)' }}/>
              </div>
            </div>
            <div className="h-card" style={{ padding: 24 }}>
              <h3 className="h-eyebrow" style={{ marginBottom: 12 }}>Earnings</h3>
              <div className="h-serif" style={{ fontSize: 36 }}>{trip.earnings}</div>
              <div className="h-mono" style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: '.08em', marginTop: 4 }}>{trip.status === 'Completed' ? 'PAID OUT' : 'HELD UNTIL DELIVERY'}</div>
            </div>
            <button onClick={() => navigate('/post-trip')} className="h-btn h-btn-ghost">Edit trip details</button>
          </div>
        </div>
      </section>
    </div>
  );
}

