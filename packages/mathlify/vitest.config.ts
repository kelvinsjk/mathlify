/// <reference types="vitest" />
import { defineConfig } from 'vite';
import { configDefaults } from 'vitest/config';
// https://vitejs.dev/config/
export default defineConfig({
	test: {
		exclude: [...configDefaults.exclude, 'tests/**/*', '**/_*.test.ts'],
		coverage: {
			...configDefaults.coverage,
			include: ['src/**'],
		},
	},
});
