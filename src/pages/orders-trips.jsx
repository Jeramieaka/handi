import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { HD } from '../data/sample';
import { HAvatar, HVerified, HEmpty, HStars, HFollowButton } from '../components/primitives';
import { HAppNav } from './dashboard';
import { PageNotFound } from './not-found';
import { toast } from '../toast';

// Orders, Order Detail, Trips

// ─── Shared sample data ───────────────────────────────────────────────────────
// Lifted to module scope so PageOrders, PageOrderDetail, PageMyTrips,
// PageTripDetail, and the post-trip edit flow all read the same source.
// TODO(post-backend): replace with API fetch + cache layer.

export const ORDERS = [
  { id: 'HD-2847', status: 'In flight', tone: 'rouge', item: 'Eevee Limited Figure',         store: 'Pokémon Center',     img: HD.items[1].img,  retail: 120, fee: 35, total: 155, carrier: 'James L.',  route: 'TYO → NYC', date: 'May 7',  placedAt: 'Apr 22' },
  { id: 'HD-2845', status: 'In flight', tone: 'rouge', item: 'Pikachu Plush (Large)',         store: 'Pokémon Center',     img: HD.items[0].img,  retail: 64,  fee: 18, total: 82,  carrier: 'James L.',  route: 'TYO → NYC', date: 'May 7',  placedAt: 'Apr 22' },
  { id: 'HD-2841', status: 'Purchased', tone: 'amber', item: 'Hobonichi Techo 2026',          store: 'Hobonichi Tokyo',    img: HD.items[5].img,  retail: 35,  fee: 10, total: 45,  carrier: 'Yuki H.',   route: 'TYO → LA',  date: 'May 9',  placedAt: 'Apr 25' },
  { id: 'HD-2812', status: 'Delivered', tone: 'green', item: 'COSRX Snail Mucin',             store: 'Olive Young',        img: HD.items[6].img,  retail: 25,  fee: 16, total: 41,  carrier: 'Minho C.',  route: 'SEL → SF',  date: 'Apr 18', placedAt: 'Apr 8' },
  { id: 'HD-2807', status: 'Delivered', tone: 'green', item: 'Beauty of Joseon Sun SPF50',    store: 'Olive Young',        img: HD.items[7].img,  retail: 18,  fee: 14, total: 32,  carrier: 'Minho C.',  route: 'SEL → SF',  date: 'Apr 18', placedAt: 'Apr 8' },
  { id: 'HD-2798', status: 'Delivered', tone: 'green', item: 'Ladurée Macaron Box (12)',      store: 'Ladurée',            img: HD.items[8].img,  retail: 58,  fee: 38, total: 96,  carrier: 'Elise M.',  route: 'PAR → NYC', date: 'Apr 14', placedAt: 'Apr 1' },
  { id: 'HD-2790', status: 'Disputed',  tone: 'amber', item: 'Diptyque Baies Candle',         store: 'Diptyque',           img: HD.items[9].img,  retail: 78,  fee: 30, total: 108, carrier: 'Elise M.',  route: 'PAR → NYC', date: 'Apr 12', placedAt: 'Mar 30' },
  { id: 'HD-2755', status: 'Delivered', tone: 'green', item: 'Levain Cookies 6-pk',           store: 'Levain Bakery',      img: HD.items[10].img, retail: 28,  fee: 22, total: 50,  carrier: 'Sarah K.',  route: 'NYC → LA',  date: 'Apr 4',  placedAt: 'Mar 25' },
  { id: 'HD-2740', status: 'Delivered', tone: 'green', item: 'Kith × New Balance 550',        store: 'Kith NYC',           img: HD.items[11].img, retail: 165, fee: 28, total: 193, carrier: 'Sarah K.',  route: 'NYC → TYO', date: 'Mar 30', placedAt: 'Mar 18' },
  { id: 'HD-2702', status: 'Delivered', tone: 'green', item: 'Fortnum Earl Grey 250g',        store: 'Fortnum & Mason',    img: HD.items[4].img,  retail: 32,  fee: 22, total: 54,  carrier: 'Oliver T.', route: 'LON → BOS', date: 'Mar 22', placedAt: 'Mar 10' },
  { id: 'HD-2688', status: 'Delivered', tone: 'green', item: 'Jellycat Bashful Bunny',        store: 'Harrods',            img: HD.items[3].img,  retail: 75,  fee: 28, total: 103, carrier: 'Oliver T.', route: 'LON → BOS', date: 'Mar 22', placedAt: 'Mar 10' },
  { id: 'HD-2671', status: 'Delivered', tone: 'green', item: 'Seasonal KitKat Box',           store: 'Tokyo Convenience',  img: HD.items[2].img,  retail: 38,  fee: 14, total: 52,  carrier: 'James L.',  route: 'TYO → NYC', date: 'Mar 14', placedAt: 'Mar 1' },
];

