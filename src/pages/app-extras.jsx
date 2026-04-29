import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { HD } from '../data/sample';
import { HAvatar, HStars, HVerified, HEmpty, HFollowButton } from '../components/primitives';
import { useFollowing } from '../follow';
import { toast } from '../toast';
import { HAppNav } from './dashboard';

// Messages, Wallet, Profile, Settings, Membership

// Per-thread conversation seed — switching threads loads its own backlog.
const THREAD_DATA = [
  {
    name: 'James L.', initials: 'JL', last: "I just left Pokémon Center — receipt attached.", time: '2m', unread: 2,
    route: 'TYO → NYC', verified: true, online: true, orderId: 'HD-2847', itemIdx: 1, total: 155,
    messages: [
      { from: 'them', text: 'Hey! Just at Mega Tokyo now. The Eevee figure is in stock — original packaging.', time: '11:04' },
      { from: 'them', text: 'Snapping a photo before checkout, give me a sec.', time: '11:04' },
      { from: 'them', text: '', imgIdx: 1, time: '11:06' },
      { from: 'me', text: "Perfect, that's exactly the one. Go ahead 🙏", time: '11:08' },
      { from: 'them', text: "Paid! Receipt below — ¥18,200 total. I'll keep it sealed in original box for transit.", time: '11:11', system: 'RECEIPT VERIFIED · ESCROW UNCHANGED' },
      { from: 'me', text: 'Amazing. Williamsburg pickup works for me whenever you land. Have a safe flight!', time: '11:13' },
    ],
  },
  {
    name: 'Yuki H.', initials: 'YH', last: 'Will pick up the Hobonichi tomorrow morning.', time: '1h', unread: 0,
    route: 'TYO → LA', online: false, orderId: 'HD-2841', itemIdx: 5, total: 45,
    messages: [
      { from: 'me', text: 'Hi Yuki! Confirmed reservation for the Techo planner.', time: '09:14' },
      { from: 'them', text: 'Got it — heading to Hobonichi flagship tomorrow morning. Will send a photo.', time: '09:42' },
      { from: 'me', text: 'Thanks! Cover color: navy please.', time: '09:43' },
      { from: 'them', text: 'Will pick up the Hobonichi tomorrow morning.', time: '10:02' },
    ],
  },
  {
    name: 'Minho C.', initials: 'MC', last: "Confirmed receipt — thanks for the smooth handoff!", time: '3h', unread: 0,
    route: 'SEL → SF', online: false, orderId: 'HD-2812', itemIdx: 6, total: 41, completed: true,
    messages: [
      { from: 'them', text: "Just landed in SF. Available for meetup this weekend at SoMa Sightglass?", time: 'Yesterday 18:20' },
      { from: 'me', text: 'Perfect! Saturday 11am works for me.', time: 'Yesterday 18:35' },
      { from: 'them', text: 'See you then 👋', time: 'Yesterday 18:36' },
      { from: 'me', text: 'Confirmed receipt — thanks for the smooth handoff!', time: '08:42', system: 'ESCROW RELEASED · $41 TO MINHO' },
    ],
  },
  {
    name: 'Anna L.', initials: 'AL', last: 'About my Sezane request — any update?', time: '1d', unread: 1,
    route: 'PAR → NYC', online: true, orderId: 'REQ-1024', itemIdx: 9, total: 215,
    messages: [
      { from: 'them', text: 'Hey! Just saw your Paris trip — I posted a request for a Sezane linen dress.', time: 'Yesterday 14:02' },
      { from: 'them', text: 'About my Sezane request — any update?', time: 'Yesterday 19:14' },
    ],
  },
  {
    name: 'Elise M.', initials: 'EM', last: '[Dispute] Resolution team is reviewing.', time: '2d', unread: 0,
    route: 'PAR → NYC', online: false, orderId: 'HD-2790', itemIdx: 9, total: 108, dispute: true,
    messages: [
      { from: 'me', text: 'The candle arrived damaged — wax is cracked through the middle.', time: 'Apr 22' },
      { from: 'them', text: "I'm so sorry. Already opened a dispute on my end.", time: 'Apr 22' },
      { from: 'me', text: 'Photos sent to support.', time: 'Apr 22', system: 'DISPUTE OPENED · #DS-4421' },
      { from: 'them', text: '[Dispute] Resolution team is reviewing.', time: 'Apr 23' },
    ],
  },
];

const QUICK_REPLIES = [
  '👍 Sounds good',
  '🙏 Thanks!',
  "📍 What's the meetup spot?",
  '⏰ When do you land?',
];

