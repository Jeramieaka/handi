import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { HAvatar, HVerified, HNav, HFooter } from '../components/primitives';
import { TRIPS } from './orders-trips';

const DRAFT_KEY = 'handi_post_trip_draft_v1';

// Map a city code/name from the URL (e.g. NYC, Tokyo) to a friendly display
// label that matches what the post-trip form expects in its `from`/`to` fields.
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
  return null;
};

// Restore from localStorage if a draft exists, else use defaults.
const readDraft = () => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const d = JSON.parse(raw);
    if (Array.isArray(d.cats)) d.cats = new Set(d.cats);
    if (Array.isArray(d.handoffMethods)) d.handoffMethods = new Set(d.handoffMethods);
    return d;
  } catch { return null; }
};

export function PagePostTrip() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const draft = readDraft();
  // URL prefill takes priority over a saved draft so the landing-page route
  // search is honoured when a traveler clicks "I'm a traveler".
  const queryFrom = labelFromQuery(searchParams.get('fromCity'), searchParams.get('fromCountry'));
  const queryTo   = labelFromQuery(searchParams.get('toCity'),   searchParams.get('toCountry'));
  // Edit mode: ?edit=TR-XX prefills the wizard from a known trip and the
  // final CTA flips from "Publish" to "Save changes".
  const editId = searchParams.get('edit');
  const editingTrip = editId ? TRIPS.find(t => t.id === editId) : null;
  const isEditing = !!editingTrip;
  const [step, setStep] = useState(isEditing ? 0 : (draft?.step ?? 0));
  const [from, setFrom] = useState(editingTrip?.from ?? queryFrom ?? draft?.from ?? 'Tokyo');
  const [to, setTo]     = useState(editingTrip?.to   ?? queryTo   ?? draft?.to   ?? 'San Francisco');
  const [departure, setDeparture] = useState(editingTrip?.departure ?? draft?.departure ?? '2026-05-14');
  const [arrival, setArrival] = useState(editingTrip?.arrival ?? draft?.arrival ?? '2026-05-15');
  const [handoffWindow, setHandoffWindow] = useState(draft?.handoffWindow ?? 'week');
  const [slots, setSlots] = useState(editingTrip?.slotsTotal ?? draft?.slots ?? 4);
  const [feeMode, setFeeMode] = useState(editingTrip?.feeMode ?? draft?.feeMode ?? 'Suggested');
  const [cats, setCats] = useState(draft?.cats instanceof Set ? draft.cats : new Set(['Collectibles', 'Fashion', 'Beauty']));
  const [note, setNote] = useState(draft?.note ?? '');

  // Hand-off methods the carrier offers — buyers pick from this at checkout.
  const [handoffMethods, setHandoffMethods] = useState(draft?.handoffMethods instanceof Set ? draft.handoffMethods : new Set(['meetup', 'doorstep']));
  const [meetupSpots, setMeetupSpots] = useState(draft?.meetupSpots ?? ['SoMa · Sightglass Coffee', 'Mission · Tartine', '']);
  const [pickupAddress, setPickupAddress] = useState(draft?.pickupAddress ?? '');
  const [doorstepFee, setDoorstepFee] = useState(draft?.doorstepFee ?? 0);
  const publishedRef = useRef(false);

  // Persist draft on every change so a refresh doesn't lose progress.
  useEffect(() => {
    if (publishedRef.current) return;
    try {
      window.localStorage.setItem(DRAFT_KEY, JSON.stringify({
        step, from, to, departure, arrival, handoffWindow, slots, feeMode,
        cats: Array.from(cats), note,
        handoffMethods: Array.from(handoffMethods), meetupSpots, pickupAddress, doorstepFee,
      }));
    } catch {}
  }, [step, from, to, departure, arrival, handoffWindow, slots, feeMode, cats, note, handoffMethods, meetupSpots, pickupAddress, doorstepFee]);

  // Warn before leaving if user has progressed past step 0.
  useEffect(() => {
    if (step === 0) return;
    const onBeforeUnload = (e) => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [step]);

  const toggleCat = (t) => setCats(prev => {
    const n = new Set(prev); n.has(t) ? n.delete(t) : n.add(t); return n;
  });
  const toggleMethod = (m) => setHandoffMethods(prev => {
    const n = new Set(prev); n.has(m) ? n.delete(m) : n.add(m); return n;
  });
  const updateSpot = (i, v) => setMeetupSpots(prev => prev.map((s, idx) => idx === i ? v : s));
  const filledSpots = meetupSpots.map(s => s.trim()).filter(Boolean);

  const stepDefs = [
    { key: 'route',    label: 'Route',    sub: 'From city → to city' },
    { key: 'dates',    label: 'Dates',    sub: 'Departure & hand-off' },
    { key: 'capacity', label: 'Capacity', sub: 'Slots, categories, fee' },
    { key: 'review',   label: 'Review',   sub: 'Confirm & publish' },
  ];

  const stepValid = [
    () => from.trim().length > 1 && to.trim().length > 1,
    () => departure && arrival,
    () => (
      slots > 0 &&
      cats.size > 0 &&
      handoffMethods.size > 0 &&
      (!handoffMethods.has('meetup') || filledSpots.length > 0) &&
      (!handoffMethods.has('pickup') || pickupAddress.trim().length > 4)
    ),
    () => true,
  ];

  const next = () => {
    if (!stepValid[step]()) return;
    if (step < stepDefs.length - 1) {
      setStep(step + 1);
    } else {
      publishedRef.current = true;
      try { window.localStorage.removeItem(DRAFT_KEY); } catch {}
      navigate('/trips');
    }
  };
  const prev = () => {
    if (step > 0) {
      setStep(step - 1);
      return;
    }
    const hasProgress = note || handoffMethods.size !== 2 || cats.size !== 3 || pickupAddress;
    if (hasProgress && !window.confirm('Discard your trip draft?')) return;
    try { window.localStorage.removeItem(DRAFT_KEY); } catch {}
    navigate(-1);
  };

  return (
    <div className="h-app" style={{ width: '100%' }}>
      <HNav active="post a trip"/>

      {/* Compact hero — title + sub on one row, then a tight stepper underneath. */}
      <section style={{ padding: '40px 40px 0', maxWidth: 1100, margin: '0 auto' }}>
        <div className="h-eyebrow" style={{ marginBottom: 8 }}>{isEditing ? `Editing trip · ${editingTrip.id}` : 'For carriers'} · Step {step + 1} of {stepDefs.length}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 24, flexWrap: 'wrap' }}>
          <h1 className="h-display" style={{ fontSize: 44, margin: 0, lineHeight: 1.05 }}>
            {isEditing ? <>Edit <span style={{ fontStyle: 'italic', color: 'var(--rouge)' }}>trip.</span></>
                       : <>Post a <span style={{ fontStyle: 'italic', color: 'var(--rouge)' }}>trip.</span></>}
          </h1>
          <p style={{ fontSize: 13, color: 'var(--ink-3)', margin: 0, maxWidth: 360 }}>
            {isEditing ? 'Changes save when you reach the review step.' : 'Top carriers earn $400–$800 per route.'}
          </p>
        </div>
      </section>

      {/* Stepper — single tight row, no sub-labels, fills with progress */}
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
            {step === 1 && <StepDates departure={departure} setDeparture={setDeparture} arrival={arrival} setArrival={setArrival} handoffWindow={handoffWindow} setHandoffWindow={setHandoffWindow}/>}
            {step === 2 && <StepCapacity slots={slots} setSlots={setSlots} cats={cats} toggleCat={toggleCat} feeMode={feeMode} setFeeMode={setFeeMode} note={note} setNote={setNote} handoffMethods={handoffMethods} toggleMethod={toggleMethod} meetupSpots={meetupSpots} updateSpot={updateSpot} pickupAddress={pickupAddress} setPickupAddress={setPickupAddress} doorstepFee={doorstepFee} setDoorstepFee={setDoorstepFee}/>}
            {step === 3 && <StepReview from={from} to={to} departure={departure} arrival={arrival} handoffWindow={handoffWindow} slots={slots} cats={cats} feeMode={feeMode} note={note} handoffMethods={handoffMethods} filledSpots={filledSpots} pickupAddress={pickupAddress} doorstepFee={doorstepFee}/>}

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
                  ? (isEditing ? 'Save changes →' : 'Publish trip →')
                  : `Continue · ${stepDefs[step+1].label} →`}
              </button>
            </div>
          </div>

          {/* Live preview */}
          <aside style={{ position: 'sticky', top: 160, alignSelf: 'flex-start' }}>
            <div className="h-eyebrow" style={{ marginBottom: 16 }}>Live preview</div>
            <div className="h-card" style={{ padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <HAvatar name="Yuki Mori" size={40}/>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>Yuki M. <HVerified size={12}/></div>
                  <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>★ 4.92 · 14 trips</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 0', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
                <div style={{ flex: 1 }}><div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--ink-3)', letterSpacing: '.06em' }}>FROM</div><div style={{ fontSize: 16, marginTop: 2 }}>{from || '—'}</div></div>
                <span style={{ color: 'var(--ink-3)' }}>→</span>
                <div style={{ flex: 1, textAlign: 'right' }}><div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--ink-3)', letterSpacing: '.06em' }}>TO</div><div style={{ fontSize: 16, marginTop: 2 }}>{to || '—'}</div></div>
              </div>
              <div style={{ marginTop: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}><span style={{ color: 'var(--ink-3)' }}>Depart</span><span>{departure || 'Pick a date'}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginTop: 6 }}><span style={{ color: 'var(--ink-3)' }}>Slots</span><span>{slots} of {slots} open</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginTop: 6 }}><span style={{ color: 'var(--ink-3)' }}>Accepts</span><span>{cats.size > 0 ? Array.from(cats).slice(0, 2).join(', ') + (cats.size > 2 ? ` +${cats.size - 2}` : '') : 'Choose categories'}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginTop: 6 }}><span style={{ color: 'var(--ink-3)' }}>Fee mode</span><span>{feeMode}</span></div>
              </div>
            </div>

            <div style={{ marginTop: 24, padding: 20, background: 'var(--paper-2)', borderRadius: 12 }}>
              <div className="h-eyebrow" style={{ marginBottom: 8 }}>Estimated earnings</div>
              <div className="h-display" style={{ fontSize: 40 }}>${slots * 35} – ${slots * 65}</div>
              <p style={{ fontSize: 12, color: 'var(--ink-3)', margin: '8px 0 0' }}>Based on similar {from} → {to} trips, last 30 days</p>
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
  const popularFrom = ['Tokyo', 'Seoul', 'Paris', 'London', 'New York', 'Singapore'];
  const popularTo = ['New York', 'Los Angeles', 'San Francisco', 'Boston', 'Toronto', 'Tokyo'];
  return (
    <div>
      <h2 className="h-serif" style={{ fontSize: 28, margin: 0, letterSpacing: '-0.018em' }}>Where are you flying?</h2>
      <p style={{ fontSize: 14, color: 'var(--ink-2)', marginTop: 8 }}>This is the route you'll match with buyers on. You can post separate trips for return legs.</p>

      <div style={{ marginTop: 40, display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 16, alignItems: 'flex-end' }}>
        <Field label="From">
          <input className="h-input" value={from} onChange={e => setFrom(e.target.value)} placeholder="Tokyo"/>
        </Field>
        <span style={{ paddingBottom: 14, fontSize: 24, color: 'var(--ink-3)' }}>→</span>
        <Field label="To">
          <input className="h-input" value={to} onChange={e => setTo(e.target.value)} placeholder="San Francisco"/>
        </Field>
      </div>

      <div style={{ marginTop: 32 }}>
        <div className="h-mono" style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 12 }}>Popular departure cities</div>
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

