import React from 'react';
import { Link } from 'react-router-dom';
import { HNav } from '../components/primitives';

export function PageNotFound({
  eyebrow = '404 · LOST IN TRANSIT',
  title,
  italicTitle = 'landed.',
  prefixTitle = 'This page never',
  body = "The link you followed may be broken, or the page may have moved. Let's get you back on a route that works.",
  primary = { to: '/', label: 'Back to home' },
  secondary = { to: '/browse', label: 'Browse carriers →' },
} = {}) {
  return (
    <div className="h-app" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <HNav />
      <main style={{ flex: 1, display: 'grid', placeItems: 'center', padding: '64px 24px' }}>
        <div style={{ maxWidth: 560, textAlign: 'center' }}>
          <div className="h-eyebrow" style={{ marginBottom: 18, color: 'var(--rouge)' }}>{eyebrow}</div>
          <h1 className="h-display" style={{ fontSize: 'clamp(40px, 7vw, 72px)', lineHeight: 1.02, margin: 0 }}>
            {title || (
              <>
                {prefixTitle} <span style={{ fontStyle: 'italic', color: 'var(--rouge)' }}>{italicTitle}</span>
              </>
            )}
          </h1>
          <p style={{ fontSize: 16, color: 'var(--ink-2)', marginTop: 18, lineHeight: 1.55 }}>
            {body}
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 28, flexWrap: 'wrap' }}>
            {primary && <Link to={primary.to} className="h-btn h-btn-primary h-btn-lg">{primary.label}</Link>}
            {secondary && <Link to={secondary.to} className="h-btn h-btn-ghost h-btn-lg">{secondary.label}</Link>}
          </div>
        </div>
      </main>
    </div>
  );
}
