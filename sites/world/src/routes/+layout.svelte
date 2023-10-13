<script lang="ts">
	import { dev } from '$app/environment';
	import { onMount } from 'svelte';
	import '../app.postcss';

	let wrapper: HTMLDivElement;

	onMount(() => {
		//TODO: REMOVE THIS
		var all = document.getElementsByTagName('*'),
			i = 0,
			rect,
			docWidth = document.documentElement.offsetWidth;
		for (; i < all.length; i++) {
			rect = all[i].getBoundingClientRect();
			if (rect.right > docWidth || rect.left < 0) {
				console.log('WARNING: OVERFLOW detected');
				console.log(all[i]);
				all[i].style.borderTop = '1px solid red';
			}
		}
	});
</script>

<svelte:head>
	<script
		src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/contrib/copy-tex.min.js"
		integrity="sha384-ww/583aHhxWkz5DEVn6OKtNiIaLi2iBRNZXfJRiY1Ai7tnJ9UXpEsyvOITVpTl4A"
		crossorigin="anonymous"
		defer
	></script>
	<link
		rel="stylesheet"
		href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css"
		integrity="sha384-n8MVd4RsNIU0tAv4ct0nTaAbDJwPJzDEaqSD1odI+WdtXRGWt2kTvGFasHpSy3SV"
		crossorigin="anonymous"
	/>
</svelte:head>

<div class="wrapper" bind:this={wrapper}>
	<slot />
</div>

<style>
	.wrapper {
		display: grid;
		--main-margin: 0.5rem;
		grid-template-columns: 1fr min(65ch, calc(100% - calc(2 * var(--main-margin, 1rem)))) 1fr;
	}
	.wrapper > :global(*) {
		grid-column: 2;
	}
	:global(.full-bleed) {
		width: 100%;
		grid-column: 1 / 4;
	}
</style>