// ─── STEP 2: Dates ────────────────────────────────────
function StepDates({ departure, setDeparture, arrival, setArrival, handoffWindow, setHandoffWindow }) {
  return (
    <div>
      <h2 className="h-serif" style={{ fontSize: 28, margin: 0, letterSpacing: '-0.018em' }}>When are you going?</h2>
      <p style={{ fontSize: 14, color: 'var(--ink-2)', marginTop: 8 }}>Buyers see your departure date so they know when to expect their item.</p>

      <div style={{ marginTop: 40, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Field label="Departure">
          <input className="h-input" type="date" value={departure} onChange={e => setDeparture(e.target.value)}/>
        </Field>
        <Field label="Arrival">
          <input className="h-input" type="date" value={arrival} onChange={e => setArrival(e.target.value)}/>
        </Field>
      </div>

      <div style={{ marginTop: 32 }}>
        <div className="h-mono" style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 12 }}>Hand-off window after arrival</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {[
            { v: '24h', t: 'Within 24h', d: 'Express delivery — premium fee' },
            { v: 'week', t: '1 week', d: 'Standard window — most carriers' },
            { v: '2week', t: '2 weeks', d: 'Flexible — locals & visitors' },
          ].map(o => {
            const on = handoffWindow === o.v;
            return (
              <button key={o.v} onClick={() => setHandoffWindow(o.v)} style={{
                padding: 18, textAlign: 'left', borderRadius: 12, cursor: 'pointer',
                border: '1px solid', borderColor: on ? 'var(--ink)' : 'var(--line-2)',
                background: on ? 'var(--paper-2)' : 'transparent',
                transition: 'all .3s var(--ease-out)',
                fontFamily: 'inherit',
              }}>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{o.t}</div>
                <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 6 }}>{o.d}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── STEP 3: Capacity ─────────────────────────────────
function StepCapacity({ slots, setSlots, cats, toggleCat, feeMode, setFeeMode, note, setNote, handoffMethods, toggleMethod, meetupSpots, updateSpot, pickupAddress, setPickupAddress, doorstepFee, setDoorstepFee }) {
  return (
    <div>
      <h2 className="h-serif" style={{ fontSize: 28, margin: 0, letterSpacing: '-0.018em' }}>How much can you carry?</h2>
      <p style={{ fontSize: 14, color: 'var(--ink-2)', marginTop: 8 }}>Buyers see this as your available slots. You can decline any request.</p>

      <div style={{ marginTop: 40, display: 'grid', gap: 28 }}>
        {/* Slots */}
        <div>
          <label className="h-mono" style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: '.1em', textTransform: 'uppercase' }}>Carry slots</label>
          <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
            {[2, 4, 6, 8, 10].map(n => (
              <button key={n} onClick={() => setSlots(n)} style={{
                flex: 1, padding: '20px 0', border: '1px solid', borderColor: n === slots ? 'var(--ink)' : 'var(--line-2)',
                background: n === slots ? 'var(--ink)' : 'transparent',
                color: n === slots ? 'var(--paper)' : 'var(--ink)',
                borderRadius: 12, fontSize: 18, fontFamily: 'var(--font-serif)', cursor: 'pointer',
                transition: 'all .3s var(--ease-out)',
              }}>{n}</button>
            ))}
          </div>
          <p className="h-mono" style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 12, letterSpacing: '.06em' }}>1 SLOT ≈ 1 KG / SMALL ITEM</p>
        </div>

        {/* Categories */}
        <div>
          <label className="h-mono" style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: '.1em', textTransform: 'uppercase' }}>Categories you'll accept</label>
          <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {[['🎁','Collectibles'], ['👗','Fashion'], ['🍫','Food'], ['💄','Beauty'], ['📚','Books'], ['🏠','Home'], ['💎','Luxury'], ['🚫','No food/liquids']].map(([e, t]) => {
              const on = cats.has(t);
              return <CatPill key={t} icon={e} label={t} on={on} onClick={() => toggleCat(t)}/>;
            })}
          </div>
        </div>

        {/* Fee mode */}
        <div>
          <label className="h-mono" style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: '.1em', textTransform: 'uppercase' }}>Carry fee strategy</label>
          <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              { t: 'Suggested', d: '15–20% of retail (recommended)' },
              { t: 'Fixed per item', d: 'You set $ per item, e.g. $25 flat' },
            ].map(o => {
              const on = feeMode === o.t;
              return (
                <button type="button" key={o.t} onClick={() => setFeeMode(o.t)} style={{
                  padding: 20, border: '1px solid', borderRadius: 12, cursor: 'pointer',
                  borderColor: on ? 'var(--ink)' : 'var(--line-2)',
                  background: on ? 'var(--paper-2)' : 'transparent',
                  transition: 'all .3s var(--ease-out)', textAlign: 'left',
                  fontFamily: 'inherit',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 500, fontSize: 14 }}>{o.t}</span>
                    <span style={{ width: 16, height: 16, borderRadius: 999, border: '1.5px solid var(--ink)', background: on ? 'var(--ink)' : 'transparent', position: 'relative', transition: 'background .3s' }}>
                      {on && <span style={{ position: 'absolute', inset: 4, borderRadius: 999, background: 'var(--paper)' }}/>}
                    </span>
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 8, marginBottom: 0 }}>{o.d}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Hand-off methods */}
        <div>
          <label className="h-mono" style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: '.1em', textTransform: 'uppercase' }}>Hand-off methods you offer</label>
          <p style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 4 }}>Buyers will pick one of these at checkout. Pick at least one.</p>
          <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {[
              { v: 'meetup',   icon: '👋', t: 'Meetup',   d: '面交 — pick a public spot' },
              { v: 'doorstep', icon: '🏠', t: 'Doorstep', d: 'You drop at buyer\'s address' },
              { v: 'pickup',   icon: '📦', t: 'Buyer pickup', d: 'Buyer comes to you' },
            ].map(o => {
              const on = handoffMethods.has(o.v);
              return (
                <button type="button" key={o.v} onClick={() => toggleMethod(o.v)} style={{
                  padding: 16, textAlign: 'left', borderRadius: 12, cursor: 'pointer',
                  border: '1px solid', borderColor: on ? 'var(--ink)' : 'var(--line-2)',
                  background: on ? 'var(--paper-2)' : 'transparent',
                  transition: 'all .25s var(--ease-out)',
                  fontFamily: 'inherit',
                  position: 'relative',
                }}>
                  <div style={{ position: 'absolute', top: 12, right: 12, width: 16, height: 16, borderRadius: 4, border: '1.5px solid', borderColor: on ? 'var(--ink)' : 'var(--line-2)', background: on ? 'var(--ink)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {on && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--paper)" strokeWidth="3"><path d="M5 13l4 4L19 7"/></svg>}
                  </div>
                  <div style={{ fontSize: 18, marginBottom: 6 }}>{o.icon}</div>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{o.t}</div>
                  <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 4, lineHeight: 1.45 }}>{o.d}</div>
                </button>
              );
            })}
          </div>

          {/* Meetup spots — only when meetup is on */}
          {handoffMethods.has('meetup') && (
            <div style={{ marginTop: 16, padding: 18, background: 'var(--paper-2)', borderRadius: 12 }}>
              <div className="h-mono" style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: '.08em' }}>MEETUP SPOTS YOU OFFER</div>
              <p style={{ fontSize: 12, color: 'var(--ink-3)', margin: '4px 0 12px' }}>Buyers pick one of these at checkout. Add 1–3 public spots near your route.</p>
              <div style={{ display: 'grid', gap: 8 }}>
                {meetupSpots.map((s, i) => (
                  <input key={i} className="h-input" value={s} onChange={e => updateSpot(i, e.target.value)} placeholder={i === 0 ? 'Required · e.g. Williamsburg · Devoción Coffee' : 'Optional · another spot'}/>
                ))}
              </div>
            </div>
          )}

          {/* Pickup address — only when buyer pickup is on */}
          {handoffMethods.has('pickup') && (
            <div style={{ marginTop: 12, padding: 18, background: 'var(--paper-2)', borderRadius: 12 }}>
              <div className="h-mono" style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: '.08em' }}>YOUR PICKUP ADDRESS</div>
              <p style={{ fontSize: 12, color: 'var(--ink-3)', margin: '4px 0 12px' }}>Where buyers come to collect their item.</p>
              <input className="h-input" value={pickupAddress} onChange={e => setPickupAddress(e.target.value)} placeholder="123 Main St · Apt 2B · City, ST 12345"/>
            </div>
          )}

          {/* Doorstep fee — only when doorstep is on */}
          {handoffMethods.has('doorstep') && (
            <div style={{ marginTop: 12, padding: 18, background: 'var(--paper-2)', borderRadius: 12 }}>
              <div className="h-mono" style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: '.08em' }}>DOORSTEP DELIVERY FEE</div>
              <p style={{ fontSize: 12, color: 'var(--ink-3)', margin: '4px 0 12px' }}>Charged on top of the carry fee. Set $0 if you offer it free.</p>
              <div style={{ display: 'flex', gap: 8 }}>
                {[0, 5, 8, 12, 20].map(v => (
                  <button type="button" key={v} onClick={() => setDoorstepFee(v)} style={{
                    flex: 1, padding: '10px 0', borderRadius: 10, fontSize: 13, fontFamily: 'inherit',
                    border: '1px solid', borderColor: v === doorstepFee ? 'var(--ink)' : 'var(--line-2)',
                    background: v === doorstepFee ? 'var(--ink)' : 'transparent',
                    color: v === doorstepFee ? 'var(--paper)' : 'var(--ink)', cursor: 'pointer',
                  }}>{v === 0 ? 'Free' : `$${v}`}</button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Notes */}
        <div>
          <label className="h-mono" style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: '.1em', textTransform: 'uppercase' }}>Note to buyers (optional)</label>
          <textarea className="h-input" rows="3" value={note} onChange={e => setNote(e.target.value)} placeholder="e.g. I'll be near Shibuya & Akihabara. Happy to do quick pickups." style={{ marginTop: 12, resize: 'vertical', minHeight: 88 }}/>
        </div>
      </div>
    </div>
  );
}

