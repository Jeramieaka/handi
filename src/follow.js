// ─── Follow store ────────────────────────────────────────────────────────────
// Tracks which carriers the current user follows. Persisted to localStorage so
// the choice survives reloads. Exposes a `useFollowing()` hook that returns
// the live Set of followed carrier names plus toggle helpers.
//
// TODO(post-backend): replace localStorage with /api/me/follows.

import { useSyncExternalStore } from 'react';

const KEY = 'handi_followed_carriers_v1';

function readSet() {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    return new Set(Array.isArray(arr) ? arr : []);
  } catch { return new Set(); }
}

let cachedSet = readSet();
const listeners = new Set();
const subscribe = (cb) => { listeners.add(cb); return () => listeners.delete(cb); };
const getSnapshot = () => cachedSet;
const notify = () => { for (const cb of listeners) cb(); };

function persist() {
  try { window.localStorage.setItem(KEY, JSON.stringify([...cachedSet])); } catch {}
}

export function useFollowing() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export function isFollowing(name) {
  return cachedSet.has(name);
}

export function toggleFollow(name) {
  const next = new Set(cachedSet);
  if (next.has(name)) next.delete(name);
  else next.add(name);
  cachedSet = next;
  persist();
  notify();
}

export function followCount() {
  return cachedSet.size;
}
