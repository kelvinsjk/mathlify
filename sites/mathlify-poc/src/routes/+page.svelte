<script lang="ts">
	/**
	 * Returns absolute paths to pages included in the modules
	 *
	 * @param url - import.meta.url
	 * @param modules - import.meta.glob();
	 * @returns Paths to pages excluding routes with dynamic parameters
	 */
	export const getPages = (url: string, modules: Record<string, unknown>): string[] => {
		/*
		 * Possible url values
		 * Server: file:///____/src/routes/index.svelte
		 * Client(dev): http://127.0.0.1:____/src/routes/index.svelte?t=1658306082278
		 * Client(preview): http://127.0.0.1:____/_app/immutable/pages/index.svelte-e7ea94ef.js
		 */
		const directory = url
			.replace(/(.*?)\/src\/routes\//, '/')
			.replace(/(.*?)\/immutable\/pages\//, '/')
			.replace(/(.*?)\/var\/task\//, '/') // Vercel
			.replace(/\/([^/])*.svelte.*/, '/');

		const pageRegex = /\/\+page\.svelte$/;
		const paths = Object.keys(modules)
			// Convert relative path to absolute path
			.map((path) => path.replace(/^(.\/)/, directory))
			// Filter paths with dynamic parameters (e.g. /blog/[slug].svelte)
			.filter((path) => !/\[.*\]/.test(path))
			// Filter paths that end with `/+page.svelte`
			.filter((path) => pageRegex.test(path))
			// Remove the trailing `/+page.svelte` string
			.map((path) => path.replace(pageRegex, ''))
			// Set empty path string to '/' ('./index.svelte' is converted to '')
			.map((path) => path || '/')
			.sort();

		return paths;
	};

	const { url } = import.meta;
	const modules = import.meta.glob('./**/*.svelte'); // Include subfolder
	// const modules = import.meta.glob('./**.svelte'); // Current folder only

	const pages = getPages(url, modules);
	import { page } from '$app/stores';
	const base = $page.url.origin;
</script>

<div class="mt-4 prose mx-2">
	<h1>Links</h1>
	{#each pages as page}
		{@const i = page.lastIndexOf('/')}
		{@const name =
			page
				.slice(i + 1)
				.charAt(0)
				.toUpperCase() + page.slice(i + 2)}
		<div>
			<a class="link" href={`${base}${page}`}>{name}</a>
		</div>
	{/each}
</div>
