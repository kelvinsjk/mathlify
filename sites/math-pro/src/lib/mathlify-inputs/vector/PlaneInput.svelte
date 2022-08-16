
<script lang="ts">
	import FractionInput from '../fraction/FractionInput.svelte';
	import {type Fraction, Vector, Plane} from 'mathlify';
	import { math } from 'mathlifier';

	export let disabled: boolean = false;
	export let value: Plane = undefined;
	export let invalid: boolean = value===undefined;
	export let name: string = undefined;
	export let correct: boolean = undefined;

	const invalidArray: [boolean, boolean, boolean, boolean,   ] = [undefined, undefined, undefined, undefined];
	const valueArray: [Fraction, Fraction, Fraction, Fraction, ] = [undefined, undefined, undefined, undefined];

	$: n = (valueArray[0]!==undefined && valueArray[1]!==undefined && valueArray[2]!==undefined)
		? new Vector(valueArray[0], valueArray[1], valueArray[2])
		: undefined;
	$: rhs = valueArray[3]
	$: value = 
		(n !== undefined && rhs !== undefined && !(n.isZero())) 
		? new Plane(new Vector(valueArray[0],valueArray[1],valueArray[2]), {rhs: valueArray[3]})
		: undefined;
	$: invalid = n === undefined || rhs === undefined || n.isZero();
</script>

<div class="flex items-center flex-wrap gap-y-4 m-2">
	<div>
		{#if name}
			<span class="mr-2">{@html name}</span>
		{/if}
	</div>
	<div class="flex items-center">
		<div>
			{@html math(`\\mathbf{r}\\cdot`)}
		</div>
		<div>{@html math('\\Biggl(')}</div>
		<div>
			<FractionInput on:enter {disabled} bind:invalid={invalidArray[0]} {correct} bind:value={valueArray[0]} />
			<FractionInput on:enter {disabled} bind:invalid={invalidArray[1]} {correct} bind:value={valueArray[1]} />
			<FractionInput on:enter {disabled} bind:invalid={invalidArray[2]} {correct} bind:value={valueArray[2]} />
		</div>
		<div>{@html math('\\Biggr)')}</div>
	</div>
	<div class="flex items-center">
		<div>
			{@html math(`=`)}
		</div>
		<div>
			<FractionInput on:enter {disabled} bind:invalid={invalidArray[3]} {correct} bind:value={valueArray[3]} />
		</div>
	</div>
</div>