export function PageMessages() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  // Open the thread that matches an `?order=`, `?trip=`, or `?request=` query
  // when the user lands here from another page (Order Detail "Message
  // carrier", Trips "Accept", etc.). Falls back to the first thread.
  const initialThreadIdx = (() => {
    const orderQ = searchParams.get('order');
    const tripQ  = searchParams.get('trip');
    const reqQ   = searchParams.get('request');
    const withQ  = searchParams.get('with');
    if (orderQ) {
      const i = THREAD_DATA.findIndex(t => t.orderId === orderQ);
      if (i >= 0) return i;
    }
    if (reqQ) {
      const i = THREAD_DATA.findIndex(t => String(t.orderId).includes(String(reqQ)));
      if (i >= 0) return i;
    }
    if (withQ) {
      const target = withQ.toLowerCase();
      const i = THREAD_DATA.findIndex(t => t.name.toLowerCase() === target);
      if (i >= 0) return i;
    }
    return 0;
  })();
  const [activeIdx, setActiveIdx] = useState(initialThreadIdx);
  const [draft, setDraft] = useState('');
  const [sentByThread, setSentByThread] = useState({});
  const [search, setSearch] = useState('');

  const filteredThreads = THREAD_DATA
    .map((t, i) => ({ ...t, _idx: i }))
    .filter(t => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return t.name.toLowerCase().includes(q) || t.last.toLowerCase().includes(q) || t.route.toLowerCase().includes(q);
    });

  const thread = THREAD_DATA[activeIdx];
  const baseMessages = thread.messages;
  const draftSent = (sentByThread[activeIdx] || []).map(t => ({ from: 'me', text: t, time: 'just now', delivered: true }));
  const allMessages = [...baseMessages, ...draftSent];

  // Group consecutive messages from the same sender
  const groups = [];
  allMessages.forEach((m) => {
    const last = groups[groups.length - 1];
    if (last && last.from === m.from && !m.system) last.items.push(m);
    else groups.push({ from: m.from, items: [m] });
  });

  const send = (text) => {
    const t = (text ?? draft).trim();
    if (!t) return;
    setSentByThread(s => ({ ...s, [activeIdx]: [...(s[activeIdx] || []), t] }));
    setDraft('');
  };

  const orderItem = HD.items[thread.itemIdx];

  return (
    <div className="h-app" style={{ width: '100%', height: 900, display: 'flex', flexDirection: 'column' }}>
      <HAppNav active="messages" role="buyer"/>
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '340px 1fr', minHeight: 0 }}>
        {/* threads */}
        <aside style={{ borderRight: '1px solid var(--line)', overflowY: 'auto', background: 'var(--paper)' }}>
          <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid var(--line)', position: 'sticky', top: 0, background: 'var(--paper)', zIndex: 1 }}>
            <h2 className="h-display" style={{ fontSize: 28, margin: 0 }}>Messages</h2>
            <div style={{ position: 'relative', marginTop: 12 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--ink-3)" strokeWidth="1.8" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
              <input className="h-input" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, route, message…" style={{ fontSize: 13, paddingLeft: 34 }}/>
            </div>
          </div>
          <div>
            {filteredThreads.length === 0 ? (
              <div style={{ padding: '40px 24px', textAlign: 'center', fontSize: 13, color: 'var(--ink-3)' }}>No matches for "{search}"</div>
            ) : filteredThreads.map(t => (
              <div key={t._idx} onClick={() => setActiveIdx(t._idx)} style={{
                padding: '16px 24px', borderBottom: '1px solid var(--line)',
                background: t._idx === activeIdx ? 'var(--paper-2)' : 'transparent', cursor: 'pointer',
                display: 'flex', gap: 12, position: 'relative',
                transition: 'background .15s',
              }}>
                {t._idx === activeIdx && <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 2, background: 'var(--rouge)' }}/>}
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <HAvatar name={t.name} size={40}/>
                  {t.online && <span style={{ position: 'absolute', bottom: 0, right: 0, width: 10, height: 10, background: 'var(--green)', border: '2px solid var(--paper)', borderRadius: 999 }}/>}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: t.unread > 0 ? 600 : 500, fontSize: 14, display: 'flex', alignItems: 'center', gap: 4 }}>{t.name} {t.verified && <HVerified size={10}/>}</span>
                    <span className="h-mono" style={{ fontSize: 10, color: t.unread > 0 ? 'var(--rouge)' : 'var(--ink-3)' }}>{t.time}</span>
                  </div>
                  <div className="h-mono" style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: '.06em', marginTop: 2 }}>
                    {t.route}{t.dispute && <span style={{ color: 'var(--rouge)' }}> · DISPUTE</span>}{t.completed && <span style={{ color: 'var(--green)' }}> · COMPLETED</span>}
                  </div>
                  <div style={{ fontSize: 12, color: t.unread > 0 ? 'var(--ink)' : 'var(--ink-2)', marginTop: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: t.unread > 0 ? 500 : 400 }}>{t.last}</div>
                </div>
                {t.unread > 0 && <span style={{ alignSelf: 'center', minWidth: 18, height: 18, padding: '0 6px', background: 'var(--rouge)', color: 'white', borderRadius: 999, fontSize: 10, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{t.unread}</span>}
              </div>
            ))}
          </div>
        </aside>

        {/* conversation */}
        <main key={activeIdx} style={{ display: 'flex', flexDirection: 'column', minWidth: 0, background: 'var(--paper)' }}>
          <header style={{ padding: '14px 24px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ position: 'relative' }}>
              <HAvatar name={thread.name} size={36}/>
              {thread.online && <span style={{ position: 'absolute', bottom: 0, right: 0, width: 9, height: 9, background: 'var(--green)', border: '2px solid var(--paper)', borderRadius: 999 }}/>}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>{thread.name} {thread.verified && <HVerified size={12}/>}</div>
              <div className="h-mono" style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: '.06em' }}>
                {thread.online ? <span style={{ color: 'var(--green)' }}>● ACTIVE NOW</span> : <span>● Last seen {thread.time} ago</span>}
                <span> · ORDER #{thread.orderId}</span>
              </div>
            </div>
            <HFollowButton name={thread.name} size="sm"/>
            <button onClick={() => toast(`Calling ${thread.name}…`, { kind: 'info' })} style={iconBtn} aria-label="Call carrier" title="Call">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.33 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            </button>
            <button onClick={() => navigate('/order-detail')} className="h-btn h-btn-ghost h-btn-sm">View order</button>
          </header>

          {/* Pinned order strip */}
          <div style={{ padding: '10px 24px', borderBottom: '1px solid var(--line)', background: 'var(--paper-2)', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 40, height: 40, background: `url(${orderItem.img}) center/cover`, borderRadius: 8, flexShrink: 0 }}/>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{orderItem.title}</div>
              <div className="h-mono" style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: '.06em', marginTop: 2 }}>${thread.total} · {thread.route} · {orderItem.departs.toUpperCase()}</div>
            </div>
            <button onClick={() => navigate('/order-detail')} style={pinAct}>View receipt</button>
            {!thread.completed && <button onClick={() => toast("Hand-off scheduled · we'll remind you 1 hour before", { kind: 'success' })} style={pinAct}>Schedule hand-off</button>}
            {!thread.completed && !thread.dispute && <button onClick={() => { toast('Receipt confirmed · funds released to carrier', { kind: 'success' }); navigate('/wallet'); }} style={{ ...pinAct, background: 'var(--ink)', color: 'var(--paper)', borderColor: 'var(--ink)' }}>Confirm receipt</button>}
            {thread.dispute && <span className="h-chip h-chip-amber" style={{ whiteSpace: 'nowrap' }}>● Dispute open</span>}
            {thread.completed && <span className="h-chip h-chip-green" style={{ whiteSpace: 'nowrap' }}>● Delivered</span>}
          </div>

          {/* messages */}
          <div style={{ flex: 1, padding: '20px 24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div className="h-mono" style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: '.1em', textAlign: 'center', padding: '8px 0 16px' }}>— TODAY · MAY 6 —</div>
            {groups.map((g, gi) => (
              <div key={gi} style={{ display: 'flex', flexDirection: 'column', alignItems: g.from === 'me' ? 'flex-end' : 'flex-start', marginTop: gi > 0 ? 14 : 0 }}>
                {g.items.map((m, mi) => (
                  <React.Fragment key={mi}>
                    {m.img && <div className="h-fade-up" style={{ width: 240, height: 240, background: `url(${m.img}) center/cover`, borderRadius: 14, marginBottom: m.text ? 6 : 0 }}/>}
                    {m.imgIdx !== undefined && <div className="h-fade-up" style={{ width: 240, height: 240, background: `url(${HD.items[m.imgIdx].img}) center/cover`, borderRadius: 14, marginBottom: m.text ? 6 : 0 }}/>}
                    {m.text && (
                      <div className="h-fade-up" style={{
                        maxWidth: '70%',
                        padding: '10px 14px',
                        background: m.from === 'me' ? 'var(--ink)' : 'var(--paper-2)',
                        color: m.from === 'me' ? 'var(--paper)' : 'var(--ink)',
                        fontSize: 14, lineHeight: 1.5,
                        borderRadius: 18,
                        borderBottomRightRadius: m.from === 'me' && mi === g.items.length - 1 ? 4 : 18,
                        borderBottomLeftRadius: m.from === 'them' && mi === g.items.length - 1 ? 4 : 18,
                        marginTop: mi > 0 ? 2 : 0,
                      }}>{m.text}</div>
                    )}
                    {m.system && <div className="h-mono" style={{ fontSize: 10, color: 'var(--rouge)', letterSpacing: '.08em', marginTop: 6, alignSelf: g.from === 'me' ? 'flex-end' : 'flex-start' }}>● {m.system}</div>}
                  </React.Fragment>
                ))}
                {/* group footer: time + read receipt */}
                <div className="h-mono" style={{ fontSize: 10, color: 'var(--ink-3)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span>{g.items[g.items.length - 1].time}</span>
                  {g.from === 'me' && (
                    <svg width="14" height="10" viewBox="0 0 14 10" fill="none" stroke={g.items.some(i => i.delivered === false) ? 'var(--ink-3)' : 'var(--rouge)'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 5l3 3 5-7M6 8l5-7"/>
                    </svg>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* quick replies */}
          <div style={{ padding: '0 24px 8px', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {QUICK_REPLIES.map(r => (
              <button key={r} onClick={() => send(r)} style={{
                padding: '6px 12px', fontSize: 12, borderRadius: 999,
                border: '1px solid var(--line-2)', background: 'var(--paper)', color: 'var(--ink-2)',
                cursor: 'pointer', fontFamily: 'inherit', transition: 'all .15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--paper-2)'; e.currentTarget.style.borderColor = 'var(--ink-3)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--paper)'; e.currentTarget.style.borderColor = 'var(--line-2)'; }}
              >{r}</button>
            ))}
          </div>

          {/* composer */}
          <form onSubmit={(e) => { e.preventDefault(); send(); }} style={{ padding: '12px 16px 16px', borderTop: '1px solid var(--line)', display: 'flex', gap: 8, alignItems: 'center' }}>
            <button type="button" onClick={() => toast('Attachments coming soon', { kind: 'info' })} style={iconBtn} aria-label="Attach a file" title="Attach">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
            </button>
            <button type="button" onClick={() => toast('Emoji picker coming soon', { kind: 'info' })} style={iconBtn} aria-label="Add emoji" title="Emoji">😊</button>
            <input className="h-input" placeholder={`Message ${thread.name.split(' ')[0]}…`} value={draft} onChange={e => setDraft(e.target.value)} style={{ flex: 1 }}/>
            <button type="submit" disabled={!draft.trim()} className="h-btn h-btn-primary h-btn-sm" style={{ opacity: draft.trim() ? 1 : 0.5, cursor: draft.trim() ? 'pointer' : 'not-allowed' }}>Send →</button>
          </form>
        </main>
      </div>
    </div>
  );
}

const pinAct = {
  padding: '7px 14px', borderRadius: 999, fontSize: 12,
  border: '1px solid var(--line-2)', background: 'var(--paper)', color: 'var(--ink)',
  cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit',
  transition: 'background .15s, color .15s, border-color .15s',
};
const iconBtn = {
  width: 36, height: 36, border: '1px solid var(--line-2)', borderRadius: 999,
  background: 'transparent', cursor: 'pointer', display: 'flex',
  alignItems: 'center', justifyContent: 'center', color: 'var(--ink-2)',
  fontSize: 14, padding: 0,
};

export function PageWallet() {
  const u = HD.user;
  const navigate = useNavigate();
  const [txTab, setTxTab] = useState(0);
  const txs = [
    { t: 'Carry payout · TYO → NYC',     d: '+$280.00', at: 'May 1',  tone: 'green', type: 'payout',     sub: 'Order #HD-2841 released' },
    { t: 'Carry payout · NYC → TYO',     d: '+$310.00', at: 'Apr 22', tone: 'green', type: 'payout',     sub: '4 items delivered' },
    { t: 'Withdrawal to Chase ····3491', d: '−$500.00', at: 'Apr 18', tone: 'ink',   type: 'withdrawal', sub: 'ACH · 1–2 business days' },
    { t: 'Carry payout · SF → SEL',      d: '+$420.00', at: 'Apr 4',  tone: 'green', type: 'payout',     sub: 'Order #HD-2701 released' },
    { t: 'Promo · Top Carrier bonus',    d: '+$25.00',  at: 'Apr 1',  tone: 'rouge', type: 'payout',     sub: 'March milestone' },
    { t: 'Refund issued · damaged item', d: '−$108.00', at: 'Mar 28', tone: 'ink',   type: 'withdrawal', sub: 'Dispute #DS-4421' },
  ];

  const txFilters = ['all', 'payout', 'withdrawal'];
  const filteredTxs = txs.filter(tx => txFilters[txTab] === 'all' || tx.type === txFilters[txTab]);
  const [withdrawNote, setWithdrawNote] = useState(null);

  return (
    <div className="h-app" style={{ width: '100%', minHeight: 1100 }}>
      <HAppNav active="wallet" role="carrier"/>
      <section style={{ padding: '40px 32px 80px', maxWidth: 1280, margin: '0 auto' }}>
        <div className="h-eyebrow">YOUR WALLET</div>
        <h1 className="h-display" style={{ fontSize: 40, margin: '8px 0 24px', lineHeight: 1.04 }}>Earnings & <span style={{ fontStyle: 'italic' }}>payouts.</span></h1>

        {/* Balance hero */}
        <div style={{ background: 'var(--noir)', color: 'var(--paper)', borderRadius: 'var(--r-lg)', padding: 40, display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 32, marginBottom: 32, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: -60, top: -60, width: 280, height: 280, background: 'radial-gradient(circle, var(--rouge) 0%, transparent 70%)', opacity: .5, pointerEvents: 'none' }}/>
          <div style={{ position: 'relative' }}>
            <div className="h-mono" style={{ fontSize: 11, color: 'rgba(250,248,244,.6)', letterSpacing: '.1em' }}>AVAILABLE TO WITHDRAW</div>
            <div className="h-display" style={{ fontSize: 88, marginTop: 12, color: 'var(--paper)', lineHeight: 1 }}>${u.walletAvailable}</div>
            <div style={{ marginTop: 24, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => {
                  setWithdrawNote(`Queued $${u.walletAvailable} → Chase ····3491 · ETA 1–2 business days`);
                  setTimeout(() => setWithdrawNote(null), 3500);
                }}
                className="h-btn h-btn-rouge"
              >Withdraw to bank →</button>
              <button onClick={() => navigate('/settings')} className="h-btn h-btn-ghost" style={{ borderColor: 'rgba(250,248,244,.2)', color: 'var(--paper)' }}>Add payout method</button>
              {withdrawNote && (
                <span style={{ fontSize: 13, color: 'rgba(250,248,244,.85)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 13l4 4L19 7"/></svg>
                  {withdrawNote}
                </span>
              )}
            </div>
          </div>
          <div style={{ position: 'relative', borderLeft: '1px solid rgba(250,248,244,.12)', paddingLeft: 32 }}>
            <div className="h-mono" style={{ fontSize: 11, color: 'rgba(250,248,244,.6)', letterSpacing: '.1em' }}>PENDING (IN ESCROW)</div>
            <div className="h-display" style={{ fontSize: 36, marginTop: 12, color: 'var(--paper)' }}>${u.walletPending}</div>
            <div style={{ fontSize: 12, color: 'rgba(250,248,244,.6)', marginTop: 4 }}>Releases on buyer confirmation</div>
          </div>
          <div style={{ position: 'relative', borderLeft: '1px solid rgba(250,248,244,.12)', paddingLeft: 32 }}>
            <div className="h-mono" style={{ fontSize: 11, color: 'rgba(250,248,244,.6)', letterSpacing: '.1em' }}>LIFETIME EARNED</div>
            <div className="h-display" style={{ fontSize: 36, marginTop: 12, color: 'var(--paper)' }}>${u.walletLifetime.toLocaleString()}</div>
            <div style={{ fontSize: 12, color: 'rgba(250,248,244,.6)', marginTop: 4 }}>{u.completedTrips} trips · since 2024</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 32 }}>
          {/* Transactions */}
          <div className="h-card" style={{ padding: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h3 className="h-serif" style={{ fontSize: 28, margin: 0 }}>Activity</h3>
              <div style={{ display: 'flex', gap: 8 }}>
                {['All', 'Payouts', 'Withdrawals'].map((t, i) => (
                  <button key={t} onClick={() => setTxTab(i)} style={{
                    padding: '6px 12px', border: '1px solid', borderRadius: 999, fontSize: 12,
                    background: i === txTab ? 'var(--ink)' : 'transparent', color: i === txTab ? 'var(--paper)' : 'var(--ink-2)',
                    borderColor: i === txTab ? 'var(--ink)' : 'var(--line-2)', cursor: 'pointer'
                  }}>{t}</button>
                ))}
              </div>
            </div>
            <div>
              {filteredTxs.length === 0 ? (
                <HEmpty
                  icon="✦"
                  title={txFilters[txTab] === 'payout' ? 'No payouts in this view' : 'No withdrawals yet'}
                  body={txFilters[txTab] === 'payout' ? 'Carry an order and your earnings will show up here.' : 'Hit "Withdraw to bank" above to move funds out of escrow.'}
                />
              ) : filteredTxs.map((tx, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 16, alignItems: 'center', padding: '16px 0', borderBottom: i < filteredTxs.length-1 ? '1px solid var(--line)' : 'none' }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>{tx.t}</div>
                    <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>{tx.sub}</div>
                  </div>
                  <span className="h-mono" style={{ fontSize: 11, color: 'var(--ink-3)' }}>{tx.at}</span>
                  <span className="h-serif" style={{ fontSize: 18, color: tx.tone === 'green' ? 'var(--green)' : tx.tone === 'rouge' ? 'var(--rouge)' : 'var(--ink)' }}>{tx.d}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="h-card" style={{ padding: 24 }}>
              <h3 className="h-eyebrow" style={{ marginBottom: 16 }}>Payout method</h3>
              <div style={{ padding: 16, background: 'var(--paper-2)', borderRadius: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 500 }}>Chase Bank</div>
                    <div className="h-mono" style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 4 }}>···· 3491 · ACH</div>
                  </div>
                  <span className="h-chip h-chip-green">Default</span>
                </div>
              </div>
              <button onClick={() => navigate('/settings')} className="h-btn h-btn-ghost h-btn-sm" style={{ width: '100%', marginTop: 12 }}>+ Add bank or card</button>
            </div>

            <div className="h-card" style={{ padding: 24 }}>
              <h3 className="h-eyebrow" style={{ marginBottom: 12 }}>Tax & docs</h3>
              <div style={{ display: 'grid', gap: 6, fontSize: 13 }}>
                <a onClick={(e) => { e.preventDefault(); toast('Tax form download — wiring up post-launch'); }} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--line)', color: 'var(--ink-2)', cursor: 'pointer' }}>2025 1099-K <span>↓</span></a>
                <a onClick={(e) => { e.preventDefault(); toast('Earnings statement — wiring up post-launch'); }} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--line)', color: 'var(--ink-2)', cursor: 'pointer' }}>Earnings statement <span>↓</span></a>
                <a onClick={(e) => e.preventDefault()} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', color: 'var(--ink-2)', cursor: 'pointer' }}>W-9 on file <span>✓</span></a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export function PageProfile() {
  const u = HD.user;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const initialProfileTab = tabParam === 'following' ? 3 : tabParam === 'followers' ? 4 : 0;
  const [profileTab, setProfileTab] = useState(initialProfileTab);
  const followingSet = useFollowing();
  const followers = HD.followers || [];
  return (
    <div className="h-app" style={{ width: '100%', minHeight: 1100 }}>
      <HAppNav active="" role="carrier"/>
      <section style={{ position: 'relative', padding: '0 0 60px' }}>
        <div style={{ height: 240, background: 'linear-gradient(135deg, #6B1722, #2B0A10), url(https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=1600&q=85) center/cover' }}/>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 24, marginTop: -64 }}>
            <div style={{ width: 144, height: 144, borderRadius: 999, background: 'var(--paper-2)', border: '6px solid var(--paper)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48, fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>{u.initials}</div>
            <div style={{ flex: 1, paddingBottom: 16 }}>
              <h1 className="h-display" style={{ fontSize: 40, margin: 0, lineHeight: 1.04 }}>{u.name}</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 12, fontSize: 14, color: 'var(--ink-2)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><HVerified size={14}/> {u.member}</span>
                <span>·</span>
                <span>★ {u.rating} ({u.reviews})</span>
                <span>·</span>
                <span>{u.completedTrips} trips · {u.completedOrders} orders</span>
                <span>·</span>
                <span>{u.city}</span>
              </div>
            </div>
            <button onClick={() => navigate('/settings')} className="h-btn h-btn-ghost">Edit profile</button>
          </div>
        </div>
      </section>

      <section style={{ padding: '0 32px 80px', maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 32 }}>
        <aside>
          <div className="h-card" style={{ padding: 24, marginBottom: 16 }}>
            <h3 className="h-eyebrow" style={{ marginBottom: 12 }}>About</h3>
            <p style={{ fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.6, margin: 0 }}>SF-based product designer. Monthly Tokyo runs. I specialize in Japanese stationery, anime collectibles, and Pokémon Center exclusives.</p>
          </div>
          <div className="h-card" style={{ padding: 24, marginBottom: 16 }}>
            <h3 className="h-eyebrow" style={{ marginBottom: 12 }}>Specialties</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {['Stationery', 'Pokémon Center', 'Anime collectibles', 'Limited drops', 'Snacks'].map(t => <span key={t} className="h-chip">{t}</span>)}
            </div>
          </div>
          <div className="h-card" style={{ padding: 24 }}>
            <h3 className="h-eyebrow" style={{ marginBottom: 12 }}>Verified</h3>
            {/* TODO(post-backend): tie verification rows to real KYC state instead of hardcoded all-true. */}
            <div style={{ display: 'grid', gap: 8, fontSize: 13 }}>
              {[['Government ID', true], ['Selfie liveness', true], ['Email', true], ['Phone (US)', true], ['Payout bank', true]].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--line)' }}>
                  <span>{k}</span><span style={{ color: 'var(--green)', fontSize: 12 }}>✓ Verified</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <div>
          <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid var(--line)', marginBottom: 24, overflowX: 'auto' }}>
            {[`Reviews · 47`, `Past trips · 14`, `On the way · 1`, `Following · ${followingSet.size}`, `Followers · ${followers.length}`].map((t, i) => (
              <button key={t} type="button" onClick={() => setProfileTab(i)} style={{
                padding: '12px 16px', border: 'none', background: 'transparent', fontSize: 14, cursor: 'pointer',
                color: i === profileTab ? 'var(--ink)' : 'var(--ink-3)', fontWeight: i === profileTab ? 500 : 400,
                borderBottom: i === profileTab ? '2px solid var(--ink)' : '2px solid transparent', marginBottom: -1,
                fontFamily: 'inherit', whiteSpace: 'nowrap',
              }}>{t}</button>
            ))}
          </div>

          <div key={profileTab} style={{ animation: 'h-fade-up .3s var(--ease-out) both' }}>
            {profileTab === 0 && <ProfileReviews u={u}/>}
            {profileTab === 1 && <ProfilePastTrips/>}
            {profileTab === 2 && <ProfileOnTheWay navigate={navigate}/>}
            {profileTab === 3 && <ProfileFollowing carriers={followingSet} navigate={navigate}/>}
            {profileTab === 4 && <ProfileFollowers followers={followers} navigate={navigate}/>}
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── Profile sub-tabs ──────────────────────────────────
function ProfileReviews({ u }) {
  return (
    <>
      {/* Rating breakdown */}
      <div className="h-card" style={{ padding: 28, display: 'grid', gridTemplateColumns: '180px 1fr', gap: 32, marginBottom: 16 }}>
        <div style={{ textAlign: 'center', borderRight: '1px solid var(--line)', paddingRight: 32 }}>
          <div className="h-display" style={{ fontSize: 72 }}>{u.rating}</div>
          <HStars value={5} size={14}/>
          <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 8 }}>{u.reviews} reviews</div>
        </div>
        <div style={{ display: 'grid', gap: 8 }}>
          {[[5, 42], [4, 4], [3, 1], [2, 0], [1, 0]].map(([n, c]) => (
            <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 12 }}>
              <span style={{ width: 12, color: 'var(--ink-3)' }}>{n}</span>
              <div style={{ flex: 1, height: 6, background: 'var(--paper-2)', borderRadius: 999, overflow: 'hidden' }}>
                <div style={{ width: `${(c/47)*100}%`, height: '100%', background: 'var(--ink)' }}/>
              </div>
              <span style={{ width: 24, color: 'var(--ink-3)', textAlign: 'right' }}>{c}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gap: 12 }}>
        {HD.reviews.map((r, i) => (
          <div key={i} className="h-card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <HAvatar name={r.name} size={36}/>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500, fontSize: 14 }}>{r.name}</div>
                <div className="h-mono" style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: '.06em' }}>{r.route} · 2 weeks ago</div>
              </div>
              <HStars value={r.rating} size={12}/>
            </div>
            <p className="h-serif" style={{ fontSize: 18, lineHeight: 1.5, fontStyle: 'italic', margin: 0 }}>"{r.body}"</p>
          </div>
        ))}
      </div>
    </>
  );
}

function ProfilePastTrips() {
  const trips = [
    { id: 'TR-1029', route: 'TYO → SF',  date: 'Apr 22, 2026', items: 4, earned: 280 },
    { id: 'TR-1014', route: 'NYC → TYO', date: 'Mar 30, 2026', items: 3, earned: 310 },
    { id: 'TR-1002', route: 'SF → SEL',  date: 'Mar 10, 2026', items: 4, earned: 420 },
    { id: 'TR-0987', route: 'TYO → SF',  date: 'Feb 18, 2026', items: 2, earned: 165 },
    { id: 'TR-0962', route: 'SF → TYO',  date: 'Jan 25, 2026', items: 5, earned: 480 },
  ];
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      {trips.map(t => (
        <div key={t.id} className="h-card" style={{ padding: 20, display: 'grid', gridTemplateColumns: '1fr auto auto auto', alignItems: 'center', gap: 24 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 500 }}>{t.route}</div>
            <div className="h-mono" style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: '.06em', marginTop: 2 }}>{t.id} · {t.date}</div>
          </div>
          <span className="h-chip">{t.items} items</span>
          <span className="h-serif" style={{ fontSize: 18, color: 'var(--green)' }}>+${t.earned}</span>
          <span className="h-chip h-chip-green" style={{ fontSize: 10 }}>Completed</span>
        </div>
      ))}
    </div>
  );
}

function ProfileOnTheWay({ navigate }) {
  const active = [
    { id: 'TR-1041', route: 'TYO → SF', date: 'Departing May 14', orderId: 'HD-2847', items: 1, escrow: 280, status: 'Confirmed' },
  ];
  if (active.length === 0) {
    return <HEmpty icon="✦" title="Nothing in flight" body="Post a trip and buyers will be able to claim slots ahead of your departure." action={<Link to="/post-trip" className="h-btn h-btn-primary h-btn-sm">+ Post a trip</Link>}/>;
  }
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      {active.map(t => (
        <div key={t.id} className="h-card" style={{ padding: 28 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24, marginBottom: 20 }}>
            <div>
              <span className="h-chip h-chip-green" style={{ fontSize: 10 }}>{t.status}</span>
              <h4 className="h-serif" style={{ fontSize: 24, margin: '12px 0 4px', letterSpacing: '-0.018em' }}>{t.route}</h4>
              <div className="h-mono" style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: '.06em' }}>{t.id} · {t.date}</div>
            </div>
            <button onClick={() => navigate(`/orders/${t.orderId}`)} className="h-btn h-btn-primary h-btn-sm">Track →</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, paddingTop: 20, borderTop: '1px solid var(--line)' }}>
            <div>
              <div className="h-mono" style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: '.1em' }}>BUYER</div>
              <div style={{ fontSize: 14, marginTop: 4 }}>James L.</div>
            </div>
            <div>
              <div className="h-mono" style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: '.1em' }}>ORDER</div>
              <div style={{ fontSize: 14, marginTop: 4 }}>{t.orderId}</div>
            </div>
            <div>
              <div className="h-mono" style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: '.1em' }}>ESCROW HELD</div>
              <div className="h-serif" style={{ fontSize: 18, marginTop: 4 }}>${t.escrow}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ProfileFollowing({ carriers, navigate }) {
  if (carriers.size === 0) {
    return <HEmpty
      icon="✦"
      title="You're not following anyone yet"
      body="Tap Follow on a carrier you've had a great experience with — you'll see their next trip first."
      action={<Link to="/browse" className="h-btn h-btn-primary h-btn-sm">Browse carriers →</Link>}
    />;
  }
  // Pull a sample carrier's stats from HD.carriers when available; fall back
  // to neutral defaults so an unknown name still renders.
  const carrierMeta = (name) => HD.carriers?.[name] || { availability: 'Schedule unknown', avgResponseTime: '—', completedTrips: 0 };
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      {[...carriers].map(name => {
        const meta = carrierMeta(name);
        return (
          <div key={name} className="h-card" style={{ padding: 20, display: 'grid', gridTemplateColumns: 'auto 1fr auto auto', alignItems: 'center', gap: 20 }}>
            <HAvatar name={name} size={48}/>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontWeight: 500, fontSize: 15 }}>{name}</span>
                {meta.idVerified && <HVerified size={12}/>}
              </div>
              <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 4 }}>{meta.availability} · Replies {meta.avgResponseTime}</div>
            </div>
            <button onClick={() => navigate(`/messages?with=${encodeURIComponent(name)}`)} className="h-btn h-btn-ghost h-btn-sm">Message</button>
            <HFollowButton name={name} size="sm"/>
          </div>
        );
      })}
    </div>
  );
}

