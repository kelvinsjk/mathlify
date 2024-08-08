<script lang="ts">
	import Content from '$lib/components/Content/Content.svelte';
	import { afterNavigate, invalidate } from '$app/navigation';
	import NavAccordion from '$lib/components/Nav/NavAccordion.svelte';
	import Solution from '$lib/components/Content/Solution.svelte';
	import Question from '$lib/components/Content/Question.svelte';
	import { page } from '$app/stores';

	const { data } = $props();
	const { title, djot } = data;
	const qn = JSON.parse(djot);

	let scrollable: HTMLElement | undefined = $state(undefined);
	let observer: IntersectionObserver;
	let observed: string[] = [];
	let sectionIds: string[] = [];
	let currentSection = $state('');
	const href = `/solutions/${$page.url.pathname.slice(11)}`;

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
	<title>{title}</title>
</svelte:head>

<div class="prose">
	<a {href}> Link to solution </a>
</div>
<Question {title} {qn} dj={true} />
