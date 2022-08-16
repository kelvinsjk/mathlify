<script lang="ts">
  import type { Answer } from '$lib/interfaces';
  import type {Fraction, SquareRoot, Vector, Complex, Polynomial} from 'mathlify';
	import { 
    IntegerInput, 
    DecimalInput, 
    FractionInput, 
    SquareRootInput, 
    MCQ,
    MultiSelect, 
    VectorInput, 
    CoordinatesInput, 
    LineInput, 
    PlaneInput,
    ComplexInput,
    ExpressionInput,
  } from '$lib/mathlify-inputs/';

  export let disabled: boolean;
  export let answers: Answer[];
  export let attempts: (Fraction | SquareRoot | Vector | Complex | number | Polynomial | number[])[] = Array.from({length: answers.length}, () => undefined);
	export let ready: boolean = false;
  export let correct: boolean = undefined;

  let invalidArray: boolean[] = Array.from({length: answers.length}, () => true);

  const inputs = {
    'integer': IntegerInput,
    'decimal': DecimalInput,
    'fraction': FractionInput,
    'vector': VectorInput,
    'line': LineInput,
    'coordinates': CoordinatesInput,
    'sqrt': SquareRootInput,
    'multi': MultiSelect,
    'mcq': MCQ,
    'plane': PlaneInput,
    'complex': ComplexInput,
    'polynomial': ExpressionInput,
  }

  $: ready = invalidArray.every((e)=>!e);
  $: if (attempts === undefined){
    attempts = Array.from({length: answers.length}, () => undefined);
  }
</script>

<div>
	<h2 class="dark:text-zinc-300">Attempt</h2>
  <div class="grid gap-2">
    {#each answers as answer,i}
    {@const options = answer.options ? {options: answer.options} : {}}
    {@const units = answer.units ? {units: answer.units} : {}}
    <div>
      <svelte:component
        this={inputs[answer.type]}
        {disabled}
        {correct}
        bind:invalid={invalidArray[i]}
        bind:value={attempts[i]}
        name={answer.name}
        {...options}
        {...units}
        on:enter 
      />
    </div>
    {/each}
  </div>
</div>