function ProfileFollowers({ followers, navigate }) {
  if (!followers || followers.length === 0) {
    return <HEmpty
      icon="✦"
      title="No followers yet"
      body="Once buyers tap Follow on your carrier dossier, they'll show up here. They get a heads-up the next time you post a trip."
      action={<Link to="/post-trip" className="h-btn h-btn-primary h-btn-sm">Post a trip →</Link>}
    />;
  }
  const fmt = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <div className="h-mono" style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: '.14em', textTransform: 'uppercase', marginBottom: 4 }}>
        {followers.length} {followers.length === 1 ? 'person follows' : 'people follow'} you · most recent first
      </div>
      {followers.map(f => (
        <div key={f.name} className="h-card" style={{ padding: 20, display: 'grid', gridTemplateColumns: 'auto 1fr auto', alignItems: 'center', gap: 20 }}>
          <HAvatar name={f.name} size={48}/>
          <div style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontWeight: 500, fontSize: 15 }}>{f.name}</span>
              <span style={{ fontSize: 11, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '.08em', padding: '2px 8px', border: '1px solid var(--line-2)', borderRadius: 999 }}>
                {f.role === 'carrier' ? 'Carrier' : 'Buyer'}
              </span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 4 }}>
              {f.city}
              {f.role === 'buyer' && typeof f.orders === 'number' && (<> · {f.orders} {f.orders === 1 ? 'order' : 'orders'} with you</>)}
              <> · Followed {fmt(f.followedAt)}</>
            </div>
          </div>
          <button onClick={() => navigate(`/messages?with=${encodeURIComponent(f.name)}`)} className="h-btn h-btn-ghost h-btn-sm">Message</button>
        </div>
      ))}
    </div>
  );
}

