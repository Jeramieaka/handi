import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { HAvatar, HVerified, HNav, HFooter } from '../components/primitives';
import { REQUESTS } from './public-extras';

const DRAFT_KEY = 'handi_post_request_draft_v1';

const CITY_DISPLAY = {
  NYC: 'New York', LA: 'Los Angeles', SF: 'San Francisco',
  Boston: 'Boston', Chicago: 'Chicago', Miami: 'Miami', Seattle: 'Seattle',
  Tokyo: 'Tokyo', Osaka: 'Osaka', Kyoto: 'Kyoto', Sapporo: 'Sapporo', Fukuoka: 'Fukuoka',
  Seoul: 'Seoul', Busan: 'Busan', Incheon: 'Incheon', Jeju: 'Jeju',
  Paris: 'Paris', Nice: 'Nice', Lyon: 'Lyon', Marseille: 'Marseille',
  London: 'London', Manchester: 'Manchester', Edinburgh: 'Edinburgh', Birmingham: 'Birmingham',
};
const COUNTRY_DISPLAY = { JP: 'Japan', KR: 'South Korea', FR: 'France', GB: 'United Kingdom', US: 'United States' };
const labelFromQuery = (city, country) => {
  if (city && CITY_DISPLAY[city]) return CITY_DISPLAY[city];
  if (country && COUNTRY_DISPLAY[country]) return COUNTRY_DISPLAY[country];
  return '';
};

const readDraft = () => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
};

