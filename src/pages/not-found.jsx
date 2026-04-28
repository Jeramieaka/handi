import React from 'react';
import { Link } from 'react-router-dom';
import { HNav } from '../components/primitives';

export function PageNotFound() {
  return (
    <div className="h-app" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <HNav />
      <main style={{ flex: 1, display: 'grid', placeItems: 'center', padding: '64px 24px' }}>
        <div style={{ maxWidth: 560, textAlign: 'center' }}>
          <div className="h-eyebrow" style={{ marginBottom: 18, color: 'var(--rouge)' }}>404 · LOST IN TRANSIT</div>
          <h1 className="h-display" style={{ fontSize: 'clamp(40px, 7vw, 72px)', lineHeight: 1.02, margin: 0 }}>
            This page never <span style={{ fontStyle: 'italic', color: 'var(--rouge)' }}>landed.</span>
          </h1>
          <p style={{ fontSize: 16, color: 'var(--ink-2)', marginTop: 18, lineHeight: 1.55 }}>
            The link you followed may be broken, or the page may have moved. Let's get you back on a route that works.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 28, flexWrap: 'wrap' }}>
            <Link to="/" className="h-btn h-btn-primary h-btn-lg">Back to home</Link>
            <Link to="/browse" className="h-btn h-btn-ghost h-btn-lg">Browse carriers →</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
