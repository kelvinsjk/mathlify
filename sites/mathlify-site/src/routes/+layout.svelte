<script lang="ts">
	import './app.css';
	import type { Session, SupabaseClient } from '@supabase/supabase-js';
	import { onMount, type Snippet } from 'svelte';
	import Header from '$lib/components/mathlified/Header.svelte';
	import { invalidate } from '$app/navigation';
	const name = 'Mathlify';

	let {
		children,
		data
	}: {
		children: Snippet;
		data: {
			session: Session | null;
			supabase: SupabaseClient;
		};
	} = $props();
	const session = $state(data.session);
	const supabase = $state(data.supabase);
	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => data.subscription.unsubscribe();
	});
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