export const TRIPS = [
  { id: 'TR-1041', route: 'TYO → SF',  from: 'Tokyo',  to: 'San Francisco', date: 'May 14', dateFull: 'May 14, 2026', departure: '2026-05-14', arrival: '2026-05-15', status: 'Open',      tone: 'green', slots: 4, slotsTotal: 4, requests: 6, earnings: '$0',   feeMode: 'Suggested' },
  { id: 'TR-1029', route: 'TYO → SF',  from: 'Tokyo',  to: 'San Francisco', date: 'Apr 22', dateFull: 'Apr 22, 2026', departure: '2026-04-22', arrival: '2026-04-23', status: 'In flight', tone: 'rouge', slots: 0, slotsTotal: 4, requests: 4, earnings: '$280', feeMode: 'Suggested' },
  { id: 'TR-1014', route: 'NYC → TYO', from: 'New York', to: 'Tokyo',        date: 'Mar 30', dateFull: 'Mar 30, 2026', departure: '2026-03-30', arrival: '2026-04-01', status: 'Completed', tone: 'green', slots: 3, slotsTotal: 3, requests: 3, earnings: '$310', feeMode: 'Custom' },
  { id: 'TR-1002', route: 'SF → SEL',  from: 'San Francisco', to: 'Seoul',   date: 'Mar 10', dateFull: 'Mar 10, 2026', departure: '2026-03-10', arrival: '2026-03-12', status: 'Completed', tone: 'green', slots: 4, slotsTotal: 4, requests: 4, earnings: '$420', feeMode: 'Suggested' },
];

