<script lang="ts">
	import './app.css';
	import { type Snippet } from 'svelte';
	import Header from '$lib/components/mathlified/Header.svelte';
	const name = 'Mathlify';

	import type { LayoutData } from './$types';
	import { ClerkProvider } from 'svelte-clerk';
	import { PUBLIC_CLERK_PUBLISHABLE_KEY } from '$env/static/public';

	import { SvelteToast } from '@zerodevx/svelte-toast';
	import { toast } from '@zerodevx/svelte-toast';
	import { navigating } from '$app/stores';

	let {
		children,
		data
	}: {
		children: Snippet;
		data: LayoutData;
	} = $props();

	const nav = $derived($navigating);
	$effect(()=>{
		if (nav){
			toast.push('Loading...', {initial: 0, dismissable: false});
		} else {
			toast.pop(0);
		}
	})
</script>

<ClerkProvider {...data} publishableKey={PUBLIC_CLERK_PUBLISHABLE_KEY}>
	<div class="layout-base" style="display:contents">
		<Header {name} />
		{@render children()}
	</div>
</ClerkProvider>
<SvelteToast />

<style>
	.layout-base {
		--primary: midnightblue;
		--primary-hsl: 240, 64%, 27%;
		--header-height: 3.875rem;
		--secondary-hsl: 50, 100%, 50%;
		--secondary: hsl(var(--secondary-hsl));
	}
</style>
