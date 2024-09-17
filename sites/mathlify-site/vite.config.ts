import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { mathlified } from 'vite-plugin-sveltekit-mathlified';

export default defineConfig({
	plugins: [mathlified({ siteName: 'Mathlify' }), sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},
	optimizeDeps: { exclude: ['nodejs-polars'] }
});
