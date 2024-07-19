// @ts-check

import tseslint from 'typescript-eslint';

export default tseslint.config(
	...tseslint.configs.strict,
	...tseslint.configs.stylistic,
	{
		ignores: ['eslint.config.js', 'vite.config.js', 'vitest.config.ts'],
		languageOptions: {
			parserOptions: {
				project: './tsconfig.json',
			},
		},
		rules: {
			'@typescript-eslint/restrict-template-expressions': [
				'warn',
				{ allowBoolean: true, allowNumber: true },
			],
			'@typescript-eslint/no-unused-vars': [
				'error',
				{ varsIgnorePattern: '^_', argsIgnorePattern: '^_' },
			],
		},
	},
);
