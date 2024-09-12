<script lang="ts">
	import { type Snippet } from 'svelte';

	let {
		children
	}: {
		children: Snippet;
	} = $props();
</script>

<main>
	{@render children()}
</main>

<style>
	main {
		margin: 1rem;
	}
	@media (min-width: 40rem) {
		main {
			margin-inline: 1.5rem;
		}
	}
</style>
