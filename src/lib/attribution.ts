import { cleanAttribution, publicPaths } from './attribution-policy.mjs';
import { practice } from './practice';

const storageKey = 'blue-willow-attribution';
let current: Record<string, string> = {};
export function bookingUrl() {
  const url = new URL(practice.booking);
  for (const [key, value] of Object.entries(current)) url.searchParams.set(key, value);
  if (!current.utm_source) url.searchParams.set('utm_source', 'direct');
  return url.href;
}
export function captureAttribution() {
  try { current = cleanAttribution(JSON.parse(sessionStorage.getItem(storageKey) || '{}')); } catch { /* storage may be unavailable */ }
  const query = new URLSearchParams(location.search);
  // A new tagged visit replaces the campaign; ordinary internal navigation preserves it.
  if (['utm_source', 'utm_medium', 'utm_campaign'].some(key => query.has(key))) {
    current = cleanAttribution(Object.fromEntries(query));
    try { sessionStorage.setItem(storageKey, JSON.stringify(current)); } catch { /* keep the current page attribution in memory */ }
  }
}

export function trackBookingClick(service = 'unspecified', channel = 'link') {
  if (!publicPaths.includes(location.pathname)) return;
  const detail = { event: 'booking_link_click', page: location.pathname,
    service: ['initial-assessment', 'follow-up'].includes(service) ? service : 'unspecified',
    channel: channel === 'webmcp' ? 'webmcp' : 'link', utm_source: 'direct', ...current };
  // This measures the handoff, never a completed appointment or revenue.
  window.dispatchEvent(new CustomEvent('bluewillow:booking', { detail }));
  if (import.meta.env.PUBLIC_SITE_ENV !== 'production') return;
  const body = JSON.stringify(detail);
  try {
    if (navigator.sendBeacon?.('/api/booking-event', new Blob([body], { type: 'application/json' }))) return;
  } catch { /* fall back without blocking navigation */ }
  void fetch('/api/booking-event', { method: 'POST', body, headers: { 'Content-Type': 'application/json' }, keepalive: true, credentials: 'omit', referrerPolicy: 'no-referrer' }).catch(() => {});
}
