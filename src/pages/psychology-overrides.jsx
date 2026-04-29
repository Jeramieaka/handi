import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { HD } from '../data/sample';
import { HAvatar, HStars, HFlag, HVerified, HNav, HFooter, HSectionHead, HItemCard, HEmpty, HFollowButton } from '../components/primitives';
import { addToCart } from '../cart';
import { HHoldTimer, HCarrierTrust, HAnchorPrice, HMicroSave, HSlotBar } from '../components/psychology';
import { HeroSplitLayout } from '../components/hero-split-layout';
import { CountUp, TiltCard, StaggerText, MagneticButton } from '../components/motion';
import { PageBrowse } from './browse';
import { PageItemDetail } from './item-detail';
import { HScrollReveal, PageLanding } from './landing';

// handi — Psychology v2 overrides
// Re-defines PageLanding, PageBrowse, PageItemDetail with psych devices baked in.
// Loaded AFTER the originals so window.PageX gets overwritten.

// Country options for the route search bar.
const COUNTRIES = [
  { code: 'all', name: 'Anywhere',       flag: '🌍' },
  { code: 'JP',  name: 'Japan',          flag: '🇯🇵' },
  { code: 'KR',  name: 'South Korea',    flag: '🇰🇷' },
  { code: 'FR',  name: 'France',         flag: '🇫🇷' },
  { code: 'GB',  name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'US',  name: 'United States',  flag: '🇺🇸' },
];

// Map item.from / item.to city names to ISO country codes for filtering.
// TODO(post-backend): replace with real geocoding once carriers' routes have lat/lng.
const CITY_TO_COUNTRY = {
  Tokyo: 'JP', Osaka: 'JP', Kyoto: 'JP', Sapporo: 'JP', Fukuoka: 'JP',
  Seoul: 'KR', Busan: 'KR', Incheon: 'KR', Jeju: 'KR',
  Paris: 'FR', Nice: 'FR', Lyon: 'FR', Marseille: 'FR',
  London: 'GB', Manchester: 'GB', Edinburgh: 'GB', Birmingham: 'GB',
  NYC: 'US', 'New York': 'US', LA: 'US', SF: 'US', Boston: 'US', Chicago: 'US', Miami: 'US', Seattle: 'US',
};

// Cities under each country shown in the route picker.
// `code` is what we match against item.from / item.to (often abbreviated like NYC, LA, SF).
const CITIES_BY_COUNTRY = {
  JP: [{ code: 'Tokyo',     name: 'Tokyo' },     { code: 'Osaka',     name: 'Osaka' },         { code: 'Kyoto',  name: 'Kyoto' }, { code: 'Sapporo', name: 'Sapporo' }, { code: 'Fukuoka', name: 'Fukuoka' }],
  KR: [{ code: 'Seoul',     name: 'Seoul' },     { code: 'Busan',     name: 'Busan' },         { code: 'Incheon',name: 'Incheon' },{ code: 'Jeju',    name: 'Jeju' }],
  FR: [{ code: 'Paris',     name: 'Paris' },     { code: 'Nice',      name: 'Nice' },          { code: 'Lyon',   name: 'Lyon' },  { code: 'Marseille', name: 'Marseille' }],
  GB: [{ code: 'London',    name: 'London' },    { code: 'Manchester',name: 'Manchester' },    { code: 'Edinburgh', name: 'Edinburgh' }, { code: 'Birmingham', name: 'Birmingham' }],
  US: [{ code: 'NYC',       name: 'New York' },  { code: 'LA',        name: 'Los Angeles' },   { code: 'SF',     name: 'San Francisco' }, { code: 'Boston', name: 'Boston' }, { code: 'Chicago', name: 'Chicago' }, { code: 'Miami', name: 'Miami' }, { code: 'Seattle', name: 'Seattle' }],
};

// Best-effort location guess from the browser's timezone — no network call required.
const guessLocation = () => {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    if (tz.startsWith('America/')) return { code: 'US', zip: '10001' };
    if (tz === 'Asia/Tokyo')       return { code: 'JP', zip: '100-0001' };
    if (tz === 'Asia/Seoul')       return { code: 'KR', zip: '04524' };
    if (tz === 'Europe/Paris')     return { code: 'FR', zip: '75001' };
    if (tz === 'Europe/London')    return { code: 'GB', zip: 'EC1A 1BB' };
  } catch {}
  return { code: 'US', zip: '10001' };
};

