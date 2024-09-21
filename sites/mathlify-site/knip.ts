import type { KnipConfig } from 'knip';

const config: KnipConfig = {
	svelte: {
		entry: [
			'svelte.config.js',
			'vite*.config.{js,mjs,ts,cjs,mts,cts}',
			'src/routes/**/+{page,server,page.server,error,layout,layout.server}{,@*}.{js,ts,svelte}',
			'src/hooks.{server,client}.{js,ts}',
			'src/params/*.{js,ts}',
			'src/content/**/02_practice{-1,-2,}.ts',
			'src/content/h2-3_h2_tys_questions/**/q*.ts',
			'src/lib/components/nav.ts',
			'src/state-analysis/fns/generateDiscriminantStates.ts',
			'src/content/h2-1_h2_learn/01_functions/02_inverse/05_relationship/_05-coeffs-generator.ts',
			'tests/test.ts',
			'src/db/turso/**/_*.ts',
			'src/lib/components/mathlified/Content.svelte'
		]
	},
	project: ['**/*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}'],
	paths: {
		'$app/*': ['node_modules/@sveltejs/kit/src/runtime/app/*'],
		'$lib/*': ['src/lib/*'],
		'$env/*': ['.svelte-kit/ambient.d.ts']
	},
	compilers: {
		css: (text: string) => [...text.matchAll(/(?<=@)import[^;]+/g)].join('\n'),
		svelte: (text: string) => [...text.matchAll(/import[^;]+/g)].join('\n')
	},
	ignoreDependencies: ["mathlify"]
};

export default config;
