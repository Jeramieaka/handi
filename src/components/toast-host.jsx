import React from 'react';
import { useToasts } from '../toast';

// Bottom-left so it doesn't collide with the support widget (bottom-right)
// or the cart popovers (top-right of nav).
export function ToastHost() {
  const toasts = useToasts();
  if (toasts.length === 0) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        bottom: 24,
        left: 24,
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        pointerEvents: 'none',
        maxWidth: 'calc(100vw - 48px)',
      }}
    >
      {toasts.map(t => (
        <div
          key={t.id}
          style={{
            background: 'var(--ink)',
            color: 'var(--paper)',
            padding: '12px 18px',
            borderRadius: 999,
            fontSize: 13,
            fontFamily: 'inherit',
            boxShadow: 'var(--shadow-lg)',
            animation: 'h-toast-in .22s var(--ease-out) both',
            maxWidth: 360,
            pointerEvents: 'auto',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            lineHeight: 1.4,
          }}
        >
          <span aria-hidden="true" style={{ width: 8, height: 8, borderRadius: 999, background: t.kind === 'success' ? 'var(--green)' : t.kind === 'warn' ? 'var(--rouge)' : 'rgba(250,248,244,.5)', flexShrink: 0 }}/>
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}
