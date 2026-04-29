import React from 'react';
import { Link } from 'react-router-dom';
import { HFlag } from './primitives';
import { StaggerText } from './motion';

// ─── HeroSplitLayout — alternate landing hero design ─────────────────
// Editorial split: cream column on the left with eyebrow / headline / CTAs / city
// pills, full-bleed photo on the right that's desaturated and softly blended into
// the cream column via a 4-stop gradient. Photo crossfades between cities.
//
// To use this design, swap the hero <section> in psychology-overrides.jsx with:
//   <HeroSplitLayout cities={cities} heroIdx={heroIdx} setHeroIdx={setHeroIdx} />
//
// The current active hero (full-bleed photo with cream wash overlay) lives inline
// in psychology-overrides.jsx. Swap by replacing that <section> with the import
// above. Both designs work with the same `cities` array shape from sample.js.
export function HeroSplitLayout({ cities, heroIdx, setHeroIdx, searchSlot }) {
  return (
    <section style={{ minHeight: 'calc(100vh - 73px)', display: 'grid', gridTemplateColumns: '1.05fr 1fr', background: 'var(--paper)', position: 'relative', zIndex: 5 }}>
      {/* LEFT — cream editorial column.
         Layout: top block (eyebrow + headline + paragraph) sits at the top,
         search slot is centered vertically with auto margins so a long
         dropdown has room to extend without being clipped by the next section. */}
      <div style={{
        background: 'var(--paper)', color: 'var(--ink)',
        padding: '40px 56px 56px',
        display: 'flex', flexDirection: 'column',
        minHeight: '100%', position: 'relative',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 28 }}>
          <span style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--rouge)' }} className="h-pulse"/>
          <span className="h-eyebrow">Live · 31 carriers in flight · 68 cities</span>
        </div>

        <h1 className="h-display" style={{ fontSize: 'clamp(40px, 5vw, 84px)', margin: 0, lineHeight: 1.0 }}>
          <StaggerText text="Anywhere" delay={120} gap={70}/>
          {' '}
          <StaggerText text="in the world," delay={260} gap={70}/>
          <br/>
          <span style={{ fontStyle: 'italic', color: 'var(--rouge)' }}>
            <StaggerText text="hand-carried." delay={520} gap={80}/>
          </span>
        </h1>

        <p style={{ fontSize: 16, lineHeight: 1.55, color: 'var(--ink-2)', maxWidth: 480, margin: '24px 0 0' }}>
          Real travelers. Real receipts. Hand-carried from any city — at retail price, with escrow and ID-verified carriers.
        </p>

        {/* Search slot sits right under the paragraph; the auto bottom margin
           eats the rest of the column so the dropdown opens into empty space
           rather than being clipped by viewport / next section. */}
        <div style={{ marginTop: 32, marginBottom: 'auto' }}>
          {searchSlot ? (
            searchSlot
          ) : (
            <>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                <Link className="h-btn h-btn-primary h-btn-lg" to="/browse">Browse carriers
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
                </Link>
                <Link className="h-btn h-btn-ghost h-btn-lg" to="/post-trip">I'm traveling →</Link>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--line)', flexWrap: 'wrap' }}>
                <span className="h-mono" style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: '.12em', marginRight: 8 }}>WATCH A CITY</span>
                {cities.map((c, i) => (
                  <button key={c.code} onClick={() => setHeroIdx(i)} style={{
                    padding: '6px 12px', border: 'none', borderRadius: 999, cursor: 'pointer',
                    background: i === heroIdx ? 'var(--ink)' : 'transparent',
                    color: i === heroIdx ? 'var(--paper)' : 'var(--ink-3)',
                    fontSize: 11, fontFamily: 'var(--font-mono)', letterSpacing: '.1em', textTransform: 'uppercase',
                    transition: 'all .25s',
                  }}>{c.name}</button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* RIGHT — desaturated photo crossfading; fades into cream column on the left */}
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        {cities.map((c, i) => (
          <div key={c.code} style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url(${c.hero})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: i === heroIdx ? 1 : 0,
            transition: 'opacity 1.2s ease',
            filter: 'saturate(.65) brightness(1.02)',
          }}/>
        ))}
        {/* Wide cream blend so the photo dissolves into the editorial column. */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'linear-gradient(90deg, var(--paper) 0%, rgba(250,248,244,.96) 14%, rgba(250,248,244,.78) 28%, rgba(250,248,244,.52) 44%, rgba(250,248,244,.28) 60%, rgba(250,248,244,.10) 78%, rgba(250,248,244,0) 100%)',
        }}/>
        {/* Subtle warm wash to harmonise the photo with cream tones. */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'rgba(250,248,244,.18)',
        }}/>

        {cities[heroIdx] && (
          <div key={cities[heroIdx].code} style={{
            position: 'absolute', bottom: 32, left: 32,
            display: 'inline-flex', alignItems: 'center', gap: 10,
            padding: '10px 16px',
            background: 'rgba(250,248,244,.92)',
            backdropFilter: 'saturate(160%) blur(12px)',
            borderRadius: 999,
            border: '1px solid var(--line)',
            animation: 'h-fade-up .5s var(--ease-out) both',
          }}>
            <HFlag code={cities[heroIdx].code} size={14}/>
            <span className="h-mono" style={{ fontSize: 11, letterSpacing: '.14em', color: 'var(--ink)', textTransform: 'uppercase' }}>
              {cities[heroIdx].name}
            </span>
            <span style={{ width: 1, height: 10, background: 'var(--line-2)' }}/>
            <span style={{ fontSize: 12, color: 'var(--ink-2)' }}>
              {cities[heroIdx].count} carriers
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
