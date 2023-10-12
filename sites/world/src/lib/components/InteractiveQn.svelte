<script lang="ts">
	import { scale } from 'svelte/transition';

	export let title = '';
	title = title ? `:${title}` : '';
	export let preamble = ``;

	export let generator: (...args: any[]) => [string, string];
	export let argsGenerator: () => unknown[] | unknown;
	export let initialArg: unknown = undefined;

	let args: unknown[];
	if (initialArg !== undefined) {
		// use initial if provided
		args = Array.isArray(initialArg) ? initialArg : [initialArg];
	} else {
		// otherwise use argsGenerator
		const generatedArgs = argsGenerator();
		args = Array.isArray(generatedArgs) ? generatedArgs : [generatedArgs];
	}
	let content = generator(...args);

	function newQn() {
		const generatedArgs = argsGenerator();
		const generatedArgsArray = Array.isArray(generatedArgs) ? generatedArgs : [generatedArgs];
		args = generatedArgsArray;
		content = generator(...args);
	}

	let qnIsDisplayed = true;
</script>

<div class="card bg-base-100 shadow-xl my-4">
	<div class="card-body p-0 pb-4">
		<div class="bg-primary">
			<h2 class="card-title m-4">Practice</h2>
		</div>
		<div class="p-4">
			{#if preamble}
				<p class="mt-0">
					{@html preamble}
				</p>
			{/if}
			{#key content}
				<div class="swap swap-flip" class:swap-active={qnIsDisplayed}>
					<div class="swap-on">
						<div in:scale>
							{@html content[0]}
						</div>
					</div>
					<div class="swap-off">
						<div in:scale>
							{@html content[1]}
						</div>
					</div>
				</div>
			{/key}
		</div>
		<div class="card-action flex justify-between px-4">
			<button on:click={newQn} class="btn btn-primary btn-sm">Generate new question</button>
			<button
				on:click={() => {
					qnIsDisplayed = !qnIsDisplayed;
				}}
				class="btn btn-secondary btn-sm"
			>
				{qnIsDisplayed ? 'Answer' : 'Question'}
			</button>
		</div>
	</div>
</div>
