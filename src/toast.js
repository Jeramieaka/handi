// ─── Toast store ─────────────────────────────────────────────────────────
// Lightweight ephemeral notification queue. Each call to `toast(message)`
// pushes an entry that auto-dismisses after `ttl` (default 2.8s). React
// surfaces subscribe via `useToasts()`.
//
// Exists to replace native alert() popups, which look unmistakably like
// 2003 throughout demo flows.

import { useSyncExternalStore } from 'react';

let _toasts = [];
const listeners = new Set();
const subscribe = (cb) => { listeners.add(cb); return () => listeners.delete(cb); };
const getSnapshot = () => _toasts;
const notify = () => { for (const cb of listeners) cb(); };

let _nextId = 1;

export function toast(message, opts = {}) {
  const id = _nextId++;
  const ttl = opts.ttl ?? 2800;
  const entry = { id, message, kind: opts.kind || 'info' };
  _toasts = [..._toasts, entry];
  notify();
  setTimeout(() => {
    _toasts = _toasts.filter(t => t.id !== id);
    notify();
  }, ttl);
  return id;
}

export function useToasts() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