export function PageSettings() {
  const navigate = useNavigate();
  const [section, setSection] = useState(0);
  const sections = ['Account', 'Notifications', 'Privacy', 'Payment', 'Carrier prefs', 'Language', 'Danger zone'];
  return (
    <div className="h-app" style={{ width: '100%', minHeight: 1100 }}>
      <HAppNav active="" role="buyer"/>
      <section style={{ padding: '40px 32px 100px', maxWidth: 1280, margin: '0 auto' }}>
        <div className="h-eyebrow">Settings</div>
        <h1 className="h-display" style={{ fontSize: 40, margin: '8px 0 32px', lineHeight: 1.04 }}>{sections[section]}.</h1>

        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 48 }}>
          <aside>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2, position: 'sticky', top: 32 }}>
              {sections.map((s, i) => (
                <button key={s} onClick={() => setSection(i)} style={{
                  textAlign: 'left', padding: '10px 12px', borderRadius: 8, border: 'none',
                  background: i === section ? 'var(--paper-2)' : 'transparent', color: i === section ? 'var(--ink)' : (s === 'Danger zone' ? 'var(--rouge)' : 'var(--ink-2)'),
                  fontWeight: i === section ? 500 : 400, fontSize: 14, cursor: 'pointer',
                  fontFamily: 'inherit',
                }}>{s}</button>
              ))}
            </div>
          </aside>

          <div key={section} style={{ animation: 'h-fade-up .3s var(--ease-out) both' }}>
            {section === 0 && <SettingsAccount/>}
            {section === 1 && <SettingsNotifications/>}
            {section === 2 && <SettingsPrivacy/>}
            {section === 3 && <SettingsPayment navigate={navigate}/>}
            {section === 4 && <SettingsCarrierPrefs/>}
            {section === 5 && <SettingsLanguage/>}
            {section === 6 && <SettingsDanger navigate={navigate}/>}
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── Account ───────────────────────────────────────────
function SettingsAccount() {
  const [name, setName] = useState('Yuki Mori');
  const [city, setCity] = useState('San Francisco');
  const [email, setEmail] = useState('yuki@handi.com');
  const [phone, setPhone] = useState('+1 415 555 0143');
  const [bio, setBio] = useState('SF-based product designer. Monthly Tokyo runs. I specialize in Japanese stationery, anime collectibles, and Pokémon Center exclusives.');
  const [savedAt, setSavedAt] = useState(null);

  const save = () => {
    setSavedAt(Date.now());
    setTimeout(() => setSavedAt(null), 2400);
  };

  return (
    <div className="h-card" style={{ padding: 32 }}>
      <h3 className="h-serif" style={{ fontSize: 24, margin: 0, letterSpacing: '-0.02em' }}>Profile</h3>
      <p style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 4 }}>How others see you on handi.</p>
      <hr className="h-divider" style={{ margin: '24px 0' }}/>

      <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 1fr', gap: 24, alignItems: 'center' }}>
        <HAvatar name={name} size={96}/>
        <SettingsField label="FULL NAME"><input className="h-input" value={name} onChange={(e) => setName(e.target.value)}/></SettingsField>
        <SettingsField label="HOME CITY"><input className="h-input" value={city} onChange={(e) => setCity(e.target.value)}/></SettingsField>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 24 }}>
        <SettingsField label="EMAIL"><input className="h-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)}/></SettingsField>
        <SettingsField label="PHONE"><input className="h-input" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}/></SettingsField>
      </div>

      <div style={{ marginTop: 24 }}>
        <SettingsField label="BIO">
          <textarea className="h-input" rows="3" style={{ resize: 'vertical' }} value={bio} onChange={(e) => setBio(e.target.value)}/>
        </SettingsField>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 28, paddingTop: 24, borderTop: '1px solid var(--line)' }}>
        <button onClick={save} className="h-btn h-btn-primary">Save changes</button>
        {savedAt && <span style={{ fontSize: 13, color: 'var(--green)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 13l4 4L19 7"/></svg>
          Saved
        </span>}
      </div>
    </div>
  );
}

