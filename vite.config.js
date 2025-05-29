import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
	plugins: [sveltekit()],
	build: {
		target: 'es2020'
	},
	define: {
		'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
	}
});
