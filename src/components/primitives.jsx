import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { isSignedIn, signOut } from '../auth';
import { useCart, cartCount } from '../cart';
import { HD } from '../data/sample';

// handi — Primitive UI components shared across all pages
// All components prefixed with H to avoid global collision.

// ─── Logo ─────────────────────────────────────────────
// Clicking the handi mark routes to / (Landing).
export function HLogo({ size = 22, color = 'currentColor', tag = false, to = '/' }) {
  return (
    <Link to={to} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color, textDecoration: 'none' }}>
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        {/* hand carrying a sphere */}
        <circle cx="12" cy="8" r="4" stroke={color} strokeWidth="1.6" />
        <path d="M5 21c0-3.5 3.1-6 7-6s7 2.5 7 6" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="18" cy="6" r="1.5" fill="#8B1E2D" />
      </svg>
      <span style={{
        fontFamily: 'var(--font-serif)', fontSize: size * 1.05,
        letterSpacing: '-0.02em', color, lineHeight: 1, fontStyle: 'italic'
      }}>handi</span>
      {tag && <span className="h-mono" style={{ fontSize: 10, color: 'var(--ink-3)', marginLeft: 4, letterSpacing: '0.1em' }}>EST. 2025</span>}
    </Link>
  );
}

// ─── Avatar with initials fallback ─────────────────────
export function HAvatar({ name = '', src, size = 32, ring = false }) {
  const initials = name.split(' ').map(s => s[0]).slice(0, 2).join('').toUpperCase();
  return (
    <span className="h-avatar" style={{
      width: size, height: size, fontSize: size * 0.38,
      boxShadow: ring ? '0 0 0 2px var(--paper), 0 0 0 3px var(--rouge)' : 'none'
    }}>
      {src ? <img src={src} alt={name} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/> : initials}
    </span>
  );
}

// ─── Star Rating ─────────────────────────────────────
export function HStars({ value = 0, size = 12, color = 'var(--ink)' }) {
  return (
    <span style={{ display: 'inline-flex', gap: 1, color }}>
      {[1,2,3,4,5].map(i => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill={i <= Math.round(value) ? color : 'var(--paper-3)'}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ))}
    </span>
  );
}

// ─── Country flag (emoji wrap) ─────────────────────
export function HFlag({ code = 'JP', size = 14 }) {
  const map = { JP: '🇯🇵', US: '🇺🇸', KR: '🇰🇷', FR: '🇫🇷', GB: '🇬🇧', TW: '🇹🇼', SG: '🇸🇬' };
  return <span style={{ fontSize: size, lineHeight: 1 }}>{map[code] || '🌐'}</span>;
}

// ─── Verified badge ──────────────────────────────────
export function HVerified({ size = 12 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ display: 'inline-block' }}>
      <path d="M12 2l2.4 1.7 2.9-.4 1.4 2.6 2.6 1.4-.4 2.9L22.6 12l-1.7 2.4.4 2.9-2.6 1.4-1.4 2.6-2.9-.4L12 22.6l-2.4-1.7-2.9.4-1.4-2.6-2.6-1.4.4-2.9L1.4 12l1.7-2.4-.4-2.9 2.6-1.4 1.4-2.6 2.9.4L12 1.4z" fill="var(--rouge)"/>
      <path d="M8 12.5l2.5 2.5L16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  );
}

