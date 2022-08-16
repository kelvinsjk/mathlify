
<script lang="ts">
	import FractionInput from '../fraction/FractionInput.svelte';
	import {type Fraction, Vector, Line} from 'mathlify';
	import { math } from 'mathlifier';

	export let disabled: boolean = false;
	export let value: Line = undefined;
	export let invalid: boolean = value===undefined;
	export let name: string = undefined;
	export let correct: boolean = undefined;
	export let lambda:string = '\\lambda';

	const invalidArray: [boolean, boolean, boolean, boolean, boolean, boolean] = [undefined, undefined, undefined, undefined, undefined, undefined];
	const valueArray: [Fraction, Fraction, Fraction, Fraction, Fraction, Fraction] = [undefined, undefined, undefined, undefined, undefined, undefined];

	$: a = (valueArray[0]!==undefined && valueArray[1]!==undefined && valueArray[2]!==undefined)
		? new Vector(valueArray[0], valueArray[1], valueArray[2])
		: undefined;
	$: d = (valueArray[3]!==undefined && valueArray[4]!==undefined && valueArray[5]!==undefined)
		? new Vector(valueArray[3], valueArray[4], valueArray[5])
		: undefined;
	$: value = 
		(a !== undefined && d !== undefined && !d.isZero()) 
		? new Line(new Vector(valueArray[0],valueArray[1],valueArray[2]), new Vector(valueArray[3],valueArray[4],valueArray[5]))
		: undefined;
	$: invalid = a === undefined || d === undefined || d.isZero();
</script>

<div class="grid mx-2 gap-2">
	<div>
		{#if name}
			<span>{@html name}</span>
		{/if}
		{@html math(`\\mathbf{r}=\\mathbf{a}+${lambda}\\mathbf{d}, \\; \\lambda \\in \\mathbb{R}.`)}
	</div>
	<div class="flex items-center flex-wrap gap-y-4">
		<div class="flex items-center">
			<div>
				{@html math(`\\mathbf{a}=`)}
			</div>
			<div>{@html math('\\Biggl(')}</div>
			<div>
				<FractionInput on:enter {disabled} bind:invalid={invalidArray[0]} {correct} bind:value={valueArray[0]} />
				<FractionInput on:enter {disabled} bind:invalid={invalidArray[1]} {correct} bind:value={valueArray[1]} />
				<FractionInput on:enter {disabled} bind:invalid={invalidArray[2]} {correct} bind:value={valueArray[2]} />
			</div>
			<div>{@html math('\\Biggr), \\quad')}</div>
		</div>
		<div class="flex items-center">
			<div>
				{@html math(`\\mathbf{d}=`)}
			</div>
			<div>{@html math('\\Biggl(')}</div>
			<div>
				<FractionInput on:enter {disabled} bind:invalid={invalidArray[3]} {correct} bind:value={valueArray[3]} />
				<FractionInput on:enter {disabled} bind:invalid={invalidArray[4]} {correct} bind:value={valueArray[4]} />
				<FractionInput on:enter {disabled} bind:invalid={invalidArray[5]} {correct} bind:value={valueArray[5]} />
			</div>
			<div>{@html math('\\Biggr)')}</div>
		</div>
	</div>
</div>