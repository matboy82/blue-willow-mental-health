import { cleanAttribution, publicPaths } from '../../src/lib/attribution-policy.mjs';

const allowedKeys = ['event', 'page', 'service', 'channel', 'utm_source', 'utm_medium', 'utm_campaign'];
const reply = status => new Response(null, { status, headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' } });

export async function onRequest({ request, env }) {
  if (request.method !== 'POST') return reply(405);
  if (env.PUBLIC_SITE_ENV !== 'production' || !env.BOOKING_ANALYTICS) return reply(503);
  if (request.headers.get('Origin') !== new URL(request.url).origin) return reply(403);
  if (request.headers.get('Content-Type')?.split(';')[0] !== 'application/json') return reply(415);
  // Bound the incoming stream as well as Content-Length; never log request bodies.
  const reader = request.body?.getReader();
  if (!reader) return reply(400);
  let size = 0;
  const chunks = [];
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > 1024) { await reader.cancel(); return reply(413); }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  let input;
  try { input = JSON.parse(new TextDecoder().decode(bytes)); } catch { return reply(400); }
  if (!input || typeof input !== 'object' || Array.isArray(input) || Object.keys(input).some(key => !allowedKeys.includes(key)) ||
      input.event !== 'booking_link_click' || !publicPaths.includes(input.page) ||
      !['initial-assessment', 'follow-up', 'unspecified'].includes(input.service) || !['link', 'webmcp'].includes(input.channel)) return reply(400);
  const utm = cleanAttribution(input);
  if (['utm_source', 'utm_medium', 'utm_campaign'].some(key => key in input && input[key] !== utm[key])) return reply(400);
  try {
    env.BOOKING_ANALYTICS.writeDataPoint({ indexes: ['booking_link_click'],
      blobs: [input.event, input.page, input.service, input.channel, utm.utm_source || 'direct', utm.utm_medium || 'none', utm.utm_campaign || 'none'], doubles: [1] });
  } catch { return reply(503); }
  return reply(204);
}