// ─── Notifications ─────────────────────────────────────
function SettingsNotifications() {
  // [category, sub, defaults: {email, push, sms}]
  const rows = [
    { key: 'orders',    t: 'Order updates',           d: 'Status changes, receipts, hand-offs',     def: { email: true,  push: true,  sms: true  } },
    { key: 'requests',  t: 'New requests on my routes', d: 'When buyers post on Tokyo ↔ SF',         def: { email: true,  push: true,  sms: false } },
    { key: 'messages',  t: 'Messages',                d: 'New chat from carriers / buyers',         def: { email: false, push: true,  sms: false } },
    { key: 'payouts',   t: 'Payouts & wallet',        d: 'Withdrawals, escrow releases, refunds',   def: { email: true,  push: true,  sms: false } },
    { key: 'marketing', t: 'Marketing & promos',      d: 'Top carrier bonuses, seasonal events',    def: { email: false, push: false, sms: false } },
  ];

  return (
    <div className="h-card" style={{ padding: 32 }}>
      <h3 className="h-serif" style={{ fontSize: 24, margin: 0, letterSpacing: '-0.02em' }}>Notifications</h3>
      <p style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 4 }}>Choose which channel each kind of update uses.</p>
      <hr className="h-divider" style={{ margin: '24px 0' }}/>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 80px 80px', alignItems: 'center', gap: 0, paddingBottom: 12, borderBottom: '1px solid var(--line)' }}>
        <span/>
        {['EMAIL', 'PUSH', 'SMS'].map(c => (
          <span key={c} className="h-mono" style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: '.14em', textAlign: 'center' }}>{c}</span>
        ))}
      </div>

      {rows.map(r => (
        <div key={r.key} style={{ display: 'grid', gridTemplateColumns: '1fr 80px 80px 80px', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid var(--line)' }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 500 }}>{r.t}</div>
            <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>{r.d}</div>
          </div>
          <div style={{ textAlign: 'center' }}><Toggle on={r.def.email}/></div>
          <div style={{ textAlign: 'center' }}><Toggle on={r.def.push}/></div>
          <div style={{ textAlign: 'center' }}><Toggle on={r.def.sms}/></div>
        </div>
      ))}
    </div>
  );
}

