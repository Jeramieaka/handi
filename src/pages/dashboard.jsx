import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HD } from '../data/sample';
import { HLogo, HAvatar, HItemCard, HNotificationsBell, HCartIcon, HUserMenu, HPillToggle } from '../components/primitives';
import { signOut } from '../auth';

// Post-login app shell + Dashboard
const { useState: useStateD } = React;

export function HAppNav({ active, role = 'buyer', onRoleChange = () => {} }) {
  const navigate = useNavigate();
  const items = [
    ['Home', '/dashboard'],
    [role === 'carrier' ? 'My Trips' : 'Orders', role === 'carrier' ? '/trips' : '/orders'],
    ['Messages', '/messages'],
    ['Wallet', '/wallet'],
  ];
  const handleSignOut = () => { signOut(); navigate('/'); };
  return (
    <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 32px', borderBottom: '1px solid var(--line)', background: 'var(--paper)', position: 'sticky', top: 0, zIndex: 50, backdropFilter: 'saturate(140%) blur(12px)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
        <HLogo size={20}/>
        <div style={{ display: 'flex', gap: 0 }}>
          {items.map(([label, href]) => (
            <Link
              key={label}
              to={href}
              className={`h-nav-link${active === label.toLowerCase() ? ' is-active' : ''}`}
            >{label}</Link>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <HPillToggle
          size="sm"
          value={role}
          onChange={onRoleChange}
          options={[
            { value: 'buyer', label: 'Buyer', icon: '🛍' },
            { value: 'carrier', label: 'Carrier', icon: '✈' },
          ]}
        />
        <HNotificationsBell/>
        <HCartIcon/>
        <span style={{ width: 1, height: 20, background: 'var(--line)' }}/>
        <HUserMenu onSignOut={handleSignOut}/>
      </div>
    </nav>
  );
}

export function PageDashboard({ initialRole = 'buyer' }) {
  const [role, setRole] = useStateD(initialRole);
  const navigate = useNavigate();
  const u = HD.user;
  return (
    <div className="h-app" style={{ width: '100%', minHeight: 1200, background: 'var(--paper)' }}>
      <HAppNav active="home" role={role} onRoleChange={setRole}/>

      <section style={{ padding: '40px 32px', maxWidth: 1400, margin: '0 auto' }}>
        {/* Greeting */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40 }}>
          <div>
            <div className="h-mono" style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: '.1em' }}>GOOD MORNING · {u.city.toUpperCase()}</div>
            <h1 className="h-display" style={{ fontSize: 48, margin: '8px 0 0', lineHeight: 1.04 }}>Hi, <span style={{ fontStyle: 'italic' }}>{u.name.split(' ')[0]}.</span></h1>
            <p style={{ fontSize: 15, color: 'var(--ink-2)', marginTop: 12 }}>{role === 'buyer' ? '2 active orders, 1 carrier in flight to you.' : '1 trip departing in 3 days. 4 pending requests.'}</p>
          </div>
          <button onClick={() => navigate(role === 'buyer' ? '/post-request' : '/post-trip')} className="h-btn h-btn-primary">{role === 'buyer' ? '+ New request' : '+ New trip'}</button>
        </div>

        {/* Stats grid — 3 numbers, more breathing room. Saved-on-shipping leads
            for buyers (loss-aversion); rank leads for carriers (achievement). */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: 'var(--line)', border: '1px solid var(--line)', borderRadius: 'var(--r-lg)', overflow: 'hidden', marginBottom: 32 }}>
          {(role === 'buyer' ? [
            ['Saved on shipping', '$340', 'lifetime — vs. local resellers'],
            ['Active orders', '2', '1 in flight to you'],
            ['Avg delivery', '6.4 days', 'across all routes'],
          ] : [
            ['This month', '$420', '3 trips · 2 in flight'],
            ['Rating', `★ ${u.rating}`, `${u.reviews} reviews`],
            ['Top carrier rank', '#42', `globally · top 1.3%`],
          ]).map(([k, v, s]) => (
            <div key={k} style={{ padding: '28px 24px', background: 'var(--paper)' }}>
              <div className="h-mono" style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: '.1em', textTransform: 'uppercase' }}>{k}</div>
              <div className="h-display" style={{ fontSize: 40, marginTop: 8, lineHeight: 1.04 }}>{v}</div>
              <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 6 }}>{s}</div>
            </div>
          ))}
        </div>

        {/* Two-column main */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
          {/* Active flight tracker */}
          <div className="h-card" style={{ padding: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 24 }}>
              <h3 className="h-serif" style={{ fontSize: 28, margin: 0, letterSpacing: '-0.02em' }}>{role === 'buyer' ? 'Your carrier is in flight' : 'Your next trip'}</h3>
              <Link to="/order-detail" style={{ fontSize: 13, color: 'var(--rouge-deep)', textDecoration: 'none' }}>View order →</Link>
            </div>

            {/* Flight visualization */}
            <div style={{ position: 'relative', padding: '32px 0', background: 'var(--paper-2)', borderRadius: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', padding: '0 32px' }}>
                <div style={{ flex: 1 }}>
                  <div className="h-mono" style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: '.08em' }}>FROM</div>
                  <div style={{ fontSize: 32, fontFamily: 'var(--font-serif)', marginTop: 4 }}>TYO</div>
                  <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>Tokyo · 14:30</div>
                </div>
                <div style={{ flex: 2, position: 'relative', height: 40 }}>
                  <svg width="100%" height="40" style={{ position: 'absolute', inset: 0 }}>
                    <path d="M 0 30 Q 50% 0 100% 30" stroke="var(--rouge)" strokeWidth="1.5" strokeDasharray="4 4" fill="none"/>
                  </svg>
                  <div style={{ position: 'absolute', top: 0, left: '60%', transform: 'translate(-50%, -10%)' }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="var(--rouge)" style={{ transform: 'rotate(45deg)' }}><path d="M21 16v-2l-8-5V3.5C13 2.67 12.33 2 11.5 2S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg>
                  </div>
                </div>
                <div style={{ flex: 1, textAlign: 'right' }}>
                  <div className="h-mono" style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: '.08em' }}>TO</div>
                  <div style={{ fontSize: 32, fontFamily: 'var(--font-serif)', marginTop: 4 }}>SFO</div>
                  <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>San Francisco · 09:45</div>
                </div>
              </div>
              <div style={{ marginTop: 24, padding: '16px 32px 0', borderTop: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                <span style={{ color: 'var(--ink-3)' }}>Order #HD-2847 · 2 items · ★ 4.9 carrier</span>
                <span style={{ color: 'var(--rouge)', fontWeight: 500 }}>● Boarding now</span>
              </div>
            </div>

            {/* Mini timeline */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
              {['Reserved', 'Purchased', 'In flight', 'Hand-off', 'Confirmed'].map((s, i) => (
                <div key={s} style={{ flex: 1, position: 'relative', textAlign: 'center' }}>
                  {i < 4 && <div style={{ position: 'absolute', top: 7, left: '50%', right: '-50%', height: 1, background: i < 2 ? 'var(--rouge)' : 'var(--paper-3)' }}/>}
                  <div style={{ width: 14, height: 14, borderRadius: 999, background: i <= 2 ? 'var(--rouge)' : 'var(--paper-3)', border: i === 2 ? '3px solid var(--rouge-soft)' : 'none', margin: '0 auto', position: 'relative', zIndex: 1 }}/>
                  <div style={{ fontSize: 11, color: i <= 2 ? 'var(--ink)' : 'var(--ink-3)', marginTop: 8, fontFamily: 'var(--font-mono)', letterSpacing: '.04em' }}>{s}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick actions / activity */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="h-card" style={{ padding: 24, background: 'var(--noir)', color: 'var(--paper)' }}>
              <div className="h-mono" style={{ fontSize: 10, color: 'rgba(250,248,244,.6)', letterSpacing: '.1em' }}>WALLET BALANCE</div>
              <div className="h-display" style={{ fontSize: 44, marginTop: 8, color: 'var(--paper)' }}>${u.walletAvailable}</div>
              <div style={{ fontSize: 12, color: 'rgba(250,248,244,.6)', marginTop: 4 }}>+ ${u.walletPending} pending release</div>
              <button onClick={() => navigate('/wallet')} className="h-btn h-btn-rouge" style={{ marginTop: 20, width: '100%' }}>Withdraw →</button>
            </div>

            <div className="h-card" style={{ padding: 20 }}>
              <div className="h-eyebrow" style={{ marginBottom: 12 }}>Activity</div>
              <div style={{ display: 'grid', gap: 14, fontSize: 13 }}>
                {[
                  ['🟢', 'Receipt uploaded', 'Order #2847 · 12m'],
                  ['💬', 'New message from James', '24m'],
                  ['⭐', 'Anna left you 5 stars', '2h'],
                  ['💸', '$120 released to wallet', 'Yesterday'],
                ].map(([e, t, s], i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <span>{e}</span>
                    <div style={{ flex: 1 }}>
                      <div>{t}</div>
                      <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>{s}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div style={{ marginTop: 48 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20 }}>
            <h3 className="h-serif" style={{ fontSize: 32, margin: 0, letterSpacing: '-0.02em' }}>{role === 'buyer' ? 'New from cities you watch' : 'Requests on your routes'}</h3>
            <Link to={role === 'buyer' ? '/browse' : '/requests'} style={{ fontSize: 13, color: 'var(--rouge-deep)', textDecoration: 'none' }}>See all →</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {HD.items.slice(2, 6).map(it => <HItemCard key={it.id} item={it}/>)}
          </div>
        </div>
      </section>
    </div>
  );
}

