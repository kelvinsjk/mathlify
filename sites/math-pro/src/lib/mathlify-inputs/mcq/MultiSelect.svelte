<script lang="ts">
	export let value: number[] = [];
	export let invalid = value.length === 0;
	export let name: string = undefined;
	export let correct: boolean = undefined;
	export let disabled = false;
  export let options: string[] = [];

	$: if (value===undefined){
		value = [];
	}
	$: invalid = value.length === 0;
</script>

<div class="grid gap-2">
	{#if name}
		{name}
	{:else}
		Select all options that apply:
	{/if}
  {#each options as option,i}
  <button 
		class="btn mx-2"
		class:btn-accent={value?.includes(i)}
		class:btn-success={correct && value?.includes(i)}
		class:btn-error={correct===false && value?.includes(i)}
		disabled={disabled && !(correct!==undefined && value?.includes(i))}
		on:click={()=>{
			console.log(value);
			if (value?.includes(i)){
				value = value.filter((e)=>e!==i);
			} else {
				value.push(i);
				value  = value;
			}
			console.log(value);
			console.log(value?.includes(i));
		}}
	>
		{@html option}
	</button>
  {/each}
</div>

<style>
	.btn {
		text-transform: none;
	}
	:global(.btn>span.katex){
		padding-inline: 0.5ch;
	}
</style>