export function PagePostRequest() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const draft = readDraft();
  const queryFrom = labelFromQuery(searchParams.get('fromCity'), searchParams.get('fromCountry'));
  const queryTo   = labelFromQuery(searchParams.get('toCity'),   searchParams.get('toCountry'));
  // Edit mode: ?edit=<id> prefills from REQUESTS.
  const editId = searchParams.get('edit');
  const editingRequest = editId ? REQUESTS.find(r => String(r.id) === String(editId)) : null;
  const isEditing = !!editingRequest;

  const [step, setStep]       = useState(isEditing ? 0 : (draft?.step ?? 0));
  const [from, setFrom]       = useState(editingRequest?.from ?? (queryFrom || draft?.from || 'Tokyo'));
  const [to, setTo]           = useState(editingRequest?.to   ?? (queryTo   || draft?.to   || 'New York'));
  const [item, setItem]       = useState(editingRequest?.item  ?? draft?.item ?? '');
  const [store, setStore]     = useState(editingRequest?.store ?? draft?.store ?? '');
  const [link, setLink]       = useState(draft?.link ?? '');
  const [budget, setBudget]   = useState(editingRequest?.budget ? String(editingRequest.budget) : (draft?.budget ?? ''));
  const [fee, setFee]         = useState(editingRequest?.fee    ? String(editingRequest.fee)    : (draft?.fee ?? ''));
  const [urgency, setUrgency] = useState(editingRequest?.urgency ?? draft?.urgency ?? 'medium');
  const [notes, setNotes]     = useState(editingRequest?.detail ?? draft?.notes ?? '');
  const publishedRef = useRef(false);

  // Persist draft on every change.
  useEffect(() => {
    if (publishedRef.current) return;
    try {
      window.localStorage.setItem(DRAFT_KEY, JSON.stringify({
        step, from, to, item, store, link, budget, fee, urgency, notes,
      }));
    } catch {}
  }, [step, from, to, item, store, link, budget, fee, urgency, notes]);

  // Warn before leaving once user has entered details.
  useEffect(() => {
    if (step === 0 && !item) return;
    const onBeforeUnload = (e) => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [step, item]);

  const stepDefs = [
    { key: 'route',  label: 'Route',  sub: 'From → to' },
    { key: 'item',   label: 'Item',   sub: 'What to carry' },
    { key: 'budget', label: 'Budget', sub: 'Price & fee' },
    { key: 'review', label: 'Review', sub: 'Confirm & post' },
  ];

  const stepValid = [
    () => from.trim().length > 1 && to.trim().length > 1,
    () => item.trim().length > 1,
    () => Number(budget) > 0 && Number(fee) > 0,
    () => true,
  ];

  const next = () => {
    if (!stepValid[step]()) return;
    if (step < stepDefs.length - 1) {
      setStep(step + 1);
    } else {
      publishedRef.current = true;
      try { window.localStorage.removeItem(DRAFT_KEY); } catch {}
      navigate('/requests');
    }
  };

  const prev = () => {
    if (step > 0) { setStep(step - 1); return; }
    const hasProgress = item || store || link || budget || fee || notes;
    if (hasProgress && !window.confirm('Discard your request draft?')) return;
    try { window.localStorage.removeItem(DRAFT_KEY); } catch {}
    navigate(-1);
  };

  return (
    <div className="h-app" style={{ width: '100%' }}>
      <HNav active="requests"/>

      {/* Compact hero */}
      <section style={{ padding: '40px 40px 0', maxWidth: 1100, margin: '0 auto' }}>
        <div className="h-eyebrow" style={{ marginBottom: 8 }}>{isEditing ? `Editing request · #${editingRequest.id}` : 'For buyers'} · Step {step + 1} of {stepDefs.length}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 24, flexWrap: 'wrap' }}>
          <h1 className="h-display" style={{ fontSize: 44, margin: 0, lineHeight: 1.05 }}>
            {isEditing ? <>Edit <span style={{ fontStyle: 'italic', color: 'var(--rouge)' }}>request.</span></>
                       : <>Post a <span style={{ fontStyle: 'italic', color: 'var(--rouge)' }}>request.</span></>}
          </h1>
          <p style={{ fontSize: 13, color: 'var(--ink-3)', margin: 0, maxWidth: 360 }}>
            {isEditing ? 'Changes apply when you reach the review step.' : 'Free to post. Pay only when a carrier accepts and delivers.'}
          </p>
        </div>
      </section>

      {/* Stepper */}
      <div style={{ position: 'sticky', top: 73, zIndex: 30, background: 'var(--paper)', borderBottom: '1px solid var(--line)', marginTop: 24 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '16px 40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
            {stepDefs.map((s, i) => {
              const done = i < step;
              const active = i === step;
              return (
                <React.Fragment key={s.key}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                    <div style={{
                      width: 26, height: 26, borderRadius: 999,
                      background: active ? 'var(--ink)' : done ? 'var(--rouge)' : 'transparent',
                      border: '1.5px solid', borderColor: active ? 'var(--ink)' : done ? 'var(--rouge)' : 'var(--line-2)',
                      color: active || done ? 'var(--paper)' : 'var(--ink-3)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 11, fontWeight: 600, fontFamily: 'var(--font-mono)',
                      transition: 'all .3s var(--ease-out)',
                    }}>
                      {done ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8"><path d="M5 13l4 4L19 7"/></svg> : i + 1}
                    </div>
                    <span style={{
                      fontSize: 13,
                      fontWeight: active ? 600 : 400,
                      color: active ? 'var(--ink)' : done ? 'var(--ink-2)' : 'var(--ink-3)',
                      transition: 'all .3s',
                    }}>{s.label}</span>
                  </div>
                  {i < stepDefs.length - 1 && (
                    <div style={{ flex: 1, height: 2, background: 'var(--paper-3)', borderRadius: 2, margin: '0 16px', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        width: done ? '100%' : '0%',
                        background: 'var(--rouge)',
                        transition: 'width .55s var(--ease-out)',
                      }}/>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* STEP CONTENT */}
      <section style={{ padding: '48px 40px 32px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 64 }}>
          <div key={step} style={{ animation: 'h-fade-up .35s var(--ease-out) both' }}>
            {step === 0 && <StepRoute from={from} setFrom={setFrom} to={to} setTo={setTo}/>}
            {step === 1 && <StepItem item={item} setItem={setItem} store={store} setStore={setStore} link={link} setLink={setLink}/>}
            {step === 2 && <StepBudget budget={budget} setBudget={setBudget} fee={fee} setFee={setFee} urgency={urgency} setUrgency={setUrgency} notes={notes} setNotes={setNotes}/>}
            {step === 3 && <StepReview from={from} to={to} item={item} store={store} link={link} budget={budget} fee={fee} urgency={urgency} notes={notes}/>}

            {/* navigation buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 56, paddingTop: 32, borderTop: '1px solid var(--line)' }}>
              <button type="button" onClick={prev} className="h-btn h-btn-ghost">← {step === 0 ? 'Cancel' : 'Back'}</button>
              <button
                type="button"
                onClick={next}
                disabled={!stepValid[step]()}
                className="h-btn h-btn-primary h-btn-lg"
                style={{ opacity: stepValid[step]() ? 1 : 0.5, cursor: stepValid[step]() ? 'pointer' : 'not-allowed' }}
              >
                {step === stepDefs.length - 1
                  ? (isEditing ? 'Save changes →' : 'Post request →')
                  : `Continue · ${stepDefs[step+1].label} →`}
              </button>
            </div>
          </div>

          {/* Live preview */}
          <aside style={{ position: 'sticky', top: 160, alignSelf: 'flex-start' }}>
            <div className="h-eyebrow" style={{ marginBottom: 16 }}>Live preview</div>
            <div className="h-card" style={{ padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <HAvatar name="You" size={40}/>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>You <HVerified size={12}/></div>
                  <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>Buyer · Just now</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 0', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
                <div style={{ flex: 1 }}><div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--ink-3)', letterSpacing: '.06em' }}>FROM</div><div style={{ fontSize: 16, marginTop: 2 }}>{from || '—'}</div></div>
                <span style={{ color: 'var(--ink-3)' }}>→</span>
                <div style={{ flex: 1, textAlign: 'right' }}><div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--ink-3)', letterSpacing: '.06em' }}>TO</div><div style={{ fontSize: 16, marginTop: 2 }}>{to || '—'}</div></div>
              </div>
              <div style={{ marginTop: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}><span style={{ color: 'var(--ink-3)' }}>Item</span><span style={{ maxWidth: 180, textAlign: 'right' }}>{item || 'Not set'}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginTop: 6 }}><span style={{ color: 'var(--ink-3)' }}>Store</span><span style={{ maxWidth: 180, textAlign: 'right' }}>{store || '—'}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginTop: 6 }}><span style={{ color: 'var(--ink-3)' }}>Budget</span><span>{budget ? `$${budget}` : 'Not set'}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginTop: 6 }}><span style={{ color: 'var(--ink-3)' }}>Carry fee</span><span>{fee ? `$${fee}` : 'Not set'}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginTop: 6 }}><span style={{ color: 'var(--ink-3)' }}>Urgency</span><span style={{ textTransform: 'capitalize' }}>{urgency}</span></div>
              </div>
            </div>

            <div style={{ marginTop: 24, padding: 20, background: 'var(--paper-2)', borderRadius: 12 }}>
              <div className="h-eyebrow" style={{ marginBottom: 8 }}>Total to escrow</div>
              <div className="h-display" style={{ fontSize: 40 }}>${(Number(budget) || 0) + (Number(fee) || 0)}</div>
              <p style={{ fontSize: 12, color: 'var(--ink-3)', margin: '8px 0 0' }}>Held only when a carrier accepts. Released after delivery.</p>
            </div>
          </aside>
        </div>
      </section>

      <HFooter/>
    </div>
  );
}

// ─── STEP 1: Route ───────────────────────────────────
function StepRoute({ from, setFrom, to, setTo }) {
  const popularFrom = ['Tokyo', 'Seoul', 'Paris', 'London', 'New York', 'Los Angeles'];
  const popularTo   = ['New York', 'Los Angeles', 'San Francisco', 'Boston', 'Chicago', 'Tokyo'];
  return (
    <div>
      <h2 className="h-serif" style={{ fontSize: 28, margin: 0, letterSpacing: '-0.018em' }}>Where's your route?</h2>
      <p style={{ fontSize: 14, color: 'var(--ink-2)', marginTop: 8 }}>Tell us where the item is, and where you'd like it delivered. Carriers heading this way will see your request.</p>

      <div style={{ marginTop: 40, display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 16, alignItems: 'flex-end' }}>
        <Field label="From">
          <input className="h-input" value={from} onChange={e => setFrom(e.target.value)} placeholder="Tokyo"/>
        </Field>
        <span style={{ paddingBottom: 14, fontSize: 24, color: 'var(--ink-3)' }}>→</span>
        <Field label="To">
          <input className="h-input" value={to} onChange={e => setTo(e.target.value)} placeholder="New York"/>
        </Field>
      </div>

      <div style={{ marginTop: 32 }}>
        <div className="h-mono" style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 12 }}>Popular origins</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {popularFrom.map(c => <ChipPick key={c} label={c} on={from === c} onClick={() => setFrom(c)}/>)}
        </div>
      </div>

      <div style={{ marginTop: 24 }}>
        <div className="h-mono" style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 12 }}>Popular destinations</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {popularTo.map(c => <ChipPick key={c} label={c} on={to === c} onClick={() => setTo(c)}/>)}
        </div>
      </div>
    </div>
  );
}

