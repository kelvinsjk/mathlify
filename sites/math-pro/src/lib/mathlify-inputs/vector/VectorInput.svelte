
<script lang="ts">
	import FractionInput from '../fraction/FractionInput.svelte';
	import {type Fraction, Vector} from 'mathlify';
import { math } from 'mathlifier';

	export let disabled: boolean = false;
	export let value: Vector = undefined;
	export let invalid: boolean = value===undefined;
	export let name: string = undefined;
	export let correct: boolean = undefined;

	const invalidArray: [boolean, boolean, boolean] = [undefined, undefined, undefined];
	const valueArray: [Fraction, Fraction, Fraction] = [undefined, undefined, undefined];

	$: invalid = invalidArray.some((e)=>e);
	$: value = 
		(valueArray[0]!==undefined && valueArray[1]!==undefined && valueArray[2]!==undefined) 
			? new Vector(valueArray[0],valueArray[1],valueArray[2]) 
			: undefined;
</script>

<div class="flex items-center gap-2 mx-2">
	{#if name}
		<span>{@html name}</span>
	{/if}
	<div class="flex items-center">
		<div>{@html math('\\Biggl(')}</div>
		<div>
			<FractionInput on:enter {disabled} bind:invalid={invalidArray[0]} {correct} bind:value={valueArray[0]} />
			<FractionInput on:enter {disabled} bind:invalid={invalidArray[1]} {correct} bind:value={valueArray[1]} />
			<FractionInput on:enter {disabled} bind:invalid={invalidArray[2]} {correct} bind:value={valueArray[2]} />
		</div>
		<div>{@html math('\\Biggr)')}</div>
	</div>
</div>