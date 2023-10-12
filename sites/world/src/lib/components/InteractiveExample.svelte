<script lang="ts">
	import { scale } from 'svelte/transition';

	export let title = '';
	title = title ? `:${title}` : '';

	export let generator: (...args: any[]) => string;
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

	function newExample() {
		const generatedArgs = argsGenerator();
		const generatedArgsArray = Array.isArray(generatedArgs) ? generatedArgs : [generatedArgs];
		args = generatedArgsArray;
		content = generator(...args);
	}
</script>

<div class="collapse collapse-arrow border border-base-300 bg-base-200">
	<input type="checkbox" />
	<div class="collapse-title text-xl font-medium">Example{title}</div>
	<div class="collapse-content bg-base-100">
		{#key content}
			<div in:scale class="pt-4">
				{@html content}
			</div>
		{/key}
		<button class="btn btn-primary btn-sm mt-4" on:click={newExample}>
			Generate new example
		</button>
	</div>
</div>