// ─── Enhanced item card with anchor + save ──────────────
export function HItemCardPsy({ item }) {
  // TODO(post-backend): replace synthetic 1.45x anchor with a real
  // localResalePrice on the item data; until then this is a placeholder so
  // the anchor visually exists during the prototype.
  const localResale = Math.round((item.retail + item.fee) * 1.45);
  const handiTotal = item.retail + item.fee;
  const slotsTaken = item.slotsTotal - (item.slots || 0);
  const slotsTotal = item.slotsTotal || 5;

  return (
    <Link to={`/item/${item.id}`} className="h-card h-card-hover" style={{ background: 'var(--paper)', borderRadius: 'var(--r-lg)', overflow: 'hidden', cursor: 'pointer', display: 'flex', flexDirection: 'column', textDecoration: 'none', color: 'inherit' }}>
      <div className="h-zoom-frame" style={{ position: 'relative', aspectRatio: '1' }}>
        <img src={item.img} alt={item.title} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
        <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-start' }}>
          {item.tag && <span className="h-chip h-chip-noir" style={{ fontSize: 10, fontFamily: 'var(--font-mono)', letterSpacing: '.08em', textTransform: 'uppercase' }}>{item.tag}</span>}
        </div>
        <div style={{ position: 'absolute', top: 12, right: 12 }} onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
          <HMicroSave size="sm" initialCount={Math.floor(Math.random() * 40) + 8} label=""/>
        </div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '12px', background: 'linear-gradient(to top, rgba(0,0,0,.6), transparent)', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', letterSpacing: '.12em', textTransform: 'uppercase', opacity: .8 }}>{item.from} → {item.to}</div>
            <div style={{ fontSize: 12, marginTop: 2, opacity: .9 }}>Departs {item.departs}</div>
          </div>
          {item.viewers && <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', opacity: .85, display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 5, height: 5, borderRadius: 999, background: 'var(--rouge)' }}/>{item.viewers} viewing</span>}
        </div>
      </div>

      <div style={{ padding: 18, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 11, color: 'var(--ink-3)', fontFamily: 'var(--font-mono)', letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 4 }}>{item.store}</div>
          <h3 style={{ fontSize: 15, margin: 0, fontWeight: 500, lineHeight: 1.3, letterSpacing: '-0.01em', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.title}</h3>
        </div>

        {/* Anchor row */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 10 }}>
          <span className="h-serif" style={{ fontSize: 18 }}>${handiTotal}</span>
          <span style={{ fontSize: 12, color: 'var(--ink-3)', textDecoration: 'line-through' }}>${localResale}</span>
          <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--rouge-deep)', letterSpacing: '.06em' }}>SAVE ${localResale - handiTotal}</span>
        </div>

        {/* Slot bar */}
        <div style={{ marginBottom: 12 }}>
          <HSlotBar taken={slotsTaken} total={slotsTotal} label="reserved"/>
        </div>

        {/* Carrier strip */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 12, borderTop: '1px solid var(--line)', marginTop: 'auto' }}>
          <HAvatar name={item.carrier} size={22} />
          <div style={{ fontSize: 12, color: 'var(--ink-2)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <HVerified size={11}/>
            {item.carrier} <span style={{ color: 'var(--ink-3)' }}>· ★{item.rating}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

// Override the global card so Landing/Browse/Detail all pick it up

// Flat list of every (city, country) pair we have on file — used by the hero
// typeahead to suggest routes as the user types.
const ALL_CITY_OPTIONS = (() => {
  const list = [];
  for (const [countryCode, cities] of Object.entries(CITIES_BY_COUNTRY)) {
    const country = COUNTRIES.find(c => c.code === countryCode);
    if (!country) continue;
    for (const city of cities) {
      list.push({
        code: city.code,
        cityName: city.name,
        countryCode,
        countryName: country.name,
        flag: country.flag,
      });
    }
  }
  return list;
})();

// Country-only list for the first level of the picker.
const COUNTRY_OPTIONS = COUNTRIES.filter(c => c.code !== 'all').map(c => ({
  countryCode: c.code,
  countryName: c.name,
  flag: c.flag,
  cityCount: (CITIES_BY_COUNTRY[c.code] || []).length,
}));

// ─── CityAutocomplete — two-level picker: country first, then cities ──────────
// View states:
//   - 'countries': empty input, no country picked → list countries
//   - 'cities':    a country is opened → list its cities (with back row)
//   - flat search: as soon as the user types, ignore views and search across
//                  all cities + countries
function CityAutocomplete({ label, sub, value, onChange, placeholder, accent = 'var(--ink)' }) {
  const [query, setQuery]               = useState('');
  const [open, setOpen]                 = useState(false);
  const [hover, setHover]               = useState(0);
  const [openCountry, setOpenCountry]   = useState(null); // countryCode | null
  // 'in' = drilled into a country, 'back' = popped back, 'none' = first paint
  const [direction, setDirection]       = useState('none');
  // While true, dropdown stays mounted but plays the close keyframe.
  const [closing, setClosing]           = useState(false);
  const wrapRef = useRef(null);

  // Sync the visible query when an external selection comes in.
  useEffect(() => {
    if (value) setQuery(`${value.cityName}, ${value.countryName}`);
    else setQuery('');
  }, [value]);

  // Close on outside click.
  useEffect(() => {
    const onDown = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  // While the close animation is playing, freeze the view so the inner panel
  // doesn't re-mount into "search" results just because we filled the query
  // with the picked label (e.g. "Tokyo, Japan"). That re-mount would race
  // against the close fade-out and visually swallow it.
  const isSearching = query.trim().length > 0 && !closing;

  // Items shown depend on view state.
  const items = useMemo(() => {
    // Freeze on the previous view (no re-filter) while the close animation runs.
    const q = closing ? '' : query.trim().toLowerCase();
    if (q) {
      // Flat search: surface matching countries first (as drill-in entries),
      // then matching cities. Lets the user pick "France" as a region OR a
      // specific city like "Paris, France".
      const countryHits = COUNTRY_OPTIONS.filter(c =>
        c.countryName.toLowerCase().includes(q) ||
        c.countryCode.toLowerCase() === q
      ).map(c => ({ kind: 'country', ...c }));
      const cityHits = ALL_CITY_OPTIONS.filter(c =>
        c.cityName.toLowerCase().includes(q) ||
        c.countryName.toLowerCase().includes(q) ||
        c.countryCode.toLowerCase() === q ||
        c.code.toLowerCase().includes(q)
      ).map(c => ({ kind: 'city', ...c }));
      return [...countryHits, ...cityHits].slice(0, 8);
    }
    if (openCountry) {
      // City-level for one country.
      const country = COUNTRIES.find(c => c.code === openCountry);
      return (CITIES_BY_COUNTRY[openCountry] || []).map(city => ({
        kind: 'city',
        code: city.code,
        cityName: city.name,
        countryCode: openCountry,
        countryName: country.name,
        flag: country.flag,
      }));
    }
    // Default: country list.
    return COUNTRY_OPTIONS.map(c => ({ kind: 'country', ...c }));
  }, [query, openCountry, closing]);

  const select = (item) => {
    if (item.kind === 'country') {
      setDirection('in');
      setOpenCountry(item.countryCode);
      // -1 means "no row pre-highlighted"; mouse-enter or arrow keys take over.
      setHover(-1);
      return;
    }
    // City selection: commit value + run a quick close animation, then unmount.
    onChange(item);
    setQuery(`${item.cityName}, ${item.countryName}`);
    setClosing(true);
    setTimeout(() => {
      setOpen(false);
      setClosing(false);
      setOpenCountry(null);
      setDirection('none');
    }, 240);
  };

  const clear = (e) => {
    e.stopPropagation();
    onChange(null);
    setQuery('');
    setOpenCountry(null);
    setDirection('none');
    setOpen(true);
  };

  const goBackToCountries = () => {
    setDirection('back');
    setOpenCountry(null);
    setHover(-1);
  };

  const handleKey = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setOpen(true); setHover(h => Math.min(h + 1, items.length - 1)); }
    else if (e.key === 'ArrowUp')   { e.preventDefault(); setHover(h => Math.max(h - 1, 0)); }
    else if (e.key === 'Enter' && open && items[hover]) { e.preventDefault(); select(items[hover]); }
    else if (e.key === 'Escape')    { setOpen(false); setOpenCountry(null); }
    else if (e.key === 'Backspace' && !query && openCountry) {
      e.preventDefault(); goBackToCountries();
    }
  };

  // Header inside the dropdown: shows country name + back arrow when a
  // country is opened, or a quiet "Pick a country" hint otherwise.
  const showCountryHeader = !isSearching && openCountry;
  const showCountriesHint = !isSearching && !openCountry;

  return (
    <div ref={wrapRef} style={{ position: 'relative', flex: '1 1 0', minWidth: 0 }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        background: '#fff', border: `1px solid ${open || value ? accent : 'var(--line)'}`,
        borderRadius: 12, padding: '10px 14px',
        boxShadow: open ? '0 8px 22px rgba(26,23,20,.08)' : '0 1px 2px rgba(26,23,20,.03)',
        transition: 'border-color .2s, box-shadow .25s',
      }}>
        <span style={{ fontSize: 18, lineHeight: 1, opacity: value ? 1 : 0.5 }} aria-hidden="true">
          {value ? value.flag : '🌍'}
        </span>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
          <span className="h-mono" style={{ fontSize: 9, color: 'var(--ink-3)', letterSpacing: '.14em', fontWeight: 600 }}>
            {label}
            {sub && <span style={{ fontWeight: 400, marginLeft: 6, opacity: .7 }}>· {sub}</span>}
          </span>
          <input
            value={query}
            onChange={(e) => { setQuery(e.target.value); setOpen(true); setHover(0); }}
            onFocus={() => setOpen(true)}
            onKeyDown={handleKey}
            placeholder={placeholder}
            aria-label={label}
            style={{
              border: 'none', outline: 'none', background: 'transparent',
              fontFamily: 'inherit', fontSize: 15, fontWeight: 500, color: 'var(--ink)',
              padding: 0, marginTop: 2, width: '100%',
            }}
          />
        </div>
        {value && (
          <button
            type="button" onClick={clear} aria-label="Clear"
            style={{
              border: 'none', background: 'var(--paper-2)', color: 'var(--ink-3)',
              width: 22, height: 22, borderRadius: 999, cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, fontSize: 12,
            }}
          >×</button>
        )}
      </div>

      {open && (
        <div
          onWheel={(e) => e.stopPropagation()}
          // Stop mousedown from reaching the document-level outside-click
          // listener. Without this, when a row re-mounts via key change the
          // event target may have detached, breaking contains() checks.
          onMouseDown={(e) => e.stopPropagation()}
          style={{
            position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 200,
            background: '#fff', border: '1px solid var(--line)', borderRadius: 12,
            boxShadow: '0 12px 32px rgba(26,23,20,.14), 0 2px 6px rgba(26,23,20,.06)',
            maxHeight: 360, overflowY: 'auto', overscrollBehavior: 'contain',
            // Hide horizontal overflow during the slide so the panel doesn't peek out.
            overflowX: 'hidden',
            transformOrigin: 'top center',
            animation: closing
              ? 'h-dropdown-out .24s var(--ease-out) both'
              : 'h-dropdown-in .2s var(--ease-out) both',
            // Block further interaction once the close animation kicks off.
            pointerEvents: closing ? 'none' : 'auto',
          }}
        >
          {/* Animated content panel — re-keys only when the VIEW changes
             (countries / cities-XX / search). Within search, the query
             updates content without re-mounting so each keystroke doesn't
             retrigger the slide animation. */}
          <div
            key={isSearching ? 'search' : (openCountry ? `cities-${openCountry}` : 'countries')}
            style={{
              animation: `${direction === 'back' ? 'h-drill-back' : 'h-drill-in'} .26s var(--ease-out) both`,
            }}
          >
            {showCountriesHint && (
              <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--line)', background: 'var(--paper-2)' }}>
                <span className="h-mono" style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: '.14em' }}>
                  PICK A COUNTRY · OR TYPE TO SEARCH
                </span>
              </div>
            )}

            {showCountryHeader && (() => {
              const country = COUNTRIES.find(c => c.code === openCountry);
              return (
                <button
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); goBackToCountries(); }}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 16px', border: 'none', background: 'var(--paper-2)',
                    cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit',
                    color: 'var(--ink-2)', borderBottom: '1px solid var(--line)',
                    fontSize: 12,
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                  <span style={{ fontSize: 18 }} aria-hidden="true">{country?.flag}</span>
                  <span style={{ fontWeight: 500, color: 'var(--ink)' }}>{country?.name}</span>
                  <span className="h-mono" style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: '.1em', marginLeft: 'auto' }}>BACK</span>
                </button>
              );
            })()}

            {items.length === 0 && (
              <div style={{ padding: 24, textAlign: 'center', fontSize: 13, color: 'var(--ink-3)' }}>
                No matches for "{query}"
              </div>
            )}

            {items.map((c, i) => {
              const isLast = i === items.length - 1;
              return (
                <button
                  key={c.kind === 'country' ? `country-${c.countryCode}` : `${c.countryCode}-${c.code}`}
                  type="button"
                  className="h-dropdown-row"
                  data-hover={hover === i ? 'true' : undefined}
                  onMouseEnter={() => setHover(i)}
                  onMouseDown={(e) => { e.preventDefault(); select(c); }}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                    padding: '12px 16px', border: 'none',
                    cursor: 'pointer', textAlign: 'left',
                    fontFamily: 'inherit', color: 'var(--ink)',
                    borderBottom: isLast ? 'none' : '1px solid var(--line)',
                    transition: 'background .15s',
                  }}
                >
                  <span style={{ fontSize: 18, flexShrink: 0 }} aria-hidden="true">{c.flag}</span>
                  <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1 }}>
                    {c.kind === 'country' ? (
                      <>
                        <span style={{ fontSize: 14, fontWeight: 500 }}>{c.countryName}</span>
                        <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>{c.cityCount} {c.cityCount === 1 ? 'city' : 'cities'}</span>
                      </>
                    ) : (
                      <>
                        <span style={{ fontSize: 14, fontWeight: 500 }}>{c.cityName}</span>
                        {isSearching && <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>{c.countryName}</span>}
                      </>
                    )}
                  </div>
                  {c.kind === 'country' && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--ink-3)" strokeWidth="2" style={{ flexShrink: 0 }}>
                      <path d="M9 18l6-6-6-6"/>
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── HeroRouteSearch — typeahead From → To with two CTAs (buyer / traveler) ───
function HeroRouteSearch() {
  const navigate = useNavigate();
  const [from, setFrom] = useState(null);
  const [to, setTo]     = useState(null);

  const buildQuery = () => {
    const q = new URLSearchParams();
    if (from) { q.set('fromCountry', from.countryCode); q.set('fromCity', from.code); }
    if (to)   { q.set('toCountry',   to.countryCode);   q.set('toCity',   to.code); }
    const s = q.toString();
    return s ? `?${s}` : '';
  };

  const goBuyer    = () => navigate(`/browse${buildQuery()}`);
  const goTraveler = () => navigate(`/post-trip${buildQuery()}`);

  return (
    <div style={{ marginTop: 24 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <CityAutocomplete
          label="FROM" sub="Origin"
          value={from} onChange={setFrom}
          placeholder="Tokyo, Paris, NYC…"
          accent="var(--ink)"
        />
        <span aria-hidden="true" style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: 36, height: 36, marginTop: 18, borderRadius: 999, flexShrink: 0,
          background: 'var(--rouge-soft)', color: 'var(--rouge)',
          fontSize: 16, fontWeight: 600,
        }}>→</span>
        <CityAutocomplete
          label="TO" sub="Destination"
          value={to} onChange={setTo}
          placeholder="Where are you going?"
          accent="var(--rouge)"
        />
      </div>
      <div style={{ display: 'flex', gap: 10, marginTop: 14, flexWrap: 'wrap' }}>
        <button onClick={goBuyer} className="h-btn h-btn-primary h-btn-lg" style={{ flex: '1 1 200px' }}>
          I'm a customer
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
        </button>
        <button onClick={goTraveler} className="h-btn h-btn-ghost h-btn-lg" style={{ flex: '1 1 200px' }}>
          I'm a traveler →
        </button>
      </div>
      <p style={{ fontSize: 11, color: 'var(--ink-3)', margin: '12px 0 0', fontFamily: 'var(--font-mono)', letterSpacing: '.04em' }}>
        Buyers browse carriers · Travelers post a trip · No account to start
      </p>
    </div>
  );
}

