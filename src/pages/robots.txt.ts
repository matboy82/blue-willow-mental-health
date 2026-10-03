import type { APIRoute } from 'astro';
export const GET: APIRoute = ({ site }) => new Response(
  import.meta.env.PUBLIC_SITE_ENV === 'production'
    ? `User-agent: *\nAllow: /\nDisallow: /styleguide/\nSitemap: ${new URL('sitemap-index.xml', site).href}\n`
    : 'User-agent: *\nDisallow: /\n',
  { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
);
