<script lang="ts">
	/**
	 * Mathlified Layout version 0.0.1
	 * generated on 9/4/2024, 8:48:56 PM
	 *
	 * 40rem breakpoint for stack vs left sidebar ("mobile" vs "tablet")
	 * 60rem breakpoint in Content.svelte to get TOC on the right ("desktop")
	 */
	import type { Snippet } from 'svelte';
	import Nav from '$lib/components/mathlified/Nav.svelte';
	import type { NavNode } from '$lib/components/nav';

	let {
		data,
		children
	}: {
		data: {
			topicName: string;
			folder: string;
			nav: NavNode[] | undefined;
		};
		children: Snippet;
	} = $props();
</script>

<div class="main-container">
	<nav class="sidebar">
		<Nav nav={data.nav ?? []} />
	</nav>
	<main>
		{@render children()}
	</main>
</div>

<style>
	.main-container {
		display: grid;
		height: calc(100vh - 3.5rem);
		height: calc(100dvh - 3.5rem);
	}
	nav,
	main {
		height: 100%;
		overflow: hidden;
	}
	nav {
		overflow-y: auto;
	}
	.sidebar {
		display: none;
	}
	@media (min-width: 40rem) {
		.main-container {
			grid-template-columns: 18rem 1fr;
		}
		.sidebar {
			display: block;
			padding-inline: 1rem;
			width: 100%;
			overflow-y: auto;
			background-color: var(--surface, hsl(60, 5%, 96%));
			border-inline-end: 1px solid var(--content, black);
		}
	}
	@media (min-width: 60rem) {
		.sidebar {
			padding-block-start: 1rem;
		}
	}
</style>
