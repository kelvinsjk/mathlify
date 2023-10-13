<script lang="ts">
	import { page } from '$app/stores';
	import { slugs } from './slugs';
	const slugsArray = slugs.map((slug) => `/amath/surds/${slug.slug}`);

	$: currentIndex = slugsArray.indexOf($page.url.pathname);
	$: prevSlug = slugsArray[currentIndex - 1];
	$: nextSlug = slugsArray[currentIndex + 1];
</script>

<div class="prose max-w-none">
	<slot />
</div>

<div class="flex justify-between">
	<div>
		<a class="btn normal-case" href={prevSlug} class:btn-disabled={prevSlug === undefined}>
			<svg
				class="h-6 w-6 fill-current md:h-8 md:w-8"
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				><path d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z" /></svg
			>
			<div class="flex flex-col items-start">
				<span class="text-base-content/50 hidden text-xs font-normal md:block">Prev</span>
				<span>{prevSlug === undefined ? '' : slugs[currentIndex - 1].subsection}</span>
			</div>
		</a>
	</div>
	<div>
		<a class="btn normal-case" href={nextSlug} class:btn-disabled={nextSlug === undefined}>
			<div class="flex flex-col items-end">
				<span class="text-base-content/50 hidden text-xs font-normal md:block">Next</span>
				<span>{nextSlug === undefined ? '' : slugs[currentIndex + 1].subsection}</span>
			</div>
			<svg
				class="h-6 w-6 fill-current md:h-8 md:w-8"
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				><path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" /></svg
			>
		</a>
	</div>
</div>
