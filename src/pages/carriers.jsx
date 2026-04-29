import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HD } from '../data/sample';
import { HNav, HFooter, HAvatar, HVerified, HFollowButton } from '../components/primitives';

// Carriers directory — public list of every carrier on handi.
// Anyone (signed-in or not) can browse; the Follow action itself is
// auth-gated inside HFollowButton, so guests get bounced to /signin.

const SORTS = [
  { id: 'trips',    label: 'Most trips' },
  { id: 'reply',    label: 'Fastest reply' },
  { id: 'verified', label: 'Verified first' },
];

// Map "<1h" / "~2h" / "Within a day" to a sortable rank.
function replyRank(s) {
  if (!s) return 999;
  if (/<\s*1h/i.test(s)) return 1;
  if (/~?\s*2h/i.test(s)) return 2;
  if (/~?\s*3h/i.test(s)) return 3;
  if (/~?\s*5h/i.test(s)) return 5;
  if (/within a day/i.test(s)) return 24;
  return 12;
}

export function PageCarriers() {
  const navigate = useNavigate();
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [noDispute, setNoDispute] = useState(false);
  const [frequent, setFrequent] = useState(false);
  const [sort, setSort] = useState('trips');

  const all = useMemo(() => Object.entries(HD.carriers || {}).map(([name, c]) => ({ name, ...c })), []);

  const filtered = useMemo(() => {
    let arr = all;
    if (verifiedOnly) arr = arr.filter(c => c.idVerified);
    if (noDispute)    arr = arr.filter(c => (c.disputes || 0) === 0);
    if (frequent)     arr = arr.filter(c => (c.completedTrips || 0) >= 5);
    arr = [...arr].sort((a, b) => {
      if (sort === 'reply')    return replyRank(a.avgResponseTime) - replyRank(b.avgResponseTime);
      if (sort === 'verified') return (b.idVerified ? 1 : 0) - (a.idVerified ? 1 : 0) || (b.completedTrips || 0) - (a.completedTrips || 0);
      return (b.completedTrips || 0) - (a.completedTrips || 0);
    });
    return arr;
  }, [all, verifiedOnly, noDispute, frequent, sort]);

  return (
    <div className="h-app" style={{ width: '100%' }}>
      <HNav active="carriers"/>

      {/* Masthead */}
      <section style={{ padding: '64px 40px 32px', maxWidth: 1100, margin: '0 auto' }}>
        <div className="h-mono" style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: '.18em', textTransform: 'uppercase' }}>
          {all.length} carriers · {all.filter(c => c.idVerified).length} ID-verified
        </div>
        <h1 className="h-display" style={{ fontSize: 'clamp(48px, 7vw, 96px)', margin: '12px 0 0', lineHeight: 0.98, maxWidth: 900 }}>
          Carriers <span style={{ fontStyle: 'italic', color: 'var(--rouge)' }}>you can trust.</span>
        </h1>
        <p style={{ fontSize: 16, color: 'var(--ink-2)', maxWidth: 560, margin: '24px 0 0', lineHeight: 1.55 }}>
          Follow the ones you've had a great experience with — you'll see their next trip first, and they'll know to reach out when they're heading your way.
        </p>
      </section>

      {/* Sticky filter / sort rail */}
      <div style={{ position: 'sticky', top: 73, zIndex: 20, background: 'rgba(250,248,244,.92)', backdropFilter: 'saturate(150%) blur(10px)', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '14px 40px', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <span className="h-mono" style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: '.14em', whiteSpace: 'nowrap', marginRight: 4 }}>TRUST</span>
          <FilterChip label="ID-verified only"        on={verifiedOnly} onClick={() => setVerifiedOnly(v => !v)}/>
          <FilterChip label="No disputes"             on={noDispute}    onClick={() => setNoDispute(v => !v)}/>
          <FilterChip label="Frequent (5+ trips)"     on={frequent}     onClick={() => setFrequent(v => !v)}/>
          <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <span className="h-mono" style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: '.14em' }}>SORT</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="h-input"
              style={{ padding: '6px 28px 6px 10px', fontSize: 13, background: 'var(--paper)', border: '1px solid var(--line-2)', borderRadius: 999, cursor: 'pointer' }}
            >
              {SORTS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </span>
        </div>
      </div>

      {/* Carrier list */}
      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 40px 96px' }}>
        {filtered.length === 0 ? (
          <div style={{ padding: '120px 40px', textAlign: 'center' }}>
            <div className="h-serif" style={{ fontSize: 28, color: 'var(--ink-3)' }}>No carriers match those filters.</div>
            <button onClick={() => { setVerifiedOnly(false); setNoDispute(false); setFrequent(false); }} className="h-btn h-btn-ghost" style={{ marginTop: 20 }}>Clear filters →</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 16 }}>
            {filtered.map(c => <CarrierCard key={c.name} c={c} navigate={navigate}/>)}
          </div>
        )}
      </main>

      <HFooter/>
    </div>
  );
}

function FilterChip({ label, on, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '6px 14px', borderRadius: 999, cursor: 'pointer',
        border: '1px solid', borderColor: on ? 'var(--ink)' : 'var(--line-2)',
        background: on ? 'var(--ink)' : 'transparent',
        color: on ? 'var(--paper)' : 'var(--ink-2)',
        fontSize: 13, fontFamily: 'inherit', fontWeight: 500,
        transition: 'background .15s var(--ease-out), color .15s, border-color .15s',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </button>
  );
}

function CarrierCard({ c, navigate }) {
  const trips      = c.completedTrips || 0;
  const reply      = c.avgResponseTime || '—';
  const disputeStr = (c.disputes || 0) === 0 ? 'No disputes' : `${c.disputes} dispute${c.disputes > 1 ? 's' : ''}`;
  const spotsStr   = (c.spots && c.spots.length > 0)
    ? `Hand-off near · ${c.spots.slice(0, 2).join(' · ')}`
    : 'Doorstep / pickup only';

  return (
    <article className="h-card" style={{
      padding: 24, display: 'grid',
      gridTemplateColumns: 'auto 1fr auto',
      alignItems: 'center', gap: 24,
    }}>
      <HAvatar name={c.name} size={64}/>
      <div style={{ minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 18, fontWeight: 500 }}>{c.name}</span>
          {c.idVerified && <HVerified size={13}/>}
        </div>
        <div style={{ fontSize: 13, color: 'var(--ink-2)', marginTop: 6, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          <span>{trips} trips</span><span style={{ color: 'var(--ink-3)' }}>·</span>
          <span>Replies {reply}</span><span style={{ color: 'var(--ink-3)' }}>·</span>
          <span>{disputeStr}</span>
        </div>
        <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 4 }}>{c.availability || 'Schedule on request'}</div>
        <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>{spotsStr}</div>
      </div>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
        <button onClick={() => navigate(`/messages?with=${encodeURIComponent(c.name)}`)} className="h-btn h-btn-ghost h-btn-sm">Message</button>
        <HFollowButton name={c.name} size="md"/>
      </div>
    </article>
  );
}