// ─── Site Top Nav ────────────────────────────────────
// `signedIn` defaults to auto-detect so consumers don't need to thread auth state.
// Items stay constant across auth states so nothing jumps around — only the
// right-hand block (Sign in / avatar / cart / sign out) swaps.
export function HNav({ active = '', signedIn, role = 'buyer' }) {
  const navigate = useNavigate();
  const detected = isSignedIn();
  const isIn = signedIn === undefined ? detected : signedIn;
  const [mobileOpen, setMobileOpen] = useState(false);
  const items = [
    ['Browse','/browse'],
    ['Carriers','/carriers'],
    ['Requests','/requests'],
    ['Post a Trip','/post-trip'],
    ['How it works','/how-it-works'],
  ];
  const handleSignOut = () => { signOut(); setMobileOpen(false); navigate('/'); };

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') setMobileOpen(false); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <nav style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '20px 40px', borderBottom: '1px solid var(--line)',
      background: 'var(--paper)', position: 'sticky', top: 0, zIndex: 50,
      backdropFilter: 'saturate(140%) blur(12px)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 36 }}>
        <HLogo size={22} />
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
        {isIn ? (
          <>
            <Link to="/browse" className="h-hide-mobile" style={navIconBtn} aria-label="Search">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
            </Link>
            <span className="h-hide-mobile" style={{ display: 'inline-flex' }}><HNotificationsBell/></span>
            <HCartIcon/>
            <span className="h-hide-mobile" style={{ width: 1, height: 20, background: 'var(--line)' }}/>
            <span className="h-hide-mobile" style={{ display: 'inline-flex' }}><HUserMenu onSignOut={handleSignOut}/></span>
          </>
        ) : (
          <>
            <HCartIcon/>
            <Link to="/signin" className="h-hide-mobile" style={{ fontSize: 13, color: 'var(--ink-2)', padding: '8px 12px', textDecoration: 'none' }}>Sign in</Link>
            <Link to="/signup" className="h-btn h-btn-primary h-btn-sm h-hide-mobile">Join handi</Link>
          </>
        )}
        <button
          className="h-show-mobile"
          aria-label="Open menu"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen(true)}
          style={{ ...navIconBtn, width: 40, height: 40 }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
        </button>
      </div>

      {mobileOpen && (
        <HMobileDrawer
          items={items}
          active={active}
          isIn={isIn}
          onClose={() => setMobileOpen(false)}
          onSignOut={handleSignOut}
        />
      )}
    </nav>
  );
}

function HMobileDrawer({ items, active, isIn, onClose, onSignOut }) {
  return (
    <div role="dialog" aria-modal="true" aria-label="Navigation" style={{
      position: 'fixed', inset: 0, zIndex: 100,
      animation: 'h-fade-up .22s var(--ease-out) both',
    }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(20,17,14,.45)' }}/>
      <aside style={{
        position: 'absolute', top: 0, right: 0, bottom: 0,
        width: 'min(86vw, 360px)', background: 'var(--paper)',
        boxShadow: 'var(--shadow-lg)', display: 'flex', flexDirection: 'column',
      }}>
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 20px', borderBottom: '1px solid var(--line)' }}>
          <HLogo size={20}/>
          <button onClick={onClose} aria-label="Close menu" style={{ ...navIconBtn, width: 40, height: 40 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
          </button>
        </header>
        <ul style={{ listStyle: 'none', margin: 0, padding: '8px 0', flex: 1, overflowY: 'auto' }}>
          {items.map(([label, href]) => (
            <li key={label}>
              <Link
                to={href}
                onClick={onClose}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '16px 20px', fontSize: 16,
                  color: active === label.toLowerCase() ? 'var(--rouge)' : 'var(--ink)',
                  fontWeight: active === label.toLowerCase() ? 500 : 400,
                  borderBottom: '1px solid var(--line)',
                }}
              >
                {label}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--ink-3)" strokeWidth="1.8"><path d="M9 6l6 6-6 6"/></svg>
              </Link>
            </li>
          ))}
          {isIn && [
            ['Dashboard', '/dashboard'],
            ['Orders', '/orders'],
            ['My trips', '/trips'],
            ['Following', '/profile?tab=following'],
            ['Followers', '/profile?tab=followers'],
            ['Wallet', '/wallet'],
            ['Messages', '/messages'],
            ['Profile', '/profile'],
            ['Settings', '/settings'],
          ].map(([label, href]) => (
            <li key={href}>
              <Link to={href} onClick={onClose} style={{ display: 'flex', padding: '14px 20px', fontSize: 14, color: 'var(--ink-2)', borderBottom: '1px solid var(--line)' }}>
                {label}
              </Link>
            </li>
          ))}
        </ul>
        <footer style={{ padding: 20, borderTop: '1px solid var(--line)', display: 'grid', gap: 10 }}>
          {isIn ? (
            <button onClick={onSignOut} className="h-btn h-btn-ghost" style={{ width: '100%' }}>← Sign out</button>
          ) : (
            <>
              <Link to="/signin" onClick={onClose} className="h-btn h-btn-ghost" style={{ width: '100%' }}>Sign in</Link>
              <Link to="/signup" onClick={onClose} className="h-btn h-btn-primary" style={{ width: '100%' }}>Join handi</Link>
            </>
          )}
        </footer>
      </aside>
    </div>
  );
}
const navIconBtn = {
  position: 'relative', width: 36, height: 36, borderRadius: 999,
  background: 'transparent', border: '1px solid var(--line)',
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  color: 'var(--ink-2)', cursor: 'pointer',
};

