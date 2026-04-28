// Tiny client-side cart store. Backend will replace this later.
// Uses useSyncExternalStore for cross-component reactivity without Context boilerplate.
import { useSyncExternalStore } from 'react';

const KEY = 'handi_cart_v1';

const num = (v, fallback = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

const sanitizeItem = (raw) => {
  if (!raw || typeof raw !== 'object' || raw.id == null) return null;
  return {
    ...raw,
    id: raw.id,
    qty: Math.max(1, Math.floor(num(raw.qty, 1))),
    retail: Math.max(0, num(raw.retail, 0)),
    fee: Math.max(0, num(raw.fee, 0)),
  };
};

const sanitizeState = (s) => {
  if (!s || typeof s !== 'object') return { items: [] };
  const items = Array.isArray(s.items) ? s.items.map(sanitizeItem).filter(Boolean) : [];
  return { items };
};

const load = () => {
  if (typeof window === 'undefined') return { items: [] };
  try {
    const raw = window.sessionStorage.getItem(KEY);
    return raw ? sanitizeState(JSON.parse(raw)) : { items: [] };
  } catch { return { items: [] }; }
};

let state = load();
const listeners = new Set();
const subscribe = (fn) => { listeners.add(fn); return () => listeners.delete(fn); };
const emit = () => {
  if (typeof window !== 'undefined') {
    try { window.sessionStorage.setItem(KEY, JSON.stringify(state)); } catch {}
  }
  listeners.forEach(fn => fn());
};
const getSnapshot = () => state;

export const useCart = () => useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

export const addToCart = (item, qty = 1) => {
  const safeQty = Math.max(1, Math.floor(num(qty, 1)));
  const existing = state.items.find(i => i.id === item.id);
  state = {
    ...state,
    items: existing
      ? state.items.map(i => i.id === item.id ? { ...i, qty: i.qty + safeQty } : i)
      : [...state.items, sanitizeItem({ ...item, qty: safeQty })].filter(Boolean),
  };
  emit();
};

export const removeFromCart = (id) => {
  state = { ...state, items: state.items.filter(i => i.id !== id) };
  emit();
};

export const updateQty = (id, qty) => {
  state = {
    ...state,
    items: state.items.map(i => i.id === id ? { ...i, qty: Math.max(1, Math.floor(num(qty, 1))) } : i),
  };
  emit();
};

export const clearCart = () => {
  state = { ...state, items: [] };
  emit();
};

export const cartCount = (items) =>
  (items || []).reduce((s, i) => s + Math.max(0, num(i?.qty, 0)), 0);

export const cartSubtotal = (items) =>
  (items || []).reduce((s, i) => {
    const qty = Math.max(0, num(i?.qty, 0));
    const retail = Math.max(0, num(i?.retail, 0));
    const fee = Math.max(0, num(i?.fee, 0));
    return s + (retail + fee) * qty;
  }, 0);
