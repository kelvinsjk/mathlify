<script lang="ts">
	import Practice from '$lib/components/learn/Practice.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { scale } from 'svelte/transition';
	import { page } from '$app/stores';
	import { h2_learnSequential } from '$lib/components/nav';
	import { Djot } from 'svelte-djot-math';
	import { afterNavigate } from '$app/navigation';
	// get sequential nav
	const i = h2_learnSequential.findIndex(
		(x) => x.slug === '/h2_learn/functions/concepts/intervals/theory'
	);
	// TODO: j for functions end
	const sequentialNav = h2_learnSequential.slice(i).map((x) => {
		return { name: x.name, slug: x.slug.replace('h2_learn', 'h2/learn') };
	});
	const index = $derived(sequentialNav.findIndex((x) => x.slug === $page.url.pathname));
	const next = $derived(sequentialNav[index + 1]);

	// get module
	const modules = import.meta.glob('/src/content/h2-1_h2_learn/01_functions/**/[^_]*.ts');
	const { data } = $props();
	const module = $derived(modules[data.filePath]());
	async function getNewState(): Promise<Record<string, unknown>> {
		const mod = await module;
		if (
			typeof mod === 'object' &&
			mod !== null &&
			'generateState' in mod &&
			typeof mod.generateState === 'function'
		) {
			return mod.generateState();
		}
		return {};
	}
	async function getQn(
		state: Record<string, unknown>
	): Promise<{ qn: string; ans: string; soln?: string }> {
		const mod = await module;
		if (
			typeof mod === 'object' &&
			mod !== null &&
			'generateQn' in mod &&
			typeof mod.generateQn === 'function'
		) {
			return mod.generateQn(state);
		}
		return { qn: '', ans: '' };
	}
	let reactiveState: null | Record<string, unknown> = $state(null);
	let qnState = $derived(reactiveState ?? data.state);
	let qn = $derived(getQn(qnState ?? {}));
	let showAnswer = $state(false);

	afterNavigate(async () => {
		reactiveState = await getNewState();
		showAnswer = false;
	});

	// for validation
	let pw = $state('');
	let code = $state(0);
	let disabled = $state(false);
</script>

<svelte:head>
	<title>Practice: {data.title}</title>
</svelte:head>

<Practice
	title={data.title}
	bind:showAnswer
	sequential={{
		prev: { name: 'Theory', slug: './theory' },
		next
	}}
>
	{#snippet question()}
		{#key qnState}
			<div class="question-container" in:scale>
				{#await qn then q}
					<Djot djot={q.qn} />
				{/await}
			</div>
		{/key}
	{/snippet}
	{#snippet questionButton()}
		<Button
			onclick={async () => {
				showAnswer = false;
				reactiveState = await getNewState();
			}}>Generate New</Button
		>
	{/snippet}
	{#snippet answer()}
		{#await qn then q}
			<Djot djot={q.ans} />
			{#if q.soln}
				<h2>Solution</h2>
				<Djot djot={q.soln} />
			{/if}
		{/await}
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
