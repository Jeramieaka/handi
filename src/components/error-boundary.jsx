import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    if (typeof window !== 'undefined' && window.console) {
      console.error('[handi] uncaught error:', error, info);
    }
  }

  handleReset = () => {
    this.setState({ error: null });
  };

  handleReload = () => {
    if (typeof window !== 'undefined') window.location.reload();
  };

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div style={wrap}>
        <div style={card}>
          <div style={eyebrow}>SOMETHING SLIPPED</div>
          <h1 style={title}>A page hit a snag.</h1>
          <p style={body}>
            We've logged the issue. Try refreshing — your cart and sign-in are preserved.
          </p>
          <div style={actions}>
            <button onClick={this.handleReload} style={primaryBtn}>Reload page</button>
            <button onClick={this.handleReset} style={ghostBtn}>Try again</button>
          </div>
          {this.state.error?.message && (
            <details style={details}>
              <summary style={summary}>Show technical detail</summary>
              <pre style={pre}>{String(this.state.error.message)}</pre>
            </details>
          )}
        </div>
      </div>
    );
  }
}

const wrap = {
  minHeight: '100vh', display: 'grid', placeItems: 'center',
  background: 'var(--paper, #FAF8F4)', padding: 24,
};
const card = {
  maxWidth: 520, padding: '40px 32px', textAlign: 'center',
  background: 'var(--paper-2, #fff)', borderRadius: 16,
  border: '1px solid var(--line, #e5e0d8)',
};
const eyebrow = {
  fontFamily: 'var(--font-mono, monospace)', fontSize: 11, letterSpacing: '.12em',
  color: 'var(--rouge, #8B1E2D)', marginBottom: 16,
};
const title = {
  fontFamily: 'var(--font-serif, Fraunces, serif)', fontSize: 32, margin: '0 0 12px',
  color: 'var(--ink, #1A1714)', lineHeight: 1.1,
};
const body = {
  fontSize: 15, color: 'var(--ink-2, #4a4540)', lineHeight: 1.55, margin: '0 0 24px',
};
const actions = { display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' };
const primaryBtn = {
  padding: '12px 22px', borderRadius: 999, border: 'none',
  background: 'var(--rouge, #8B1E2D)', color: '#fff',
  fontSize: 14, fontWeight: 500, cursor: 'pointer', minHeight: 44,
};
const ghostBtn = {
  padding: '12px 22px', borderRadius: 999,
  border: '1px solid var(--line, #e5e0d8)', background: 'transparent',
  color: 'var(--ink, #1A1714)', fontSize: 14, cursor: 'pointer', minHeight: 44,
};
const details = { marginTop: 24, textAlign: 'left' };
const summary = {
  fontFamily: 'var(--font-mono, monospace)', fontSize: 11,
  letterSpacing: '.08em', color: 'var(--ink-3, #8a857d)', cursor: 'pointer',
};
const pre = {
  marginTop: 8, padding: 12, fontSize: 12, background: 'rgba(0,0,0,.04)',
  borderRadius: 8, whiteSpace: 'pre-wrap', wordBreak: 'break-word',
};
