import Example from './Example.svelte';
import InteractiveExample from './InteractiveExample.svelte';
import InteractiveQn from './InteractiveQn.svelte';
import H2 from './H2.svelte';
import H3 from './H3.svelte';
import P from './P.svelte';

import type { contentElements, staticElements, dynamicElements } from '$lib';
import type { ComponentType, SvelteComponent } from 'svelte';

export const components = {
	h2: H2,
	h3: H3,
	p: P,
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
			[key in (typeof staticElements)[number]]: ComponentType<
				SvelteComponent<{ content: string; title?: string }>
			>;
	  }
	| {
			[key in (typeof dynamicElements)[number]]: ComponentType<
				SvelteComponent<{
					generator: (...args: any[]) => string;
					argsGenerator: () => unknown[] | unknown;
					initial?: unknown;
					title?: string;
				}>
			>;
	  };
