<script context="module" lang="ts">
	export interface Heading {
		level: number;
		text: string;
		children?: Heading[];
	}
</script>

<script lang="ts">
	import { slide } from 'svelte/transition';

	import TOC from './TOC.svelte';
	import { SquareMenuIcon } from 'lucide-svelte';
	import BottomNav from '../Nav/BottomNav.svelte';

	let {
		toc,
		title,
		currentSection = '',
		prev,
		next,
		content,
		endnotes,
		desktopExtraNav,
	}: {
		toc?: Heading[];
		title: string;
		currentSection?: string;
		prev: { shortTitle: string; slug: string; sectionSlug: string } | 'theory' | undefined;
		next: { shortTitle: string; slug: string; sectionSlug: string } | 'practice' | undefined;
		endnotes?: Snippet;
		content: Snippet;
		desktopExtraNav: Snippet;
	} = $props();

	let width = $state(700);
	let mobile = $derived(width < 800);
	let showTOC = $state(false);

	$effect.pre(() => {
		if (!mobile) showTOC = true;
	});

	import { clickOutside } from '$lib/utils/clickOutside';
	import type { Snippet } from 'svelte';
</script>

<svelte:window bind:innerWidth={width} />
<div class="content-container">
	<div class="content-header-container">
		<nav class="content-header">
			<div class="toc-heading">
				<button
					class="toc-heading-small"
					onclick={() => (showTOC = !showTOC)}
					use:clickOutside={() => {
						if (mobile) showTOC = false;
					}}
				>
					<SquareMenuIcon />
					<h1>{title}</h1>
				</button>
				<a href={'#' + title.replaceAll(' ', '-').replaceAll(',', '')} class="toc-heading-large">
					{title}
				</a>
			</div>
			{#if showTOC}
				<div class="toc-container" transition:slide={{ duration: mobile ? 400 : 0 }}>
					{#if toc}
						<TOC {toc} {currentSection} />
						<hr class="toc-divider" />
					{/if}
					<BottomNav {prev} {next} />
				</div>
			{/if}
			{#if !mobile}
				{@render desktopExtraNav()}
			{/if}
		</nav>
	</div>
	<div class="content-body-container">
		<div class="content-body content prose">
			{@render content()}
			<BottomNav {prev} {next} />
			{#if endnotes}
				<div class="endnotes-container">
					{@render endnotes()}
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	h1 {
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow-x: hidden;
	}
	a {
		text-overflow: ellipsis;
		overflow-x: hidden;
	}
	.content-container {
		display: grid;
		--container-width: min(100vw, var(--max-width));
		width: var(--container-width);
		margin: auto;
		height: 100%;
	}
	.content-header-container {
		background-color: hsl(var(--accent));
		padding-inline: 1rem;
		padding-block: 0.5rem;
		width: var(--container-width);
	}
	.toc-divider {
		display: none;
	}
	.toc-heading {
		margin-block-end: 0.5rem;
		font-weight: 700;
	}
	.toc-heading-small {
		width: calc(100% - 1rem);
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding-top: 0.5rem;
	}
	.toc-heading-large {
		display: none;
	}
	.toc-container {
		line-height: 2;
	}
	.content-body-container {
		padding-block-start: 0.5em;
		padding-block-end: 1em;
		overflow-y: auto;
		scroll-behavior: smooth;
	}
	.content-body {
		width: var(--container-width);
		font-size: 1.25rem;
		padding-inline: 1rem;
	}
	.endnotes-container {
		font-size: 0.6em;
	}
	/** TODO: sync with app.css var(--max-width) */
	@media (min-width: 800px) {
		.content-container {
			width: 100vw;
			grid-auto-rows: 100%;
			grid-template-columns: 1fr clamp(
					250px,
					calc(250px + (100vw - var(--container-width)) / 2),
					400px
				);
		}
		.content-header-container {
			margin-block-end: 0;
			width: 100%;
			overflow-y: auto;
		}
		.toc-divider {
			display: block;
		}
		.content-header * {
			padding-block: 0;
			font-size: 1rem;
		}
		.toc-container {
			line-height: 1.2;
		}
		.toc-heading-small {
			display: none;
		}
		.toc-heading-large {
			display: block;
			margin-block-start: 0.5rem;
			font-size: 1.25rem;
			white-space: nowrap;
		}
		.content-body-container {
			order: -1;
			padding-block-start: 1rem;
		}
		.content-body {
			margin-inline: auto;
			width: 100%;
		}
		:global(.content-header li) {
			margin-block: 1rem;
		}
	}
	.prose {
		max-width: var(--max-width);
	}
</style>