export function PageOrders() {
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const [query, setQuery] = useState('');
  const orders = ORDERS;
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

// Build the right timeline depending on order status. The current step is
// inferred from the order status; everything before it counts as done.
function buildTimeline(order) {
  const STAGES = ['Reserved', 'Carrier accepted', 'Purchased at retail', 'In flight', 'Hand-off', 'Receipt confirmed'];
  // Map status → which stage index is currently in progress
  const statusToStage = {
    'Reserved':   0,
    'Confirmed':  1,
    'Purchased':  2,
    'In flight':  3,
    'Delivered':  5,
    'Cancelled':  0,
    'Disputed':   3,
  };
  const currentIdx = statusToStage[order.status] ?? 0;
  const isCancelled = order.status === 'Cancelled';
  return STAGES.map((t, i) => {
    const done = !isCancelled && i < currentIdx;
    const current = !isCancelled && i === currentIdx;
    return {
      t,
      done: order.status === 'Delivered' ? true : done,
      current,
      hasReceipt: i === 2 && currentIdx >= 2,
      d: i === 0 ? `${order.placedAt}, 14:32` : (done ? '—' : 'Pending'),
      who: ({
        0: `You paid $${order.total} into escrow`,
        1: `${order.carrier} confirmed your request`,
        2: `Receipt uploaded — $${order.retail} verified`,
        3: `Carrier en route · ETA ${order.date}`,
        4: 'Hand-off pending',
        5: 'Funds released to carrier',
      })[i],
    };
  });
}

export function PageOrderDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const lookupId = id || 'HD-2847'; // /order-detail (no param) → first order
  const orderInList = ORDERS.find(o => o.id === lookupId);

  // Local mutations (cancellation, review submission, dispute filing, etc.)
  // — these would be backend writes once the API lands.
  const [statusOverride, setStatusOverride] = useState(null);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [disputeFiled, setDisputeFiled] = useState(false);

  if (!orderInList) {
    return (
      <PageNotFound
        eyebrow="404 · ORDER NOT FOUND"
        prefixTitle="That order"
        italicTitle="never landed."
        body={`We couldn't find order #${lookupId}. It may have been removed, or you may have followed a stale link.`}
        primary={{ to: '/orders', label: 'Back to orders' }}
        secondary={{ to: '/browse', label: 'Browse carriers →' }}
      />
    );
  }

  const order = { ...orderInList, status: statusOverride || orderInList.status };
  const isPending   = ['Reserved', 'Confirmed', 'In flight', 'Purchased'].includes(order.status);
  const isCancelled = order.status === 'Cancelled';
  const isDelivered = order.status === 'Delivered';

  const timeline = buildTimeline(order);

  const cancelOrder = () => {
    if (window.confirm('Cancel this order? Refund will be issued in 3–5 business days.')) {
      setStatusOverride('Cancelled');
    }
  };

  const tone = isCancelled ? 'amber' : order.tone;

  return (
    <div className="h-app" style={{ width: '100%', minHeight: 1200 }}>
      <HAppNav active="orders" role="buyer"/>
      <section style={{ padding: '32px 32px 80px', maxWidth: 1280, margin: '0 auto' }}>
        <Link to="/orders" style={{ fontSize: 12, color: 'var(--ink-3)', fontFamily: 'var(--font-mono)', letterSpacing: '.06em', textDecoration: 'none' }}>← BACK TO ORDERS</Link>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 16, marginBottom: 32, gap: 16, flexWrap: 'wrap' }}>
          <div>
            <div className="h-eyebrow">ORDER #{order.id} · PLACED {order.placedAt.toUpperCase()}</div>
            <h1 className="h-display" style={{ fontSize: 40, margin: '8px 0 0', lineHeight: 1.04 }}>
              {isCancelled ? <>Order <span style={{ fontStyle: 'italic', color: 'var(--rouge)' }}>cancelled.</span></>
                : isDelivered ? <>{order.carrier.split(' ')[0]} <span style={{ fontStyle: 'italic', color: 'var(--rouge)' }}>delivered it.</span></>
                : <>Your carrier <span style={{ fontStyle: 'italic', color: 'var(--rouge)' }}>just took off.</span></>
              }
            </h1>
          </div>
          <span className={`h-chip h-chip-${tone}`} style={{ fontSize: 13, padding: '8px 14px' }}>● {order.status} · {order.route}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 32 }}>
          <div>
            <div className="h-card" style={{ padding: 32 }}>
              <h3 className="h-eyebrow" style={{ marginBottom: 24 }}>Order timeline</h3>
              <div>
                {timeline.map((s, i, arr) => (
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
                          <div style={{ width: 40, height: 40, background: 'var(--paper-3)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }} aria-hidden="true">📄</div>
                          <div>
                            <div style={{ fontSize: 12, fontWeight: 500 }}>receipt-{order.id}.jpg</div>
                            <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>{order.store} · ${order.retail} verified</div>
                          </div>
                          <a onClick={(e) => e.preventDefault()} style={{ fontSize: 12, color: 'var(--rouge-deep)', marginLeft: 16, cursor: 'pointer' }} role="button">View →</a>
                        </div>
                      )}
                    </div>
                    <span className="h-mono" style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: '.06em', whiteSpace: 'nowrap' }}>{s.d}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="h-card" style={{ padding: 24, marginTop: 16, display: 'grid', gridTemplateColumns: '120px 1fr auto', gap: 20, alignItems: 'center' }}>
              <div style={{ width: 120, height: 120, background: `url(${order.img}) center/cover`, borderRadius: 12 }} aria-hidden="true"/>
              <div>
                <div className="h-mono" style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: '.08em' }}>{order.store.toUpperCase()}</div>
                <h4 style={{ margin: '4px 0 0', fontSize: 18 }}>{order.item}</h4>
                <div style={{ fontSize: 13, color: 'var(--ink-2)', marginTop: 8 }}>Qty 1 · Hand-carried by {order.carrier}</div>
              </div>
              <div className="h-serif" style={{ fontSize: 28 }}>${order.total}</div>
            </div>

            {/* P1-11: Inline review form when delivered */}
            {isDelivered && !reviewSubmitted && (
              <ReviewForm carrier={order.carrier} onSubmit={() => setReviewSubmitted(true)}/>
            )}
            {isDelivered && reviewSubmitted && (
              <div className="h-card" style={{ padding: 24, marginTop: 16, background: 'var(--rouge-soft)', borderColor: 'rgba(139,30,45,.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--rouge-deep)' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 13l4 4L19 7"/></svg>
                  <span style={{ fontWeight: 500 }}>Thanks for the review · Public to all carriers</span>
                </div>
              </div>
            )}

            {/* P1-14: Dispute creation form (collapsed unless filed) */}
            {!isCancelled && !disputeFiled && (
              <DisputeForm orderId={order.id} onFiled={() => setDisputeFiled(true)}/>
            )}
            {disputeFiled && (
              <div className="h-card" style={{ padding: 24, marginTop: 16, borderColor: 'rgba(139,30,45,.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span className="h-chip h-chip-amber">● Dispute filed</span>
                  <span style={{ fontSize: 13, color: 'var(--ink-2)' }}>DS-{4000 + Math.floor(parseInt(order.id.split('-')[1] || '0', 10) / 10)} · Resolution team has been notified</span>
                </div>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="h-card" style={{ padding: 24 }}>
              <h3 className="h-eyebrow" style={{ marginBottom: 16 }}>Your carrier</h3>
              <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                <HAvatar name={order.carrier} size={56}/>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ fontWeight: 500 }}>{order.carrier}</span> <HVerified size={12}/></div>
                  <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>★ 5.0 · {HD.user.reviews} reviews</div>
                </div>
                <button onClick={() => navigate(`/messages?order=${order.id}`)} className="h-btn h-btn-ghost h-btn-sm">Message</button>
              </div>
              <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end' }}>
                <HFollowButton name={order.carrier} size="sm"/>
              </div>
            </div>
            <div className="h-card" style={{ padding: 24 }}>
              <h3 className="h-eyebrow" style={{ marginBottom: 16 }}>Payment</h3>
              <div style={{ display: 'grid', gap: 8, fontSize: 13 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--ink-3)' }}>Item retail</span><span>${order.retail}.00</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--ink-3)' }}>Carry fee</span><span style={{ color: 'var(--rouge)' }}>${order.fee}.00</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--ink-3)' }}>Service fee</span><span>$0.00</span></div>
              </div>
              <hr className="h-divider" style={{ margin: '12px 0' }}/>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: 13 }}>{isCancelled ? 'Refunded' : isDelivered ? 'Released to carrier' : 'Held in escrow'}</span>
                <span className="h-serif" style={{ fontSize: 24 }}>${order.total}.00</span>
              </div>
              <div className="h-mono" style={{ fontSize: 10, color: 'var(--ink-3)', marginTop: 4, letterSpacing: '.08em' }}>
                {isCancelled ? 'REFUND IN 3–5 BUSINESS DAYS'
                  : isDelivered ? 'PAID OUT'
                  : 'RELEASES ON YOUR CONFIRMATION'}
              </div>
            </div>
            <div className="h-card" style={{ padding: 24 }}>
              <div style={{ display: 'grid', gap: 8 }}>
                {!isCancelled && !isDelivered && (
                  <button onClick={() => { setStatusOverride('Delivered'); navigate('/wallet'); }} className="h-btn h-btn-primary">Confirm receipt →</button>
                )}
                <button onClick={() => navigate(`/messages?order=${order.id}`)} className="h-btn h-btn-ghost">Message carrier</button>
                {/* P1-10: Cancel order — visible only while order is still cancelable */}
                {isPending && !isCancelled && (
                  <button
                    type="button"
                    onClick={cancelOrder}
                    className="h-btn h-btn-ghost"
                    style={{ borderColor: 'rgba(139,30,45,.3)', color: 'var(--rouge-deep)' }}
                  >Cancel order</button>
                )}
                <a onClick={(e) => { e.preventDefault(); toast('Invoice download — wiring up post-launch'); }} style={{ fontSize: 12, color: 'var(--ink-3)', textAlign: 'center', marginTop: 4, cursor: 'pointer' }} role="button">Download invoice (PDF)</a>
              </div>
              {!isCancelled && (
                <div style={{ marginTop: 20, padding: 12, background: 'var(--rouge-soft)', borderRadius: 8, fontSize: 12, color: 'var(--rouge-ink)', lineHeight: 1.5 }}>
                  <b>Buyer protection</b> covers item not received, not as described, or damaged. Open a dispute within 7 days of hand-off for a full refund.
                </div>
              )}
            </div>

            {/* P1-13: Carrier-side receipt upload (visible to whoever's logged in;
               we just always show it as a stub for the prototype). */}
            {!isCancelled && <ReceiptUploadCard/>}
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── ReviewForm: P1-11 inline review submission after delivery ───────────────
function ReviewForm({ carrier, onSubmit }) {
  const [stars, setStars] = useState(0);
  const [hover, setHover] = useState(0);
  const [body, setBody]   = useState('');
  const valid = stars > 0;

  return (
    <div className="h-card" style={{ padding: 24, marginTop: 16 }}>
      <h3 className="h-eyebrow" style={{ marginBottom: 8 }}>Rate your carrier</h3>
      <p style={{ fontSize: 13, color: 'var(--ink-2)', margin: 0 }}>How was your experience with {carrier}? Reviews help other buyers pick a carrier.</p>

      <div style={{ display: 'flex', gap: 6, marginTop: 16 }}>
        {[1, 2, 3, 4, 5].map(n => {
          const filled = (hover || stars) >= n;
          return (
            <button
              key={n}
              type="button"
              onClick={() => setStars(n)}
              onMouseEnter={() => setHover(n)}
              onMouseLeave={() => setHover(0)}
              aria-label={`${n} star${n > 1 ? 's' : ''}`}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: filled ? 'var(--rouge)' : 'var(--ink-4)', transition: 'color .15s' }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5"><path d="M12 2l2.5 7h7l-5.6 4.5L18 21l-6-4.5L6 21l2.1-7.5L2.5 9h7L12 2z"/></svg>
            </button>
          );
        })}
      </div>

      <textarea
        className="h-input"
        rows="3"
        placeholder="Share what went well, or what they could improve…"
        value={body}
        onChange={e => setBody(e.target.value)}
        style={{ marginTop: 16, resize: 'vertical' }}
      />

      <button
        type="button"
        onClick={() => valid && onSubmit({ stars, body })}
        disabled={!valid}
        className="h-btn h-btn-primary"
        style={{ marginTop: 16, opacity: valid ? 1 : 0.5, cursor: valid ? 'pointer' : 'not-allowed' }}
      >
        Submit review
      </button>
    </div>
  );
}

