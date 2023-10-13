<script lang="ts">
	import { scale } from 'svelte/transition';

	export let title = '';
	title = title ? `:${title}` : '';
	export let preamble = ``;

	/*eslint @typescript-eslint/no-explicit-any: ["error", { "ignoreRestArgs": true }]*/
	export let generator: (...args: any[]) => [string, string];
	export let argsGenerator: () => unknown[] | unknown;
	export let initialArgs: unknown | unknown[] = undefined;

	let args: unknown[];
	if (initialArgs !== undefined) {
		// use initial if provided
		args = Array.isArray(initialArgs) ? initialArgs : [initialArgs];
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

	let ansIsDisplayed = false;
</script>

<div class="card bg-base-100 shadow-xl my-4">
	<div class="card-body p-0 pb-4">
		<div class="bg-primary rounded-t-[1rem]">
			<h2 class="card-title m-4">Practice</h2>
		</div>
		<div class="p-4">
			{#if preamble}
				<p class="mt-0">
					{@html preamble}
				</p>
			{/if}
			{#key content}
				<div class="swap swap-flip" class:swap-active={!ansIsDisplayed}>
					<div class="swap-on">
						<div in:scale>
							{#if !ansIsDisplayed}
								<div>
									{@html content[0]}
								</div>
							{/if}
						</div>
					</div>
					<div class="swap-off">
						<div in:scale>
							{#if ansIsDisplayed}
								<div>
									{@html content[1]}
								</div>
							{/if}
						</div>
					</div>
				</div>
			{/key}
		</div>
		<div class="card-action flex justify-between items-center px-4">
			<button on:click={newQn} class="btn btn-primary btn-sm">Generate new question</button>
			<label class="label cursor-pointer gap-2">
				<span class="label-text">Qn</span>
				<input type="checkbox" class="toggle toggle-secondary" bind:checked={ansIsDisplayed} />
				<span class="label-text">Ans</span>
			</label>
		</div>
	</div>
</div>
