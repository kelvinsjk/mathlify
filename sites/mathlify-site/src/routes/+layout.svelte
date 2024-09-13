<script lang="ts">
	import './app.css';
	import { type Snippet } from 'svelte';
	import Header from '$lib/components/mathlified/Header.svelte';
	const name = 'Mathlify';

	let {
		children
	}: {
		children: Snippet;
	} = $props();
</script>

<div class="layout-base" style="display:contents">
	<Header {name} />
	{@render children()}
</div>

<style>
	.layout-base {
		--primary: midnightblue;
		--primary-hsl: 240, 64%, 27%;
		--header-height: 3.875rem;
		--secondary-hsl: 50, 100%, 50%;
		--secondary: hsl(var(--secondary-hsl));
	}
</style>