// ─── DisputeForm: P1-14 ─────────────────────────────────────────────────────
function DisputeForm({ orderId, onFiled }) {
  const [reason, setReason] = useState('');
  const [desc, setDesc]     = useState('');
  const valid = reason && desc.trim().length > 10;

  return (
    <div className="h-card" style={{ padding: 24, marginTop: 16, borderColor: 'rgba(139,30,45,.2)' }}>
      <h3 className="h-eyebrow" style={{ marginBottom: 16, color: 'var(--rouge-deep)' }}>Need help? Open a dispute</h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 16 }}>
        {[
          { v: 'not_received', t: 'Item not received' },
          { v: 'not_as_described', t: 'Not as described' },
          { v: 'damaged', t: 'Damaged on arrival' },
        ].map(r => {
          const on = reason === r.v;
          return (
            <button
              key={r.v}
              type="button"
              onClick={() => setReason(r.v)}
              style={{
                padding: 14, borderRadius: 10, fontSize: 13, fontFamily: 'inherit', cursor: 'pointer', textAlign: 'left',
                border: `1.5px solid ${on ? 'var(--rouge)' : 'var(--line-2)'}`,
                background: on ? 'var(--rouge-soft)' : 'var(--paper)',
                color: on ? 'var(--rouge-deep)' : 'var(--ink)',
              }}
            >
              {r.t}
            </button>
          );
        })}
      </div>

      <textarea
        className="h-input"
        rows="3"
        placeholder="Tell us what happened (min 10 characters)…"
        value={desc}
        onChange={e => setDesc(e.target.value)}
        style={{ resize: 'vertical' }}
      />

      <div style={{ display: 'flex', gap: 8, marginTop: 16, alignItems: 'center', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={() => valid && onFiled()}
          disabled={!valid}
          className="h-btn"
          style={{
            background: valid ? 'var(--rouge)' : 'transparent',
            color: valid ? 'var(--paper)' : 'var(--rouge-deep)',
            border: '1px solid', borderColor: valid ? 'var(--rouge)' : 'rgba(139,30,45,.3)',
            cursor: valid ? 'pointer' : 'not-allowed', opacity: valid ? 1 : 0.6,
          }}
        >
          File dispute
        </button>
        <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>Reviewed within 24h. Funds remain in escrow until resolved.</span>
      </div>
    </div>
  );
}

