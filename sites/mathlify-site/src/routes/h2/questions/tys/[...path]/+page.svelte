<script lang="ts">
	import { page } from '$app/stores';
	import Question from '$lib/components/Question.svelte';
	import { SignInButton, SignUpButton } from 'svelte-clerk/components';

	const { data } = $props();
	const role = $state(data.data.role);
</script>

<svelte:head>
	<title>{data.data.year} Paper {data.data.paper} Question {data.data.questionNo}</title>
</svelte:head>

{#if role === 'admin' || role === 'super' || role === 'premium'}
	<Question data={data.data} nav={data.nav} />
{:else if role === 'member'}
	<main>
		<div>This question is only available for premium members.</div>
		<div>
			Please consider purchasing the premium membership, or use the free resources (the black and
			blue items in the navigation menu).
		</div>
		<!--TODO: redirect to purchase page-->
	</main>
{:else}
	<main>
		<div>This question is only available for premium members.</div>
		<div>Please sign in or sign up and purchase the premium membership.</div>
		<div>
			<SignInButton mode="modal" forceRedirectUrl={$page.url.pathname} />
			<!--TODO: redirect to purchase page-->
			<SignUpButton mode="modal" forceRedirectUrl={$page.url.pathname} />
		</div>
	</main>
{/if}

<style>
	main {
		display: grid;
		padding: 1rem;
	}
</style>
