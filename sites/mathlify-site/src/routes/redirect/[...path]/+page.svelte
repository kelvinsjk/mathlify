<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	page;
	onMount(() => {
		goto($page.url.pathname.replace('/redirect', ''));
	});
</script>

<div>Signing in...</div>
