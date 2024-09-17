<script lang="ts">
	import NumberLine from '$lib/components/svg/NumberLine.svelte';
	import Practice from '$lib/components/learn/Practice.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { scale } from 'svelte/transition';
	import { page } from '$app/stores';
	import type { Snapshot } from './$types.js';

	const { data } = $props();

	import {
		generateState,
		generateQn
	} from '$content/h2-1_h2_learn/01_functions/01_concepts/01_intervals/02_practice.js';

	let qnState = $state(data.state);
	let { qn, ans, inequalityOrInterval } = $derived(generateQn(qnState));
	let showAnswer = $state(false);

	export const snapshot: Snapshot<typeof qnState> = {
		capture: () => qnState,
		restore: (value) => (qnState = value)
	};

	// for validation
	let pw = $state('');
	let code = $state(0);
	let disabled = $state(false);
</script>

<svelte:head>
	<title>Practice: Interval notation</title>
</svelte:head>

<Practice
	title="Interval notation"
	bind:showAnswer
	sequential={{
		prev: { name: 'Theory', slug: './theory' },
		next: { name: 'Functions, domain and range', slug: '../domain-and-range/theory' }
	}}
>
	{#snippet question()}
		{#key qnState}
			<div class="question-container" in:scale>
				{@html qn}
				{#if typeof inequalityOrInterval === 'string'}
					{@html inequalityOrInterval}
				{:else}
					<NumberLine intervals={inequalityOrInterval} />
				{/if}
			</div>
		{/key}
	{/snippet}
	{#snippet questionButton()}
		<Button
			onclick={() => {
				showAnswer = false;
				qnState = generateState();
			}}>Generate New</Button
		>
	{/snippet}
	{#snippet answer()}
		{@html ans}
		{#if $page.url.searchParams.get('supa') === 'base'}
			<input bind:value={pw} />
			<div>
				<Button
					{disabled}
					onclick={async () => {
						disabled = true;
						const res = await fetch('/db', {
							method: 'POST',
							body: JSON.stringify({
								state: qnState,
								validity: false,
								practice: 'h2/fns/01-concepts/01-interval',
								pw
							})
						});
						const json = await res.json();
						code = json.code;
						disabled = false;
					}}
				>
					Bad
				</Button>
				<Button
					{disabled}
					onclick={async () => {
						disabled = true;
						const res = await fetch('/db', {
							method: 'POST',
							body: JSON.stringify({
								state: qnState,
								validity: 'investigate',
								practice: 'h2/fns/01-concepts/01-interval',
								pw
							})
						});
						const json = await res.json();
						code = json.code;
						disabled = false;
					}}
				>
					Investigate
				</Button>
				<Button
					{disabled}
					onclick={async () => {
						disabled = true;
						const res = await fetch('/db', {
							method: 'POST',
							body: JSON.stringify({
								state: qnState,
								validity: true,
								practice: 'h2/fns/01-concepts/01-interval',
								pw
							})
						});
						const json = await res.json();
						code = json.code;
						disabled = false;
					}}
				>
					Good
				</Button>
			</div>
			<div>
				Response: {code}
			</div>
		{/if}
	{/snippet}
</Practice>

<style>
	input {
		border: 1px black solid;
	}
</style>