// ─── STEP 4: Review ───────────────────────────────────
function StepReview({ from, to, departure, arrival, handoffWindow, slots, cats, feeMode, note, handoffMethods, filledSpots, pickupAddress, doorstepFee }) {
  const handoffLabels = { '24h': 'Within 24h of arrival', 'week': '1 week after arrival', '2week': '2 weeks after arrival' };
  const methodLabels = { meetup: 'Meetup', doorstep: 'Doorstep', pickup: 'Buyer pickup' };
  const methodsSummary = Array.from(handoffMethods).map(m => methodLabels[m]).join(' · ') || 'None selected';
  return (
    <div>
      <h2 className="h-serif" style={{ fontSize: 28, margin: 0, letterSpacing: '-0.018em' }}>Review and publish.</h2>
      <p style={{ fontSize: 14, color: 'var(--ink-2)', marginTop: 8 }}>Buyers will see this immediately. You can edit or pause your trip anytime.</p>

      <div style={{ marginTop: 32, display: 'grid', gap: 12 }}>
        {[
          ['Route',     `${from} → ${to}`],
          ['Departure', departure],
          ['Arrival',   arrival],
          ['Window',    handoffLabels[handoffWindow] || handoffWindow],
          ['Slots',     `${slots} carry slots`],
          ['Accepting', cats.size > 0 ? Array.from(cats).join(' · ') : 'No categories selected'],
          ['Fee mode',  feeMode],
          ['Hand-off methods', methodsSummary],
          ...(handoffMethods.has('meetup') ? [['Meetup spots', filledSpots.length ? filledSpots.join(' · ') : '—']] : []),
          ...(handoffMethods.has('pickup') ? [['Pickup address', pickupAddress || '—']] : []),
          ...(handoffMethods.has('doorstep') ? [['Doorstep fee', doorstepFee === 0 ? 'Free' : `$${doorstepFee}`]] : []),
          ...(note ? [['Note', note]] : []),
        ].map(([k, v]) => (
          <div key={k} style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: 24, padding: '14px 0', borderBottom: '1px solid var(--line)' }}>
            <span className="h-mono" style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: '.1em', textTransform: 'uppercase' }}>{k}</span>
            <span style={{ fontSize: 14, color: 'var(--ink)' }}>{v}</span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 24, padding: 16, background: 'var(--rouge-soft)', border: '1px solid rgba(139,30,45,.12)', borderRadius: 8, fontSize: 13, color: 'var(--rouge-ink)', lineHeight: 1.55 }}>
        Once published, buyers heading these cities can claim a slot and pay into escrow. You'll get a notification on every claim and can accept or decline.
      </div>
    </div>
  );
}