// ─── ReceiptUploadCard: P1-13 ───────────────────────────────────────────────
function ReceiptUploadCard() {
  const [preview, setPreview] = useState(null);
  const onChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview({ name: file.name, url: URL.createObjectURL(file) });
  };
  return (
    <div className="h-card" style={{ padding: 20 }}>
      <h3 className="h-eyebrow" style={{ marginBottom: 12 }}>Carrier · upload receipt</h3>
      {!preview ? (
        <label style={{ display: 'block', cursor: 'pointer' }}>
          <input type="file" accept="image/*" onChange={onChange} style={{ display: 'none' }}/>
          <div style={{
            border: '1.5px dashed var(--line-2)', borderRadius: 10, padding: '24px 16px',
            textAlign: 'center', fontSize: 13, color: 'var(--ink-3)',
          }}>
            <div style={{ fontSize: 22, marginBottom: 6 }} aria-hidden="true">📎</div>
            Click to attach a photo of the store receipt
          </div>
        </label>
      ) : (
        <div>
          <img src={preview.url} alt={`Receipt preview · ${preview.name}`} style={{ width: '100%', maxHeight: 220, objectFit: 'cover', borderRadius: 10 }}/>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, gap: 12 }}>
            <span style={{ fontSize: 12, color: 'var(--ink-3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{preview.name}</span>
            <button type="button" onClick={() => setPreview(null)} className="h-btn h-btn-ghost h-btn-sm">Replace</button>
          </div>
          <div className="h-mono" style={{ fontSize: 10, letterSpacing: '.08em', color: 'var(--ink-3)', marginTop: 8, padding: '6px 10px', background: 'var(--paper-2)', borderRadius: 6, display: 'inline-block' }}>
            UPLOAD PENDING BACKEND WIRING
          </div>
        </div>
      )}
    </div>
  );
}

