import { test } from 'node:test';
import assert from 'node:assert/strict';
import { onRequest } from '../functions/api/booking-event.js';
import { cleanAttribution } from '../src/lib/attribution-policy.mjs';

const base = { event: 'booking_link_click', page: '/booking/', service: 'initial-assessment', channel: 'link', utm_source: 'psychologytoday', utm_medium: 'referral', utm_campaign: 'pt-profile' };
function context(body = base, overrides = {}) {
  const writes = [];
  return { writes, request: new Request('https://www.bluewillowmentalhealth.com/api/booking-event', {
    method: 'POST', headers: { Origin: 'https://www.bluewillowmentalhealth.com', 'Content-Type': 'application/json' }, body: JSON.stringify(body), ...overrides,
  }), env: { PUBLIC_SITE_ENV: 'production', BOOKING_ANALYTICS: { writeDataPoint: value => writes.push(value) } } };
}
test('valid handoff records only permitted public dimensions; direct fallback has no identifier', async () => {
  const ctx = context();
  assert.equal((await onRequest(ctx)).status, 204);
  assert.deepEqual(ctx.writes, [{ indexes: ['booking_link_click'], blobs: ['booking_link_click', '/booking/', 'initial-assessment', 'link', 'psychologytoday', 'referral', 'pt-profile'], doubles: [1] }]);
  const direct = context({ event: base.event, page: '/', service: 'unspecified', channel: 'webmcp' });
  assert.equal((await onRequest(direct)).status, 204);
  assert.deepEqual(direct.writes[0].blobs.slice(4), ['direct', 'none', 'none']);
});
test('collector rejects extra fields, unknown campaign values, URLs, malformed or oversized bodies', async () => {
  for (const invalid of [{ ...base, email: 'synthetic@example.invalid' }, { ...base, utm_campaign: 'unregistered-private-text' }, { ...base, page: '/booking/?private=test' }, { ...base, event: 'appointment_confirmed' }]) {
    const ctx = context(invalid); assert.equal((await onRequest(ctx)).status, 400); assert.equal(ctx.writes.length, 0);
  }
  assert.equal((await onRequest(context(base, { body: '{' }))).status, 400);
  assert.equal((await onRequest(context(base, { body: 'x'.repeat(1025) }))).status, 413);
  assert.deepEqual(cleanAttribution({ utm_source: 'psychologytoday', utm_medium: 'private', other: 'test' }), { utm_source: 'psychologytoday' });
});
test('collector is unavailable without production binding and rejects cross-origin or non-JSON requests', async () => {
  const ctx = context(); ctx.env.PUBLIC_SITE_ENV = 'preview'; assert.equal((await onRequest(ctx)).status, 503); assert.equal(ctx.writes.length, 0);
  const unbound = context(); delete unbound.env.BOOKING_ANALYTICS; assert.equal((await onRequest(unbound)).status, 503);
  assert.equal((await onRequest(context(base, { headers: { Origin: 'https://other.invalid', 'Content-Type': 'application/json' } }))).status, 403);
  assert.equal((await onRequest(context(base, { headers: { Origin: 'https://www.bluewillowmentalhealth.com', 'Content-Type': 'text/plain' } }))).status, 415);
  assert.equal((await onRequest(context(base, { method: 'PUT' }))).status, 405);
});
