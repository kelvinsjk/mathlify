import Example from './Example.svelte';
import InteractiveExample from './InteractiveExample.svelte';
import InteractiveQn from './InteractiveQn.svelte';
import H2 from './H2.svelte';
import H3 from './H3.svelte';
import P from './P.svelte';

import type { contentElements } from '$lib';
import type { ComponentType, SvelteComponent } from 'svelte';
import Display from './Display.svelte';

export const components = {
	h2: H2,
	h3: H3,
	p: P,
	display: Display,
	example: Example,
	iExample: InteractiveExample,
	iQn: InteractiveQn,
} satisfies Components;

type Components =
	| {
			[key in (typeof contentElements)[number]]: ComponentType<
				SvelteComponent<{ content: string }>
			>;
	  }
	| {
			example: ComponentType<
				SvelteComponent<{ content: string; title?: string; plural?: boolean }>
			>;
	  }
	| {
			iExample: ComponentType<
				SvelteComponent<{
					/*eslint @typescript-eslint/no-explicit-any: ["error", { "ignoreRestArgs": true }]*/
					generator: (...args: any[]) => string;
					argsGenerator: () => unknown;
					initialArgs?: unknown;
					title?: string;
					plural?: boolean;
				}>
			>;
	  }
	| {
			iQn: ComponentType<
				SvelteComponent<{
					/*eslint @typescript-eslint/no-explicit-any: ["error", { "ignoreRestArgs": true }]*/
					generator: (...args: any[]) => [string, string];
					argsGenerator: () => unknown;
					initialArgs?: unknown;
					title?: string;
					preamble?: string;
				}>
			>;
	  };