// ─── Privacy ───────────────────────────────────────────
function SettingsPrivacy() {
  const [visibility, setVisibility]      = useState('public'); // public | carriers | private
  const [showLastSeen, setShowLastSeen]  = useState(true);
  const [showHistory, setShowHistory]    = useState(true);
  const [allowUnverified, setAllowUnv]   = useState(false);

  return (
    <>
      <div className="h-card" style={{ padding: 32 }}>
        <h3 className="h-serif" style={{ fontSize: 24, margin: 0, letterSpacing: '-0.02em' }}>Profile visibility</h3>
        <p style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 4 }}>Who can see your profile, ratings, and route history.</p>
        <hr className="h-divider" style={{ margin: '24px 0' }}/>
        <div style={{ display: 'grid', gap: 10 }}>
          {[
            { v: 'public',   t: 'Public',         d: 'Anyone on handi can find your profile.' },
            { v: 'carriers', t: 'Carriers only',  d: 'Only verified carriers heading your routes can see you.' },
            { v: 'private',  t: 'Private',        d: 'Only you. You can still post requests; carriers see name + city only.' },
          ].map(o => {
            const on = visibility === o.v;
            return (
              <label key={o.v} style={{
                display: 'flex', alignItems: 'flex-start', gap: 14, padding: 16, borderRadius: 12,
                border: `1.5px solid ${on ? 'var(--ink)' : 'var(--line)'}`,
                background: on ? 'var(--paper-2)' : 'transparent', cursor: 'pointer',
                transition: 'all .2s var(--ease-out)',
              }}>
                <input type="radio" name="visibility" checked={on} onChange={() => setVisibility(o.v)} style={{ accentColor: 'var(--ink)', marginTop: 3 }}/>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{o.t}</div>
                  <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>{o.d}</div>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      <div className="h-card" style={{ padding: 32, marginTop: 24 }}>
        <h3 className="h-serif" style={{ fontSize: 24, margin: 0, letterSpacing: '-0.02em' }}>Activity</h3>
        <hr className="h-divider" style={{ margin: '24px 0' }}/>
        <SettingsRow t="Show last seen"             d="Lets others know when you were online." on={showLastSeen} setOn={setShowLastSeen}/>
        <SettingsRow t="Show route history"         d="Past trips visible on your public profile." on={showHistory} setOn={setShowHistory}/>
        <SettingsRow t="Allow unverified contacts"  d="Buyers without ID verification can still message you." on={allowUnverified} setOn={setAllowUnv} last/>
      </div>

      <div className="h-card" style={{ padding: 32, marginTop: 24 }}>
        <h3 className="h-serif" style={{ fontSize: 24, margin: 0, letterSpacing: '-0.02em' }}>Blocked users</h3>
        <hr className="h-divider" style={{ margin: '24px 0' }}/>
        <HEmpty icon="✓" title="No blocked users" body="Block someone from a chat or their profile. They won't be able to message you or claim your slots." action={<button className="h-btn h-btn-ghost h-btn-sm" onClick={() => toast('Block list management coming soon')}>Manage</button>}/>
      </div>
    </>
  );
}

// ─── Payment ───────────────────────────────────────────
function SettingsPayment({ navigate }) {
  return (
    <>
      <div className="h-card" style={{ padding: 32 }}>
        <h3 className="h-serif" style={{ fontSize: 24, margin: 0, letterSpacing: '-0.02em' }}>Payment methods</h3>
        <p style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 4 }}>Used when you place an order or subscribe to handi+.</p>
        <hr className="h-divider" style={{ margin: '24px 0' }}/>

        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto auto', alignItems: 'center', gap: 16, padding: 18, background: 'var(--paper-2)', borderRadius: 12 }}>
          <div style={{ width: 44, height: 30, background: 'var(--ink)', color: 'var(--paper)', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontFamily: 'var(--font-mono)', letterSpacing: '.06em' }}>VISA</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 500 }}>Visa •••• 4242</div>
            <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>Expires 12/27 · Default</div>
          </div>
          <button onClick={() => toast('Card editing — wiring up post-launch')} className="h-btn h-btn-ghost h-btn-sm">Edit</button>
          <button onClick={() => toast('Card removal — wiring up post-launch')} className="h-btn h-btn-ghost h-btn-sm" style={{ color: 'var(--rouge-deep)' }}>Remove</button>
        </div>

        <button onClick={() => toast('Adding cards — wiring up post-launch')} className="h-btn h-btn-ghost" style={{ marginTop: 16, width: '100%' }}>
          + Add payment method
        </button>
      </div>

      <div className="h-card" style={{ padding: 32, marginTop: 24 }}>
        <h3 className="h-serif" style={{ fontSize: 24, margin: 0, letterSpacing: '-0.02em' }}>Default payout</h3>
        <p style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 4 }}>Where your carrier earnings settle.</p>
        <hr className="h-divider" style={{ margin: '24px 0' }}/>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', gap: 16, padding: 18, background: 'var(--paper-2)', borderRadius: 12 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 500 }}>Chase Bank</div>
            <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>•••• 3491 · ACH · 1–2 business days</div>
          </div>
          <button onClick={() => toast('Payout changes — wiring up post-launch')} className="h-btn h-btn-ghost h-btn-sm">Change</button>
        </div>

        <button onClick={() => navigate('/wallet')} style={{ display: 'block', marginTop: 16, fontSize: 13, color: 'var(--ink-2)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>View payout history →</button>
      </div>

      <div className="h-card" style={{ padding: 32, marginTop: 24 }}>
        <h3 className="h-serif" style={{ fontSize: 24, margin: 0, letterSpacing: '-0.02em' }}>Billing address</h3>
        <hr className="h-divider" style={{ margin: '24px 0' }}/>
        <div style={{ fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.6 }}>
          Yuki Mori<br/>
          123 Market St, Apt 8B<br/>
          San Francisco, CA 94103<br/>
          United States
        </div>
        <button onClick={() => toast('Billing edit — wiring up post-launch')} className="h-btn h-btn-ghost h-btn-sm" style={{ marginTop: 16 }}>Edit</button>
      </div>
    </>
  );
}

