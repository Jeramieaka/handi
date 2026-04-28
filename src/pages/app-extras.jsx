import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HD } from '../data/sample';
import { HAvatar, HStars, HVerified } from '../components/primitives';
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
  const [activeIdx, setActiveIdx] = useState(0);
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
            <button onClick={() => alert('Voice call — demo only.')} style={iconBtn} title="Call">
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
            {!thread.completed && <button onClick={() => alert('Hand-off scheduled — demo only.')} style={pinAct}>Schedule hand-off</button>}
            {!thread.completed && !thread.dispute && <button onClick={() => { alert('Receipt confirmed — funds released to carrier (demo).'); navigate('/wallet'); }} style={{ ...pinAct, background: 'var(--ink)', color: 'var(--paper)', borderColor: 'var(--ink)' }}>Confirm receipt</button>}
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
            <button type="button" onClick={() => alert('Attachment picker — demo only.')} style={iconBtn} title="Attach">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
            </button>
            <button type="button" onClick={() => alert('Emoji picker — demo only.')} style={iconBtn} title="Emoji">😊</button>
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
    { t: 'Carry payout · TYO → NYC', d: '+$280.00', at: 'May 1', tone: 'green', sub: 'Order #HD-2841 released' },
    { t: 'Carry payout · NYC → TYO', d: '+$310.00', at: 'Apr 22', tone: 'green', sub: '4 items delivered' },
    { t: 'Withdrawal to Chase ····3491', d: '−$500.00', at: 'Apr 18', tone: 'ink', sub: 'ACH · 1–2 business days' },
    { t: 'Carry payout · SF → SEL', d: '+$420.00', at: 'Apr 4', tone: 'green', sub: 'Order #HD-2701 released' },
    { t: 'Promo · Top Carrier bonus', d: '+$25.00', at: 'Apr 1', tone: 'rouge', sub: 'March milestone' },
    { t: 'Refund issued · damaged item', d: '−$108.00', at: 'Mar 28', tone: 'ink', sub: 'Dispute #DS-4421' },
  ];

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
            <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
              <button onClick={() => alert(`Withdrawing $${u.walletAvailable} to Chase ····3491. ETA 1–2 business days. (demo)`)} className="h-btn h-btn-rouge">Withdraw to bank →</button>
              <button onClick={() => navigate('/settings')} className="h-btn h-btn-ghost" style={{ borderColor: 'rgba(250,248,244,.2)', color: 'var(--paper)' }}>Add payout method</button>
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
              {txs.map((tx, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 16, alignItems: 'center', padding: '16px 0', borderBottom: i < txs.length-1 ? '1px solid var(--line)' : 'none' }}>
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
                <a onClick={(e) => { e.preventDefault(); alert('Downloading 2025 1099-K — demo only.'); }} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--line)', color: 'var(--ink-2)', cursor: 'pointer' }}>2025 1099-K <span>↓</span></a>
                <a onClick={(e) => { e.preventDefault(); alert('Downloading earnings statement — demo only.'); }} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--line)', color: 'var(--ink-2)', cursor: 'pointer' }}>Earnings statement <span>↓</span></a>
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
  const [profileTab, setProfileTab] = useState(0);
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
          <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid var(--line)', marginBottom: 24 }}>
            {['Reviews · 47', 'Past trips · 14', 'On the way · 1'].map((t, i) => (
              <button key={t} onClick={() => setProfileTab(i)} style={{
                padding: '12px 16px', border: 'none', background: 'transparent', fontSize: 14, cursor: 'pointer',
                color: i === profileTab ? 'var(--ink)' : 'var(--ink-3)', fontWeight: i === profileTab ? 500 : 400,
                borderBottom: i === profileTab ? '2px solid var(--ink)' : '2px solid transparent', marginBottom: -1
              }}>{t}</button>
            ))}
          </div>

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

          {/* Reviews */}
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
        </div>
      </section>
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
        <h1 className="h-display" style={{ fontSize: 40, margin: '8px 0 32px', lineHeight: 1.04 }}>Account.</h1>

        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 48 }}>
          <aside>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {sections.map((s, i) => (
                <button key={s} onClick={() => setSection(i)} style={{
                  textAlign: 'left', padding: '10px 12px', borderRadius: 8, border: 'none',
                  background: i === section ? 'var(--paper-2)' : 'transparent', color: i === section ? 'var(--ink)' : (s === 'Danger zone' ? 'var(--rouge)' : 'var(--ink-2)'),
                  fontWeight: i === section ? 500 : 400, fontSize: 14, cursor: 'pointer'
                }}>{s}</button>
              ))}
            </div>
          </aside>

          <div style={{ display: 'grid', gap: 24 }}>
            <div className="h-card" style={{ padding: 32 }}>
              <h3 className="h-serif" style={{ fontSize: 24, margin: 0, letterSpacing: '-0.02em' }}>Profile</h3>
              <p style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 4 }}>How others see you on handi.</p>
              <hr className="h-divider" style={{ margin: '24px 0' }}/>
              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 1fr', gap: 24, alignItems: 'center' }}>
                <HAvatar name="Yuki Mori" size={96}/>
                <div>
                  <label className="h-mono" style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: '.1em' }}>FULL NAME</label>
                  <input className="h-input" defaultValue="Yuki Mori" style={{ marginTop: 8 }}/>
                </div>
                <div>
                  <label className="h-mono" style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: '.1em' }}>HOME CITY</label>
                  <input className="h-input" defaultValue="San Francisco" style={{ marginTop: 8 }}/>
                </div>
              </div>
              <div style={{ marginTop: 24 }}>
                <label className="h-mono" style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: '.1em' }}>BIO</label>
                <textarea className="h-input" rows="3" style={{ marginTop: 8, resize: 'vertical' }} defaultValue="SF-based product designer. Monthly Tokyo runs. I specialize in Japanese stationery, anime collectibles, and Pokémon Center exclusives."/>
              </div>
            </div>

            <div className="h-card" style={{ padding: 32 }}>
              <h3 className="h-serif" style={{ fontSize: 24, margin: 0, letterSpacing: '-0.02em' }}>Notifications</h3>
              <hr className="h-divider" style={{ margin: '24px 0' }}/>
              {[
                ['Order updates', 'Status changes, receipts, hand-offs', true],
                ['New requests on my routes', 'When buyers post on Tokyo↔SF', true],
                ['Messages', 'New chat from carriers/buyers', true],
                ['Marketing & promos', 'Top carrier bonuses, seasonal events', false],
              ].map(([t, d, on]) => (
                <div key={t} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid var(--line)' }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>{t}</div>
                    <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>{d}</div>
                  </div>
                  <Toggle on={on}/>
                </div>
              ))}
            </div>

            <div className="h-card" style={{ padding: 32, borderColor: 'rgba(139,30,45,.2)' }}>
              <h3 className="h-serif" style={{ fontSize: 24, margin: 0, letterSpacing: '-0.02em', color: 'var(--rouge-deep)' }}>Danger zone</h3>
              <p style={{ fontSize: 13, color: 'var(--ink-2)', marginTop: 8 }}>These actions are permanent. Active orders must be settled first.</p>
              <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                <button onClick={() => alert('Account paused — demo only.')} className="h-btn h-btn-ghost" style={{ borderColor: 'rgba(139,30,45,.3)', color: 'var(--rouge-deep)' }}>Pause account</button>
                <button onClick={() => { if (confirm('This will delete your account. Are you sure? (demo)')) navigate('/'); }} className="h-btn h-btn-ghost" style={{ borderColor: 'rgba(139,30,45,.3)', color: 'var(--rouge-deep)' }}>Delete account</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export function Toggle({ on: initial }) {
  const [on, setOn] = useState(!!initial);
  return (
    <span onClick={() => setOn(v => !v)} style={{
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

export function PageMembership() {
  const [chosen, setChosen] = useState('Casual');
  return (
    <div className="h-app" style={{ width: '100%', minHeight: 1100 }}>
      <HAppNav active="" role="buyer"/>
      <section style={{ padding: '80px 32px 60px', maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
        <div className="h-eyebrow">handi+ Membership</div>
        <h1 className="h-display" style={{ fontSize: 88, margin: '16px 0 0', lineHeight: 1 }}>Carry more. <span style={{ fontStyle: 'italic', color: 'var(--rouge)' }}>Pay less.</span></h1>
        <p style={{ fontSize: 17, color: 'var(--ink-2)', maxWidth: 560, margin: '24px auto 0', lineHeight: 1.55 }}>
          Skip carry fees on your first 3 orders each month, get priority carrier matching, and double-up rewards. Cancel anytime.
        </p>
      </section>

      <section style={{ padding: '40px 32px 100px', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {[
            { name: 'Casual', price: '$0', sub: 'forever', tone: 'paper', features: ['Browse all carriers', 'Standard buyer protection', 'Pay carry fees per order', 'Email support'] },
            { name: 'handi+', price: '$9', sub: '/month', tone: 'noir', best: true, features: ['3 free carry fees / month', 'Priority carrier matching', '24h dispute resolution', '$5 referral credit', 'Early access to new cities'] },
            { name: 'Concierge', price: '$49', sub: '/month', tone: 'rouge', features: ['Unlimited free carry fees', 'Dedicated personal carrier', 'Same-day NYC/SF/LA carry', 'Custom sourcing requests', 'Phone support'] },
          ].map(p => (
            <div key={p.name} style={{
              padding: 32, borderRadius: 'var(--r-lg)',
              background: p.tone === 'noir' ? 'var(--noir)' : p.tone === 'rouge' ? 'var(--rouge)' : 'var(--paper)',
              color: p.tone === 'paper' ? 'var(--ink)' : 'var(--paper)',
              border: p.tone === 'paper' ? '1px solid var(--line)' : 'none',
              position: 'relative',
              transform: p.best ? 'scale(1.02)' : 'none',
            }}>
              {p.best && <div style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', background: 'var(--rouge)', color: 'white', fontSize: 10, fontFamily: 'var(--font-mono)', letterSpacing: '.12em', padding: '4px 12px', borderRadius: 999 }}>MOST POPULAR</div>}
              <div className="h-mono" style={{ fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', opacity: .7 }}>{p.name}</div>
              <div style={{ marginTop: 16, display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <span className="h-display" style={{ fontSize: 64, color: 'inherit' }}>{p.price}</span>
                <span style={{ fontSize: 14, opacity: .7 }}>{p.sub}</span>
              </div>
              <button onClick={() => setChosen(p.name)} className="h-btn" style={{
                width: '100%', marginTop: 24,
                background: p.tone === 'paper' ? 'var(--ink)' : 'var(--paper)',
                color: p.tone === 'paper' ? 'var(--paper)' : 'var(--ink)',
              }}>{chosen === p.name ? 'Current plan ✓' : `Choose ${p.name}`}</button>
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
          ))}
        </div>
      </section>
    </div>
  );
}




