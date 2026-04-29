import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// ─── Floating support widget ────────────────────────────────────────────────
// Pinned to the bottom-right corner across the whole site. Click the round
// button to open a chat-style panel with quick action chips and a free-form
// message field. Mounted once at the App.jsx layer.
//
// Backend hooks (TODO):
//   - Quick action chips currently pre-fill the input + navigate; on backend
//     they should open a real ticket attached to the user account.
//   - The free-form message stays local; needs to POST to /api/support/messages.

const QUICK_ACTIONS = [
  { id: 'damaged',  emoji: '📦', label: 'Item damaged',     to: '/orders' },
  { id: 'late',     emoji: '❓', label: 'Item not arrived', to: '/orders' },
  { id: 'refund',   emoji: '💸', label: 'Request refund',   to: '/orders' },
  { id: 'cancel',   emoji: '❌', label: 'Cancel order',     to: '/orders' },
  { id: 'track',    emoji: '📍', label: 'Track my order',   to: '/orders' },
  { id: 'carrier',  emoji: '💬', label: 'Contact carrier',  to: '/messages' },
];

export function SupportWidget() {
  const [open, setOpen]       = useState(false);
  const [messages, setMessages] = useState([
    { from: 'mia', text: "Hi! 👋 I'm Mia from handi support. What can I help you with today?", time: 'just now' },
  ]);
  const [draft, setDraft] = useState('');
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  // Scroll to bottom whenever a new message arrives.
  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, open]);

  // Esc to close.
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const sendUserMessage = (text) => {
    const t = text.trim();
    if (!t) return;
    setMessages(m => [...m, { from: 'you', text: t, time: 'just now' }]);
    setDraft('');
    // Mia auto-replies after a short beat — feels alive without backend.
    setTimeout(() => {
      setMessages(m => [...m, {
        from: 'mia',
        text: "Got it — a real human will pick this up within an hour. You'll see updates in /messages.",
        time: 'just now',
      }]);
    }, 900);
  };

  const handleQuick = (action) => {
    setMessages(m => [...m, { from: 'you', text: action.label, time: 'just now' }]);
    setTimeout(() => {
      setMessages(m => [...m, {
        from: 'mia',
        text: `Taking you to ${action.to} so I can pull up the right context.`,
        time: 'just now',
      }]);
      setTimeout(() => {
        setOpen(false);
        navigate(action.to);
      }, 700);
    }, 400);
  };

  return (
    <>
      {/* Panel */}
      {open && (
        <div
          role="dialog"
          aria-label="Support chat"
          style={{
            position: 'fixed', bottom: 96, right: 24, zIndex: 1100,
            width: 'min(380px, calc(100vw - 32px))',
            height: 'min(560px, calc(100vh - 140px))',
            background: 'var(--paper)', borderRadius: 18,
            boxShadow: '0 24px 60px rgba(20,17,14,.18), 0 4px 14px rgba(20,17,14,.08)',
            border: '1px solid var(--line)',
            display: 'flex', flexDirection: 'column', overflow: 'hidden',
            animation: 'h-fade-up .25s var(--ease-out) both',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: 'var(--noir)', color: 'var(--paper)' }}>
            <div style={{ position: 'relative' }}>
              <div style={{
                width: 40, height: 40, borderRadius: 999,
                background: 'var(--rouge)', color: 'var(--paper)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-serif)', fontSize: 18, fontWeight: 500,
              }} aria-hidden="true">M</div>
              <span style={{
                position: 'absolute', bottom: -1, right: -1, width: 10, height: 10,
                borderRadius: 999, background: 'var(--green)', border: '2px solid var(--noir)',
              }}/>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 500 }}>Mia</div>
              <div style={{ fontSize: 11, color: 'rgba(250,248,244,.65)', fontFamily: 'var(--font-mono)', letterSpacing: '.06em' }}>handi support · online</div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close support"
              style={{ background: 'none', border: 'none', color: 'rgba(250,248,244,.7)', cursor: 'pointer', padding: 4, lineHeight: 0 }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>

          {/* Message stream */}
          <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '20px 16px', background: 'var(--paper-2)' }}>
            {messages.map((m, i) => (
              <div key={i} style={{
                display: 'flex', gap: 10, marginBottom: 14,
                flexDirection: m.from === 'mia' ? 'row' : 'row-reverse',
                alignItems: 'flex-start',
              }}>
                {m.from === 'mia' && (
                  <div style={{
                    width: 28, height: 28, borderRadius: 999, flexShrink: 0,
                    background: 'var(--rouge)', color: 'var(--paper)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-serif)', fontSize: 13, fontWeight: 500,
                  }} aria-hidden="true">M</div>
                )}
                <div style={{
                  maxWidth: '78%',
                  padding: '10px 14px', borderRadius: 14,
                  background: m.from === 'mia' ? 'var(--paper)' : 'var(--ink)',
                  color: m.from === 'mia' ? 'var(--ink)' : 'var(--paper)',
                  fontSize: 14, lineHeight: 1.5,
                  border: m.from === 'mia' ? '1px solid var(--line)' : 'none',
                  whiteSpace: 'pre-wrap',
                }}>
                  {m.text}
                </div>
              </div>
            ))}

            {messages.length <= 1 && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 12 }}>
                {QUICK_ACTIONS.map(a => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => handleQuick(a)}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      padding: '10px 12px', borderRadius: 999, cursor: 'pointer',
                      background: 'var(--rouge-soft)', color: 'var(--rouge-deep)',
                      border: '1px solid rgba(139,30,45,.18)',
                      fontSize: 13, fontFamily: 'inherit', fontWeight: 500,
                      transition: 'background .15s, transform .15s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(139,30,45,.12)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--rouge-soft)'; }}
                  >
                    <span aria-hidden="true">{a.emoji}</span>
                    {a.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => { e.preventDefault(); sendUserMessage(draft); }}
            style={{ padding: '12px 16px', borderTop: '1px solid var(--line)', display: 'flex', gap: 8, alignItems: 'center', background: 'var(--paper)' }}
          >
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Describe your issue…"
              aria-label="Message"
              style={{
                flex: 1, border: '1px solid var(--rouge-soft)', borderRadius: 999,
                padding: '10px 16px', fontSize: 14, fontFamily: 'inherit', color: 'var(--ink)',
                background: 'var(--paper)', outline: 'none',
              }}
            />
            <button
              type="submit"
              aria-label="Send"
              disabled={!draft.trim()}
              style={{
                width: 40, height: 40, borderRadius: 999, border: 'none',
                background: draft.trim() ? 'var(--rouge)' : 'var(--rouge-soft)',
                color: draft.trim() ? 'var(--paper)' : 'var(--rouge-deep)',
                cursor: draft.trim() ? 'pointer' : 'not-allowed',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background .15s, transform .1s',
                flexShrink: 0,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
            </button>
          </form>
        </div>
      )}

      {/* Floating launcher / close button */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-label={open ? 'Close support' : 'Open support'}
        aria-expanded={open}
        style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 1100,
          width: 56, height: 56, borderRadius: 999, border: 'none',
          background: 'var(--rouge)', color: 'var(--paper)',
          boxShadow: open
            ? '0 10px 28px rgba(139,30,45,.45), 0 0 0 6px rgba(139,30,45,.12)'
            : '0 8px 22px rgba(139,30,45,.35)',
          cursor: 'pointer',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          transition: 'transform .2s var(--ease-out), box-shadow .25s var(--ease-out)',
          transform: open ? 'rotate(0deg)' : 'rotate(0deg)',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
      >
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/>
          </svg>
        )}
        {/* Unread dot — appears when widget is closed and last message is from Mia. */}
        {!open && messages[messages.length - 1]?.from === 'mia' && messages.length > 1 && (
          <span style={{
            position: 'absolute', top: 4, right: 4, width: 10, height: 10,
            borderRadius: 999, background: 'var(--paper)',
            border: '2px solid var(--rouge)',
          }}/>
        )}
      </button>
    </>
  );
}
