<script lang="ts">
	/**
	 * Mathlified Custom Page version 0.0.1
	 * generated on 9/4/2024, 9:34:40 PM
	 */
	import { invalidate } from '$app/navigation';
	import { page } from '$app/stores';
	import Question from '$lib/components/Question.svelte';
	import SignedIn from 'clerk-sveltekit/client/SignedIn.svelte';
	import SignedOut from 'clerk-sveltekit/client/SignedOut.svelte';
	import SignInButton from 'clerk-sveltekit/client/SignInButton.svelte';
	import SignUpButton from 'clerk-sveltekit/client/SignUpButton.svelte';

	const { data } = $props();
	$effect(() => {
		if (import.meta.hot) {
			import.meta.hot.on('md-update', () => {
				invalidate('md');
			});
		}
	});

	// get copy of module (contentFile.ts);
	//const modules = import.meta.glob('/src/content/h2-2_h2_solutions/**/[^_]*.ts');
	//const module = $derived(modules[data.filePath]());
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
			<SignInButton mode="modal" afterSignInUrl={`/redirect${$page.url.pathname}`} />
			<SignUpButton mode="modal" afterSignUpUrl={$page.url.pathname} />
		</div>
	</SignedOut>
</main>

<style>
	main {
		display: grid;
		padding: 1rem;
	}
</style>