// ─── STEP 2: Item ────────────────────────────────────
function StepItem({ item, setItem, store, setStore, link, setLink }) {
  const examples = [
    'Sezane Linen Dress',
    'Pokémon Center plushie',
    'Glossier You EDP 50ml',
    'Hario V60 02 dripper',
    'Hermès silk twilly',
  ];
  return (
    <div>
      <h2 className="h-serif" style={{ fontSize: 28, margin: 0, letterSpacing: '-0.018em' }}>What do you want carried?</h2>
      <p style={{ fontSize: 14, color: 'var(--ink-2)', marginTop: 8 }}>The clearer the description, the faster a carrier will pick it up. Include sizes, colours, or specific releases.</p>

      <div style={{ marginTop: 40, display: 'grid', gap: 16 }}>
        <Field label="Item">
          <input className="h-input" value={item} onChange={e => setItem(e.target.value)} placeholder="e.g. Sezane Linen Dress, size 36, cream"/>
        </Field>
        <Field label="Store" sub="Optional · helps the carrier locate it">
          <input className="h-input" value={store} onChange={e => setStore(e.target.value)} placeholder="Sezane flagship, Pokémon Center Shibuya"/>
        </Field>
        <Field label="Product link" sub="Optional · paste a URL if you have one">
          <input className="h-input" type="url" value={link} onChange={e => setLink(e.target.value)} placeholder="https://"/>
        </Field>
      </div>

      <div style={{ marginTop: 32 }}>
        <div className="h-mono" style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 12 }}>Frequently requested</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {examples.map(c => <ChipPick key={c} label={c} on={item === c} onClick={() => setItem(c)}/>)}
        </div>
      </div>
    </div>
  );
}