// ─── Landing v2: trust-led above the fold ──────────────
export function PageLandingPsy() {
  const [heroIdx, setHeroIdx] = useState(0);
  const cities = HD.cities;
  useEffect(() => {
    const id = setInterval(() => setHeroIdx(i => (i + 1) % cities.length), 4000);
    return () => clearInterval(id);
  }, [cities.length]);

  return (
    <div className="h-app" style={{ width: '100%' }}>
      <HNav active=""/>

      <HeroSplitLayout
        cities={cities}
        heroIdx={heroIdx}
        setHeroIdx={setHeroIdx}
        searchSlot={<HeroRouteSearch />}
      />

      {/* STATS — count up from 0 when they enter the viewport */}
      <section style={{ padding: '88px 40px', borderBottom: '1px solid var(--line)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32 }}>
          {[
            { to: 12400, suffix: '+', label: 'Orders completed' },
            { to: 3200,  suffix: '+', label: 'Active travelers' },
            { to: 0,     prefix: '$', label: 'Customs · shipping' },
            { to: 4.9,   suffix: ' ★', decimals: 1, label: 'Average rating · 8,210 reviews' },
          ].map((s, i) => (
            <HScrollReveal key={s.label} delay={i * 80}>
              <div style={{ borderTop: '1px solid var(--line-2)', paddingTop: 20 }}>
                <CountUp
                  className="h-display"
                  to={s.to}
                  prefix={s.prefix || ''}
                  suffix={s.suffix || ''}
                  decimals={s.decimals || 0}
                  style={{ fontSize: 48, lineHeight: 1.04, display: 'inline-block' }}
                />
                <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 8, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '.08em' }}>{s.label}</div>
              </div>
            </HScrollReveal>
          ))}
        </div>
      </section>

      {/* HOW (unchanged from v1) */}
      <section style={{ padding: '96px 40px', background: 'var(--paper-2)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <HScrollReveal>
            <HSectionHead eyebrow="How it works" title={<>Three steps. <span style={{ fontStyle: 'italic', color: 'var(--rouge)' }}>That's it.</span></>} sub="Buyer or traveler — the whole flow is set up in under three minutes."/>
          </HScrollReveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginTop: 80 }}>
            {[
              { n: '01', t: 'Request from any city', d: 'Browse active travelers by route and item. Send a request to someone already heading your way.', note: 'No account needed to browse', img: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=900&q=85' },
              { n: '02', t: 'Carrier picks it up', d: 'They purchase at retail. No customs markup, no international shipping. Receipt uploaded to chat.', note: 'Payment held in escrow', img: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=900&q=85' },
              { n: '03', t: 'Receive and confirm', d: 'Meetup, courier, or doorstep — your choice. Confirm receipt and payment releases instantly.', note: 'Buyer protection on every order', img: 'https://images.unsplash.com/photo-1556742044-3c52d6e88c62?w=900&q=85' },
            ].map((s, i) => (
              <HScrollReveal key={s.n} delay={i * 120}>
                <div style={{ background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: 'var(--r-lg)', overflow: 'hidden', height: '100%' }}>
                  <div style={{ aspectRatio: '4/3', background: `url(${s.img}) center/cover`, position: 'relative' }}>
                    <span className="h-mono" style={{ position: 'absolute', top: 16, left: 16, fontSize: 11, color: 'white', background: 'rgba(0,0,0,.35)', backdropFilter: 'blur(6px)', padding: '4px 10px', borderRadius: 999, letterSpacing: '.1em' }}>{s.n}</span>
                  </div>
                  <div style={{ padding: 28 }}>
                    <h3 className="h-serif" style={{ fontSize: 28, margin: 0, letterSpacing: '-0.02em' }}>{s.t}</h3>
                    <p style={{ fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.6, marginTop: 12 }}>{s.d}</p>
                    <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--rouge-deep)' }}>
                      <HVerified size={12}/> {s.note}
                    </div>
                  </div>
                </div>
              </HScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* IN FLIGHT */}
      <section style={{ padding: '96px 40px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 48, gap: 32 }}>
            <HScrollReveal>
              <HSectionHead eyebrow="In flight now" title={<>Hand-picked. <span style={{ fontStyle: 'italic' }}>From this week's carriers.</span></>}/>
            </HScrollReveal>
            <Link to="/browse" className="h-btn h-btn-ghost">All 68 cities →</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
            {HD.items.slice(0, 4).map((it, i) => (
              <HScrollReveal key={it.id} delay={i * 80}><HItemCardPsy item={it}/></HScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: '96px 40px', background: 'var(--noir)', color: 'var(--paper)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <HSectionHead eyebrow="Real stories · 4.9 average · 8,210 reviews" title={<>People love <span style={{ fontStyle: 'italic', color: 'var(--rouge)' }}>handi.</span></>} dark/>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginTop: 64 }}>
            {HD.reviews.slice(0, 2).map((r, i) => (
              <HScrollReveal key={r.name} delay={i * 120}>
                <div style={{ padding: 40, border: '1px solid rgba(250,248,244,.12)', borderRadius: 'var(--r-lg)', height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <HStars value={r.rating} size={14} color="var(--rouge)"/>
                  <p className="h-serif" style={{ fontSize: 30, lineHeight: 1.35, letterSpacing: '-0.02em', marginTop: 24, marginBottom: 32, fontStyle: 'italic' }}>"{r.body}"</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 'auto', paddingTop: 24, borderTop: '1px solid rgba(250,248,244,.1)' }}>
                    <HAvatar name={r.name} size={44}/>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 500 }}>{r.name}</div>
                      <div style={{ fontSize: 12, color: 'rgba(250,248,244,.6)', fontFamily: 'var(--font-mono)', letterSpacing: '.06em', marginTop: 2 }}>{r.route}</div>
                    </div>
                  </div>
                </div>
              </HScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ padding: '96px 40px', background: `linear-gradient(180deg, var(--paper) 0%, var(--paper-2) 100%)`, textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: .12, backgroundImage: `url(${cities[0].hero})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'grayscale(.4)' }}/>
        <div style={{ maxWidth: 900, margin: '0 auto', position: 'relative' }}>
          <div className="h-eyebrow" style={{ marginBottom: 24 }}>It's free to start · Browse without an account</div>
          <h2 className="h-display" style={{ fontSize: 'clamp(72px, 9vw, 144px)', margin: 0, lineHeight: 0.95 }}>
            Ready to carry<br/>
            <span style={{ fontStyle: 'italic', color: 'var(--rouge)' }}>the world?</span>
          </h2>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 56 }}>
            <Link className="h-btn h-btn-primary h-btn-lg" to="/browse">Find a carrier</Link>
            <Link className="h-btn h-btn-ghost h-btn-lg" to="/post-trip">Post a trip →</Link>
          </div>
          <p style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 32, fontFamily: 'var(--font-mono)', letterSpacing: '.06em' }}>Free to join · No subscription · Escrow on every order</p>
        </div>
      </section>

      {/* TICKER — pinned to the bottom of the page, just above the footer */}
      <div style={{ borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)', padding: '14px 0', overflow: 'hidden', background: 'var(--paper-2)' }}>
        <div style={{ display: 'flex', gap: 48, animation: 'h-marquee 40s linear infinite', whiteSpace: 'nowrap', fontSize: 12, fontFamily: 'var(--font-mono)', letterSpacing: '.08em', color: 'var(--ink-2)' }}>
          {Array.from({ length: 2 }).flatMap((_, k) => [
            'Tokyo → NYC · 12 carriers', 'Seoul → SF · 8 carriers', 'Paris → NYC · 6 carriers',
            'London → Boston · 4 carriers', 'NYC → Tokyo · 9 carriers', 'Singapore → London · 3 carriers', 'Tokyo → LA · 7 carriers',
          ].map((t, i) => (
            <span key={`${k}-${i}`} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ width: 4, height: 4, background: 'var(--rouge)', borderRadius: 999 }}/> {t}
            </span>
          )))}
        </div>
      </div>

      <HFooter/>
    </div>
  );
}

// ─── Browse v2: route search + filters ──
export function PageBrowsePsy() {
  const [searchParams] = useSearchParams();
  const [fromCountry, setFromCountry] = useState(searchParams.get('fromCountry') || 'all');
  const [fromCity, setFromCity]       = useState(searchParams.get('fromCity')    || 'all');
  const [fromZip, setFromZip]         = useState(searchParams.get('fromZip')     || '');
  const [toCountry, setToCountry]     = useState(searchParams.get('toCountry')   || 'all');
  const [toCity, setToCity]           = useState(searchParams.get('toCity')      || 'all');
  const [toZip, setToZip]             = useState(searchParams.get('toZip')       || '');
  const [cat, setCat] = useState('all');
  const [sort, setSort] = useState('Soonest');
  const [feeMin, setFeeMin] = useState('');
  const [feeMax, setFeeMax] = useState('');
  const [trustIdOnly, setTrustIdOnly] = useState(true);
  const [trustTopRated, setTrustTopRated] = useState(false);
  const [trustRepeat, setTrustRepeat] = useState(false);
  const [trustNoDispute, setTrustNoDispute] = useState(false);

  const useMyLocation = () => {
    const { code, zip } = guessLocation();
    setToCountry(code);
    setToCity('all');
    setToZip(zip);
  };

  const resetRoute = () => {
    setFromCountry('all'); setFromCity('all'); setFromZip('');
    setToCountry('all'); setToCity('all'); setToZip('');
  };

  // Wrappers reset city when country changes — keeps the dropdown in a valid state.
  const updateFromCountry = (c) => { setFromCountry(c); setFromCity('all'); };
  const updateToCountry   = (c) => { setToCountry(c);   setToCity('all'); };

  const items = HD.items
    .filter(i => fromCountry === 'all' || CITY_TO_COUNTRY[i.from] === fromCountry)
    .filter(i => fromCity === 'all'    || i.from === fromCity)
    .filter(i => toCountry === 'all'   || CITY_TO_COUNTRY[i.to]   === toCountry)
    .filter(i => toCity === 'all'      || i.to === toCity)
    .filter(i => cat === 'all' || i.category === cat)
    .filter(i => !feeMin || i.fee >= Number(feeMin))
    .filter(i => !feeMax || i.fee <= Number(feeMax))
    .filter(i => !trustTopRated || (i.rating || 0) >= 4.8)
    .filter(i => !trustIdOnly    || i.carrierStats?.idVerified)
    .filter(i => !trustRepeat    || (i.carrierStats?.completedTrips ?? 0) >= 5)
    .filter(i => !trustNoDispute || (i.carrierStats?.disputes ?? 0) === 0)
    .sort((a, b) => {
      if (sort === 'Best value') return (a.fee / a.retail) - (b.fee / b.retail);
      if (sort === 'Top rated') return (b.rating || 0) - (a.rating || 0);
      if (sort === 'Most saved') return (b.viewers || 0) - (a.viewers || 0);
      // Soonest — by departs date string (May X)
      const monthDay = (s) => { const m = (s || '').match(/(\w+)\s+(\d+)/); return m ? new Date(`${m[1]} ${m[2]}, 2026`).getTime() : 0; };
      return monthDay(a.departs) - monthDay(b.departs);
    });
  const cats = ['all', ...Array.from(new Set(HD.items.map(i => i.category)))];

  const fromLabel = COUNTRIES.find(c => c.code === fromCountry);
  const toLabel = COUNTRIES.find(c => c.code === toCountry);
  const fromCityLabel = fromCity !== 'all' ? (CITIES_BY_COUNTRY[fromCountry]?.find(x => x.code === fromCity)?.name || fromCity) : null;
  const toCityLabel   = toCity   !== 'all' ? (CITIES_BY_COUNTRY[toCountry]?.find(x => x.code === toCity)?.name || toCity)     : null;
  const fromText = fromCityLabel ? `${fromCityLabel}, ${fromLabel?.name}` : (fromLabel?.name || 'Anywhere');
  const toText   = toCityLabel   ? `${toCityLabel}, ${toLabel?.name}`   : (toLabel?.name   || 'Anywhere');
  const routeSummary = (fromCountry === 'all' && toCountry === 'all')
    ? 'All routes'
    : `${fromText} → ${toText}`;

  return (
    <div className="h-app" style={{ width: '100%' }}>
      <HNav active="browse"/>

      <section style={{ padding: '48px 40px 32px', borderBottom: '1px solid var(--line)' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <div style={{ marginBottom: 24 }}>
            <div className="h-eyebrow" style={{ marginBottom: 12 }}>Marketplace · 17 active carries · 31 in flight</div>
            <h1 className="h-display" style={{ fontSize: 88, margin: 0, lineHeight: 1 }}>Browse <span style={{ fontStyle: 'italic', color: 'var(--rouge)' }}>carriers.</span></h1>
          </div>

          {/* Route search bar — From country + ZIP → To country + ZIP, with "use my location" */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 24, flexWrap: 'nowrap' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 14,
              flexWrap: 'nowrap', flex: '1 1 auto', minWidth: 0,
            }}>
              <RouteField
                label="FROM"
                country={fromCountry}
                setCountry={updateFromCountry}
                city={fromCity}
                setCity={setFromCity}
                zip={fromZip}
                setZip={setFromZip}
                zipPlaceholder="e.g. 100-0001"
                accent="var(--ink)"
              />
              <span aria-hidden="true" style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: 40, height: 40, borderRadius: 999, flexShrink: 0,
                background: 'var(--rouge-soft)', color: 'var(--rouge)',
                fontSize: 18, fontWeight: 600,
                boxShadow: '0 2px 6px rgba(139,30,45,.12)',
              }}>→</span>
              <RouteField
                label="TO"
                country={toCountry}
                setCountry={updateToCountry}
                city={toCity}
                setCity={setToCity}
                zip={toZip}
                setZip={setToZip}
                zipPlaceholder="e.g. 11211"
                accent="var(--rouge)"
              />
            </div>
            <button
              type="button"
              onClick={useMyLocation}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8, flexShrink: 0,
                padding: '12px 16px', borderRadius: 999, whiteSpace: 'nowrap',
                background: 'transparent', border: '1px solid var(--line-2)',
                color: 'var(--ink-2)', fontSize: 13, fontFamily: 'inherit', cursor: 'pointer',
                transition: 'background .2s var(--ease-out), border-color .2s var(--ease-out)',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--paper-2)'; e.currentTarget.style.borderColor = 'var(--ink-3)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'var(--line-2)'; }}
              title="Detect from your timezone"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M12 21s-7-7.16-7-12a7 7 0 1114 0c0 4.84-7 12-7 12z"/>
                <circle cx="12" cy="9" r="2.5"/>
              </svg>
              Use my location
            </button>
            {(fromCountry !== 'all' || toCountry !== 'all' || fromCity !== 'all' || toCity !== 'all' || fromZip || toZip) && (
              <button
                type="button"
                onClick={resetRoute}
                style={{
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  fontSize: 12, color: 'var(--ink-3)', textDecoration: 'underline',
                  fontFamily: 'inherit', flexShrink: 0, whiteSpace: 'nowrap',
                }}
              >
                Clear route
              </button>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 20 }}>
            <span className="h-mono" style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: '.1em' }}>SORT</span>
            {['Soonest', 'Best value', 'Top rated', 'Most saved'].map(s => (
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
      </section>

      <section style={{ padding: '32px 40px 100px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'grid', gridTemplateColumns: '220px 1fr', gap: 48 }}>
          <aside style={{ position: 'sticky', top: 92, alignSelf: 'flex-start' }}>
            <div className="h-mono" style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 16 }}>Category</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {cats.map(c => {
                const on = cat === c;
                return (
                  <button key={c} onClick={() => setCat(c)} style={{
                    textAlign: 'left', padding: '10px 12px', borderRadius: 8, border: 'none',
                    background: on ? 'var(--paper-2)' : 'transparent',
                    color: on ? 'var(--ink)' : 'var(--ink-2)',
                    fontWeight: on ? 500 : 400, fontSize: 14, cursor: 'pointer',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    transition: 'background .25s var(--ease-out), color .25s var(--ease-out), transform .15s var(--ease-out)',
                  }}
                  onMouseEnter={(e) => { if (!on) e.currentTarget.style.background = 'rgba(26,23,20,.04)'; }}
                  onMouseLeave={(e) => { if (!on) e.currentTarget.style.background = 'transparent'; }}
                  >
                    <span>{c === 'all' ? 'All categories' : c}</span>
                    {on && <span key={`dot-${c}`} className="h-pop-in" style={{ width: 4, height: 4, background: 'var(--rouge)', borderRadius: 999 }}/>}
                  </button>
                );
              })}
            </div>

            <hr className="h-divider" style={{ margin: '24px 0' }}/>

            <div className="h-mono" style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 16 }}>Carry fee</div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
              <input className="h-input" placeholder="Min" value={feeMin} onChange={e => setFeeMin(e.target.value.replace(/\D/g, ''))} style={{ padding: '8px 10px', fontSize: 12 }}/>
              <input className="h-input" placeholder="Max" value={feeMax} onChange={e => setFeeMax(e.target.value.replace(/\D/g, ''))} style={{ padding: '8px 10px', fontSize: 12 }}/>
            </div>

            <div className="h-mono" style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 16 }}>Trust filter</div>
            {[
              ['ID-verified only', trustIdOnly, setTrustIdOnly],
              ['Top rated (4.8+)', trustTopRated, setTrustTopRated],
              ['Repeat carriers (5+ trips)', trustRepeat, setTrustRepeat],
              ['Zero disputes', trustNoDispute, setTrustNoDispute],
            ].map(([t, on, set]) => (
              <label key={t} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0',
                fontSize: 13, color: on ? 'var(--ink)' : 'var(--ink-2)',
                fontWeight: on ? 500 : 400, cursor: 'pointer',
                transition: 'color .25s var(--ease-out), font-weight .25s var(--ease-out)',
              }}>
                <input type="checkbox" checked={on} onChange={e => set(e.target.checked)} style={{ accentColor: 'var(--rouge)', transition: 'transform .15s var(--ease-out)' }}/> {t}
              </label>
            ))}

            <hr className="h-divider" style={{ margin: '24px 0' }}/>

            {/* Saved-for-later micro commitment */}
            <div style={{ padding: 16, background: 'var(--paper-2)', borderRadius: 'var(--r-md)' }}>
              <div className="h-eyebrow" style={{ marginBottom: 8 }}>Your wishlist</div>
              <div style={{ fontSize: 13, color: 'var(--ink-2)', marginBottom: 12, lineHeight: 1.5 }}>
                <span className="h-serif" style={{ fontSize: 28, color: 'var(--ink)' }}>3</span> items saved.<br/>
                We'll alert you when a carrier picks up your route.
              </div>
              <Link to="/profile" className="h-btn h-btn-ghost h-btn-sm" style={{ width: '100%' }}>View wishlist →</Link>
            </div>

            <div style={{ marginTop: 16, padding: 20, background: 'var(--rouge-soft)', borderRadius: 'var(--r-md)', border: '1px solid rgba(139,30,45,.12)' }}>
              <div className="h-eyebrow" style={{ color: 'var(--rouge-deep)', marginBottom: 8 }}>Don't see it?</div>
              <p style={{ fontSize: 13, color: 'var(--rouge-ink)', lineHeight: 1.5, margin: 0 }}>Post a request — carriers heading your way will reach out.</p>
              <Link to="/post-request" className="h-btn h-btn-rouge h-btn-sm" style={{ marginTop: 12, width: '100%' }}>Post a request →</Link>
            </div>
          </aside>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid var(--line)' }}>
              <span style={{ fontSize: 14, color: 'var(--ink-2)' }}>{items.length} {items.length === 1 ? 'item' : 'items'} · <span style={{ color: 'var(--ink-3)' }}>{routeSummary}{cat !== 'all' ? ` · ${cat}` : ''}</span></span>
              <span className="h-eyebrow"><span style={{ color: 'var(--rouge)' }}>●</span> Average save with handi: <b style={{ color: 'var(--rouge-deep)', fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>32%</b></span>
            </div>
            {items.length === 0 ? (
              <div key="empty" style={{ animation: 'h-tile-in .35s var(--ease-out) both' }}>
                <HEmpty
                  icon="✈"
                  title="No carriers match those filters."
                  body="Try widening your fee range, lifting the trust filters, or picking a different city."
                  action={
                    <button onClick={() => { resetRoute(); setCat('all'); setFeeMin(''); setFeeMax(''); setTrustIdOnly(false); setTrustTopRated(false); setTrustRepeat(false); setTrustNoDispute(false); }} className="h-btn h-btn-ghost">
                      Reset all filters
                    </button>
                  }
                />
              </div>
            ) : (
              <div
                key={`${fromCountry}|${fromCity}|${fromZip}|${toCountry}|${toCity}|${toZip}|${cat}|${sort}|${feeMin}|${feeMax}|${trustIdOnly}|${trustTopRated}|${trustRepeat}|${trustNoDispute}`}
                style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}
              >
                {items.map((it, i) => (
                  <div
                    key={it.id}
                    style={{ animation: `h-tile-in .42s var(--ease-out) both`, animationDelay: `${Math.min(i, 11) * 35}ms` }}
                  >
                    <HItemCardPsy item={it}/>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <HFooter/>
    </div>
  );
}
function cityChipPsy(active) {
  return {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    padding: '10px 16px', border: '1px solid', borderRadius: 999,
    fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap', cursor: 'pointer',
    background: active ? 'var(--ink)' : 'var(--paper)',
    color: active ? 'var(--paper)' : 'var(--ink)',
    borderColor: active ? 'var(--ink)' : 'var(--line-2)',
  };
}

// ─── RouteField — prominent country + city + ZIP combo for the Browse route search ──
function RouteField({ label, country, setCountry, city, setCity, zip, setZip, zipPlaceholder = 'Postal code', accent = 'var(--ink)' }) {
  const selected = COUNTRIES.find(c => c.code === country) || COUNTRIES[0];
  const cityOptions = CITIES_BY_COUNTRY[country] || [];
  const showCity = country !== 'all' && cityOptions.length > 0;
  const active = country !== 'all' || (city && city !== 'all') || zip;
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const ringActive = focused || active;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false);
      }}
      style={{
        display: 'flex', alignItems: 'stretch',
        flex: '1 1 0', minWidth: 0,
        background: '#fff',
        border: `1px solid ${ringActive ? accent : (hovered ? 'var(--line-2)' : 'var(--line)')}`,
        borderRadius: 14,
        transition: 'border-color .2s var(--ease-out), box-shadow .25s var(--ease-out)',
        boxShadow: ringActive
          ? '0 6px 18px rgba(26,23,20,.06)'
          : '0 1px 2px rgba(26,23,20,.03)',
        overflow: 'hidden',
        minHeight: 64,
      }}
    >
      {/* Label rail */}
      <div style={{
        display: 'inline-flex', flexDirection: 'column', justifyContent: 'center',
        padding: '0 18px 0 22px', minWidth: 56, gap: 4, flexShrink: 0,
        borderRight: '1px solid var(--line)',
        background: 'transparent',
      }}>
        <span className="h-mono" style={{
          fontSize: 10, letterSpacing: '.18em',
          color: ringActive ? accent : 'var(--ink-3)',
          fontWeight: 600,
        }}>{label}</span>
        <span style={{ fontSize: 9, color: 'var(--ink-3)', fontFamily: 'var(--font-mono)', letterSpacing: '.06em', textTransform: 'uppercase', opacity: .8 }}>
          {label === 'FROM' ? 'Origin' : 'Destination'}
        </span>
      </div>

      {/* Country select with flag — entire column clickable */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 12, flexShrink: 0,
        padding: '0 32px 0 18px', position: 'relative', cursor: 'pointer',
      }}>
        <span style={{ fontSize: 22, lineHeight: 1 }} aria-hidden="true">{selected.flag}</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, pointerEvents: 'none' }}>
          <span className="h-mono" style={{ fontSize: 9, color: 'var(--ink-3)', letterSpacing: '.12em', textTransform: 'uppercase' }}>
            Country
          </span>
          <span style={{ fontSize: 15, fontWeight: 500, color: 'var(--ink)' }}>
            {selected.name}
          </span>
        </div>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--ink-2)" strokeWidth="2" style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
          <path d="M6 9l6 6 6-6"/>
        </svg>
        <select
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          aria-label={`${label} country`}
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            opacity: 0, cursor: 'pointer', border: 'none', background: 'transparent',
            appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none',
            font: 'inherit',
          }}
        >
          {COUNTRIES.map(c => (
            <option key={c.code} value={c.code}>{c.name}</option>
          ))}
        </select>
      </div>

      {showCity && (() => {
        const selectedCity = cityOptions.find(c => c.code === (city || 'all'));
        const cityLabel = selectedCity ? selectedCity.name : 'Any city';
        return (
          <>
            <span style={{ width: 1, background: 'var(--line)', alignSelf: 'stretch', flexShrink: 0 }}/>
            <div style={{
              display: 'inline-flex', flexDirection: 'column', gap: 2,
              padding: '12px 32px 12px 18px', justifyContent: 'center',
              position: 'relative', minWidth: 110, flexShrink: 0, cursor: 'pointer',
            }}>
              <span className="h-mono" style={{ fontSize: 9, color: 'var(--ink-3)', letterSpacing: '.12em', textTransform: 'uppercase', pointerEvents: 'none' }}>
                City
              </span>
              <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink)', pointerEvents: 'none' }}>
                {cityLabel}
              </span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--ink-2)" strokeWidth="2" style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                <path d="M6 9l6 6 6-6"/>
              </svg>
              <select
                value={city || 'all'}
                onChange={(e) => setCity(e.target.value)}
                aria-label={`${label} city`}
                style={{
                  position: 'absolute', inset: 0, width: '100%', height: '100%',
                  opacity: 0, cursor: 'pointer', border: 'none', background: 'transparent',
                  appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none',
                  font: 'inherit',
                }}
              >
                <option value="all">Any city</option>
                {cityOptions.map(c => (
                  <option key={c.code} value={c.code}>{c.name}</option>
                ))}
              </select>
            </div>
          </>
        );
      })()}

      <span style={{ width: 1, background: 'var(--line)', alignSelf: 'stretch', flexShrink: 0 }}/>

      {/* ZIP input */}
      <div style={{
        display: 'flex', flexDirection: 'column', gap: 2,
        padding: '12px 20px', flex: '1 1 110px', minWidth: 0, justifyContent: 'center',
      }}>
        <span className="h-mono" style={{ fontSize: 9, color: 'var(--ink-3)', letterSpacing: '.12em', textTransform: 'uppercase' }}>
          Postal code
        </span>
        <input
          value={zip}
          onChange={(e) => setZip(e.target.value)}
          placeholder={zipPlaceholder}
          aria-label={`${label} postal code`}
          style={{
            border: 'none', outline: 'none', background: 'transparent',
            fontFamily: 'var(--font-mono)', fontSize: 15, fontWeight: 500, color: 'var(--ink)',
            padding: 0, width: '100%',
            letterSpacing: '.04em',
          }}
        />
      </div>
    </div>
  );
}

// ─── Item Detail v2: hold timer + dossier + anchor + reservation flow ──
export function PageItemDetailPsy() {
  const [qty, setQty] = useState(1);
  const [imgIdx, setImgIdx] = useState(0);
  const navigate = useNavigate();
  const { id } = useParams();
  const item = HD.items.find(i => String(i.id) === String(id)) || HD.items[1];
  // TODO(post-backend): replace synthetic 1.55x anchor with real localResalePrice from data
  const localResale = Math.round((item.retail + item.fee) * 1.55);
  const handiTotal = item.retail + item.fee;
  const slotsLeft = Math.max(0, item.slots ?? 0);
  const slotsTotal = item.slotsTotal ?? slotsLeft;
  const slotsTaken = Math.max(0, slotsTotal - slotsLeft);
  const isSoldOut = slotsLeft <= 0;
  const handleReserve = () => {
    if (isSoldOut || qty < 1 || qty > slotsLeft) return;
    addToCart(item, qty);
    navigate('/cart');
  };
  useEffect(() => {
    if (qty > slotsLeft && slotsLeft > 0) setQty(slotsLeft);
    if (slotsLeft <= 0) setQty(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.id]);
  const gallery = [
    item.img,
    'https://images.unsplash.com/photo-1577741314755-048d8525d31e?w=900&h=900&fit=crop&q=85',
    'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=900&h=900&fit=crop&q=85',
    'https://images.unsplash.com/photo-1531525645387-7f14be1bdbbd?w=900&h=900&fit=crop&q=85',
  ];

  return (
    <div className="h-app" style={{ width: '100%' }}>
      <HNav active="browse"/>

      <div style={{ padding: '20px 40px', fontSize: 12, color: 'var(--ink-3)', fontFamily: 'var(--font-mono)', letterSpacing: '.06em' }}>
        <Link to="/browse" style={{ color: 'inherit' }}>BROWSE</Link> / <Link to="/browse" style={{ color: 'inherit' }}>TOKYO</Link> / <Link to="/browse" style={{ color: 'inherit' }}>COLLECTIBLES</Link> / <span style={{ color: 'var(--ink)' }}>{item.title.toUpperCase()}</span>
      </div>

      <section style={{ padding: '16px 40px 80px', maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 64 }}>
          {/* GALLERY */}
          <div>
            <div style={{ position: 'relative', aspectRatio: '1', borderRadius: 'var(--r-lg)', overflow: 'hidden', background: 'var(--paper-2)' }}>
              <img src={gallery[imgIdx]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={`${item.title} — photo ${imgIdx + 1}`}/>
              <span className="h-chip h-chip-noir" style={{ position: 'absolute', top: 16, left: 16, fontSize: 10, fontFamily: 'var(--font-mono)', letterSpacing: '.1em' }}>TOKYO · LIMITED</span>
              <div style={{ position: 'absolute', top: 16, right: 16 }}>
                <HMicroSave initialCount={47} label="Save"/>
              </div>
              {/* live viewers */}
              <div style={{ position: 'absolute', bottom: 16, left: 16, display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', background: 'rgba(0,0,0,.55)', backdropFilter: 'blur(8px)', borderRadius: 999, color: 'white', fontSize: 11, fontFamily: 'var(--font-mono)', letterSpacing: '.06em' }}>
                <span style={{ width: 5, height: 5, borderRadius: 999, background: 'var(--rouge)' }} className="h-pulse"/>
                10 people viewing now
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              {gallery.map((g, i) => (
                <button key={i} onClick={() => setImgIdx(i)} style={{
                  width: 80, height: 80, padding: 0, border: '2px solid', borderColor: i === imgIdx ? 'var(--ink)' : 'transparent', borderRadius: 8, overflow: 'hidden', cursor: 'pointer'
                }}>
                  <img src={g} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={`${item.title} — thumbnail ${i + 1}`}/>
                </button>
              ))}
            </div>

            {/* Provenance */}
            <div style={{ marginTop: 40, paddingTop: 32, borderTop: '1px solid var(--line)' }}>
              <h3 className="h-eyebrow" style={{ marginBottom: 16 }}>Provenance</h3>
              <p style={{ fontSize: 15, lineHeight: 1.65, color: 'var(--ink-2)', margin: 0 }}>
                {item.title} sourced from {item.store} in {item.from}. The carrier will photograph the receipt at point of purchase and attach it to your order chat. Original packaging confirmed by carrier prior to checkout.
              </p>
              <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                {[['Origin', item.from], ['Retail', `$${item.retail} USD`], ['Pickup', item.store]].map(([k, v]) => (
                  <div key={k}>
                    <div className="h-mono" style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: '.1em', textTransform: 'uppercase' }}>{k}</div>
                    <div style={{ fontSize: 14, marginTop: 6 }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Carrier dossier */}
            <div style={{ marginTop: 40, paddingTop: 32, borderTop: '1px solid var(--line)' }}>
              <h3 className="h-eyebrow" style={{ marginBottom: 20 }}>Your carrier · the dossier</h3>
              <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', marginBottom: 24 }}>
                <HAvatar name="James L" size={64}/>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <h4 style={{ margin: 0, fontSize: 18 }}>James L.</h4>
                    <HVerified size={14}/>
                    <span className="h-chip h-chip-rouge" style={{ fontSize: 10 }}>Top 3% carrier</span>
                    <HFollowButton name="James L." size="sm"/>
                  </div>
                  <div style={{ display: 'flex', gap: 24, marginTop: 8, fontSize: 13, color: 'var(--ink-2)' }}>
                    <span><b style={{ color: 'var(--ink)' }}>★ 5.0</b> · 47 reviews</span>
                    <span>Member since 2024</span>
                    <span>23 trips completed</span>
                  </div>
                  <p style={{ marginTop: 12, fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.55 }}>
                    "Tokyo native, monthly NYC routes. I specialize in Pokémon Center, anime collectibles, and limited drops. Always carry receipts and photo proof."
                  </p>
                </div>
              </div>

              <HCarrierTrust name="James L."/>
            </div>

            {/* Recent reviews from the carrier */}
            <div style={{ marginTop: 40, paddingTop: 32, borderTop: '1px solid var(--line)' }}>
              <h3 className="h-eyebrow" style={{ marginBottom: 20 }}>Reviews · last 3 trips</h3>
              {[
                { name: 'Emily R.', body: 'James sent receipt photos within 20 minutes of pickup. Item arrived perfectly packed.', when: '2 weeks ago' },
                { name: 'Daniel P.', body: 'Communication was clear in both English and Japanese. Will use him again.', when: '1 month ago' },
              ].map(r => (
                <div key={r.name} style={{ padding: '16px 0', borderBottom: '1px solid var(--line)', display: 'flex', gap: 16 }}>
                  <HAvatar name={r.name} size={36}/>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 14, fontWeight: 500 }}>{r.name}</span>
                      <HStars value={5} size={11}/>
                      <span className="h-mono" style={{ fontSize: 10, color: 'var(--ink-3)', marginLeft: 'auto' }}>{r.when}</span>
                    </div>
                    <p style={{ fontSize: 14, color: 'var(--ink-2)', margin: '6px 0 0', lineHeight: 1.5 }}>{r.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* PURCHASE PANEL */}
          <aside style={{ position: 'sticky', top: 100, alignSelf: 'flex-start' }}>
            <div className="h-eyebrow" style={{ marginBottom: 12 }}>{item.store}</div>
            <h1 className="h-serif" style={{ fontSize: 48, margin: 0, lineHeight: 1.05, letterSpacing: '-0.02em' }}>{item.title}</h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 20, flexWrap: 'wrap' }}>
              <HStars value={5} size={14}/>
              <span style={{ fontSize: 13, color: 'var(--ink-2)' }}>5.0 · 12 carries this month</span>
              <span style={{ width: 3, height: 3, borderRadius: 999, background: 'var(--ink-3)' }}/>
              <span style={{ fontSize: 13, color: 'var(--rouge-deep)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 5, height: 5, borderRadius: 999, background: 'var(--rouge)' }} className="h-pulse"/>
                10 viewing
              </span>
            </div>

            {/* Hold timer — endowment */}
            <div style={{ marginTop: 24 }}>
              <HHoldTimer minutes={15}/>
            </div>

            {/* Anchor block — local resale crossed out */}
            <div style={{ marginTop: 16 }}>
              <HAnchorPrice retail={item.retail} fee={item.fee} localResale={localResale}/>
            </div>

            {/* price block */}
            <div style={{ marginTop: 16, padding: 24, background: 'var(--paper-2)', borderRadius: 'var(--r-lg)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div>
                  <div className="h-mono" style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: '.1em', textTransform: 'uppercase' }}>Retail (Tokyo)</div>
                  <div className="h-serif" style={{ fontSize: 30, marginTop: 4, lineHeight: 1 }}>${item.retail}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="h-mono" style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: '.1em', textTransform: 'uppercase' }}>+ Carry fee</div>
                  <div className="h-serif" style={{ fontSize: 30, marginTop: 4, lineHeight: 1, color: 'var(--rouge)' }}>${item.fee}</div>
                </div>
              </div>
              <hr style={{ border: 'none', borderTop: '1px dashed var(--line-2)', margin: '20px 0' }}/>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: 14, color: 'var(--ink-2)' }}>You pay total</span>
                <span className="h-serif" style={{ fontSize: 40 }}>${handiTotal}</span>
              </div>
              <div className="h-mono" style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: '.08em', marginTop: 4, textAlign: 'right' }}>NO CUSTOMS · NO SHIPPING · ALL-IN</div>
            </div>

            {/* qty + cta */}
            <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--line-2)', borderRadius: 'var(--r-pill)', padding: '4px' }}>
                <button onClick={() => setQty(Math.max(1, qty-1))} disabled={qty <= 1} style={{ ...qtyBtnPsy, opacity: qty <= 1 ? 0.35 : 1, cursor: qty <= 1 ? 'not-allowed' : 'pointer' }} aria-label="Decrease quantity">−</button>
                <span style={{ width: 32, textAlign: 'center', fontFamily: 'var(--font-mono)' }} aria-live="polite">{qty}</span>
                <button onClick={() => setQty(Math.min(slotsLeft || 1, qty+1))} disabled={qty >= slotsLeft} style={{ ...qtyBtnPsy, opacity: qty >= slotsLeft ? 0.35 : 1, cursor: qty >= slotsLeft ? 'not-allowed' : 'pointer' }} aria-label="Increase quantity">+</button>
              </div>
              <button onClick={handleReserve} disabled={isSoldOut} className="h-btn h-btn-primary" style={{ flex: 1, opacity: isSoldOut ? 0.5 : 1, cursor: isSoldOut ? 'not-allowed' : 'pointer' }}>
                {isSoldOut ? 'Sold out' : `Reserve · $${handiTotal * qty}`}
              </button>
            </div>
            <div className="h-mono" style={{ fontSize: 10, color: qty >= slotsLeft ? 'var(--rouge-deep)' : 'var(--ink-3)', letterSpacing: '.08em', marginTop: 8, textAlign: 'right' }}>
              {isSoldOut ? 'NO SLOTS REMAINING ON THIS TRIP' : `MAX ${slotsLeft} ON THIS TRIP · ${slotsLeft - qty} LEFT AFTER YOURS`}
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <button onClick={() => navigate('/messages')} className="h-btn h-btn-ghost" style={{ flex: 1 }}>Message James first</button>
              <HMicroSave label="Save for later"/>
            </div>
            <div className="h-mono" style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: '.08em', marginTop: 12, textAlign: 'center' }}>
              YOU WON'T BE CHARGED UNTIL JAMES ACCEPTS · ESCROW HELD
            </div>

            {/* Trip + slots scarcity */}
            <div style={{ marginTop: 24, padding: 20, border: '1px solid var(--line)', borderRadius: 'var(--r-lg)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <span className="h-eyebrow">Trip</span>
                <span className="h-chip h-chip-amber" style={{ fontSize: 11 }}>{slotsLeft} of {slotsTotal} slots left</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: 'var(--ink-3)', fontFamily: 'var(--font-mono)', letterSpacing: '.06em' }}>FROM</div>
                  <div style={{ fontSize: 18, marginTop: 4 }}>🇯🇵 Tokyo</div>
                </div>
                <div style={{ flex: 1, position: 'relative', height: 20 }}>
                  <div style={{ position: 'absolute', top: 9, left: 0, right: 0, height: 1, borderTop: '1.5px dashed var(--line-2)' }}/>
                  <svg width="20" height="20" viewBox="0 0 24 24" style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%) rotate(45deg)', background: 'var(--paper)' }} fill="var(--rouge)"><path d="M21 16v-2l-8-5V3.5C13 2.67 12.33 2 11.5 2S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg>
                </div>
                <div style={{ flex: 1, textAlign: 'right' }}>
                  <div style={{ fontSize: 11, color: 'var(--ink-3)', fontFamily: 'var(--font-mono)', letterSpacing: '.06em' }}>TO</div>
                  <div style={{ fontSize: 18, marginTop: 4 }}>🇺🇸 NYC</div>
                </div>
              </div>
              <hr className="h-divider" style={{ margin: '14px 0' }}/>
              <HSlotBar taken={slotsTaken} total={slotsTotal} label="reserved"/>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginTop: 14 }}>
                <span style={{ color: 'var(--ink-3)' }}>Departure</span>
                <span>May 7 · ~12 days delivery</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginTop: 6 }}>
                <span style={{ color: 'var(--ink-3)' }}>Hand-off</span>
                <span>Manhattan · Brooklyn · Queens</span>
              </div>
            </div>

            {/* trust pills */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 16 }}>
              {[['🛡️','Buyer protected'],['🔒','Escrow held'],['📷','Photo receipt'],['↺','Money back']].map(([e,t]) => (
                <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', background: 'var(--paper-2)', borderRadius: 8, fontSize: 12 }}>
                  <span>{e}</span><span>{t}</span>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      {/* RELATED — keep momentum, anchor on adjacent items */}
      <section style={{ padding: '40px 40px 120px', borderTop: '1px solid var(--line)' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 32 }}>
            <h3 className="h-display" style={{ fontSize: 40, margin: 0 }}>More from {item.from} <span style={{ fontStyle: 'italic', color: 'var(--rouge)' }}>· bundle to save</span></h3>
            <span className="h-eyebrow">Same route · save the carry fee</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
            {HD.items.filter(i => i.from === item.from && i.id !== item.id).slice(0, 4).map(it => <HItemCardPsy key={it.id} item={it}/>)}
          </div>
        </div>
      </section>

      <HFooter/>
    </div>
  );
}
const qtyBtnPsy = { width: 32, height: 32, border: 'none', background: 'transparent', borderRadius: 999, fontSize: 18, cursor: 'pointer', color: 'var(--ink-2)' };