// ─── User menu (avatar → member-center popover) ─────
export function HUserMenu({ onSignOut }) {
  const followSet = useFollowing();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();
  const u = HD.user || { name: 'Yuki Mori', initials: 'YM', city: 'San Francisco', rating: 4.92, reviews: 47, completedTrips: 14, completedOrders: 23, walletAvailable: 320, walletPending: 155, member: 'handi+ member' };

  useEffect(() => {
    if (!open) return;
    const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onClick); document.removeEventListener('keydown', onKey); };
  }, [open]);

  const followersCount = (HD.followers || []).length;
  const links = [
    { to: '/dashboard', icon: '🏠', label: 'Dashboard' },
    { to: '/profile', icon: '👤', label: 'Profile · reviews' },
    { to: '/profile?tab=following', icon: '✦', label: 'Following', meta: `${followSet.size}` },
    { to: '/profile?tab=followers', icon: '◐', label: 'Followers', meta: `${followersCount}` },
    { to: '/wallet', icon: '💳', label: 'Wallet & payouts', meta: `$${u.walletAvailable}` },
    { to: '/orders', icon: '📦', label: 'Orders', meta: `${u.completedOrders}` },
    { to: '/trips', icon: '✈️', label: 'My trips', meta: `${u.completedTrips}` },
    { to: '/membership', icon: '⭐', label: 'Membership' },
    { to: '/settings', icon: '⚙', label: 'Settings' },
  ];

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-flex' }}>
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="Account menu"
        aria-expanded={open}
        aria-haspopup="dialog"
        className="h-press"
        style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, borderRadius: 999 }}
      >
        <HAvatar name={u.name} size={32} ring={open}/>
      </button>

      {open && (
        <div role="dialog" aria-label="Account menu" style={{
          position: 'absolute', top: 'calc(100% + 10px)', right: 0,
          width: 320, maxHeight: 540, overflowY: 'auto',
          background: 'var(--paper)', border: '1px solid var(--line-2)',
          borderRadius: 'var(--r-lg)', boxShadow: 'var(--shadow-lg)',
          zIndex: 100, animation: 'h-fade-up .18s var(--ease-out) both',
          color: 'var(--ink)',
        }}>
          <span style={{ position: 'absolute', top: -6, right: 14, width: 12, height: 12, background: 'var(--paper)', borderTop: '1px solid var(--line-2)', borderLeft: '1px solid var(--line-2)', transform: 'rotate(45deg)' }}/>

          {/* Profile header */}
          <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid var(--line)', display: 'flex', gap: 14, alignItems: 'center' }}>
            <HAvatar name={u.name} size={48}/>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.3 }}>{u.name}</div>
              <div className="h-mono" style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: '.04em', marginTop: 2 }}>{u.city}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4, fontSize: 11 }}>
                <HVerified size={11}/>
                <span style={{ color: 'var(--rouge-deep)' }}>{u.member || 'Verified member'}</span>
              </div>
            </div>
          </div>

          {/* Quick stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', borderBottom: '1px solid var(--line)' }}>
            {[
              { k: 'Rating', v: `★ ${u.rating}`, sub: `${u.reviews} reviews` },
              { k: 'Trips', v: u.completedTrips, sub: 'completed' },
              { k: 'Orders', v: u.completedOrders, sub: 'lifetime' },
            ].map((s, i) => (
              <div key={s.k} style={{ padding: '14px 12px', textAlign: 'center', borderRight: i < 2 ? '1px solid var(--line)' : 'none' }}>
                <div className="h-serif" style={{ fontSize: 18, lineHeight: 1 }}>{s.v}</div>
                <div className="h-mono" style={{ fontSize: 9, color: 'var(--ink-3)', letterSpacing: '.08em', textTransform: 'uppercase', marginTop: 4 }}>{s.k}</div>
                <div style={{ fontSize: 10, color: 'var(--ink-3)', marginTop: 2 }}>{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Edit profile button */}
          <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--line)' }}>
            <button
              onClick={() => { setOpen(false); navigate('/settings'); }}
              className="h-btn h-btn-ghost h-btn-sm"
              style={{ width: '100%' }}
            >
              Edit profile →
            </button>
          </div>

          {/* Menu links */}
          <ul style={{ listStyle: 'none', margin: 0, padding: '6px 0' }}>
            {links.map(l => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  onClick={() => setOpen(false)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: '10px 18px',
                    color: 'var(--ink)', textDecoration: 'none', fontSize: 14,
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--paper-2)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                >
                  <span style={{ fontSize: 14, width: 18 }}>{l.icon}</span>
                  <span style={{ flex: 1 }}>{l.label}</span>
                  {l.meta && <span className="h-mono" style={{ fontSize: 11, color: 'var(--ink-3)' }}>{l.meta}</span>}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--ink-4)" strokeWidth="1.8"><path d="M9 6l6 6-6 6"/></svg>
                </Link>
              </li>
            ))}
          </ul>

          {/* Sign out */}
          <div style={{ borderTop: '1px solid var(--line)', padding: 8 }}>
            <button
              onClick={() => { setOpen(false); onSignOut?.(); }}
              style={{
                width: '100%', padding: '10px 16px', textAlign: 'left',
                background: 'transparent', border: 'none', cursor: 'pointer',
                fontSize: 13, color: 'var(--rouge-deep)',
                borderRadius: 8, fontFamily: 'inherit',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--rouge-soft)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
            >
              ← Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Sliding pill toggle ─────────────────────────────
// Two-or-more option toggle with an animated indicator that slides under the active one.
// Use as: <HPillToggle options={[{value, label, icon}]} value={...} onChange={(v) => ...} />
export function HPillToggle({ options, value, onChange, size = 'md', dark = false }) {
  const refs = useRef([]);
  const [box, setBox] = useState({ left: 0, width: 0, height: 0 });
  const activeIndex = options.findIndex(o => o.value === value);

  useEffect(() => {
    const el = refs.current[activeIndex];
    if (!el) return;
    setBox({ left: el.offsetLeft, width: el.offsetWidth, height: el.offsetHeight });
  }, [activeIndex, options.length]);

  const padX = size === 'sm' ? '6px 12px' : '12px 28px';
  const fontSize = size === 'sm' ? 12 : 14;
  const indicatorBg = dark ? 'var(--paper)' : 'var(--ink)';
  const activeColor = dark ? 'var(--ink)' : 'var(--paper)';
  const inactiveColor = dark ? 'rgba(250,248,244,.7)' : 'var(--ink-2)';

  return (
    <div style={{
      position: 'relative', display: 'inline-flex', padding: 3,
      background: dark ? 'rgba(250,248,244,.1)' : 'var(--paper-2)',
      borderRadius: 999,
    }}>
      {/* sliding indicator */}
      <span style={{
        position: 'absolute',
        top: 3, left: box.left + 3, height: box.height, width: box.width,
        background: indicatorBg, borderRadius: 999,
        transition: 'left .35s cubic-bezier(.4,0,.2,1), width .35s cubic-bezier(.4,0,.2,1)',
        boxShadow: '0 1px 3px rgba(26,23,20,.18)',
        pointerEvents: 'none',
      }}/>
      {options.map((o, i) => {
        const on = o.value === value;
        return (
          <button
            key={o.value}
            ref={el => refs.current[i] = el}
            onClick={() => onChange(o.value)}
            style={{
              position: 'relative', zIndex: 1,
              padding: padX, border: 'none', borderRadius: 999, cursor: 'pointer',
              background: 'transparent',
              color: on ? activeColor : inactiveColor,
              fontSize, fontWeight: 500, fontFamily: 'inherit',
              transition: 'color .25s',
              display: 'inline-flex', alignItems: 'center', gap: 6,
              whiteSpace: 'nowrap',
            }}
          >
            {o.icon && <span>{o.icon}</span>}
            <span>{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Cart icon with live count badge ────────────────
export function HCartIcon({ buttonStyle = navIconBtn }) {
  const cart = useCart();
  const count = cartCount(cart.items);
  return (
    <Link to="/cart" style={{ ...buttonStyle, color: 'var(--ink-2)' }} aria-label={`Cart (${count})`}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M3 4h2l2.6 12.5a1 1 0 001 .8h9.5a1 1 0 001-.78L21 7H6"/>
        <circle cx="9" cy="20" r="1.5"/>
        <circle cx="18" cy="20" r="1.5"/>
      </svg>
      {count > 0 && (
        <span style={{
          position: 'absolute', top: -4, right: -4, minWidth: 18, height: 18,
          padding: '0 5px', background: 'var(--rouge)', color: 'white',
          fontSize: 10, fontWeight: 700, borderRadius: 999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-mono)', boxShadow: '0 0 0 2px var(--paper)',
        }}>{count}</span>
      )}
    </Link>
  );
}

// ─── Notifications popover bell ──────────────────────
// Click → opens a small popover anchored to the bell. Click outside / Esc closes.
export function HNotificationsBell({ buttonStyle = navIconBtn }) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { id: 1, icon: '📦', title: 'James L. uploaded your receipt', sub: 'Order #HD-2847 · Pokémon Center · 2m', to: '/order-detail', unread: true },
    { id: 2, icon: '💬', title: 'New message from James L.', sub: '"Just at Mega Tokyo now…" · 12m', to: '/messages', unread: true },
    { id: 3, icon: '⭐', title: 'Anna L. left you 5 stars', sub: '"Smooth Williamsburg handoff." · 2h', to: '/profile', unread: false },
    { id: 4, icon: '💸', title: '$120 released to your wallet', sub: 'From Order #HD-2841 · Yesterday', to: '/wallet', unread: false },
    { id: 5, icon: '✈', title: 'Trip TYO → SF · 4 new requests', sub: 'Last 24h · Carriers on your route', to: '/trips', unread: false },
  ]);
  const ref = useRef(null);
  const unread = items.filter(i => i.unread).length;

  useEffect(() => {
    if (!open) return;
    const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onClick); document.removeEventListener('keydown', onKey); };
  }, [open]);

  const markAllRead = () => setItems(prev => prev.map(i => ({ ...i, unread: false })));
  const markOneRead = (id) => setItems(prev => prev.map(i => i.id === id ? { ...i, unread: false } : i));

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-flex' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={buttonStyle}
        aria-label="Notifications"
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6 8a6 6 0 0112 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10 21a2 2 0 004 0"/></svg>
        {unread > 0 && <span style={{ position: 'absolute', top: 6, right: 6, minWidth: 7, height: 7, background: 'var(--rouge)', borderRadius: 999, boxShadow: '0 0 0 2px var(--paper)' }}/>}
      </button>

      {open && (
        <div role="dialog" aria-label="Notifications" style={{
          position: 'absolute', top: 'calc(100% + 10px)', right: 0,
          width: 380, maxHeight: 480, overflowY: 'auto',
          background: 'var(--paper)', border: '1px solid var(--line-2)',
          borderRadius: 'var(--r-lg)', boxShadow: 'var(--shadow-lg)',
          zIndex: 100, animation: 'h-fade-up .18s var(--ease-out) both',
          color: 'var(--ink)',
        }}>
          {/* Caret pointing up to the bell */}
          <span style={{ position: 'absolute', top: -6, right: 14, width: 12, height: 12, background: 'var(--paper)', borderTop: '1px solid var(--line-2)', borderLeft: '1px solid var(--line-2)', transform: 'rotate(45deg)' }}/>

          <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderBottom: '1px solid var(--line)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 14, fontWeight: 500 }}>Notifications</span>
              {unread > 0 && <span style={{ background: 'var(--rouge)', color: 'white', fontSize: 10, fontFamily: 'var(--font-mono)', letterSpacing: '.04em', padding: '2px 7px', borderRadius: 999 }}>{unread} NEW</span>}
            </div>
            {unread > 0 && (
              <button onClick={markAllRead} style={{ fontSize: 12, color: 'var(--ink-3)', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}>Mark all read</button>
            )}
          </header>

          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {items.map(it => (
              <li key={it.id}>
                <Link
                  to={it.to}
                  onClick={() => { markOneRead(it.id); setOpen(false); }}
                  style={{
                    display: 'flex', gap: 12, padding: '14px 16px',
                    borderBottom: '1px solid var(--line)',
                    background: it.unread ? 'rgba(139,30,45,0.04)' : 'transparent',
                    textDecoration: 'none', color: 'inherit',
                  }}
                >
                  <span style={{ width: 32, height: 32, borderRadius: 999, background: 'var(--paper-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>{it.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, color: 'var(--ink)', lineHeight: 1.4, fontWeight: it.unread ? 500 : 400 }}>{it.title}</div>
                    <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 4, fontFamily: 'var(--font-mono)', letterSpacing: '.02em' }}>{it.sub}</div>
                  </div>
                  {it.unread && <span style={{ alignSelf: 'center', width: 6, height: 6, background: 'var(--rouge)', borderRadius: 999, flexShrink: 0 }}/>}
                </Link>
              </li>
            ))}
          </ul>

          <footer style={{ padding: '12px 16px', textAlign: 'center', background: 'var(--paper-2)' }}>
            <Link to="/messages" onClick={() => setOpen(false)} style={{ fontSize: 12, color: 'var(--rouge-deep)', textDecoration: 'none', fontFamily: 'var(--font-mono)', letterSpacing: '.06em' }}>VIEW ALL →</Link>
          </footer>
        </div>
      )}
    </div>
  );
}

// ─── Footer ──────────────────────────────────────────
export function HFooter() {
  const cols = [
    ['Platform', [['Browse','/browse'], ['Requests','/requests'], ['Post a trip','/post-trip'], ['How it works','/how-it-works']]],
    ['Account',  [['Sign in','/signin'], ['Register','/signup'], ['Wallet','/wallet'], ['Orders','/orders']]],
    ['Trust',    [['Buyer protection','/how-it-works'], ['Carrier guidelines','/how-it-works'], ['Disputes','/order-detail'], ['Identity','/settings']]],
    ['Company',  [['About','/how-it-works'], ['Press','/how-it-works'], ['Careers','/how-it-works'], ['Contact','/messages']]],
  ];
  return (
    <footer style={{ background: 'var(--noir)', color: 'var(--paper)', padding: '64px 40px 32px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: 48, marginBottom: 64 }}>
        <div>
          <HLogo size={22} color="var(--paper)" />
          <p style={{ marginTop: 16, color: 'rgba(250,248,244,.6)', fontSize: 13, lineHeight: 1.6, maxWidth: 260 }}>
            The peer-to-peer carry network. From any city — to your door, at retail.
          </p>
          <div style={{ display: 'flex', gap: 8, marginTop: 24 }}>
            {['Escrow', 'ID-verified', 'Buyer protected'].map(t => (
              <span key={t} style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'rgba(250,248,244,.5)', letterSpacing: '.1em', textTransform: 'uppercase', padding: '4px 8px', border: '1px solid rgba(250,248,244,.15)', borderRadius: 999 }}>{t}</span>
            ))}
          </div>
        </div>
        {cols.map(([h, items]) => (
          <div key={h}>
            <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(250,248,244,.5)', marginBottom: 16 }}>{h}</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 10 }}>
              {items.map(([label, to]) => (
                <li key={label}>
                  <Link to={to} style={{ fontSize: 13, color: 'rgba(250,248,244,.85)', textDecoration: 'none' }}>{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 24, borderTop: '1px solid rgba(250,248,244,.1)', fontSize: 12, color: 'rgba(250,248,244,.5)' }}>
        <span>© 2026 handi, Inc.</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '.1em' }}>NYC · TYO · SEL · PAR · LDN</span>
      </div>
    </footer>
  );
}

// ─── Section Heading (eyebrow + display) ──────────────
export function HSectionHead({ eyebrow, title, sub, align = 'left', dark }) {
  return (
    <div style={{ textAlign: align, color: dark ? 'var(--paper)' : 'var(--ink)' }}>
      {eyebrow && <div className="h-eyebrow" style={{ color: dark ? 'rgba(250,248,244,.6)' : 'var(--ink-3)', marginBottom: 16 }}>{eyebrow}</div>}
      <h2 className="h-display" style={{ fontSize: 56, margin: 0, color: 'inherit' }}>{title}</h2>
      {sub && <p style={{ marginTop: 16, fontSize: 15, color: dark ? 'rgba(250,248,244,.7)' : 'var(--ink-2)', maxWidth: 520, lineHeight: 1.55, marginLeft: align === 'center' ? 'auto' : 0, marginRight: align === 'center' ? 'auto' : 0 }}>{sub}</p>}
    </div>
  );
}

// ─── Follow carrier button ───────────────────────────────────────────────
// Small toggle pill. Drops into any carrier surface (item detail, order
// detail, message thread header, profile). Persists via src/follow.js.
// Gated on auth: signed-out users get bounced to /signin?from=<current>.
import { useFollowing, toggleFollow } from '../follow';

export function HFollowButton({ name, size = 'md' }) {
  const set = useFollowing();
  const following = set.has(name);
  const navigate = useNavigate();
  const location = useLocation();
  const onClick = (e) => {
    e.preventDefault?.();
    e.stopPropagation?.();
    if (!isSignedIn()) {
      const from = `${location.pathname}${location.search}${location.hash}`;
      navigate(`/signin?from=${encodeURIComponent(from)}`);
      return;
    }
    toggleFollow(name);
  };
  const padding = size === 'sm' ? '6px 12px' : '8px 14px';
  const fontSize = size === 'sm' ? 12 : 13;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={following}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding, borderRadius: 999, cursor: 'pointer',
        border: '1px solid',
        borderColor: following ? 'var(--ink)' : 'var(--line-2)',
        background: following ? 'var(--ink)' : 'transparent',
        color: following ? 'var(--paper)' : 'var(--ink-2)',
        fontSize, fontFamily: 'inherit', fontWeight: 500,
        transition: 'background .15s var(--ease-out), color .15s, border-color .15s',
        whiteSpace: 'nowrap',
      }}
      onMouseEnter={(e) => { if (!following) e.currentTarget.style.borderColor = 'var(--ink-3)'; }}
      onMouseLeave={(e) => { if (!following) e.currentTarget.style.borderColor = 'var(--line-2)'; }}
    >
      {following ? (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><path d="M5 13l4 4L19 7"/></svg>
      ) : (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>
      )}
      {following ? 'Following' : 'Follow'}
    </button>
  );
}

// ─── Empty state (shared across Browse, Orders, Trips, Wallet, Messages) ─
export function HEmpty({ icon = '✦', title, body, action }) {
  return (
    <div role="status" style={{
      padding: '56px 24px', textAlign: 'center',
      border: '1px dashed var(--line-2)', borderRadius: 'var(--r-lg)',
      background: 'var(--paper-2)',
    }}>
      <div aria-hidden="true" style={{ fontSize: 28, lineHeight: 1, marginBottom: 14, color: 'var(--ink-3)' }}>{icon}</div>
      {title && <h3 className="h-serif" style={{ fontSize: 22, margin: '0 0 8px', letterSpacing: '-0.01em' }}>{title}</h3>}
      {body && <p style={{ fontSize: 14, color: 'var(--ink-2)', margin: '0 auto', maxWidth: 400, lineHeight: 1.55 }}>{body}</p>}
      {action && <div style={{ marginTop: 20 }}>{action}</div>}
    </div>
  );
}

// ─── Item card (used in Browse, Cart, Detail-related) ─
export function HItemCard({ item, compact = false }) {
  const [saved, setSaved] = useState(false);
  return (
    <Link to={`/item/${item.id}`} className="h-card h-card-hover" style={{ background: 'var(--paper)', borderRadius: 'var(--r-lg)', overflow: 'hidden', cursor: 'pointer', display: 'block', textDecoration: 'none', color: 'inherit' }}>
      <div style={{ position: 'relative', aspectRatio: '1', overflow: 'hidden' }}>
        <img src={item.img} alt={item.title} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
        {/* corner tags */}
        <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-start' }}>
          {item.tag && <span className="h-chip h-chip-noir" style={{ fontSize: 10, fontFamily: 'var(--font-mono)', letterSpacing: '.08em', textTransform: 'uppercase' }}>{item.tag}</span>}
        </div>
        <div style={{ position: 'absolute', top: 12, right: 12 }}>
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSaved(s => !s); }}
            aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
            aria-pressed={saved}
            style={{
              width: 36, height: 36, border: 'none', borderRadius: 999,
              background: saved ? 'var(--rouge)' : 'rgba(255,255,255,.92)',
              backdropFilter: 'blur(8px)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: saved ? 'white' : 'var(--ink)',
              transition: 'background .2s, color .2s',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
          </button>
        </div>
        {/* bottom city ribbon */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '12px', background: 'linear-gradient(to top, rgba(0,0,0,.55), transparent)', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', letterSpacing: '.12em', textTransform: 'uppercase', opacity: .8 }}>{item.from} → {item.to}</div>
            <div style={{ fontSize: 12, marginTop: 2, opacity: .9 }}>Departs {item.departs}</div>
          </div>
          {item.viewers && <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', opacity: .8 }}>{item.viewers} viewing</span>}
        </div>
      </div>

      <div style={{ padding: compact ? 14 : 18 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8, marginBottom: 10 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11, color: 'var(--ink-3)', fontFamily: 'var(--font-mono)', letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 4 }}>{item.store}</div>
            <h3 style={{ fontSize: 15, margin: 0, fontWeight: 500, lineHeight: 1.3, letterSpacing: '-0.01em', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.title}</h3>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <HAvatar name={item.carrier} size={22} />
            <div style={{ fontSize: 12, color: 'var(--ink-2)' }}>
              {item.carrier} <span style={{ color: 'var(--ink-3)' }}>· ★{item.rating}</span>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 10, color: 'var(--ink-3)', fontFamily: 'var(--font-mono)', letterSpacing: '.06em', textTransform: 'uppercase' }}>Carry fee</div>
            <div style={{ fontSize: 16, fontWeight: 500, fontFamily: 'var(--font-serif)' }}>${item.fee}</div>
          </div>
        </div>
      </div>
    </Link>
  );
}