// ─── Carrier prefs ─────────────────────────────────────
function SettingsCarrierPrefs() {
  const allCats = ['Fashion', 'Beauty', 'Stationery', 'Electronics', 'Collectibles', 'Food', 'Other'];
  const [cats, setCats]                 = useState(new Set(['Fashion', 'Stationery', 'Collectibles']));
  const [maxValue, setMaxValue]         = useState('500');
  const [methods, setMethods]           = useState({ meetup: true, doorstep: true, pickup: false });
  const [autoAccept, setAutoAccept]     = useState(false);
  const [autoThreshold, setAutoThresh]  = useState('100');

  const toggleCat = (c) => setCats(prev => {
    const n = new Set(prev); n.has(c) ? n.delete(c) : n.add(c); return n;
  });

  return (
    <>
      <div className="h-card" style={{ padding: 32 }}>
        <h3 className="h-serif" style={{ fontSize: 24, margin: 0, letterSpacing: '-0.02em' }}>What you'll carry</h3>
        <p style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 4 }}>Buyers see these on your profile and when they post a request.</p>
        <hr className="h-divider" style={{ margin: '24px 0' }}/>

        <SettingsField label="CATEGORIES">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
            {allCats.map(c => {
              const on = cats.has(c);
              return (
                <button key={c} type="button" onClick={() => toggleCat(c)} style={{
                  padding: '8px 14px', borderRadius: 999, fontSize: 13, fontFamily: 'inherit', cursor: 'pointer',
                  border: '1px solid', borderColor: on ? 'var(--ink)' : 'var(--line-2)',
                  background: on ? 'var(--ink)' : 'var(--paper)',
                  color: on ? 'var(--paper)' : 'var(--ink-2)',
                  transition: 'all .2s var(--ease-out)',
                }}>{c}</button>
              );
            })}
          </div>
        </SettingsField>

        <div style={{ marginTop: 24, maxWidth: 280 }}>
          <SettingsField label="MAX DECLARED VALUE PER SLOT (USD)">
            <input className="h-input" inputMode="numeric" value={maxValue} onChange={(e) => setMaxValue(e.target.value.replace(/[^0-9]/g, ''))}/>
          </SettingsField>
        </div>
      </div>

      <div className="h-card" style={{ padding: 32, marginTop: 24 }}>
        <h3 className="h-serif" style={{ fontSize: 24, margin: 0, letterSpacing: '-0.02em' }}>Hand-off methods</h3>
        <p style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 4 }}>Buyers pick from these at checkout.</p>
        <hr className="h-divider" style={{ margin: '24px 0' }}/>
        <SettingsRow t="Meetup"   d="Coffee shop, train station, or somewhere public." on={methods.meetup}   setOn={(v) => setMethods(p => ({ ...p, meetup: v }))}/>
        <SettingsRow t="Doorstep" d="You drop off at the buyer's address." on={methods.doorstep} setOn={(v) => setMethods(p => ({ ...p, doorstep: v }))}/>
        <SettingsRow t="Pickup"   d="Buyer comes to a fixed address you provide." on={methods.pickup}  setOn={(v) => setMethods(p => ({ ...p, pickup: v }))} last/>
      </div>

      <div className="h-card" style={{ padding: 32, marginTop: 24 }}>
        <h3 className="h-serif" style={{ fontSize: 24, margin: 0, letterSpacing: '-0.02em' }}>Auto-accept</h3>
        <p style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 4 }}>Skip the manual review for small, low-risk orders.</p>
        <hr className="h-divider" style={{ margin: '24px 0' }}/>
        <SettingsRow t="Enable auto-accept" d="Automatically accept orders that match the rules below." on={autoAccept} setOn={setAutoAccept}/>
        <div style={{ marginTop: 20, maxWidth: 280, opacity: autoAccept ? 1 : 0.4, pointerEvents: autoAccept ? 'auto' : 'none' }}>
          <SettingsField label="ONLY IF UNDER (USD)">
            <input className="h-input" inputMode="numeric" value={autoThreshold} onChange={(e) => setAutoThresh(e.target.value.replace(/[^0-9]/g, ''))}/>
          </SettingsField>
        </div>
      </div>
    </>
  );
}

// ─── Language ──────────────────────────────────────────
function SettingsLanguage() {
  const [lang, setLang]       = useState('en');
  const [currency, setCur]    = useState('USD');
  const [dateFmt, setDateFmt] = useState('MM/DD/YYYY');
  const [units, setUnits]     = useState('mi');

  return (
    <div className="h-card" style={{ padding: 32 }}>
      <h3 className="h-serif" style={{ fontSize: 24, margin: 0, letterSpacing: '-0.02em' }}>Language & region</h3>
      <p style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 4 }}>Display preferences only — orders themselves are always in the carrier's local currency.</p>
      <hr className="h-divider" style={{ margin: '24px 0' }}/>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <SettingsField label="UI LANGUAGE">
          <select className="h-input" value={lang} onChange={(e) => setLang(e.target.value)}>
            <option value="en">English</option>
            <option value="zh-Hant">繁體中文</option>
            <option value="ja">日本語</option>
            <option value="ko">한국어</option>
            <option value="fr">Français</option>
          </select>
        </SettingsField>
        <SettingsField label="CURRENCY DISPLAY">
          <select className="h-input" value={currency} onChange={(e) => setCur(e.target.value)}>
            <option value="USD">USD — US Dollar</option>
            <option value="EUR">EUR — Euro</option>
            <option value="GBP">GBP — British Pound</option>
            <option value="JPY">JPY — Japanese Yen</option>
            <option value="KRW">KRW — Korean Won</option>
          </select>
        </SettingsField>
      </div>

      <div style={{ marginTop: 28 }}>
        <span className="h-mono" style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: '.1em', display: 'block', marginBottom: 10 }}>DATE FORMAT</span>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'].map(f => (
            <button key={f} type="button" onClick={() => setDateFmt(f)} style={{
              padding: '10px 16px', borderRadius: 999, fontSize: 13, fontFamily: 'var(--font-mono)', cursor: 'pointer',
              border: '1px solid', borderColor: dateFmt === f ? 'var(--ink)' : 'var(--line-2)',
              background: dateFmt === f ? 'var(--ink)' : 'transparent',
              color: dateFmt === f ? 'var(--paper)' : 'var(--ink-2)',
              letterSpacing: '.05em',
            }}>{f}</button>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 28 }}>
        <span className="h-mono" style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: '.1em', display: 'block', marginBottom: 10 }}>DISTANCE UNITS</span>
        <div style={{ display: 'flex', gap: 8 }}>
          {[['mi', 'Miles'], ['km', 'Kilometers']].map(([v, t]) => (
            <button key={v} type="button" onClick={() => setUnits(v)} style={{
              padding: '10px 20px', borderRadius: 999, fontSize: 13, fontFamily: 'inherit', cursor: 'pointer',
              border: '1px solid', borderColor: units === v ? 'var(--ink)' : 'var(--line-2)',
              background: units === v ? 'var(--ink)' : 'transparent',
              color: units === v ? 'var(--paper)' : 'var(--ink-2)',
            }}>{t}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Danger zone ───────────────────────────────────────
function SettingsDanger({ navigate }) {
  const [confirmText, setConfirmText] = useState('');
  const canDelete = confirmText.trim() === 'DELETE';

  const onDelete = () => {
    if (!canDelete) return;
    if (window.confirm('This will permanently delete your account. You can\'t undo this. Continue? (demo)')) {
      navigate('/');
    }
  };

  return (
    <>
      <div className="h-card" style={{ padding: 32, borderColor: 'rgba(139,30,45,.2)' }}>
        <h3 className="h-serif" style={{ fontSize: 24, margin: 0, letterSpacing: '-0.02em', color: 'var(--rouge-deep)' }}>Pause account</h3>
        <p style={{ fontSize: 13, color: 'var(--ink-2)', marginTop: 8, lineHeight: 1.55 }}>Hide your profile, freeze new requests, and stop notifications. Active orders stay open until they settle.</p>
        <button
          onClick={() => { if (window.confirm('Pause your account now? You can re-activate any time.')) toast("Account paused · we'll email a confirmation", { kind: 'success' }); }}
          className="h-btn h-btn-ghost"
          style={{ marginTop: 16, borderColor: 'rgba(139,30,45,.3)', color: 'var(--rouge-deep)' }}
        >
          Pause account
        </button>
      </div>

      <div className="h-card" style={{ padding: 32, marginTop: 24, borderColor: 'rgba(139,30,45,.2)' }}>
        <h3 className="h-serif" style={{ fontSize: 24, margin: 0, letterSpacing: '-0.02em', color: 'var(--rouge-deep)' }}>Delete account</h3>
        <p style={{ fontSize: 13, color: 'var(--ink-2)', marginTop: 8, lineHeight: 1.55 }}>This permanently removes your profile, listings, and message history. Active orders must be settled first. To proceed, type <strong style={{ fontFamily: 'var(--font-mono)' }}>DELETE</strong> below.</p>

        <div style={{ marginTop: 16, maxWidth: 320 }}>
          <input
            className="h-input"
            placeholder="Type DELETE to confirm"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            style={{ fontFamily: 'var(--font-mono)', letterSpacing: '.06em' }}
          />
        </div>

        <button
          onClick={onDelete}
          disabled={!canDelete}
          className="h-btn"
          style={{
            marginTop: 16, background: canDelete ? 'var(--rouge)' : 'transparent',
            color: canDelete ? 'var(--paper)' : 'var(--rouge-deep)',
            border: '1px solid', borderColor: canDelete ? 'var(--rouge)' : 'rgba(139,30,45,.3)',
            cursor: canDelete ? 'pointer' : 'not-allowed', opacity: canDelete ? 1 : 0.6,
          }}
        >
          Delete account permanently
        </button>
      </div>
    </>
  );
}

// ─── Shared bits ───────────────────────────────────────
function SettingsField({ label, children }) {
  return (
    <label style={{ display: 'block' }}>
      <span className="h-mono" style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: '.1em', display: 'block', marginBottom: 8 }}>{label}</span>
      {children}
    </label>
  );
}

function SettingsRow({ t, d, on, setOn, last }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: last ? 'none' : '1px solid var(--line)' }}>
      <div>
        <div style={{ fontSize: 14, fontWeight: 500 }}>{t}</div>
        <div style={{ fontSize: 12, color: 'var(--ink-3)', maxWidth: 480 }}>{d}</div>
      </div>
      <Toggle on={on} onChange={setOn}/>
    </div>
  );
}

