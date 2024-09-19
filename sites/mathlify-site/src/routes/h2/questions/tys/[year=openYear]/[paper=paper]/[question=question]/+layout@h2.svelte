<script lang="ts">
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
		<Nav nav={data.nav?.toReversed() ?? []} />
	</nav>
	<nav class="mobile-sidebar">
		<details class="mobile-toc">
			<summary>
				<svg
					aria-hidden="true"
					class="caret"
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="currentColor"
					style="--sl-icon-size: 1.25rem;"
					><path
						d="m14.83 11.29-4.24-4.24a1 1 0 1 0-1.42 1.41L12.71 12l-3.54 3.54a1 1 0 0 0 0 1.41 1 1 0 0 0 .71.29 1 1 0 0 0 .71-.29l4.24-4.24a1.002 1.002 0 0 0 0-1.42Z"
					></path></svg
				>
				Yearly navigation
			</summary>
			<Nav nav={data.nav?.toReversed() ?? []} />
		</details>
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
	.sidebar,
	main {
		height: 100%;
		overflow: hidden;
	}
	.sidebar {
		overflow-y: auto;
	}
	.sidebar {
		display: none;
	}
	.mobile-sidebar {
		background-color: var(--surface, hsl(60, 5%, 96%));
		padding-inline: 1rem;
	}
	summary {
		font-weight: 600;
		font-size: 1rem;
		padding-block: 0.25rem;
		margin-block: 0.25rem;
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		line-height: 1.4;
	}
	svg {
		width: 1em;
		height: 1em;
		transition: transform 0.2s ease-in-out;
	}
	details[open] > summary > svg {
		transform: rotate(90deg);
	}
	details[open] {
		padding-block-end: 0.5rem;
	}
	@media (min-width: 40rem) {
		.main-container {
			grid-template-columns: 18rem 1fr;
		}
		.sidebar {
			display: block;
			padding-inline: 1rem;
			padding-block-start: 1rem;
			width: 100%;
			overflow-y: auto;
			background-color: var(--surface, hsl(60, 5%, 96%));
			border-inline-end: 1px solid var(--content, black);
		}
		.mobile-sidebar {
			display: none;
		}
	}
</style>