export function PageMyTrips() {
  const navigate = useNavigate();
  const trips = TRIPS;
  // Track declined request indices so the card actually disappears (P0-5),
  // instead of the previous DOM-mutation hack that left the element in the
  // tree at opacity .4.
  const [declined, setDeclined] = useState(new Set());
  const allRequests = [
    { id: 'rq-1', item: 'Sezane linen dress (size 36)', emoji: '👗', city: 'PAR', fee: 35, urgent: false, who: 'Anna L.' },
    { id: 'rq-2', item: 'Lego Tokyo Skyline',           emoji: '🧱', city: 'TYO', fee: 22, urgent: true,  who: 'Marco D.' },
    { id: 'rq-3', item: 'COSRX bundle (4 items)',       emoji: '🧴', city: 'SEL', fee: 48, urgent: false, who: 'Riku S.' },
  ];
  const requests = allRequests.filter(r => !declined.has(r.id));
  const decline = (id) => setDeclined(prev => {
    const next = new Set(prev); next.add(id); return next;
  });
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
              {requests.map((r) => (
                <div key={r.id} className="h-card" style={{ padding: 18, animation: 'h-fade-up .25s var(--ease-out) both' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 44, height: 44, background: 'var(--paper-2)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }} aria-hidden="true">{r.emoji}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 500 }}>{r.item}</div>
                      <div style={{ fontSize: 11, color: 'var(--ink-3)', fontFamily: 'var(--font-mono)', letterSpacing: '.06em', marginTop: 2 }}>{r.city} · {r.who}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div className="h-serif" style={{ fontSize: 20, color: 'var(--rouge)' }}>+${r.fee}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
                    <button onClick={() => navigate(`/messages?request=${r.id}`)} className="h-btn h-btn-primary h-btn-sm" style={{ flex: 1 }}>Accept</button>
                    <button onClick={() => decline(r.id)} className="h-btn h-btn-ghost h-btn-sm">Decline</button>
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
  // Read from the shared TRIPS source so PostTrip's edit mode and the trips
  // list see the same data. Use `dateFull` for the headline display.
  const sourceTrip = TRIPS.find(t => t.id === id);
  const trip = sourceTrip ? { ...sourceTrip, date: sourceTrip.dateFull || sourceTrip.date } : null;
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
            <button onClick={() => navigate(`/post-trip?edit=${trip.id}`)} className="h-btn h-btn-ghost">Edit trip details</button>
          </div>
        </div>
      </section>
    </div>
  );
}