export function Toggle({ on: controlled, onChange }) {
  // Controlled when onChange is supplied; otherwise self-managed (legacy uses).
  const [local, setLocal] = useState(!!controlled);
  const isControlled = typeof onChange === 'function';
  const on = isControlled ? !!controlled : local;
  const flip = () => {
    if (isControlled) onChange(!on);
    else setLocal(v => !v);
  };
  return (
    <span onClick={flip} style={{
      width: 36, height: 20, borderRadius: 999, background: on ? 'var(--ink)' : 'var(--paper-3)',
      padding: 2, display: 'inline-flex', cursor: 'pointer', transition: 'background .2s',
    }}>
      <span style={{
        width: 16, height: 16, borderRadius: 999, background: 'var(--paper)',
        transform: on ? 'translateX(16px)' : 'translateX(0)', transition: 'transform .2s', boxShadow: '0 1px 2px rgba(0,0,0,.15)',
      }}/>
    </span>
  );
}

const PLAN_KEY = 'handi_current_plan';

export function PageMembership() {
  // Persist current plan across sessions so the UI feels stateful.
  const [currentPlan, setCurrentPlan] = useState(() => {
    try { return window.localStorage.getItem(PLAN_KEY) || 'Casual'; } catch { return 'Casual'; }
  });
  const [billing, setBilling] = useState('monthly'); // monthly | annual
  const [savedAt, setSavedAt] = useState(null);

  const choose = (name) => {
    setCurrentPlan(name);
    try { window.localStorage.setItem(PLAN_KEY, name); } catch {}
    setSavedAt(Date.now());
    setTimeout(() => setSavedAt(null), 2400);
  };

  const annualMul = 12 * 0.8; // 20% off when paid annually
  const plans = [
    { name: 'Casual',    monthly: 0,  tone: 'paper', features: ['Browse all carriers', 'Standard buyer protection', 'Pay carry fees per order', 'Email support'] },
    { name: 'handi+',    monthly: 9,  tone: 'noir', best: true, features: ['3 free carry fees / month', 'Priority carrier matching', '24h dispute resolution', '$5 referral credit', 'Early access to new cities'] },
    { name: 'Concierge', monthly: 49, tone: 'rouge', features: ['Unlimited free carry fees', 'Dedicated personal carrier', 'Same-day NYC/SF/LA carry', 'Custom sourcing requests', 'Phone support'] },
  ];

  const priceFor = (p) => {
    if (p.monthly === 0) return { big: '$0', sub: 'forever' };
    if (billing === 'monthly') return { big: `$${p.monthly}`, sub: '/month' };
    const annual = Math.round(p.monthly * annualMul);
    return { big: `$${annual}`, sub: '/year' };
  };

  return (
    <div className="h-app" style={{ width: '100%', minHeight: 1100 }}>
      <HAppNav active="" role="buyer"/>
      <section style={{ padding: '80px 32px 40px', maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
        <div className="h-eyebrow">handi+ Membership</div>
        <h1 className="h-display" style={{ fontSize: 88, margin: '16px 0 0', lineHeight: 1 }}>Carry more. <span style={{ fontStyle: 'italic', color: 'var(--rouge)' }}>Pay less.</span></h1>
        <p style={{ fontSize: 17, color: 'var(--ink-2)', maxWidth: 560, margin: '24px auto 0', lineHeight: 1.55 }}>
          Skip carry fees on your first 3 orders each month, get priority carrier matching, and double-up rewards. Cancel anytime.
        </p>

        {/* Billing toggle */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 32, padding: 4, borderRadius: 999, background: 'var(--paper-2)', border: '1px solid var(--line)' }}>
          {[
            { v: 'monthly', t: 'Monthly' },
            { v: 'annual',  t: 'Annual', tag: '−20%' },
          ].map(o => {
            const on = billing === o.v;
            return (
              <button
                key={o.v}
                onClick={() => setBilling(o.v)}
                style={{
                  padding: '8px 18px', borderRadius: 999, border: 'none', cursor: 'pointer',
                  background: on ? 'var(--ink)' : 'transparent',
                  color: on ? 'var(--paper)' : 'var(--ink-2)',
                  fontSize: 13, fontFamily: 'inherit', fontWeight: on ? 500 : 400,
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  transition: 'all .2s var(--ease-out)',
                }}
              >
                {o.t}
                {o.tag && <span style={{
                  fontSize: 10, fontFamily: 'var(--font-mono)', letterSpacing: '.06em',
                  padding: '2px 6px', borderRadius: 4,
                  background: on ? 'var(--rouge)' : 'var(--rouge-soft)',
                  color: on ? 'var(--paper)' : 'var(--rouge-deep)',
                }}>{o.tag}</span>}
              </button>
            );
          })}
        </div>

        {savedAt && (
          <div style={{ marginTop: 20, fontSize: 13, color: 'var(--green)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 13l4 4L19 7"/></svg>
            Plan updated · Manage in settings
          </div>
        )}
      </section>

      <section style={{ padding: '40px 32px 100px', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {plans.map(p => {
            const { big, sub } = priceFor(p);
            const isCurrent = currentPlan === p.name;
            const ctaLabel = isCurrent
              ? (p.name === 'Casual' ? 'Stay on Casual' : 'Current plan ✓')
              : (currentPlan === 'Casual' ? `Choose ${p.name}` : `Switch to ${p.name}`);
            return (
              <div key={p.name} style={{
                padding: 32, borderRadius: 'var(--r-lg)',
                background: p.tone === 'noir' ? 'var(--noir)' : p.tone === 'rouge' ? 'var(--rouge)' : 'var(--paper)',
                color: p.tone === 'paper' ? 'var(--ink)' : 'var(--paper)',
                border: p.tone === 'paper' ? '1px solid var(--line)' : 'none',
                position: 'relative',
                transform: p.best ? 'scale(1.02)' : 'none',
              }}>
                {p.best && !isCurrent && <div style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', background: 'var(--rouge)', color: 'white', fontSize: 10, fontFamily: 'var(--font-mono)', letterSpacing: '.12em', padding: '4px 12px', borderRadius: 999 }}>MOST POPULAR</div>}
                {isCurrent && <div style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', background: 'var(--rouge)', color: 'white', fontSize: 10, fontFamily: 'var(--font-mono)', letterSpacing: '.12em', padding: '4px 12px', borderRadius: 999 }}>CURRENT</div>}
                <div className="h-mono" style={{ fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', opacity: .7 }}>{p.name}</div>
                <div style={{ marginTop: 16, display: 'flex', alignItems: 'baseline', gap: 4 }}>
                  <span className="h-display" style={{ fontSize: 64, color: 'inherit' }}>{big}</span>
                  <span style={{ fontSize: 14, opacity: .7 }}>{sub}</span>
                </div>
                {billing === 'annual' && p.monthly > 0 && (
                  <div style={{ fontSize: 12, opacity: .65, marginTop: 4 }}>
                    Save ${Math.round(p.monthly * 12 - p.monthly * annualMul)} / year
                  </div>
                )}
                <button
                  onClick={() => choose(p.name)}
                  disabled={isCurrent}
                  className="h-btn"
                  style={{
                    width: '100%', marginTop: 24,
                    background: p.tone === 'paper' ? 'var(--ink)' : 'var(--paper)',
                    color: p.tone === 'paper' ? 'var(--paper)' : 'var(--ink)',
                    opacity: isCurrent ? 0.7 : 1,
                    cursor: isCurrent ? 'default' : 'pointer',
                  }}
                >{ctaLabel}</button>
                <hr style={{ border: 'none', borderTop: `1px solid ${p.tone === 'paper' ? 'var(--line)' : 'rgba(255,255,255,.15)'}`, margin: '24px 0' }}/>
                <div style={{ display: 'grid', gap: 12 }}>
                  {p.features.map(f => (
                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 13l4 4L19 7"/></svg>
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {currentPlan !== 'Casual' && (
          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <button
              onClick={() => { if (window.confirm(`Cancel ${currentPlan} and downgrade to Casual?`)) choose('Casual'); }}
              style={{ background: 'none', border: 'none', color: 'var(--ink-3)', textDecoration: 'underline', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit' }}
            >
              Cancel subscription
            </button>
          </div>
        )}
      </section>
    </div>
  );
}




