<script context="module" lang="ts">
	export const prerender = true;

	import { keyboardOptions, fractionLayer } from './keyboardLayout';
	import { isValid } from './parser';
	import type { Complex } from 'mathlify';

	let mathlive;
	let kbOptions = keyboardOptions;
</script>

<script lang="ts">
	import { onMount, tick, createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	import { fade } from 'svelte/transition';

	export let value: Complex = undefined;
	export let invalid = value === undefined;
	export let name: string = undefined;
	export let correct: boolean = undefined;
	export let disabled = false;
	export let loading = true;
	
	let mathliveElement;
	let mathliveContainer: HTMLElement;

	onMount(async () => {
		// import mathlive
		if (mathlive === undefined) {
			mathlive = await import('mathlive');
		}
		// create mathlive element
		mathliveElement = new mathlive.MathfieldElement();
		// remove loading spinner and load container into DOM
		loading = false;
		await tick();
		// append mathlife element into DOM
		if (mathliveContainer) {
			mathliveContainer.appendChild(mathliveElement);
		}
		mathliveElement.setOptions({
			...kbOptions,
			onContentDidChange: updateValue,
			onFocus: focusScroll,
			customVirtualKeyboardLayers: fractionLayer
		});
		mathliveElement.addEventListener('keydown', (e) => {
			if (e.key === 'Enter') {
				dispatch('enter');
			}
		});
		mathliveElement.value = value === undefined ? '\\bigstar' : value.toString();
	});

	function focusScroll(mathfield) {
		if (mathliveContainer) {
			mathliveContainer.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
			if (mathfield.getValue() === '\\bigstar') {
				mathfield.setValue('');
			}
		}
	}
	function updateValue(mathfield) {
		const mathfieldValue = mathfield.getValue();
		const [valid, values] = isValid(mathfieldValue);
		if (valid) {
			({ complex: value, } = values);
			invalid = false;
			if (mathliveContainer) {
				mathliveContainer.classList.remove('invalid');
				mathliveContainer.classList.remove('correct');
				mathliveContainer.classList.remove('wrong');
			}
		} else {
			invalid = true;
			if (mathliveContainer) {
				mathliveContainer.classList.add('invalid');
				mathliveContainer.classList.remove('correct');
				mathliveContainer.classList.remove('wrong');
			}
		}
	}

	$: if (value === undefined && mathliveElement) {
		mathliveElement.setValue('\\bigstar');
	}

	$: if (disabled) {
		if (mathliveElement) {
			mathliveElement.disabled = true;
			mathliveElement.virtualKeyboardMode = 'off';
			mathliveElement.setOptions({
				onFocus: () => {}
			});
		}
	} else {
		if (mathliveElement) {
			mathliveElement.disabled = false;
			mathliveElement.virtualKeyboardMode = 'onfocus';
			mathliveElement.setOptions({
				onFocus: focusScroll
			});
		}
	}
</script>

<div>
	<div class="flex items-center gap-2 mx-2">
		{#if name}
			<span>{@html name}</span>
		{/if}
		{#if loading}
		<div class="w-14 h-14 btn btn-square btn-warning loading" in:fade/>
		{:else}
		<div
				class="mathfield-input transition duration-500 cursor-text"
				class:invalid
				class:correct={correct !== undefined && correct}
				class:wrong={correct !== undefined && !correct}
				class:disabled
				bind:this={mathliveContainer}
				in:fade
				on:click={async (event)=>{
					mathliveElement._mathfield?.focus();
				}}
			/>
		{/if}
	</div>
</div>

<style>
	.mathfield-input {
		min-width: 3.5em;
		max-width: 10.5em;
		height: 3.5em;
		padding: 0.5em;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 700;
		color: black;
		border: 3px solid hsl(134, 40%, 50%); /**hsl(134, 40%, 85%);*/
		background: hsl(132, 28%, 95%); /**hsl(132, 28%, 95%);**/
		border-radius: 0.5em;
	}
	.disabled {
		border: none !important;
		background: #cccccc !important;
	}
	.invalid.mathfield-input {
		border: 3px solid hsl(0, 74%, 42%);
		background: hsla(0,74%,90%);
	}
	.wrong.mathfield-input {
		border: 3px solid hsl(0, 100%, 50%) !important;
		background: hsl(0, 75%, 75%) !important;
		color: black !important;
	}
	.correct.mathfield-input {
		border: 3px solid hsl(120, 100%, 20%) !important;
		background: hsl(120, 25%, 75%) !important;
		color: black !important;
	}
</style>
