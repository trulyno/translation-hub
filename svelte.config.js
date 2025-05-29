import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: 'index.html', // For SPA routing with client-side auth
			precompress: false,
			strict: false
		}),
		paths: {
			base: process.env.NODE_ENV === 'production' ? '/translation-hub' : ''
		},
		prerender: {
			entries: ['*'],
			handleMissingId: 'warn'
		}
	}
};

export default config;
