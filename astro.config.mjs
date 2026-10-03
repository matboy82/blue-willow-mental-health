import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const site = process.env.SITE_URL || 'https://bluewillowmentalhealth.com';
export default defineConfig({
  site,
  output: 'static',
  build: { inlineStylesheets: 'always' },
  trailingSlash: 'always',
  integrations: [sitemap({ filter: (page) => !page.endsWith('/styleguide/') })],
});
