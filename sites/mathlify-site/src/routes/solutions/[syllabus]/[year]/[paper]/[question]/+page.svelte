<script lang="ts">
	import Content from '$lib/components/Content/Content.svelte';
	import { afterNavigate, invalidate } from '$app/navigation';
	import NavAccordion from '$lib/components/Nav/NavAccordion.svelte';
	import Solution from '$lib/components/Content/Solution.svelte';

	const { data } = $props();

	let scrollable: HTMLElement | undefined = $state(undefined);
	let observer: IntersectionObserver;
	let observed: string[] = [];
	let sectionIds: string[] = [];
	let currentSection = $state('');

	const callback = (entries: IntersectionObserverEntry[]) => {
		for (const entry of entries) {
			if (entry.isIntersecting) {
				observed.push(entry.target.id);
			} else {
				observed = observed.filter((e) => e !== entry.target.id);
			}
		}
		observed = observed;
		currentSection = observed.toSorted()[0];
	};
	afterNavigate(() => {
		//@ts-expect-error scrollable state changed due to bind
		scrollable?.scrollIntoView();
		if (observer) observer.disconnect();
		observed = [];

		observer = new IntersectionObserver(callback, {
			rootMargin: '0px',
		});
		const sections = Array.from(document.querySelectorAll('[id^="soln-"]'));
		sectionIds = sections.map((section) => section.id);
		for (const section of sections) {
			observer.observe(section);
		}
		currentSection = sectionIds[0];
	});
</script>

<svelte:head>
	<title>{data.title}</title>
</svelte:head>

<Solution
	title={data.title}
	syllabus={data.syllabus}
	topics={data.topics}
	answer={data.answer}
	solution={data.solution}
>
	{#snippet desktopExtraNav()}
		<div>
			<hr />
			<div class="chapter-nav">Chapter navigation</div>
			<!--
        <NavAccordion sections={data.sections} section={data.section} subsection={data.subsection} />
    -->
		</div>
	{/snippet}
</Solution>

<style>
	.chapter-nav {
		font-weight: bold;
		font-size: 1.25rem;
		margin-block-start: 2rem;
	}
	:global(
			.learn.static-content .definition,
			.learn.static-content .technique,
			.learn.static-content .example,
			.learn.static-content .formula
		) {
		border: 2px double hsl(var(--primary));
		background-color: hsl(var(--primary-light));
		padding-inline: 0.5em;
		padding-top: 2.25em;
		position: relative;
		--tw-prose-bullets: hsl(var(--foreground));
	}
	:global(.learn.static-content .definition::before) {
		content: 'Definition';
		position: absolute;
		top: 0.75em;
		font-weight: bold;
		border-bottom: 3px solid hsl(var(--primary));
		width: calc(100% - 1em);
		font-family: serif;
	}
	:global(.learn.static-content .technique::before) {
		content: 'Technique';
		position: absolute;
		top: 0.75em;
		font-weight: bold;
		border-bottom: 3px solid hsl(var(--primary));
		width: calc(100% - 1em);
		font-family: serif;
	}
	:global(.learn.static-content .example::before) {
		content: 'Example';
		position: absolute;
		top: 0.75em;
		font-weight: bold;
		border-bottom: 3px solid hsl(var(--primary));
		width: calc(100% - 1em);
		font-family: serif;
	}
	:global(.learn.static-content .formula::before) {
		content: 'Formula';
		position: absolute;
		top: 0.75em;
		font-weight: bold;
		border-bottom: 3px solid hsl(var(--primary));
		width: calc(100% - 1em);
		font-family: serif;
	}
	:global(.learn.static-content .technique > h2:first-child) {
		margin-top: 1rem;
		margin-bottom: 0.5rem;
	}
	:global(.learn.static-content .citation p) {
		font-size: 0.6em;
	}
	:global(.learn.static-content img) {
		margin: auto;
	}
	:global(.learn.static-content .example hr) {
		margin-block: 1rem;
		border-color: hsl(var(--primary));
	}
</style>
