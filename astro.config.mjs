// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'http://360degre.es/',
	output: 'static',
	build: {
		format: 'directory'
	},
	integrations: [mdx(), sitemap()],
});