// ─── STEP 3: Budget & Urgency & Notes ─────────────────
function StepBudget({ budget, setBudget, fee, setFee, urgency, setUrgency, notes, setNotes }) {
  return (
    <div>
      <h2 className="h-serif" style={{ fontSize: 28, margin: 0, letterSpacing: '-0.018em' }}>Budget & priority</h2>
      <p style={{ fontSize: 14, color: 'var(--ink-2)', marginTop: 8 }}>The carrier purchases at retail and you pay the carry fee on top. Both are held in escrow until delivery.</p>

      <div style={{ marginTop: 40, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Field label="Item retail (USD)">
          <input
            className="h-input" inputMode="numeric"
            value={budget}
            onChange={e => setBudget(e.target.value.replace(/[^0-9]/g, ''))}
            placeholder="180"
          />
        </Field>
        <Field label="Carry fee (USD)" sub="What you'll pay the carrier">
          <input
            className="h-input" inputMode="numeric"
            value={fee}
            onChange={e => setFee(e.target.value.replace(/[^0-9]/g, ''))}
            placeholder="35"
          />
        </Field>
      </div>

      <div style={{ marginTop: 32 }}>
        <div className="h-mono" style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 12 }}>How soon do you need it?</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {[
            { v: 'low',    t: 'Flexible',     d: 'Anytime in the next month' },
            { v: 'medium', t: 'Within 2 weeks', d: 'Slight priority — most requests' },
            { v: 'high',   t: 'ASAP',         d: 'Before next available trip' },
          ].map(o => {
            const on = urgency === o.v;
            return (
              <button key={o.v} type="button" onClick={() => setUrgency(o.v)} style={{
                textAlign: 'left', padding: 16, borderRadius: 12, cursor: 'pointer',
                background: on ? 'var(--ink)' : 'var(--paper)',
                color: on ? 'var(--paper)' : 'var(--ink)',
                border: '1.5px solid', borderColor: on ? 'var(--ink)' : 'var(--line)',
                transition: 'all .25s var(--ease-out)',
                fontFamily: 'inherit',
              }}>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{o.t}</div>
                <div style={{ fontSize: 12, marginTop: 4, color: on ? 'rgba(250,248,244,.7)' : 'var(--ink-3)' }}>{o.d}</div>
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ marginTop: 32 }}>
        <Field label="Notes" sub="Size, colour, edition — anything carriers should know">
          <textarea
            className="h-input"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={4}
            placeholder="Size 36 · cream colour · must be sealed packaging…"
            style={{ resize: 'vertical', fontFamily: 'inherit' }}
          />
        </Field>
      </div>
    </div>
  );
}

// ─── STEP 4: Review ───────────────────────────────────
function StepReview({ from, to, item, store, link, budget, fee, urgency, notes }) {
  const urgencyLabel = { low: 'Flexible', medium: 'Within 2 weeks', high: 'ASAP' }[urgency] || '—';
  const summary = {
    Route: `${from} → ${to}`,
    Item: item || '—',
    Store: store || '—',
    Link: link || '—',
    Budget: budget ? `$${budget}` : '—',
    'Carry fee': fee ? `$${fee}` : '—',
    Urgency: urgencyLabel,
    Notes: notes || '—',
  };
  return (
    <div>
      <h2 className="h-serif" style={{ fontSize: 28, margin: 0, letterSpacing: '-0.018em' }}>Looks good?</h2>
      <p style={{ fontSize: 14, color: 'var(--ink-2)', marginTop: 8 }}>Carriers heading this route will see your request. You'll be notified when one offers to carry.</p>

      <div style={{ marginTop: 32, display: 'grid', gap: 12 }}>
        {Object.entries(summary).map(([k, v]) => (
          <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '12px 16px', background: 'var(--paper-2)', borderRadius: 8, gap: 24 }}>
            <span className="h-mono" style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: '.1em', textTransform: 'uppercase', flexShrink: 0, paddingTop: 1 }}>{k}</span>
            <span style={{ fontSize: 14, color: 'var(--ink)', textAlign: 'right', wordBreak: 'break-word' }}>{v}</span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 24, padding: 16, background: 'var(--rouge-soft)', border: '1px solid rgba(139,30,45,.12)', borderRadius: 8, fontSize: 13, color: 'var(--rouge-ink)', lineHeight: 1.55 }}>
        Once posted, carriers heading {from} → {to} can offer to carry. Funds only enter escrow when you accept an offer.
      </div>
    </div>
  );
}

// ─── shared bits ──────────────────────────────────────
function Field({ label, sub, children }) {
  return (
    <label style={{ display: 'block' }}>
      <div className="h-mono" style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 4 }}>{label}</div>
      {sub && <div style={{ fontSize: 12, color: 'var(--ink-3)', marginBottom: 8 }}>{sub}</div>}
      {children}
    </label>
  );
}

function ChipPick({ label, on, onClick }) {
  return (
    <button onClick={onClick} type="button" style={{
      padding: '8px 14px', borderRadius: 999, fontSize: 13, fontFamily: 'inherit', cursor: 'pointer',
      border: '1px solid', borderColor: on ? 'var(--ink)' : 'var(--line-2)',
      background: on ? 'var(--ink)' : 'var(--paper)',
      color: on ? 'var(--paper)' : 'var(--ink-2)',
      transition: 'all .2s var(--ease-out)',
    }}>
      {label}
    </button>
  );
}
