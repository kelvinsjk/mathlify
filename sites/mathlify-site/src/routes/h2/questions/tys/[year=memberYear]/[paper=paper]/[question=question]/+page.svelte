<script lang="ts">
	import { page } from '$app/stores';
	import Question from '$lib/components/Question.svelte';
	import { SignInButton, SignUpButton, SignedIn, SignedOut } from 'svelte-clerk/components';

	const { data } = $props();
</script>

<svelte:head>
	<title>{data.data.year} Paper {data.data.paper} Question {data.data.questionNo}</title>
</svelte:head>

<SignedIn>
	<Question data={data.data} />
</SignedIn>
<main>
	<SignedOut>
		<div>This question is only available for members.</div>
		<div>Please sign in or sign up (it's free!)</div>
		<div>
			<SignInButton mode="modal" forceRedirectUrl={$page.url.pathname} />
			<SignUpButton mode="modal" fallbackRedirectUrl={$page.url.pathname} />
		</div>
	</SignedOut>
</main>

<style>
	main {
		display: grid;
		padding: 1rem;
	}
</style>
