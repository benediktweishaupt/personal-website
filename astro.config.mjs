// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://bewe.is',
	output: 'static',
	build: {
		format: 'directory'
	},
	prefetch: {
		defaultStrategy: 'hover',
	},
	integrations: [mdx(), sitemap(), tailwind()],
});
