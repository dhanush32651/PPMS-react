import { useState } from 'react';

// Safe storage: falls back to memory if the browser blocks Local Storage (e.g. embedded previews)
const mem = {};
const store = {
  get: (k) => { try { return window.localStorage.getItem(k); } catch { return mem[k] ?? null; } },
  set: (k, v) => { try { window.localStorage.setItem(k, v); } catch { mem[k] = v; } },
  del: (k) => { try { window.localStorage.removeItem(k); } catch { delete mem[k]; } },
};
export const has = (key) => store.get(key) !== null;
export const remove = (key) => store.del(key);
export const read = (key, fallback) => {
  try {
    const v = store.get(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
};
export const write = (key, value) => store.set(key, JSON.stringify(value));
export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
export const money = (n) => '₹' + Number(n || 0).toLocaleString('en-IN');
export const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
export const fmtTime = (d) =>
  new Date(d).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
export const today = () => new Date().toISOString().slice(0, 10);

// useState that persists to Local Storage
export function useLS(key, fallback = []) {
  const [data, setData] = useState(() => read(key, fallback));
  const set = (v) =>
    setData((prev) => {
      const next = typeof v === 'function' ? v(prev) : v;
      write(key, next);
      return next;
    });
  return [data, set];
}