// ─── Animated category pill ───────────────────────────
function CatPill({ icon, label, on, onClick }) {
  return (
    <button onClick={onClick} style={{
      position: 'relative', overflow: 'hidden',
      display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 16px',
      borderRadius: 999, border: '1px solid', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit',
      borderColor: on ? 'var(--ink)' : 'var(--line-2)',
      background: on ? 'var(--ink)' : 'var(--paper)',
      color: on ? 'var(--paper)' : 'var(--ink-2)',
      transition: 'border-color .3s var(--ease-out), color .3s var(--ease-out), transform .15s, box-shadow .3s',
      boxShadow: on ? '0 4px 14px rgba(26,23,20,.18)' : 'none',
    }}
    onMouseEnter={(e) => { if (!on) e.currentTarget.style.borderColor = 'var(--ink-3)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
    onMouseLeave={(e) => { e.currentTarget.style.borderColor = on ? 'var(--ink)' : 'var(--line-2)'; e.currentTarget.style.transform = ''; }}
    >
      {/* gradient sweep that fades in when active */}
      <span aria-hidden="true" style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(135deg, var(--ink) 0%, var(--rouge-deep) 100%)',
        opacity: on ? 1 : 0,
        transition: 'opacity .35s var(--ease-out)',
        pointerEvents: 'none',
      }}/>
      <span style={{ position: 'relative', zIndex: 1 }}>{icon}</span>
      <span style={{ position: 'relative', zIndex: 1 }}>{label}</span>
    </button>
  );
}

// ─── Generic chip for popular cities ──────────────────
function ChipPick({ label, on, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: '8px 14px', borderRadius: 999, border: '1px solid', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit',
      borderColor: on ? 'var(--ink)' : 'var(--line-2)',
      background: on ? 'var(--ink)' : 'var(--paper)',
      color: on ? 'var(--paper)' : 'var(--ink-2)',
      transition: 'all .25s var(--ease-out)',
    }}>{label}</button>
  );
}

// ─── Field wrapper ────────────────────────────────────
function Field({ label, children, style }) {
  return (
    <label style={{ display: 'block', ...style }}>
      <span className="h-mono" style={{ display: 'block', fontSize: 11, color: 'var(--ink-3)', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 6 }}>{label}</span>
      {children}
    </label>
  );
}
