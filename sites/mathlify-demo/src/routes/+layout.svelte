<script>
	import '@skeletonlabs/skeleton/themes/theme-crimson.css';
	import '@skeletonlabs/skeleton/styles/skeleton.css';
	import '../app.postcss';
	import '../katex.min.css';
	import 'highlight.js/styles/github-dark.css';

	import { AppBar, storeHighlightJs } from '@skeletonlabs/skeleton';
	import hljs from 'highlight.js';
	// @ts-ignore
	import hljs_svelte from 'highlightjs-svelte';
	hljs_svelte(hljs);
	storeHighlightJs.set(hljs);
</script>

<AppBar>
	<a class="text-3xl" href="/">
		Mathlify Demo
	</a>
</AppBar>

<main>
	<slot />
</main>

<style>
	main {
		padding: 1rem;
	}
	@media screen and (min-width: 768px) {
		main, :global(.app-bar) {
			padding-inline: 4rem;
		}
	}
</style>