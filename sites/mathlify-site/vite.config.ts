import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import type { PluginOption } from 'vite';

export default defineConfig({
	plugins: [sveltekit(), getStaticContentHMR()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
	},
});

function getStaticContentHMR(): PluginOption {
	return {
		name: 'mathlify-static-content-hmr',
		handleHotUpdate(context) {
			if (context.file.startsWith(`${__dirname}/src/content`) && context.file.endsWith(`.md`)) {
				context.server.ws.send({ type: 'custom', event: 'md-update' });
				return [];
			}
		},
	};
}
