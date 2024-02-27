/** @type {import("prettier").Config} */
const config = {
	useTabs: true,
	singleQuote: true,
	trailingComma: 'all',
	printWidth: 100,
	plugins: ['prettier-plugin-svelte', 'prettier-plugin-tailwindcss', 'prettier-plugin-embed'],
	overrides: [
		{
			files: '*.svelte',
			options: {
				parser: 'svelte',
			},
		},
		{
			files: '*.md',
			options: {
				parser: 'markdown',
				proseWrap: 'always',
				printWidth: 80,
			},
		},
	],
};

export default config;
