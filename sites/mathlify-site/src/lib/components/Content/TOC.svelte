<script lang="ts">
	import type { Heading } from './Content.svelte';
	//export let toc: Heading[];
	//export let currentSection: string;

	let {
		toc,
		currentSection,
	}: {
		toc: Heading[];
		currentSection: string;
	} = $props();
</script>

<ul class="toc">
	{#each toc as heading}
		{@const id = heading.text.replaceAll(' ', '-').replaceAll(',', '')}
		<li class:active={currentSection === id}><a href={`#${id}`}>{heading.text}</a></li>
		{#if heading.children}
			<svelte:self toc={heading.children} {currentSection} />
		{/if}
	{/each}
</ul>

<style>
	.active {
		color: var(--active);
	}
	:global(.toc li) {
		margin: 0;
		padding: 0;
	}
	:global(.toc li a) {
		font-weight: 400;
		display: block;
		white-space: nowrap;
		overflow-x: hidden;
		text-overflow: ellipsis;
	}
	:global(.toc ul) {
		margin-block: 0;
		padding-block: 0;
		margin-inline-start: 1rem;
	}
	:global(.toc li::marker) {
		content: '';
	}
</style>
